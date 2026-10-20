/**
 * Build the canonical post URL: /seo/<urlCategory>/<slug>/, or /seo/<slug>/
 * for hub pages (pillar guides flagged in the Studio). The category form
 * matches the legacy heroicrankings.com path identity per
 * docs/migration/legacy-url-verification-baseline.md.
 *
 * Returns null when urlCategory is missing on a normal post — callers must
 * handle that case (skip the post in lists, fall back to /blog/<slug>/, etc).
 */
export function getPostHref(post: {
  slug: string;
  urlCategory?: string | null;
  hubPage?: boolean | null;
}): string | null {
  if (post.hubPage) return `/seo/${post.slug}/`;
  if (!post.urlCategory) return null;
  return `/seo/${post.urlCategory}/${post.slug}/`;
}
