import Image from "next/image";

import { AskPodcastAIButton } from "@/components/chat/AskPodcastAIButton";
import { AppLink } from "@/components/ui/app-link";
import { GradientText } from "@/components/ui/gradient-text";
import { PageLinks } from "@/components/ui/page-links";
import { SectionLabel } from "@/components/ui/section-label";
import { cn } from "@/lib/cn";
import type { SanityPodcastEpisodeSummary } from "@/lib/sanity-data";

import {
  ArrowButton,
  EpisodeCard,
  FALLBACK_EPISODES,
  GuestLine,
  PILL,
  YOUTUBE_CHANNEL_URL,
  toEpisodeView,
  type EpisodeView,
} from "./parts/podcast-episode-card";

/*
 * Podcast index (`/podcast`) — Figma `2251:28` (dark desktop), `2251:475`
 * (dark mobile), `2223:283` (light desktop), `2223:514` (light mobile).
 * Extraction notes: docs/figma-cache/extractions/2026-09-27-podcast-index-section-01-full-page.md
 *
 * Sections, top to bottom: hero with tilted guest photos → "Latest Episode"
 * dark panel → "Every Conversation, One Place" card grid → "Podcast AI" panel.
 * Episodes come from Sanity; while the CMS has none, the frame's own three
 * episodes and latest episode are shown so the page never loses sections 2
 * and 3 (their arrows lead to the YouTube channel).
 */

/** Hub metadata; pages 2–5 of the archive carry their own copy (metadata review sheet, 1 Oct 2026). */
export const PODCAST_SEO = {
  title: "Ranking Heroes SEO Podcast | Heroic Rankings",
  description: "Join Nebojsa Jankovic and industry guests for conversations on SEO, AI search and business growth. Watch Ranking Heroes episodes and explore key insights.",
};
export const PODCAST_PAGE_SEO: Record<number, { title: string; description: string }> = {
  2: { title: "Ranking Heroes Podcast Episodes | Page 2", description: "Browse page 2 of the Ranking Heroes podcast archive for more conversations with SEO practitioners, founders and marketers. Choose an episode to watch." },
  3: { title: "Ranking Heroes Podcast Episodes | Page 3", description: "Explore page 3 of the Ranking Heroes podcast archive. Find discussions on search, marketing and business growth, with episode insights and transcripts." },
  4: { title: "Ranking Heroes Podcast Episodes | Page 4", description: "Browse page 4 of the Ranking Heroes podcast archive for practical SEO and marketing conversations. Watch episodes and explore their key takeaways." },
  5: { title: "Ranking Heroes Podcast Episodes | Page 5", description: "Visit page 5 of the Ranking Heroes podcast archive to explore earlier episodes, guest conversations and practical lessons from working SEO professionals." },
};

// ---------------------------------------------------------------------------
// Static design content
// ---------------------------------------------------------------------------

/**
 * Hero photo row. Desktop offsets are the 200px squares' positions inside the 1280px container,
 * measured from the Figma render (2223:283): the row is symmetric around the centre photo —
 * centres at −340 / −180 / 0 / +180 / +340 px, tops 33 / 14 / 0 / 14 / 33 — so both sides overlap equally.
 */
const GUEST_IMAGES = [
  { src: "/podcast/guest-1.png", rotate: -9.51, desktopLeft: 200, desktopTop: 33, mobileLeft: 5.8, mobileTop: 12.6 },
  { src: "/podcast/guest-2.png", rotate: -4.29, desktopLeft: 360, desktopTop: 14, mobileLeft: 66.9, mobileTop: 5.5 },
  { src: "/podcast/guest-3.png", rotate: 0, desktopLeft: 540, desktopTop: 0, mobileLeft: 135.65, mobileTop: 0 },
  { src: "/podcast/guest-4.png", rotate: 7.69, desktopLeft: 720, desktopTop: 14, mobileLeft: 204.4, mobileTop: 5.5 },
  { src: "/podcast/guest-5.png", rotate: 13.96, desktopLeft: 880, desktopTop: 33, mobileLeft: 265.5, mobileTop: 10.3 },
] as const;

