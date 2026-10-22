import { hl, tx } from "../shared/page-content.ts";

/** Hub sections outside the shared CMS model: definition, pricing shape, results and audience. */
export const SEO_SERVICES_EXTRAS = {
  definition: {
    label: "/ What they are /",
    heading: [tx("What Are "), hl("SEO Services?")],
    paragraphs: [
      "SEO services are the work an agency does to make a website rank higher on Google and appear in AI-generated answers. They cover four streams: technical fixes so pages get crawled and indexed, content that matches what people search for, links that build authority, and reporting that connects all of it to leads and revenue. No single stream works alone, which is why every Heroic Rankings programme runs all four.",
      "In 2026 the job has a fifth part. AI Overviews, AI Mode, ChatGPT and Perplexity answer questions by quoting pages Google already trusts, so the same programme now has to earn citations as well as clicks. We treat that as part of SEO, not a separate product.",
    ],
    linkLabel: "Only want the AI side? See our AI search optimization services",
    linkHref: "/seo/ai-search/",
  },
  pricing: {
    label: "/ How pricing works /",
    heading: [tx("Scoped to the Work, "), hl("Not a Fixed Menu")],
    intro: "SEO services at Heroic Rankings run on a monthly retainer scoped to the work. Three shapes cover most clients.",
    columns: ["Programme", "Best for", "What it includes"],
    rows: [
      ["Focused", "One stream, usually link building or a technical fix", "A defined monthly deliverable, one strategist, monthly report"],
      ["Growth", "SaaS, B2B and eCommerce sites competing in one market", "All four streams plus AI search, content calendar, link programme, quarterly review"],
      ["Scale", "Multi-market, multi-language or enterprise sites", "Everything in Growth across markets, dedicated team, custom reporting"],
    ],
    note: "Every proposal lists deliverables, timeline and how results are measured, so you can compare it line by line with any other quote.",
  },
  results: {
    label: "/ Results /",
    heading: [tx("Results From Our "), hl("SEO Services")],
    columns: ["Client", "Result", "Timeframe"],
    rows: [
      { client: "DIY eCommerce brand", result: "0 to 63,500 monthly organic visitors and $1.3M organic revenue", timeframe: "24 months", href: "/case-study/diy-craft-ecom-brand/" },
      { client: "DesignRush (B2B marketplace)", result: "90K to 1M monthly organic visitors, Domain Rating 70 to 90", timeframe: "Ongoing", href: "/case-study/designrush/" },
      { client: "Cirrus Insight (SaaS)", result: "+56% organic traffic, 2.6x traffic value, cited in AI answers", timeframe: "9 months", href: "/case-study/cirrus-insight/" },
      { client: "Affinda (SaaS)", result: "2.5x organic traffic, #1 for \"resume parser\"", timeframe: "4 months", href: "/case-study/affinda/" },
      { client: "Art by Maudsch (eCommerce)", result: "Domain Rating 19 to 45, 5.8x organic traffic", timeframe: "Ongoing", href: "/case-study/art-by-maudsch/" },
      { client: "Nagish (app)", result: "42x organic traffic from a 300-visit base", timeframe: "Ongoing", href: "/case-study/nagish/" },
    ],
    quotes: [
      { quote: "They don't just promise results; they stake revenue on it. Every decision was backed by real numbers, not guesswork.", source: "SyncSpider" },
      { quote: "They are very knowledgeable about SEO and have a very methodical approach. Their work is high quality.", source: "Cirrus Insight" },
    ],
    linkLabel: "All case studies",
    linkHref: "/case-study/",
  },
  audience: {
    label: "/ Who it's for /",
    heading: [tx("Who Our "), hl("SEO Services"), tx(" Are For")],
    items: [
      { title: "SaaS and B2B", description: "Companies that need pipeline from search, not just traffic.", href: "/case-study/cirrus-insight/", linkLabel: "Cirrus Insight case study" },
      { title: "eCommerce stores", description: "Brands competing on category and product pages.", href: "/case-study/diy-craft-ecom-brand/", linkLabel: "DIY eCommerce brand case study" },
      { title: "Local and service businesses", description: "Businesses that live on the map pack and \"near me\" searches.", href: "/seo/local/", linkLabel: "Local SEO services" },
      { title: "Agencies", description: "Agencies that want to resell SEO under their own brand.", href: "/white-label-seo-partnership/", linkLabel: "White-label SEO partnership" },
    ],
  },
};
