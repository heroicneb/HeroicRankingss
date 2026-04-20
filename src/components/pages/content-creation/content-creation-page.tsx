import type { Metadata } from "next";
import Image from "next/image";

import {
  ContentCreationMobileSolutionsRail,
  type ContentCreationMobileSolutionCard,
} from "@/components/pages/content-creation/content-creation-mobile-solutions-rail";
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
  title: "Content Creation Services",
  description:
    "Craft strategy-led content that attracts qualified traffic, strengthens authority, and turns engagement into conversions.",
  path: "/content-creation",
});

const HERO_STATUE_IMAGE =
  "/content-creation/7aa368c28cc6d75dc25d0d2b0e7091d491102bce.webp";

type ContentCreationServiceCard = {
  title: string;
  subtitle: string;
  body: string;
  ctaLabel: string;
  mobileCtaLabel: string;
  iconSrc: string;
  iconWidth: number;
  iconHeight: number;
  mobileIconWidth: number;
  mobileIconHeight: number;
  mobileIconWrapperClassName: string;
};

const SERVICE_CARDS: readonly ContentCreationServiceCard[] = [
  {
    title: "Content Planning and Creation",
    subtitle: "Weaving Stories with Purpose",
    body: "Every asset is researched, structured, and written to strengthen authority, capture demand, and influence outcomes across both search and AI-driven discovery environments.",
    ctaLabel: "Plan and Create Content",
    mobileCtaLabel: "Plan and Create Content",
    iconSrc: "/content-creation/icon-content-planning.svg",
    iconWidth: 30,
    iconHeight: 30,
    mobileIconWidth: 30,
    mobileIconHeight: 30,
    mobileIconWrapperClassName: "px-[10px] py-[8px]",
  },
  {
    title: "Blogging and Article Writing",
    subtitle: "Sharing Insights that Resonate",
    body: "We specialize in crafting compelling blog posts and articles that address industry trends, answer common questions, and position your brand as a trusted authority.",
    ctaLabel: "Start Blogging",
    mobileCtaLabel: "Start Blogging",
    iconSrc: "/content-creation/icon-blogging.svg",
    iconWidth: 34,
    iconHeight: 30,
    mobileIconWidth: 34,
    mobileIconHeight: 30,
    mobileIconWrapperClassName: "px-[8px] py-[10px]",
  },
  {
    title: "Infographics and Visual Content",
    subtitle: "Conveying Complexity with Clarity",
    body: "Our infographics and visual content services transform complex ideas into easily digestible visuals, engaging users and enhancing the overall user experience.",
    ctaLabel: "Create Visual Content",
    mobileCtaLabel: "Create Visual Content",
    iconSrc: "/content-creation/icon-infographics.svg",
    iconWidth: 33,
    iconHeight: 26,
    mobileIconWidth: 33,
    mobileIconHeight: 26,
    mobileIconWrapperClassName: "p-[9px]",
  },
  {
    title: "Content Calendar Development",
    subtitle: "Guiding Your Content Journey",
    body: "We build content calendars as growth engines \u2014 mapping topics, formats, and distribution to search intent, audience behavior, and business goals.",
    ctaLabel: "Develop Your Calendar",
    mobileCtaLabel: "Develop Your Calendar",
    iconSrc: "/content-creation/icon-calendar.svg",
    iconWidth: 32,
    iconHeight: 32,
    mobileIconWidth: 32,
    mobileIconHeight: 32,
    mobileIconWrapperClassName: "p-[9px]",
  },
  {
    title: "Linkable Asset Creation",
    subtitle: "Attracting organic backlinks",
    body: "High-value resources \u2014 original research, data studies, and interactive tools \u2014 that journalists, bloggers, and industry sites naturally want to reference and link to.",
    ctaLabel: "Get Referenced",
    mobileCtaLabel: "Get Referenced",
    iconSrc: "/content-creation/icon-linkable.svg",
    iconWidth: 30,
    iconHeight: 31,
    mobileIconWidth: 30,
    mobileIconHeight: 31,
    mobileIconWrapperClassName: "px-[10px] py-[8px]",
  },
  {
    title: "Listicles Post Creation",
    subtitle: "Improve AI signals and LLM citations",
    body: "We craft structured, expert-backed listicles that rank well in search, get referenced by AI assistants, and give readers the clear, scannable answers they\u2019re actually looking for.",
    ctaLabel: "Stay Visible to AI Bots",
    mobileCtaLabel: "Stay Visible to AI Bots",
    iconSrc: "/content-creation/icon-listicles.svg",
    iconWidth: 33,
    iconHeight: 30,
    mobileIconWidth: 33,
    mobileIconHeight: 30,
    mobileIconWrapperClassName: "px-[8px] py-[10px]",
  },
];

