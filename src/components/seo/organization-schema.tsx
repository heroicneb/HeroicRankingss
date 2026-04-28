import { headers } from "next/headers";

import { CSP_NONCE_HEADER } from "@/lib/csp";
import { safeJsonLdStringify } from "@/lib/safe-json-ld";
import { SITE_LINKEDIN_URL, SITE_NAME, SITE_URL, SITE_X_URL } from "@/lib/site";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/figma/navbar/logo-wordmark.svg`,
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+1 307 336 7191",
    contactType: "customer service",
  },
  sameAs: [SITE_LINKEDIN_URL, SITE_X_URL],
};
const organizationJsonLdString = safeJsonLdStringify(organizationJsonLd);

export async function OrganizationSchema() {
  const nonce = (await headers()).get(CSP_NONCE_HEADER) ?? undefined;

  return (
    <script
      dangerouslySetInnerHTML={{ __html: organizationJsonLdString }}
      nonce={nonce}
      type="application/ld+json"
    />
  );
}
