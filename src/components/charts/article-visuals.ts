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

export const ARTICLE_VISUALS: Record<string, ProofVisualSpec> = Object.fromEntries(
  [SEO_GUIDE_SEARCH_LANDSCAPE, SEO_GUIDE_CONTENT_PROGRAM, SEO_GUIDE_TIMELINES].map((spec) => [spec.id, spec]),
);

export const ARTICLE_VISUAL_OPTIONS = Object.values(ARTICLE_VISUALS).map((spec) => ({ title: spec.title, value: spec.id }));

export function resolveArticleVisual(id: string | null | undefined): ProofVisualSpec | null {
  return id ? (ARTICLE_VISUALS[id] ?? null) : null;
}
