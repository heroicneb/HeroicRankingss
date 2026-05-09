#!/usr/bin/env node
/**
 * Imports 3 blog posts that were live on the legacy heroicrankings.com site
 * but never made it into Sanity. Parity sweep flagged them as soft-404 on
 * the new site (HTTP 200 but thin body) — they need to be created so the
 * legacy URLs continue to render real content post-cutover.
 *
 * Posts:
 *   - ahrefs-vs-majestic-comparison        (urlCategory: managed)
 *   - web-summit-lisbon-2023               (urlCategory: local)
 *   - difference-between-marketing-and-sales-services (urlCategory: keyword-research)
 *
 * Pipeline:
 *   1. Fetch legacy HTML.
 *   2. Extract `<title>`, `<meta name="description">`, JSON-LD `datePublished`,
 *      `<h1>`, and the `bcms-content` body container.
 *   3. Walk `bcms-content--primitive bcms-content--{type}` blocks (paragraph,
 *      heading, bulletList) and convert to portable text. Inline marks:
 *      `<strong>`/`<b>` → strong, `<em>`/`<i>` → em, `<a href>` → link annotation.
 *      `<u>` is unwrapped (legacy artifact, almost always wraps a link).
 *   4. Build Sanity post doc, write snapshot, dry-run by default.
 *
 * Usage:
 *   node scripts/migrate/2026-05-09-import-missing-posts.mjs            # dry run
 *   node scripts/migrate/2026-05-09-import-missing-posts.mjs --apply    # write
 *
 * Safety:
 *   - Dry-run default; --apply required to write.
 *   - Pre-mutation snapshot at scripts/migrate/2026-05-09-missing-posts-snapshot.json
 *     (gitignored).
 *   - createIfNotExists per doc — never overwrites an existing _id.
 *   - If captured wordCount < 50% of legacy wordCount, aborts that doc and
 *     prints a parser-bug warning. Other docs still proceed.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { getSanityClient } from "./lib/sanity-client.mjs";

const APPLY = process.argv.includes("--apply");
const SNAPSHOT_PATH = path.resolve(
  "scripts/migrate/2026-05-09-missing-posts-snapshot.json",
);

const POSTS = [
  {
    slug: "ahrefs-vs-majestic-comparison",
    legacyUrl:
      "https://heroicrankings.com/seo/managed/ahrefs-vs-majestic-comparison/",
    urlCategory: "managed",
  },
  {
    slug: "web-summit-lisbon-2023",
    legacyUrl: "https://heroicrankings.com/seo/local/web-summit-lisbon-2023/",
    urlCategory: "local",
  },
  {
    slug: "difference-between-marketing-and-sales-services",
    legacyUrl:
      "https://heroicrankings.com/seo/keyword-research/difference-between-marketing-and-sales-services/",
    urlCategory: "keyword-research",
  },
];

// --- HTML helpers -------------------------------------------------------

const ENTITY_MAP = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&apos;": "'",
  "&#39;": "'",
  "&nbsp;": " ",
};

function decodeEntities(str) {
  if (!str) return "";
  let out = str;
  for (const [k, v] of Object.entries(ENTITY_MAP)) {
    out = out.split(k).join(v);
  }
  // numeric entities
  out = out.replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)));
  out = out.replace(/&#x([0-9a-fA-F]+);/g, (_, n) =>
    String.fromCodePoint(parseInt(n, 16)),
  );
  return out;
}

function extractMeta(html) {
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "";
  const desc =
    html.match(
      /<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)["']/i,
    )?.[1] ?? "";
  const h1 =
    html
      .match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]
      ?.replace(/<[^>]+>/g, "")
      .trim() ?? "";
  // JSON-LD datePublished
  let datePublished = null;
  const ldRe =
    /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = ldRe.exec(html))) {
    const dpMatch = m[1].match(/"datePublished"\s*:\s*"([^"]+)"/);
    if (dpMatch) {
      datePublished = dpMatch[1];
      break;
    }
  }
  return {
    metaTitle: decodeEntities(title.trim()),
    metaDescription: decodeEntities(desc),
    h1: decodeEntities(h1),
    datePublished,
  };
}

/**
 * Splits the raw HTML into bcms primitive block strings, in document order.
 * Each entry is { type, html }, where type ∈ paragraph | heading | bulletList
 * and html is the inner HTML of the wrapping div.
 *
 * Why a custom walker rather than regex: bcms blocks are flat siblings (no
 * nesting between primitives), but we still need a depth-aware scan to find
 * the matching </div> for each block start.
 */
