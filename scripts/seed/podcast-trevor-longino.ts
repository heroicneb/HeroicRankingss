/*
 * Seeds the "Marketing That Actually Works" podcast episode (Trevor Longino)
 * from the Figma frame 2223:49 into Sanity as `podcastEpisode` /podcast/trevor-longino.
 *
 * Usage (needs SANITY_API_WRITE_TOKEN in .env.local):
 *   ASSETS_DIR=<folder with hero.png reel-1.png reel-2.png reel-3.png> \
 *   node --env-file=.env.local --experimental-strip-types scripts/seed/podcast-trevor-longino.ts
 *
 * Safe to re-run: it replaces the document with a fixed id. Images are
 * uploaded once per run from ASSETS_DIR (they are not kept in the repo).
 *
 * Placeholders to replace in the Studio (not in the frame):
 *   - videoEmbedUrl (hero play button) — the episode's YouTube link
 *   - bestMoments[].videoUrl — the three reel links (schema requires a URL;
 *     the channel URL is used so the document validates)
 *   - publishedAt — set to the real air date
 */

import { readFileSync } from "node:fs";
import path from "node:path";

import { createSeedClient, key } from "./lib.ts";

const client = createSeedClient();
const assetsDir = process.env.ASSETS_DIR;
if (!assetsDir) {
  console.error("Set ASSETS_DIR to the folder holding hero.png and reel-1..3.png.");
  process.exit(1);
}

const CHANNEL_URL = "https://www.youtube.com/@heroicrankings";

async function upload(file: string, alt: string) {
  const full = path.join(assetsDir as string, file);
  const asset = await client.assets.upload("image", readFileSync(full), { filename: file });
  console.log(`uploaded ${file} → ${asset._id}`);
  return { _type: "image", asset: { _type: "reference", _ref: asset._id }, alt };
}

const span = (text: string, marks: string[] = []) => ({ _type: "span", _key: key("s"), text, marks });
const block = (children: ReturnType<typeof span>[]) => ({
  _type: "block",
  _key: key("b"),
  style: "normal",
  markDefs: [],
  children,
});

async function main() {
  const heroImage = await upload("hero.png", "Trevor Longino — Marketing That Actually Works, episode 9");
  const reel1 = await upload("reel-1.png", "Trevor Longino reel");
  const reel2 = await upload("reel-2.png", "Trevor Longino reel");
  const reel3 = await upload("reel-3.png", "Trevor Longino reel");

  const doc = {
    _id: "podcastEpisode-trevor-longino",
    _type: "podcastEpisode",
    title: "Marketing That Actually Works",
    titleHighlighted: "That Actually Works",
    slug: { _type: "slug", current: "trevor-longino" },
    episodeNumber: 9,
    duration: "1h 44min",
    publishedAt: "2026-09-27T00:00:00.000Z",
    heroImage,
    description:
      "In this episode of The Ranking Heroes Podcast, host Nebojsa sits down with Trevor Longino, founder of CrowdTamers, to unpack how he builds million-dollar marketing engines for startups.",
    guest: {
      name: "Trevor Longino",
      role: "Founder",
      company: "CrowdTamers",
    },
    keyInsights: {
      headingHighlighted: "25 Years of Marketing Lessons",
      headingMain: ", Compressed Into One Conversation",
      body: "No theory. Trevor has the receipts — $117M in marketing engines built, 6,000+ founders mentored, and a framework that still works 25 years later.",
      topicPills: ["Minimum Viable Sprints", "Test-Based Marketing", "Funnel Metrics & Benchmarks", "Positioning & Messaging"],
      bullets: [
        "The Minimum Viable Sprint framework — validating messaging with $100 ad tests in 48 hours",
        "Exact funnel benchmarks every founder should hit (1% CTR, 5% signup, 20% activation, 30%+ close rate)",
        "Why founders fail by talking about their product instead of customer problems",
        "The difference between growth hacking tactics and sustainable long-term marketing strategy",
        "How AI is transforming marketing — from disposable custom software to automated sales calling",
        "Hard-won lessons from startup failures and the mindset shifts needed to scale",
        "Building content marketing engines that generate revenue within weeks, not months",
      ],
    },
    bestMoments: [
      { _type: "reel", _key: key("r"), title: "Best moment 1", thumbnail: reel1, videoUrl: CHANNEL_URL },
      { _type: "reel", _key: key("r"), title: "Best moment 2", thumbnail: reel2, videoUrl: CHANNEL_URL },
      { _type: "reel", _key: key("r"), title: "Best moment 3", thumbnail: reel3, videoUrl: CHANNEL_URL },
    ],
    transcript: [
      block([
        span("Nebojsa:", ["strong"]),
        span(
          " Hello guys, welcome to the Ranking Heroes podcast where we discuss different strategies with the experts behind them. Today we have a very special guest, Trevor Longino. He's a founder of CrowdTamers and they build million-dollar marketing engines, starting to bring businesses leads in less than 45 days with their framework.",
        ),
      ]),
    ],
    seo: {
      _type: "seo",
      metaTitle: "Marketing That Actually Works — Trevor Longino",
      metaDescription:
        "Trevor Longino, founder of CrowdTamers, on building million-dollar marketing engines: minimum viable sprints, funnel benchmarks and positioning that converts.",
    },
  };

  await client.createOrReplace(doc);
  await client.delete(`drafts.${doc._id}`).catch(() => undefined);
  console.log(`${doc._id} replaced → /podcast/${doc.slug.current}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
