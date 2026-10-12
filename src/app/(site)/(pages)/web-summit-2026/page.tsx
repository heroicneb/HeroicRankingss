import type { Metadata } from "next";

import { WebSummitPage } from "@/components/pages/web-summit/web-summit-page";
import { WEB_SUMMIT_PATH, WEB_SUMMIT_SEO } from "@/components/pages/web-summit/web-summit-content";
import { createPageMetadata } from "@/lib/metadata";

/**
 * Event page for Web Summit attendees. Deliberately kept out of search:
 * meta robots noindex here, X-Robots-Tag in next.config.ts, and the route
 * is not in the sitemap. Reached by the link or QR code we hand out.
 */
export function generateMetadata(): Metadata {
  return {
    ...createPageMetadata({ title: WEB_SUMMIT_SEO.title, exactTitle: true, description: WEB_SUMMIT_SEO.description, path: WEB_SUMMIT_PATH }),
    robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  };
}

export default function WebSummitRoute() {
  return <WebSummitPage />;
}
