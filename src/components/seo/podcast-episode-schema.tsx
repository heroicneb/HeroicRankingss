import { headers } from "next/headers";

import { CSP_NONCE_HEADER } from "@/lib/csp";
import { safeJsonLdStringify } from "@/lib/safe-json-ld";
import { SITE_NAME, SITE_URL } from "@/lib/site";

interface PodcastEpisodeSchemaProps {
  title: string;
  description: string | null;
  path: string;
  episodeNumber: number | null;
  /** Display duration as entered in the Studio, e.g. "1h 11min" or "48 min". */
  duration: string | null;
  datePublished: string | null;
  dateModified: string | null;
  /** YouTube watch or embed URL of the full episode. */
  videoUrl: string | null;
  image: string | null;
  guestName: string | null;
}

export const PODCAST_SERIES_NAME = "Ranking Heroes SEO Podcast";

/** "1h 11min" → "PT1H11M"; "48 min" → "PT48M". Anything else returns null. */
export function toIsoDuration(value: string | null): string | null {
  if (!value) return null;
  const hours = value.match(/(\d+)\s*h/i)?.[1];
  const minutes = value.match(/(\d+)\s*m/i)?.[1];
  if (!hours && !minutes) return null;
  return `PT${hours ? `${Number(hours)}H` : ""}${minutes ? `${Number(minutes)}M` : ""}`;
}

/** Extracts the 11-character YouTube id from watch, short or embed URLs. */
export function youtubeId(url: string | null): string | null {
  if (!url) return null;
  const match = url.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/);
  return match?.[1] ?? null;
}

/**
 * `PodcastEpisode` + `VideoObject` for an episode page, tied to one
 * `PodcastSeries`. The video object is what Google's video results and AI
 * engines read; the episode object names the guest and the series.
 */
export async function PodcastEpisodeSchema(props: PodcastEpisodeSchemaProps) {
  const nonce = (await headers()).get(CSP_NONCE_HEADER) ?? undefined;
  const url = `${SITE_URL}${props.path.endsWith("/") ? props.path : `${props.path}/`}`;
  const id = youtubeId(props.videoUrl);
  const isoDuration = toIsoDuration(props.duration);

  const video = id
    ? {
        "@type": "VideoObject",
        name: props.title,
        description: props.description ?? props.title,
        thumbnailUrl: [`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`, `https://i.ytimg.com/vi/${id}/hqdefault.jpg`],
        uploadDate: props.datePublished ?? undefined,
        duration: isoDuration ?? undefined,
        embedUrl: `https://www.youtube.com/embed/${id}`,
        contentUrl: `https://www.youtube.com/watch?v=${id}`,
      }
    : null;

  const episode: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "PodcastEpisode",
    name: props.title,
    url,
    mainEntityOfPage: url,
    partOfSeries: { "@type": "PodcastSeries", name: PODCAST_SERIES_NAME, url: `${SITE_URL}/podcast/` },
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  };
  if (props.description) episode.description = props.description;
  if (props.episodeNumber != null) episode.episodeNumber = props.episodeNumber;
  if (props.datePublished) episode.datePublished = props.datePublished;
  if (props.dateModified) episode.dateModified = props.dateModified;
  if (isoDuration) episode.timeRequired = isoDuration;
  if (props.image) episode.image = props.image;
  if (props.guestName) episode.actor = { "@type": "Person", name: props.guestName };
  if (video) episode.associatedMedia = video;

  return <script dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(episode) }} nonce={nonce} type="application/ld+json" />;
}
