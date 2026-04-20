"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/cn";

interface FaqItem {
  answer: string;
  question: string;
}

interface ArticleSection {
  body: string[];
  faqItems?: FaqItem[];
  heading: string;
  id: string;
  tocLabel: string;
}

const ARTICLE_SECTIONS: readonly ArticleSection[] = [
  {
    id: "define-buyer-persona",
    tocLabel: "Define Your Buyer Persona",
    heading: "Define Your Buyer Persona",
    body: [
      "Market research starts with knowing exactly who you are trying to reach. A buyer persona combines demographic details, motivations, buying triggers, and pain points so your team can evaluate opportunities through a real customer lens instead of assumptions.",
      "Use interviews, sales-call notes, support tickets, and search intent data to build your first draft. Then pressure-test each persona by mapping what they are trying to achieve, what holds them back, and what evidence they need before they trust a new provider.",
      "When personas are documented clearly, every following research step becomes easier, from selecting competitor benchmarks to deciding which channels deserve investment.",
    ],
  },
  {
    id: "market-competitor-analysis",
    tocLabel: "Conduct Market and Competitor Analysis",
    heading: "Conduct Market and Competitor Analysis",
    body: [
      "After defining your audience, evaluate the market landscape and identify where demand is growing. Look at market size, category trends, seasonality, and changes in customer behavior so you can separate short-term spikes from long-term opportunity.",
      "Competitor analysis should focus on positioning, pricing logic, product depth, content strategy, and distribution channels. Instead of copying what others do, use this data to identify gaps where customer needs are underserved or messaging is unclear.",
      "A strong analysis highlights where you can win with differentiated value and where you should avoid entering a crowded segment without a clear edge.",
    ],
  },
  {
    id: "primary-secondary-research",
    tocLabel: "Choose Between Primary and Secondary Research",
    heading: "Choose Between Primary and Secondary Research",
    body: [
      "Primary research gives you direct feedback through interviews, surveys, usability testing, and customer discovery sessions. It is ideal when you need decision-grade insight about perception, willingness to pay, or feature priorities.",
      "Secondary research uses existing sources such as industry reports, public filings, analyst briefings, and search data. It is faster and cost-efficient for establishing market context before running original studies.",
      "Most teams get the best results by combining both: use secondary research to frame hypotheses, then use primary research to validate or reject them quickly.",
    ],
  },
  {
    id: "analyze-interpret-data",
    tocLabel: "Analyze and Interpret Data",
    heading: "Analyze and Interpret Data",
    body: [
      "Collecting data is only half the process. The value comes from cleaning, grouping, and interpreting what it means for growth decisions. Segment your findings by audience type, buying stage, and channel so patterns are easier to trust.",
      "Pair quantitative metrics with qualitative feedback to avoid false confidence. A conversion drop may look like a pricing issue in dashboards, while interview feedback reveals that buyers are confused by positioning language.",
      "Always translate analysis into decisions: what to prioritize now, what to test next, and what to pause until stronger evidence appears.",
    ],
  },
  {
    id: "market-research-tools",
    tocLabel: "Use Market Research Tools and Automation",
    heading: "Use Market Research Tools and Automation",
    body: [
      "Modern research teams rely on tool stacks that combine SEO data, analytics, CRM signals, social listening, and competitor monitoring. The objective is not more dashboards, but faster insight delivery across product, marketing, and sales.",
      "Automation can collect recurring metrics, alert teams to market shifts, and surface anomalies before they become major risks. This reduces manual reporting time and keeps your strategy connected to real-world signals.",
      "Choose tools based on workflow fit, data quality, and integration depth so research becomes a repeatable system, not a one-time project.",
    ],
  },
  {
    id: "wrap-up",
    tocLabel: "Wrap Up",
    heading: "Wrap Up",
    body: [
      "Market research is most effective when treated as a continuous operating rhythm. Define the right audience, validate assumptions with evidence, and use structured analysis to guide what your team does next.",
      "With a clear research framework in place, you can enter new opportunities with confidence, reduce execution risk, and build strategies that compound over time.",
    ],
  },
  {
    id: "faq",
    tocLabel: "Frequently Asked Questions (FAQ)",
    heading: "Frequently Asked Questions (FAQ)",
    body: [],
    faqItems: [
      {
        question: "How often should a business run market research?",
        answer:
          "Most teams should run lightweight tracking monthly and deeper research quarterly so strategy decisions reflect current demand, competition, and buyer behavior.",
      },
      {
        question: "What is the difference between market research and customer research?",
        answer:
          "Market research evaluates the broader landscape, while customer research focuses on your target audience's needs, expectations, and buying behavior.",
      },
      {
        question: "Can small teams do meaningful market research without a big budget?",
        answer:
          "Yes. Start with focused interviews, search trend analysis, and competitor benchmarking, then expand methods once you identify the highest-value questions to answer.",
      },
      {
        question: "What makes research actionable instead of just informative?",
        answer:
          "Research is actionable when each insight maps to a decision, owner, and next experiment, rather than remaining as a general observation in a report.",
      },
    ],
  },
];

const ARTICLE_TITLE =
  "Market Research Made Simple: A Practical Guide to Exploring New Opportunities";
const BYLINE = "by Nebojsa Jankovic - in Marketing";
const STICKY_OFFSET_PX = 120;

