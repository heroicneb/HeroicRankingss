import type { Metadata } from "next";
import Image from "next/image";

import { ProcessStepSwitcher } from "@/components/sections/process-step-switcher";
import { ServiceFaq } from "@/components/sections/shared/service-faq";
import { ServiceSuccessStories } from "@/components/sections/shared/service-success-stories";
import { ServiceWhyChoose } from "@/components/sections/shared/service-why-choose";
import { AppLink } from "@/components/ui/app-link";
import { GradientText } from "@/components/ui/gradient-text";
import { ArrowUpRightIcon } from "@/components/ui/icons";
import {
  DiagonalArrowIcon,
  FaqPlusIcon,
  GradientArrowUpRightIcon,
} from "@/components/ui/icons/decorative";
import { SectionLabel } from "@/components/ui/section-label";
import { buildProcessSteps, DISCOVERY_CALL_LABEL } from "@/data/process-steps";
import { PAGE_SHELL_CLASS, CONTENT_SHELL_CLASS } from "@/data/service-shared";
import { SUCCESS_STORIES } from "@/data/success-stories";
import { WHY_CHOOSE_ITEMS } from "@/data/why-choose-items";
import { cn } from "@/lib/cn";
import { createPageMetadata } from "@/lib/metadata";
import type { SanityFaqItem } from "@/lib/sanity-data";

export const metadata: Metadata = createPageMetadata({
  title: "E-commerce SEO Services",
  description:
    "Grow sales, not just traffic, with e-commerce SEO services built to turn search visibility into sustainable revenue.",
  path: "/ecommerce-seo",
});

const HERO_IMAGE_SRC =
  "/ecommerce-seo/c5e64417-ac91-46b2-b7b8-cfe282821cbf.webp";

const SERVICE_CARDS = [
  {
    title: "Product & Category Page Optimization",
    subtitle: "Turning Browsers into Buyers",
    body: "We optimize product descriptions, meta tags, images, and structured content to ensure every listing ranks and converts. Category pages get a full treatment too \u2014 streamlined navigation, keyword-aligned headings, and filtering logic that helps both search engines and shoppers discover your full catalog faster.",
    ctaLabel: "Optimize Your Pages",
    iconSrc: "/ecommerce-seo/509b7335-0c6c-4424-801d-39aac76eddf1.svg",
    iconWidth: 29,
    iconHeight: 31,
  },
  {
    title: "Google Merchant Center Optimization",
    subtitle: "Maximizing Your Shopping Feed Reach",
    body: "We audit and optimize your Google Merchant Center feed \u2014 fixing disapprovals, enriching product attributes, and aligning titles and descriptions with high-intent ecommerce search queries. The result: more products eligible for Shopping ads and free listings, at a lower cost per click.",
    ctaLabel: "Optimize Your Feed",
    iconSrc: "/ecommerce-seo/afafac96-ae0c-4a06-ba17-5ab923fd9d57.svg",
    iconWidth: 34,
    iconHeight: 27,
  },
  {
    title: "Structured Data for Products",
    subtitle: "Enhancing Search Results Visibility",
    body: "We implement schema markup that puts your pricing, availability, ratings, and reviews directly into Google\u2019s rich snippets \u2014 giving your products more real estate in search results and a measurable edge over competitors who rely on plain blue links.",
    ctaLabel: "Implement Structured Data",
    iconSrc: "/ecommerce-seo/8a93e259-bbe3-4498-a510-9af44505dfb8.svg",
    iconWidth: 31,
    iconHeight: 31,
  },
  {
    title: "E-commerce Platform SEO",
    subtitle: "Navigating the Platform Landscape",
    body: "Whether you\u2019re on Shopify, WooCommerce, Magento, or a custom stack, we optimize your platform\u2019s architecture \u2014 URL structure, crawlability, site speed, and navigation \u2014 so technical limitations never cap your organic growth potential.",
    ctaLabel: "Optimize Your Platform",
    iconSrc: "/ecommerce-seo/a5be1733-0bb9-4517-8cb6-fce31596ad24.svg",
    iconWidth: 32,
    iconHeight: 32,
  },
  {
    title: "Reddit Marketing",
    subtitle: "Improve AI Signals & LLM Citations",
    body: "Reddit threads consistently rank in Google and get cited by AI tools like ChatGPT and Gemini. We build authentic presence in niche subreddits relevant to your products \u2014 driving direct referral traffic, strengthening brand signals, and making your store the answer when AI assistants recommend where to buy.",
    ctaLabel: "Start Reddit Marketing",
    iconSrc: "/ecommerce-seo/a5be1733-0bb9-4517-8cb6-fce31596ad24.svg",
    iconWidth: 32,
    iconHeight: 32,
  },
  {
    title: "Ecommerce Link Building",
    subtitle: "Growing keyword positions and AI visibility",
    body: "We build high-quality backlinks from relevant industry publications, review sites, and niche blogs through digital PR, listicle articles campaigns, and editorial outreach. Every link strengthens your domain authority and protects your rankings for the long term.",
    ctaLabel: "Order Your Backlinks",
    iconSrc: "/ecommerce-seo/509b7335-0c6c-4424-801d-39aac76eddf1.svg",
    iconWidth: 29,
    iconHeight: 31,
  },
] as const;

