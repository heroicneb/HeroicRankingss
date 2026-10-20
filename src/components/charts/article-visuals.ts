import type { ProofVisualSpec } from "./proof-visual-types";

/*
 * Data visuals that blog posts can embed (the "Data visual" block in the
 * Studio). Same card as the case-study proof visuals. Every number here is
 * quoted in the article that uses it, with its source, so an editor can
 * check the visual against the text. Add a spec, and it appears in the
 * Studio dropdown.
 */

const SEO_GUIDE_SEARCH_LANDSCAPE: ProofVisualSpec = {
  id: "seo-guide-search-landscape",
  title: "Search in 2026 at a glance",
  source: "StatCounter, worldwide search engine market share, September 2026; Pew Research Center, 2025",
  stats: [
    { label: "Google's share of worldwide search", value: 89.94, suffix: "%", decimals: 2, gauge: 89.94, accent: true },
    { label: "US adults who saw an AI summary in a month", value: 58, suffix: "%", gauge: 58 },
    { label: "Fewer clicks on results when an AI summary shows", value: 47, suffix: "%", note: "8% of visits vs 15%" },
  ],
  table: {
    caption: "Share of Google visits where someone clicked a regular result (Pew Research Center, July 2025)",
    columns: [
      { key: "scenario", label: "Search result page" },
      { key: "clicks", label: "Visits with a click", kind: "bar", format: "percent", max: 15 },
    ],
    rows: [
      { scenario: "With an AI summary", clicks: 8 },
      { scenario: "Without an AI summary", clicks: 15 },
    ],
  },
};

const SEO_GUIDE_CONTENT_PROGRAM: ProofVisualSpec = {
  id: "seo-guide-content-program",
  title: "A content program in numbers: Cirrus Insight",
  source: "Heroic Rankings case study, Cirrus Insight, first 9 months",
  stats: [
    { label: "Organic traffic growth", value: 56, prefix: "+", suffix: "%", accent: true },
    { label: "Growth in the value of that traffic", value: "2.6×" },
    { label: "New blog posts per month", value: "6–8", note: "plus one linkable asset" },
    { label: "Months to these results", value: 9 },
  ],
};

const SEO_GUIDE_TIMELINES: ProofVisualSpec = {
  id: "seo-guide-timelines",
  title: "How long SEO usually takes",
  source: "Google SEO Starter Guide; Heroic Rankings client experience",
  table: {
    caption: "Typical time before the work shows in organic results",
    columns: [
      { key: "scenario", label: "Situation" },
      { key: "expect", label: "What to expect", optional: true },
      { key: "months", label: "Months, upper end", kind: "bar", max: 12 },
    ],
    rows: [
      { scenario: "Better titles or refreshed pages on an established site", expect: "Movement within weeks", months: 1 },
      { scenario: "Technical fixes that unblock crawling and indexing", expect: "Hours to a few months, per Google", months: 3 },
      { scenario: "Link building paying off", expect: "Consistency for at least six months", months: 6 },
      { scenario: "A brand-new site in a competitive niche", expect: "Six to twelve months before traffic is meaningful", months: 12 },
    ],
  },
};


// ── Google AI Overview statistics (/seo/google-ai-overview-statistics/) ──
// Every figure below is stated in that article's own statistics lists.

const AIO_REACH: ProofVisualSpec = {
  id: "aio-reach",
  title: "How often AI Overviews appear",
  source: "Figures as cited in the article's key statistics list",
  stats: [
    { label: "Of all Google searches show an AI Overview", value: 55, suffix: "%", gauge: 55, accent: true },
    { label: "Of US search queries generate one", value: 50, suffix: "%", gauge: 50 },
    { label: "Of Google searches end without a click", value: 58, suffix: "%", gauge: 58 },
    { label: "More likely with queries of 8+ words", value: "7\u00d7" },
  ],
  table: {
    caption: "Share of searches that trigger an AI Overview, by query type",
    columns: [
      { key: "type", label: "Query type" },
      { key: "share", label: "Share with an AI Overview", kind: "bar", format: "percent", max: 100 },
    ],
    rows: [
      { type: "All Google searches", share: 55 },
      { type: "Searches in the United States", share: 50 },
      { type: "Queries with a noun and a verb", share: 36 },
      { type: "Local-intent searches", share: 7 },
    ],
  },
};

const AIO_SOURCES: ProofVisualSpec = {
  id: "aio-sources",
  title: "Where AI Overviews point and when they show",
  source: "Figures as cited in the article's source distribution list",
  stats: [
    { label: "Of AI Overviews point back to Google", value: 43, suffix: "%", gauge: 43, accent: true },
    { label: "Of top-10 ranking pages are not cited", value: 62, suffix: "%", gauge: 62 },
    { label: "Of businesses report a positive effect", value: 63, suffix: "%", gauge: 63 },
  ],
  table: {
    caption: "What surrounds an AI Overview",
    columns: [
      { key: "fact", label: "Of searches that trigger an AI Overview" },
      { key: "share", label: "Share", kind: "bar", format: "percent", max: 100 },
    ],
    rows: [
      { fact: "Keywords with informational intent", share: 88 },
      { fact: "Also show a People Also Ask box", share: 81 },
      { fact: "Performed on mobile", share: 81 },
      { fact: "Mentions that go to the top 50 domains", share: 30 },
    ],
  },
};

const AIO_BEHAVIOUR: ProofVisualSpec = {
  id: "aio-behaviour",
  title: "How people read AI Overviews",
  source: "Figures as cited in the article's user behaviour list",
  stats: [
    { label: "Of users read only the first few lines", value: 70, suffix: "%", gauge: 70, accent: true },
    { label: "Click \u201cshow more\u201d, even without reading on", value: 88, suffix: "%", gauge: 88 },
    { label: "Of consumers trust Google\u2019s generative results", value: 70, suffix: "%", gauge: 70 },
  ],
};

const AIO_CITATIONS: ProofVisualSpec = {
  id: "aio-citations",
  title: "How many sources an AI Overview cites",
  source: "Figures as cited in the article's citation patterns list",
  stats: [
    { label: "Of AI Overviews cite three or more sources", value: 88, suffix: "%", gauge: 88, accent: true },
    { label: "Cite a single source", value: 1, suffix: "%", gauge: 1 },
    { label: "Pull information from Reddit", value: 5.5, suffix: "%", decimals: 1, gauge: 5.5 },
  ],
  table: {
    caption: "Longer answers cite more pages",
    columns: [
      { key: "length", label: "Length of the AI Overview" },
      { key: "sources", label: "Sources cited", kind: "bar", max: 28 },
    ],
    rows: [
      { length: "Under 600 characters", sources: 5 },
      { length: "Over 6,600 characters", sources: 28 },
    ],
  },
};

export const ARTICLE_VISUALS: Record<string, ProofVisualSpec> = Object.fromEntries(
  [SEO_GUIDE_SEARCH_LANDSCAPE, SEO_GUIDE_CONTENT_PROGRAM, SEO_GUIDE_TIMELINES, AIO_REACH, AIO_SOURCES, AIO_BEHAVIOUR, AIO_CITATIONS].map((spec) => [spec.id, spec]),
);

export const ARTICLE_VISUAL_OPTIONS = Object.values(ARTICLE_VISUALS).map((spec) => ({ title: spec.title, value: spec.id }));

export function resolveArticleVisual(id: string | null | undefined): ProofVisualSpec | null {
  return id ? (ARTICLE_VISUALS[id] ?? null) : null;
}
