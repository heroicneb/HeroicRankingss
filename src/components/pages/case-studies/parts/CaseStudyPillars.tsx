import Image from "next/image";

import { MobileScrollRail } from "@/components/ui/mobile-scroll-rail";
import type { SanityCaseStudyDetail } from "@/lib/sanity-data";
import { cn } from "@/lib/cn";
import { urlFor } from "@/sanity/lib/image";

type StrategyPillar = NonNullable<
  SanityCaseStudyDetail["strategyPillars"]
>[number];

interface CaseStudyPillarsProps {
  data: SanityCaseStudyDetail["strategyPillars"];
}

interface PillarCardProps {
  pillar: StrategyPillar;
  className?: string;
}

const MOBILE_CARD_WIDTH = 350;
const MOBILE_CARD_GAP = 10;

function getIconUrl(pillar: StrategyPillar): string | null {
  if (!pillar.icon) return null;
  try {
    return urlFor(pillar.icon).width(120).url();
  } catch {
    return null;
  }
}

function PillarCard({ pillar, className }: PillarCardProps) {
  const iconUrl = getIconUrl(pillar);
  const iconAlt = pillar.icon?.alt ?? "";
  const bullets = pillar.bullets ?? [];

  return (
    <article
      className={cn(
        "flex flex-col gap-[16px] rounded-[30px] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-pure-white)] p-[30px] dark:border-[var(--color-border-inverse-10)] dark:bg-[var(--color-bg-dark)] lg:rounded-[40px] lg:p-[40px]",
        className,
      )}
    >
      {iconUrl ? (
        <div className="flex size-[50px] items-center justify-center rounded-[12px] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-pure-white)] dark:border-[var(--color-border-inverse-10)] dark:bg-[var(--color-bg-dark)]">
          <Image alt={iconAlt} height={28} src={iconUrl} width={28} />
        </div>
      ) : null}

      <h3 className="font-normal text-[22px] leading-[1.2] tracking-[-0.44px] text-[var(--color-hr-pure-black)] dark:text-[var(--color-text-inverse)] lg:text-[32px] lg:tracking-[-0.64px]">
        {pillar.title}
      </h3>

      {pillar.intro ? (
        <p className="type-paragraph text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
          {pillar.intro}
        </p>
      ) : null}

      {bullets.length > 0 ? (
        <ul className="mt-[4px] space-y-[10px]">
          {bullets.map((bullet, index) => (
            <li
              key={index}
              className="type-paragraph flex gap-[12px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]"
            >
              <span
                aria-hidden
                className="mt-[8px] size-[5px] shrink-0 rounded-full bg-[var(--color-hr-accent)]"
              />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}

/**
 * Six Pillars of Dominant SEO (Figma `2255:972` desktop / `2255:1452` mobile).
 *
 * Desktop: 3×2 grid of white pillar cards (icon + title + intro + bullets).
 * Mobile: horizontal scroll rail (350px cards) with progress bar indicator
 * via the shared `MobileScrollRail` primitive.
 */
export function CaseStudyPillars({ data }: CaseStudyPillarsProps) {
  if (!data || data.length === 0) return null;

  return (
    <section className="pb-[60px] lg:pb-[120px]" id="case-study-pillars">
      {/* Desktop grid */}
      <div className="hidden lg:block">
        <div className="mx-auto w-full max-w-[1440px] px-[80px]">
          <div className="grid grid-cols-3 gap-[20px]">
            {data.map((pillar, index) => (
              <PillarCard
                key={pillar._key ?? `${pillar.title}-${index}`}
                pillar={pillar}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile rail */}
      <MobileScrollRail
        ariaLabel="Six Pillars of Dominant SEO"
        indicator="bar"
        indicatorAriaLabel="Pillars carousel position"
        itemCount={data.length}
        itemGap={MOBILE_CARD_GAP}
        itemWidth={MOBILE_CARD_WIDTH}
      >
        {data.map((pillar, index) => (
          <div
            key={`${pillar._key ?? `${pillar.title}-${index}`}-mobile`}
            className="snap-start"
            style={{ width: `${MOBILE_CARD_WIDTH}px` }}
          >
            <PillarCard pillar={pillar} className="h-full" />
          </div>
        ))}
      </MobileScrollRail>
    </section>
  );
}
