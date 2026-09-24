import Image from "next/image";

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

interface EcommerceSeoPageProps {
  content: SeoServiceContent;
  cmsFaqItems?: SanityFaqItem[];
}

export default function EcommerceSeoPage({ content, cmsFaqItems }: EcommerceSeoPageProps) {
  const { hero, solutions } = content;

  return (
    <>
      <section className="pt-[60px] lg:pt-[120px]" id="ecommerce-seo-home">
        <div className={PAGE_SHELL_CLASS}>
          <h1 className={`type-h1 mx-auto max-w-[294px] text-center lg:max-w-[857px] ${TEXT}`}>
            <GradientHeading highlightClassName="gradient-text-brand-about-us-hero-title" segments={hero.title} />
          </h1>

          <p className={`type-paragraph mx-auto mt-5 max-w-[350px] text-center lg:max-w-[622px] ${TEXT}`}>
            <GradientHeading highlightClassName="gradient-text-brand-about-us-hero-title" segments={hero.tagline} />
          </p>

          <div className="relative mt-[60px] overflow-hidden rounded-[30px] bg-[linear-gradient(73.9149deg,var(--color-hr-dark)_35.359%,var(--color-case-art-maudsch)_142.03%)] px-[15px] dark:opacity-90 lg:mt-[120px] lg:h-[708px] lg:rounded-[40px] lg:bg-[linear-gradient(53.3665deg,var(--color-hr-dark)_35.359%,var(--color-case-art-maudsch)_142.03%)] lg:px-0">
            <div className="relative z-10 flex flex-col items-center pb-[20px] pt-[60px] text-center text-[var(--color-hr-pure-white)] lg:h-full lg:items-start lg:px-[70px] lg:pt-[120px] lg:text-left">
              <div className="w-full max-w-[350px] lg:max-w-[574px]">
                <SectionLabel className="text-[var(--color-hr-pure-white)]">{hero.label}</SectionLabel>
                <h2 className="type-h2 mt-5 max-w-[350px] text-[var(--color-hr-pure-white)] lg:max-w-[574px]">
                  <GradientHeading highlightClassName="gradient-text-brand-services" segments={hero.heading} />
                </h2>
                <div className="mt-5 max-w-[350px] space-y-[24px] text-[var(--color-hr-pure-white)] lg:mt-[53px] lg:max-w-[485px]">
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
                <div className="h-full [transform:scaleX(-1)] lg:[transform:none]">
                  <Image
                    alt={hero.image.alt}
                    className="absolute left-[-45.39%] top-[-120.23%] h-[262.79%] w-[186.39%] max-w-none object-cover lg:left-[22.88%] lg:top-[-113.85%] lg:h-[257.68%] lg:w-[96.36%]"
                    fetchPriority="high"
                    height={hero.image.height}
                    priority
                    sizes="(min-width: 1024px) 100vw, 350px"
                    src={hero.image.src}
                    width={hero.image.width}
                  />
                </div>
              </div>
            ) : null}

            <div className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(90deg,color-mix(in_srgb,var(--color-hr-dark)_88%,transparent)_0%,color-mix(in_srgb,var(--color-hr-dark)_72%,transparent)_36%,color-mix(in_srgb,var(--color-hr-dark)_28%,transparent)_66%,transparent_86%)] dark:opacity-90 lg:block" />
          </div>
        </div>
      </section>

      <section className="pt-[10px]" id="ecommerce-seo-services">
        <div className={PAGE_SHELL_CLASS}>
          <div className="rounded-[40px] bg-[var(--color-hr-off-white)] px-5 pb-[133px] pt-[57px] dark:bg-[var(--color-bg-dark)] sm:px-8 lg:px-[70px]">
            <SectionLabel>{solutions.label}</SectionLabel>
            <h2 className={`type-h2 mt-5 max-w-[500px] ${TEXT}`}>
              <GradientHeading highlightClassName="gradient-text-brand-services" segments={solutions.heading} />
            </h2>

            <div className="mt-[120px] grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {solutions.cards.map((card) => (
                <SolutionCardArticle
                  card={card}
                  className="h-[540px]"
                  key={card.title}
                  subtitleClassName="max-w-[238px]"
                  titleClassName="max-w-[353px]"
                />
              ))}
            </div>

            {solutions.banner ? (
              <ServiceProcessBanner
                banner={solutions.banner}
                descriptionClassName="type-paragraph mt-[63px] max-w-[817px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]"
                headingClassName="max-w-[925px] lg:text-left"
              />
            ) : null}
          </div>
        </div>
      </section>

      <ServiceWhyChooseBlock sectionId="ecommerce-seo-why-heroic" whyChoose={content.whyChoose} />
      <ServiceSuccessStoriesBlock sectionId="ecommerce-seo-success-stories" />
      <ServiceFaqBlock cmsFaqItems={cmsFaqItems} content={content} sectionId="ecommerce-seo-faq" />
    </>
  );
}
