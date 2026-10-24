"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/cn";

export interface JourneyStep {
  key: string;
  title: string;
  body: string;
}

interface JourneyTimelineDesktopProps {
  steps: JourneyStep[];
}

/** How long the dot rests on each step before travelling to the next. */
const STEP_MS = 3200;

/**
 * Desktop timeline for "The Journey to Success": the brand-gradient dot
 * travels along the hairline from step to step while the section is in
 * view, the line fills behind it, and the step under the dot is the one
 * in full colour. Clicking a step moves the dot there. With reduced
 * motion the dot stays on the first step and every step reads at full
 * strength, which is the original static layout.
 */
export function JourneyTimelineDesktop({ steps }: JourneyTimelineDesktopProps) {
  const [active, setActive] = useState(0);
  const [running, setRunning] = useState(false);
  const [motionOk, setMotionOk] = useState(false);
  const [dotLeft, setDotLeft] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<Array<HTMLSpanElement | null>>([]);

  // Honour reduced motion: no travel, no dimming.
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setMotionOk(!query.matches);
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  // Run only while the timeline is on screen and the tab is visible.
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !motionOk) return;
    let inView = false;
    const update = () => setRunning(inView && document.visibilityState === "visible");
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = Boolean(entry?.isIntersecting);
        update();
      },
      { threshold: 0.35 },
    );
    observer.observe(root);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, [motionOk]);

  // Advance while running.
  useEffect(() => {
    if (!running || steps.length < 2) return;
    const timer = window.setTimeout(() => setActive((current) => (current + 1) % steps.length), STEP_MS);
    return () => window.clearTimeout(timer);
  }, [running, active, steps.length]);

  // Measure where the active step's dot sits so the travelling dot can land on it.
  const measure = useCallback(() => {
    const root = rootRef.current;
    const target = dotRefs.current[active];
    if (!root || !target) return;
    setDotLeft(target.getBoundingClientRect().left - root.getBoundingClientRect().left);
  }, [active]);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  const highlight = motionOk;

  return (
    <div className="relative" ref={rootRef}>
      <span aria-hidden className="absolute left-0 right-0 top-[14px] h-[2px] bg-[var(--color-hr-light-grey)] dark:bg-[var(--color-hr-dark-line)]" />
      {highlight ? (
        <>
          {/* The filled part of the line, from the first step to the dot. */}
          <span
            aria-hidden
            className="journey-line-fill absolute left-0 top-[14px] h-[2px] bg-[linear-gradient(90deg,var(--color-brand-gradient-stop-1),var(--color-brand-gradient-stop-2))]"
            style={{ width: `${dotLeft}px` }}
          />
          <span
            aria-hidden
            className="journey-dot absolute top-0 size-[30px] rounded-full bg-[linear-gradient(226.57deg,var(--color-brand-gradient-stop-1)_18.303%,var(--color-brand-gradient-stop-2)_40.658%,var(--color-brand-gradient-stop-3)_129.53%)] shadow-[0_0_24px_color-mix(in_srgb,var(--color-brand-gradient-stop-2)_70%,transparent)]"
            style={{ transform: `translateX(${dotLeft}px)` }}
          />
        </>
      ) : null}

      <ol className="relative grid gap-[48px]" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
        {steps.map((step, index) => {
          const isActive = index === active;
          return (
            <li className="flex flex-col" key={step.key}>
              <span
                aria-hidden
                className={cn(
                  "size-[30px] rounded-full",
                  !highlight && index === 0
                    ? "bg-[linear-gradient(226.57deg,var(--color-brand-gradient-stop-1)_18.303%,var(--color-brand-gradient-stop-2)_40.658%,var(--color-brand-gradient-stop-3)_129.53%)]"
                    : "bg-[var(--color-hr-light-grey)] dark:bg-[var(--color-hr-dark-line)]",
                )}
                ref={(element) => {
                  dotRefs.current[index] = element;
                }}
              />
              {/* WHY: a button, so keyboard users can move the dot too; the phone rail carries the H3s. */}
              <button
                aria-current={highlight && isActive ? "step" : undefined}
                className={cn(
                  "journey-step mt-[40px] flex flex-col text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-hr-accent)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--color-hr-off-white)] dark:focus-visible:ring-offset-[var(--color-bg-dark)]",
                  highlight && !isActive && "opacity-40",
                )}
                onClick={() => setActive(index)}
                type="button"
              >
                <span className="min-h-[80px] font-normal text-[32px] leading-[1.2] tracking-[-0.64px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">{step.title}</span>
                <span className="text-[18px] leading-[24px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">{step.body}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
