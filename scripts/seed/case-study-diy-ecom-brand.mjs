/**
 * Loads the case study TEMPLATE content (Figma 2255:878 "HR - Case Study
 * Single Page") into the "DIY Craft eCom Brand" document, with the client
 * name replaced per the NDA ("DIY eCommerce Brand" in the H1, "the website"
 * in copy). Uploads the frame's icons and analytics screenshots to Sanity.
 *
 * Usage:
 *   ASSETS_DIR=<folder with the exported Figma assets> \
 *   node --env-file=.env.local scripts/seed/case-study-diy-ecom-brand.mjs
 *
 * Re-runs are cheap: uploaded assets are remembered in
 * scripts/seed/case-study-diy-ecom-brand-assets-snapshot.json (git-ignored).
 * To start another case study, duplicate the document in the Studio.
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "next-sanity";

const SLUG = "diy-craft-ecom-brand";
const ASSETS_DIR = process.env.ASSETS_DIR;
const CACHE_PATH = path.resolve("scripts/seed/case-study-diy-ecom-brand-assets-snapshot.json");

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: "2025-01-01",
  useCdn: false,
});

const cache = await readFile(CACHE_PATH, "utf8").then(JSON.parse).catch(() => ({}));

/** Upload a local file once; returns a Sanity image field value. */
async function image(file, alt) {
  if (!cache[file]) {
    if (!ASSETS_DIR) throw new Error(`ASSETS_DIR not set and ${file} not cached`);
    const buffer = await readFile(path.join(ASSETS_DIR, file));
    const asset = await client.assets.upload("image", buffer, { filename: file });
    cache[file] = asset._id;
    await writeFile(CACHE_PATH, `${JSON.stringify(cache, null, 2)}\n`);
    console.log("uploaded", file, "→", asset._id);
  }
  return { _type: "image", alt, asset: { _type: "reference", _ref: cache[file] } };
}

const block = (key, text) => ({ _key: key, _type: "block", style: "normal", markDefs: [], children: [{ _key: `${key}-c0`, _type: "span", marks: [], text }] });

const doc = await client.fetch(`*[_type=="caseStudy" && slug.current=="${SLUG}" && !(_id in path("drafts.**"))][0]{_id}`);
if (!doc) throw new Error(`case study ${SLUG} not found`);

const pillarIcons = [
  ["icon-pillar-audit.svg", "Comprehensive SEO audit"],
  ["icon-pillar-technical.svg", "Technical foundation"],
  ["icon-pillar-content.svg", "Content optimization"],
  ["icon-pillar-links.svg", "Authority link building"],
  ["icon-pillar-ai.svg", "AI engine optimization"],
  ["icon-pillar-data.svg", "Data-driven approach"],
];
const numberIcons = [
  ["icon-number-domain-rating.svg", "Domain rating"],
  ["icon-number-traffic.svg", "Organic traffic"],
  ["icon-number-referring-domains.svg", "Referring domains"],
  ["icon-number-keywords.svg", "Organic keywords"],
  ["icon-number-impressions.svg", "Search impressions"],
  ["icon-number-clicks.svg", "Search clicks"],
  ["icon-number-rankings.svg", "Top 3 rankings"],
  ["icon-number-revenue.svg", "Organic revenue"],
];