function splitBcmsBlocks(html) {
  const blocks = [];
  // Scope to the bcms-content container so nav/footer don't bleed in.
  const containerStart = html.indexOf('class="bcms-content "');
  if (containerStart < 0) return blocks;
  const openDivStart = html.lastIndexOf("<div", containerStart);
  // After the opening tag of the container, find its matching close.
  // Use depth count: every <div opens, every </div> closes.
  let i = html.indexOf(">", containerStart) + 1;
  let depth = 1;
  const containerEnd = (() => {
    let cursor = i;
    while (cursor < html.length && depth > 0) {
      const nextOpen = html.indexOf("<div", cursor);
      const nextClose = html.indexOf("</div>", cursor);
      if (nextClose < 0) return -1;
      if (nextOpen >= 0 && nextOpen < nextClose) {
        depth++;
        cursor = nextOpen + 4;
      } else {
        depth--;
        cursor = nextClose + 6;
        if (depth === 0) return nextClose;
      }
    }
    return -1;
  })();
  if (containerEnd < 0) return blocks;
  const containerInner = html.substring(i, containerEnd);

  // Now scan for direct-child primitive divs in containerInner.
  const primitiveRe =
    /<div class="bcms-content--primitive bcms-content--([a-zA-Z]+)"\s*>/g;
  let pm;
  while ((pm = primitiveRe.exec(containerInner))) {
    const type = pm[1];
    const blockOpenEnd = primitiveRe.lastIndex;
    // Walk depth-aware to find matching </div>.
    let cursor = blockOpenEnd;
    let d = 1;
    let blockEnd = -1;
    while (cursor < containerInner.length && d > 0) {
      const nextOpen = containerInner.indexOf("<div", cursor);
      const nextClose = containerInner.indexOf("</div>", cursor);
      if (nextClose < 0) break;
      if (nextOpen >= 0 && nextOpen < nextClose) {
        d++;
        cursor = nextOpen + 4;
      } else {
        d--;
        if (d === 0) {
          blockEnd = nextClose;
          break;
        }
        cursor = nextClose + 6;
      }
    }
    if (blockEnd < 0) continue;
    const inner = containerInner.substring(blockOpenEnd, blockEnd);
    blocks.push({ type, html: inner });
    primitiveRe.lastIndex = blockEnd + 6;
  }
  return blocks;
  // openDivStart unused but kept for trace.
  void openDivStart;
}

// --- Inline-mark tokenizer ---------------------------------------------

/**
 * Converts inline HTML (paragraph or heading or list-item content) into an
 * array of portable text spans + corresponding markDefs.
 *
 * Tokens we recognize:
 *   <strong>, <b>            → mark "strong"
 *   <em>, <i>                → mark "em"
 *   <u>                      → unwrap (legacy noise; usually wraps a link)
 *   <a href="...">           → mark def with _type "link"
 *   anything else (br/picture/source/img/etc) → strip tag, keep text
 *
 * Marks compose: `<strong><a href="x">y</a></strong>` produces a single
 * span with marks ["strong", <linkKey>].
 */
