import type { Metadata } from "next";

import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { About } from "@/components/sections/about";
import { Blog } from "@/components/sections/blog";
import { CaseStudies } from "@/components/sections/case-studies";
import { FeaturedLogos } from "@/components/sections/featured-logos";
import { Hero } from "@/components/sections/hero";
import { Partnerships } from "@/components/sections/partnerships";
import { Services } from "@/components/sections/services";
import { Stats } from "@/components/sections/stats";
import { Team } from "@/components/sections/team";
import { Testimonials } from "@/components/sections/testimonials";
import { TrustAuthority } from "@/components/sections/trust-authority";
import { getFeaturedCaseStudies, getPartnerLogos, getPosts, getTestimonials } from "@/lib/sanity-data";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Data-Driven SEO Agency for Organic Growth",
  description:
    "Explore Heroic Rankings’ SEO services, proven case studies, certifications, and partnerships built for long-term organic growth.",
  path: "/",
});

export default async function HomePage() {
  const [partnerLogos, cmsPosts, cmsTestimonials, featuredCaseStudies] = await Promise.all([
    getPartnerLogos().catch(() => []),
    getPosts().catch(() => []),
    getTestimonials().catch(() => []),
    getFeaturedCaseStudies().catch(() => []),
  ]);

  return (
    <>
      <ScrollReveal />
      <Hero />
      <Services />
      <About />
      <Team />
      <div className="surface-rect-5 mx-[5px] rounded-[30px] md:mx-[10px] lg:rounded-[var(--radius-card)]">
        <Stats />
        <FeaturedLogos partnerLogos={partnerLogos} />
      </div>
      <CaseStudies cmsCaseStudies={featuredCaseStudies} />
      <TrustAuthority />
      <Partnerships />
      <Blog cmsPosts={cmsPosts} />
      <Testimonials cmsTestimonials={cmsTestimonials} />
    </>
  );
}
