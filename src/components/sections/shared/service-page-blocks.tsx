import Image from "next/image";
import type { ReactNode } from "react";

import { ServiceFaq } from "@/components/sections/shared/service-faq";
import { ServiceSuccessStories } from "@/components/sections/shared/service-success-stories";
import { ServiceWhyChoose } from "@/components/sections/shared/service-why-choose";
import { AppLink } from "@/components/ui/app-link";
import { GradientHeading } from "@/components/ui/gradient-heading";
import { GradientText } from "@/components/ui/gradient-text";
import {
  DiagonalArrowIcon,
  FaqPlusIcon,
  GradientArrowUpRightIcon,
} from "@/components/ui/icons/decorative";
import { PAGE_SHELL_CLASS, CONTENT_SHELL_CLASS } from "@/data/service-shared";
import { SUCCESS_STORIES } from "@/data/success-stories";
import { cn } from "@/lib/cn";
import type { SanityFaqItem } from "@/lib/sanity-data";

import type { ContentImage } from "@/components/pages/shared/page-content";
import type { SeoServiceContent, SolutionCard } from "@/components/pages/shared/seo-service-content";

/*
 * Building blocks shared by the SEO service pages. Each page keeps its own
 * hero (they differ in image framing) and composes these for the rest.
 */

export const TEXT = "text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]";

/** 50×50 bordered icon tile. */
export function IconTile({ icon, className, imageClassName }: { icon: ContentImage | null; className?: string; imageClassName?: string }) {
  if (!icon) return null;
  return (
    <span
      className={cn(
        "relative inline-flex size-[50px] items-center justify-center overflow-hidden rounded-[12px] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-pure-white)] dark:border-[var(--color-border-inverse-10)] dark:bg-[var(--color-bg-dark)]",
        className,
      )}
    >
      <Image
        alt={icon.alt}
        aria-hidden={icon.alt === "" || undefined}
        className={cn("block dark:brightness-0 dark:invert", imageClassName)}
        height={icon.height}
        src={icon.src}
        style={{ width: icon.width, height: icon.height }}
        width={icon.width}
      />
    </span>
  );
}

/** Standard solution card (title, gradient subtitle, body, CTA). */
export function SolutionCardArticle({
  card,
  className,
  titleClassName,
  subtitleClassName,
  ctaClassName,
  icon,
}: {
  card: SolutionCard;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  ctaClassName?: string;
  /** Override the icon tile rendering (e.g. content-creation uses a bare 30px icon). */
  icon?: ReactNode;
}) {
  return (
    <article
      className={cn(
        "flex h-[588px] flex-col rounded-[40px] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-pure-white)] px-[30px] pb-[30px] pt-[30px] dark:border-[var(--color-border-inverse-10)] dark:bg-[var(--color-bg-dark)]",
        className,
      )}
    >
      {icon ?? <IconTile icon={card.icon} />}

      <h3 className={cn("type-h3 mt-[15px] min-h-[64px]", TEXT, titleClassName)}>{card.title}</h3>
      <p className={cn("type-paragraph gradient-text-brand gradient-text-brand-services mt-[10px] min-h-[48px]", subtitleClassName)}>
        {card.subtitle}
      </p>
      <p className={cn("type-paragraph mt-[30px]", TEXT)}>{card.body}</p>

      <AppLink
        className={cn(
          "type-cta mt-auto inline-flex h-[45px] min-w-[163px] items-center justify-center gap-2 self-start whitespace-nowrap rounded-[var(--radius-button)] border border-[var(--color-hr-accent)] bg-transparent px-5 hover:bg-[var(--color-hr-off-white)] dark:hover:bg-[var(--color-surface-inverse-10)]",
          TEXT,
          ctaClassName,
        )}
        href={card.ctaUrl}
      >
        {card.ctaLabel}
        <GradientArrowUpRightIcon className="size-[10px]" />
      </AppLink>
    </article>
  );
}

