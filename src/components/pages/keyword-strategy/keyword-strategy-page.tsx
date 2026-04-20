import type { Metadata } from "next";
import Image from "next/image";

import {
  KeywordStrategyMobileSolutionsRail,
  type KeywordStrategyMobileSolutionCard,
} from "@/components/pages/keyword-strategy/keyword-strategy-mobile-solutions-rail";
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
import { buildProcessSteps } from "@/data/process-steps";
import { PAGE_SHELL_CLASS, CONTENT_SHELL_CLASS } from "@/data/service-shared";
import { SUCCESS_STORIES } from "@/data/success-stories";
import { WHY_CHOOSE_ITEMS } from "@/data/why-choose-items";
import { cn } from "@/lib/cn";
import { createPageMetadata } from "@/lib/metadata";
import type { SanityFaqItem } from "@/lib/sanity-data";

export const metadata: Metadata = createPageMetadata({
  title: "Keyword Strategy Services",
  description:
    "Reveal keyword opportunities you are missing and turn search demand into qualified traffic and revenue.",
  path: "/keyword-strategy",
});

const HERO_STATUE_IMAGE =
  "/keyword-strategy/012b3586db53585c2f2ea20a4f280ca6c2da8e1c.webp";

type KeywordStrategyServiceCard = {
  title: string;
  subtitle: string;
  body: string;
  ctaLabel: string;
  ctaWidthClass: string;
  mobileCtaLabel: string;
  iconSrc: string;
  iconWidth: number;
  iconHeight: number;
  iconClassName: string;
  mobileIconWidth: number;
  mobileIconHeight: number;
  mobileIconWrapperClassName: string;
};

const SERVICE_CARDS: readonly KeywordStrategyServiceCard[] = [
  {
    title: "Understand What Your Audience Is Searching For",
    subtitle: "Uncovering Real Search Behaviour",
    body: "We start by mapping exactly what your target audience types into Google \u2014 the words, phrases, and questions they use at every stage of their journey. This gives you a clear picture of demand before a single page is written or optimised.",
    ctaLabel: "Explore Search Behaviour",
    ctaWidthClass: "w-[240px]",
    mobileCtaLabel: "Explore Search Behaviour",
    iconSrc: "/keyword-strategy/e04b1944e94a99ed95972b85d3c5af5275015368.svg",
    iconWidth: 26,
    iconHeight: 28,
    iconClassName: "h-[27.5px] w-[26.167px]",
    mobileIconWidth: 26.167,
    mobileIconHeight: 27.5,
    mobileIconWrapperClassName: "px-[10px] py-[8px]",
  },
  {
    title: "Identify the Market Opportunity",
    subtitle: "Finding the Gaps Your Competitors Miss",
    body: "We analyse the competitive landscape to surface untapped opportunities \u2014 keywords your competitors rank for, angles they\u2019re missing, and gaps your content can move into. This is where strategy begins to take shape.",
    ctaLabel: "Analyse Your Market",
    ctaWidthClass: "w-[210px]",
    mobileCtaLabel: "Analyse Your Market",
    iconSrc: "/keyword-strategy/1afabcf51a9c3c51eedaf504043a1210988afe69.svg",
    iconWidth: 31,
    iconHeight: 28,
    iconClassName: "h-[28px] w-[31px]",
    mobileIconWidth: 31,
    mobileIconHeight: 28,
    mobileIconWrapperClassName: "px-[8px] py-[10px]",
  },
  {
    title: "Measure Demand Across Every Search Intent",
    subtitle: "Outperforming Your Competitors",
    body: "Not all searches are equal. We break down keyword demand by intent so you understand exactly where your audience is in the buying journey and how large each segment of the market really is.",
    ctaLabel: "Map Search Intent",
    ctaWidthClass: "w-[200px]",
    mobileCtaLabel: "Map Search Intent",
    iconSrc: "/keyword-strategy/00b6125bd084bca4a5c73f420b68127d8d429540.svg",
    iconWidth: 34,
    iconHeight: 34,
    iconClassName: "size-[34px]",
    mobileIconWidth: 34,
    mobileIconHeight: 34,
    mobileIconWrapperClassName: "p-[9px]",
  },
  {
    title: "Build the Right Keyword Mix",
    subtitle: "Balancing Short-Term Wins With Long-Term Growth",
    body: "We identify the full spectrum of keyword types \u2014 head terms, long-tail, branded, and question-based \u2014 and structure a mix that balances quick ranking opportunities with sustainable authority-building over time.",
    ctaLabel: "Build Your Keyword Strategy",
    ctaWidthClass: "w-[260px]",
    mobileCtaLabel: "Build Your Keyword Strategy",
    iconSrc: "/keyword-strategy/a5e352855597b793da42fff51d66f8bb9f23c336.svg",
    iconWidth: 30,
    iconHeight: 31,
    iconClassName: "h-[31px] w-[29.885px]",
    mobileIconWidth: 29.885,
    mobileIconHeight: 31,
    mobileIconWrapperClassName: "px-[12px] py-[13px]",
  },
  {
    title: "Project Your Organic Traffic",
    subtitle: "Knowing What Top Rankings Are Actually Worth Before",
    body: "Before you invest in content or optimisation, you should know what the return looks like. We model realistic traffic projections for top-ranking positions across your target keywords \u2014 so you go in with clear expectations and a strategy built around actual business impact.",
    ctaLabel: "See Your Traffic Potential",
    ctaWidthClass: "w-[240px]",
    mobileCtaLabel: "See Your Traffic Potential",
    iconSrc: "/keyword-strategy/a281b8a790541e5f6c01e72b8894ea4860b0027f.svg",
    iconWidth: 33,
    iconHeight: 30,
    iconClassName: "h-[30px] w-[33px]",
    mobileIconWidth: 33,
    mobileIconHeight: 30,
    mobileIconWrapperClassName: "px-[8.5px] py-[10px]",
  },
];

