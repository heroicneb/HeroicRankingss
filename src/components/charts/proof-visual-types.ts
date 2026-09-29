import type { SeriesColor } from "./chart-theme";
import type { TimeSeriesChartSpec, ValueFormat } from "./time-series-chart-types";

/** Headline number shown as a count-up tile. */
export interface StatSpec {
  label: string;
  /** Numeric values count up; strings render as-is. */
  value: number | string;
  format?: ValueFormat;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  /** Small secondary line, e.g. "+63.5K" or "All time 2K". */
  note?: string;
  /** 0–100 ring gauge drawn around the value (Domain Rating, URL Rating). */
  gauge?: number;
  accent?: boolean;
}

export interface MetricGroupSpec {
  title: string;
  stats: StatSpec[];
}

export type TableCellKind =
  /** Plain text. */
  | "text"
  /** Right-aligned number with thousands separators. */
  | "number"
  /** Google position badge (#1 gets the brand gradient). */
  | "position"
  /** "from → to" positions. */
  | "positionChange"
  /** Coloured 0–100 difficulty chip. */
  | "difficulty"
  /** Text with a gradient bar underneath proportional to `max`. */
  | "bar";

export interface TableColumnSpec {
  key: string;
  label: string;
  kind?: TableCellKind;
  format?: ValueFormat;
  /** For "bar" cells: the value that fills the whole bar. */
  max?: number;
  /** Hide on phones to keep the table readable. */
  optional?: boolean;
}

export type TableCellValue = string | number | null | [number, number];

export interface TableSpec {
  columns: TableColumnSpec[];
  rows: Array<Record<string, TableCellValue>>;
  /** Optional emphasised last row (totals). */
  footer?: Record<string, TableCellValue>;
  caption?: string;
}

/**
 * One analytics card visual: any combination of headline stats, a chart, a
 * table and metric groups, rendered in that order on the dark brand panel.
 */
export interface ProofVisualSpec {
  id: string;
  /** Accessible name / Studio option label. */
  title: string;
  stats?: StatSpec[];
  chart?: TimeSeriesChartSpec;
  table?: TableSpec;
  metrics?: MetricGroupSpec[];
  /** Where the numbers come from (editors only, not rendered). */
  source?: string;
  /** Legend swatch overrides, e.g. to name the competitor colour. */
  legend?: Array<{ label: string; color: SeriesColor }>;
}
