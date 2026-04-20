import { getTeamMembers, getPosts, getTestimonials } from "@/lib/sanity-data";
import AboutUsPage from "@/components/pages/about-us/about-us-page";

export { metadata } from "@/components/pages/about-us/about-us-page";

export default async function AboutUsRoute() {
  const [teamMembers, cmsPosts, cmsTestimonials] = await Promise.all([
    getTeamMembers().catch(() => []),
    getPosts().catch(() => []),
    getTestimonials().catch(() => []),
  ]);
  return <AboutUsPage cmsTeamMembers={teamMembers} cmsPosts={cmsPosts} cmsTestimonials={cmsTestimonials} />;
}
