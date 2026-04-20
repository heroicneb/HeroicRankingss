"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/cn";
import type { QuoteLine } from "@/types";

export interface QuoteRotatorProps {
  quotes: QuoteLine[];
  intervalMs?: number;
}

export function QuoteRotator({ quotes, intervalMs = 3200 }: QuoteRotatorProps) {
  const quoteCount = quotes.length;
  const [activeIndex, setActiveIndex] = useState(1);

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
    <div className="quote-rotator mx-auto flex max-w-[926px] flex-col items-center gap-[30px] text-center">
      {quotes.map((quote, index) => {
        const isActive = currentIndex === index;

        return (
          <p
            className={cn(
              "quote-rotator-line type-h4 text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] transition-[opacity,filter,transform] duration-700 ease-out",
              isActive ? "scale-100 opacity-100 blur-0" : "scale-[0.99] opacity-50 blur-[4px]",
            )}
            key={quote.id}
          >
            {quote.lead}
            <span className="gradient-text-brand gradient-text-brand-quote">{quote.accent}</span>
            {quote.tail}
          </p>
        );
      })}
    </div>
  );
}
