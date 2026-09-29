import type { PortableTextBlock } from "@portabletext/react";

export interface FaqPair {
  question: string;
  answer: string;
}

/**
 * Pulls the Q&A pairs out of a post body's FAQ section so the page can emit
 * FAQPage structured data for content that already exists.
 *
 * The section is an h2 that starts with "Frequently Asked Questions" (or is
 * just "FAQ"/"FAQs"), followed by h3/h4 questions, each answered by the
 * paragraphs and list items that follow it. It ends at the next h2, at any
 * non-text block (image, table, embed), or at the end of the body.
 */
const FAQ_HEADING = /^(frequently asked questions\b|faqs?\s*[:(]|faqs?$)/i;
const QUESTION_STYLES = new Set(["h3", "h4"]);
const NUMBERING = /^\s*(\d+[.)]|q\d*[.:)])\s*/i;

type Block = PortableTextBlock & { style?: string; listItem?: string; children?: Array<{ text?: string }> };

const isBlock = (node: unknown): node is Block => !!node && (node as { _type?: string })._type === "block";

const blockText = (block: Block): string =>
  (block.children ?? [])
    .map((child) => child.text ?? "")
    .join("")
    .replace(/\s+/g, " ")
    .trim();

export function extractFaqFromPortableText(body: PortableTextBlock[] | null | undefined): FaqPair[] {
  if (!body?.length) return [];
  const start = body.findIndex((node) => isBlock(node) && node.style === "h2" && FAQ_HEADING.test(blockText(node)));
  if (start < 0) return [];

  const pairs: FaqPair[] = [];
  let current: { question: string; parts: string[] } | null = null;
  const flush = () => {
    if (current && current.parts.length) {
      pairs.push({ question: current.question, answer: current.parts.join("\n\n") });
    }
    current = null;
  };

  for (const node of body.slice(start + 1)) {
    if (!isBlock(node)) break;
    const style = node.style ?? "normal";
    const text = blockText(node);
    if (style === "h2") break;
    if (QUESTION_STYLES.has(style)) {
      flush();
      const question = text.replace(NUMBERING, "").trim();
      current = question ? { question, parts: [] } : null;
      continue;
    }
    if (!current || !text) continue;
    current.parts.push(node.listItem ? `- ${text}` : text);
  }
  flush();
  return pairs;
}

/** The post's "FAQ schema" field as stored in Sanity. */
export interface PostFaqSchema {
  mode?: "auto" | "manual" | "off" | string | null;
  items?: Array<{ question?: string | null; answer?: string | null }> | null;
}

/** Applies the editor's choice: manual entries, the article's own FAQ section (default), or nothing. */
export function resolvePostFaq(setting: PostFaqSchema | null | undefined, body: PortableTextBlock[] | null | undefined): FaqPair[] {
  const mode = setting?.mode ?? "auto";
  if (mode === "off") return [];
  if (mode === "manual") {
    return (setting?.items ?? [])
      .map((item) => ({ question: item.question?.trim() ?? "", answer: item.answer?.trim() ?? "" }))
      .filter((item) => item.question && item.answer);
  }
  return extractFaqFromPortableText(body);
}
