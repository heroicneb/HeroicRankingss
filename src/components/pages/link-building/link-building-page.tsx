import type { Metadata } from "next";
import Image from "next/image";
import { ProcessStepSwitcher } from "@/components/sections/process-step-switcher";
import { ServiceFaq } from "@/components/sections/shared/service-faq";
import { ServiceSuccessStories } from "@/components/sections/shared/service-success-stories";
import { ServiceWhyChoose } from "@/components/sections/shared/service-why-choose";
import { GradientText } from "@/components/ui/gradient-text";
import { AppLink } from "@/components/ui/app-link";
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
  title: "Link Building Services",
  description:
    "Strengthen your off-page SEO with white-hat link building services that improve rankings, authority, and long-term organic growth.",
  path: "/link-building",
});

const HERO_STATUE_SRC = "/link-building/imgRectangle5.webp";
const COMPETITOR_IMAGE_SRC = "/link-building/imgImage38.png";
const CTA_BANNER_BG_SRC = "/link-building/imgSubtract1.svg";
const COLLAPSED_ROW_BG_SRC = "/link-building/imgSubtract3.svg";
const FAQ_BG_SRC = "/link-building/imgSubtract.svg";
const ROW_DIVIDER_SRC = "/link-building/imgLine13.svg";

interface ServiceCardItem {
  title: string;
  subtitle: string;
  body: string;
  ctaLabel: string;
  iconSrc: string;
  iconWidth: number;
  iconHeight: number;
  iconClassName?: string;
}

interface CompetitorInsightItem {
  title: string;
  body: readonly string[];
  defaultOpen?: boolean;
  showChart?: boolean;
}

const SERVICE_CARDS: readonly ServiceCardItem[] = [
  {
    title: "Guest Posting",
    subtitle: "Sharing Expertise, Building Authority",
    body: "Your brand's ideas in the right spotlights. Our guest posting services enable you to showcase your expertise, reach new audiences, and secure backlinks to your website. By contributing valuable insights, you establish yourself as a thought leader while reaping the benefits of enhanced SEO.",
    ctaLabel: "Start Building Authority",
    iconSrc: "/link-building/imgBusinessUserCurriculum.svg",
    iconWidth: 28,
    iconHeight: 33,
  },
  {
    title: "Link Exchanges",
    subtitle: "Fostering Mutually Beneficial Connections",
    body: "Strategic partnerships between complementary, non-competing websites that create genuine value on both sides. We identify and manage link exchange opportunities that broaden your reach, strengthen domain authority, and hold up long-term.",
    ctaLabel: "Grow Your Connections",
    iconSrc: "/link-building/imgUserFeedbackHeart.svg",
    iconWidth: 32,
    iconHeight: 32,
    iconClassName: "-scale-y-100 rotate-180",
  },
  {
    title: "Niche Edits",
    subtitle: "Strategically Enhancing Existing Content",
    body: "We secure contextual placements within already-indexed, high-performing content — putting your brand exactly where their target audience is already engaged. One of the most efficient ways to build authority without starting from scratch.",
    ctaLabel: "Elevate Your Rankings",
    iconSrc: "/link-building/imgGroup176769.svg",
    iconWidth: 34,
    iconHeight: 33,
  },
  {
    title: "Directory Submissions",
    subtitle: "Navigating the Online Directory Landscape",
    body: "Directory submissions involve submitting your website to online directories and listings. We ensure that submissions are made to reputable and relevant directories, enhancing your website's online visibility and authority. This tactic contributes to improved search rankings and local SEO efforts.",
    ctaLabel: "Improve Local Visibility",
    iconSrc: "/link-building/imgGroup176770.svg",
    iconWidth: 32,
    iconHeight: 30,
  },
  {
    title: "Multilingual Backlinks",
    subtitle: "Reach New Audiences Across Languages and Borders",
    body: "Expand your brand reach beyond borders with high-quality backlinks across US, 27+ EU countries, Asian, and other markets. We source niche-relevant placements in the right language, on the right platforms — so your website builds real authority in every market that matters to their growth.",
    ctaLabel: "Expand Internationally",
    iconSrc: "/link-building/imgGroup176793.svg",
    iconWidth: 32,
    iconHeight: 32,
  },
  {
    title: "Listicle Backlinks",
    subtitle: "Strategically Enhancing Existing Content",
    body: "We secure placements within high-traffic listicles and curated roundups — the kind of content readers actively seek out and share. These links drive referral traffic, build brand recognition, therefore directly impacting your AI performance while strengthening your website's authority in its niche.",
    ctaLabel: "Enhance Your AI presence",
    iconSrc: "/link-building/imgGroup176769.svg",
    iconWidth: 34,
    iconHeight: 33,
  },
];

