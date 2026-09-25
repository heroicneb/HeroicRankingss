#!/usr/bin/env node
/**
 * Imports blog posts that are live on heroicrankings.com but missing from the
 * Sanity project this site runs on.
 *
 * Source of truth: the live sitemap (https://heroicrankings.com/sitemap.xml).
 * Every /seo/<urlCategory>/<slug>/ URL whose slug has no published `post` in
 * Sanity is fetched and converted:
 *
 *   - title            <h1>
 *   - slug/urlCategory from the URL
 *   - publishedAt      JSON-LD datePublished
 *   - author           JSON-LD author name → teamMember (matched by name)
 *   - categories       "by <author> in <Category>" label on the page
 *   - excerpt / seo    <meta name="description">, <title>
 *   - mainImage        og:image, uploaded to Sanity
 *   - body             bcms primitives (paragraph, heading, bullet/ordered list)
 *                      plus body images (uploaded), tables and iframes, in order
 *
 * Usage (from the repo root):
 *   node --env-file=.env.local scripts/migrate/2026-09-26-import-live-posts.mjs            # dry run
 *   node --env-file=.env.local scripts/migrate/2026-09-26-import-live-posts.mjs --apply    # write
 *   ... --slug=youtube-seo                                                                  # one post
 *
 * Safety: dry-run by default; createIfNotExists (never overwrites); a post is
 * skipped when fewer than half of the legacy words were captured. Uploaded
 * assets are remembered in a snapshot so re-runs do not re-upload.
 */
import { createClient } from "next-sanity";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const APPLY = process.argv.includes("--apply");
const ONLY = process.argv.find((a) => a.startsWith("--slug="))?.slice(7) ?? null;
const SITEMAP_URL = "https://heroicrankings.com/sitemap.xml";
const LEGACY_ORIGIN = "https://heroicrankings.com";
const SNAPSHOT_PATH = path.resolve("scripts/migrate/2026-09-26-live-posts-snapshot.json");
const ASSET_CACHE_PATH = path.resolve("scripts/migrate/2026-09-26-live-posts-assets-snapshot.json");
const USER_AGENT = "Mozilla/5.0 (HeroicRankings content sync)";

const RELATED_SERVICE_BY_URL_CATEGORY = {
  technical: "technical-seo",
  "on-page": "on-page-seo",
  local: "local-seo",
  "e-commerce": "ecommerce-seo",
  "keyword-research": "keyword-strategy",
  "content-creation": "content-creation",
  linkbuilding: "link-building",
  managed: "managed",
};

const CATEGORY_BY_LABEL = {
  seo: "seo",
  marketing: "marketing",
  "case study": "case-study",
  "industry news": "industry-news",
  "technical seo": "technical-seo",
  "on-page seo": "on-page-seo",
  "local seo": "local-seo",
  "ecommerce seo": "ecommerce-seo",
  "keyword research": "keyword-research",
  "content creation": "content-creation",
  "link building": "link-building",
  managed: "managed",
};

// --- Sanity client (this project, never the legacy one) --------------------

function getClient() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!projectId) throw new Error("NEXT_PUBLIC_SANITY_PROJECT_ID missing — run with --env-file=.env.local");
  if (APPLY && !token) throw new Error("SANITY_API_WRITE_TOKEN missing — needed for --apply");
  return createClient({ projectId, dataset, token, apiVersion: "2025-01-01", useCdn: false });
}

// --- HTML helpers ---------------------------------------------------------

const ENTITY_MAP = { "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&apos;": "'", "&#39;": "'", "&nbsp;": " " };

function decodeEntities(str) {
  if (!str) return "";
  let out = str;
  for (const [k, v] of Object.entries(ENTITY_MAP)) out = out.split(k).join(v);
  out = out.replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)));
  out = out.replace(/&#x([0-9a-fA-F]+);/g, (_, n) => String.fromCodePoint(parseInt(n, 16)));
  return out;
}

