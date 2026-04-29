#!/usr/bin/env node
/**
 * E2E post-migration audit. Cross-checks Sanity (post-migration) against
 * BCMS (source of truth) and surfaces drift, gaps, and risks.
 *
 * Usage:
 *   BCMS_API_KEY=<id.secret.instanceId> SANITY_AUTH_TOKEN=<token> node scripts/audit/post-migration-audit.mjs
 */

import { createClient } from "@sanity/client";
import { createBcmsClient } from "../migrate/lib/bcms-client.mjs";
import { writeFileSync } from "node:fs";

const PROJECT_ID = "5cr26y9m";
const DATASET = "production";
const API_VERSION = "2026-02-19";

if (!process.env.SANITY_AUTH_TOKEN) {
  console.error("Missing SANITY_AUTH_TOKEN");
  process.exit(1);
}

const sanity = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: API_VERSION,
  token: process.env.SANITY_AUTH_TOKEN,
  useCdn: false,
});

const bcms = createBcmsClient();

const BCMS_TEMPLATE_IDS = {
  "case-study": "671a222fb98a24129383bd5a",
  blog: "6718e04bef5de485dc93f929",
  person: "6718e069ef5de485dc93f92a",
  service: "671a5d7be93230ec1d3de24d",
  testimonial: "6718c07def5de485dc93f8b8",
};

const report = {
  timestamp: new Date().toISOString(),
  phase1_coverage: {},
  phase2_slug_parity: {},
  phase4_body_conversion: [],
  phase5_risk: {},
};

console.log("================================================================");
console.log("  E2E Post-Migration Audit");
console.log("================================================================\n");

// ── Phase 1: Sanity coverage ────────────────────────────────────────────
console.log("[1] Sanity coverage audit\n");

const sanityCounts = await sanity.fetch(`{
  "teamMember": count(*[_type == "teamMember" && _id match "migrate-*"]),
  "caseStudy": count(*[_type == "caseStudy" && _id match "migrate-*"]),
  "post": count(*[_type == "post" && _id match "migrate-*"]),
  "servicePage": count(*[_type == "servicePage" && _id match "migrate-*"]),
  "testimonial": count(*[_type == "testimonial" && _id match "migrate-*"])
}`);
console.log("Sanity migrated doc counts:");
console.log(JSON.stringify(sanityCounts, null, 2));
report.phase1_coverage.counts = sanityCounts;

// Field-fill rates per type (key fields only)
const postFillRates = await sanity.fetch(`{
  "total": count(*[_type == "post" && _id match "migrate-*"]),
  "with_title": count(*[_type == "post" && _id match "migrate-*" && defined(title)]),
  "with_slug": count(*[_type == "post" && _id match "migrate-*" && defined(slug.current)]),
  "with_excerpt": count(*[_type == "post" && _id match "migrate-*" && defined(excerpt)]),
  "with_mainImage": count(*[_type == "post" && _id match "migrate-*" && defined(mainImage.asset)]),
  "with_body": count(*[_type == "post" && _id match "migrate-*" && length(body) > 0]),
  "with_publishedAt": count(*[_type == "post" && _id match "migrate-*" && defined(publishedAt)]),
  "with_categories": count(*[_type == "post" && _id match "migrate-*" && length(categories) > 0]),
  "with_author": count(*[_type == "post" && _id match "migrate-*" && defined(author)]),
  "with_seo_title": count(*[_type == "post" && _id match "migrate-*" && defined(seo.metaTitle)]),
  "with_readTime": count(*[_type == "post" && _id match "migrate-*" && defined(readTime)]),
  "with_relatedService": count(*[_type == "post" && _id match "migrate-*" && defined(relatedService)])
}`);
console.log("\nPost field-fill (out of total):");
console.log(JSON.stringify(postFillRates, null, 2));
report.phase1_coverage.post_fill = postFillRates;

