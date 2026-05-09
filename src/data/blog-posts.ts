import type { BlogCard } from "@/types";
import { INSIGHT_REGISTRY, type InsightCategory } from "./insights-registry";

type CategoryTab = InsightCategory;

export interface BlogPostEntry extends BlogCard {
  /** Catalog-only: category used for filtering on /blog */
  category: CategoryTab;
  /** Catalog-only: card image shown on /blog */
  imageSrc: string;
  /** Signals whether a card links directly to a published insight route. */
  isPublished: boolean;
}

/**
 * Single source of truth for featured blog post data.
 * Consumed by both the homepage blog section and the /blog catalog.
 *
 * WHY: Static-fallback entries are placeholders; canonical post URLs are
 * /seo/<urlCategory>/<slug>/ (per legacy heroicrankings.com inventory) and
 * are only known once a real CMS post is loaded. Static cards therefore
 * point at /blog (the catalog) and render as non-link via isPublished=false
 * so they never serve a broken URL.
 */
export const BLOG_POSTS: readonly BlogPostEntry[] = INSIGHT_REGISTRY.map(
  (entry) => ({
    slug: entry.slug,
    title: entry.title,
    excerpt: entry.excerpt,
    date: entry.date,
    href: "/blog",
    category: entry.category,
    imageSrc: entry.imageSrc,
    isPublished: false,
  }),
);

export const PUBLISHED_BLOG_POSTS = BLOG_POSTS.filter(
  (entry) => entry.isPublished,
);
