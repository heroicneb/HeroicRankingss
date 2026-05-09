#!/usr/bin/env node
/**
 * Rewrites legacy-style anchor hrefs inside Sanity post body markDefs to
 * the legacy-matching new paths set by docs/plans/2026-05-09-legacy-url-
 * path-match.md. Codex adversarial audit (task-moy8x59a-67cbew) Check #10
 * found 365 legacy-style hrefs across rendered HTML — many of them
 * surfaced from inline anchor links inside post body portable-text
 * (markDefs[].href values authored before the route rename).
 *
 * Idempotent: only patches markDefs whose `href` matches a legacy
 * pattern. Already-correct values + external URLs left alone. Revision-
 * guarded with `.ifRevisionId(_rev)` per doc.
 *
 * Usage:
 *   node scripts/migrate/2026-05-09-rewrite-post-body-hrefs.mjs            # dry run (default)
 *   node scripts/migrate/2026-05-09-rewrite-post-body-hrefs.mjs --apply    # commit changes
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { getSanityClient } from "./lib/sanity-client.mjs";

const APPLY = process.argv.includes("--apply");
const SNAPSHOT_PATH = path.resolve(
  "scripts/migrate/2026-05-09-post-body-hrefs-snapshot.json",
);

const STATIC_REMAP = {
  "/about-us": "/about",
  "/seo-services": "/seo",
  "/on-page-seo": "/seo/on-page",
  "/technical-seo": "/seo/technical",
  "/local-seo": "/seo/local",
  "/ecommerce-seo": "/seo/e-commerce",
  "/content-creation": "/seo/content-creation",
  "/keyword-strategy": "/seo/keyword-research",
  "/link-building": "/seo/linkbuilding",
  "/insights": "/blog",
  "/case-studies": "/case-study",
};

const client = getSanityClient();
if (!client) {
  console.error(
    "No Sanity write token — set SANITY_API_WRITE_TOKEN in .env.local",
  );
  process.exit(2);
}

// 1. Build slug → urlCategory map from existing posts (for /insights/<slug> rewrite).
const allPosts = await client.fetch(
  `*[_type=="post" && defined(slug.current) && !(_id match "audit-fixture-*")]{ "slug": slug.current, urlCategory }`,
);
const slugToCategory = new Map(
  allPosts.filter((p) => p.urlCategory).map((p) => [p.slug, p.urlCategory]),
);

function remap(href) {
  if (typeof href !== "string") return href;
  if (!href.startsWith("/")) return href; // external / mailto / tel — leave alone
  const stripped = href.replace(/\/$/, "");

  // Static path remap (longest match first)
  if (stripped in STATIC_REMAP) return STATIC_REMAP[stripped];

  // /insights/<slug> → /seo/<urlCategory>/<slug>
  const insightsMatch = stripped.match(/^\/insights\/([^/]+)$/);
  if (insightsMatch) {
    const slug = insightsMatch[1];
    const cat = slugToCategory.get(slug);
    if (cat) return `/seo/${cat}/${slug}`;
    // Fallback: if slug isn't in the post map, leave as /blog/<slug>/ which
    // 404s — flag in plan.
    return `/blog/${slug}`;
  }

  // /case-studies/<slug> → /case-study/<slug>
  const caseMatch = stripped.match(/^\/case-studies\/([^/]+)$/);
  if (caseMatch) return `/case-study/${caseMatch[1]}`;

  // /seo-services/<rest> → /seo/<rest>
  if (stripped.startsWith("/seo-services/")) {
    return "/seo/" + stripped.slice("/seo-services/".length);
  }

  return href;
}

// 2. Fetch every post with body markDefs.
const posts = await client.fetch(
  `*[_type=="post" && defined(slug.current) && !(_id match "audit-fixture-*") && defined(body)]{
    _id, _rev, "slug": slug.current,
    body[]
  }`,
);

await mkdir(path.dirname(SNAPSHOT_PATH), { recursive: true });
await writeFile(SNAPSHOT_PATH, JSON.stringify(posts, null, 2) + "\n");
console.log(`Snapshot: ${SNAPSHOT_PATH}`);

// 3. Compute remapped body per post.
const planned = [];
for (const post of posts) {
  const newBody = (post.body ?? []).map((block) => {
    if (!block || !Array.isArray(block.markDefs) || block.markDefs.length === 0) return block;
    const newMarkDefs = block.markDefs.map((md) => {
      if (md?._type !== "link" || typeof md.href !== "string") return md;
      const newHref = remap(md.href);
      if (newHref === md.href) return md;
      return { ...md, href: newHref };
    });
    return { ...block, markDefs: newMarkDefs };
  });
  // Compare: did anything change?
  const oldStr = JSON.stringify(post.body);
  const newStr = JSON.stringify(newBody);
  if (oldStr === newStr) continue;
  // Diff list of changed hrefs for the plan output.
  const changes = [];
  (post.body ?? []).forEach((b, i) => {
    if (!b || !Array.isArray(b.markDefs)) return;
    b.markDefs.forEach((md, j) => {
      const next = newBody[i].markDefs[j];
      if (md?.href !== next?.href) {
        changes.push({ from: md.href, to: next.href });
      }
    });
  });
  planned.push({ id: post._id, rev: post._rev, slug: post.slug, body: newBody, changes });
}

console.log(`\n=== plan (${planned.length} posts) ===`);
for (const p of planned) {
  console.log(`  ${p.slug}  (${p.changes.length} changes)`);
  for (const c of p.changes.slice(0, 5)) {
    console.log(`     ${c.from}  →  ${c.to}`);
  }
  if (p.changes.length > 5) console.log(`     … (${p.changes.length - 5} more)`);
}

if (!APPLY) {
  console.log(`\nDry run complete (${planned.length} posts touched). Re-run with --apply to commit.`);
  process.exit(0);
}

if (planned.length === 0) {
  console.log("\nNothing to apply.");
  process.exit(0);
}

// 4. Build single transaction with revision guards.
const tx = client.transaction();
for (const p of planned) {
  tx.patch(p.id, (patch) => patch.ifRevisionId(p.rev).set({ body: p.body }));
}

try {
  const result = await tx.commit();
  console.log(`\nCommitted ${result.results.length} patches across ${planned.length} posts.`);
} catch (err) {
  const msg = err instanceof Error ? err.message : String(err);
  console.error("\nCommit failed:", msg);
  console.error(`Snapshot preserved at ${SNAPSHOT_PATH} for rollback.`);
  process.exit(1);
}
