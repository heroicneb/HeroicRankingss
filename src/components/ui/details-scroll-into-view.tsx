"use client";

import { useEffect } from "react";

/**
 * Renders nothing. When a `<details>` in the group opens, scrolls it to the
 * top of the viewport (below the sticky navbar).
 *
 * WHY: rows in an exclusive group (`name="…"`) close the previously open row,
 * which sits above the one just tapped. The page shrinks above the finger and
 * the viewport lands on the bottom of the new row, past its chart. Scrolling
 * the opened row into view keeps the chart (and its entrance animation) in
 * sight.
 */
export function DetailsScrollIntoView({ group }: { group: string }) {
  useEffect(() => {
    const rows = Array.from(document.querySelectorAll<HTMLDetailsElement>(`details[name="${group}"]`));
    if (rows.length === 0) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const onToggle = (event: Event) => {
      const row = event.currentTarget as HTMLDetailsElement;
      if (!row.open) return;
      // WHY: wait a frame so the sibling row has collapsed before measuring.
      requestAnimationFrame(() => row.scrollIntoView({ block: "start", behavior: reduced ? "auto" : "smooth" }));
    };
    rows.forEach((row) => row.addEventListener("toggle", onToggle));
    return () => rows.forEach((row) => row.removeEventListener("toggle", onToggle));
  }, [group]);

  return null;
}
