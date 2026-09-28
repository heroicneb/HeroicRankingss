import { readFileSync } from "node:fs";
import path from "node:path";

import { cosine, parseTranscript, type PodcastIndex, type PodcastIndexChunk } from "./transcripts";

/*
 * Podcast AI knowledge base: the transcript index built by
 * scripts/podcast-ai/build-index.ts plus the raw transcripts, loaded once per
 * server instance. Everything the model may answer from comes from here.
 */

const ROOT = process.cwd();
const INDEX_FILE = path.join(ROOT, "content/podcast-ai/index.json");
const TRANSCRIPTS_DIR = path.join(ROOT, "content/podcast-transcripts");

let indexCache: PodcastIndex | null = null;

const EMPTY_INDEX: PodcastIndex = { builtAt: "", embeddingModel: "", dimensions: 0, episodes: [], chunks: [] };

/**
 * The index, or an empty one when content/podcast-ai/index.json is missing
 * or unreadable. WHY: pages must never 500 because the AI index is absent;
 * they just fall back to the cross-episode mode / "chat not configured".
 */
export function loadIndex(): PodcastIndex {
  if (indexCache) return indexCache;
  try {
    indexCache = JSON.parse(readFileSync(INDEX_FILE, "utf8")) as PodcastIndex;
  } catch {
    return EMPTY_INDEX;
  }
  return indexCache;
}

export function indexReady(): boolean {
  return loadIndex().chunks.length > 0;
}

export interface EpisodeMeta {
  episodeNumber: number;
  title: string;
  guest: string;
  slug: string;
}

/** Full transcript of one episode as "Speaker: text" lines (all parts joined). */
export function fullTranscript(episodeNumber: number): string | null {
  const episode = loadIndex().episodes.find((e) => e.episodeNumber === episodeNumber);
  if (!episode) return null;
  try {
    return episode.files
      .map((file) => parseTranscript(readFileSync(path.join(TRANSCRIPTS_DIR, file), "utf8")))
      .flat()
      .map((turn) => `${turn.speaker}: ${turn.text}`)
      .join("\n");
  } catch {
    return null;
  }
}

export function hasTranscript(episodeNumber: number): boolean {
  return loadIndex().episodes.some((e) => e.episodeNumber === episodeNumber);
}

/** Top-scoring chunks for a query vector, with one neighbouring chunk on each side for continuity. */
export function retrieve(queryVector: number[], limit = 12): PodcastIndexChunk[] {
  const { chunks } = loadIndex();
  const scored = chunks.map((chunk, i) => ({ i, score: cosine(queryVector, chunk.vector) })).sort((a, b) => b.score - a.score);
  const picked = new Set<number>();
  for (const { i } of scored.slice(0, limit)) {
    picked.add(i);
    const previous = chunks[i - 1];
    const next = chunks[i + 1];
    if (previous && previous.episodeNumber === chunks[i]?.episodeNumber) picked.add(i - 1);
    if (next && next.episodeNumber === chunks[i]?.episodeNumber) picked.add(i + 1);
  }
  return [...picked].sort((a, b) => a - b).map((i) => chunks[i]).filter((c): c is PodcastIndexChunk => Boolean(c));
}