const CTA_STEPS = buildProcessSteps([
  "Contact us to schedule a consultation and learn how our keyword strategy services can transform your online presence.",
  "The first call helps us understand your current rankings, conversion goals, and the keyword gaps blocking qualified traffic.",
  "We collect site structure, current content, competitor landscape, and search demand signals to map high-impact opportunities.",
  "We align the keyword roadmap with your budget and prioritize quick-win clusters alongside long-term growth opportunities.",
  "You get a clear action plan for keyword targeting, page mapping, and execution order so your team can scale predictable SEO growth.",
]);

const FAQ_ITEMS = [
  {
    question: "What is the role of keyword strategy in SEO?",
    answer:
      "Keyword strategy is the foundation of SEO. It involves selecting and optimizing specific search terms to improve your website’s visibility in search engine results.",
    defaultOpen: true,
  },
  {
    question: "How do you choose the right keywords for my business?",
    answer:
      "We analyze search volume, competition difficulty, commercial intent, and relevance to your products or services. By combining industry research with competitor gap analysis and audience behavior data, we identify keywords that balance traffic potential with realistic ranking opportunity to maximize your ROI.",
    defaultOpen: false,
  },
  {
    question: "Why is long-tail keyword targeting important?",
    answer:
      "Long-tail keywords are highly specific phrases with lower competition and stronger buyer intent. Users searching these terms are typically closer to making a decision, which means they convert at significantly higher rates. Targeting long-tail keywords allows you to capture qualified traffic that broader terms often miss.",
    defaultOpen: false,
  },
  {
    question: "What is competitive keyword analysis, and why is it essential?",
    answer:
      "Competitive keyword analysis examines which keywords your competitors rank for, where they get their traffic, and where gaps exist in their strategy. This insight reveals untapped opportunities you can capitalize on and helps you prioritize keywords where you can realistically outperform the competition.",
    defaultOpen: false,
  },
  {
    question:
      "How does keyword mapping benefit my website's content and pages?",
    answer:
      "Keyword mapping assigns specific target keywords to individual pages on your website, preventing keyword cannibalization and ensuring every page has a clear ranking purpose. This structured approach improves site architecture, guides content creation, and helps search engines understand which page to rank for each query.",
    defaultOpen: false,
  },
  {
    question: "Do you optimize for seasonal and trending keywords?",
    answer:
      "Yes, we incorporate seasonal trends and emerging search patterns into your keyword strategy. By identifying peak search periods for your industry and monitoring trending topics, we ensure your content captures surges in demand when they happen, keeping your traffic and revenue consistent throughout the year.",
    defaultOpen: false,
  },
] as const;

interface KeywordStrategyPageProps {
  cmsFaqItems?: SanityFaqItem[];
}

