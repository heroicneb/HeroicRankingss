import type { ReactNode } from "react";
import { Suspense } from "react";
import { headers } from "next/headers";
import { draftMode } from "next/headers";
import { ThemeProvider } from "next-themes";
import { VisualEditing } from "next-sanity/visual-editing";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { CSP_NONCE_HEADER } from "@/lib/csp";
import { getSiteSettings } from "@/lib/sanity-data";
import { safeJsonLdStringify } from "@/lib/safe-json-ld";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import { DisableDraftMode } from "@/components/sanity/DisableDraftMode";
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema";
import { OrganizationSchema } from "@/components/seo/organization-schema";
import { SanityLive } from "@/sanity/lib/live";

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  inLanguage: "en-US",
};
const websiteJsonLdString = safeJsonLdStringify(websiteJsonLd);

async function WebsiteSchemaScript() {
  const nonce = (await headers()).get(CSP_NONCE_HEADER) ?? undefined;

  return (
    <script
      dangerouslySetInnerHTML={{ __html: websiteJsonLdString }}
      nonce={nonce}
      type="application/ld+json"
    />
  );
}

export default async function SiteLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const [{ isEnabled: isDraftMode }, settings, requestHeaders] =
    await Promise.all([
      draftMode(),
      getSiteSettings().catch((err) => {
        console.error("[SiteLayout] Failed to fetch siteSettings:", err);
        return null;
      }),
      headers(),
    ]);

  if (!settings) {
    console.error(
      "[SiteLayout] Missing siteSettings — rendering with fallback nav",
    );
  }

  const themeProviderNonce = requestHeaders.get(CSP_NONCE_HEADER) ?? undefined;

  return (
    <>
      <a
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-[var(--radius-button)] focus:bg-[var(--color-hr-pure-white)] focus:px-4 focus:py-2 focus:text-[var(--color-hr-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--color-hr-accent)] dark:focus:bg-[var(--color-bg-dark)] dark:focus:text-[var(--color-text-inverse)]"
        href="#main-content"
      >
        Skip to main content
      </a>
      <Suspense fallback={null}>
        <WebsiteSchemaScript />
      </Suspense>
      <Suspense fallback={null}>
        <OrganizationSchema />
      </Suspense>
      <Suspense fallback={null}>
        <BreadcrumbSchema />
      </Suspense>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        disableTransitionOnChange
        nonce={themeProviderNonce}
        enableSystem={false}
        storageKey="hr-theme"
      >
        <Navbar
          navItems={settings?.navItems ?? []}
          phone={settings?.phone ?? ""}
          ctaLabel={settings?.headerCtaLabel ?? "Get Started"}
          ctaUrl={settings?.headerCtaUrl ?? "/contact"}
        />
        <main className="flex-1" id="main-content">
          {children}
        </main>
        <Footer
          navLinks={settings?.footerNavItems ?? []}
          socialLinks={settings?.socialLinks ?? []}
          copyrightText={
            settings?.copyrightText ??
            `© ${new Date().getFullYear()} Heroic Rankings`
          }
          footerCtaHeading={settings?.footerCtaHeading ?? ""}
          footerCtaBody={settings?.footerCtaBody ?? ""}
          footerCtaLabel={settings?.footerCtaLabel ?? "Get Started"}
          footerCtaUrl={settings?.footerCtaUrl ?? "/contact"}
        />
      </ThemeProvider>
      <SanityLive refreshOnFocus={false} />
      {isDraftMode && (
        <>
          <VisualEditing />
          <DisableDraftMode />
        </>
      )}
    </>
  );
}
