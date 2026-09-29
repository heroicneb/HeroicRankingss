"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Flips to `revealed` the first time the element scrolls into view; reduced
 * motion reveals immediately (animations are skipped by the caller).
 */
export function useReveal<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T>(null);
  const [state, setState] = useState<{ revealed: boolean; animate: boolean }>({ revealed: false, animate: true });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const reveal = () => setState({ revealed: true, animate: !window.matchMedia("(prefers-reduced-motion: reduce)").matches });
    if (typeof IntersectionObserver === "undefined") {
      const frame = requestAnimationFrame(reveal);
      return () => cancelAnimationFrame(frame);
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        reveal();
        observer.disconnect();
      },
      { threshold },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, ...state };
}
