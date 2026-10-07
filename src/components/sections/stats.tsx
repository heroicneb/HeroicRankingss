import Image from "next/image";

import { CountUp } from "@/components/motion/count-up";
import { AppLink } from "@/components/ui/app-link";
import { Container } from "@/components/ui/container";
import { GradientArrowUpRightIcon } from "@/components/ui/icons/decorative";
import { SectionLabel } from "@/components/ui/section-label";
import { cn } from "@/lib/cn";
import { GradientHeading } from "@/components/ui/gradient-heading";
import { DEFAULT_HOME_CONTENT, splitSegments, type HomeContent } from "@/components/pages/home/home-content";
import type { StatItem } from "@/types";

type StatEntry = StatItem & {
  mobileSizeClassName: string;
};

export const STATS_CTA_HEIGHT_CLASS = "h-[51px]";

const STATS: StatEntry[] = [
  {
    metric: "100% CLIENT retention rate",
    detail: "for a 12-month period",
    imageSrc: "/figma/stats/stat-2.webp",
    imageAlt: "Classical statue holding a ring",
    sizeClassName:
      "h-[280px] w-[280px] min-[1360px]:h-[376px] min-[1360px]:w-[376px]",
    mobileSizeClassName: "h-[266.37px] w-[266.37px]",
  },
  {
    metric: "Certified experts",
    detail: "in SEO and digital marketing",
    imageSrc: "/figma/stats/stat-3.webp",
    imageAlt: "Classical statue portrait",
    sizeClassName:
      "h-[270px] w-[270px] min-[1360px]:h-[359px] min-[1360px]:w-[359px]",
    mobileSizeClassName: "h-[254.33px] w-[254.33px]",
  },
  {
    metric: "OVER 200 SUCCESSFUL",
    detail: "campaigns executed",
    imageSrc: "/figma/stats/stat-1.webp",
    imageAlt: "Classical statue reading a tablet",
    sizeClassName:
      "h-[280px] w-[280px] min-[1360px]:h-[376px] min-[1360px]:w-[376px]",
    mobileSizeClassName: "h-[266.37px] w-[266.37px]",
  },
];

const METRIC_NUMBER = /(\d+(?:\.\d+)?)(%?)/;

/** Wraps the first number in a metric ("100% CLIENT…", "OVER 200…") in a counter. */
function renderMetric(metric: string) {
  const match = METRIC_NUMBER.exec(metric);
  if (!match || match.index === undefined) return metric;
  const [whole, digits = "", suffix = ""] = match;
  const decimals = digits.includes(".") ? digits.split(".")[1]?.length ?? 0 : 0;
  return (
    <>
      {metric.slice(0, match.index)}
      <CountUp decimals={decimals} suffix={suffix} value={Number(digits)} />
      {metric.slice(match.index + whole.length)}
    </>
  );
}

interface StatsProps {
  content?: HomeContent["stats"];
}

/** CMS stats keep the circle size of the built-in stat in the same slot. */
function toStatEntries(items: HomeContent["stats"]["items"]): StatEntry[] {
  return items.map((item, index) => {
    // WHY: STATS is a non-empty constant, so the modulo lookup always hits.
    const slot = STATS[index % STATS.length] as StatEntry;
    return {
      ...slot,
      metric: item.metric,
      detail: item.detail,
      imageSrc: item.image?.src ?? slot.imageSrc,
      imageAlt: item.image?.alt || slot.imageAlt,
    };
  });
}

