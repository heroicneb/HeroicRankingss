"use client";

import dynamic from "next/dynamic";

import { cn } from "@/lib/cn";

import { SERIES_SWATCH } from "./chart-theme";
import { ProofStats } from "./ProofStats";
import { ProofTable } from "./ProofTable";
import type { ProofVisualSpec } from "./proof-visual-types";
import { useReveal } from "./use-reveal";

const ChartClient = dynamic(() => import("./TimeSeriesChartClient"), { ssr: false, loading: () => null });

/**
 * Case study analytics visual on the dark brand panel: headline stats that
 * count up, an interactive chart that draws in, a report table whose rows
 * stagger in, and metric groups. Everything plays once when the panel
 * scrolls into view; reduced motion shows the finished state.
 */
export function ProofVisual({ spec, className, chartAspectClassName = "aspect-[570/300]" }: { spec: ProofVisualSpec; className?: string; chartAspectClassName?: string }) {
  const { ref, revealed, animate } = useReveal<HTMLDivElement>(0.15);
  const chart = spec.chart;
  const legend = spec.legend ?? chart?.series.map((s) => ({ label: s.label, color: s.color })) ?? [];

  return (
    <div aria-label={spec.title} className={cn("surface-chart flex flex-col gap-[14px] rounded-[20px] p-[14px] text-[var(--color-hr-pure-white)] lg:p-[18px]", className)} ref={ref} role="group">
      {spec.stats?.length ? <ProofStats animate={animate && revealed} columns={spec.stats.length === 4 ? 4 : spec.stats.length === 2 ? 2 : 3} stats={spec.stats} /> : null}

      {chart ? (
        <figure className="flex flex-col gap-[12px]">
          <figcaption className="sr-only">{chart.title}</figcaption>
          {/* WHY: touch-action pan-y keeps vertical page scrolling native while horizontal drags scrub the chart. */}
          <div className={cn("relative w-full [touch-action:pan-y]", chartAspectClassName)}>
            <div className="absolute inset-0">{revealed ? <ChartClient animate={animate} spec={chart} /> : null}</div>
          </div>
          {legend.length > 1 ? (
            <ul aria-hidden className="flex flex-wrap gap-[8px]">
              {legend.map((entry) => (
                <li
                  className="inline-flex items-center gap-[8px] rounded-[10px] border border-[var(--color-border-inverse-15)] bg-[var(--color-surface-inverse-10)] px-[10px] py-[5px] text-[13px] leading-[18px] text-[var(--color-text-inverse-95)]"
                  key={entry.label}
                >
                  <span className="size-[10px] shrink-0 rounded-full" style={{ background: SERIES_SWATCH[entry.color] }} />
                  {entry.label}
                </li>
              ))}
            </ul>
          ) : null}
          <table className="sr-only">
            <caption>{chart.title}</caption>
            <thead>
              <tr>
                <th scope="col">Series</th>
                {chart.labels.map((label) => (
                  <th key={label} scope="col">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {chart.series.map((s) => (
                <tr key={s.key}>
                  <th scope="row">{s.label}</th>
                  {chart.labels.map((label, i) => (
                    <td key={label}>{s.values[i] ?? ""}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </figure>
      ) : null}

      {spec.table ? <ProofTable animate={animate} revealed={revealed} table={spec.table} /> : null}

      {spec.metrics?.map((group) => (
        <section className="flex flex-col gap-[8px]" key={group.title}>
          <h4 className="text-[11px] font-normal uppercase tracking-[0.06em] text-[var(--color-text-inverse-50)]">{group.title}</h4>
          <ProofStats animate={animate && revealed} columns={group.stats.length >= 4 ? 4 : 3} stats={group.stats} />
        </section>
      ))}
    </div>
  );
}
