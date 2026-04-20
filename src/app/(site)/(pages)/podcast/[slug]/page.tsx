import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PodcastEpisodePage } from "@/components/pages/podcast/podcast-episode-page";
import { createPageMetadata } from "@/lib/metadata";
import {
  getEpisodeBySlug,
  getEpisodeSlugs,
  getRelatedEpisodes,
} from "@/data/podcast-episodes";

interface PodcastEpisodePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PodcastEpisodePageProps): Promise<Metadata> {
  const { slug } = await params;
  const episode = getEpisodeBySlug(slug);

  if (!episode) {
    notFound();
  }

  return createPageMetadata({
    title: `${episode.title} — EP ${episode.episodeNumber} with ${episode.guest}`,
    description: episode.description,
    path: `/podcast/${slug}`,
    ogType: "article",
  });
}

export function generateStaticParams() {
  return getEpisodeSlugs().map((slug) => ({ slug }));
}

export default async function PodcastSlugPage({ params }: PodcastEpisodePageProps) {
  const { slug } = await params;
  const episode = getEpisodeBySlug(slug);

  if (!episode) {
    notFound();
  }

  const relatedEpisodes = getRelatedEpisodes(slug, 3);

  return <PodcastEpisodePage episode={episode} relatedEpisodes={relatedEpisodes} />;
}
