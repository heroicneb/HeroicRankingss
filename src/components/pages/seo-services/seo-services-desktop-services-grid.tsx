"use client";

import { useState } from "react";

import Image from "next/image";

import { AppLink } from "@/components/ui/app-link";
import { GradientText } from "@/components/ui/gradient-text";
import { DiagonalArrowIcon } from "@/components/ui/icons/decorative";
import { cn } from "@/lib/cn";

export type SeoDesktopServiceCard = {
  title: string;
  description: string;
  isDescriptionGradient?: boolean;
  imageSrc: string;
  titleWidthClass: string;
  descWidthClass: string;
  colSpanClass: string;
  backIntro: string;
  backPoints: readonly string[];
  backIntroWidthClass: string;
  backPointsWidthClass: string;
  href?: string;
};

type SeoServicesDesktopServicesGridProps = {
  cards: readonly SeoDesktopServiceCard[];
};

export function SeoServicesDesktopServicesGrid({
  cards,
}: SeoServicesDesktopServicesGridProps) {
  const [activeCardIndex, setActiveCardIndex] = useState<number | null>(null);

  return (
    <div className="mt-[80px] hidden grid-cols-1 gap-5 md:grid-cols-2 lg:grid lg:grid-cols-4">
      {cards.map((card, index) => (
        <article
          className={cn(
            "seo-service-card relative h-[420px]",
            card.colSpanClass,
            activeCardIndex === index && "is-flipped",
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
          onMouseLeave={() =>
            setActiveCardIndex((current) =>
              current === index ? null : current,
            )
          }
        >
          <div className="seo-service-card-inner h-full rounded-[40px]">
            <div className="seo-service-card-face seo-service-card-front relative h-full overflow-hidden p-[30px] text-[var(--color-hr-pure-white)]">
              <Image
                alt={card.title}
                className="absolute inset-0 h-full w-full object-cover"
                fill
                sizes="(min-width: 1024px) 610px, (min-width: 768px) 50vw, 100vw"
                src={card.imageSrc}
              />
              <div className="seo-service-card-front-overlay absolute inset-0" />

              <div className="relative z-10">
                <h3
                  className={cn(
                    "type-h3 font-normal text-[var(--color-hr-pure-white)]",
                    card.titleWidthClass,
                  )}
                >
                  {card.title}
                </h3>
                {card.isDescriptionGradient ? (
                  <GradientText
                    as="p"
                    className={cn(
                      "gradient-text-brand-services type-paragraph mt-[10px]",
                      card.descWidthClass,
                    )}
                  >
                    {card.description}
                  </GradientText>
                ) : (
                  <p
                    className={cn(
                      "type-paragraph mt-[10px] text-[var(--color-hr-pure-white)]",
                      card.descWidthClass,
                    )}
                  >
                    {card.description}
                  </p>
                )}
              </div>

              {card.href ? (
                <AppLink
                  aria-label={`${card.title} — learn more`}
                  className="motion-interactive motion-interactive-press absolute bottom-5 right-5 z-20 inline-flex size-[72px] items-center justify-center rounded-full bg-[var(--color-hr-pure-white)] text-[var(--color-hr-dark)] transition-transform duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-hr-accent)] dark:bg-[var(--color-bg-dark)] dark:text-[var(--color-text-inverse)]"
                  href={card.href}
                >
                  <DiagonalArrowIcon className="size-5" />
                </AppLink>
              ) : (
                <button
                  aria-expanded={activeCardIndex === index}
                  aria-label={`${card.title} details`}
                  className="motion-interactive motion-interactive-press absolute bottom-5 right-5 z-20 inline-flex size-[72px] items-center justify-center rounded-full bg-[var(--color-hr-pure-white)] text-[var(--color-hr-dark)] transition-transform duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-hr-accent)] dark:bg-[var(--color-bg-dark)] dark:text-[var(--color-text-inverse)]"
                  onClick={() =>
                    setActiveCardIndex((current) =>
                      current === index ? null : index,
                    )
                  }
                  type="button"
                >
                  <DiagonalArrowIcon className="size-5" />
                </button>
              )}
            </div>

            <div className="seo-service-card-face seo-service-card-back relative h-full overflow-hidden p-[30px] text-[var(--color-hr-pure-white)]">
              <Image
                alt=""
                aria-hidden
                className="seo-service-card-back-image absolute inset-0 h-full w-full object-cover"
                fill
                sizes="(min-width: 1024px) 610px, (min-width: 768px) 50vw, 100vw"
                src={card.imageSrc}
              />
              <div className="seo-service-card-back-overlay absolute inset-0" />

              <div className="relative z-10">
                <p
                  className={cn(
                    "type-paragraph text-[var(--color-hr-pure-white)]",
                    card.backIntroWidthClass,
                  )}
                >
                  {card.backIntro}
                </p>
                <ul
                  className={cn(
                    "mt-[30px] list-none space-y-[10px]",
                    card.backPointsWidthClass,
                  )}
                >
                  {card.backPoints.map((point) => (
                    <li
                      className="type-paragraph text-[var(--color-hr-pure-white)]"
                      key={point}
                    >
                      • {point}
                    </li>
                  ))}
                </ul>
              </div>

              {card.href ? (
                <AppLink
                  aria-label={`${card.title} — learn more`}
                  className="motion-interactive motion-interactive-press absolute bottom-5 right-5 z-20 inline-flex size-[72px] items-center justify-center rounded-full bg-[var(--color-hr-pure-white)] text-[var(--color-hr-dark)] transition-transform duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-hr-accent)] dark:bg-[var(--color-bg-dark)] dark:text-[var(--color-text-inverse)]"
                  href={card.href}
                >
                  <DiagonalArrowIcon className="size-5" />
                </AppLink>
              ) : (
                <button
                  aria-expanded={activeCardIndex === index}
                  aria-label={`${card.title} details`}
                  className="motion-interactive motion-interactive-press absolute bottom-5 right-5 z-20 inline-flex size-[72px] items-center justify-center rounded-full bg-[var(--color-hr-pure-white)] text-[var(--color-hr-dark)] transition-transform duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-hr-accent)] dark:bg-[var(--color-bg-dark)] dark:text-[var(--color-text-inverse)]"
                  onClick={() =>
                    setActiveCardIndex((current) =>
                      current === index ? null : index,
                    )
                  }
                  type="button"
                >
                  <DiagonalArrowIcon className="size-5" />
                </button>
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
