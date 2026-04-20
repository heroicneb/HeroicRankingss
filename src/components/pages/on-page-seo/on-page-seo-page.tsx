import type { Metadata } from "next";
import Image from "next/image";

import { OnPageSeoProcess } from "@/components/sections/on-page-seo-process";
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
import { PAGE_SHELL_CLASS, CONTENT_SHELL_CLASS } from "@/data/service-shared";
import { SUCCESS_STORIES } from "@/data/success-stories";
import { WHY_CHOOSE_ITEMS } from "@/data/why-choose-items";
import { createPageMetadata } from "@/lib/metadata";
import type { SanityFaqItem } from "@/lib/sanity-data";

export const metadata: Metadata = createPageMetadata({
  title: "On-Page SEO Services",
  description:
    "Create a solid on-site SEO structure and start driving traffic with Heroic Rankings on-page SEO services.",
  path: "/on-page-seo",
});

const HERO_STATUE_IMAGE =
  "/on-page-seo/488700afdba6954368280173b13ac2c7d8324b06.webp";

const SERVICE_CARDS = [
  {
    title: "Keyword Research & Analysis",
    subtitle: "Unearthing the Gems of Relevance",
    body: "On-page optimization ensures that your web pages are relevant to specific keywords and phrases that users are searching for. This alignment enhances your website's chances of appearing prominently in search results, leading to increased organic traffic.",
    ctaLabel: "Research Keywords",
    iconSrc: "/on-page-seo/936a6012b2c4d3fe21561675113b56450c6910dd.svg",
    iconWidth: 31,
    iconHeight: 32,
  },
  {
    title: "Meta Optimization",
    subtitle: "Crafting First Impressions that Matter",
    body: "Meta tags are the first glimpse users and search engines have of your content. We craft compelling meta titles and descriptions that entice and encapsulate the essence of your content. This leads to improved click-through rates and a better understanding of your content's context.",
    ctaLabel: "Optimize Meta Tags",
    iconSrc: "/on-page-seo/130460852d3cf88e59b77497d8a49b9edd4e1f4b.svg",
    iconWidth: 34,
    iconHeight: 31,
  },
  {
    title: "Content Linking",
    subtitle: "Turning Content into a Powerhouse",
    body: "Content is king, and optimizing it is paramount. Our content optimization services involve refining your existing content and creating new content that's informative, engaging, and aligned with your target keywords. We strike the perfect balance between SEO-friendly content and value-driven information that resonates with your audience.",
    ctaLabel: "Boost Content",
    iconSrc: "/on-page-seo/0ce2daad7f53b85d350b78bc0c0c211e025a3dfe.svg",
    iconWidth: 31,
    iconHeight: 31,
  },
  {
    title: "URL Structure Optimization",
    subtitle: "Building the Pathway to Visibility",
    body: "A well-structured URL is more than just a web address; it's a navigational guide for users and search engines. Our experts optimize your URL structure to enhance readability and relevance, ensuring that search engines can easily decipher the hierarchy of your content and users can navigate intuitively.",
    ctaLabel: "Refine URLs",
    iconSrc: "/on-page-seo/c4a5ae60af291e1f21fa0b6ab0cd195a70b6c0bd.svg",
    iconWidth: 31,
    iconHeight: 31,
  },
  {
    title: "Header Tag Optimization",
    subtitle: "Guiding the Reader's Journey",
    body: "Header tags (H1, H2, H3, etc.) provide a visual hierarchy that guides readers through your content. We optimize header tags to highlight the most critical points, making your content more scannable and user-friendly. This optimization enhances the user experience and helps search engines understand the structure of your content.",
    ctaLabel: "Structure Headers",
    iconSrc: "/on-page-seo/dc2bdaf84977ecc9348ba43211ddf3916dd9c947.svg",
    iconWidth: 27,
    iconHeight: 25,
  },
  {
    title: "Internal Linking Optimization",
    subtitle: "Connecting the Dots for Enhanced Visibility",
    body: "Internal linking is the secret sauce to keep users engaged and search engines crawling. We strategically optimize internal links to guide users seamlessly between relevant pages on your website. This enhances user experience, encourages exploration, and distributes the SEO value across your site.",
    ctaLabel: "Map Internal Links",
    iconSrc: "/on-page-seo/3556d976fa9cb93c2863cfff8dda160f3048d2a9.svg",
    iconWidth: 31,
    iconHeight: 31,
  },
] as const;

