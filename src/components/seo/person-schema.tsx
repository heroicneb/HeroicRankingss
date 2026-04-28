import { headers } from "next/headers";

import { CSP_NONCE_HEADER } from "@/lib/csp";
import { safeJsonLdStringify } from "@/lib/safe-json-ld";
import { SITE_NAME, SITE_URL } from "@/lib/site";

interface PersonSchemaProps {
  /** Public team member name. */
  name: string;
  /** Job title / role label, after sanitizing the "/ Foo /" decoration. */
  jobTitle?: string | null;
  /** Short biography string used as `description`. */
  description?: string | null;
  /** Absolute URL to the person's primary photo. */
  image?: string | null;
  /** Slug used to build the canonical /team/<slug> URL. */
  slug: string;
  /** Topics this person is known for; populates `Person.knowsAbout`. */
  knowsAbout?: string[];
  /** External profile URLs (LinkedIn, X, etc.). Empty strings are ignored. */
  sameAs?: Array<string | null | undefined>;
  /** ISO timestamp the underlying profile was first created/published. */
  dateCreated?: string | null;
  /** ISO timestamp the profile was last modified. */
  dateModified?: string | null;
}

/**
 * Emits both `Person` and `ProfilePage` JSON-LD for a team member detail page.
 * Person sits as `mainEntity` per Google's profile-page guidance:
 * https://developers.google.com/search/docs/appearance/structured-data/profile-page
 */
export async function PersonSchema({
  name,
  jobTitle,
  description,
  image,
  slug,
  knowsAbout,
  sameAs,
  dateCreated,
  dateModified,
}: PersonSchemaProps) {
  const nonce = (await headers()).get(CSP_NONCE_HEADER) ?? undefined;

  const profileUrl = `${SITE_URL}/team/${slug}`;

  const cleanedSameAs = (sameAs ?? [])
    .map((value) => (typeof value === "string" ? value.trim() : ""))
    .filter((value) => value.length > 0);

  const person: Record<string, unknown> = {
    "@type": "Person",
    name,
    url: profileUrl,
    worksFor: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };

  if (jobTitle?.trim()) {
    person.jobTitle = jobTitle.trim();
  }
  if (description?.trim()) {
    person.description = description.trim();
  }
  if (image?.trim()) {
    person.image = image.trim();
  }
  if (knowsAbout && knowsAbout.length > 0) {
    person.knowsAbout = knowsAbout;
  }
  if (cleanedSameAs.length > 0) {
    person.sameAs = cleanedSameAs;
  }

  const profilePage: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: profileUrl,
    mainEntity: person,
  };

  if (dateCreated) {
    profilePage.dateCreated = dateCreated;
  }
  if (dateModified) {
    profilePage.dateModified = dateModified;
  }

  return (
    <script
      dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(profilePage) }}
      nonce={nonce}
      type="application/ld+json"
    />
  );
}
