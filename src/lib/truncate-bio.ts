/*
 * Shortens an author bio for the blog sidebar card. Whole paragraphs are kept
 * while they fit; the first paragraph that would push the text past MAX is
 * cut at the last sentence end before MAX (a clean sentence a little under
 * MIN beats a mid-sentence cut, see SENTENCE_SLACK), or at a word boundary
 * with an ellipsis. Once the kept text is already at least MIN characters,
 * the next paragraph is simply dropped, so Q&A-style bios never end on a
 * half question.
 */

export const BIO_MIN_CHARS = 355;
export const BIO_MAX_CHARS = 400;
/** How far under MIN a sentence end may fall and still be preferred over an ellipsis cut. */
const SENTENCE_SLACK = 60;

export interface TruncatedBio {
  paragraphs: string[];
  truncated: boolean;
}

const SENTENCE_END = /[.!?]["')\]]?(?=\s|$)/g;

function cutParagraph(paragraph: string, budget: number, alreadyKept: number): string {
  const limit = Math.max(0, budget);
  const head = paragraph.slice(0, limit);

  let sentenceCut = -1;
  for (const match of head.matchAll(SENTENCE_END)) {
    const end = match.index + match[0].length;
    if (alreadyKept + end >= BIO_MIN_CHARS - SENTENCE_SLACK) sentenceCut = end;
  }
  if (sentenceCut > 0) return head.slice(0, sentenceCut).trimEnd();

  const wordCut = head.lastIndexOf(" ");
  const base = (wordCut > 0 ? head.slice(0, wordCut) : head).replace(/[\s,;:]+$/, "");
  return `${base}…`;
}

export function truncateBio(paragraphs: readonly string[], max = BIO_MAX_CHARS, min = BIO_MIN_CHARS): TruncatedBio {
  const clean = paragraphs.map((p) => p.trim()).filter(Boolean);
  const kept: string[] = [];
  let length = 0;

  for (const paragraph of clean) {
    const separator = kept.length ? 1 : 0;
    if (length + separator + paragraph.length <= max) {
      kept.push(paragraph);
      length += separator + paragraph.length;
      continue;
    }
    if (length >= min) {
      return { paragraphs: kept, truncated: true };
    }
    kept.push(cutParagraph(paragraph, max - length - separator, length + separator));
    return { paragraphs: kept, truncated: true };
  }

  return { paragraphs: kept, truncated: false };
}
