"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/cn";

export type MobileScrollRailIndicator = "dots" | "bar";

export interface MobileScrollRailProps {
  children: ReactNode;
  /** Number of items rendered as direct children of the rail (used to size indicators). */
  itemCount: number;
  /** Approximate width (in px) of a single card, used for snap-position arithmetic. */
  itemWidth: number;
  /** Gap (in px) between cards in the rail. */
  itemGap?: number;
  /** Indicator style — bar (active segment slides) or dots. Default: "bar". */
  indicator?: MobileScrollRailIndicator;
  /** Inline horizontal padding inside the rail container (px). Default: 20. */
  paddingInline?: number;
  /** Optional ARIA label applied to the rail container for screen readers. */
  ariaLabel?: string;
  /** Accessible label for the indicator group. */
  indicatorAriaLabel?: string;
  className?: string;
  /** Extra classes applied to the inner flex track that wraps `children`. */
  trackClassName?: string;
}

/**
 * Generic mobile horizontal scroll rail with a snap container + progress
 * indicator (dots or bar). Uses a scroll listener to compute the active
 * card index based on `scrollLeft` and (`itemWidth` + `itemGap`).
 *
 * Used across case-study + podcast mobile sections (Six Pillars, Journey,
 * Numbers That Matter, Before/After, Best Moments). Existing service rails
 * (`seo-services-mobile-services-rail.tsx`, etc.) implement the same pattern
 * inline; this primitive captures the shared behavior so future rails can
 * reuse it.
 *
 * Marked `'use client'` because indicator state needs scroll listeners.
 */
export function MobileScrollRail({
  children,
  itemCount,
  itemWidth,
  itemGap = 10,
  indicator = "bar",
  paddingInline = 20,
  ariaLabel,
  indicatorAriaLabel = "Carousel position",
  className,
  trackClassName,
}: MobileScrollRailProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail || itemCount <= 0) {
      return;
    }

    const cardStep = itemWidth + itemGap;
    const maxIndex = Math.max(0, itemCount - 1);

    const update = () => {
      const next = Math.round(rail.scrollLeft / cardStep);
      setActiveIndex(Math.max(0, Math.min(maxIndex, next)));
    };

    let resizeRafId = 0;
    const onResize = () => {
      cancelAnimationFrame(resizeRafId);
      resizeRafId = requestAnimationFrame(update);
    };

    update();
    rail.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      rail.removeEventListener("scroll", update);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(resizeRafId);
    };
  }, [itemCount, itemWidth, itemGap]);

  const scrollToIndex = (index: number) => {
    const rail = railRef.current;
    if (!rail) {
      return;
    }
    rail.scrollTo({
      left: index * (itemWidth + itemGap),
      behavior: "smooth",
    });
  };

  return (
    <>
      <div
        aria-label={ariaLabel}
        className={cn(
          "services-scroll-rail overflow-x-auto snap-x snap-mandatory lg:hidden",
          className,
        )}
        ref={railRef}
      >
        <div
          className={cn("flex w-max", trackClassName)}
          style={{
            gap: `${itemGap}px`,
            paddingLeft: `${paddingInline}px`,
            paddingRight: `${paddingInline}px`,
          }}
        >
          {children}
        </div>
      </div>

      <div className="mt-10 flex justify-center lg:hidden">
        {indicator === "dots" ? (
          <div
            aria-label={indicatorAriaLabel}
            className="flex items-center"
            role="status"
          >
            {Array.from({ length: itemCount }).map((_, index) => (
              <button
                aria-label={`Go to item ${index + 1}`}
                className="relative flex items-center justify-center p-[19px]"
                key={`mobile-rail-dot-${index}`}
                onClick={() => scrollToIndex(index)}
                type="button"
              >
                <span
                  className={cn(
                    "block size-[6px] rounded-full transition-colors duration-200",
                    activeIndex === index
                      ? "bg-[var(--color-hr-dark)] dark:bg-[var(--color-text-inverse)]"
                      : "bg-[var(--color-hr-light-grey)] dark:bg-[var(--color-border-inverse-10)]",
                  )}
                />
              </button>
            ))}
          </div>
        ) : (
          <div
            aria-label={indicatorAriaLabel}
            className="relative h-[6px] w-[51px] overflow-hidden rounded-full bg-[var(--color-hr-light-grey)] dark:bg-[var(--color-border-inverse-10)]"
            role="status"
          >
            <span
              aria-hidden="true"
              className="absolute inset-y-0 left-0 block rounded-full bg-[var(--color-hr-dark)] transition-transform duration-200 dark:bg-[var(--color-text-inverse)]"
              style={{
                width: itemCount > 0 ? `${100 / itemCount}%` : "0%",
                transform: `translateX(${activeIndex * 100}%)`,
              }}
            />
          </div>
        )}
      </div>
    </>
  );
}
