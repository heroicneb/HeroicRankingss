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
import { AI_SEARCH_EXTRAS } from "./ai-search-content";

interface AiSearchPageProps {
  content: SeoServiceContent;
  cmsFaqItems?: SanityFaqItem[];
}

const PANEL = "rounded-[40px] bg-[var(--color-hr-off-white)] px-5 pb-[70px] pt-[60px] dark:bg-[var(--color-bg-dark)] sm:px-8 lg:px-[70px] lg:pb-[100px] lg:pt-[100px]";
const CARD = "rounded-[30px] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-pure-white)] p-[30px] dark:border-[var(--color-border-inverse-10)] dark:bg-[var(--color-bg-dark)]";
const MUTED = "text-[var(--color-hr-grey)] dark:text-[var(--color-text-inverse-50)]";
const TEXT_LINK = `type-cta inline-flex items-center gap-2 underline-offset-4 hover:underline ${TEXT}`;

/**
 * AI Search Optimization (GEO & AEO) service page. The hero, service cards,
 * process banner, why-us and FAQ come from the shared CMS model; the
 * definition, "how AI chooses", comparison table and audience sections are
 * fixed copy from AI_SEARCH_EXTRAS.
 */
export default function AiSearchPage({ content, cmsFaqItems }: AiSearchPageProps) {
  const { hero, solutions } = content;
  const { definition, howAiChooses, compare, audience } = AI_SEARCH_EXTRAS;

  return (
    <>
      <section className="pt-[60px] lg:pt-[100px]" id="ai-search-home">
        <div className={PAGE_SHELL_CLASS}>
          <h1 className={`type-h1 mx-auto max-w-[320px] text-center lg:max-w-[900px] ${TEXT}`}>
            <GradientHeading highlightClassName="gradient-text-brand-about-us-hero-title" segments={hero.title} />
          </h1>

          <p className={`type-paragraph mx-auto mt-5 max-w-[294px] text-center lg:max-w-[688px] ${TEXT}`}>
            <GradientHeading highlightClassName="gradient-text-brand-about-us-hero-title" segments={hero.tagline} />
          </p>

          <div className="relative mt-[60px] overflow-hidden rounded-[30px] bg-[linear-gradient(73.9149deg,var(--color-hr-dark)_35.359%,var(--color-case-art-maudsch)_142.03%)] dark:opacity-90 lg:mt-[120px] lg:h-[684px] lg:rounded-[40px] lg:bg-[linear-gradient(52.4159deg,var(--color-hr-dark)_35.359%,var(--color-case-art-maudsch)_142.03%)]">
            <div className="relative z-10 flex flex-col items-center px-[15px] pb-[20px] pt-[60px] text-center text-[var(--color-hr-pure-white)] lg:h-full lg:items-start lg:px-[70px] lg:pt-[100px] lg:text-left">
              <div className="w-full max-w-[298px] lg:max-w-[600px]">
                <SectionLabel className="text-[var(--color-hr-pure-white)]">{hero.label}</SectionLabel>
                <h2 className="type-h2 mt-5 max-w-[298px] text-[var(--color-hr-pure-white)] lg:max-w-[600px]">
                  <GradientHeading highlightClassName="gradient-text-brand-services" segments={hero.heading} />
                </h2>

                <div className="mt-5 max-w-[298px] space-y-[20px] text-[var(--color-hr-pure-white)] lg:mt-8 lg:max-w-[520px]">
                  {hero.paragraphs.map((paragraph) => (
                    <p className="type-paragraph" key={paragraph}>
                      {paragraph}
                    </p>
                  ))}
                </div>

                <AppLink
                  className="type-cta motion-interactive motion-interactive-press mt-5 inline-flex h-[45px] w-full items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[var(--color-hr-accent)] bg-transparent px-5 text-[var(--color-hr-pure-white)] hover:bg-[color-mix(in_srgb,var(--color-hr-pure-white)_8%,transparent)] focus-visible:ring-offset-[var(--color-hr-dark)] lg:mt-8 lg:w-auto"
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
                  className="absolute inset-0 h-full w-full object-cover object-right"
                  fetchPriority="high"
                  height={hero.image.height}
                  priority
                  sizes="(min-width: 1024px) 100vw, 350px"
                  src={hero.image.src}
                  width={hero.image.width}
                />
              </div>
            ) : null}

            <div className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(90deg,color-mix(in_srgb,var(--color-hr-dark)_90%,transparent)_0%,color-mix(in_srgb,var(--color-hr-dark)_66%,transparent)_38%,color-mix(in_srgb,var(--color-hr-dark)_22%,transparent)_62%,transparent_84%)] dark:opacity-90 lg:block" />
          </div>
        </div>
      </section>

      {/* WHY: the definition is the passage AI systems and featured snippets quote for "what are GEO services". */}
      <section className="pt-[10px]" id="ai-search-definition">
        <div className={PAGE_SHELL_CLASS}>
          <div className={PANEL}>
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,420px)_1fr] lg:gap-[80px]">
              <div>
                <SectionLabel>{definition.label}</SectionLabel>
                <h2 className={`type-h2 mt-5 ${TEXT}`}>
                  <GradientHeading highlightClassName="gradient-text-brand-services" segments={definition.heading} />
                </h2>
              </div>
              <div className="space-y-6">
                {definition.paragraphs.map((paragraph) => (
                  <p className={`type-paragraph ${TEXT}`} key={paragraph}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <div className="mt-[80px] lg:mt-[100px]">
              <SectionLabel>{howAiChooses.label}</SectionLabel>
              <h2 className={`type-h2 mt-5 max-w-[640px] ${TEXT}`}>
                <GradientHeading highlightClassName="gradient-text-brand-services" segments={howAiChooses.heading} />
              </h2>
              <ol className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                {howAiChooses.items.map((item, index) => (
                  <li className={CARD} key={item.title}>
                    <span className="type-cta gradient-text-brand gradient-text-brand-services block" aria-hidden>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className={`type-h3 mt-[15px] ${TEXT}`}>{item.title}</h3>
                    <p className={`type-paragraph mt-[10px] ${MUTED}`}>{item.description}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-[10px]" id="ai-search-solutions">
        <div className={PAGE_SHELL_CLASS}>
          <div className={PANEL}>
            <SectionLabel>{solutions.label}</SectionLabel>
            <h2 className={`type-h2 mt-5 max-w-[640px] ${TEXT}`}>
              <GradientHeading highlightClassName="gradient-text-brand-services" segments={solutions.heading} />
            </h2>

            <div className="mt-[80px] grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 lg:mt-[100px]">
              {solutions.cards.map((card) => (
                <SolutionCardArticle card={card} className="h-auto min-h-[516px]" ctaClassName="w-fit" key={card.title} />
              ))}
            </div>

            {solutions.banner ? (
              <ServiceProcessBanner
                banner={solutions.banner}
                descriptionClassName="type-paragraph mt-[39px] max-w-[600px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]"
              />
            ) : null}
          </div>
        </div>
      </section>

      <section className="pt-[10px]" id="ai-search-compare">
        <div className={PAGE_SHELL_CLASS}>
          <div className={PANEL}>
            <SectionLabel>{compare.label}</SectionLabel>
            <h2 className={`type-h2 mt-5 max-w-[640px] ${TEXT}`}>
              <GradientHeading highlightClassName="gradient-text-brand-services" segments={compare.heading} />
            </h2>

            <div className={`mt-10 overflow-x-auto ${CARD} p-0`}>
              <table className="w-full min-w-[640px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-[var(--color-hr-light-grey)] dark:border-[var(--color-border-inverse-10)]">
                    {compare.columns.map((column, index) => (
                      <th className={`type-cta px-[24px] py-[20px] align-bottom ${index === 2 ? "gradient-text-brand gradient-text-brand-services" : TEXT}`} key={column || "label"} scope="col">
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {compare.rows.map(([label, classic, ai]) => (
                    <tr className="border-b border-[var(--color-hr-light-grey)] last:border-b-0 dark:border-[var(--color-border-inverse-10)]" key={label}>
                      <th className={`type-cta px-[24px] py-[20px] align-top ${TEXT}`} scope="row">
                        {label}
                      </th>
                      <td className={`type-paragraph px-[24px] py-[20px] align-top ${MUTED}`}>{classic}</td>
                      <td className={`type-paragraph px-[24px] py-[20px] align-top ${TEXT}`}>{ai}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className={`type-paragraph mt-8 max-w-[720px] ${TEXT}`}>{compare.note}</p>
            <AppLink className={`${TEXT_LINK} mt-4`} href={compare.linkHref}>
              {compare.linkLabel}
              <GradientArrowUpRightIcon className="size-[10px]" />
            </AppLink>
          </div>
        </div>
      </section>

      <ServiceWhyChooseBlock sectionId="ai-search-why-heroic" whyChoose={content.whyChoose} />
      <ServiceSuccessStoriesBlock arrowSize="size-[22px]" sectionId="ai-search-success-stories" />

      <section className="pt-[10px]" id="ai-search-audience">
        <div className={PAGE_SHELL_CLASS}>
          <div className={PANEL}>
            <SectionLabel>{audience.label}</SectionLabel>
            <h2 className={`type-h2 mt-5 max-w-[640px] ${TEXT}`}>
              <GradientHeading highlightClassName="gradient-text-brand-services" segments={audience.heading} />
            </h2>
            <ul className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
              {audience.items.map((item) => (
                <li className={`${CARD} flex flex-col`} key={item.title}>
                  <h3 className={`type-h3 ${TEXT}`}>{item.title}</h3>
                  <p className={`type-paragraph mt-[10px] ${MUTED}`}>{item.description}</p>
                  <AppLink className={`${TEXT_LINK} mt-auto pt-6`} href={item.href}>
                    {item.linkLabel}
                    <GradientArrowUpRightIcon className="size-[10px]" />
                  </AppLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <ServiceFaqBlock cmsFaqItems={cmsFaqItems} content={content} sectionId="ai-search-faq" variant="boxed" />
    </>
  );
}
