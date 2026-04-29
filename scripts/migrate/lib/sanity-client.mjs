/**
 * Shared @sanity/client write client for the BCMS to Sanity migration suite.
 *
 * Token resolution mirrors scripts/seed-audit-fixtures.mjs:
 *   1. SANITY_AUTH_TOKEN  (preferred — task spec)
 *   2. SANITY_API_WRITE_TOKEN
 *   3. .env.local SANITY_API_WRITE_TOKEN
 *   4. ~/.config/sanity/config.json (Sanity CLI auth)
 */

import { createClient } from "@sanity/client";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

export const PROJECT_ID = "5cr26y9m";
export const DATASET = "production";
export const API_VERSION = "2026-02-19";

export function resolveWriteToken() {
  if (process.env.SANITY_AUTH_TOKEN) return process.env.SANITY_AUTH_TOKEN;
  if (process.env.SANITY_API_WRITE_TOKEN) return process.env.SANITY_API_WRITE_TOKEN;

  try {
    const envLocal = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
    const match = envLocal.match(/SANITY_API_WRITE_TOKEN="?([^"\n]+)"?/);
    if (match) return match[1];
  } catch {
    // .env.local missing — fall through.
  }

  try {
    const configPath = resolve(process.env.HOME ?? "", ".config/sanity/config.json");
    const config = JSON.parse(readFileSync(configPath, "utf8"));
    if (config.authToken) return config.authToken;
  } catch {
    // Sanity CLI config missing — fall through.
  }

  return null;
}

let _client = null;

/**
 * Lazy singleton write client. Returns null if no token resolves; callers
 * decide whether that is fatal (live run) or acceptable (--dry-run).
 */
export function getSanityClient(options = {}) {
  if (_client) return _client;
  const token = resolveWriteToken();
  if (!token) return null;
  _client = createClient({
    projectId: PROJECT_ID,
    dataset: DATASET,
    apiVersion: API_VERSION,
    token,
    useCdn: false,
    ...options,
  });
  return _client;
}

/**
 * Reset the cached client. Used by tests or when running multiple modes
 * in one process.
 */
export function resetSanityClient() {
  _client = null;
}
