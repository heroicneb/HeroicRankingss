import Image from "next/image";

import { MobileScrollRail } from "@/components/ui/mobile-scroll-rail";
import { SectionLabel } from "@/components/ui/section-label";
import { TwoToneHeading } from "@/components/ui/two-tone-heading";
import { cn } from "@/lib/cn";
import type { CaseStudyGrowthChartData, SanityCaseStudyDetail } from "@/lib/sanity-data";
import { urlFor } from "@/sanity/lib/image";

import { CaseStudyGrowthChart } from "./CaseStudyGrowthChart";

type NumbersData = NonNullable<SanityCaseStudyDetail["numbersThatMatter"]>;
type NumberItem = NonNullable<NumbersData["items"]>[number];

interface CaseStudyNumbersProps {
  data: NumbersData | null | undefined;
  /** Rendered inside the same dark panel, below the cards, as in the frame. */
  chart?: CaseStudyGrowthChartData | null;
}

const MOBILE_CARD_WIDTH = 350;
const MOBILE_CARD_GAP = 5;

function getIconUrl(item: NumberItem): string | undefined {
  if (!item.icon) return undefined;
  try {
    return urlFor(item.icon).width(160).url();
  } catch {
    return undefined;
  }
}

/** Dark metric card (Figma 2255:1070–1147): 305×405, everything centred. */
function NumberCard({ item, className }: { item: NumberItem; className?: string }) {
  const iconUrl = getIconUrl(item);
  return (
    <article
      className={cn(
        "flex w-[350px] flex-col items-center rounded-[40px] border border-[var(--color-hr-dark-line)] bg-[var(--color-hr-black-box)] px-[20px] py-[40px] text-center lg:w-auto",
        className,
      )}
    >
      <div className="flex size-[80px] items-center justify-center rounded-[12px] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-dark)]">
        {iconUrl ? <Image alt={item.icon?.alt ?? ""} height={44} src={iconUrl} width={44} /> : null}
      </div>
      <p className="gradient-text-brand-light mt-[40px] font-extrabold text-[80px] leading-[normal] tracking-[-1.6px]">{item.value}</p>
      <p className="min-h-[90px] w-full font-normal text-[32px] leading-[1.2] tracking-[-0.64px] text-[var(--color-hr-pure-white)]">{item.label}</p>
      {item.sub ? <p className="gradient-text-brand-light text-[18px] leading-[24px]">{item.sub}</p> : null}
    </article>
  );
}

/**
 * The Numbers That Matter (Figma 2255:1066–1250): a dark panel with the
 * label, a narrow two-tone heading beside the body paragraph, a 4-column grid
 * of metric cards and, 80px below, the growth chart inside the same panel.
 */
export function CaseStudyNumbers({ data, chart }: CaseStudyNumbersProps) {
  if (!data) return null;
  const items = data.items ?? [];
  if (items.length === 0) return null;
  const headingMain = data.headingMain ?? "";
  const headingHighlighted = data.headingHighlighted ?? "";
  const hasHeading = Boolean(headingMain || headingHighlighted);

  return (
    <section className="pb-[60px] lg:pb-[120px]" id="case-study-numbers">
      <div className="mx-auto w-full max-w-[1440px] px-[10px]">
        <div className="rounded-[30px] bg-[var(--color-hr-dark)] px-[20px] py-[40px] lg:rounded-[40px] lg:px-[70px] lg:py-[120px]">
          {data.label ? <SectionLabel className="text-center text-[var(--color-hr-pure-white)] lg:text-left">{data.label}</SectionLabel> : null}
          <div className="mt-[20px] flex flex-col items-center gap-[20px] text-center lg:grid lg:grid-cols-[minmax(325px,520px)_minmax(0,847px)] lg:items-start lg:justify-between lg:gap-[40px] lg:text-left">
            {hasHeading ? (
              <TwoToneHeading
                as="h2"
                className="font-normal text-[28px] leading-[1.2] tracking-[-0.56px] text-[var(--color-hr-pure-white)] lg:text-[52px] lg:leading-[60px] lg:tracking-[-1.04px]"
                gradientClass="gradient-text-brand-light"
                highlighted={headingHighlighted}
                main={headingMain}
              />
            ) : null}
            {data.body ? <p className="text-[16px] leading-[1.3] text-[var(--color-hr-pure-white)] lg:pt-[12px] lg:text-[18px] lg:leading-[24px]">{data.body}</p> : null}
          </div>

          {/* Desktop grid */}
          <div className="mt-[120px] hidden gap-[20px] lg:grid lg:grid-cols-4">
            {items.map((item, index) => (
              <NumberCard item={item} key={item._key ?? `${item.label}-${index}`} />
            ))}
          </div>

          {/* Mobile rail */}
          <div className="mt-[40px] lg:hidden">
            <MobileScrollRail
              ariaLabel="Numbers That Matter"
              indicator="bar"
              indicatorAriaLabel="Numbers carousel position"
              itemCount={items.length}
              itemGap={MOBILE_CARD_GAP}
              itemWidth={MOBILE_CARD_WIDTH}
            >
              {items.map((item, index) => (
                <NumberCard className="snap-start" item={item} key={`${item._key ?? `${item.label}-${index}`}-mobile`} />
              ))}
            </MobileScrollRail>
          </div>

          <CaseStudyGrowthChart data={chart} />
        </div>
      </div>
    </section>
  );
}
