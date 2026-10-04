import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { PodcastChatProvider } from "@/components/chat/PodcastChatProvider";
import { PodcastEpisodePage } from "@/components/pages/podcast/podcast-episode-page";
import { PodcastEpisodeSchema } from "@/components/seo/podcast-episode-schema";
import { createPageMetadata } from "@/lib/metadata";
import { urlFor } from "@/sanity/lib/image";
import { FALLBACK_EPISODES, toEpisodeView } from "@/components/pages/podcast/parts/podcast-episode-card";
import { hasTranscript } from "@/lib/podcast-ai/knowledge";
import {
  getPodcastEpisodeBySlug,
  getPodcastEpisodes,
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
    exactTitle: Boolean(episode.seo?.metaTitle?.trim()),
    description:
      episode.seo?.metaDescription?.trim() ||
      episode.description ||
      "Heroic Rankings podcast episode.",
    path: `/podcast/${slug}`,
    ogType: "article",
    image: episode.heroImage?.asset
      ? { url: urlFor(episode.heroImage).width(1200).height(630).fit("crop").url(), alt: `${episode.title} — Ranking Heroes podcast` }
      : null,
  });
}

export default async function Page({ params }: PodcastEpisodeRouteProps) {
  const { slug } = await params;
  const [episode, allEpisodes] = await Promise.all([
    getPodcastEpisodeBySlug(slug),
    getPodcastEpisodes().catch(() => []),
  ]);

  if (!episode) {
    notFound();
  }

  // WHY: "More From The Podcast" falls back to the newest other episodes, and to the
  // index frame's trio while the CMS has nothing else, so the section is never empty.
  const others = allEpisodes.filter((item) => item._id !== episode._id).slice(0, 3).map((item) => toEpisodeView(item, 826));
  const moreEpisodes = others.length ? others : FALLBACK_EPISODES;

  // WHY: per-episode chat needs the transcript on disk (content/podcast-transcripts); otherwise the drawer answers across all episodes.
  const episodeChat = hasTranscript(episode.episodeNumber);
  return (
    <>
      <Suspense fallback={null}>
        <PodcastEpisodeSchema
          dateModified={episode._updatedAt ?? null}
          datePublished={episode.publishedAt ?? null}
          description={episode.description ?? null}
          duration={episode.duration ?? null}
          episodeNumber={episode.episodeNumber ?? null}
          guestName={episode.guest?.name ?? null}
          image={episode.heroImage?.asset ? urlFor(episode.heroImage).width(1200).url() : null}
          path={`/podcast/${slug}`}
          title={episode.title}
          videoUrl={episode.videoEmbedUrl ?? null}
        />
      </Suspense>
      <PodcastEpisodePage episode={episode} moreEpisodes={moreEpisodes} />
      <PodcastChatProvider
        episodeId={episodeChat ? String(episode.episodeNumber) : undefined}
        episodeTitle={episode.title}
        guestName={episode.guest?.name ?? undefined}
        mode={episodeChat ? "episode" : "global"}
        routeKey={`podcast:${slug}`}
      />
    </>
  );
}
