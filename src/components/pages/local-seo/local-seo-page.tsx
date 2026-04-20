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
import { buildProcessSteps } from "@/data/process-steps";
import { PAGE_SHELL_CLASS, CONTENT_SHELL_CLASS } from "@/data/service-shared";
import { SUCCESS_STORIES } from "@/data/success-stories";
import { WHY_CHOOSE_ITEMS } from "@/data/why-choose-items";
import { createPageMetadata } from "@/lib/metadata";
import type { SanityFaqItem } from "@/lib/sanity-data";

export const metadata: Metadata = createPageMetadata({
  title: "Local SEO Services",
  description:
    "Dominate your local market, connect with nearby customers, and increase foot traffic with Heroic Rankings local SEO services.",
  path: "/local-seo",
});

const HERO_IMAGE_SRC =
  "/local-seo/444c439c82562b3e638551ad9bbf9a63668dc05c.webp";

const SERVICE_CARDS = [
  {
    title: "GBP Setup and Optimization",
    subtitle: "An Interactive Gateway to Local Audiences",
    body: "Optimizing your Google Business Profile is fundamental to local SEO success. Our specialists set up and optimize your GBP with accurate business information, high-quality images, and engaging descriptions. This not only enhances your online visibility but also ensures you appear in the coveted local 3-pack, where potential customers can access essential details.",
    ctaLabel: "Enhance Your GBP",
    iconSrc: "/local-seo/63bf4e83c7644358b0713483beb011b03557c293.svg",
    iconWidth: 26,
    iconHeight: 33,
  },
  {
    title: "Local Citation Building",
    subtitle: "Weaving a Web of Local Recognition",
    body: "Citations are online references to your business's name, address, and phone number (NAP). We create consistent and accurate citations across reputable online directories, enhancing your business's local authority and visibility. Our approach involves manual submissions and careful verification, ensuring that your business information is accurate and up-to-date.",
    ctaLabel: "Build Local Citations",
    iconSrc: "/local-seo/9b4c2813561b11a37af0ab074c2048d74d8df24a.svg",
    iconWidth: 30,
    iconHeight: 30,
  },
  {
    title: "Location-Specific Targeting",
    subtitle: "Reaching the Right Audience at the Right Time",
    body: "We optimize your content with location-specific keywords that help your business appear in local search results. This targeted approach increases the chances of your business being visible when people search for services in your area.",
    ctaLabel: "Target Local Keywords",
    iconSrc: "/local-seo/8520459909172d416cf9fd403d2a8a815ccacb43.svg",
    iconWidth: 33,
    iconHeight: 33,
  },
  {
    title: "Online Reputation Management",
    subtitle: "Cultivating Trust and Credibility",
    body: "Online reviews significantly influence local consumer decisions. Our reputation management services involve encouraging satisfied customers to leave positive reviews while addressing negative feedback constructively. By fostering a positive online reputation, you enhance customer trust.",
    ctaLabel: "Manage Your Online Reputation",
    iconSrc: "/local-seo/c2da8b6b30b6bf2d6e138d764a86c6b8c216bf7e.svg",
    iconWidth: 33,
    iconHeight: 33,
  },
  {
    title: "NAP Consistency",
    subtitle: "Building the Pillars of Trust",
    body: "Name, Address, and Phone Number (NAP) consistency across online platforms is critical for local SEO. We ensure that your NAP information is consistent across your website, Google My Business, citations, and other online profiles. This consistency builds trust with search engines and customers, positively impacting your local rankings.",
    ctaLabel: "Ensure NAP Consistency",
    iconSrc: "/local-seo/2797e41a72e2fdb5e63d95aad041869ec8d51af4.svg",
    iconWidth: 30,
    iconHeight: 30,
  },
  {
    title: "Mobile Traffic and Footfall",
    subtitle: "Driving Mobile Users to Your Business",
    body: "Many local searches are performed on mobile devices by individuals on the move. Local SEO ensures your business is visible when potential customers are searching for nearby solutions, driving foot traffic and local sales.",
    ctaLabel: "Increase Mobile Visibility",
    iconSrc: "/local-seo/6b5aa41683abb71c497c888cbc9a20034bd072e9.svg",
    iconWidth: 33,
    iconHeight: 32,
  },
] as const;

const PROCESS_STEPS = buildProcessSteps([
  "Contact us to schedule a consultation and learn how our local SEO services can make your business dominate the local market.",
  "Our first call uncovers your current local visibility, service areas, and competitive gaps so we can target the right opportunities from day one.",
  "We collect your GBP data, citation footprint, review profile, and location pages to build a complete local SEO roadmap tailored to your market.",
  "We align budget with the highest-impact local priorities, from citations and optimization work to review growth and location-specific content updates.",
  "You get a clear action plan with timelines, ownership, and measurable local SEO milestones designed to increase qualified traffic and footfall.",
]);

