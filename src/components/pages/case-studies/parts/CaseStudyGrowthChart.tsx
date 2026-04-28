import { TwoToneHeading } from "@/components/ui/two-tone-heading";
import type { CaseStudyGrowthChartData } from "@/lib/sanity-data";

import { CaseStudyGrowthChartLazy } from "./CaseStudyGrowthChartLazy";

/**
 * Growth Trajectory chart on the case-study detail page.
 *
 * Renders inside its own dark `#151419` rounded panel so the chart visually
 * extends the "Numbers That Matter" dark band. Reserves a fixed height
 * (mobile 384px / desktop 480px) before hydration to prevent CLS — see
 * spec section 3.2 (Chart implementation).
 *
 * The Recharts client island lives in {@link CaseStudyGrowthChartLazy}
 * because Next 16 forbids `next/dynamic({ ssr: false })` inside server
 * components. This file remains a server component so it can be rendered
 * in the static page tree without hydration cost when data is absent.
 *
 * Accessibility: the visual chart is wrapped in a labelled <figure> with the
 * raw series data exposed as a `sr-only` <table> beneath it; the SVG is
 * aria-hidden so screen readers consume the table view instead of empty
 * <path> nodes.
 */
export function CaseStudyGrowthChart({
  data,
}: {
  data: CaseStudyGrowthChartData | null | undefined;
}) {
  const hasData =
    !!data &&
    Array.isArray(data.series) &&
    data.series.length > 0 &&
    Array.isArray(data.months) &&
    data.months.length > 0;

  if (!hasData) return null;

  const hasHeading = Boolean(data.headingMain || data.headingHighlighted);
  const headingId = "case-study-growth-chart-heading";
  const headingText =
    `${data.headingMain ?? ""} ${data.headingHighlighted ?? ""}`.trim();
  const captionText = headingText || "Growth trajectory chart";
  const months = data.months ?? [];
  const series = data.series ?? [];

  return (
    <section className="px-[20px] pb-[40px] pt-0 lg:px-[80px] lg:pb-[100px]">
      <div className="mx-auto w-full max-w-[1440px]">
        <div className="rounded-[30px] bg-[var(--color-hr-dark)] p-[24px] lg:rounded-[40px] lg:p-[60px]">
          {hasHeading ? (
            <TwoToneHeading
              as="h2"
              className="type-h2 mb-[24px] text-[var(--color-hr-pure-white)] lg:mb-[40px]"
              gradientClass="gradient-text-brand-light"
              highlighted={data.headingHighlighted ?? ""}
              id={headingId}
              main={data.headingMain ?? ""}
            />
          ) : null}

          <figure
            aria-labelledby={hasHeading ? headingId : undefined}
            aria-label={hasHeading ? undefined : captionText}
            role="figure"
          >
            <div aria-hidden="true" className="h-[384px] lg:h-[480px]">
              <CaseStudyGrowthChartLazy data={data} />
            </div>
            <figcaption className="sr-only">
              <p>{captionText} — data table.</p>
              <table>
                <caption>{captionText}</caption>
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
                        <td key={month}>
                          {i < s.points.length ? String(s.points[i]) : ""}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
