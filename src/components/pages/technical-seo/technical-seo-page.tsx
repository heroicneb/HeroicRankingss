import type { Metadata } from "next";
import Image from "next/image";

import { ServiceFaq } from "@/components/sections/shared/service-faq";
import { ServiceSuccessStories } from "@/components/sections/shared/service-success-stories";
import { ServiceWhyChoose } from "@/components/sections/shared/service-why-choose";
import { TechnicalSeoProcess } from "@/components/sections/technical-seo-process";
import { AppLink } from "@/components/ui/app-link";
import { GradientText } from "@/components/ui/gradient-text";
import { ArrowUpRightIcon } from "@/components/ui/icons";
import {
  DiagonalArrowIcon,
  FaqPlusIcon,
  GradientArrowUpRightIcon,
} from "@/components/ui/icons/decorative";
import { SectionLabel } from "@/components/ui/section-label";
import { PAGE_SHELL_CLASS, CONTENT_SHELL_CLASS } from "@/data/service-shared";
import { SUCCESS_STORIES } from "@/data/success-stories";
import { WHY_CHOOSE_ITEMS } from "@/data/why-choose-items";
import { cn } from "@/lib/cn";
import { createPageMetadata } from "@/lib/metadata";
import type { SanityFaqItem } from "@/lib/sanity-data";

export const metadata: Metadata = createPageMetadata({
  title: "Technical SEO Services",
  description:
    "Strengthen your site infrastructure, improve crawlability, and boost rankings with Heroic Rankings technical SEO services.",
  path: "/seo/technical",
});

const HERO_IMAGE = "/technical-seo/055420a1-fe99-46f5-9e5b-bbce63f8a07e.webp";

interface TechnicalServiceCard {
  title: string;
  subtitle: string;
  body: string;
  iconSrc: string;
  iconWidth: number;
  iconHeight: number;
  secondaryIconSrc?: string;
  secondaryIconWidth?: number;
  secondaryIconHeight?: number;
  ctaLabel: string;
  ctaWidthClass: string;
}

const SERVICE_CARDS: readonly TechnicalServiceCard[] = [
  {
    title: "Website Audit and Analysis",
    subtitle: "Revitalizing Your Digital Foundation",
    body: "Our comprehensive website audit delves into every corner of your site’s technical infrastructure. We identify issues like broken links, duplicate content, and crawl errors, paving the way for search engine crawlers and enhancing user experience.",
    iconSrc: "/technical-seo/5b81d169-a376-4fd5-9cae-538bf927a6bf.svg",
    iconWidth: 33,
    iconHeight: 30,
    ctaLabel: "Get Your Audit",
    ctaWidthClass: "w-[170px]",
  },
  {
    title: "XML Sitemap Optimization",
    subtitle: "Guiding Search Engines through Your Content",
    body: "XML sitemaps serve as blueprints for search engines. We optimize your sitemaps to ensure efficient content discovery and indexing, enhancing your website’s visibility in search results.",
    iconSrc: "/technical-seo/cf22fade-931b-468d-b5b8-d0395c476e56.svg",
    iconWidth: 32,
    iconHeight: 32,
    ctaLabel: "Optimize Your Sitemaps",
    ctaWidthClass: "w-[241px]",
  },
  {
    title: "Robots.txt Optimization",
    subtitle: "Navigating the Digital Landscape",
    body: "Robots.txt files instruct search engine bots on which pages to crawl. Our optimization ensures important pages are accessible while sensitive content is hidden, enhancing your overall SEO strategy.",
    iconSrc: "/technical-seo/2fa5e242-fddd-4d0b-9691-af0dbf26d757.svg",
    iconWidth: 34,
    iconHeight: 34,
    ctaLabel: "Optimize Robots.txt",
    ctaWidthClass: "w-[210px]",
  },
  {
    title: "Website Speed Optimization",
    subtitle: "Accelerating Your Digital Journey",
    body: "Website speed impacts user experience and search rankings. Our speed optimization techniques include compressing images, minimizing code, and optimizing server configurations to ensure a fast-loading site.",
    iconSrc: "/technical-seo/0d391828-3204-4d72-969d-1b9f5fda5081.svg",
    iconWidth: 31,
    iconHeight: 24,
    ctaLabel: "Improve Your Speed",
    ctaWidthClass: "w-[211px]",
  },
  {
    title: "Mobile-Friendly Optimization",
    subtitle: "Seamless Experiences on All Devices",
    body: "Ensuring a responsive, user-friendly mobile experience is crucial. Our strategies adapt your website to various screen sizes and devices, improving mobile search rankings and user engagement.",
    iconSrc: "/technical-seo/854cbd92-5c37-4cc0-b15e-e80360bddc00.svg",
    iconWidth: 18,
    iconHeight: 32,
    ctaLabel: "Optimize for Mobile",
    ctaWidthClass: "w-[208px]",
  },
  {
    title: "Schema Markup Implementation",
    subtitle: "Adding Depth to Your Content",
    body: "Schema markup provides additional context to search engines, enhancing your chances of appearing in rich snippets and answer boxes in search results, boosting your visibility and click-through rates.",
    iconSrc: "/technical-seo/a7d5fe0a-37b2-4835-a728-1e0fb06e32c7.svg",
    iconWidth: 33,
    iconHeight: 30,
    secondaryIconSrc: "/technical-seo/a968a6c4-3cde-4aef-b840-8023cba34992.svg",
    secondaryIconWidth: 19,
    secondaryIconHeight: 12,
    ctaLabel: "Implement Schema Markup",
    ctaWidthClass: "w-[268px]",
  },
];

