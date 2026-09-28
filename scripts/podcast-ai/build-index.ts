/*
 * Builds the Podcast AI retrieval index from content/podcast-transcripts.
 *
 *   node --env-file=.env.local --experimental-strip-types scripts/podcast-ai/build-index.ts
 *
 * Output: content/podcast-ai/index.json — every transcript split into
 * ~350-word chunks (on speaker-turn boundaries, one turn of overlap) with a
 * Gemini embedding per chunk, plus the episode catalog. The chat route loads
 * this file at runtime; re-run whenever a transcript is added or changed.
 *
 * Needs GEMINI_API_KEY. Embeddings use gemini-embedding-001 at 768 dims.
 */

import { readdirSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";

import { EMBEDDING_DIMENSIONS, EMBEDDING_MODEL, parseTranscript, type PodcastIndex, type PodcastIndexChunk } from "../../src/lib/podcast-ai/transcripts.ts";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("Missing GEMINI_API_KEY in the environment.");
  process.exit(1);
}

const ROOT = process.cwd();
const TRANSCRIPTS_DIR = path.join(ROOT, "content/podcast-transcripts");
const OUT_FILE = path.join(ROOT, "content/podcast-ai/index.json");
const TARGET_WORDS = 350;

/** Episode number + guest from the file name "EP 07 - Antonio Gabric.txt". */
function parseFileName(file: string): { episodeNumber: number; guest: string; part: number } | null {
  const m = file.match(/^EP (\d+) - (.+?)(?: PT(\d))?\.txt$/i);
  if (!m) return null;
  return { episodeNumber: Number(m[1]), guest: (m[2] ?? "").replace(/^AEO - /, "").trim(), part: Number(m[3] ?? 1) };
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Retries 429/5xx with a growing pause so a free-tier quota just slows the build down instead of failing it. */
async function embedBatch(texts: string[], attempt = 0): Promise<number[][]> {
  let res: Response;
  try {
    res = await fetchEmbeddings(texts);
  } catch (error) {
    // Network hiccup (ECONNRESET etc.) — treat like a 5xx and retry.
    if (attempt >= 12) throw error;
    const wait = Math.min(90_000, 15_000 * (attempt + 1));
    process.stdout.write(`\n  network error, waiting ${wait / 1000}s…`);
    await sleep(wait);
    return embedBatch(texts, attempt + 1);
  }
  if (res.status === 429 || res.status >= 500) {
    if (attempt >= 12) throw new Error(`embed failed ${res.status} after ${attempt} retries: ${(await res.text()).slice(0, 200)}`);
    const wait = Math.min(90_000, 15_000 * (attempt + 1));
    process.stdout.write(`\n  ${res.status} from the API, waiting ${wait / 1000}s…`);
    await sleep(wait);
    return embedBatch(texts, attempt + 1);
  }
  if (!res.ok) throw new Error(`embed failed ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const json = (await res.json()) as { embeddings: Array<{ values: number[] }> };
  return json.embeddings.map((e) => e.values);
}

function fetchEmbeddings(texts: string[]): Promise<Response> {
  return fetch(`https://generativelanguage.googleapis.com/v1beta/models/${EMBEDDING_MODEL}:batchEmbedContents`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey as string },
    body: JSON.stringify({
      requests: texts.map((text) => ({
        model: `models/${EMBEDDING_MODEL}`,
        content: { parts: [{ text }] },
        taskType: "RETRIEVAL_DOCUMENT",
        outputDimensionality: EMBEDDING_DIMENSIONS,
      })),
    }),
  });
}

async function main() {
  const files = readdirSync(TRANSCRIPTS_DIR)
    .filter((f) => f.endsWith(".txt"))
    .map((f) => ({ file: f, meta: parseFileName(f) }))
    .filter((f): f is { file: string; meta: NonNullable<ReturnType<typeof parseFileName>> } => Boolean(f.meta))
    .sort((a, b) => a.meta.episodeNumber - b.meta.episodeNumber || a.meta.part - b.meta.part);

  const chunks: PodcastIndexChunk[] = [];
  const episodes = new Map<number, { episodeNumber: number; guest: string; files: string[]; words: number }>();

  for (const { file, meta } of files) {
    const turns = parseTranscript(readFileSync(path.join(TRANSCRIPTS_DIR, file), "utf8"));
    const entry = episodes.get(meta.episodeNumber) ?? { episodeNumber: meta.episodeNumber, guest: meta.guest, files: [], words: 0 };
    entry.files.push(file);
    entry.words += turns.reduce((n, t) => n + t.text.split(/\s+/).length, 0);
    episodes.set(meta.episodeNumber, entry);

    // Chunk on turn boundaries; keep the last turn as overlap into the next chunk.
    let current: typeof turns = [];
    let words = 0;
    const flush = () => {
      if (!current.length) return;
      chunks.push({
        id: `ep${meta.episodeNumber}-p${meta.part}-c${chunks.length}`,
        episodeNumber: meta.episodeNumber,
        part: meta.part,
        startTime: current[0]?.time ?? "",
        text: current.map((t) => `${t.speaker}: ${t.text}`).join("\n"),
        vector: [],
      });
    };
    for (const turn of turns) {
      const n = turn.text.split(/\s+/).length;
      if (words + n > TARGET_WORDS && current.length) {
        flush();
        const overlap = current[current.length - 1];
        current = overlap ? [overlap] : [];
        words = overlap ? overlap.text.split(/\s+/).length : 0;
      }
      current.push(turn);
      words += n;
    }
    flush();
  }

  // Resume: reuse vectors already computed for identical chunk text.
  const PARTIAL = OUT_FILE.replace(/\.json$/, ".partial.json");
  const done = new Map<string, number[]>();
  try {
    for (const c of JSON.parse(readFileSync(PARTIAL, "utf8")) as Array<{ text: string; vector: number[] }>) done.set(c.text, c.vector);
  } catch {
    /* no partial file yet */
  }
  const savePartial = () =>
    writeFileSync(PARTIAL, JSON.stringify(chunks.filter((c) => c.vector.length).map((c) => ({ text: c.text, vector: c.vector }))));

  console.log(`${files.length} files → ${chunks.length} chunks; embedding (${done.size} already cached)…`);
  const BATCH = 20;
  const pending = chunks.filter((c) => {
    const cached = done.get(c.text);
    if (cached) c.vector = cached;
    return !cached;
  });
  mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  for (let i = 0; i < pending.length; i += BATCH) {
    const slice = pending.slice(i, i + BATCH);
    const vectors = await embedBatch(slice.map((c) => c.text));
    slice.forEach((c, j) => {
      c.vector = (vectors[j] ?? []).map((v) => Number(v.toFixed(5)));
    });
    savePartial();
    process.stdout.write(`  ${Math.min(i + BATCH, pending.length)}/${pending.length}\r`);
    await sleep(1500);
  }
  console.log();

  const index: PodcastIndex = {
    builtAt: new Date().toISOString(),
    embeddingModel: EMBEDDING_MODEL,
    dimensions: EMBEDDING_DIMENSIONS,
    episodes: [...episodes.values()].sort((a, b) => a.episodeNumber - b.episodeNumber),
    chunks,
  };
  mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  writeFileSync(OUT_FILE, JSON.stringify(index));
  console.log(`wrote ${OUT_FILE} (${(JSON.stringify(index).length / 1024 / 1024).toFixed(1)} MB, ${index.episodes.length} episodes)`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
