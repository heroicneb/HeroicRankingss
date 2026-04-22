"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/cn";
import type { QuoteLine } from "@/types";

export interface QuoteRotatorProps {
  quotes: QuoteLine[];
  intervalMs?: number;
}

/**
 * Renders a 3-line rotating window (prev / current / next) across the full
 * quote pool. All quotes stay mounted so transitions are smooth — the
 * visible window shifts via CSS transform offsets as `activeIndex` advances.
 */
export function QuoteRotator({ quotes, intervalMs = 3200 }: QuoteRotatorProps) {
  const quoteCount = quotes.length;
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (quoteCount < 2) {
      return;
    }

    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    let intervalId: number | undefined;

    const sync = () => {
      if (intervalId !== undefined) {
        window.clearInterval(intervalId);
        intervalId = undefined;
      }
      if (!mql.matches) {
        intervalId = window.setInterval(() => {
          setActiveIndex((currentIndex) => (currentIndex + 1) % quoteCount);
        }, intervalMs);
      }
    };

    sync();
    mql.addEventListener("change", sync);

    return () => {
      mql.removeEventListener("change", sync);
      if (intervalId !== undefined) {
        window.clearInterval(intervalId);
      }
    };
  }, [intervalMs, quoteCount]);

  if (quoteCount === 0) {
    return null;
  }

  const currentIndex = activeIndex % quoteCount;

  return (
    <div
      className="quote-rotator relative mx-auto h-[440px] w-full max-w-[926px] overflow-hidden sm:h-[340px] lg:h-[260px]"
      style={
        {
          "--quote-offset": "160px",
        } as React.CSSProperties
      }
    >
      {quotes.map((quote, index) => {
        const rel = (index - currentIndex + quoteCount) % quoteCount;
        const isCurrent = rel === 0;
        const isNext = rel === 1;
        const isPrev = rel === quoteCount - 1;
        const isVisible = isCurrent || isNext || isPrev;

        const position = isPrev
          ? "calc(-50% - var(--quote-offset))"
          : isNext
            ? "calc(-50% + var(--quote-offset))"
            : "-50%";

        return (
          <p
            aria-hidden={!isCurrent}
            className={cn(
              "quote-rotator-line type-h4 absolute left-0 right-0 top-1/2 mx-auto w-full px-4 text-center transition-[opacity,filter,transform] duration-700 ease-out text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] sm:[--quote-offset:120px] lg:[--quote-offset:80px]",
              isCurrent && "scale-100 opacity-100 blur-0",
              (isPrev || isNext) && "scale-[0.99] opacity-50 blur-[4px]",
              !isVisible && "pointer-events-none opacity-0",
            )}
            key={quote.id}
            style={{
              transform: `translateY(${position})`,
            }}
          >
            {quote.lead}
            <span className="gradient-text-brand gradient-text-brand-quote">
              {quote.accent}
            </span>
            {quote.tail}
          </p>
        );
      })}
    </div>
  );
}
