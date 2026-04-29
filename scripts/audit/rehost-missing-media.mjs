#!/usr/bin/env node
/**
 * Re-host any BCMS media IDs that appeared in legacy rendered HTML but were
 * NOT picked up by the API-first migration.
 *
 * Reads scripts/audit/media-parity-report.json for the missing list, fetches
 * each via BCMS CDN, uploads to Sanity asset registry. Idempotent — already-
 * registered assets are skipped.
 *
 * Usage:
 *   BCMS_API_KEY=<id.secret.instanceId> SANITY_AUTH_TOKEN=<token> \
 *     node scripts/audit/rehost-missing-media.mjs
 */

import { readFileSync } from "node:fs";
import { createBcmsClient } from "../migrate/lib/bcms-client.mjs";
import { createAssetRegistry } from "../migrate/lib/asset-registry.mjs";
import { getSanityClient } from "../migrate/lib/sanity-client.mjs";

const report = JSON.parse(readFileSync("scripts/audit/media-parity-report.json", "utf8"));
const missingIds = report.missing_ids ?? [];

if (missingIds.length === 0) {
  console.log("No missing media. Migration parity is 100%.");
  process.exit(0);
}

console.log(`Re-hosting ${missingIds.length} missing BCMS media items...\n`);

const bcms = createBcmsClient();
const sanity = getSanityClient();
const registry = createAssetRegistry({ bcmsClient: bcms, sanityClient: sanity });

let processed = 0;
let failed = 0;
for (const id of missingIds) {
  try {
    const media = await bcms.getMedia(id);
    if (!media || media.type !== "IMG") {
      console.log(`  SKIP  ${id}  type=${media?.type ?? "(unknown)"}`);
      continue;
    }
    const sanityAssetId = await registry.ensureAsset(media);
    processed++;
    console.log(`  ✓  ${id}  ${media.name}  →  ${sanityAssetId}`);
  } catch (err) {
    failed++;
    console.log(`  ✗  ${id}  ${err.message}`);
  }
}

console.log(`\nProcessed: ${processed}, failed: ${failed}`);