function tokenizeInline(htmlSnippet, keyPrefix) {
  const spans = [];
  const markDefs = [];
  const stack = []; // { kind: "strong" | "em" | "link", key }

  const activeMarks = () => {
    const marks = [];
    for (const s of stack) {
      if (s.kind === "strong" || s.kind === "em") marks.push(s.kind);
      else if (s.kind === "link") marks.push(s.key);
    }
    return marks;
  };

  const pushText = (text) => {
    if (!text) return;
    const decoded = decodeEntities(text);
    if (!decoded) return;
    spans.push({ text: decoded, marks: activeMarks() });
  };

  let i = 0;
  while (i < htmlSnippet.length) {
    const lt = htmlSnippet.indexOf("<", i);
    if (lt < 0) {
      pushText(htmlSnippet.substring(i));
      break;
    }
    if (lt > i) pushText(htmlSnippet.substring(i, lt));
    const gt = htmlSnippet.indexOf(">", lt);
    if (gt < 0) {
      pushText(htmlSnippet.substring(lt));
      break;
    }
    const tag = htmlSnippet.substring(lt + 1, gt);
    i = gt + 1;
    if (tag.startsWith("/")) {
      const name = tag.substring(1).trim().toLowerCase();
      // Pop the matching frame. If unmatched, ignore.
      for (let s = stack.length - 1; s >= 0; s--) {
        const frame = stack[s];
        const matches =
          (frame.kind === "strong" && (name === "strong" || name === "b")) ||
          (frame.kind === "em" && (name === "em" || name === "i")) ||
          (frame.kind === "link" && name === "a") ||
          (frame.kind === "u" && name === "u");
        if (matches) {
          stack.splice(s, 1);
          break;
        }
      }
      continue;
    }
    // Self-closing or void tags we just skip text-wise (br, img, picture, source).
    const tagName = tag.split(/[\s/]/, 1)[0].toLowerCase();
    if (["br", "img", "picture", "source", "hr"].includes(tagName)) {
      // skip
      continue;
    }
    if (tagName === "strong" || tagName === "b") {
      stack.push({ kind: "strong" });
      continue;
    }
    if (tagName === "em" || tagName === "i") {
      stack.push({ kind: "em" });
      continue;
    }
    if (tagName === "u") {
      stack.push({ kind: "u" });
      continue;
    }
    if (tagName === "a") {
      const hrefMatch = tag.match(/href=["']([^"']*)["']/i);
      const href = hrefMatch ? decodeEntities(hrefMatch[1]) : "";
      if (!href) {
        // No href: track frame so closing </a> doesn't poison stack.
        stack.push({ kind: "link", key: null });
        continue;
      }
      const key = `${keyPrefix}-md${markDefs.length}`;
      // Resolve relative legacy paths to absolute legacy URL.
      const resolvedHref = /^https?:\/\//i.test(href)
        ? href
        : `https://heroicrankings.com${href.startsWith("/") ? "" : "/"}${href}`;
      markDefs.push({
        _key: key,
        _type: "link",
        href: resolvedHref,
      });
      stack.push({ kind: "link", key });
      continue;
    }
    // Unknown tag — treat as transparent.
  }

  // Coalesce adjacent spans with identical mark-set to keep block sizes small.
  const merged = [];
  for (const s of spans) {
    const last = merged[merged.length - 1];
    if (
      last &&
      last.marks.length === s.marks.length &&
      last.marks.every((m, idx) => m === s.marks[idx])
    ) {
      last.text += s.text;
    } else {
      merged.push({ ...s });
    }
  }
  return { spans: merged, markDefs };
}

// --- Block converter ----------------------------------------------------

function buildBlock({ slug, blockIndex, style, listItem, level, inner }) {
  const baseKey = `migrate-post-${slug}-body-${blockIndex}`;
  const { spans, markDefs } = tokenizeInline(inner, baseKey);
  const children = (spans.length === 0 ? [{ text: "", marks: [] }] : spans).map(
    (s, idx) => ({
      _key: `${baseKey}-c${idx}`,
      _type: "span",
      marks: s.marks,
      text: s.text,
    }),
  );
  const block = {
    _key: baseKey,
    _type: "block",
    children,
    markDefs: markDefs.map((m) => ({
      _key: m._key,
      _type: m._type,
      href: m.href,
    })),
    style: style ?? "normal",
  };
  if (listItem) {
    block.listItem = listItem;
    block.level = level ?? 1;
  }
  return block;
}

