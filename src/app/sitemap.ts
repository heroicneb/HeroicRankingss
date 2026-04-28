import type { MetadataRoute } from "next";

import { getCaseStudySlugs, getPostSlugs } from "@/lib/sanity-data";
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

const LISTING_PAGES = new Set(["/insights", "/case-studies"]);

function getRoutePriority(route: string): number {
  if (route === "/") return 1.0;
  if (SERVICE_PAGES.has(route)) return 0.9;
  if (LISTING_PAGES.has(route)) return 0.8;
  if (route.startsWith("/insights/") || route.startsWith("/case-studies/")) return 0.7;
  if (route === "/privacy-policy") return 0.3;
  return 0.8;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [postSlugs, caseStudySlugs] = await Promise.all([
    getPostSlugs(),
    getCaseStudySlugs(),
  ]);
  const routes: string[] = [
    "/",
    "/about-us",
    "/seo-services",
    "/on-page-seo",
    "/technical-seo",
    "/local-seo",
    "/keyword-strategy",
    "/content-creation",
    "/ecommerce-seo",
    "/link-building",
    "/partnership",
    "/insights",
    "/case-studies",
    "/contact",
    "/privacy-policy",
    ...postSlugs.map((slug) => `/insights/${slug}`),
    ...caseStudySlugs.map((slug) => `/case-studies/${slug}`),
  ];

  return routes.map((route) => ({
    url: route === "/" ? SITE_URL : `${SITE_URL}${route}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: getRoutePriority(route),
  }));
}