const FAQ_ITEMS = [
  {
    question: "What is on-page SEO?",
    answer:
      "On-page SEO involves refining various elements within your website to improve its visibility and ranking on search engine results pages (SERPs).",
    defaultOpen: true,
  },
  {
    question: "Why is on-page optimization important for SEO?",
    answer:
      "On-page optimization is critical because it directly signals to search engines what your pages are about and how relevant they are to specific queries. Without proper on-page SEO, even high-authority websites struggle to rank for target keywords, resulting in lost organic traffic and missed revenue opportunities.",
    defaultOpen: false,
  },
  {
    question: "How does keyword research play a role in on-page optimization?",
    answer:
      "Keyword research identifies the exact terms and phrases your target audience uses when searching for products or services like yours. By mapping these keywords to specific pages and incorporating them into titles, headings, and body content, you ensure each page is aligned with real search demand and has the best chance of ranking.",
    defaultOpen: false,
  },
  {
    question: "What benefits can I expect from meta tags optimization?",
    answer:
      "Optimized meta titles and descriptions improve your click-through rates from search results by making your listings more compelling and relevant. Well-crafted meta tags also help search engines understand page context, which contributes to higher rankings and more qualified organic traffic.",
    defaultOpen: false,
  },
  {
    question: "How does content optimization enhance my website?",
    answer:
      "Content optimization improves your website by ensuring every page delivers value to both users and search engines. This includes refining readability, incorporating target keywords naturally, and structuring content with clear headings and internal links, all of which lead to longer time on page, lower bounce rates, and stronger rankings.",
    defaultOpen: false,
  },
  {
    question: "What role does internal linking play in on-page optimization?",
    answer:
      "Internal linking distributes authority across your website, helps search engines discover and prioritize key pages, and guides users to related content that supports their intent. A strong internal linking structure improves crawlability, boosts rankings for target pages, and increases engagement by keeping visitors on your site longer.",
    defaultOpen: false,
  },
] as const;

interface OnPageSeoPageProps {
  cmsFaqItems?: SanityFaqItem[];
}

