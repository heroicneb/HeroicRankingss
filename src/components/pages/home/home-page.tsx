import type { Metadata } from "next";

import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { About } from "@/components/sections/about";
import { Blog } from "@/components/sections/blog";
import { FeaturedPodcasts } from "@/components/sections/featured-podcasts";
import { PodcastChatProvider } from "@/components/chat/PodcastChatProvider";
import { CaseStudies } from "@/components/sections/case-studies";
import { FeaturedLogos } from "@/components/sections/featured-logos";
import { Hero } from "@/components/sections/hero";
import { Partnerships } from "@/components/sections/partnerships";
import { Services } from "@/components/sections/services";
import { Stats } from "@/components/sections/stats";
import { Team } from "@/components/sections/team";
import { AiVisibility } from "@/components/sections/ai-visibility/ai-visibility";
import { Testimonials } from "@/components/sections/testimonials";
import { TrustedBy } from "@/components/sections/trusted-by/trusted-by";
import { TrustAuthority } from "@/components/sections/trust-authority";
import {
  getClientLogos,
  getFeaturedCaseStudies,
  getPodcastEpisodes,
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
    exactTitle: Boolean(page?.seo?.metaTitle?.trim()),
    description: page?.seo?.metaDescription?.trim() || HOME_DEFAULT_SEO.description,
    path: "/",
  });
}

export default async function HomePage() {
  const [page, partnerLogos, cmsPosts, cmsTestimonials, featuredCaseStudies, episodes, clientLogos] = await Promise.all([
    // WHY: the built-in copy is the safety net if the CMS document is missing or unreachable.
    getHomePage().catch(() => null),
    getPartnerLogos().catch(() => []),
    getPosts().catch(() => []),
    getTestimonials().catch(() => []),
    getFeaturedCaseStudies().catch(() => []),
    getPodcastEpisodes().catch(() => []),
    getClientLogos().catch(() => []),
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
      {/* WHY: the client logo field shows breadth right after the depth of the case studies (Nebojsa, 2026-10-02). */}
      <TrustedBy cmsLogos={clientLogos} content={content.trustedBy} />
      {/* WHY: client voices sit right after the case studies they back up (Nebojsa, 2026-09-30). */}
      <Testimonials cmsTestimonials={cmsTestimonials} content={content.testimonials} />
      <TrustAuthority content={content.trust} />
      <Partnerships content={content.partnerships} />
      <Blog cmsPosts={cmsPosts} content={content.blog} />
      <FeaturedPodcasts content={content.featuredPodcasts} episodes={episodes} />
      {/* WHY: the cards' Ask AI buttons open the podcast chat scoped to their episode; no floating launcher on the homepage. */}
      <PodcastChatProvider hideLauncher mode="global" routeKey="home:podcast" />
    </>
  );
}