const caseStudyFillRates = await sanity.fetch(`{
  "total": count(*[_type == "caseStudy" && _id match "migrate-*"]),
  "with_title": count(*[_type == "caseStudy" && _id match "migrate-*" && defined(title)]),
  "with_heroImage": count(*[_type == "caseStudy" && _id match "migrate-*" && defined(heroImage.asset)]),
  "with_caseOverview": count(*[_type == "caseStudy" && _id match "migrate-*" && defined(caseOverview)]),
  "with_objectiveChallenges_items": count(*[_type == "caseStudy" && _id match "migrate-*" && length(objectiveChallenges.items) > 0]),
  "with_strategyPillars": count(*[_type == "caseStudy" && _id match "migrate-*" && length(strategyPillars) > 0]),
  "with_journeyTimeline_items": count(*[_type == "caseStudy" && _id match "migrate-*" && length(journeyTimeline.items) > 0]),
  "with_proofData_items": count(*[_type == "caseStudy" && _id match "migrate-*" && length(proofData.items) > 0]),
  "with_conclusion": count(*[_type == "caseStudy" && _id match "migrate-*" && defined(conclusion)]),
  "with_website": count(*[_type == "caseStudy" && _id match "migrate-*" && defined(website)]),
  "with_resultsCardsAsAccordion": count(*[_type == "caseStudy" && _id match "migrate-*" && defined(resultsCardsAsAccordion)])
}`);
console.log("\nCase study field-fill:");
console.log(JSON.stringify(caseStudyFillRates, null, 2));
report.phase1_coverage.case_study_fill = caseStudyFillRates;

const teamMemberFillRates = await sanity.fetch(`{
  "total": count(*[_type == "teamMember" && _id match "migrate-*"]),
  "with_photo": count(*[_type == "teamMember" && _id match "migrate-*" && defined(photo.asset)]),
  "with_bio": count(*[_type == "teamMember" && _id match "migrate-*" && defined(bio)]),
  "with_bioParagraphs": count(*[_type == "teamMember" && _id match "migrate-*" && length(bioParagraphs) > 0]),
  "with_socialLinks": count(*[_type == "teamMember" && _id match "migrate-*" && length(socialLinks) > 0]),
  "with_cards": count(*[_type == "teamMember" && _id match "migrate-*" && length(cards) > 0])
}`);
console.log("\nTeam member field-fill:");
console.log(JSON.stringify(teamMemberFillRates, null, 2));
report.phase1_coverage.team_member_fill = teamMemberFillRates;

// Reference resolution audit
const brokenRefs = await sanity.fetch(`{
  "post_orphan_authors": *[_type == "post" && _id match "migrate-*" && defined(author) && !defined(author->_id)]._id,
  "service_orphan_caseStudies": *[_type == "servicePage" && _id match "migrate-*" && count(relatedCaseStudies[!defined(@->_id)]) > 0]._id
}`);
console.log("\nBroken references:");
console.log(JSON.stringify(brokenRefs, null, 2));
report.phase1_coverage.broken_refs = brokenRefs;

// ── Phase 2: Slug parity ────────────────────────────────────────────────
console.log("\n\n[2] Slug parity audit\n");

async function bcmsSlugs(templateId) {
  const data = await bcms.bcmsFetch(`/api/v3/instance/${bcms.instanceId}/template/${templateId}/entry/all/parsed`);
  return (data.items ?? [])
    .filter((e) => {
      const statuses = e.statuses ?? [];
      const hasPublished = statuses.some((s) => s.label === "Published");
      return hasPublished;
    })
    .map((e) => e.meta?.en?.slug)
    .filter(Boolean);
}

const slugChecks = {};
for (const [tname, tid] of Object.entries(BCMS_TEMPLATE_IDS)) {
  const sanityType = {
    "case-study": "caseStudy",
    blog: "post",
    person: "teamMember",
    service: "servicePage",
    testimonial: "testimonial",
  }[tname];
  const bcmsList = await bcmsSlugs(tid);
  const sanityList = await sanity.fetch(
    `*[_type == $t && _id match "migrate-*"].slug.current`,
    { t: sanityType },
  );
  const bcmsSet = new Set(bcmsList);
  const sanitySet = new Set(sanityList);
  const missingInSanity = [...bcmsSet].filter((s) => !sanitySet.has(s));
  const extraInSanity = [...sanitySet].filter((s) => !bcmsSet.has(s));
  slugChecks[tname] = {
    bcms_count: bcmsList.length,
    sanity_count: sanityList.length,
    missing_in_sanity: missingInSanity,
    extra_in_sanity: extraInSanity,
  };
  console.log(
    `${tname.padEnd(15)} BCMS:${bcmsList.length} Sanity:${sanityList.length} missing:${missingInSanity.length} extra:${extraInSanity.length}`,
  );
}
report.phase2_slug_parity = slugChecks;

