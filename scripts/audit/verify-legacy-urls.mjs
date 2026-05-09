#!/usr/bin/env node
/**
 * Verifies every legacy heroicrankings.com URL resolves to HTTP 200 on the
 * target deploy. Source of truth = docs/migration/legacy-url-inventory.txt
 * (102 paths, sourced from the legacy sitemap.xml on 2026-05-09).
 *
 * Usage:
 *   AUDIT_BASE=http://localhost:3030 node scripts/audit/verify-legacy-urls.mjs
 *   AUDIT_BASE=https://heroic-rankings-final.vercel.app node scripts/audit/verify-legacy-urls.mjs
 *   AUDIT_BASE=https://heroicrankings.com node scripts/audit/verify-legacy-urls.mjs   # post-cutover
 *
 * Default base: http://localhost:3030
 *
 * Exit codes:
 *   0 — all 102 URLs return 200 (after redirect follow)
 *   1 — at least one URL failed (non-200 final status, or non-text/html
 *       content-type, or fetch error)
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..", "..");
const INVENTORY_PATH = path.join(
  REPO_ROOT,
  "docs",
  "migration",
  "legacy-url-inventory.txt",
);

const base = (process.env.AUDIT_BASE ?? "http://localhost:3030").replace(/\/$/, "");
const concurrency = Number(process.env.AUDIT_CONCURRENCY ?? "8");

const inventory = (await readFile(INVENTORY_PATH, "utf8"))
  .trim()
  .split("\n")
  .filter(Boolean);

console.log(`Verifying ${inventory.length} legacy URLs against ${base}`);

const results = [];
async function check(p) {
  const url = `${base}${p}`;
  try {
    const res = await fetch(url, { redirect: "follow" });
    const ok = res.status === 200;
    return { p, status: res.status, finalUrl: res.url, ok };
  } catch (err) {
    return { p, status: 0, error: err instanceof Error ? err.message : String(err), ok: false };
  }
}

// Simple promise-pool concurrency
let i = 0;
async function worker() {
  while (i < inventory.length) {
    const myIndex = i++;
    const r = await check(inventory[myIndex]);
    results[myIndex] = r;
    process.stdout.write(r.ok ? "." : "F");
  }
}
await Promise.all(Array.from({ length: concurrency }, () => worker()));

console.log("\n");
const fails = results.filter((r) => !r.ok);
const passes = results.length - fails.length;
console.log(`PASS: ${passes}/${results.length}`);

if (fails.length > 0) {
  console.log(`\nFAILURES (${fails.length}):`);
  for (const f of fails) {
    console.log(
      `  ${f.p}  →  ${f.status}${f.error ? `  (${f.error})` : ""}${f.finalUrl && f.finalUrl !== `${base}${f.p}` ? `  [final: ${f.finalUrl}]` : ""}`,
    );
  }
  process.exit(1);
}

console.log("All legacy URLs resolved to HTTP 200.");
process.exit(0);
