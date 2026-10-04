import { headers } from "next/headers";

import { CSP_NONCE_HEADER } from "@/lib/csp";
import { safeJsonLdStringify } from "@/lib/safe-json-ld";
import { SITE_NAME, SITE_URL } from "@/lib/site";

interface ArticleSchemaProps {
  headline: string;
  datePublished: string | null;
  /** Last edit; Google and AI engines use it for freshness. */
  dateModified?: string | null;
  author: string | null;
  /** Team profile URL for the author, so the Person resolves to an entity. */
  authorUrl?: string | null;
  image: string | null;
  description: string | null;
  /** Absolute URL of the page; becomes mainEntityOfPage. */
  url?: string | null;
  /** Article for posts and case studies; defaults to Article. */
  type?: "Article" | "BlogPosting";
}

export async function ArticleSchema({
  headline,
  datePublished,
  dateModified,
  author,
  authorUrl,
  image,
  description,
  url,
  type = "Article",
}: ArticleSchemaProps) {
  const nonce = (await headers()).get(CSP_NONCE_HEADER) ?? undefined;

  const articleJsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": type,
    headline,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/brand/heroic-rankings-logo.png`, width: 1200, height: 506 },
    },
  };

  if (url) {
    articleJsonLd.url = url;
    articleJsonLd.mainEntityOfPage = { "@type": "WebPage", "@id": url };
  }

  if (datePublished) {
    articleJsonLd.datePublished = datePublished;
    // WHY: dateModified never precedes datePublished; fall back to the publish date.
    articleJsonLd.dateModified = dateModified && dateModified > datePublished ? dateModified : datePublished;
  } else if (dateModified) {
    articleJsonLd.dateModified = dateModified;
  }

  if (author) {
    const person: Record<string, unknown> = { "@type": "Person", name: author };
    if (authorUrl) person.url = authorUrl;
    articleJsonLd.author = person;
  } else {
    articleJsonLd.author = { "@type": "Organization", name: SITE_NAME, url: SITE_URL };
  }

  if (image) {
    articleJsonLd.image = image;
  }

  if (description) {
    articleJsonLd.description = description;
  }

  return (
    <script
      dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(articleJsonLd) }}
      nonce={nonce}
      type="application/ld+json"
    />
  );
}
