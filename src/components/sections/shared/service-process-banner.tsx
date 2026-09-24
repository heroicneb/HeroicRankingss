import { ProcessStepSwitcher } from "@/components/sections/process-step-switcher";
import { AppLink } from "@/components/ui/app-link";
import { GradientHeading } from "@/components/ui/gradient-heading";
import { GradientArrowUpRightIcon } from "@/components/ui/icons/decorative";
import { cn } from "@/lib/cn";

import type { ProcessBanner } from "@/components/pages/shared/seo-service-content";

interface ServiceProcessBannerProps {
  banner: ProcessBanner;
  /** Outer box classes (page-specific spacing/radius). */
  className?: string;
  headingClassName?: string;
  descriptionClassName?: string;
  ctaClassName?: string;
}

/**
 * "The Fastest and Most Effective way to Get Started" box: gradient heading,
 * process step pills and a CTA. Shared by the service pages; copy comes from
 * the page's CMS document.
 */
export function ServiceProcessBanner({
  banner,
  className,
  headingClassName,
  descriptionClassName = "type-paragraph mt-10 max-w-[600px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]",
  ctaClassName,
}: ServiceProcessBannerProps) {
  return (
    <section
      className={cn(
        "mt-[60px] rounded-[30px] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-pure-white)] px-[20px] py-[30px] dark:border-[var(--color-border-inverse-10)] dark:bg-[var(--color-bg-dark)] lg:mt-[120px] lg:rounded-[40px] lg:px-[30px] lg:pb-[30px] lg:pt-[30px]",
        className,
      )}
    >
      <h3
        className={cn(
          "type-h3 max-w-[1024px] pb-[4px] text-center leading-[1.3] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] lg:text-left",
          headingClassName,
        )}
      >
        <GradientHeading highlightClassName="gradient-text-brand-about-us-process-title" segments={banner.heading} />
      </h3>

      <div className="mt-[20px] lg:mt-[30px]">
        <ProcessStepSwitcher
          descriptionClassName={descriptionClassName}
          mutedPillClassName="type-paragraph whitespace-nowrap rounded-[100px] bg-[var(--color-hr-off-white)] dark:bg-[var(--color-surface-inverse-10)] px-[14px] py-[6px] text-[var(--color-hr-grey)] dark:text-[var(--color-text-inverse-60)] transition-colors hover:text-[var(--color-hr-dark)] dark:hover:text-[var(--color-text-inverse)]"
          rowClassName="flex flex-wrap items-center gap-[10px] pb-1 xl:flex-nowrap"
          steps={banner.steps}
        />
      </div>

      <AppLink
        className={cn(
          "type-cta motion-interactive motion-interactive-press mt-[30px] inline-flex h-[45px] w-full items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[var(--color-hr-accent)] bg-transparent text-[var(--color-hr-dark)] hover:bg-[var(--color-hr-off-white)] dark:text-[var(--color-text-inverse)] dark:hover:bg-[var(--color-surface-inverse-10)] lg:mt-10 lg:w-auto lg:min-w-[222px] lg:px-5",
          ctaClassName,
        )}
        href={banner.ctaUrl}
        motionPreset="none"
      >
        {banner.ctaLabel}
        <GradientArrowUpRightIcon className="size-[10px]" />
      </AppLink>
    </section>
  );
}