const AI_FEATURES = [
  {
    title: "Context-Aware Answers",
    description:
      "Every response is grounded in the actual transcript. No hallucinations, just real insights from real conversations.",
    iconSrc: "/podcast/icon-context.svg",
    iconWidth: 30,
    iconHeight: 29,
  },
  {
    title: "Instant Streaming",
    description:
      "Answers stream in real-time, token by token. No waiting — the conversation feels natural and responsive.",
    iconSrc: "/podcast/icon-streaming.svg",
    iconWidth: 24,
    iconHeight: 34,
  },
  {
    title: "Private & Secure",
    description:
      "IP addresses are hashed, sessions are ephemeral, and all communication is encrypted over HTTPS.",
    iconSrc: "/podcast/icon-secure.svg",
    iconWidth: 24,
    iconHeight: 36,
  },
] as const;

/** The frame's own episodes, shown until Sanity has real ones. */
const FALLBACK_LATEST: EpisodeView = {
  key: "fallback-latest",
  title: "SEO Growth",
  guestName: "Jonathan Bentz",
  description:
    "You can have the mindset of, “man, I screwed up, I failed”, or you can take those as lessons and make sure that you don’t repeat them, but get better along the way the entire time. And that’s kind of the mentality that I’ve had through most of my career.",
  episodeLabel: "EP • 15 • Part 1",
  duration: "52 min",
  href: YOUTUBE_CHANNEL_URL,
  external: true,
  image: { src: "/podcast/guest-4.png", alt: "Jonathan Bentz" },
};

// ---------------------------------------------------------------------------
// 1. Hero
// ---------------------------------------------------------------------------