const PROCESS_STEPS = buildProcessSteps(
  [
    "Connect with our team to discuss your store goals and see how ecommerce SEO can drive qualified organic sales.",
    "We review your current category structure, product pages, and conversion priorities to align SEO with revenue targets.",
    "Our team collects platform details, product feed data, technical constraints, and search demand signals to scope strategy precisely.",
    "We define investment and implementation scope based on catalog size, priority categories, and expected impact timelines.",
    "You receive a practical ecommerce SEO roadmap covering product pages, category pages, structured data, and growth milestones.",
  ],
  { 1: DISCOVERY_CALL_LABEL },
);

const FAQ_ITEMS = [
  {
    question: "What is e-commerce SEO?",
    answer:
      "E-commerce SEO refers to specialized strategies aimed at improving the visibility and search engine performance of online stores. It involves techniques to enhance product page rankings, increase organic traffic, and boost sales.",
    defaultOpen: true,
  },
  {
    question: "How is e-commerce SEO different from traditional SEO?",
    answer:
      "E-commerce SEO focuses on optimizing product and category pages at scale, implementing structured data for rich snippets, and addressing platform-specific technical challenges like faceted navigation and duplicate content. Unlike traditional SEO, the primary goal is driving purchases rather than just traffic, requiring strategies tailored to buyer intent and conversion optimization.",
    defaultOpen: false,
  },
  {
    question: "How does product page optimization impact e-commerce SEO?",
    answer:
      "Optimized product pages rank higher for specific product searches and convert more visitors into buyers. This includes writing unique product descriptions, optimizing images with alt text, implementing schema markup for prices and availability, and crafting compelling meta tags that increase click-through rates from search results.",
    defaultOpen: false,
  },
  {
    question: "What is category page optimization and its significance?",
    answer:
      "Category page optimization ensures your main product groupings rank for high-volume commercial keywords. By improving navigation, adding keyword-rich descriptions, and streamlining filtering options, category pages become powerful landing pages that guide shoppers through your catalog and significantly increase organic revenue.",
    defaultOpen: false,
  },
  {
    question:
      "Can e-commerce SEO work with specific platforms like Shopify or WooCommerce?",
    answer:
      "Absolutely. Our e-commerce SEO strategies are platform-agnostic and work with Shopify, WooCommerce, Magento, BigCommerce, and other major platforms. We optimize within each platform's technical framework, addressing platform-specific URL structures, site speed, and indexation challenges to maximize your store's search performance.",
    defaultOpen: false,
  },
] as const;

interface EcommerceSeoPageProps {
  cmsFaqItems?: SanityFaqItem[];
}

