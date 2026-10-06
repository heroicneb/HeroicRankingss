"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";

import { useReveal } from "@/components/charts/use-reveal";
import { cn } from "@/lib/cn";

import { PORTAL_DECK_IMAGE_HEIGHT, PORTAL_DECK_IMAGE_WIDTH, PORTAL_DECK_IMAGES, type PortalDeckScreen } from "./portal-deck-data";

/*
 * Portal deck: the four portal screens stacked like cards. The front card is
 * full size, the two behind peek out above it. Every STEP_MS the front card
 * lifts, slides off to the right and fades, the deck moves forward and the
 * departed card slides back in at the rear. The legend under the deck names
 * each screen; the active row carries the autoplay progress and any row can
 * be clicked to bring its screen forward.
 *
 * Desktop only for motion: the deck plays from lg up with motion allowed
 * (see ACTIVE_MEDIA). Phones get the static stack and tappable legend. The
 * mouse resting on the deck pauses it; a click takes over and the deck
 * resumes after RESUME_MS without another click.
 */

const STEP_MS = 4200;
const RESUME_MS = 12000;
const ACTIVE_MEDIA = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";

interface PortalDeckProps {
  eyebrow: string;
  screens: PortalDeckScreen[];
}

export function PortalDeck({ eyebrow, screens }: PortalDeckProps) {
  const { ref, revealed } = useReveal<HTMLDivElement>(0.3);
  const [active, setActive] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [motion, setMotion] = useState(false);
  const [manual, setManual] = useState(false);
  const [interactions, setInteractions] = useState(0);
  const [hovered, setHovered] = useState(false);
  const count = Math.max(1, screens.length);

  useEffect(() => {
    const media = window.matchMedia(ACTIVE_MEDIA);
    const sync = () => setMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  const playing = motion && revealed && !manual;
  const autoplay = playing && !hovered;

  // WHY: a pause keeps the time left in the step, so the progress bar and the timer stay in sync.
  const remaining = useRef(STEP_MS);
  useEffect(() => {
    remaining.current = STEP_MS;
  }, [active, cycle, manual]);
  useEffect(() => {
    if (!autoplay) return;
    const started = performance.now();
    const timer = window.setTimeout(() => setActive((index) => (index + 1) % count), remaining.current);
    return () => {
      window.clearTimeout(timer);
      remaining.current = Math.max(0, remaining.current - (performance.now() - started));
    };
  }, [autoplay, active, cycle, count]);

  useEffect(() => {
    if (!manual) return;
    const timer = window.setTimeout(() => setManual(false), RESUME_MS);
    return () => window.clearTimeout(timer);
  }, [manual, interactions]);

  const pick = (index: number) => {
    setManual(true);
    setInteractions((n) => n + 1);
    setActive(index);
    setCycle((n) => n + 1);
  };
  const onEnter = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse") setHovered(true);
  };
  const onLeave = () => setHovered(false);

  return (
    <div ref={ref}>
      <p className="text-[11px] uppercase tracking-[0.08em] text-[var(--color-text-inverse-60)]">{eyebrow}</p>
      <div
        aria-label={`${eyebrow} screens`}
        className="portal-deck mt-[10px]"
        data-playing={autoplay}
        onPointerEnter={onEnter}
        onPointerLeave={onLeave}
        role="group"
      >
        <div className="portal-deck-stage">
          {screens.map((screen, index) => {
            // WHY: each card's pose comes from its distance behind the front card, so the same CSS serves every rotation.
            const order = (index - active + count) % count;
            const image = PORTAL_DECK_IMAGES[screen.id];
            return (
              <div
                aria-hidden={order !== 0}
                className="portal-deck-card"
                data-order={order === count - 1 && count > 2 ? "exit" : Math.min(order, 2)}
                key={screen.id}
              >
                <Image
                  alt={image.alt}
                  className="portal-deck-image"
                  height={PORTAL_DECK_IMAGE_HEIGHT}
                  quality={80}
                  sizes="(min-width: 1024px) 560px, calc(100vw - 50px)"
                  src={image.src}
                  width={PORTAL_DECK_IMAGE_WIDTH}
                />
              </div>
            );
          })}
        </div>
      </div>

      <ol aria-label={`${eyebrow} screens, pick one to bring it forward`} className="mt-[18px] grid gap-[6px] sm:grid-cols-2 lg:grid-cols-1">
        {screens.map((screen, index) => {
          const selected = index === active;
          return (
            <li key={screen.id}>
              <button
                aria-pressed={selected}
                className={cn(
                  "portal-deck-row motion-interactive relative flex w-full items-start gap-[12px] overflow-hidden rounded-[14px] border px-[14px] py-[10px] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-hr-accent)]",
                  selected
                    ? "border-[var(--color-hr-accent)] bg-[color-mix(in_srgb,var(--color-hr-accent)_14%,transparent)]"
                    : "border-[var(--color-border-inverse-10)] hover:border-[var(--color-border-inverse-20)]",
                )}
                onClick={() => pick(index)}
                type="button"
              >
                <span className={cn("mt-[2px] text-[11px] tabular-nums", selected ? "text-[var(--color-hr-pure-white)]" : "text-[var(--color-text-inverse-50)]")}>0{index + 1}</span>
                <span className="min-w-0">
                  <span className={cn("block text-[14px] leading-[18px]", selected ? "text-[var(--color-hr-pure-white)]" : "text-[var(--color-text-inverse-80)]")}>{screen.title}</span>
                  <span className="mt-[2px] block text-[13px] leading-[17px] text-[var(--color-text-inverse-60)]">{screen.caption}</span>
                </span>
                {selected && playing ? (
                  <span
                    aria-hidden
                    className="answer-engine-progress absolute inset-x-0 bottom-0 h-[2px] origin-left bg-[var(--color-hr-accent)]"
                    data-paused={hovered}
                    key={`${active}-${cycle}`}
                    style={{ "--progress-duration": `${STEP_MS}ms` } as CSSProperties}
                  />
                ) : null}
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
