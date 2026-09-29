import type { ProofVisualSpec } from "@/components/charts/proof-visual-types";
import type { TimeSeriesChartSpec } from "@/components/charts/time-series-chart-types";
import { monthLabels } from "@/components/pages/link-building/competitor-insights-charts";

/*
 * Data for the interactive visuals in "/ The Proof Is in the Data /" on the
 * case study pages. Each entry replaces one analytics screenshot.
 *
 * PROVENANCE: the numbers come from the report screenshots stored on the
 * case study documents in Sanity (Ahrefs, Search Console, GA4, Looker and
 * the revenue sheet). Tables copy the visible rows verbatim. Chart series
 * were read off the screenshot curves at monthly (or two-weekly) resolution,
 * so intermediate points are close approximations while start, peak and end
 * values match the report. Replace an array here when an export is at hand;
 * `labels` and every `values` array must stay the same length.
 */

const line = (spec: Omit<TimeSeriesChartSpec, "variant"> & { variant?: TimeSeriesChartSpec["variant"] }): TimeSeriesChartSpec => ({ variant: "line", ...spec });

/**
 * WHY: Nebojsa wants the case study timelines to read as current, so the
 * axis and tooltip show the month only ("Mar", "Apr", …) and no year
 * (2026-09-30). The underlying labels keep the year so they stay unique,
 * which recharts needs to match tooltip rows.
 */
const monthAxis = (year: number, month: number, count: number): Pick<TimeSeriesChartSpec, "labels" | "displayLabels"> => {
  const labels = monthLabels(year, month, count);
  return { labels, displayLabels: labels.map((label) => label.split(" ")[0] ?? label) };
};

/** "22 Jan", "5 Feb", … every 14 days from a start date. */
function fortnightLabels(start: string, count: number): string[] {
  const date = new Date(start);
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(date.getTime() + i * 14 * 86_400_000);
    return `${d.getUTCDate()} ${d.toLocaleString("en-US", { month: "short", timeZone: "UTC" })}`;
  });
}

// ── Nagish ───────────────────────────────────────────────────────────────────

const NAGISH_KEYWORDS: ProofVisualSpec = {
  id: "nagish-keywords",
  title: "Nagish keyword rankings",
  table: {
    caption: "Keyword rankings after the link building campaign (Ahrefs). Before the campaign Nagish was outside the top 100 for every keyword.",
    columns: [
      { key: "keyword", label: "Keyword" },
      { key: "volume", label: "Volume", kind: "number", optional: true },
      { key: "kd", label: "KD", kind: "difficulty", optional: true },
      { key: "position", label: "Before → Now", kind: "positionChange" },
    ],
    rows: [
      { keyword: "real time phone call captioning", volume: null, kd: null, position: [100, 2] },
      { keyword: "android hearing aid app", volume: 100, kd: 26, position: [100, 3] },
      { keyword: "best hearing aid app for android", volume: 70, kd: 5, position: [100, 3] },
      { keyword: "hearing aid app for android phone", volume: 20, kd: 29, position: [100, 4] },
      { keyword: "phone call captioning", volume: null, kd: null, position: [100, 8] },
      { keyword: "live transcribe app", volume: 200, kd: 34, position: [100, 13] },
      { keyword: "live transcribe app for iphone", volume: 30, kd: 8, position: [100, 27] },
    ],
  },
  source: "Card copy + Ahrefs organic keywords screenshot (12 Jul 2024)",
};

const NAGISH_TRAFFIC: ProofVisualSpec = {
  id: "nagish-traffic",
  title: "Nagish organic traffic over time",
  chart: line({
    id: "nagish-traffic-chart",
    title: "Organic clicks per month over 16 months",
    metricLabel: "Organic clicks",
    ...monthAxis(2023, 3, 16),
    yDomain: [0, 25000],
    yTicks: [0, 5000, 10000, 15000, 20000, 25000],
    series: [{ key: "clicks", label: "Clicks", color: "brand", emphasis: true, values: [300, 700, 900, 1800, 2100, 5000, 9200, 12300, 13700, 18700, 17600, 19500, 20100, 15700, 12600, 12500] }],
  }),
  source: "Search Console export chart (Organic Traffic Over time)",
};

