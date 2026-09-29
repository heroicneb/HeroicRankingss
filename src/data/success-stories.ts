import type { ServiceSuccessStory } from "@/components/sections/shared/service-success-stories";
import { getCaseStudies, getFeaturedCaseStudies, type SanityCaseStudy } from "@/lib/sanity-data";

/*
 * "/ Proven Performance / Success Stories" on every service page: three case
 * studies from Sanity with their artwork. The ones ticked "Featured on
 * homepage" come first; the newest published fill the remaining slots.
 */

/** Shown only when Sanity is unreachable or empty. */
export const SUCCESS_STORIES: readonly ServiceSuccessStory[] = [
  {
    title: "My Baskets",
    description: "My Baskets is a leading Canadian online retailer specializing in luxury gift baskets for various occasions.",
    date: "December 1, 2024",
    heroClassName: "bg-[var(--color-case-my-baskets)]",
    href: "/case-study/my-baskets",
  },
  {
    title: "Nagish",
    description: "Nagish is a pioneering company dedicated to making communication more accessible for individuals with hearing impairments.",
    date: "December 24, 2024",
    heroClassName: "bg-[var(--color-hr-dark)]",
    href: "/case-study/nagish",
  },
  {
    title: "Art by Maudsch",
    description: "Art by Maudsch is an online platform dedicated to selling unique, handmade artworks by contemporary artists.",
    date: "December 24, 2024",
    heroClassName: "bg-[var(--color-case-art-maudsch)]",
    href: "/case-study/art-by-maudsch",
  },
] as const;

function formatDate(value: string | null): string {
  if (!value) return "Case study in progress";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "Case study in progress";
  return new Intl.DateTimeFormat("en-US", { day: "numeric", month: "long", year: "numeric" }).format(parsed);
}

/** Short brand name: Panel Label, then Client unless it is a bare domain, then the title. */
function shortName(caseStudy: SanityCaseStudy): string {
  const label = caseStudy.panelLabel?.trim();
  if (label) return label;
  const client = caseStudy.client?.trim();
  if (client && !/\.[a-z]{2,}$/i.test(client)) return client;
  return caseStudy.title;
}

export function toSuccessStory(caseStudy: SanityCaseStudy): ServiceSuccessStory {
  const imageSrc = caseStudy.cardImageUrl || caseStudy.heroImageUrl || undefined;
  return {
    title: shortName(caseStudy),
    description: caseStudy.excerpt ?? "Explore how Heroic Rankings delivered measurable SEO growth for this client.",
    date: formatDate(caseStudy.publishedAt),
    heroClassName: "bg-[var(--color-hr-dark)]",
    href: `/case-study/${caseStudy.slug}`,
    image: imageSrc ? { src: imageSrc, lqip: caseStudy.cardImageLqip ?? caseStudy.heroImageLqip } : undefined,
    // WHY: same rule as the homepage cards — only an explicit Panel Label is drawn over artwork.
    panelLabel: imageSrc ? (caseStudy.panelLabel?.trim() ?? "") : undefined,
  };
}

export async function getSuccessStories(): Promise<readonly ServiceSuccessStory[]> {
  const [featured, all] = await Promise.all([getFeaturedCaseStudies().catch(() => []), getCaseStudies().catch(() => [])]);
  const seen = new Set<string>();
  const picked: SanityCaseStudy[] = [];
  for (const caseStudy of [...featured, ...all]) {
    if (!caseStudy.slug || seen.has(caseStudy.slug)) continue;
    seen.add(caseStudy.slug);
    picked.push(caseStudy);
    if (picked.length === 3) break;
  }
  return picked.length ? picked.map(toSuccessStory) : SUCCESS_STORIES;
}
