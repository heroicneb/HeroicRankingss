/**
 * Loads the "My Baskets — Final Version" copy (2026-09-26) into the existing
 * caseStudy document. Patches only the content fields; images, slug and SEO
 * meta are kept. Sections the copy does not cover (strategy pillars, growth
 * chart, proof cards, before/after) are cleared so they collapse on the page
 * until Nebojsa fills them in the Studio.
 *
 * Numbers in the hero pills and "The Numbers That Matter" are PLACEHOLDERS —
 * edit them in Sanity Studio → Case Studies → My Baskets.
 *
 * Usage: node --env-file=.env.local scripts/seed/case-study-my-baskets.mjs
 */
import { createClient } from "next-sanity";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: "2025-01-01",
  useCdn: false,
});

const doc = await client.fetch(
  '*[_type=="caseStudy" && slug.current=="my-baskets" && !(_id in path("drafts.**"))][0]{_id, "icons": numbersThatMatter.items[].icon}',
);
if (!doc) throw new Error("My Baskets case study not found");
const icons = (doc.icons ?? []).filter(Boolean);
const icon = (i) => (icons[i] ? { icon: icons[i] } : {});

const block = (key, text) => ({
  _key: key,
  _type: "block",
  style: "normal",
  markDefs: [],
  children: [{ _key: `${key}-c0`, _type: "span", marks: [], text }],
});