const NAGISH_REFERRING_DOMAINS: ProofVisualSpec = {
  id: "nagish-referring-domains",
  title: "Nagish referring domains",
  chart: line({
    id: "nagish-rd-chart",
    title: "Referring domains over 25 months",
    metricLabel: "Referring domains",
    ...monthAxis(2022, 7, 25),
    yDomain: [0, 280],
    yTicks: [0, 65, 130, 195, 260],
    axisFormat: "plain",
    series: [
      {
        key: "domains",
        label: "Referring domains",
        color: "brand",
        emphasis: true,
        values: [0, 0, 0, 0, 0, 0, 0, 20, 30, 38, 42, 62, 68, 70, 72, 80, 92, 105, 120, 132, 150, 170, 185, 200, 250],
      },
    ],
  }),
  source: "Ahrefs backlink profile, 2Y daily view",
};

const NAGISH_DOMAIN_RATING: ProofVisualSpec = {
  id: "nagish-domain-rating",
  title: "Nagish Domain Rating",
  chart: line({
    id: "nagish-dr-chart",
    title: "Domain Rating over 18 months",
    metricLabel: "Domain Rating",
    variant: "step",
    ...monthAxis(2023, 2, 18),
    yDomain: [0, 100],
    yTicks: [0, 25, 50, 75, 100],
    axisFormat: "plain",
    series: [{ key: "dr", label: "Domain Rating", color: "brand", emphasis: true, values: [33, 33, 33, 34, 34, 34, 34, 35, 35, 35, 36, 38, 39, 40, 41, 42, 42, 45] }],
  }),
  source: "Ahrefs rating chart, 2Y daily view",
};

// ── Art by Maudsch ───────────────────────────────────────────────────────────

const MAUDSCH_KEYWORDS: ProofVisualSpec = {
  id: "art-by-maudsch-keywords",
  title: "Art by Maudsch keyword rankings",
  table: {
    caption: "Google positions for the campaign's important keywords.",
    columns: [
      { key: "keyword", label: "Keyword" },
      { key: "position", label: "Position", kind: "position" },
    ],
    rows: [
      { keyword: "abstract art", position: 1 },
      { keyword: "canvas paintings", position: 1 },
      { keyword: "wall art for living room", position: 2 },
      { keyword: "bedroom wall art", position: 20 },
    ],
  },
  source: "Card copy",
};

const MAUDSCH_TRAFFIC: ProofVisualSpec = {
  id: "art-by-maudsch-traffic",
  title: "Art by Maudsch organic traffic",
  chart: line({
    id: "maudsch-traffic-chart",
    title: "Organic traffic and traffic value over six months",
    metricLabel: "Organic search",
    labels: fortnightLabels("2024-01-22", 14),
    yDomain: [0, 20000],
    yTicks: [0, 5000, 10000, 15000, 20000],
    yRight: { domain: [0, 12000], ticks: [0, 3000, 6000, 9000, 12000], format: "currency" },
    series: [
      { key: "traffic", label: "Traffic", color: "brand", emphasis: true, values: [12600, 12100, 12700, 12000, 12500, 13800, 5800, 10500, 12300, 12800, 14200, 15000, 17500, 20000] },
      { key: "value", label: "Traffic value", color: "soft", axis: "right", format: "currency", values: [7500, 7200, 7600, 7100, 7400, 8200, 3600, 6300, 7300, 7600, 8400, 9000, 10600, 12000] },
    ],
  }),
  source: "Ahrefs organic search, 6M daily view",
};

const MAUDSCH_REFERRING_DOMAINS: ProofVisualSpec = {
  id: "art-by-maudsch-referring-domains",
  title: "Art by Maudsch referring domains",
  chart: line({
    id: "maudsch-rd-chart",
    title: "Referring domains over six months",
    metricLabel: "Referring domains",
    labels: fortnightLabels("2024-01-22", 14),
    yDomain: [0, 320],
    yTicks: [0, 80, 160, 240, 320],
    axisFormat: "plain",
    series: [{ key: "domains", label: "Referring domains", color: "brand", emphasis: true, values: [118, 122, 125, 128, 135, 150, 165, 185, 205, 225, 240, 262, 300, 288] }],
  }),
  source: "Ahrefs backlink profile, 6M daily view",
};

