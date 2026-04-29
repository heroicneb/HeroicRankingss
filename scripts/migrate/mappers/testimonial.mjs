/**
 * BCMS testimonial → Sanity testimonial.
 *
 * BCMS testimonial template props (from spike): typically `quote`,
 * `author_name`, `author_title`, `company`, `avatar`, `company_logo`,
 * `rating`, `featured`, `order`. We tolerate variations in field naming.
 *
 * Sanity schema: src/sanity/schemaTypes/documents/testimonial.ts.
 */

import { deriveSanityId } from "../config/bcms-to-sanity-id-map.mjs";
import { legacyUrlFor } from "../config/url-map.mjs";
import { richTextToPlainText } from "../lib/body-converter.mjs";

const SANITY_TYPE = "testimonial";
const TEMPLATE = "testimonial";

const OWNED_PATHS = [
  "quote",
  "authorName",
  "authorTitle",
  "company",
  "avatar",
  "companyLogo",
  "rating",
  "featured",
  "order",
  "migrationSource",
];

export async function map(bcmsEntry, ctx) {
  const { assetRegistry } = ctx;
  if (!bcmsEntry?._id) {
    throw new Error("testimonial mapper: bcmsEntry._id required");
  }
  const meta = bcmsEntry.meta?.en ?? {};
  const bcmsId = bcmsEntry._id;
  const sanityId = deriveSanityId(SANITY_TYPE, bcmsId);

  const assetIds = [];
  const unmappedFields = [];

  const quote = pickQuote(meta);
  const authorName = pickFirst(meta, ["author_name", "authorName", "name", "title"]);
  const authorTitle = pickFirst(meta, ["author_title", "authorTitle", "role", "position"]);
  const company = pickFirst(meta, ["company", "company_name", "organization"]);

  let avatar;
  const avatarSrc = pickMedia(meta, ["avatar", "photo", "image"]);
  if (avatarSrc?._id) {
    assetIds.push(avatarSrc._id);
    avatar = await assetRegistry.imageFieldFor(
      avatarSrc,
      avatarSrc.alt_text || authorName || "",
    );
  }
  let companyLogo;
  const logoSrc = pickMedia(meta, ["company_logo", "companyLogo", "logo"]);
  if (logoSrc?._id) {
    assetIds.push(logoSrc._id);
    companyLogo = await assetRegistry.imageFieldFor(
      logoSrc,
      logoSrc.alt_text || (company ? `${company} logo` : ""),
    );
  }

  const rating = toIntOrNull(meta.rating);
  const featured = meta.featured === true;
  const order = toIntOrNull(meta.order);

  for (const k of ["read_time", "slug", "seo"]) {
    if (meta[k] !== undefined && meta[k] !== null && meta[k] !== "") {
      unmappedFields.push(k);
    }
  }

  const sanityDoc = {
    _id: sanityId,
    _type: SANITY_TYPE,
    quote: quote ?? "",
    authorName: authorName ?? "",
  };
  if (authorTitle) sanityDoc.authorTitle = authorTitle;
  if (company) sanityDoc.company = company;
  if (avatar) sanityDoc.avatar = avatar;
  if (companyLogo) sanityDoc.companyLogo = companyLogo;
  if (rating !== null) sanityDoc.rating = rating;
  if (featured) sanityDoc.featured = featured;
  if (order !== null) sanityDoc.order = order;

  return {
    sanityDoc,
    ownedPaths: OWNED_PATHS,
    assetIds,
    unmappedFields,
    legacyUrl: legacyUrlFor(TEMPLATE, meta.slug ?? null),
    template: TEMPLATE,
  };
}

function pickQuote(meta) {
  if (typeof meta.quote === "string") return meta.quote.trim();
  if (meta.quote && typeof meta.quote === "object") {
    return richTextToPlainText(meta.quote);
  }
  if (typeof meta.body === "string") return meta.body.trim();
  if (meta.body && typeof meta.body === "object") {
    return richTextToPlainText(meta.body);
  }
  return "";
}

function pickFirst(meta, keys) {
  for (const k of keys) {
    const v = meta?.[k];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return "";
}

function pickMedia(meta, keys) {
  for (const k of keys) {
    const v = meta?.[k];
    if (v && typeof v === "object" && v._id) return v;
  }
  return null;
}

function toIntOrNull(v) {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? Math.round(n) : null;
}

export const META = {
  template: TEMPLATE,
  sanityType: SANITY_TYPE,
  ownedPaths: OWNED_PATHS,
};
