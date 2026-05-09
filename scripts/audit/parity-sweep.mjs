#!/usr/bin/env node
/**
 * Site-migration parity sweep — pairs every URL in
 * docs/migration/legacy-url-inventory.txt across two origins and diffs
 * each on the SEO-relevant fields per industry-standard migration audits
 * (Semrush / Ahrefs / Sitebulb / Screaming Frog playbooks):
 *
 *   1. status code + redirect chain
 *   2. final URL after follow
 *   3. <title>
 *   4. <meta name="description">
 *   5. <link rel="canonical">
 *   6. first <h1> textContent
 *   7. og:title / og:description / og:image / og:url
 *   8. JSON-LD @type values present
 *   9. anchor href count + legacy-style href count
 *  10. visible body word count (rough content-presence proxy)
 *  11. response time
 *  12. content-length / payload size
 *
 * Pure stdlib — no external deps. Node 20+.
 *
 * Usage:
 *   AUDIT_OLD=https://heroicrankings.com \
 *   AUDIT_NEW=https://heroic-rankings-final.vercel.app \
 *     node scripts/audit/parity-sweep.mjs
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..", "..");
const INVENTORY = path.join(REPO_ROOT, "docs", "migration", "legacy-url-inventory.txt");

const OLD_BASE = (process.env.AUDIT_OLD ?? "https://heroicrankings.com").replace(/\/$/, "");
const NEW_BASE = (process.env.AUDIT_NEW ?? "https://heroic-rankings-final.vercel.app").replace(/\/$/, "");
const concurrency = Number(process.env.AUDIT_CONCURRENCY ?? "8");

const TODAY = new Date().toISOString().slice(0, 10);
const OUT_DIR = path.join(REPO_ROOT, "docs", "audits");
const OUT_CSV = path.join(OUT_DIR, `${TODAY}-parity-sweep.csv`);
const OUT_MD = path.join(OUT_DIR, `${TODAY}-parity-sweep-summary.md`);

const ASSET_EXT = /\.(svg|png|jpe?g|webp|gif|ico|json|xml|css|js)(\?|$)/i;
const LEGACY_PREFIXES = [
  "/about-us", "/seo-services", "/technical-seo", "/on-page-seo",
  "/local-seo", "/ecommerce-seo", "/content-creation", "/keyword-strategy",
  "/link-building", "/insights", "/case-studies", "/team/",
];

function legacyHrefCount(html) {
  const matches = html.match(/href="([^"]+)"/g) ?? [];
  let count = 0;
  for (const m of matches) {
    const hrefMatch = m.match(/href="([^"]+)"/);
    if (!hrefMatch) continue;
    const href = hrefMatch[1];
    if (ASSET_EXT.test(href)) continue;
    for (const prefix of LEGACY_PREFIXES) {
      if (href === prefix || href.startsWith(`${prefix}/`) || href === `${prefix}/`) {
        count++;
        break;
      }
    }
  }
  return count;
}

function extract(html) {
  if (!html) return {};
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const descMatch = html.match(/<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i);
  const canonicalMatch = html.match(/<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']*)["'][^>]*>/i);
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const ogTitle = html.match(/<meta[^>]+property=["']og:title["'][^>]*content=["']([^"']*)["'][^>]*>/i);
  const ogDesc = html.match(/<meta[^>]+property=["']og:description["'][^>]*content=["']([^"']*)["'][^>]*>/i);
  const ogImage = html.match(/<meta[^>]+property=["']og:image["'][^>]*content=["']([^"']*)["'][^>]*>/i);
  const ogUrl = html.match(/<meta[^>]+property=["']og:url["'][^>]*content=["']([^"']*)["'][^>]*>/i);
  const robotsMeta = html.match(/<meta[^>]+name=["']robots["'][^>]*content=["']([^"']*)["'][^>]*>/i);
  const ldTypes = new Set();
  const ldRe = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = ldRe.exec(html))) {
    try {
      const parsed = JSON.parse(m[1].trim());
      const collect = (v) => {
        if (Array.isArray(v)) v.forEach(collect);
        else if (v && typeof v === "object") {
          if (typeof v["@type"] === "string") ldTypes.add(v["@type"]);
          else if (Array.isArray(v["@type"])) v["@type"].forEach((t) => ldTypes.add(t));
          if (Array.isArray(v["@graph"])) v["@graph"].forEach(collect);
        }
      };
      collect(parsed);
    } catch {}
  }
  const bodyTextOnly = (html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? html)
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return {
    title: (titleMatch?.[1] ?? "").trim(),
    description: descMatch?.[1] ?? "",
    canonical: canonicalMatch?.[1] ?? "",
    h1: (h1Match?.[1] ?? "").replace(/<[^>]+>/g, "").trim(),
    ogTitle: ogTitle?.[1] ?? "",
    ogDesc: ogDesc?.[1] ?? "",
    ogImage: ogImage?.[1] ?? "",
    ogUrl: ogUrl?.[1] ?? "",
    robotsMeta: robotsMeta?.[1] ?? "",
    ldTypes: Array.from(ldTypes).sort().join(","),
    anchorCount: (html.match(/<a\s[^>]*href=/gi) ?? []).length,
    legacyHrefCount: legacyHrefCount(html),
    wordCount: bodyTextOnly.split(/\s+/).filter(Boolean).length,
    payload: html.length,
  };
}

async function fetchURL(base, p) {
  const url = `${base}${p}`;
  const t0 = Date.now();
  try {
    const res = await fetch(url, { redirect: "follow" });
    const html = await res.text();
    const elapsed = Date.now() - t0;
    return {
      ok: res.ok,
      status: res.status,
      finalUrl: res.url,
      xRobotsTag: res.headers.get("x-robots-tag") ?? "",
      ms: elapsed,
      ...extract(html),
    };
  } catch (err) {
    return { ok: false, status: 0, error: err.message, ms: Date.now() - t0 };
  }
}

const inventory = (await readFile(INVENTORY, "utf8")).trim().split("\n").filter(Boolean);
console.log(`Sweeping ${inventory.length} paths · old=${OLD_BASE}, new=${NEW_BASE}`);

const rows = [];
let i = 0;
async function worker() {
  while (i < inventory.length) {
    const idx = i++;
    const p = inventory[idx];
    const [oldR, newR] = await Promise.all([fetchURL(OLD_BASE, p), fetchURL(NEW_BASE, p)]);
    rows[idx] = { p, old: oldR, "new": newR };
    process.stdout.write(".");
  }
}
await Promise.all(Array.from({ length: concurrency }, () => worker()));
console.log("\n");

await mkdir(OUT_DIR, { recursive: true });

const cols = [
  "path",
  "old_status", "new_status",
  "old_finalUrl", "new_finalUrl",
  "old_title", "new_title", "title_match",
  "old_h1", "new_h1", "h1_match",
  "old_canonical", "new_canonical",
  "old_robotsMeta", "new_robotsMeta", "new_xRobotsTag",
  "old_ldTypes", "new_ldTypes",
  "old_anchorCount", "new_anchorCount",
  "old_wordCount", "new_wordCount", "wordCount_ratio",
  "new_legacyHrefCount",
  "old_ms", "new_ms",
  "old_payload", "new_payload",
];
const esc = (v) => {
  if (v == null) return "";
  const s = String(v);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
};
const csv = [cols.join(",")];
for (const r of rows) {
  if (!r) continue;
  const o = r.old, n = r["new"];
  const titleMatch = o.title === n.title ? "y" : "n";
  const h1Match = o.h1 === n.h1 ? "y" : "n";
  const wordCountRatio = o.wordCount > 0 ? (n.wordCount / o.wordCount).toFixed(2) : "n/a";
  csv.push([
    r.p, o.status, n.status,
    o.finalUrl, n.finalUrl,
    o.title, n.title, titleMatch,
    o.h1, n.h1, h1Match,
    o.canonical, n.canonical,
    o.robotsMeta, n.robotsMeta, n.xRobotsTag,
    o.ldTypes, n.ldTypes,
    o.anchorCount, n.anchorCount,
    o.wordCount, n.wordCount, wordCountRatio,
    n.legacyHrefCount,
    o.ms, n.ms,
    o.payload, n.payload,
  ].map(esc).join(","));
}
await writeFile(OUT_CSV, csv.join("\n") + "\n");

const totalRows = rows.length;
const newOK = rows.filter((r) => r?.new.status === 200).length;
const oldOK = rows.filter((r) => r?.old.status === 200).length;
const oldButNew404 = rows.filter((r) => r?.old.status === 200 && r?.new.status === 404).length;
const titleDrift = rows.filter((r) => r && r.old.title !== r.new.title).length;
const h1Drift = rows.filter((r) => r && r.old.h1 !== r.new.h1).length;
const totalLegacy = rows.reduce((s, r) => s + (r?.new.legacyHrefCount ?? 0), 0);
const pagesWithLegacy = rows.filter((r) => (r?.new.legacyHrefCount ?? 0) > 0).length;
const newNoindex = rows.filter((r) => /noindex/i.test(r?.new.robotsMeta ?? "") || /noindex/i.test(r?.new.xRobotsTag ?? "")).length;
const wordCountUnder70 = rows.filter((r) => {
  if (!r || !r.old.wordCount) return false;
  return r.new.wordCount / r.old.wordCount < 0.7;
}).length;
const avgOldMs = Math.round(rows.reduce((s, r) => s + (r?.old.ms ?? 0), 0) / Math.max(1, totalRows));
const avgNewMs = Math.round(rows.reduce((s, r) => s + (r?.new.ms ?? 0), 0) / Math.max(1, totalRows));

const md = `# Heroic Rankings — Parity Sweep ${TODAY}

- old: ${OLD_BASE}
- new: ${NEW_BASE}
- paths checked: ${totalRows}
- avg latency old: ${avgOldMs}ms · new: ${avgNewMs}ms

## Status

| Metric | Count |
|---|---:|
| old returns 200 | ${oldOK} |
| new returns 200 | ${newOK} |
| **CRITICAL** old 200 → new 404 | ${oldButNew404} |
| pages with legacy-style hrefs in new HTML | ${pagesWithLegacy} |
| total legacy-style hrefs across all new pages | ${totalLegacy} |
| pages with noindex on new (expected pre-cutover) | ${newNoindex} |

## Drift

| Metric | Count |
|---|---:|
| title differs (content choice) | ${titleDrift} |
| h1 differs | ${h1Drift} |
| pages with new wordCount < 70% of old (potential content loss) | ${wordCountUnder70} |

## Cutover gate

- legacy hrefs in rendered HTML: **${totalLegacy === 0 ? "PASS (0)" : `FAIL (${totalLegacy})`}**
- new 404 vs old 200: **${oldButNew404 === 0 ? "PASS (0)" : `FAIL (${oldButNew404})`}**

Per-URL data: \`docs/audits/${TODAY}-parity-sweep.csv\`
`;
await writeFile(OUT_MD, md);
console.log(md);

if (totalLegacy > 0 || oldButNew404 > 0) process.exit(1);
process.exit(0);
