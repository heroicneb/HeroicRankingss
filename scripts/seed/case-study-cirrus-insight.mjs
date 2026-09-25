/**
 * Creates the "Cirrus Insight" case study from the Clutch review (scope,
 * deliverables, goals) and the Ahrefs export (www.cirrusinsight.com_perf_2026-09-26).
 * Template layout; proof cards left empty. Icons reuse the assets uploaded for
 * the DIY eCom template.
 *
 * Usage:
 *   CSV=~/Downloads/www.cirrusinsight.com_perf_2026-09-26_01-09-20.csv \
 *   node --env-file=.env.local scripts/seed/case-study-cirrus-insight.mjs
 */
import { readFile } from "node:fs/promises";
import { createClient } from "next-sanity";

const CSV = process.env.CSV;
if (!CSV) throw new Error("CSV env var must point at the Ahrefs export");
const icons = JSON.parse(await readFile("scripts/seed/case-study-diy-ecom-brand-assets-snapshot.json", "utf8"));
const icon = (file, alt) => ({ _type: "image", alt, asset: { _type: "reference", _ref: icons[file] } });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: "2025-01-01",
  useCdn: false,
});

// --- CSV → month-end series ---------------------------------------------
const rows = (await readFile(CSV, "utf8")).split(/\r?\n/).map((l) => l.split(",").map((c) => c.trim()));
const header = rows[0];
const col = (name) => header.indexOf(name);
const daily = rows.filter((r) => /^20\d\d-\d\d-\d\d$/.test(r[0] ?? ""));
const num = (r, name) => Number(r[col(name)]);
const byMonth = new Map();
for (const r of daily) byMonth.set(r[0].slice(0, 7), r);
const months = [...byMonth.keys()];
const MON = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const label = (ym) => `${MON[Number(ym.slice(5, 7)) - 1]}${ym.slice(2, 4)}`;
const series = (name) => months.map((m) => num(byMonth.get(m), name));
const first = daily[0]; // campaign start (first day of the export)
const last = byMonth.get(months[months.length - 1]);
const fmtK = (n) => (n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, "")}K` : String(n));
const fmtInt = (n) => n.toLocaleString("en-US");
const v = (r, c) => num(r, c);
const traffic0 = v(first, "Organic traffic"), traffic1 = v(last, "Organic traffic");
const rd0 = v(first, "Referring domains"), rd1 = v(last, "Referring domains");
const value0 = v(first, "Organic traffic value"), value1 = v(last, "Organic traffic value");
const imp0 = v(first, "Impressions"), imp1 = v(last, "Impressions");
const info0 = v(first, "Organic traffic by intent: Informational"), info1 = v(last, "Organic traffic by intent: Informational");
const nonBrand0 = v(first, "Organic traffic: Non-branded"), nonBrand1 = v(last, "Organic traffic: Non-branded");
const dr1 = v(last, "Domain Rating");
const pct = (a, b) => `+${Math.round(((b - a) / a) * 100)}%`;
const monthsElapsed = months.length - 1;
console.log(`period ${months[0]} → ${months.at(-1)} (${monthsElapsed} months)`);
console.log({ traffic0, traffic1, rd0, rd1, value0, value1, imp0, imp1, info0, info1, nonBrand0, nonBrand1, dr1 });

const block = (key, text) => ({ _key: key, _type: "block", style: "normal", markDefs: [], children: [{ _key: `${key}-c0`, _type: "span", marks: [], text }] });

const doc = {
  _id: "caseStudy-cirrus-insight",
  _type: "caseStudy",
  title: "Scaling Visibility in AI Search: Cirrus Insight's SEO and AEO Journey",
  titleHighlighted: "Scaling Visibility in AI Search:",
  slug: { _type: "slug", current: "cirrus-insight" },
  client: "Cirrus Insight",
  panelLabel: "Cirrus Insight",
  website: { label: "cirrusinsight.com", href: "https://www.cirrusinsight.com/" },
  services: ["content-creation", "keyword-strategy", "link-building", "on-page-seo"],
  publishedAt: "2026-02-22T00:00:00.000Z",
  excerpt: "A content-led SEO and AEO program helped Cirrus Insight, a Salesforce sales productivity platform, grow organic traffic, authority and visibility across new topic clusters.",
  heroSubtitle: "A content-led SEO and AEO program helped a Salesforce sales productivity platform grow organic traffic, authority, and visibility across new topic clusters.",
  heroMetrics: [
    { _key: "hm-0", value: String(monthsElapsed), label: "Months" },
    { _key: "hm-1", value: pct(traffic0, traffic1), label: "Organic Traffic" },
    { _key: "hm-2", value: `${(value1 / value0).toFixed(1).replace(/\.0$/, "")}x`, label: "Traffic Value" },
  ],
  caseOverview: {
    label: "/  Case Overview  /",
    headingMain: "Turning Content Into",
    headingHighlighted: "Search and AI Visibility",
    body: [
      "Cirrus Insight is a sales productivity and CRM integration platform that connects Salesforce with Gmail, Outlook, and calendars, automating data syncing, scheduling, meeting preparation, and live coaching so sales teams can manage customer interactions directly from their inbox. Since May 2025, Heroic Rankings has run an ongoing SEO and AEO program for the company, with a team of two to five specialists assigned to the account.",
      "The engagement brings keyword research, competitor benchmarking, content creation, and link building together under one strategy. Each month the team publishes six to eight new blog posts and one linkable asset, re-optimizes existing articles, and delivers topic cluster breakdowns, competitor benchmark reports, keyword gap analyses, and traffic and ranking reports. AEO optimizations keep the content visible to AI answer engines as well as traditional search.",
      `The partnership is still active. In the first ${monthsElapsed} months, Cirrus Insight grew its monthly organic traffic from ${fmtInt(traffic0)} to ${fmtInt(traffic1)} visits, added more than ${fmtInt(rd1 - rd0)} referring domains, and saw the value of its organic traffic climb from $${fmtK(value0)} to $${fmtK(value1)} per month. The client also reported stronger brand recognition and more direct traffic alongside the organic gains.`,
    ].join("\n\n"),
  },
  objectiveChallenges: {
    label: "/  Objective & Challenges  /",
    headingMain: "Grow Organic Traffic and",
    headingHighlighted: "Answer Engine Visibility",
    body: "Cirrus Insight came to Heroic Rankings with three clear goals: improve organic traffic, build visibility for new topic clusters, and grow the brand's presence in AI-generated answers. Doing that meant more than publishing articles; the site needed research-led targeting, stronger authority, and content shaped for both search engines and answer engines.",
    items: [
      { _key: "ch-0", number: "01", title: "Current Search Landscape", body: "Cirrus Insight already had a strong domain competing in a crowded sales-tech category against well-known CRM and sales engagement brands. Growth had to come from new topic clusters and from capturing the buyers who increasingly research tools through AI assistants rather than a search results page." },
      { _key: "ch-1", number: "02", title: "Key Objectives", body: "The program set out to lift organic traffic and qualified leads, establish rankings across new topic clusters, and grow the brand's share of AI answers. That required steady content output, ongoing re-optimization, keyword and gap research, competitor benchmarking, and a consistent flow of high-quality backlinks." },
      { _key: "ch-2", number: "03", title: "Strategic Challenges", body: "Publishing six to eight posts a month while re-optimizing older content demands a tight process, and every piece had to serve both classic ranking signals and AEO. Priorities also had to be managed within a fixed budget, so research, reporting, and link acquisition were sequenced to compound rather than compete." },
    ],
  },
  strategyIntro: {
    label: "/  Our Proven Strategy  /",
    headingHighlighted: "Six Pillars",
    headingMain: "of the Program",
    highlightPosition: "leading",
    body: "The scope of work covered every lever that moves search and answer-engine visibility. Each month combines research, production, authority building, and reporting so that new content, existing pages, and backlinks all pull in the same direction.",
  },
  strategyPillars: [
    { _key: "sp-0", title: "Keyword Research & Strategy", intro: "Research-led targeting for every piece of content:", bullets: ["Keyword research and prioritization", "Topic cluster breakdowns", "Search intent mapping", "Quarterly strategy reviews"], icon: icon("icon-pillar-audit.svg", "Keyword research") },
    { _key: "sp-1", title: "Competitor Benchmarking", intro: "Knowing exactly where the gaps are:", bullets: ["Competitor benchmark reports", "Keyword gap analysis", "Content gap identification", "Backlink profile comparison"], icon: icon("icon-pillar-data.svg", "Competitor benchmarking") },
    { _key: "sp-2", title: "Content Creation", intro: "A steady publishing engine for new topic clusters:", bullets: ["6–8 new blog posts per month", "Sales and CRM topic clusters", "Editorial calendar and briefs", "On-brand, expert-reviewed copy"], icon: icon("icon-pillar-content.svg", "Content creation") },
    { _key: "sp-3", title: "Content Re-Optimization", intro: "Ongoing upgrades to pages that already rank:", bullets: ["Refreshing existing blog posts", "Internal linking improvements", "Title, meta and heading updates", "Decay monitoring and fixes"], icon: icon("icon-pillar-technical.svg", "Content re-optimization") },
    { _key: "sp-4", title: "Linkable Assets & Backlinks", intro: "Authority that compounds month after month:", bullets: ["One linkable asset per month", "Monthly backlink orders", "Relevant, high-authority placements", "Natural link velocity"], icon: icon("icon-pillar-links.svg", "Link building") },
    { _key: "sp-5", title: "AEO & Reporting", intro: "Visibility in AI answers, measured every month:", bullets: ["AEO optimizations for answer engines", "Traffic and ranking reports", "Ongoing SEO recommendations", "Regular check-ins with the marketing team"], icon: icon("icon-pillar-ai.svg", "AEO optimization") },
  ],
  journeyTimeline: {
    label: "/  Execution  /",
    headingMain: "The Journey to",
    headingHighlighted: "Success",
    items: [
      { _key: "jt-0", title: "Research & Topic Clusters", body: "Keyword research and topic cluster breakdowns set the direction, identifying the sales, CRM, and Salesforce topics where Cirrus Insight could earn new visibility." },
      { _key: "jt-1", title: "Benchmark the Competition", body: "Competitor benchmark reports and keyword gap analysis showed where rival platforms ranked and which opportunities were still open, shaping the content plan." },
      { _key: "jt-2", title: "Publish & Re-Optimize", body: "Six to eight new posts went live each month while existing articles were refreshed, growing the library available to rank and keeping older pages competitive." },
      { _key: "jt-3", title: "Build Authority", body: "A new linkable asset every month and a steady flow of backlink placements strengthened the site's authority behind the expanding content." },
      { _key: "jt-4", title: "Optimize for AI Answers", body: "AEO optimizations shaped content for answer engines, and monthly traffic and ranking reports kept the strategy adjusting as results came in." },
    ],
  },
  numbersThatMatter: {
    label: "/  Performance Metrics  /",
    headingMain: "Growth Across",
    headingHighlighted: "Every Core Metric",
    body: `Since the program began in May 2025, the site's organic footprint has grown on every core measure: more visits, more referring domains, more search impressions, and a sharp rise in the value of the traffic it earns. Cirrus Insight has also reported stronger brand recognition and more direct traffic, the signs of visibility carrying beyond the search results page.`,
    items: [
      { _key: "nm-0", value: fmtK(traffic1), label: "Monthly Organic Traffic", sub: `↑ From ${fmtK(traffic0)}`, icon: icon("icon-number-traffic.svg", "Organic traffic") },
      { _key: "nm-1", value: fmtInt(rd1), label: "Referring Domains", sub: `↑ From ${fmtInt(rd0)}`, icon: icon("icon-number-referring-domains.svg", "Referring domains") },
      { _key: "nm-2", value: `$${fmtK(value1)}`, label: "Monthly Traffic Value", sub: `↑ From $${fmtK(value0)}`, icon: icon("icon-number-revenue.svg", "Traffic value") },
      { _key: "nm-3", value: fmtK(imp1), label: "Search Impressions", sub: `↑ From ${fmtK(imp0)}`, icon: icon("icon-number-impressions.svg", "Search impressions") },
    ],
  },
  growthChart: {
    headingMain: `Growth Trajectory Over ${monthsElapsed} Months`,
    headingHighlighted: "",
    leftAxisLabel: "Organic Traffic",
    rightAxisLabel: "Referring Domains",
    months: months.map(label),
    series: [
      { _key: "gs-0", label: "Referring Domains", color: "indigo", points: series("Referring domains") },
      { _key: "gs-1", label: "Organic Traffic", color: "gradient-light", points: series("Organic traffic") },
      { _key: "gs-2", label: "Non-Branded Traffic", color: "grey-trace", points: series("Organic traffic: Non-branded") },
    ],
    tooltipMonth: label(months.at(-1)),
    tooltipMetrics: [
      { _key: "tm-0", label: "Referring Domains", value: fmtInt(rd1) },
      { _key: "tm-1", label: "Organic Traffic", value: fmtInt(traffic1) },
      { _key: "tm-2", label: "Non-Branded Traffic", value: fmtInt(nonBrand1) },
    ],
  },
  beforeAfter: {
    label: "/  Real Results  /",
    headingMain: "Before vs",
    headingHighlighted: "After",
    body: "Ahrefs metrics at the start of the program compared with today.",
    beforeLabel: "Before - May 25",
    afterLabel: "Present",
    items: [
      { _key: "ba-0", label: "Organic Traffic", before: fmtInt(traffic0), after: fmtInt(traffic1) },
      { _key: "ba-1", label: "Referring Domains", before: fmtInt(rd0), after: fmtInt(rd1) },
      { _key: "ba-2", label: "Monthly Traffic Value", before: `$${fmtK(value0)}`, after: `$${fmtK(value1)}` },
      { _key: "ba-3", label: "Search Impressions", before: fmtK(imp0), after: fmtK(imp1) },
      { _key: "ba-4", label: "Informational Traffic", before: fmtInt(info0), after: fmtInt(info1) },
    ],
  },
  conclusion: {
    heading: "Conclusion",
    gradientSubhead: "Search visibility today is earned in two places at once: the results page and the AI answer.",
    body: [
      block("ci-conclusion-0", "For Cirrus Insight, that meant running keyword research, competitor benchmarking, content production, re-optimization, link building, and AEO as one connected program rather than separate projects. Publishing consistently, backing new content with authority, and shaping it for answer engines let each month's work build on the last."),
      block("ci-conclusion-1", `The results so far include ${pct(traffic0, traffic1)} more monthly organic traffic, ${fmtInt(rd1 - rd0)} additional referring domains, and a ${(value1 / value0).toFixed(1).replace(/\.0$/, "")}x increase in the value of that traffic, alongside the stronger brand recognition and direct traffic the client has reported. The marketing team described the work as knowledgeable, methodical, and responsive, delivered on time, and the engagement continues to expand Cirrus Insight's visibility across search and AI.`),
    ],
  },
  seo: {
    _type: "seo",
    metaTitle: "Cirrus Insight SEO & AEO Case Study | Organic Growth",
    metaDescription: `How Heroic Rankings grew Cirrus Insight's organic traffic ${pct(traffic0, traffic1)} and traffic value ${(value1 / value0).toFixed(1).replace(/\.0$/, "")}x in ${monthsElapsed} months with content, links and AEO.`,
  },
};

const result = await client.createOrReplace(doc);
console.log("written", result._id);
try {
  await client.delete(`drafts.${doc._id}`);
} catch {
  /* no draft */
}
