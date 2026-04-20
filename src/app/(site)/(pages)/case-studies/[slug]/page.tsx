import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/react";

import { portableTextComponents } from "@/components/sanity/PortableTextComponents";
import { CaseStudyDetailPage as EnhancedCaseStudyPage } from "@/components/pages/case-studies/case-study-detail-page";
import { AppLink } from "@/components/ui/app-link";
import { formatPublishedDate } from "@/lib/format";
import { createPageMetadata } from "@/lib/metadata";
import { getCaseStudyBySlug, getCaseStudySlugs } from "@/lib/sanity-data";
import { urlFor } from "@/sanity/lib/image";
import { getEnhancedCaseStudy } from "@/data/case-study-details";

interface CaseStudyMetric {
  _key?: string;
  description?: string | null;
  label?: string | null;
  value?: string | null;
}

interface CaseStudyDocument {
  body?: PortableTextBlock[] | null;
  client: string;
  excerpt?: string | null;
  heroImage?: {
    alt?: string | null;
  } | null;
  metrics?: CaseStudyMetric[] | null;
  publishedAt?: string | null;
  seo?: {
    metaDescription?: string | null;
    metaTitle?: string | null;
  } | null;
  services?: string[] | null;
  title: string;
}

interface CaseStudyPageProps {
  params: Promise<{
    slug: string;
  }>;
}

function getHeroImageUrl(heroImage: CaseStudyDocument["heroImage"]): string | null {
  if (!heroImage) return null;

  try {
    return urlFor(heroImage).width(1600).height(920).auto("format").url();
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  const slugs = await getCaseStudySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
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
  });
}

export default async function CaseStudyDetailPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;

  // If there is a hardcoded enhanced case study for this slug, render the rich layout.
  const enhancedData = getEnhancedCaseStudy(slug);
  if (enhancedData) {
    return <EnhancedCaseStudyPage data={enhancedData} />;
  }

  const caseStudy = await getCaseStudyBySlug(slug);

  if (!caseStudy) {
    notFound();
  }

  const publishedAt = formatPublishedDate(caseStudy.publishedAt);
  const heroImageUrl = getHeroImageUrl(caseStudy.heroImage);
  const heroImageLqip = (caseStudy.heroImage as { asset?: { metadata?: { lqip?: string } } } | null)?.asset?.metadata?.lqip;
  const metrics = (caseStudy.metrics ?? []).filter((metric) => metric.label || metric.value || metric.description);
  const services = (caseStudy.services ?? []).filter((service): service is string => Boolean(service));

  return (
    <section className="pb-[130px] pt-[109px]" id="case-study-detail">
      <div className="mx-auto w-full max-w-[1440px] px-5 md:px-10 xl:px-[80px]">
        <AppLink
          className="inline-flex min-h-[44px] items-center text-[16px] font-medium text-[var(--color-hr-grey)] underline underline-offset-4 hover:text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse-60)] dark:hover:text-[var(--color-text-inverse)]"
          href="/case-studies"
        >
          Back to Case Studies
        </AppLink>

        <p className="mt-6 text-[16px] font-medium uppercase tracking-[0.08em] text-[var(--color-hr-grey)] dark:text-[var(--color-text-inverse-60)]">
          Case Study
        </p>

        <h1 className="mt-4 w-full max-w-[900px] text-[42px] font-normal leading-[52px] tracking-[-0.84px] sm:text-[52px] sm:leading-[66px] xl:text-[62px] xl:leading-[80px]">
          <span className="gradient-text-brand">{caseStudy.title}</span>
        </h1>

        <div className="mt-7 flex flex-wrap gap-3 text-[16px] font-normal leading-[22px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
          <span className="rounded-full bg-[var(--color-hr-off-white)] px-4 py-2 dark:bg-[var(--color-surface-inverse-10)]">
            Client: {caseStudy.client}
          </span>
          {publishedAt ? (
            <span className="rounded-full bg-[var(--color-hr-off-white)] px-4 py-2 dark:bg-[var(--color-surface-inverse-10)]">
              Published: {publishedAt}
            </span>
          ) : null}
        </div>

        {caseStudy.excerpt ? (
          <p className="mt-8 w-full max-w-[900px] text-[18px] font-normal leading-[24px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
            {caseStudy.excerpt}
          </p>
        ) : null}

        {heroImageUrl ? (
          <div className="relative mt-12 aspect-[16/9] w-full overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-hr-light-grey)] dark:border-[var(--color-border-inverse-10)]">
            <Image
              alt={caseStudy.heroImage?.alt || `${caseStudy.title} hero image`}
              blurDataURL={heroImageLqip}
              className="object-cover"
              fetchPriority="high"
              fill
              placeholder={heroImageLqip ? "blur" : "empty"}
              priority
              sizes="(min-width: 1280px) 1280px, 100vw"
              src={heroImageUrl}
            />
          </div>
        ) : null}

        {metrics.length > 0 ? (
          <section className="mt-14">
            <h2 className="text-[32px] font-normal leading-[40px] tracking-[-0.64px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
              Key Metrics
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {metrics.map((metric) => (
                <article
                  className="rounded-[24px] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-pure-white)] p-5 dark:border-[var(--color-border-inverse-10)] dark:bg-[var(--color-bg-dark)]"
                  key={metric._key ?? `${metric.label ?? "metric"}-${metric.value ?? ""}`}
                >
                  {metric.value ? (
                    <p className="text-[32px] font-medium leading-[34px] tracking-[-0.64px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
                      {metric.value}
                    </p>
                  ) : null}
                  {metric.label ? (
                    <p className="mt-2 text-[18px] font-medium leading-[24px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
                      {metric.label}
                    </p>
                  ) : null}
                  {metric.description ? (
                    <p className="mt-2 text-[16px] font-normal leading-[22px] text-[var(--color-hr-grey)] dark:text-[var(--color-text-inverse-60)]">
                      {metric.description}
                    </p>
                  ) : null}
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {services.length > 0 ? (
          <section className="mt-14">
            <h2 className="text-[32px] font-normal leading-[40px] tracking-[-0.64px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
              Services Used
            </h2>
            <ul className="mt-6 flex flex-wrap gap-3">
              {services.map((service) => (
                <li
                  className="rounded-full bg-[var(--color-hr-off-white)] px-4 py-2 text-[16px] font-normal leading-[22px] text-[var(--color-hr-dark)] dark:bg-[var(--color-surface-inverse-10)] dark:text-[var(--color-text-inverse)]"
                  key={service}
                >
                  {service}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {caseStudy.body?.length ? (
          <section className="mt-14">
            <h2 className="text-[32px] font-normal leading-[40px] tracking-[-0.64px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
              Case Study Details
            </h2>
            <article className="mt-6 w-full max-w-[980px] text-[18px] font-normal leading-[24px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
              <PortableText components={portableTextComponents} value={caseStudy.body} />
            </article>
          </section>
        ) : null}
      </div>
    </section>
  );
}
