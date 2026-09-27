/*
 * Shared pieces of the Podcast AI: transcript parsing and the index shape.
 * Kept free of Next/React imports so scripts/podcast-ai/build-index.ts can
 * import it under plain Node.
 */

export const EMBEDDING_MODEL = "gemini-embedding-001";
export const EMBEDDING_DIMENSIONS = 768;

export interface TranscriptTurn {
  speaker: string;
  /** "00:12.345" as exported; empty when the file has no timestamps. */
  time: string;
  text: string;
}

export interface PodcastIndexChunk {
  id: string;
  episodeNumber: number;
  part: number;
  startTime: string;
  text: string;
  vector: number[];
}

export interface PodcastIndexEpisode {
  episodeNumber: number;
  guest: string;
  files: string[];
  words: number;
}

export interface PodcastIndex {
  builtAt: string;
  embeddingModel: string;
  dimensions: number;
  episodes: PodcastIndexEpisode[];
  chunks: PodcastIndexChunk[];
}

const SPEAKER_LINE = /^([^\n(]{1,60}?)\s*\(([\d.:]+)\)\s*$/;

/**
 * Parses the exported transcript format:
 *
 *   Nebojsa (00:00.807)
 *   So, welcome to the ranking heroes…
 *
 *   Guest (00:22.801)
 *   …
 *
 * Files without speaker lines (plain caption text) become one turn per
 * ~paragraph attributed to "Speaker". Generic "speaker-0" labels are kept as
 * "Speaker 1", "Speaker 2"… so nobody is misattributed.
 */
export function parseTranscript(raw: string): TranscriptTurn[] {
  const lines = raw.replace(/\r\n?/g, "\n").split("\n");
  const turns: TranscriptTurn[] = [];
  let current: TranscriptTurn | null = null;
  let sawSpeaker = false;

  for (const line of lines) {
    const m = line.match(SPEAKER_LINE);
    if (m) {
      sawSpeaker = true;
      if (current?.text.trim()) turns.push(current);
      const rawSpeaker = (m[1] ?? "").trim();
      const generic = rawSpeaker.match(/^speaker-(\d+)$/i);
      current = { speaker: generic ? `Speaker ${Number(generic[1]) + 1}` : rawSpeaker, time: m[2] ?? "", text: "" };
      continue;
    }
    if (!current) current = { speaker: "Speaker", time: "", text: "" };
    current.text += (current.text ? " " : "") + line.trim();
  }
  if (current?.text.trim()) turns.push(current);

  if (!sawSpeaker) {
    // Plain caption export: regroup into ~120-word turns so chunking has boundaries to work with.
    const words = turns.map((t) => t.text).join(" ").split(/\s+/).filter(Boolean);
    const grouped: TranscriptTurn[] = [];
    for (let i = 0; i < words.length; i += 120) grouped.push({ speaker: "Speaker", time: "", text: words.slice(i, i + 120).join(" ") });
    return grouped;
  }
  return turns.map((t) => ({ ...t, text: t.text.replace(/\s+/g, " ").trim() })).filter((t) => t.text);
}

/** Cosine similarity for two equal-length vectors. */
export function cosine(a: number[], b: number[]): number {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i += 1) {
    const x = a[i] ?? 0;
    const y = b[i] ?? 0;
    dot += x * y;
    na += x * x;
    nb += y * y;
  }
  return na && nb ? dot / Math.sqrt(na * nb) : 0;
}