interface TocItemProps {
  href: string;
  isActive: boolean;
  label: string;
  onClick: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

function TocItem({ href, isActive, label, onClick }: TocItemProps) {
  return (
    <a
      className={cn(
        "motion-interactive motion-interactive-press min-h-[44px] shrink-0 whitespace-nowrap rounded-[20px] px-[14px] py-[10px] text-left text-[14px] font-normal leading-[20px] tracking-[-0.28px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-hr-accent)] focus-visible:ring-offset-2 xl:w-full xl:whitespace-normal",
        isActive
          ? "bg-[var(--color-hr-dark)] text-[var(--color-hr-off-white)] dark:bg-[var(--color-text-inverse)] dark:text-[var(--color-text-fill-dark)]"
          : "bg-[var(--color-hr-off-white)] dark:bg-[var(--color-surface-inverse-10)] text-[var(--color-hr-grey)] dark:text-[var(--color-text-inverse-60)] hover:bg-[color-mix(in_srgb,var(--color-hr-off-white)_84%,var(--color-hr-light-grey)_16%)] dark:hover:bg-[var(--color-surface-inverse-10)]",
      )}
      href={href}
      onClick={onClick}
    >
      {label}
    </a>
  );
}

export function BlogPostDetailContent() {
  const [activeSectionId, setActiveSectionId] = useState(ARTICLE_SECTIONS[0]!.id);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const elements = Object.values(sectionRefs.current).filter(Boolean) as HTMLElement[];
    if (elements.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            setActiveSectionId(id);
            window.history.replaceState(null, "", `${window.location.pathname}#${id}`);
          }
        }
      },
      { threshold: 0.2, rootMargin: `-${STICKY_OFFSET_PX}px 0px -60% 0px` },
    );

    for (const element of elements) {
      observer.observe(element);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash && ARTICLE_SECTIONS.some((s) => s.id === hash)) {
      const element = sectionRefs.current[hash];
      if (element) {
        window.requestAnimationFrame(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
    }
  }, []);

  const handleTocClick = (event: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    event.preventDefault();
    const element = sectionRefs.current[sectionId];
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.pushState(null, "", `${window.location.pathname}#${sectionId}`);
    }
  };

  return (
    <section className="pb-[130px] pt-[109px]" id="insight-blog-post">
      <div className="mx-auto w-full max-w-[1440px] px-5 md:px-10 xl:px-[80px]">
        <header>
          <h1 className="w-full max-w-[1196px] text-[42px] font-normal leading-[52px] tracking-[-0.84px] sm:text-[52px] sm:leading-[66px] xl:text-[62px] xl:leading-[80px] xl:tracking-[-1.24px]">
            <span className="gradient-text-brand">{ARTICLE_TITLE}</span>
          </h1>

          <p className="mt-[35px] text-[18px] font-normal leading-[24px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">{BYLINE}</p>

          <div aria-hidden className="mt-[80px] h-px w-full bg-[var(--color-hr-light-grey)]" />
        </header>

        <div className="mt-[83px] grid grid-cols-1 gap-10 xl:grid-cols-[305px_minmax(0,954px)] xl:gap-[40px]">
          <aside className="w-full max-w-[305px] xl:sticky xl:top-[80px] xl:max-h-[calc(100vh-100px)] xl:overflow-y-auto">
            <nav
              aria-label="Table of contents"
              className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden xl:flex-col xl:gap-[2px] xl:overflow-visible xl:pb-0"
            >
              {ARTICLE_SECTIONS.map((section) => (
                <TocItem
                  href={`#${section.id}`}
                  isActive={activeSectionId === section.id}
                  key={section.id}
                  label={section.tocLabel}
                  onClick={(event) => handleTocClick(event, section.id)}
                />
              ))}
            </nav>
          </aside>

          <article className="w-full max-w-[954px]">
            <div className="h-auto w-full overflow-hidden rounded-[40px] xl:h-[957px] xl:w-[954px]">
              <Image
                alt="Market research notebook and analytics visuals"
                className="h-full w-full object-cover"
                fetchPriority="high"
                height={957}
                priority
                sizes="(min-width: 1280px) 954px, 100vw"
                src="/blog-post/imgImage40.png"
                width={954}
              />
            </div>

            {ARTICLE_SECTIONS.map((section, sectionIndex) => (
              <section
                className="scroll-mt-[140px] mt-[80px]"
                id={section.id}
                key={section.id}
                ref={(element) => {
                  sectionRefs.current[section.id] = element;
                }}
              >
                <h2 className="text-[38px] font-normal leading-[46px] tracking-[-0.76px] xl:text-[52px] xl:leading-[60px] xl:tracking-[-1.04px]">
                  <span className="gradient-text-brand">{section.heading}</span>
                </h2>

                {section.body.map((paragraph, paragraphIndex) => (
                  <p
                    className={cn(
                      "text-[18px] font-normal leading-[24px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]",
                      paragraphIndex === 0 ? "mt-5" : "mt-[18px]",
                    )}
                    key={`${section.id}-paragraph-${paragraphIndex + 1}`}
                  >
                    {paragraph}
                  </p>
                ))}

                {section.faqItems ? (
                  <div className="mt-5 space-y-6">
                    {section.faqItems.map((faqItem, faqItemIndex) => (
                      <div key={`${section.id}-faq-${faqItemIndex + 1}`}>
                        <p className="text-[18px] font-medium leading-[24px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">{faqItem.question}</p>
                        <p className="mt-2 text-[18px] font-normal leading-[24px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">{faqItem.answer}</p>
                      </div>
                    ))}
                  </div>
                ) : null}
              </section>
            ))}
          </article>
        </div>
      </div>
    </section>
  );
}
