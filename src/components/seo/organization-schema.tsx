import { headers } from "next/headers";

import { CSP_NONCE_HEADER } from "@/lib/csp";
import { safeJsonLdStringify } from "@/lib/safe-json-ld";
import { SITE_DESCRIPTION, SITE_INSTAGRAM_URL, SITE_LINKEDIN_URL, SITE_NAME, SITE_URL, SITE_YOUTUBE_URL } from "@/lib/site";

/**
 * The company entity, emitted on every page. Facts here are the ones the site
 * itself states (phone from the site settings, founder from the team page);
 * nothing is invented.
 */
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  legalName: "Heroic Rankings",
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  logo: { "@type": "ImageObject", url: `${SITE_URL}/brand/heroic-rankings-logo.png`, width: 1200, height: 506 },
  image: `${SITE_URL}/brand/heroic-rankings-logo.png`,
  founder: { "@type": "Person", name: "Nebojsa Jankovic", jobTitle: "Founder & CEO", url: `${SITE_URL}/about/nebojsa-jankovic/` },
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+1-719-512-4616",
      email: "sales@heroicrankings.com",
      contactType: "sales",
      availableLanguage: ["English"],
      url: `${SITE_URL}/contact/`,
    },
  ],
  areaServed: "Worldwide",
  knowsAbout: [
    "Search engine optimization",
    "Link building",
    "Technical SEO",
    "Local SEO",
    "E-commerce SEO",
    "Answer engine optimization",
    "Generative engine optimization",
    "Reddit marketing",
    "White-label SEO",
  ],
  sameAs: [SITE_LINKEDIN_URL, SITE_INSTAGRAM_URL, SITE_YOUTUBE_URL],
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
