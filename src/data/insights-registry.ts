export type InsightCategory = "Marketing" | "SEO" | "Link Building";

interface InsightRegistrySchema {
  category: InsightCategory;
  date: string;
  excerpt: string;
  metadataDescription: string;
  metadataTitle: string;
  published: boolean;
  slug: string;
  title: string;
  imageSrc: string;
}

export const INSIGHT_REGISTRY = [
  {
    slug: "market-research-guide",
    title: "Market Research Made Simple",
    excerpt:
      "A practical framework for defining buyer personas, evaluating competitors, and turning market signals into focused growth decisions.",
    date: "October 2, 2024 — 10 min read",
    category: "Marketing",
    imageSrc: "/insights/imgSubtract1.png",
    metadataTitle: "Market Research Guide",
    metadataDescription:
      "A practical guide to market research frameworks, competitor analysis, and data-driven opportunity discovery.",
    published: true,
  },
  {
    slug: "top-5-seo-myths-you-still-believe-in-2026",
    title: "Top 5 SEO Myths You Still Believe in 2026",
    excerpt:
      "There are so many SEO myths that even some of the oldest veterans in the field still believe. Read more to learn the five most...",
    date: "July 30, 2024 — 8 min read",
    category: "SEO",
    imageSrc: "/insights/imgSubtract.png",
    metadataTitle: "Top 5 SEO Myths You Still Believe in 2026",
    metadataDescription: "SEO myths that still hurt rankings and what to do instead.",
    published: true,
  },
  {
    slug: "outsourcing-link-building-tips-and-tricks",
    title: "Outsourcing Link Building: Tips & Tricks",
    excerpt:
      "Link-building is a crucial aspect of SEO for enhancing a website's visibility and authority. As the complexity of SEO...",
    date: "September 5, 2024 — 5 min read",
    category: "Link Building",
    imageSrc: "/insights/imgSubtract2.png",
    metadataTitle: "Outsourcing Link Building: Tips & Tricks",
    metadataDescription: "How to evaluate and outsource link building while protecting quality.",
    published: true,
  },
  {
    slug: "a-dive-into-googles-algorithm-updates",
    title: "A Dive into Google's Algorithm Updates",
    excerpt:
      "A practical framework for defining buyer personas, evaluating competitors, and turning market signals into focused growth decisions.",
    date: "October 2, 2024 — 10 min read",
    category: "Marketing",
    imageSrc: "/insights/imgSubtract1.png",
    metadataTitle: "A Dive into Google's Algorithm Updates",
    metadataDescription:
      "A practical guide to market research frameworks, competitor analysis, and data-driven opportunity discovery.",
    published: true,
  },
  {
    slug: "top-5-seo-myths-you-still-believe-in-2026-part-2",
    title: "Top 5 SEO Myths You Still Believe in 2026",
    excerpt:
      "There are so many SEO myths that even some of the oldest veterans in the field still believe. Read more to learn the five most...",
    date: "July 30, 2024 — 8 min read",
    category: "SEO",
    imageSrc: "/insights/imgSubtract.png",
    metadataTitle: "Top 5 SEO Myths You Still Believe in 2026",
    metadataDescription: "SEO myths that still hurt rankings and what to do instead.",
    published: true,
  },
  {
    slug: "outsourcing-link-building-tips-and-tricks-part-2",
    title: "Outsourcing Link Building: Tips & Tricks",
    excerpt:
      "Link-building is a crucial aspect of SEO for enhancing a website's visibility and authority. As the complexity of SEO...",
    date: "September 5, 2024 — 5 min read",
    category: "Link Building",
    imageSrc: "/insights/imgSubtract2.png",
    metadataTitle: "Outsourcing Link Building: Tips & Tricks",
    metadataDescription: "How to evaluate and outsource link building while protecting quality.",
    published: true,
  },
] as const satisfies readonly InsightRegistrySchema[];

export type InsightRegistryEntry = (typeof INSIGHT_REGISTRY)[number];
export type PublishedInsightEntry = Extract<InsightRegistryEntry, { published: true }>;
export type PublishedInsightSlug = PublishedInsightEntry["slug"];

export function isPublishedInsight(entry: InsightRegistryEntry): entry is PublishedInsightEntry {
  return entry.published;
}

export const PUBLISHED_INSIGHTS = INSIGHT_REGISTRY.filter(isPublishedInsight);

export function getPublishedInsightBySlug(slug: string): PublishedInsightEntry | undefined {
  return PUBLISHED_INSIGHTS.find((entry) => entry.slug === slug);
}
