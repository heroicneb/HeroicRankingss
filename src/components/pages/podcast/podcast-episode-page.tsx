import { AppLink } from "@/components/ui/app-link";
import { Container } from "@/components/ui/container";
import { GradientText } from "@/components/ui/gradient-text";
import { SectionLabel } from "@/components/ui/section-label";
import type { PodcastEpisode } from "@/data/podcast-episodes";

interface PodcastEpisodePageProps {
  episode: PodcastEpisode;
  relatedEpisodes: PodcastEpisode[];
}

function TopicPill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-[var(--radius-pill)] border border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)] px-4 py-2 text-[14px] font-normal leading-[20px] tracking-[-0.28px] text-[var(--color-hr-dark)] dark:border-[var(--color-border-inverse-15)] dark:bg-[var(--color-surface-inverse-10)] dark:text-[var(--color-text-inverse-60)]">
      {label}
    </span>
  );
}

function EpisodeCard({ episode }: { episode: PodcastEpisode }) {
  return (
    <AppLink
      className="group flex flex-col gap-4 rounded-[var(--radius-panel)] border border-[var(--color-border-primary)] bg-[var(--color-bg-card)] p-6 dark:border-[var(--color-border-inverse-15)] dark:bg-[var(--color-surface-inverse-10)]"
      href={`/podcast/${episode.slug}`}
    >
      <div className="flex items-center gap-3 text-[14px] font-normal leading-[20px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse-60)]">
        <span>EP • {episode.episodeNumber}</span>
        <span aria-hidden>·</span>
        <span>{episode.duration}</span>
      </div>

      <h3 className="type-h3 text-[var(--color-text-primary)] dark:text-[var(--color-text-inverse)]">
        {episode.title}
      </h3>

      <p className="text-[14px] font-normal leading-[20px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse-60)]">
        with {episode.guest} · {episode.guestTitle}, {episode.company}
      </p>
    </AppLink>
  );
}

