import type { MetadataRoute } from "next";

import {
  getCaseStudySlugs,
  getPostSlugs,
  getTeamMemberSlugs,
} from "@/lib/sanity-data";
import { SITE_URL } from "@/lib/site";

// WHY: Use build-time generation timestamp to avoid stale manual dates while keeping static output.
const LAST_MODIFIED = new Date().toISOString();

const SERVICE_PAGES = new Set([
  "/seo-services",
  "/on-page-seo",
  "/technical-seo",
  "/local-seo",
  "/keyword-strategy",
  "/content-creation",
  "/ecommerce-seo",
  "/link-building",
]);

const LISTING_PAGES = new Set(["/blog", "/case-study"]);

function getRoutePriority(route: string): number {
  if (route === "/") return 1.0;
  if (SERVICE_PAGES.has(route)) return 0.9;
  if (LISTING_PAGES.has(route)) return 0.8;
  if (route.startsWith("/blog/") || route.startsWith("/case-study/"))
    return 0.7;
  if (route.startsWith("/about/")) return 0.6;
  if (route === "/privacy-policy") return 0.3;
  return 0.8;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [postSlugs, caseStudySlugs, teamSlugs] = await Promise.all([
    getPostSlugs(),
    getCaseStudySlugs(),
    getTeamMemberSlugs(),
  ]);
  const routes: string[] = [
    "/",
    "/about",
    "/seo-services",
    "/on-page-seo",
    "/technical-seo",
    "/local-seo",
    "/keyword-strategy",
    "/content-creation",
    "/ecommerce-seo",
    "/link-building",
    "/partnership",
    "/blog",
    "/case-study",
    "/contact",
    "/privacy-policy",
    ...postSlugs.map((slug) => `/blog/${slug}`),
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
