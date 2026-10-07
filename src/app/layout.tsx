import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { SiteAnalytics } from "@/components/analytics/SiteAnalytics";

import { SITE_INDEXING_ENABLED } from "@/lib/indexing";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

import "./globals.css";

const dmSans = DM_Sans({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
    url: SITE_URL,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/og/default.png",
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} Open Graph Image`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: ["/og/default.png"],
  },
  // Locked until NEXT_PUBLIC_SITE_INDEXING=true (see src/lib/indexing.ts).
  robots: SITE_INDEXING_ENABLED
    ? {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
      }
    : {
        index: false,
        follow: false,
        nocache: true,
        googleBot: { index: false, follow: false, noimageindex: true, "max-video-preview": -1, "max-image-preview": "none", "max-snippet": -1 },
      },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://va.vercel-scripts.com" />
        <link rel="dns-prefetch" href="https://va.vercel-scripts.com" />
        <link
          rel="preconnect"
          href="https://cdn.sanity.io"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
      </head>
      {/* WHY: browser extensions (Grammarly adds data-gr-* attributes) mutate <body> before React hydrates; only attribute diffs on this element are ignored. */}
      <body
        className={`${dmSans.variable} flex min-h-screen flex-col overflow-x-hidden bg-[var(--color-hr-pure-white)] dark:bg-[var(--color-bg-dark)]`}
        suppressHydrationWarning
      >
        {children}
        <Analytics />
        <SpeedInsights />
        <SiteAnalytics />
      </body>
    </html>
  );
}
