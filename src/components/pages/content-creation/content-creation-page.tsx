import Image from "next/image";

import {
  ContentCreationMobileSolutionsRail,
  type ContentCreationMobileSolutionCard,
} from "@/components/pages/content-creation/content-creation-mobile-solutions-rail";
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
const MOBILE_ICON_WRAPPERS = ["px-[10px] py-[8px]", "px-[8px] py-[10px]", "p-[9px]", "p-[9px]", "px-[10px] py-[8px]", "px-[8px] py-[10px]"];

interface ContentCreationPageProps {
  content: SeoServiceContent;
  cmsFaqItems?: SanityFaqItem[];
}

export default function ContentCreationPage({ content, cmsFaqItems }: ContentCreationPageProps) {
  const { hero, solutions } = content;

  const mobileServiceCards: readonly ContentCreationMobileSolutionCard[] = solutions.cards.map((card, index) => ({
    title: card.title,
    subtitle: card.subtitle,
    body: card.body,
    ctaLabel: card.ctaLabel,
    iconSrc: card.icon?.src ?? "",
    iconWidth: card.icon?.width ?? 30,
    iconHeight: card.icon?.height ?? 30,
    iconWrapperClassName: MOBILE_ICON_WRAPPERS[index] ?? "p-[9px]",
  }));

  return (
    <>
      <section className="pt-[60px] lg:pt-[100px]" id="content-creation-home">
        <div className={PAGE_SHELL_CLASS}>
          <h1 className={`type-h1 mx-auto max-w-[294px] text-center lg:max-w-[857px] ${TEXT}`}>
            <GradientHeading highlightClassName="gradient-text-brand-quote" segments={hero.title} />
          </h1>

          <p className={`type-paragraph mx-auto mt-5 max-w-[294px] text-center lg:max-w-[419px] ${TEXT}`}>
            <GradientHeading highlightClassName="gradient-text-brand-quote" segments={hero.tagline} />
          </p>

          <div className="relative mt-[60px] overflow-hidden rounded-[30px] bg-[linear-gradient(73.9149deg,var(--color-hr-dark)_35.359%,var(--color-case-art-maudsch)_142.03%)] dark:opacity-90 lg:mt-[120px] lg:h-[722px] lg:rounded-[40px] lg:bg-[linear-gradient(53.9022deg,var(--color-hr-dark)_35.359%,var(--color-case-art-maudsch)_142.03%)]">
            <div className="relative z-10 flex flex-col items-center px-[15px] pb-[20px] pt-[60px] text-center text-[var(--color-hr-pure-white)] lg:h-full lg:items-start lg:px-[70px] lg:pt-[120px] lg:text-left">
              <div className="w-full max-w-[350px] lg:max-w-[561px]">
                <SectionLabel className="text-[var(--color-hr-pure-white)]">{hero.label}</SectionLabel>
                <h2 className="type-h2 mx-auto mt-5 max-w-[350px] text-[var(--color-hr-pure-white)] lg:mx-0 lg:max-w-[542px]">
                  <GradientHeading highlightClassName="gradient-text-brand-services" segments={hero.heading} />
                </h2>

                <div className="mx-auto mt-5 max-w-[292px] space-y-[24px] text-[var(--color-hr-pure-white)] lg:mx-0 lg:mt-10 lg:max-w-[508px]">
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
              <div className="pointer-events-none relative h-[331px] w-full overflow-hidden lg:absolute lg:inset-0 lg:h-auto lg:w-auto lg:rounded-[40px]">
                <div className="h-full [transform:scaleX(-1)] lg:contents">
                  <Image
                    alt={hero.image.alt}
                    className="absolute left-[-0.15%] top-[-77.95%] h-[207.04%] w-[106.29%] max-w-none object-cover lg:left-[36.14%] lg:top-[-77.35%] lg:h-[213.86%] lg:w-[64.08%] lg:[transform:scaleX(-1)]"
                    fetchPriority="high"
                    height={hero.image.height}
                    priority
                    sizes="(min-width: 1024px) 52vw, 350px"
                    src={hero.image.src}
                    width={hero.image.width}
                  />
                </div>
              </div>
            ) : null}

            <div className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(90deg,color-mix(in_srgb,var(--color-hr-dark)_92%,transparent)_0%,color-mix(in_srgb,var(--color-hr-dark)_75%,transparent)_34%,color-mix(in_srgb,var(--color-hr-dark)_16%,transparent)_52%,transparent_62%)] dark:opacity-90 lg:block" />
          </div>
        </div>
      </section>

      <section className="pt-[10px] lg:pt-[10px]" id="content-creation-solutions">
        <div className={PAGE_SHELL_CLASS}>
          <div className="rounded-[40px] bg-[var(--color-hr-off-white)] px-[10px] pb-[20px] pt-[40px] dark:bg-[var(--color-bg-dark)] sm:px-8 lg:rounded-[40px] lg:px-[70px] lg:pb-[70px] lg:pt-[120px]">
            <SectionLabel className="text-center lg:text-left">{solutions.label}</SectionLabel>
            <h2 className={`type-h2 mx-auto mt-5 max-w-[266px] text-center lg:mx-0 lg:max-w-[457px] lg:text-left ${TEXT}`}>
              <GradientHeading highlightClassName="gradient-text-brand-services" segments={solutions.heading} />
            </h2>

            <ContentCreationMobileSolutionsRail cards={mobileServiceCards} />

            <div className="mt-[120px] hidden grid-cols-1 gap-5 lg:grid lg:grid-cols-2 xl:grid-cols-3">
              {solutions.cards.map((card) => (
                <SolutionCardArticle
                  card={card}
                  className="h-[492px]"
                  icon={
                    card.icon ? (
                      <span className="inline-flex size-[30px] items-center justify-center">
                        <Image
                          alt=""
                          aria-hidden
                          className="block size-full dark:brightness-0 dark:invert"
                          height={card.icon.height}
                          sizes="30px"
                          src={card.icon.src}
                          width={card.icon.width}
                        />
                      </span>
                    ) : undefined
                  }
                  key={card.title}
                />
              ))}
            </div>

            {solutions.banner ? <ServiceProcessBanner banner={solutions.banner} className="mt-5 lg:rounded-[24px]" headingClassName="max-w-[760px]" /> : null}
          </div>
        </div>
      </section>

      <ServiceWhyChooseBlock sectionId="content-creation-why-heroic" whyChoose={content.whyChoose} />
      <ServiceSuccessStoriesBlock sectionId="content-creation-success-stories" />
      <ServiceFaqBlock cmsFaqItems={cmsFaqItems} content={content} sectionId="content-creation-faq" variant="boxed" />
    </>
  );
}
