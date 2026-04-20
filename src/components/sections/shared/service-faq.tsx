import type { ReactNode } from "react";
import { Suspense } from "react";

import { FaqSchema } from "@/components/seo/faq-schema";
import { GradientText } from "@/components/ui/gradient-text";
import { SectionLabel } from "@/components/ui/section-label";
import { PAGE_SHELL_CLASS } from "@/data/service-shared";
import { cn } from "@/lib/cn";

export interface ServiceFaqItem {
  question: string;
  answer: string;
  defaultOpen: boolean;
}

export interface ServiceFaqProps {
  /** Content rendered inside each answer div, after the answer text */
  answerExtra?: (item: ServiceFaqItem, index: number) => ReactNode;
  /** Class applied to the answer content wrapper */
  answerClassName?: string;
  /** Class applied to the accordion container div */
  containerClassName?: string;
  /** Extra content rendered inside the accordion container (e.g. background images) */
  containerExtra?: ReactNode;
  /** Class applied to each <details> element */
  detailsClassName?: string;
  /** Extra content rendered after <summary> inside each <details> (e.g. divider images) */
  detailsExtra?: (index: number) => ReactNode;
  /** Class applied to each <summary> element (merged with defaults) */
  headingClassName?: string;
  items: readonly ServiceFaqItem[];
  /** Class applied to the outer background wrapper */
  outerClassName?: string;
  /** Icon rendered in the summary toggle area */
  renderIcon: ReactNode;
  sectionId: string;
  /** Class applied to non-first summary borders (merged via cn) */
  summaryBorderClassName?: string;
  /** Class applied to the <summary> row */
  summaryClassName?: string;
}

export function ServiceFaq({
  answerExtra,
  answerClassName = "border-b border-[var(--color-hr-light-grey)] dark:border-[var(--color-border-inverse-10)] px-[30px] pb-[30px] pr-[60px] sm:pr-[90px] lg:pr-[223px]",
  containerClassName = "mt-[80px] overflow-hidden rounded-[40px] border border-[var(--color-hr-light-grey)] dark:border-[var(--color-border-inverse-10)] bg-[var(--color-hr-pure-white)] dark:bg-[var(--color-bg-dark)]",
  containerExtra,
  detailsClassName = "group",
  detailsExtra,
  headingClassName = "type-h3 text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]",
  items,
  outerClassName = "rounded-[40px] bg-[var(--color-hr-off-white)] dark:bg-[var(--color-bg-dark)] px-5 pb-[70px] pt-[60px] lg:pt-[120px] sm:px-8 lg:px-[70px]",
  renderIcon,
  sectionId,
  summaryBorderClassName = "border-t border-[var(--color-hr-light-grey)] dark:border-[var(--color-border-inverse-10)]",
  summaryClassName = "flex cursor-pointer list-none items-center justify-between gap-5 px-[30px] py-[30px] [&::-webkit-details-marker]:hidden",
}: ServiceFaqProps) {
  return (
    <section className="pt-[60px] lg:pt-[120px]" id={sectionId}>
      <Suspense fallback={null}>
        <FaqSchema items={items} />
      </Suspense>
      <div className={PAGE_SHELL_CLASS}>
        <div className={outerClassName}>
          <SectionLabel>/  Find Your Answers  /</SectionLabel>
          <h2 className="type-h2 mt-5 max-w-[406px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
            Frequently Asked <GradientText className="gradient-text-brand-trust">Questions</GradientText>
          </h2>

          <div className={containerClassName}>
            {containerExtra}
            {items.map((item, index) => (
              <details
                className={detailsClassName}
                key={item.question}
                open={item.defaultOpen || undefined}
              >
                <summary
                  className={cn(
                    summaryClassName,
                    index !== 0 ? summaryBorderClassName : "",
                  )}
                >
                  <h3 className={headingClassName}>{item.question}</h3>
                  {renderIcon}
                </summary>
                {detailsExtra?.(index)}

                {item.answer ? (
                  <div className={answerClassName}>
                    <p className="type-paragraph max-w-[1007px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">{item.answer}</p>
                    {answerExtra?.(item, index)}
                  </div>
                ) : null}
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
