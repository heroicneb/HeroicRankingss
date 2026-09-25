import { SectionLabel } from "@/components/ui/section-label";
import { TwoToneHeading } from "@/components/ui/two-tone-heading";
import type { SanityCaseStudyDetail } from "@/lib/sanity-data";

type BeforeAfterData = NonNullable<SanityCaseStudyDetail["beforeAfter"]>;
type BeforeAfterItem = NonNullable<BeforeAfterData["items"]>[number];

interface CaseStudyBeforeAfterProps {
  data: BeforeAfterData | null | undefined;
  /** Legend labels, e.g. "Before - March 24" and "Present". */
  beforeLabel?: string;
  afterLabel?: string;
}

const LEGEND_PILL =
  "inline-flex items-center gap-[10px] rounded-[10px] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-pure-white)] px-[12px] py-[8px] text-[18px] leading-[24px] text-[var(--color-hr-dark)] dark:border-[var(--color-hr-dark-line)] dark:bg-[var(--color-hr-black-box)] dark:text-[var(--color-text-inverse)]";

function StatColumn({ item }: { item: BeforeAfterItem }) {
  return (
    <article className="flex w-[202px] shrink-0 flex-col">
      <p className="text-[18px] leading-[24px] text-[var(--color-hr-grey)] line-through dark:text-[var(--color-text-inverse-60)]">{item.before}</p>
      <p className="gradient-text-brand font-semibold text-[48px] leading-[62px] tracking-[-0.96px]">{item.after}</p>
      <p className="text-[18px] leading-[24px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">{item.label}</p>
    </article>
  );
}

/**
 * Before vs After (Figma 2255:1297–1332): label, two-tone heading, body,
 * two legend pills, then five 202px stat columns separated by 101px hairlines.
 * On phones the columns scroll horizontally.
 */
export function CaseStudyBeforeAfter({ data, beforeLabel = "Before", afterLabel = "Present" }: CaseStudyBeforeAfterProps) {
  if (!data) return null;
  const items = data.items ?? [];
  if (items.length === 0) return null;
  const headingMain = data.headingMain ?? "";
  const headingHighlighted = data.headingHighlighted ?? "";
  const hasHeading = Boolean(headingMain || headingHighlighted);

  return (
    <section className="px-[20px] pb-[60px] lg:px-[80px] lg:pb-[120px]" id="case-study-before-after">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-[20px]">
        {data.label ? <SectionLabel className="text-center lg:text-left">{data.label}</SectionLabel> : null}
        {hasHeading ? (
          <TwoToneHeading
            as="h2"
            className="text-center font-normal text-[28px] leading-[1.2] tracking-[-0.56px] text-[var(--color-hr-pure-black)] dark:text-[var(--color-text-inverse)] lg:text-left lg:text-[52px] lg:leading-[60px] lg:tracking-[-1.04px]"
            highlighted={headingHighlighted}
            main={headingMain}
          />
        ) : null}
        {data.body ? (
          <p className="text-center text-[16px] leading-[1.3] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] lg:text-left lg:text-[18px] lg:leading-[24px]">{data.body}</p>
        ) : null}
        <div className="flex flex-wrap justify-center gap-[10px] lg:justify-start">
          <span className={LEGEND_PILL}>
            <span aria-hidden className="size-[12px] rounded-full bg-[var(--color-hr-grey)]" />
            {beforeLabel}
          </span>
          <span className={LEGEND_PILL}>
            <span aria-hidden className="size-[12px] rounded-full bg-[var(--color-hr-accent)]" />
            {afterLabel}
          </span>
        </div>
        <div className="-mx-[20px] mt-[20px] flex overflow-x-auto px-[20px] lg:mx-0 lg:mt-[20px] lg:justify-between lg:overflow-visible lg:px-0">
          {items.map((item, index) => (
            <div className="flex shrink-0 items-center" key={item._key ?? `${item.label}-${index}`}>
              <span aria-hidden className="mr-[30px] h-[101px] w-px bg-[var(--color-hr-light-grey)] dark:bg-[var(--color-hr-dark-line)]" />
              <StatColumn item={item} />
              {index < items.length - 1 ? <span aria-hidden className="w-[30px] shrink-0" /> : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
