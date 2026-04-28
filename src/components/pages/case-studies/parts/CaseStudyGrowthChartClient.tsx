"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { CaseStudyGrowthChartData } from "@/lib/sanity-data";

const COLORS: Record<string, string> = {
  "gradient-light": "#E188FF",
  "white-trace": "#FFFFFF",
  "grey-trace": "#535353",
};

const resolveStroke = (color: string): string => {
  const resolved = COLORS[color];
  if (!resolved && process.env.NODE_ENV === "development") {
    console.warn(`CaseStudyGrowthChart: unknown color enum "${color}"`);
  }
  return resolved ?? "#E188FF"; // brand purple fallback (visible on dark)
};

export default function CaseStudyGrowthChartClient({
  data,
}: {
  data: CaseStudyGrowthChartData;
}) {
  const months = data.months ?? [];
  const series = data.series ?? [];

  const chartData = months.map((month, i) => {
    const row: Record<string, string | number | undefined> = { month };
    for (const s of series) {
      row[s.label] = i < s.points.length ? s.points[i] : undefined;
    }
    return row;
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={chartData}
        margin={{ top: 20, right: 40, bottom: 20, left: 40 }}
      >
        <CartesianGrid stroke="var(--color-hr-dark-line)" vertical={false} />
        <XAxis
          dataKey="month"
          stroke="var(--color-hr-grey)"
          tick={{ fill: "var(--color-hr-grey)" }}
        />
        <YAxis
          stroke="var(--color-hr-grey)"
          tick={{ fill: "var(--color-hr-grey)" }}
        />
        <Tooltip
          contentStyle={{
            background: "var(--color-hr-black-box)",
            border: "1px solid var(--color-hr-dark-line)",
          }}
        />
        {series.map((s) => (
          <Line
            key={s.label}
            type="monotone"
            dataKey={s.label}
            stroke={resolveStroke(s.color)}
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
