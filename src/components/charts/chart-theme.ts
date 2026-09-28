/**
 * Chart-only palette. Recharts paints SVG presentation attributes, which do
 * not resolve CSS variables, so the values live here as plain colours (same
 * approach as `case-studies/parts/growth-chart-colors.ts`). Keep them in sync
 * with the brand tokens in `src/app/globals.css`:
 *   brand gradient  → --gradient-brand-light (#826fff → #e188ff → #e1bdff)
 *   violet          → --color-brand-600 (#7468cb)
 *   panel           → --color-bg-dark (#151419)
 */
export type SeriesColor = "brand" | "white" | "violet" | "muted" | "lavender" | "soft";

export const CHART_GRADIENT_STOPS = ["#826FFF", "#E188FF", "#E1BDFF"] as const;

/** Solid colour per series role (used for legend dots, active dots and non-gradient strokes). */
export const SERIES_SOLID: Record<SeriesColor, string> = {
  brand: "#BE7FFF",
  white: "rgba(255, 255, 255, 0.82)",
  violet: "#7468CB",
  muted: "#9A94B8",
  lavender: "#E1BDFF",
  soft: "rgba(255, 255, 255, 0.55)",
};

/** Legend swatch background per series role (the brand role shows the real gradient). */
export const SERIES_SWATCH: Record<SeriesColor, string> = {
  ...SERIES_SOLID,
  brand: `linear-gradient(210deg, ${CHART_GRADIENT_STOPS[0]} 18%, ${CHART_GRADIENT_STOPS[1]} 41%, ${CHART_GRADIENT_STOPS[2]} 130%)`,
};

export const CHART_THEME = {
  grid: "rgba(255, 255, 255, 0.08)",
  tick: "rgba(255, 255, 255, 0.55)",
  cursor: "rgba(255, 255, 255, 0.4)",
  forecastZone: "rgba(255, 255, 255, 0.04)",
  forecastLine: "rgba(255, 255, 255, 0.3)",
  panel: "#151419",
  areaFillTop: "rgba(130, 111, 255, 0.34)",
  areaFillBottom: "rgba(225, 136, 255, 0)",
  bandFillTop: "rgba(225, 136, 255, 0.28)",
  bandFillBottom: "rgba(130, 111, 255, 0.05)",
} as const;
