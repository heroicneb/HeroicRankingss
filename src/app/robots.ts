import type { MetadataRoute } from "next";

import { SITE_INDEXING_ENABLED } from "@/lib/indexing";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // Locked until NEXT_PUBLIC_SITE_INDEXING=true (see src/lib/indexing.ts).
  return {
    rules: SITE_INDEXING_ENABLED
      ? [{ userAgent: "*", allow: "/", disallow: ["/api/", "/studio/", "/navbar-preview/"] }]
      : [{ userAgent: "*", disallow: "/" }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