const FAQ_ITEMS = [
  {
    question: "What is local SEO?",
    answer:
      "Local SEO is a strategy focused on optimizing your online presence to attract customers in a specific geographic area. It involves techniques that target local search engine results and enhance your visibility to nearby potential customers.",
    defaultOpen: true,
  },
  {
    question: "How does local SEO differ from traditional SEO?",
    answer:
      "While traditional SEO focuses on improving visibility on a national or global scale, local SEO targets customers in a specific geographic area. Local SEO emphasizes Google Business Profile optimization, local citations, map pack rankings, and location-specific keywords to drive foot traffic and calls from nearby searchers.",
    defaultOpen: false,
  },
  {
    question: "Why are local citations important?",
    answer:
      "Local citations, which are mentions of your business name, address, and phone number across online directories, help search engines verify your business's legitimacy and location. Consistent, accurate citations across reputable platforms strengthen your local authority and improve your chances of appearing in the local 3-pack.",
    defaultOpen: false,
  },
  {
    question: "How does location-specific keyword targeting work?",
    answer:
      'Location-specific keyword targeting involves optimizing your content for search terms that include geographic modifiers, such as city names, neighborhoods, or "near me" phrases. By embedding these keywords into your pages, meta tags, and Google Business Profile, your business becomes more visible to people searching for services in your area.',
    defaultOpen: false,
  },
  {
    question: "What role do online reviews play in local SEO?",
    answer:
      "Online reviews are a major local ranking factor and directly influence consumer trust. Businesses with a higher volume of positive reviews rank better in local search results and attract more clicks. Actively managing your review profile by encouraging satisfied customers and responding to feedback signals credibility to both search engines and potential clients.",
    defaultOpen: false,
  },
] as const;

interface LocalSeoPageProps {
  cmsFaqItems?: SanityFaqItem[];
}

