import type { CSSProperties } from "react";
import Image from "next/image";

import { AskPodcastAIButton } from "@/components/chat/AskPodcastAIButton";
import { AppLink } from "@/components/ui/app-link";
import { GradientText } from "@/components/ui/gradient-text";
import { DiagonalArrowIcon } from "@/components/ui/icons/decorative";
import { episodeSuggestions } from "@/components/chat/chat-episode";
import { cn } from "@/lib/cn";
import { hasTranscript } from "@/lib/podcast-ai/knowledge";
import type { SanityPodcastEpisodeSummary } from "@/lib/sanity-data";
import { urlFor } from "@/sanity/lib/image";

/*
 * Episode card shared by the podcast index ("Every Conversation, One Place",
 * Figma 2251:103) and the episode page ("More From The Podcast", Figma
 * 2223:180). Same 413 × 544.61 card, notch-cut image, pills and Ask AI row.
 */

export const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@heroicrankings";

export interface EpisodeView {
  key: string;
  title: string;
  guestName: string | null;
  description: string;
  /** Pill text, e.g. "EP • 15 • Part 1". */
  episodeLabel: string;
  duration: string;
  href: string;
  external: boolean;
  image: { src: string; alt: string; lqip?: string } | null;
  /** Set when a transcript exists, so the card's Ask AI opens the chat scoped to this episode. */
  chat?: { episodeId: string; episodeTitle: string; guestName?: string; suggestions: string[] };
}

/** The index frame's own episodes, shown until Sanity has real ones. */
export const FALLBACK_EPISODES: EpisodeView[] = [
  {
    key: "fallback-1",
    title: "Organic Growth",
    guestName: "Jason Rivera",
    description: "If you work in SaaS and care about growing organic traffic, you’ll want to hear what Jason Rivera has to say.",
    episodeLabel: "EP • 14",
    duration: "50 min",
    href: YOUTUBE_CHANNEL_URL,
    external: true,
    image: { src: "/podcast/episode-1.png", alt: "Jason Rivera" },
  },
  {
    key: "fallback-2",
    title: "SEO, AEO & AI Growth",
    guestName: "Sara Miller",
    description:
      "She quietly builds her content one piece at a time- perfectly tuned for SEO, AEO, and AI before anyone else even realized.",
    episodeLabel: "EP • 14",
    duration: "59 min",
    href: YOUTUBE_CHANNEL_URL,
    external: true,
    image: { src: "/podcast/episode-2.png", alt: "Sara Miller" },
  },
  {
    key: "fallback-3",
    title: "SEO Wind",
    guestName: "Tom Winter",
    description: "He’s all about getting real feedback to improve his product. He doesn’t trust assumptions, he trusts data.",
    episodeLabel: "EP • 14",
    duration: "57 min",
    href: YOUTUBE_CHANNEL_URL,
    external: true,
    image: { src: "/podcast/episode-3.png", alt: "Tom Winter" },
  },
];

type EpisodeLike = Pick<SanityPodcastEpisodeSummary, "_id" | "title" | "slug" | "episodeNumber" | "duration" | "heroImage"> & {
  description?: string | null;
  guest?: { name?: string | null } | null;
  topicPills?: string[] | null;
};

export function toEpisodeView(episode: EpisodeLike, imageWidth: number): EpisodeView {
  const slug = episode.slug?.current ?? "";
  const guestName = episode.guest?.name?.trim() || null;
  let imageSrc: string | null = null;
  if (episode.heroImage?.asset) {
    try {
      imageSrc = urlFor(episode.heroImage).width(imageWidth).url();
    } catch {
      imageSrc = null;
    }
  }
  return {
    key: episode._id ?? slug ?? episode.title,
    title: episode.title,
    guestName,
    description: episode.description ?? "",
    episodeLabel: `EP • ${episode.episodeNumber}`,
    duration: episode.duration,
    href: slug ? `/podcast/${slug}` : YOUTUBE_CHANNEL_URL,
    external: !slug,
    chat: hasTranscript(episode.episodeNumber)
      ? {
          episodeId: String(episode.episodeNumber),
          episodeTitle: episode.title,
          guestName: guestName ?? undefined,
          suggestions: episodeSuggestions(guestName, episode.topicPills ?? []),
        }
      : undefined,
    image: imageSrc
      ? {
          src: imageSrc,
          alt: episode.heroImage?.alt || (guestName ? `${guestName} — ${episode.title}` : episode.title),
          lqip: episode.heroImage?.asset?.metadata?.lqip,
        }
      : null,
  };
}

export const PILL =
  "inline-flex items-center justify-center rounded-[100px] px-[14px] py-[6px] text-[16px] leading-[1.3] lg:text-[18px] lg:leading-[24px]";

