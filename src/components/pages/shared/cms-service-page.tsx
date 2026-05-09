import Image from "next/image";

import { ServiceFaq } from "@/components/sections/shared/service-faq";
import { AppLink } from "@/components/ui/app-link";
import { GradientText } from "@/components/ui/gradient-text";
import {
  FaqPlusIcon,
  GradientArrowUpRightIcon,
} from "@/components/ui/icons/decorative";
import { SectionLabel } from "@/components/ui/section-label";
import { CONTENT_SHELL_CLASS, PAGE_SHELL_CLASS } from "@/data/service-shared";
import type { SanityFaqItem, SanityServicePage } from "@/lib/sanity-data";

interface CmsServicePageProps {
  fallbackFaqItems?: SanityFaqItem[];
  servicePage: SanityServicePage;
}

export function CmsServicePage({
  fallbackFaqItems,
  servicePage,
}: CmsServicePageProps) {
  const heroCtaLabel = servicePage.heroCtaLabel?.trim() || "Get Started";
  const heroCtaUrl = servicePage.heroCtaUrl?.trim() || "/contact";

  const faqItemsSource =
    servicePage.faqItems.length > 0
      ? servicePage.faqItems
      : (fallbackFaqItems ?? []);
  const faqItems = faqItemsSource.map((item, index) => ({
    answer: item.answer,
    defaultOpen: index === 0,
    question: item.question,
  }));

  return (
    <>
      <section className="pt-[100px]" id={`${servicePage.slug}-hero`}>
        <div className={PAGE_SHELL_CLASS}>
          <h1 className="type-h1 mx-auto max-w-[980px] text-center text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
            <GradientText className="gradient-text-brand">
              {servicePage.heroTitle}
            </GradientText>
          </h1>

          {servicePage.heroDescription ? (
            <p className="type-paragraph mx-auto mt-5 max-w-[860px] text-center text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
              {servicePage.heroDescription}
            </p>
          ) : null}

          <div className="mt-8 flex justify-center">
            <AppLink
              className="type-cta motion-interactive motion-interactive-press inline-flex h-[45px] items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[var(--color-hr-accent)] bg-transparent px-5 text-[var(--color-hr-dark)] hover:bg-[var(--color-hr-off-white)] dark:text-[var(--color-text-inverse)] dark:hover:bg-[var(--color-surface-inverse-10)]"
              href={heroCtaUrl}
              motionPreset="none"
            >
              {heroCtaLabel}
              <GradientArrowUpRightIcon className="size-[10px]" />
            </AppLink>
          </div>

          {servicePage.heroImageUrl ? (
            <div className="relative mt-12 overflow-hidden rounded-[30px] border border-[var(--color-hr-light-grey)] dark:border-[var(--color-border-inverse-10)] lg:mt-16 lg:rounded-[40px]">
              <Image
                alt={`${servicePage.heroTitle} hero image`}
                blurDataURL={servicePage.heroImageLqip}
                className="h-auto w-full object-cover"
                fetchPriority="high"
                height={900}
                placeholder={servicePage.heroImageLqip ? "blur" : "empty"}
                priority
                sizes="(min-width: 1280px) 1280px, 100vw"
                src={servicePage.heroImageUrl}
                width={1600}
              />
            </div>
          ) : null}
        </div>
      </section>

      {servicePage.serviceCards.length > 0 ? (
        <section
          className="pt-[60px] lg:pt-[120px]"
          id={`${servicePage.slug}-services`}
        >
          <div className={PAGE_SHELL_CLASS}>
            <div className={CONTENT_SHELL_CLASS}>
              <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                <SectionLabel>
                  {servicePage.solutionSectionLabel ||
                    "/  Service Solutions  /"}
                </SectionLabel>
                <h2 className="type-h2 mt-5 max-w-[720px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
                  {servicePage.solutionSectionHeading || "Solutions"}
                </h2>
              </div>

              <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-2">
                {servicePage.serviceCards.map((card, index) => (
                  <article
                    className="rounded-[30px] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-pure-white)] p-6 dark:border-[var(--color-border-inverse-10)] dark:bg-[var(--color-bg-dark)] lg:rounded-[40px]"
                    key={`${card.title}-${index + 1}`}
                  >
                    {card.iconUrl ? (
                      <Image
                        alt={`${card.title} icon`}
                        className="mb-3 size-8 object-contain"
                        height={32}
                        src={card.iconUrl}
                        width={32}
                      />
                    ) : null}
                    <h3 className="text-[28px] font-normal leading-[34px] tracking-[-0.56px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
                      {card.title}
                    </h3>
                    {card.subtitle ? (
                      <p className="mt-3 text-[18px] font-medium leading-[24px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
                        {card.subtitle}
                      </p>
                    ) : null}
                    {card.body ? (
                      <p className="mt-3 text-[18px] font-normal leading-[24px] text-[var(--color-hr-grey)] dark:text-[var(--color-text-inverse-60)]">
                        {card.body}
                      </p>
                    ) : null}
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {servicePage.processSteps.length > 0 ? (
        <section
          className="pt-[60px] lg:pt-[120px]"
          id={`${servicePage.slug}-process`}
        >
          <div className={PAGE_SHELL_CLASS}>
            <div className={CONTENT_SHELL_CLASS}>
              <SectionLabel>
                /{"  "}Process{"  "}/
              </SectionLabel>
              <h2 className="type-h2 mt-5 max-w-[720px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
                How We Execute
              </h2>

              <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-3">
                {servicePage.processSteps.map((step, index) => (
                  <article
                    className="rounded-[30px] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-pure-white)] p-6 dark:border-[var(--color-border-inverse-10)] dark:bg-[var(--color-bg-dark)] lg:rounded-[40px]"
                    key={`${step.title}-${index + 1}`}
                  >
                    <p className="text-[14px] font-medium uppercase tracking-[0.08em] text-[var(--color-hr-grey)] dark:text-[var(--color-text-inverse-60)]">
                      Step {index + 1}
                    </p>
                    <h3 className="mt-3 text-[24px] font-normal leading-[30px] tracking-[-0.48px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
                      {step.title}
                    </h3>
                    {step.description ? (
                      <p className="mt-3 text-[18px] font-normal leading-[24px] text-[var(--color-hr-grey)] dark:text-[var(--color-text-inverse-60)]">
                        {step.description}
                      </p>
                    ) : null}
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {servicePage.whyChooseItems.length > 0 ? (
        <section
          className="pt-[60px] lg:pt-[120px]"
          id={`${servicePage.slug}-why-choose`}
        >
          <div className={PAGE_SHELL_CLASS}>
            <div className="rounded-[40px] bg-[var(--color-hr-off-white)] px-5 py-[60px] dark:bg-[var(--color-bg-dark)] sm:px-8 lg:px-[70px] lg:py-[120px]">
              <SectionLabel>
                /{"  "}Why Choose Us{"  "}/
              </SectionLabel>
              <h2 className="type-h2 mt-5 max-w-[720px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
                Why Heroic Rankings
              </h2>

              <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-3">
                {servicePage.whyChooseItems.map((item, index) => (
                  <article key={`${item.title}-${index + 1}`}>
                    {item.iconUrl ? (
                      <Image
                        alt={`${item.title} icon`}
                        className="size-8 object-contain"
                        height={32}
                        src={item.iconUrl}
                        width={32}
                      />
                    ) : null}
                    <h3 className="mt-2 text-[24px] font-normal leading-[30px] tracking-[-0.48px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
                      {item.title}
                    </h3>
                    {item.description ? (
                      <p className="mt-3 text-[18px] font-normal leading-[24px] text-[var(--color-hr-grey)] dark:text-[var(--color-text-inverse-60)]">
                        {item.description}
                      </p>
                    ) : null}
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {servicePage.relatedCaseStudies.length > 0 ? (
        <section
          className="pt-[60px] lg:pt-[120px]"
          id={`${servicePage.slug}-case-studies`}
        >
          <div className={PAGE_SHELL_CLASS}>
            <div className={CONTENT_SHELL_CLASS}>
              <SectionLabel>
                /{"  "}Success Stories{"  "}/
              </SectionLabel>
              <h2 className="type-h2 mt-5 max-w-[720px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
                Related Case Studies
              </h2>

              <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-3">
                {servicePage.relatedCaseStudies.map((caseStudy) => (
                  <AppLink
                    className="group rounded-[30px] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-pure-white)] p-6 dark:border-[var(--color-border-inverse-10)] dark:bg-[var(--color-bg-dark)] lg:rounded-[40px]"
                    href={
                      caseStudy.slug
                        ? `/case-study/${caseStudy.slug}`
                        : "/case-study"
                    }
                    key={caseStudy._id}
                  >
                    <h3 className="text-[24px] font-normal leading-[30px] tracking-[-0.48px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
                      {caseStudy.title}
                    </h3>
                    <p className="mt-2 text-[16px] font-medium uppercase tracking-[0.08em] text-[var(--color-hr-grey)] dark:text-[var(--color-text-inverse-60)]">
                      {caseStudy.client}
                    </p>
                    {caseStudy.excerpt ? (
                      <p className="mt-3 text-[18px] font-normal leading-[24px] text-[var(--color-hr-grey)] dark:text-[var(--color-text-inverse-60)]">
                        {caseStudy.excerpt}
                      </p>
                    ) : null}
                  </AppLink>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {faqItems.length > 0 ? (
        <ServiceFaq
          answerClassName="pb-[30px] pl-[30px] pr-[30px] sm:pr-[90px] lg:pr-[223px]"
          containerClassName="relative mt-[80px] overflow-hidden rounded-[40px] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-pure-white)] dark:border-[var(--color-border-inverse-10)] dark:bg-[var(--color-bg-dark)]"
          detailsClassName="group border-[var(--color-hr-light-grey)] dark:border-[var(--color-border-inverse-10)] open:bg-[var(--color-hr-pure-white)] dark:bg-[var(--color-bg-dark)] dark:open:bg-[var(--color-bg-dark)]"
          items={faqItems}
          outerClassName="mt-[60px] rounded-[40px] bg-[var(--color-hr-off-white)] px-5 pb-[60px] pt-[60px] dark:bg-[var(--color-bg-dark)] sm:px-8 lg:mt-[120px] lg:px-[70px] lg:pb-[120px] lg:pt-[120px]"
          renderIcon={
            <span className="inline-flex size-[25px] items-center justify-center">
              <FaqPlusIcon className="size-[18px] transition-transform duration-200 group-open:-rotate-45 dark:text-[var(--color-text-inverse)]" />
            </span>
          }
          sectionId={`${servicePage.slug}-faq`}
          summaryClassName="flex cursor-pointer list-none items-center justify-between gap-4 px-[30px] py-[28px] [&::-webkit-details-marker]:hidden"
        />
      ) : null}
    </>
  );
}
