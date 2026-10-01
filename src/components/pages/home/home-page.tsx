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
import { AiVisibility } from "@/components/sections/ai-visibility/ai-visibility";
import { Testimonials } from "@/components/sections/testimonials";
import { TrustAuthority } from "@/components/sections/trust-authority";
import {
  getFeaturedCaseStudies,
  getHomePage,
  getPartnerLogos,
  getPosts,
  getTestimonials,
} from "@/lib/sanity-data";
import { createPageMetadata } from "@/lib/metadata";
import { DEFAULT_HOME_CONTENT, HOME_DEFAULT_SEO } from "@/components/pages/home/home-content";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getHomePage().catch(() => null);
  return createPageMetadata({
    title: page?.seo?.metaTitle?.trim() || HOME_DEFAULT_SEO.title,
    description: page?.seo?.metaDescription?.trim() || HOME_DEFAULT_SEO.description,
    path: "/",
  });
}

export default async function HomePage() {
  const [page, partnerLogos, cmsPosts, cmsTestimonials, featuredCaseStudies] = await Promise.all([
    // WHY: the built-in copy is the safety net if the CMS document is missing or unreachable.
    getHomePage().catch(() => null),
    getPartnerLogos().catch(() => []),
    getPosts().catch(() => []),
    getTestimonials().catch(() => []),
    getFeaturedCaseStudies().catch(() => []),
  ]);
  const content = page?.content ?? DEFAULT_HOME_CONTENT;

  return (
    <>
      <ScrollReveal />
      <Hero content={content.hero} />
      <Services content={content.services} />
      {/* WHY: the AI section explains "how" right after the services it maps to (Nebojsa, 2026-10-01). */}
      <AiVisibility content={content.aiVisibility} />
      <About content={content.about} />
      <Team content={content.team} />
      <div className="surface-rect-5 mx-[5px] rounded-[30px] md:mx-[10px] lg:rounded-[var(--radius-card)]">
        <Stats content={content.stats} />
        <FeaturedLogos heading={content.featuredLogos.heading} partnerLogos={partnerLogos} />
      </div>
      <CaseStudies cmsCaseStudies={featuredCaseStudies} content={content.caseStudies} />
      {/* WHY: client voices sit right after the case studies they back up (Nebojsa, 2026-09-30). */}
      <Testimonials cmsTestimonials={cmsTestimonials} content={content.testimonials} />
      <TrustAuthority content={content.trust} />
      <Partnerships content={content.partnerships} />
      <Blog cmsPosts={cmsPosts} content={content.blog} />
    </>
  );
}