const CTA_STEPS = buildProcessSteps(
  [
    "Contact us to discover how our content creation services can take your online presence to the next level.",
    "Our team builds a focused content roadmap and starts producing high-impact articles that match your audience intent.",
    "We align every stakeholder on priorities, publishing cadence, and measurable goals before full execution begins.",
    "We coordinate contributors, review flows, and distribution channels so your content engine runs consistently at scale.",
    "Specialists across SEO, editorial, and optimization continuously refine performance so content keeps compounding results.",
  ],
  {
    0: "Strategy",
    1: "Content Writing",
    2: "Strategy Introduction",
    3: "Connecting Agents",
    4: "Experts",
  },
);

const FAQ_ITEMS = [
  {
    question: "Do you optimise for seasonal and trending keywords?",
    answer:
      "Yes, we monitor seasonal trends and emerging topics in your industry to ensure your content stays relevant and capitalizes on timely search demand, driving targeted traffic when interest peaks.",
    defaultOpen: true,
  },
  {
    question: "Why is content planning and creation important?",
    answer:
      "Content planning ensures every piece you publish serves a strategic purpose — whether that is attracting new visitors, nurturing leads, or establishing thought leadership. Without a plan, content efforts become scattered and less effective.",
    defaultOpen: false,
  },
  {
    question: "How does blogging and article writing benefit my brand?",
    answer:
      "Regular, high-quality blog content establishes your brand as an authority, improves search engine rankings for relevant keywords, and creates shareable assets that drive organic traffic over time.",
    defaultOpen: false,
  },
  {
    question: "What is the significance of infographics and visual content?",
    answer:
      "Visual content like infographics simplifies complex information and is highly shareable across social platforms. They attract backlinks naturally, increase engagement, and help communicate your expertise in an accessible format.",
    defaultOpen: false,
  },
  {
    question: "Can content strategy services improve my website's SEO?",
    answer:
      "Absolutely. A well-executed content strategy targets the keywords your audience searches for, builds topical authority, and creates internal linking structures that help search engines understand and rank your site more effectively.",
    defaultOpen: false,
  },
] as const;

interface ContentCreationPageProps {
  cmsFaqItems?: SanityFaqItem[];
}

