import type { MetadataRoute } from "next";

import { getSitemapEntries } from "@/lib/sanity-data";
import { SITE_URL } from "@/lib/site";

/**
 * Every indexable page with the last edit date of the document behind it.
 * WHY: a single build-time lastmod told Google nothing; per-URL dates let it
 * prioritise recrawls. Routes without a dated source omit lastModified.
 */

/** Static routes and the Sanity document whose edit date they carry. */
const PAGE_ROUTES: Array<{ route: string; docId: string | null; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }> = [
  { route: "/", docId: "homePage", priority: 1.0, changeFrequency: "weekly" },
  { route: "/about", docId: null, priority: 0.6, changeFrequency: "monthly" },
  { route: "/seo", docId: "seoServicePage-seo-services", priority: 0.9, changeFrequency: "monthly" },
  { route: "/seo/on-page", docId: "seoServicePage-on-page-seo", priority: 0.9, changeFrequency: "monthly" },
  { route: "/seo/technical", docId: "seoServicePage-technical-seo", priority: 0.9, changeFrequency: "monthly" },
  { route: "/seo/local", docId: "seoServicePage-local-seo", priority: 0.9, changeFrequency: "monthly" },
  { route: "/seo/keyword-research", docId: "seoServicePage-keyword-strategy", priority: 0.9, changeFrequency: "monthly" },
  { route: "/seo/content-creation", docId: "seoServicePage-content-creation", priority: 0.9, changeFrequency: "monthly" },
  { route: "/seo/e-commerce", docId: "seoServicePage-ecommerce-seo", priority: 0.9, changeFrequency: "monthly" },
  { route: "/seo/linkbuilding", docId: "linkBuildingPage", priority: 0.9, changeFrequency: "monthly" },
  { route: "/seo/reddit-marketing", docId: "redditMarketingPage", priority: 0.9, changeFrequency: "monthly" },
  { route: "/white-label-seo-partnership", docId: "partnershipPage", priority: 0.8, changeFrequency: "monthly" },
  { route: "/blog", docId: null, priority: 0.8, changeFrequency: "weekly" },
  { route: "/case-study", docId: null, priority: 0.8, changeFrequency: "monthly" },
  { route: "/podcast", docId: null, priority: 0.8, changeFrequency: "weekly" },
  { route: "/contact", docId: "contactPage", priority: 0.8, changeFrequency: "yearly" },
  { route: "/privacy-policy", docId: "legalPage-privacy-policy", priority: 0.3, changeFrequency: "yearly" },
];

const url = (route: string) => (route === "/" ? `${SITE_URL}/` : `${SITE_URL}${route}/`);

const latest = (dates: Array<string | undefined>): string | undefined =>
  dates.filter((d): d is string => Boolean(d)).sort().at(-1);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries = await getSitemapEntries().catch(() => null);
  const pageDates = new Map((entries?.pages ?? []).map((p) => [p._id, p._updatedAt]));
  // WHY: listing pages change whenever one of their items does.
  const listingDates: Record<string, string | undefined> = {
    "/blog": latest((entries?.posts ?? []).map((p) => p._updatedAt)),
    "/case-study": latest((entries?.caseStudies ?? []).map((c) => c._updatedAt)),
    "/podcast": latest((entries?.episodes ?? []).map((e) => e._updatedAt)),
    "/about": latest((entries?.team ?? []).map((t) => t._updatedAt)),
  };

  const dated = (route: string, lastModified: string | undefined, priority: number, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]): MetadataRoute.Sitemap[number] => ({
    url: url(route),
    ...(lastModified ? { lastModified } : {}),
    changeFrequency,
    priority,
  });

  return [
    ...PAGE_ROUTES.map((p) => dated(p.route, (p.docId ? pageDates.get(p.docId) : undefined) ?? listingDates[p.route], p.priority, p.changeFrequency)),
    ...(entries?.posts ?? []).map((p) => dated(`/seo/${p.urlCategory}/${p.slug}`, p._updatedAt, 0.7, "monthly")),
    ...(entries?.caseStudies ?? []).map((c) => dated(`/case-study/${c.slug}`, c._updatedAt, 0.7, "monthly")),
    ...(entries?.episodes ?? []).map((e) => dated(`/podcast/${e.slug}`, e._updatedAt, 0.7, "monthly")),
    ...(entries?.team ?? []).map((t) => dated(`/about/${t.slug}`, t._updatedAt, 0.6, "yearly")),
  ];
}
