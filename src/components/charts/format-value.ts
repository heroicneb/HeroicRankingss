import type { ValueFormat } from "./time-series-chart-types";

/** Axis-style short number: 1,200 → 1.2K, 3,200,000 → 3.2M. */
export function formatCompact(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) {
    const m = value / 1_000_000;
    return `${Number.isInteger(m) ? m : m.toFixed(1)}M`;
  }
  if (abs >= 1000) {
    const k = value / 1000;
    return `${Number.isInteger(k) ? k : k.toFixed(1)}K`;
  }
  return `${value}`;
}

/** Full value for tooltips and tables. */
export function formatValue(value: number, format: ValueFormat = "number"): string {
  switch (format) {
    case "currency":
      return `$${value.toLocaleString("en-US", { maximumFractionDigits: value < 100 ? 2 : 0 })}`;
    case "percent":
      return `${value.toLocaleString("en-US", { maximumFractionDigits: 2 })}%`;
    case "compact":
      return formatCompact(value);
    default:
      return value.toLocaleString("en-US");
  }
}

/** Short value for axis ticks. */
export function formatAxis(value: number, format: ValueFormat = "compact"): string {
  switch (format) {
    case "currency":
      return `$${formatCompact(value)}`;
    case "percent":
      return `${value}%`;
    case "number":
      return `${value}`;
    default:
      return formatCompact(value);
  }
}
