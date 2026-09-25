/**
 * Creates the "Support Adventure" case study from Nebojsa's brief
 * ("03. Support Adventure - Final Version.md") and the Ahrefs performance
 * export (www.supportadventure.com_perf_2026-09-26). Uses the case study
 * template layout; sections without content (pillars, proof cards) are left
 * empty so they collapse. Number icons reuse the assets uploaded for the
 * DIY eCom template (ids from case-study-diy-ecom-brand-assets-snapshot.json).
 *
 * Usage:
 *   CSV=~/Downloads/www.supportadventure.com_perf_2026-09-26_00-53-12.csv \
 *   node --env-file=.env.local scripts/seed/case-study-support-adventure.mjs
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

// --- CSV → monthly series (month-end value of each metric) -----------------
const rows = (await readFile(CSV, "utf8")).split(/\r?\n/).map((l) => l.split(",").map((c) => c.trim()));
const header = rows[0];
const col = (name) => header.indexOf(name);
const daily = rows.filter((r) => /^20\d\d-\d\d-\d\d$/.test(r[0] ?? ""));
const num = (r, name) => Number(r[col(name)]);
const byMonth = new Map();
for (const r of daily) byMonth.set(r[0].slice(0, 7), r); // last row of each month wins
// WHY: the engagement started December 2023; November is pre-campaign noise.
const months = [...byMonth.keys()].filter((m) => m >= "2023-12");
const MON = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const label = (ym) => `${MON[Number(ym.slice(5, 7)) - 1]}${ym.slice(2, 4)}`;
const series = (name) => months.map((m) => num(byMonth.get(m), name));
const first = byMonth.get(months[0]);
const last = byMonth.get(months[months.length - 1]);
const fmtK = (n) => (n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, "")}K` : String(n));
const fmtInt = (n) => n.toLocaleString("en-US");
const traffic0 = num(first, "Organic traffic"), traffic1 = num(last, "Organic traffic");
const dr0 = num(first, "Domain Rating"), dr1 = num(last, "Domain Rating");
const nonBrand0 = num(first, "Organic traffic: Non-branded"), nonBrand1 = num(last, "Organic traffic: Non-branded");
const value0 = num(first, "Organic traffic value"), value1 = num(last, "Organic traffic value");
const info0 = num(first, "Organic traffic by intent: Informational"), info1 = num(last, "Organic traffic by intent: Informational");
const refDomains1 = num(last, "Referring domains");
const refDomainsLow = Math.min(...series("Referring domains"));
console.log(`period ${months[0]} → ${months.at(-1)} (${months.length} months)`);
console.log({ traffic0, traffic1, dr0, dr1, nonBrand0, nonBrand1, value0, value1, refDomains1, refDomainsLow });

const block = (key, text) => ({ _key: key, _type: "block", style: "normal", markDefs: [], children: [{ _key: `${key}-c0`, _type: "span", marks: [], text }] });

const doc = {
  _id: "caseStudy-support-adventure",
  _type: "caseStudy",
  title: "Strengthening Search Performance: Support Adventure's Long-Term SEO Journey",
  titleHighlighted: "Strengthening Search Performance:",
  slug: { _type: "slug", current: "support-adventure" },
  client: "Support Adventure",
  panelLabel: "Support Adventure",
  website: { label: "supportadventure.com", href: "https://www.supportadventure.com/" },
  services: ["content-creation", "keyword-strategy", "link-building", "on-page-seo", "technical-seo"],
  publishedAt: "2026-02-22T00:00:00.000Z",
  excerpt: "Steady content, technical fixes, and link building have given Support Adventure, a remote IT staffing provider, a stronger base for continued organic growth.",
  heroSubtitle: "Steady content, technical fixes, and link building have given Support Adventure a stronger base for continued organic growth.",
  heroMetrics: [
    { _key: "hm-0", value: String(months.length - 1), label: "Months" },
    { _key: "hm-1", value: `${(traffic1 / traffic0).toFixed(1).replace(/\.0$/, "")}x`, label: "Organic Traffic" },
    { _key: "hm-2", value: `DR ${dr1}`, label: "Domain Rating" },
  ],
  caseOverview: {
    label: "/  Case Overview  /",
    headingMain: "Building SEO Momentum Through",
    headingHighlighted: "Consistent Execution",
    body: [
      "Support Adventure provides remote staffing services for IT companies and MSPs, connecting businesses in English-speaking markets with skilled IT support professionals working remotely from lower-cost countries. Since December 2023, Heroic Rankings has managed an ongoing SEO campaign aimed at improving the company's website and strengthening its overall search performance.",
      "The engagement pulls several parts of SEO together under one plan. New articles keep a steady flow of content going out, keyword research decides what gets targeted, and link building backs up the site's authority. On-page changes and technical fixes get handled wherever they're needed, as they come up.",
      "The partnership is still active. So far, Support Adventure has seen stronger overall SEO performance, more articles published, and better search rankings. Because the campaign hasn't stopped, the strategy keeps changing alongside the site instead of sitting still after an initial push.",
    ].join("\n\n"),
  },
  objectiveChallenges: {
    label: "/  Objective & Challenges  /",
    headingMain: "Strengthen the Website From",
    headingHighlighted: "Content to Technical SEO",
    body: "Support Adventure needed SEO support that reached across multiple parts of the website. Better rankings meant keeping content production steady while also working on keyword targeting, the site's backlink profile, individual page optimization, and technical issues behind the scenes.",
    items: [
      { _key: "ch-0", number: "01", title: "Current Search Landscape", body: "Support Adventure's overall search presence had room to grow through a wider, more consistent SEO effort. Content was only one piece of that — on-page elements, technical SEO, keyword targeting, and site authority all played a part in how well the site could perform in search." },
      { _key: "ch-1", number: "02", title: "Key Objectives", body: "The work centered on improving SEO performance and search rankings while increasing the volume of useful content published on the site. Alongside that, the team worked to find relevant keywords, earn valuable backlinks, and make ongoing on-page and technical improvements." },
      { _key: "ch-2", number: "03", title: "Strategic Challenges", body: "Managing several SEO priorities at the same time called for an adaptable approach. New articles needed to be produced consistently without overlooking technical and on-page improvements, while keyword research and link building had to support the site's broader search goals. As the website developed, priorities also needed to evolve with it." },
    ],
  },
  journeyTimeline: {
    label: "/  Execution  /",
    headingMain: "The Journey to",
    headingHighlighted: "Success",
    items: [
      { _key: "jt-0", title: "Identify Search Opportunities", body: "Keyword research provided direction for the campaign by identifying terms and topics worth pursuing. Rather than creating content in isolation, research helped connect publishing decisions with broader opportunities to improve the site's search presence." },
      { _key: "jt-1", title: "Maintain Consistent Content Production", body: "Article creation became an ongoing part of the SEO program, increasing the volume of content available to rank in search. Maintaining a regular publishing schedule also gave Support Adventure more opportunities to target relevant topics and build out its website over time." },
      { _key: "jt-2", title: "Improve Pages On-Site", body: "SEO work extended to existing pages through on-page changes designed to improve their search performance. These adjustments complemented new content production and allowed the campaign to address opportunities across the wider site." },
      { _key: "jt-3", title: "Strengthen Technical SEO & Authority", body: "Technical SEO fixes addressed issues behind the site's search performance, while link building worked to strengthen its authority. Together, these efforts supported the content strategy with improvements both on and beyond the website itself." },
      { _key: "jt-4", title: "Adapt the Strategy Over Time", body: "The campaign has continued to evolve as new needs and opportunities have emerged. Regular communication through virtual meetings, email, and messaging keeps both teams aligned, allowing SEO priorities to be adjusted and improvements to continue month after month." },
    ],
  },
  numbersThatMatter: {
    label: "/  Performance Metrics  /",
    headingMain: "Continued Progress Across",
    headingHighlighted: "Search Performance",
    body: "The ongoing engagement has produced improvements across several core areas of SEO. Support Adventure has increased its article output, achieved better search rankings, and reported stronger SEO performance overall. As the campaign continues, these indicators provide a foundation for measuring further progress and identifying the next opportunities for growth.",
    items: [
      { _key: "nm-0", value: String(dr1), label: "Domain Rating", sub: `↑ From ${dr0} to ${dr1}`, icon: icon("icon-number-domain-rating.svg", "Domain rating") },
      { _key: "nm-1", value: fmtK(traffic1), label: "Monthly Organic Traffic", sub: `↑ From ${fmtK(traffic0)}`, icon: icon("icon-number-traffic.svg", "Organic traffic") },
      { _key: "nm-2", value: String(refDomains1), label: "Referring Domains", sub: `↑ From a low of ${refDomainsLow}`, icon: icon("icon-number-referring-domains.svg", "Referring domains") },
      { _key: "nm-3", value: fmtK(nonBrand1), label: "Non-Branded Traffic", sub: `↑ From ${fmtK(nonBrand0)}`, icon: icon("icon-number-keywords.svg", "Non-branded traffic") },
    ],
  },
  growthChart: {
    headingMain: `Growth Trajectory Over ${months.length - 1} Months`,
    headingHighlighted: "",
    leftAxisLabel: "Organic Traffic",
    rightAxisLabel: "Domains / DR",
    months: months.map(label),
    series: [
      { _key: "gs-0", label: "Referring Domains", color: "indigo", points: series("Referring domains") },
      { _key: "gs-1", label: "Organic Traffic", color: "gradient-light", points: series("Organic traffic") },
      { _key: "gs-2", label: "Domain Rating", color: "grey-trace", points: series("Domain Rating") },
    ],
    tooltipMonth: label(months.at(-1)),
    tooltipMetrics: [
      { _key: "tm-0", label: "Referring Domains", value: String(refDomains1) },
      { _key: "tm-1", label: "Organic Traffic", value: fmtInt(traffic1) },
      { _key: "tm-2", label: "Domain Rating", value: String(dr1) },
    ],
  },
  beforeAfter: {
    label: "/  Real Results  /",
    headingMain: "Before vs",
    headingHighlighted: "After",
    body: "Ahrefs metrics at the start of the engagement compared with today.",
    beforeLabel: `Before - ${label(months[0]).slice(0, 3).charAt(0)}${label(months[0]).slice(1, 3).toLowerCase()} ${label(months[0]).slice(3)}`,
    afterLabel: "Present",
    items: [
      { _key: "ba-0", label: "Domain Rating", before: String(dr0), after: String(dr1) },
      { _key: "ba-1", label: "Organic Traffic", before: fmtInt(traffic0), after: fmtInt(traffic1) },
      { _key: "ba-2", label: "Non-Branded Traffic", before: fmtInt(nonBrand0), after: fmtInt(nonBrand1) },
      { _key: "ba-3", label: "Informational Traffic", before: fmtInt(info0), after: fmtInt(info1) },
      { _key: "ba-4", label: "Monthly Traffic Value", before: `$${fmtK(value0)}`, after: `$${fmtK(value1)}` },
    ],
  },
  conclusion: {
    heading: "Conclusion",
    gradientSubhead: "Long-term SEO progress comes from consistently improving every part of the website that contributes to search performance.",
    body: [
      block("sa-conclusion-0", "For Support Adventure, that has meant treating content, keywords, backlinks, on-page optimization, and technical SEO as connected parts of the same ongoing effort. Instead of concentrating on a single area, the campaign continues to address the site's needs as they develop."),
      block("sa-conclusion-1", "The results so far include improved search rankings, greater article output, and better overall SEO performance. With the engagement still active, Heroic Rankings continues to build on those gains through consistent execution and ongoing improvements."),
    ],
  },
  seo: {
    _type: "seo",
    metaTitle: "Support Adventure SEO Case Study | Long-Term Organic Growth",
    metaDescription: `How an ongoing SEO engagement took Support Adventure from ${fmtK(traffic0)} to ${fmtK(traffic1)} monthly organic visits and Domain Rating ${dr0} to ${dr1} through content, keyword research, link building and technical fixes.`,
  },
};

const result = await client.createOrReplace(doc);
console.log("written", result._id);
try {
  await client.delete(`drafts.${doc._id}`);
} catch {
  /* no draft */
}
