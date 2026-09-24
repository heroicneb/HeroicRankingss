/*
 * Seeds the "Partnership Page" document in Sanity from the built-in default
 * content, uploading every local image/icon so the CMS is self-contained.
 *
 * Usage (needs SANITY_API_WRITE_TOKEN in .env.local):
 *   node --env-file=.env.local --experimental-strip-types scripts/seed/partnership-page.ts
 *
 * Safe to re-run: it replaces the single `partnershipPage` document.
 */

import { readFileSync } from "node:fs";
import path from "node:path";

import { createClient } from "next-sanity";

import {
  DEFAULT_PARTNERSHIP_CONTENT,
  type ContentImage,
  type HeadingSegment,
  type RichBlock,
} from "../../src/components/pages/partnership/partnership-content.ts";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_WRITE_TOKEN;
if (!projectId || !token) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN in the environment.");
  process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion: "2026-02-19", token, useCdn: false });

let counter = 0;
const key = (prefix: string) => `${prefix}-${(counter += 1)}`;

const assetCache = new Map<string, string>();
async function uploadImage(image: ContentImage | null) {
  if (!image) return undefined;
  if (!assetCache.has(image.src)) {
    const file = path.join(process.cwd(), "public", image.src);
    const asset = await client.assets.upload("image", readFileSync(file), { filename: path.basename(file) });
    assetCache.set(image.src, asset._id);
    console.log(`uploaded ${image.src} → ${asset._id}`);
  }
  return {
    _type: "image",
    asset: { _type: "reference", _ref: assetCache.get(image.src) },
    alt: image.alt,
  };
}

/** Heading segments → gradientHeading blocks (one block per line). */
function headingBlocks(segments: HeadingSegment[]) {
  let current: HeadingSegment[] = [];
  const lines: HeadingSegment[][] = [current];
  for (const segment of segments) {
    if (segment.break) {
      current = [];
      lines.push(current);
    } else {
      current.push(segment);
    }
  }
  return lines.map((line) => ({
    _type: "block",
    _key: key("h"),
    style: "normal",
    markDefs: [],
    children: line.map((segment) => ({
      _type: "span",
      _key: key("s"),
      text: segment.text ?? "",
      marks: segment.highlight ? ["highlight"] : [],
    })),
  }));
}

const withKeys = (blocks: RichBlock[]) =>
  blocks.map((block) => ({
    ...block,
    _key: key("b"),
    children: block.children.map((child) => ({ ...child, _key: key("c") })),
  }));

async function main() {
  const c = DEFAULT_PARTNERSHIP_CONTENT;

  const recognizeItems = [];
  for (const item of c.recognize.items) {
    recognizeItems.push({ _type: "audienceItem", _key: key("ri"), title: item.title, description: item.description, icon: await uploadImage(item.icon) });
  }
  const amplifyCards = [];
  for (const card of c.amplify.cards) {
    amplifyCards.push({
      _type: "amplifyCard",
      _key: key("ac"),
      title: card.title,
      subtitle: card.subtitle,
      paragraphs: card.paragraphs,
      icon: await uploadImage(card.icon),
      ctaLabel: card.ctaLabel ?? undefined,
      ctaUrl: card.ctaUrl ?? undefined,
    });
  }
  const logos = [];
  for (const cell of c.scale.logos) {
    logos.push({ _type: "logoCell", _key: key("lg"), keepColor: cell.keepColor, image: await uploadImage(cell.image) });
  }
  const differentiators = [];
  for (const item of c.differentiators.items) {
    differentiators.push({ _type: "differentiator", _key: key("df"), title: item.title, description: withKeys(item.description), icon: await uploadImage(item.icon) });
  }
  const nextSteps = [];
  for (const item of c.nextSteps.items) {
    nextSteps.push({ _type: "nextStep", _key: key("ns"), title: item.title, description: item.description, icon: await uploadImage(item.icon) });
  }

  const doc = {
    _id: "partnershipPage",
    _type: "partnershipPage",
    hero: { heading: headingBlocks(c.hero.heading), intro: c.hero.intro, image: await uploadImage(c.hero.image) },
    recognize: { label: c.recognize.label, heading: headingBlocks(c.recognize.heading), items: recognizeItems },
    amplify: { label: c.amplify.label, heading: headingBlocks(c.amplify.heading), intro: c.amplify.intro, cards: amplifyCards },
    scale: { label: c.scale.label, heading: headingBlocks(c.scale.heading), paragraphs: withKeys(c.scale.paragraphs), logos },
    darkCta: { heading: headingBlocks(c.darkCta.heading), body: c.darkCta.body, ctaLabel: c.darkCta.ctaLabel, ctaUrl: c.darkCta.ctaUrl },
    differentiators: { label: c.differentiators.label, heading: headingBlocks(c.differentiators.heading), items: differentiators },
    nextSteps: { label: c.nextSteps.label, heading: headingBlocks(c.nextSteps.heading), paragraphs: c.nextSteps.paragraphs, items: nextSteps },
    faq: { items: c.faq.items.map((item) => ({ _type: "faqEntry", _key: key("fq"), question: item.question, answer: item.answer })) },
    seo: {
      _type: "seo",
      metaTitle: "White Label SEO Partnership",
      metaDescription:
        "Build scalable agency growth with Heroic Rankings' white label SEO partnership model, from execution and reporting to long-term client retention.",
    },
  };

  await client.createOrReplace(doc);
  // WHY: a stale draft from the old model would otherwise shadow the new published document in the Studio.
  await client.delete("drafts.partnershipPage").catch(() => undefined);
  console.log("partnershipPage document replaced.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
