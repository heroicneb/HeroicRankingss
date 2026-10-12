import Image from "next/image";

import { ServiceFaq } from "@/components/sections/shared/service-faq";
import { AppLink } from "@/components/ui/app-link";
import { GradientHeading } from "@/components/ui/gradient-heading";
import { FaqPlusIcon, GradientArrowUpRightIcon } from "@/components/ui/icons/decorative";
import { SectionLabel } from "@/components/ui/section-label";
import { PAGE_SHELL_CLASS } from "@/data/service-shared";

import { WebSummitClaimForm } from "./parts/WebSummitClaimForm";
import { WEB_SUMMIT_CONTENT } from "./web-summit-content";

/*
 * Web Summit 2026 attendee perk: hero with the statue, what the Heroic Five
 * is, why it covers search and AI, how to claim it, the claim form, a short
 * about block and the FAQ. Styled like the partnership and service pages.
 */

const TEXT = "text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]";
const MUTED = "text-[var(--color-hr-grey)] dark:text-[var(--color-text-inverse-60)]";
const CARD = "rounded-[30px] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-pure-white)] p-[24px] dark:border-[var(--color-border-inverse-10)] dark:bg-[var(--color-bg-dark)] lg:p-[30px]";
const BUTTON =
  "type-cta motion-interactive motion-interactive-press inline-flex h-[51px] items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[var(--color-hr-accent)] bg-transparent px-7 text-[var(--color-hr-dark)] hover:bg-[var(--color-hr-off-white)] dark:text-[var(--color-text-inverse)] dark:hover:bg-[var(--color-surface-inverse-10)]";

