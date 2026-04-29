/**
 * BCMS service slug/title → Sanity service slug enum.
 *
 * Used both for:
 * - post.relatedService (string enum on the post schema)
 * - servicePage.slug.current and serviceType (when migrating service pages)
 *
 * Source: src/sanity/schemaTypes/documents/{post.ts,servicePage.ts}.
 */

export const SERVICE_MAP = {
  // BCMS slug          → Sanity slug enum value
  technical: "technical-seo",
  "technical-seo": "technical-seo",
  "on-page": "on-page-seo",
  "on-page-seo": "on-page-seo",
  local: "local-seo",
  "local-seo": "local-seo",
  "e-commerce": "ecommerce-seo",
  ecommerce: "ecommerce-seo",
  "ecommerce-seo": "ecommerce-seo",
  "keyword-research": "keyword-strategy",
  "keyword-strategy": "keyword-strategy",
  "content-creation": "content-creation",
  linkbuilding: "link-building",
  "link-building": "link-building",
  managed: "managed",
};

/**
 * Map BCMS service entry pointer to Sanity service slug.
 */
export function resolveServiceSlug(bcmsServiceRef) {
  if (!bcmsServiceRef) return null;
  const slug = bcmsServiceRef.meta?.en?.slug ?? bcmsServiceRef.slug ?? null;
  if (slug && SERVICE_MAP[slug]) return SERVICE_MAP[slug];
  return null;
}
