import { createElement } from "react";

import { cn } from "@/lib/cn";

export type TwoToneHeadingTag = "h1" | "h2" | "h3";
export type TwoToneHeadingLayout = "inline" | "stacked";

export interface TwoToneHeadingProps {
  as?: TwoToneHeadingTag;
  main: string;
  highlighted: string;
  /**
   * Position of the highlighted (gradient) word within the heading.
   * "trailing" appends `highlighted` after `main`; "leading" prepends it.
   * Default: "trailing".
   */
  highlightPosition?: "leading" | "trailing";
  /**
   * "inline" places `main` and `highlighted` on the same line separated by a
   * space. "stacked" inserts a `<br aria-hidden="true" />` between them so
   * each occupies its own line.
   */
  layout?: TwoToneHeadingLayout;
  /**
   * Additional gradient variant class (e.g., `gradient-text-brand-services`).
   * Falls back to the base `gradient-text-brand` palette which renders the
   * standard purple sweep. Pass `gradient-text-brand-light` for headings on
   * dark surfaces.
   */
  gradientClass?: string;
  className?: string;
}

/**
 * Two-tone heading pattern used across detail pages where part of the heading
 * is rendered solid and the rest renders as a gradient span.
 *
 * Examples:
 * - `<h1>Marketing<br/>That Actually Works</h1>` (podcast hero — `stacked`)
 * - `<h2>Best Moments From This Episode</h2>` (`inline`, leading highlight)
 *
 * Source: docs/figma-cache/extractions/2026-04-28-podcast-section-01-episode-single-desktop.md
 *         docs/figma-cache/extractions/2026-04-28-case-study-section-01-single-desktop.md
 */
export function TwoToneHeading({
  as = "h2",
  main,
  highlighted,
  highlightPosition = "trailing",
  layout = "inline",
  gradientClass,
  className,
}: TwoToneHeadingProps) {
  const separator =
    layout === "stacked" ? <br aria-hidden="true" /> : <span> </span>;

  const gradientNode = (
    <span className={cn("gradient-text-brand", gradientClass)}>{highlighted}</span>
  );
  const mainNode = <span>{main}</span>;

  const children =
    highlightPosition === "leading" ? (
      <>
        {gradientNode}
        {separator}
        {mainNode}
      </>
    ) : (
      <>
        {mainNode}
        {separator}
        {gradientNode}
      </>
    );

  return createElement(as, { className }, children);
}
