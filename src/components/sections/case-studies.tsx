import Image from "next/image";

import { AppLink } from "@/components/ui/app-link";
import { Container } from "@/components/ui/container";
import { QuoteRotator } from "@/components/sections/quote-rotator";
import { ArrowUpRightIcon } from "@/components/ui/icons";
import { GradientArrowUpRightIcon } from "@/components/ui/icons/decorative";
import { SectionLabel } from "@/components/ui/section-label";
import { cn } from "@/lib/cn";
import type { CaseStudy, QuoteLine } from "@/types";

type CaseStudyEntry = CaseStudy & {
  mobileCardHeightClassName: string;
  mobileDate?: string;
};

const STUDIES: CaseStudyEntry[] = [
  {
    title: "My Baskets",
    headline: "My Baskets",
    summary:
      "My Baskets is a leading Canadian online retailer specializing in luxury gift baskets for various occasions.",
    date: "December 1, 2024",
    colorClassName: "bg-[var(--color-hr-my-baskets)]",
    href: "/case-study/my-baskets",
    mobileCardHeightClassName: "h-[435px]",
  },
  {
    title: "Nagish",
    headline: "Nagish",
    summary:
      "Nagish is a pioneering company dedicated to making communication more accessible for individuals with hearing impairments.",
    date: "December 24, 2024",
    colorClassName: "bg-[var(--color-hr-dark)]",
    href: "/case-study/nagish",
    mobileCardHeightClassName: "h-[477px]",
    mobileDate: "December 1, 2024",
  },
  {
    title: "Art by Maudsch",
    headline: "Art by Maudsch",
    summary:
      "Art by Maudsch is an online platform dedicated to selling unique, handmade artworks by contemporary artists.",
    date: "December 24, 2024",
    colorClassName: "bg-[var(--color-hr-art-maudsch)]",
    href: "/case-study/art-by-maudsch",
    mobileCardHeightClassName: "h-[456px]",
    mobileDate: "December 1, 2024",
  },
];

const QUOTES: QuoteLine[] = [
  {
    id: "affinda",
    lead: "“Affinda saw a ",
    accent: "156% increase",
    tail: " in organic traffic within 12 months.”",
  },
  {
    id: "my-baskets",
    lead: "“My Basket's e-commerce store ",
    accent: "doubled its sales",
    tail: " through our targeted SEO strategy”",
  },
  {
    id: "diy-crafts",
    lead: "“DIY Crafts eCom Brand became ",
    accent: "top seller on the market",
    tail: " in nine months”",
  },
  {
    id: "support-adventure",
    lead: "“SupportAdventure grew organic traffic by ",
    accent: "113% in 6 months",
    tail: " through targeted link building and content strategy.”",
  },
  {
    id: "warrior-willpower",
    lead: "“Warrior Willpower reached ",
    accent: "top 3 positions for 10+ high-intent keywords",
    tail: " within 2 months of launching their link-building campaign.”",
  },
  {
    id: "cirrus-insight",
    lead: "“Cirrus Insight increased ",
    accent: "qualified organic leads by 40%",
    tail: " after a full SEO strategy implementation and authority link-building push.”",
  },
  {
    id: "nursa",
    lead: "“Nursa expanded its search visibility across all targeted pages and ",
    accent: "grew organic sessions by 20%",
    tail: " within the first year.”",
  },
  {
    id: "infobip",
    lead: "“Infobip strengthened its ",
    accent: "core pages and their authority",
    tail: " through a targeted link building campaign.”",
  },
  {
    id: "frontbrick",
    lead: "“FrontBrick went from near-zero organic presence to ",
    accent: "qualified monthly visitors",
    tail: " in under 6 months.”",
  },
];

const PROVEN_RESULTS_PHOTO_SRC =
  "/figma/case-studies/proven-results-photo.webp";