// ── Phase 4: Body conversion spot-check (3 blog posts) ──────────────────
console.log("\n\n[4] Body conversion spot-check (5 blog posts)\n");

const blogTemplateId = BCMS_TEMPLATE_IDS.blog;
const allBlogs = await bcms.bcmsFetch(`/api/v3/instance/${bcms.instanceId}/template/${blogTemplateId}/entry/all/parsed`);
const samples = (allBlogs.items ?? []).filter((e) => {
  const statuses = e.statuses ?? [];
  return statuses.some((s) => s.label === "Published");
}).slice(0, 5);

for (const entry of samples) {
  const slug = entry.meta?.en?.slug;
  const bcmsContent = entry.content?.en ?? [];
  const bcmsCounts = bcmsContent.reduce(
    (acc, n) => {
      const t = n.type;
      if (t === "widget") {
        const wn = n.widgetName;
        acc[`widget:${wn}`] = (acc[`widget:${wn}`] ?? 0) + 1;
      } else {
        acc[t] = (acc[t] ?? 0) + 1;
      }
      return acc;
    },
    {},
  );

  const sanityDoc = await sanity.fetch(
    `*[_type == "post" && slug.current == $slug][0]{ body }`,
    { slug },
  );
  const sanityBlocks = sanityDoc?.body ?? [];
  const sanityCounts = sanityBlocks.reduce(
    (acc, b) => {
      const k =
        b._type === "block"
          ? `block:${b.style ?? "normal"}`
          : `block:${b._type}`;
      acc[k] = (acc[k] ?? 0) + 1;
      return acc;
    },
    {},
  );

  console.log(`\n${slug}:`);
  console.log(`  BCMS:   ${JSON.stringify(bcmsCounts)}`);
  console.log(`  Sanity: ${JSON.stringify(sanityCounts)}`);

  report.phase4_body_conversion.push({
    slug,
    bcms_node_counts: bcmsCounts,
    sanity_block_counts: sanityCounts,
  });
}

// ── Phase 5: Risk surface ───────────────────────────────────────────────
console.log("\n\n[5] Risk surface\n");

// Unmigrated blog entries
const allBlogsRaw = allBlogs.items ?? [];
const skipped = allBlogsRaw
  .filter((e) => {
    const statuses = e.statuses ?? [];
    return !statuses.some((s) => s.label === "Published");
  })
  .map((e) => ({
    slug: e.meta?.en?.slug,
    title: e.meta?.en?.title,
    statuses: (e.statuses ?? []).map((s) => s.label).join(",") || "(none)",
  }));
console.log(`Unmigrated blog entries: ${skipped.length}`);
for (const s of skipped) {
  console.log(`  ${s.slug || "(no-slug)"} :: status="${s.statuses}" title="${s.title}"`);
}
report.phase5_risk.unmigrated_blogs = skipped;

// Media census
const allMedia = await bcms.bcmsFetch(`/api/v3/instance/${bcms.instanceId}/media/all`);
const totalMedia = (allMedia.items ?? []).length;
const sanityAssetCount = await sanity.fetch(`count(*[_type == "sanity.imageAsset" && defined(source.id)])`);
console.log(`\nMedia census: BCMS=${totalMedia} | Sanity migrated assets=${sanityAssetCount}`);
report.phase5_risk.media_census = {
  bcms_total: totalMedia,
  sanity_migrated: sanityAssetCount,
};

// Write report
writeFileSync(
  "scripts/audit/post-migration-audit-report.json",
  JSON.stringify(report, null, 2),
);

console.log("\n================================================================");
console.log("  Report written to scripts/audit/post-migration-audit-report.json");
console.log("================================================================");
