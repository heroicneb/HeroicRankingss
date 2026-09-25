import CaseStudiesPage from "@/components/pages/case-studies/case-studies-page";
import { getCaseStudies } from "@/lib/sanity-data";

export { metadata } from "@/components/pages/case-studies/case-studies-page";

interface CaseStudiesRouteProps {
  searchParams: Promise<{ page?: string | string[] }>;
}

export default async function CaseStudiesRoute({ searchParams }: CaseStudiesRouteProps) {
  const [caseStudies, params] = await Promise.all([getCaseStudies().catch(() => []), searchParams]);
  const page = Array.isArray(params.page) ? params.page[0] : params.page;
  return <CaseStudiesPage cmsCaseStudies={caseStudies} page={page ?? null} />;
}
