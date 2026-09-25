/**
 * Series colour keys stored in Sanity (`growthChart.series[].color`) mapped to
 * the CSS the chart draws with. Figma 2255:1148: organic traffic is the light
 * brand gradient, referring domains indigo, domain rating grey.
 */
export const SERIES_COLORS: Record<string, string> = {
  "gradient-light": "linear-gradient(226.57deg, #826FFF 18.303%, #E188FF 40.658%, #E1BDFF 129.53%)",
  indigo: "#4C4AB5",
  "white-trace": "#FFFFFF",
  "grey-trace": "#535353",
};

/** Solid stroke fallback for SVG strokes (gradients are painted via <defs>). */
export const SERIES_STROKES: Record<string, string> = {
  "gradient-light": "url(#case-study-chart-gradient)",
  indigo: "#4C4AB5",
  "white-trace": "#FFFFFF",
  "grey-trace": "#535353",
};

/** Dot fill per series (the gradient line uses the mid stop). */
export const SERIES_DOTS: Record<string, string> = {
  "gradient-light": "#BE7FFF",
  indigo: "#4C4AB5",
  "white-trace": "#FFFFFF",
  "grey-trace": "#535353",
};