export function GuestLine({
  name,
  className,
  gradientClass,
  suffix,
}: {
  name: string;
  className?: string;
  gradientClass: string;
  /** e.g. "Founder, CrowdTamers" → rendered as " • Founder, CrowdTamers". */
  suffix?: string | null;
}) {
  return (
    <p className={className}>
      with <GradientText className={cn("font-bold", gradientClass)}>{name}</GradientText>
      {suffix ? <> &bull; {suffix}</> : null}
    </p>
  );
}

/** Round arrow button used on the latest panel and every episode card. */
export function ArrowButton({
  href,
  external,
  label,
  className,
}: {
  href: string;
  external: boolean;
  label: string;
  className?: string;
}) {
  return (
    <AppLink
      aria-label={label}
      className={cn(
        "motion-interactive motion-interactive-press inline-flex items-center justify-center rounded-full bg-[var(--color-hr-pure-white)] text-[var(--color-hr-dark)] shadow-[0_4px_14px_rgba(0,0,0,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-hr-accent)]",
        className,
      )}
      href={href}
      {...(external ? { rel: "noopener noreferrer", target: "_blank" } : {})}
    >
      <DiagonalArrowIcon className="size-5" />
    </AppLink>
  );
}

/** Card-coloured notch that lets the arrow button sit "cut into" the image corner (Figma "Subtract"). */
const NOTCH_FILLET: CSSProperties = {
  background: "radial-gradient(circle at top left, transparent 19.5px, var(--podcast-card-bg) 20px)",
};

export function EpisodeCard({ episode }: { episode: EpisodeView }) {
  return (
    <article className="relative flex min-h-[544.61px] w-full max-w-[413px] flex-col overflow-hidden rounded-[40px] border border-[var(--color-hr-light-grey)] bg-[var(--podcast-card-bg)] [--podcast-card-bg:var(--color-hr-pure-white)] dark:border-[var(--color-hr-dark-line)] dark:[--podcast-card-bg:var(--color-hr-black-box)]">
      <div className="relative h-[305px] w-full shrink-0 overflow-hidden rounded-[40px] lg:rounded-b-none lg:rounded-t-[40px]">
        {episode.image ? (
          <Image
            alt={episode.image.alt}
            blurDataURL={episode.image.lqip}
            className="object-cover"
            fill
            placeholder={episode.image.lqip ? "blur" : "empty"}
            sizes="(min-width: 1024px) 413px, 350px"
            src={episode.image.src}
          />
        ) : null}

        {/* Desktop notch: 112×110 card-coloured block with a 40px inner radius and two 20px concave fillets. */}
        <div aria-hidden className="pointer-events-none absolute bottom-0 right-0 hidden h-[110px] w-[112px] rounded-tl-[40px] bg-[var(--podcast-card-bg)] lg:block" />
        <div aria-hidden className="pointer-events-none absolute bottom-[110px] right-0 hidden size-[20px] lg:block" style={NOTCH_FILLET} />
        <div aria-hidden className="pointer-events-none absolute bottom-0 right-[112px] hidden size-[20px] lg:block" style={NOTCH_FILLET} />

        <div className="absolute right-[20px] top-[20px] flex gap-[5px]">
          <span className={cn(PILL, "bg-[var(--color-hr-pure-white)] text-[var(--color-hr-dark)]")}>{episode.episodeLabel}</span>
          <span className={cn(PILL, "bg-[var(--color-hr-pure-white)] text-[var(--color-hr-dark)]")}>{episode.duration}</span>
        </div>

        <ArrowButton
          className="absolute right-[14px] top-[216px] size-[66px] lg:bottom-[20px] lg:right-[20px] lg:top-auto lg:size-[72px]"
          external={episode.external}
          href={episode.href}
          label={`Open episode: ${episode.title}`}
        />
      </div>

      {/* WHY: in flow (not absolute) so the 20px rhythm description → Ask AI → card edge always holds, whatever the text length. */}
      <div className="flex w-[333px] flex-col gap-5 px-[17px] pb-[20px] pt-[20px] lg:w-[393px] lg:px-[20px]">
        <div className="flex flex-col gap-[10px]">
          <h3 className="text-[22px] font-normal leading-[normal] tracking-[-0.44px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] lg:text-[32px] lg:leading-[1.2] lg:tracking-[-0.64px]">
            <AppLink
              className="hover:underline"
              href={episode.href}
              {...(episode.external ? { rel: "noopener noreferrer", target: "_blank" } : {})}
            >
              {episode.title}
            </AppLink>
          </h3>
          {episode.guestName ? (
            <GuestLine
              className="text-[16px] leading-[1.3] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] lg:text-[18px] lg:leading-[24px]"
              gradientClass="gradient-text-podcast-guest"
              name={episode.guestName}
            />
          ) : null}
        </div>

        {episode.description ? (
          <p className="line-clamp-3 text-[16px] leading-[1.3] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] lg:w-[359px] lg:text-[18px] lg:leading-[24px]">
            {episode.description}
          </p>
        ) : null}

        <AskPodcastAIButton episode={episode.chat} label="Ask AI" variant="inline" />
      </div>
    </article>
  );
}
