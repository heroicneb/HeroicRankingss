import { headers } from "next/headers";

import { CSP_NONCE_HEADER } from "@/lib/csp";
import { safeJsonLdStringify } from "@/lib/safe-json-ld";
import { SITE_NAME, SITE_URL } from "@/lib/site";

interface ServiceSchemaProps {
  /** Human name of the service as sold, e.g. "Link Building Services". */
  name: string;
  description: string;
  /** Site-relative path of the service page. */
  path: string;
  /** Short category label, e.g. "Search engine optimization". */
  serviceType: string;
}

/**
 * `Service` markup for a service page: what is offered, by whom, where to read
 * about it. No prices are published, so there is no Offer; the provider points
 * at the Organization emitted on every page.
 */
export async function ServiceSchema({ name, description, path, serviceType }: ServiceSchemaProps) {
  const nonce = (await headers()).get(CSP_NONCE_HEADER) ?? undefined;
  const url = `${SITE_URL}${path.endsWith("/") ? path : `${path}/`}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    serviceType,
    description,
    url,
    provider: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    areaServed: "Worldwide",
    availableLanguage: "English",
    mainEntityOfPage: url,
  };
  return <script dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(jsonLd) }} nonce={nonce} type="application/ld+json" />;
}
