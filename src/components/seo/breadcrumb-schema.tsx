import { headers } from "next/headers";

import { CSP_NONCE_HEADER } from "@/lib/csp";
import { safeJsonLdStringify } from "@/lib/safe-json-ld";
import { SITE_URL } from "@/lib/site";

interface BreadcrumbItem {
  name: string;
  href: string;
}

interface BreadcrumbSchemaProps {
  items?: BreadcrumbItem[];
}

/** Map known URL slugs to human-readable breadcrumb labels. */
const SLUG_LABELS: Record<string, string> = {
  "about-us": "About Us",
  "case-studies": "Case Studies",
  insights: "Insights",
  partnership: "Partnership",
  contact: "Contact",
  "privacy-policy": "Privacy Policy",
  "seo-services": "SEO Services",
  "on-page-seo": "On-Page SEO",
  "technical-seo": "Technical SEO",
  "local-seo": "Local SEO",
  "ecommerce-seo": "Ecommerce SEO",
  "content-creation": "Content Creation",
  "keyword-strategy": "Keyword Strategy",
  "link-building": "Link Building",
};

/** Convert an unknown slug to title case as a fallback. */
function slugToTitle(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/** Build breadcrumb items from a pathname like "/about-us" or "/case-study/acme". */
function buildBreadcrumbsFromPath(pathname: string): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [{ name: "Home", href: "/" }];

  const segments = pathname.split("/").filter(Boolean);

  let cumulativePath = "";
  for (const segment of segments) {
    cumulativePath += `/${segment}`;
    const label = SLUG_LABELS[segment] ?? slugToTitle(segment);
    items.push({ name: label, href: cumulativePath });
  }

  return items;
}

export async function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const hdrs = await headers();
  const nonce = hdrs.get(CSP_NONCE_HEADER) ?? undefined;

  let breadcrumbItems: BreadcrumbItem[];

  if (items && items.length > 0) {
    breadcrumbItems = items;
  } else {
    const pathname = hdrs.get("x-pathname") ?? "/";
    breadcrumbItems = buildBreadcrumbsFromPath(pathname);
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.href}`,
    })),
  };

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: safeJsonLdStringify(breadcrumbJsonLd),
      }}
      nonce={nonce}
      type="application/ld+json"
    />
  );
}
