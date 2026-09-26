import type { PortableTextBlock } from "@portabletext/react";
import { PortableText } from "@portabletext/react";

import { SectionLabel } from "@/components/ui/section-label";
import type { SanityPodcastEpisodeDetail } from "@/lib/sanity-data";
import { portableTextComponents } from "@/sanity/lib/portable-text-components";

import { PodcastShareBar } from "./PodcastShareBar";
import { TranscriptExpander } from "./TranscriptExpander";

interface PodcastTranscriptProps {
  episode: SanityPodcastEpisodeDetail;
}

const TRANSCRIPT_TEXT_CLASS =
  "text-[18px] leading-[24px] text-[var(--color-hr-pure-white)] [&_p]:!text-[var(--color-hr-pure-white)] [&_strong]:font-bold [&_strong]:!text-[var(--color-hr-pure-white)] [&_p+p]:mt-5";

/**
 * Full Episode Transcript panel (Figma 2223:154 desktop / 2223:807 mobile).
 *
 * Dark 1420-wide panel (70 / 60 padding, 40px gaps): section label, the
 * transcript card (dark-line border, 30px padding) showing the first block
 * with a "Read Full Transcript" expander for the rest, then the share row.
 * Mobile: 380-wide panel, 60 / 20 padding, 30px gaps, share block stacked
 * and centred.
 */
export function PodcastTranscript({ episode }: PodcastTranscriptProps) {
  const blocks = (episode.transcript ?? []) as PortableTextBlock[];
  if (blocks.length === 0) return null;
  const [first, ...rest] = blocks;

  return (
    <section className="px-[5px] pt-[5px] lg:px-[10px] lg:pt-[20px]" id="podcast-transcript">
      <div className="mx-auto flex w-full max-w-[1420px] flex-col items-center gap-[30px] rounded-[40px] bg-[var(--color-hr-dark)] px-5 py-[60px] lg:items-start lg:gap-10 lg:px-[70px]">
        <SectionLabel className="text-center text-[var(--color-hr-pure-white)] dark:text-[var(--color-hr-pure-white)] lg:text-left">
          /&nbsp;&nbsp;Full Episode Transcript&nbsp;&nbsp;/
        </SectionLabel>

        <div className="flex w-full flex-col gap-5 rounded-[40px] border border-[var(--color-hr-dark-line)] bg-[var(--color-hr-dark)] p-5 lg:p-[30px]">
          <div className={TRANSCRIPT_TEXT_CLASS}>
            <PortableText components={portableTextComponents} value={first ? [first] : []} />
          </div>
          {rest.length > 0 ? (
            <TranscriptExpander>
              <div className={TRANSCRIPT_TEXT_CLASS}>
                <PortableText components={portableTextComponents} value={rest} />
              </div>
            </TranscriptExpander>
          ) : null}
        </div>

        <PodcastShareBar episode={episode} />
      </div>
    </section>
  );
}
