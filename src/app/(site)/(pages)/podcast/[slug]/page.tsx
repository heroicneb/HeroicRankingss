import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PodcastChatProvider } from "@/components/chat/PodcastChatProvider";
import { PodcastEpisodePage } from "@/components/pages/podcast/podcast-episode-page";
import { createPageMetadata } from "@/lib/metadata";
import {
  getPodcastEpisodeBySlug,
  getPodcastEpisodeSlugs,
} from "@/lib/sanity-data";

interface PodcastEpisodeRouteProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getPodcastEpisodeSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PodcastEpisodeRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const episode = await getPodcastEpisodeBySlug(slug);

  if (!episode) {
    notFound();
  }

  const guestName = episode.guest?.name ?? null;
  const titleFallback = guestName
    ? `${episode.title} — EP ${episode.episodeNumber} with ${guestName}`
    : `${episode.title} — EP ${episode.episodeNumber}`;

  return createPageMetadata({
    title: episode.seo?.metaTitle?.trim() || titleFallback,
    description:
      episode.seo?.metaDescription?.trim() ||
      episode.description ||
      "Heroic Rankings podcast episode.",
    path: `/podcast/${slug}`,
    ogType: "article",
  });
}

export default async function Page({ params }: PodcastEpisodeRouteProps) {
  const { slug } = await params;
  const episode = await getPodcastEpisodeBySlug(slug);

  if (!episode) {
    notFound();
  }

  const chatbotEpisodeId = episode.chatbotEpisodeId ?? undefined;
  return (
    <>
      <PodcastEpisodePage episode={episode} />
      <PodcastChatProvider
        episodeId={chatbotEpisodeId}
        episodeTitle={episode.title}
        guestName={episode.guest?.name ?? undefined}
        mode={chatbotEpisodeId ? "episode" : "global"}
        routeKey={`podcast:${slug}`}
      />
    </>
  );
}