/** "Why Choose Heroic Rankings?" block fed from page content. */
export function ServiceWhyChooseBlock({ whyChoose, sectionId }: { whyChoose: SeoServiceContent["whyChoose"]; sectionId: string }) {
  return (
    <ServiceWhyChoose
      ctaHref={whyChoose.ctaUrl}
      ctaIcon={<GradientArrowUpRightIcon className="size-[10px]" />}
      ctaLabel={whyChoose.ctaLabel}
      ctaTitle={whyChoose.ctaTitle}
      descriptionBaseClassName="type-paragraph mt-[10px] text-[var(--color-hr-grey)] dark:text-[var(--color-text-inverse-50)]"
      gridClassName="mt-[80px] grid grid-cols-1 gap-y-[56px] lg:grid-cols-3 lg:gap-x-[110px]"
      heading={<GradientHeading highlightClassName="gradient-text-brand-trust" segments={whyChoose.heading} />}
      iconBaseClassName="size-[50px] dark:brightness-0 dark:invert"
      items={whyChoose.items.map((item) => ({
        title: item.title,
        description: item.description,
        iconSrc: item.icon?.src ?? "",
        iconWidth: item.icon?.width ?? 20,
        iconHeight: item.icon?.height ?? 20,
      }))}
      label={whyChoose.label}
      outerClassName="rounded-[40px] bg-[var(--color-hr-off-white)] px-5 pb-[96px] pt-[96px] dark:bg-[var(--color-bg-dark)] sm:px-8 lg:px-[70px] lg:pb-[120px] lg:pt-[120px]"
      sectionClassName="pt-[10px] lg:pt-[10px]"
      sectionId={sectionId}
    />
  );
}

/** Shared success stories block (still code-driven, identical on every service page). */
export function ServiceSuccessStoriesBlock({ sectionId, arrowSize = "size-5", gradientFirst = true }: { sectionId: string; arrowSize?: string; gradientFirst?: boolean }) {
  return (
    <ServiceSuccessStories
      buttonIcon={<GradientArrowUpRightIcon className="size-[10px]" />}
      cardArrowIcon={<DiagonalArrowIcon className={arrowSize} />}
      contentShellClass={CONTENT_SHELL_CLASS}
      heading={
        gradientFirst ? (
          <>
            <GradientText className="gradient-text-brand-case">Success</GradientText> Stories
          </>
        ) : (
          <>
            Success <GradientText className="gradient-text-brand-case">Stories</GradientText>
          </>
        )
      }
      pageShellClass={PAGE_SHELL_CLASS}
      sectionId={sectionId}
      stories={SUCCESS_STORIES}
    />
  );
}

/** Page FAQ wins; otherwise the "FAQ Items" collection for this service; otherwise nothing. */
export function resolveFaqItems(content: SeoServiceContent, cmsFaqItems?: SanityFaqItem[]) {
  const source = content.faq.items.length
    ? content.faq.items
    : cmsFaqItems?.length
      ? cmsFaqItems.map((f) => ({ question: f.question, answer: f.answer }))
      : [];
  return source.map((item, index) => ({ ...item, defaultOpen: index === 0 }));
}

export function ServiceFaqBlock({
  content,
  cmsFaqItems,
  sectionId,
  variant = "plain",
}: {
  content: SeoServiceContent;
  cmsFaqItems?: SanityFaqItem[];
  sectionId: string;
  /** "plain" = default ServiceFaq look; "boxed" = the hub/keyword/content variant with wider summary padding. */
  variant?: "plain" | "boxed";
}) {
  const items = resolveFaqItems(content, cmsFaqItems);
  const renderIcon = (
    <span className="inline-flex size-[25px] items-center justify-center">
      <FaqPlusIcon className="size-[18px] transition-transform duration-200 group-open:-rotate-45 dark:text-[var(--color-text-inverse)]" />
    </span>
  );
  if (variant === "boxed") {
    return (
      <ServiceFaq
        answerClassName="pb-[30px] pl-[30px] pr-[30px] sm:pr-[90px] lg:pr-[223px]"
        containerClassName="relative mt-[80px] overflow-hidden rounded-[40px] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-pure-white)] dark:border-[var(--color-border-inverse-10)] dark:bg-[var(--color-bg-dark)]"
        detailsClassName="group border-[var(--color-hr-light-grey)] open:bg-[var(--color-hr-pure-white)] dark:border-[var(--color-border-inverse-10)] dark:bg-[var(--color-bg-dark)] dark:open:bg-[var(--color-bg-dark)]"
        items={items}
        renderIcon={renderIcon}
        sectionId={sectionId}
        summaryClassName="flex cursor-pointer list-none items-center justify-between gap-4 px-[30px] py-[28px] [&::-webkit-details-marker]:hidden"
      />
    );
  }
  return <ServiceFaq items={items} renderIcon={renderIcon} sectionId={sectionId} />;
}
