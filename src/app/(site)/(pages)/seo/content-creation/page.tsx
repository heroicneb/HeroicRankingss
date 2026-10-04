import type { Metadata } from "next";

import ContentCreationPage from "@/components/pages/content-creation/content-creation-page";
import { seoServicePage } from "@/components/pages/shared/seo-service-registry";
import { ServiceSchema } from "@/components/seo/service-schema";
import { createPageMetadata } from "@/lib/metadata";
import { getFaqItemsByService, getSeoServicePage } from "@/lib/sanity-data";

const PAGE = seoServicePage("content-creation");

export async function generateMetadata(): Promise<Metadata> {
  const page = await getSeoServicePage(PAGE.key).catch(() => null);
  return createPageMetadata({
    title: page?.seo?.metaTitle?.trim() || PAGE.seo.title,
    exactTitle: Boolean(page?.seo?.metaTitle?.trim()),
    description: page?.seo?.metaDescription?.trim() || PAGE.seo.description,
    path: PAGE.path,
  });
}

export default async function Route() {
  // WHY: the built-in copy is the safety net if the CMS document is missing or unreachable.
  const [page, faqItems] = await Promise.all([
    getSeoServicePage(PAGE.key).catch(() => null),
    getFaqItemsByService(PAGE.faqService).catch(() => []),
  ]);
  const seoTitle = (page?.seo?.metaTitle?.trim() || PAGE.seo.title).replace(/\s*\|\s*Heroic Rankings$/, "");
  return (
    <>
      <ServiceSchema
        description={page?.seo?.metaDescription?.trim() || PAGE.seo.description}
        name={seoTitle}
        path={PAGE.path}
        serviceType="SEO content creation"
      />
      <ContentCreationPage cmsFaqItems={faqItems} content={page?.content ?? PAGE.content} />
    </>
  );
}
