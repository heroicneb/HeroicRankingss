import type { Metadata } from "next";
import dynamic from "next/dynamic";

import { createPageMetadata } from "@/lib/metadata";
import type { SanityPostSummary } from "@/lib/sanity-data";
import { SubscribeBar } from "@/components/ui/subscribe-bar";

export const metadata: Metadata = createPageMetadata({
  title: "Insights",
  description:
    "Explore Heroic Rankings insights, research guides, and practical SEO playbooks for sustainable organic growth.",
  path: "/insights",
});
const InsightsCatalog = dynamic(
  () =>
    import("@/components/pages/insights/insights-catalog").then(
      (module) => module.InsightsCatalog,
    ),
  {
    // WHY: Keep interactive catalog controls in a route-scoped client chunk instead of the initial shell bundle.
    loading: () => (
      <div className="mt-10 px-[15px]">
        <div className="mx-auto h-[45px] w-full max-w-[350px] rounded-[16px] bg-[var(--color-hr-off-white)] dark:bg-[var(--color-surface-inverse-10)]" />
        <div className="mx-auto mt-10 grid w-full max-w-[350px] grid-cols-1 gap-[30px] lg:max-w-none lg:grid-cols-3 lg:gap-x-[21px] lg:gap-y-5">
          <div className="h-[467px] rounded-[40px] bg-[var(--color-hr-off-white)] dark:bg-[var(--color-surface-inverse-10)]" />
          <div className="h-[467px] rounded-[40px] bg-[var(--color-hr-off-white)] dark:bg-[var(--color-surface-inverse-10)]" />
          <div className="h-[467px] rounded-[40px] bg-[var(--color-hr-off-white)] dark:bg-[var(--color-surface-inverse-10)]" />
        </div>
      </div>
    ),
  },
);

interface InsightsPageProps {
  cmsPosts?: SanityPostSummary[];
}

export default function InsightsPage({ cmsPosts }: InsightsPageProps) {
  return (
    <section className="pt-[100px] lg:pt-[109px]" id="blog">
      <div className="mx-auto w-full max-w-[1440px] px-[5px]">
        <div className="rounded-[15px] bg-[var(--color-hr-pure-white)] p-[5px] dark:bg-[var(--color-bg-dark)]">
          <div className="flex flex-col items-center gap-[50px] px-[15px] py-[60px] text-center">
            <div className="flex flex-col items-center gap-[10px]">
              <h1 className="type-h1">
                <span className="gradient-text-brand gradient-text-brand-about-us-hero-title">
                  Our Blog
                </span>
              </h1>
              <p className="type-paragraph mx-auto w-full max-w-[696px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
                The Heroic Rankings blog:{" "}
                <span className="gradient-text-brand gradient-text-brand-about-us-cta-copy">
                  where SEO knowledge converts into strategy.
                </span>
                <br />
                Discover the latest trends, industry insights, and actionable
                previously tested tactics that turn data into growth for your
                brand.
              </p>
            </div>

            <SubscribeBar />
          </div>

          <InsightsCatalog cmsPosts={cmsPosts} />
        </div>
      </div>
    </section>
  );
}
