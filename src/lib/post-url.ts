/**
 * Build the canonical post URL. With a URL category: /seo/<urlCategory>/<slug>/,
 * the legacy heroicrankings.com shape (docs/migration/legacy-url-verification-baseline.md).
 * Without one: /seo/<slug>/, used for pillar guides.
 */
export function getPostHref(post: { slug: string; urlCategory?: string | null }): string {
  return post.urlCategory ? `/seo/${post.urlCategory}/${post.slug}/` : `/seo/${post.slug}/`;
}
