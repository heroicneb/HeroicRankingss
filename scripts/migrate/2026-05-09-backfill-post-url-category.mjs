#!/usr/bin/env node
/**
 * Backfills `post.urlCategory` on every Sanity post document by cross-referencing
 * docs/migration/legacy-url-inventory.txt. The inventory is the authoritative
 * source of legacy heroicrankings.com URLs; each blog post lives under
 * `/seo/<category>/<slug>/`. We parse those lines, build a slug → category map,
 * and patch any post that lacks a urlCategory.
 *
 * Idempotent:
 *   - Posts already at the desired urlCategory are skipped.
 *   - Posts whose existing urlCategory differs are WARNED about and SKIPPED
 *     (we never overwrite editor-set values).
 *   - Posts whose slug isn't in the inventory are WARNED about and SKIPPED
 *     (orphan post — editor sets urlCategory manually in Studio).
 *
 * Usage:
 *   node scripts/migrate/2026-05-09-backfill-post-url-category.mjs           # dry run (default)
 *   node scripts/migrate/2026-05-09-backfill-post-url-category.mjs --apply   # commit changes
 *
 * Safety:
 *   - Default mode is dry-run; `--apply` required for any write.
 *   - Pre-mutation snapshot of every fetched doc written to scripts/migrate/.
 *   - Each patch is revision-guarded via `.ifRevisionId(_rev)` so concurrent
 *     edits abort instead of silently overwriting.
 *   - Each desired category is validated against the schema enum (ALLOWED).
 *
 * Per docs/plans/2026-05-09-legacy-url-path-match.md Phase 4b.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { getSanityClient } from "./lib/sanity-client.mjs";

const APPLY = process.argv.includes("--apply");

const REPO_ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..", "..");
const INVENTORY_PATH = path.resolve(
  REPO_ROOT,
  "docs",
  "migration",
  "legacy-url-inventory.txt",
);
const SNAPSHOT_PATH = path.resolve(
  REPO_ROOT,
  "scripts",
  "migrate",
  "2026-05-09-post-url-category-snapshot.json",
);

// Must match Phase 4a schema enum (src/sanity/schemaTypes/documents/post.ts).
const ALLOWED = new Set([
  "content-creation",
  "e-commerce",
  "keyword-research",
  "linkbuilding",
  "local",
  "managed",
  "on-page",
  "technical",
]);

// 1. Build slug → urlCategory map from the legacy URL inventory.
const inventoryRaw = await readFile(INVENTORY_PATH, "utf8");
const inventoryLines = inventoryRaw.trim().split("\n").filter(Boolean);
const POST_PATH = /^\/seo\/([^/]+)\/([^/]+)\/$/;
const slugMap = new Map();
for (const line of inventoryLines) {
  const match = line.match(POST_PATH);
  if (!match) continue;
  const [, category, slug] = match;
  slugMap.set(slug, category);
}
console.log(`Parsed ${slugMap.size} post entries from legacy inventory`);

// 2. Resolve Sanity client.
const client = getSanityClient();
if (!client) {
  console.error(
    "No Sanity write token — set SANITY_API_WRITE_TOKEN in .env.local",
  );
  process.exit(2);
}

// 3. Fetch every published post doc.
const posts = await client.fetch(
  `*[_type=="post" && defined(slug.current) && !(_id match "audit-fixture-*")]{_id, _rev, "slug": slug.current, urlCategory}`,
);
console.log(`Fetched ${posts.length} post docs from Sanity`);

// 4. Snapshot for rollback.
await mkdir(path.dirname(SNAPSHOT_PATH), { recursive: true });
await writeFile(SNAPSHOT_PATH, JSON.stringify(posts, null, 2) + "\n");
console.log(`Snapshot written: ${SNAPSHOT_PATH}`);

// 5. Plan.
const planned = [];
const skippedAlreadyCorrect = [];
const skippedConflict = [];
const skippedOrphan = [];
const skippedInvalid = [];

for (const post of posts) {
  const desired = slugMap.get(post.slug);
  if (!desired) {
    skippedOrphan.push({ slug: post.slug, _id: post._id });
    continue;
  }
  if (!ALLOWED.has(desired)) {
    skippedInvalid.push({ slug: post.slug, desired });
    continue;
  }
  if (post.urlCategory === desired) {
    skippedAlreadyCorrect.push({ slug: post.slug, urlCategory: post.urlCategory });
    continue;
  }
  if (post.urlCategory && post.urlCategory !== desired) {
    skippedConflict.push({
      slug: post.slug,
      _id: post._id,
      current: post.urlCategory,
      desired,
    });
    continue;
  }
  planned.push({
    _id: post._id,
    _rev: post._rev,
    slug: post.slug,
    urlCategory: desired,
  });
}

console.log("\n=== plan ===");
console.log(`  to patch: ${planned.length}`);
console.log(`  already correct: ${skippedAlreadyCorrect.length}`);
console.log(`  conflict (editor-set, skipped): ${skippedConflict.length}`);
console.log(`  orphan (slug not in inventory): ${skippedOrphan.length}`);
console.log(`  invalid (category not in ALLOWED): ${skippedInvalid.length}`);

if (planned.length > 0) {
  console.log("\n=== patches ===");
  for (const p of planned) {
    console.log(`  ${p.slug.padEnd(60)} → ${p.urlCategory}`);
  }
}
if (skippedConflict.length > 0) {
  console.log("\n=== conflicts (NOT touched) ===");
  for (const s of skippedConflict) {
    console.log(`  ${s.slug.padEnd(60)} current=${s.current} desired=${s.desired}`);
  }
}
if (skippedOrphan.length > 0) {
  console.log("\n=== orphans (NOT in legacy inventory — editor must set manually) ===");
  for (const s of skippedOrphan) {
    console.log(`  ${s.slug.padEnd(60)} ${s._id}`);
  }
}
if (skippedInvalid.length > 0) {
  console.log("\n=== invalid (category not in schema enum) ===");
  for (const s of skippedInvalid) {
    console.log(`  ${s.slug.padEnd(60)} desired=${s.desired}`);
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

// 6. Apply.
const tx = client.transaction();
for (const p of planned) {
  tx.patch(p._id, (patch) =>
    patch.ifRevisionId(p._rev).set({ urlCategory: p.urlCategory }),
  );
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
