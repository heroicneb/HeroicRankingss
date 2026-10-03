"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/cn";

import { PORTAL_SCREENS } from "./portal-mocks";

/**
 * "/ Inside the Portal /" — a four-step walkthrough of the partner portal.
 * The steps on the left (above, on phones) select a screen; the screen is a
 * fixed-width HTML mock scaled to the frame. On desktop pointers the steps
 * advance by themselves every few seconds until the visitor interacts.
 */
export interface PortalStep {
  title: string;
  description: string;
}

export interface PortalShowcaseProps {
  steps: PortalStep[];
}

/** Design widths the mocks are laid out at; the frame scales them to fit. */
const DESIGN_WIDTH = 1120;
const COMPACT_DESIGN_WIDTH = 640;
const DESIGN_HEIGHT = 720;
const AUTOPLAY_MS = 7000;
const AUTOPLAY_MEDIA = "(min-width: 1024px) and (hover: hover) and (prefers-reduced-motion: no-preference)";

export function PortalShowcase({ steps }: PortalShowcaseProps) {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const [autoplay, setAutoplay] = useState(false);
  const [paused, setPaused] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);
  const screens = PORTAL_SCREENS;
  const count = screens.length;

  const goTo = useCallback(
    (index: number, fromUser = true) => {
      setActive((current) => {
        const next = ((index % count) + count) % count;
        setDirection(next > current || (current === count - 1 && next === 0) ? 1 : -1);
        return next;
      });
      // WHY: once a visitor takes control the walkthrough stops stepping on its own.
      if (fromUser) setAutoplay(false);
    },
    [count],
  );

  // Scale the mock to the frame width; narrow frames switch to the compact layout.
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const fit = () => {
      const width = frame.clientWidth;
      const compact = width < 600;
      const design = compact ? COMPACT_DESIGN_WIDTH : DESIGN_WIDTH;
      frame.style.setProperty("--pm-scale", String(width / design));
      frame.style.setProperty("--pm-design-width", `${design}px`);
      frame.toggleAttribute("data-compact", compact);
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  // Autoplay only where it was approved (desktop pointers, motion allowed) and only while on screen.
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const media = window.matchMedia(AUTOPLAY_MEDIA);
    let armed = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || armed || !media.matches) return;
        armed = true;
        observer.disconnect();
        setAutoplay(true);
      },
      { threshold: 0.35 },
    );
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!autoplay || paused) return;
    const timer = window.setTimeout(() => goTo(active + 1, false), AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [active, autoplay, paused, goTo]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(active + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(active - 1);
    }
  };

  // Swipe between screens on touch devices.
  const touchStart = useRef<number | null>(null);
  const onTouchStart = (event: React.TouchEvent) => {
    touchStart.current = event.touches[0]?.clientX ?? null;
  };
  const onTouchEnd = (event: React.TouchEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    const end = event.changedTouches[0]?.clientX;
    if (start === null || end === undefined) return;
    const delta = end - start;
    if (Math.abs(delta) < 48) return;
    goTo(delta < 0 ? active + 1 : active - 1);
  };

  const current = steps[active] ?? steps[0];

  return (
    <div
      className="portal-showcase grid gap-[24px] lg:grid-cols-[340px_minmax(0,1fr)] lg:items-start lg:gap-[40px] xl:grid-cols-[380px_minmax(0,1fr)]"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPaused(false);
      }}
      onFocus={() => setPaused(true)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Steps: a tab list on desktop, hidden on phones in favour of the dots below the frame. */}
      <div aria-label="Portal walkthrough steps" className="hidden lg:block" onKeyDown={onKeyDown} role="tablist" aria-orientation="vertical">
        {steps.map((step, index) => {
          const selected = index === active;
          return (
            <button
              aria-controls={`portal-screen-${screens[index]?.id ?? index}`}
              aria-selected={selected}
              className={cn(
                "portal-step motion-interactive group relative mb-[10px] block w-full rounded-[20px] border px-[22px] py-[18px] text-left transition-colors",
                selected
                  ? "border-[var(--color-hr-accent)] bg-[var(--color-hr-pure-white)] dark:bg-[var(--color-surface-inverse-10)]"
                  : "border-[var(--color-hr-light-grey)] bg-transparent hover:bg-[var(--color-hr-off-white)] dark:border-[var(--color-border-inverse-10)] dark:hover:bg-[var(--color-surface-inverse-10)]",
              )}
              id={`portal-tab-${index}`}
              key={step.title}
              onClick={() => goTo(index)}
              role="tab"
              tabIndex={selected ? 0 : -1}
              type="button"
            >
              <span className="flex items-start gap-[14px]">
                <span
                  className={cn(
                    "mt-[1px] inline-flex size-[28px] shrink-0 items-center justify-center rounded-full text-[13px] font-semibold",
                    selected
                      ? "bg-[var(--color-hr-accent)] text-[var(--color-text-fill-light)]"
                      : "bg-[var(--color-hr-off-white)] text-[var(--color-hr-dark)] dark:bg-[var(--color-surface-inverse-10)] dark:text-[var(--color-text-inverse)]",
                  )}
                >
                  {index + 1}
                </span>
                <span className="min-w-0">
                  <span className="block text-[18px] font-medium leading-[1.3] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">{step.title}</span>
                  <span
                    className={cn(
                      "portal-step-body block overflow-hidden text-[15px] leading-[1.5] text-[var(--color-hr-grey)] transition-[max-height,opacity,margin] duration-500 ease-out dark:text-[var(--color-text-inverse-60)]",
                      selected ? "mt-[8px] max-h-[160px] opacity-100" : "mt-0 max-h-0 opacity-0",
                    )}
                  >
                    {step.description}
                  </span>
                </span>
              </span>
              {selected && autoplay && !paused ? (
                <span aria-hidden className="portal-step-progress absolute bottom-0 left-[22px] right-[22px] h-[2px] overflow-hidden rounded-full bg-[var(--color-hr-light-grey)] dark:bg-[var(--color-border-inverse-10)]">
                  <span className="portal-step-progress-bar block h-full w-full origin-left bg-[var(--color-hr-accent)]" key={active} style={{ animationDuration: `${AUTOPLAY_MS}ms` }} />
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="min-w-0">
        {/* The browser-style frame holding the four scaled screens. */}
        <div
          className="portal-frame overflow-hidden rounded-[24px] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-pure-white)] shadow-[0_30px_80px_-40px_rgb(var(--color-shadow-rgb)/0.45)] dark:border-[var(--color-border-inverse-10)] dark:bg-[var(--color-bg-dark)] lg:rounded-[30px]"
          onKeyDown={onKeyDown}
          onTouchEnd={onTouchEnd}
          onTouchStart={onTouchStart}
        >
          <div className="flex items-center gap-[8px] border-b border-[var(--color-hr-light-grey)] px-[16px] py-[12px] dark:border-[var(--color-border-inverse-10)]">
            <span aria-hidden className="flex gap-[6px]">
              <span className="size-[10px] rounded-full bg-[var(--color-hr-light-grey)] dark:bg-[var(--color-border-inverse-20)]" />
              <span className="size-[10px] rounded-full bg-[var(--color-hr-light-grey)] dark:bg-[var(--color-border-inverse-20)]" />
              <span className="size-[10px] rounded-full bg-[var(--color-hr-light-grey)] dark:bg-[var(--color-border-inverse-20)]" />
            </span>
            <span className="mx-auto max-w-[70%] truncate rounded-full bg-[var(--color-hr-off-white)] px-[14px] py-[4px] text-[12px] text-[var(--color-hr-grey)] dark:bg-[var(--color-surface-inverse-10)] dark:text-[var(--color-text-inverse-60)]">
              Partner Portal · {screens[active]?.crumb}
            </span>
          </div>
          <div className="portal-stage relative" ref={frameRef} style={{ height: `calc(${DESIGN_HEIGHT}px * var(--pm-scale, 1))` }}>
            {screens.map(({ id, Mock }, index) => {
              const selected = index === active;
              return (
                <div
                  aria-hidden={!selected}
                  aria-labelledby={`portal-tab-${index}`}
                  className={cn(
                    "portal-screen absolute inset-0",
                    selected ? "portal-screen-active" : direction > 0 ? "portal-screen-before" : "portal-screen-after",
                  )}
                  id={`portal-screen-${id}`}
                  // WHY: inactive screens stay in the DOM for the crossfade but must not be focusable or read out.
                  inert={!selected}
                  key={id}
                  role="tabpanel"
                >
                  <div className="portal-mock" style={{ width: "var(--pm-design-width, 1120px)", height: DESIGN_HEIGHT, transform: "scale(var(--pm-scale, 1))" }}>
                    <Mock />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Phone controls: previous/next, dots, and the active step's copy. */}
        <div className="mt-[20px] lg:hidden">
          <div className="flex items-center justify-between gap-[12px]">
            <button
              aria-label="Previous screen"
              className="motion-interactive inline-flex size-[44px] items-center justify-center rounded-full border border-[var(--color-hr-light-grey)] text-[var(--color-hr-dark)] dark:border-[var(--color-border-inverse-10)] dark:text-[var(--color-text-inverse)]"
              onClick={() => goTo(active - 1)}
              type="button"
            >
              <svg aria-hidden className="size-[14px]" fill="none" viewBox="0 0 14 14">
                <path d="M9 2 4 7l5 5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
              </svg>
            </button>
            <div className="flex items-center gap-[8px]" role="tablist" aria-label="Portal walkthrough steps">
              {steps.map((step, index) => (
                <button
                  aria-label={`${index + 1}. ${step.title}`}
                  aria-selected={index === active}
                  className={cn("h-[8px] rounded-full transition-all", index === active ? "w-[24px] bg-[var(--color-hr-accent)]" : "w-[8px] bg-[var(--color-hr-light-grey)] dark:bg-[var(--color-border-inverse-20)]")}
                  key={step.title}
                  onClick={() => goTo(index)}
                  role="tab"
                  type="button"
                />
              ))}
            </div>
            <button
              aria-label="Next screen"
              className="motion-interactive inline-flex size-[44px] items-center justify-center rounded-full border border-[var(--color-hr-light-grey)] text-[var(--color-hr-dark)] dark:border-[var(--color-border-inverse-10)] dark:text-[var(--color-text-inverse)]"
              onClick={() => goTo(active + 1)}
              type="button"
            >
              <svg aria-hidden className="size-[14px]" fill="none" viewBox="0 0 14 14">
                <path d="m5 2 5 5-5 5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
              </svg>
            </button>
          </div>
          {current ? (
            <div aria-live="polite" className="mt-[18px] text-center">
              <p className="text-[18px] font-medium leading-[1.3] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
                {active + 1}. {current.title}
              </p>
              <p className="mt-[8px] text-[15px] leading-[1.5] text-[var(--color-hr-grey)] dark:text-[var(--color-text-inverse-60)]">{current.description}</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
