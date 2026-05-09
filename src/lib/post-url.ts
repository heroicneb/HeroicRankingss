/**
 * Build the canonical post URL: /seo/<urlCategory>/<slug>/.
 * Matches legacy heroicrankings.com path identity per
 * docs/migration/legacy-url-verification-baseline.md.
 *
 * Returns null when urlCategory is missing — callers must handle that
 * case (skip the post in lists, fall back to /blog/<slug>/, etc).
 */
export function getPostHref(post: {
  slug: string;
  urlCategory?: string | null;
}): string | null {
  if (!post.urlCategory) return null;
  return `/seo/${post.urlCategory}/${post.slug}/`;
}
