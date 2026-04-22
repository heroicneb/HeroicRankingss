"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

const THEME_TRANSITION_CLASS = "theme-transitioning";
const THEME_TRANSITION_DURATION_MS = 200;

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const transitionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  useEffect(() => {
    setMounted(true);
    return () => {
      if (transitionTimeoutRef.current !== null) {
        clearTimeout(transitionTimeoutRef.current);
      }

      document.documentElement.classList.remove(THEME_TRANSITION_CLASS);
    };
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
  const handleThemeToggle = () => {
    const root = document.documentElement;

    root.classList.add(THEME_TRANSITION_CLASS);
    setTheme(isDark ? "light" : "dark");

    if (transitionTimeoutRef.current !== null) {
      clearTimeout(transitionTimeoutRef.current);
    }

    transitionTimeoutRef.current = setTimeout(() => {
      root.classList.remove(THEME_TRANSITION_CLASS);
      transitionTimeoutRef.current = null;
    }, THEME_TRANSITION_DURATION_MS);
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
        className="relative inline-flex h-[22px] w-[44px] items-center rounded-full border border-[var(--color-hr-accent)] transition-colors"
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