const FAQ_ITEMS = [
  {
    question: "What is technical SEO?",
    answer:
      "Technical SEO focuses on optimizing your website's infrastructure to help search engines crawl, index, and render your site more effectively. This includes improving site speed, mobile responsiveness, URL structure, XML sitemaps, robots.txt configuration, and fixing crawl errors to build a strong technical foundation for higher rankings.",
    defaultOpen: true,
  },
  {
    question: "How does a website audit contribute to technical SEO?",
    answer:
      "A website audit identifies technical issues like broken links, crawl errors, duplicate content, and slow page speeds that can hurt your rankings. By addressing these issues systematically, we improve your site's crawlability and indexation.",
    defaultOpen: false,
  },
  {
    question: "What is the purpose of XML sitemaps in technical SEO?",
    answer:
      "XML sitemaps help search engines discover and understand the structure of your website. They list all important pages, their update frequency, and priority, ensuring that search engine crawlers can efficiently index your content.",
    defaultOpen: false,
  },
  {
    question: "Why is robots.txt optimization important?",
    answer:
      "A properly configured robots.txt file guides search engine crawlers on which pages to index and which to skip. This prevents wasting your crawl budget on low-value pages and ensures your most important content gets indexed first.",
    defaultOpen: false,
  },
  {
    question: "How does website speed optimization impact SEO?",
    answer:
      "Page speed is a confirmed ranking factor for both desktop and mobile search. Faster sites provide better user experiences, leading to lower bounce rates, longer session durations, and higher conversion rates.",
    defaultOpen: false,
  },
] as const;

interface TechnicalSeoPageProps {
  cmsFaqItems?: SanityFaqItem[];
}

