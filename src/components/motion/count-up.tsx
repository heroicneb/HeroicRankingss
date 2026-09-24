"use client";

import { useEffect, useRef, useState } from "react";

interface CountUpProps {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  /** Milliseconds for the full count. */
  duration?: number;
  className?: string;
}

/**
 * Number that counts up from zero the first time it approaches the viewport.
 *
 * WHY: the server renders the final value, so crawlers, no-JS and
 * reduced-motion visitors always see the real number. The count starts a little
 * before the element is visible so it is already moving when it appears.
 */
export function CountUp({ value, decimals = 0, prefix = "", suffix = "", duration = 1800, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState<number | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min(1, (now - start) / duration);
          // WHY: ease-out expo — fast start, long settle, reads as "arriving" at the number.
          const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          setShown(value * eased);
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { rootMargin: "0px 0px 240px 0px", threshold: 0 },
    );
    observer.observe(element);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, duration]);

  const current = shown ?? value;

  return (
    <span className={className} ref={ref}>
      {prefix}
      {current.toFixed(decimals)}
      {suffix}
    </span>
  );
}