const MAUDSCH_DOMAIN_RATING: ProofVisualSpec = {
  id: "art-by-maudsch-domain-rating",
  title: "Art by Maudsch Domain Rating",
  chart: line({
    id: "maudsch-dr-chart",
    title: "Domain Rating over six months",
    metricLabel: "Domain Rating",
    variant: "step",
    labels: fortnightLabels("2024-01-22", 14),
    yDomain: [0, 100],
    yTicks: [0, 25, 50, 75, 100],
    axisFormat: "plain",
    series: [{ key: "dr", label: "Domain Rating", color: "brand", emphasis: true, values: [19, 19, 19, 20, 22, 25, 27, 29, 32, 38, 36, 42, 45, 45] }],
  }),
  source: "Ahrefs rating chart, 6M daily view",
};

// ── DesignRush ───────────────────────────────────────────────────────────────

const DESIGNRUSH_GROWTH: ProofVisualSpec = {
  id: "designrush-growth",
  title: "DesignRush Domain Rating and organic traffic growth",
  stats: [
    { label: "Domain Rating", value: 90, gauge: 90, note: "from 70", accent: true },
    { label: "Organic traffic", value: 1_100_000, note: "from 90K / month", accent: true },
    { label: "Traffic value", value: 3_200_000, format: "currency", note: "from ~$30K", accent: true },
  ],
  chart: line({
    id: "designrush-traffic-chart",
    title: "Organic traffic and traffic value over five years (quarterly)",
    metricLabel: "Organic search",
    ...(() => {
      const labels = Array.from({ length: 21 }, (_, i) => monthLabels(2019, 7 + i * 3, 1)[0] ?? "");
      return { labels, displayLabels: labels.map((label) => label.split(" ")[0] ?? label) };
    })(),
    yDomain: [0, 1_200_000],
    yTicks: [0, 300_000, 600_000, 900_000, 1_200_000],
    yRight: { domain: [0, 3_200_000], ticks: [0, 800_000, 1_600_000, 2_400_000, 3_200_000], format: "currency" },
    series: [
      {
        key: "traffic",
        label: "Traffic",
        color: "brand",
        emphasis: true,
        values: [5000, 10000, 20000, 40000, 90000, 150000, 200000, 250000, 300000, 320000, 380000, 480000, 430000, 300000, 220000, 250000, 400000, 620000, 800000, 950000, 1100000],
      },
      {
        key: "value",
        label: "Traffic value",
        color: "soft",
        axis: "right",
        format: "currency",
        values: [10000, 25000, 50000, 100000, 250000, 400000, 550000, 700000, 850000, 900000, 1100000, 1400000, 1200000, 800000, 600000, 700000, 1200000, 1900000, 2400000, 2800000, 3200000],
      },
    ],
  }),
  source: "Ahrefs overview + organic search 5Y view (July 2024)",
};

const DESIGNRUSH_KEYWORDS: ProofVisualSpec = {
  id: "designrush-keywords",
  title: "DesignRush keyword rankings versus Clutch",
  table: {
    caption: "Google positions for the two category keywords, before and after.",
    columns: [
      { key: "keyword", label: "Keyword" },
      { key: "outranked", label: "Outranked", optional: true },
      { key: "position", label: "Then → Now", kind: "positionChange" },
    ],
    rows: [
      { keyword: "digital marketing agency", outranked: "Clutch.co", position: [7, 1] },
      { keyword: "web design company", outranked: "Clutch.co, G2.com", position: [4, 1] },
    ],
  },
  source: "Card copy",
};

const DESIGNRUSH_LINK_VELOCITY: ProofVisualSpec = {
  id: "designrush-link-velocity",
  title: "DesignRush link velocity versus Clutch",
  chart: line({
    id: "designrush-rd-chart",
    title: "Referring domains, DesignRush versus Clutch.co, over 25 months",
    metricLabel: "Referring domains",
    ...monthAxis(2022, 7, 25),
    yDomain: [0, 60000],
    yTicks: [0, 15000, 30000, 45000, 60000],
    series: [
      {
        key: "designrush",
        label: "designrush.com",
        color: "brand",
        emphasis: true,
        values: [15000, 15400, 15800, 16200, 16600, 17400, 18400, 19200, 19800, 20400, 21000, 21600, 22200, 22800, 23300, 23900, 24500, 25200, 25900, 26800, 27700, 28500, 29400, 30300, 32000],
      },
      {
        key: "clutch",
        label: "clutch.co",
        color: "soft",
        values: [28000, 29000, 30000, 30300, 30300, 30500, 30800, 31000, 31200, 31300, 31500, 32000, 32500, 33000, 33500, 34000, 34500, 35000, 38000, 39000, 40000, 41000, 42000, 43500, 45000],
      },
    ],
  }),
  source: "Ahrefs backlink profile, competitor view, 2Y daily",
};

