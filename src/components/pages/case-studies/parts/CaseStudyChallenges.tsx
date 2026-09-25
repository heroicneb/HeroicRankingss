import { SectionLabel } from "@/components/ui/section-label";
import { TwoToneHeading } from "@/components/ui/two-tone-heading";
import type { SanityCaseStudyDetail } from "@/lib/sanity-data";

type ObjectiveChallengesData = NonNullable<SanityCaseStudyDetail["objectiveChallenges"]>;
type ChallengeItem = NonNullable<ObjectiveChallengesData["items"]>[number];

interface CaseStudyChallengesProps {
  data: ObjectiveChallengesData | null | undefined;
}

const PANEL =
  "rounded-[30px] bg-[var(--color-hr-off-white)] px-[20px] py-[40px] dark:bg-[var(--color-surface-inverse-10)] lg:rounded-[40px] lg:px-[70px] lg:py-[120px]";

function ChallengeRow({ item }: { item: ChallengeItem }) {
  return (
    <div className="flex flex-col items-center gap-[16px] text-center lg:items-start lg:text-left">
      <div className="flex items-center gap-[14px]">
        <span className="gradient-text-brand flex size-[50px] shrink-0 items-center justify-center rounded-[12px] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-pure-white)] font-normal text-[32px] leading-none tracking-[-0.64px] dark:border-[var(--color-hr-dark-line)] dark:bg-[var(--color-hr-black-box)]">
          {item.number}
        </span>
        <h3 className="font-normal text-[22px] leading-[1.2] tracking-[-0.44px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] lg:text-[32px] lg:tracking-[-0.64px]">
          {item.title}
        </h3>
      </div>
      <p className="text-[16px] leading-[1.3] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] lg:text-[18px] lg:leading-[24px]">
        {item.body}
      </p>
    </div>
  );
}

/**
 * Objective & Challenges (Figma 2255:936–965): an off-white panel with the
 * label, two-tone heading and body in a left column and the numbered
 * challenges stacked in a 630px right column with hairline dividers.
 */
export function CaseStudyChallenges({ data }: CaseStudyChallengesProps) {
  if (!data) return null;
  const items = data.items ?? [];
  if (items.length === 0) return null;
  const headingMain = data.headingMain ?? "";
  const headingHighlighted = data.headingHighlighted ?? "";
  const hasHeading = Boolean(headingMain || headingHighlighted);

  return (
    <section className="pb-[60px] lg:pb-[120px]" id="case-study-challenges">
      <div className="mx-auto w-full max-w-[1440px] px-[10px]">
        <div className={PANEL}>
          <div className="grid gap-[40px] lg:grid-cols-[551px_630px] lg:justify-between lg:gap-[60px]">
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
              {data.body ? (
                <p className="max-w-[522px] text-[16px] leading-[1.3] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] lg:text-[18px] lg:leading-[24px]">
                  {data.body}
                </p>
              ) : null}
            </div>
            <div className="flex flex-col gap-[36px] lg:pt-[53px]">
              {items.map((item, index) => (
                <div
                  className={index < items.length - 1 ? "border-b border-[var(--color-hr-light-grey)] pb-[36px] dark:border-[var(--color-hr-dark-line)]" : undefined}
                  key={item._key ?? `${item.number}-${index}`}
                >
                  <ChallengeRow item={item} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
