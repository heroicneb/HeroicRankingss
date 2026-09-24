import Image from "next/image";

import { RichParagraphs } from "@/components/sanity/rich-paragraphs";
import { ServiceFaq } from "@/components/sections/shared/service-faq";
import { AppLink } from "@/components/ui/app-link";
import { GradientHeading } from "@/components/ui/gradient-heading";
import { GradientText } from "@/components/ui/gradient-text";
import {
  FaqPlusIcon,
  GradientArrowUpRightIcon,
} from "@/components/ui/icons/decorative";
import { SectionLabel } from "@/components/ui/section-label";
import { PAGE_SHELL_CLASS } from "@/data/service-shared";

import type { ContentImage, PartnershipContent } from "./partnership-content";

/*
 * /partnership — layout is fixed here; every word, image and link comes from
 * `content` (Sanity "Partnership Page" document, or the built-in default).
 */

const TEXT = "text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]";
const LOGO_GRID_CELLS = 16;

function IconTile({ icon }: { icon: ContentImage | null }) {
  if (!icon) return null;
  return (
    <span className="flex size-[50px] items-center justify-center rounded-[12px] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-pure-white)] dark:border-[var(--color-border-inverse-10)] dark:bg-[var(--color-bg-dark)]">
      <Image
        alt={icon.alt}
        aria-hidden={icon.alt === "" || undefined}
        className="dark:brightness-0 dark:invert"
        height={icon.height}
        sizes={`${icon.width}px`}
        src={icon.src}
        style={{ width: icon.width, height: icon.height }}
        width={icon.width}
      />
    </span>
  );
}

interface PartnershipPageProps {
  content: PartnershipContent;
}

