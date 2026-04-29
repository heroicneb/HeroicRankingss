import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CaseStudyDetailPage } from "@/components/pages/case-studies/case-study-detail-page";
import { createPageMetadata } from "@/lib/metadata";
import { getCaseStudyBySlug, getCaseStudySlugs } from "@/lib/sanity-data";

export const dynamic = "force-dynamic";

interface CaseStudyPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = await getCaseStudySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = await getCaseStudyBySlug(slug);

  if (!caseStudy) {
    notFound();
  }

  return createPageMetadata({
    title: caseStudy.seo?.metaTitle?.trim() || `${caseStudy.title} Case Study`,
    description:
      caseStudy.seo?.metaDescription?.trim() ||
      caseStudy.excerpt ||
      "Read this SEO case study from Heroic Rankings.",
    path: `/case-studies/${slug}`,
    ogType: "article",
  });
}

export default async function Page({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const caseStudy = await getCaseStudyBySlug(slug);

  if (!caseStudy) {
    notFound();
  }

  return <CaseStudyDetailPage caseStudy={caseStudy} />;
}
