import type { Metadata } from "next";
import Image from "next/image";

import { AppLink } from "@/components/ui/app-link";
import { GradientText } from "@/components/ui/gradient-text";
import { DiagonalArrowIcon } from "@/components/ui/icons/decorative";
import { createPageMetadata } from "@/lib/metadata";

const PODCAST_LIGHT_GRADIENT =
  "linear-gradient(207.72deg, #826FFF 18.3%, #E188FF 40.65%, #E1BDFF 129.53%)";
const PODCAST_GUEST_GRADIENT =
  "linear-gradient(191.39deg, #826FFF 18.3%, #E188FF 40.65%, #E1BDFF 129.53%)";

const GUEST_IMAGES = [
  {
    src: "/podcast/guest-1.png",
    alt: "Podcast guest",
    rotate: "-9.51deg",
    left: "calc(8.33% + 144.85px)",
  },
  {
    src: "/podcast/guest-2.png",
    alt: "Podcast guest",
    rotate: "-4.29deg",
    left: "calc(25% + 72.8px)",
  },
  {
    src: "/podcast/guest-3.png",
    alt: "Podcast guest",
    rotate: "0deg",
    left: "calc(41.67% + 20px)",
  },
  {
    src: "/podcast/guest-4.png",
    alt: "Podcast guest",
    rotate: "7.69deg",
    left: "calc(50% + 67.51px)",
  },
  {
    src: "/podcast/guest-5.png",
    alt: "Podcast guest",
    rotate: "13.96deg",
    left: "calc(66.67% - 21.18px)",
  },
] as const;

export const metadata: Metadata = createPageMetadata({
  title: "Podcast — SEO Conversations That Actually Rank",
  description:
    "Deep-dive conversations with practitioners, founders, and marketers who've done the work. Every episode breaks down what actually moves the needle in SEO.",
  path: "/podcast",
});

// ---------------------------------------------------------------------------
// Static data — CMS integration to follow
// ---------------------------------------------------------------------------

interface Episode {
  id: number;
  slug: string;
  title: string;
  guest: string;
  description: string;
  duration: string;
  part?: string;
  imageSrc?: string;
}

const LATEST_EPISODE: Episode = {
  id: 15,
  slug: "seo-growth",
  title: "SEO Growth",
  guest: "Jonathan Bentz",
  description:
    "You can have the mindset of, \u201Cman, I screwed up, I failed\u201D, or you can take those as lessons and make sure that you don\u2019t repeat them, but get better along the way the entire time. And that\u2019s kind of the mentality that I\u2019ve had through most of my career.",
  duration: "52 min",
  part: "Part 1",
};

const EPISODES: Episode[] = [
  {
    id: 14,
    slug: "organic-growth",
    title: "Organic Growth",
    guest: "Jason Rivera",
    description:
      "If you work in SaaS and care about growing organic traffic, you\u2019ll want to hear what Jason Rivera has to say.",
    duration: "50 min",
    imageSrc: "/podcast/episode-1.png",
  },
  {
    id: 14,
    slug: "seo-aeo-and-ai-growth",
    title: "SEO, AEO & AI Growth",
    guest: "Sara Miller",
    description:
      "She quietly builds her content one piece at a time\u2014perfectly tuned for SEO, AEO, and AI before anyone else even realized.",
    duration: "59 min",
    imageSrc: "/podcast/episode-2.png",
  },
  {
    id: 14,
    slug: "seo-wind",
    title: "SEO Wind",
    guest: "Tom Winter",
    description:
      "He\u2019s all about getting real feedback to improve his product. He doesn\u2019t trust assumptions, he trusts data.",
    duration: "57 min",
    imageSrc: "/podcast/episode-3.png",
  },
];

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
      "Answers stream in real-time, token by token. No waiting \u2014 the conversation feels natural and responsive.",
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
];

const PODCAST_LIGHT_TITLE_GRADIENT =
  "linear-gradient(208.76deg, #826FFF 18.3%, #E188FF 40.65%, #E1BDFF 129.53%)";
const PODCAST_LIGHT_BUILT_GRADIENT =
  "linear-gradient(185.8deg, #826FFF 18.3%, #E188FF 40.65%, #E1BDFF 129.53%)";

