"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import type { CaseStudyGrowthChartData } from "@/lib/sanity-data";

import { SERIES_COLORS, SERIES_DOTS, SERIES_STROKES } from "./growth-chart-colors";

const GRID = "#2A2A2A";
const TICK = "#535353";
const AXIS_FONT = { fontSize: 14, fontFamily: "inherit" };

/**
 * WHY: the frame has two value axes — organic traffic on the left (0–70k) and
 * domains / domain rating on the right (0–700). Series whose label mentions
 * traffic use the left axis; everything else uses the right one.
 */
function axisFor(label: string): "left" | "right" {
  return /traffic|visitor|impression|click/i.test(label) ? "left" : "right";
}

/** WHY: the frame rounds each axis up to a clean top (63.5k → 70k, 597 → 700). */
function niceMax(max: number): number {
  if (max <= 0) return 1;
  const step = 10 ** Math.floor(Math.log10(max));
  return Math.ceil(max / step) * step;
}

// WHY: small ranges (e.g. 0–2,000) need one decimal or several ticks read as the same "2k".
const formatLeft = (value: number) => {
  if (value < 1000) return `${value}`;
  const k = value / 1000;
  return `${Number.isInteger(k) ? k : k.toFixed(1)}k`;
};

interface TooltipPayload {
  name: string;
  value: number;
  color?: string;
  dataKey?: string;
}

/** Tooltip card (Figma 2255:1239): bold month + one pill per series. */
function ChartTooltip({ active, label, payload, colors }: { active?: boolean; label?: string; payload?: TooltipPayload[]; colors: Record<string, string> }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="flex flex-col gap-[10px] rounded-[30px] border border-[var(--color-hr-dark-line)] bg-[var(--color-hr-dark)] p-[15px]">
      <p className="text-[18px] font-bold leading-[24px] text-[var(--color-hr-pure-white)]">{label}</p>
      <div className="flex flex-col gap-[5px]">
        {payload.map((entry) => (
          <div
            className="flex items-center gap-[10px] rounded-[10px] border border-[var(--color-hr-grey)] bg-[color-mix(in_srgb,var(--color-hr-pure-white)_2%,transparent)] px-[12px] py-[8px] text-[18px] leading-[24px] text-[var(--color-hr-pure-white)]"
            key={entry.name}
          >
            <span aria-hidden className="size-[12px] rounded-full" style={{ background: colors[entry.name] }} />
            {entry.name}: {typeof entry.value === "number" ? entry.value.toLocaleString("en-US") : entry.value}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CaseStudyGrowthChartClient({ data }: { data: CaseStudyGrowthChartData }) {
  const months = data.months ?? [];
  const series = data.series ?? [];
  const chartData = months.map((month, i) => {
    const row: Record<string, string | number | undefined> = { month };
    for (const s of series) row[s.label] = i < s.points.length ? s.points[i] : undefined;
    return row;
  });
  const legendColors: Record<string, string> = Object.fromEntries(series.map((s) => [s.label, SERIES_COLORS[s.color] ?? SERIES_COLORS["gradient-light"] ?? "#BE7FFF"]));
  const hasLeft = series.some((s) => axisFor(s.label) === "left");
  const hasRight = series.some((s) => axisFor(s.label) === "right");

  return (
    <ResponsiveContainer height="100%" width="100%">
      <LineChart data={chartData} margin={{ top: 12, right: 8, bottom: 8, left: 8 }}>
        <defs>
          <linearGradient id="case-study-chart-gradient" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#826FFF" />
            <stop offset="50%" stopColor="#E188FF" />
            <stop offset="100%" stopColor="#E1BDFF" />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={GRID} strokeWidth={1} />
        {/* WHY: monthly exports have 25+ points; keep labels legible by spacing ticks at least 48px apart. */}
        <XAxis axisLine={false} dataKey="month" dy={12} interval="preserveStartEnd" minTickGap={48} tick={{ fill: TICK, ...AXIS_FONT }} tickLine={false} />
        {hasLeft ? (
          <YAxis
            axisLine={false}
            label={{ value: data.leftAxisLabel ?? "", angle: -90, position: "insideLeft", fill: "#BE7FFF", fontSize: 14, dx: -4 }}
            domain={[0, (max: number) => niceMax(max)]}
            tick={{ fill: "#FFFFFF", ...AXIS_FONT }}
            tickCount={8}
            tickFormatter={formatLeft}
            tickLine={false}
            width={64}
            yAxisId="left"
          />
        ) : null}
        {hasRight ? (
          <YAxis
            axisLine={false}
            label={{ value: data.rightAxisLabel ?? "", angle: 90, position: "insideRight", fill: "#BE7FFF", fontSize: 14, dx: 4 }}
            domain={[0, (max: number) => niceMax(max)]}
            orientation="right"
            tick={{ fill: "#FFFFFF", ...AXIS_FONT }}
            tickCount={8}
            tickLine={false}
            width={56}
            yAxisId="right"
          />
        ) : null}
        <Tooltip content={<ChartTooltip colors={legendColors} />} cursor={{ stroke: GRID }} wrapperStyle={{ outline: "none" }} />
        {series.map((s) => (
          <Line
            activeDot={{ r: 6, stroke: "#151419", strokeWidth: 2, fill: SERIES_DOTS[s.color] ?? SERIES_DOTS["gradient-light"] }}
            dataKey={s.label}
            dot={{ r: 4, stroke: "#151419", strokeWidth: 2, fill: SERIES_DOTS[s.color] ?? SERIES_DOTS["gradient-light"] }}
            isAnimationActive={false}
            key={s.label}
            stroke={SERIES_STROKES[s.color] ?? SERIES_STROKES["gradient-light"]}
            strokeWidth={3}
            type="monotone"
            yAxisId={axisFor(s.label)}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