export function Stats({ content = DEFAULT_HOME_CONTENT.stats }: StatsProps) {
  const stats = toStatEntries(content.items);
  const headingLines = splitSegments(content.heading);
  return (
    <section className="pt-[40px] lg:pt-[60px]">
      <Container>
        {/* WHY: one heading block for every width, so the page has a single H2 for this section. */}
        <div className="mx-auto flex max-w-[350px] flex-col items-center gap-5 text-center text-[var(--color-hr-pure-white)] lg:max-w-[724px] lg:gap-0 lg:pt-[80px]" data-reveal>
          <SectionLabel className="text-[var(--color-hr-pure-white)]">
            {content.label}
          </SectionLabel>
          <h2 className="type-h2 w-[264px] text-[var(--color-hr-pure-white)] lg:mt-5 lg:w-auto">
            {headingLines.map((line, index) => (
              <span className="lg:block" key={`stats-heading-${index}`}>
                {index > 0 ? " " : null}
                <GradientHeading highlightClassName="" segments={line} />
              </span>
            ))}
          </h2>
          <p className="type-paragraph w-[300px] text-[var(--color-hr-pure-white)] lg:mt-10 lg:w-auto">
            {content.body}
          </p>
          <AppLink
            className={cn(
              "type-cta motion-interactive motion-interactive-press inline-flex w-full max-w-[350px] items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[var(--color-hr-accent)] bg-transparent px-5 text-[var(--color-hr-pure-white)] hover:bg-[color-mix(in_srgb,var(--color-hr-pure-white)_8%,transparent)] lg:mt-10 lg:w-auto [&_svg]:text-[var(--color-hr-pure-white)]",
              STATS_CTA_HEIGHT_CLASS,
            )}
            href={content.ctaUrl}
            motionPreset="none"
          >
            {content.ctaLabel}
            <GradientArrowUpRightIcon className="size-[10px]" />
          </AppLink>
        </div>

        <div className="mx-auto flex max-w-[350px] flex-col items-center text-center text-[var(--color-hr-pure-white)] lg:hidden">

          <div className="mt-[60px] flex flex-col gap-10" data-reveal-stagger>
            {stats.map((stat, index) => (
              <article
                className="w-[294px] text-center text-[var(--color-hr-pure-white)]"
                key={`mobile-${stat.metric}`}
              >
                <div className="flex h-[266px] items-end justify-center">
                  <div
                    className={cn(
                      "relative overflow-hidden rounded-full",
                      stat.mobileSizeClassName,
                    )}
                  >
                    <Image
                      alt={stat.imageAlt}
                      className="h-full w-full object-cover"
                      fill
                      sizes={index === 2 ? "508px" : "532px"}
                      src={stat.imageSrc}
                    />
                  </div>
                </div>
                <p className="relative z-10 -mt-[10px] w-full max-w-full text-[34px] font-semibold uppercase leading-none tracking-[-0.6801px] text-transparent [text-shadow:none] [-webkit-text-stroke:1px_var(--color-hr-accent)]">
                  {renderMetric(stat.metric)}
                </p>
                <p className="type-paragraph mt-[10px] text-[var(--color-hr-pure-white)]">
                  {stat.detail}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="hidden lg:block">
          <div className="grid gap-8 pb-10 pt-16 lg:grid-cols-3 lg:gap-0 lg:pb-[40px] lg:pt-[114px]" data-reveal-stagger>
            {stats.map((stat, index) => (
              <article
                className="mx-auto w-full max-w-[413px] text-center text-[var(--color-hr-pure-white)]"
                key={`desktop-${stat.metric}`}
              >
                <div className="flex h-[280px] items-end justify-center min-[1360px]:h-[376px]">
                  <div
                    className={`relative overflow-hidden rounded-full ${stat.sizeClassName}`}
                  >
                    <Image
                      alt={stat.imageAlt}
                      className="h-full w-full object-cover"
                      fill
                      sizes={index === 2 ? "718px" : "752px"}
                      src={stat.imageSrc}
                    />
                  </div>
                </div>
                <p className="type-key-point relative z-10 -mt-[15px] w-full max-w-full text-transparent [text-shadow:none] [-webkit-text-stroke:1px_var(--color-hr-accent)]">
                  {renderMetric(stat.metric)}
                </p>
                <p className="type-paragraph mt-3 text-[var(--color-hr-pure-white)]">
                  {stat.detail}
                </p>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
