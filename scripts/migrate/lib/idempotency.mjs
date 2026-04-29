/**
 * Idempotency layer for migration writes.
 *
 * Per Codex:
 *   1. Recompute normalized source payload + sourceChecksum.
 *   2. If checksum matches existing migrationSource.sourceChecksum, SKIP.
 *   3. If checksum differs, recompute owned-checksum from existing Sanity
 *      doc paths. If matches lastAppliedOwnedChecksum, patch ownedPaths
 *      with ifRevisionId guard.
 *   4. If owned-checksum differs, EMIT CONFLICT (editor changed our data).
 *   5. Patch only `ownedPaths`, never the whole document.
 *
 * Document IDs follow `migrate-<sanityType>-<bcmsId>` (no dots).
 *
 * Patch shape: client.patch(_id).set({...projection}).ifRevisionId(rev).commit()
 * where {projection} is the subset of `sanityDoc` constrained to ownedPaths.
 */

import {
  buildMigrationSource,
  computeOwnedChecksum,
} from "./provenance.mjs";

/**
 * Decision returned by `evaluate()`.
 *   - kind: "create" | "patch" | "skip" | "conflict"
 *   - existing: the doc as it currently exists (null on create)
 *   - reason: short human-readable string
 */
export function evaluate({ existing, sourceChecksum, ownedPaths }) {
  if (!existing) {
    return { kind: "create", reason: "no existing doc" };
  }

  const prevSource = existing.migrationSource ?? null;
  const prevSourceChecksum = prevSource?.sourceChecksum ?? null;
  const prevOwnedChecksum = prevSource?.lastAppliedOwnedChecksum ?? null;

  if (prevSourceChecksum && prevSourceChecksum === sourceChecksum) {
    return { kind: "skip", reason: "source checksum unchanged" };
  }

  // Source has drifted. Check if editor touched importer-owned paths.
  if (prevOwnedChecksum) {
    const currentOwnedChecksum = computeOwnedChecksum(existing, ownedPaths);
    if (currentOwnedChecksum && currentOwnedChecksum !== prevOwnedChecksum) {
      return {
        kind: "conflict",
        reason: "editor edited importer-owned content",
        prevOwnedChecksum,
        currentOwnedChecksum,
      };
    }
  }

  return { kind: "patch", reason: "source changed; owned paths intact" };
}

/**
 * Project a Sanity doc onto a list of dotted ownedPaths and return the
 * subset object. Each path is a top-level field name (the migration
 * importer claims whole sub-trees, not deep leaves) so we copy each
 * named field as-is.
 */
export function projectOwnedPaths(sanityDoc, ownedPaths) {
  const out = {};
  for (const path of ownedPaths) {
    const head = path.split(".")[0];
    if (head in sanityDoc) {
      out[head] = sanityDoc[head];
    }
  }
  return out;
}

/**
 * Run the create-or-patch decision and execute against the live client.
 *
 * Args:
 *   - client: @sanity/client write client (or null in dry-run)
 *   - logger: from logger.mjs
 *   - dryRun: boolean
 *   - template: BCMS template name for log/perTemplate tags
 *   - doc: full Sanity doc to write (must include _id, _type, migrationSource)
 *   - ownedPaths: array of top-level Sanity field names the importer owns
 *
 * Returns: { kind, docId } where kind ∈
 *          { "created", "patched", "skipped", "conflicted", "failed" }
 */
export async function migrateOrSkip({
  client,
  logger,
  dryRun,
  template,
  doc,
  ownedPaths,
}) {
  if (!doc?._id || !doc?._type) {
    throw new Error("migrateOrSkip: doc requires _id and _type");
  }
  if (!doc.migrationSource?.sourceChecksum) {
    throw new Error(
      "migrateOrSkip: doc.migrationSource.sourceChecksum required (build via provenance.mjs)",
    );
  }

  const docId = doc._id;
  const sourceChecksum = doc.migrationSource.sourceChecksum;

  // Look up existing doc (or its draft). In dry-run we still query so we can
  // accurately predict create-vs-patch counts.
  let existing = null;
  if (client) {
    try {
      existing = await client.fetch(`*[_id == $id][0]`, { id: docId });
    } catch (err) {
      logger?.warn?.(template, docId, `fetch failed: ${err?.message ?? err}`);
    }
  }

  const decision = evaluate({
    existing,
    sourceChecksum,
    ownedPaths,
  });

  if (decision.kind === "skip") {
    logger?.countSkip?.(template, docId, decision.reason);
    return { kind: "skipped", docId, reason: decision.reason };
  }
  if (decision.kind === "conflict") {
    logger?.countConflict?.(template, docId, {
      reason: decision.reason,
      prevOwnedChecksum: decision.prevOwnedChecksum,
      currentOwnedChecksum: decision.currentOwnedChecksum,
    });
    return { kind: "conflicted", docId, reason: decision.reason };
  }

  // Compute the owned-checksum we'll persist alongside this write so future
  // runs can compare cleanly.
  const docWithMigrationSource = withMigrationSourceUpdated(
    doc,
    ownedPaths,
  );

  if (dryRun || !client) {
    if (decision.kind === "create") {
      logger?.info?.("write", template, `[dry-run] would create ${docId}`);
      logger?.countCreate?.(template, `${docId} (dry-run)`);
    } else {
      logger?.info?.("write", template, `[dry-run] would patch ${docId}`);
      logger?.countPatch?.(template, `${docId} (dry-run)`);
    }
    return {
      kind: decision.kind === "create" ? "created" : "patched",
      docId,
      reason: `[dry-run] ${decision.reason}`,
    };
  }

  try {
    if (decision.kind === "create") {
      await client.createOrReplace(docWithMigrationSource);
      logger?.countCreate?.(template, docId);
      return { kind: "created", docId, reason: decision.reason };
    }

    // Patch path. Project onto ownedPaths + always include migrationSource.
    const projection = projectOwnedPaths(docWithMigrationSource, ownedPaths);
    projection.migrationSource = docWithMigrationSource.migrationSource;

    const rev = existing?._rev ?? null;
    let patcher = client.patch(docId).set(projection);
    if (rev) patcher = patcher.ifRevisionId(rev);
    await patcher.commit();
    logger?.countPatch?.(template, docId);
    return { kind: "patched", docId, reason: decision.reason };
  } catch (err) {
    logger?.countFail?.(template, docId, err);
    return { kind: "failed", docId, reason: err?.message ?? String(err) };
  }
}

/**
 * Set `migrationSource.lastAppliedOwnedChecksum` on the outgoing doc to the
 * checksum of the projection we're about to write — so the NEXT run can
 * detect editor edits cleanly.
 */
function withMigrationSourceUpdated(doc, ownedPaths) {
  const projection = projectOwnedPaths(doc, ownedPaths);
  const ownedChecksum = computeOwnedChecksum(projection, ownedPaths);
  return {
    ...doc,
    migrationSource: {
      ...doc.migrationSource,
      lastAppliedOwnedChecksum: ownedChecksum,
    },
  };
}

/**
 * Helper for mappers: build the migrationSource object and stamp it on the
 * outgoing doc, returning the doc with checksum filled in.
 */
export function attachMigrationSource(doc, args) {
  const ms = buildMigrationSource(args);
  return { ...doc, migrationSource: ms };
}
