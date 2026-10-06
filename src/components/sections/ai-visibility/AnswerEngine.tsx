"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type FocusEvent as ReactFocusEvent, type PointerEvent as ReactPointerEvent, type RefObject } from "react";

import { useReveal } from "@/components/charts/use-reveal";
import type { AiScenario, AiSource } from "@/components/pages/home/home-content";
import { AppLink } from "@/components/ui/app-link";
import { cn } from "@/lib/cn";

import { MODEL_MARKS, type ModelId } from "./model-marks";
import { ModelMark } from "./ModelMark";
import { SourceIcon } from "./source-icons";

/*
 * The Answer Engine: a buyer's question is typed, the chosen model gathers
 * its sources, and the reply composes. "Without us" lights only the client's
 * own site and the reply hedges; "With Heroic Rankings" lights every source
 * and the reply recommends the brand.
 *
 * Pacing: it plays on its own once it scrolls into view, and a progress bar
 * in the active switch shows that it advances. Moving the mouse over the
 * panel does NOT stop it; only reading the answer card (mouse over it), a
 * held touch, or keyboard focus pauses it, and it resumes where it was. Any
 * click takes over; after RESUME_MS without another click the show resumes.
 * After the first Without → With pass the switch pulses once as a nudge.
 * Reduced motion shows finished states only.
 */

const MODELS: ModelId[] = ["chatgpt", "gemini", "perplexity", "claude", "copilot"];
const WITHOUT_MS = 4000;
const WITH_MS = 5200;
const TYPE_MS = 10;
const RESUME_MS = 12000;
const NUDGE_MS = 4000;
const BRAND = "Heroic Rankings";

/** Which sources light up in each state (index order matches `sources`). */
const ACTIVE = { without: [true, false, false, false, false], with: [true, true, true, true, true] } as const;

interface Edge {
  d: string;
}

/**
 * WHY: the source buttons are real HTML in normal flow, so their positions
 * differ per breakpoint and font size. The connector paths are measured from
 * the rendered buttons to the model badge, so the drawing is exact everywhere.
 */
