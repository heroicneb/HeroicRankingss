import { MobileScrollRail } from "@/components/ui/mobile-scroll-rail";
import { SectionLabel } from "@/components/ui/section-label";
import { TwoToneHeading } from "@/components/ui/two-tone-heading";
import type { SanityCaseStudyDetail } from "@/lib/sanity-data";

type JourneyTimelineData = NonNullable<
  SanityCaseStudyDetail["journeyTimeline"]
>;
type JourneyItem = NonNullable<JourneyTimelineData["items"]>[number];

interface CaseStudyJourneyProps {
  data: JourneyTimelineData | null | undefined;
}

const MOBILE_CARD_WIDTH = 320;
const MOBILE_CARD_GAP = 16;

interface JourneyStepProps {
  step: JourneyItem;
  index: number;
  isLast: boolean;
}

function JourneyStepDesktop({ step, index, isLast }: JourneyStepProps) {
  const stepNumber = String(index + 1).padStart(2, "0");
  return (
    <li className="relative flex flex-col gap-[16px]">
      <div className="flex items-center gap-[12px]">
        <span
          aria-hidden
          className="grid size-[24px] place-items-center rounded-full bg-[var(--color-hr-pure-white)] ring-2 ring-[var(--color-hr-accent)]"
        >
          <span className="size-[10px] rounded-full bg-[var(--color-hr-accent)]" />
        </span>
        {!isLast ? (
          <span
            aria-hidden
            className="h-px flex-1 bg-[var(--color-hr-light-grey)]"
          />
        ) : null}
      </div>
      <p className="gradient-text-brand font-normal text-[24px] leading-[1.2] tracking-[-0.48px]">
        {stepNumber}
      </p>
      <h3 className="font-normal text-[22px] leading-[1.2] tracking-[-0.44px] text-[var(--color-hr-pure-black)] dark:text-[var(--color-text-inverse)] lg:text-[28px] lg:tracking-[-0.56px]">
        {step.title}
      </h3>
      <p className="type-paragraph text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
        {step.body}
      </p>
    </li>
  );
}

function JourneyStepMobile({ step, index }: JourneyStepProps) {
  const stepNumber = String(index + 1).padStart(2, "0");
  return (
    <article
      className="snap-start flex shrink-0 flex-col gap-[14px] rounded-[30px] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-pure-white)] p-[28px] dark:border-[var(--color-border-inverse-10)] dark:bg-[var(--color-bg-dark)]"
      style={{ width: `${MOBILE_CARD_WIDTH}px` }}
    >
      <p className="gradient-text-brand font-normal text-[22px] leading-[1.2] tracking-[-0.44px]">
        {stepNumber}
      </p>
      <h3 className="font-normal text-[22px] leading-[1.2] tracking-[-0.44px] text-[var(--color-hr-pure-black)] dark:text-[var(--color-text-inverse)]">
        {step.title}
      </h3>
      <p className="type-paragraph text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
        {step.body}
      </p>
    </article>
  );
}

/**
 * Journey to Success timeline (Figma `2255:1042` desktop / `2255:1542` mobile).
 *
 * Desktop: horizontal timeline inside a light grey panel — line + dots
 * + step number + title + body, evenly spaced.
 * Mobile: horizontal scroll rail of step cards with progress bar indicator.
 */
export function CaseStudyJourney({ data }: CaseStudyJourneyProps) {
  if (!data) return null;
  const items = data.items ?? [];
  if (items.length === 0) return null;

  const headingMain = data.headingMain ?? "";
  const headingHighlighted = data.headingHighlighted ?? "";
  const hasHeading = Boolean(headingMain || headingHighlighted);

  const desktopColumns = `repeat(${items.length}, minmax(0, 1fr))`;

  return (
    <section
      className="px-[20px] pb-[60px] lg:px-[80px] lg:pb-[120px]"
      id="case-study-journey"
    >
      <div className="mx-auto w-full max-w-[1440px]">
        <div className="rounded-[30px] bg-[var(--color-hr-off-white)] px-[24px] py-[40px] dark:bg-[var(--color-surface-inverse-10)] lg:rounded-[40px] lg:px-[80px] lg:py-[80px]">
          {data.label ? (
            <SectionLabel className="text-center lg:text-left">
              {data.label}
            </SectionLabel>
          ) : null}

          {hasHeading ? (
            <TwoToneHeading
              as="h2"
              className="mt-[14px] max-w-[860px] text-center font-normal text-[28px] leading-[1.2] tracking-[-0.56px] text-[var(--color-hr-pure-black)] dark:text-[var(--color-text-inverse)] lg:mt-[20px] lg:text-left lg:text-[52px] lg:leading-[60px] lg:tracking-[-1.04px]"
              highlighted={headingHighlighted}
              main={headingMain}
            />
          ) : null}

          {/* Desktop horizontal timeline */}
          <ol
            className="mt-[60px] hidden gap-[40px] lg:grid"
            style={{ gridTemplateColumns: desktopColumns }}
          >
            {items.map((step, index) => (
              <JourneyStepDesktop
                key={step._key ?? `${step.title}-${index}`}
                index={index}
                isLast={index === items.length - 1}
                step={step}
              />
            ))}
          </ol>

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
                <JourneyStepMobile
                  key={`${step._key ?? `${step.title}-${index}`}-mobile`}
                  index={index}
                  isLast={index === items.length - 1}
                  step={step}
                />
              ))}
            </MobileScrollRail>
          </div>
        </div>
      </div>
    </section>
  );
}