function htmlToPortableBlocks(blocks, slug) {
  const out = [];
  let blockIndex = 0;
  let firstParagraphText = null;
  let titleSeen = false;

  for (const b of blocks) {
    if (b.type === "paragraph") {
      // Inner: <p>...</p> — strip <p> wrapper.
      const inner = b.html.replace(/^\s*<p[^>]*>/, "").replace(/<\/p>\s*$/, "");
      // Empty paragraph guard.
      const cleanedText = inner.replace(/<[^>]+>/g, "").trim();
      if (!cleanedText) continue;
      if (!firstParagraphText) firstParagraphText = decodeEntities(cleanedText);
      out.push(
        buildBlock({
          slug,
          blockIndex: blockIndex++,
          style: "normal",
          inner,
        }),
      );
    } else if (b.type === "heading") {
      // Inner: <h2 id="...">text</h2> or h3 etc.
      const headMatch = b.html.match(/^\s*<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/);
      if (!headMatch) continue;
      const level = Number(headMatch[1]);
      const inner = headMatch[2];
      const cleanedText = inner.replace(/<[^>]+>/g, "").trim();
      if (!cleanedText) continue;
      // First h1 in body is the title — skip (we set post.title from <h1>).
      if (level === 1 && !titleSeen) {
        titleSeen = true;
        continue;
      }
      // Schema supports h2/h3/h4. Demote h5/h6 to h4.
      let style;
      if (level === 1) style = "h2"; // any leftover h1 inside body
      else if (level === 2) style = "h2";
      else if (level === 3) style = "h3";
      else style = "h4";
      out.push(
        buildBlock({
          slug,
          blockIndex: blockIndex++,
          style,
          inner,
        }),
      );
    } else if (b.type === "bulletList" || b.type === "orderedList") {
      const listItem = b.type === "orderedList" ? "number" : "bullet";
      // Each <li>...<p>...</p>...</li> becomes one block.
      const liRe = /<li[^>]*>([\s\S]*?)<\/li>/g;
      let lm;
      while ((lm = liRe.exec(b.html))) {
        let inner = lm[1];
        // Strip outer <p> wrapper if li contains a single <p>.
        const pMatch = inner.match(/^\s*<p[^>]*>([\s\S]*?)<\/p>\s*$/);
        if (pMatch) inner = pMatch[1];
        const cleanedText = inner.replace(/<[^>]+>/g, "").trim();
        if (!cleanedText) continue;
        out.push(
          buildBlock({
            slug,
            blockIndex: blockIndex++,
            style: "normal",
            listItem,
            level: 1,
            inner,
          }),
        );
      }
    }
    // Other block types (image/picture/cta) are dropped; flagged in TODO list.
  }

  return { blocks: out, firstParagraphText };
}

function wordCount(blocks) {
  let n = 0;
  for (const b of blocks) {
    if (b._type !== "block") continue;
    for (const c of b.children) {
      if (c._type === "span" && c.text) {
        n += c.text.split(/\s+/).filter(Boolean).length;
      }
    }
  }
  return n;
}

function legacyWordCount(html) {
  const text = (html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? html)
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.split(/\s+/).filter(Boolean).length;
}

function countLinks(blocks) {
  let n = 0;
  for (const b of blocks) {
    if (Array.isArray(b.markDefs)) {
      n += b.markDefs.filter((m) => m._type === "link").length;
    }
  }
  return n;
}

function flagDroppedContent(blocks) {
  const todos = [];
  // Walk raw block stream from splitBcmsBlocks: any non-text block types,
  // plus any block whose raw html includes <picture> / <iframe> / <table>.
  for (const b of blocks) {
    const type = b.type;
    if (
      type !== "paragraph" &&
      type !== "heading" &&
      type !== "bulletList" &&
      type !== "orderedList"
    ) {
      todos.push(`unsupported bcms block type: ${type}`);
    }
    if (/<picture|<img|<iframe|<table/i.test(b.html)) {
      // Paragraphs sometimes contain inline images; flag once per block.
      todos.push(`media or table dropped from ${type}`);
    }
  }
  return todos;
}

// --- Excerpt ------------------------------------------------------------

function buildExcerpt(metaDescription, firstParagraphText) {
  const source = (metaDescription || firstParagraphText || "").trim();
  if (!source) return "";
  if (source.length <= 200) return source;
  return source.slice(0, 197).trimEnd() + "…";
}

// --- Main ---------------------------------------------------------------

async function processPost(spec) {
  const res = await fetch(spec.legacyUrl, { redirect: "follow" });
  if (!res.ok) {
    throw new Error(
      `legacy fetch failed for ${spec.slug}: HTTP ${res.status}`,
    );
  }
  const html = await res.text();
  const meta = extractMeta(html);
  const rawBlocks = splitBcmsBlocks(html);
  const { blocks, firstParagraphText } = htmlToPortableBlocks(
    rawBlocks,
    spec.slug,
  );
  const todos = flagDroppedContent(rawBlocks);

  const sanityWords = wordCount(blocks);
  const legacyWords = legacyWordCount(html);
  const links = countLinks(blocks);

  const sanityDoc = {
    _id: `migrate-post-${spec.slug}`,
    _type: "post",
    title: meta.h1 || meta.metaTitle || spec.slug,
    slug: { _type: "slug", current: spec.slug },
    excerpt: buildExcerpt(meta.metaDescription, firstParagraphText),
    publishedAt: meta.datePublished
      ? new Date(meta.datePublished).toISOString()
      : new Date().toISOString(),
    urlCategory: spec.urlCategory,
    categories: ["seo"],
    body: blocks,
  };
  if (meta.metaTitle || meta.metaDescription) {
    sanityDoc.seo = { _type: "seo" };
    if (meta.metaTitle) sanityDoc.seo.metaTitle = meta.metaTitle;
    if (meta.metaDescription)
      sanityDoc.seo.metaDescription = meta.metaDescription;
  }

  return {
    spec,
    sanityDoc,
    stats: {
      blockCount: blocks.length,
      sanityWords,
      legacyWords,
      capturedRatio: legacyWords > 0 ? sanityWords / legacyWords : 0,
      links,
      todos,
    },
  };
}

