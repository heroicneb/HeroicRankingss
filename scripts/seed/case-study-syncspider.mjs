/**
 * Creates the "SyncSpider" case study from "02. SyncSpider - Final Version.md"
 * and the Ahrefs export (syncspider.com_perf_2026-09-26). Template layout;
 * no pillars or proof cards. The export has no Domain Rating column and spans
 * under three months, so the chart is sampled weekly.
 *
 * Usage:
 *   CSV=~/Downloads/syncspider.com_perf_2026-09-26_01-22-11.csv \
 *   node --env-file=.env.local scripts/seed/case-study-syncspider.mjs
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

const rows = (await readFile(CSV, "utf8")).split(/\r?\n/).map((l) => l.split(",").map((c) => c.trim()));
const header = rows[0];
const col = (name) => header.indexOf(name);
const daily = rows.filter((r) => /^20\d\d-\d\d-\d\d$/.test(r[0] ?? ""));
const num = (r, name) => Number(r[col(name)]);
// WHY: weekly samples (plus the final day) — the export is ~12 weeks long.
const sampled = daily.filter((_, i) => i % 7 === 0);
if (sampled.at(-1) !== daily.at(-1)) sampled.push(daily.at(-1));
const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const label = (d) => `${Number(d.slice(8, 10))} ${MON[Number(d.slice(5, 7)) - 1]}`;
const series = (name) => sampled.map((r) => num(r, name));
const first = daily[0], last = daily.at(-1);
const fmtK = (n) => (n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, "")}K` : String(n));
const fmtInt = (n) => n.toLocaleString("en-US");
const pct = (a, b) => `+${Math.round(((b - a) / a) * 100)}%`;
const rd0 = num(first, "Referring domains"), rd1 = num(last, "Referring domains");
const traffic0 = num(first, "Organic traffic"), traffic1 = num(last, "Organic traffic");
const value0 = num(first, "Organic traffic value"), value1 = num(last, "Organic traffic value");
const imp0 = num(first, "Impressions"), imp1 = num(last, "Impressions");
const nonBrand0 = num(first, "Organic traffic: Non-branded"), nonBrand1 = num(last, "Organic traffic: Non-branded");
console.log(`period ${first[0]} → ${last[0]} (${sampled.length} chart points)`);
console.log({ rd0, rd1, traffic0, traffic1, value0, value1, imp0, imp1, nonBrand0, nonBrand1 });

const block = (key, text) => ({ _key: key, _type: "block", style: "normal", markDefs: [], children: [{ _key: `${key}-c0`, _type: "span", marks: [], text }] });

const doc = {
  _id: "caseStudy-syncspider",
  _type: "caseStudy",
  title: "Building Organic Authority: SyncSpider's SEO Growth Story",
  titleHighlighted: "Building Organic Authority:",
  slug: { _type: "slug", current: "syncspider" },
  client: "SyncSpider",
  panelLabel: "SyncSpider",
  website: { label: "syncspider.com", href: "https://syncspider.com/" },
  services: ["link-building", "keyword-strategy"],
  publishedAt: `${last[0]}T00:00:00.000Z`,
  excerpt: "A data-driven SEO and link-building strategy that increased SyncSpider's organic traffic, improved search rankings, and reduced reliance on paid advertising.",
  heroSubtitle: "A data-driven SEO and link-building strategy that increased organic traffic, improved search rankings, and reduced reliance on paid advertising.",
  heroMetrics: [
    { _key: "hm-0", value: "3", label: "Months" },
    { _key: "hm-1", value: pct(rd0, rd1), label: "Referring Domains" },
    { _key: "hm-2", value: `${(traffic1 / traffic0).toFixed(1).replace(/\.0$/, "")}x`, label: "Organic Traffic" },
  ],
  caseOverview: {
    label: "/  Case Overview  /",
    headingMain: "Building Sustainable Organic Growth in a",
    headingHighlighted: "Competitive SaaS Market",
    body: [
      "SyncSpider is an eCommerce automation and integration tool built for online shops, multivendor marketplaces, and brick-and-mortar stores alike, letting businesses connect their sales, marketing, and operations tools without writing any code. With more than 400 integrations that fit into virtually any tech stack, SyncSpider had a wide offering. When Heroic Rankings began working with the company in January 2026, the challenge was clear: gain ground in a market where bigger, well-funded competitors already held strong search positions, with still more room to capture high-value searches, build authority, and bring more organic visitors to the site.",
      "The campaign started with research. A backlink gap analysis found openings to build authority, and keyword research turned up valuable, high-intent terms SyncSpider wasn't yet capturing. Those findings shaped a structured roadmap for traffic growth, backed by link building and regular reporting to track progress and guide decisions along the way.",
      "Results came fast. Within three months, organic traffic grew by 25%, and more than 15 target keywords reached the first page of Google. Conversion rates from organic visitors rose by 20%, keyword visibility in new markets expanded by 60%, and paid ad spend dropped by 30% as organic search took on more of the traffic load. Domain authority also went up over the same stretch.",
    ].join("\n\n"),
  },
  objectiveChallenges: {
    label: "/  Objective & Challenges  /",
    headingMain: "Breaking Through in an",
    headingHighlighted: "Already Competitive Market",
    body: "For SyncSpider, the goal wasn't just more visitors. It was making organic search a genuinely productive channel. That meant finding the right keywords to pursue, identifying where competitors held an advantage, and building the authority needed to compete for valuable searches. Progress also had to be measurable, with reporting that tied the work back to actual results.",
    items: [
      { _key: "ch-0", number: "01", title: "Current Search Landscape", body: "The eCommerce automation and integration space was already crowded with larger companies that had deep resources and established search positions. SyncSpider needed a way to find spots where it could actually compete, rather than chasing the same terms and backlinks as stronger competitors." },
      { _key: "ch-1", number: "02", title: "Key Objectives", body: "The campaign focused on improving rankings and organic traffic, growing the site's authority through link building, and building a transparent way to measure progress. Cutting back on paid traffic dependence was another goal as organic performance picked up." },
      { _key: "ch-2", number: "03", title: "Strategic Challenges", body: "Finding the right opportunities was critical in a category where established competitors already had extensive keyword coverage and backlink profiles. The challenge was to pinpoint high-intent terms SyncSpider had yet to capture, uncover relevant authority-building opportunities, and turn that research into a practical roadmap for growth." },
    ],
  },
  journeyTimeline: {
    label: "/  Execution  /",
    headingMain: "The Journey to",
    headingHighlighted: "Success",
    items: [
      { _key: "jt-0", title: "Backlink Gap Analysis", body: "The campaign started by comparing SyncSpider's backlink profile with those of its competitors. This revealed high-authority websites where competing brands had earned coverage but SyncSpider had little or no presence, giving the link-building campaign a clear starting point." },
      { _key: "jt-1", title: "Keyword Research & Opportunity Mapping", body: "Next, we looked for high-intent search terms with the potential to bring relevant visitors to the site. The research highlighted valuable keywords SyncSpider wasn't yet capturing and provided a clearer picture of where new ranking opportunities existed." },
      { _key: "jt-2", title: "Organic Traffic Growth Roadmap", body: "Rather than treating keyword and backlink research as separate activities, we used the findings to create a structured roadmap for increasing recurring organic traffic. This gave the campaign defined priorities and a clear direction for turning identified opportunities into search growth." },
      { _key: "jt-3", title: "Strategic Authority Building", body: "Link acquisition was guided by the gaps uncovered during the competitive analysis. Focusing on relevant, high-authority opportunities allowed the campaign to address areas where established SaaS competitors held an advantage and support SyncSpider's ability to compete in search." },
      { _key: "jt-4", title: "Measure, Report & Refine", body: "Regular reporting kept performance visible throughout the campaign. Rankings, traffic, conversions, and other results could be tracked against the work being completed, allowing decisions to remain grounded in data and giving SyncSpider a clear view of the return generated by the campaign." },
    ],
  },
  numbersThatMatter: {
    label: "/  Performance Metrics  /",
    headingMain: "Measurable Growth in",
    headingHighlighted: "Three Months",
    body: "The impact became visible within the first three months. Traffic and rankings improved, but the gains extended further, with organic visitors converting at a higher rate and greater keyword visibility opening opportunities in new markets. At the same time, improved organic performance allowed SyncSpider to reduce its paid advertising spend, demonstrating value beyond search rankings alone.",
    items: [
      { _key: "nm-0", value: fmtInt(rd1), label: "Referring Domains", sub: `↑ From ${fmtInt(rd0)}`, icon: icon("icon-number-referring-domains.svg", "Referring domains") },
      { _key: "nm-1", value: fmtK(traffic1), label: "Monthly Organic Traffic", sub: `↑ From ${fmtInt(traffic0)}`, icon: icon("icon-number-traffic.svg", "Organic traffic") },
      { _key: "nm-2", value: `$${fmtK(value1)}`, label: "Monthly Traffic Value", sub: `↑ From $${fmtK(value0)}`, icon: icon("icon-number-revenue.svg", "Traffic value") },
      { _key: "nm-3", value: fmtK(imp1), label: "Search Impressions", sub: `↑ From ${fmtK(imp0)}`, icon: icon("icon-number-impressions.svg", "Search impressions") },
    ],
  },
  growthChart: {
    headingMain: "Growth Trajectory Over 3 Months",
    headingHighlighted: "",
    leftAxisLabel: "Organic Traffic",
    rightAxisLabel: "Referring Domains",
    months: sampled.map((r) => label(r[0])),
    series: [
      { _key: "gs-0", label: "Referring Domains", color: "indigo", points: series("Referring domains") },
      { _key: "gs-1", label: "Organic Traffic", color: "gradient-light", points: series("Organic traffic") },
      { _key: "gs-2", label: "Non-Branded Traffic", color: "grey-trace", points: series("Organic traffic: Non-branded") },
    ],
    tooltipMonth: label(last[0]),
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
    body: "Ahrefs metrics at the start of the campaign compared with today.",
    beforeLabel: `Before - ${label(first[0])} ${first[0].slice(2, 4)}`,
    afterLabel: "Present",
    items: [
      { _key: "ba-0", label: "Referring Domains", before: fmtInt(rd0), after: fmtInt(rd1) },
      { _key: "ba-1", label: "Organic Traffic", before: fmtInt(traffic0), after: fmtInt(traffic1) },
      { _key: "ba-2", label: "Monthly Traffic Value", before: `$${fmtK(value0)}`, after: `$${fmtK(value1)}` },
      { _key: "ba-3", label: "Search Impressions", before: fmtK(imp0), after: fmtK(imp1) },
      { _key: "ba-4", label: "Non-Branded Traffic", before: fmtInt(nonBrand0), after: fmtInt(nonBrand1) },
    ],
  },
  conclusion: {
    heading: "Conclusion",
    gradientSubhead: "Data-backed decisions turned competitive gaps into measurable opportunities for growth.",
    body: [
      block("ss-conclusion-0", "SyncSpider entered the campaign facing larger SaaS competitors with greater resources and stronger positions in search. By identifying where those competitors held an advantage and focusing resources on valuable keyword and backlink opportunities, Heroic Rankings created a more targeted path toward stronger organic performance."),
      block("ss-conclusion-1", "The impact was evident within three months: organic traffic increased by 25%, more than 15 target keywords reached Google's first page, and domain authority improved. Organic conversion rates rose by 20%, keyword visibility expanded by 60% into new markets, and paid ad spend decreased by 30%, giving SyncSpider a stronger organic acquisition channel and less dependence on paid traffic."),
    ],
  },
  seo: {
    _type: "seo",
    metaTitle: "SyncSpider SEO Case Study | Organic Growth in a Competitive SaaS Market",
    metaDescription: "How data-driven link building and keyword research lifted SyncSpider's organic traffic 25%, put 15+ keywords on page one and cut paid ad spend 30%.",
  },
};

const result = await client.createOrReplace(doc);
console.log("written", result._id);
try {
  await client.delete(`drafts.${doc._id}`);
} catch {
  /* no draft */
}
