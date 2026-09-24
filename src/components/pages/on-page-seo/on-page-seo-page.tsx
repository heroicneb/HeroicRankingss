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

interface OnPageSeoPageProps {
  content: SeoServiceContent;
  cmsFaqItems?: SanityFaqItem[];
}

export default function OnPageSeoPage({ content, cmsFaqItems }: OnPageSeoPageProps) {
  const { hero, solutions } = content;

  return (
    <>
      <section className="pt-[60px] lg:pt-[100px]" id="on-page-seo-home">
        <div className={PAGE_SHELL_CLASS}>
          <h1 className={`type-h1 mx-auto max-w-[294px] text-center lg:max-w-[857px] ${TEXT}`}>
            <GradientHeading highlightClassName="gradient-text-brand-quote" segments={hero.title} />
          </h1>

          <p className={`type-paragraph mx-auto mt-5 max-w-[294px] text-center lg:max-w-[688px] ${TEXT}`}>
            <GradientHeading highlightClassName="gradient-text-brand-quote" segments={hero.tagline} />
          </p>

          <div className="relative mt-[60px] overflow-hidden rounded-[30px] bg-[linear-gradient(73.9149deg,var(--color-hr-dark)_35.359%,var(--color-case-art-maudsch)_142.03%)] dark:opacity-90 lg:mt-[120px] lg:h-[684px] lg:rounded-[40px] lg:bg-[linear-gradient(52.4159deg,var(--color-hr-dark)_35.359%,var(--color-case-art-maudsch)_142.03%)]">
            <div className="relative z-10 flex flex-col items-center px-[15px] pb-[20px] pt-[60px] text-center text-[var(--color-hr-pure-white)] lg:h-full lg:items-start lg:px-[70px] lg:pt-[120px] lg:text-left">
              <div className="w-full max-w-[298px] lg:max-w-[601px]">
                <SectionLabel className="text-[var(--color-hr-pure-white)]">{hero.label}</SectionLabel>
                <h2 className="type-h2 mt-5 max-w-[298px] text-[var(--color-hr-pure-white)] lg:max-w-[601px]">
                  <GradientHeading highlightClassName="gradient-text-brand-services" segments={hero.heading} />
                </h2>

                <div className="mt-5 max-w-[298px] space-y-[24px] text-[var(--color-hr-pure-white)] lg:mt-10 lg:max-w-[485px]">
                  {hero.paragraphs.map((paragraph) => (
                    <p className="type-paragraph" key={paragraph}>
                      {paragraph}
                    </p>
                  ))}
                </div>

                <AppLink
                  className="type-cta motion-interactive motion-interactive-press mt-5 inline-flex h-[45px] w-full items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[var(--color-hr-accent)] bg-transparent px-5 text-[var(--color-hr-pure-white)] hover:bg-[color-mix(in_srgb,var(--color-hr-pure-white)_8%,transparent)] focus-visible:ring-offset-[var(--color-hr-dark)] lg:mt-10 lg:w-auto"
                  href={hero.ctaUrl}
                  motionPreset="none"
                >
                  {hero.ctaLabel}
                  <GradientArrowUpRightIcon className="size-[10px]" />
                </AppLink>
              </div>
            </div>

            {hero.image ? (
              <div className="pointer-events-none relative h-[331px] w-full overflow-hidden lg:absolute lg:bottom-0 lg:left-0 lg:right-0 lg:top-0 lg:h-auto">
                <Image
                  alt={hero.image.alt}
                  className="absolute left-[-19.96%] top-[-4.31%] h-[136.64%] w-[208.69%] max-w-none object-cover lg:left-[35.36%] lg:top-[1.46%] lg:h-[124.85%] lg:w-[105.45%]"
                  fetchPriority="high"
                  height={hero.image.height}
                  priority
                  sizes="(min-width: 1024px) 100vw, 380px"
                  src={hero.image.src}
                  width={hero.image.width}
                />
              </div>
            ) : null}

            <div className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(90deg,color-mix(in_srgb,var(--color-hr-dark)_90%,transparent)_0%,color-mix(in_srgb,var(--color-hr-dark)_66%,transparent)_38%,color-mix(in_srgb,var(--color-hr-dark)_22%,transparent)_62%,transparent_84%)] dark:opacity-90 lg:block" />
          </div>
        </div>
      </section>

      <section className="pt-[10px] lg:pt-[10px]" id="on-page-solutions">
        <div className={PAGE_SHELL_CLASS}>
          <div className="rounded-[40px] bg-[var(--color-hr-off-white)] px-5 pb-[70px] pt-[60px] dark:bg-[var(--color-bg-dark)] sm:px-8 lg:px-[70px] lg:pt-[120px]">
            <SectionLabel>{solutions.label}</SectionLabel>
            <h2 className={`type-h2 mt-5 max-w-[455px] ${TEXT}`}>
              <GradientHeading highlightClassName="gradient-text-brand-services" segments={solutions.heading} />
            </h2>

            <div className="mt-[80px] grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {solutions.cards.map((card) => (
                <SolutionCardArticle card={card} key={card.title} />
              ))}
            </div>

            {solutions.banner ? <ServiceProcessBanner banner={solutions.banner} /> : null}
          </div>
        </div>
      </section>

      <ServiceWhyChooseBlock sectionId="on-page-why-heroic" whyChoose={content.whyChoose} />
      <ServiceSuccessStoriesBlock arrowSize="size-[22px]" sectionId="on-page-success-stories" />
      <ServiceFaqBlock cmsFaqItems={cmsFaqItems} content={content} sectionId="on-page-faq" />
    </>
  );
}
