import { cn } from "@/lib/cn";

export type MetricTileVariant = "light" | "dark";

export interface MetricTileProps {
  value: string;
  label: string;
  className?: string;
  variant?: MetricTileVariant;
}

/**
 * Hero metric tile pattern used on case-study + podcast detail heroes.
 * Light variant: `#F4F4F4` rounded-[20px] tile with gradient number + dark label.
 * Dark variant: `#0C0C0C` tile with light gradient number + white label (used
 * inline on dark sections).
 *
 * Figma reference: case-study desktop section 01 (hero metrics 3-up).
 * Source: docs/figma-cache/extractions/2026-04-28-case-study-section-01-single-desktop.md
 */
export function MetricTile({ value, label, className, variant = "light" }: MetricTileProps) {
  const isDark = variant === "dark";
  const gradientClass = isDark ? "gradient-text-brand-light" : "gradient-text-brand";

  return (
    <div
      className={cn(
        "flex flex-col items-start rounded-[20px] px-[24px] py-[12px] lg:px-[40px]",
        isDark ? "bg-[var(--color-hr-black-box)]" : "bg-[var(--color-hr-off-white)]",
        className,
      )}
    >
      <p
        className={cn(
          "w-full font-medium text-[24px] leading-[normal] tracking-[-0.48px]",
          gradientClass,
        )}
      >
        {value}
      </p>
      <p
        className={cn(
          "type-paragraph w-full",
          isDark ? "text-[var(--color-hr-pure-white)]" : "text-[var(--color-hr-dark)]",
        )}
      >
        {label}
      </p>
    </div>
  );
}