// ── DIY Craft eCom Brand ─────────────────────────────────────────────────────

const DIY_AHREFS: ProofVisualSpec = {
  id: "diy-ahrefs-dashboard",
  title: "DIY brand Ahrefs overview",
  metrics: [
    {
      title: "Backlink profile",
      stats: [
        { label: "Domain Rating", value: 54, gauge: 54, note: "from DR 1", accent: true },
        { label: "URL Rating", value: 14, gauge: 14 },
        { label: "Backlinks", value: 1000, note: "All time 2K" },
        { label: "Ref. domains", value: 597, note: "All time 781", accent: true },
      ],
    },
    {
      title: "Search",
      stats: [
        { label: "Organic keywords", value: 3600, note: "Top 3: 978", accent: true },
        { label: "Organic traffic", value: 63500, note: "Value $43.5K", accent: true },
        { label: "Paid keywords", value: 348, note: "Ads 423" },
        { label: "Paid traffic", value: 97500, note: "Cost $77.6K" },
      ],
    },
    {
      title: "AI citations",
      stats: [
        { label: "AI Overview", value: 200, note: "24 pages" },
        { label: "ChatGPT", value: 105, note: "94 pages" },
        { label: "Perplexity", value: 79, note: "23 pages" },
        { label: "Gemini + Copilot", value: 29, note: "30 pages" },
      ],
    },
  ],
  source: "Ahrefs site overview, changes over last 2 years",
};

const DIY_SEARCH_CONSOLE: ProofVisualSpec = {
  id: "diy-search-console",
  title: "DIY brand Google Search Console performance",
  stats: [
    { label: "Total clicks", value: 229000, accent: true },
    { label: "Total impressions", value: 16_100_000, accent: true },
    { label: "Average CTR", value: 1.4, format: "percent", decimals: 1 },
    { label: "Average position", value: 14.3, decimals: 1 },
  ],
  chart: line({
    id: "diy-gsc-chart",
    title: "Daily clicks and impressions by month over 16 months",
    metricLabel: "Search performance (daily average)",
    ...monthAxis(2024, 10, 16),
    yDomain: [0, 1500],
    yTicks: [0, 500, 1000, 1500],
    yRight: { domain: [0, 90000], ticks: [0, 30000, 60000, 90000] },
    series: [
      { key: "clicks", label: "Clicks", color: "brand", emphasis: true, values: [50, 250, 600, 400, 350, 300, 300, 330, 380, 500, 650, 600, 600, 1000, 1100, 850] },
      { key: "impressions", label: "Impressions", color: "soft", axis: "right", values: [3000, 10000, 25000, 28000, 30000, 32000, 35000, 38000, 40000, 45000, 50000, 55000, 52000, 60000, 80000, 70000] },
    ],
  }),
  source: "Search Console performance report, custom range, daily",
};

