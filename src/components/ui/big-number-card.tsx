import Image from "next/image";

import { cn } from "@/lib/cn";

export interface BigNumberCardProps {
  value: string;
  label: string;
  sub?: string;
  iconSrc?: string;
  iconAlt?: string;
  className?: string;
}

/**
 * Dark metric card used in the case study "Numbers That Matter" section.
 *
 * Figma sizes:
 * - Mobile: 350×472, padding 39px (rail card)
 * - Desktop (`lg:`): 305×405, padding 0 (grid item, padded by parent grid)
 *
 * Surface: `#0C0C0C` (`--color-hr-black-box`) with `#2A2A2A` (`--color-hr-dark-line`)
 * border, rounded-[40px]. Number renders in the lighter pink-tinted gradient
 * (`gradient-text-brand-light`) appropriate for dark surfaces; label is white;
 * sub-caption uses the same light gradient.
 *
 * Source: docs/figma-cache/extractions/2026-04-28-case-study-section-01-single-desktop.md
 */
export function BigNumberCard({
  value,
  label,
  sub,
  iconSrc,
  iconAlt = "",
  className,
}: BigNumberCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-start gap-[24px] rounded-[40px] border border-[var(--color-hr-dark-line)] bg-[var(--color-hr-black-box)] p-[39px] lg:p-[24px]",
        "h-[472px] w-[350px] lg:h-[405px] lg:w-[305px]",
        className,
      )}
    >
      {iconSrc ? (
        <div className="flex size-[80px] items-center justify-center rounded-[12px] border border-[var(--color-hr-dark-line)] bg-[var(--color-hr-black-box)]">
          <Image alt={iconAlt} height={48} src={iconSrc} width={48} />
        </div>
      ) : (
        <div
          aria-hidden="true"
          className="size-[80px] rounded-[12px] border border-[var(--color-hr-dark-line)] bg-[var(--color-hr-black-box)]"
        />
      )}

      <p className="gradient-text-brand-light font-extrabold leading-[1] tracking-[-1.6px] text-[80px]">
        {value}
      </p>

      <p className="font-medium text-[var(--color-hr-pure-white)] leading-[1.2] tracking-[-0.64px] text-[24px] lg:text-[32px]">
        {label}
      </p>

      {sub ? (
        <p className="gradient-text-brand-light leading-[1.33] text-[18px]">{sub}</p>
      ) : null}
    </div>
  );
}
