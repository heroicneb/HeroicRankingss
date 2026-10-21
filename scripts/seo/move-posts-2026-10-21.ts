/**
 * 2026-10-21 URL move (Nebojsa's decision): the 30 posts under /seo/managed/ lose the folder (two
 * link-building tool posts go to /seo/linkbuilding/ instead), and eleven slugs drop the "-2026"
 * year. Rewrites every in-body link that pointed at an old address. Dry run unless --apply; writes a
 * JSON backup of the previous state next to the script's output path when applying.
 *
 *   node --env-file=.env.local --experimental-strip-types scripts/seo/move-posts-2026-10-21.ts [--apply] [--backup <file>]
 */
import { writeFileSync } from "node:fs";

import { createSeedClient } from "../seed/lib.ts";

/** old slug → new slug (only the posts whose slug changes) */
export const SLUG_RENAMES: Record<string, string> = {
  "seo-marketing-practices-2026": "seo-marketing-practices",
  "b2b-seo-solutions-2026": "b2b-seo-solutions",
  "outdated-seo-practices-to-avoid-in-2026": "outdated-seo-practices-to-avoid",
  "benefits-of-blogging-for-small-businesses-in-2026": "benefits-of-blogging-for-small-businesses",
  "google-eeat-and-seo-in-2026": "google-eeat-and-seo",
  "content-marketing-statistics-2026": "content-marketing-statistics",
  "link-building-statistics-2026": "link-building-statistics",
  "top-link-building-tools-in-2026": "top-link-building-tools",
  "cro-statistics-2026": "cro-statistics",
  "top-backlink-analysis-tools-in-2026": "top-backlink-analysis-tools",
  "ai-in-sales-statistics-2026": "ai-in-sales-statistics",
};

/** managed posts that move into a real hub folder instead of the /seo/ root */
export const MANAGED_TO_FOLDER: Record<string, string> = {
  "top-link-building-tools-in-2026": "linkbuilding",
  "top-backlink-analysis-tools-in-2026": "linkbuilding",
};

interface Post {
  _id: string;
  slug: string;
  urlCategory: string | null;
  hasDraft: boolean;
}

const href = (cat: string | null, slug: string) => (cat ? `/seo/${cat}/${slug}/` : `/seo/${slug}/`);

async function main() {
  const apply = process.argv.includes("--apply");
  const backupIndex = process.argv.indexOf("--backup");
  const backupPath = backupIndex > -1 ? process.argv[backupIndex + 1] : null;
  const client = createSeedClient();
  const posts = await client.fetch<Post[]>(
    `*[_type == "post" && !(_id in path("drafts.**")) && !(_id match "audit-fixture-*")]{_id, "slug": slug.current, "urlCategory": coalesce(urlCategory, null), "hasDraft": count(*[_id == "drafts." + ^._id]) > 0}`,
  );

  const moves = posts
    .filter((p) => p.urlCategory === "managed" || p.slug in SLUG_RENAMES)
    .map((p) => {
      const slug = SLUG_RENAMES[p.slug] ?? p.slug;
      const urlCategory = p.urlCategory === "managed" ? (MANAGED_TO_FOLDER[p.slug] ?? null) : p.urlCategory;
      return { ...p, newSlug: slug, newCategory: urlCategory, from: href(p.urlCategory, p.slug), to: href(urlCategory, slug) };
    });

  const drafts = moves.filter((m) => m.hasDraft);
  if (drafts.length) throw new Error(`Refusing: unpublished drafts exist for ${drafts.map((d) => d.slug).join(", ")}. Publish or discard them first.`);
  const taken = new Set(posts.map((p) => p.slug));
  for (const m of moves) if (m.newSlug !== m.slug && taken.has(m.newSlug)) throw new Error(`Slug collision: ${m.newSlug}`);

  // Old address → new address, including the addresses that already redirect to an old one.
  const linkMap = new Map<string, string>(moves.map((m) => [m.from, m.to]));
  linkMap.set("/seo/b2b-seo-solutions-2024/", linkMap.get("/seo/on-page/b2b-seo-solutions-2026/")!);
  linkMap.set("/seo/on-page/outdated-seo-practices-to-avoid-in-2025/", linkMap.get("/seo/on-page/outdated-seo-practices-to-avoid-in-2026/")!);

  console.log(`${moves.length} posts move:`);
  for (const m of moves) console.log(`  ${m.from}  ->  ${m.to}`);

  const bodies = await client.fetch<Array<{ _id: string; slug: string; body: Array<{ _key: string; href?: string; markDefs?: Array<{ _key: string; href?: string }> }> | null }>>(
    `*[_type == "post" && !(_id match "audit-fixture-*")]{_id, "slug": slug.current, body[]{_key, href, markDefs[]{_key, href}}}`,
  );
  const rewrite = (value: string) => {
    const [path, hash] = value.replace(/^https?:\/\/(www\.)?heroicrankings\.com/, "").split("#");
    const next = linkMap.get(path.endsWith("/") ? path : `${path}/`);
    return next ? (hash ? `${next}#${hash}` : next) : null;
  };
  let links = 0;
  const linkPatches: Array<{ _id: string; sets: Record<string, string> }> = [];
  for (const post of bodies) {
    const sets: Record<string, string> = {};
    for (const block of post.body ?? []) {
      if (block.href) { const n = rewrite(block.href); if (n) sets[`body[_key=="${block._key}"].href`] = n; }
      for (const mark of block.markDefs ?? []) { if (mark.href) { const n = rewrite(mark.href); if (n) sets[`body[_key=="${block._key}"].markDefs[_key=="${mark._key}"].href`] = n; } }
    }
    if (Object.keys(sets).length) { linkPatches.push({ _id: post._id, sets }); links += Object.keys(sets).length; }
  }
  console.log(`${links} in-body links rewritten across ${linkPatches.length} posts (drafts included)`);

  if (!apply) { console.log("dry run; pass --apply to write"); return; }

  if (backupPath) writeFileSync(backupPath, JSON.stringify({ moves, linkPatches }, null, 1));
  let tx = client.transaction();
  for (const m of moves) {
    const patch = client.patch(m._id).set({ "slug.current": m.newSlug });
    tx = tx.patch(m.newCategory ? patch.set({ urlCategory: m.newCategory }) : patch.unset(["urlCategory"]));
  }
  for (const p of linkPatches) tx = tx.patch(client.patch(p._id).set(p.sets));
  const result = await tx.commit();
  console.log(`committed transaction ${result.transactionId}: ${result.results.length} documents`);
}

main().catch((error) => { console.error(error.message ?? error); process.exit(1); });
