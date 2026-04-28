"use client";

import dynamic from "next/dynamic";

import type { CaseStudyGrowthChartData } from "@/lib/sanity-data";

import { ChartSkeleton } from "./ChartSkeleton";

const Client = dynamic(() => import("./CaseStudyGrowthChartClient"), {
  ssr: false,
  loading: () => <ChartSkeleton />,
});

export function CaseStudyGrowthChartLazy({
  data,
}: {
  data: CaseStudyGrowthChartData;
}) {
  return <Client data={data} />;
}
