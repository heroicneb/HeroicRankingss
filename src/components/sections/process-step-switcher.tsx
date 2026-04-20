"use client";

import type { ReactNode, TouchEvent } from "react";
import { useRef, useState } from "react";

import {
  ProcessArrowActiveIcon,
  ProcessArrowMutedIcon,
} from "@/components/ui/icons/decorative";
import { cn } from "@/lib/cn";

export interface ProcessStep {
  label: string;
  description: string;
}

interface ProcessStepSwitcherProps {
  steps: readonly ProcessStep[];
  initialActiveStepIndex?: number;
  activeArrowIcon?: ReactNode;
  mutedArrowIcon?: ReactNode;
  rowClassName?: string;
  activePillClassName?: string;
  mutedPillClassName?: string;
  descriptionClassName?: string;
  mobileDotsRowClassName?: string;
  mobileDotClassName?: string;
}

const DEFAULT_ROW_CLASS =
  "flex flex-wrap items-center gap-[10px] pb-1 min-[1280px]:flex-nowrap";
const DEFAULT_ACTIVE_PILL_CLASS =
  "type-paragraph whitespace-nowrap rounded-[100px] bg-[var(--color-hr-dark)] px-[14px] py-[6px] text-[var(--color-hr-off-white)] transition-colors dark:bg-[var(--color-text-inverse)] dark:text-[var(--color-text-fill-dark)]";
const DEFAULT_MUTED_PILL_CLASS =
  "type-paragraph whitespace-nowrap rounded-[100px] bg-[var(--color-hr-light-grey)] px-[14px] py-[6px] text-[var(--color-hr-grey)] transition-colors hover:text-[var(--color-hr-dark)] dark:bg-[var(--color-surface-inverse-10)] dark:text-[var(--color-text-inverse-60)] dark:hover:text-[var(--color-text-inverse)]";
const DEFAULT_DESCRIPTION_CLASS =
  "type-paragraph mt-[63px] max-w-[817px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]";
const DEFAULT_MOBILE_DOTS_ROW_CLASS =
  "mt-5 flex items-center justify-center gap-[6px]";
const DEFAULT_MOBILE_DOT_CLASS =
  "inline-flex size-[10px] rounded-full transition-colors";

