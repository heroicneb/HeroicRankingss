import Image from "next/image";

import { RichParagraphs } from "@/components/sanity/rich-paragraphs";
import { ProcessStepSwitcher } from "@/components/sections/process-step-switcher";
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
import { SectionLabel } from "@/components/ui/section-label";
import { PAGE_SHELL_CLASS, CONTENT_SHELL_CLASS } from "@/data/service-shared";
import { SUCCESS_STORIES } from "@/data/success-stories";
import type { SanityFaqItem } from "@/lib/sanity-data";

import type { ContentImage } from "../shared/page-content";
import type { LinkBuildingContent } from "./link-building-content";

/*
 * /seo/linkbuilding — layout lives here; every word, image, icon and link
 * comes from `content` (Sanity "Link Building Page" document, or the
 * built-in default). Figma: frame 2524:718 in LrfQdM6RTwf95gfkga3tJl.
 */

const TEXT = "text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]";
const CTA_BANNER_BG_SRC = "/link-building/imgSubtract1.svg";
const COLLAPSED_ROW_BG_SRC = "/link-building/imgSubtract3.svg";
const FAQ_BG_SRC = "/link-building/imgSubtract.svg";
const ROW_DIVIDER_SRC = "/link-building/imgLine13.svg";
const SECTION_GLOW_SRC = "/link-building/glow.svg";

function IconTile({ icon }: { icon: ContentImage | null }) {
  if (!icon) return null;
  return (
    <span className="inline-flex size-[50px] items-center justify-center rounded-[12px] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-pure-white)] dark:border-[var(--color-border-inverse-10)] dark:bg-[var(--color-bg-dark)]">
      <Image
        alt={icon.alt}
        aria-hidden={icon.alt === "" || undefined}
        className="block dark:brightness-0 dark:invert"
        height={icon.height}
        src={icon.src}
        style={{ height: icon.height, width: icon.width }}
        width={icon.width}
      />
    </span>
  );
}

interface LinkBuildingPageProps {
  content: LinkBuildingContent;
  /** FAQ documents from the "FAQ Items" collection (used when the page has no inline FAQ). */
  cmsFaqItems?: SanityFaqItem[];
}

