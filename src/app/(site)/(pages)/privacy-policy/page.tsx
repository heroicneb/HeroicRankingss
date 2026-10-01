import type { Metadata } from "next";

import PrivacyPolicyPage, { PRIVACY_DEFAULT_SEO } from "@/components/pages/privacy-policy/privacy-policy-page";
import { createPageMetadata } from "@/lib/metadata";
import { getLegalPageBySlug } from "@/lib/sanity-data";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getLegalPageBySlug("privacy-policy").catch(() => null);
  return createPageMetadata({
    title: page?.seoTitle?.trim() || PRIVACY_DEFAULT_SEO.title,
    exactTitle: Boolean(page?.seoTitle?.trim()),
    description: page?.seoDescription?.trim() || PRIVACY_DEFAULT_SEO.description,
    path: "/privacy-policy",
  });
}

export default async function PrivacyPolicyRoute() {
  const privacyPage = await getLegalPageBySlug("privacy-policy").catch(() => null);
  return <PrivacyPolicyPage cmsPage={privacyPage} />;
}
