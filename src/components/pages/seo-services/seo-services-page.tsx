import type { Metadata } from "next";
import Image from "next/image";

import { ServiceFaq } from "@/components/sections/shared/service-faq";
import { ServiceSuccessStories } from "@/components/sections/shared/service-success-stories";
import { ServiceWhyChoose } from "@/components/sections/shared/service-why-choose";
import {
  SeoServicesDesktopServicesGrid,
  type SeoDesktopServiceCard,
} from "@/components/pages/seo-services/seo-services-desktop-services-grid";
import { SeoServicesMobileServicesRail } from "@/components/pages/seo-services/seo-services-mobile-services-rail";
import { AppLink } from "@/components/ui/app-link";
import { GradientText } from "@/components/ui/gradient-text";
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
  title: "SEO Services",
  description:
    "Boost visibility, drive engagement, and grow revenue with Heroic Rankings AEO and SEO services.",
  path: "/seo-services",
});

const SERVICE_CARDS: readonly SeoDesktopServiceCard[] = [
  {
    title: "On-Page SEO Services",
    description: "Show up across searches not just rankings",
    isDescriptionGradient: true,
    imageSrc: "/seo-services/subtract-6.webp",
    titleWidthClass: "max-w-[324px]",
    descWidthClass: "max-w-[216px]",
    colSpanClass: "lg:col-span-2",
    backIntro:
      "Make your website more visible in search engines and LLMs with our on-page optimization services, designed to boost your rankings, enhance user experience, and drive conversions. We focus on:",
    backPoints: [
      "Content Optimization",
      "Meta Tags Optimization",
      "URL Structure",
      "Header Tag Optimization",
      "Internal Linking Optimization",
    ],
    backIntroWidthClass: "max-w-[528px]",
    backPointsWidthClass: "max-w-[248px]",
    href: "/on-page-seo",
  },
  {
    title: "Local SEO Services",
    description: "Connect Locally",
    imageSrc: "/seo-services/subtract-7.png",
    titleWidthClass: "max-w-[241px]",
    descWidthClass: "max-w-[219px]",
    colSpanClass: "lg:col-span-1",
    backIntro:
      "Increase visibility in local searches and maps with targeted strategies. Our local SEO services include:",
    backPoints: [
      "Google My Business",
      "Local Listings Management",
      "Local Content Creation",
    ],
    backIntroWidthClass: "max-w-[245px]",
    backPointsWidthClass: "max-w-[237px]",
    href: "/local-seo",
  },
  {
    title: "Technical SEO Services",
    description: "Optimize Your Website\u2019s Foundation",
    imageSrc: "/seo-services/subtract-5.png",
    titleWidthClass: "max-w-[241px]",
    descWidthClass: "max-w-[179px]",
    colSpanClass: "lg:col-span-1",
    backIntro:
      "Ensure peak performance, mobile-friendliness, and superior speed. Our technical SEO services cover:",
    backPoints: [
      "Site Audits",
      "Mobile Optimization",
      "Speed Optimization",
      "Structured Data Markup",
    ],
    backIntroWidthClass: "max-w-[245px]",
    backPointsWidthClass: "max-w-[237px]",
    href: "/technical-seo",
  },
  {
    title: "Link Building Services",
    description: "Expand your reach in both SERP and AI results",
    isDescriptionGradient: true,
    imageSrc: "/seo-services/subtract-4.webp",
    titleWidthClass: "max-w-[305px]",
    descWidthClass: "max-w-[383px]",
    colSpanClass: "lg:col-span-4",
    backIntro:
      "Leverage quality backlinks and build online authority to improve visibility and trustworthiness. Our off-page strategies include:",
    backPoints: [
      "White Hat Link Building",
      "Niche edits",
      "Guest posting",
      "Listicle posting (boosts LLM performance)",
    ],
    backIntroWidthClass: "max-w-[305px]",
    backPointsWidthClass: "max-w-[237px]",
    href: "/link-building",
  },
  {
    title: "E-Commerce SEO Services",
    description: "Increase Organic Revenue",
    imageSrc: "/seo-services/subtract-1.png",
    titleWidthClass: "max-w-[250px]",
    descWidthClass: "max-w-[216px]",
    colSpanClass: "lg:col-span-1",
    backIntro:
      "Optimize product listings and site structure to maximize visibility and conversions. Our e-commerce SEO services include:",
    backPoints: [
      "Product Page Optimization",
      "Category Optimization",
      "Technical SEO for E-Commerce",
      "Revenue forecasting",
    ],
    backIntroWidthClass: "max-w-[245px]",
    backPointsWidthClass: "max-w-[237px]",
    href: "/ecommerce-seo",
  },
  {
    title: "Content Services",
    description: "Craft Compelling Narratives",
    imageSrc: "/seo-services/subtract-2.png",
    titleWidthClass: "max-w-[250px]",
    descWidthClass: "max-w-[231px]",
    colSpanClass: "lg:col-span-1",
    backIntro:
      "Align your brand's voice with audience needs for organic growth. Our content services include:",
    backPoints: [
      "Content Strategy",
      "Content Creation",
      "Content Optimization",
      "Content calendar",
    ],
    backIntroWidthClass: "max-w-[245px]",
    backPointsWidthClass: "max-w-[237px]",
    href: "/content-creation",
  },
  {
    title: "Keyword Research and Strategy",
    description: "Discover Your Potential",
    isDescriptionGradient: true,
    imageSrc: "/seo-services/subtract-3.webp",
    titleWidthClass: "max-w-[453px]",
    descWidthClass: "max-w-[192px]",
    colSpanClass: "lg:col-span-2",
    backIntro:
      "Identify and target the keywords that matter to your audience. Our keyword services include:",
    backPoints: [
      "Comprehensive Keyword Research",
      "Competitive Analysis",
      "Keyword Mapping",
      "Keyword Clustering",
    ],
    backIntroWidthClass: "max-w-[400px]",
    backPointsWidthClass: "max-w-[300px]",
    href: "/keyword-strategy",
  },
] as const;

