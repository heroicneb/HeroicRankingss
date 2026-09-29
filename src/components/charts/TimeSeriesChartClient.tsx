"use client";

import { Area, CartesianGrid, ComposedChart, Line, ReferenceArea, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { CHART_GRADIENT_STOPS, CHART_THEME, SERIES_SOLID, SERIES_SWATCH } from "./chart-theme";
import type { TimeSeries, TimeSeriesChartSpec } from "./time-series-chart-types";

const AXIS_FONT = { fontSize: 12, fontFamily: "inherit" };
const DRAW_DURATION = 1400;
const FORECAST_KEY_SUFFIX = "__forecast";

type Row = Record<string, string | number | boolean | null | [number, number] | undefined> & { label: string; forecast: boolean };

const formatCompact = (value: number) => {
  if (Math.abs(value) < 1000) return `${value}`;
  const k = value / 1000;
  return `${Number.isInteger(k) ? k : k.toFixed(1)}K`;
};
const formatPlain = (value: number) => `${value}`;
const formatFull = (value: number) => value.toLocaleString("en-US");

/**
 * WHY: a line can only carry one dash pattern, so the forecast part of each
 * series is split into a second key that starts at the boundary point. The
 * two segments share that point, so the join is seamless.
 */
function buildRows(spec: TimeSeriesChartSpec): Row[] {
  const forecastFrom = spec.variant === "forecast" ? (spec.forecastFrom ?? spec.labels.length) : spec.labels.length;
  const low = spec.series.find((s) => s.bandRole === "low");
  const high = spec.series.find((s) => s.bandRole === "high");

  return spec.labels.map((label, i) => {
    const row: Row = { label, forecast: i >= forecastFrom };
    for (const s of spec.series) {
      const value = s.values[i] ?? null;
      if (spec.variant === "forecast") {
        row[s.key] = i <= forecastFrom ? value : null;
        row[`${s.key}${FORECAST_KEY_SUFFIX}`] = i >= forecastFrom ? value : null;
      } else {
        row[s.key] = value;
      }
    }
    if (low && high) {
      const lo = low.values[i];
      const hi = high.values[i];
      row.band = lo != null && hi != null ? [lo, hi] : null;
    }
    return row;
  });
}

interface TooltipProps {
  active?: boolean;
  payload?: ReadonlyArray<{ payload?: Row }>;
  spec: TimeSeriesChartSpec;
}

/** Compact dark card: month, metric, one row per series. */
function ChartTooltip({ active, payload, spec }: TooltipProps) {
  const row = payload?.[0]?.payload;
  if (!active || !row) return null;
  return (
    <div className="min-w-[180px] rounded-[14px] border border-[var(--color-border-inverse-15)] bg-[var(--color-hr-dark)] px-[14px] py-[12px] text-[var(--color-hr-pure-white)] shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
      <p className="flex items-center justify-between gap-3 text-[14px] font-bold leading-[20px]">
        <span>{row.label}</span>
        {row.forecast ? (
          <span className="rounded-full border border-[var(--color-border-inverse-20)] px-[8px] py-[1px] text-[11px] font-normal uppercase tracking-[0.04em] text-[var(--color-text-inverse-60)]">
            Forecast
          </span>
        ) : null}
      </p>
      <p className="mt-[2px] text-[12px] leading-[16px] text-[var(--color-text-inverse-50)]">{spec.metricLabel}</p>
      <ul className="mt-[10px] flex flex-col gap-[6px]">
        {spec.series.map((s) => {
          const raw = row[s.key] ?? row[`${s.key}${FORECAST_KEY_SUFFIX}`];
          const value = typeof raw === "number" ? formatFull(raw) : "—";
          return (
            <li className="flex items-center justify-between gap-4 text-[13px] leading-[18px]" key={s.key}>
              <span className="flex items-center gap-[8px] text-[var(--color-text-inverse-95)]">
                <span aria-hidden className="size-[9px] shrink-0 rounded-full" style={{ background: SERIES_SWATCH[s.color] }} />
                {s.label}
              </span>
              <span className="font-bold tabular-nums">{value}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function strokeFor(spec: TimeSeriesChartSpec, s: TimeSeries): string {
  return s.emphasis ? `url(#${spec.id}-stroke)` : SERIES_SOLID[s.color];
}

export default function TimeSeriesChartClient({ spec, animate }: { spec: TimeSeriesChartSpec; animate: boolean }) {
  const rows = buildRows(spec);
  const lineType = spec.variant === "step" ? "stepAfter" : "monotone";
  const formatAxis = spec.axisFormat === "plain" ? formatPlain : formatCompact;
  const last = spec.labels.length - 1;
  const forecastFrom = spec.forecastFrom ?? last;
  const forecastLabel = spec.labels[forecastFrom];
  const forecastFraction = last > 0 ? forecastFrom / last : 1;
  const emphasised = spec.series.find((s) => s.emphasis);
  const activeDot = (s: TimeSeries) => ({ r: 5, strokeWidth: 2, stroke: CHART_THEME.panel, fill: SERIES_SOLID[s.color] });

  return (
    <ResponsiveContainer height="100%" width="100%">
      <ComposedChart data={rows} desc="Use the left and right arrow keys to move between months." margin={{ top: 16, right: 12, bottom: 4, left: 0 }} title={spec.title}>
        <defs>
          <linearGradient id={`${spec.id}-stroke`} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor={CHART_GRADIENT_STOPS[0]} />
            <stop offset="55%" stopColor={CHART_GRADIENT_STOPS[1]} />
            <stop offset="100%" stopColor={CHART_GRADIENT_STOPS[2]} />
          </linearGradient>
          <linearGradient id={`${spec.id}-area`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={CHART_THEME.areaFillTop} />
            <stop offset="100%" stopColor={CHART_THEME.areaFillBottom} />
          </linearGradient>
          <linearGradient id={`${spec.id}-band`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={CHART_THEME.bandFillTop} />
            <stop offset="100%" stopColor={CHART_THEME.bandFillBottom} />
          </linearGradient>
        </defs>

        <CartesianGrid stroke={CHART_THEME.grid} strokeWidth={1} vertical={spec.variant !== "step"} />
        <XAxis axisLine={false} dataKey="label" dy={8} interval="preserveStartEnd" minTickGap={36} tick={{ fill: CHART_THEME.tick, ...AXIS_FONT }} tickLine={false} />
        <YAxis
          axisLine={false}
          domain={spec.yDomain ?? ["auto", "auto"]}
          tick={{ fill: CHART_THEME.tick, ...AXIS_FONT }}
          tickFormatter={formatAxis}
          tickLine={false}
          ticks={spec.yTicks}
          width={44}
        />

        {spec.variant === "forecast" && forecastFrom <= last ? (
          <>
            <ReferenceArea fill={CHART_THEME.forecastZone} ifOverflow="visible" stroke="none" x1={forecastLabel} x2={spec.labels[last]} />
            <ReferenceLine
              label={{ value: "Forecast", position: "insideTopLeft", fill: CHART_THEME.tick, fontSize: 11, dx: 6, dy: -4 }}
              stroke={CHART_THEME.forecastLine}
              strokeDasharray="4 4"
              x={forecastLabel}
            />
          </>
        ) : null}

        <Tooltip
          content={<ChartTooltip spec={spec} />}
          cursor={{ stroke: CHART_THEME.cursor, strokeWidth: 1, strokeDasharray: "4 4" }}
          isAnimationActive={false}
          wrapperStyle={{ outline: "none", zIndex: 5 }}
        />

        {/* Emphasised series: subtle gradient area under the line (line/step) or the scenario band. */}
        {spec.variant === "band" ? (
          <Area
            activeDot={false}
            animationDuration={DRAW_DURATION}
            dataKey="band"
            dot={false}
            fill={`url(#${spec.id}-band)`}
            isAnimationActive={animate}
            stroke="none"
            type="monotone"
          />
        ) : emphasised && spec.variant !== "forecast" ? (
          <Area
            activeDot={false}
            animationDuration={DRAW_DURATION}
            dataKey={emphasised.key}
            dot={false}
            fill={`url(#${spec.id}-area)`}
            isAnimationActive={animate}
            stroke="none"
            type={lineType}
          />
        ) : null}

        {spec.series.map((s, index) => (
          <Line
            activeDot={activeDot(s)}
            animationBegin={index * 90}
            animationDuration={spec.variant === "forecast" ? DRAW_DURATION * forecastFraction : DRAW_DURATION}
            animationEasing="ease-out"
            connectNulls={false}
            dataKey={s.key}
            dot={false}
            isAnimationActive={animate}
            key={s.key}
            stroke={strokeFor(spec, s)}
            strokeWidth={s.emphasis ? 3 : s.bandRole ? 1.5 : 2}
            type={lineType}
          />
        ))}

        {spec.variant === "forecast"
          ? spec.series.map((s, index) => (
              <Line
                activeDot={activeDot(s)}
                animationBegin={index * 90 + DRAW_DURATION * forecastFraction}
                animationDuration={DRAW_DURATION * (1 - forecastFraction)}
                animationEasing="ease-out"
                connectNulls={false}
                dataKey={`${s.key}${FORECAST_KEY_SUFFIX}`}
                dot={false}
                isAnimationActive={animate}
                key={`${s.key}${FORECAST_KEY_SUFFIX}`}
                stroke={strokeFor(spec, s)}
                strokeDasharray="6 5"
                strokeWidth={s.emphasis ? 3 : 2}
                type={lineType}
              />
            ))
          : null}
      </ComposedChart>
    </ResponsiveContainer>
  );
}
