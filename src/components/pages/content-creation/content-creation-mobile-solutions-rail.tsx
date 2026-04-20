"use client";

import { useEffect, useRef, useState } from "react";

import Image from "next/image";

import { AppLink } from "@/components/ui/app-link";
import { cn } from "@/lib/cn";

const MOBILE_CARD_WIDTH = 350;
const MOBILE_CARD_GAP = 5;

export type ContentCreationMobileSolutionCard = {
  title: string;
  subtitle: string;
  body: string;
  ctaLabel: string;
  iconSrc: string;
  iconWidth: number;
  iconHeight: number;
  iconWrapperClassName?: string;
};

interface ContentCreationMobileSolutionsRailProps {
  cards: readonly ContentCreationMobileSolutionCard[];
}

export function ContentCreationMobileSolutionsRail({ cards }: ContentCreationMobileSolutionsRailProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const [mobileIndicatorIndex, setMobileIndicatorIndex] = useState(0);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) {
      return;
    }

    const maxIndicatorIndex = cards.length - 1;
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
  }, [cards.length]);

  return (
    <>
      <div className="services-scroll-rail mt-10 overflow-x-auto snap-x snap-mandatory lg:hidden" ref={railRef}>
        <div className="mx-auto flex w-max gap-[5px] px-5">
          {cards.map((card) => (
            <article
              className="flex h-[580px] w-[350px] shrink-0 snap-center flex-col items-center justify-between rounded-[30px] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-pure-white)] p-5 text-center dark:border-[var(--color-border-inverse-10)] dark:bg-[var(--color-bg-dark)]"
              key={card.title}
            >
              <div className="flex w-full flex-col items-center gap-[30px] text-center">
                <div className="flex w-full flex-col items-center gap-[15px]">
                  <span
                    className={cn(
                      "inline-flex size-[50px] items-center justify-center rounded-[12px] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-pure-white)] dark:border-[var(--color-border-inverse-10)] dark:bg-[var(--color-bg-dark)]",
                      card.iconWrapperClassName,
                    )}
                  >
                    <Image
                      alt=""
                      aria-hidden
                      className="block dark:brightness-0 dark:invert"
                      height={card.iconHeight}
                      sizes="50px"
                      src={card.iconSrc}
                      width={card.iconWidth}
                    />
                  </span>

                  <h3 className="type-h3 mx-auto w-full max-w-[290px] text-center text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
                    {card.title}
                  </h3>
                  <p className="type-paragraph mx-auto w-full max-w-[290px] text-center gradient-text-brand gradient-text-brand-services">
                    {card.subtitle}
                  </p>
                </div>

                <p className="type-paragraph mx-auto w-full max-w-[310px] text-center text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
                  {card.body}
                </p>
              </div>

              <AppLink
                className="type-cta inline-flex h-[45px] w-full items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[var(--color-hr-accent)] bg-transparent px-5 text-center text-[var(--color-hr-dark)] hover:bg-[var(--color-hr-off-white)] dark:text-[var(--color-text-inverse)] dark:hover:bg-[var(--color-surface-inverse-10)]"
                href="/contact"
              >
                {card.ctaLabel}
              </AppLink>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-5 flex justify-center lg:hidden">
        <div aria-label="Content creation solutions carousel position" className="flex items-center" role="status">
          {cards.map((card, index) => (
            <button
              aria-label={`Show content creation solution card ${index + 1}`}
              className="relative flex items-center justify-center p-[19px]"
              key={`content-creation-solution-indicator-${card.title}-${index}`}
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
