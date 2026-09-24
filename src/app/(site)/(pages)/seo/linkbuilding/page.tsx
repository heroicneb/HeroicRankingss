import type { Metadata } from "next";

import {
  DEFAULT_LINK_BUILDING_CONTENT,
  LINK_BUILDING_DEFAULT_SEO,
} from "@/components/pages/link-building/link-building-content";
import LinkBuildingPage from "@/components/pages/link-building/link-building-page";
import { createPageMetadata } from "@/lib/metadata";
import { getFaqItemsByService, getLinkBuildingPage } from "@/lib/sanity-data";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getLinkBuildingPage().catch(() => null);
  return createPageMetadata({
    title: page?.seo?.metaTitle?.trim() || LINK_BUILDING_DEFAULT_SEO.title,
    description: page?.seo?.metaDescription?.trim() || LINK_BUILDING_DEFAULT_SEO.description,
    path: "/seo/linkbuilding",
  });
}

export default async function LinkBuildingRoute() {
  const [page, faqItems] = await Promise.all([
    getLinkBuildingPage().catch(() => null),
    getFaqItemsByService("link-building").catch(() => []),
  ]);
  return <LinkBuildingPage cmsFaqItems={faqItems} content={page?.content ?? DEFAULT_LINK_BUILDING_CONTENT} />;
}
