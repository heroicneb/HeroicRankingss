import type { Metadata } from "next";
import { normalizePath } from "@/lib/normalize-path";
import { SITE_NAME } from "@/lib/site";

interface PageMetadataOptions {
  title: string;
  description: string;
  path: string;
  ogType?: "website" | "article";
  /**
   * Use the title exactly as given (no " | Heroic Rankings" added). Set when
   * the title was written in the Studio or reviewed in the metadata sheet.
   */
  exactTitle?: boolean;
  /** Page-specific preview image (1200×630); the site image is the fallback. */
  image?: { url: string; alt?: string } | null;
}

const DEFAULT_OG_IMAGE = "/og/default.png";
const TITLE_SUFFIX = ` | ${SITE_NAME}`;
/** Google shows roughly 60 characters of a title and 155–160 of a description. */
const MAX_TITLE_WITH_SUFFIX = 60;
const MAX_DESCRIPTION = 160;

/** Cuts at a word boundary and adds an ellipsis when the text is longer than `max`. */
export function clampDescription(text: string, max = MAX_DESCRIPTION): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const end = Math.max(cut.lastIndexOf(" "), cut.lastIndexOf(", "), cut.lastIndexOf(". "));
  return `${cut.slice(0, end > max * 0.6 ? end : cut.length).replace(/[,.;:\s]+$/, "")}…`;
}

/**
 * Page title as the <title> tag: the layout template appends " | Heroic Rankings".
 * WHY: a suffix pushes many post titles past what Google displays, and some callers
 * already include it — so strip a duplicate and drop the suffix when it would not fit.
 */
function resolveTitle(title: string, exact: boolean): Metadata["title"] {
  if (exact) return { absolute: title.trim() };
  const base = title.replace(new RegExp(`(\\s*\\|\\s*${SITE_NAME})+$`), "").trim();
  return base.length + TITLE_SUFFIX.length <= MAX_TITLE_WITH_SUFFIX ? base : { absolute: base };
}

export function createPageMetadata({ title: rawTitle, description: rawDescription, path, ogType = "website", exactTitle = false, image = null }: PageMetadataOptions): Metadata {
  const canonicalPath = normalizePath(path);
  const title = rawTitle.replace(new RegExp(`(\\s*\\|\\s*${SITE_NAME})+$`), "").trim();
  const description = clampDescription(rawDescription);

  return {
    title: resolveTitle(rawTitle, exactTitle),
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
          url: image?.url ?? DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: image?.alt ?? `${SITE_NAME} Open Graph Image`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image?.url ?? DEFAULT_OG_IMAGE],
    },
  };
}
