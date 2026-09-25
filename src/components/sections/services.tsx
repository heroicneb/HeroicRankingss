"use client";

import { useEffect, useRef, useState } from "react";

import Image from "next/image";

import { AppLink } from "@/components/ui/app-link";
import { Container } from "@/components/ui/container";
import { ArrowUpRightIcon } from "@/components/ui/icons";
import { GradientArrowUpRightIcon } from "@/components/ui/icons/decorative";
import { SectionLabel } from "@/components/ui/section-label";
import { cn } from "@/lib/cn";
import type { ServiceCard } from "@/types";

const MOBILE_CARD_WIDTH = 350;
const MOBILE_CARD_GAP = 10;
const MOBILE_FRONT_IMAGE_SIZES = "(min-width: 1024px) 826px, 820px";

type ServiceCardEntry = ServiceCard & {
  backDescriptionLines?: readonly string[];
  mobileOnly?: boolean;
  mobileImageClassName?: string;
  mobileTitleClassName?: string;
};

export const SERVICES_HEADING_DESKTOP_LINES = [
  "Strategies for sustainable",
  "success and proven growth.",
] as const;

export const SERVICE_CARDS: ServiceCardEntry[] = [
  {
    title: "All SEO Services",
    frontImageSrc: "/figma/services/card-all-seo.webp",
    frontImageAlt: "Classical statue holding a sword",
    backDescription:
      "Comprehensive support to ensure every aspect of your SEO strategy is optimized for success and tailored to your business needs.",
    href: "/seo",
    mobileImageClassName: "h-[129.44%] w-[124.82%] left-[-17.1%] top-[5.33%]",
  },
  {
    title: "Link Building Services",
    frontImageSrc: "/figma/services/card-link-building.webp",
    frontImageAlt: "Classical statue near an engraved stone",
    backDescription:
      "Gain visibility on top-tier websites and connect with your target audience to increase your site's authority and improve rankings. Strengthen online presence with exceptional link building strategies and reporting.",
    href: "/seo/linkbuilding",
    mobileImageClassName: "h-[91.07%] w-[94.43%] left-[2.79%] top-[14.04%]",
  },
  {
    title: "On-Page SEO",
    frontImageSrc: "/figma/services/card-on-page.webp",
    frontImageAlt: "Classical statue near an engraved stone",
    backDescription:
      "Refine your website's content and architecture for enhanced search engine visibility and better search rankings.",
    href: "/seo/on-page",
    mobileImageClassName: "h-[92.07%] w-[207.56%] left-[-19.99%] top-[11.78%]",
  },
  {
    title: "Technical SEO Services",
    frontImageSrc: "/figma/services/card-technical-1.webp",
    frontImageAlt: "Classical statue profile with architectural sculpture",
    backDescription:
      "Optimize Your Infrastructure. Enhance User Experience. Boost Rankings.",
    backDescriptionLines: [
      "Optimize Your Infrastructure.",
      "Enhance User Experience.",
      "Boost Rankings.",
    ],
    href: "/seo/technical",
    mobileImageClassName: "h-[76.67%] w-[229.11%] left-[-47.25%] top-[23.33%]",
    mobileTitleClassName: "max-w-[144px]",
  },
  {
    title: "Local SEO Services",
    frontImageSrc: "/figma/services/card-technical-2.webp",
    frontImageAlt: "Classical statue holding a horn",
    backDescription:
      "Dominate Your Local Market. Connect with Nearby Customers. Increase Foot Traffic.",
    backDescriptionLines: [
      "Dominate Your Local Market.",
      "Connect with Nearby Customers.",
      "Increase Foot Traffic.",
    ],
    href: "/seo/local",
    mobileImageClassName:
      "h-[81.55%] w-[183.54%] left-[-30.43%] top-[18.29%] [transform:scaleX(-1)]",
    mobileTitleClassName: "max-w-[144px]",
  },
  {
    title: "E-Commerce SEO Services",
    frontImageSrc: "/figma/services/card-ecommerce.webp",
    frontImageAlt: "Classical sculpture close-up",
    backDescription: "Optimize Your Online Store. Drive Conversions and Sales.",
    backDescriptionLines: [
      "Optimize Your Online Store.",
      "Drive Conversions and Sales.",
    ],
    href: "/seo/e-commerce",
    mobileImageClassName: "h-[172.71%] w-[166.54%] left-[-38.87%] top-[-47.9%]",
    mobileTitleClassName: "max-w-[144px]",
  },
  {
    title: "Content Services",
    frontImageSrc: "/figma/services/card-content-1.webp",
    frontImageAlt: "Classical sculpture bust",
    backDescription:
      "Tell stories that matter. Connect with your audience. Turn engagement into conversions.",
    backDescriptionLines: [
      "Tell stories that matter.",
      "Connect with your audience.",
      "Turn engagement into conversions.",
    ],
    href: "/seo/content-creation",
    mobileImageClassName:
      "h-[165.32%] w-[125.27%] left-[-7.98%] top-[-42.29%] [transform:scaleX(-1)]",
  },
  {
    title: "Keyword Strategy Services",
    frontImageSrc: "/figma/services/card-content-2.webp",
    frontImageAlt: "Classical bust studying a stone fragment",
    backDescription:
      "Get the most out of your content. Target the Right Search. Find More Customers.",
    backDescriptionLines: [
      "Get the most out of your content.",
      "Target the Right Search.",
      "Find More Customers.",
    ],
    href: "/seo/keyword-research",
    mobileImageClassName: "h-[121.78%] w-[223.77%] left-[-14.04%] top-[-4.83%]",
    mobileTitleClassName: "max-w-[180px]",
  },
];

