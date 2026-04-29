/**
 * BCMS service → Sanity servicePage.
 *
 * BCMS structure (from parity report):
 *   meta.en = {
 *     title, slug, seo, cover_image, description,
 *     hero_title, hero_subtitle, hero_description, hero_cta_description, hero_cta,
 *     cards_slide_title, cards_slide_subtitle, cards_slide[],
 *     cta_block, results_title, results_subtitle, results_cards[],
 *     case_studies_title, case_studies_subtitle, case_studies_cards[],
 *     faq, contact_block, root_seo_page,
 *   }
 *
 * Sanity servicePage fields:
 *   serviceType, slug, heroTitle, heroDescription, heroCtaLabel, heroCtaUrl,
 *   heroImage, solutionSectionLabel, solutionSectionHeading, serviceCards[],
 *   processSteps[], whyChooseItems[], faqItems[] (refs), relatedCaseStudies[]
 *   (refs — patched in second pass), seo.
 *
 * NOTE: relatedCaseStudies is INTENTIONALLY left out of the first pass.
 * The orchestrator runs a second pass after caseStudies are migrated to
 * patch in the references.
 */

import { deriveSanityId } from "../config/bcms-to-sanity-id-map.mjs";
import { legacyUrlFor } from "../config/url-map.mjs";
import { resolveServiceSlug, SERVICE_MAP } from "../config/service-map.mjs";
import { richTextToPlainText } from "../lib/body-converter.mjs";

const SANITY_TYPE = "servicePage";
const TEMPLATE = "service";

const OWNED_PATHS = [
  "serviceType",
  "slug",
  "heroTitle",
  "heroDescription",
  "heroCtaLabel",
  "heroCtaUrl",
  "heroImage",
  "solutionSectionLabel",
  "solutionSectionHeading",
  "serviceCards",
  "whyChooseItems",
  // relatedCaseStudies is owned but written in a second pass — list it
  // here so its checksum tracks editor edits across both passes.
  "relatedCaseStudies",
  "seo",
  "migrationSource",
];

