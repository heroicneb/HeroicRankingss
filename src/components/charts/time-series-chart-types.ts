import type { SeriesColor } from "./chart-theme";

/**
 * Presentation-agnostic model for the interactive time-series charts.
 * Data modules (e.g. `link-building/competitor-insights-charts.ts`) build
 * these; `TimeSeriesChart` renders them.
 */
export type TimeSeriesVariant =
  /** Stepped lines — for discrete scores that change in jumps (Domain Rating). */
  | "step"
  /** Smooth lines with a gradient area under the emphasised series. */
  | "line"
  /** Smooth lines with a shaded forecast zone; forecast segments are dashed. */
  | "forecast"
  /** A shaded band between a low and a high series with a trend line between them. */
  | "band";

export type ValueFormat = "number" | "compact" | "currency" | "percent";

export interface TimeSeries {
  key: string;
  label: string;
  color: SeriesColor;
  /** Drawn thicker with the brand gradient and (for line/forecast) an area fill. */
  emphasis?: boolean;
  /** Role inside a "band" chart. */
  bandRole?: "low" | "high" | "mid";
  /** Plot against the right-hand axis (needs `yRight` on the spec). */
  axis?: "left" | "right";
  /** Draw this series as bars instead of a line. */
  draw?: "line" | "bar";
  /** Overrides the axis format in the tooltip for this series. */
  format?: ValueFormat;
  values: Array<number | null>;
}

export interface TimeSeriesChartSpec {
  id: string;
  /** Accessible title (also used for the screen-reader data table caption). */
  title: string;
  /** Shown in the tooltip header, e.g. "Domain Rating". */
  metricLabel: string;
  variant: TimeSeriesVariant;
  /** One label per point, e.g. "Mar 2023". Must be unique: recharts matches tooltip data by this text. */
  labels: string[];
  /**
   * What the axis and tooltip show for each point when it differs from
   * `labels`, e.g. month names without the year ("Mar"). Duplicates are fine here.
   */
  displayLabels?: string[];
  /** Index from which values are forecast (inclusive). Only used by "forecast". */
  forecastFrom?: number;
  series: TimeSeries[];
  yDomain?: [number, number];
  yTicks?: number[];
  /** "compact" renders 1,200 as 1.2K on the axis; tooltips always show the full number. */
  axisFormat?: "compact" | "plain";
  /** Value format for the left axis series (tooltip and, for currency/percent, the axis). */
  valueFormat?: ValueFormat;
  /** Right-hand axis, used by series with `axis: "right"`. */
  yRight?: { domain?: [number, number]; ticks?: number[]; format?: ValueFormat; label?: string };
  /** Y axis label shown next to the ticks (e.g. "Clicks"). */
  yLabel?: string;
  /** Where the numbers come from; surfaced to editors only (not rendered). */
  source?: string;
}