export function PodcastEpisodePage({ episode, relatedEpisodes }: PodcastEpisodePageProps) {
  return (
    <div className="route-motion-frame">
      {/* Hero */}
      <section className="section-shell" id="podcast-hero">
        <Container>
          <div className="flex flex-wrap items-center gap-3 text-[16px] font-normal leading-[22px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse-60)]">
            <span>EP • {episode.episodeNumber}</span>
            <span aria-hidden>|</span>
            <span>{episode.duration}</span>
          </div>

          <h1 className="mt-5 w-full max-w-[1000px] text-[42px] font-normal leading-[52px] tracking-[-0.84px] sm:text-[52px] sm:leading-[66px] xl:text-[62px] xl:leading-[80px] xl:tracking-[-1.24px]">
            <GradientText>{episode.title}</GradientText>
          </h1>

          <p className="mt-5 text-[16px] font-normal leading-[24px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse-60)] lg:text-[18px]">
            with {episode.guest} · {episode.guestTitle}, {episode.company}
          </p>

          <p className="mt-4 w-full max-w-[760px] text-[16px] font-normal leading-[24px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse-60)] lg:text-[18px] lg:leading-[26px]">
            {episode.description}
          </p>
        </Container>
      </section>

      {/* Content Section */}
      <section className="section-shell border-t border-[var(--color-border-primary)] dark:border-[var(--color-border-inverse-10)]" id="podcast-content">
        <Container>
          <div className="grid grid-cols-1 gap-12 xl:grid-cols-[minmax(0,1fr)_320px] xl:gap-16">
            {/* Main content */}
            <div>
              <h2 className="text-[38px] font-normal leading-[46px] tracking-[-0.76px] xl:text-[52px] xl:leading-[60px] xl:tracking-[-1.04px]">
                <GradientText>{episode.contentH2}</GradientText>
              </h2>

              <p className="mt-6 text-[16px] font-normal leading-[24px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse-60)] lg:text-[18px] lg:leading-[26px]">
                This conversation spans the full arc of experience — from early experiments and
                failed campaigns to the systems and frameworks that now drive consistent, measurable
                results. Every lesson shared here was earned through iteration, not theory.
              </p>

              {/* Key Takeaways */}
              <div className="mt-10">
                <h3 className="text-[22px] font-normal leading-[28px] tracking-[-0.44px] text-[var(--color-text-primary)] dark:text-[var(--color-text-inverse)] xl:text-[32px] xl:leading-[36px] xl:tracking-[-0.64px]">
                  Key Takeaways
                </h3>
                <ul className="mt-6 space-y-4">
                  {episode.keyTakeaways.map((takeaway, index) => (
                    <li
                      className="flex gap-3 text-[16px] font-normal leading-[24px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse-60)] lg:text-[18px] lg:leading-[26px]"
                      key={`takeaway-${index + 1}`}
                    >
                      <span
                        aria-hidden
                        className="mt-[3px] shrink-0 text-[var(--color-brand-500)]"
                      >
                        ·
                      </span>
                      {takeaway}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sidebar */}
            <aside aria-label="Episode topics">
              <p className="type-section-label mb-4 text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse-60)]">
                Topics covered
              </p>
              <div className="flex flex-wrap gap-2">
                {episode.topics.map((topic) => (
                  <TopicPill key={topic} label={topic} />
                ))}
              </div>
            </aside>
          </div>
        </Container>
      </section>

      {/* Best Moments */}
      <section className="section-shell border-t border-[var(--color-border-primary)] dark:border-[var(--color-border-inverse-10)]" id="podcast-best-moments">
        <Container>
          <h2 className="text-[38px] font-normal leading-[46px] tracking-[-0.76px] xl:text-[52px] xl:leading-[60px] xl:tracking-[-1.04px]">
            <GradientText>Best Moments From This Episode</GradientText>
          </h2>
          <p className="mt-6 w-full max-w-[760px] text-[16px] font-normal leading-[24px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse-60)] lg:text-[18px] lg:leading-[26px]">
            Every episode is full of insights, but some moments stand out. Below are the exchanges
            that generated the most discussion and captured the most important ideas from this
            conversation. These are the moments worth sharing.
          </p>
        </Container>
      </section>

      {/* Transcript */}
      <section className="section-shell border-t border-[var(--color-border-primary)] dark:border-[var(--color-border-inverse-10)]" id="podcast-transcript">
        <Container>
          <SectionLabel>/  Full Episode Transcript  /</SectionLabel>

          <details className="group mt-8">
            <summary className="inline-flex cursor-pointer list-none items-center gap-2 rounded-[var(--radius-button)] border border-[var(--color-border-primary)] px-5 py-[11px] text-[16px] font-medium leading-[22px] text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-bg-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-500)] focus-visible:ring-offset-2 dark:border-[var(--color-border-inverse-20)] dark:text-[var(--color-text-inverse)] dark:hover:bg-[var(--color-surface-inverse-10)] [&::-webkit-details-marker]:hidden">
              <span className="group-open:hidden">Read Full Transcript</span>
              <span className="hidden group-open:inline">Close Transcript</span>
              <svg
                aria-hidden
                className="h-4 w-4 shrink-0 rotate-0 transition-transform group-open:rotate-180"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </summary>

            <div className="mt-6 rounded-[var(--radius-panel)] border border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)] p-6 dark:border-[var(--color-border-inverse-10)] dark:bg-[var(--color-surface-inverse-10)] md:p-8">
              <div className="space-y-4 text-[16px] font-normal leading-[26px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse-60)] lg:text-[17px]">
                {episode.transcript.split("\n\n").map((paragraph, index) => (
                  <p key={`transcript-p-${index + 1}`}>{paragraph}</p>
                ))}
              </div>
            </div>
          </details>
        </Container>
      </section>

      {/* Share */}
      <section className="section-shell border-t border-[var(--color-border-primary)] dark:border-[var(--color-border-inverse-10)]" id="podcast-share">
        <Container>
          <p className="type-section-label text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse-60)]">
            Share this podcast
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <a
              aria-label="Share on LinkedIn"
              className="motion-interactive motion-interactive-press inline-flex h-10 items-center gap-2 rounded-[var(--radius-button)] border border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)] px-4 text-[14px] font-medium text-[var(--color-hr-dark)] hover:border-[var(--color-border-secondary)] dark:border-[var(--color-border-inverse-15)] dark:bg-[var(--color-surface-inverse-10)] dark:text-[var(--color-text-inverse-60)] dark:hover:border-[var(--color-border-inverse-20)]"
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://heroicrankings.com/podcast/${episode.slug}`)}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              LinkedIn
            </a>
            <a
              aria-label="Share on X"
              className="motion-interactive motion-interactive-press inline-flex h-10 items-center gap-2 rounded-[var(--radius-button)] border border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)] px-4 text-[14px] font-medium text-[var(--color-hr-dark)] hover:border-[var(--color-border-secondary)] dark:border-[var(--color-border-inverse-15)] dark:bg-[var(--color-surface-inverse-10)] dark:text-[var(--color-text-inverse-60)] dark:hover:border-[var(--color-border-inverse-20)]"
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(episode.title)}&url=${encodeURIComponent(`https://heroicrankings.com/podcast/${episode.slug}`)}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              X (Twitter)
            </a>
            <a
              aria-label="Share on Facebook"
              className="motion-interactive motion-interactive-press inline-flex h-10 items-center gap-2 rounded-[var(--radius-button)] border border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)] px-4 text-[14px] font-medium text-[var(--color-hr-dark)] hover:border-[var(--color-border-secondary)] dark:border-[var(--color-border-inverse-15)] dark:bg-[var(--color-surface-inverse-10)] dark:text-[var(--color-text-inverse-60)] dark:hover:border-[var(--color-border-inverse-20)]"
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://heroicrankings.com/podcast/${episode.slug}`)}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              Facebook
            </a>
          </div>
        </Container>
      </section>

      {/* More Episodes */}
      {relatedEpisodes.length > 0 ? (
        <section className="section-shell border-t border-[var(--color-border-primary)] dark:border-[var(--color-border-inverse-10)]" id="podcast-more-episodes">
          <Container>
            <SectionLabel>/  Continue Listening  /</SectionLabel>

            <h2 className="mt-5 text-[38px] font-normal leading-[46px] tracking-[-0.76px] xl:text-[52px] xl:leading-[60px] xl:tracking-[-1.04px]">
              <GradientText>More From The Podcast</GradientText>
            </h2>

            <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {relatedEpisodes.map((related) => (
                <EpisodeCard episode={related} key={related.slug} />
              ))}
            </div>
          </Container>
        </section>
      ) : null}
    </div>
  );
}
