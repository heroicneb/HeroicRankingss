import { headers } from "next/headers";

import { CSP_NONCE_HEADER } from "@/lib/csp";
import { safeJsonLdStringify } from "@/lib/safe-json-ld";
import { SITE_NAME, SITE_URL } from "@/lib/site";

interface ArticleSchemaProps {
  headline: string;
  datePublished: string | null;
  author: string | null;
  image: string | null;
  description: string | null;
}

export async function ArticleSchema({
  headline,
  datePublished,
  author,
  image,
  description,
}: ArticleSchemaProps) {
  const nonce = (await headers()).get(CSP_NONCE_HEADER) ?? undefined;

  const articleJsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };

  if (datePublished) {
    articleJsonLd.datePublished = datePublished;
  }

  if (author) {
    articleJsonLd.author = {
      "@type": "Person",
      name: author,
    };
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
