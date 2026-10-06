import { describe, expect, it } from "vitest";

import { truncateBio } from "./truncate-bio";

const sentence = (n: number, text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor.") => Array.from({ length: n }, () => text).join(" ");

describe("truncateBio", () => {
  it("leaves short bios untouched", () => {
    const result = truncateBio(["Short bio.", "Second line."]);
    expect(result).toEqual({ paragraphs: ["Short bio.", "Second line."], truncated: false });
  });

  it("cuts one long paragraph at a sentence end inside the 355-400 window", () => {
    const text = sentence(8); // 8 × 79 chars ≈ 630
    const { paragraphs, truncated } = truncateBio([text]);
    expect(truncated).toBe(true);
    expect(paragraphs).toHaveLength(1);
    const out = paragraphs[0]!;
    expect(out.length).toBeGreaterThanOrEqual(355);
    expect(out.length).toBeLessThanOrEqual(400);
    expect(out.endsWith("tempor.")).toBe(true);
    expect(text.startsWith(out)).toBe(true);
  });

  it("falls back to a word boundary with an ellipsis when no sentence ends in the window", () => {
    const words = Array.from({ length: 120 }, (_, i) => `word${i}`).join(" ");
    const { paragraphs } = truncateBio([words]);
    const out = paragraphs[0]!;
    expect(out.endsWith("…")).toBe(true);
    expect(out.length).toBeLessThanOrEqual(400);
    expect(out.slice(0, -1).endsWith(" ")).toBe(false);
  });

  it("keeps whole paragraphs and drops the next one once 355 characters are kept", () => {
    const question = "What do you like the most about your job?";
    const answer = sentence(5); // ≈ 395 incl. spaces
    const { paragraphs, truncated } = truncateBio([question, answer, "Name 3 of your personal traits:", "Patient, adaptable, creative."]);
    expect(truncated).toBe(true);
    // WHY: the question and its answer fit; the next question must not appear half-cut.
    expect(paragraphs[0]).toBe(question);
    expect(paragraphs).toHaveLength(2);
    expect(paragraphs[1]!.length).toBeGreaterThan(300);
  });

  it("prefers a clean sentence a little under the floor over a mid-sentence cut", () => {
    const text = `${sentence(4)} ${"Then a very long closing sentence without any punctuation ".repeat(4)}end.`; // sentence ends at ≈316
    const { paragraphs } = truncateBio([text]);
    const out = paragraphs[0]!;
    expect(out.endsWith("tempor.")).toBe(true);
    expect(out.length).toBeGreaterThanOrEqual(295);
  });

  it("ignores blank paragraphs", () => {
    expect(truncateBio(["", "  ", "Hello."]).paragraphs).toEqual(["Hello."]);
  });
});
