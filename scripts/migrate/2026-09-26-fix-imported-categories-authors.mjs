/**
 * One-off after the 2026-09-26 live import:
 *  - imported posts carried ["seo", "<real category>"]; the Insights filter picks
 *    "SEO" whenever it is present, so store only the category the live site shows
 *  - the three posts scraped in May had no author; set them from their live bylines
 * Usage: node --env-file=.env.local scripts/migrate/2026-09-26-fix-imported-categories-authors.mjs
 */
import { createClient } from "next-sanity";
const client = createClient({ projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production", token: process.env.SANITY_API_WRITE_TOKEN, apiVersion: "2025-01-01", useCdn: false });

const multi = await client.fetch('*[_type=="post" && count(categories) > 1]{_id, "slug": slug.current, categories}');
const team = Object.fromEntries((await client.fetch('*[_type=="teamMember"]{_id, name}')).map((t) => [t.name, t._id]));
const AUTHORS = { "ahrefs-vs-majestic-comparison": "Nebojsa Jankovic", "web-summit-lisbon-2023": "Anastasija Jankovic", "difference-between-marketing-and-sales-services": "Stefan Cvetkovic" };
const noAuthor = await client.fetch('*[_type=="post" && !defined(author)]{_id, "slug": slug.current}');

const tx = client.transaction();
for (const p of multi) {
  const real = p.categories.filter((c) => c !== "seo");
  tx.patch(p._id, { set: { categories: real.length ? [real[0]] : ["seo"] } });
  console.log("category", p.slug, p.categories, "->", real.length ? [real[0]] : ["seo"]);
}
for (const p of noAuthor) {
  const name = AUTHORS[p.slug];
  if (!name || !team[name]) { console.log("no author mapping for", p.slug); continue; }
  tx.patch(p._id, { set: { author: { _type: "reference", _ref: team[name] } } });
  console.log("author", p.slug, "->", name);
}
const r = await tx.commit();
console.log("patched", r.results.length, "documents");
