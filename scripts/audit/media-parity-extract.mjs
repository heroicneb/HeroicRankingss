#!/usr/bin/env node
/**
 * HTML media parity extractor.
 *
 * For every migrated Sanity doc with a legacyUrl, fetches the legacy page,
 * regex-extracts every BCMS media _id referenced from cdn.thebcms.com/.../media/<id>/...,
 * and cross-checks against the Sanity asset registry.
 *
 * Surfaces media that is RENDERED on the legacy site but NOT migrated —
 * the deepest possible media-coverage paranoia check.
 *
 * Usage:
 *   SANITY_AUTH_TOKEN=<token> node scripts/audit/media-parity-extract.mjs
 */

import { createClient } from "@sanity/client";
import { writeFileSync } from "node:fs";

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
console.log("  HTML Media Parity Extractor");
console.log("  Cross-checks rendered legacy HTML against migrated Sanity assets");
console.log("================================================================\n");

// 1. Pull every migrated doc — derive correct legacy URL from the legacy
// sitemap rather than trusting the recorded value (mapper used /blog/<slug>/
// which 404s; real URL is /seo/<category>/<slug>/).
const docs = await sanity.fetch(
  `*[_id match "migrate-*" && defined(slug.current)]{
    _id,
    _type,
    "slug": slug.current,
    "legacyUrl": migrationSource.legacyUrl
  }`,
);
console.log(`Migrated docs: ${docs.length}`);

// Pull real legacy URLs from sitemap.xml + build slug → URL map
console.log(`Fetching legacy sitemap...`);
const sitemapXml = await fetch("https://heroicrankings.com/sitemap.xml").then(
  (r) => r.text(),
);
const sitemapUrls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
  (m) => m[1],
);
console.log(`Sitemap URLs: ${sitemapUrls.length}`);

// Build slug → canonical legacy URL map
const slugToLegacyUrl = new Map();
for (const url of sitemapUrls) {
  const trimmed = url.replace(/\/$/, "");
  const slug = trimmed.split("/").pop();
  if (slug) slugToLegacyUrl.set(slug, url);
}

// Override docs.legacyUrl with sitemap-derived URL where available
for (const doc of docs) {
  const sitemapUrl = slugToLegacyUrl.get(doc.slug);
  if (sitemapUrl) doc.legacyUrl = sitemapUrl;
}
const docsWithUrl = docs.filter((d) => d.legacyUrl);
console.log(`Docs with usable legacy URL (after sitemap remap): ${docsWithUrl.length}`);
docs.length = 0;
docs.push(...docsWithUrl);

// 2. Pull every Sanity asset that originated from BCMS migration
const sanityAssets = await sanity.fetch(
  `*[_type == "sanity.imageAsset" && defined(source.id)]{ _id, "sourceId": source.id }`,
);
const sanityAssetByBcmsId = new Map();
for (const a of sanityAssets) {
  // source.id was set by the asset-registry to the BCMS media _id
  sanityAssetByBcmsId.set(a.sourceId, a._id);
}
console.log(`Sanity assets with BCMS source: ${sanityAssetByBcmsId.size}`);

// 3. For each migrated doc, fetch legacy HTML, extract BCMS media IDs
const MEDIA_ID_REGEX = /cdn\.thebcms\.com\/api\/v3\/org\/[a-f0-9]+\/instance\/[a-f0-9]+\/media\/([a-f0-9]+)\//gi;

const renderedMediaByDoc = new Map();
const allRenderedIds = new Set();
let fetchedCount = 0;
let failedCount = 0;

console.log(`\nFetching ${docs.length} legacy pages...\n`);

const concurrency = 5;
let cursor = 0;
async function worker() {
  while (cursor < docs.length) {
    const idx = cursor++;
    const doc = docs[idx];
    try {
      const res = await fetch(doc.legacyUrl, { redirect: "follow" });
      if (!res.ok) {
        console.log(`  ${res.status}  ${doc.legacyUrl}`);
        failedCount++;
        continue;
      }
      const html = await res.text();
      const ids = new Set();
      let match;
      while ((match = MEDIA_ID_REGEX.exec(html)) !== null) {
        ids.add(match[1]);
        allRenderedIds.add(match[1]);
      }
      renderedMediaByDoc.set(doc._id, [...ids]);
      fetchedCount++;
      if (fetchedCount % 10 === 0) {
        process.stdout.write(`  ${fetchedCount}/${docs.length} fetched\n`);
      }
    } catch (err) {
      console.log(`  ERR  ${doc.legacyUrl} :: ${err.message}`);
      failedCount++;
    }
  }
}
await Promise.all(Array.from({ length: concurrency }, () => worker()));
console.log(`\nFetched ${fetchedCount}, failed ${failedCount}`);

// 4. Diff: media IDs in rendered HTML but NOT in Sanity asset registry
const missing = [];
for (const id of allRenderedIds) {
  if (!sanityAssetByBcmsId.has(id)) missing.push(id);
}

console.log(`\n========== RESULT ==========`);
console.log(`Total unique BCMS media IDs in legacy HTML: ${allRenderedIds.size}`);
console.log(`Already migrated: ${allRenderedIds.size - missing.length}`);
console.log(`MISSING: ${missing.length}`);

if (missing.length > 0) {
  console.log(`\nFirst 30 missing IDs:`);
  for (const id of missing.slice(0, 30)) console.log(`  ${id}`);
}

// 5. Per-doc breakdown of missing assets (so we know which entries to re-map)
const docsWithMissing = [];
for (const [docId, ids] of renderedMediaByDoc.entries()) {
  const missingForDoc = ids.filter((id) => !sanityAssetByBcmsId.has(id));
  if (missingForDoc.length > 0) {
    const doc = docs.find((d) => d._id === docId);
    docsWithMissing.push({
      docId,
      type: doc?._type,
      slug: doc?.slug,
      legacyUrl: doc?.legacyUrl,
      missing_count: missingForDoc.length,
      missing_ids: missingForDoc,
    });
  }
}

if (docsWithMissing.length > 0) {
  console.log(`\nDocs with missing assets: ${docsWithMissing.length}`);
  for (const d of docsWithMissing.slice(0, 20)) {
    console.log(`  [${d.type}] ${d.slug}  missing=${d.missing_count}`);
  }
}

writeFileSync(
  "scripts/audit/media-parity-report.json",
  JSON.stringify(
    {
      timestamp: new Date().toISOString(),
      summary: {
        docs_checked: fetchedCount,
        docs_failed: failedCount,
        unique_rendered_media_ids: allRenderedIds.size,
        already_migrated: allRenderedIds.size - missing.length,
        missing: missing.length,
      },
      missing_ids: missing,
      docs_with_missing: docsWithMissing,
    },
    null,
    2,
  ),
);

console.log(`\nReport: scripts/audit/media-parity-report.json`);
