import type { TimeSeriesChartSpec } from "@/components/charts/time-series-chart-types";

/*
 * Data for the "/ Competitor Insights /" charts on /seo/linkbuilding.
 *
 * PROVENANCE: the site has no raw export behind these charts. The values
 * below were read off the original static images
 * (public/link-building/charts/*.jpg) at monthly resolution and reproduce
 * the same illustrative comparison ("client.com" vs three competitors) with
 * the same levels and trends. They are an example of what the report shows,
 * not a specific client's results. Replace the arrays here when real data is
 * available; the labels and value arrays must stay the same length.
 */

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "Mar 2023", "Apr 2023", … for `count` months starting at `month` (1–12) of `year`. */
export function monthLabels(year: number, month: number, count: number): string[] {
  return Array.from({ length: count }, (_, i) => {
    const index = month - 1 + i;
    return `${MONTHS[index % 12]} ${year + Math.floor(index / 12)}`;
  });
}

const DOMAIN_RATING: TimeSeriesChartSpec = {
  id: "domain-rating",
  title: "Domain Rating trend over time",
  metricLabel: "Domain Rating",
  variant: "step",
  labels: monthLabels(2023, 3, 19), // Mar 2023 – Sep 2024
  yDomain: [0, 70],
  yTicks: [0, 10, 20, 30, 40, 50, 60, 70],
  axisFormat: "plain",
  series: [
    { key: "client", label: "client.com", color: "brand", emphasis: true, values: [26, 26, 27, 27, 27, 27, 29, 30, 31, 34, 36, 37, 38, 38, 39, 40, 43, 43, 45] },
    { key: "competitor1", label: "competitor1.com", color: "white", values: [63, 62, 62, 62, 62, 62, 63, 63, 63, 63, 63, 63, 63, 63, 63, 63, 63, 62, 63] },
    { key: "competitor2", label: "competitor2.com", color: "violet", values: [50, 50, 50, 50, 51, 51, 48, 49, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48] },
    { key: "competitor3", label: "competitor3.com", color: "muted", values: [26, 26, 26, 26, 26, 26, 26, 26, 27, 27, 27, 21, 21, 21, 21, 21, 21, 21, 21] },
  ],
  source: "Read from public/link-building/charts/domain-rating.jpg",
};

const LINK_VELOCITY: TimeSeriesChartSpec = {
  id: "link-velocity",
  title: "Referring domains month-over-month",
  metricLabel: "Referring domains",
  variant: "line",
  labels: monthLabels(2023, 3, 19), // Mar 2023 – Sep 2024
  yDomain: [0, 1200],
  yTicks: [0, 200, 400, 600, 800, 1000, 1200],
  axisFormat: "compact",
  series: [
    { key: "client", label: "client.com", color: "brand", emphasis: true, values: [15, 25, 45, 80, 105, 115, 125, 135, 150, 165, 175, 190, 205, 215, 225, 235, 250, 285, 310] },
    { key: "competitor1", label: "competitor1.com", color: "white", values: [925, 930, 950, 970, 990, 1000, 1010, 1030, 1050, 1080, 1100, 1110, 1105, 1080, 1085, 1090, 1085, 1080, 1090] },
    { key: "competitor2", label: "competitor2.com", color: "violet", values: [210, 215, 225, 240, 230, 225, 235, 245, 250, 250, 255, 250, 255, 260, 265, 270, 275, 275, 280] },
    { key: "competitor3", label: "competitor3.com", color: "muted", values: [20, 20, 20, 22, 25, 25, 25, 25, 28, 28, 30, 30, 32, 35, 38, 40, 42, 44, 45] },
  ],
  source: "Read from public/link-building/charts/link-velocity.jpg",
};

const COMPETITIVE_ORGANIC_TRAFFIC: TimeSeriesChartSpec = {
  id: "competitive-organic-traffic",
  title: "Competitive organic traffic with a three-month forecast",
  metricLabel: "Organic traffic",
  variant: "forecast",
  labels: monthLabels(2023, 3, 21), // Mar 2023 – Nov 2024
  forecastFrom: 18, // Sep 2024 onwards is predicted
  yDomain: [0, 10000],
  yTicks: [0, 2000, 4000, 6000, 8000, 10000],
  axisFormat: "compact",
  series: [
    {
      key: "client",
      label: "client.com",
      color: "brand",
      emphasis: true,
      values: [0, 30, 120, 350, 700, 1000, 1400, 2600, 4000, 5200, 6300, 7500, 8000, 7800, 7500, 7800, 8100, 8400, 8700, 9000, 9300],
    },
    { key: "competitor1", label: "competitor1.com", color: "white", values: [350, 380, 400, 420, 450, 470, 500, 520, 550, 580, 600, 620, 650, 680, 700, 700, 680, 660, 640, 620, 600] },
    {
      key: "competitor2",
      label: "competitor2.com",
      color: "violet",
      values: [3500, 3200, 2900, 3000, 3600, 4300, 4600, 4400, 3900, 3300, 3200, 3500, 4000, 4600, 5600, 6200, 6600, 7000, 7300, 7700, 8000],
    },
    { key: "competitor3", label: "competitor3.com", color: "muted", values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
  ],
  source: "Read from public/link-building/charts/competitive-organic-traffic.jpg",
};

const WEBSITE_ORGANIC_TRAFFIC: TimeSeriesChartSpec = {
  id: "website-organic-traffic",
  title: "Your website's organic traffic forecast for the next three months",
  metricLabel: "Organic traffic",
  variant: "band",
  labels: monthLabels(2024, 7, 6), // Jul 2024 – Dec 2024
  forecastFrom: 3, // Oct 2024 onwards is where the scenarios diverge
  yDomain: [8000, 10500],
  yTicks: [8000, 8500, 9000, 9500, 10000, 10500],
  axisFormat: "compact",
  series: [
    { key: "trend", label: "Organic Traffic Trend", color: "brand", emphasis: true, bandRole: "mid", values: [8050, 8400, 8700, 8950, 9200, 9400] },
    { key: "worst", label: "Organic Traffic Worst", color: "soft", bandRole: "low", values: [8050, 8400, 8700, 8740, 8760, 8760] },
    { key: "best", label: "Organic Traffic Best", color: "lavender", bandRole: "high", values: [8050, 8400, 8700, 9150, 9650, 10100] },
  ],
  source: "Read from public/link-building/charts/website-organic-traffic.jpg",
};

export const COMPETITOR_INSIGHTS_CHARTS: Record<string, TimeSeriesChartSpec> = {
  [DOMAIN_RATING.id]: DOMAIN_RATING,
  [LINK_VELOCITY.id]: LINK_VELOCITY,
  [COMPETITIVE_ORGANIC_TRAFFIC.id]: COMPETITIVE_ORGANIC_TRAFFIC,
  [WEBSITE_ORGANIC_TRAFFIC.id]: WEBSITE_ORGANIC_TRAFFIC,
};

/** Options offered in the Sanity "Interactive chart" select. */
export const COMPETITOR_INSIGHTS_CHART_OPTIONS = Object.values(COMPETITOR_INSIGHTS_CHARTS).map((chart) => ({ title: chart.title, value: chart.id }));