export default function LinkBuildingPage({ content, cmsFaqItems }: LinkBuildingPageProps) {
  const { hero, whyBacklinks, howWeBuild, solutions, competitorInsights, whyChoose, faq } = content;

  const faqSource = faq.items.length
    ? faq.items
    : cmsFaqItems?.length
      ? cmsFaqItems.map((f) => ({ question: f.question, answer: f.answer }))
      : [];
  const faqItems = faqSource.map((item, index) => ({ ...item, defaultOpen: index === 0 }));

  return (
    <>
      <section className="pt-[60px] lg:pt-[120px]" id="link-building-home">
        <div className={PAGE_SHELL_CLASS}>
          <h1 className={`type-h1 mx-auto max-w-[294px] text-center lg:max-w-[857px] ${TEXT}`}>
            <GradientHeading highlightClassName="gradient-text-brand-services" segments={hero.title} />
          </h1>

          <p className={`type-paragraph mx-auto mt-5 max-w-[220px] text-center lg:max-w-[688px] ${TEXT}`}>
            {hero.tagline}
          </p>

          <div className="relative mt-[60px] overflow-hidden rounded-[30px] bg-[linear-gradient(73.9149deg,var(--color-hr-dark)_35.359%,var(--color-case-art-maudsch)_142.03%)] dark:opacity-90 lg:mt-[120px] lg:h-[684px] lg:rounded-[40px] lg:bg-[linear-gradient(52.4159deg,var(--color-hr-dark)_35.359%,var(--color-case-art-maudsch)_142.03%)]">
            <div className="relative z-10 flex flex-col items-center px-[15px] pb-[20px] pt-[60px] text-center text-[var(--color-hr-pure-white)] lg:h-full lg:items-start lg:px-[70px] lg:pt-[120px] lg:text-left">
              <div className="mx-auto w-full max-w-[298px] lg:mx-0 lg:max-w-[561px]">
                <SectionLabel className="text-[var(--color-hr-pure-white)]">{hero.label}</SectionLabel>
                <h2 className="type-h2 mx-auto mt-5 w-full max-w-[254px] text-center tracking-[-1.04px] text-[var(--color-hr-pure-white)] lg:mx-0 lg:max-w-[561px] lg:text-left">
                  <GradientHeading highlightClassName="gradient-text-brand-services" segments={hero.heading} />
                </h2>

                <div className="mx-auto mt-5 w-full max-w-[274px] text-center text-[var(--color-hr-pure-white)] lg:mx-0 lg:mt-[40px] lg:max-w-[484px] lg:text-left">
                  <RichParagraphs blocks={hero.body} paragraphClassName="text-[var(--color-hr-pure-white)]" />
                </div>

                <AppLink
                  className="type-cta motion-interactive motion-interactive-press mt-5 inline-flex h-[45px] w-full items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[var(--color-hr-accent)] bg-transparent px-5 text-[var(--color-hr-pure-white)] hover:bg-[color-mix(in_srgb,var(--color-hr-pure-white)_8%,transparent)] lg:mt-4 lg:w-auto"
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
                  className="absolute left-[3.41%] top-[-11.48%] h-[132.66%] w-[93.19%] max-w-none object-cover lg:left-[48.24%] lg:top-[-9.3%] lg:h-[122.57%] lg:w-[47.61%]"
                  fetchPriority="high"
                  height={hero.image.height}
                  priority
                  sizes="(min-width: 1024px) 48vw, 350px"
                  src={hero.image.src}
                  width={hero.image.width}
                />
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* Figma 2524:1111 — "Why Backlinks Still Rule Both Search and AI" */}
      <section className="pt-[10px]" id="link-building-why-backlinks">
        <div className={PAGE_SHELL_CLASS}>
          <div className="relative overflow-hidden rounded-[30px] bg-[linear-gradient(65.1111deg,var(--color-hr-dark)_37.4%,var(--color-case-art-maudsch)_153.3%)] px-5 py-[60px] text-[var(--color-hr-pure-white)] sm:px-8 lg:rounded-[40px] lg:py-[120px] lg:pl-[70px] lg:pr-[88px]">
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-[-145px] flex h-[834px] w-[1701px] -translate-x-1/2 items-center justify-center"
            >
              <div className="relative h-[439px] w-[1643px] flex-none rotate-[14.4deg]">
                <Image
                  alt=""
                  className="absolute block max-w-none"
                  height={664}
                  src={SECTION_GLOW_SRC}
                  style={{ width: 1868, height: 664, left: "-6.85%", top: "-25.62%" }}
                  width={1868}
                />
              </div>
            </div>

            <div className="relative z-10 flex flex-col items-start gap-[40px] lg:flex-row lg:gap-[69px]">
              {whyBacklinks.image ? (
                <Image
                  alt={whyBacklinks.image.alt}
                  // WHY: 581px is the 1440 design width; let it shrink between lg and xl so the text column keeps fitting.
                  className="h-auto w-full max-w-[581px] lg:w-[46%] lg:shrink-0 xl:w-[581px]"
                  height={whyBacklinks.image.height}
                  sizes="(min-width: 1024px) 581px, 100vw"
                  src={whyBacklinks.image.src}
                  width={whyBacklinks.image.width}
                />
              ) : null}
              <div className="min-w-0 lg:max-w-[612px] lg:flex-1">
                <h2 className="type-h2 max-w-[542px] tracking-[-1.04px] text-[var(--color-hr-pure-white)]">
                  <GradientHeading highlightClassName="gradient-text-brand-about-heading" segments={whyBacklinks.heading} />
                </h2>
                <div className="type-paragraph mt-[40px] space-y-5 text-[var(--color-text-inverse-95)]">
                  {whyBacklinks.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Figma 2524:1118 — "How We Build Links: One Motion, Two Systems" */}
      <section className="pt-[10px]" id="link-building-how-we-build">
        <div className={PAGE_SHELL_CLASS}>
          <div className="rounded-[40px] bg-[var(--color-hr-off-white)] px-5 py-[60px] dark:bg-[var(--color-bg-dark)] sm:px-8 lg:px-[70px] lg:py-[120px]">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:gap-5">
              <div className="lg:w-[630px] lg:shrink-0">
                <SectionLabel>{howWeBuild.label}</SectionLabel>
                <h2 className={`type-h2 mt-5 tracking-[-1.04px] ${TEXT}`}>
                  <GradientHeading highlightClassName="gradient-text-brand-services" segments={howWeBuild.heading} />
                </h2>
              </div>
              <p className={`type-paragraph lg:max-w-[565px] ${TEXT}`}>{howWeBuild.intro}</p>
            </div>

            <div className="mt-[70px] grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {howWeBuild.cards.map((card) => (
                <article
                  className="flex flex-col gap-[30px] rounded-[40px] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-pure-white)] p-[30px] dark:border-[var(--color-border-inverse-10)] dark:bg-[var(--color-bg-dark)] xl:min-h-[400px]"
                  key={card.title}
                >
                  <h3 className={`type-h3 max-w-[336px] tracking-[-0.64px] ${TEXT}`}>{card.title}</h3>
                  <p className={`type-paragraph ${TEXT}`}>{card.body}</p>
                </article>
              ))}
            </div>

            <p className={`type-paragraph mt-[70px] ${TEXT}`}>{howWeBuild.closing}</p>
          </div>
        </div>
      </section>

      <section className="pt-[10px] lg:pt-[10px]" id="link-building-solutions">
        <div className={PAGE_SHELL_CLASS}>
          <div className="rounded-[40px] bg-[var(--color-hr-off-white)] px-5 pb-[70px] pt-[60px] dark:bg-[var(--color-bg-dark)] sm:px-8 lg:px-[70px] lg:pt-[120px]">
            <SectionLabel>{solutions.label}</SectionLabel>
            <h2 className={`type-h2 mt-5 max-w-[500px] tracking-[-1.04px] ${TEXT}`}>
              <GradientHeading highlightClassName="gradient-text-brand-services" segments={solutions.heading} />
            </h2>

            <div className="mt-[80px] grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {solutions.cards.map((card) => (
                <article
                  className="flex h-[588px] flex-col rounded-[40px] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-pure-white)] px-[30px] pb-[30px] pt-[30px] dark:border-[var(--color-border-inverse-10)] dark:bg-[var(--color-bg-dark)]"
                  key={card.title}
                >
                  <IconTile icon={card.icon} />

                  <h3 className={`type-h3 mt-[15px] min-h-[64px] ${TEXT}`}>{card.title}</h3>
                  <p className="type-paragraph mt-[10px] min-h-[48px] gradient-text-brand gradient-text-brand-services">
                    {card.subtitle}
                  </p>
                  <p className={`type-paragraph mt-[30px] ${TEXT}`}>{card.body}</p>

                  <AppLink
                    className={`type-cta mt-auto inline-flex h-[45px] w-fit min-w-[163px] items-center justify-center gap-2 self-start whitespace-nowrap rounded-[var(--radius-button)] border border-[var(--color-hr-accent)] bg-transparent px-5 hover:bg-[var(--color-hr-off-white)] dark:hover:bg-[var(--color-surface-inverse-10)] ${TEXT}`}
                    href={card.ctaUrl}
                  >
                    {card.ctaLabel}
                    <GradientArrowUpRightIcon className="size-[10px]" />
                  </AppLink>
                </article>
              ))}
            </div>

            <section className="relative mt-[120px] h-[382px] overflow-hidden rounded-[40px] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-pure-white)] dark:border-[var(--color-border-inverse-10)] dark:bg-[var(--color-bg-dark)]">
              <Image alt="" aria-hidden className="pointer-events-none object-cover dark:hidden" fill sizes="1280px" src={CTA_BANNER_BG_SRC} />

              <div className="relative z-10 px-[30px] pb-[30px] pt-[51px]">
                <h3 className={`type-h3 max-w-[884px] pb-[4px] leading-[1.3] tracking-[-0.64px] ${TEXT}`}>
                  <GradientHeading highlightClassName="gradient-text-brand-about-us-process-title" segments={solutions.banner.heading} />
                </h3>

                <div className="mt-[20px] lg:mt-[30px]">
                  <ProcessStepSwitcher
                    activePillClassName="type-paragraph whitespace-nowrap rounded-[100px] bg-[var(--color-hr-dark)] px-[14px] py-[6px] text-[18px] leading-[24px] text-[var(--color-hr-pure-white)] dark:bg-[var(--color-text-inverse)] dark:text-[var(--color-text-fill-dark)]"
                    descriptionClassName="type-paragraph mt-[63px] max-w-[488px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]"
                    mutedPillClassName="type-paragraph whitespace-nowrap rounded-[100px] bg-[var(--color-hr-off-white)] dark:bg-[var(--color-surface-inverse-10)] px-[14px] py-[6px] text-[18px] leading-[24px] text-[var(--color-hr-grey)] dark:text-[var(--color-text-inverse-60)] transition-colors hover:text-[var(--color-hr-dark)] dark:hover:text-[var(--color-text-inverse)]"
                    rowClassName="flex flex-wrap items-center gap-[10px] pb-1 min-[1280px]:flex-nowrap"
                    steps={solutions.banner.processSteps}
                  />
                </div>

                <AppLink
                  className={`type-cta motion-interactive motion-interactive-press mt-[30px] inline-flex h-[45px] w-full items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[var(--color-hr-accent)] bg-transparent hover:bg-[var(--color-hr-off-white)] dark:hover:bg-[var(--color-surface-inverse-10)] lg:mt-[40px] lg:w-auto lg:min-w-[222px] lg:px-5 ${TEXT}`}
                  href={solutions.banner.ctaUrl}
                  motionPreset="none"
                >
                  {solutions.banner.ctaLabel}
                  <GradientArrowUpRightIcon className="size-[10px]" />
                </AppLink>
              </div>
            </section>
          </div>
        </div>
      </section>

      <section className="pt-[60px] lg:pt-[120px]" id="link-building-competitor-insights">
        <div className={PAGE_SHELL_CLASS}>
          <div className={CONTENT_SHELL_CLASS}>
            <SectionLabel>{competitorInsights.label}</SectionLabel>
            <h2 className={`type-h2 mt-5 max-w-[542px] tracking-[-1.04px] ${TEXT}`}>
              <GradientHeading highlightClassName="gradient-text-brand-services" segments={competitorInsights.heading} />
            </h2>

            <div className="mt-[80px] space-y-[10px]">
              {competitorInsights.items.map((item, index) => (
                <details
                  className="group relative overflow-hidden rounded-[40px] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-pure-white)] dark:border-[var(--color-border-inverse-10)] dark:bg-[var(--color-bg-dark)]"
                  key={item.title}
                  name="link-building-competitor-insights"
                  open={index === 0}
                >
                  <Image alt="" aria-hidden className="pointer-events-none object-cover group-open:hidden dark:hidden" fill sizes="1280px" src={COLLAPSED_ROW_BG_SRC} />

                  <summary className="relative z-10 flex cursor-pointer list-none items-center justify-between gap-5 px-[30px] py-[30px] [&::-webkit-details-marker]:hidden">
                    <h3 className={`type-h3 tracking-[-0.64px] ${TEXT}`}>{item.title}</h3>
                    <FaqPlusIcon className="size-[18px] shrink-0 transition-transform duration-200 group-open:-rotate-45 dark:text-[var(--color-text-inverse)]" />
                  </summary>

                  <div className="relative z-10 border-t border-[var(--color-hr-light-grey)] px-[30px] pb-[30px] pt-[30px] dark:border-[var(--color-border-inverse-10)]">
                    <div className="grid gap-[30px] xl:grid-cols-[520px_1fr] xl:items-start">
                      {item.chart ? (
                        <Image
                          alt={item.chart.alt}
                          className="h-auto w-full rounded-[20px]"
                          height={item.chart.height}
                          sizes="(min-width: 1280px) 520px, 100vw"
                          src={item.chart.src}
                          width={item.chart.width}
                        />
                      ) : null}

                      <div className={`type-paragraph space-y-5 ${TEXT}`}>
                        {item.paragraphs.map((paragraph) => (
                          <p key={paragraph}>{paragraph}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

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
        sectionId="link-building-why-heroic"
      />

      <ServiceSuccessStories
        buttonIcon={<GradientArrowUpRightIcon className="size-[10px]" />}
        cardArrowIcon={<DiagonalArrowIcon className="size-5" />}
        contentShellClass={CONTENT_SHELL_CLASS}
        heading={
          <>
            <GradientText className="gradient-text-brand-case">Success</GradientText> Stories
          </>
        }
        pageShellClass={PAGE_SHELL_CLASS}
        sectionId="link-building-success-stories"
        stories={SUCCESS_STORIES}
      />

      <ServiceFaq
        answerClassName="px-[30px] pb-[30px] pr-[60px] sm:pr-[90px] lg:pr-[223px]"
        containerClassName="relative mt-[80px] overflow-hidden rounded-[40px] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-pure-white)] dark:border-[var(--color-border-inverse-10)] dark:bg-[var(--color-bg-dark)]"
        containerExtra={<Image alt="" aria-hidden className="pointer-events-none object-cover dark:hidden" fill sizes="1280px" src={FAQ_BG_SRC} />}
        detailsClassName="group relative z-10 border-[var(--color-hr-light-grey)] open:bg-[var(--color-hr-pure-white)] dark:border-[var(--color-border-inverse-10)] dark:bg-[var(--color-bg-dark)] dark:open:bg-[var(--color-bg-dark)]"
        detailsExtra={(index) =>
          index !== 0 ? (
            <Image
              alt=""
              aria-hidden
              className="pointer-events-none absolute left-[30px] top-0 h-px w-[calc(100%-60px)] dark:opacity-30"
              height={1}
              src={ROW_DIVIDER_SRC}
              width={1220}
            />
          ) : null
        }
        headingClassName={`type-h3 tracking-[-0.64px] ${TEXT}`}
        items={faqItems}
        renderIcon={
          <span className="inline-flex size-[18px] items-center justify-center">
            <FaqPlusIcon className="size-[18px] transition-transform duration-200 group-open:-rotate-45 dark:text-[var(--color-text-inverse)]" />
          </span>
        }
        sectionId="link-building-faq"
        summaryBorderClassName="dark:border-t dark:border-[var(--color-border-inverse-10)]"
        summaryClassName="flex cursor-pointer list-none items-center justify-between gap-5 px-[30px] py-[30px] [&::-webkit-details-marker]:hidden"
      />
    </>
  );
}
