/*
 * Every SEO service page in one place: default content, route and Studio
 * title. Used by the data mapper (fallbacks), the routes and the seed script.
 */

import { CONTENT_CREATION_PAGE } from "../content-creation/content-creation-content.ts";
import { ECOMMERCE_SEO_PAGE } from "../ecommerce-seo/ecommerce-seo-content.ts";
import { KEYWORD_STRATEGY_PAGE } from "../keyword-strategy/keyword-strategy-content.ts";
import { LOCAL_SEO_PAGE } from "../local-seo/local-seo-content.ts";
import { ON_PAGE_SEO_PAGE } from "../on-page-seo/on-page-seo-content.ts";
import { SEO_SERVICES_PAGE } from "../seo-services/seo-services-content.ts";
import { TECHNICAL_SEO_PAGE } from "../technical-seo/technical-seo-content.ts";
import type { SeoServicePageDefinition, SeoServicePageKey } from "./seo-service-content.ts";

export const SEO_SERVICE_PAGES: readonly SeoServicePageDefinition[] = [
  SEO_SERVICES_PAGE,
  ON_PAGE_SEO_PAGE,
  TECHNICAL_SEO_PAGE,
  LOCAL_SEO_PAGE,
  KEYWORD_STRATEGY_PAGE,
  CONTENT_CREATION_PAGE,
  ECOMMERCE_SEO_PAGE,
];

export function seoServicePage(key: SeoServicePageKey): SeoServicePageDefinition {
  const page = SEO_SERVICE_PAGES.find((p) => p.key === key);
  if (!page) throw new Error(`Unknown SEO service page: ${key}`);
  return page;
}

/** Sanity document id for a page key (singleton per page). */
export const seoServiceDocumentId = (key: SeoServicePageKey) => `seoServicePage-${key}`;
