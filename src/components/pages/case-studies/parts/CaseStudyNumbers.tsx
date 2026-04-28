import { BigNumberCard } from "@/components/ui/big-number-card";
import { MobileScrollRail } from "@/components/ui/mobile-scroll-rail";
import { SectionLabel } from "@/components/ui/section-label";
import { TwoToneHeading } from "@/components/ui/two-tone-heading";
import type { SanityCaseStudyDetail } from "@/lib/sanity-data";
import { urlFor } from "@/sanity/lib/image";

type NumbersData = NonNullable<SanityCaseStudyDetail["numbersThatMatter"]>;
type NumberItem = NonNullable<NumbersData["items"]>[number];

interface CaseStudyNumbersProps {
  data: NumbersData | null | undefined;
}

const MOBILE_CARD_WIDTH = 350;
const MOBILE_CARD_GAP = 10;

function getIconUrl(item: NumberItem): string | undefined {
  if (!item.icon) return undefined;
  try {
    return urlFor(item.icon).width(160).url();
  } catch {
    return undefined;
  }
}

/**
 * The Numbers That Matter — dark `#151419` panel (Figma `2255:1066` desktop /
 * `2255:1570` mobile).
 *
 * Section label + two-tone H2 (white + light gradient) + body + 8 metric
 * cards. Desktop: 4×2 grid of `BigNumberCard` primitives. Mobile: horizontal
 * scroll rail with progress bar indicator.
 */
export function CaseStudyNumbers({ data }: CaseStudyNumbersProps) {
  if (!data) return null;
  const items = data.items ?? [];
  if (items.length === 0) return null;

  const headingMain = data.headingMain ?? "";
  const headingHighlighted = data.headingHighlighted ?? "";
  const hasHeading = Boolean(headingMain || headingHighlighted);

  return (
    <section
      className="px-[20px] pb-[40px] pt-[40px] lg:px-[80px] lg:pb-[60px] lg:pt-[80px]"
      id="case-study-numbers"
    >
      <div className="mx-auto w-full max-w-[1440px]">
        <div className="rounded-[30px] bg-[var(--color-hr-dark)] px-[24px] py-[40px] lg:rounded-[40px] lg:px-[80px] lg:py-[80px]">
          {data.label ? (
            <SectionLabel className="text-center text-[var(--color-hr-pure-white)] lg:text-left dark:text-[var(--color-text-inverse)]">
              {data.label}
            </SectionLabel>
          ) : null}

          {hasHeading ? (
            <TwoToneHeading
              as="h2"
              className="mt-[14px] max-w-[860px] text-center font-normal text-[28px] leading-[1.2] tracking-[-0.56px] text-[var(--color-hr-pure-white)] lg:mt-[20px] lg:text-left lg:text-[52px] lg:leading-[60px] lg:tracking-[-1.04px]"
              gradientClass="gradient-text-brand-light"
              highlighted={headingHighlighted}
              main={headingMain}
            />
          ) : null}

          {data.body ? (
            <p className="mt-[20px] max-w-[900px] text-center text-[16px] leading-[1.3] text-[var(--color-hr-pure-white)] lg:mt-[30px] lg:text-left lg:text-[18px] lg:leading-[24px]">
              {data.body}
            </p>
          ) : null}

          {/* Desktop grid (4-up; 2 rows when 8 items) */}
          <div className="mt-[40px] hidden gap-[20px] lg:mt-[60px] lg:grid lg:grid-cols-4">
            {items.map((item, index) => (
              <BigNumberCard
                key={`${item.label}-${index}`}
                className="!h-auto !w-full"
                iconAlt={item.icon?.alt ?? ""}
                iconSrc={getIconUrl(item)}
                label={item.label}
                sub={item.sub ?? undefined}
                value={item.value}
              />
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
                <BigNumberCard
                  key={`${item.label}-${index}-mobile`}
                  className="snap-start"
                  iconAlt={item.icon?.alt ?? ""}
                  iconSrc={getIconUrl(item)}
                  label={item.label}
                  sub={item.sub ?? undefined}
                  value={item.value}
                />
              ))}
            </MobileScrollRail>
          </div>
        </div>
      </div>
    </section>
  );
}
