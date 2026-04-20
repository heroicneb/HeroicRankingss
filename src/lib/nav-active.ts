import { normalizePath } from "@/lib/normalize-path";

const SEO_ROUTES = new Set([
  "/seo-services",
  "/on-page-seo",
  "/local-seo",
  "/technical-seo",
  "/ecommerce-seo",
  "/content-creation",
  "/keyword-strategy",
]);

interface NavActiveItem {
  href: string;
  label: string;
}

function isInsightsRoute(pathname: string) {
  return pathname === "/insights" || pathname.startsWith("/insights/");
}

function isCaseStudiesRoute(pathname: string) {
  return pathname === "/case-studies" || pathname.startsWith("/case-studies/");
}

function isSeoRoute(pathname: string) {
  return SEO_ROUTES.has(pathname);
}

export function isNavItemActive(pathname: string, item: NavActiveItem) {
  const normalizedPathname = normalizePath(pathname);

  if (item.label === "Insights") {
    return isInsightsRoute(normalizedPathname);
  }

  if (item.label === "Case Studies") {
    return isCaseStudiesRoute(normalizedPathname);
  }

  if (item.label === "SEO") {
    return isSeoRoute(normalizedPathname);
  }

  return normalizedPathname === normalizePath(item.href);
}
