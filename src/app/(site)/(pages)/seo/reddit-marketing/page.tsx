import type { Metadata } from "next";

import {
  DEFAULT_REDDIT_MARKETING_CONTENT,
  REDDIT_MARKETING_DEFAULT_SEO,
} from "@/components/pages/reddit-marketing/reddit-marketing-content";
import RedditMarketingPage from "@/components/pages/reddit-marketing/reddit-marketing-page";
import { ServiceSchema } from "@/components/seo/service-schema";
import { createPageMetadata } from "@/lib/metadata";
import { getFaqItemsByService, getRedditMarketingPage } from "@/lib/sanity-data";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getRedditMarketingPage().catch(() => null);
  return createPageMetadata({
    title: page?.seo?.metaTitle?.trim() || REDDIT_MARKETING_DEFAULT_SEO.title,
    exactTitle: Boolean(page?.seo?.metaTitle?.trim()),
    description: page?.seo?.metaDescription?.trim() || REDDIT_MARKETING_DEFAULT_SEO.description,
    path: "/seo/reddit-marketing",
  });
}

export default async function RedditMarketingRoute() {
  const [page, faqItems] = await Promise.all([
    getRedditMarketingPage().catch(() => null),
    getFaqItemsByService("reddit-marketing").catch(() => []),
  ]);
  const seoTitle = (page?.seo?.metaTitle?.trim() || REDDIT_MARKETING_DEFAULT_SEO.title).replace(/\s*\|\s*Heroic Rankings$/, "");
  return (
    <>
      <ServiceSchema
        description={page?.seo?.metaDescription?.trim() || REDDIT_MARKETING_DEFAULT_SEO.description}
        name={seoTitle}
        path="/seo/reddit-marketing"
        serviceType="Reddit marketing"
      />
      <RedditMarketingPage cmsFaqItems={faqItems} content={page?.content ?? DEFAULT_REDDIT_MARKETING_CONTENT} />
    </>
  );
}