export default function EcommerceSeoPage({
  cmsFaqItems,
}: EcommerceSeoPageProps) {
  const faqItems = cmsFaqItems?.length
    ? cmsFaqItems.map((f, i) => ({
        question: f.question,
        answer: f.answer,
        defaultOpen: i === 0,
      }))
    : FAQ_ITEMS;

  return (
    <>
      <section className="pt-[60px] lg:pt-[120px]" id="ecommerce-seo-home">
        <div className={PAGE_SHELL_CLASS}>
          <h1 className="type-h1 mx-auto max-w-[294px] text-center text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] lg:max-w-[857px]">
            E-commerce SEO Services
          </h1>

          <p className="type-paragraph mx-auto mt-5 max-w-[350px] text-center text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] lg:max-w-[622px]">
            Using In-House Reporting &amp; Forecasting, our Strategies Deliver
            Results That{" "}
            <GradientText className="gradient-text-brand-about-us-hero-title">
              Turn Search Traffic Into Revenue.
            </GradientText>
          </p>

          <div className="relative mt-[60px] overflow-hidden rounded-[30px] bg-[linear-gradient(73.9149deg,var(--color-hr-dark)_35.359%,var(--color-case-art-maudsch)_142.03%)] px-[15px] dark:opacity-90 lg:mt-[120px] lg:h-[708px] lg:rounded-[40px] lg:bg-[linear-gradient(53.3665deg,var(--color-hr-dark)_35.359%,var(--color-case-art-maudsch)_142.03%)] lg:px-0">
            <div className="relative z-10 flex flex-col items-center pb-[20px] pt-[60px] text-center text-[var(--color-hr-pure-white)] lg:h-full lg:items-start lg:px-[70px] lg:pt-[120px] lg:text-left">
              <div className="w-full max-w-[350px] lg:max-w-[574px]">
                <SectionLabel className="text-[var(--color-hr-pure-white)]">
                  / Grow Organically /
                </SectionLabel>
                <h2 className="type-h2 mt-5 max-w-[350px] text-[var(--color-hr-pure-white)] lg:max-w-[574px]">
                  Grow Sales, Not Just Traffic with eComm SEO
                </h2>
                <p className="type-paragraph mt-5 max-w-[350px] text-[var(--color-hr-pure-white)] lg:mt-[53px] lg:max-w-[485px]">
                  Our ecommerce SEO services aren&apos;t just about rankings{" "}
                  {"\u2014"} they&apos;re about revenue at scale. As a dedicated
                  ecommerce SEO agency, we deploy data-driven strategies and
                  AI-powered insights to help Shopify, WooCommerce, and Magento
                  stores convert search visibility into measurable organic sales
                  growth. By leveraging data-driven strategies and AI insights,
                  we help stores turn search visibility into millions in organic
                  sales.
                </p>

                <AppLink
                  className="type-cta motion-interactive motion-interactive-press mt-5 inline-flex h-[45px] w-full items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-button)] border border-[var(--color-hr-accent)] bg-transparent px-5 text-[var(--color-hr-pure-white)] hover:bg-[color-mix(in_srgb,var(--color-hr-pure-white)_8%,transparent)] focus-visible:ring-offset-[var(--color-hr-dark)] lg:mt-10 lg:w-auto"
                  href="/contact"
                  motionPreset="none"
                >
                  Get your E-commerce SEO Audit
                  <GradientArrowUpRightIcon className="size-4" />
                </AppLink>
              </div>
            </div>

            <div className="pointer-events-none relative h-[331px] w-full overflow-hidden lg:absolute lg:bottom-0 lg:left-0 lg:right-0 lg:top-0 lg:h-auto">
              <div className="h-full [transform:scaleX(-1)] lg:[transform:none]">
                <Image
                  alt="Basket with apples"
                  className="absolute left-[-45.39%] top-[-120.23%] h-[262.79%] w-[186.39%] max-w-none object-cover lg:left-[22.88%] lg:top-[-113.85%] lg:h-[257.68%] lg:w-[96.36%]"
                  fetchPriority="high"
                  height={1205}
                  priority
                  sizes="(min-width: 1024px) 100vw, 350px"
                  src={HERO_IMAGE_SRC}
                  width={1054}
                />
              </div>
            </div>

            <div className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(90deg,color-mix(in_srgb,var(--color-hr-dark)_88%,transparent)_0%,color-mix(in_srgb,var(--color-hr-dark)_72%,transparent)_36%,color-mix(in_srgb,var(--color-hr-dark)_28%,transparent)_66%,transparent_86%)] dark:opacity-90 lg:block" />
          </div>
        </div>
      </section>

      <section className="pt-[10px]" id="ecommerce-seo-services">
        <div className={PAGE_SHELL_CLASS}>
          <div className="rounded-[40px] bg-[var(--color-hr-off-white)] dark:bg-[var(--color-bg-dark)] px-5 pb-[133px] pt-[57px] sm:px-8 lg:px-[70px]">
            <SectionLabel>/ Solutions /</SectionLabel>
            <h2 className="type-h2 mt-5 max-w-[500px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
              <GradientText className="gradient-text-brand-services">
                E-commerce{" "}
              </GradientText>
              SEO Services
            </h2>

            <div className="mt-[120px] grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {SERVICE_CARDS.map((card) => (
                <article
                  className="flex h-[540px] flex-col rounded-[40px] border border-[var(--color-hr-light-grey)] dark:border-[var(--color-border-inverse-10)] bg-[var(--color-hr-pure-white)] dark:bg-[var(--color-bg-dark)] px-[30px] pb-[30px] pt-[30px]"
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
                  </span>
                  <h3 className="type-h3 mt-[15px] min-h-[64px] max-w-[353px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
                    {card.title}
                  </h3>
                  <p className="type-paragraph gradient-text-brand gradient-text-brand-services mt-[10px] min-h-[48px] max-w-[238px]">
                    {card.subtitle}
                  </p>
                  <p className="type-paragraph mt-[30px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
                    {card.body}
                  </p>

                  <AppLink
                    href="/contact"
                    className="type-cta mt-auto inline-flex h-[45px] min-w-[163px] items-center justify-center gap-2 self-start whitespace-nowrap rounded-[var(--radius-button)] border border-[var(--color-hr-accent)] bg-transparent px-5 text-[var(--color-hr-dark)] hover:bg-[var(--color-hr-off-white)] dark:text-[var(--color-text-inverse)] dark:hover:bg-[var(--color-surface-inverse-10)]"
                  >
                    {card.ctaLabel}
                    <GradientArrowUpRightIcon className="size-[10px]" />
                  </AppLink>
                </article>
              ))}
            </div>

            <section className="mt-[60px] rounded-[30px] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-pure-white)] px-[20px] py-[30px] dark:border-[var(--color-border-inverse-10)] dark:bg-[var(--color-bg-dark)] lg:mt-[120px] lg:rounded-[40px] lg:px-[30px] lg:pb-[30px] lg:pt-[30px]">
              <h3 className="type-h3 max-w-[925px] pb-[4px] leading-[1.3] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
                Is your{" "}
                <GradientText className="gradient-text-brand-about-us-process-title">
                  e-commerce store
                </GradientText>{" "}
                maximizing its organic growth potential? The Fastest and{" "}
                <GradientText className="gradient-text-brand-about-us-process-title">
                  Most Effective Way to Get Started!
                </GradientText>
              </h3>

              <div className="mt-[20px] lg:mt-[30px]">
                <ProcessStepSwitcher
                  descriptionClassName="type-paragraph mt-[63px] max-w-[817px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]"
                  mutedPillClassName="type-paragraph whitespace-nowrap rounded-[100px] bg-[var(--color-hr-off-white)] dark:bg-[var(--color-surface-inverse-10)] px-[14px] py-[6px] text-[var(--color-hr-grey)] dark:text-[var(--color-text-inverse-60)] transition-colors hover:text-[var(--color-hr-dark)] dark:hover:text-[var(--color-text-inverse)]"
                  rowClassName="flex flex-wrap items-center gap-[10px] pb-1 xl:flex-nowrap"
                  steps={PROCESS_STEPS}
                />
              </div>

              <AppLink
                className="type-cta motion-interactive motion-interactive-press mt-[30px] inline-flex h-[45px] w-full items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[var(--color-hr-accent)] bg-transparent text-[var(--color-hr-dark)] hover:bg-[var(--color-hr-off-white)] dark:text-[var(--color-text-inverse)] dark:hover:bg-[var(--color-surface-inverse-10)] lg:mt-10 lg:w-[222px]"
                href="/contact"
                motionPreset="none"
              >
                Book a Discovery Call
                <GradientArrowUpRightIcon className="size-[10px]" />
              </AppLink>
            </section>
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
        sectionId="ecommerce-seo-why-heroic"
      />

      <ServiceSuccessStories
        buttonIcon={<GradientArrowUpRightIcon className="size-[10px]" />}
        cardArrowIcon={<DiagonalArrowIcon className="size-5" />}
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
        sectionId="ecommerce-seo-success-stories"
        stories={SUCCESS_STORIES}
      />

      <ServiceFaq
        items={faqItems}
        renderIcon={
          <span className="inline-flex size-[25px] items-center justify-center">
            <FaqPlusIcon className="size-[18px] transition-transform duration-200 group-open:-rotate-45 dark:text-[var(--color-text-inverse)]" />
          </span>
        }
        sectionId="ecommerce-seo-faq"
      />
    </>
  );
}
