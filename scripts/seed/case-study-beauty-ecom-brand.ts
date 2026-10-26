/**
 * Creates the "Beauty eCommerce Brand" case study as a DRAFT
 * (drafts.caseStudy-beauty-ecom-brand) so it can be reviewed on localhost
 * and published from the Studio. Content comes from the client's Jan–Oct
 * 2026 Search Console, GA4 and Ahrefs exports; the client is anonymous.
 *
 *   HERO_PATH=<path to the 1420×684 hero art> \
 *   node --env-file=.env.local --experimental-strip-types scripts/seed/case-study-beauty-ecom-brand.ts
 *
 * Re-runs replace the draft. Pillar and metric icons come from
 * scripts/seed/assets/beauty-ecom-brand/ (the case study's own line icons,
 * styled like the template's); uploads are remembered in the git-ignored
 * scripts/seed/case-study-beauty-ecom-brand-assets-snapshot.json.
 * The interactive proof visuals live in
 * src/components/pages/case-studies/proof-visuals.ts (beauty-* ids).
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

import { createSeedClient } from "./lib.ts";

const SLUG = "beauty-ecom-brand";
const DOC_ID = `caseStudy-${SLUG}`;
const DRAFT_ID = `drafts.${DOC_ID}`;
const ICONS_DIR = path.resolve("scripts/seed/assets/beauty-ecom-brand");
const CACHE_PATH = path.resolve("scripts/seed/case-study-beauty-ecom-brand-assets-snapshot.json");

const client = createSeedClient();

const cache: Record<string, string> = (() => {
  try {
    return JSON.parse(readFileSync(CACHE_PATH, "utf8"));
  } catch {
    return {};
  }
})();

/** Uploads an icon from the assets folder once and returns a Sanity image value. */
async function icon(name: string, alt: string) {
  const file = `${name}.svg`;
  if (!cache[file]) {
    const asset = await client.assets.upload("image", readFileSync(path.join(ICONS_DIR, file)), { filename: file });
    cache[file] = asset._id;
    writeFileSync(CACHE_PATH, `${JSON.stringify(cache, null, 2)}\n`);
    console.log("uploaded", file, "→", asset._id);
  }
  return { _type: "image", alt, asset: { _type: "reference", _ref: cache[file] } };
}

const block = (key: string, text: string) => ({ _key: key, _type: "block", style: "normal", markDefs: [], children: [{ _key: `${key}-c0`, _type: "span", marks: [], text }] });

async function heroImage() {
  const file = process.env.HERO_PATH;
  if (!file) {
    // WHY: the default perspective hides drafts, so the draft is read raw.
    const existing = await client.withConfig({ perspective: "raw" }).fetch<{ asset?: { _ref: string } } | null>(`*[_id == $id][0].heroImage`, { id: DRAFT_ID });
    if (existing?.asset?._ref) return { _type: "image", alt: "Beauty eCom Brand case study", asset: { _type: "reference", _ref: existing.asset._ref } };
    throw new Error("HERO_PATH not set and the draft has no hero image yet");
  }
  const asset = await client.assets.upload("image", readFileSync(file), { filename: "beauty-ecom-brand-hero.jpg" });
  console.log("uploaded hero →", asset._id);
  return { _type: "image", alt: "Beauty eCom Brand case study", asset: { _type: "reference", _ref: asset._id } };
}

const MONTHS = ["JAN26", "FEB26", "MAR26", "APR26", "MAY26", "JUN26", "JUL26", "AUG26", "SEP26", "OCT26"];

