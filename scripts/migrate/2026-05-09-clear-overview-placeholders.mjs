#!/usr/bin/env node
/**
 * Clears literal placeholder caseOverview fields ("Test", "Missing info",
 * "Missing text") on 3 published case studies and corrects DesignRush
 * overview body copy that leaked the "My Baskets" client name.
 *
 * Idempotent: each patch is gated on the current document still containing
 * the expected placeholder. Re-running is a no-op once the field is clean.
 *
 * Usage:
 *   node scripts/migrate/2026-05-09-clear-overview-placeholders.mjs            # dry run (default)
 *   node scripts/migrate/2026-05-09-clear-overview-placeholders.mjs --apply    # commit changes
 *
 * Safety:
 *   - Default mode is dry-run; `--apply` required for any write
 *   - Pre-mutation snapshot of every target doc written to scripts/migrate/
 *   - Each patch is revision-guarded via `.ifRevisionId(live._rev)` so
 *     concurrent edits abort instead of silently overwriting
 *   - Each patch validated against expected current value; mismatch skips
 *     that doc with a warning rather than mutating
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { getSanityClient } from "./lib/sanity-client.mjs";

const APPLY = process.argv.includes("--apply");
const SNAPSHOT_PATH = path.resolve(
  "scripts/migrate/2026-05-09-overview-placeholders-snapshot.json",
);

const PATCHES = [
  {
    id: "migrate-caseStudy-67360e42107a7e22c2300fc8",
    slug: "nagish",
    op: "unset",
    expectMatch: (overview) =>
      overview?.headingMain === "Test" || overview?.body === "Test",
  },
  {
    id: "migrate-caseStudy-673764e0107a7e22c2300fff",
    slug: "art-by-maudsch",
    op: "unset",
    expectMatch: (overview) =>
      overview?.headingMain === "Missing info" ||
      overview?.body === "Missing info",
  },
  {
    id: "migrate-caseStudy-6738a04c107a7e22c230103b",
    slug: "diy-craft-ecom-brand",
    op: "unset",
    expectMatch: (overview) =>
      overview?.headingMain === "Missing text" ||
      overview?.body === "Missing text",
  },
  {
    id: "migrate-caseStudy-67389b07107a7e22c2301034",
    slug: "designrush",
    op: "set",
    body: "By implementing a comprehensive SEO strategy including technical SEO, on-page optimization, and content marketing, we helped DesignRush achieve significant growth in organic traffic and sales.",
    expectMatch: (overview) =>
      typeof overview?.body === "string" &&
      overview.body.includes("My Baskets"),
  },
];

const client = getSanityClient();
if (!client) {
  console.error(
    "No Sanity write token — set SANITY_API_WRITE_TOKEN in .env.local",
  );
  process.exit(2);
}

const ids = PATCHES.map((p) => p.id);
const live = await client.fetch(
  `*[_id in $ids]{_id, _rev, "slug": slug.current, caseOverview}`,
  { ids },
);
const liveById = new Map(live.map((d) => [d._id, d]));

await mkdir(path.dirname(SNAPSHOT_PATH), { recursive: true });
await writeFile(SNAPSHOT_PATH, JSON.stringify(live, null, 2) + "\n");
console.log(`Snapshot written: ${SNAPSHOT_PATH}`);

const planned = [];
const skipped = [];
for (const patch of PATCHES) {
  const doc = liveById.get(patch.id);
  if (!doc) {
    skipped.push({ slug: patch.slug, reason: "doc not found" });
    continue;
  }
  if (!patch.expectMatch(doc.caseOverview)) {
    skipped.push({
      slug: patch.slug,
      reason: "current value does not match expected placeholder — already clean or hand-edited",
      current: doc.caseOverview,
    });
    continue;
  }
  planned.push({ ...patch, _rev: doc._rev });
}

console.log("\n=== plan ===");
for (const p of planned) {
  console.log(
    `  ${p.slug.padEnd(22)} ${p.op === "unset" ? "unset caseOverview" : "set caseOverview.body"}`,
  );
}
if (skipped.length > 0) {
  console.log("\n=== skipped ===");
  for (const s of skipped) {
    console.log(`  ${s.slug.padEnd(22)} ${s.reason}`);
  }
}

if (!APPLY) {
  console.log("\nDry run complete. Re-run with --apply to commit.");
  process.exit(0);
}

if (planned.length === 0) {
  console.log("\nNothing to apply.");
  process.exit(0);
}

const tx = client.transaction();
for (const p of planned) {
  if (p.op === "unset") {
    tx.patch(p.id, (patch) =>
      patch.ifRevisionId(p._rev).unset(["caseOverview"]),
    );
  } else {
    tx.patch(p.id, (patch) =>
      patch.ifRevisionId(p._rev).set({ "caseOverview.body": p.body }),
    );
  }
}

try {
  const result = await tx.commit();
  console.log(`\nCommitted ${result.results.length} patches:`);
  for (const r of result.results) {
    console.log(`  ${r.id} -> ${r.operation}`);
  }
} catch (err) {
  const msg = err instanceof Error ? err.message : String(err);
  console.error("\nCommit failed:", msg);
  console.error(`Live snapshot preserved at ${SNAPSHOT_PATH} for rollback.`);
  process.exit(1);
}
