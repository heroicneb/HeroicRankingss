/**
 * BCMS case-study → Sanity caseStudy.
 *
 * Per Codex field map (docs/migration/codex-migration-plan.md):
 *   title → title
 *   slug → slug.current
 *   seo → seo.{metaTitle, metaDescription, ogImage}
 *   read_time → preserved in provenance unmappedFields
 *   date → publishedAt (ISO datetime)
 *   service_featured_title → caseOverview.headingMain
 *   service_featured_description → caseOverview.body (plain text)
 *   hero_image → heroImage
 *   description → excerpt
 *   our_job → services[] (single-element when mappable; otherwise dropped+logged)
 *   website → website
 *   objective → objectiveChallenges.body (plain text)
 *   challenges[] → objectiveChallenges.items[] (number from index, body from rich text)
 *   strategy_items[] → strategyPillars[] (1..8 supported per relaxed schema)
 *   execution_description → preserved in unmappedFields (no field on schema)
 *   execution_cards[] → journeyTimeline.items[]
 *   results_description → proofData.body
 *   results_cards[] → proofData.items[] (image now optional in schema)
 *   results_cards_as_accordion → resultsCardsAsAccordion
 *   conclusion_description → conclusion.body (prepended)
 *   conclusion_content.{title,subtitle,description} → conclusion.{heading,gradientSubhead,body}
 *
 * Returns { sanityDoc, ownedPaths, assetIds, unmappedFields, legacyUrl, template }.
 */

import { deriveSanityId } from "../config/bcms-to-sanity-id-map.mjs";
import { legacyUrlFor } from "../config/url-map.mjs";
import { richTextToPlainText, convertBody } from "../lib/body-converter.mjs";

const SANITY_TYPE = "caseStudy";
const TEMPLATE = "case-study";

const OWNED_PATHS = [
  "title",
  "slug",
  "client",
  "excerpt",
  "heroImage",
  "publishedAt",
  "website",
  "services",
  "caseOverview",
  "objectiveChallenges",
  "strategyPillars",
  "journeyTimeline",
  "proofData",
  "resultsCardsAsAccordion",
  "conclusion",
  "seo",
  "migrationSource",
];