function useEdges(container: RefObject<HTMLDivElement | null>, nodes: RefObject<Array<HTMLButtonElement | null>>, target: RefObject<HTMLDivElement | null>, deps: unknown[]) {
  const [edges, setEdges] = useState<{ size: [number, number]; paths: Edge[] }>({ size: [0, 0], paths: [] });
  useEffect(() => {
    const box = container.current;
    if (!box) return;
    const measure = () => {
      const base = box.getBoundingClientRect();
      const end = target.current?.getBoundingClientRect();
      if (!end) return;
      const ex = end.left - base.left;
      const ey = end.top - base.top + end.height / 2;
      const paths = nodes.current.map((node) => {
        const r = node?.getBoundingClientRect();
        if (!r) return { d: "" };
        const sx = r.right - base.left;
        const sy = r.top - base.top + r.height / 2;
        const mid = sx + (ex - sx) * 0.55;
        return { d: `M${sx},${sy} C ${mid},${sy} ${mid},${ey} ${ex},${ey}` };
      });
      setEdges({ size: [base.width, base.height], paths });
    };
    const frame = requestAnimationFrame(measure);
    const observer = new ResizeObserver(() => measure());
    observer.observe(box);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return edges;
}

/**
 * Types `text` out two characters at a time. Mount it with a `key` that
 * changes whenever the text should restart; with motion off it renders the
 * full text at once. Occurrences of `highlight` get the brand gradient.
 * WHY: the caret only shows while typing. A caret that blinks forever reads
 * as "still loading" to anyone who is not watching the animation closely.
 */
function TypedText({ text, enabled, delay = 0, highlight }: { text: string; enabled: boolean; delay?: number; highlight?: string }) {
  const [count, setCount] = useState(enabled ? 0 : text.length);
  useEffect(() => {
    if (!enabled) return;
    let i = 0;
    let timer = 0;
    const start = window.setTimeout(() => {
      timer = window.setInterval(() => {
        i += 2;
        setCount(Math.min(i, text.length));
        if (i >= text.length) window.clearInterval(timer);
      }, TYPE_MS);
    }, delay);
    return () => {
      window.clearTimeout(start);
      window.clearInterval(timer);
    };
  }, [text, enabled, delay]);
  const shown = enabled ? text.slice(0, count) : text;
  const typing = enabled && count < text.length;
  const caret = typing ? <span aria-hidden className="ml-[2px] inline-block h-[1em] w-[2px] translate-y-[2px] animate-pulse bg-[var(--color-hr-accent)]" /> : null;
  if (!highlight) {
    return (
      <>
        {shown}
        {caret}
      </>
    );
  }
  const parts = shown.split(highlight);
  return (
    <>
      {parts.map((part, index) => (
        <span key={index}>
          {part}
          {index < parts.length - 1 ? <span className="gradient-text-brand gradient-text-brand-services font-bold">{highlight}</span> : null}
        </span>
      ))}
      {caret}
    </>
  );
}

const CHIP =
  "motion-interactive inline-flex shrink-0 items-center gap-[8px] rounded-full border px-[14px] py-[7px] text-[14px] leading-[18px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-hr-accent)]";
// WHY: 60% white on the dark panel measured 2.7:1 at 13px; 80% clears WCAG AA while the off state still reads as muted.
const CHIP_OFF = "border-[var(--color-border-inverse-15)] text-[var(--color-text-inverse-80)] hover:border-[var(--color-border-inverse-20)] hover:text-[var(--color-text-inverse-95)]";
const CHIP_ON = "border-[var(--color-hr-accent)] bg-[color-mix(in_srgb,var(--color-hr-accent)_18%,transparent)] text-[var(--color-hr-pure-white)]";
const STEP = "text-[11px] uppercase tracking-[0.08em] text-[var(--color-text-inverse-60)]";

interface AnswerEngineProps {
  scenarios: AiScenario[];
  sources: AiSource[];
  disclaimer: string;
}

export function AnswerEngine({ scenarios, sources, disclaimer }: AnswerEngineProps) {
  const { ref, revealed, animate } = useReveal<HTMLDivElement>(0.3);
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [model, setModel] = useState<ModelId>("chatgpt");
  const [withUs, setWithUs] = useState(false);
  const [manual, setManual] = useState(false);
  const [interactedAt, setInteractedAt] = useState(0);
  const [held, setHeld] = useState(false);
  const [reading, setReading] = useState(false);
  const [focused, setFocused] = useState(false);
  const [nudge, setNudge] = useState(false);
  const [tipIndex, setTipIndex] = useState<number | null>(null);
  const [cycle, setCycle] = useState(0);
  const nudged = useRef(false);

  const scenario = scenarios[scenarioIndex] ?? scenarios[0];
  const paused = held || reading || focused;
  const playing = animate && revealed && !manual;
  const autoplay = playing && !paused;
  const stateKey = `${scenarioIndex}-${withUs}-${cycle}`;
  const stateMs = withUs ? WITH_MS : WITHOUT_MS;

  // WHY: a pause must resume where it was, so the time left in the current
  // state is tracked across pauses and only resets when the state changes
  // (or the show restarts after a manual take-over).
  const remaining = useRef(stateMs);
  useEffect(() => {
    remaining.current = withUs ? WITH_MS : WITHOUT_MS;
  }, [stateKey, manual, withUs]);

  useEffect(() => {
    if (!autoplay) return;
    const started = performance.now();
    const timer = window.setTimeout(() => {
      if (!withUs) {
        setWithUs(true);
      } else {
        setWithUs(false);
        setScenarioIndex((index) => (index + 1) % Math.max(1, scenarios.length));
        setCycle((n) => n + 1);
        if (!nudged.current) {
          nudged.current = true;
          setNudge(true);
        }
      }
    }, remaining.current);
    return () => {
      window.clearTimeout(timer);
      remaining.current = Math.max(0, remaining.current - (performance.now() - started));
    };
  }, [autoplay, stateKey, withUs, scenarios.length]);

  useEffect(() => {
    if (!nudge) return;
    const timer = window.setTimeout(() => setNudge(false), NUDGE_MS);
    return () => window.clearTimeout(timer);
  }, [nudge]);

  // WHY: a click hands control over, but a visitor who clicks once and keeps
  // scrolling should not be left with a frozen panel. The show resumes after a quiet spell.
  useEffect(() => {
    if (!manual) return;
    const timer = window.setTimeout(() => setManual(false), RESUME_MS);
    return () => window.clearTimeout(timer);
  }, [manual, interactedAt]);

  const takeOver = useCallback(() => {
    setManual(true);
    setInteractedAt(Date.now());
    setNudge(false);
    nudged.current = true;
  }, []);
  const pickScenario = (index: number) => {
    takeOver();
    setScenarioIndex(index);
    setWithUs(false);
    setCycle((n) => n + 1);
  };
  const pickModel = (id: ModelId) => {
    takeOver();
    setModel(id);
    setCycle((n) => n + 1);
  };
  const toggle = (next: boolean) => {
    takeOver();
    setWithUs(next);
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch" || event.pointerType === "pen") setHeld(true);
  };
  const release = () => setHeld(false);
  // WHY: only keyboard focus pauses; a mouse click also focuses the button it hit, and that must not freeze the show.
  const onFocus = (event: ReactFocusEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (typeof target.matches === "function" && target.matches(":focus-visible")) setFocused(true);
  };
  const onBlur = (event: ReactFocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false);
  };
  // WHY: pointerenter rather than mouseenter, so a tap on a phone does not leave the panel "being read" forever.
  const readingEnter = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse") setReading(true);
  };
  const readingLeave = () => setReading(false);

  const prompt = scenario?.prompt ?? "";
  const answerText = withUs ? (scenario?.answerWith ?? "") : (scenario?.answerWithout ?? "");
  const active = withUs ? ACTIVE.with : ACTIVE.without;
  const sourceRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const graphRef = useRef<HTMLDivElement>(null);
  const modelRef = useRef<HTMLDivElement>(null);
  const edges = useEdges(graphRef, sourceRefs, modelRef, [sources.length, revealed]);
  const tip = tipIndex != null ? sources[tipIndex] : null;

  const citations = withUs
    ? [{ label: `${BRAND} (heroicrankings.com)`, brand: true }, ...sources.slice(1).map((s) => ({ label: s.label, brand: false }))]
    : [{ label: "heroicrankings.com (not found)", brand: false, missing: true }, { label: "competitor-a.com", brand: false }, { label: "competitor-b.com", brand: false }];

  // WHY: the two halves share 300px on a phone; the full brand name clips there, so phones get the short form.
  const switchOptions: Array<{ value: boolean; label: string; shortLabel: string }> = [
    { value: false, label: "Without us", shortLabel: "Without us" },
    { value: true, label: `With ${BRAND}`, shortLabel: "With Heroic" },
  ];

  return (
    <div
      aria-label="How answer engines decide who to recommend"
      className="surface-chart rounded-[30px] p-[18px] text-[var(--color-hr-pure-white)] lg:rounded-[40px] lg:p-[32px]"
      data-cycle={cycle}
      data-playing={autoplay}
      onBlur={onBlur}
      onFocus={onFocus}
      onPointerCancel={release}
      onPointerDown={onPointerDown}
      onPointerUp={release}
      ref={ref}
      role="group"
    >
      {/* Scenario chips + model tabs */}
      <div className="flex flex-col gap-[14px] lg:flex-row lg:items-center lg:justify-between">
        <div className="-mx-[18px] flex gap-[8px] overflow-x-auto px-[18px] [scrollbar-width:none] lg:mx-0 lg:flex-wrap lg:px-0" role="tablist" aria-label="Buyer scenario">
          <span className="hidden shrink-0 self-center text-[13px] text-[var(--color-text-inverse-50)] lg:inline">A buyer asks about</span>
          {scenarios.map((item, index) => (
            <button
              aria-selected={index === scenarioIndex}
              className={cn(CHIP, index === scenarioIndex ? CHIP_ON : CHIP_OFF)}
              key={item.id}
              onClick={() => pickScenario(index)}
              role="tab"
              type="button"
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="flex gap-[6px]" role="tablist" aria-label="Answer engine">
          {MODELS.map((id) => (
            <button
              aria-label={MODEL_MARKS[id].label}
              aria-selected={id === model}
              className={cn(
                "motion-interactive inline-flex size-[40px] items-center justify-center rounded-full border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-hr-accent)]",
                id === model ? "border-[var(--color-hr-accent)] bg-[color-mix(in_srgb,var(--color-hr-accent)_18%,transparent)] text-[var(--color-hr-pure-white)]" : "border-[var(--color-border-inverse-15)] text-[var(--color-text-inverse-50)] hover:text-[var(--color-text-inverse-95)]",
              )}
              key={id}
              onClick={() => pickModel(id)}
              role="tab"
              title={MODEL_MARKS[id].label}
              type="button"
            >
              <ModelMark className="size-[18px]" id={id} />
            </button>
          ))}
        </div>
      </div>

      {/* The switch: the one control that matters, with the autoplay progress inside the active half */}
      <div className="mt-[18px] flex flex-col gap-[10px] lg:mt-[24px] lg:flex-row lg:items-center lg:justify-between lg:gap-[20px]">
        <div
          aria-label="Compare the answer without and with our work"
          className={cn("grid grid-cols-2 rounded-full border border-[var(--color-border-inverse-15)] bg-[var(--color-surface-inverse-10)] p-[4px] lg:inline-flex lg:self-start", nudge && "answer-engine-nudge")}
          role="group"
        >
          {switchOptions.map((option) => {
            const selected = option.value === withUs;
            return (
              <button
                aria-pressed={selected}
                className={cn(
                  "relative overflow-hidden whitespace-nowrap rounded-full px-[14px] py-[10px] text-[14px] leading-[18px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-hr-accent)] lg:px-[20px] lg:text-[15px]",
                  selected ? "bg-[var(--color-hr-pure-white)] text-[var(--color-hr-dark)]" : "text-[var(--color-text-inverse-80)] hover:text-[var(--color-hr-pure-white)]",
                )}
                key={option.label}
                onClick={() => toggle(option.value)}
                type="button"
              >
                <span className="relative z-10 lg:hidden">{option.shortLabel}</span>
                <span className="relative z-10 hidden lg:inline">{option.label}</span>
                {selected && playing ? (
                  <span
                    aria-hidden
                    className="answer-engine-progress absolute inset-x-[12px] bottom-[5px] h-[2px] origin-left rounded-full bg-[var(--color-hr-accent)]"
                    data-paused={paused}
                    key={stateKey}
                    style={{ "--progress-duration": `${stateMs}ms` } as CSSProperties}
                  />
                ) : null}
              </button>
            );
          })}
        </div>
        <p className="text-[13px] leading-[18px] text-[var(--color-text-inverse-60)] lg:text-right" aria-live="polite">
          {nudge ? (
            <span className="text-[var(--color-text-inverse-95)]">Try it: pick a question above, or flip the switch.</span>
          ) : playing ? (
            <>
              Plays on its own. <span className="lg:hidden">Tap</span>
              <span className="hidden lg:inline">Click</span> anything to take over.
            </>
          ) : manual ? (
            "You're in control. It resumes after a short pause."
          ) : (
            "Pick a question or flip the switch."
          )}
        </p>
      </div>

      {/* Step 1: the question */}
      <p className={cn(STEP, "mt-[18px] lg:mt-[24px]")}>01 · A buyer asks</p>
      <div className="mt-[8px] flex items-start gap-[12px] rounded-[18px] border border-[var(--color-border-inverse-10)] bg-[var(--color-surface-inverse-10)] px-[16px] py-[14px]">
        <span aria-hidden className="mt-[7px] inline-block size-[8px] shrink-0 rounded-full bg-[var(--color-hr-accent)]" />
        <p className="min-h-[22px] text-[15px] leading-[22px] text-[var(--color-text-inverse-95)] lg:text-[17px] lg:leading-[24px]">
          <span className="sr-only">Question: </span>
          <TypedText enabled={animate && revealed} key={`${scenario?.id}-${cycle}`} text={prompt} />
        </p>
      </div>

      {/* Steps 2 and 3: the graph and the answer */}
      <div className="mt-[18px] grid gap-[18px] lg:mt-[24px] lg:grid-cols-[1.15fr_1fr] lg:gap-[28px]">
        <div>
          <p className={STEP}>02 · The AI checks the sources it trusts</p>
          <div className="relative mt-[8px] flex min-h-[330px] items-stretch justify-between gap-[16px] lg:min-h-[340px]" ref={graphRef}>
            <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" viewBox={`0 0 ${Math.max(1, edges.size[0])} ${Math.max(1, edges.size[1])}`} preserveAspectRatio="none">
              <defs>
                <linearGradient id="answer-engine-edge" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor="#826FFF" />
                  <stop offset="100%" stopColor="#E188FF" />
                </linearGradient>
              </defs>
              {edges.paths.map((edge, i) => (
                <g key={i}>
                  <path className="answer-engine-edge-base" d={edge.d} />
                  <path className={cn("answer-engine-edge", active[i] && revealed && "is-on")} d={edge.d} style={{ "--edge-delay": `${200 + i * 140}ms` } as CSSProperties} />
                </g>
              ))}
            </svg>

            {/* Source nodes: real buttons in flow, so the layout holds at every width */}
            <div className="relative z-10 flex flex-col justify-between py-[6px]">
              {sources.map((source, i) => (
                <button
                  aria-label={`${source.label}: ${source.detail} Earned by ${source.services.map((service) => service.label).join(" + ")}.`}
                  className={cn(
                    "answer-engine-node flex items-center gap-[10px] self-start rounded-full border py-[5px] pl-[5px] pr-[12px] text-left text-[13px] leading-[16px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-hr-accent)] lg:py-[6px] lg:pl-[6px] lg:pr-[14px] lg:text-[14px]",
                    active[i]
                      ? "border-[var(--color-hr-accent)] bg-[color-mix(in_srgb,var(--color-hr-accent)_16%,var(--color-hr-dark))] text-[var(--color-hr-pure-white)]"
                      : // WHY: unlit sources stay muted but at 60% white they clear 4.5:1 on the dark panel (30% measured 2.7:1).
                        "border-[var(--color-border-inverse-10)] bg-[var(--color-hr-dark)] text-[var(--color-text-inverse-60)]",
                    tipIndex === i && "ring-2 ring-[var(--color-hr-accent)]",
                  )}
                  key={source.id}
                  onBlur={() => setTipIndex((current) => (current === i ? null : current))}
                  onClick={() => setTipIndex(i)}
                  onFocus={() => setTipIndex(i)}
                  onMouseEnter={() => setTipIndex(i)}
                  ref={(element) => {
                    sourceRefs.current[i] = element;
                  }}
                  type="button"
                >
                  <span className={cn("inline-flex size-[28px] shrink-0 items-center justify-center rounded-full lg:size-[30px]", active[i] ? "bg-[var(--color-hr-accent)] text-[var(--color-hr-dark)]" : "bg-[var(--color-surface-inverse-10)]")}>
                    <SourceIcon className="size-[16px]" id={source.id} />
                  </span>
                  {source.label}
                </button>
              ))}
            </div>

            {/* The model */}
            <div className="relative z-10 flex items-center">
              <div
                className={cn(
                  "flex size-[84px] flex-col items-center justify-center gap-[6px] rounded-[22px] border border-[var(--color-border-inverse-15)] bg-[var(--color-surface-inverse-10)] text-[var(--color-hr-pure-white)] transition-transform duration-500 lg:size-[96px]",
                  withUs && "scale-105 border-[var(--color-hr-accent)]",
                )}
                ref={modelRef}
              >
                <ModelMark className="size-[28px] lg:size-[32px]" id={model} />
                <span className="text-[10px] uppercase tracking-[0.08em] text-[var(--color-text-inverse-60)] lg:text-[11px]">{MODEL_MARKS[model].label}</span>
              </div>
            </div>
          </div>
          <p className="mt-[10px] text-[13px] leading-[18px] text-[var(--color-text-inverse-60)]">
            AI tools only recommend brands they find in several places they trust. <span className="text-[var(--color-text-inverse-95)]">Lit sources are where you were found.</span>
          </p>
        </div>

        {/* Answer card: the one place a visitor reads, so the mouse resting here pauses the show */}
        <div>
          <p className={STEP}>03 · The AI answers</p>
          <div
            aria-live="polite"
            className="mt-[8px] flex h-[calc(100%-26px)] flex-col rounded-[22px] border border-[var(--color-border-inverse-10)] bg-[var(--color-hr-dark)] p-[18px] lg:p-[22px]"
            onPointerEnter={readingEnter}
            onPointerLeave={readingLeave}
          >
            <div className="flex items-center gap-[10px] text-[13px] text-[var(--color-text-inverse-60)]">
              <ModelMark className="size-[16px] text-[var(--color-hr-pure-white)]" id={model} />
              <span>{MODEL_MARKS[model].label} replies</span>
              <span
                className={cn(
                  "ml-auto rounded-full px-[10px] py-[3px] text-[11px] uppercase tracking-[0.06em]",
                  withUs ? "bg-[color-mix(in_srgb,var(--color-hr-accent)_22%,transparent)] text-[var(--color-hr-pure-white)]" : "border border-[var(--color-border-inverse-15)] text-[var(--color-text-inverse-50)]",
                )}
              >
                {withUs ? "You are the answer" : "You were not found"}
              </span>
            </div>
            <p className="mt-[14px] min-h-[132px] text-[15px] leading-[22px] text-[var(--color-text-inverse-95)] lg:min-h-[150px] lg:text-[16px] lg:leading-[24px]">
              <TypedText delay={900} enabled={animate && revealed} highlight={BRAND} key={`${scenario?.id}-${withUs}-${cycle}`} text={answerText} />
            </p>
            <div className="mt-auto border-t border-[var(--color-border-inverse-10)] pt-[12px]">
              <p className="text-[11px] uppercase tracking-[0.08em] text-[var(--color-text-inverse-60)]">Cited sources</p>
              <ul className="mt-[8px] flex flex-wrap gap-[6px]">
                {citations.map((item) => (
                  <li
                    className={cn(
                      "rounded-full border px-[10px] py-[4px] text-[12px] leading-[16px]",
                      item.brand ? "border-[var(--color-hr-accent)] bg-[color-mix(in_srgb,var(--color-hr-accent)_18%,transparent)] text-[var(--color-hr-pure-white)]" : "border-[var(--color-border-inverse-15)] text-[var(--color-text-inverse-60)]",
                      "missing" in item && item.missing ? "line-through decoration-[var(--color-text-inverse-50)]" : null,
                    )}
                    key={item.label}
                  >
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Source tip */}
      <p className="mt-[18px] text-[13px] leading-[18px] text-[var(--color-text-inverse-60)] lg:mt-[24px]" aria-live="polite">
        {tip ? (
          <>
            <span className="text-[var(--color-text-inverse-95)]">{tip.label}:</span> {tip.detail} Earned by{" "}
            {tip.services.map((service, index) => (
              <span key={service.label}>
                {index > 0 ? " + " : null}
                <AppLink className="text-[var(--color-hr-pure-white)] underline decoration-[var(--color-hr-accent)] underline-offset-4" href={service.href} motionPreset="none">
                  {service.label}
                </AppLink>
              </span>
            ))}
            .
          </>
        ) : (
          "Hover or tap a source to see which service earns it."
        )}
      </p>
      <p className="mt-[14px] text-[11px] leading-[16px] text-[var(--color-text-inverse-50)]">{disclaimer}</p>
    </div>
  );
}