const content = {
  title: "From Zero to Hero: DIY eCommerce Brand's Journey",
  titleHighlighted: "From Zero to Hero:",
  heroSubtitle: "How we transformed a new brand into an e-commerce giant through data-driven SEO strategies",
  panelLabel: "DIY eCom Brand",
  client: "DIY eCommerce Brand",
  excerpt: "How a brand-new DIY e-commerce store went from zero online presence to 63,500+ monthly organic visitors and $1.3M in organic revenue in 24 months.",
  heroMetrics: [
    { _key: "hm-0", value: "24", label: "Months" },
    { _key: "hm-1", value: "$1.3M", label: "Organic Revenue" },
    { _key: "hm-2", value: "63,500", label: "Monthly Visitors" },
  ],
  caseOverview: {
    label: "/  Case Overview  /",
    headingMain: "From Startup to",
    headingHighlighted: "Market Leader in 24 Months",
    body: 'The website approached us in March 2024 as a brand-new e-commerce store with zero online presence—no traffic, no backlinks, and a Domain Rating of just 1. We implemented a comprehensive SEO strategy combining technical optimization, strategic link building targeting art and hobby websites, and pioneering AI engine optimization for ChatGPT and Perplexity. Over 24 months, we built 597 high-quality referring domains, achieved 800+ top-3 keyword rankings including #1 positions for high-volume terms like "custom paint by number" (12K monthly searches), and grew their Domain Rating to 54. The result: the website now generates 63,500+ monthly organic visitors and over $1.3M in total organic revenue, proving that strategic SEO execution delivers exceptional ROI without massive ad spend.',
  },
  objectiveChallenges: {
    label: "/  Objective & Challenges  /",
    headingMain: "Establish Online Presence and",
    headingHighlighted: "Generate Sustainable Organic Revenue",
    body: "The primary goal was to significantly improve the website's search engine rankings and organic traffic through a comprehensive SEO campaign, starting in March 2024. This campaign included onsite, technical, and offsite SEO efforts.",
    items: [
      { _key: "ch-0", number: "01", title: "Initial SEO Status", body: "The website had limited referring domains and faced strong competition from other online stores offering similar products." },
      { _key: "ch-1", number: "02", title: "Key Obstacles", body: "Improving site performance and technical SEO while building high-quality backlinks to compete with established websites with stronger SEO metrics." },
      { _key: "ch-2", number: "03", title: "Resource Constraints", body: "The website needed an effective SEO strategy that could deliver results within a short time frame." },
    ],
  },
  strategyIntro: {
    label: "/  Our Proven Strategy  /",
    headingHighlighted: "Six Pillars",
    headingMain: "of Dominant SEO",
    highlightPosition: "leading",
    body: "Success in SEO isn't about shortcuts—it's about doing the fundamentals exceptionally well. Our framework has been tested and refined across dozens of clients, delivering consistent results through strategic execution, continuous optimization, and unwavering commitment to quality over quantity.",
  },
  strategyPillars: [
    { _key: "sp-0", title: "Comprehensive SEO Audit", intro: "Deep-dive analysis identifying every opportunity for improvement:", bullets: ["Technical SEO performance analysis", "Competitor gap analysis", "Keyword opportunity mapping", "Site structure optimization"], icon: await image(...pillarIcons[0]) },
    { _key: "sp-1", title: "Technical Foundation", intro: "Building an unshakeable technical foundation:", bullets: ["Schema markup implementation", "Core Web Vitals optimization", "Mobile-first indexing readiness", "Google Shopping integration"], icon: await image(...pillarIcons[1]) },
    { _key: "sp-2", title: "Content Optimization", intro: "Strategic content targeting high-intent buyers:", bullets: ["Product page optimization", "Educational content creation", "Meta tags & descriptions", "Internal linking strategy"], icon: await image(...pillarIcons[2]) },
    { _key: "sp-3", title: "Authority Link Building", intro: "Quality over quantity approach to backlinks:", bullets: ["DR 40+ domain targeting", ".edu institutional backlinks", "Topically relevant placements", "Natural link velocity"], icon: await image(...pillarIcons[3]) },
    { _key: "sp-4", title: "AI Engine Optimization", intro: "Next-generation visibility strategy:", bullets: ["ChatGPT optimization", "Perplexity AI targeting", "Google Gemini presence", "Featured in AI responses"], icon: await image(...pillarIcons[4]) },
    { _key: "sp-5", title: "Data-Driven Approach", intro: "Continuous improvement through analytics:", bullets: ["Weekly performance monitoring", "Keyword ranking tracking", "Conversion rate optimization", "ROI-focused adjustments"], icon: await image(...pillarIcons[5]) },
  ],
  journeyTimeline: {
    label: "/  Execution  /",
    headingMain: "The Journey to",
    headingHighlighted: "Success",
    items: [
      { _key: "jt-0", title: "Discovery & Strategy", body: "Comprehensive SEO audit revealing untapped opportunities. Client started from absolute zero: no domain authority, no backlinks, no organic presence." },
      { _key: "jt-1", title: "Technical Foundation", body: "Implemented schema markup, optimized site structure, enhanced page speed, and fixed technical SEO issues. Built the foundation for scalable growth." },
      { _key: "jt-2", title: "Content Optimization", body: "Strategic content creation targeting high-intent keywords in the art/hobby space. Optimized product pages and created educational resources." },
      { _key: "jt-3", title: "Authority Building", body: "Secured 500+ high-quality backlinks from DR 40+ domains, including prestigious .edu institutions. Maintained natural link velocity and topical relevance." },
      { _key: "jt-4", title: "AI Optimization", body: "Pioneered AI Engine Optimization (AEO) bringing monthly users from ChatGPT, Perplexity, and Gemini." },
    ],
  },
  numbersThatMatter: {
    label: "/  Performance Metrics  /",
    headingMain: "The Numbers",
    headingHighlighted: "That Matter",
    body: "Results speak louder than promises. From zero online presence to industry leadership, these metrics tell the story of strategic SEO execution done right. Every number represents months of careful planning, consistent execution, and relentless optimization—transforming the website into a traffic-generating, revenue-producing machine.",
    items: [
      { _key: "nm-0", value: "54", label: "Domain Rating", sub: "↑ From 1 to 54", icon: await image(...numberIcons[0]) },
      { _key: "nm-1", value: "63.5K", label: "Monthly Organic Traffic", sub: "↑ From 0", icon: await image(...numberIcons[1]) },
      { _key: "nm-2", value: "597", label: "Referring Domains", sub: "↑ From 0", icon: await image(...numberIcons[2]) },
      { _key: "nm-3", value: "3.6K", label: "Organic Keywords", sub: "↑ From 0", icon: await image(...numberIcons[3]) },
      { _key: "nm-4", value: "16.1M", label: "Search Impressions", sub: "↑ Total reach", icon: await image(...numberIcons[4]) },
      { _key: "nm-5", value: "200K+", label: "Search Clicks", sub: "↑ Engaged users", icon: await image(...numberIcons[5]) },
      { _key: "nm-6", value: "800+", label: "Top 3 Rankings", sub: "↑ Keywords in top 3", icon: await image(...numberIcons[6]) },
      { _key: "nm-7", value: "$1.3M", label: "Organic Revenue", sub: "↑ 2-year total", icon: await image(...numberIcons[7]) },
    ],
  },
  // WHY: values are read off the frame's plotted points (JAN24 → JAN26, quarterly).
  growthChart: {
    headingMain: "Growth Trajectory Over 24 Months",
    headingHighlighted: "",
    leftAxisLabel: "Organic Traffic",
    rightAxisLabel: "Domains / DR",
    months: ["JAN24", "MAR24", "JUN24", "SEP24", "DEC24", "MAR25", "JUN25", "SEP25", "DEC25", "JAN26"],
    series: [
      { _key: "gs-0", label: "Referring Domains", color: "indigo", points: [0, 0, 61, 100, 212, 359, 418, 518, 589, 597] },
      { _key: "gs-1", label: "Organic Traffic", color: "gradient-light", points: [0, 0, 0, 2500, 35000, 14000, 37100, 33350, 62201, 63500] },
      { _key: "gs-2", label: "Domain Rating", color: "grey-trace", points: [1, 1, 40, 40, 43, 53, 50, 50, 57, 54] },
    ],
    tooltipMonth: "DEC25",
    tooltipMetrics: [
      { _key: "tm-0", label: "Referring Domains", value: "589" },
      { _key: "tm-1", label: "Organic Traffic", value: "62,201" },
      { _key: "tm-2", label: "Domain Rating", value: "57" },
    ],
  },
  proofData: {
    label: "/  Real Results  /",
    headingMain: "The Proof Is in",
    headingHighlighted: "the Data",
    body: "We don't just talk about results — we prove them with real analytics from leading platforms.",
    items: [
      { _key: "pd-0", title: "Ahrefs Analytics Dashboard", body: "Complete Ahrefs performance metrics showing the dramatic climb from DR 1 to DR 54, along with backlink profile growth and organic keyword expansion.", image: await image("proof-ahrefs-overview.png", "Ahrefs overview dashboard"), metricTags: [{ _key: "t0", label: "Domain Rating", value: "54", isAccent: true }, { _key: "t1", label: "Ref. Domains", value: "597", isAccent: true }, { _key: "t2", label: "Keywords", value: "3.6K", isAccent: true }] },
      { _key: "pd-1", title: "Google Search Console Performance", body: "Real Search Console data showing 16.1 million impressions and 200K+ clicks, demonstrating massive search visibility and user engagement.", image: await image("proof-gsc-performance.png", "Google Search Console performance chart"), metricTags: [{ _key: "t0", label: "Impressions", value: "16.1M", isAccent: true }, { _key: "t1", label: "Clicks", value: "200K+", isAccent: true }] },
      { _key: "pd-2", title: "Top 3 Keyword Rankings", body: "Over 800 keywords ranking in the top 3 positions on Google, generating 65K+ monthly organic traffic from high-intent searches.", image: await image("proof-top3-keywords.png", "Top 3 keyword rankings report"), metricTags: [{ _key: "t0", label: "Top 3 Rankings", value: "800+", isAccent: true }, { _key: "t1", label: "Organic Traffic", value: "65K", isAccent: true }] },
      { _key: "pd-3", title: "AI Engine Revenue", body: "(ChatGPT, Perplexity, Gemini) Breaking new ground with AI Engine Optimization-generating $1,000+ per month from ChatGPT, traffic.", image: await image("proof-ai-engine-revenue.png", "AI engine traffic and revenue in Google Analytics"), metricTags: [{ _key: "t0", label: "", value: "Next-Gen Traffic Source", isAccent: true }] },
      { _key: "pd-4", title: "Revenue Forecasting & Performance", body: "Strategic revenue projections and actual performance tracking showing consistent month-over-month growth leading to $1.3M total organic revenue.", image: await image("proof-revenue-forecasting.png", "Revenue forecasting spreadsheet"), isFullWidth: true, metricTags: [] },
      { _key: "pd-5", title: "Monthly SEO Revenue Tracking", body: "Detailed month-by-month organic revenue breakdown showing the steady upward trajectory from campaign start to $1.3M+ in cumulative revenue.", image: await image("proof-monthly-revenue.png", "Monthly organic search revenue chart"), isFullWidth: true, metricTags: [] },
    ],
  },
  beforeAfter: {
    label: "/  Real Results  /",
    headingMain: "Before vs",
    headingHighlighted: "After",
    body: "We don't just talk about results — we prove them with real analytics from leading platforms.",
    beforeLabel: "Before - March 24",
    afterLabel: "Present",
    items: [
      { _key: "ba-0", label: "Domain Rating", before: "1", after: "54" },
      { _key: "ba-1", label: "Organic Traffic", before: "0", after: "63.5k" },
      { _key: "ba-2", label: "Referring Domains", before: "0", after: "597" },
      { _key: "ba-3", label: "Organic Keywords", before: "0", after: "3,600" },
      { _key: "ba-4", label: "Monthly Revenue", before: "$0", after: "$54k+" },
    ],
  },
  conclusion: {
    heading: "Conclusion",
    gradientSubhead: "All external links built by our team remain active, ensuring clients continue to benefit from their investments.",
    body: [
      block("diy-conclusion-0", "This project exemplifies how precise, strategic actions and full collaboration between the client's team and our in-house experts can achieve outstanding results by adhering to best practices rather than outspending the competition. By following this structured approach, the website successfully improved their search engine rankings and organic traffic, demonstrating the effectiveness of strategic SEO optimization and link-building efforts."),
    ],
  },
  seo: {
    _type: "seo",
    metaTitle: "DIY eCommerce Brand SEO Case Study | From Zero to $1.3M Organic Revenue",
    metaDescription: "How Heroic Rankings took a brand-new DIY e-commerce store from zero to 63,500+ monthly organic visitors, 597 referring domains and $1.3M in organic revenue in 24 months.",
  },
};

const result = await client
  .patch(doc._id)
  .set(content)
  // WHY: the frame's hero strip is a gradient panel, so no photo here.
  .unset(["heroImage", "ctaFooter"])
  .commit();
console.log("patched", result._id, "rev", result._rev);
try {
  await client.delete(`drafts.${doc._id}`);
  console.log("stale draft removed");
} catch {
  /* no draft */
}
