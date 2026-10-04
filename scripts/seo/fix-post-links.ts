/**
 * Normalises every link inside post bodies: trailing slash on internal paths,
 * absolute heroicrankings.com links made relative, and the one broken slug
 * (b2b-seo-solutions-2024 → -2026). Dry run by default; pass --apply to write.
 *
 *   node --env-file=.env.local --experimental-strip-types scripts/seo/fix-post-links.ts [--apply]
 */
import { withTrailingSlash } from "../../src/lib/with-trailing-slash.ts";

import { createSeedClient } from "../seed/lib.ts";

const REPLACEMENTS: Array<[RegExp, string]> = [[/\/seo\/on-page\/b2b-seo-solutions-2024\//, "/seo/on-page/b2b-seo-solutions-2026/"]];

interface Post {
  _id: string;
  slug: string;
  body: Array<{ _key: string; markDefs?: Array<{ _key: string; _type: string; href?: string }> }> | null;
}

async function main() {
  const apply = process.argv.includes("--apply");
  const client = createSeedClient();
  const posts = await client.fetch<Post[]>(`*[_type == "post" && !(_id match "audit-fixture-*")]{_id, "slug": slug.current, body[]{_key, markDefs[]{_key, _type, href}}}`);
  let changed = 0;
  for (const post of posts) {
    const sets: Record<string, string> = {};
    for (const block of post.body ?? []) {
      for (const mark of block.markDefs ?? []) {
        if (!mark.href) continue;
        let next = withTrailingSlash(mark.href);
        for (const [from, to] of REPLACEMENTS) next = next.replace(from, to);
        if (next !== mark.href) sets[`body[_key=="${block._key}"].markDefs[_key=="${mark._key}"].href`] = next;
      }
    }
    const count = Object.keys(sets).length;
    if (!count) continue;
    changed += count;
    console.log(`${post.slug}: ${count} link(s)`);
    if (apply) await client.patch(post._id).set(sets).commit();
  }
  console.log(`${apply ? "updated" : "would update"} ${changed} links across ${posts.length} posts`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