function HeroSection() {
  return (
    <section className="pt-[100px] lg:pt-[120px]" id="podcast-hero">
      <div className="mx-auto w-full max-w-[1440px] px-5 md:px-10 lg:px-20">
        <div className="flex flex-col items-center gap-5 text-center">
          <h1 className="type-h1 mx-auto max-w-[665px] text-center tracking-[-1.24px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
            Podcast for People Who{" "}
            <GradientText className="gradient-text-brand-blog">
              Want to Actually Rank.
            </GradientText>
          </h1>

          <p className="type-paragraph mx-auto max-w-[484px] text-center text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
            Every episode is a deep dive with practitioners, founders, and
            marketers who&apos;ve done the work
          </p>

          <div className="flex flex-wrap items-center justify-center gap-[5px]">
            <span className="inline-flex items-center rounded-[100px] bg-[var(--color-hr-off-white)] px-[14px] py-[6px] text-[18px] leading-[24px] text-[var(--color-hr-dark)] dark:bg-[var(--color-surface-inverse-10)] dark:text-[var(--color-text-inverse)]">
              15+ Episodes
            </span>
            <span className="inline-flex items-center gap-[10px] rounded-[100px] bg-[var(--color-hr-off-white)] px-[14px] py-[6px] text-[18px] leading-[24px] text-[var(--color-hr-dark)] dark:bg-[var(--color-surface-inverse-10)] dark:text-[var(--color-text-inverse)]">
              <Image
                alt=""
                aria-hidden
                className="dark:brightness-0 dark:invert"
                height={24}
                src="/podcast/gpt-icon.svg"
                width={24}
              />
              GPT 5.2 Chat
            </span>
            <AppLink
              className="inline-flex items-center gap-[8px] rounded-[100px] bg-[var(--color-hr-dark)] px-[14px] py-[6px] text-[18px] leading-[24px] text-[var(--color-hr-pure-white)] dark:bg-[var(--color-text-inverse)] dark:text-[var(--color-text-fill-dark)]"
              href="https://www.youtube.com/@heroicrankings"
              motionPreset="subtle"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Image
                alt=""
                aria-hidden
                className="dark:[filter:invert(1)]"
                height={16}
                src="/podcast/youtube-icon.svg"
                width={22}
              />
              Watch on Youtube
            </AppLink>
          </div>
        </div>

        <div className="relative mt-10 hidden h-[260px] lg:mt-[120px] lg:block">
          {GUEST_IMAGES.map((guest, index) => (
            <div
              className="absolute"
              key={guest.src}
              style={{
                left: guest.left,
                top:
                  index === 2
                    ? "0px"
                    : index === 0 || index === 4
                      ? "18px"
                      : "8px",
                transform: `rotate(${guest.rotate})`,
              }}
            >
              <div className="relative size-[200px] overflow-hidden rounded-[40px] shadow-[0px_4px_14px_0px_rgba(0,0,0,0.18)]">
                <Image
                  alt={guest.alt}
                  className="object-cover"
                  fill
                  sizes="200px"
                  src={guest.src}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex gap-3 overflow-x-auto pb-2 lg:hidden">
          {GUEST_IMAGES.map((guest) => (
            <div
              className="relative size-[160px] shrink-0 overflow-hidden rounded-[30px] shadow-[0px_4px_14px_0px_rgba(0,0,0,0.18)]"
              key={guest.src}
            >
              <Image
                alt={guest.alt}
                className="object-cover"
                fill
                sizes="160px"
                src={guest.src}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LatestEpisodeSection() {
  const ep = LATEST_EPISODE;

  return (
    <section className="pt-[60px] lg:pt-[120px]" id="podcast-latest">
      <div className="mx-auto w-full max-w-[1440px] px-5 md:px-10 lg:px-[10px]">
        <div
          className="relative overflow-hidden rounded-[30px] lg:h-[540px] lg:rounded-[40px]"
          style={{
            backgroundImage:
              "linear-gradient(48.69deg, var(--color-hr-dark) 35.36%, #4C4AB5 142.03%)",
          }}
        >
          <div className="relative z-10 flex flex-col gap-5 px-6 pb-8 pt-10 lg:h-full lg:max-w-[482px] lg:pb-[40px] lg:pl-[40px] lg:pr-0 lg:pt-[40px]">
            <p className="text-[18px] leading-[normal] tracking-[-0.36px] text-[var(--color-hr-pure-white)]">
              /&nbsp;&nbsp;Latest Episode&nbsp;&nbsp;/
            </p>

            <div className="flex flex-col gap-0">
              <h2
                className="bg-clip-text text-[52px] font-normal leading-[60px] tracking-[-1.04px] text-transparent"
                style={{ backgroundImage: PODCAST_LIGHT_GRADIENT }}
              >
                {ep.title.toUpperCase()}
              </h2>
              <p className="text-[18px] leading-[normal] tracking-[-0.36px] text-[var(--color-hr-pure-white)]">
                with{" "}
                <span
                  className="bg-clip-text font-bold text-transparent"
                  style={{ backgroundImage: PODCAST_GUEST_GRADIENT }}
                >
                  {ep.guest}
                </span>
              </p>
            </div>

            <p className="text-[18px] leading-[24px] text-[var(--color-hr-pure-white)]">
              &ldquo;{ep.description}&rdquo;
            </p>

            <div className="flex flex-wrap gap-[5px]">
              <span className="inline-flex items-center rounded-[100px] border border-[var(--color-hr-off-white)] px-[14px] py-[6px] text-[18px] leading-[24px] text-[var(--color-hr-off-white)]">
                EP&nbsp;•&nbsp;{ep.id}
                {ep.part ? <>&nbsp;•&nbsp;{ep.part}</> : null}
              </span>
              <span className="inline-flex items-center rounded-[100px] border border-[var(--color-hr-off-white)] px-[14px] py-[6px] text-[18px] leading-[24px] text-[var(--color-hr-off-white)]">
                {ep.duration}
              </span>
            </div>

            <AppLink
              aria-label="Open latest episode"
              className="mt-auto inline-flex size-[72px] shrink-0 items-center justify-center rounded-full bg-[var(--color-hr-pure-white)] shadow-[0_4px_14px_rgba(0,0,0,0.18)] transition-transform hover:scale-105"
              href={`/podcast/${ep.slug}`}
            >
              <DiagonalArrowIcon className="size-5 text-[var(--color-hr-dark)]" />
            </AppLink>
          </div>

          <div className="relative h-[260px] w-full lg:absolute lg:right-[20px] lg:top-[20px] lg:h-[500px] lg:w-[607.75px]">
            <div className="absolute inset-0 overflow-hidden rounded-[30px] shadow-[0px_4px_14px_0px_rgba(0,0,0,0.18)] lg:rounded-[40px]">
              <Image
                alt={`${ep.guest} — latest episode`}
                className="object-cover"
                fill
                sizes="(min-width: 1024px) 608px, 100vw"
                src="/podcast/guest-4.png"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function EpisodeCard({ episode }: { episode: Episode }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[40px] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-pure-white)] dark:border-[var(--color-border-inverse-10)] dark:bg-[var(--color-bg-dark)]">
      <div className="relative h-[305px] w-full overflow-hidden">
        {episode.imageSrc ? (
          <Image
            alt={`${episode.guest} — ${episode.title}`}
            className="object-cover"
            fill
            sizes="(min-width: 1024px) 413px, (min-width: 768px) 50vw, 100vw"
            src={episode.imageSrc}
          />
        ) : null}

        <div className="absolute right-[20px] top-[20px] flex gap-[5px]">
          <span className="inline-flex items-center rounded-[100px] bg-[var(--color-hr-pure-white)] px-[14px] py-[6px] text-[18px] leading-[24px] text-[var(--color-hr-dark)]">
            EP&nbsp;•&nbsp;{episode.id}
          </span>
          <span className="inline-flex items-center rounded-[100px] bg-[var(--color-hr-pure-white)] px-[14px] py-[6px] text-[18px] leading-[24px] text-[var(--color-hr-dark)]">
            {episode.duration}
          </span>
        </div>

        <AppLink
          aria-label={`Open episode: ${episode.title}`}
          className="absolute bottom-[20px] right-[20px] inline-flex size-[72px] items-center justify-center rounded-full bg-[var(--color-hr-pure-white)] shadow-[0_4px_14px_rgba(0,0,0,0.12)] transition-transform hover:scale-105"
          href={`/podcast/${episode.slug}`}
        >
          <DiagonalArrowIcon className="size-5 text-[var(--color-hr-dark)]" />
        </AppLink>
      </div>

      <div className="flex flex-1 flex-col gap-5 px-[20px] pb-[20px] pt-[20px]">
        <div className="flex flex-col gap-[10px]">
          <h3 className="text-[32px] font-normal leading-[1.2] tracking-[-0.64px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
            {episode.title}
          </h3>
          <p className="text-[18px] leading-[24px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
            with{" "}
            <span
              className="bg-clip-text font-bold text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(191.27deg, #998AFF 18.3%, #9956AF 40.65%, #2A2260 129.53%)",
              }}
            >
              {episode.guest}
            </span>
          </p>
        </div>

        <p className="text-[18px] leading-[24px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
          {episode.description}
        </p>

        <div className="mt-auto flex items-center gap-[10px]">
          <Image
            alt=""
            aria-hidden
            height={32}
            src="/podcast/ask-ai.svg"
            width={32}
          />
          <span className="text-[16px] font-medium leading-[normal] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
            Ask AI
          </span>
        </div>
      </div>
    </article>
  );
}

function EpisodesGridSection() {
  return (
    <section className="pt-[60px] lg:pt-[120px]" id="podcast-episodes">
      <div className="mx-auto w-full max-w-[1440px] px-5 md:px-10 lg:px-20">
        <div className="flex flex-col gap-5">
          <p className="text-[18px] leading-[normal] tracking-[-0.36px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
            /&nbsp;&nbsp;Episodes&nbsp;&nbsp;/
          </p>
          <h2 className="text-[52px] font-normal leading-[60px] tracking-[-1.04px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
            Every Conversation,
            <br />
            <GradientText className="gradient-text-brand-services">
              One Place
            </GradientText>
          </h2>
        </div>

        <div className="mt-[80px] grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {EPISODES.map((episode) => (
            <EpisodeCard episode={episode} key={episode.guest} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PodcastAISection() {
  return (
    <section className="pt-[60px] lg:pt-[120px]" id="podcast-ai">
      <div className="mx-auto w-full max-w-[1440px] px-[5px] lg:px-[10px]">
        <div className="relative overflow-hidden rounded-[30px] bg-[var(--color-hr-dark)] lg:h-[1028px] lg:rounded-[40px]">
          <Image
            alt=""
            aria-hidden
            className="pointer-events-none absolute hidden lg:block"
            height={834}
            src="/podcast/diagonal-vector.svg"
            style={{
              left: "-181px",
              top: "-181px",
              transform: "rotate(14.4deg)",
              transformOrigin: "center",
            }}
            width={1701}
          />

          <div className="relative z-10 flex flex-col gap-5 px-6 pt-[60px] lg:absolute lg:left-[80px] lg:top-[120px] lg:w-[750px] lg:gap-5 lg:px-0 lg:pt-0">
            <p className="text-[18px] leading-[normal] tracking-[-0.36px] text-[var(--color-hr-pure-white)]">
              /&nbsp;&nbsp;Podcast AI&nbsp;&nbsp;/
            </p>

            <h2 className="text-[52px] font-normal leading-[60px] tracking-[-1.04px] text-[var(--color-hr-pure-white)] lg:w-[630px]">
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: PODCAST_LIGHT_TITLE_GRADIENT }}
              >
                Ask Anything.
              </span>{" "}
              Get Answers From Every Episode.
            </h2>

            <p className="text-[18px] leading-[24px] text-[var(--color-hr-pure-white)] lg:w-[522px]">
              Our AI-powered chatbot knows every episode inside out. Ask about
              guests, topics, strategies — get instant answers grounded in real
              conversations.
            </p>
          </div>

          <div className="relative z-10 mx-auto mt-10 aspect-[403/345] w-[min(403px,90%)] lg:absolute lg:left-[955px] lg:top-[200px] lg:mx-0 lg:mt-0 lg:h-[345px] lg:w-[403px]">
            <Image
              alt=""
              aria-hidden
              className="object-contain"
              fill
              sizes="(min-width: 1024px) 403px, 403px"
              src="/podcast/chat-bubble.png"
            />
          </div>

          <div className="relative z-10 mt-[60px] flex flex-col gap-5 px-6 lg:absolute lg:left-[80px] lg:top-[569px] lg:mt-0 lg:w-[624px] lg:px-0">
            <h3 className="text-[32px] font-normal leading-[1.2] tracking-[-0.64px]">
              <span className="text-[var(--color-hr-pure-white)]">
                Built for Podcast Listeners
              </span>
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: PODCAST_LIGHT_BUILT_GRADIENT }}
              >
                {" "}
                Who Want More
              </span>
            </h3>
            <p className="text-[18px] leading-[24px] text-[var(--color-hr-pure-white)]">
              Each podcast transcript is embedded and indexed. When you ask a
              question, the AI finds the most relevant moments and generates a
              conversational answer — citing the actual episode.
            </p>
          </div>

          <div className="relative z-10 mt-10 grid grid-cols-1 gap-10 px-6 pb-[60px] md:grid-cols-3 md:gap-[60px] lg:absolute lg:left-[80px] lg:right-[80px] lg:top-[724px] lg:mt-0 lg:gap-[60px] lg:px-0 lg:pb-0">
            {AI_FEATURES.map((feature) => (
              <div className="flex flex-col gap-5" key={feature.title}>
                <span className="inline-flex size-[50px] items-center justify-center rounded-[12px] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-dark)]">
                  <Image
                    alt=""
                    aria-hidden
                    height={feature.iconHeight}
                    src={feature.iconSrc}
                    style={{
                      height: `${feature.iconHeight}px`,
                      width: `${feature.iconWidth}px`,
                    }}
                    width={feature.iconWidth}
                  />
                </span>
                <h4 className="text-[32px] font-normal leading-[1.2] tracking-[-0.64px] text-[var(--color-hr-pure-white)]">
                  {feature.title}
                </h4>
                <p className="text-[18px] leading-[24px] text-[var(--color-hr-pure-white)]">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function PodcastPage() {
  return (
    <div className="route-motion-frame">
      <HeroSection />
      <LatestEpisodeSection />
      <EpisodesGridSection />
      <PodcastAISection />
    </div>
  );
}