export default function KeywordStrategyPage({
  cmsFaqItems,
}: KeywordStrategyPageProps) {
  const faqItems = cmsFaqItems?.length
    ? cmsFaqItems.map((f, i) => ({
        question: f.question,
        answer: f.answer,
        defaultOpen: i === 0,
      }))
    : FAQ_ITEMS;

  const mobileServiceCards: readonly KeywordStrategyMobileSolutionCard[] =
    SERVICE_CARDS.map((card) => ({
      title: card.title,
      subtitle: card.subtitle,
      body: card.body,
      ctaLabel: card.mobileCtaLabel ?? card.ctaLabel,
      iconSrc: card.iconSrc,
      iconWidth: card.mobileIconWidth ?? card.iconWidth,
      iconHeight: card.mobileIconHeight ?? card.iconHeight,
      iconWrapperClassName: card.mobileIconWrapperClassName,
    }));

  return (
    <>
      <section className="pt-[60px] lg:pt-[100px]" id="keyword-strategy-home">
        <div className={PAGE_SHELL_CLASS}>
          <h1 className="type-h1 mx-auto max-w-[294px] text-center text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] lg:max-w-[857px]">
            Keyword Strategy Services
          </h1>

          <p className="type-paragraph mx-auto mt-5 max-w-[294px] text-center text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] lg:max-w-[514px]">
            Get the most out of your content.{" "}
            <GradientText className="gradient-text-brand-about-us-hero-title">
              Target the Right Search.
            </GradientText>{" "}
            Find the Words That Bring Customers to You Across Search and AI
            Driven Discovery.
          </p>

          <div className="relative mt-[60px] overflow-hidden rounded-[30px] bg-[linear-gradient(73.9149deg,var(--color-hr-dark)_35.359%,var(--color-case-art-maudsch)_142.03%)] dark:opacity-90 lg:mt-[120px] lg:h-[722px] lg:rounded-[40px] lg:bg-[linear-gradient(53.9022deg,var(--color-hr-dark)_35.359%,var(--color-case-art-maudsch)_142.03%)]">
            <div className="relative z-10 flex flex-col items-center px-[15px] pb-[20px] pt-[60px] text-center text-[var(--color-hr-pure-white)] lg:h-full lg:items-start lg:px-[70px] lg:pt-[120px] lg:text-left">
              <div className="w-full max-w-[350px] lg:max-w-[561px]">
                <SectionLabel className="text-[var(--color-hr-pure-white)]">
                  / Blueprint /
                </SectionLabel>
                <h2 className="type-h2 mx-auto mt-5 max-w-[350px] text-[var(--color-hr-pure-white)] lg:mx-0 lg:max-w-[472px]">
                  Reveal the Search Opportunities You&apos;ve Been Missing
                </h2>

                <p className="type-paragraph mx-auto mt-5 max-w-[294px] text-[var(--color-hr-pure-white)] lg:mx-0 lg:mt-10 lg:max-w-[413px]">
                  Your business deserves to be found by the right audience{" "}
                  {"\u2014"} every time. We map the exact terms your ideal
                  customers use: positioning your brand where real buying
                  decisions begin.
                </p>

                <AppLink
                  className="type-cta motion-interactive motion-interactive-press mt-5 inline-flex h-[45px] w-full items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-button)] border border-[var(--color-hr-accent)] bg-transparent px-5 text-[var(--color-hr-pure-white)] hover:bg-[color-mix(in_srgb,var(--color-hr-pure-white)_8%,transparent)] focus-visible:ring-offset-[var(--color-hr-dark)] lg:mt-10 lg:w-auto"
                  href="/contact"
                  motionPreset="none"
                >
                  Book a Keyword Strategy Consultation
                  <GradientArrowUpRightIcon className="size-4" />
                </AppLink>
              </div>
            </div>

            <div className="pointer-events-none relative h-[331px] w-full overflow-hidden lg:absolute lg:bottom-0 lg:left-0 lg:right-0 lg:top-0 lg:h-auto">
              <Image
                alt="Classical statue holding a magnifying glass"
                className="absolute left-[-14.45%] top-[-32.99%] h-[177.26%] w-[220.67%] max-w-none object-cover lg:left-[29.04%] lg:top-[-30.39%] lg:h-[174.01%] lg:w-auto"
                fetchPriority="high"
                height={2866}
                priority
                sizes="(min-width: 1024px) 126vw, 350px"
                src={HERO_STATUE_IMAGE}
                width={4096}
              />
            </div>

            <div className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(90deg,color-mix(in_srgb,var(--color-hr-dark)_92%,transparent)_0%,color-mix(in_srgb,var(--color-hr-dark)_74%,transparent)_36%,color-mix(in_srgb,var(--color-hr-dark)_24%,transparent)_64%,transparent_86%)] dark:opacity-90 lg:block" />
          </div>
        </div>
      </section>

      <section className="pt-[10px]" id="keyword-strategy-solutions">
        <div className={PAGE_SHELL_CLASS}>
          <div className="rounded-[40px] bg-[var(--color-hr-off-white)] px-[10px] pb-[20px] pt-[40px] dark:bg-[var(--color-bg-dark)] sm:px-8 lg:rounded-[40px] lg:px-[70px] lg:pb-[70px] lg:pt-[120px]">
            <SectionLabel className="text-center lg:text-left">
              / Solutions /
            </SectionLabel>
            <h2 className="type-h2 mx-auto mt-5 max-w-[266px] text-center text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] lg:mx-0 lg:max-w-[442px] lg:text-left">
              Keyword{" "}
              <GradientText className="gradient-text-brand-services">
                Research
              </GradientText>{" "}
              Services
            </h2>

            <KeywordStrategyMobileSolutionsRail cards={mobileServiceCards} />

            <div className="mt-[120px] hidden grid-cols-1 gap-5 lg:grid lg:grid-cols-2 xl:grid-cols-3">
              {SERVICE_CARDS.map((card) => (
                <article
                  className="flex h-[540px] flex-col rounded-[40px] border border-[var(--color-hr-light-grey)] dark:border-[var(--color-border-inverse-10)] bg-[var(--color-hr-pure-white)] dark:bg-[var(--color-bg-dark)] px-[30px] pb-[30px] pt-[30px]"
                  key={card.title}
                >
                  <span className="inline-flex size-[50px] items-center justify-center rounded-[12px] border border-[var(--color-hr-light-grey)] dark:border-[var(--color-border-inverse-10)] bg-[var(--color-hr-pure-white)] dark:bg-[var(--color-bg-dark)]">
                    <Image
                      alt=""
                      aria-hidden
                      className={cn(
                        card.iconClassName,
                        "dark:brightness-0 dark:invert",
                      )}
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
                    className="type-cta mt-auto inline-flex h-[45px] min-w-[163px] items-center justify-center gap-2 self-start whitespace-nowrap rounded-[var(--radius-button)] border border-[var(--color-hr-accent)] bg-transparent px-5 text-[var(--color-hr-dark)] hover:bg-[var(--color-hr-off-white)] dark:text-[var(--color-text-inverse)] dark:hover:bg-[var(--color-surface-inverse-10)]"
                  >
                    {card.ctaLabel}
                    <GradientArrowUpRightIcon className="size-[10px]" />
                  </AppLink>
                </article>
              ))}
            </div>

            <section className="mt-5 rounded-[30px] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-pure-white)] px-[20px] py-[30px] dark:border-[var(--color-border-inverse-10)] dark:bg-[var(--color-bg-dark)] lg:mt-[120px] lg:rounded-[40px] lg:px-[30px] lg:pb-[30px] lg:pt-[30px]">
              <h3 className="type-h3 max-w-[1024px] pb-[4px] text-center leading-[1.3] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] lg:text-left">
                Curious about what{" "}
                <GradientText className="gradient-text-brand-about-us-process-title">
                  keywords
                </GradientText>{" "}
                could unlock{" "}
                <GradientText className="gradient-text-brand-about-us-process-title">
                  more revenue
                </GradientText>{" "}
                for your business? The Fastest and{" "}
                <GradientText className="gradient-text-brand-about-us-process-title">
                  Most Effective to Get Started!
                </GradientText>
              </h3>

              <div className="mt-[20px] lg:mt-[30px]">
                <ProcessStepSwitcher
                  steps={CTA_STEPS}
                  descriptionClassName="type-paragraph mt-[39px] max-w-[600px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]"
                  mutedPillClassName="type-paragraph whitespace-nowrap rounded-[100px] bg-[var(--color-hr-off-white)] dark:bg-[var(--color-surface-inverse-10)] px-[14px] py-[6px] text-[var(--color-hr-grey)] dark:text-[var(--color-text-inverse-60)] transition-colors hover:text-[var(--color-hr-dark)] dark:hover:text-[var(--color-text-inverse)]"
                  rowClassName="flex flex-wrap items-center gap-[10px] pb-1 xl:flex-nowrap"
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
        sectionId="keyword-strategy-why-heroic"
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
        sectionId="keyword-strategy-success-stories"
        stories={SUCCESS_STORIES}
      />

      <ServiceFaq
        answerClassName="pb-[30px] pl-[30px] pr-[30px] sm:pr-[90px] lg:pr-[223px]"
        containerClassName="relative mt-[80px] overflow-hidden rounded-[40px] border border-[var(--color-hr-light-grey)] dark:border-[var(--color-border-inverse-10)] bg-[var(--color-hr-pure-white)] dark:bg-[var(--color-bg-dark)]"
        detailsClassName="group border-[var(--color-hr-light-grey)] dark:border-[var(--color-border-inverse-10)] open:bg-[var(--color-hr-pure-white)] dark:bg-[var(--color-bg-dark)] dark:open:bg-[var(--color-bg-dark)]"
        items={faqItems}
        renderIcon={
          <span className="inline-flex size-[25px] items-center justify-center">
            <FaqPlusIcon className="size-[18px] transition-transform duration-200 group-open:-rotate-45 dark:text-[var(--color-text-inverse)]" />
          </span>
        }
        sectionId="keyword-strategy-faq"
        summaryClassName="flex cursor-pointer list-none items-center justify-between gap-4 px-[30px] py-[28px] [&::-webkit-details-marker]:hidden"
      />
    </>
  );
}
