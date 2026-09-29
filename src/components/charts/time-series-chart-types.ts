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

export interface TimeSeries {
  key: string;
  label: string;
  color: SeriesColor;
  /** Drawn thicker with the brand gradient and (for line/forecast) an area fill. */
  emphasis?: boolean;
  /** Role inside a "band" chart. */
  bandRole?: "low" | "high" | "mid";
  values: Array<number | null>;
}

export interface TimeSeriesChartSpec {
  id: string;
  /** Accessible title (also used for the screen-reader data table caption). */
  title: string;
  /** Shown in the tooltip header, e.g. "Domain Rating". */
  metricLabel: string;
  variant: TimeSeriesVariant;
  /** One label per point, e.g. "Mar 2023". */
  labels: string[];
  /** Index from which values are forecast (inclusive). Only used by "forecast". */
  forecastFrom?: number;
  series: TimeSeries[];
  yDomain?: [number, number];
  yTicks?: number[];
  /** "compact" renders 1,200 as 1.2K on the axis; tooltips always show the full number. */
  axisFormat?: "compact" | "plain";
  /** Where the numbers come from; surfaced to editors only (not rendered). */
  source?: string;
}