export function CaseStudies() {
  return (
    <section className="section-shell pt-[60px] lg:pt-20" id="case-studies">
      <Container>
        <div className="mx-auto flex max-w-[350px] flex-col items-center gap-5 text-center lg:hidden" data-reveal>
          <SectionLabel>
            /{"  "}Proven Results{"  "}/
          </SectionLabel>
          <h2 className="type-h2 text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
            Benefit From a Proven{" "}
            <span className="gradient-text-brand gradient-text-brand-case">
              Data-Driven Approach
            </span>{" "}
            That Delivers Results
          </h2>
          <p className="type-paragraph text-[var(--color-hr-grey)] dark:text-[var(--color-text-inverse-50)]">
            With our dynamic approach, you&apos;ll experience unparalleled
            growth, dominate search rankings, and become a long term hero in
            your market. with our data driven approach, we find streams of
            organic revenue you didn&apos;t even know exist.
          </p>
          <AppLink
            className="type-cta motion-interactive motion-interactive-press inline-flex h-[45px] w-full max-w-[350px] items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[var(--color-hr-accent)] bg-transparent text-[var(--color-hr-dark)] hover:bg-[var(--color-hr-off-white)] dark:text-[var(--color-text-inverse)] dark:hover:bg-[var(--color-surface-inverse-10)]"
            href="/case-study"
            motionPreset="none"
          >
            See For Yourself
            <GradientArrowUpRightIcon className="size-[10px]" />
          </AppLink>
        </div>

        <div className="hidden gap-12 min-[1360px]:grid-cols-[577px_413px] min-[1360px]:items-end min-[1360px]:justify-between lg:grid" data-reveal>
          <div className="text-center min-[1360px]:text-left">
            <SectionLabel>
              /{"  "}Proven Results{"  "}/
            </SectionLabel>
            <h2 className="type-h2 mt-5 text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
              Benefit From a Proven{" "}
              <span className="gradient-text-brand gradient-text-brand-case">
                Data-Driven Approach
              </span>{" "}
              That Delivers Results
            </h2>
          </div>

          <div className="text-center min-[1360px]:text-left">
            <p className="type-paragraph text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
              With our dynamic approach, you&apos;ll experience unparalleled
              growth, dominate search rankings, and become a long term hero in
              your market. with our data driven approach, we find streams of
              organic revenue you didn&apos;t even know exist.
            </p>
            <AppLink
              className="type-cta motion-interactive motion-interactive-press mt-8 inline-flex h-[47px] w-fit min-w-max items-center justify-center gap-[10px] rounded-[16px] border border-[var(--color-hr-accent)] bg-transparent px-5 py-3 text-[var(--color-hr-dark)] hover:bg-[var(--color-hr-off-white)] dark:text-[var(--color-text-inverse)] dark:hover:bg-[var(--color-surface-inverse-10)]"
              href="/case-study"
              motionPreset="none"
            >
              See For Yourself
              <GradientArrowUpRightIcon className="size-[10px]" />
            </AppLink>
          </div>
        </div>
      </Container>

      <Container className="mt-[60px] lg:mt-20">
        <div className="flex flex-col gap-[10px] lg:hidden">
          {STUDIES.map((study) => (
            <AppLink
              aria-label={`Open case study: ${study.title}`}
              className={cn(
                "group relative mx-auto block w-full max-w-[350px] rounded-[30px] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-pure-white)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-hr-accent)] focus-visible:ring-offset-2 dark:border-[var(--color-border-inverse-10)] dark:bg-[var(--color-bg-dark)]",
                study.mobileCardHeightClassName,
              )}
              href={study.href}
              key={`mobile-${study.title}`}
            >
              <div
                className={cn(
                  "relative h-[250px] rounded-t-[30px]",
                  study.colorClassName,
                )}
              >
                <p className="type-h3 absolute left-0 right-0 top-1/2 -translate-y-1/2 text-center text-[var(--color-hr-pure-white)]">
                  {study.headline}
                </p>
                <span
                  aria-hidden
                  className="absolute right-5 top-[170px] inline-flex size-[60px] items-center justify-center rounded-full bg-[var(--color-hr-pure-white)] text-[var(--color-hr-dark)] transition-transform duration-300 ease-out group-hover:scale-105 group-focus-visible:scale-105 dark:bg-[var(--color-bg-dark)] dark:text-[var(--color-text-inverse)]"
                >
                  <ArrowUpRightIcon className="size-5" />
                </span>
              </div>
              <div className="mt-5 flex flex-col items-center gap-5 text-center">
                <div className="flex flex-col items-center gap-[10px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
                  <h3 className="type-team-title w-full">{study.title}</h3>
                  <p className="type-paragraph w-[266px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
                    {study.summary}
                  </p>
                </div>
                <p className="type-paragraph w-full pb-5 text-[var(--color-hr-grey)] dark:text-[var(--color-text-inverse-50)]">
                  {study.mobileDate ?? study.date}
                </p>
              </div>
            </AppLink>
          ))}
        </div>

        <div className="hidden gap-5 lg:grid lg:grid-cols-3" data-reveal-stagger>
          {STUDIES.map((study) => (
            <AppLink
              aria-label={`Open case study: ${study.title}`}
              className="group relative mx-auto block w-full max-w-[348px] rounded-[30px] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-pure-white)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-hr-accent)] focus-visible:ring-offset-2 dark:border-[var(--color-border-inverse-10)] dark:bg-[var(--color-bg-dark)] lg:h-[501px] lg:max-w-none lg:rounded-[var(--radius-card)]"
              href={study.href}
              key={`desktop-${study.title}`}
            >
              <div
                className={cn(
                  "relative h-[174px] rounded-t-[30px] lg:h-[305px] lg:rounded-t-[var(--radius-card)]",
                  study.colorClassName,
                )}
              >
                <p className="type-h3 absolute left-0 right-0 top-1/2 -translate-y-1/2 text-center text-[var(--color-hr-pure-white)]">
                  {study.headline}
                </p>
              </div>
              <h3 className="type-h4 mt-5 px-5 text-center text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] lg:text-left">
                {study.title}
              </h3>
              <p className="type-paragraph mt-2 px-5 text-center text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] lg:text-left">
                {study.summary}
              </p>
              <p className="type-paragraph mt-5 px-5 pb-5 text-center text-[var(--color-hr-grey)] dark:text-[var(--color-text-inverse-50)] lg:pb-0 lg:text-left">
                {study.date}
              </p>

              <span
                aria-hidden
                className="absolute right-4 top-[120px] inline-flex size-[62px] items-center justify-center rounded-full bg-[var(--color-hr-pure-white)] text-[var(--color-hr-dark)] transition-transform duration-300 ease-out group-hover:scale-105 group-focus-visible:scale-105 dark:bg-[var(--color-bg-dark)] dark:text-[var(--color-text-inverse)] lg:right-5 lg:top-[213px] lg:size-[72px]"
              >
                <ArrowUpRightIcon className="size-6 lg:size-7" />
              </span>
            </AppLink>
          ))}
        </div>
      </Container>

      <Container className="mt-[60px] lg:mt-[120px]">
        <QuoteRotator quotes={QUOTES} />
      </Container>

      <div className="hidden lg:block">
        <div className="mx-auto mt-[60px] max-w-[1440px] px-[15px] lg:mt-[120px] lg:px-[20px]">
          <div className="relative h-[240px] overflow-hidden rounded-[30px] bg-[linear-gradient(42.7625deg,var(--color-hr-dark)_35.359%,var(--color-hr-art-maudsch)_142.03%)] dark:opacity-90 lg:h-[480px] lg:rounded-[var(--radius-card)]">
            <Image
              alt=""
              aria-hidden
              className="pointer-events-none absolute left-[-3.19%] top-[-2.52%] h-[110.85%] w-[105.54%] max-w-none"
              height={1475}
              loading="lazy"
              quality={95}
              sizes="(min-width: 1440px) 1400px, calc(100vw - 40px)"
              src={PROVEN_RESULTS_PHOTO_SRC}
              width={4096}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
