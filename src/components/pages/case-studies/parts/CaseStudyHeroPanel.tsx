import Image from "next/image";

import { MetricTile } from "@/components/ui/metric-tile";
import type { SanityCaseStudyDetail } from "@/lib/sanity-data";

import {
  CASE_STUDY_PANEL_BY_SLUG,
  CASE_STUDY_PANEL_FALLBACK,
} from "./case-study-panels";

interface CaseStudyHeroPanelProps {
  data: SanityCaseStudyDetail;
}

/**
 * Hero metrics grid + brand-color panel beneath the H1.
 *
 * Renders the 3 hero `MetricTile` cards on a 3-up grid above 1024px and as
 * a vertical stack on mobile. Followed by the brand-color SVG panel keyed
 * by slug — the same flat panel artwork used on the case-studies index card
 * top half — with the brand name centered and a soft shadow.
 *
 * Returns `null` when both `heroMetrics` and the slug-resolved panel are
 * absent so the page can collapse cleanly.
 */
export function CaseStudyHeroPanel({ data }: CaseStudyHeroPanelProps) {
  const metrics = data.heroMetrics ?? [];
  const slug = data.slug?.current;
  const panel = slug
    ? (CASE_STUDY_PANEL_BY_SLUG[slug] ?? CASE_STUDY_PANEL_FALLBACK)
    : CASE_STUDY_PANEL_FALLBACK;
  const panelLabel = data.panelLabel ?? data.title ?? data.client;

  if (metrics.length === 0 && !panel) return null;

  return (
    <section className="px-[20px] pb-[40px] lg:px-[80px] lg:pb-[100px]">
      <div className="mx-auto w-full max-w-[1440px]">
        {metrics.length > 0 ? (
          <div className="grid grid-cols-1 gap-[10px] lg:grid-cols-3 lg:gap-[20px]">
            {metrics.map((metric, index) => (
              <MetricTile
                key={metric._key ?? `${metric.label}-${index}`}
                label={metric.label}
                value={metric.value}
                variant="light"
              />
            ))}
          </div>
        ) : null}

        <figure
          className={
            metrics.length > 0
              ? "relative mt-[24px] aspect-[350/255] w-full overflow-hidden rounded-[30px] lg:mt-[40px] lg:aspect-[1420/684] lg:rounded-[40px]"
              : "relative aspect-[350/255] w-full overflow-hidden rounded-[30px] lg:aspect-[1420/684] lg:rounded-[40px]"
          }
        >
          <Image
            alt={`${panelLabel} brand panel`}
            className="object-cover"
            fetchPriority="high"
            fill
            priority
            sizes="(min-width: 1024px) 1420px, 100vw"
            src={panel.panelImageSrc}
          />
          {panelLabel ? (
            <p
              className={`absolute top-1/2 -translate-y-1/2 text-[40px] font-normal leading-[1.1] tracking-[-0.8px] lg:text-[80px] lg:leading-[1.05] lg:tracking-[-1.6px] ${panel.panelLabelClassName} ${panel.panelLabelColorClassName}`}
            >
              {panelLabel}
            </p>
          ) : null}
        </figure>
      </div>
    </section>
  );
}
