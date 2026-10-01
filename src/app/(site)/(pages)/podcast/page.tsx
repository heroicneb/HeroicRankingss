import { PodcastChatProvider } from "@/components/chat/PodcastChatProvider";
import type { Metadata } from "next";

import PodcastPage, { PODCAST_PAGE_SEO, PODCAST_SEO } from "@/components/pages/podcast/podcast-page";
import { createPageMetadata } from "@/lib/metadata";
import { getPodcastEpisodes } from "@/lib/sanity-data";


const GLOBAL_FALLBACK_SUGGESTIONS = [
  "What does Ranking Heroes teach about link-building at scale?",
  "Which guest had the most actionable SEO advice?",
  "Summarize the recurring strategies across the last five episodes",
  "What do guests agree on about AI search?",
  "Quote the strongest take on B2B content from any episode",
];

interface PodcastRouteProps {
  searchParams: Promise<{ page?: string | string[] }>;
}

const pageNumber = (value: string | string[] | undefined) => {
  const raw = Array.isArray(value) ? value[0] : value;
  const n = Number(raw);
  return Number.isInteger(n) && n > 1 ? n : null;
};

export async function generateMetadata({ searchParams }: PodcastRouteProps): Promise<Metadata> {
  const page = pageNumber((await searchParams).page);
  if (!page) return createPageMetadata({ ...PODCAST_SEO, path: "/podcast", exactTitle: true });
  const copy = PODCAST_PAGE_SEO[page] ?? {
    title: `Ranking Heroes Podcast Episodes | Page ${page}`,
    description: `Browse page ${page} of the Ranking Heroes podcast archive for more conversations with SEO practitioners, founders and marketers.`,
  };
  return createPageMetadata({ ...copy, path: `/podcast/?page=${page}`, exactTitle: true });
}

export default async function PodcastRoute({ searchParams }: PodcastRouteProps) {
  const [episodes, params] = await Promise.all([getPodcastEpisodes(), searchParams]);
  const page = Array.isArray(params.page) ? params.page[0] : params.page;
  return (
    <>
      <PodcastPage episodes={episodes} page={page ?? null} />
      <PodcastChatProvider
        globalSuggestions={GLOBAL_FALLBACK_SUGGESTIONS}
        mode="global"
        routeKey="podcast:hub"
      />
    </>
  );
}
