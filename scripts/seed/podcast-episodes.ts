/*
 * Seeds every podcast episode in scripts/seed/data/podcast-episodes.json
 * (built from Nebojsa's guest MD by build-podcast-data.py) into Sanity as
 * `podcastEpisode` documents with ids `podcastEpisode-<slug>`.
 *
 * Usage (needs SANITY_API_WRITE_TOKEN in .env.local):
 *   ASSETS_DIR=<folder with <youtubeId>.jpg thumbnails> \
 *   TRANSCRIPTS_DIR=<folder with the "EP NN - Guest.txt" transcripts> \
 *   node --env-file=.env.local --experimental-strip-types scripts/seed/podcast-episodes.ts [slug]
 *
 * Safe to re-run. Fields an editor may have filled in the Studio are kept:
 * bestMoments (reels), chatbotEpisodeId, and Trevor's Figma hero image.
 * Only the opening host line of each transcript is stored (the transcript
 * card shows it); full transcripts stay on disk for the AI chat work.
 */

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import { createSeedClient, key } from "./lib.ts";

interface EpisodeData {
  episodeNumber: number;
  slug: string;
  youtubeId: string;
  videoUrl: string;
  title: string;
  titleHighlighted: string;
  duration: string;
  publishedAt: string;
  guest: { name: string; role: string; company: string; bio: string; linkedinUrl: string | null };
  description: string;
  keyInsights: { headingHighlighted: string; headingMain: string; body: string; topicPills: string[]; bullets: string[] };
  transcriptFiles: string[];
  seo: { metaTitle: string; metaDescription: string };
}

const client = createSeedClient();
const assetsDir = process.env.ASSETS_DIR;
const transcriptsDir = process.env.TRANSCRIPTS_DIR;
if (!assetsDir || !transcriptsDir) {
  console.error("Set ASSETS_DIR (thumbnails) and TRANSCRIPTS_DIR (transcript .txt files).");
  process.exit(1);
}
const onlySlug = process.argv[2];

const episodes = JSON.parse(readFileSync(path.join(process.cwd(), "scripts/seed/data/podcast-episodes.json"), "utf8")) as EpisodeData[];

const span = (text: string, marks: string[] = []) => ({ _type: "span", _key: key("s"), text, marks });
const block = (children: ReturnType<typeof span>[]) => ({ _type: "block", _key: key("b"), style: "normal", markDefs: [], children });

/** First host turn of the transcript, e.g. "Nebojsa (00:00.807)\nSo, welcome…" → { speaker, text }. */
function transcriptOpener(files: string[]): { speaker: string; text: string } | null {
  const file = files[0];
  if (!file) return null;
  const full = path.join(transcriptsDir as string, file);
  if (!existsSync(full)) return null;
  const raw = readFileSync(full, "utf8");
  const m = raw.match(/^\s*([^\n(]+?)\s*\([\d.:]+\)\s*\n([\s\S]*?)(?:\n\s*\n|$)/);
  if (!m) return null;
  const speaker = /^speaker-\d/i.test(m[1] ?? "") ? "Nebojsa" : (m[1] ?? "Nebojsa").replace(/\s+\S$/, "").trim();
  return { speaker, text: (m[2] ?? "").replace(/\s+/g, " ").trim() };
}

async function uploadThumbnail(youtubeId: string, alt: string) {
  const file = path.join(assetsDir as string, `${youtubeId}.jpg`);
  const asset = await client.assets.upload("image", readFileSync(file), { filename: `${youtubeId}.jpg` });
  console.log(`uploaded ${youtubeId}.jpg → ${asset._id}`);
  return { _type: "image", asset: { _type: "reference", _ref: asset._id }, alt };
}

async function main() {
  const list = onlySlug ? episodes.filter((e) => e.slug === onlySlug) : episodes;
  for (const e of list) {
    const id = `podcastEpisode-${e.slug}`;
    const existing = await client.getDocument(id).catch(() => null);
    const keep = existing as Record<string, unknown> | null;

    const heroImage =
      e.slug === "trevor-longino" && keep?.heroImage
        ? keep.heroImage // WHY: Trevor's hero is the Figma artwork uploaded earlier; the YouTube thumbnail is the same art at lower quality.
        : await uploadThumbnail(e.youtubeId, `${e.guest.name} — ${e.title}, episode ${e.episodeNumber}`);

    const opener = transcriptOpener(e.transcriptFiles);
    const transcript = opener ? [block([span(`${opener.speaker}:`, ["strong"]), span(` ${opener.text}`)])] : undefined;

    const doc: Record<string, unknown> = {
      _id: id,
      _type: "podcastEpisode",
      title: e.title,
      titleHighlighted: e.titleHighlighted,
      slug: { _type: "slug", current: e.slug },
      episodeNumber: e.episodeNumber,
      duration: e.duration,
      publishedAt: e.publishedAt,
      videoEmbedUrl: e.videoUrl,
      heroImage,
      description: e.description,
      guest: {
        name: e.guest.name,
        role: e.guest.role,
        company: e.guest.company,
        bio: e.guest.bio,
        ...(e.guest.linkedinUrl ? { linkedinUrl: e.guest.linkedinUrl } : {}),
      },
      keyInsights: {
        headingHighlighted: e.keyInsights.headingHighlighted,
        headingMain: e.keyInsights.headingMain,
        body: e.keyInsights.body,
        topicPills: e.keyInsights.topicPills,
        bullets: e.keyInsights.bullets,
      },
      ...(transcript ? { transcript } : {}),
      seo: { _type: "seo", metaTitle: e.seo.metaTitle, metaDescription: e.seo.metaDescription },
      ...(keep?.bestMoments ? { bestMoments: keep.bestMoments } : {}),
      ...(keep?.chatbotEpisodeId ? { chatbotEpisodeId: keep.chatbotEpisodeId } : {}),
      ...(keep?.relatedEpisodes ? { relatedEpisodes: keep.relatedEpisodes } : {}),
    };

    await client.createOrReplace(doc as { _id: string; _type: string });
    await client.delete(`drafts.${id}`).catch(() => undefined);
    console.log(`EP${String(e.episodeNumber).padStart(2, "0")} ${id} → /podcast/${e.slug}${opener ? "" : " (no transcript opener)"}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
