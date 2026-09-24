import { Fragment, type CSSProperties } from "react";

interface AnimatedWordsProps {
  text: string;
  /** Offset for the stagger index, for continuing a sequence across line breaks. */
  startIndex?: number;
}

/**
 * Splits a line into words that rise in one after another (see `.hero-word` in globals.css).
 * Plain spans, so screen readers and crawlers still read one sentence.
 */
export function AnimatedWords({ text, startIndex = 0 }: AnimatedWordsProps) {
  return text.split(" ").map((word, index) => (
    <Fragment key={`${word}-${index}`}>
      {index > 0 ? " " : null}
      <span className="hero-word" style={{ "--i": startIndex + index } as CSSProperties}>
        <span>{word}</span>
      </span>
    </Fragment>
  ));
}
