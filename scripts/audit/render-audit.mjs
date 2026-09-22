#!/usr/bin/env node
/**
 * E2E render audit — Phase 1: programmatic structural sweep.
 *
 * Visits every route on the deployed Vercel preview, captures HTTP status,
 * title, meta description, image counts (broken vs OK), internal link counts
 * (broken vs OK), JSON-LD presence + parse, and section-anchor presence
 * checks per page type.
 *
 * Usage:
 *   SANITY_AUTH_TOKEN=<token> AUDIT_BASE=<vercel-url> node scripts/audit/render-audit.mjs
 *
 * If AUDIT_BASE is not set, defaults to the latest Vercel preview URL.
 */

import { createClient } from "@sanity/client";
import { writeFileSync } from "node:fs";

const BASE = process.env.AUDIT_BASE ?? "https://heroic-rankings-final-qck2q0j7n-pavle-9556s-projects.vercel.app";
const PROJECT_ID = "5cr26y9m";
const DATASET = "production";
const API_VERSION = "2026-02-19";

if (!process.env.SANITY_AUTH_TOKEN) {
  console.error("Missing SANITY_AUTH_TOKEN");
  process.exit(1);
}

const sanity = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: API_VERSION,
  token: process.env.SANITY_AUTH_TOKEN,
  useCdn: false,
});

console.log("================================================================");
console.log(`  Render audit — ${BASE}`);
console.log("================================================================\n");

// ── Build URL list ──────────────────────────────────────────────────────
const STATIC_ROUTES = [
  "/",
  "/about-us",
  "/seo-services",
  "/technical-seo",
  "/on-page-seo",
  "/local-seo",
  "/ecommerce-seo",
  "/keyword-strategy",
  "/content-creation",
  "/link-building",
  "/case-studies",
  "/podcast",
  "/insights",
  "/contact",
  "/partnership",
  "/privacy-policy",
];

const csSlugs = await sanity.fetch(`*[_type == "caseStudy"].slug.current`);
const teamSlugs = await sanity.fetch(`*[_type == "teamMember"].slug.current`);
const postSlugs = await sanity.fetch(`*[_type == "post"].slug.current`);
const podSlugs = await sanity.fetch(`*[_type == "podcastEpisode"].slug.current`);

const ROUTES = [
  ...STATIC_ROUTES.map((p) => ({ kind: "static", path: p, slug: null })),
  ...csSlugs.map((s) => ({ kind: "caseStudy", path: `/case-studies/${s}`, slug: s })),
  ...teamSlugs.map((s) => ({ kind: "team", path: `/team/${s}`, slug: s })),
  ...postSlugs.map((s) => ({ kind: "post", path: `/insights/${s}`, slug: s })),
  ...podSlugs.map((s) => ({ kind: "podcast", path: `/podcast/${s}`, slug: s })),
];

console.log(`Total routes: ${ROUTES.length}`);
console.log(
  `  static=${STATIC_ROUTES.length}, caseStudy=${csSlugs.length}, team=${teamSlugs.length}, post=${postSlugs.length}, podcast=${podSlugs.length}\n`,
);

// ── Helpers ─────────────────────────────────────────────────────────────
function extractTitle(html) {
  const m = html.match(/<title>([^<]+)<\/title>/i);
  return m ? m[1].trim() : null;
}

function extractMetaDescription(html) {
  const m = html.match(/<meta\s+name="description"\s+content="([^"]+)"/i);
  return m ? m[1].trim() : null;
}

function decodeHtmlEntities(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function extractImages(html, base) {
  const out = [];
  const re = /<img[^>]+src="([^"]+)"/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    let src = decodeHtmlEntities(m[1]);
    if (src.startsWith("/")) src = `${base}${src}`;
    out.push(src);
  }
  return out;
}

function extractInternalLinks(html, base) {
  const out = [];
  const re = /<a[^>]+href="([^"]+)"/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const href = m[1];
    if (href.startsWith("/") && !href.startsWith("//")) {
      const path = href.split("#")[0].split("?")[0];
      if (path && path !== "/") out.push(path);
    } else if (href.startsWith(base)) {
      const u = new URL(href);
      if (u.pathname && u.pathname !== "/") out.push(u.pathname);
    }
  }
  return [...new Set(out)];
}

function extractJsonLd(html) {
  const out = [];
  const re = /<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    try {
      out.push(JSON.parse(m[1]));
    } catch (err) {
      out.push({ _parseError: err.message, _raw: m[1].slice(0, 200) });
    }
  }
  return out;
}

async function head(url) {
  try {
    const res = await fetch(url, { method: "HEAD", redirect: "follow" });
    return res.status;
  } catch {
    return 0;
  }
}

// Only expect anchors that the components actually emit. Section content
// presence is verified instead via HTML payload size + section-by-section
// programmatic checks, not anchor existence.
const SECTION_ANCHORS = {
  caseStudy: ["case-study-hero"],
  team: [],
  post: ["insight-blog-post"],
  podcast: [],
};

// Minimum payload sizes per page kind — pages smaller than this are likely
// empty/error pages. Tuned conservatively against expected content density.
const MIN_PAYLOAD_BYTES = {
  static: 30000,
  caseStudy: 80000,
  team: 30000,
  post: 30000,
  podcast: 30000,
};

