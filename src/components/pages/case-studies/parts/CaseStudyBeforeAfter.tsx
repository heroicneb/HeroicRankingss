import { SectionLabel } from "@/components/ui/section-label";
import { TwoToneHeading } from "@/components/ui/two-tone-heading";
import type { SanityCaseStudyDetail } from "@/lib/sanity-data";

type BeforeAfterData = NonNullable<SanityCaseStudyDetail["beforeAfter"]>;
type BeforeAfterItem = NonNullable<BeforeAfterData["items"]>[number];

interface CaseStudyBeforeAfterProps {
  data: BeforeAfterData | null | undefined;
}

function StatColumn({ item }: { item: BeforeAfterItem }) {
  return (
    <article className="flex shrink-0 flex-col items-start gap-[14px] px-[20px] lg:px-[24px]">
      <p className="text-[16px] leading-[1.2] text-[var(--color-hr-grey)] line-through dark:text-[var(--color-text-inverse-60)]">
        {item.before}
      </p>
      <p className="gradient-text-brand font-semibold text-[36px] leading-[1] tracking-[-0.72px] lg:text-[48px] lg:tracking-[-0.96px]">
        {item.after}
      </p>
      <p className="text-[16px] leading-[1.3] text-[var(--color-hr-dark)] lg:text-[18px] dark:text-[var(--color-text-inverse)]">
        {item.label}
      </p>
    </article>
  );
}

/**
 * Before vs After (Figma `2255:1297` desktop / `2255:1822` mobile).
 *
 * Section label + two-tone H2 + 2 legend pills + 5 stat columns. Each
 * column shows a strikethrough "before" value above a large gradient
 * "after" value plus its label. Desktop: horizontal row separated by
 * vertical dividers. Mobile: horizontal scroll rail.
 */
export function CaseStudyBeforeAfter({ data }: CaseStudyBeforeAfterProps) {
  if (!data) return null;
  const items = data.items ?? [];
  if (items.length === 0) return null;

  const headingMain = data.headingMain ?? "";
  const headingHighlighted = data.headingHighlighted ?? "";
  const hasHeading = Boolean(headingMain || headingHighlighted);

  return (
    <section
      className="px-[20px] pb-[60px] lg:px-[80px] lg:pb-[120px]"
      id="case-study-before-after"
    >
      <div className="mx-auto w-full max-w-[1440px]">
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

        <div className="mt-[20px] flex flex-wrap justify-center gap-[10px] lg:mt-[30px] lg:justify-start">
          <span className="inline-flex items-center gap-[8px] rounded-full border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-pure-white)] px-[16px] py-[8px] text-[14px] font-medium text-[var(--color-hr-grey)] dark:border-[var(--color-border-inverse-15)] dark:bg-[var(--color-bg-dark)] dark:text-[var(--color-text-inverse-60)]">
            <span
              aria-hidden
              className="size-[6px] rounded-full bg-[var(--color-hr-grey)]"
            />
            Before
          </span>
          <span className="inline-flex items-center gap-[8px] rounded-full border border-[var(--color-hr-accent)] bg-[var(--color-hr-pure-white)] px-[16px] py-[8px] text-[14px] font-medium text-[var(--color-hr-dark)] dark:bg-[var(--color-bg-dark)] dark:text-[var(--color-text-inverse)]">
            <span
              aria-hidden
              className="size-[6px] rounded-full bg-[var(--color-hr-accent)]"
            />
            Present
          </span>
        </div>

        <div className="mt-[40px] flex gap-0 overflow-x-auto lg:mt-[60px] lg:overflow-visible">
          {items.map((item, index) => (
            <div
              key={item._key ?? `${item.label}-${index}`}
              className={
                index < items.length - 1
                  ? "flex-1 border-r border-[var(--color-hr-light-grey)] dark:border-[var(--color-border-inverse-15)]"
                  : "flex-1"
              }
            >
              <StatColumn item={item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
