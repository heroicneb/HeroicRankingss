import Image from "next/image";

import {
  SeoServicesDesktopServicesGrid,
  type SeoDesktopServiceCard,
} from "@/components/pages/seo-services/seo-services-desktop-services-grid";
import { SeoServicesMobileServicesRail } from "@/components/pages/seo-services/seo-services-mobile-services-rail";
import { SEO_SERVICES_EXTRAS } from "@/components/pages/seo-services/seo-services-extras";
import {
  ServiceFaqBlock,
  ServiceWhyChooseBlock,
  TEXT,
} from "@/components/sections/shared/service-page-blocks";
import { ServiceProcessBanner } from "@/components/sections/shared/service-process-banner";
import { AppLink } from "@/components/ui/app-link";
import { GradientHeading } from "@/components/ui/gradient-heading";
import { GradientArrowUpRightIcon } from "@/components/ui/icons/decorative";
import { SectionLabel } from "@/components/ui/section-label";
import { PAGE_SHELL_CLASS, CONTENT_SHELL_CLASS } from "@/data/service-shared";
import type { SanityFaqItem } from "@/lib/sanity-data";

import type { SeoServiceContent } from "../shared/seo-service-content";

// WHY: the hub grid is a fixed Figma layout — card sizes depend on position, not content.
const HUB_CARD_LAYOUT = [
  { titleWidthClass: "max-w-[324px]", descWidthClass: "max-w-[216px]", colSpanClass: "lg:col-span-2", backIntroWidthClass: "max-w-[528px]", backPointsWidthClass: "max-w-[248px]" },
  { titleWidthClass: "max-w-[241px]", descWidthClass: "max-w-[219px]", colSpanClass: "lg:col-span-1", backIntroWidthClass: "max-w-[245px]", backPointsWidthClass: "max-w-[237px]" },
  { titleWidthClass: "max-w-[241px]", descWidthClass: "max-w-[179px]", colSpanClass: "lg:col-span-1", backIntroWidthClass: "max-w-[245px]", backPointsWidthClass: "max-w-[237px]" },
  { titleWidthClass: "max-w-[305px]", descWidthClass: "max-w-[383px]", colSpanClass: "lg:col-span-4", backIntroWidthClass: "max-w-[305px]", backPointsWidthClass: "max-w-[237px]" },
  { titleWidthClass: "max-w-[250px]", descWidthClass: "max-w-[216px]", colSpanClass: "lg:col-span-1", backIntroWidthClass: "max-w-[245px]", backPointsWidthClass: "max-w-[237px]" },
  { titleWidthClass: "max-w-[250px]", descWidthClass: "max-w-[231px]", colSpanClass: "lg:col-span-1", backIntroWidthClass: "max-w-[245px]", backPointsWidthClass: "max-w-[237px]" },
  { titleWidthClass: "max-w-[453px]", descWidthClass: "max-w-[192px]", colSpanClass: "lg:col-span-2", backIntroWidthClass: "max-w-[400px]", backPointsWidthClass: "max-w-[300px]" },
  // 2026-10-23: eighth, full-width card for AI search optimization.
  { titleWidthClass: "max-w-[520px]", descWidthClass: "max-w-[420px]", colSpanClass: "lg:col-span-4", backIntroWidthClass: "max-w-[560px]", backPointsWidthClass: "max-w-[520px]" },
];

const PANEL = "rounded-[40px] bg-[var(--color-hr-off-white)] px-5 pb-[70px] pt-[60px] dark:bg-[var(--color-bg-dark)] sm:px-8 lg:px-[70px] lg:pb-[100px] lg:pt-[100px]";
const CARD = "rounded-[30px] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-pure-white)] dark:border-[var(--color-border-inverse-10)] dark:bg-[var(--color-bg-dark)]";
const MUTED = "text-[var(--color-hr-grey)] dark:text-[var(--color-text-inverse-50)]";
const TEXT_LINK = `type-cta inline-flex items-center gap-2 underline-offset-4 hover:underline ${TEXT}`;
const CELL = "px-[24px] py-[20px] align-top";

interface SeoServicesPageProps {
  content: SeoServiceContent;
  cmsFaqItems?: SanityFaqItem[];
}