export default function PartnershipPage({ content }: PartnershipPageProps) {
  const { hero, recognize, amplify, scale, darkCta, differentiators, nextSteps, faq } = content;
  const logoCells = [
    ...scale.logos,
    ...Array.from({ length: Math.max(0, LOGO_GRID_CELLS - scale.logos.length) }, () => null),
  ];
  const faqItems = faq.items.map((item, index) => ({ ...item, defaultOpen: index === 0 }));

  return (
    <>
      <section className="pt-[100px]" id="partnerships">
        <div className={PAGE_SHELL_CLASS}>
          <h1 className={`type-h1 mx-auto w-full max-w-[857px] text-center ${TEXT}`}>
            <GradientHeading highlightClassName="gradient-text-partnership-hero" segments={hero.heading} />
          </h1>

          <p className={`type-paragraph mx-auto mt-5 w-full max-w-[792px] text-center ${TEXT}`}>
            {hero.intro}
          </p>

          <div className="relative mx-auto mt-[60px] h-[360px] w-full max-w-[350px] lg:mt-[128px] lg:h-[635px] lg:max-w-none">
            <div className="partnership-hero-panel-gradient absolute bottom-0 left-0 h-[255px] w-full rounded-[30px] lg:h-[480px] lg:rounded-[40px]" />

            {hero.image ? (
              <div className="absolute bottom-0 left-0 h-[360px] w-full overflow-hidden rounded-[30px] lg:h-[635px] lg:rounded-br-[40px] lg:rounded-tl-none lg:rounded-tr-none">
                <Image
                  alt={hero.image.alt}
                  className="pointer-events-none absolute left-[-10%] top-0 h-full w-[120%] max-w-none object-cover object-top lg:left-[9.28%] lg:top-[-12.4%] lg:h-[241.86%] lg:w-[81.12%]"
                  fetchPriority="high"
                  height={hero.image.height}
                  priority
                  sizes="(min-width: 1440px) 1152px, 350px"
                  src={hero.image.src}
                  width={hero.image.width}
                />
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="pt-[60px] lg:pt-[120px]" id="partner-with-us">
        <div className={PAGE_SHELL_CLASS}>
          <div className="px-5 sm:px-8 xl:px-[70px]">
            <SectionLabel>{recognize.label}</SectionLabel>

            <div className="mt-[37px] grid grid-cols-1 gap-12 xl:grid-cols-[1fr_630px] xl:gap-0">
              <h2 className={`type-h2 mt-[6px] w-full max-w-[551px] ${TEXT}`}>
                <GradientHeading highlightClassName="gradient-text-partnership-recognize" segments={recognize.heading} />
              </h2>

              <div>
                {recognize.items.map((item, index) => (
                  <div className={index > 0 ? "mt-10" : ""} key={item.title}>
                    <article className="relative pl-[64px]">
                      <div className="absolute left-0 top-[-4px]">
                        <IconTile icon={item.icon} />
                      </div>
                      <h3 className={`type-h3 ${TEXT}`}>{item.title}</h3>
                      <p className={`type-paragraph mt-5 ${TEXT}`}>{item.description}</p>
                    </article>

                    {index < recognize.items.length - 1 ? (
                      <div aria-hidden className="mt-9 h-px w-full bg-[var(--color-hr-light-grey)]" />
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-[60px] lg:pt-[120px]" id="amplify-authority">
        <div className={PAGE_SHELL_CLASS}>
          <div className="rounded-[40px] bg-[var(--color-hr-off-white)] px-5 pb-[60px] pt-[60px] dark:bg-[var(--color-bg-dark)] sm:px-8 lg:pb-[120px] lg:pt-[120px] xl:px-[70px]">
            <SectionLabel>{amplify.label}</SectionLabel>

            <div className="mt-[43px] grid grid-cols-1 gap-8 xl:grid-cols-[1fr_630px] xl:gap-0">
              <h2 className={`type-h2 w-full max-w-[574px] ${TEXT}`}>
                <GradientHeading highlightClassName="gradient-text-partnership-revenue" segments={amplify.heading} />
              </h2>

              <p className={`type-paragraph w-full max-w-[542px] xl:ml-auto ${TEXT}`}>{amplify.intro}</p>
            </div>

            <div className="mt-[180px] grid grid-cols-1 items-start gap-5 xl:grid-cols-3">
              {amplify.cards.map((card) => (
                <article
                  className="flex h-full min-h-[512px] flex-col rounded-[40px] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-pure-white)] px-[30px] pb-[30px] pt-[30px] dark:border-[var(--color-border-inverse-10)] dark:bg-[var(--color-bg-dark)]"
                  key={card.title}
                >
                  <IconTile icon={card.icon} />

                  <h3 className={`type-h3 mt-[15px] ${TEXT}`}>{card.title}</h3>
                  {card.subtitle ? (
                    <p className="type-paragraph mt-[10px] leading-[24px]">
                      <GradientText className="gradient-text-partnership-card-subtitle">{card.subtitle}</GradientText>
                    </p>
                  ) : null}

                  <div className="mt-[29px] space-y-4">
                    {card.paragraphs.map((paragraph) => (
                      <p className={`type-paragraph ${TEXT}`} key={paragraph}>
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {card.ctaLabel ? (
                    <AppLink
                      className={`type-cta motion-interactive motion-interactive-press mt-auto inline-flex h-[38px] w-fit min-w-[209px] items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[var(--color-hr-accent)] bg-transparent px-5 hover:bg-[var(--color-hr-off-white)] dark:hover:bg-[var(--color-surface-inverse-10)] ${TEXT}`}
                      href={card.ctaUrl ?? "/contact"}
                      motionPreset="none"
                    >
                      {card.ctaLabel}
                      <GradientArrowUpRightIcon className="size-[10px]" />
                    </AppLink>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="pt-[60px] lg:pt-[120px]" id="partnership-scale">
        <div className={PAGE_SHELL_CLASS}>
          <div className="px-5 sm:px-8 xl:px-[70px]">
            <SectionLabel>{scale.label}</SectionLabel>

            <div className="mt-[43px] grid grid-cols-1 gap-10 xl:grid-cols-[1fr_628px] xl:gap-0">
              <div>
                <h2 className={`type-h2 w-full max-w-[483px] ${TEXT}`}>
                  <GradientHeading
                    highlightClassName={["gradient-text-partnership-scale", "gradient-text-partnership-scale-dark"]}
                    segments={scale.heading}
                  />
                </h2>

                <div className={`mt-[39px] w-full max-w-[502px] space-y-5 ${TEXT}`}>
                  <RichParagraphs blocks={scale.paragraphs} />
                </div>
              </div>

              {/* WHY: CMS logos have arbitrary natural sizes, so the grid needs its own width instead of sizing from its content. */}
              <div className="grid w-full grid-cols-2 gap-5 sm:grid-cols-4 xl:w-[628px] xl:justify-self-end">
                {logoCells.map((cell, index) => (
                  <div
                    className="flex h-[100px] w-full items-center justify-center rounded-[20px] bg-[var(--color-hr-off-white)] dark:border dark:border-[var(--color-border-inverse-15)] dark:bg-[var(--color-surface-inverse-95)]"
                    key={cell ? `${cell.image.src}-${index}` : `empty-${index}`}
                  >
                    {cell ? (
                      <Image
                        alt={cell.image.alt}
                        className={`h-auto max-h-[48px] w-auto max-w-[142px] object-contain ${
                          cell.keepColor ? "" : "[filter:brightness(0)] dark:[filter:brightness(0)_invert(1)]"
                        }`}
                        height={cell.image.height}
                        sizes="142px"
                        src={cell.image.src}
                        width={cell.image.width}
                      />
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-[60px] lg:pt-[120px]" id="partnership-dark-cta">
        <div className={PAGE_SHELL_CLASS}>
          <div className="h-auto min-h-[511px] rounded-[40px] bg-[var(--color-hr-dark)] px-5 pb-12 pt-[110px] text-center sm:px-8 xl:px-[70px]">
            <h3 className="type-h3 mx-auto w-full max-w-[668px] text-[var(--color-hr-pure-white)]">
              <GradientHeading highlightClassName="gradient-text-partnership-cta" segments={darkCta.heading} />
            </h3>

            <p className="type-paragraph mx-auto mt-10 w-full max-w-[731px] text-[var(--color-hr-pure-white)]">
              {darkCta.body}
            </p>

            <AppLink
              className="type-cta motion-interactive motion-interactive-press mt-10 inline-flex h-[45px] items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[var(--color-hr-accent)] bg-transparent px-5 text-[var(--color-hr-pure-white)] hover:bg-[color-mix(in_srgb,var(--color-hr-pure-white)_8%,transparent)] focus-visible:ring-offset-[var(--color-hr-dark)] [&_svg]:text-[var(--color-hr-pure-white)]"
              href={darkCta.ctaUrl}
              motionPreset="none"
            >
              {darkCta.ctaLabel}
              <GradientArrowUpRightIcon className="size-[10px]" />
            </AppLink>
          </div>
        </div>
      </section>

      <section className="pt-[10px]" id="distinct-advantage">
        <div className={PAGE_SHELL_CLASS}>
          <div className="rounded-[40px] bg-[var(--color-hr-off-white)] px-5 pb-[60px] pt-[60px] dark:bg-[var(--color-bg-dark)] sm:px-8 lg:pb-[120px] lg:pt-[120px] xl:px-[70px]">
            <SectionLabel>{differentiators.label}</SectionLabel>

            <div className="mt-[43px] grid grid-cols-1 gap-12 xl:grid-cols-[1fr_630px] xl:gap-0">
              <h2 className={`type-h2 w-full max-w-[482px] ${TEXT}`}>
                <GradientHeading highlightClassName="gradient-text-partnership-different" segments={differentiators.heading} />
              </h2>

              <div>
                {differentiators.items.map((item, index) => (
                  <div className={index > 0 ? "mt-10" : ""} key={item.title}>
                    <article className="relative pl-[64px]">
                      <div className="absolute left-0 top-[-4px]">
                        <IconTile icon={item.icon} />
                      </div>
                      <h3 className={`type-h3 ${TEXT}`}>{item.title}</h3>
                      <div className={`mt-5 ${TEXT}`}>
                        <RichParagraphs blocks={item.description} />
                      </div>
                    </article>

                    {index < differentiators.items.length - 1 ? (
                      <div aria-hidden className="mt-10 h-px w-full bg-[var(--color-hr-light-grey)]" />
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-[60px] lg:pt-[120px]" id="white-label-process">
        <div className={PAGE_SHELL_CLASS}>
          <div className="px-5 sm:px-8 xl:px-[70px]">
            <SectionLabel>{nextSteps.label}</SectionLabel>

            <div className="mt-[43px] grid grid-cols-1 gap-8 xl:grid-cols-[1fr_630px] xl:gap-0">
              <h2 className={`type-h2 w-full max-w-[491px] ${TEXT}`}>
                <GradientHeading highlightClassName="gradient-text-partnership-next" segments={nextSteps.heading} />
              </h2>

              <div className={`w-full max-w-[630px] space-y-5 ${TEXT}`}>
                {nextSteps.paragraphs.map((paragraph) => (
                  <p className="type-paragraph" key={paragraph}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <div className="mt-20 grid grid-cols-1 gap-y-5 md:grid-cols-2 md:gap-x-[21px] xl:grid-cols-3">
              {nextSteps.items.map((step) => (
                <article
                  className="h-auto min-h-[355px] rounded-[40px] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-off-white)] px-[30px] pb-[30px] pt-[30px] dark:border-[var(--color-border-inverse-10)] dark:bg-[var(--color-bg-dark)] xl:h-[355px]"
                  key={step.title}
                >
                  <IconTile icon={step.icon} />
                  <h3 className={`type-h3 mt-[15px] ${TEXT}`}>{step.title}</h3>
                  <p className={`type-paragraph mt-5 ${TEXT}`}>{step.description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ServiceFaq
        containerClassName="mt-20 overflow-hidden rounded-[40px] border border-[var(--color-hr-light-grey)] dark:border-[var(--color-border-inverse-10)] bg-[var(--color-hr-pure-white)] dark:bg-[var(--color-bg-dark)]"
        detailsClassName="group"
        detailsExtra={(index) =>
          index !== 0 ? (
            <Image
              alt=""
              aria-hidden
              className="h-px w-full"
              height={1}
              sizes="(min-width: 1280px) 1220px, 100vw"
              src="/partnership/line-13.svg"
              width={1220}
            />
          ) : null
        }
        items={faqItems}
        renderIcon={
          <span className="inline-flex shrink-0 items-center justify-center">
            <FaqPlusIcon className="size-[18px] transition-transform duration-200 group-open:-rotate-45 dark:text-[var(--color-text-inverse)]" />
          </span>
        }
        sectionId="partnership-faq"
      />
    </>
  );
}
