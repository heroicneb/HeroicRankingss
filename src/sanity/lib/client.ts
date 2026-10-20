import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId, studioUrl } from "../env";

/*
 * WHY: on localhost the site reads Sanity DRAFTS, so an article that is still
 * unpublished in the Studio can be reviewed as a real page at
 * http://localhost:3000/... before anyone presses Publish. Production (and
 * Vercel previews) keep reading published content only. Drafts need a token
 * and bypass the CDN; the local write token from .env.local serves both.
 */
const readDraftsLocally = process.env.NODE_ENV === "development" && Boolean(process.env.SANITY_API_WRITE_TOKEN);

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: !readDraftsLocally,
  ...(readDraftsLocally ? { token: process.env.SANITY_API_WRITE_TOKEN, perspective: "drafts" as const } : {}),
  stega: {
    studioUrl,
    enabled: process.env.NEXT_PUBLIC_VERCEL_ENV === "preview",
  },
});
