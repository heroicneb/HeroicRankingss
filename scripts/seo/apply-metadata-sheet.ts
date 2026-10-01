/**
 * Applies the metadata review sheet (Heroic-Rankings-Website-Metadata.xlsx,
 * exported to JSON) to Sanity: for every row marked "Update", sets
 * seo.metaTitle and seo.metaDescription on the matching document.
 *
 *   node --env-file=.env.local --experimental-strip-types scripts/seo/apply-metadata-sheet.ts <sheet.json> [--apply]
 *
 * Without --apply it only prints what would change. Rows marked "Keep" and
 * "Review before publishing" are never written. Pages whose metadata lives in
 * code (about, blog, case study index, podcast hub and pagination) are listed
 * separately for the code change.
 */
import fs from "node:fs";

import { createSeedClient } from "../seed/lib.ts";

type Row = [string, string, string, string | number, string, string | number, string, unknown, string | null];

const SERVICE_IDS: Record<string, string> = {
  "/": "homePage",
  "/seo/": "seoServicePage-seo-services",
  "/seo/content-creation/": "seoServicePage-content-creation",
  "/seo/e-commerce/": "seoServicePage-ecommerce-seo",
  "/seo/keyword-research/": "seoServicePage-keyword-strategy",
  "/seo/local/": "seoServicePage-local-seo",
  "/seo/on-page/": "seoServicePage-on-page-seo",
  "/seo/technical/": "seoServicePage-technical-seo",
  "/seo/linkbuilding/": "linkBuildingPage",
  "/seo/reddit-marketing/": "redditMarketingPage",
  "/partnership/": "partnershipPage",
  "/contact/": "contactPage",
  "/privacy-policy/": "legalPage-privacy-policy",
};

/** Pages whose title/description are constants in code. */
const CODE_PAGES = new Set(["/about/", "/blog/", "/case-study/", "/podcast/"]);

async function main() {
  const [file, ...flags] = process.argv.slice(2);
  if (!file) throw new Error("Pass the sheet JSON path");
  const apply = flags.includes("--apply");
  const rows = (JSON.parse(fs.readFileSync(file, "utf8")).Metadata as Row[]).slice(9).filter((r) => r && r[1]);
  const client = createSeedClient();

  const posts = await client.fetch<Array<{ _id: string; slug: string; urlCategory: string; title: string | null; description: string | null }>>(
    `*[_type=="post" && defined(slug.current)]{ _id, "slug": slug.current, urlCategory, "title": seo.metaTitle, "description": seo.metaDescription }`,
  );
  const bySlugType = async (type: string) =>
    client.fetch<Array<{ _id: string; slug: string; title: string | null; description: string | null }>>(
      `*[_type=="${type}" && defined(slug.current)]{ _id, "slug": slug.current, "title": seo.metaTitle, "description": seo.metaDescription }`,
    );
  const [cases, episodes, team, singles] = await Promise.all([
    bySlugType("caseStudy"),
    bySlugType("podcastEpisode"),
    bySlugType("teamMember"),
    client.fetch<Array<{ _id: string; title: string | null; description: string | null }>>(
      `*[_id in $ids]{ _id, "title": seo.metaTitle, "description": seo.metaDescription }`,
      { ids: Object.values(SERVICE_IDS) },
    ),
  ]);
  const postByPath = new Map(posts.map((p) => [`/seo/${p.urlCategory}/${p.slug}/`, p]));
  const caseBySlug = new Map(cases.map((c) => [c.slug, c]));
  const episodeBySlug = new Map(episodes.map((e) => [e.slug, e]));
  const teamBySlug = new Map(team.map((t) => [t.slug, t]));
  const singleById = new Map(singles.map((s) => [s._id, s]));

  const changes: Array<{ id: string; url: string; title: string; description: string; from: { title: string | null; description: string | null } }> = [];
  const codePages: Row[] = [];
  const skipped: string[] = [];
  const unresolved: string[] = [];

  for (const row of rows) {
    const [type, url, title, , description, , action] = row;
    if (action !== "Update") {
      skipped.push(`${action}: ${url}`);
      continue;
    }
    if (CODE_PAGES.has(url) || type === "Podcast pagination") {
      codePages.push(row);
      continue;
    }
    let doc: { _id: string; title: string | null; description: string | null } | undefined;
    if (type === "Article") doc = postByPath.get(url);
    else if (type === "Case study") doc = caseBySlug.get(url.split("/")[2] ?? "");
    else if (type === "Podcast episode") doc = episodeBySlug.get(url.split("/")[2] ?? "");
    else if (type === "Team profile") doc = teamBySlug.get(url.split("/")[2] ?? "");
    else if (SERVICE_IDS[url]) doc = singleById.get(SERVICE_IDS[url]) ?? { _id: SERVICE_IDS[url], title: null, description: null };
    if (!doc) {
      unresolved.push(url);
      continue;
    }
    const t = String(title).trim();
    const d = String(description).trim();
    if (doc.title === t && doc.description === d) continue;
    changes.push({ id: doc._id, url, title: t, description: d, from: { title: doc.title, description: doc.description } });
  }

  console.log(`rows ${rows.length} | sanity changes ${changes.length} | code pages ${codePages.length} | skipped ${skipped.length} | unresolved ${unresolved.length}`);
  if (unresolved.length) console.log("UNRESOLVED:", unresolved);
  for (const c of changes.slice(0, 6)) console.log(`\n${c.url}\n  title: ${c.from.title}\n      -> ${c.title}\n  desc:  ${(c.from.description ?? "").slice(0, 90)}\n      -> ${c.description.slice(0, 90)}`);
  if (changes.length > 6) console.log(`\n… ${changes.length - 6} more`);
  console.log("\nCODE PAGES:");
  for (const r of codePages) console.log(`  ${r[1]} | ${r[2]} | ${String(r[4]).slice(0, 80)}`);

  if (!apply) {
    console.log("\nDry run. Re-run with --apply to write.");
    return;
  }
  let tx = client.transaction();
  for (const c of changes) tx = tx.patch(c.id, (p) => p.set({ "seo.metaTitle": c.title, "seo.metaDescription": c.description }));
  await tx.commit();
  console.log(`\nApplied ${changes.length} Sanity updates.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
