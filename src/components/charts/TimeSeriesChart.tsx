"use client";

import dynamic from "next/dynamic";

import { cn } from "@/lib/cn";

import { SERIES_SWATCH } from "./chart-theme";
import type { TimeSeriesChartSpec } from "./time-series-chart-types";
import { useReveal } from "./use-reveal";

const Client = dynamic(() => import("./TimeSeriesChartClient"), { ssr: false, loading: () => null });

interface TimeSeriesChartProps {
  spec: TimeSeriesChartSpec;
  className?: string;
  /** "panel" draws the dark brand surface; "bare" leaves framing to the parent (e.g. a ProofVisual panel). */
  frame?: "panel" | "bare";
  /** Aspect-ratio class for the drawing area. */
  aspectClassName?: string;
}

/**
 * Interactive time-series chart: legend pills, the recharts drawing (mounted
 * the first time it scrolls into view so the entrance animation plays once)
 * and a screen-reader data table.
 *
 * The drawing keeps a fixed aspect ratio, so the page does not shift while
 * the chart code loads.
 */
export function TimeSeriesChart({ spec, className, frame = "panel", aspectClassName = "aspect-[600/380]" }: TimeSeriesChartProps) {
  const { ref, revealed, animate } = useReveal<HTMLElement>();
  const headingId = `${spec.id}-chart-title`;

  return (
    <figure
      aria-labelledby={headingId}
      className={cn(
        "flex flex-col gap-[14px] text-[var(--color-hr-pure-white)]",
        frame === "panel" ? "surface-chart rounded-[20px] p-[14px] lg:p-[18px]" : null,
        className,
      )}
      ref={ref}
    >
      <p className="sr-only" id={headingId}>
        {spec.title}
      </p>

      {/* WHY: touch-action pan-y keeps vertical page scrolling native while horizontal drags scrub the chart. */}
      <div className={cn("relative w-full [touch-action:pan-y]", aspectClassName)}>
        <div className="absolute inset-0">{revealed ? <Client animate={animate} spec={spec} /> : null}</div>
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
                <th key={i} scope="col">
                  {spec.displayLabels?.[i] ?? label}
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
                  <td key={i}>{s.values[i] ?? ""}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </figcaption>
    </figure>
  );
}
