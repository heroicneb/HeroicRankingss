/**
 * BCMS company → Sanity partnerLogo.
 *
 * BCMS company template props (from spike): title, slug, logo, link,
 * featured, partner. Maps to Sanity `partnerLogo` schema (extended with
 * featured + partner boolean flags 2026-04-29 to support BCMS source data).
 *
 * Featured logos render in the homepage hero strip (PARTNER_LOGOS_QUERY).
 * Partner logos render on /partnership (PARTNERSHIP_LOGOS_QUERY).
 */

import { deriveSanityId } from "../config/bcms-to-sanity-id-map.mjs";

const SANITY_TYPE = "partnerLogo";
const TEMPLATE = "company";

const OWNED_PATHS = [
  "name",
  "logo",
  "url",
  "featured",
  "partner",
  "order",
  "migrationSource",
];

export async function map(bcmsEntry, ctx) {
  const { assetRegistry } = ctx;
  if (!bcmsEntry?._id) {
    throw new Error("company mapper: bcmsEntry._id required");
  }
  const meta = bcmsEntry.meta?.en ?? {};
  const bcmsId = bcmsEntry._id;
  const sanityId = deriveSanityId(SANITY_TYPE, bcmsId);

  const assetIds = [];
  const unmappedFields = [];

  const name = (typeof meta.title === "string" ? meta.title.trim() : "") || "Untitled partner";

  // Logo (required by Sanity schema)
  let logo;
  const logoSrc = pickMedia(meta, ["logo", "image"]);
  if (logoSrc?._id) {
    assetIds.push(logoSrc._id);
    logo = await assetRegistry.imageFieldFor(
      logoSrc,
      logoSrc.alt_text || `${name} logo`,
    );
  }
  if (!logo) {
    // Skip without breaking — Sanity validation requires logo, but mapper
    // should report rather than fail the whole batch.
    unmappedFields.push("logo:missing-in-bcms");
  }

  const url = pickString(meta, ["link", "url", "website"]);
  const featured = meta.featured === true;
  const partner = meta.partner === true;
  const order = toIntOrNull(meta.order);

  for (const k of ["slug", "seo"]) {
    if (meta[k] !== undefined && meta[k] !== null && meta[k] !== "") {
      unmappedFields.push(k);
    }
  }

  const sanityDoc = {
    _id: sanityId,
    _type: SANITY_TYPE,
    name,
  };
  if (logo) sanityDoc.logo = logo;
  if (url) sanityDoc.url = url;
  if (featured) sanityDoc.featured = featured;
  if (partner) sanityDoc.partner = partner;
  if (order !== null) sanityDoc.order = order;

  return {
    sanityDoc,
    ownedPaths: OWNED_PATHS,
    assetIds,
    unmappedFields,
    legacyUrl: null, // company entries have no public detail URL on the legacy site
    template: TEMPLATE,
  };
}

function pickString(meta, keys) {
  for (const k of keys) {
    const v = meta?.[k];
    if (typeof v === "string" && v.trim()) return v.trim();
    if (v && typeof v === "object") {
      // BCMS link prop sometimes wraps in { label, href } or { url }
      if (typeof v.href === "string" && v.href.trim()) return v.href.trim();
      if (typeof v.url === "string" && v.url.trim()) return v.url.trim();
    }
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
