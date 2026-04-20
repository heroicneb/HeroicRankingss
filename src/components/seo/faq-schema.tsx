import { headers } from "next/headers";

import { CSP_NONCE_HEADER } from "@/lib/csp";
import { safeJsonLdStringify } from "@/lib/safe-json-ld";

interface FaqSchemaProps {
  items: ReadonlyArray<{ question: string; answer: string }>;
}

export async function FaqSchema({ items }: FaqSchemaProps) {
  const nonce = (await headers()).get(CSP_NONCE_HEADER) ?? undefined;

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <script
      dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(faqJsonLd) }}
      nonce={nonce}
      type="application/ld+json"
    />
  );
}
