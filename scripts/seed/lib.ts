/*
 * Shared helpers for the page seed scripts.
 * Run any seed with:
 *   node --env-file=.env.local --experimental-strip-types scripts/seed/<page>.ts
 */

import { readFileSync } from "node:fs";
import path from "node:path";

import { createClient } from "next-sanity";

import type { ContentImage, HeadingSegment, RichBlock } from "../../src/components/pages/shared/page-content.ts";

export function createSeedClient() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!projectId || !token) {
    console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN in the environment.");
    process.exit(1);
  }
  return createClient({ projectId, dataset, apiVersion: "2026-02-19", token, useCdn: false });
}

type SeedClient = ReturnType<typeof createSeedClient>;

let counter = 0;
export const key = (prefix: string) => `${prefix}-${(counter += 1)}`;

const assetCache = new Map<string, string>();

/** Uploads a /public image once and returns a Sanity image value. */
export async function uploadImage(client: SeedClient, image: ContentImage | null) {
  if (!image) return undefined;
  if (!assetCache.has(image.src)) {
    const file = path.join(process.cwd(), "public", image.src);
    const asset = await client.assets.upload("image", readFileSync(file), { filename: path.basename(file) });
    assetCache.set(image.src, asset._id);
    console.log(`uploaded ${image.src} → ${asset._id}`);
  }
  return { _type: "image", asset: { _type: "reference", _ref: assetCache.get(image.src) }, alt: image.alt };
}

/** Heading segments → gradientHeading blocks (one block per line). */
export function headingBlocks(segments: HeadingSegment[]) {
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

/** Re-key rich text blocks so every seed run produces unique keys. */
export const withKeys = (blocks: RichBlock[]) =>
  blocks.map((block) => ({
    ...block,
    _key: key("b"),
    children: block.children.map((child) => ({ ...child, _key: key("c") })),
  }));

export const faqEntries = (items: Array<{ question: string; answer: string }>) =>
  items.map((item) => ({ _type: "faqEntry", _key: key("fq"), question: item.question, answer: item.answer }));

/** Replace the singleton document and drop any stale draft that would shadow it. */
export async function replaceSingleton(client: SeedClient, doc: { _id: string; _type: string } & Record<string, unknown>) {
  await client.createOrReplace(doc);
  await client.delete(`drafts.${doc._id}`).catch(() => undefined);
  console.log(`${doc._id} document replaced.`);
}