export async function map(bcmsEntry, ctx) {
  const { assetRegistry, logger } = ctx;
  if (!bcmsEntry?._id) {
    throw new Error("case-study mapper: bcmsEntry._id required");
  }
  const meta = bcmsEntry.meta?.en ?? {};
  const bcmsId = bcmsEntry._id;
  const sanityId = deriveSanityId(SANITY_TYPE, bcmsId);

  const slug = meta.slug ?? null;
  if (!slug) throw new Error(`case-study ${bcmsId}: missing slug`);

  const assetIds = [];
  const unmappedFields = [];

  // Hero image
  let heroImage;
  if (meta.hero_image?._id) {
    assetIds.push(meta.hero_image._id);
    heroImage = await assetRegistry.imageFieldFor(
      meta.hero_image,
      meta.hero_image.alt_text || meta.title || "",
    );
  }

  // publishedAt — BCMS date is { timestamp, timezoneOffset }
  let publishedAt;
  if (meta.date?.timestamp) {
    publishedAt = new Date(meta.date.timestamp).toISOString();
  }

  // services[]: best-effort enum match from `our_job`
  const services = [];
  if (typeof meta.our_job === "string" && meta.our_job.trim()) {
    const guess = guessServiceFromOurJob(meta.our_job);
    if (guess) services.push(guess);
    else unmappedFields.push("our_job");
  }

  // caseOverview
  const caseOverview = {
    label: "/ Case Overview /",
    headingMain: typeof meta.service_featured_title === "string"
      ? meta.service_featured_title
      : "",
    headingHighlighted: "",
    body: richTextToPlainText(meta.service_featured_description),
  };

  // objectiveChallenges (need exactly 3 items per schema)
  const challenges = Array.isArray(meta.challenges) ? meta.challenges : [];
  const challengeItems = challenges.slice(0, 3).map((c, i) => ({
    _key: `${bcmsId}-challenge-${i}`,
    number: String(i + 1).padStart(2, "0"),
    title: typeof c?.title === "string" ? c.title : "",
    body: richTextToPlainText(c?.description),
  }));
  // Pad to 3 if fewer (schema requires exactly 3) — fail loud instead.
  if (challenges.length !== 3 && challenges.length > 0) {
    logger?.warn?.(
      "case-study",
      bcmsId,
      `challenges count = ${challenges.length}; schema requires exactly 3. First 3 used; remainder dropped or pad with empty.`,
    );
  }
  if (challengeItems.length < 3) {
    while (challengeItems.length < 3) {
      const i = challengeItems.length;
      challengeItems.push({
        _key: `${bcmsId}-challenge-${i}`,
        number: String(i + 1).padStart(2, "0"),
        title: "",
        body: "",
      });
    }
  }
  const objectiveChallenges = {
    label: "/ Objective & Challenges /",
    headingMain: "",
    headingHighlighted: "",
    body: richTextToPlainText(meta.objective),
    items: challengeItems,
  };

  // strategyPillars (relaxed schema: 1..8). Each strategy_items entry is
  // a rich-text block. We collapse it into { title, intro, bullets } by
  // inspecting the leading paragraph as the title and remaining nodes as
  // intro/bullets.
  const strategyPillars = [];
  if (Array.isArray(meta.strategy_items)) {
    const items = meta.strategy_items.slice(0, 8); // schema max 8
    for (let i = 0; i < items.length; i++) {
      const pillar = strategyItemToPillar(items[i], `${bcmsId}-pillar-${i}`);
      strategyPillars.push(pillar);
    }
  }
  if (Array.isArray(meta.strategy_items) && meta.strategy_items.length > 8) {
    unmappedFields.push("strategy_items[8..]");
  }

  // journeyTimeline (4..6 milestones). Use execution_cards.
  const executionCards = Array.isArray(meta.execution_cards)
    ? meta.execution_cards
    : [];
  const journeyItems = executionCards.slice(0, 6).map((c, i) => ({
    _key: `${bcmsId}-journey-${i}`,
    title: typeof c?.title === "string" ? c.title : "",
    body: richTextToPlainText(c?.description),
  }));
  // Schema requires 4..6 — pad if fewer.
  while (journeyItems.length < 4) {
    const i = journeyItems.length;
    journeyItems.push({
      _key: `${bcmsId}-journey-${i}`,
      title: `Step ${i + 1}`,
      body: "",
    });
  }
  if (executionCards.length > 6) unmappedFields.push("execution_cards[6..]");
  if (typeof meta.execution_description === "string" && meta.execution_description) {
    unmappedFields.push("execution_description");
  }

  const journeyTimeline = {
    label: "/ Journey to Success /",
    headingMain: "",
    headingHighlighted: "",
    items: journeyItems,
  };

  // proofData (results)
  const resultsCards = Array.isArray(meta.results_cards) ? meta.results_cards : [];
  const proofItems = [];
  for (let i = 0; i < resultsCards.length && i < 8; i++) {
    const r = resultsCards[i] ?? {};
    const item = {
      _key: `${bcmsId}-proof-${i}`,
      title: typeof r.title === "string" ? r.title : "",
      body: richTextToPlainText(r.description),
    };
    if (r.media?._id) {
      assetIds.push(r.media._id);
      item.image = await assetRegistry.imageFieldFor(
        r.media,
        r.media.alt_text || item.title || "",
      );
    }
    proofItems.push(item);
  }
  const proofData = {
    label: "/ The Proof Is in the Data /",
    headingMain: "",
    headingHighlighted: "",
    body: typeof meta.results_description === "string"
      ? meta.results_description
      : richTextToPlainText(meta.results_description),
    items: proofItems,
  };

  const resultsCardsAsAccordion = meta.results_cards_as_accordion === true;

  // conclusion
  const conclusionContent = meta.conclusion_content ?? {};
  const conclusionDescriptionPlain = richTextToPlainText(meta.conclusion_description);
  const conclusionBody = await buildConclusionBody({
    bcmsId,
    conclusionDescriptionPlain,
    conclusionContent,
    ctx,
  });
  const conclusion = {
    heading: typeof conclusionContent.title === "string" ? conclusionContent.title : "",
    gradientSubhead: typeof conclusionContent.subtitle === "string"
      ? conclusionContent.subtitle
      : "",
    body: conclusionBody,
  };

  // website (now in schema)
  let website;
  if (meta.website && typeof meta.website === "object") {
    website = {
      label: typeof meta.website.label === "string" ? meta.website.label : "",
      href: typeof meta.website.href === "string" ? meta.website.href : "",
    };
  }

  // SEO
  const seo = await mapSeo(meta.seo, assetRegistry, assetIds);

  // Track unmappable fields explicitly.
  if (meta.read_time !== undefined && meta.read_time !== null && meta.read_time !== "") {
    unmappedFields.push("read_time");
  }

  // `client` is required in schema and has no BCMS source. Derive from
  // website.label (preferred) or title (fallback).
  const client =
    (website?.label && stripUrlScheme(website.label)) ||
    meta.title ||
    "";

  const sanityDoc = {
    _id: sanityId,
    _type: SANITY_TYPE,
    title: meta.title ?? "",
    slug: { _type: "slug", current: slug },
    client,
    excerpt: typeof meta.description === "string" ? meta.description : "",
    services,
    caseOverview,
    objectiveChallenges,
    strategyPillars,
    journeyTimeline,
    proofData,
    resultsCardsAsAccordion,
    conclusion,
  };
  if (heroImage) sanityDoc.heroImage = heroImage;
  if (publishedAt) sanityDoc.publishedAt = publishedAt;
  if (website) sanityDoc.website = website;
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

/**
 * Convert one BCMS strategy_items[] entry to a Sanity strategyPillar.
 * Heuristic:
 *   - If the entry has multiple paragraphs, the first paragraph (with any
 *     <strong> stripped) is the `title`. The next paragraph is the `intro`.
 *   - <ol>/<ul> nodes feed `bullets[]`.
 *   - If only one paragraph, it goes to `intro` and `title` is left as-is
 *     (Sanity schema requires title — fall back to "Pillar N" if empty).
 */
function strategyItemToPillar(item, baseKey) {
  const nodes = Array.isArray(item?.nodes) ? item.nodes : [];
  let title = "";
  let intro = "";
  const bullets = [];
  const paragraphs = [];

  for (const node of nodes) {
    if (!node || typeof node !== "object") continue;
    if (node.type === "paragraph") {
      const text = stripHtmlTags(node.value ?? "");
      if (text) paragraphs.push(text);
    } else if (node.type === "bulletList" || node.type === "orderedList") {
      const items = extractListItems(node.value ?? "");
      for (const li of items) bullets.push(li);
    }
  }

  if (paragraphs.length === 0) {
    return {
      _key: baseKey,
      title: "(untitled pillar)",
      intro: "",
      bullets,
    };
  }
  if (paragraphs.length === 1) {
    intro = paragraphs[0];
    title = paragraphs[0].slice(0, 80);
  } else {
    title = paragraphs[0].slice(0, 100);
    intro = paragraphs.slice(1).join("\n\n");
  }
  return {
    _key: baseKey,
    title: title.trim(),
    intro: intro.trim(),
    bullets,
  };
}

function extractListItems(html) {
  if (!html) return [];
  // Cheap extraction without jsdom dependency: match <li>...</li>
  const out = [];
  const re = /<li[^>]*>([\s\S]*?)<\/li>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const text = stripHtmlTags(m[1]).trim();
    if (text) out.push(text);
  }
  return out;
}

