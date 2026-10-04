import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { CaseStudyDetailPage } from "@/components/pages/case-studies/case-study-detail-page";
import { ArticleSchema } from "@/components/seo/article-schema";
import { createPageMetadata } from "@/lib/metadata";
import { getCaseStudyBySlug, getCaseStudySlugs } from "@/lib/sanity-data";
import { SITE_URL } from "@/lib/site";
import { urlFor } from "@/sanity/lib/image";

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
    exactTitle: Boolean(caseStudy.seo?.metaTitle?.trim()),
    description:
      caseStudy.seo?.metaDescription?.trim() ||
      caseStudy.excerpt ||
      "Read this SEO case study from Heroic Rankings.",
    path: `/case-study/${slug}`,
    ogType: "article",
    image: caseStudy.heroImage?.asset
      ? { url: urlFor(caseStudy.heroImage).width(1200).height(630).fit("crop").url(), alt: `${caseStudy.client} case study` }
      : null,
  });
}

export default async function Page({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const caseStudy = await getCaseStudyBySlug(slug);

  if (!caseStudy) {
    notFound();
  }

  return (
    <>
      {/* WHY: a case study is an article about a client's results; the publisher is the author. */}
      <Suspense fallback={null}>
        <ArticleSchema
          author={null}
          dateModified={caseStudy._updatedAt ?? null}
          datePublished={caseStudy.publishedAt ?? null}
          description={caseStudy.excerpt ?? null}
          headline={`${caseStudy.title} Case Study`}
          image={caseStudy.heroImage?.asset ? urlFor(caseStudy.heroImage).width(1200).url() : null}
          url={`${SITE_URL}/case-study/${slug}/`}
        />
      </Suspense>
      <CaseStudyDetailPage caseStudy={caseStudy} />
    </>
  );
}