export default function TechnicalSeoPage({
  cmsFaqItems,
}: TechnicalSeoPageProps) {
  const faqItems = cmsFaqItems?.length
    ? cmsFaqItems.map((f, i) => ({
        question: f.question,
        answer: f.answer,
        defaultOpen: i === 0,
      }))
    : FAQ_ITEMS;

  return (
    <>
      <section className="pt-[60px] lg:pt-[100px]" id="technical-seo-home">
        <div className={PAGE_SHELL_CLASS}>
          <h1 className="type-h1 mx-auto max-w-[294px] text-center text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] lg:max-w-[857px]">
            Technical SEO Services
          </h1>

          <p className="type-paragraph mx-auto mt-5 max-w-[294px] text-center text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] lg:max-w-[688px]">
            Rankings Start Where Most Agencies{" "}
            <GradientText className="gradient-text-brand-about-us-hero-title">
              Stop Looking
            </GradientText>
            .
          </p>

          <div className="relative mt-[60px] overflow-hidden rounded-[30px] bg-[linear-gradient(73.9149deg,var(--color-hr-dark)_35.359%,var(--color-case-art-maudsch)_142.03%)] dark:opacity-90 lg:mt-[120px] lg:h-[684px] lg:rounded-[40px] lg:bg-[linear-gradient(52.4159deg,var(--color-hr-dark)_35.359%,var(--color-case-art-maudsch)_142.03%)]">
            <div className="relative z-10 flex flex-col items-center px-[15px] pb-[20px] pt-[60px] text-center text-[var(--color-hr-pure-white)] lg:h-full lg:items-start lg:px-[70px] lg:pt-[120px] lg:text-left">
              <div className="w-full max-w-[298px] lg:max-w-[561px]">
                <SectionLabel className="text-[var(--color-hr-pure-white)]">
                  / Foundation /
                </SectionLabel>
                <h2 className="type-h2 mt-5 max-w-[298px] text-[var(--color-hr-pure-white)] lg:max-w-[561px]">
                  Good Content Won&apos;t Rank on a Broken Site
                </h2>

                <p className="type-paragraph mt-5 max-w-[298px] text-[var(--color-hr-pure-white)] lg:mt-10 lg:max-w-[485px]">
                  If Google can&apos;t crawl it, index it, or load it fast
                  enough, it doesn&apos;t exist. Most sites don&apos;t have a
                  content problem {"\u2014"} they have a technical one. We
                  audit, diagnose, and systematically resolve the crawlability,
                  speed, and structural issues that prevent Google from ranking
                  your pages.
                </p>

                <AppLink
                  className="type-cta motion-interactive motion-interactive-press mt-5 inline-flex h-[45px] w-full items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[var(--color-hr-accent)] bg-transparent text-[var(--color-hr-pure-white)] hover:bg-[color-mix(in_srgb,var(--color-hr-pure-white)_8%,transparent)] focus-visible:ring-offset-[var(--color-hr-dark)] lg:mt-10 lg:w-[256px]"
                  href="/contact"
                  motionPreset="none"
                >
                  Get a Technical SEO Audit
                  <GradientArrowUpRightIcon className="size-4" />
                </AppLink>
              </div>
            </div>

            <div className="pointer-events-none relative h-[331px] w-full overflow-hidden lg:absolute lg:bottom-0 lg:left-0 lg:right-0 lg:top-0 lg:h-auto">
              <Image
                alt="Classical building with columns"
                className="absolute left-[-36.81%] top-0 h-full w-[202.46%] max-w-none object-cover lg:left-[16.41%] lg:top-[-0.73%] lg:h-[106.69%] lg:w-[119.45%]"
                fetchPriority="high"
                height={1168}
                priority
                sizes="(min-width: 1024px) 100vw, 350px"
                src={HERO_IMAGE}
                width={2048}
              />
            </div>

            <div className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(90deg,color-mix(in_srgb,var(--color-hr-dark)_90%,transparent)_0%,color-mix(in_srgb,var(--color-hr-dark)_66%,transparent)_38%,color-mix(in_srgb,var(--color-hr-dark)_22%,transparent)_62%,transparent_84%)] dark:opacity-90 lg:block" />
          </div>
        </div>
      </section>

      <section className="pt-[10px]" id="technical-seo-solutions">
        <div className={PAGE_SHELL_CLASS}>
          <div className="rounded-[40px] bg-[var(--color-hr-off-white)] dark:bg-[var(--color-bg-dark)] px-5 pb-[70px] pt-[60px] lg:pt-[120px] sm:px-8 lg:px-[70px]">
            <SectionLabel>/ Solutions /</SectionLabel>
            <h2 className="type-h2 mt-5 max-w-[542px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
              Comprehensive{" "}
              <GradientText className="gradient-text-brand-services">
                Technical SEO Services
              </GradientText>
            </h2>

            <div className="mt-[120px] grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {SERVICE_CARDS.map((card) => (
                <article
                  className="flex h-[516px] flex-col rounded-[40px] border border-[var(--color-hr-light-grey)] dark:border-[var(--color-border-inverse-10)] bg-[var(--color-hr-pure-white)] dark:bg-[var(--color-bg-dark)] px-[30px] pb-[30px] pt-[30px]"
                  key={card.title}
                >
                  <span className="relative inline-flex size-[50px] items-center justify-center overflow-hidden rounded-[12px] border border-[var(--color-hr-light-grey)] dark:border-[var(--color-border-inverse-10)] bg-[var(--color-hr-pure-white)] dark:bg-[var(--color-bg-dark)]">
                    <Image
                      alt=""
                      aria-hidden
                      className="block dark:brightness-0 dark:invert"
                      height={card.iconHeight}
                      src={card.iconSrc}
                      width={card.iconWidth}
                    />
                    {card.secondaryIconSrc ? (
                      <Image
                        alt=""
                        aria-hidden
                        className="absolute bottom-[14px] right-[16px] block dark:brightness-0 dark:invert"
                        height={card.secondaryIconHeight}
                        src={card.secondaryIconSrc}
                        width={card.secondaryIconWidth}
                      />
                    ) : null}
                  </span>

                  <h3 className="type-h3 mt-[15px] min-h-[64px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
                    {card.title}
                  </h3>
                  <p className="type-paragraph gradient-text-brand gradient-text-brand-services mt-[10px] min-h-[48px]">
                    {card.subtitle}
                  </p>
                  <p className="type-paragraph mt-[30px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
                    {card.body}
                  </p>

                  <AppLink
                    href="/contact"
                    className={cn(
                      "type-cta mt-auto inline-flex h-[45px] items-center justify-center gap-2 rounded-[var(--radius-button)] whitespace-nowrap border border-[var(--color-hr-accent)] bg-transparent px-5 text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] hover:bg-[var(--color-hr-off-white)] dark:hover:bg-[var(--color-surface-inverse-10)]",
                      card.ctaWidthClass,
                    )}
                  >
                    {card.ctaLabel}
                    <GradientArrowUpRightIcon className="size-[10px]" />
                  </AppLink>
                </article>
              ))}
            </div>

            <TechnicalSeoProcess />
          </div>
        </div>
      </section>

      <ServiceWhyChoose
        ctaIcon={<GradientArrowUpRightIcon className="size-[10px]" />}
        descriptionBaseClassName="type-paragraph mt-[10px] text-[var(--color-hr-grey)] dark:text-[var(--color-text-inverse-50)]"
        gridClassName="mt-[80px] grid grid-cols-1 gap-y-[56px] lg:grid-cols-3 lg:gap-x-[110px]"
        heading={
          <>
            Why Choose{" "}
            <GradientText className="gradient-text-brand-trust">
              Heroic Rankings?
            </GradientText>
          </>
        }
        iconBaseClassName="size-[50px] dark:brightness-0 dark:invert"
        items={WHY_CHOOSE_ITEMS}
        outerClassName="rounded-[40px] bg-[var(--color-hr-off-white)] dark:bg-[var(--color-bg-dark)] px-5 pb-[96px] pt-[96px] sm:px-8 lg:px-[70px] lg:pb-[120px] lg:pt-[120px]"
        sectionClassName="pt-[10px] lg:pt-[10px]"
        sectionId="technical-seo-why-heroic"
      />

      <ServiceSuccessStories
        buttonIcon={<GradientArrowUpRightIcon className="size-[10px]" />}
        cardArrowIcon={<DiagonalArrowIcon className="size-[22px]" />}
        contentShellClass={CONTENT_SHELL_CLASS}
        heading={
          <>
            <GradientText className="gradient-text-brand-case">
              Success
            </GradientText>{" "}
            Stories
          </>
        }
        pageShellClass={PAGE_SHELL_CLASS}
        sectionId="technical-seo-success-stories"
        stories={SUCCESS_STORIES}
      />

      <ServiceFaq
        items={faqItems}
        renderIcon={
          <span className="inline-flex size-[25px] items-center justify-center">
            <FaqPlusIcon className="size-[18px] transition-transform duration-200 group-open:-rotate-45 dark:text-[var(--color-text-inverse)]" />
          </span>
        }
        sectionId="technical-seo-faq"
      />
    </>
  );
}