function stripHtmlTags(html) {
  return String(html ?? "")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function stripUrlScheme(label) {
  if (typeof label !== "string") return label;
  return label.replace(/^https?:\/\//i, "").replace(/\/$/, "");
}

function guessServiceFromOurJob(text) {
  const t = String(text).toLowerCase();
  if (t.includes("link")) return "link-building";
  if (t.includes("technical")) return "technical-seo";
  if (t.includes("on-page") || t.includes("on page")) return "on-page-seo";
  if (t.includes("content")) return "content-creation";
  if (t.includes("local")) return "local-seo";
  if (t.includes("ecom") || t.includes("e-com") || t.includes("commerce"))
    return "ecommerce-seo";
  if (t.includes("keyword")) return "keyword-strategy";
  return null;
}

async function buildConclusionBody({
  bcmsId,
  conclusionDescriptionPlain,
  conclusionContent,
  ctx,
}) {
  // Codex: prepend conclusion_description, then append conclusion_content.description.
  // conclusion.body is `portableText` so we need PT blocks. Convert each layer.
  const out = [];
  if (conclusionDescriptionPlain) {
    out.push(plainTextToBlock(`${bcmsId}-concl-pre`, conclusionDescriptionPlain));
  }
  if (conclusionContent?.description) {
    const blocks = await convertBody(conclusionContent.description, {
      ...ctx,
      entryId: `${bcmsId}-conclusion`,
      entrySlug: `case-study/${bcmsId}/conclusion`,
    });
    out.push(...blocks);
  }
  return out;
}

function plainTextToBlock(key, text) {
  return {
    _type: "block",
    _key: key,
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: `${key}-c0`,
        text,
        marks: [],
      },
    ],
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