const client = APPLY ? getSanityClient() : getSanityClient();
if (APPLY && !client) {
  console.error(
    "No Sanity write token — set SANITY_API_WRITE_TOKEN in .env.local",
  );
  process.exit(2);
}

const results = [];
for (const spec of POSTS) {
  console.log(`Processing ${spec.slug}…`);
  try {
    results.push(await processPost(spec));
  } catch (err) {
    console.error(`  failed: ${err instanceof Error ? err.message : err}`);
    results.push({ spec, error: String(err) });
  }
}

// --- Snapshot -----------------------------------------------------------

await mkdir(path.dirname(SNAPSHOT_PATH), { recursive: true });
await writeFile(
  SNAPSHOT_PATH,
  JSON.stringify(
    results.map((r) => ({
      slug: r.spec.slug,
      legacyUrl: r.spec.legacyUrl,
      sanityDoc: r.sanityDoc,
      stats: r.stats,
      error: r.error,
    })),
    null,
    2,
  ) + "\n",
);
console.log(`\nSnapshot written: ${SNAPSHOT_PATH}`);

// --- Summary ------------------------------------------------------------

console.log("\n=== summary ===");
console.log(
  "slug".padEnd(54) +
    "blocks".padStart(8) +
    "words".padStart(10) +
    "ratio".padStart(8) +
    "links".padStart(8),
);
let abortDueToParser = false;
for (const r of results) {
  if (r.error) {
    console.log(`  ${r.spec.slug.padEnd(54)} ERROR: ${r.error}`);
    continue;
  }
  const { blockCount, sanityWords, legacyWords, capturedRatio, links } =
    r.stats;
  console.log(
    `  ${r.spec.slug.padEnd(52)}` +
      String(blockCount).padStart(8) +
      `${sanityWords}/${legacyWords}`.padStart(12) +
      capturedRatio.toFixed(2).padStart(8) +
      String(links).padStart(8),
  );
  if (r.stats.todos.length > 0) {
    const summary = {};
    for (const t of r.stats.todos)
      summary[t] = (summary[t] ?? 0) + 1;
    for (const [t, c] of Object.entries(summary)) {
      console.log(`      TODO: ${t} (×${c})`);
    }
  }
  if (capturedRatio < 0.5) {
    console.log(
      `      !! captured < 50% of legacy word count (${capturedRatio.toFixed(2)}). Parser likely missing content. Skipping write for this doc.`,
    );
    abortDueToParser = true;
    r._abort = true;
  }
}

if (!APPLY) {
  console.log("\nDry run complete. Re-run with --apply to commit.");
  process.exit(0);
}

if (abortDueToParser) {
  console.log("\nAborting writes — at least one post failed parser sanity gate.");
  process.exit(1);
}

// --- Apply -------------------------------------------------------------

const tx = client.transaction();
const writable = results.filter((r) => !r.error && !r._abort);
for (const r of writable) {
  // createIfNotExists keeps this idempotent: re-running with --apply after
  // a partial failure won't clobber docs that already wrote.
  tx.createIfNotExists(r.sanityDoc);
}

try {
  const result = await tx.commit();
  console.log(`\nCommitted ${result.results.length} mutations:`);
  for (const m of result.results) {
    console.log(`  ${m.id} -> ${m.operation}`);
  }
} catch (err) {
  const msg = err instanceof Error ? err.message : String(err);
  console.error("\nCommit failed:", msg);
  console.error(`Snapshot preserved at ${SNAPSHOT_PATH} for rollback.`);
  process.exit(1);
}