const stripTags = (s) => decodeEntities(s.replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim();

function extractMeta(html) {
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "";
  const desc = html.match(/<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)["']/i)?.[1] ?? "";
  const ogImage = html.match(/<meta[^>]+property=["']og:image["'][^>]*content=["']([^"']*)["']/i)?.[1] ?? "";
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? "";
  let datePublished = null;
  let authorName = null;
  const ldRe = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = ldRe.exec(html))) {
    datePublished ??= m[1].match(/"datePublished"\s*:\s*"([^"]+)"/)?.[1] ?? null;
    authorName ??= m[1].match(/"author"\s*:\s*\{[^}]*"name"\s*:\s*"([^"]+)"/)?.[1] ?? null;
  }
  // "by <author> in <Category>" sits right under the H1.
  // WHY: tags become spaces here, otherwise "Jankovic</div><div>in SEO" collapses to "Jankovicin SEO".
  const h1At = html.search(/<h1/i);
  const afterH1 = decodeEntities(html.slice(h1At, h1At + 3000).replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
  const categoryLabel = afterH1.match(/\bby [A-Za-z .'-]+? in ([A-Za-z -]+?)(?: Table of Contents|\s{2}|$)/)?.[1]?.trim() ?? null;
  return {
    // WHY: the site's metadata template appends " | Heroic Rankings" itself.
    metaTitle: decodeEntities(title.trim()).replace(/\s*\|\s*Heroic Rankings\s*$/i, ""),
    metaDescription: decodeEntities(desc),
    ogImage: decodeEntities(ogImage),
    h1: stripTags(h1),
    datePublished,
    authorName: authorName ? decodeEntities(authorName) : null,
    categoryLabel,
  };
}

/** Returns the inner HTML of the `.bcms-content` container. */
function extractContainer(html) {
  const start = html.indexOf('class="bcms-content "');
  if (start < 0) return "";
  let cursor = html.indexOf(">", start) + 1;
  const innerStart = cursor;
  let depth = 1;
  while (cursor < html.length && depth > 0) {
    const nextOpen = html.indexOf("<div", cursor);
    const nextClose = html.indexOf("</div>", cursor);
    if (nextClose < 0) return "";
    if (nextOpen >= 0 && nextOpen < nextClose) {
      depth++;
      cursor = nextOpen + 4;
    } else {
      depth--;
      if (depth === 0) return html.substring(innerStart, nextClose);
      cursor = nextClose + 6;
    }
  }
  return "";
}

/** Finds the matching </div> for a <div ...> that opens at `openEnd` (index just after its ">"). */
function findDivClose(html, openEnd) {
  let cursor = openEnd;
  let depth = 1;
  while (cursor < html.length) {
    const nextOpen = html.indexOf("<div", cursor);
    const nextClose = html.indexOf("</div>", cursor);
    if (nextClose < 0) return -1;
    if (nextOpen >= 0 && nextOpen < nextClose) {
      depth++;
      cursor = nextOpen + 4;
    } else {
      depth--;
      if (depth === 0) return nextClose;
      cursor = nextClose + 6;
    }
  }
  return -1;
}

/**
 * Splits the container into ordered chunks:
 *   { kind: "primitive", type, html } | { kind: "image", src, alt } |
 *   { kind: "table", html } | { kind: "iframe", src }
 */
function splitChunks(container) {
  const chunks = [];
  let pos = 0;
  const primitiveRe = /<div class="bcms-content--primitive bcms-content--([a-zA-Z]+)"\s*>/g;
  while (pos < container.length) {
    primitiveRe.lastIndex = pos;
    const prim = primitiveRe.exec(container);
    const table = container.indexOf("<table", pos);
    const picture = container.indexOf("<picture", pos);
    const iframe = container.indexOf("<iframe", pos);
    const candidates = [
      prim ? { at: prim.index, kind: "primitive" } : null,
      table >= 0 ? { at: table, kind: "table" } : null,
      picture >= 0 ? { at: picture, kind: "picture" } : null,
      iframe >= 0 ? { at: iframe, kind: "iframe" } : null,
    ].filter(Boolean);
    if (candidates.length === 0) break;
    candidates.sort((a, b) => a.at - b.at);
    const next = candidates[0];

    if (next.kind === "primitive") {
      const openEnd = primitiveRe.lastIndex;
      const close = findDivClose(container, openEnd);
      if (close < 0) break;
      chunks.push({ kind: "primitive", type: prim[1], html: container.substring(openEnd, close) });
      pos = close + 6;
    } else if (next.kind === "table") {
      const end = container.indexOf("</table>", next.at);
      if (end < 0) break;
      chunks.push({ kind: "table", html: container.substring(next.at, end + 8) });
      pos = end + 8;
    } else if (next.kind === "picture") {
      const end = container.indexOf("</picture>", next.at);
      if (end < 0) break;
      const tag = container.substring(next.at, end);
      const img = tag.match(/<img[^>]*>/)?.[0] ?? "";
      chunks.push({
        kind: "image",
        src: decodeEntities(img.match(/\ssrc="([^"]*)"/)?.[1] ?? ""),
        alt: decodeEntities(img.match(/\salt="([^"]*)"/)?.[1] ?? ""),
      });
      pos = end + 10;
    } else {
      const end = container.indexOf(">", next.at);
      const tag = container.substring(next.at, end + 1);
      chunks.push({ kind: "iframe", src: decodeEntities(tag.match(/\ssrc="([^"]*)"/)?.[1] ?? "") });
      const closeTag = container.indexOf("</iframe>", end);
      pos = closeTag >= 0 ? closeTag + 9 : end + 1;
    }
  }
  return chunks;
}

// --- Inline marks ---------------------------------------------------------

function normalizeHref(href) {
  if (!href) return "";
  if (href.startsWith(LEGACY_ORIGIN)) {
    // WHY: internal links become site-relative so they keep working after the domain cutover.
    const rest = href.slice(LEGACY_ORIGIN.length) || "/";
    return rest.startsWith("/") ? rest : `/${rest}`;
  }
  if (/^(https?:|mailto:|tel:|\/)/i.test(href)) return href;
  return `/${href}`;
}

function tokenizeInline(snippet, keyPrefix) {
  const spans = [];
  const markDefs = [];
  const stack = [];
  const activeMarks = () => stack.flatMap((s) => (s.kind === "strong" || s.kind === "em" ? [s.kind] : s.kind === "link" && s.key ? [s.key] : []));
  const pushText = (text) => {
    if (!text) return;
    const decoded = decodeEntities(text);
    if (!decoded) return;
    spans.push({ text: decoded, marks: activeMarks() });
  };
  let i = 0;
  while (i < snippet.length) {
    const lt = snippet.indexOf("<", i);
    if (lt < 0) {
      pushText(snippet.substring(i));
      break;
    }
    if (lt > i) pushText(snippet.substring(i, lt));
    const gt = snippet.indexOf(">", lt);
    if (gt < 0) {
      pushText(snippet.substring(lt));
      break;
    }
    const tag = snippet.substring(lt + 1, gt);
    i = gt + 1;
    if (tag.startsWith("/")) {
      const name = tag.substring(1).trim().toLowerCase();
      for (let s = stack.length - 1; s >= 0; s--) {
        const f = stack[s];
        const matches =
          (f.kind === "strong" && (name === "strong" || name === "b")) ||
          (f.kind === "em" && (name === "em" || name === "i")) ||
          (f.kind === "link" && name === "a") ||
          (f.kind === "u" && name === "u");
        if (matches) {
          stack.splice(s, 1);
          break;
        }
      }
      continue;
    }
    const tagName = tag.split(/[\s/]/, 1)[0].toLowerCase();
    if (["br", "img", "picture", "source", "hr"].includes(tagName)) continue;
    if (tagName === "strong" || tagName === "b") stack.push({ kind: "strong" });
    else if (tagName === "em" || tagName === "i") stack.push({ kind: "em" });
    else if (tagName === "u") stack.push({ kind: "u" });
    else if (tagName === "a") {
      const href = normalizeHref(decodeEntities(tag.match(/href=["']([^"']*)["']/i)?.[1] ?? ""));
      if (!href) {
        stack.push({ kind: "link", key: null });
        continue;
      }
      const key = `${keyPrefix}-md${markDefs.length}`;
      markDefs.push({ _key: key, _type: "link", href });
      stack.push({ kind: "link", key });
    }
  }
  const merged = [];
  for (const s of spans) {
    const last = merged[merged.length - 1];
    if (last && last.marks.length === s.marks.length && last.marks.every((m, idx) => m === s.marks[idx])) last.text += s.text;
    else merged.push({ ...s });
  }
  return { spans: merged, markDefs };
}

function buildBlock({ slug, blockIndex, style, listItem, inner }) {
  const baseKey = `migrate-post-${slug}-body-${blockIndex}`;
  const { spans, markDefs } = tokenizeInline(inner, baseKey);
  const children = (spans.length === 0 ? [{ text: "", marks: [] }] : spans).map((s, idx) => ({
    _key: `${baseKey}-c${idx}`,
    _type: "span",
    marks: s.marks,
    text: s.text,
  }));
  const block = { _key: baseKey, _type: "block", children, markDefs, style: style ?? "normal" };
  if (listItem) {
    block.listItem = listItem;
    block.level = 1;
  }
  return block;
}

function tableToBlock(html, key) {
  const rowsHtml = [...html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)].map((m) => m[1]);
  const cells = (row) => [...row.matchAll(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/g)].map((m) => stripTags(m[1]));
  // WHY: table primitives have no <thead>; when every filled cell of the first row is bold, it is the header row.
  const firstRowIsHeader =
    /<thead/i.test(html) ||
    (rowsHtml.length > 1 && [...rowsHtml[0].matchAll(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/g)].every((m) => !stripTags(m[1]) || /<(strong|b)\b/i.test(m[1])));
  const header = firstRowIsHeader && rowsHtml.length > 0 ? cells(rowsHtml[0]) : [];
  const bodyRows = (firstRowIsHeader ? rowsHtml.slice(1) : rowsHtml).map((row, i) => ({ _key: `${key}-r${i}`, _type: "tableRow", cols: cells(row) }));
  return { _key: key, _type: "table", header, rows: bodyRows };
}

// --- Assets ---------------------------------------------------------------

async function loadJson(file, fallback) {
  try {
    return JSON.parse(await readFile(file, "utf8"));
  } catch {
    return fallback;
  }
}

function makeUploader(client, cache) {
  return async function uploadImage(url, label) {
    if (cache[url]) return cache[url];
    if (!APPLY) return { _ref: "image-dryrun", _type: "reference" };
    const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
    if (!res.ok) throw new Error(`image fetch failed ${res.status}: ${url.slice(0, 120)}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    const filename = decodeURIComponent(new URL(url).pathname.split("/").pop() || "image").replace(/[^\w.-]+/g, "-");
    const asset = await client.assets.upload("image", buffer, { filename, label });
    cache[url] = { _ref: asset._id, _type: "reference" };
    return cache[url];
  };
}

// --- Post conversion ------------------------------------------------------

async function convertPost({ url, slug, urlCategory }, ctx) {
  const res = await fetch(url, { redirect: "follow", headers: { "User-Agent": USER_AGENT } });
  if (!res.ok) throw new Error(`legacy fetch failed: HTTP ${res.status}`);
  const html = await res.text();
  const meta = extractMeta(html);
  const container = extractContainer(html);
  if (!container) throw new Error("no .bcms-content container found");
  const chunks = splitChunks(container);

  const body = [];
  let blockIndex = 0;
  let firstParagraph = null;
  let titleSeen = false;
  const stats = { images: 0, tables: 0, iframes: 0, lists: 0, dropped: [] };
  const key = () => `migrate-post-${slug}-body-${blockIndex++}`;

  for (const chunk of chunks) {
    if (chunk.kind === "image") {
      if (!chunk.src) continue;
      body.push({ _key: key(), _type: "image", alt: chunk.alt || meta.h1, asset: await ctx.uploadImage(chunk.src, chunk.alt || meta.h1) });
      stats.images++;
    } else if (chunk.kind === "table") {
      body.push(tableToBlock(chunk.html, key()));
      stats.tables++;
    } else if (chunk.kind === "iframe") {
      if (/youtube|youtu\.be|vimeo/i.test(chunk.src)) {
        body.push({ _key: key(), _type: "videoEmbed", url: chunk.src });
        stats.iframes++;
      } else stats.dropped.push(`iframe ${chunk.src.slice(0, 60)}`);
    } else if (chunk.type === "paragraph") {
      const inner = chunk.html.replace(/^\s*<p[^>]*>/, "").replace(/<\/p>\s*$/, "");
      const text = stripTags(inner);
      if (!text) continue;
      firstParagraph ??= text;
      body.push(buildBlock({ slug, blockIndex: blockIndex++, style: "normal", inner }));
    } else if (chunk.type === "heading") {
      const hm = chunk.html.match(/^\s*<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/);
      if (!hm) continue;
      const level = Number(hm[1]);
      if (!stripTags(hm[2])) continue;
      if (level === 1 && !titleSeen) {
        titleSeen = true;
        continue;
      }
      const style = level <= 2 ? "h2" : level === 3 ? "h3" : "h4";
      body.push(buildBlock({ slug, blockIndex: blockIndex++, style, inner: hm[2] }));
    } else if (chunk.type === "bulletList" || chunk.type === "orderedList") {
      stats.lists++;
      const listItem = chunk.type === "orderedList" ? "number" : "bullet";
      for (const li of chunk.html.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)) {
        let inner = li[1];
        const p = inner.match(/^\s*<p[^>]*>([\s\S]*?)<\/p>\s*$/);
        if (p) inner = p[1];
        if (!stripTags(inner)) continue;
        body.push(buildBlock({ slug, blockIndex: blockIndex++, style: "normal", listItem, inner }));
      }
    } else if (chunk.type === "table") {
      // WHY: newer posts use a `table` primitive instead of the widget wrapper.
      body.push(tableToBlock(chunk.html, key()));
      stats.tables++;
    } else if (chunk.type === "horizontalRule") {
      // Nothing to preserve — the renderer has no rule block and spacing is handled by headings.
    } else {
      stats.dropped.push(`primitive ${chunk.type}`);
    }
  }

  const words = body.reduce((n, b) => (b._type === "block" ? n + b.children.reduce((m, c) => m + (c.text ? c.text.split(/\s+/).filter(Boolean).length : 0), 0) : n), 0);
  const legacyText = container.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const legacyWords = legacyText.split(/\s+/).filter(Boolean).length;
  const links = body.reduce((n, b) => n + (b.markDefs?.length ?? 0), 0);

  const authorId = meta.authorName ? ctx.teamMembers[meta.authorName.toLowerCase()] ?? null : null;
  const category = meta.categoryLabel ? CATEGORY_BY_LABEL[meta.categoryLabel.toLowerCase()] ?? null : null;
  const excerptSource = (meta.metaDescription || firstParagraph || "").trim();
  const excerpt = excerptSource.length <= 200 ? excerptSource : `${excerptSource.slice(0, 197).trimEnd()}…`;

  const doc = {
    _id: `migrate-post-${slug}`,
    _type: "post",
    title: meta.h1 || meta.metaTitle || slug,
    slug: { _type: "slug", current: slug },
    excerpt,
    publishedAt: meta.datePublished ? new Date(meta.datePublished).toISOString() : new Date().toISOString(),
    urlCategory,
    categories: category && category !== "seo" ? ["seo", category] : ["seo"],
    relatedService: RELATED_SERVICE_BY_URL_CATEGORY[urlCategory] ?? undefined,
    body,
  };
  if (authorId) doc.author = { _type: "reference", _ref: authorId };
  if (meta.ogImage) {
    doc.mainImage = { _type: "image", alt: meta.h1, asset: await ctx.uploadImage(meta.ogImage, meta.h1) };
  }
  if (meta.metaTitle || meta.metaDescription) {
    doc.seo = { _type: "seo" };
    if (meta.metaTitle) doc.seo.metaTitle = meta.metaTitle;
    if (meta.metaDescription) doc.seo.metaDescription = meta.metaDescription;
  }

  return {
    doc,
    stats: { ...stats, blocks: body.length, words, legacyWords, ratio: legacyWords ? words / legacyWords : 0, links, author: meta.authorName, authorMatched: Boolean(authorId), categoryLabel: meta.categoryLabel, publishedAt: doc.publishedAt.slice(0, 10) },
  };
}

// --- Main -----------------------------------------------------------------

const client = getClient();

const sitemap = await (await fetch(SITEMAP_URL, { headers: { "User-Agent": USER_AGENT } })).text();
const liveUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const livePosts = liveUrls
  .map((u) => u.match(/^https:\/\/heroicrankings\.com\/seo\/([^/]+)\/([^/]+)\/$/))
  .filter(Boolean)
  .map((m) => ({ url: m[0], urlCategory: m[1], slug: m[2] }));

const existing = new Set(await client.fetch('*[_type=="post" && !(_id in path("drafts.**"))].slug.current'));
const teamMemberRows = await client.fetch('*[_type=="teamMember"]{_id, name}');
const teamMembers = Object.fromEntries(teamMemberRows.map((t) => [String(t.name).toLowerCase(), t._id]));

let targets = livePosts.filter((p) => !existing.has(p.slug));
if (ONLY) targets = targets.filter((p) => p.slug === ONLY);
console.log(`live posts: ${livePosts.length}, in Sanity: ${existing.size}, to import: ${targets.length}${APPLY ? " (APPLY)" : " (dry run)"}`);

const assetCache = await loadJson(ASSET_CACHE_PATH, {});
const ctx = { uploadImage: makeUploader(client, assetCache), teamMembers };
const results = [];
for (const target of targets) {
  process.stdout.write(`  ${target.slug.padEnd(52)}`);
  try {
    const r = await convertPost(target, ctx);
    results.push({ ...target, ...r });
    const s = r.stats;
    console.log(`${String(s.blocks).padStart(4)} blocks ${s.ratio.toFixed(2)} ratio ${String(s.images).padStart(2)} img ${s.tables} tbl ${s.iframes} vid ${String(s.links).padStart(3)} links  ${s.publishedAt}  ${s.authorMatched ? s.author : `NO AUTHOR (${s.author ?? "none"})`}  [${s.categoryLabel ?? "?"}]${s.dropped.length ? `  dropped: ${s.dropped.join(", ")}` : ""}`);
  } catch (err) {
    console.log(`ERROR ${err instanceof Error ? err.message : err}`);
    results.push({ ...target, error: String(err) });
  }
}
await mkdir(path.dirname(SNAPSHOT_PATH), { recursive: true });
await writeFile(SNAPSHOT_PATH, `${JSON.stringify(results.map((r) => ({ slug: r.slug, url: r.url, stats: r.stats, error: r.error, doc: r.doc })), null, 2)}\n`);
await writeFile(ASSET_CACHE_PATH, `${JSON.stringify(assetCache, null, 2)}\n`);

const writable = results.filter((r) => !r.error && r.stats.ratio >= 0.5);
const skipped = results.filter((r) => !r.error && r.stats.ratio < 0.5);
for (const r of skipped) console.log(`  !! ${r.slug}: captured only ${r.stats.ratio.toFixed(2)} of legacy words — not written`);

if (!APPLY) {
  console.log(`\nDry run: ${writable.length} posts ready, ${skipped.length} skipped, ${results.length - writable.length - skipped.length} errors. Re-run with --apply to write.`);
  process.exit(0);
}

const tx = client.transaction();
for (const r of writable) tx.createIfNotExists(r.doc);
const committed = await tx.commit();
console.log(`\nCommitted ${committed.results.length} mutations`);
for (const m of committed.results) console.log(`  ${m.id} -> ${m.operation}`);
