#!/usr/bin/env node
/**
 * Deprecated compatibility wrapper.
 *
 * The legacy seed script fell out of sync with the active Sanity schema
 * (notably FAQ `servicePage` shape and team member contact/social fields).
 * Keep this entrypoint for backward compatibility, but delegate all work to
 * the canonical script that is maintained with current schema contracts.
 *
 * Usage:
 *   node scripts/seed-sanity.mjs
 *   node scripts/seed-sanity.mjs --dry-run
 */

import { spawnSync } from "node:child_process";
import process from "node:process";
import { resolve } from "node:path";

const canonicalSeedScript = resolve(process.cwd(), "scripts/seed-all-content.mjs");
const args = process.argv.slice(2);

console.warn("[seed-sanity] Deprecated entrypoint.");
console.warn("[seed-sanity] Forwarding execution to scripts/seed-all-content.mjs.");

const result = spawnSync(process.execPath, [canonicalSeedScript, ...args], {
  stdio: "inherit",
  env: process.env,
});

if (result.error) {
  console.error("[seed-sanity] Failed to start canonical seed script:", result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 0);