export function WebSummitPage() {
  const c = WEB_SUMMIT_CONTENT;
  const faqItems = c.faq.map((item, index) => ({ ...item, defaultOpen: index === 0 }));

  return (
    <>
      {/* Hero */}
      <section className="pt-[40px] lg:pt-[80px]" id="web-summit-hero">
        <div className={PAGE_SHELL_CLASS}>
          <div className="mx-auto flex max-w-[350px] flex-col items-center text-center sm:max-w-none">
            <SectionLabel>{c.hero.label}</SectionLabel>
            <h1 className={`type-h1 mx-auto mt-5 w-full max-w-[900px] ${TEXT}`}>
              <GradientHeading highlightClassName="gradient-text-partnership-hero" segments={c.hero.heading} />
            </h1>
            <p className={`type-paragraph mx-auto mt-5 w-full max-w-[792px] ${TEXT}`}>{c.hero.intro}</p>
            <AppLink className={`${BUTTON} mt-8 w-full max-w-[350px] sm:w-auto`} href="#claim" motionPreset="none">
              {c.hero.ctaLabel}
              <GradientArrowUpRightIcon className="size-[10px]" />
            </AppLink>
            <p className={`mt-4 text-[14px] leading-[20px] ${MUTED}`}>{c.hero.note}</p>
          </div>

          <div className="partnership-hero-panel-gradient relative mx-auto mt-[40px] h-[260px] w-full max-w-[350px] overflow-hidden rounded-[30px] sm:h-[360px] sm:max-w-none lg:mt-[80px] lg:h-[600px] lg:rounded-[40px]">
            <Image
              alt={c.hero.image.alt}
              className="pointer-events-none object-contain object-bottom"
              fetchPriority="high"
              fill
              priority
              sizes="(min-width: 1440px) 1400px, 100vw"
              src={c.hero.image.src}
            />
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="pt-[60px] lg:pt-[120px]" id="what-you-get">
        <div className={PAGE_SHELL_CLASS}>
          <div className="px-5 sm:px-8 xl:px-[70px]">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,560px)_minmax(0,1fr)] lg:gap-[80px]">
              <div>
                <SectionLabel>{c.whatYouGet.label}</SectionLabel>
                <h2 className={`type-h2 mt-5 ${TEXT}`}>
                  <GradientHeading highlightClassName="gradient-text-brand-services" segments={c.whatYouGet.heading} />
                </h2>
              </div>
              <div>
                <p className={`type-paragraph ${TEXT}`}>{c.whatYouGet.intro}</p>
                <p className={`type-paragraph mt-5 ${MUTED}`}>{c.whatYouGet.body}</p>
              </div>
            </div>
            <div className="mt-10 grid gap-[14px] lg:grid-cols-3 lg:gap-5" data-reveal-stagger>
              {c.whatYouGet.items.map((item, index) => (
                <article className={CARD} key={item.title}>
                  <span className={`text-[13px] uppercase tracking-[0.08em] ${MUTED}`}>0{index + 1}</span>
                  <h3 className={`type-h3 mt-3 ${TEXT}`}>{item.title}</h3>
                  <p className={`type-paragraph mt-[10px] ${MUTED}`}>{item.body}</p>
                </article>
              ))}
            </div>
            <p className={`type-paragraph mt-8 max-w-[860px] ${TEXT}`}>{c.whatYouGet.closing}</p>
          </div>
        </div>
      </section>

      {/* Why SEO isn't enough */}
      <section className="pt-[60px] lg:pt-[120px]" id="search-and-ai">
        <div className={PAGE_SHELL_CLASS}>
          <div className="surface-rect-5 rounded-[30px] px-5 py-[60px] text-[var(--color-hr-pure-white)] sm:px-8 lg:rounded-[var(--radius-card)] lg:px-[70px] lg:py-[100px]">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,560px)_minmax(0,1fr)] lg:gap-[80px]">
              <div>
                <SectionLabel className="text-[var(--color-hr-pure-white)]">{c.whyBoth.label}</SectionLabel>
                <h2 className="type-h2 mt-5 text-[var(--color-hr-pure-white)]">
                  <GradientHeading highlightClassName="gradient-text-brand-services" segments={c.whyBoth.heading} />
                </h2>
              </div>
              <p className="type-paragraph text-[var(--color-text-inverse-80)]">{c.whyBoth.intro}</p>
            </div>
            <div className="mt-10 grid gap-[14px] lg:grid-cols-2 lg:gap-5" data-reveal-stagger>
              {c.whyBoth.columns.map((col) => (
                <article className="rounded-[30px] border border-[var(--color-border-inverse-10)] bg-[var(--color-surface-inverse-10)] p-[24px] lg:p-[30px]" key={col.title}>
                  <h3 className="type-h3 text-[var(--color-hr-pure-white)]">{col.title}</h3>
                  <p className="type-paragraph mt-[10px] text-[var(--color-text-inverse-60)]">{col.body}</p>
                </article>
              ))}
            </div>
            <p className="type-paragraph mt-8 text-[var(--color-text-inverse-80)]">{c.whyBoth.closing}</p>
          </div>
        </div>
      </section>

      {/* How to claim */}
      <section className="pt-[60px] lg:pt-[120px]" id="how-to-claim">
        <div className={PAGE_SHELL_CLASS}>
          <div className="px-5 sm:px-8 xl:px-[70px]">
            <SectionLabel>{c.howToClaim.label}</SectionLabel>
            <h2 className={`type-h2 mt-5 max-w-[560px] ${TEXT}`}>
              <GradientHeading highlightClassName="gradient-text-brand-services" segments={c.howToClaim.heading} />
            </h2>
            <ol className="mt-10 grid gap-[14px] lg:grid-cols-3 lg:gap-5" data-reveal-stagger>
              {c.howToClaim.steps.map((step, index) => (
                <li className={CARD} key={step.title}>
                  <span className="inline-flex size-[44px] items-center justify-center rounded-full border border-[var(--color-hr-accent)] text-[18px] font-medium text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
                    {index + 1}
                  </span>
                  <h3 className={`type-h3 mt-4 ${TEXT}`}>{step.title}</h3>
                  <p className={`type-paragraph mt-[10px] ${MUTED}`}>{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Claim form */}
      <section className="scroll-mt-[100px] pt-[60px] lg:pt-[120px]" id="claim">
        <div className={PAGE_SHELL_CLASS}>
          <div className="surface-chart relative overflow-hidden rounded-[30px] border border-[var(--color-border-inverse-10)] px-5 py-8 sm:px-8 sm:py-10 lg:rounded-[40px] lg:px-[60px] lg:py-[56px]">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,560px)] lg:items-center lg:gap-[60px]">
              <div className="text-center lg:text-left">
                <SectionLabel className="text-[var(--color-hr-pure-white)]">/  The Claim Form  /</SectionLabel>
                <h2 className="type-h2 mt-5 text-[var(--color-text-inverse)]">{c.form.heading}</h2>
                <p className="type-paragraph mx-auto mt-4 max-w-[460px] text-[var(--color-text-inverse-60)] lg:mx-0">{c.form.body}</p>
              </div>
              <WebSummitClaimForm />
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="pt-[60px] lg:pt-[120px]" id="about-heroic-rankings">
        <div className={PAGE_SHELL_CLASS}>
          <div className="rounded-[30px] bg-[var(--color-hr-off-white)] px-5 py-[60px] dark:bg-[var(--color-bg-dark)] sm:px-8 lg:rounded-[40px] lg:px-[70px] lg:py-[100px]">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,560px)_minmax(0,1fr)] lg:gap-[80px]">
              <div>
                <SectionLabel>{c.about.label}</SectionLabel>
                <h2 className={`type-h2 mt-5 ${TEXT}`}>
                  <GradientHeading highlightClassName="gradient-text-brand-services" segments={c.about.heading} />
                </h2>
              </div>
              <div>
                <p className={`type-paragraph ${TEXT}`}>{c.about.body}</p>
                <p className={`type-paragraph mt-5 ${MUTED}`}>{c.about.proof}</p>
                <AppLink className={`${BUTTON} mt-8`} href={c.about.ctaUrl} motionPreset="none">
                  {c.about.ctaLabel}
                  <GradientArrowUpRightIcon className="size-[10px]" />
                </AppLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <ServiceFaq
        items={faqItems}
        renderIcon={
          <span className="inline-flex size-[25px] items-center justify-center">
            <FaqPlusIcon className="size-[18px] transition-transform duration-200 group-open:-rotate-45 dark:text-[var(--color-text-inverse)]" />
          </span>
        }
        sectionId="web-summit-faq"
      />
    </>
  );
}
