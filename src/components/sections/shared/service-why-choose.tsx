import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";

import { AppLink } from "@/components/ui/app-link";
import { GradientText } from "@/components/ui/gradient-text";
import { SectionLabel } from "@/components/ui/section-label";
import { PAGE_SHELL_CLASS } from "@/data/service-shared";
import { cn } from "@/lib/cn";

export interface WhyChooseIconItem {
  title: string;
  description: string;
  iconSrc: string;
  iconWidth: number;
  iconHeight: number;
  /** Optional CSS class applied directly to the Image element (e.g. "size-[50px]", "h-[31px] w-auto"). */
  iconClassName?: string;
  /** Optional inline style for icon sizing (e.g. { height: "29px", width: "29px" }). */
  iconStyle?: CSSProperties;
  titleWidthClass?: string;
  descriptionWidthClass?: string;
}

export interface ServiceWhyChooseProps {
  sectionId: string;
  items: readonly WhyChooseIconItem[];
  /** CSS class for the icon Image, applied before item-specific iconClassName. Default: "block dark:brightness-0 dark:invert" */
  iconBaseClassName?: string;
  /** CSS class on the grid container. */
  gridClassName?: string;
  /** Render a per-item divider image above the icon (e.g. link-building). */
  dividerSrc?: string;
  /** Whether to render the CTA cell at the end. Default true. */
  showCta?: boolean;
  /** Icon rendered inside the CTA button. */
  ctaIcon?: ReactNode;
  /** CSS class on the outer rounded wrapper div. */
  outerClassName?: string;
  /** CSS class on the outer <section> element. Default: "pt-[60px] lg:pt-[120px]" */
  sectionClassName?: string;
  /** Override the default heading. By default renders "Why Choose Heroic Rankings?" */
  heading?: ReactNode;
  /** Base CSS class on the description <p>. Default includes max-w-[302px]. */
  descriptionBaseClassName?: string;
  /** Section label text. Default: "/  Guided by Results  /" */
  label?: string;
  /** CTA cell title. Default: "Take Your SEO To The Next Level" */
  ctaTitle?: string;
  /** CTA button label. Default: "Take the First Step Today" */
  ctaLabel?: string;
  /** CTA button link. Default: /contact */
  ctaHref?: string;
}

export function ServiceWhyChoose({
  sectionId,
  items,
  iconBaseClassName = "block dark:brightness-0 dark:invert",
  gridClassName = "mt-[80px] grid grid-cols-1 gap-y-[56px] md:grid-cols-2 lg:grid-cols-3",
  dividerSrc,
  showCta = true,
  ctaIcon,
  outerClassName = "rounded-[40px] bg-[var(--color-hr-off-white)] dark:bg-[var(--color-bg-dark)] px-5 pb-[60px] lg:pb-[120px] pt-[60px] lg:pt-[120px] sm:px-8 lg:px-[70px]",
  sectionClassName = "pt-[60px] lg:pt-[120px]",
  heading,
  descriptionBaseClassName = "type-paragraph mt-[10px] max-w-[302px] text-[var(--color-hr-grey)] dark:text-[var(--color-text-inverse-50)]",
  label = "/  Guided by Results  /",
  ctaTitle = "Take Your SEO To The Next Level",
  ctaLabel = "Take the First Step Today",
  ctaHref = "/contact",
}: ServiceWhyChooseProps) {
  return (
    <section className={sectionClassName} id={sectionId}>
      <div className={PAGE_SHELL_CLASS}>
        <div className={outerClassName}>
          <SectionLabel>{label}</SectionLabel>
          <h2 className="type-h2 mt-5 max-w-[406px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
            {heading ?? <>Why Choose Heroic <GradientText className="gradient-text-brand-trust">Rankings?</GradientText></>}
          </h2>

          <div className={gridClassName}>
            {items.map((item) => (
              <article className="border-l border-[var(--color-hr-light-grey)] dark:border-[var(--color-border-inverse-10)] pl-[30px]" key={item.title}>
                {dividerSrc ? (
                  <Image
                    alt=""
                    aria-hidden
                    className="mb-[15px] h-px w-[159px]"
                    height={1}
                    src={dividerSrc}
                    width={159}
                  />
                ) : null}
                <div className="flex items-center justify-center size-[50px] rounded-[12px] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-pure-white)] dark:border-[var(--color-border-inverse-10)] dark:bg-[var(--color-bg-dark)]">
                  <Image
                    alt=""
                    aria-hidden
                    className={cn(iconBaseClassName, item.iconClassName)}
                    height={item.iconHeight}
                    src={item.iconSrc}
                    style={item.iconStyle}
                    width={item.iconWidth}
                  />
                </div>
                <h3 className={cn("type-h3 mt-[15px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]", item.titleWidthClass)}>{item.title}</h3>
                <p className={cn(descriptionBaseClassName, item.descriptionWidthClass)}>
                  {item.description}
                </p>
              </article>
            ))}

            {showCta ? (
              <article className="border-l border-[var(--color-hr-light-grey)] dark:border-[var(--color-border-inverse-10)] pl-[30px]">
                <h3 className="type-h3 max-w-[257px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">{ctaTitle}</h3>
                <AppLink
                  className="type-cta motion-interactive motion-interactive-press mt-[30px] inline-flex h-[45px] w-[249px] items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[var(--color-hr-accent)] bg-transparent text-[var(--color-hr-dark)] hover:bg-[var(--color-hr-off-white)] dark:text-[var(--color-text-inverse)] dark:hover:bg-[var(--color-surface-inverse-10)]"
                  href={ctaHref}
                  motionPreset="none"
                >
                  {ctaLabel}
                  {ctaIcon}
                </AppLink>
              </article>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
