import type { ReactNode } from "react";
import Image from "next/image";

import { ServiceFaq } from "@/components/sections/shared/service-faq";
import { AppLink } from "@/components/ui/app-link";
import { GradientHeading } from "@/components/ui/gradient-heading";
import {
  FaqPlusIcon,
  GradientArrowUpRightIcon,
} from "@/components/ui/icons/decorative";
import { SectionLabel } from "@/components/ui/section-label";
import { PAGE_SHELL_CLASS } from "@/data/service-shared";
import { cn } from "@/lib/cn";
import type { SanityFaqItem } from "@/lib/sanity-data";

import type { ContentImage } from "../shared/page-content";
import type { RedditMarketingContent } from "./reddit-marketing-content";

/*
 * /seo/reddit-marketing — layout lives here; every word, image, icon and link
 * comes from `content` (Sanity "Reddit Marketing Page" document, or the
 * built-in default). Figma: frame 1311:48 in c9T57PLFisgSWhzLthkJob;
 * extraction notes in docs/figma-cache/extractions/2026-09-23-reddit-marketing-section-00-page.md
 */

const GLOW_SRC = "/reddit-marketing/glow.svg";
const TEXT_PRIMARY = "text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]";
const CARD_BORDER = "border border-[var(--color-hr-light-grey)] dark:border-[var(--color-border-inverse-10)]";
const SECTION_PAD = "px-5 py-[60px] sm:px-8 lg:px-[70px] lg:py-[120px]";
const CTA_BUTTON_CLASS =
  "type-cta motion-interactive motion-interactive-press inline-flex h-[45px] items-center justify-center gap-[10px] rounded-[var(--radius-button)] border border-[var(--color-hr-accent)] bg-transparent px-5 hover:bg-[var(--color-hr-off-white)] dark:hover:bg-[var(--color-surface-inverse-10)]";

/** Renders "line one\nline two" as two lines (the design breaks these descriptions deliberately). */
function MultilineText({ text, className }: { text: string; className?: string }) {
  const lines = text.split("\n");
  return (
    <p className={className}>
      {lines.map((line, index) => (
        <span key={index}>
          {index > 0 ? (
            <>
              <br className="hidden lg:block" aria-hidden />{" "}
            </>
          ) : null}
          {line}
        </span>
      ))}
    </p>
  );
}

/** 50×50 bordered icon tile. Icons that are already 50px carry their own tile (Figma export) and render as-is. */
function IconTile({ icon, className }: { icon: ContentImage | null; className?: string }) {
  if (!icon) return null;
  if (icon.width >= 50 && icon.height >= 50) {
    return (
      <Image
        alt={icon.alt}
        aria-hidden={icon.alt === "" || undefined}
        className={cn("block size-[50px] shrink-0 rounded-[12px] dark:invert", className)}
        height={icon.height}
        src={icon.src}
        width={icon.width}
      />
    );
  }
  return (
    <span
      className={cn(
        "relative inline-flex size-[50px] shrink-0 items-center justify-center rounded-[12px] bg-[var(--color-hr-pure-white)] dark:bg-[var(--color-bg-dark)]",
        CARD_BORDER,
        className,
      )}
    >
      <Image
        alt={icon.alt}
        aria-hidden={icon.alt === "" || undefined}
        className="block dark:brightness-0 dark:invert"
        height={icon.height}
        src={icon.src}
        style={{ width: icon.width, height: icon.height }}
        width={icon.width}
      />
    </span>
  );
}

function SectionHeading({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <>
      <SectionLabel>{label}</SectionLabel>
      <h2 className={cn("type-h2 mt-5 tracking-[-1.04px]", TEXT_PRIMARY, className)}>{children}</h2>
    </>
  );
}

/** Soft purple glow used behind the two dark sections (Figma vector 278c1). */
function DarkGlow() {
  return (
    <div aria-hidden className="pointer-events-none absolute left-[-172px] top-[-111px] flex h-[834px] w-[1701px] items-center justify-center">
      <div className="relative h-[439px] w-[1643px] flex-none rotate-[14.4deg]">
        <Image
          alt=""
          className="absolute block max-w-none"
          height={664}
          src={GLOW_SRC}
          style={{ width: 1868, height: 664, left: "-6.85%", top: "-25.62%" }}
          width={1868}
        />
      </div>
    </div>
  );
}

function DarkCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <article className="flex flex-col gap-[30px] rounded-[40px] border border-[var(--color-hr-dark-line)] bg-[var(--color-hr-black-box)] p-[30px]">
      <h3 className="type-h3 max-w-[244px] pb-[0.15em] gradient-text-brand-light">{title}</h3>
      {children}
    </article>
  );
}

function CtaLink({ children, href, className }: { children: ReactNode; href: string; className?: string }) {
  return (
    <AppLink className={cn(CTA_BUTTON_CLASS, TEXT_PRIMARY, className)} href={href} motionPreset="none">
      {children}
      <GradientArrowUpRightIcon className="size-[10px]" />
    </AppLink>
  );
}

interface RedditMarketingPageProps {
  content: RedditMarketingContent;
  /** FAQ documents from the "FAQ Items" collection (used when the page has no inline FAQ). */
  cmsFaqItems?: SanityFaqItem[];
}

export default function RedditMarketingPage({ content, cmsFaqItems }: RedditMarketingPageProps) {
  const { hero, whyDifferent, opportunity, whatWeDo, serviceMenu, whatYouWin, process, reporting, whyTrust, faq } = content;

  const faqSource = faq.items.length
    ? faq.items
    : cmsFaqItems?.length
      ? cmsFaqItems.map((f) => ({ question: f.question, answer: f.answer }))
      : [];
  const faqItems = faqSource.map((item, index) => ({ ...item, defaultOpen: index === 0 }));

  return (
    <>
      {/* Hero — Figma 1311:88 / 1311:89 / 1311:843 / 1311:838 + rectangles 1311:90-92 */}
      <section className="pt-[60px] lg:pt-[120px]" id="reddit-marketing-home">
        <div className={PAGE_SHELL_CLASS}>
          <h1 className="type-h1 mx-auto max-w-[857px] text-center">
            <GradientHeading highlightClassName="gradient-text-brand-services" segments={hero.heading} />
          </h1>

          <p className={cn("mx-auto mt-5 max-w-[598px] text-center text-[20px] leading-[28px] tracking-[-0.4px] lg:text-[24px] lg:leading-[30px]", TEXT_PRIMARY)}>
            {hero.subtitle}
          </p>

          <p className={cn("type-paragraph mx-auto mt-5 max-w-[846px] text-center", TEXT_PRIMARY)}>{hero.tagline}</p>

          <div className="mt-[40px] flex justify-center">
            <CtaLink href={hero.ctaUrl}>{hero.ctaLabel}</CtaLink>
          </div>

          <div className="relative mt-[120px] lg:mt-[222px]">
            <div className="h-[300px] rounded-[30px] bg-[linear-gradient(42.3576deg,var(--color-hr-dark)_35.359%,var(--color-case-art-maudsch)_142.03%)] sm:h-[380px] lg:h-[480px] lg:rounded-[40px]" />
            {hero.image ? (
              <Image
                alt={hero.image.alt}
                className="pointer-events-none absolute bottom-0 left-1/2 h-[400px] w-auto max-w-none -translate-x-1/2 sm:h-[500px] lg:h-[635px]"
                fetchPriority="high"
                height={hero.image.height}
                priority
                sizes="(min-width: 1024px) 635px, 500px"
                src={hero.image.src}
                width={hero.image.width}
              />
            ) : null}
          </div>
        </div>
      </section>

      {/* Section 1 — Why Reddit Is Different (1313:176) */}
      <section className="pt-[10px]" id="reddit-marketing-why-different">
        <div className={PAGE_SHELL_CLASS}>
          <div className={cn("rounded-[40px] border border-[var(--color-hr-off-white)] bg-[var(--color-hr-pure-white)] dark:border-[var(--color-border-inverse-10)] dark:bg-[var(--color-bg-dark)]", SECTION_PAD)}>
            <SectionLabel>{whyDifferent.label}</SectionLabel>
            <div className="mt-[14px] flex flex-col gap-[60px] lg:flex-row lg:items-start lg:justify-between">
              <div className="lg:w-[490px] lg:shrink-0">
                <h2 className={cn("type-h2 tracking-[-1.04px]", TEXT_PRIMARY)}>
                  <GradientHeading highlightClassName="gradient-text-brand-about-heading" segments={whyDifferent.heading} />
                </h2>
                <p className={cn("type-paragraph mt-[31px] max-w-[458px]", TEXT_PRIMARY)}>{whyDifferent.intro}</p>
              </div>

              <ul className="flex w-full flex-col lg:w-[630px] lg:shrink-0">
                {whyDifferent.items.map((item, index) => (
                  <li
                    className={cn(
                      "flex flex-col gap-4 py-[19px] first:pt-0 last:pb-0",
                      index !== 0 ? "border-t border-[var(--color-hr-light-grey)] dark:border-[var(--color-border-inverse-10)]" : null,
                    )}
                    key={item.title}
                  >
                    <div className="flex items-center gap-4">
                      <IconTile icon={item.icon} />
                      <h3 className={cn("type-h3", TEXT_PRIMARY)}>{item.title}</h3>
                    </div>
                    <MultilineText className={cn("type-paragraph", TEXT_PRIMARY)} text={item.description} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 — The Opportunity (1313:197) */}
      <section className="pt-[10px]" id="reddit-marketing-opportunity">
        <div className={PAGE_SHELL_CLASS}>
          <div className={cn("rounded-[40px] border border-[var(--color-hr-off-white)] bg-[var(--color-hr-pure-white)] dark:border-[var(--color-border-inverse-10)] dark:bg-[var(--color-bg-dark)]", SECTION_PAD)}>
            <SectionHeading className="max-w-[571px]" label={opportunity.label}>
              <GradientHeading highlightClassName="gradient-text-brand-about-heading" segments={opportunity.heading} />
            </SectionHeading>
            <p className={cn("type-paragraph mt-5", TEXT_PRIMARY)}>{opportunity.intro}</p>

            <div className="mt-[60px] grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 lg:mt-[120px]">
              {opportunity.cards.map((card) => (
                <article className={cn("flex flex-col gap-5 rounded-[40px] bg-[var(--color-hr-off-white)] p-[30px] dark:bg-[var(--color-surface-inverse-10)]", CARD_BORDER)} key={card.title}>
                  <IconTile icon={card.icon} />
                  <h3 className={cn("type-h3 max-w-[334px]", TEXT_PRIMARY)}>{card.title}</h3>
                  <p className={cn("type-paragraph", TEXT_PRIMARY)}>{card.description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 — What We Do (1313:629) */}
      <section className="pt-[10px]" id="reddit-marketing-services">
        <div className={PAGE_SHELL_CLASS}>
          <div className={cn("rounded-[40px] bg-[var(--color-hr-off-white)] dark:bg-[var(--color-bg-dark)]", SECTION_PAD)}>
            <SectionLabel>{whatWeDo.label}</SectionLabel>
            <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-start lg:gap-[128px]">
              <h2 className={cn("type-h2 tracking-[-1.04px] lg:w-[630px] lg:shrink-0", TEXT_PRIMARY)}>
                <GradientHeading highlightClassName="gradient-text-brand-services" segments={whatWeDo.heading} />
              </h2>
              <MultilineText className={cn("type-paragraph lg:max-w-[522px]", TEXT_PRIMARY)} text={whatWeDo.intro} />
            </div>

            <div className="mt-[60px] grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 lg:mt-[120px]">
              {whatWeDo.cards.map((card) => (
                <article className={cn("flex flex-col gap-5 rounded-[40px] bg-[var(--color-hr-pure-white)] p-[30px] dark:bg-[var(--color-bg-dark)]", CARD_BORDER)} key={card.title}>
                  <IconTile icon={card.icon} />
                  <h3 className={cn("type-h3 max-w-[334px]", TEXT_PRIMARY)}>{card.title}</h3>
                  {card.subtitle ? <p className="type-paragraph gradient-text-brand gradient-text-brand-services">{card.subtitle}</p> : null}
                  <p className={cn("type-paragraph", TEXT_PRIMARY)}>{card.description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 4 — Full Service Menu (1314:630) */}
      <section className="pt-[10px]" id="reddit-marketing-menu">
        <div className={PAGE_SHELL_CLASS}>
          <div className={cn("relative overflow-hidden rounded-[40px] bg-[var(--color-hr-dark)] text-[var(--color-hr-pure-white)]", SECTION_PAD)}>
            <DarkGlow />
            <div className="relative z-10">
              <SectionLabel className="text-[var(--color-hr-pure-white)]">{serviceMenu.label}</SectionLabel>
              <h2 className="type-h2 mt-5 tracking-[-1.04px] text-[var(--color-hr-pure-white)]">
                <GradientHeading highlightClassName="gradient-text-brand-featured" segments={serviceMenu.heading} />
              </h2>

              <div className="mt-[60px] grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                {serviceMenu.cards.map((card) => (
                  <DarkCard key={card.title} title={card.title}>
                    <ul className="type-paragraph list-disc pl-[27px] text-[var(--color-hr-pure-white)]">
                      {card.items.map((item) => (
                        <li className="mb-[3px] last:mb-0" key={item}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </DarkCard>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5 — What You Win (1360:1133) */}
      <section className="pt-[10px]" id="reddit-marketing-what-you-win">
        <div className={PAGE_SHELL_CLASS}>
          <div className={cn("rounded-[40px] bg-[var(--color-hr-pure-white)] dark:bg-[var(--color-bg-dark)]", SECTION_PAD)}>
            <SectionLabel>{whatYouWin.label}</SectionLabel>
            <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-start lg:gap-[128px]">
              <h2 className={cn("type-h2 tracking-[-1.04px] lg:w-[630px] lg:shrink-0", TEXT_PRIMARY)}>
                <GradientHeading highlightClassName="gradient-text-brand-services" segments={whatYouWin.heading} />
              </h2>
              <p className={cn("type-paragraph lg:max-w-[522px]", TEXT_PRIMARY)}>{whatYouWin.intro}</p>
            </div>

            <div className="mt-[60px] grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 lg:mt-[120px]">
              {whatYouWin.cards.map((card) => (
                <article className={cn("flex flex-col gap-5 rounded-[40px] bg-[var(--color-hr-off-white)] p-[30px] dark:bg-[var(--color-surface-inverse-10)]", CARD_BORDER)} key={card.title}>
                  <IconTile icon={card.icon} />
                  <h3 className={cn("type-h3 max-w-[334px]", TEXT_PRIMARY)}>{card.title}</h3>
                  <p className={cn("type-paragraph", TEXT_PRIMARY)}>{card.description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 6 — Our Process (1320:1197) */}
      <section className="pt-[10px]" id="reddit-marketing-process">
        <div className={PAGE_SHELL_CLASS}>
          <div className={cn("rounded-[40px] bg-[var(--color-hr-off-white)] dark:bg-[var(--color-bg-dark)]", SECTION_PAD)}>
            <SectionLabel>{process.label}</SectionLabel>
            <div className="mt-5 flex flex-col gap-[60px] lg:flex-row lg:items-start lg:gap-[99px]">
              <div className="lg:w-[551px] lg:shrink-0">
                <h2 className={cn("type-h2 max-w-[456px] tracking-[-1.04px]", TEXT_PRIMARY)}>
                  <GradientHeading highlightClassName="gradient-text-brand-about-body" segments={process.heading} />
                </h2>
                <p className={cn("type-paragraph mt-5 max-w-[522px]", TEXT_PRIMARY)}>{process.intro}</p>
              </div>

              <ol className="flex w-full flex-col lg:w-[630px] lg:shrink-0">
                {process.steps.map((step, index) => (
                  <li
                    className={cn(
                      "flex flex-col gap-4 py-[18px] first:pt-0 last:pb-0",
                      index !== 0 ? "border-t border-[var(--color-hr-light-grey)] dark:border-[var(--color-border-inverse-10)]" : null,
                    )}
                    key={`${step.number}-${step.title}`}
                  >
                    <div className="flex flex-wrap items-center gap-[14px]">
                      <span className={cn("inline-flex size-[50px] shrink-0 items-center justify-center rounded-[12px] bg-[var(--color-hr-pure-white)] dark:bg-[var(--color-bg-dark)]", CARD_BORDER)}>
                        <span className="type-h3 gradient-text-brand gradient-text-brand-about-body pb-0">{step.number}</span>
                      </span>
                      <h3 className={cn("type-h3", TEXT_PRIMARY)}>{step.title}</h3>
                      {step.optional ? (
                        <span className={cn("inline-flex items-center rounded-[20px] border border-[var(--color-hr-accent)] px-[14px] py-[6px] text-[14px] leading-none", TEXT_PRIMARY)}>
                          Optional
                        </span>
                      ) : null}
                    </div>
                    <p className={cn("type-paragraph", TEXT_PRIMARY)}>{step.description}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Section 7 — Reporting (1360:1278) */}
      <section className="pt-[10px]" id="reddit-marketing-reporting">
        <div className={PAGE_SHELL_CLASS}>
          <div className={cn("relative overflow-hidden rounded-[40px] bg-[var(--color-hr-dark)] text-[var(--color-hr-pure-white)]", SECTION_PAD)}>
            <DarkGlow />
            <div className="relative z-10">
              <SectionLabel className="text-[var(--color-hr-pure-white)]">{reporting.label}</SectionLabel>
              <h2 className="type-h2 mt-5 tracking-[-1.04px] text-[var(--color-hr-pure-white)]">
                <GradientHeading highlightClassName="gradient-text-brand-featured" segments={reporting.heading} />
              </h2>
              <p className="type-paragraph mt-5 text-[var(--color-hr-pure-white)]">{reporting.intro}</p>

              <div className="mt-[60px] grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                {reporting.cards.map((card) => (
                  <DarkCard key={card.title} title={card.title}>
                    <p className="type-paragraph text-[var(--color-hr-pure-white)]">{card.body}</p>
                  </DarkCard>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 8 — Why Heroic Rankings (loose nodes 1320:1339 … 1320:1368) */}
      <section className="pt-[60px] lg:pt-[140px]" id="reddit-marketing-why-heroic">
        <div className={PAGE_SHELL_CLASS}>
          <div className="px-5 sm:px-8 lg:px-[70px]">
            <SectionHeading className="max-w-[406px]" label={whyTrust.label}>
              <GradientHeading highlightClassName="gradient-text-brand-trust" segments={whyTrust.heading} />
            </SectionHeading>

            <div className="mt-[80px] grid grid-cols-1 gap-y-[56px] md:grid-cols-2 lg:grid-cols-3">
              {whyTrust.items.map((item) => (
                <article className="border-l border-[var(--color-hr-light-grey)] pl-[30px] dark:border-[var(--color-border-inverse-10)]" key={item.title}>
                  <h3 className={cn("type-h3 max-w-[290px]", TEXT_PRIMARY)}>{item.title}</h3>
                  <p className={cn("type-paragraph mt-5 max-w-[315px]", TEXT_PRIMARY)}>{item.description}</p>
                </article>
              ))}

              <article className="border-l border-[var(--color-hr-light-grey)] pl-[30px] dark:border-[var(--color-border-inverse-10)]">
                <h3 className={cn("type-h3 max-w-[186px]", TEXT_PRIMARY)}>{whyTrust.ctaTitle}</h3>
                <CtaLink className="mt-[44px] w-full max-w-[251px] whitespace-nowrap lg:w-auto lg:min-w-[212px]" href={whyTrust.ctaUrl}>
                  {whyTrust.ctaLabel}
                </CtaLink>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* Section 9 — FAQ (1320:1457) */}
      <ServiceFaq
        items={faqItems}
        renderIcon={
          <span className="inline-flex size-[18px] items-center justify-center">
            <FaqPlusIcon className="size-[18px] transition-transform duration-200 group-open:-rotate-45 dark:text-[var(--color-text-inverse)]" />
          </span>
        }
        sectionId="reddit-marketing-faq"
      />
    </>
  );
}
