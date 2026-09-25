import { MobileScrollRail } from "@/components/ui/mobile-scroll-rail";
import { SectionLabel } from "@/components/ui/section-label";
import { TwoToneHeading } from "@/components/ui/two-tone-heading";
import type { SanityCaseStudyDetail } from "@/lib/sanity-data";

type JourneyTimelineData = NonNullable<SanityCaseStudyDetail["journeyTimeline"]>;
type JourneyItem = NonNullable<JourneyTimelineData["items"]>[number];

interface CaseStudyJourneyProps {
  data: JourneyTimelineData | null | undefined;
}

const MOBILE_CARD_WIDTH = 350;
const MOBILE_CARD_GAP = 5;

function JourneyStepMobile({ step }: { step: JourneyItem }) {
  return (
    <article
      className="flex shrink-0 snap-start flex-col rounded-[30px] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-pure-white)] p-[30px] dark:border-[var(--color-hr-dark-line)] dark:bg-[var(--color-hr-black-box)]"
      style={{ width: `${MOBILE_CARD_WIDTH}px` }}
    >
      <h3 className="font-normal text-[32px] leading-[1.2] tracking-[-0.64px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">{step.title}</h3>
      <p className="mt-[16px] text-[16px] leading-[1.3] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">{step.body}</p>
    </article>
  );
}

/**
 * Journey to Success (Figma 2255:1042–1065): off-white panel with label and
 * two-tone heading, then a horizontal timeline — one 2px hairline across the
 * full width, a 30px dot per step (the first filled with the brand gradient,
 * the rest light grey) and, 40px below, an 80px title slot and the body.
 * Steps share the width equally; on phones they become a card rail.
 */
export function CaseStudyJourney({ data }: CaseStudyJourneyProps) {
  if (!data) return null;
  const items = data.items ?? [];
  if (items.length === 0) return null;
  const headingMain = data.headingMain ?? "";
  const headingHighlighted = data.headingHighlighted ?? "";
  const hasHeading = Boolean(headingMain || headingHighlighted);

  return (
    <section className="pb-[20px]" id="case-study-journey">
      <div className="mx-auto w-full max-w-[1440px] px-[10px]">
        <div className="rounded-[30px] bg-[var(--color-hr-off-white)] px-[20px] py-[40px] dark:bg-[var(--color-surface-inverse-10)] lg:rounded-[40px] lg:px-[70px] lg:py-[120px]">
          <div className="flex flex-col items-center gap-[20px] text-center lg:items-start lg:text-left">
            {data.label ? <SectionLabel>{data.label}</SectionLabel> : null}
            {hasHeading ? (
              <TwoToneHeading
                as="h2"
                className="font-normal text-[28px] leading-[1.2] tracking-[-0.56px] text-[var(--color-hr-pure-black)] dark:text-[var(--color-text-inverse)] lg:text-[52px] lg:leading-[60px] lg:tracking-[-1.04px]"
                highlighted={headingHighlighted}
                main={headingMain}
              />
            ) : null}
          </div>

          {/* Desktop timeline */}
          <div className="relative mt-[120px] hidden lg:block">
            <span aria-hidden className="absolute left-0 right-0 top-[14px] h-[2px] bg-[var(--color-hr-light-grey)] dark:bg-[var(--color-hr-dark-line)]" />
            <ol className="relative grid gap-[48px]" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
              {items.map((step, index) => (
                <li className="flex flex-col" key={step._key ?? `${step.title}-${index}`}>
                  <span
                    aria-hidden
                    className={
                      index === 0
                        ? "size-[30px] rounded-full bg-[linear-gradient(226.57deg,var(--color-brand-gradient-stop-1)_18.303%,var(--color-brand-gradient-stop-2)_40.658%,var(--color-brand-gradient-stop-3)_129.53%)]"
                        : "size-[30px] rounded-full bg-[var(--color-hr-light-grey)] dark:bg-[var(--color-hr-dark-line)]"
                    }
                  />
                  <h3 className="mt-[40px] min-h-[80px] font-normal text-[32px] leading-[1.2] tracking-[-0.64px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
                    {step.title}
                  </h3>
                  <p className="text-[18px] leading-[24px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* Mobile rail */}
          <div className="mt-[40px] lg:hidden">
            <MobileScrollRail
              ariaLabel="Journey to Success"
              indicator="bar"
              indicatorAriaLabel="Journey carousel position"
              itemCount={items.length}
              itemGap={MOBILE_CARD_GAP}
              itemWidth={MOBILE_CARD_WIDTH}
            >
              {items.map((step, index) => (
                <JourneyStepMobile key={`${step._key ?? `${step.title}-${index}`}-mobile`} step={step} />
              ))}
            </MobileScrollRail>
          </div>
        </div>
      </div>
    </section>
  );
}
