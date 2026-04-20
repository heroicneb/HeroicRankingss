import type { Metadata } from "next";

import { ContactForm } from "@/components/pages/contact/contact-form";
import { PAGE_SHELL_CLASS, CONTENT_SHELL_CLASS } from "@/data/service-shared";
import { createPageMetadata } from "@/lib/metadata";
import type { SanityContactPage } from "@/lib/sanity-data";

export const metadata: Metadata = createPageMetadata({
  title: "Contact",
  description:
    "Get in touch with Heroic Rankings to discuss SEO strategy, technical optimization, and long-term organic growth opportunities.",
  path: "/contact",
});

interface ContactPageProps {
  cmsPage?: SanityContactPage | null;
}

export default function ContactPage({ cmsPage }: ContactPageProps) {
  const heading = cmsPage?.title?.trim() || "Connect with the Heroes of SEO";
  const intro = cmsPage?.intro?.trim() || "";
  const email = cmsPage?.email?.trim() || "";

  return (
    <section className="pb-[100px] pt-[60px] lg:pt-[120px]" id="contact-page">
      <div className={PAGE_SHELL_CLASS}>
        <div
          className={`${CONTENT_SHELL_CLASS} flex flex-col gap-[80px] xl:grid xl:grid-cols-[500px_630px] xl:gap-x-[150px] xl:gap-y-0`}
        >
          <div className="w-full max-w-[501px]">
            <h1 className="gradient-text-brand gradient-text-contact-title w-full text-[48px] font-normal leading-[62px] tracking-[-1.24px] sm:text-[56px] sm:leading-[72px] xl:text-[62px] xl:leading-[80px]">
              {heading}
            </h1>

            {intro ? (
              <p className="mt-10 w-full max-w-[500px] text-[18px] font-normal leading-[24px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
                {intro}
              </p>
            ) : null}

            {email ? (
              <a
                className="mt-10 inline-flex min-h-[44px] items-center text-[28px] font-medium leading-[32px] tracking-[-0.64px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] sm:text-[32px]"
                href={`mailto:${email}`}
              >
                /&nbsp;&nbsp;
                <span className="gradient-text-brand gradient-text-contact-title">
                  {email}
                </span>
              </a>
            ) : null}
          </div>

          <ContactForm />
        </div>
      </div>
    </section>
  );
}