const PROCESS_STEPS = buildProcessSteps([
  "Contact us to schedule a consultation and learn how our Link Building services can transform your online presence.",
  "During the initial call, we align on your goals, backlink profile status, and the outcomes you want from a focused link acquisition strategy.",
  "We gather your current SEO data, target pages, target geographies, and vertical priorities to build the right campaign structure.",
  "Budgets are scoped based on authority targets, campaign velocity, and the volume of placements required to reach your ranking goals.",
  "You receive clear strategic guidance, execution priorities, and a measurable roadmap for sustained off-page growth.",
]);

const COMPETITOR_INSIGHT_ITEMS: readonly CompetitorInsightItem[] = [
  {
    title: "Domain Rating Trend Over Time",
    defaultOpen: true,
    showChart: true,
    body: [
      "This chart visualizes the Domain Rating (DR) of yours and your competitor's websites over time, providing insight into how a domain's authority evolves based on its backlink profile.",
      "Domain Rating (DR) is a key metric that reflects the strength and quantity of a website's backlinks. A higher DR generally indicates better authority and visibility in search engines.",
      "Tracking these changes month-over-month helps identify trends in a website's SEO performance, such as growth from effective link-building campaigns or declines due to lost backlinks.",
      "Consistent increases in DR can suggest ongoing successful SEO efforts, while fluctuations may point to temporary issues or opportunities for improvement.",
      "Monitoring DR changes over time is crucial for assessing the long-term success of SEO strategies and adjusting link-building efforts to maintain or improve a site's authority.",
    ],
  },
  {
    title: "Link Velocity Changes Month-over-Month",
    body: [
      "Demo insight: this section compares how many referring domains you and your competitors gain or lose each month.",
      "Use this trend to spot campaign slowdowns early and rebalance outreach efforts before visibility drops.",
    ],
  },
  {
    title: "Competitive Organic Traffic Predictions for the Next Three Months",
    body: [
      "Demo insight: projected traffic trends show which competitors are likely to gain visibility based on current authority and keyword movement.",
      "This helps prioritize the pages and topics where faster link acquisition can close the gap.",
    ],
  },
  {
    title:
      "Your Website's Organic Traffic Predictions for the Next Three Months",
    body: [
      "Demo insight: this forecast estimates potential traffic growth from your current backlink profile and active campaigns.",
      "Use it to set realistic monthly SEO targets and align budget with expected outcomes.",
    ],
  },
] as const;