export default function LocalSeoPage({ cmsFaqItems }: LocalSeoPageProps) {
  const faqItems = cmsFaqItems?.length
    ? cmsFaqItems.map((f, i) => ({
        question: f.question,
        answer: f.answer,
        defaultOpen: i === 0,
      }))
    : FAQ_ITEMS;

  return (
    <>
      <section className="pt-[60px] lg:pt-[100px]" id="local-seo-home">
        <div className={PAGE_SHELL_CLASS}>
          <h1 className="type-h1 mx-auto max-w-[294px] text-center text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] lg:max-w-[857px]">
            Local SEO Services
          </h1>

          <p className="type-paragraph mx-auto mt-5 max-w-[246px] text-center text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] lg:max-w-[688px]">
            Dominate Your{" "}
            <GradientText className="gradient-text-brand-about-us-hero-title">
              Local Market.
            </GradientText>
            <br />
            Connect with Nearby Customers.{" "}
            <GradientText className="gradient-text-brand-about-us-hero-title">
              Increase Foot Traffic.
            </GradientText>
          </p>

          <div className="relative mt-[60px] overflow-hidden rounded-[30px] bg-[linear-gradient(73.9149deg,var(--color-hr-dark)_35.359%,var(--color-case-art-maudsch)_142.03%)] dark:opacity-90 lg:mt-[120px] lg:h-[684px] lg:rounded-[40px] lg:bg-[linear-gradient(52.4159deg,var(--color-hr-dark)_35.359%,var(--color-case-art-maudsch)_142.03%)]">
            <div className="relative z-10 flex flex-col items-center px-[15px] pb-[20px] pt-[60px] text-center text-[var(--color-hr-pure-white)] lg:h-full lg:items-start lg:px-[70px] lg:pt-[120px] lg:text-left">
              <div className="w-full max-w-[298px] lg:max-w-[561px]">
                <SectionLabel className="text-[var(--color-hr-pure-white)]">
                  / Connection /
                </SectionLabel>

                <h2 className="type-h2 mt-5 max-w-[298px] text-[var(--color-hr-pure-white)] lg:max-w-[561px]">
                  Connecting Your Business to Local Customers
                </h2>

                <p className="type-paragraph mt-5 max-w-[294px] text-[var(--color-hr-pure-white)] lg:mt-10 lg:max-w-[485px]">
                  Increase your business&apos;s online visibility by focusing on
                  target locations with tailored local SEO strategies, driving
                  traffic and attracting customers in the areas that matter most
                  to your growth.
                </p>

                <AppLink
                  className="type-cta motion-interactive motion-interactive-press mt-5 inline-flex h-[45px] w-full items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[var(--color-hr-accent)] bg-transparent px-5 text-[var(--color-hr-pure-white)] hover:bg-[color-mix(in_srgb,var(--color-hr-pure-white)_8%,transparent)] focus-visible:ring-offset-[var(--color-hr-dark)] lg:mt-10 lg:w-auto"
                  href="/contact"
                  motionPreset="none"
                >
                  Get your Local SEO Audit
                  <GradientArrowUpRightIcon className="size-4" />
                </AppLink>
              </div>
            </div>

            <div className="pointer-events-none relative h-[331px] w-full overflow-hidden lg:absolute lg:bottom-0 lg:left-0 lg:right-0 lg:top-0 lg:h-auto">
              <div className="h-full [transform:scaleX(-1)] lg:[transform:none]">
                <Image
                  alt="Classical statue holding a megaphone"
                  className="absolute left-[-37.86%] top-[-3.93%] h-[103.93%] w-[158.46%] max-w-none object-cover lg:left-auto lg:right-[-25%] lg:top-[0.75%] lg:bottom-auto lg:h-[116%] lg:w-auto lg:[transform:scaleX(-1)]"
                  fetchPriority="high"
                  height={2340}
                  priority
                  sizes="(min-width: 1024px) 60vw, 350px"
                  src={HERO_IMAGE_SRC}
                  width={4096}
                />
              </div>
            </div>

            <div className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(90deg,color-mix(in_srgb,var(--color-hr-dark)_92%,transparent)_0%,color-mix(in_srgb,var(--color-hr-dark)_75%,transparent)_34%,color-mix(in_srgb,var(--color-hr-dark)_24%,transparent)_56%,transparent_74%)] dark:opacity-90 lg:block" />
          </div>
        </div>
      </section>

      <section className="pt-[10px]" id="local-seo-services">
        <div className={PAGE_SHELL_CLASS}>
          <div className="rounded-[40px] bg-[var(--color-hr-off-white)] dark:bg-[var(--color-bg-dark)] px-5 pb-[70px] pt-[60px] lg:pt-[120px] sm:px-8 lg:px-[70px]">
            <SectionLabel>/ Solutions /</SectionLabel>

            <h2 className="type-h2 mt-5 max-w-[510px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
              Heroic{" "}
              <GradientText className="gradient-text-brand-services">
                Local SEO
              </GradientText>{" "}
              Services
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
                    className="type-cta mt-auto inline-flex h-[45px] min-w-[163px] items-center justify-center gap-2 self-start whitespace-nowrap rounded-[var(--radius-button)] border border-[var(--color-hr-accent)] bg-transparent px-5 text-[var(--color-hr-dark)] hover:bg-[var(--color-hr-off-white)] dark:text-[var(--color-text-inverse)] dark:hover:bg-[var(--color-surface-inverse-10)]"
                  >
                    {card.ctaLabel}
                    <GradientArrowUpRightIcon className="size-[10px]" />
                  </AppLink>
                </article>
              ))}
            </div>

            <section className="mt-[60px] rounded-[30px] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-pure-white)] px-[20px] py-[30px] dark:border-[var(--color-border-inverse-10)] dark:bg-[var(--color-bg-dark)] lg:mt-[120px] lg:rounded-[40px] lg:px-[30px] lg:pb-[30px] lg:pt-[30px]">
              <h3 className="type-h3 max-w-[1024px] pb-[4px] text-center leading-[1.3] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] lg:text-left">
                Ready to start optimizing your{" "}
                <GradientText className="gradient-text-brand-about-us-process-title">
                  local presence
                </GradientText>{" "}
                and driving{" "}
                <GradientText className="gradient-text-brand-about-us-process-title">
                  more foot traffic
                </GradientText>
                ? The Fastest and{" "}
                <GradientText className="gradient-text-brand-about-us-process-title">
                  Most Effective to Get Started!
                </GradientText>
              </h3>

              <div className="mt-[20px] lg:mt-[30px]">
                <ProcessStepSwitcher
                  descriptionClassName="type-paragraph mt-10 max-w-[600px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]"
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
        sectionId="local-seo-why-heroic"
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
        sectionId="local-seo-success-stories"
        stories={SUCCESS_STORIES}
      />

      <ServiceFaq
        items={faqItems}
        renderIcon={
          <span className="inline-flex size-[25px] items-center justify-center">
            <FaqPlusIcon className="size-[18px] transition-transform duration-200 group-open:-rotate-45 dark:text-[var(--color-text-inverse)]" />
          </span>
        }
        sectionId="local-seo-faq"
      />
    </>
  );
}
