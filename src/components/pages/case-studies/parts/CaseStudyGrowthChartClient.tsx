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

export default function CaseStudyGrowthChartClient({
  data,
}: {
  data: CaseStudyGrowthChartData;
}) {
  const months = data.months ?? [];
  const series = data.series ?? [];

  const chartData = months.map((month, i) => {
    const row: Record<string, string | number> = { month };
    for (const s of series) row[s.label] = s.points[i] ?? 0;
    return row;
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={chartData}
        margin={{ top: 20, right: 40, bottom: 20, left: 40 }}
      >
        <CartesianGrid stroke="var(--color-hr-dark-line)" vertical={false} />
        <XAxis dataKey="month" stroke="var(--color-hr-grey)" />
        <YAxis stroke="var(--color-hr-grey)" />
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
            stroke={COLORS[s.color] ?? "#FFFFFF"}
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
