import type { Metadata } from "next";

import PartnershipPage from "@/components/pages/partnership/partnership-page";
import {
  DEFAULT_PARTNERSHIP_CONTENT,
  PARTNERSHIP_DEFAULT_SEO,
} from "@/components/pages/partnership/partnership-content";
import { createPageMetadata } from "@/lib/metadata";
import { getPartnershipPage } from "@/lib/sanity-data";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPartnershipPage().catch(() => null);
  return createPageMetadata({
    title: page?.seo?.metaTitle?.trim() || PARTNERSHIP_DEFAULT_SEO.title,
    description: page?.seo?.metaDescription?.trim() || PARTNERSHIP_DEFAULT_SEO.description,
    path: "/partnership",
  });
}

export default async function PartnershipRoute() {
  // WHY: the built-in copy is the safety net if the CMS document is missing or unreachable.
  const page = await getPartnershipPage().catch(() => null);
  return <PartnershipPage content={page?.content ?? DEFAULT_PARTNERSHIP_CONTENT} />;
}