export default function ContentCreationPage({
  cmsFaqItems,
}: ContentCreationPageProps) {
  const faqItems = cmsFaqItems?.length
    ? cmsFaqItems.map((f, i) => ({
        question: f.question,
        answer: f.answer,
        defaultOpen: i === 0,
      }))
    : FAQ_ITEMS;

  const mobileServiceCards: readonly ContentCreationMobileSolutionCard[] =
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
      <section className="pt-[60px] lg:pt-[100px]" id="content-creation-home">
        <div className={PAGE_SHELL_CLASS}>
          <h1 className="type-h1 mx-auto max-w-[294px] text-center text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] lg:max-w-[857px]">
            Content Creation Services
          </h1>

          <p className="type-paragraph mx-auto mt-5 max-w-[294px] text-center text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] lg:max-w-[419px]">
            Turn Every Story Into Visibility, Trust, and Revenue{" "}
            <GradientText className="gradient-text-brand-quote">
              Across Search and AI Platforms
            </GradientText>
          </p>

          <div className="relative mt-[60px] overflow-hidden rounded-[30px] bg-[linear-gradient(73.9149deg,var(--color-hr-dark)_35.359%,var(--color-case-art-maudsch)_142.03%)] dark:opacity-90 lg:mt-[120px] lg:h-[722px] lg:rounded-[40px] lg:bg-[linear-gradient(53.9022deg,var(--color-hr-dark)_35.359%,var(--color-case-art-maudsch)_142.03%)]">
            <div className="relative z-10 flex flex-col items-center px-[15px] pb-[20px] pt-[60px] text-center text-[var(--color-hr-pure-white)] lg:h-full lg:items-start lg:px-[70px] lg:pt-[120px] lg:text-left">
              <div className="w-full max-w-[350px] lg:max-w-[561px]">
                <SectionLabel className="text-[var(--color-hr-pure-white)]">
                  / Tell Your Story /
                </SectionLabel>
                <h2 className="type-h2 mx-auto mt-5 max-w-[350px] text-[var(--color-hr-pure-white)] lg:mx-0 lg:max-w-[542px]">
                  Content That Moves Readers From Curious to Certain
                </h2>

                <p className="type-paragraph mx-auto mt-5 max-w-[292px] text-[var(--color-hr-pure-white)] lg:mx-0 lg:mt-10 lg:max-w-[508px]">
                  Content should do more than attract traffic. Content builds
                  trust and guides readers to close the gap between interest and
                  action.
                  <br />
                  <br />
                  When your brand is surfaced by AI-driven and LLM-powered
                  systems: you&apos;re entering high-intent decision flows where
                  users actively seek solutions and visibility within these
                  environments, position your business to be present at the
                  exact moment decisions are formed.
                </p>

                <AppLink
                  className="type-cta motion-interactive motion-interactive-press mt-5 inline-flex h-[45px] w-full items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-button)] border border-[var(--color-hr-accent)] bg-transparent px-5 text-[var(--color-hr-pure-white)] hover:bg-[color-mix(in_srgb,var(--color-hr-pure-white)_8%,transparent)] focus-visible:ring-offset-[var(--color-hr-dark)] lg:mt-10 lg:w-auto"
                  href="/contact"
                  motionPreset="none"
                >
                  Book a Content Strategy Consultation
                  <GradientArrowUpRightIcon className="size-4" />
                </AppLink>
              </div>
            </div>

            <div className="pointer-events-none relative h-[331px] w-full overflow-hidden lg:absolute lg:inset-0 lg:h-auto lg:w-auto lg:rounded-[40px]">
              <div className="h-full [transform:scaleX(-1)] lg:contents">
                <Image
                  alt="Classical statue writing with a feather"
                  className="absolute left-[-0.15%] top-[-77.95%] h-[207.04%] w-[106.29%] max-w-none object-cover lg:left-[36.14%] lg:top-[-77.35%] lg:h-[213.86%] lg:w-[64.08%] lg:[transform:scaleX(-1)]"
                  fetchPriority="high"
                  height={4096}
                  priority
                  sizes="(min-width: 1024px) 52vw, 350px"
                  src={HERO_STATUE_IMAGE}
                  width={2414}
                />
              </div>
            </div>

            <div className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(90deg,color-mix(in_srgb,var(--color-hr-dark)_92%,transparent)_0%,color-mix(in_srgb,var(--color-hr-dark)_75%,transparent)_34%,color-mix(in_srgb,var(--color-hr-dark)_16%,transparent)_52%,transparent_62%)] dark:opacity-90 lg:block" />
          </div>
        </div>
      </section>

      <section
        className="pt-[10px] lg:pt-[10px]"
        id="content-creation-solutions"
      >
        <div className={PAGE_SHELL_CLASS}>
          <div className="rounded-[40px] bg-[var(--color-hr-off-white)] px-[10px] pb-[20px] pt-[40px] dark:bg-[var(--color-bg-dark)] sm:px-8 lg:rounded-[40px] lg:px-[70px] lg:pb-[70px] lg:pt-[120px]">
            <SectionLabel className="text-center lg:text-left">
              / Solutions /
            </SectionLabel>
            <h2 className="type-h2 mx-auto mt-5 max-w-[266px] text-center text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] lg:mx-0 lg:max-w-[457px] lg:text-left">
              <GradientText className="gradient-text-brand-services">
                Content Creation
              </GradientText>{" "}
              & Strategy Services
            </h2>

            <ContentCreationMobileSolutionsRail cards={mobileServiceCards} />

            <div className="mt-[120px] hidden grid-cols-1 gap-5 lg:grid lg:grid-cols-2 xl:grid-cols-3">
              {SERVICE_CARDS.map((card) => (
                <article
                  className="flex h-[492px] flex-col rounded-[40px] border border-[var(--color-hr-light-grey)] dark:border-[var(--color-border-inverse-10)] bg-[var(--color-hr-pure-white)] dark:bg-[var(--color-bg-dark)] px-[30px] pb-[30px] pt-[30px]"
                  key={card.title}
                >
                  <span className="inline-flex size-[30px] items-center justify-center">
                    <Image
                      alt=""
                      aria-hidden
                      className="block size-full dark:brightness-0 dark:invert"
                      height={card.iconHeight}
                      sizes="30px"
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

            <section className="mt-5 rounded-[30px] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-pure-white)] px-[20px] py-[30px] dark:border-[var(--color-border-inverse-10)] dark:bg-[var(--color-bg-dark)] lg:mt-[120px] lg:rounded-[24px] lg:px-[30px] lg:pb-[30px] lg:pt-[30px]">
              <h3 className="type-h3 max-w-[760px] pb-[4px] text-center leading-[1.3] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] lg:text-left">
                Is your content speaking to the{" "}
                <GradientText className="gradient-text-brand-about-us-process-title">
                  right audience
                </GradientText>
                ? The Fastest and{" "}
                <GradientText className="gradient-text-brand-about-us-process-title">
                  Most Effective to Get Started!
                </GradientText>
              </h3>

              <div className="mt-[20px] lg:mt-[30px]">
                <ProcessStepSwitcher
                  steps={CTA_STEPS}
                  descriptionClassName="type-paragraph mt-10 max-w-[600px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]"
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
        sectionId="content-creation-why-heroic"
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
        sectionId="content-creation-success-stories"
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
        sectionId="content-creation-faq"
        summaryClassName="flex cursor-pointer list-none items-center justify-between gap-4 px-[30px] py-[28px] [&::-webkit-details-marker]:hidden"
      />
    </>
  );
}
