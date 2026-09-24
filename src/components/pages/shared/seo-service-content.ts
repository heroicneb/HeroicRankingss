/*
 * Shared content model for the seven "SEO service" pages (hub + six
 * services). All of them share the same sections — hero, solutions
 * (cards + optional process banner), why-choose, FAQ — so they share one
 * Sanity document type (`seoServicePage`) and one mapper; each page keeps
 * its own layout component and its own default content module.
 */

import type { ContentImage, FaqEntry, HeadingSegment } from "./page-content.ts";

export type SeoServicePageKey =
  | "seo-services"
  | "on-page-seo"
  | "technical-seo"
  | "local-seo"
  | "keyword-strategy"
  | "content-creation"
  | "ecommerce-seo";

export interface SolutionCard {
  title: string;
  subtitle: string;
  body: string;
  ctaLabel: string;
  ctaUrl: string;
  icon: ContentImage | null;
}

/** Flip-card used only by the SEO hub grid. */
export interface HubCard {
  title: string;
  description: string;
  descriptionGradient: boolean;
  image: ContentImage | null;
  backIntro: string;
  backPoints: string[];
  href: string;
}

export interface ProcessBanner {
  heading: HeadingSegment[];
  steps: Array<{ label: string; description: string }>;
  ctaLabel: string;
  ctaUrl: string;
}

export interface SeoServiceContent {
  hero: {
    title: HeadingSegment[];
    tagline: HeadingSegment[];
    label: string;
    heading: HeadingSegment[];
    paragraphs: string[];
    ctaLabel: string;
    ctaUrl: string;
    image: ContentImage | null;
  };
  solutions: {
    label: string;
    heading: HeadingSegment[];
    cards: SolutionCard[];
    hubCards: HubCard[];
    banner: ProcessBanner | null;
  };
  whyChoose: {
    label: string;
    heading: HeadingSegment[];
    items: Array<{ title: string; description: string; icon: ContentImage | null }>;
    ctaTitle: string;
    ctaLabel: string;
    ctaUrl: string;
  };
  faq: { items: FaqEntry[] };
}

export interface SeoServicePageDefinition {
  key: SeoServicePageKey;
  /** Studio title */
  title: string;
  path: string;
  /** Sanity faqItem.servicePage value used as a secondary FAQ source. */
  faqService: string;
  seo: { title: string; description: string };
  content: SeoServiceContent;
}

/** The shared "Why Choose Heroic Rankings?" block used by the six service pages. */
export const DEFAULT_WHY_CHOOSE: SeoServiceContent["whyChoose"] = {
  label: "/  Guided by Results  /",
  heading: [{ text: "Why Choose " }, { text: "Heroic Rankings?", highlight: true }],
  items: [
    { title: "Expertise", description: "Proven track record of success across various industries.", icon: { src: "/seo-services/why-icon-expertise.svg", alt: "", width: 20, height: 20 } },
    { title: "Customized Strategies", description: "Tailored to your goals and industry.", icon: { src: "/seo-services/why-icon-strategy.svg", alt: "", width: 20, height: 20 } },
    { title: "Comprehensive Services", description: "From on-page to technical SEO, we cover it all", icon: { src: "/seo-services/why-icon-services.svg", alt: "", width: 20, height: 20 } },
    { title: "Take Your SEO To The Next Level", description: "Regular updates and detailed reports on your SEO performance.", icon: { src: "/seo-services/why-icon-reporting.svg", alt: "", width: 20, height: 20 } },
    { title: "Dedicated Support", description: "A team of SEO experts always ready to assist you.", icon: { src: "/seo-services/why-icon-support.svg", alt: "", width: 20, height: 20 } },
  ],
  ctaTitle: "Take Your SEO To The Next Level",
  ctaLabel: "Take the First Step Today",
  ctaUrl: "/contact",
};

/** Shared process-step labels (step 2 varies on some pages). */
export const PROCESS_LABELS = [
  "Reaching Out",
  "Initial Call and Interview",
  "Gathering Project Information",
  "Determining Budgets",
  "Advisory",
];

export function processSteps(descriptions: string[], labels: string[] = PROCESS_LABELS) {
  return descriptions.map((description, index) => ({ label: labels[index] ?? `Step ${index + 1}`, description }));
}