export default function OnPageSeoPage({ cmsFaqItems }: OnPageSeoPageProps) {
  const faqItems = cmsFaqItems?.length
    ? cmsFaqItems.map((f, i) => ({
        question: f.question,
        answer: f.answer,
        defaultOpen: i === 0,
      }))
    : FAQ_ITEMS;

  return (
    <>
      <section className="pt-[60px] lg:pt-[100px]" id="on-page-seo-home">
        <div className={PAGE_SHELL_CLASS}>
          <h1 className="type-h1 mx-auto max-w-[294px] text-center text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] lg:max-w-[857px]">
            On-Page SEO Services
          </h1>

          <p className="type-paragraph mx-auto mt-5 max-w-[294px] text-center text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] lg:max-w-[688px]">
            The Details Search Engines Rewards. The Results{" "}
            <GradientText className="gradient-text-brand-quote">
              You Keep
            </GradientText>
            .
          </p>

          <div className="relative mt-[60px] overflow-hidden rounded-[30px] bg-[linear-gradient(73.9149deg,var(--color-hr-dark)_35.359%,var(--color-case-art-maudsch)_142.03%)] dark:opacity-90 lg:mt-[120px] lg:h-[684px] lg:rounded-[40px] lg:bg-[linear-gradient(52.4159deg,var(--color-hr-dark)_35.359%,var(--color-case-art-maudsch)_142.03%)]">
            <div className="relative z-10 flex flex-col items-center px-[15px] pb-[20px] pt-[60px] text-center text-[var(--color-hr-pure-white)] lg:h-full lg:items-start lg:px-[70px] lg:pt-[120px] lg:text-left">
              <div className="w-full max-w-[298px] lg:max-w-[601px]">
                <SectionLabel className="text-[var(--color-hr-pure-white)]">
                  / Structure /
                </SectionLabel>
                <h2 className="type-h2 mt-5 max-w-[298px] text-[var(--color-hr-pure-white)] lg:max-w-[601px]">
                  On-Page SEO That Works the Way Google Actually Evaluates Pages
                </h2>

                <p className="type-paragraph mt-5 max-w-[298px] text-[var(--color-hr-pure-white)] lg:mt-10 lg:max-w-[485px]">
                  The result is organic traffic that brings in real leads and
                  revenue, consistently. That&apos;s what we optimize for{" "}
                  {"\u2014"} and it&apos;s the standard we hold every engagement
                  to.
                </p>

                <AppLink
                  className="type-cta motion-interactive motion-interactive-press mt-5 inline-flex h-[45px] w-full items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[var(--color-hr-accent)] bg-transparent text-[var(--color-hr-pure-white)] hover:bg-[color-mix(in_srgb,var(--color-hr-pure-white)_8%,transparent)] focus-visible:ring-offset-[var(--color-hr-dark)] lg:mt-10 lg:w-[244px]"
                  href="/contact"
                  motionPreset="none"
                >
                  Free On-Page SEO Audit
                  <GradientArrowUpRightIcon className="size-[10px]" />
                </AppLink>
              </div>
            </div>

            <div className="pointer-events-none relative h-[331px] w-full overflow-hidden lg:absolute lg:bottom-0 lg:left-0 lg:right-0 lg:top-0 lg:h-auto">
              <Image
                alt="Warrior statue"
                className="absolute left-[-19.96%] top-[-4.31%] h-[136.64%] w-[208.69%] max-w-none object-cover lg:left-[35.36%] lg:top-[1.46%] lg:h-[124.85%] lg:w-[105.45%]"
                fetchPriority="high"
                height={1168}
                priority
                sizes="(min-width: 1024px) 100vw, 380px"
                src={HERO_STATUE_IMAGE}
                width={2048}
              />
            </div>

            <div className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(90deg,color-mix(in_srgb,var(--color-hr-dark)_90%,transparent)_0%,color-mix(in_srgb,var(--color-hr-dark)_66%,transparent)_38%,color-mix(in_srgb,var(--color-hr-dark)_22%,transparent)_62%,transparent_84%)] dark:opacity-90 lg:block" />
          </div>
        </div>
      </section>

      <section className="pt-[10px] lg:pt-[10px]" id="on-page-solutions">
        <div className={PAGE_SHELL_CLASS}>
          <div className="rounded-[40px] bg-[var(--color-hr-off-white)] dark:bg-[var(--color-bg-dark)] px-5 pb-[70px] pt-[60px] lg:pt-[120px] sm:px-8 lg:px-[70px]">
            <SectionLabel>/ Solutions /</SectionLabel>
            <h2 className="type-h2 mt-5 max-w-[455px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
              <GradientText className="gradient-text-brand-services">
                White Hat
              </GradientText>{" "}
              On-Page SEO Services
            </h2>

            <div className="mt-[80px] grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {SERVICE_CARDS.map((card) => (
                <article
                  className="flex h-[588px] flex-col rounded-[40px] border border-[var(--color-hr-light-grey)] dark:border-[var(--color-border-inverse-10)] bg-[var(--color-hr-pure-white)] dark:bg-[var(--color-bg-dark)] px-[30px] pb-[30px] pt-[30px]"
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
                    className="type-cta motion-interactive motion-interactive-press mt-auto inline-flex h-[45px] min-w-[163px] items-center justify-center gap-2 self-start whitespace-nowrap rounded-[var(--radius-button)] border border-[var(--color-hr-accent)] bg-transparent px-5 text-[var(--color-hr-dark)] hover:bg-[var(--color-hr-off-white)] dark:text-[var(--color-text-inverse)] dark:hover:bg-[var(--color-surface-inverse-10)]"
                  >
                    {card.ctaLabel}
                    <GradientArrowUpRightIcon className="size-[10px]" />
                  </AppLink>
                </article>
              ))}
            </div>

            <OnPageSeoProcess />
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
        sectionId="on-page-why-heroic"
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
        sectionId="on-page-success-stories"
        stories={SUCCESS_STORIES}
      />

      <ServiceFaq
        items={faqItems}
        renderIcon={
          <span className="inline-flex size-[25px] items-center justify-center">
            <FaqPlusIcon className="size-[18px] transition-transform duration-200 group-open:-rotate-45 dark:text-[var(--color-text-inverse)]" />
          </span>
        }
        sectionId="on-page-faq"
      />
    </>
  );
}
