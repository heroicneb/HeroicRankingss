#!/usr/bin/env node
/**
 * Sweeps every URL in docs/migration/legacy-url-inventory.txt and counts
 * legacy-style anchor hrefs in the rendered HTML. Cutover gate per Codex
 * adversarial audit Check #10 — must report 0 violations across all 102
 * paths.
 *
 * Usage:
 *   AUDIT_BASE=https://heroic-rankings-final.vercel.app \
 *     node scripts/audit/verify-no-legacy-hrefs.mjs
 *
 * Default base: http://localhost:3030
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..", "..");
const INVENTORY = path.join(
  REPO_ROOT,
  "docs",
  "migration",
  "legacy-url-inventory.txt",
);

const base = (process.env.AUDIT_BASE ?? "http://localhost:3030").replace(/\/$/, "");
const concurrency = Number(process.env.AUDIT_CONCURRENCY ?? "8");

// Patterns that should NEVER appear in rendered HTML hrefs (route URLs).
// Asset paths under /public/ that happen to share a folder name (e.g.
// `/case-studies/imgGroup44.svg`, `/insights/imgSubtract1.png`) are
// excluded via negative lookahead — they're file assets, not routes.
const ASSET_EXT = String.raw`(?:\.svg|\.png|\.jpg|\.jpeg|\.webp|\.gif|\.ico|\.json|\.xml)`;
function legacyPattern(prefix) {
  // href="<prefix>" OR href="<prefix>/" OR href="<prefix>/<not-an-asset>"
  return new RegExp(
    `href="${prefix}(?:/?(?!${ASSET_EXT})|/[^"]*?(?<!${ASSET_EXT}))"`,
    "g",
  );
}
const LEGACY_PATTERNS = [
  legacyPattern("/about-us"),
  legacyPattern("/seo-services"),
  legacyPattern("/technical-seo"),
  legacyPattern("/on-page-seo"),
  legacyPattern("/local-seo"),
  legacyPattern("/ecommerce-seo"),
  legacyPattern("/content-creation"),
  legacyPattern("/keyword-strategy"),
  legacyPattern("/link-building"),
  legacyPattern("/insights"),
  legacyPattern("/case-studies"),
  // /team/ — this exact prefix is route-only (no public/team/ assets).
  /href="\/team\/[^"]*"/g,
];

const inventory = (await readFile(INVENTORY, "utf8"))
  .trim()
  .split("\n")
  .filter(Boolean);

console.log(`Sweeping ${inventory.length} pages on ${base} for legacy-style hrefs`);

const results = [];
let i = 0;
async function worker() {
  while (i < inventory.length) {
    const idx = i++;
    const p = inventory[idx];
    const url = `${base}${p}?t=${Date.now()}${idx}`;
    try {
      const res = await fetch(url, { redirect: "follow" });
      const html = await res.text();
      const counts = LEGACY_PATTERNS.reduce((sum, re) => {
        const matches = html.match(re);
        return sum + (matches ? matches.length : 0);
      }, 0);
      results[idx] = { p, status: res.status, hits: counts };
      process.stdout.write(counts === 0 ? "." : "F");
    } catch (err) {
      results[idx] = { p, status: 0, hits: -1, error: err.message };
      process.stdout.write("E");
    }
  }
}
await Promise.all(Array.from({ length: concurrency }, () => worker()));

console.log("\n");
const fails = results.filter((r) => r.hits !== 0);
const totalHits = results.reduce((sum, r) => sum + Math.max(0, r.hits), 0);

console.log(`PASS: ${results.length - fails.length}/${results.length} pages clean`);
console.log(`Total legacy-href hits: ${totalHits}`);

if (fails.length > 0) {
  console.log(`\nFAIL DETAIL (${fails.length} pages):`);
  for (const f of fails.slice(0, 20)) {
    console.log(`  ${f.p}  →  status ${f.status}, ${f.hits} hits${f.error ? `  (${f.error})` : ""}`);
  }
  if (fails.length > 20) console.log(`  … ${fails.length - 20} more`);
  process.exit(1);
}

console.log("All pages clean — zero legacy-style hrefs in rendered HTML.");
process.exit(0);
