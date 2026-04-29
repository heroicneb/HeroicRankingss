/**
 * BCMS blog-category slug/title → Sanity post.categories enum value.
 *
 * Sanity enum is fixed in src/sanity/schemaTypes/documents/post.ts. Per
 * Codex: abort on unmapped category — do not coerce to a default.
 */

export const CATEGORY_MAP = {
  // BCMS slug    → Sanity enum value
  seo: "seo",
  marketing: "marketing",
  "case-study": "case-study",
  "industry-news": "industry-news",
  "technical-seo": "technical-seo",
  technical: "technical-seo", // legacy slug
  "on-page-seo": "on-page-seo",
  "on-page": "on-page-seo", // legacy slug
  "local-seo": "local-seo",
  local: "local-seo", // legacy slug
  "ecommerce-seo": "ecommerce-seo",
  "e-commerce": "ecommerce-seo", // legacy slug
  "keyword-research": "keyword-research",
  "content-creation": "content-creation",
  "link-building": "link-building",
  linkbuilding: "link-building", // legacy slug
  managed: "managed",
};

/**
 * Resolve a BCMS category pointer to the Sanity enum value, or `null`
 * if no mapping exists (caller should treat that as a fatal preflight error).
 */
export function resolveCategory(bcmsCategoryRef) {
  if (!bcmsCategoryRef) return null;
  const slug = bcmsCategoryRef.meta?.en?.slug ?? bcmsCategoryRef.slug ?? null;
  if (slug && CATEGORY_MAP[slug]) return CATEGORY_MAP[slug];
  const title = (bcmsCategoryRef.meta?.en?.title ?? bcmsCategoryRef.title ?? "")
    .toLowerCase()
    .trim();
  if (title && CATEGORY_MAP[title]) return CATEGORY_MAP[title];
  return null;
}
