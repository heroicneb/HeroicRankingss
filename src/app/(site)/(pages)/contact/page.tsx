import type { Metadata } from "next";

import ContactPage, { CONTACT_DEFAULT_SEO } from "@/components/pages/contact/contact-page";
import { createPageMetadata } from "@/lib/metadata";
import { getContactPage } from "@/lib/sanity-data";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getContactPage().catch(() => null);
  return createPageMetadata({
    title: page?.seoTitle?.trim() || CONTACT_DEFAULT_SEO.title,
    exactTitle: Boolean(page?.seoTitle?.trim()),
    description: page?.seoDescription?.trim() || CONTACT_DEFAULT_SEO.description,
    path: "/contact",
  });
}

export default async function ContactRoute() {
  const contactPage = await getContactPage().catch(() => null);
  return <ContactPage cmsPage={contactPage} />;
}