function HeroSection({ episodeCount }: { episodeCount: number }) {
  const countLabel =
    episodeCount >= 15 ? "15+ Episodes" : episodeCount === 1 ? "1 Episode" : `${episodeCount} Episodes`;

  return (
    <section className="pt-[60px] lg:pt-[120px]" id="podcast-hero">
      <div className="mx-auto w-full max-w-[1440px] px-[15px] lg:px-20">
        <div className="mx-auto flex max-w-[350px] flex-col items-center gap-5 text-center lg:max-w-[665px]">
          <h1 className="type-h1 text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
            Podcast for People Who{" "}
            <GradientText className="gradient-text-podcast-hero">Want to Actually Rank.</GradientText>
          </h1>

          <p className="type-paragraph mx-auto max-w-[324px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] lg:max-w-[484px]">
            Every episode is a deep dive with practitioners, founders, and marketers who&apos;ve done the work
          </p>

          <div className="flex w-full flex-col items-stretch gap-[5px] lg:w-auto lg:flex-row lg:items-center">
            {episodeCount > 0 ? (
              <span
                className={cn(
                  PILL,
                  "bg-[var(--color-hr-off-white)] text-[18px] leading-[24px] text-[var(--color-hr-dark)] dark:bg-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]",
                )}
              >
                {countLabel}
              </span>
            ) : null}
            <AskPodcastAIButton label="Podcast AI Chat" variant="pill" />
            <AppLink
              className={cn(
                PILL,
                "motion-interactive motion-interactive-press gap-[8px] bg-[var(--color-hr-dark)] text-[18px] leading-[24px] text-[var(--color-hr-pure-white)] dark:bg-[var(--color-hr-pure-white)] dark:text-[var(--color-hr-dark)]",
              )}
              href={YOUTUBE_CHANNEL_URL}
              motionPreset="none"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Image alt="" aria-hidden className="dark:[filter:invert(1)]" height={16} src="/podcast/youtube-icon.svg" width={22} />
              Watch on Youtube
            </AppLink>
          </div>
        </div>

        {/* Desktop: five 200px tilted squares (Figma 2251:76–80). */}
        <div className="relative mx-auto mt-[120px] hidden h-[262px] w-full max-w-[1280px] lg:block">
          {GUEST_IMAGES.map((guest, index) => (
            <div
              className="absolute size-[200px] overflow-hidden rounded-[40px] shadow-[0px_4px_14px_0px_rgba(0,0,0,0.18)]"
              key={guest.src}
              style={{
                left: `${(guest.desktopLeft / 1280) * 100}%`,
                top: `${guest.desktopTop}px`,
                transform: `rotate(${guest.rotate}deg)`,
                // WHY: each photo overlaps the one to its left, left to right, as in the frame.
                zIndex: index + 1,
              }}
            >
              <Image alt="" aria-hidden className="object-cover" fill sizes="200px" src={guest.src} />
            </div>
          ))}
        </div>

        {/* Mobile: the same row scaled to 76px squares (Figma 2251:505). */}
        <div className="relative mx-auto mt-[60px] h-[93px] w-[350px] lg:hidden">
          {GUEST_IMAGES.map((guest, index) => (
            <div
              className="absolute size-[76.39px] overflow-hidden rounded-[15.28px] shadow-[0px_1.53px_5.35px_0px_rgba(0,0,0,0.18)]"
              key={guest.src}
              style={{
                left: `${guest.mobileLeft}px`,
                top: `${guest.mobileTop}px`,
                transform: `rotate(${guest.rotate}deg)`,
                // WHY: each photo overlaps the one to its left, left to right, as in the frame.
                zIndex: index + 1,
              }}
            >
              <Image alt="" aria-hidden className="object-cover" fill sizes="80px" src={guest.src} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 2. Latest episode
// ---------------------------------------------------------------------------

function LatestEpisodeSection({ episode }: { episode: EpisodeView }) {
  return (
    <section className="pt-[60px] lg:pt-[120px]" id="podcast-latest">
      <div className="mx-auto w-full max-w-[1440px] px-[5px] lg:px-20">
        <div className="relative overflow-hidden rounded-[30px] bg-[linear-gradient(180deg,var(--color-hr-dark)_4.89%,var(--color-case-art-maudsch)_193.64%)] lg:min-h-[540px] lg:rounded-[40px] lg:bg-[linear-gradient(48.69deg,var(--color-hr-dark)_35.36%,var(--color-case-art-maudsch)_142.03%)]">
          {/* WHY: the column is in flow (not pinned) so a long summary grows the panel instead of pushing the pills into the arrow. */}
          <div className="flex flex-col items-center gap-10 px-[15px] pb-[15px] pt-[60px] text-center lg:min-h-[540px] lg:w-[562px] lg:items-start lg:gap-5 lg:p-[40px] lg:text-left">
            <div className="flex flex-col items-center gap-5 lg:items-start">
              <SectionLabel className="text-[var(--color-hr-pure-white)]">/&nbsp;&nbsp;Latest Episode&nbsp;&nbsp;/</SectionLabel>
              <div className="flex flex-col items-center gap-[10px] lg:items-start lg:gap-0">
                <h2 className="w-[350px] text-[52px] font-normal uppercase leading-[60px] tracking-[-1.04px] lg:w-[329px]">
                  <GradientText className="gradient-text-podcast-latest-title">{episode.title}</GradientText>
                </h2>
                {episode.guestName ? (
                  <GuestLine
                    className="text-[18px] leading-[1.3] tracking-[-0.36px] text-[var(--color-hr-pure-white)] lg:leading-[normal]"
                    gradientClass="gradient-text-podcast-panel-guest"
                    name={episode.guestName}
                  />
                ) : null}
              </div>
            </div>

            {episode.description ? (
              <p className="w-[300px] text-[16px] leading-[1.3] text-[var(--color-hr-pure-white)] lg:w-full lg:text-[18px] lg:leading-[24px]">
                &ldquo;{episode.description}&rdquo;
              </p>
            ) : null}

            <div className="flex flex-wrap justify-center gap-[5px] lg:justify-start">
              <span className={cn(PILL, "border border-[var(--color-hr-off-white)] text-[18px] leading-[24px] text-[var(--color-hr-off-white)]")}>
                {episode.episodeLabel}
              </span>
              <span className={cn(PILL, "border border-[var(--color-hr-off-white)] text-[18px] leading-[24px] text-[var(--color-hr-off-white)]")}>
                {episode.duration}
              </span>
            </div>

            {/* Mobile image: 350px square with the arrow inset 20px (Figma 2251:524). */}
            <div className="relative size-[350px] overflow-hidden rounded-[40px] shadow-[0px_4px_14px_0px_rgba(0,0,0,0.18)] lg:hidden">
              {episode.image ? (
                <Image
                  alt={episode.image.alt}
                  blurDataURL={episode.image.lqip}
                  className="object-cover"
                  fill
                  placeholder={episode.image.lqip ? "blur" : "empty"}
                  sizes="350px"
                  src={episode.image.src}
                />
              ) : null}
              <ArrowButton
                className="absolute bottom-[20px] right-[20px] size-[60px]"
                external={episode.external}
                href={episode.href}
                label={`Open latest episode: ${episode.title}`}
              />
            </div>
            <div className="lg:hidden">
              <AskPodcastAIButton episode={episode.chat} inverse label="Ask AI" variant="inline" />
            </div>

            {/* Desktop arrow: last item of the column, 66px under the pills as in the frame (2251:94), never overlapping. */}
            {/* Ask AI sits beside the arrow, scoped to this episode like the cards. */}
            <div className="mt-auto hidden items-center gap-[30px] pt-[46px] lg:flex">
              <ArrowButton
                className="size-[72px]"
                external={episode.external}
                href={episode.href}
                label={`Open latest episode: ${episode.title}`}
              />
              <AskPodcastAIButton episode={episode.chat} inverse label="Ask AI" variant="inline" />
            </div>
          </div>

          {/* Desktop image: 607.75×500 inset 20px from the top and right (Figma 2251:82). */}
          <div className="absolute bottom-[20px] right-[20px] top-[20px] hidden w-[607.75px] overflow-hidden rounded-[40px] shadow-[0px_4px_14px_0px_rgba(0,0,0,0.18)] lg:block">
            {episode.image ? (
              <Image
                alt={episode.image.alt}
                blurDataURL={episode.image.lqip}
                className="object-cover"
                fill
                placeholder={episode.image.lqip ? "blur" : "empty"}
                sizes="608px"
                src={episode.image.src}
              />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 3. Episodes grid
// ---------------------------------------------------------------------------

const EPISODES_PAGE_SIZE = 3;
const hrefForPage = (n: number) => (n <= 1 ? "/podcast/" : `/podcast/?page=${n}`);

function EpisodesGridSection({ episodes, page: requestedPage }: { episodes: EpisodeView[]; page: number }) {
  if (episodes.length === 0) return null;

  // WHY: one row of three per page (the frame shows three cards); out-of-range pages clamp to the last one.
  const pageCount = Math.max(1, Math.ceil(episodes.length / EPISODES_PAGE_SIZE));
  const page = Math.min(Math.max(1, requestedPage), pageCount);
  const visible = episodes.slice((page - 1) * EPISODES_PAGE_SIZE, page * EPISODES_PAGE_SIZE);

  return (
    <section className="pt-[60px] lg:pt-[120px]" id="podcast-episodes">
      <div className="mx-auto w-full max-w-[1440px] px-5 lg:px-20">
        <div className="mx-auto flex max-w-[294px] flex-col items-center gap-5 text-center lg:mx-0 lg:max-w-none lg:items-start lg:text-left">
          <SectionLabel>/&nbsp;&nbsp;Episodes&nbsp;&nbsp;/</SectionLabel>
          <h2 className="type-h2 text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] lg:w-[561px]">
            Every Conversation,{" "}
            <GradientText className="gradient-text-podcast-episodes">One Place</GradientText>
          </h2>
        </div>

        <div className="mt-10 flex flex-col items-center gap-[10px] lg:mt-5 lg:grid lg:grid-cols-3 lg:items-stretch lg:gap-5">
          {visible.map((episode) => (
            <EpisodeCard episode={episode} key={episode.key} />
          ))}
        </div>

        <PageLinks ariaLabel="Episode pages" className="mt-10 lg:mt-[60px]" hrefFor={hrefForPage} page={page} pageCount={pageCount} />
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 4. Podcast AI
// ---------------------------------------------------------------------------

function PodcastAISection() {
  return (
    <section className="pt-[60px] lg:pt-[120px]" id="podcast-ai">
      <div className="mx-auto w-full max-w-[1440px] px-[5px] lg:px-[10px]">
        <div className="relative overflow-hidden rounded-[30px] bg-[var(--color-hr-dark)] lg:h-[1028px] lg:rounded-[40px]">
          <Image
            alt=""
            aria-hidden
            className="pointer-events-none absolute left-[-672px] top-[36px] h-[834px] w-[1701px] max-w-none lg:left-[-181px] lg:top-[-181px]"
            height={834}
            src="/podcast/diagonal-vector.svg"
            style={{ transform: "rotate(14.4deg)", transformOrigin: "center" }}
            width={1701}
          />

          <div className="relative z-10 flex flex-col items-center gap-[60px] py-[60px] lg:block lg:py-0">
            <div className="flex w-[294px] flex-col items-center gap-[30px] text-center lg:absolute lg:left-[70px] lg:top-[120px] lg:w-[750px] lg:items-start lg:gap-5 lg:text-left">
              <div className="flex flex-col items-center gap-5 lg:items-start">
                <SectionLabel className="text-[var(--color-hr-pure-white)]">/&nbsp;&nbsp;Podcast AI&nbsp;&nbsp;/</SectionLabel>
                <h2 className="type-h2 text-[var(--color-hr-pure-white)] lg:w-[630px]">
                  <GradientText className="gradient-text-podcast-ai-title">Ask Anything.</GradientText>
                  <br className="lg:hidden" aria-hidden /> Get Answers From Every Episode.
                </h2>
              </div>
              <p className="type-paragraph text-[var(--color-hr-pure-white)] lg:w-[522px]">
                Our AI-powered chatbot knows every episode inside out. Ask about guests, topics, strategies — get instant answers
                grounded in real conversations.
              </p>
              <AskPodcastAIButton className="w-full lg:w-auto" label="Try the Chat Widget" showIcon={false} variant="outline-inverse" />
            </div>

            <div className="relative h-[254px] w-[296px] lg:absolute lg:left-[945px] lg:top-[120px] lg:h-[345px] lg:w-[403px]">
              <Image alt="" aria-hidden className="object-contain" fill sizes="(min-width: 1024px) 403px, 296px" src="/podcast/chat-bubble.png" />
            </div>

            <div className="flex w-[332px] flex-col items-center gap-5 text-center lg:absolute lg:left-[70px] lg:top-[569px] lg:w-[624px] lg:items-start lg:text-left">
              <h3 className="type-h3 text-[var(--color-hr-pure-white)]">
                Built for Podcast Listeners{" "}
                <GradientText className="gradient-text-podcast-ai-built">Who Want More</GradientText>
              </h3>
              <p className="type-paragraph w-[294px] text-[var(--color-hr-pure-white)] lg:w-full">
                Each podcast transcript is embedded and indexed. When you ask a question, the AI finds the most relevant moments and
                generates a conversational answer — citing the actual episode.
              </p>
            </div>

            <div className="flex w-[350px] flex-col items-center gap-[30px] px-10 lg:absolute lg:left-[70px] lg:right-[70px] lg:top-[724px] lg:w-auto lg:flex-row lg:items-start lg:gap-[60px] lg:px-0">
              {AI_FEATURES.map((feature) => (
                <div className="flex flex-col items-center gap-5 text-center lg:flex-1 lg:items-start lg:text-left" key={feature.title}>
                  <div className="flex flex-col items-center gap-[15px] lg:items-start lg:gap-5">
                    <span className="inline-flex size-[50px] items-center justify-center rounded-[12px] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-dark)]">
                      <Image
                        alt=""
                        aria-hidden
                        height={feature.iconHeight}
                        src={feature.iconSrc}
                        style={{ height: `${feature.iconHeight}px`, width: `${feature.iconWidth}px` }}
                        width={feature.iconWidth}
                      />
                    </span>
                    <h4 className="type-h3 max-w-[210px] text-[var(--color-hr-pure-white)] lg:max-w-none">{feature.title}</h4>
                  </div>
                  <p className="type-paragraph max-w-[236px] text-[var(--color-hr-pure-white)] lg:max-w-none">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

interface PodcastPageProps {
  episodes: SanityPodcastEpisodeSummary[];
  /** `?page=` from the URL; anything unparseable means page 1. */
  page?: string | null;
}

export default function PodcastPage({ episodes, page }: PodcastPageProps) {
  const requestedPage = Number.parseInt(page ?? "1", 10) || 1;
  const views = episodes.map((episode, index) => toEpisodeView(episode, index === 0 ? 1216 : 826));
  const [latest, ...rest] = views;
  const hasCms = Boolean(latest);

  return (
    <>
      <HeroSection episodeCount={hasCms ? episodes.length : 15} />
      <LatestEpisodeSection episode={latest ?? FALLBACK_LATEST} />
      {/* WHY: the newest episode fills the Latest panel; the grid shows the rest, or the frame's trio until more exist. */}
      <EpisodesGridSection episodes={rest.length ? rest : FALLBACK_EPISODES} page={requestedPage} />
      <PodcastAISection />
    </>
  );
}
