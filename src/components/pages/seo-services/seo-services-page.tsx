import Image from "next/image";

import {
  SeoServicesDesktopServicesGrid,
  type SeoDesktopServiceCard,
} from "@/components/pages/seo-services/seo-services-desktop-services-grid";
import { SeoServicesMobileServicesRail } from "@/components/pages/seo-services/seo-services-mobile-services-rail";
import {
  ServiceFaqBlock,
  ServiceSuccessStoriesBlock,
  ServiceWhyChooseBlock,
  TEXT,
} from "@/components/sections/shared/service-page-blocks";
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
];

interface SeoServicesPageProps {
  content: SeoServiceContent;
  cmsFaqItems?: SanityFaqItem[];
}

export default function SeoServicesPage({ content, cmsFaqItems }: SeoServicesPageProps) {
  const { hero, solutions } = content;

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

      <section className="pt-[60px] lg:pt-[120px]" id="services">
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
          </div>
        </div>
      </section>

      <ServiceWhyChooseBlock sectionId="about" whyChoose={content.whyChoose} />
      <ServiceSuccessStoriesBlock gradientFirst={false} sectionId="case-studies" />
      <ServiceFaqBlock cmsFaqItems={cmsFaqItems} content={content} sectionId="faq" variant="boxed" />
    </>
  );
}
