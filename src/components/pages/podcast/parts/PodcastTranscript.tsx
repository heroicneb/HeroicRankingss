import { PortableText } from "@portabletext/react";

import { SectionLabel } from "@/components/ui/section-label";
import type { SanityPodcastEpisodeDetail } from "@/lib/sanity-data";
import { portableTextComponents } from "@/sanity/lib/portable-text-components";

interface PodcastTranscriptProps {
  transcript: SanityPodcastEpisodeDetail["transcript"];
}

/**
 * Full Episode Transcript panel (Figma `2223:154` desktop / `2223:807` mobile).
 *
 * Dark `#151419` panel with white section label "/ Full Episode Transcript /"
 * and a transcript card on the same dark surface with a `#2A2A2A` border. The
 * transcript is a Portable Text array rendered through the shared
 * `portableTextComponents` serializers; speaker tags use `<strong>` so they
 * pick up the gradient brand styling override below.
 *
 * Desktop renders the full transcript inline (Figma 2223:154).
 * Mobile collapses behind a "Read Full Transcript" toggle (Figma 2223:807)
 * via the native `<details>` element.
 */
export function PodcastTranscript({ transcript }: PodcastTranscriptProps) {
  if (!transcript || transcript.length === 0) return null;

  const transcriptCardClass =
    "rounded-[30px] border border-[var(--color-hr-dark-line)] bg-[var(--color-hr-dark)] p-[20px] text-[16px] leading-[1.5] text-[var(--color-hr-pure-white)] lg:rounded-[40px] lg:p-[30px] lg:text-[18px] lg:leading-[26px] [&_h2]:!text-[var(--color-hr-pure-white)] [&_h3]:!text-[var(--color-hr-pure-white)] [&_p]:!text-[var(--color-hr-pure-white)] [&_li]:!text-[var(--color-hr-pure-white)] [&_blockquote]:!text-[var(--color-hr-pure-white)] [&_strong]:gradient-text-brand [&_strong]:font-bold";

  return (
    <section
      className="px-[20px] pb-[60px] lg:px-[80px] lg:pb-[120px]"
      id="podcast-transcript"
    >
      <div className="mx-auto w-full max-w-[1440px]">
        <div className="rounded-[30px] bg-[var(--color-hr-dark)] px-[20px] py-[60px] lg:rounded-[40px] lg:px-[60px] lg:py-[80px]">
          <SectionLabel className="text-center text-[var(--color-hr-pure-white)] dark:text-[var(--color-hr-pure-white)] lg:text-left">
            / Full Episode Transcript /
          </SectionLabel>

          {/* Desktop: full transcript inline */}
          <div
            className={`mt-[24px] hidden lg:mt-[40px] lg:block ${transcriptCardClass}`}
          >
            <PortableText
              components={portableTextComponents}
              value={transcript}
            />
          </div>

          {/* Mobile: collapsible expander */}
          <details className="group mt-[24px] lg:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-center gap-[10px] rounded-[20px] border border-[var(--color-hr-dark-line)] bg-transparent px-[18px] py-[12px] text-[16px] font-medium leading-[20px] text-[var(--color-hr-pure-white)] transition-colors hover:border-[var(--color-hr-pure-white)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-hr-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-hr-dark)] [&::-webkit-details-marker]:hidden">
              <span className="group-open:hidden">Read Full Transcript</span>
              <span className="hidden group-open:inline">Hide Transcript</span>
              <svg
                aria-hidden="true"
                className="h-4 w-4 shrink-0 rotate-0 transition-transform group-open:rotate-180"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  d="M19 9l-7 7-7-7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </summary>

            <div className={`mt-[20px] ${transcriptCardClass}`}>
              <PortableText
                components={portableTextComponents}
                value={transcript}
              />
            </div>
          </details>
        </div>
      </div>
    </section>
  );
}