const DIY_TOP_KEYWORDS: ProofVisualSpec = {
  id: "diy-top-keywords",
  title: "DIY brand top 3 keyword rankings",
  stats: [
    { label: "Keywords in top 3", value: 978, accent: true },
    { label: "Monthly organic traffic", value: 65000, accent: true },
  ],
  table: {
    caption: "Highest-traffic keywords ranking in the top 3 (Ahrefs).",
    columns: [
      { key: "keyword", label: "Keyword" },
      { key: "volume", label: "Volume", kind: "number", optional: true },
      { key: "kd", label: "KD", kind: "difficulty", optional: true },
      { key: "traffic", label: "Traffic", kind: "bar", max: 11419 },
      { key: "position", label: "Position", kind: "position" },
    ],
    rows: [
      { keyword: "paint by numbers", volume: 64000, kd: 54, traffic: 11419, position: 1 },
      { keyword: "paint by numbers for adults", volume: 28000, kd: 49, traffic: 6855, position: 1 },
      { keyword: "paint by number", volume: 24000, kd: 58, traffic: 3078, position: 2 },
      { keyword: "paint by number kits", volume: 14000, kd: 49, traffic: 2710, position: 2 },
      { keyword: "custom paint by number", volume: 5500, kd: 37, traffic: 1380, position: 2 },
      { keyword: "paint by numbers custom", volume: 4500, kd: 41, traffic: 1368, position: 1 },
      { keyword: "paint by numbers kit", volume: 2700, kd: 47, traffic: 1243, position: 1 },
      { keyword: "custom paint by numbers", volume: 3200, kd: 33, traffic: 902, position: 2 },
      { keyword: "painting by numbers", volume: 3000, kd: 53, traffic: 808, position: 1 },
      { keyword: "paint by number for adults", volume: 3300, kd: 49, traffic: 518, position: 2 },
    ],
  },
  source: "Ahrefs organic keywords, 12 Jan 2026",
};

const DIY_AI_REVENUE: ProofVisualSpec = {
  id: "diy-ai-revenue",
  title: "DIY brand revenue from ChatGPT traffic",
  stats: [
    { label: "Revenue from chatgpt.com", value: 9304.53, format: "currency", note: "$9,304.53 in one calendar year", accent: true },
    { label: "Key events", value: 135, note: "4.77% session rate" },
    { label: "Events", value: 57184 },
  ],
  table: {
    caption: "GA4 traffic acquisition filtered to chatgpt.com, one calendar year.",
    columns: [
      { key: "source", label: "Session source / medium" },
      { key: "events", label: "Events", kind: "number", optional: true },
      { key: "keyEvents", label: "Key events", kind: "number", optional: true },
      { key: "revenue", label: "Total revenue", kind: "bar", max: 9304.53, format: "currency" },
    ],
    rows: [
      { source: "chatgpt.com / (not set)", events: 32381, keyEvents: 69, revenue: 4862.13 },
      { source: "chatgpt.com / referral", events: 24394, keyEvents: 63, revenue: 4269.7 },
    ],
    footer: { source: "Total", events: 57184, keyEvents: 135, revenue: 9304.53 },
  },
  source: "GA4 traffic acquisition report",
};

const DIY_REVENUE_FORECAST: ProofVisualSpec = {
  id: "diy-revenue-forecast",
  title: "DIY brand revenue forecasting and performance",
  stats: [
    { label: "Average conversion rate", value: 6.55, format: "percent", decimals: 2 },
    { label: "Average purchase value", value: 50, format: "currency" },
    { label: "Existing pages: traffic goal / mo", value: 9160 },
    { label: "Existing pages: revenue goal / mo", value: 23936.5, format: "currency", accent: true },
  ],
  table: {
    caption: "Launching new pages: monthly traffic and revenue goals per segment.",
    columns: [
      { key: "segment", label: "Segment" },
      { key: "traffic", label: "Traffic / mo goal", kind: "number" },
      { key: "revenue", label: "Revenue / mo goal", kind: "bar", max: 6550, format: "currency" },
      { key: "timeframe", label: "Timeframe", optional: true },
    ],
    rows: [
      { segment: "Paint by Numbers for Adults", traffic: 2000, revenue: 6550, timeframe: "March 1" },
      { segment: "Paint by Numbers for Kids", traffic: 400, revenue: 1310, timeframe: "March 1" },
      { segment: "Paint By Number Dinosaur", traffic: 150, revenue: 491, timeframe: "March 1" },
      { segment: "Modern Paint By Numbers", traffic: 100, revenue: 328, timeframe: "March 1" },
      { segment: "Cute Paint by Numbers", traffic: 100, revenue: 328, timeframe: "March 1" },
    ],
  },
  source: "Revenue forecasting sheet (visible rows)",
};

