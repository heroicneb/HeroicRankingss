/**
 * BCMS person → Sanity teamMember.
 *
 * Per Codex field map:
 *   title → name
 *   slug → slug.current
 *   seo → seo.{metaTitle, metaDescription, ogImage}
 *   bio → bio
 *   role → role
 *   image → photo (re-host)
 *   description → bioParagraphs[] (paragraph-by-paragraph plain text)
 *   cards[] → cards[] (now supported in schema)
 *   linkedin → linkedin (legacy hidden field) AND socialLinks[platform=linkedin]
 *   team_member → showOnAboutPage
 *   featured → preserved in provenance only (no schema field)
 *
 * Returns { sanityDoc, ownedPaths, assetIds, unmappedFields }.
 */

import { deriveSanityId } from "../config/bcms-to-sanity-id-map.mjs";
import { richTextToPlainText } from "../lib/body-converter.mjs";
import { legacyUrlFor } from "../config/url-map.mjs";

const SANITY_TYPE = "teamMember";
const TEMPLATE = "person";

/** Top-level Sanity fields the migration owns on this document type. */
const OWNED_PATHS = [
  "name",
  "slug",
  "role",
  "photo",
  "bio",
  "bioParagraphs",
  "socialLinks",
  "linkedin",
  "showOnAboutPage",
  "cards",
  "seo",
  "migrationSource",
];

export async function map(bcmsEntry, ctx) {
  const { assetRegistry } = ctx;
  if (!bcmsEntry?._id) {
    throw new Error("team-member mapper: bcmsEntry._id required");
  }
  const meta = bcmsEntry.meta?.en ?? {};
  const bcmsId = bcmsEntry._id;
  const sanityId = deriveSanityId(SANITY_TYPE, bcmsId);

  const slug = meta.slug ?? null;
  if (!slug) {
    throw new Error(`team-member ${bcmsId}: missing slug`);
  }

  const assetIds = [];
  const unmappedFields = [];

  // Photo
  let photo;
  if (meta.image?._id) {
    assetIds.push(meta.image._id);
    photo = await assetRegistry.imageFieldFor(meta.image, meta.image.alt_text || meta.title || "");
  }

  // bioParagraphs from `description` rich-text — split top-level paragraphs
  const bioParagraphs = splitRichTextToParagraphs(meta.description);

  // Cards (gallery)
  const cards = [];
  if (Array.isArray(meta.cards)) {
    for (let i = 0; i < meta.cards.length; i++) {
      const card = meta.cards[i] ?? {};
      const entry = {
        _key: `${bcmsId}-cards-${i}`,
        title: typeof card.title === "string" ? card.title.trim() : "",
      };
      if (card.subtitle) entry.subtitle = String(card.subtitle);
      const desc = richTextToPlainText(card.description);
      if (desc) entry.description = desc;
      if (card.media?._id) {
        assetIds.push(card.media._id);
        entry.image = await assetRegistry.imageFieldFor(
          card.media,
          card.media.alt_text || entry.title || meta.title || "",
        );
      }
      cards.push(entry);
    }
  }

  // Social links — populate both the legacy `linkedin` URL field and the
  // canonical `socialLinks` array.
  const socialLinks = [];
  if (meta.linkedin && typeof meta.linkedin === "string") {
    socialLinks.push({
      _key: `${bcmsId}-sl-linkedin`,
      _type: "socialLink",
      platform: "linkedin",
      url: meta.linkedin,
    });
  }

  // SEO
  const seo = mapSeo(meta.seo, assetRegistry, assetIds, ctx);

  // featured has no schema field — record in provenance.
  if (meta.featured) unmappedFields.push("featured");
  if (meta.read_time !== undefined && meta.read_time !== null) {
    unmappedFields.push("read_time");
  }

  const sanityDoc = {
    _id: sanityId,
    _type: SANITY_TYPE,
    name: meta.title ?? "",
    slug: { _type: "slug", current: slug },
    role: meta.role ?? "",
    bio: meta.bio ?? "",
    bioParagraphs,
    socialLinks,
    showOnAboutPage: meta.team_member === true,
    cards,
  };
  if (photo) sanityDoc.photo = photo;
  if (meta.linkedin) sanityDoc.linkedin = meta.linkedin;
  if (seo) sanityDoc.seo = await seo;

  return {
    sanityDoc,
    ownedPaths: OWNED_PATHS,
    assetIds,
    unmappedFields,
    legacyUrl: legacyUrlFor(TEMPLATE, slug),
    template: TEMPLATE,
  };
}

/**
 * Split a BCMS rich-text description into a flat list of plain-text
 * paragraphs (one per top-level `paragraph`/`bulletList`/`orderedList` node).
 * Lists are joined with bullet prefixes.
 */
function splitRichTextToParagraphs(richText) {
  if (!richText) return [];
  const nodes = Array.isArray(richText)
    ? richText
    : Array.isArray(richText.nodes)
      ? richText.nodes
      : [];
  const paragraphs = [];
  for (const node of nodes) {
    if (!node || typeof node !== "object") continue;
    const text = richTextToPlainText({ nodes: [node] });
    if (text) paragraphs.push(text);
  }
  return paragraphs;
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
