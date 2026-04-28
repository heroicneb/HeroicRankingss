import { cn } from "@/lib/cn";

export interface NumberedStepCardProps {
  number: string;
  title: string;
  body: string;
  className?: string;
}

/**
 * Numbered step card with circular icon-box overlapped by a gradient digit,
 * a title to the right, and body copy below.
 *
 * Used in the case study Objective & Challenges section + Six Pillars step
 * indicators. Mobile centers the heading row; desktop (`lg:`) keeps it left-
 * aligned per Figma `2255:936` / `2255:1420`.
 *
 * Source: docs/figma-cache/extractions/2026-04-28-case-study-section-01-single-desktop.md
 */
export function NumberedStepCard({ number, title, body, className }: NumberedStepCardProps) {
  return (
    <div className={cn("flex flex-col gap-[16px] text-center lg:text-left", className)}>
      <div className="flex items-center gap-[14px] justify-center lg:justify-start">
        <div className="relative grid place-items-start shrink-0">
          <div
            aria-hidden="true"
            className="col-start-1 row-start-1 size-[50px] rounded-[12px] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-pure-white)]"
          />
          <p
            className={cn(
              "gradient-text-brand col-start-1 row-start-1 ml-[9px] mt-[8px] whitespace-nowrap font-normal leading-[1.2] tracking-[-0.64px] text-[32px]",
            )}
          >
            {number}
          </p>
        </div>
        <p className="font-normal text-[22px] lg:text-[32px] leading-[1.2] tracking-[-0.64px] text-[var(--color-hr-dark)]">
          {title}
        </p>
      </div>
      <p className="type-paragraph text-[var(--color-hr-dark)]">{body}</p>
    </div>
  );
}
