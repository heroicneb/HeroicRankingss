/**
 * migrationSource provenance object — Codex spec.
 *
 * Every migrated Sanity doc carries a top-level `migrationSource` field with:
 *   - provider, template, bcmsId, legacyUrl
 *   - sourceChecksum, lastAppliedOwnedChecksum
 *   - importedAt, sourceUpdatedAt, sourceLocale, sourceStatus
 *   - ownedPaths, assetIds, unmappedFields
 */

import { createHash } from "node:crypto";

/**
 * Stable JSON stringify — deterministic key order for hashing.
 */
export function stableStringify(value) {
  if (value === null) return "null";
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (typeof value === "string") return JSON.stringify(value);
  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(",")}]`;
  }
  if (typeof value === "object") {
    const keys = Object.keys(value).sort();
    return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(value[k])}`).join(",")}}`;
  }
  return JSON.stringify(value ?? null);
}

/**
 * Strip volatile fields from a BCMS entry payload before hashing.
 * Keeps the content-shaped subset that drives downstream Sanity output.
 */
export function normalizeBcmsForChecksum(entry) {
  if (!entry || typeof entry !== "object") return entry;
  const meta = entry.meta?.en ?? null;
  return {
    bcmsId: entry._id ?? null,
    templateName: entry.templateName ?? null,
    statuses: Array.isArray(entry.statuses)
      ? entry.statuses.map((s) => s.label ?? s.id ?? null).sort()
      : [],
    meta,
    content: entry.content ?? null,
  };
}

export function computeSourceChecksum(bcmsEntry) {
  const normalized = normalizeBcmsForChecksum(bcmsEntry);
  return sha256(stableStringify(normalized));
}

/**
 * Compute the importer-owned checksum: a hash of the JSON projection of
 * `ownedPaths` from the in-Sanity document. Caller passes the existing
 * Sanity doc and the path list the importer claimed in the prior write.
 */
export function computeOwnedChecksum(sanityDoc, ownedPaths) {
  if (!sanityDoc || !Array.isArray(ownedPaths) || ownedPaths.length === 0) return null;
  const projection = {};
  for (const path of ownedPaths) {
    projection[path] = pickByPath(sanityDoc, path);
  }
  return sha256(stableStringify(projection));
}

/**
 * Build the migrationSource object. `assetIds` is the deduped list of BCMS
 * media _ids referenced by this entry. `unmappedFields` lists fields the
 * mapper deliberately dropped/deferred.
 */
export function buildMigrationSource(input) {
  const {
    template,
    bcmsId,
    legacyUrl,
    sourceChecksum,
    lastAppliedOwnedChecksum = null,
    importedAt = new Date().toISOString(),
    sourceUpdatedAt = null,
    sourceLocale = "en",
    sourceStatus = [],
    ownedPaths = [],
    assetIds = [],
    unmappedFields = [],
  } = input;

  if (!template || !bcmsId) {
    throw new Error("buildMigrationSource requires template and bcmsId.");
  }

  return {
    provider: "bcms",
    template,
    bcmsId,
    legacyUrl,
    sourceChecksum,
    lastAppliedOwnedChecksum,
    importedAt,
    sourceUpdatedAt,
    sourceLocale,
    sourceStatus: Array.isArray(sourceStatus) ? sourceStatus : [],
    ownedPaths: Array.isArray(ownedPaths) ? [...new Set(ownedPaths)] : [],
    assetIds: Array.isArray(assetIds) ? [...new Set(assetIds)] : [],
    unmappedFields: Array.isArray(unmappedFields) ? [...new Set(unmappedFields)] : [],
  };
}

/**
 * Extract a value from a Sanity-shaped doc by a simple dotted path.
 * Supports `field`, `field.sub`, and `field[].sub`. Numeric segments
 * return arrays of projected items.
 */
function pickByPath(obj, path) {
  if (!path) return obj;
  const segments = path.split(".");
  let current = obj;
  for (const seg of segments) {
    if (current === null || current === undefined) return undefined;
    if (seg.endsWith("[]")) {
      const key = seg.slice(0, -2);
      const arr = key ? current[key] : current;
      if (!Array.isArray(arr)) return undefined;
      // remaining path is empty — just return the array
      return arr;
    }
    current = current[seg];
  }
  return current;
}

function sha256(input) {
  return createHash("sha256").update(input).digest("hex");
}