const content = {
  title: "Building Search Authority: My Baskets' Link Building Story",
  titleHighlighted: "Building Search Authority:",
  panelLabel: "My Baskets",
  heroSubtitle:
    "A consistent, targeted link-building program helped strengthen domain authority and support long-term organic search performance.",
  // PLACEHOLDER numbers
  heroMetrics: [
    { _key: "hm-0", value: "May 2024", label: "Partnership Start" },
    { _key: "hm-1", value: "+18", label: "Domain Authority" },
    { _key: "hm-2", value: "140+", label: "Links Secured" },
  ],
  caseOverview: {
    label: "/ Case Overview /",
    headingMain: "Growing Authority Through Consistent",
    headingHighlighted: "Link Building",
    body: [
      "Since May 2024, Heroic Rankings has worked with My Baskets on an ongoing link-building and SEO consulting engagement. The Canadian gift basket company serves both individual and business customers, making stronger search authority an important part of maintaining visibility across a competitive and highly seasonal market.",
      "Each month, our team manages the link-building process from start to finish. This includes identifying and contacting relevant websites, creating content for placements, and following through until links go live. Consulting provides additional support as the campaign continues and new opportunities emerge.",
      "Since the partnership began, My Baskets has increased its domain authority. With the engagement still active, monthly link building continues to strengthen the site's backlink profile and support its broader organic search efforts.",
    ].join("\n\n"),
  },
  objectiveChallenges: {
    label: "/ Objective & Challenges /",
    headingMain: "Build Authority Beyond",
    headingHighlighted: "Seasonal Demand",
    body: "Search demand for gifts naturally changes throughout the year, with major occasions and holidays creating periods of increased competition. My Baskets needed a consistent approach to authority building that could support its search presence beyond individual gifting seasons rather than relying solely on short-term peaks in demand.",
    items: [
      {
        _key: "ch-0",
        number: "01",
        title: "Current Search Landscape",
        body: "Gift baskets sit within a crowded ecommerce category where businesses compete for visibility across both year-round searches and seasonal gifting occasions. Building a stronger backlink profile offered My Baskets an opportunity to improve the authority behind its organic search presence.",
      },
      {
        _key: "ch-1",
        number: "02",
        title: "Key Objectives",
        body: "The engagement focused on strengthening domain authority through consistent link acquisition while providing ongoing SEO consulting. My Baskets also needed the entire process managed externally, from identifying relevant opportunities to creating supporting content and securing live placements.",
      },
      {
        _key: "ch-2",
        number: "03",
        title: "Strategic Challenges",
        body: "Link building requires more than simply increasing the number of referring websites. Relevant opportunities had to be identified, outreach managed, suitable content created, and placements followed through to completion. Maintaining that process every month was particularly important in a market where search demand and competition can vary significantly throughout the year.",
      },
    ],
  },
  journeyTimeline: {
    label: "/ Execution /",
    headingMain: "The Journey to",
    headingHighlighted: "Success",
    items: [
      { _key: "jt-0", title: "Identify Relevant Link Opportunities", body: "Each month begins with finding websites that offer relevant opportunities for My Baskets. Keeping placements connected to the business and its audience helps maintain a focused approach to growing the site's backlink profile." },
      { _key: "jt-1", title: "Conduct Targeted Outreach", body: "Once suitable opportunities are identified, outreach moves the process forward. Heroic Rankings handles communication with prospective websites, allowing My Baskets to maintain an active link-building campaign without managing outreach internally." },
      { _key: "jt-2", title: "Create Content for Placements", body: "Where content is required to secure a placement, our team handles its creation as part of the campaign. This keeps outreach and content production connected rather than treating them as separate parts of the process." },
      { _key: "jt-3", title: "Secure & Complete Placements", body: "The work continues beyond initial outreach and content delivery. We follow each opportunity through the remaining steps needed to get the backlink live, managing the process from initial prospecting through final placement." },
      { _key: "jt-4", title: "Build Authority Month After Month", body: "Repeating the process consistently has allowed My Baskets to build its backlink profile over time rather than relying on isolated link-building campaigns. Combined with ongoing consulting, the monthly approach has contributed to an increase in domain authority since the partnership began." },
    ],
  },
  numbersThatMatter: {
    label: "/ Performance Metrics /",
    headingMain: "Steady Growth in",
    headingHighlighted: "Domain Authority",
    body: "For an ongoing link-building campaign, progress is built one placement at a time. Since Heroic Rankings began working with My Baskets, domain authority has increased, providing a clear indicator of the site's growing authority. As the engagement continues, monthly outreach, content creation, and link acquisition provide the foundation for further progress.",
    // PLACEHOLDER numbers
    items: [
      { _key: "nm-0", value: "+18", label: "Domain Authority", sub: "↑ since May 2024", ...icon(0) },
      { _key: "nm-1", value: "140+", label: "Links Secured", sub: "↑ across the engagement", ...icon(1) },
      { _key: "nm-2", value: "12/mo", label: "Placements Delivered", sub: "on average, every month", ...icon(2) },
      { _key: "nm-3", value: "16+", label: "Months Active", sub: "and counting", ...icon(3) },
    ],
  },
  conclusion: {
    heading: "Conclusion",
    gradientSubhead: "Consistency has been central to building stronger search authority over time.",
    body: [
      block("mb-conclusion-0", "Rather than approaching link building as a short-term campaign, My Baskets has maintained an ongoing monthly program covering the full process from prospecting and outreach to content creation and live placement. Regular consulting and communication have kept the work aligned with the client's needs throughout the engagement."),
      block("mb-conclusion-1", "Since the partnership began, My Baskets has increased its domain authority, while the client has highlighted Heroic Rankings' reliability, clear communication, and ability to deliver work on time. With the engagement continuing, the focus remains on steadily building authority through relevant link opportunities and consistent execution."),
    ],
  },
  excerpt:
    "A consistent monthly link-building program has helped My Baskets, a Canadian gift basket retailer, strengthen its domain authority and long-term organic search performance.",
};

const result = await client
  .patch(doc._id)
  .set(content)
  .unset(["strategyPillars", "growthChart", "proofData", "beforeAfter"])
  .commit();
console.log("patched", result._id, "rev", result._rev);
try {
  await client.delete(`drafts.${doc._id}`);
  console.log("stale draft removed");
} catch {
  console.log("no draft to remove");
}
