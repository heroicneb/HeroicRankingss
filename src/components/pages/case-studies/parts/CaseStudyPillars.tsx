import Image from "next/image";

import { MobileScrollRail } from "@/components/ui/mobile-scroll-rail";
import { SectionLabel } from "@/components/ui/section-label";
import { TwoToneHeading } from "@/components/ui/two-tone-heading";
import { cn } from "@/lib/cn";
import type { SanityCaseStudyDetail } from "@/lib/sanity-data";
import { urlFor } from "@/sanity/lib/image";

type StrategyPillar = NonNullable<SanityCaseStudyDetail["strategyPillars"]>[number];

export interface StrategyIntro {
  label?: string | null;
  headingMain?: string | null;
  headingHighlighted?: string | null;
  highlightPosition?: "leading" | "trailing" | null;
  body?: string | null;
}

interface CaseStudyPillarsProps {
  data: SanityCaseStudyDetail["strategyPillars"];
  intro?: StrategyIntro | null;
}

const MOBILE_CARD_WIDTH = 350;
const MOBILE_CARD_GAP = 5;

function getIconUrl(pillar: StrategyPillar): string | null {
  if (!pillar.icon) return null;
  try {
    return urlFor(pillar.icon).width(120).url();
  } catch {
    return null;
  }
}

function PillarCard({ pillar, className }: { pillar: StrategyPillar; className?: string }) {
  const iconUrl = getIconUrl(pillar);
  const bullets = pillar.bullets ?? [];
  return (
    <article
      className={cn(
        "flex flex-col rounded-[30px] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-pure-white)] p-[30px] dark:border-[var(--color-hr-dark-line)] dark:bg-[var(--color-hr-black-box)] lg:min-h-[403px] lg:rounded-[40px]",
        className,
      )}
    >
      <div className="flex size-[50px] items-center justify-center rounded-[12px] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-pure-white)] dark:border-[var(--color-hr-dark-line)] dark:bg-[var(--color-hr-black-box)]">
        {iconUrl ? <Image alt={pillar.icon?.alt ?? ""} className="dark:invert" height={34} src={iconUrl} width={34} /> : null}
      </div>
      <h3 className="mt-[25px] font-normal text-[32px] leading-[1.2] tracking-[-0.64px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
        {pillar.title}
      </h3>
      {pillar.intro ? (
        <p className="mt-[16px] text-[18px] leading-[24px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">{pillar.intro}</p>
      ) : null}
      {bullets.length > 0 ? (
        <ul className="mt-[15px] list-disc space-y-[5px] pl-[27px] text-[18px] leading-[24px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
          {bullets.map((bullet, index) => (
            <li key={index}>{bullet}</li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}

/**
 * Strategy pillars (Figma 2255:940, 2255:972, 2255:966–1041): label, a
 * two-tone heading beside a 630px paragraph, then a 3×2 grid of bordered
 * cards with a 50px icon tile, 32px title, intro and disc bullets.
 * On phones the cards become a horizontal rail with a progress bar.
 */
export function CaseStudyPillars({ data, intro }: CaseStudyPillarsProps) {
  if (!data || data.length === 0) return null;
  const headingMain = intro?.headingMain ?? "";
  const headingHighlighted = intro?.headingHighlighted ?? "";
  const hasHeading = Boolean(headingMain || headingHighlighted);
  const hasIntro = Boolean(intro?.label || hasHeading || intro?.body);

  return (
    <section className="pb-[60px] lg:pb-[120px]" id="case-study-pillars">
      {hasIntro ? (
        <div className="mx-auto w-full max-w-[1440px] px-[20px] lg:px-[80px]">
          {intro?.label ? <SectionLabel className="text-center lg:text-left">{intro.label}</SectionLabel> : null}
          <div className="mt-[20px] flex flex-col items-center gap-[20px] text-center lg:flex-row lg:items-start lg:justify-between lg:gap-[60px] lg:text-left">
            {hasHeading ? (
              <TwoToneHeading
                as="h2"
                className="max-w-[413px] shrink-0 font-normal text-[28px] leading-[1.2] tracking-[-0.56px] text-[var(--color-hr-pure-black)] dark:text-[var(--color-text-inverse)] lg:text-[52px] lg:leading-[60px] lg:tracking-[-1.04px]"
                highlightPosition={intro?.highlightPosition ?? "leading"}
                highlighted={headingHighlighted}
                main={headingMain}
              />
            ) : null}
            {intro?.body ? (
              <p className="max-w-[630px] text-[16px] leading-[1.3] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] lg:text-[18px] lg:leading-[24px]">{intro.body}</p>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className={cn("hidden lg:block", hasIntro ? "mt-[120px]" : undefined)}>
        <div className="mx-auto w-full max-w-[1440px] px-[80px]">
          <div className="grid grid-cols-3 gap-[20px]">
            {data.map((pillar, index) => (
              <PillarCard key={pillar._key ?? `${pillar.title}-${index}`} pillar={pillar} />
            ))}
          </div>
        </div>
      </div>

      <div className={cn("lg:hidden", hasIntro ? "mt-[40px]" : undefined)}>
        <MobileScrollRail
          ariaLabel="Strategy pillars"
          indicator="bar"
          indicatorAriaLabel="Pillars carousel position"
          itemCount={data.length}
          itemGap={MOBILE_CARD_GAP}
          itemWidth={MOBILE_CARD_WIDTH}
        >
          {data.map((pillar, index) => (
            <div className="snap-start" key={`${pillar._key ?? `${pillar.title}-${index}`}-mobile`} style={{ width: `${MOBILE_CARD_WIDTH}px` }}>
              <PillarCard className="h-full" pillar={pillar} />
            </div>
          ))}
        </MobileScrollRail>
      </div>
    </section>
  );
}
