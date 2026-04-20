import type { Metadata } from "next";
import { normalizePath } from "@/lib/normalize-path";
import { SITE_NAME } from "@/lib/site";

interface PageMetadataOptions {
  title: string;
  description: string;
  path: string;
  ogType?: "website" | "article";
}

const DEFAULT_OG_IMAGE = "/opengraph-image";

export function createPageMetadata({ title, description, path, ogType = "website" }: PageMetadataOptions): Metadata {
  const canonicalPath = normalizePath(path);

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      type: ogType,
      locale: "en_US",
      siteName: SITE_NAME,
      title,
      description,
      url: canonicalPath,
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} Open Graph Image`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@heroicrankings",
      creator: "@heroicrankings",
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}