const DIY_MONTHLY_REVENUE: ProofVisualSpec = {
  id: "diy-monthly-revenue",
  title: "DIY brand monthly organic search revenue",
  stats: [
    { label: "Cumulative organic revenue", value: 1_300_000, format: "currency", note: "24 months of organic search", accent: true },
    { label: "Best month", value: 180240, format: "currency", note: "December", accent: true },
  ],
  chart: line({
    id: "diy-revenue-chart",
    title: "Monthly organic search revenue and users over 24 months",
    metricLabel: "Organic search",
    ...monthAxis(2024, 1, 24),
    valueFormat: "currency",
    yDomain: [0, 200000],
    yTicks: [0, 50000, 100000, 150000, 200000],
    yRight: { domain: [0, 50000], ticks: [0, 10000, 20000, 30000, 40000, 50000] },
    series: [
      {
        key: "revenue",
        label: "Total revenue",
        color: "brand",
        emphasis: true,
        draw: "bar",
        format: "currency",
        values: [0, 99.8, 1130, 3320, 7210, 10750, 13040, 13400, 20520, 25000, 67430, 135750, 65960, 62180, 42720, 43920, 51060, 48800, 70300, 108810, 86630, 83910, 143660, 180240],
      },
      {
        key: "users",
        label: "Total users",
        color: "white",
        axis: "right",
        values: [0, 100, 300, 800, 1500, 2500, 3000, 3200, 4500, 6000, 12000, 21000, 15000, 14000, 10000, 11000, 12000, 11500, 16000, 26000, 27000, 25000, 33000, 41000],
      },
    ],
  }),
  source: "Looker Studio organic search revenue overview (revenue labels verbatim; users read from the line)",
};

export const PROOF_VISUALS: Record<string, ProofVisualSpec> = Object.fromEntries(
  [
    NAGISH_KEYWORDS,
    NAGISH_TRAFFIC,
    NAGISH_REFERRING_DOMAINS,
    NAGISH_DOMAIN_RATING,
    MAUDSCH_KEYWORDS,
    MAUDSCH_TRAFFIC,
    MAUDSCH_REFERRING_DOMAINS,
    MAUDSCH_DOMAIN_RATING,
    DESIGNRUSH_GROWTH,
    DESIGNRUSH_KEYWORDS,
    DESIGNRUSH_LINK_VELOCITY,
    DIY_AHREFS,
    DIY_SEARCH_CONSOLE,
    DIY_TOP_KEYWORDS,
    DIY_AI_REVENUE,
    DIY_REVENUE_FORECAST,
    DIY_MONTHLY_REVENUE,
  ].map((spec) => [spec.id, spec]),
);

/**
 * Which visual each existing card gets, by case study slug and card position,
 * until an editor picks one explicitly in the Studio.
 */
export const DEFAULT_PROOF_VISUALS: Record<string, Array<string | null>> = {
  nagish: [NAGISH_KEYWORDS.id, NAGISH_TRAFFIC.id, NAGISH_REFERRING_DOMAINS.id, NAGISH_DOMAIN_RATING.id],
  "art-by-maudsch": [MAUDSCH_KEYWORDS.id, MAUDSCH_TRAFFIC.id, MAUDSCH_REFERRING_DOMAINS.id, MAUDSCH_DOMAIN_RATING.id],
  designrush: [DESIGNRUSH_GROWTH.id, DESIGNRUSH_KEYWORDS.id, DESIGNRUSH_LINK_VELOCITY.id],
  "diy-craft-ecom-brand": [DIY_AHREFS.id, DIY_SEARCH_CONSOLE.id, DIY_TOP_KEYWORDS.id, DIY_AI_REVENUE.id, DIY_REVENUE_FORECAST.id, DIY_MONTHLY_REVENUE.id],
};

/** Options offered in the Studio's "Interactive visual" select. */
export const PROOF_VISUAL_OPTIONS = Object.values(PROOF_VISUALS).map((spec) => ({ title: spec.title, value: spec.id }));

/** Resolves a card's visual: explicit choice wins ("image" opts out), otherwise the default for that slug and position. */
export function resolveProofVisual(choice: string | null | undefined, slug: string | null | undefined, index: number): ProofVisualSpec | null {
  if (choice === "image") return null;
  const id = choice || (slug ? DEFAULT_PROOF_VISUALS[slug]?.[index] : null);
  return id ? (PROOF_VISUALS[id] ?? null) : null;
}
