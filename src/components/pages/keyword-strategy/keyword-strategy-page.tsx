import Image from "next/image";

import {
  KeywordStrategyMobileSolutionsRail,
  type KeywordStrategyMobileSolutionCard,
} from "@/components/pages/keyword-strategy/keyword-strategy-mobile-solutions-rail";
import {
  ServiceFaqBlock,
  ServiceSuccessStoriesBlock,
  ServiceWhyChooseBlock,
  SolutionCardArticle,
  TEXT,
} from "@/components/sections/shared/service-page-blocks";
import { ServiceProcessBanner } from "@/components/sections/shared/service-process-banner";
import { AppLink } from "@/components/ui/app-link";
import { GradientHeading } from "@/components/ui/gradient-heading";
import { GradientArrowUpRightIcon } from "@/components/ui/icons/decorative";
import { SectionLabel } from "@/components/ui/section-label";
import { PAGE_SHELL_CLASS } from "@/data/service-shared";
import type { SanityFaqItem } from "@/lib/sanity-data";

import type { SeoServiceContent } from "../shared/seo-service-content";

// WHY: the mobile rail pads each icon tile slightly differently (Figma); keyed by card position.
const MOBILE_ICON_WRAPPERS = ["px-[10px] py-[8px]", "px-[8px] py-[10px]", "p-[9px]", "px-[12px] py-[13px]", "px-[8.5px] py-[10px]"];

interface KeywordStrategyPageProps {
  content: SeoServiceContent;
  cmsFaqItems?: SanityFaqItem[];
}