export async function map(bcmsEntry, ctx) {
  const { assetRegistry } = ctx;
  if (!bcmsEntry?._id) {
    throw new Error("service mapper: bcmsEntry._id required");
  }
  const meta = bcmsEntry.meta?.en ?? {};
  const bcmsId = bcmsEntry._id;
  const sanityId = deriveSanityId(SANITY_TYPE, bcmsId);

  const slug = meta.slug ?? null;
  if (!slug) throw new Error(`service ${bcmsId}: missing slug`);

  // serviceType is the Sanity enum slug. Use service-map to translate the
  // BCMS slug into the canonical enum.
  const serviceType = SERVICE_MAP[slug] ?? null;
  if (!serviceType) {
    throw new Error(
      `service ${bcmsId}: BCMS slug "${slug}" has no entry in SERVICE_MAP. Add it to scripts/migrate/config/service-map.mjs.`,
    );
  }

  const assetIds = [];
  const unmappedFields = [];

  // Hero
  const heroTitle = pickStr(meta, "hero_title") || meta.title || "";
  const heroDescription = richTextToPlainText(meta.hero_description);
  const heroCtaLabel = meta.hero_cta?.label ?? "Get a Free Audit";
  const heroCtaUrl = meta.hero_cta?.href ?? "/contact";
  let heroImage;
  if (meta.cover_image?._id) {
    assetIds.push(meta.cover_image._id);
    heroImage = await assetRegistry.imageFieldFor(
      meta.cover_image,
      meta.cover_image.alt_text || meta.title || "",
    );
  }

  const solutionSectionLabel = pickStr(meta, "cards_slide_subtitle")
    ? `/  ${pickStr(meta, "cards_slide_subtitle")}  /`
    : "/  Solutions  /";
  const solutionSectionHeading = pickStr(meta, "cards_slide_title");

  // Service cards
  const serviceCards = [];
  if (Array.isArray(meta.cards_slide)) {
    for (let i = 0; i < meta.cards_slide.length; i++) {
      const c = meta.cards_slide[i] ?? {};
      const card = {
        _key: `${bcmsId}-card-${i}`,
        _type: "serviceCard",
        title: pickStr(c, "title"),
      };
      if (c.subtitle) card.subtitle = String(c.subtitle);
      const body = richTextToPlainText(c.description);
      if (body) card.body = body;
      if (c.media?._id) {
        assetIds.push(c.media._id);
        card.icon = await assetRegistry.imageFieldFor(
          c.media,
          c.media.alt_text || card.title || "",
        );
      }
      serviceCards.push(card);
    }
  }

  // Why-choose items map to BCMS results_cards (the schema's whyChooseItems)
  const whyChooseItems = [];
  if (Array.isArray(meta.results_cards)) {
    for (let i = 0; i < meta.results_cards.length; i++) {
      const r = meta.results_cards[i] ?? {};
      const item = {
        _key: `${bcmsId}-why-${i}`,
        _type: "whyChooseItem",
        title: pickStr(r, "title"),
      };
      const desc = richTextToPlainText(r.description);
      if (desc) item.description = desc;
      if (r.media?._id) {
        assetIds.push(r.media._id);
        item.icon = await assetRegistry.imageFieldFor(
          r.media,
          r.media.alt_text || item.title || "",
        );
      }
      whyChooseItems.push(item);
    }
  }

  // FAQ items → schema expects references to faqItem documents which we
  // are NOT migrating in the first pass. Preserve the FAQ data in
  // unmappedFields for now; orchestrator can decide to expand later.
  if (meta.faq?.items?.length) unmappedFields.push("faq");
  if (meta.cta_block) unmappedFields.push("cta_block");
  if (meta.contact_block) unmappedFields.push("contact_block");
  if (meta.root_seo_page !== undefined) unmappedFields.push("root_seo_page");
  if (meta.case_studies_title) unmappedFields.push("case_studies_title");
  if (meta.case_studies_subtitle) unmappedFields.push("case_studies_subtitle");

  const seo = await mapSeo(meta.seo, assetRegistry, assetIds);

  const sanityDoc = {
    _id: sanityId,
    _type: SANITY_TYPE,
    serviceType,
    slug: { _type: "slug", current: serviceType },
    heroTitle,
    heroDescription,
    heroCtaLabel,
    heroCtaUrl,
    solutionSectionLabel,
    solutionSectionHeading,
    serviceCards,
    whyChooseItems,
  };
  if (heroImage) sanityDoc.heroImage = heroImage;
  if (seo) sanityDoc.seo = seo;

  return {
    sanityDoc,
    ownedPaths: OWNED_PATHS,
    assetIds,
    unmappedFields,
    legacyUrl: legacyUrlFor(TEMPLATE, slug),
    template: TEMPLATE,
    /** Surface BCMS case_studies_cards so the orchestrator can patch
     *  relatedCaseStudies in pass 2. Each entry has `_id` of the BCMS
     *  case-study which we can resolve to the Sanity migrate-* id. */
    relatedCaseStudyBcmsIds: Array.isArray(meta.case_studies_cards)
      ? meta.case_studies_cards
          .map((c) => c?._id)
          .filter((id) => typeof id === "string" && id.length > 0)
      : [],
  };
}

function pickStr(obj, key) {
  const v = obj?.[key];
  return typeof v === "string" ? v : "";
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

/**
 * Resolve a BCMS service entry pointer (used by post.relatedService) to the
 * canonical Sanity service slug. Lives here so all service-related
 * resolution logic stays in one module.
 */
export function relatedServiceSlugFor(bcmsServiceRef) {
  return resolveServiceSlug(bcmsServiceRef);
}

export const META = {
  template: TEMPLATE,
  sanityType: SANITY_TYPE,
  ownedPaths: OWNED_PATHS,
};
