import { Fragment } from "react";

import { GradientText } from "@/components/ui/gradient-text";
import type { HeadingSegment } from "@/components/pages/partnership/partnership-content";

interface GradientHeadingProps {
  segments: HeadingSegment[];
  /**
   * Gradient class(es) for highlighted segments. Pass an array to give
   * successive highlights different angles (the last entry repeats).
   */
  highlightClassName: string | string[];
}

/** Renders a CMS heading: plain text, gradient highlights and line breaks. */
export function GradientHeading({ segments, highlightClassName }: GradientHeadingProps) {
  const classes = Array.isArray(highlightClassName) ? highlightClassName : [highlightClassName];
  // WHY: the n-th highlighted segment gets the n-th class (last class repeats); computed up front so render stays pure.
  const highlightOrdinal: number[] = [];
  let count = -1;
  for (const segment of segments) {
    if (segment.highlight && segment.text) count += 1;
    highlightOrdinal.push(Math.max(count, 0));
  }

  return (
    <>
      {segments.map((segment, index) => {
        if (segment.break) return <br key={index} />;
        if (!segment.text) return null;
        if (segment.highlight) {
          const className = classes[Math.min(highlightOrdinal[index] ?? 0, classes.length - 1)];
          return (
            <GradientText className={className} key={index}>
              {segment.text}
            </GradientText>
          );
        }
        return <Fragment key={index}>{segment.text}</Fragment>;
      })}
    </>
  );
}
