"use client";

import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { useTheme } from "next-themes";

type DocumentWithViewTransition = Document & {
  startViewTransition?: (cb: () => void) => { ready: Promise<void> };
};

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === "dark" : false;

  if (!mounted) {
    return (
      <span
        aria-hidden
        className="inline-flex items-center gap-[6px]"
        style={{ width: 62, height: 22 }}
      />
    );
  }

  const handleThemeToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    const next = isDark ? "light" : "dark";
    const doc = document as DocumentWithViewTransition;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!doc.startViewTransition || prefersReducedMotion) {
      setTheme(next);
      return;
    }

    const { clientX: x, clientY: y } = event;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    const transition = doc.startViewTransition(() => {
      flushSync(() => {
        setTheme(next);
      });
    });

    void transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0 at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 450,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    });
  };

  return (
    <button
      aria-checked={isDark}
      aria-label="Toggle dark mode"
      className="group inline-flex items-center gap-[6px] focus-visible:outline-none"
      onClick={handleThemeToggle}
      role="switch"
      type="button"
    >
      <svg
        aria-hidden="true"
        className="shrink-0 text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]"
        fill="none"
        height="12"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        viewBox="0 0 12 12"
        width="12"
      >
        <circle cx="6" cy="6" r="2" />
        <path d="M6 0.75v1.25M6 10v1.25M1.5 6h-0.75M11.25 6h-0.75M2.5 2.5l0.75 0.75M8.75 8.75l0.75 0.75M2.5 9.5l0.75-0.75M8.75 3.25l0.75-0.75" />
      </svg>

      <span
        className="relative inline-flex h-[22px] w-[44px] items-center rounded-full border border-[var(--color-hr-accent)]"
        data-state={isDark ? "checked" : "unchecked"}
      >
        <span
          className="block size-[14px] rounded-full bg-[var(--color-hr-dark)] transition-transform duration-200 dark:bg-[var(--color-text-inverse)]"
          style={{
            transform: isDark ? "translateX(26px)" : "translateX(4px)",
          }}
        />
      </span>
    </button>
  );
}
