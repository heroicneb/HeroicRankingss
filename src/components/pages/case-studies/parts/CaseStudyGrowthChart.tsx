import dynamic from "next/dynamic";

import type { CaseStudyGrowthChartData } from "@/lib/sanity-data";

import { ChartSkeleton } from "./ChartSkeleton";

const Client = dynamic(() => import("./CaseStudyGrowthChartClient"), {
  ssr: false,
  loading: () => <ChartSkeleton />,
});

export function CaseStudyGrowthChart({
  data,
}: {
  data: CaseStudyGrowthChartData | null;
}) {
  if (!data || !data.series?.length) {
    return (
      <div className="h-[480px] grid place-items-center text-[var(--color-hr-grey)]">
        Data unavailable
      </div>
    );
  }
  return (
    <div className="h-[384px] lg:h-[480px]">
      <Client data={data} />
    </div>
  );
}
