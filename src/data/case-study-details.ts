/**
 * Hardcoded detailed case study data for enhanced case study detail pages.
 * Used when a slug matches a known enhanced case study, layered on top of
 * (or as a fallback for) CMS data.
 */

export interface HeroMetric {
  value: string;
  label: string;
}

export interface ChallengeCard {
  number: string;
  title: string;
  body: string;
}

export interface StrategyPillar {
  title: string;
  bullets: string[];
}

export interface TimelineStep {
  number: string;
  title: string;
  description: string;
}

export interface PerformanceMetric {
  value: string;
  label: string;
  description?: string;
}

export interface BeforeAfterRow {
  metric: string;
  before: string;
  after: string;
}

export interface EnhancedCaseStudy {
  slug: string;
  heroTitle: string;
  heroSubtitle: string;
  heroMetrics: HeroMetric[];
  overviewTitle: string;
  overviewParagraphs: string[];
  challengeCards: ChallengeCard[];
  strategyTitle: string;
  strategyPillars: StrategyPillar[];
  timelineTitle: string;
  timelineSteps: TimelineStep[];
  metricsTitle: string;
  performanceMetrics: PerformanceMetric[];
  growthChartTitle: string;
  beforeAfterTitle: string;
  beforeAfterRows: BeforeAfterRow[];
  conclusionTitle: string;
  conclusionParagraphs: string[];
  ctaHeading: string;
  ctaPrimary: { label: string; href: string };
  ctaSecondary: { label: string; href: string };
}

