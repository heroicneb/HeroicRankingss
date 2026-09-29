import { Fragment, type CSSProperties } from "react";

import type { HeadingSegment } from "@/components/pages/shared/page-content";
import { cn } from "@/lib/cn";

interface AnimatedWordsProps {
  /** One line of heading segments (no line breaks); highlighted segments get `highlightClassName`. */
  segments: HeadingSegment[];
  /** Gradient text class for highlighted segments. */
  highlightClassName?: string;
  /** Offset for the stagger index, for continuing a sequence across line breaks. */
  startIndex?: number;
}

/** Number of words in a line (used to continue the stagger on the next line). */
export const countWords = (segments: HeadingSegment[]): number =>
  segments
    .map((segment) => segment.text ?? "")
    .join("")
    .split(" ")
    .filter(Boolean).length;

/**
 * Splits a line into words that rise in one after another (see `.hero-word` in globals.css).
 * Plain spans, so screen readers and crawlers still read one sentence.
 *
 * WHY: each word is its own clipped box, so the gradient is applied per word;
 * the brand angle is near-vertical, which makes the seams invisible.
 */
export function AnimatedWords({ segments, highlightClassName, startIndex = 0 }: AnimatedWordsProps) {
  // Words are split inside each segment so a highlight can start or end mid-line.
  const words: Array<{ text: string; highlight: boolean }> = [];
  // WHY: a segment that does not end with a space continues into the next one ("better" + ","), so the two halves stay one word.
  let glueNext = false;
  for (const segment of segments) {
    const text = segment.text;
    if (!text) continue;
    text.split(" ").forEach((part, index) => {
      if (!part) return;
      const last = words[words.length - 1];
      if (index === 0 && glueNext && last) last.text += part;
      else words.push({ text: part, highlight: !!segment.highlight });
    });
    glueNext = !text.endsWith(" ");
  }

  return words.map((word, index) => (
    <Fragment key={`${word.text}-${index}`}>
      {index > 0 ? " " : null}
      <span className="hero-word" style={{ "--i": startIndex + index } as CSSProperties}>
        <span className={cn(word.highlight && highlightClassName && `gradient-text-brand ${highlightClassName}`)}>{word.text}</span>
      </span>
    </Fragment>
  ));
}
