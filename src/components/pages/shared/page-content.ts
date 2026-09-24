/*
 * Shared building blocks for the fixed-section page content models
 * (partnership, link building, reddit marketing, …).
 *
 * Kept free of React/Next imports so the seed scripts can import the page
 * content modules under plain Node.
 */

export interface HeadingSegment {
  text?: string;
  /** Render this segment in the brand gradient. */
  highlight?: boolean;
  /** Line break (segment carries no text). */
  break?: boolean;
}

export interface ContentImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface RichSpan {
  _type: "span";
  _key: string;
  text: string;
  marks: string[];
}

export interface RichBlock {
  _type: "block";
  _key: string;
  style: "normal";
  markDefs: Array<{ _key: string; _type: "link"; href: string }>;
  children: RichSpan[];
}

export interface FaqEntry {
  question: string;
  answer: string;
}

let keyCounter = 0;
const nextKey = (prefix: string) => `${prefix}-${(keyCounter += 1)}`;

type SpanInput = string | { text: string; bold?: boolean; italic?: boolean };

/** One paragraph block with optional bold/italic spans. */
export function paragraph(...spans: SpanInput[]): RichBlock {
  return {
    _type: "block",
    _key: nextKey("p"),
    style: "normal",
    markDefs: [],
    children: spans.map((s) => {
      const span = typeof s === "string" ? { text: s } : s;
      const marks: string[] = [];
      if (span.bold) marks.push("strong");
      if (span.italic) marks.push("em");
      return { _type: "span", _key: nextKey("s"), text: span.text, marks };
    }),
  };
}

/** Gradient-highlighted heading segment. */
export const hl = (text: string): HeadingSegment => ({ text, highlight: true });
/** Plain heading segment. */
export const tx = (text: string): HeadingSegment => ({ text });
/** Line break inside a heading. */
export const br: HeadingSegment = { break: true };

/** Image under /public with known dimensions. */
export const img = (src: string, width: number, height: number, alt = ""): ContentImage => ({
  src,
  alt,
  width,
  height,
});
