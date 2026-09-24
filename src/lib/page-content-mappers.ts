import type { PortableTextBlock } from "@portabletext/react";

import type { ContentImage, FaqEntry, HeadingSegment } from "@/components/pages/shared/page-content";

/*
 * Helpers that turn raw Sanity page documents into the normalised content
 * models. Every helper falls back to the built-in default when the CMS value
 * is missing, so a half-filled document never breaks a page.
 */

/** Raw image projection used by the fixed-section page documents (see PAGE_IMAGE in queries.ts). */
export interface SanityRawPageImage {
  alt?: string | null;
  asset?: {
    url?: string | null;
    metadata?: { dimensions?: { width?: number; height?: number } | null } | null;
  } | null;
}

/** gradientHeading blocks → heading segments (block boundaries become line breaks). */
export function headingSegments(
  blocks: PortableTextBlock[] | null | undefined,
  fallback: HeadingSegment[],
): HeadingSegment[] {
  if (!blocks?.length) return fallback;
  const segments: HeadingSegment[] = [];
  blocks.forEach((block, blockIndex) => {
    if (blockIndex > 0) segments.push({ break: true });
    const children = (block as { children?: Array<{ text?: string; marks?: string[] }> }).children ?? [];
    for (const child of children) {
      const lines = (child.text ?? "").split("\n");
      lines.forEach((line, lineIndex) => {
        if (lineIndex > 0) segments.push({ break: true });
        if (line) segments.push({ text: line, highlight: child.marks?.includes("highlight") ?? false });
      });
    }
  });
  return segments;
}

export function pageImage(
  raw: SanityRawPageImage | null | undefined,
  fallback: ContentImage | null,
): ContentImage | null {
  const url = raw?.asset?.url;
  if (!url) return fallback;
  return {
    src: url,
    alt: raw?.alt ?? fallback?.alt ?? "",
    width: raw?.asset?.metadata?.dimensions?.width ?? fallback?.width ?? 32,
    height: raw?.asset?.metadata?.dimensions?.height ?? fallback?.height ?? 32,
  };
}

export const text = (value: string | null | undefined, fallback: string) => (value?.trim() ? value : fallback);

export const optionalText = (value: string | null | undefined): string | null => (value?.trim() ? value : null);

/** Non-empty CMS list wins, otherwise the default list. */
export function listOr<TRaw, TOut>(
  raw: TRaw[] | null | undefined,
  fallback: TOut[],
  map: (item: TRaw, index: number) => TOut,
): TOut[] {
  return raw?.length ? raw.map(map) : fallback;
}

export function faqEntries(
  raw: Array<{ question?: string | null; answer?: string | null }> | null | undefined,
  fallback: FaqEntry[],
): FaqEntry[] {
  return listOr(raw, fallback, (item) => ({ question: item.question ?? "", answer: item.answer ?? "" }));
}
