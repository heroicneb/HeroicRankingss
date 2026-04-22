"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";

import Image from "next/image";

import { AppLink } from "@/components/ui/app-link";
import { DiagonalArrowIcon } from "@/components/ui/icons/decorative";
import { cn } from "@/lib/cn";

const MOBILE_CARD_WIDTH = 350;
const MOBILE_CARD_GAP = 10;

type MobileServiceCard = {
  title: string;
  imageSrc: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
  mobileImageRenderWidth: number;
  imageClassName: string;
  imageStyle?: CSSProperties;
  titleClassName?: string;
  backIntro: string;
  backPoints: readonly string[];
  backIntroWidthClass?: string;
  backPointsWidthClass?: string;
  href?: string;
};

const MOBILE_SERVICE_CARDS: readonly MobileServiceCard[] = [
  {
    title: "All SEO Services",
    imageSrc: "/figma/services/card-all-seo.webp",
    imageAlt: "Classical statue holding a sword",
    imageWidth: 3072,
    imageHeight: 4096,
    mobileImageRenderWidth: 438,
    imageClassName: "h-[129.44%] w-[124.82%] left-[-17.1%] top-[5.33%]",
    backIntro:
      "Make your website more visible in search engines and LLMs with our on-page optimization services, designed to boost your rankings, enhance user experience, and drive conversions. We focus on:",
    backPoints: [
      "Content Optimization",
      "Meta Tags Optimization",
      "URL Structure",
      "Header Tag Optimization",
      "Internal Linking Optimization",
    ],
    backIntroWidthClass: "max-w-[305px]",
    backPointsWidthClass: "max-w-[248px]",
    href: "/seo-services",
  },
  {
    title: "Link Building Services",
    imageSrc: "/figma/services/card-link-building.webp",
    imageAlt: "Classical statue holding chain links",
    imageWidth: 1858,
    imageHeight: 2304,
    mobileImageRenderWidth: 331,
    imageClassName: "h-[91.07%] w-[94.43%] left-[2.79%] top-[14.04%]",
    backIntro:
      "Leverage quality backlinks and build online authority to improve visibility and trustworthiness. Our off-page strategies include:",
    backPoints: ["White Hat Link Building", "Niche edits", "Guest posting", "Listicle posting (boosts LLM performance)"],
    backIntroWidthClass: "max-w-[305px]",
    backPointsWidthClass: "max-w-[237px]",
    href: "/link-building",
  },
  {
    title: "On-Page SEO",
    imageSrc: "/figma/services/card-on-page.webp",
    imageAlt: "Classical statue beside a carved slab",
    imageWidth: 2048,
    imageHeight: 1168,
    mobileImageRenderWidth: 726,
    imageClassName: "h-[92.07%] w-[207.56%] left-[-19.99%] top-[11.78%]",
    backIntro:
      "Make your website more visible in search engines and LLMs with our on-page optimization services, designed to boost your rankings, enhance user experience, and drive conversions. We focus on:",
    backPoints: [
      "Content Optimization",
      "Meta Tags Optimization",
      "URL Structure",
      "Header Tag Optimization",
      "Internal Linking Optimization",
    ],
    backIntroWidthClass: "max-w-[305px]",
    backPointsWidthClass: "max-w-[248px]",
    href: "/on-page-seo",
  },
  {
    title: "Technical SEO Services",
    imageSrc: "/figma/services/card-technical-1.webp",
    imageAlt: "Classical statue using a megaphone",
    imageWidth: 2924,
    imageHeight: 1258,
    mobileImageRenderWidth: 802,
    imageClassName: "h-[76.67%] w-[229.11%] left-[-47.25%] top-[23.33%]",
    titleClassName: "max-w-[144px]",
    backIntro:
      "Ensure peak performance, mobile-friendliness, and superior speed. Our technical SEO services cover:",
    backPoints: ["Site Audits", "Mobile Optimization", "Speed Optimization", "Structured Data Markup"],
    backIntroWidthClass: "max-w-[245px]",
    backPointsWidthClass: "max-w-[237px]",
    href: "/technical-seo",
  },
  {
    title: "Technical SEO Services",
    imageSrc: "/figma/services/card-technical-2.webp",
    imageAlt: "Classical architectural temple",
    imageWidth: 4096,
    imageHeight: 2340,
    mobileImageRenderWidth: 643,
    imageClassName: "h-[81.55%] w-[183.54%] left-[-30.43%] top-[18.29%]",
    imageStyle: { transform: "scaleX(-1)" },
    titleClassName: "max-w-[144px]",
    backIntro:
      "Ensure peak performance, mobile-friendliness, and superior speed. Our technical SEO services cover:",
    backPoints: ["Site Audits", "Mobile Optimization", "Speed Optimization", "Structured Data Markup"],
    backIntroWidthClass: "max-w-[245px]",
    backPointsWidthClass: "max-w-[237px]",
    href: "/technical-seo",
  },
  {
    title: "E-Commerce SEO Services",
    imageSrc: "/figma/services/card-ecommerce.webp",
    imageAlt: "Basket with apples",
    imageWidth: 3072,
    imageHeight: 4096,
    mobileImageRenderWidth: 583,
    imageClassName: "h-[172.71%] w-[166.54%] left-[-38.87%] top-[-47.9%]",
    titleClassName: "max-w-[144px]",
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
    imageSrc: "/figma/services/card-content-1.webp",
    imageAlt: "Classical statue writing with a quill",
    imageWidth: 2414,
    imageHeight: 4096,
    mobileImageRenderWidth: 439,
    imageClassName: "h-[165.32%] w-[125.27%] left-[-7.98%] top-[-42.29%]",
    backIntro: "Align your brand's voice with audience needs for organic growth. Our content services include:",
    backPoints: ["Content Strategy", "Content Creation", "Content Optimization", "Content calendar"],
    backIntroWidthClass: "max-w-[245px]",
    backPointsWidthClass: "max-w-[237px]",
    href: "/content-creation",
  },
  {
    title: "Content Services",
    imageSrc: "/figma/services/card-content-2.webp",
    imageAlt: "Classical scholar reading and writing",
    imageWidth: 4096,
    imageHeight: 2866,
    mobileImageRenderWidth: 784,
    imageClassName: "h-[121.78%] w-[223.77%] left-[-14.04%] top-[-4.83%]",
    backIntro: "Align your brand's voice with audience needs for organic growth. Our content services include:",
    backPoints: ["Content Strategy", "Content Creation", "Content Optimization", "Content calendar"],
    backIntroWidthClass: "max-w-[245px]",
    backPointsWidthClass: "max-w-[237px]",
    href: "/content-creation",
  },
];

