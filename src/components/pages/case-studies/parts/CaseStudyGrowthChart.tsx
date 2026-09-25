import type { CaseStudyGrowthChartData } from "@/lib/sanity-data";

import { CaseStudyGrowthChartLazy } from "./CaseStudyGrowthChartLazy";
import { SERIES_COLORS } from "./growth-chart-colors";

/**
 * Growth trajectory block (Figma 2255:1148–1250), rendered inside the dark
 * "Numbers That Matter" panel: a 32px title with legend pills on the right,
 * then the dual-axis line chart. Returns null without series data.
 */
export function CaseStudyGrowthChart({ data }: { data: CaseStudyGrowthChartData | null | undefined }) {
  const hasData = !!data && Array.isArray(data.series) && data.series.length > 0 && Array.isArray(data.months) && data.months.length > 0;
  if (!hasData) return null;
  const months = data.months ?? [];
  const series = data.series ?? [];
  const title = `${data.headingMain ?? ""} ${data.headingHighlighted ?? ""}`.trim() || "Growth trajectory";
  const headingId = "case-study-growth-chart-heading";

  return (
    <div className="mt-[60px] lg:mt-[80px]">
      <div className="flex flex-col items-center gap-[20px] text-center lg:flex-row lg:items-start lg:justify-between lg:text-left">
        <h3 className="font-normal text-[24px] leading-[1.2] tracking-[-0.48px] text-[var(--color-hr-pure-white)] lg:text-[32px] lg:tracking-[-0.64px]" id={headingId}>
          {title}
        </h3>
        <ul className="flex flex-wrap justify-center gap-[10px]">
          {series.map((s) => (
            <li
              className="inline-flex items-center gap-[10px] rounded-[10px] border border-[var(--color-hr-grey)] bg-[color-mix(in_srgb,var(--color-hr-pure-white)_2%,transparent)] px-[12px] py-[8px] text-[18px] leading-[24px] text-[var(--color-hr-pure-white)]"
              key={s.label}
            >
              <span aria-hidden className="size-[12px] rounded-full" style={{ background: SERIES_COLORS[s.color] ?? SERIES_COLORS["gradient-light"] }} />
              {s.label}
            </li>
          ))}
        </ul>
      </div>

      <figure aria-labelledby={headingId} className="mt-[40px] lg:mt-[80px]">
        <div aria-hidden="true" className="h-[360px] lg:h-[484px]">
          <CaseStudyGrowthChartLazy data={data} />
        </div>
        <figcaption className="sr-only">
          <table>
            <caption>{title}</caption>
            <thead>
              <tr>
                <th scope="col">Series</th>
                {months.map((month) => (
                  <th key={month} scope="col">
                    {month}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {series.map((s) => (
                <tr key={s.label}>
                  <th scope="row">{s.label}</th>
                  {months.map((month, i) => (
                    <td key={month}>{i < s.points.length ? String(s.points[i]) : ""}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </figcaption>
      </figure>
    </div>
  );
}
