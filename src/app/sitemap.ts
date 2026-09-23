import type { MetadataRoute } from "next";

import {
  getCaseStudySlugs,
  getPostUrls,
  getTeamMemberSlugs,
} from "@/lib/sanity-data";
import { SITE_URL } from "@/lib/site";

// WHY: Use build-time generation timestamp to avoid stale manual dates while keeping static output.
const LAST_MODIFIED = new Date().toISOString();

const SERVICE_PAGES = new Set([
  "/seo",
  "/seo/on-page",
  "/seo/technical",
  "/seo/local",
  "/seo/keyword-research",
  "/seo/content-creation",
  "/seo/e-commerce",
  "/seo/linkbuilding",
  "/seo/reddit-marketing",
]);

const LISTING_PAGES = new Set(["/blog", "/case-study"]);

function getRoutePriority(route: string): number {
  if (route === "/") return 1.0;
  if (SERVICE_PAGES.has(route)) return 0.9;
  if (LISTING_PAGES.has(route)) return 0.8;
  if (route.startsWith("/seo/") || route.startsWith("/case-study/")) return 0.7;
  if (route.startsWith("/about/")) return 0.6;
  if (route === "/privacy-policy") return 0.3;
  return 0.8;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [postUrls, caseStudySlugs, teamSlugs] = await Promise.all([
    getPostUrls(),
    getCaseStudySlugs(),
    getTeamMemberSlugs(),
  ]);
  const routes: string[] = [
    "/",
    "/about",
    "/seo",
    "/seo/on-page",
    "/seo/technical",
    "/seo/local",
    "/seo/keyword-research",
    "/seo/content-creation",
    "/seo/e-commerce",
    "/seo/linkbuilding",
    "/seo/reddit-marketing",
    "/partnership",
    "/blog",
    "/case-study",
    "/contact",
    "/privacy-policy",
    // WHY: Posts emit at /seo/<urlCategory>/<slug>/ to match legacy
    // heroicrankings.com canonical URLs. Posts without urlCategory set
    // are skipped — they have no canonical URL until the editor fills
    // the field.
    ...postUrls
      .filter((p) => p.urlCategory)
      .map((p) => `/seo/${p.urlCategory}/${p.slug}`),
    ...caseStudySlugs.map((slug) => `/case-study/${slug}`),
    ...teamSlugs.map((slug) => `/about/${slug}`),
  ];

  return routes.map((route) => ({
    url: route === "/" ? SITE_URL : `${SITE_URL}${route}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: getRoutePriority(route),
  }));
}
