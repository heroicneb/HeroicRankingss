import type { BlogCard } from "@/types";
import { INSIGHT_REGISTRY, type InsightCategory } from "./insights-registry";

type CategoryTab = InsightCategory;

export interface BlogPostEntry extends BlogCard {
  /** Catalog-only: category used for filtering on /insights */
  category: CategoryTab;
  /** Catalog-only: card image shown on /insights */
  imageSrc: string;
  /** Signals whether a card links directly to a published insight route. */
  isPublished: boolean;
}

/**
 * Single source of truth for featured blog post data.
 * Consumed by both the homepage blog section and the /insights catalog.
 */
export const BLOG_POSTS: readonly BlogPostEntry[] = INSIGHT_REGISTRY.map((entry) => ({
  slug: entry.slug,
  title: entry.title,
  excerpt: entry.excerpt,
  date: entry.date,
  href: entry.published ? `/insights/${entry.slug}` : "/insights",
  category: entry.category,
  imageSrc: entry.imageSrc,
  isPublished: entry.published,
}));

export const PUBLISHED_BLOG_POSTS = BLOG_POSTS.filter((entry) => entry.isPublished);