export function getServiceCardArticleClassName(
  card: ServiceCardEntry,
  isActive: boolean,
) {
  return cn(
    "service-card relative h-[450px] w-[350px] shrink-0 snap-start lg:h-[560px] lg:w-[413px]",
    isActive && "is-flipped",
    card.mobileOnly && "lg:hidden",
  );
}

/** Stores the pointer position on the card so the back-face spotlight can follow it. */
function trackSpotlight(event: React.PointerEvent<HTMLElement>) {
  const rect = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
  event.currentTarget.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
}

export function Services() {
  const [activeCardIndex, setActiveCardIndex] = useState<number | null>(null);
  const [mobileIndicatorIndex, setMobileIndicatorIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const rail = railRef.current;

    if (!section || !rail) {
      return;
    }

    const stickyOffsetPx = 110;
    const minViewportCoveragePx = 220;
    const minVerticalIntentRatio = 1.2;
    let rafId = 0;
    let pendingScrollLeft: number | null = null;
    let wheelInterceptionEnabled = false;

    const normalizeWheelDelta = (event: WheelEvent): number => {
      if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) {
        return event.deltaY * 16;
      }

      if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
        return event.deltaY * window.innerHeight;
      }

      return event.deltaY;
    };

    const onWheel = (event: WheelEvent) => {
      if (window.innerWidth < 1024) {
        return;
      }

      if (!wheelInterceptionEnabled) {
        return;
      }

      if (
        Math.abs(event.deltaY) <
        Math.abs(event.deltaX) * minVerticalIntentRatio
      ) {
        return;
      }

      const rect = section.getBoundingClientRect();
      const isServicesPinnedZone =
        rect.top <= stickyOffsetPx &&
        rect.bottom >=
          stickyOffsetPx +
            Math.min(window.innerHeight * 0.35, minViewportCoveragePx);

      if (!isServicesPinnedZone) {
        return;
      }

      const maxScrollLeft = rail.scrollWidth - rail.clientWidth;
      if (maxScrollLeft <= 0) {
        return;
      }

      const delta = normalizeWheelDelta(event);
      if (delta === 0) {
        return;
      }

      const currentScroll = pendingScrollLeft ?? rail.scrollLeft;
      const nextScrollLeft = Math.max(
        0,
        Math.min(maxScrollLeft, currentScroll + delta),
      );
      if (nextScrollLeft === currentScroll) {
        return;
      }

      pendingScrollLeft = nextScrollLeft;
      event.preventDefault();

      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (pendingScrollLeft !== null) {
          rail.scrollLeft = pendingScrollLeft;
          pendingScrollLeft = null;
        }
      });
    };

    const enableWheelInterception = () => {
      wheelInterceptionEnabled = true;
    };

    const disableWheelInterception = () => {
      wheelInterceptionEnabled = false;
    };

    const handleRailFocusOut = (event: FocusEvent) => {
      if (!rail.contains(event.relatedTarget as Node | null)) {
        disableWheelInterception();
      }
    };

    rail.addEventListener("mouseenter", enableWheelInterception);
    rail.addEventListener("mouseleave", disableWheelInterception);
    rail.addEventListener("focusin", enableWheelInterception);
    rail.addEventListener("focusout", handleRailFocusOut);
    section.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      rail.removeEventListener("mouseenter", enableWheelInterception);
      rail.removeEventListener("mouseleave", disableWheelInterception);
      rail.removeEventListener("focusin", enableWheelInterception);
      rail.removeEventListener("focusout", handleRailFocusOut);
      section.removeEventListener("wheel", onWheel);
      cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    const rail = railRef.current;

    if (!rail) {
      return;
    }

    const maxIndicatorIndex = SERVICE_CARDS.length - 1;
    const cardStep = MOBILE_CARD_WIDTH + MOBILE_CARD_GAP;

    const updateIndicator = () => {
      if (window.innerWidth >= 1024) {
        return;
      }

      const nextIndex = Math.round(rail.scrollLeft / cardStep);
      setMobileIndicatorIndex(
        Math.max(0, Math.min(maxIndicatorIndex, nextIndex)),
      );
    };

    updateIndicator();

    let resizeRafId = 0;
    const onResize = () => {
      cancelAnimationFrame(resizeRafId);
      resizeRafId = requestAnimationFrame(updateIndicator);
    };

    rail.addEventListener("scroll", updateIndicator, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      rail.removeEventListener("scroll", updateIndicator);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(resizeRafId);
    };
  }, []);

  return (
    <section
      className="section-shell pt-[60px] lg:pt-[110px]"
      id="services"
      ref={sectionRef}
    >
      <Container>
        <div className="mx-auto flex max-w-[350px] flex-col items-center text-center lg:mx-0 lg:max-w-none lg:items-start lg:text-left" data-reveal>
          <div className="flex w-[324px] flex-col items-center gap-5 lg:w-auto lg:items-start lg:gap-[25px]">
            <SectionLabel>/ Services /</SectionLabel>
            <h2
              aria-label="Strategies for sustainable success and proven growth."
              className="type-h2 max-w-[760px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]"
            >
              <span className="block">
                Strategies for{" "}
                <span className="gradient-text-brand gradient-text-brand-services">
                  sustainable
                </span>
              </span>
              <span className="block">
                <span className="gradient-text-brand gradient-text-brand-services">
                  success
                </span>{" "}
                and proven growth.
              </span>
            </h2>
          </div>
          <AppLink
            className="type-cta motion-interactive motion-interactive-press mt-10 inline-flex h-[45px] w-full max-w-[350px] items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[var(--color-hr-accent)] bg-transparent px-5 text-[var(--color-hr-dark)] hover:bg-[var(--color-hr-off-white)] dark:text-[var(--color-text-inverse)] dark:hover:bg-[var(--color-surface-inverse-10)] lg:mt-7 lg:w-auto lg:max-w-none"
            href="/contact"
            motionPreset="none"
          >
            Book a Strategy Call
            <GradientArrowUpRightIcon className="size-[10px]" />
          </AppLink>
        </div>
      </Container>

      <div
        className="services-scroll-rail mt-10 overflow-x-auto snap-x snap-mandatory pb-0 lg:mt-[69px] lg:snap-none lg:pb-5"
        id="services-rail-scroll"
        ref={railRef}
      >
        <div className="mx-auto flex w-max gap-[10px] px-[20px] lg:gap-5 lg:px-[var(--space-page-x)]" data-reveal-stagger>
          {SERVICE_CARDS.map((card, index) => (
            <article
              className={getServiceCardArticleClassName(
                card,
                activeCardIndex === index,
              )}
              key={`${card.title}-${index}`}
              onBlur={(event) => {
                const nextFocusedElement = event.relatedTarget as Node | null;
                if (!event.currentTarget.contains(nextFocusedElement)) {
                  setActiveCardIndex((current) =>
                    current === index ? null : current,
                  );
                }
              }}
              onFocus={() => setActiveCardIndex(index)}
              onMouseEnter={() => setActiveCardIndex(index)}
              onPointerMove={trackSpotlight}
              onMouseLeave={() =>
                setActiveCardIndex((current) =>
                  current === index ? null : current,
                )
              }
            >
              <div className="service-card-inner h-full rounded-[var(--radius-card)]">
                <div className="service-card-face service-card-front surface-radial relative h-full overflow-hidden p-[20px] text-[var(--color-hr-pure-white)] lg:p-[30px]">
                  <Image
                    alt={card.frontImageAlt}
                    className={cn(
                      "absolute max-w-none pointer-events-none",
                      card.mobileImageClassName ??
                        "inset-0 h-full w-full object-cover",
                    )}
                    height={1120}
                    quality={95}
                    sizes={MOBILE_FRONT_IMAGE_SIZES}
                    src={card.frontImageSrc}
                    width={903}
                  />
                  <div className="service-card-front-overlay absolute inset-0" />
                  <h3
                    className={cn(
                      "type-h3 relative z-10 mt-10 max-w-[295px] lg:mt-[30px]",
                      card.mobileTitleClassName,
                    )}
                  >
                    {card.title}
                  </h3>

                  {card.href ? (
                    <AppLink
                      aria-label={`${card.title} — learn more`}
                      className="motion-interactive motion-interactive-press absolute bottom-[20px] right-[20px] z-20 inline-flex size-[60px] items-center justify-center rounded-full bg-[var(--color-hr-pure-white)] text-[var(--color-hr-dark)] transition-transform duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-hr-accent)] dark:bg-[var(--color-bg-dark)] dark:text-[var(--color-text-inverse)] lg:size-[72px]"
                      href={card.href}
                    >
                      <ArrowUpRightIcon className="size-5 lg:size-7" />
                    </AppLink>
                  ) : (
                    <button
                      aria-expanded={activeCardIndex === index}
                      aria-label={`${card.title} details`}
                      className="motion-interactive motion-interactive-press absolute bottom-[20px] right-[20px] z-20 inline-flex size-[60px] items-center justify-center rounded-full bg-[var(--color-hr-pure-white)] text-[var(--color-hr-dark)] transition-transform duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-hr-accent)] dark:bg-[var(--color-bg-dark)] dark:text-[var(--color-text-inverse)] lg:size-[72px]"
                      onClick={() =>
                        setActiveCardIndex((current) =>
                          current === index ? null : index,
                        )
                      }
                      type="button"
                    >
                      <ArrowUpRightIcon className="size-5 lg:size-7" />
                    </button>
                  )}
                </div>

                <div className="service-card-face service-card-back surface-radial relative h-full overflow-hidden p-[20px] text-[var(--color-hr-pure-white)] lg:p-[30px]">
                  <Image
                    alt=""
                    aria-hidden
                    className={cn(
                      "service-card-back-image absolute max-w-none pointer-events-none",
                      card.mobileImageClassName ??
                        "inset-0 h-full w-full object-cover",
                    )}
                    height={1120}
                    loading="lazy"
                    quality={80}
                    sizes={MOBILE_FRONT_IMAGE_SIZES}
                    src={card.backImageSrc ?? card.frontImageSrc}
                    width={903}
                  />
                  <div className="service-card-back-overlay absolute inset-0" />
                  <p className="type-paragraph relative z-10 mt-[20px] max-w-[296px] text-[var(--color-hr-pure-white)] lg:mt-[30px]">
                    {card.backDescriptionLines
                      ? card.backDescriptionLines.map((line) => (
                          <span className="block" key={`${card.title}-${line}`}>
                            {line}
                          </span>
                        ))
                      : card.backDescription}
                  </p>

                  {card.href ? (
                    <AppLink
                      aria-label={`${card.title} — learn more`}
                      className="motion-interactive motion-interactive-press absolute bottom-[20px] right-[20px] z-20 inline-flex size-[60px] items-center justify-center rounded-full bg-[var(--color-hr-pure-white)] text-[var(--color-hr-dark)] transition-transform duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-hr-accent)] dark:bg-[var(--color-bg-dark)] dark:text-[var(--color-text-inverse)] lg:size-[72px]"
                      href={card.href}
                    >
                      <ArrowUpRightIcon className="size-5 lg:size-7" />
                    </AppLink>
                  ) : (
                    <button
                      aria-expanded={activeCardIndex === index}
                      aria-label={`${card.title} details`}
                      className="motion-interactive motion-interactive-press absolute bottom-[20px] right-[20px] z-20 inline-flex size-[60px] items-center justify-center rounded-full bg-[var(--color-hr-pure-white)] text-[var(--color-hr-dark)] transition-transform duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-hr-accent)] dark:bg-[var(--color-bg-dark)] dark:text-[var(--color-text-inverse)] lg:size-[72px]"
                      onClick={() =>
                        setActiveCardIndex((current) =>
                          current === index ? null : index,
                        )
                      }
                      type="button"
                    >
                      <ArrowUpRightIcon className="size-5 lg:size-7" />
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-10 flex justify-center lg:hidden">
        <div
          aria-label="Services carousel position"
          className="flex items-center"
          role="status"
        >
          {SERVICE_CARDS.map((card, index) => (
            <button
              aria-label={`Show service card ${index + 1}`}
              className="relative flex items-center justify-center p-[19px]"
              key={`services-indicator-${card.title}-${index}`}
              onClick={() => {
                railRef.current?.scrollTo({
                  left: index * (MOBILE_CARD_WIDTH + MOBILE_CARD_GAP),
                  behavior: "smooth",
                });
              }}
              type="button"
            >
              <span
                className={`block size-[6px] rounded-full transition-colors duration-200 ${
                  mobileIndicatorIndex === index
                    ? "bg-[var(--color-hr-dark)] dark:bg-[var(--color-text-inverse)]"
                    : "bg-[var(--color-hr-light-grey)] dark:bg-[var(--color-border-inverse-10)]"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
