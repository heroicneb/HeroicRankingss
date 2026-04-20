import { getCaseStudies } from "@/lib/sanity-data";
import CaseStudiesPage from "@/components/pages/case-studies/case-studies-page";

export { metadata } from "@/components/pages/case-studies/case-studies-page";

export default async function CaseStudiesRoute() {
  const caseStudies = await getCaseStudies().catch(() => []);
  return <CaseStudiesPage cmsCaseStudies={caseStudies} />;
}