const doc = {
  _id: DRAFT_ID,
  _type: "caseStudy",
  title: "From Decline to Double: Beauty eCommerce Brand's Organic Turnaround",
  titleHighlighted: "From Decline to Double:",
  slug: { _type: "slug", current: SLUG },
  heroSubtitle: "How a three-month, full-execution SEO sprint reversed a shrinking organic channel and doubled organic revenue, with growth still compounding after handover.",
  heroImage: await heroImage(),
  heroMetrics: [
    { _key: "hm-0", value: "3 Months", label: "Full Execution" },
    { _key: "hm-1", value: "2×", label: "Organic Revenue" },
    { _key: "hm-2", value: "+72%", label: "Organic Traffic" },
  ],
  client: "Beauty eCommerce Brand",
  excerpt: "How a three-month SEO sprint for an online beauty retailer reversed a 33% organic revenue decline, doubled daily organic revenue and lifted organic traffic 72%, with growth still compounding after handover.",
  featured: false,
  caseOverview: {
    label: "/  Case Overview  /",
    headingMain: "From a Shrinking Channel to",
    headingHighlighted: "Compounding Growth in 3 Months",
    body: "An online beauty retailer selling premium makeup, fragrance, hair care and skincare came to us in June 2026 with an organic channel moving in the wrong direction. Between March and June, organic sessions had fallen 23% and organic revenue 33%, even though the store carried a large catalog of well-known international brands. We ran a three-month, full-execution engagement from June to September 2026: a technical and cannibalization audit, a rebuilt category architecture with new brand and brand-by-category collection pages, 30+ buying guides on high-intent collections, a new internal linking system, a homepage restructure and a first wave of digital PR. By September, organic sessions were up 61% and monthly organic revenue up 90% against June. The momentum held after the sprint ended: in October the store is averaging 2,117 organic sessions and €975 in organic revenue per day, more than double June's €477.",
  },
  numbersThatMatter: {
    label: "/  Performance Metrics  /",
    headingMain: "The Numbers",
    headingHighlighted: "That Matter",
    body: "Every figure below comes straight from the store's Google Search Console, Google Analytics 4 and Ahrefs data. We measure against June 2026, the month the engagement started, and keep tracking after the three-month sprint to show the gains held and kept growing.",
    items: [
      { _key: "nm-0", value: "2×", label: "Organic Revenue", sub: "↑ €477 → €975 per day", icon: await icon("number-revenue", "Organic revenue") },
      { _key: "nm-1", value: "+72%", label: "Organic Sessions", sub: "↑ 1,233 → 2,117 per day", icon: await icon("number-sessions", "Organic sessions") },
      { _key: "nm-2", value: "53.4K", label: "Search Clicks / 28 Days", sub: "↑ From 32.6K (+64%)", icon: await icon("number-clicks", "Search clicks") },
      { _key: "nm-3", value: "937K", label: "Search Impressions / 28 Days", sub: "↑ From 519K (+81%)", icon: await icon("number-impressions", "Search impressions") },
      { _key: "nm-4", value: "598", label: "Top 3 Rankings", sub: "↑ From 354 (+69%)", icon: await icon("number-top3", "Top 3 rankings") },
      { _key: "nm-5", value: "1,502", label: "Top 10 Rankings", sub: "↑ From 982 (+53%)", icon: await icon("number-top10", "Top 10 rankings") },
      { _key: "nm-6", value: "+106%", label: "Category Page Clicks", sub: "↑ 12.1K → 24.9K / 28 days", icon: await icon("number-category-clicks", "Category page clicks") },
      { _key: "nm-7", value: "€42K+", label: "Incremental Revenue", sub: "↑ Above June run-rate", icon: await icon("number-incremental-revenue", "Incremental revenue") },
    ],
  },
  // Monthly daily averages (October = Oct 1–21). Traffic reads on the left axis, revenue and keywords on the right.
  growthChart: {
    headingMain: "Growth Trajectory, Indexed to the June Kickoff",
    headingHighlighted: "",
    leftAxisLabel: "Organic sessions / day",
    rightAxisLabel: "Revenue (EUR) / keywords",
    months: MONTHS,
    series: [
      { _key: "gs-0", label: "Organic Traffic / day", color: "gradient-light", points: [1429, 1464, 1559, 1398, 1288, 1233, 1404, 1653, 1982, 2117] },
      { _key: "gs-1", label: "Organic Revenue / day (EUR)", color: "indigo", points: [615, 620, 688, 705, 587, 477, 643, 925, 907, 975] },
      { _key: "gs-2", label: "Top 3 Keywords", color: "grey-trace", points: [243, 290, 299, 276, 329, 354, 428, 448, 480, 598] },
    ],
    tooltipMonth: "OCT26",
    tooltipMetrics: [
      { _key: "tm-0", label: "Organic Traffic / day", value: "2,117" },
      { _key: "tm-1", label: "Organic Revenue / day", value: "€975" },
      { _key: "tm-2", label: "Top 3 Keywords", value: "598" },
    ],
  },
  proofData: {
    label: "/  Real Results  /",
    headingMain: "The Proof Is in",
    headingHighlighted: "the Data",
    body: "We don't just talk about results. These panels are rebuilt from the store's own Search Console, GA4 and Ahrefs data, with the comparison period stated on every one. The baseline is June 2026, the first month of the engagement; October covers October 1–21.",
    items: [
      {
        _key: "pd-0",
        title: "Google Search Console Performance",
        body: "Search clicks grew 64% and impressions 81%, while average position improved from 6.8 to 6.2. Non-branded clicks, the cleanest signal of SEO work, rose 60%.",
        interactiveVisual: "beauty-search-console",
        metricTags: [
          { _key: "t0", label: "Clicks", value: "+64%", isAccent: true },
          { _key: "t1", label: "Impressions", value: "+81%", isAccent: true },
          { _key: "t2", label: "Non-branded", value: "+60%", isAccent: true },
        ],
      },
      {
        _key: "pd-1",
        title: "Keyword Rankings Growth",
        body: "Keywords ranking in Google's top 3 grew from 354 to 598 between June and October, and total top-10 rankings climbed from 982 to 1,502.",
        interactiveVisual: "beauty-keyword-rankings",
        metricTags: [
          { _key: "t0", label: "Top 3", value: "+69%", isAccent: true },
          { _key: "t1", label: "Top 10", value: "+53%", isAccent: true },
        ],
      },
      {
        _key: "pd-2",
        title: "Top Keyword Wins",
        body: "High-intent category, brand and seasonal searches moved onto page one, many of them from no visibility at all. In the latest 28 days, 324 non-branded queries that sent no clicks in June delivered more than 5,000 clicks between them.",
        interactiveVisual: "beauty-top-keyword-wins",
        isFullWidth: true,
        metricTags: [],
      },
      {
        _key: "pd-3",
        title: "Monthly Organic Revenue Tracking",
        body: "Organic search revenue doubled from €14.3K in June to €28.7K in August and held at €27.2K in September. October has already booked €20.5K in its first 21 days and is on pace for about €30K, the strongest organic month of 2026.",
        interactiveVisual: "beauty-monthly-revenue",
        isFullWidth: true,
        metricTags: [
          { _key: "t0", label: "Revenue / day", value: "+104%", isAccent: true },
          { _key: "t1", label: "Engaged sessions", value: "+149%", isAccent: true },
          { _key: "t2", label: "Orders", value: "+55%", isAccent: true },
        ],
      },
      {
        _key: "pd-4",
        title: "Category Pages Became the Growth Engine",
        body: "New brand and brand-by-category collections, buying-guide content and stronger internal links doubled the traffic landing on category pages. 175 collection pages that had no search impressions in June now rank and bring in around 7,200 clicks every 28 days.",
        interactiveVisual: "beauty-collection-pages",
        isFullWidth: true,
        metricTags: [
          { _key: "t0", label: "Collection clicks", value: "+106%", isAccent: true },
          { _key: "t1", label: "Collection impressions", value: "+136%", isAccent: true },
        ],
      },
    ],
  },
  objectiveChallenges: {
    label: "/  Objective & Challenges  /",
    headingMain: "Stop the Slide and Build",
    headingHighlighted: "a Durable Organic Revenue Engine",
    body: "The goal was to reverse the organic decline and turn search into a dependable revenue channel within a three-month window, covering technical, on-page, content and off-site SEO.",
    items: [
      { _key: "ch-0", number: "01", title: "Initial SEO Status", body: "Organic traffic and revenue were falling month over month. Category pages carried little content, many brand and brand-by-category searches had no matching landing page, and product URLs competed with each other for the same queries." },
      { _key: "ch-1", number: "02", title: "Key Obstacles", body: "Larger regional beauty retailers and marketplaces owned the results pages with deeper category coverage, while the store's domain authority sat in single digits, so links alone could not close the gap." },
      { _key: "ch-2", number: "03", title: "Resource Constraints", body: "Three months of full execution on a live Shopify store, with every change shipped without interrupting sales or the store's campaign calendar." },
    ],
  },
  strategyIntro: {
    label: "/  Our Proven Strategy  /",
    headingMain: "Six Pillars of",
    headingHighlighted: "the Turnaround",
    highlightPosition: "trailing",
    body: "A beauty store wins search one brand and one category at a time. We put the effort where revenue was waiting: pages that matched real demand, content that answered buyers' questions, and links that pushed authority to the pages that sell.",
  },
  strategyPillars: [
    { _key: "sp-0", title: "Full SEO Audit", intro: "A deep review that set the priorities for all three months:", bullets: ["Technical crawl and indexation review", "Product URL cannibalization audit", "Competitor and keyword gap analysis", "Authorized-reseller and trust signal review"], icon: await icon("pillar-audit", "Full SEO audit") },
    { _key: "sp-1", title: "Category Architecture", intro: "A structure that gives every valuable search a page built to win it:", bullets: ["New brand and brand × category collections", "Breadcrumb system rebuild", "Homepage restructure around priority categories", "Internal link budget for crawl efficiency"], icon: await icon("pillar-architecture", "Category architecture") },
    { _key: "sp-2", title: "Buying-Guide Content", intro: "Collection content written for shoppers comparing products:", bullets: ["30+ collection buying guides", "WDF*IDF-driven term coverage", "FAQ blocks on every guide", "Product recommendation cards"], icon: await icon("pillar-content", "Buying-guide content") },
    { _key: "sp-3", title: "Internal Linking", intro: "Authority routed to the pages that make money:", bullets: ["Below-H1 related-category modules", "Pre-footer link hubs", "Brand ↔ category cross-links", 'Priority on "low-hanging fruit" pages'], icon: await icon("pillar-internal-linking", "Internal linking") },
    { _key: "sp-4", title: "Authority & Digital PR", intro: "Quality placements that build the brand, not just the link count:", bullets: ["Brand-building listicles", "Native PR articles on regional portals", "Natural anchor text mix", "Irregular, organic link velocity"], icon: await icon("pillar-digital-pr", "Authority and digital PR") },
    { _key: "sp-5", title: "Data-Driven Iteration", intro: "Decisions made on revenue data, every week:", bullets: ["Weekly GSC and GA4 monitoring", "Position 4–15 opportunity tracking", "Revenue-first prioritization", "Seasonal demand planning"], icon: await icon("pillar-data", "Data-driven iteration") },
  ],
  journeyTimeline: {
    label: "/  Execution  /",
    headingMain: "The Journey to",
    headingHighlighted: "Success",
    items: [
      { _key: "jt-0", title: "Discovery & Audit", body: "Technical, content and cannibalization audit, plus keyword and competitor gap analysis to map the brand and category demand the store was missing." },
      { _key: "jt-1", title: "Technical & Architecture", body: "Resolved competing product URLs, rebuilt breadcrumbs and shipped new internal linking modules so authority flows to revenue pages." },
      { _key: "jt-2", title: "Categories & Content", body: "Launched new brand and brand-by-category collections and wrote 30+ buying guides across makeup, fragrance, hair care and suncare." },
      { _key: "jt-3", title: "Homepage & Authority", body: "Restructured the homepage around priority brands and categories and launched a natural digital PR program on regional media." },
      { _key: "jt-4", title: "Compounding Growth", body: "After the sprint closed in September, rankings and revenue kept climbing. October is pacing for the best organic month of 2026." },
    ],
  },
  beforeAfter: {
    label: "/  Real Results  /",
    headingMain: "Before vs",
    headingHighlighted: "After",
    body: "Every number below is measured against June 2026, the month the engagement started, and the latest data to October 21.",
    beforeLabel: "Before - June 26",
    afterLabel: "Now",
    items: [
      { _key: "ba-0", label: "Organic Sessions / Day", before: "1,233", after: "2,117" },
      { _key: "ba-1", label: "Organic Revenue / Month", before: "€14.3K", after: "€30K" },
      { _key: "ba-2", label: "Organic Orders / Month", before: "331", after: "512" },
      { _key: "ba-3", label: "Top 3 Keywords", before: "354", after: "598" },
      { _key: "ba-4", label: "Search Clicks / 28 Days", before: "32.6K", after: "53.4K" },
    ],
  },
  conclusion: {
    heading: "Conclusion",
    gradientSubhead: "Three months of focused execution built an organic channel that keeps growing after the work is handed over.",
    body: [
      block("beauty-conclusion-0", "This project shows what happens when strategy and execution land in the same quarter. Instead of trying to outspend larger competitors, we fixed the foundation, gave every important brand and category search a page built to win it, and connected those pages so authority flows to where revenue is made. The sprint ended in September. The growth curve didn't."),
      block("beauty-conclusion-1", "Data sources and method: Google Search Console (domain property; non-branded = queries not containing the brand name), Google Analytics 4 (Organic Search channel, total revenue) and Ahrefs (organic keyword positions, monthly snapshots). The baseline is June 2026, the first month of the engagement. October 2026 covers October 1–21; monthly comparisons use daily averages where months differ in length, and the October revenue pace is the October 1–21 daily average × 31 days. Revenue is converted to EUR at the central-bank mid-rate. Incremental revenue is organic revenue from July 1 to October 21 above the June daily run-rate. The client's name is withheld at their request."),
    ],
  },
  services: ["ecommerce-seo", "technical-seo", "on-page-seo", "content-creation", "link-building"],
  publishedAt: "2026-10-26T00:00:00.000Z",
  seo: {
    _type: "seo",
    metaTitle: "Beauty eCommerce SEO Case Study: 2× Organic Revenue in 3 Months | Heroic Rankings",
    metaDescription: "How a three-month, full-execution SEO sprint reversed an online beauty retailer's organic decline: 2× organic revenue, +72% organic traffic and 598 top-3 keywords, with growth compounding after handover.",
  },
};

const published = await client.fetch<{ _id: string } | null>(`*[_id == $id][0]{_id}`, { id: DOC_ID });
if (published) {
  console.error(`${DOC_ID} is already published; this script only writes the draft. Edit it in the Studio instead.`);
  process.exit(1);
}

const result = await client.createOrReplace(doc);
console.log(`draft written: ${result._id} (rev ${result._rev}) → http://localhost:3000/case-study/${SLUG}/`);