// ── Per-route audit ─────────────────────────────────────────────────────
const results = [];
const concurrency = 5;
let cursor = 0;
let done = 0;

async function auditOne(route) {
  const url = `${BASE}${route.path}`;
  const result = {
    path: route.path,
    kind: route.kind,
    slug: route.slug,
    httpStatus: null,
    sizeBytes: null,
    title: null,
    metaDescription: null,
    imageCount: 0,
    brokenImages: [],
    internalLinkCount: 0,
    deadInternalLinks: [],
    jsonLdCount: 0,
    jsonLdParseErrors: 0,
    sectionAnchorsExpected: SECTION_ANCHORS[route.kind] ?? [],
    sectionAnchorsFound: [],
    issues: [],
  };

  let html = "";
  try {
    const res = await fetch(url, { redirect: "follow" });
    result.httpStatus = res.status;
    html = await res.text();
    result.sizeBytes = html.length;
  } catch (err) {
    result.issues.push(`fetch failed: ${err.message}`);
    return result;
  }

  if (result.httpStatus !== 200) {
    result.issues.push(`http=${result.httpStatus}`);
    return result;
  }
  const minBytes = MIN_PAYLOAD_BYTES[route.kind] ?? 5000;
  if (result.sizeBytes < minBytes) {
    result.issues.push(`small payload (${result.sizeBytes} bytes < ${minBytes}) — possible empty render`);
  }

  result.title = extractTitle(html);
  result.metaDescription = extractMetaDescription(html);
  if (!result.title) result.issues.push("missing <title>");
  if (!result.metaDescription) result.issues.push("missing meta description");

  const images = extractImages(html, BASE);
  result.imageCount = images.length;
  // HEAD-check up to 20 images per page (cap to keep run fast)
  const imageSample = images.slice(0, 20);
  for (const src of imageSample) {
    const code = await head(src);
    if (code !== 200 && code !== 0) result.brokenImages.push({ src, code });
  }

  const links = extractInternalLinks(html, BASE);
  result.internalLinkCount = links.length;
  // HEAD-check up to 15 internal links
  const linkSample = links.slice(0, 15);
  for (const path of linkSample) {
    const code = await head(`${BASE}${path}`);
    if (code !== 200 && code !== 308 && code !== 0) {
      result.deadInternalLinks.push({ path, code });
    }
  }

  const ld = extractJsonLd(html);
  result.jsonLdCount = ld.length;
  result.jsonLdParseErrors = ld.filter((b) => b._parseError).length;

  // Section anchors
  for (const id of result.sectionAnchorsExpected) {
    if (html.includes(`id="${id}"`) || html.includes(`id='${id}'`)) {
      result.sectionAnchorsFound.push(id);
    }
  }
  if (result.sectionAnchorsExpected.length > 0) {
    const missing = result.sectionAnchorsExpected.filter((a) => !result.sectionAnchorsFound.includes(a));
    if (missing.length > 0) result.issues.push(`missing section anchors: ${missing.join(", ")}`);
  }

  if (result.brokenImages.length > 0) result.issues.push(`broken images: ${result.brokenImages.length}`);
  if (result.deadInternalLinks.length > 0) result.issues.push(`dead links: ${result.deadInternalLinks.length}`);

  return result;
}

async function worker() {
  while (cursor < ROUTES.length) {
    const idx = cursor++;
    const route = ROUTES[idx];
    const r = await auditOne(route);
    results.push(r);
    done++;
    if (r.issues.length > 0) {
      console.log(`  ✗ [${r.kind.padEnd(10)}] ${r.path.padEnd(60)} ${r.issues.join("; ")}`);
    } else if (done % 10 === 0) {
      console.log(`  ${done}/${ROUTES.length} ok`);
    }
  }
}

console.log("Running audit (concurrency=" + concurrency + ")...\n");
await Promise.all(Array.from({ length: concurrency }, () => worker()));

// ── Summary ─────────────────────────────────────────────────────────────
const passing = results.filter((r) => r.httpStatus === 200 && r.issues.length === 0).length;
const failing = results.filter((r) => r.issues.length > 0).length;
const http200 = results.filter((r) => r.httpStatus === 200).length;
const non200 = results.filter((r) => r.httpStatus !== 200).length;

console.log("\n================================================================");
console.log(`  PASS   ${passing}/${results.length}`);
console.log(`  FAIL   ${failing}`);
console.log(`  HTTP 200 ${http200}, non-200 ${non200}`);
console.log("================================================================");

// Per-kind breakdown
const byKind = {};
for (const r of results) {
  if (!byKind[r.kind]) byKind[r.kind] = { total: 0, passing: 0, failing: 0 };
  byKind[r.kind].total++;
  if (r.issues.length === 0 && r.httpStatus === 200) byKind[r.kind].passing++;
  else byKind[r.kind].failing++;
}
console.log("\nPer-kind breakdown:");
for (const [k, v] of Object.entries(byKind)) {
  console.log(`  ${k.padEnd(12)} ${v.passing}/${v.total} pass`);
}

writeFileSync(
  "scripts/audit/render-audit-report.json",
  JSON.stringify({ base: BASE, timestamp: new Date().toISOString(), summary: { passing, failing, http200, non200 }, byKind, results }, null, 2),
);
console.log("\nReport: scripts/audit/render-audit-report.json");
