import type { Metadata } from "next";
import { PortableText } from "@portabletext/react";

import { portableTextComponents } from "@/components/sanity/PortableTextComponents";
import { createPageMetadata } from "@/lib/metadata";
import type { SanityLegalPage } from "@/lib/sanity-data";

export const metadata: Metadata = createPageMetadata({
  title: "Privacy Policy",
  description:
    "Review how Heroic Rankings handles personal information, communication preferences, and data protection practices.",
  path: "/privacy-policy",
});

interface PrivacyPolicyPageProps {
  cmsPage?: SanityLegalPage | null;
}

export default function PrivacyPolicyPage({ cmsPage }: PrivacyPolicyPageProps) {
  const title = cmsPage?.title?.trim() || "Privacy Policy";
  const intro = cmsPage?.intro?.trim() || "";

  return (
    <section className="pt-[100px] lg:pt-[109px]">
      <div className="mx-auto w-full max-w-[960px] px-5 pb-[80px] md:px-10 xl:px-[80px]">
        <h1 className="text-[38px] font-normal leading-[1.2] tracking-[-0.76px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] sm:text-[48px] sm:tracking-[-0.96px]">
          {title}
        </h1>
        {intro ? (
          <p className="mt-5 text-[18px] leading-[1.4] text-[var(--color-hr-grey)] dark:text-[var(--color-text-inverse-50)]">
            {intro}
          </p>
        ) : null}

        {cmsPage?.body?.length ? (
          <article className="mt-10 text-[18px] leading-[1.4] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
            <PortableText components={portableTextComponents} value={cmsPage.body} />
          </article>
        ) : (
          <p className="mt-10 text-[18px] leading-[1.4] text-[var(--color-hr-grey)] dark:text-[var(--color-text-inverse-60)]">
            Privacy policy content is being prepared.
          </p>
        )}
      </div>
    </section>
  );
}