const FAQ_ITEMS = [
  {
    question: "What is off-page SEO?",
    answer:
      "Off-page SEO involves strategies taken outside your website to improve authority, trust, and visibility in search engines. It includes tactics like link building, digital PR, brand mentions, and partnerships that signal credibility to search engines.",
    defaultOpen: true,
  },
  {
    question: "How does off-page SEO contribute to search engine rankings?",
    answer:
      "Off-page SEO builds your website's authority and trustworthiness through external signals like backlinks, brand mentions, and social engagement. Search engines interpret these signals as endorsements of your content quality, which directly influences how high your pages rank for competitive keywords.",
    defaultOpen: false,
  },
  {
    question: "What is the importance of link building in off-page SEO?",
    answer:
      "Link building is the cornerstone of off-page SEO because backlinks remain one of the strongest ranking factors in search algorithms. High-quality links from authoritative, relevant websites pass trust and authority to your domain, helping your pages outrank competitors and sustain long-term organic visibility.",
    defaultOpen: false,
  },
  {
    question: "How does guest posting benefit my website?",
    answer:
      "Guest posting places your content on established industry publications, exposing your brand to new audiences while earning authoritative backlinks. This dual benefit drives referral traffic directly from the host site and strengthens your domain authority, which improves rankings across your entire website.",
    defaultOpen: false,
  },
  {
    question: "Are all types of backlinks beneficial for SEO?",
    answer:
      "Not all backlinks are created equal. Links from low-quality, spammy, or irrelevant websites can actually harm your rankings and may trigger search engine penalties. Effective link building focuses on earning contextual, editorially placed links from trusted domains within your industry or niche.",
    defaultOpen: false,
  },
  {
    question: "How do niche edits contribute to off-page SEO?",
    answer:
      "Niche edits involve placing your link within existing, already-indexed content on relevant websites, which means the link benefits from the page's established authority immediately. This approach provides a natural, contextual backlink that search engines value highly, often delivering faster ranking improvements than newly published content.",
    defaultOpen: false,
  },
] as const;

interface LinkBuildingPageProps {
  cmsFaqItems?: SanityFaqItem[];
}

