"use client";

import { useEffect } from "react";

/** Elements that animate in: anything flagged `data-reveal`, or every child of a `data-reveal-stagger` group. */
const SELECTOR = "[data-reveal], [data-reveal-stagger] > *";

/**
 * Renders nothing; marks reveal targets as they scroll into view.
 *
 * WHY: the CSS only hides targets once <html data-reveal-ready> is set, so a
 * no-JS or reduced-motion visitor sees everything immediately. Targets already
 * on screen are marked before that attribute flips, so nothing flashes.
 */
export function ScrollReveal() {
  useEffect(() => {
    const root = document.documentElement;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const pending = new Set(document.querySelectorAll<HTMLElement>(SELECTOR));
    if (pending.size === 0) return;

    const markIn = (element: Element) => {
      element.setAttribute("data-reveal", "in");
      pending.delete(element as HTMLElement);
    };

    const isOnScreen = (rect: DOMRect) =>
      rect.top < window.innerHeight * 0.92 &&
      rect.bottom > 0 &&
      rect.left < window.innerWidth &&
      rect.right > 0;

    for (const element of Array.from(pending)) {
      if (isOnScreen(element.getBoundingClientRect())) markIn(element);
    }

    root.setAttribute("data-reveal-ready", "");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          markIn(entry.target);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.1 },
    );
    pending.forEach((element) => observer.observe(element));

    // WHY: an anchor jump or a very fast scroll can pass an element without it
    // ever intersecting, which would leave it invisible. Sweep on scroll for
    // anything that is now above the viewport and reveal it without delay.
    let frame = 0;
    const sweep = () => {
      frame = 0;
      for (const element of Array.from(pending)) {
        const rect = element.getBoundingClientRect();
        if (rect.width === 0 && rect.height === 0) continue;
        if (rect.bottom < 0) {
          element.style.setProperty("--reveal-delay", "0ms");
          markIn(element);
          observer.unobserve(element);
        }
      }
    };
    const onScroll = () => {
      if (frame === 0 && pending.size > 0) frame = requestAnimationFrame(sweep);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
      root.removeAttribute("data-reveal-ready");
    };
  }, []);

  return null;
}