export function ProcessStepSwitcher({
  steps,
  initialActiveStepIndex = 0,
  activeArrowIcon,
  mutedArrowIcon,
  rowClassName,
  activePillClassName,
  mutedPillClassName,
  descriptionClassName,
  mobileDotsRowClassName,
  mobileDotClassName,
}: ProcessStepSwitcherProps) {
  const [activeStepIndex, setActiveStepIndex] = useState(
    initialActiveStepIndex,
  );
  const touchStartXRef = useRef<number | null>(null);
  const activeStep = steps[activeStepIndex] ?? steps[0];
  const isFirstStep = activeStepIndex === 0;
  const isLastStep = activeStepIndex === steps.length - 1;

  const moveStep = (direction: "prev" | "next") => {
    setActiveStepIndex((current) => {
      if (direction === "prev") {
        return Math.max(0, current - 1);
      }

      return Math.min(steps.length - 1, current + 1);
    });
  };

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartXRef.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const startX = touchStartXRef.current;
    if (startX === null) {
      return;
    }

    const touchEndX = event.changedTouches[0]?.clientX ?? startX;
    const deltaX = touchEndX - startX;

    if (Math.abs(deltaX) >= 40) {
      if (deltaX > 0) {
        moveStep("prev");
      } else {
        moveStep("next");
      }
    }

    touchStartXRef.current = null;
  };

  return (
    <>
      <div
        className="lg:hidden"
        onTouchEnd={handleTouchEnd}
        onTouchStart={handleTouchStart}
      >
        <div className="flex items-center justify-between">
          <button
            aria-label="Previous process step"
            className="motion-interactive motion-interactive-press inline-flex size-[44px] items-center justify-start text-[var(--color-hr-dark)] disabled:cursor-default disabled:text-[var(--color-hr-light-grey)] dark:text-[var(--color-text-inverse)] dark:disabled:text-[var(--color-text-inverse-30)]"
            disabled={isFirstStep}
            onClick={() => moveStep("prev")}
            type="button"
          >
            <span className="inline-flex size-[14px] rotate-180">
              {isFirstStep
                ? (mutedArrowIcon ?? (
                    <ProcessArrowMutedIcon className="size-full text-[var(--color-hr-light-grey)] dark:text-[var(--color-text-inverse-30)]" />
                  ))
                : (activeArrowIcon ?? (
                    <ProcessArrowActiveIcon className="size-full" />
                  ))}
            </span>
          </button>

          <span className="mx-2 min-w-0 flex-shrink rounded-[24px] bg-[var(--color-hr-dark)] px-[14px] py-[6px] text-center text-[15px] font-normal leading-[22px] text-[var(--color-hr-off-white)] [overflow-wrap:anywhere] dark:bg-[var(--color-text-inverse)] dark:text-[var(--color-text-fill-dark)]">
            {activeStep?.label}
          </span>

          <button
            aria-label="Next process step"
            className="motion-interactive motion-interactive-press inline-flex size-[44px] items-center justify-end text-[var(--color-hr-dark)] disabled:cursor-default disabled:text-[var(--color-hr-light-grey)] dark:text-[var(--color-text-inverse)] dark:disabled:text-[var(--color-text-inverse-30)]"
            disabled={isLastStep}
            onClick={() => moveStep("next")}
            type="button"
          >
            <span className="inline-flex size-[14px]">
              {isLastStep
                ? (mutedArrowIcon ?? (
                    <ProcessArrowMutedIcon className="size-full text-[var(--color-hr-light-grey)] dark:text-[var(--color-text-inverse-30)]" />
                  ))
                : (activeArrowIcon ?? (
                    <ProcessArrowActiveIcon className="size-full" />
                  ))}
            </span>
          </button>
        </div>

        <p className="mt-5 text-center text-[18px] font-normal leading-[24px] text-[var(--color-hr-dark)] transition-[opacity,color] duration-300 dark:text-[var(--color-text-inverse)]">
          {activeStep?.description}
        </p>

        <div
          className={cn(DEFAULT_MOBILE_DOTS_ROW_CLASS, mobileDotsRowClassName)}
        >
          {steps.map((step, index) => (
            <button
              aria-label={`Go to step ${index + 1}`}
              className="relative flex items-center justify-center p-[17px]"
              key={step.label}
              onClick={() => setActiveStepIndex(index)}
              type="button"
            >
              <span
                className={cn(
                  DEFAULT_MOBILE_DOT_CLASS,
                  mobileDotClassName,
                  index === activeStepIndex
                    ? "bg-[var(--color-hr-dark)] dark:bg-[var(--color-text-inverse)]"
                    : "bg-[var(--color-hr-light-grey)] dark:bg-[var(--color-surface-inverse-20)]",
                )}
              />
            </button>
          ))}
        </div>
      </div>

      <div className={cn("hidden lg:flex", DEFAULT_ROW_CLASS, rowClassName)}>
        {steps.map((step, index) => (
          <div className="flex items-center gap-[10px]" key={step.label}>
            <button
              aria-current={index === activeStepIndex ? "step" : undefined}
              className={cn(
                "motion-interactive motion-interactive-press",
                index === activeStepIndex
                  ? DEFAULT_ACTIVE_PILL_CLASS
                  : DEFAULT_MUTED_PILL_CLASS,
                index === activeStepIndex
                  ? activePillClassName
                  : mutedPillClassName,
              )}
              onClick={() => setActiveStepIndex(index)}
              type="button"
            >
              {step.label}
            </button>

            {index < steps.length - 1 ? (
              <span className="inline-flex size-[14px]">
                {index === activeStepIndex
                  ? (activeArrowIcon ?? (
                      <ProcessArrowActiveIcon className="size-full" />
                    ))
                  : (mutedArrowIcon ?? (
                      <ProcessArrowMutedIcon className="size-full text-[var(--color-hr-light-grey)] dark:text-[var(--color-text-inverse)]" />
                    ))}
              </span>
            ) : null}
          </div>
        ))}
      </div>

      <p
        className={cn(
          "hidden lg:block",
          DEFAULT_DESCRIPTION_CLASS,
          descriptionClassName,
        )}
      >
        {activeStep?.description}
      </p>
    </>
  );
}
