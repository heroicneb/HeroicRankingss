import type { Metadata } from "next";

import { Blog } from "@/components/sections/blog";
import { AboutUsCta } from "@/components/sections/about-us-cta";
import { AboutUsHero } from "@/components/sections/about-us-hero";
import { AboutUsTeam } from "@/components/sections/about-us-team";
import { AboutUsTrust } from "@/components/sections/about-us-trust";
import { Testimonials } from "@/components/sections/testimonials";
import { createPageMetadata } from "@/lib/metadata";
import type {
  SanityPostSummary,
  SanityTeamMember,
  SanityTestimonial,
} from "@/lib/sanity-data";

export const metadata: Metadata = createPageMetadata({
  title: "About Us",
  description:
    "Meet the ranking heroes behind Heroic Rankings and explore the team, process, and results-driven SEO philosophy.",
  path: "/about",
});

interface AboutUsPageProps {
  cmsTeamMembers?: SanityTeamMember[];
  cmsPosts?: SanityPostSummary[];
  cmsTestimonials?: SanityTestimonial[];
}

export default function AboutUsPage({
  cmsTeamMembers,
  cmsPosts,
  cmsTestimonials,
}: AboutUsPageProps) {
  return (
    <>
      <AboutUsHero />

      <div className="mx-auto mt-[5px] w-full max-w-[1440px] px-[5px] lg:mt-[11px] lg:px-[10px]">
        <div className="rounded-[30px] bg-[var(--color-hr-off-white)] dark:bg-[var(--color-bg-dark)] lg:rounded-[40px]">
          <AboutUsTrust />
        </div>
      </div>

      <AboutUsCta />
      <AboutUsTeam cmsTeamMembers={cmsTeamMembers} />
      <Testimonials cmsTestimonials={cmsTestimonials} />
      <div className="-mt-14">
        <Blog cmsPosts={cmsPosts} />
      </div>
    </>
  );
}
