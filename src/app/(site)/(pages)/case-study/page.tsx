import { getCaseStudies } from "@/lib/sanity-data";
import CaseStudiesPage from "@/components/pages/case-studies/case-studies-page";

export { metadata } from "@/components/pages/case-studies/case-studies-page";

// WHY: Sanity content can change between deploys (migration / cleanup / editor
// edits). The defineLive sanityFetch() pipeline cached stale results across
// deploys (audit verified Sanity returned 6 docs while page rendered 13).
// `force-dynamic` ensures every request re-queries Sanity so editors see
// changes within seconds rather than waiting for a redeploy.
export const dynamic = "force-dynamic";

export default async function CaseStudiesRoute() {
  const caseStudies = await getCaseStudies().catch(() => []);
  return <CaseStudiesPage cmsCaseStudies={caseStudies} />;
}
