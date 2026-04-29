/**
 * BCMS blog → Sanity post.
 *
 * Per Codex field map:
 *   title → title
 *   slug → slug.current
 *   seo → seo.{metaTitle, metaDescription, ogImage}
 *   cover_image → mainImage
 *   date → publishedAt (ISO datetime)
 *   read_time → readTime (now in schema)
 *   description → excerpt
 *   author (entry pointer) → author (Sanity reference, resolved via context)
 *   category (entry pointer) → categories[] (single-element enum)
 *   related_service (entry pointer) → relatedService (string enum)
 *   content.en (full body) → body (PortableText via body-converter)
 *
 * Author/service references rely on the orchestrator pre-running team-member
 * and service mappers and seeding ctx.{teamMemberByBcmsId, serviceByBcmsId}.
 */

import { deriveSanityId } from "../config/bcms-to-sanity-id-map.mjs";
import { legacyUrlFor } from "../config/url-map.mjs";
import { resolveCategory } from "../config/category-map.mjs";
import { resolveServiceSlug } from "../config/service-map.mjs";
import { convertBody } from "../lib/body-converter.mjs";

const SANITY_TYPE = "post";
const TEMPLATE = "blog";

const OWNED_PATHS = [
  "title",
  "slug",
  "excerpt",
  "mainImage",
  "publishedAt",
  "categories",
  "readTime",
  "relatedService",
  "body",
  "author",
  "seo",
  "migrationSource",
];

export async function map(bcmsEntry, ctx) {
  const { assetRegistry, logger } = ctx;
  if (!bcmsEntry?._id) {
    throw new Error("post mapper: bcmsEntry._id required");
  }
  const meta = bcmsEntry.meta?.en ?? {};
  const bcmsId = bcmsEntry._id;
  const sanityId = deriveSanityId(SANITY_TYPE, bcmsId);

  const slug = meta.slug ?? null;
  if (!slug) throw new Error(`post ${bcmsId}: missing slug`);

  const assetIds = [];
  const unmappedFields = [];

  // mainImage
  let mainImage;
  if (meta.cover_image?._id) {
    assetIds.push(meta.cover_image._id);
    mainImage = await assetRegistry.imageFieldFor(
      meta.cover_image,
      meta.cover_image.alt_text || meta.title || "",
    );
  }

  // publishedAt
  let publishedAt;
  if (meta.date?.timestamp) {
    publishedAt = new Date(meta.date.timestamp).toISOString();
  }

  // category — abort on unmapped per Codex
  const categorySlug = meta.category ? resolveCategory(meta.category) : null;
  if (meta.category && !categorySlug) {
    throw new Error(
      `post ${bcmsId} (${slug}): unmapped category "${meta.category?.meta?.en?.slug ?? "?"}". Add to scripts/migrate/config/category-map.mjs.`,
    );
  }
  const categories = categorySlug ? [categorySlug] : [];

  // relatedService — best-effort
  const relatedService = meta.related_service
    ? resolveServiceSlug(meta.related_service)
    : null;

  // author — resolve via context lookup table, fall back to ref by id
  let authorRef = null;
  if (meta.author?._id) {
    const authorBcmsId = meta.author._id;
    const authorSanityId =
      ctx.teamMemberByBcmsId?.[authorBcmsId] ??
      deriveSanityId("teamMember", authorBcmsId);
    authorRef = { _type: "reference", _ref: authorSanityId };
  }

  // body — convert content.en[] via body-converter (ASYNC, can throw)
  const contentEn = bcmsEntry.content?.en;
  let body = [];
  if (Array.isArray(contentEn) && contentEn.length > 0) {
    body = await convertBody(contentEn, {
      assetRegistry,
      entryId: bcmsId,
      entrySlug: `blog/${slug}`,
      logger,
    });
  } else if (
    typeof contentEn === "object" &&
    Array.isArray(contentEn?.nodes)
  ) {
    body = await convertBody(contentEn, {
      assetRegistry,
      entryId: bcmsId,
      entrySlug: `blog/${slug}`,
      logger,
    });
  }

  // SEO
  const seo = await mapSeo(meta.seo, assetRegistry, assetIds);

  // Validate excerpt length (schema max 200)
  let excerpt = typeof meta.description === "string" ? meta.description : "";
  if (excerpt.length > 200) {
    excerpt = excerpt.slice(0, 197).trimEnd() + "…";
  }

  const sanityDoc = {
    _id: sanityId,
    _type: SANITY_TYPE,
    title: meta.title ?? "",
    slug: { _type: "slug", current: slug },
    excerpt,
    categories,
    body,
  };
  if (mainImage) sanityDoc.mainImage = mainImage;
  if (publishedAt) sanityDoc.publishedAt = publishedAt;
  if (typeof meta.read_time === "string" && meta.read_time) {
    sanityDoc.readTime = meta.read_time;
  } else if (typeof meta.read_time === "number") {
    sanityDoc.readTime = `${meta.read_time} min`;
  }
  if (relatedService) sanityDoc.relatedService = relatedService;
  if (authorRef) sanityDoc.author = authorRef;
  if (seo) sanityDoc.seo = seo;

  return {
    sanityDoc,
    ownedPaths: OWNED_PATHS,
    assetIds,
    unmappedFields,
    legacyUrl: legacyUrlFor(TEMPLATE, slug),
    template: TEMPLATE,
  };
}

async function mapSeo(seoSrc, assetRegistry, assetIds) {
  if (!seoSrc || typeof seoSrc !== "object") return null;
  const out = { _type: "seo" };
  if (seoSrc.title) out.metaTitle = String(seoSrc.title);
  if (seoSrc.description) out.metaDescription = String(seoSrc.description);
  if (seoSrc.image?._id) {
    assetIds.push(seoSrc.image._id);
    out.ogImage = await assetRegistry.imageFieldFor(
      seoSrc.image,
      seoSrc.image.alt_text || "",
    );
  }
  return Object.keys(out).length === 1 ? null : out;
}

export const META = {
  template: TEMPLATE,
  sanityType: SANITY_TYPE,
  ownedPaths: OWNED_PATHS,
};
