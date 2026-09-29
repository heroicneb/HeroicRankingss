"use client";

import { CountUp } from "@/components/motion/count-up";
import { cn } from "@/lib/cn";

import { CHART_GRADIENT_STOPS, CHART_THEME } from "./chart-theme";
import { formatCompact } from "./format-value";
import type { StatSpec } from "./proof-visual-types";

const RING_RADIUS = 20;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

/**
 * WHY: big numbers count up in their short form (63.5K, $3.2M) so the tile
 * width never jumps; the exact value is in the title attribute and the
 * screen-reader text.
 */
function CompactCountUp({ value, prefix = "", suffix = "", decimals }: { value: number; prefix?: string; suffix?: string; decimals?: number }) {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return <CountUp decimals={1} prefix={prefix} suffix={`M${suffix}`} value={value / 1_000_000} />;
  if (abs >= 1000 && decimals == null) return <CountUp decimals={abs >= 100_000 ? 0 : 1} prefix={prefix} suffix={`K${suffix}`} value={value / 1000} />;
  return <CountUp decimals={decimals ?? 0} prefix={prefix} suffix={suffix} value={value} />;
}

function Gauge({ percent, animate }: { percent: number; animate: boolean }) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <svg aria-hidden className="size-[44px] shrink-0 -rotate-90" viewBox="0 0 48 48">
      <circle cx="24" cy="24" fill="none" r={RING_RADIUS} stroke={CHART_THEME.grid} strokeWidth="5" />
      <circle
        className={cn(animate && "transition-[stroke-dashoffset] duration-[1400ms] ease-out")}
        cx="24"
        cy="24"
        fill="none"
        r={RING_RADIUS}
        stroke={`url(#gauge-gradient-${Math.round(clamped)})`}
        strokeDasharray={RING_LENGTH}
        strokeDashoffset={RING_LENGTH * (1 - clamped / 100)}
        strokeLinecap="round"
        strokeWidth="5"
      />
      <defs>
        <linearGradient id={`gauge-gradient-${Math.round(clamped)}`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor={CHART_GRADIENT_STOPS[0]} />
          <stop offset="100%" stopColor={CHART_GRADIENT_STOPS[1]} />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function StatTile({ stat, animate }: { stat: StatSpec; animate: boolean }) {
  const numeric = typeof stat.value === "number";
  const prefix = stat.prefix ?? (stat.format === "currency" ? "$" : "");
  const suffix = stat.suffix ?? (stat.format === "percent" ? "%" : "");
  const exact = numeric ? `${prefix}${(stat.value as number).toLocaleString("en-US")}${suffix}` : String(stat.value);
  return (
    <div className="flex min-w-0 items-center gap-[10px] rounded-[14px] border border-[var(--color-border-inverse-10)] bg-[var(--color-surface-inverse-10)] px-[12px] py-[10px] lg:px-[14px] lg:py-[12px]">
      {stat.gauge != null ? <Gauge animate={animate} percent={stat.gauge} /> : null}
      <div className="min-w-0">
        <p className="text-[12px] leading-[15px] text-[var(--color-text-inverse-60)]">{stat.label}</p>
        <p className={cn("mt-[2px] text-[22px] font-bold leading-[26px] tracking-[-0.02em] tabular-nums lg:text-[24px]", stat.accent && "gradient-text-brand")} title={exact}>
          {numeric && animate ? (
            <CompactCountUp decimals={stat.decimals} prefix={prefix} suffix={suffix} value={stat.value as number} />
          ) : numeric ? (
            `${prefix}${formatCompact(stat.value as number)}${suffix}`
          ) : (
            stat.value
          )}
          <span className="sr-only"> ({exact})</span>
        </p>
        {stat.note ? <p className="mt-[2px] text-[12px] leading-[15px] text-[var(--color-text-inverse-50)]">{stat.note}</p> : null}
      </div>
    </div>
  );
}

export function ProofStats({ stats, animate, columns = 3 }: { stats: StatSpec[]; animate: boolean; columns?: 2 | 3 | 4 }) {
  return (
    <div className={cn("grid gap-[8px]", columns === 2 ? "grid-cols-2" : columns === 4 ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-2 lg:grid-cols-3")}>
      {stats.map((stat) => (
        <StatTile animate={animate} key={stat.label} stat={stat} />
      ))}
    </div>
  );
}