export function SeoServicesMobileServicesRail() {
  const railRef = useRef<HTMLDivElement>(null);
  const [activeCardIndex, setActiveCardIndex] = useState<number | null>(null);
  const [mobileIndicatorIndex, setMobileIndicatorIndex] = useState(0);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) {
      return;
    }

    const maxIndicatorIndex = MOBILE_SERVICE_CARDS.length - 1;
    const cardStep = MOBILE_CARD_WIDTH + MOBILE_CARD_GAP;

    const updateIndicator = () => {
      const nextIndex = Math.round(rail.scrollLeft / cardStep);
      setMobileIndicatorIndex(Math.max(0, Math.min(maxIndicatorIndex, nextIndex)));
    };

    let resizeRafId = 0;
    const onResize = () => {
      cancelAnimationFrame(resizeRafId);
      resizeRafId = requestAnimationFrame(updateIndicator);
    };

    updateIndicator();
    rail.addEventListener("scroll", updateIndicator, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      rail.removeEventListener("scroll", updateIndicator);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(resizeRafId);
    };
  }, []);

  return (
    <>
      <div
        className="services-scroll-rail mt-10 overflow-x-auto snap-x snap-mandatory pb-0 lg:hidden"
        id="seo-services-mobile-rail-scroll"
        ref={railRef}
      >
        <div className="mx-auto flex w-max gap-[10px] px-[20px]">
          {MOBILE_SERVICE_CARDS.map((card, index) => (
            <article
              className={cn(
                "seo-service-card relative h-[450px] w-[350px] shrink-0 snap-start overflow-hidden rounded-[30px]",
                activeCardIndex === index && "is-flipped",
              )}
              key={`${card.title}-${index}`}
              onBlur={(event) => {
                const nextFocusedElement = event.relatedTarget as Node | null;
                if (!event.currentTarget.contains(nextFocusedElement)) {
                  setActiveCardIndex((current) => (current === index ? null : current));
                }
              }}
              onFocus={() => setActiveCardIndex(index)}
            >
              <div className="seo-service-card-inner h-full rounded-[30px]">
                <div className="seo-service-card-face seo-service-card-front surface-radial relative h-full overflow-hidden p-[20px] text-[var(--color-hr-pure-white)]">
                  <Image
                    alt={card.imageAlt}
                    className={cn("pointer-events-none absolute max-w-none", card.imageClassName)}
                    height={card.imageHeight}
                    priority={index === 0}
                    quality={95}
                    sizes={`(max-width: 1023px) ${card.mobileImageRenderWidth}px, ${MOBILE_CARD_WIDTH}px`}
                    src={card.imageSrc}
                    style={card.imageStyle}
                    width={card.imageWidth}
                  />
                  <div className="seo-service-card-front-overlay absolute inset-0" />

                  <h3 className={cn("type-h3 font-medium relative z-10 mt-10 max-w-[295px] text-[var(--color-hr-pure-white)]", card.titleClassName)}>
                    {card.title}
                  </h3>
                </div>

                <div className="seo-service-card-face seo-service-card-back relative h-full overflow-hidden p-[20px] text-[var(--color-hr-pure-white)]">
                  <Image
                    alt=""
                    aria-hidden
                    className="service-card-back-image pointer-events-none absolute inset-0 h-full w-full object-cover"
                    fill
                    quality={95}
                    sizes={`(max-width: 1023px) ${card.mobileImageRenderWidth}px, ${MOBILE_CARD_WIDTH}px`}
                    src={card.imageSrc}
                  />
                  <div className="seo-service-card-back-overlay absolute inset-0" />

                  <div className="relative z-10 pt-[20px]">
                    <p className={cn("type-paragraph text-[var(--color-hr-pure-white)]", card.backIntroWidthClass)}>
                      {card.backIntro}
                    </p>
                    <ul className={cn("mt-5 list-none space-y-[6px]", card.backPointsWidthClass)}>
                      {card.backPoints.map((point) => (
                        <li className="type-paragraph text-[var(--color-hr-pure-white)]" key={`${card.title}-${point}`}>
                          • {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {card.href ? (
                <AppLink
                  aria-label={`${card.title} — learn more`}
                  className="motion-interactive motion-interactive-press absolute bottom-[20px] right-[20px] z-20 inline-flex size-[60px] items-center justify-center rounded-full bg-[var(--color-hr-pure-white)] text-[var(--color-hr-dark)] hover:bg-[var(--color-hr-pure-white)] dark:bg-[var(--color-bg-dark)] dark:text-[var(--color-text-inverse)] dark:hover:bg-[var(--color-bg-dark)]"
                  href={card.href}
                >
                  <DiagonalArrowIcon className="size-5" />
                </AppLink>
              ) : (
                <button
                  aria-expanded={activeCardIndex === index}
                  aria-label={`${card.title} details`}
                  className="motion-interactive motion-interactive-press absolute bottom-[20px] right-[20px] z-20 inline-flex size-[60px] items-center justify-center rounded-full bg-[var(--color-hr-pure-white)] text-[var(--color-hr-dark)] hover:bg-[var(--color-hr-pure-white)] dark:bg-[var(--color-bg-dark)] dark:text-[var(--color-text-inverse)] dark:hover:bg-[var(--color-bg-dark)]"
                  onClick={() => setActiveCardIndex((current) => (current === index ? null : index))}
                  type="button"
                >
                  <DiagonalArrowIcon className={cn("size-5 transition-transform duration-300", activeCardIndex === index && "rotate-180")} />
                </button>
              )}
            </article>
          ))}
        </div>
      </div>

      <div className="mt-10 flex justify-center lg:hidden">
        <div aria-label="SEO services carousel position" className="flex items-center" role="status">
          {MOBILE_SERVICE_CARDS.map((card, index) => (
            <button
              aria-label={`Show SEO service card ${index + 1}`}
              className="relative flex items-center justify-center p-[19px]"
              key={`seo-services-indicator-${card.title}-${index}`}
              onClick={() => {
                railRef.current?.scrollTo({
                  left: index * (MOBILE_CARD_WIDTH + MOBILE_CARD_GAP),
                  behavior: "smooth",
                });
              }}
              type="button"
            >
              <span className={`block size-[6px] rounded-full transition-colors duration-200 ${
                mobileIndicatorIndex === index ? "bg-[var(--color-hr-dark)] dark:bg-[var(--color-text-inverse)]" : "bg-[var(--color-hr-light-grey)] dark:bg-[var(--color-border-inverse-10)]"
              }`} />
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
