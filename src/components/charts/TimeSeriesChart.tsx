"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/cn";

import { SERIES_SWATCH } from "./chart-theme";
import type { TimeSeriesChartSpec } from "./time-series-chart-types";

const Client = dynamic(() => import("./TimeSeriesChartClient"), { ssr: false, loading: () => null });

/**
 * Interactive time-series chart on the dark brand panel: legend pills, the
 * recharts drawing (mounted the first time the panel scrolls into view so the
 * entrance animation plays once) and a screen-reader data table.
 *
 * The panel keeps the 600×441 aspect ratio of the images it replaces, so the
 * page does not shift while the chart code loads.
 */
export function TimeSeriesChart({ spec, className }: { spec: TimeSeriesChartSpec; className?: string }) {
  const panelRef = useRef<HTMLElement>(null);
  const [state, setState] = useState<{ visible: boolean; animate: boolean }>({ visible: false, animate: true });
  const headingId = `${spec.id}-chart-title`;

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    // WHY: decided at reveal time so a reduced-motion visitor gets the finished chart, not a drawing one.
    const reveal = () => setState({ visible: true, animate: !window.matchMedia("(prefers-reduced-motion: reduce)").matches });
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
      { threshold: 0.2 },
    );
    observer.observe(panel);
    return () => observer.disconnect();
  }, []);

  return (
    <figure
      aria-labelledby={headingId}
      className={cn("surface-chart flex flex-col gap-[14px] rounded-[20px] p-[14px] text-[var(--color-hr-pure-white)] lg:p-[18px]", className)}
      ref={panelRef}
    >
      <p className="sr-only" id={headingId}>
        {spec.title}
      </p>

      {/* WHY: touch-action pan-y keeps vertical page scrolling native while horizontal drags scrub the chart. */}
      <div className="relative aspect-[600/380] w-full [touch-action:pan-y]">
        <div className="absolute inset-0">{state.visible ? <Client animate={state.animate} spec={spec} /> : null}</div>
      </div>

      <ul aria-hidden className="flex flex-wrap gap-[8px]">
        {spec.series.map((s) => (
          <li
            className="inline-flex items-center gap-[8px] rounded-[10px] border border-[var(--color-border-inverse-15)] bg-[var(--color-surface-inverse-10)] px-[10px] py-[5px] text-[13px] leading-[18px] text-[var(--color-text-inverse-95)]"
            key={s.key}
          >
            <span className="size-[10px] shrink-0 rounded-full" style={{ background: SERIES_SWATCH[s.color] }} />
            {s.label}
          </li>
        ))}
      </ul>

      <figcaption className="sr-only">
        <table>
          <caption>
            {spec.title} ({spec.metricLabel})
          </caption>
          <thead>
            <tr>
              <th scope="col">Series</th>
              {spec.labels.map((label, i) => (
                <th key={label} scope="col">
                  {label}
                  {spec.forecastFrom != null && i >= spec.forecastFrom ? " (forecast)" : ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {spec.series.map((s) => (
              <tr key={s.key}>
                <th scope="row">{s.label}</th>
                {spec.labels.map((label, i) => (
                  <td key={label}>{s.values[i] ?? ""}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </figcaption>
    </figure>
  );
}
