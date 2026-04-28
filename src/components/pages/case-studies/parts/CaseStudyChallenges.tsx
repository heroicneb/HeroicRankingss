import { NumberedStepCard } from "@/components/ui/numbered-step-card";
import { SectionLabel } from "@/components/ui/section-label";
import { TwoToneHeading } from "@/components/ui/two-tone-heading";
import type { SanityCaseStudyDetail } from "@/lib/sanity-data";

type ObjectiveChallengesData = NonNullable<
  SanityCaseStudyDetail["objectiveChallenges"]
>;

interface CaseStudyChallengesProps {
  data: ObjectiveChallengesData | null | undefined;
}

/**
 * Objective & Challenges panel (Figma `2255:936` desktop / `2255:1420` mobile).
 *
 * Light grey rounded panel with section label + two-tone H2 + 3 numbered
 * cards rendered via the `NumberedStepCard` primitive. Cards stack
 * vertically on mobile with horizontal dividers; desktop renders a 3-up
 * grid with vertical dividers between cards.
 */
export function CaseStudyChallenges({ data }: CaseStudyChallengesProps) {
  if (!data) return null;
  const items = data.items ?? [];
  if (items.length === 0) return null;

  const headingMain = data.headingMain ?? "";
  const headingHighlighted = data.headingHighlighted ?? "";
  const hasHeading = Boolean(headingMain || headingHighlighted);

  return (
    <section
      className="px-[20px] pb-[60px] lg:px-[80px] lg:pb-[120px]"
      id="case-study-challenges"
    >
      <div className="mx-auto w-full max-w-[1440px]">
        <div className="rounded-[30px] bg-[var(--color-hr-off-white)] px-[24px] py-[40px] lg:rounded-[40px] lg:px-[80px] lg:py-[80px]">
          {data.label ? (
            <SectionLabel className="text-center lg:text-left">
              {data.label}
            </SectionLabel>
          ) : null}

          {hasHeading ? (
            <TwoToneHeading
              as="h2"
              className="mt-[14px] max-w-[860px] text-center font-normal text-[28px] leading-[1.2] tracking-[-0.56px] lg:mt-[20px] lg:text-left lg:text-[52px] lg:leading-[60px] lg:tracking-[-1.04px] text-[var(--color-hr-pure-black)] dark:text-[var(--color-text-inverse)]"
              highlighted={headingHighlighted}
              main={headingMain}
            />
          ) : null}

          {data.body ? (
            <p className="mt-[20px] max-w-[860px] text-center text-[16px] leading-[1.3] text-[var(--color-hr-dark)] lg:mt-[30px] lg:text-left lg:text-[18px] lg:leading-[24px] dark:text-[var(--color-text-inverse)]">
              {data.body}
            </p>
          ) : null}

          <div className="mt-[40px] flex flex-col gap-[40px] lg:mt-[60px] lg:grid lg:grid-cols-3 lg:gap-[40px]">
            {items.map((item, index) => (
              <div
                key={`${item.number}-${index}`}
                className={
                  index < items.length - 1
                    ? "border-b border-[var(--color-hr-light-grey)] pb-[40px] lg:border-b-0 lg:border-r lg:pb-0 lg:pr-[40px]"
                    : undefined
                }
              >
                <NumberedStepCard
                  body={item.body}
                  number={item.number}
                  title={item.title}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