export default function LinkBuildingPage({
  cmsFaqItems,
}: LinkBuildingPageProps) {
  const faqItems = cmsFaqItems?.length
    ? cmsFaqItems.map((f, i) => ({
        question: f.question,
        answer: f.answer,
        defaultOpen: i === 0,
      }))
    : FAQ_ITEMS;

  return (
    <>
      <section className="pt-[60px] lg:pt-[120px]" id="link-building-home">
        <div className={PAGE_SHELL_CLASS}>
          <h1 className="type-h1 mx-auto max-w-[294px] text-center text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] lg:max-w-[857px]">
            Link Building Services
          </h1>

          <p className="type-paragraph mx-auto mt-5 max-w-[220px] text-center text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] lg:max-w-[688px]">
            From Authority to Visibility. From Rankings to Revenue - One Link at
            a Time.
          </p>

          <div className="relative mt-[60px] overflow-hidden rounded-[30px] bg-[linear-gradient(73.9149deg,var(--color-hr-dark)_35.359%,var(--color-case-art-maudsch)_142.03%)] dark:opacity-90 lg:mt-[120px] lg:h-[684px] lg:rounded-[40px] lg:bg-[linear-gradient(52.4159deg,var(--color-hr-dark)_35.359%,var(--color-case-art-maudsch)_142.03%)]">
            <div className="relative z-10 flex flex-col items-center px-[15px] pb-[20px] pt-[60px] text-center text-[var(--color-hr-pure-white)] lg:h-full lg:items-start lg:px-[70px] lg:pt-[120px] lg:text-left">
              <div className="mx-auto w-full max-w-[298px] lg:mx-0 lg:max-w-[561px]">
                <SectionLabel className="text-[var(--color-hr-pure-white)]">
                  / Network /
                </SectionLabel>
                <h2 className="type-h2 mx-auto mt-5 w-full max-w-[254px] text-center tracking-[-1.04px] text-[var(--color-hr-pure-white)] lg:mx-0 lg:max-w-[561px] lg:text-left">
                  Strengthen Your Off-Page SEO for Long-Term Growth
                </h2>

                <p className="type-paragraph mx-auto mt-5 w-full max-w-[274px] text-center text-[var(--color-hr-pure-white)] lg:mx-0 lg:mt-[40px] lg:max-w-[484px] lg:text-left">
                  Link building is key to{" "}
                  <span className="font-bold">
                    improving your website&apos;s keyword rankings and AI
                    visibility
                  </span>{" "}
                  faster than any other SEO tactic. By securing high-quality
                  backlinks, you&apos;ll drive more organic traffic and increase
                  domain authority in the blink of an eye.
                </p>

                <AppLink
                  className="type-cta motion-interactive motion-interactive-press mt-5 inline-flex h-[45px] w-full items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[var(--color-hr-accent)] bg-transparent px-5 text-[var(--color-hr-pure-white)] hover:bg-[color-mix(in_srgb,var(--color-hr-pure-white)_8%,transparent)] lg:mt-4 lg:w-auto"
                  href="/contact"
                  motionPreset="none"
                >
                  Book Link Building Consultation
                  <GradientArrowUpRightIcon className="size-[10px]" />
                </AppLink>
              </div>
            </div>

            <div className="pointer-events-none relative h-[331px] w-full overflow-hidden lg:absolute lg:bottom-0 lg:left-0 lg:right-0 lg:top-0 lg:h-auto">
              <Image
                alt="Classical statue"
                className="absolute left-[3.41%] top-[-11.48%] h-[132.66%] w-[93.19%] max-w-none object-cover lg:left-[48.24%] lg:top-[-9.3%] lg:h-[122.57%] lg:w-[47.61%]"
                fetchPriority="high"
                height={2304}
                priority
                sizes="(min-width: 1024px) 48vw, 350px"
                src={HERO_STATUE_SRC}
                width={1858}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="pt-[10px] lg:pt-[10px]" id="link-building-solutions">
        <div className={PAGE_SHELL_CLASS}>
          <div className="rounded-[40px] bg-[var(--color-hr-off-white)] dark:bg-[var(--color-bg-dark)] px-5 pb-[70px] pt-[60px] lg:pt-[120px] sm:px-8 lg:px-[70px]">
            <SectionLabel>/ Solutions /</SectionLabel>
            <h2 className="type-h2 mt-5 max-w-[500px] tracking-[-1.04px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
              <GradientText className="gradient-text-brand-services">
                White Hat
              </GradientText>{" "}
              Link Building Services
            </h2>

            <div className="mt-[80px] grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {SERVICE_CARDS.map((card) => (
                <article
                  className="flex h-[588px] flex-col rounded-[40px] border border-[var(--color-hr-light-grey)] dark:border-[var(--color-border-inverse-10)] bg-[var(--color-hr-pure-white)] dark:bg-[var(--color-bg-dark)] px-[30px] pb-[30px] pt-[30px]"
                  key={card.title}
                >
                  <span className="inline-flex size-[50px] items-center justify-center rounded-[12px] border border-[var(--color-hr-light-grey)] dark:border-[var(--color-border-inverse-10)] bg-[var(--color-hr-pure-white)] dark:bg-[var(--color-bg-dark)]">
                    <Image
                      alt=""
                      aria-hidden
                      className={cn(
                        "block dark:brightness-0 dark:invert",
                        card.iconClassName,
                      )}
                      height={card.iconHeight}
                      src={card.iconSrc}
                      style={{
                        height: `${card.iconHeight}px`,
                        width: `${card.iconWidth}px`,
                      }}
                      width={card.iconWidth}
                    />
                  </span>

                  <h3 className="type-h3 mt-[15px] min-h-[64px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
                    {card.title}
                  </h3>
                  <p className="type-paragraph mt-[10px] min-h-[48px] gradient-text-brand gradient-text-brand-services">
                    {card.subtitle}
                  </p>
                  <p className="type-paragraph mt-[30px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
                    {card.body}
                  </p>

                  <AppLink
                    href="/contact"
                    className="type-cta mt-auto inline-flex h-[45px] w-fit min-w-[163px] items-center justify-center gap-2 self-start rounded-[var(--radius-button)] whitespace-nowrap border border-[var(--color-hr-accent)] bg-transparent px-5 text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] hover:bg-[var(--color-hr-off-white)] dark:hover:bg-[var(--color-surface-inverse-10)]"
                  >
                    {card.ctaLabel}
                    <GradientArrowUpRightIcon className="size-[10px]" />
                  </AppLink>
                </article>
              ))}
            </div>

            <section className="relative mt-[120px] h-[382px] overflow-hidden rounded-[40px] border border-[var(--color-hr-light-grey)] dark:border-[var(--color-border-inverse-10)] bg-[var(--color-hr-pure-white)] dark:bg-[var(--color-bg-dark)]">
              <Image
                alt=""
                aria-hidden
                className="pointer-events-none object-cover dark:hidden"
                fill
                sizes="1280px"
                src={CTA_BANNER_BG_SRC}
              />

              <div className="relative z-10 px-[30px] pb-[30px] pt-[51px]">
                <h3 className="type-h3 max-w-[884px] pb-[4px] leading-[1.3] tracking-[-0.64px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
                  The Fastest and{" "}
                  <GradientText className="gradient-text-brand-about-us-process-title">
                    Most Effective way to Get Started
                  </GradientText>
                </h3>

                <div className="mt-[20px] lg:mt-[30px]">
                  <ProcessStepSwitcher
                    activePillClassName="type-paragraph whitespace-nowrap rounded-[100px] bg-[var(--color-hr-dark)] px-[14px] py-[6px] text-[18px] leading-[24px] text-[var(--color-hr-pure-white)] dark:bg-[var(--color-text-inverse)] dark:text-[var(--color-text-fill-dark)]"
                    descriptionClassName="type-paragraph mt-[63px] max-w-[488px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]"
                    mutedPillClassName="type-paragraph whitespace-nowrap rounded-[100px] bg-[var(--color-hr-off-white)] dark:bg-[var(--color-surface-inverse-10)] px-[14px] py-[6px] text-[18px] leading-[24px] text-[var(--color-hr-grey)] dark:text-[var(--color-text-inverse-60)] transition-colors hover:text-[var(--color-hr-dark)] dark:hover:text-[var(--color-text-inverse)]"
                    rowClassName="flex flex-wrap items-center gap-[10px] pb-1 min-[1280px]:flex-nowrap"
                    steps={PROCESS_STEPS}
                  />
                </div>

                <AppLink
                  className="type-cta motion-interactive motion-interactive-press mt-[30px] inline-flex h-[45px] w-full items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[var(--color-hr-accent)] bg-transparent text-[var(--color-hr-dark)] hover:bg-[var(--color-hr-off-white)] dark:text-[var(--color-text-inverse)] dark:hover:bg-[var(--color-surface-inverse-10)] lg:mt-[40px] lg:w-[222px]"
                  href="/contact"
                  motionPreset="none"
                >
                  Book a Discovery Call
                  <GradientArrowUpRightIcon className="size-[10px]" />
                </AppLink>
              </div>
            </section>
          </div>
        </div>
      </section>

      <section
        className="pt-[60px] lg:pt-[120px]"
        id="link-building-competitor-insights"
      >
        <div className={PAGE_SHELL_CLASS}>
          <div className={CONTENT_SHELL_CLASS}>
            <SectionLabel>/ Competitor Insights /</SectionLabel>
            <h2 className="type-h2 mt-5 max-w-[542px] tracking-[-1.04px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
              Discover Opportunities{" "}
              <GradientText className="gradient-text-brand-services">
                For Growth
              </GradientText>
            </h2>

            <div className="mt-[80px] space-y-[10px]">
              {COMPETITOR_INSIGHT_ITEMS.map((item) => (
                <details
                  className="group relative overflow-hidden rounded-[40px] border border-[var(--color-hr-light-grey)] dark:border-[var(--color-border-inverse-10)] bg-[var(--color-hr-pure-white)] dark:bg-[var(--color-bg-dark)]"
                  key={item.title}
                  name="link-building-competitor-insights"
                  open={item.defaultOpen}
                >
                  <Image
                    alt=""
                    aria-hidden
                    className="pointer-events-none object-cover group-open:hidden dark:hidden"
                    fill
                    sizes="1280px"
                    src={COLLAPSED_ROW_BG_SRC}
                  />

                  <summary className="relative z-10 flex cursor-pointer list-none items-center justify-between gap-5 px-[30px] py-[30px] [&::-webkit-details-marker]:hidden">
                    <h3 className="type-h3 tracking-[-0.64px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
                      {item.title}
                    </h3>
                    <FaqPlusIcon className="size-[18px] shrink-0 transition-transform duration-200 group-open:-rotate-45 dark:text-[var(--color-text-inverse)]" />
                  </summary>

                  <div className="relative z-10 border-t border-[var(--color-hr-light-grey)] px-[30px] pb-[30px] pt-[30px] dark:border-[var(--color-border-inverse-10)]">
                    {item.showChart ? (
                      <div className="grid gap-[30px] xl:grid-cols-[520px_1fr] xl:items-start">
                        <Image
                          alt="Domain rating comparison chart"
                          className="h-auto w-full rounded-[20px]"
                          height={441}
                          sizes="(min-width: 1280px) 520px, 100vw"
                          src={COMPETITOR_IMAGE_SRC}
                          width={600}
                        />

                        <div className="type-paragraph space-y-5 text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
                          {item.body.map((paragraph) => (
                            <p key={paragraph}>{paragraph}</p>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="type-paragraph max-w-[1000px] space-y-5 text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
                        {item.body.map((paragraph) => (
                          <p key={paragraph}>{paragraph}</p>
                        ))}
                      </div>
                    )}
                  </div>
                </details>
              ))}
            </div>
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
        sectionId="link-building-why-heroic"
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
        sectionId="link-building-success-stories"
        stories={SUCCESS_STORIES}
      />

      <ServiceFaq
        answerClassName="px-[30px] pb-[30px] pr-[60px] sm:pr-[90px] lg:pr-[223px]"
        containerClassName="relative mt-[80px] overflow-hidden rounded-[40px] border border-[var(--color-hr-light-grey)] dark:border-[var(--color-border-inverse-10)] bg-[var(--color-hr-pure-white)] dark:bg-[var(--color-bg-dark)]"
        containerExtra={
          <Image
            alt=""
            aria-hidden
            className="pointer-events-none object-cover dark:hidden"
            fill
            sizes="1280px"
            src={FAQ_BG_SRC}
          />
        }
        detailsClassName="group relative z-10 border-[var(--color-hr-light-grey)] dark:border-[var(--color-border-inverse-10)] open:bg-[var(--color-hr-pure-white)] dark:bg-[var(--color-bg-dark)] dark:open:bg-[var(--color-bg-dark)]"
        detailsExtra={(index) =>
          index !== 0 ? (
            <Image
              alt=""
              aria-hidden
              className="pointer-events-none absolute left-[30px] top-0 h-px w-[calc(100%-60px)] dark:opacity-30"
              height={1}
              src={ROW_DIVIDER_SRC}
              width={1220}
            />
          ) : null
        }
        headingClassName="type-h3 tracking-[-0.64px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]"
        items={faqItems}
        renderIcon={
          <span className="inline-flex size-[18px] items-center justify-center">
            <FaqPlusIcon className="size-[18px] transition-transform duration-200 group-open:-rotate-45 dark:text-[var(--color-text-inverse)]" />
          </span>
        }
        sectionId="link-building-faq"
        summaryBorderClassName="dark:border-t dark:border-[var(--color-border-inverse-10)]"
        summaryClassName="flex cursor-pointer list-none items-center justify-between gap-5 px-[30px] py-[30px] [&::-webkit-details-marker]:hidden"
      />
    </>
  );
}