export default function KeywordStrategyPage({ content, cmsFaqItems }: KeywordStrategyPageProps) {
  const { hero, solutions } = content;

  const mobileServiceCards: readonly KeywordStrategyMobileSolutionCard[] = solutions.cards.map((card, index) => ({
    title: card.title,
    subtitle: card.subtitle,
    body: card.body,
    ctaLabel: card.ctaLabel,
    iconSrc: card.icon?.src ?? "",
    iconWidth: card.icon?.width ?? 32,
    iconHeight: card.icon?.height ?? 32,
    iconWrapperClassName: MOBILE_ICON_WRAPPERS[index] ?? "p-[9px]",
  }));

  return (
    <>
      <section className="pt-[60px] lg:pt-[100px]" id="keyword-strategy-home">
        <div className={PAGE_SHELL_CLASS}>
          <h1 className={`type-h1 mx-auto max-w-[294px] text-center lg:max-w-[857px] ${TEXT}`}>
            <GradientHeading highlightClassName="gradient-text-brand-about-us-hero-title" segments={hero.title} />
          </h1>

          <p className={`type-paragraph mx-auto mt-5 max-w-[294px] text-center lg:max-w-[514px] ${TEXT}`}>
            <GradientHeading highlightClassName="gradient-text-brand-about-us-hero-title" segments={hero.tagline} />
          </p>

          <div className="relative mt-[60px] overflow-hidden rounded-[30px] bg-[linear-gradient(73.9149deg,var(--color-hr-dark)_35.359%,var(--color-case-art-maudsch)_142.03%)] dark:opacity-90 lg:mt-[120px] lg:h-[722px] lg:rounded-[40px] lg:bg-[linear-gradient(53.9022deg,var(--color-hr-dark)_35.359%,var(--color-case-art-maudsch)_142.03%)]">
            <div className="relative z-10 flex flex-col items-center px-[15px] pb-[20px] pt-[60px] text-center text-[var(--color-hr-pure-white)] lg:h-full lg:items-start lg:px-[70px] lg:pt-[120px] lg:text-left">
              <div className="w-full max-w-[350px] lg:max-w-[561px]">
                <SectionLabel className="text-[var(--color-hr-pure-white)]">{hero.label}</SectionLabel>
                <h2 className="type-h2 mx-auto mt-5 max-w-[350px] text-[var(--color-hr-pure-white)] lg:mx-0 lg:max-w-[472px]">
                  <GradientHeading highlightClassName="gradient-text-brand-services" segments={hero.heading} />
                </h2>

                <div className="mx-auto mt-5 max-w-[294px] space-y-[24px] text-[var(--color-hr-pure-white)] lg:mx-0 lg:mt-10 lg:max-w-[413px]">
                  {hero.paragraphs.map((paragraph) => (
                    <p className="type-paragraph" key={paragraph}>
                      {paragraph}
                    </p>
                  ))}
                </div>

                <AppLink
                  className="type-cta motion-interactive motion-interactive-press mt-5 inline-flex h-[45px] w-full items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-button)] border border-[var(--color-hr-accent)] bg-transparent px-5 text-[var(--color-hr-pure-white)] hover:bg-[color-mix(in_srgb,var(--color-hr-pure-white)_8%,transparent)] focus-visible:ring-offset-[var(--color-hr-dark)] lg:mt-10 lg:w-auto"
                  href={hero.ctaUrl}
                  motionPreset="none"
                >
                  {hero.ctaLabel}
                  <GradientArrowUpRightIcon className="size-4" />
                </AppLink>
              </div>
            </div>

            {hero.image ? (
              <div className="pointer-events-none relative h-[331px] w-full overflow-hidden lg:absolute lg:bottom-0 lg:left-0 lg:right-0 lg:top-0 lg:h-auto">
                <Image
                  alt={hero.image.alt}
                  className="absolute left-[-14.45%] top-[-32.99%] h-[177.26%] w-[220.67%] max-w-none object-cover lg:left-[29.04%] lg:top-[-30.39%] lg:h-[174.01%] lg:w-auto"
                  fetchPriority="high"
                  height={hero.image.height}
                  priority
                  sizes="(min-width: 1024px) 126vw, 350px"
                  src={hero.image.src}
                  width={hero.image.width}
                />
              </div>
            ) : null}

            <div className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(90deg,color-mix(in_srgb,var(--color-hr-dark)_92%,transparent)_0%,color-mix(in_srgb,var(--color-hr-dark)_74%,transparent)_36%,color-mix(in_srgb,var(--color-hr-dark)_24%,transparent)_64%,transparent_86%)] dark:opacity-90 lg:block" />
          </div>
        </div>
      </section>

      <section className="pt-[10px]" id="keyword-strategy-solutions">
        <div className={PAGE_SHELL_CLASS}>
          <div className="rounded-[40px] bg-[var(--color-hr-off-white)] px-[10px] pb-[20px] pt-[40px] dark:bg-[var(--color-bg-dark)] sm:px-8 lg:rounded-[40px] lg:px-[70px] lg:pb-[70px] lg:pt-[120px]">
            <SectionLabel className="text-center lg:text-left">{solutions.label}</SectionLabel>
            <h2 className={`type-h2 mx-auto mt-5 max-w-[266px] text-center lg:mx-0 lg:max-w-[442px] lg:text-left ${TEXT}`}>
              <GradientHeading highlightClassName="gradient-text-brand-services" segments={solutions.heading} />
            </h2>

            <KeywordStrategyMobileSolutionsRail cards={mobileServiceCards} />

            <div className="mt-[120px] hidden grid-cols-1 gap-5 lg:grid lg:grid-cols-2 xl:grid-cols-3">
              {solutions.cards.map((card) => (
                <SolutionCardArticle card={card} className="h-[540px]" key={card.title} />
              ))}
            </div>

            {solutions.banner ? (
              <ServiceProcessBanner
                banner={solutions.banner}
                className="mt-5"
                descriptionClassName="type-paragraph mt-[39px] max-w-[600px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]"
              />
            ) : null}
          </div>
        </div>
      </section>

      <ServiceWhyChooseBlock sectionId="keyword-strategy-why-heroic" whyChoose={content.whyChoose} />
      <ServiceSuccessStoriesBlock sectionId="keyword-strategy-success-stories" />
      <ServiceFaqBlock cmsFaqItems={cmsFaqItems} content={content} sectionId="keyword-strategy-faq" variant="boxed" />
    </>
  );
}
