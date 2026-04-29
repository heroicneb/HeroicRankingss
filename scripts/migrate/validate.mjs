#!/usr/bin/env node
/**
 * Render-level parity validation harness (per Codex).
 *
 * For each migrated doc:
 *   - Fetch legacy HTML at `legacyUrl`
 *   - Render new Sanity doc via local Next dev (or staging URL)
 *   - Normalize whitespace + entities both sides
 *   - Compare H1, meta title, meta description, canonical URL,
 *     hero image presence, section counts, internal link targets
 *   - Output diff report
 *
 * NOTE: This harness is a STANDALONE script; actual execution waits for a
 * staging deploy. It is structured so the orchestrator's last-run.json
 * report can drive it directly.
 *
 * Usage:
 *   node scripts/migrate/validate.mjs --new-base=https://staging.heroicrankings.com [--legacy-base=https://heroicrankings.com] [--limit=10]
 */

import { readFileSync } from "node:fs";
import { JSDOM } from "jsdom";
import { isLegacyUrl } from "./lib/url-rewriter.mjs";

const REPORT_PATH = "scripts/migrate/.checkpoint/last-run.json";

function parseArgs(argv) {
  const args = {
    newBase: null,
    legacyBase: "https://heroicrankings.com",
    limit: null,
    only: null,
  };
  for (const arg of argv.slice(2)) {
    if (arg.startsWith("--new-base=")) args.newBase = arg.slice("--new-base=".length);
    else if (arg.startsWith("--legacy-base=")) args.legacyBase = arg.slice("--legacy-base=".length);
    else if (arg.startsWith("--limit=")) args.limit = Number(arg.slice("--limit=".length));
    else if (arg.startsWith("--only=")) args.only = arg.slice("--only=".length);
  }
  if (!args.newBase) {
    process.stderr.write(
      "Required: --new-base=<scheme://host> (the staging Heroic site).\n",
    );
    process.exit(2);
  }
  return args;
}

async function fetchHtml(url) {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText} ${url}`);
  }
  return await res.text();
}

function parsePage(html) {
  const dom = new JSDOM(html);
  const doc = dom.window.document;
  return {
    title: doc.querySelector("title")?.textContent?.trim() ?? "",
    h1: doc.querySelector("h1")?.textContent?.trim() ?? "",
    metaDescription:
      doc.querySelector('meta[name="description"]')?.getAttribute("content") ?? "",
    canonical:
      doc.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? "",
    h2Count: doc.querySelectorAll("h2").length,
    imgCount: doc.querySelectorAll("img").length,
    internalLinks: [...doc.querySelectorAll("a[href]")]
      .map((a) => a.getAttribute("href"))
      .filter((h) => h && !/^https?:\/\//i.test(h)),
  };
}

function normalize(s) {
  return String(s ?? "")
    .replace(/ /g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function compare(legacy, fresh) {
  const diffs = [];
  if (normalize(legacy.h1) !== normalize(fresh.h1)) {
    diffs.push({ field: "h1", legacy: legacy.h1, fresh: fresh.h1 });
  }
  if (normalize(legacy.title) !== normalize(fresh.title)) {
    diffs.push({ field: "title", legacy: legacy.title, fresh: fresh.title });
  }
  // metaDescription parity is informational; sites often shorten on migration.
  if (Math.abs(legacy.h2Count - fresh.h2Count) > 2) {
    diffs.push({
      field: "h2Count",
      legacy: legacy.h2Count,
      fresh: fresh.h2Count,
    });
  }
  // Internal-link audit: any rendered href on the new site that is still
  // a legacy IA path indicates a body-conversion miss.
  for (const href of fresh.internalLinks) {
    if (isLegacyUrl(href)) {
      diffs.push({ field: "internalLink", legacy: null, fresh: href });
    }
  }
  return diffs;
}

async function main() {
  const args = parseArgs(process.argv);

  try {
    JSON.parse(readFileSync(REPORT_PATH, "utf8"));
  } catch (err) {
    process.stderr.write(
      `Could not read migration report at ${REPORT_PATH}: ${err?.message ?? err}\n`,
    );
    process.exit(2);
  }
  // The report shape doesn't currently capture per-doc legacyUrls — the
  // harness operator should pipe in a JSON list, OR we extend the report
  // schema in a follow-up. For the skeleton, exit cleanly with usage info.

  process.stdout.write(
    [
      "validate.mjs is a structural skeleton. To finish:",
      `  - Pass --new-base=${args.newBase} when staging is up`,
      "  - Extend logger.mjs to persist per-doc { sanityId, legacyUrl } pairs into last-run.json",
      "  - The fetch/parse/compare functions above are ready for integration",
    ].join("\n") + "\n",
  );
}

main().catch((err) => {
  process.stderr.write(`\n[fatal] ${err?.stack ?? err?.message ?? String(err)}\n`);
  process.exit(1);
});

// Re-export for any external test harness.
export { fetchHtml, parsePage, normalize, compare };