export const ENHANCED_CASE_STUDIES: EnhancedCaseStudy[] = [
  {
    slug: "number-artist",
    heroTitle: "From Zero to Hero: Number Artist's Journey",
    heroSubtitle:
      "How we transformed a new brand into an e-commerce giant, driving $1.3M in organic revenue and 63,500 monthly visitors in just 24 months.",
    heroMetrics: [
      { value: "24 Months", label: "Campaign Duration" },
      { value: "$1.3M", label: "Organic Revenue" },
      { value: "63,500", label: "Monthly Visitors" },
    ],
    overviewTitle: "From Startup to Market Leader in 24 Months",
    overviewParagraphs: [
      "Number Artist entered the market as a brand-new e-commerce store specialising in paint-by-number kits. With zero domain authority, no existing traffic, and a highly competitive niche, the challenge was not simply to grow — it was to build an entire organic presence from the ground up.",
      "Heroic Rankings partnered with Number Artist from day one, crafting a long-term SEO strategy anchored in technical excellence, authoritative link acquisition, and conversion-optimised content. Over 24 months the brand scaled from obscurity to category leader, generating measurable revenue directly attributable to organic search.",
      "Our objective was clear: establish Number Artist as the go-to destination for paint-by-number enthusiasts in English-speaking markets, capture high-intent commercial keywords, and build a link profile that would sustain rankings well beyond the campaign window.",
    ],
    challengeCards: [
      {
        number: "01",
        title: "Initial SEO Status",
        body: "The domain launched with no history, no backlinks, and no indexed pages. Competing immediately against established retailers with years of authority required an accelerated foundation-building phase before any ranking growth could occur.",
      },
      {
        number: "02",
        title: "Key Obstacles",
        body: "The paint-by-number niche is dominated by large marketplaces and craft retailers with massive link profiles. Converting category-level traffic into purchasers also required tight alignment between keyword intent and landing page messaging.",
      },
      {
        number: "03",
        title: "Resource Constraints",
        body: "As a startup, Number Artist had a lean marketing budget. Every investment had to be precision-targeted — no vanity metrics, no wasted spend. This shaped a strategy focused on compounding assets: links, content, and technical equity that appreciates over time.",
      },
    ],
    strategyTitle: "Six Pillars of Dominant SEO",
    strategyPillars: [
      {
        title: "Comprehensive SEO Audit",
        bullets: [
          "Full technical crawl identifying indexation, speed, and structured data gaps",
          "Competitive gap analysis across 12 direct rivals",
          "Keyword universe mapping — 4,200+ terms prioritised by intent and volume",
        ],
      },
      {
        title: "Authority Link Building",
        bullets: [
          "597 referring domains acquired over 24 months",
          "Outreach to niche craft, lifestyle, and gift publications",
          "Digital PR campaigns generating editorial placements",
        ],
      },
      {
        title: "Technical Foundation",
        bullets: [
          "Core Web Vitals optimisation (LCP < 2.5 s, CLS < 0.1)",
          "Schema markup for products, reviews, and breadcrumbs",
          "Crawl budget management and canonical architecture",
        ],
      },
      {
        title: "AI Engine Optimisation",
        bullets: [
          "Structured FAQ and How-To content targeting AI Overviews",
          "Entity optimisation to reinforce topical authority",
          "Conversational query capture across the buyer journey",
        ],
      },
      {
        title: "Content Optimisation",
        bullets: [
          "Pillar-and-cluster content architecture across 8 topic hubs",
          "Product and category page copy optimised for intent and conversion",
          "Ongoing content refresh cadence to maintain freshness signals",
        ],
      },
      {
        title: "Data-Driven Approach",
        bullets: [
          "Monthly performance reviews with rank, traffic, and revenue attribution",
          "A/B testing of meta titles and page structures",
          "GSC and GA4 integration for granular conversion tracking",
        ],
      },
    ],
    timelineTitle: "The Journey to Success",
    timelineSteps: [
      {
        number: "01",
        title: "Months 1–3: Foundation",
        description:
          "Technical audit, on-site fixes, keyword architecture, and initial content production. Domain submitted, sitemap configured, and Core Web Vitals brought into passing range.",
      },
      {
        number: "02",
        title: "Months 4–6: Momentum",
        description:
          "Link acquisition campaigns launched. First cluster of target keywords entered the top 50. Product pages refined for intent alignment and internal linking mesh established.",
      },
      {
        number: "03",
        title: "Months 7–12: Growth Phase",
        description:
          "Domain Rating climbed to DR 38. Traffic crossed 10,000 monthly sessions. Revenue attribution from organic began appearing in GA4. Top 10 positions for 200+ keywords.",
      },
      {
        number: "04",
        title: "Months 13–18: Acceleration",
        description:
          "Seasonal content strategy activated for peak gifting periods. Impressions surpassed 8M. Referring domain count crossed 400. Revenue run-rate reached $600K annualised.",
      },
      {
        number: "05",
        title: "Months 19–24: Market Leadership",
        description:
          "63,500 monthly visitors, 16.1M impressions, and $1.3M in tracked organic revenue. DR 54 achieved. 800+ keywords in the top 3 positions, cementing category authority.",
      },
    ],
    metricsTitle: "The Numbers That Matter",
    performanceMetrics: [
      { value: "16.1M", label: "Total Impressions", description: "Google Search Console" },
      { value: "63.5K", label: "Monthly Visitors", description: "Peak organic traffic" },
      { value: "200K+", label: "Total Clicks", description: "Over 24-month period" },
      { value: "597", label: "Referring Domains", description: "Unique linking sites" },
      { value: "800+", label: "Top 3 Rankings", description: "Keywords in positions 1–3" },
      { value: "3.6K", label: "Keywords Ranked", description: "Total keywords tracked" },
      { value: "$1.3M", label: "Organic Revenue", description: "Directly attributed" },
      { value: "DR 54", label: "Domain Rating", description: "Up from DR 0 at launch" },
    ],
    growthChartTitle: "Growth Trajectory Over 24 Months",
    beforeAfterTitle: "Before vs After",
    beforeAfterRows: [
      { metric: "Monthly Organic Visitors", before: "0", after: "63,500" },
      { metric: "Domain Rating (DR)", before: "0", after: "54" },
      { metric: "Referring Domains", before: "0", after: "597" },
      { metric: "Keywords in Top 3", before: "0", after: "800+" },
      { metric: "Total Keywords Ranked", before: "0", after: "3,600+" },
      { metric: "Monthly Impressions", before: "0", after: "~670K" },
      { metric: "Organic Revenue (annualised)", before: "$0", after: "$1.3M" },
    ],
    conclusionTitle: "Conclusion",
    conclusionParagraphs: [
      "The Number Artist engagement demonstrates what a disciplined, compounding SEO strategy can achieve for a brand starting from absolute zero. By combining technical rigour, authoritative link acquisition, and intent-matched content, Heroic Rankings built an organic channel that now rivals paid acquisition in revenue contribution — and unlike paid, it appreciates over time.",
      "The results speak for themselves: 63,500 monthly visitors, $1.3M in attributable organic revenue, and a domain that now commands genuine authority in its niche. This is what heroic SEO looks like in practice.",
    ],
    ctaHeading: "Ready to Write Your Own Success Story?",
    ctaPrimary: { label: "Book Your Strategy Call", href: "/contact" },
    ctaSecondary: { label: "Learn More", href: "/case-studies" },
  },
];

/**
 * Returns the enhanced case study data for a given slug, or undefined if none exists.
 */
export function getEnhancedCaseStudy(slug: string): EnhancedCaseStudy | undefined {
  return ENHANCED_CASE_STUDIES.find((cs) => cs.slug === slug);
}