export default function SeoServicesPage({ content, cmsFaqItems }: SeoServicesPageProps) {
  const { hero, solutions } = content;
  const { definition, results, audience } = SEO_SERVICES_EXTRAS;

  const gridCards: readonly SeoDesktopServiceCard[] = solutions.hubCards.map((card, index) => ({
    title: card.title,
    description: card.description,
    isDescriptionGradient: card.descriptionGradient,
    imageSrc: card.image?.src ?? "",
    backIntro: card.backIntro,
    backPoints: card.backPoints,
    href: card.href,
    ...(HUB_CARD_LAYOUT[index] ?? HUB_CARD_LAYOUT[1]!),
  }));

  return (
    <>
      <section className="pt-[100px]" id="home">
        <div className={PAGE_SHELL_CLASS}>
          <h1 className={`type-h1 mx-auto max-w-[857px] text-center ${TEXT}`}>
            <GradientHeading highlightClassName="gradient-text-brand-about-us-hero-title" segments={hero.title} />
          </h1>

          <p className={`type-paragraph mx-auto mt-5 max-w-[688px] text-center ${TEXT}`}>
            <GradientHeading highlightClassName="gradient-text-brand-about-us-hero-title" segments={hero.tagline} />
          </p>

          <div className="relative mt-[60px] overflow-hidden rounded-[30px] bg-[linear-gradient(80.7496deg,var(--color-hr-dark)_35.359%,var(--color-hr-art-maudsch)_142.03%)] dark:opacity-90 lg:mt-[140px] lg:h-[696px] lg:rounded-[40px] lg:bg-[linear-gradient(52.8964deg,var(--color-hr-dark)_35.359%,var(--color-hr-art-maudsch)_142.03%)]">
            <div className="relative z-10 flex flex-col items-center px-[15px] pb-[20px] pt-[60px] text-center text-[var(--color-hr-pure-white)] lg:h-full lg:items-start lg:px-[70px] lg:pt-[120px] lg:text-left">
              <div className="w-full max-w-[298px] lg:max-w-[527px]">
                <SectionLabel className="text-[var(--color-hr-pure-white)]">{hero.label}</SectionLabel>
                <h2 className="type-h2 mt-5 max-w-[298px] text-[var(--color-hr-pure-white)] lg:max-w-[482px]">
                  <GradientHeading highlightClassName="gradient-text-brand-services" segments={hero.heading} />
                </h2>

                <div className="mt-5 max-w-[298px] space-y-[24px] text-[var(--color-hr-pure-white)] lg:mt-[23px] lg:max-w-[457px]">
                  {hero.paragraphs.map((paragraph) => (
                    <p className="type-paragraph" key={paragraph}>
                      {paragraph}
                    </p>
                  ))}
                </div>

                <AppLink
                  className="type-cta motion-interactive motion-interactive-press mt-5 inline-flex h-[45px] w-full items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[var(--color-hr-accent)] bg-transparent px-5 text-[var(--color-hr-pure-white)] hover:bg-transparent focus-visible:ring-offset-[var(--color-hr-dark)] lg:w-auto lg:min-w-[247px]"
                  href={hero.ctaUrl}
                  motionPreset="none"
                >
                  {hero.ctaLabel}
                  <GradientArrowUpRightIcon className="size-[10px]" />
                </AppLink>
              </div>
            </div>

            {hero.image ? (
              <div className="pointer-events-none relative h-[331px] w-full overflow-hidden lg:absolute lg:bottom-0 lg:left-[198px] lg:top-0 lg:h-auto lg:w-[1222px] lg:rounded-br-[40px] lg:rounded-tl-none">
                <Image
                  alt={hero.image.alt}
                  className="absolute left-[-6%] top-[-15.85%] h-[199.15%] w-[130.1%] max-w-none object-cover lg:left-[34.77%] lg:top-[-13.53%] lg:h-[163.31%] lg:w-[69.76%]"
                  fetchPriority="high"
                  height={hero.image.height}
                  priority
                  quality={95}
                  sizes="(min-width: 1024px) 90vw, 100vw"
                  src={hero.image.src}
                  width={hero.image.width}
                />
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* WHY: the definition is the passage AI Overviews and People Also Ask quote for "what are SEO services". */}
      <section className="pt-[60px] lg:pt-[120px]" id="what-are-seo-services">
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
                <AppLink className={TEXT_LINK} href={definition.linkHref}>
                  {definition.linkLabel}
                  <GradientArrowUpRightIcon className="size-[10px]" />
                </AppLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-[10px]" id="services">
        <div className={PAGE_SHELL_CLASS}>
          <div className={CONTENT_SHELL_CLASS}>
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
              <SectionLabel>{solutions.label}</SectionLabel>
              <h2 className={`type-h2 mt-5 max-w-[202px] lg:max-w-[384px] ${TEXT}`}>
                <GradientHeading highlightClassName="gradient-text-brand-services" segments={solutions.heading} />
              </h2>
            </div>

            <SeoServicesMobileServicesRail />

            <SeoServicesDesktopServicesGrid cards={gridCards} />

            {solutions.banner ? (
              <ServiceProcessBanner
                banner={solutions.banner}
                descriptionClassName="type-paragraph mt-[39px] max-w-[640px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]"
              />
            ) : null}
          </div>
        </div>
      </section>

      <section className="pt-[10px]" id="results">
        <div className={PAGE_SHELL_CLASS}>
          <div className={PANEL}>
            <SectionLabel>{results.label}</SectionLabel>
            <h2 className={`type-h2 mt-5 max-w-[640px] ${TEXT}`}>
              <GradientHeading highlightClassName="gradient-text-brand-services" segments={results.heading} />
            </h2>

            <div className={`mt-10 overflow-x-auto ${CARD}`}>
              <table className="w-full min-w-[640px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-[var(--color-hr-light-grey)] dark:border-[var(--color-border-inverse-10)]">
                    {results.columns.map((column) => (
                      <th className={`type-cta ${CELL} ${TEXT}`} key={column} scope="col">
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.rows.map((row) => (
                    <tr className="border-b border-[var(--color-hr-light-grey)] last:border-b-0 dark:border-[var(--color-border-inverse-10)]" key={row.client}>
                      <th className={`type-cta ${CELL} ${TEXT}`} scope="row">
                        <AppLink className="inline-flex items-center gap-2 whitespace-nowrap underline-offset-4 hover:underline" href={row.href}>
                          <span className="gradient-text-brand gradient-text-brand-services">{row.client}</span>
                          <GradientArrowUpRightIcon className="size-[10px] shrink-0" />
                        </AppLink>
                      </th>
                      <td className={`type-paragraph ${CELL} ${TEXT}`}>{row.result}</td>
                      <td className={`type-paragraph ${CELL} ${MUTED}`}>{row.timeframe}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-2">
              {results.quotes.map((item) => (
                <figure className={`${CARD} p-[30px]`} key={item.source}>
                  <blockquote className={`type-paragraph ${TEXT}`}>“{item.quote}”</blockquote>
                  <figcaption className={`type-cta mt-5 ${MUTED}`}>{item.source}</figcaption>
                </figure>
              ))}
            </div>
            <AppLink className={`${TEXT_LINK} mt-8`} href={results.linkHref}>
              {results.linkLabel}
              <GradientArrowUpRightIcon className="size-[10px]" />
            </AppLink>
          </div>
        </div>
      </section>

      <ServiceWhyChooseBlock sectionId="about" whyChoose={content.whyChoose} />

      <section className="pt-[10px]" id="who-its-for">
        <div className={PAGE_SHELL_CLASS}>
          <div className={PANEL}>
            <SectionLabel>{audience.label}</SectionLabel>
            <h2 className={`type-h2 mt-5 max-w-[640px] ${TEXT}`}>
              <GradientHeading highlightClassName="gradient-text-brand-services" segments={audience.heading} />
            </h2>
            <ul className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
              {audience.items.map((item) => (
                <li className={`${CARD} flex flex-col p-[30px]`} key={item.title}>
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

      <ServiceFaqBlock cmsFaqItems={cmsFaqItems} content={content} sectionId="faq" variant="boxed" />
    </>
  );
}
