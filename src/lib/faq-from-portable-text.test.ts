import { describe, expect, it } from "vitest";

import type { PortableTextBlock } from "@portabletext/react";

import { extractFaqFromPortableText, resolvePostFaq } from "./faq-from-portable-text";

const block = (style: string, text: string, extra: Record<string, unknown> = {}): PortableTextBlock =>
  ({ _type: "block", _key: `${style}-${text.slice(0, 8)}`, style, children: [{ _type: "span", _key: "s", text }], ...extra }) as PortableTextBlock;
const image = { _type: "image", _key: "img", asset: { _ref: "x" } } as unknown as PortableTextBlock;

describe("extractFaqFromPortableText", () => {
  it("collects h3 questions and their paragraphs after a Frequently Asked Questions heading", () => {
    const body = [
      block("h2", "What is B2B SEO?"),
      block("normal", "Intro paragraph."),
      block("h2", "Frequently Asked Questions (FAQ):"),
      block("h3", "1. What are B2B SEO solutions?"),
      block("normal", "Strategies for business buyers."),
      block("normal", "They differ from B2C."),
      block("h3", "2. Why does it matter?"),
      block("normal", "Because buyers research."),
      block("normal", "Points:", {}),
      block("normal", "Longer cycles", { listItem: "bullet", level: 1 }),
    ];
    expect(extractFaqFromPortableText(body)).toEqual([
      { question: "What are B2B SEO solutions?", answer: "Strategies for business buyers.\n\nThey differ from B2C." },
      { question: "Why does it matter?", answer: "Because buyers research.\n\nPoints:\n\n- Longer cycles" },
    ]);
  });

  it("stops at the next h2 and at non-text blocks", () => {
    const body = [
      block("h2", "FAQ"),
      block("h3", "First?"),
      block("normal", "Answer one."),
      image,
      block("normal", "Closing paragraph that is not an answer."),
      block("h3", "Not a question?"),
    ];
    expect(extractFaqFromPortableText(body)).toEqual([{ question: "First?", answer: "Answer one." }]);

    const withH2 = [block("h2", "FAQs"), block("h3", "Only?"), block("normal", "Yes."), block("h2", "Conclusion"), block("h3", "Nope?"), block("normal", "No.")];
    expect(extractFaqFromPortableText(withH2)).toEqual([{ question: "Only?", answer: "Yes." }]);
  });

  it("ignores headings that merely mention FAQs and questions without answers", () => {
    expect(extractFaqFromPortableText([block("h2", "FAQ Schema: When to Use It"), block("h3", "A?"), block("normal", "B.")])).toEqual([]);
    expect(extractFaqFromPortableText([block("h3", "Frequently Asked Questions"), block("h3", "A?"), block("normal", "B.")])).toEqual([]);
    expect(extractFaqFromPortableText([block("h2", "Frequently Asked Questions"), block("h3", "Unanswered?")])).toEqual([]);
    expect(extractFaqFromPortableText(null)).toEqual([]);
  });
});

describe("resolvePostFaq", () => {
  const body = [block("h2", "Frequently Asked Questions"), block("h3", "Auto?"), block("normal", "From the article.")];

  it("defaults to the article's FAQ section", () => {
    expect(resolvePostFaq(undefined, body)).toEqual([{ question: "Auto?", answer: "From the article." }]);
    expect(resolvePostFaq({ mode: "auto", items: [{ question: "Ignored?", answer: "Yes." }] }, body)).toEqual([{ question: "Auto?", answer: "From the article." }]);
  });

  it("uses the manual list, skipping incomplete rows", () => {
    expect(resolvePostFaq({ mode: "manual", items: [{ question: " Manual? ", answer: "Entered by hand." }, { question: "No answer?", answer: "" }] }, body)).toEqual([
      { question: "Manual?", answer: "Entered by hand." },
    ]);
  });

  it("publishes nothing when switched off", () => {
    expect(resolvePostFaq({ mode: "off" }, body)).toEqual([]);
  });
});