const FAQ_ITEMS = [
  {
    question: "What are SEO services and why do I need them?",
    answer:
      "SEO services enhance your website's visibility in search results, driving organic traffic and business growth. They include a variety of techniques and strategies aimed at improving your site's performance and user experience.",
    defaultOpen: true,
  },
  {
    question: "How do I know which SEO services are right for my business?",
    answer:
      "The best SEO services depend on your specific goals, industry, and current online presence. We start with a comprehensive audit to identify areas for improvement, then recommend a tailored strategy that aligns with your budget and objectives.",
    defaultOpen: false,
  },
  {
    question: "What are the benefits of On-Page Optimization services?",
    answer:
      "On-page optimization improves your website's content, structure, and HTML elements to make it more relevant and accessible to search engines. Benefits include higher rankings, better user experience, increased click-through rates, and more qualified organic traffic.",
    defaultOpen: false,
  },
] as const;

interface SeoServicesPageProps {
  cmsFaqItems?: SanityFaqItem[];
}

export default function SeoServicesPage({ cmsFaqItems }: SeoServicesPageProps) {
  const faqItems = cmsFaqItems?.length
    ? cmsFaqItems.map((f, i) => ({
        question: f.question,
        answer: f.answer,
        defaultOpen: i === 0,
      }))
    : FAQ_ITEMS;

  return (
    <>
      <section className="pt-[100px]" id="home">
        <div className={PAGE_SHELL_CLASS}>
          <h1 className="type-h1 mx-auto max-w-[857px] text-center text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
            <GradientText className="gradient-text-brand-about-us-hero-title">
              AEO &amp; SEO
            </GradientText>{" "}
            Services
          </h1>

          <p className="type-paragraph mx-auto mt-5 max-w-[688px] text-center text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
            Boost Your Visibility. Drive Engagement.
            <br />
            Achieve Conversions.{" "}
            <GradientText className="gradient-text-brand-about-us-hero-title">
              Generate Revenue
            </GradientText>
            .
          </p>

          <div className="relative mt-[60px] overflow-hidden rounded-[30px] bg-[linear-gradient(80.7496deg,var(--color-hr-dark)_35.359%,var(--color-hr-art-maudsch)_142.03%)] dark:opacity-90 lg:mt-[140px] lg:h-[696px] lg:rounded-[40px] lg:bg-[linear-gradient(52.8964deg,var(--color-hr-dark)_35.359%,var(--color-hr-art-maudsch)_142.03%)]">
            <div className="relative z-10 flex flex-col items-center px-[15px] pb-[20px] pt-[60px] text-center text-[var(--color-hr-pure-white)] lg:h-full lg:items-start lg:px-[70px] lg:pt-[120px] lg:text-left">
              <div className="w-full max-w-[298px] lg:max-w-[527px]">
                <SectionLabel className="text-[var(--color-hr-pure-white)]">
                  / Growth Engine /
                </SectionLabel>
                <h2 className="type-h2 mt-5 max-w-[298px] text-[var(--color-hr-pure-white)] lg:max-w-[482px]">
                  SEO that works while you sleep
                </h2>

                <p className="type-paragraph mt-5 max-w-[298px] text-[var(--color-hr-pure-white)] lg:mt-[23px] lg:max-w-[457px]">
                  SEO is a long-term growth engine and we build it with
                  precision, visibility across searches not just rankings.
                  <br />
                  <br />
                  At Heroic Rankings, we combine data, strategy, and execution
                  to drive measurable rankings, traffic, and revenue. Our
                  systems are designed to scale, deliver consistent growth, and
                  keep your brand visible 24/7.
                  <br />
                  <br />
                  Our methods ensure brands aren&apos;t just ranking,
                  they&apos;re being referenced, cited, and surfaced across
                  LLM-driven results.
                </p>

                <AppLink
                  className="type-cta motion-interactive motion-interactive-press mt-5 inline-flex h-[45px] w-full items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[var(--color-hr-accent)] bg-transparent text-[var(--color-hr-pure-white)] hover:bg-transparent focus-visible:ring-offset-[var(--color-hr-dark)] lg:w-[247px]"
                  href="/contact"
                  motionPreset="none"
                >
                  Get Your SEO Audit Now!
                  <GradientArrowUpRightIcon className="size-[10px]" />
                </AppLink>
              </div>
            </div>

            <div className="pointer-events-none relative h-[331px] w-full overflow-hidden lg:absolute lg:bottom-0 lg:left-[198px] lg:top-0 lg:h-auto lg:w-[1222px] lg:rounded-br-[40px] lg:rounded-tl-none">
              <Image
                alt="Classical statue holding a sword"
                className="absolute left-[-6%] top-[-15.85%] h-[199.15%] w-[130.1%] max-w-none object-cover lg:left-[34.77%] lg:top-[-13.53%] lg:h-[163.31%] lg:w-[69.76%]"
                fetchPriority="high"
                height={4096}
                priority
                quality={95}
                sizes="(min-width: 1024px) 90vw, 100vw"
                src="/seo-services/hero-statue.webp"
                width={3072}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="pt-[60px] lg:pt-[120px]" id="services">
        <div className={PAGE_SHELL_CLASS}>
          <div className={CONTENT_SHELL_CLASS}>
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
              <SectionLabel>/ Growth Engine Parts /</SectionLabel>
              <h2 className="type-h2 mt-5 max-w-[202px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] lg:max-w-[384px]">
                All-Inclusive{" "}
                <GradientText className="gradient-text-brand-services">
                  SEO Solutions
                </GradientText>
              </h2>
            </div>

            <SeoServicesMobileServicesRail />

            <SeoServicesDesktopServicesGrid cards={SERVICE_CARDS} />
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
        sectionId="about"
      />

      <ServiceSuccessStories
        buttonIcon={<GradientArrowUpRightIcon className="size-[10px]" />}
        cardArrowIcon={<DiagonalArrowIcon className="size-5" />}
        contentShellClass={CONTENT_SHELL_CLASS}
        heading={
          <>
            Success{" "}
            <GradientText className="gradient-text-brand-case">
              Stories
            </GradientText>
          </>
        }
        pageShellClass={PAGE_SHELL_CLASS}
        sectionId="case-studies"
        stories={SUCCESS_STORIES}
      />

      <ServiceFaq
        answerClassName="pb-[30px] pl-[30px] pr-[30px] sm:pr-[90px] lg:pr-[223px]"
        containerClassName="relative mt-[80px] overflow-hidden rounded-[40px] border border-[var(--color-hr-light-grey)] dark:border-[var(--color-border-inverse-10)] bg-[var(--color-hr-pure-white)] dark:bg-[var(--color-bg-dark)]"
        detailsClassName="group border-[var(--color-hr-light-grey)] dark:border-[var(--color-border-inverse-10)] open:bg-[var(--color-hr-pure-white)] dark:bg-[var(--color-bg-dark)] dark:open:bg-[var(--color-bg-dark)]"
        items={faqItems}
        outerClassName="rounded-[40px] bg-[var(--color-hr-off-white)] dark:bg-[var(--color-bg-dark)] px-5 pb-[60px] lg:pb-[120px] pt-[60px] lg:pt-[120px] sm:px-8 lg:px-[70px]"
        renderIcon={
          <span className="inline-flex size-[25px] items-center justify-center">
            <FaqPlusIcon className="size-[18px] transition-transform duration-200 group-open:-rotate-45 dark:text-[var(--color-text-inverse)]" />
          </span>
        }
        sectionId="faq"
        summaryClassName="flex cursor-pointer list-none items-center justify-between gap-4 px-[30px] py-[28px] [&::-webkit-details-marker]:hidden"
      />
    </>
  );
}
