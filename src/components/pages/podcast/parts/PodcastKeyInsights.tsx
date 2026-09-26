import { AskPodcastAIButton } from "@/components/chat/AskPodcastAIButton";
import { GradientText } from "@/components/ui/gradient-text";
import type { SanityPodcastEpisodeDetail } from "@/lib/sanity-data";

import { PodcastBestMoments } from "./PodcastBestMoments";

interface PodcastKeyInsightsProps {
  insights: SanityPodcastEpisodeDetail["keyInsights"];
  reels: SanityPodcastEpisodeDetail["bestMoments"];
}

/**
 * Key Insights panel (Figma 2223:105 desktop / 2223:761 mobile).
 *
 * One off-white 1420-wide panel (70 / 30 padding) holding two rows 80px
 * apart: the insights row (631-wide intro column with heading, body, Ask
 * Podcast AI button and the topic pills pinned to the bottom; 625-wide
 * column of insight cards) and the Best Moments card.
 *
 * Mobile: 380-wide panel, 60 / 15 padding, everything centred and stacked
 * with 30px gaps; the Best Moments card sits at the bottom of the panel.
 */
export function PodcastKeyInsights({ insights, reels }: PodcastKeyInsightsProps) {
  const headingMain = insights?.headingMain?.trim() ?? "";
  const headingHighlighted = insights?.headingHighlighted?.trim() ?? "";
  const body = insights?.body?.trim() ?? "";
  const topicPills = insights?.topicPills?.filter((pill) => pill?.trim()) ?? [];
  const bullets = insights?.bullets?.filter((bullet) => bullet?.trim()) ?? [];
  const hasInsights = Boolean(headingMain || headingHighlighted || body || topicPills.length || bullets.length);
  const hasReels = Boolean(reels?.some((reel) => reel.thumbnail?.asset));

  if (!hasInsights && !hasReels) return null;

  // WHY: the Figma heading runs ", Compressed Into…" straight after the gradient part; only add a space when main starts with a word.
  const joiner = headingMain && /^[\w]/.test(headingMain) ? " " : "";

  return (
    <section className="px-[5px] lg:px-[10px]" id="podcast-key-insights">
      <div className="mx-auto flex w-full max-w-[1420px] flex-col items-center gap-[30px] rounded-[40px] bg-[var(--color-hr-off-white)] px-[15px] pb-[15px] pt-[60px] dark:bg-[var(--color-surface-inverse-10)] lg:items-stretch lg:gap-[80px] lg:px-[70px] lg:py-[30px]">
        {hasInsights ? (
          <div className="flex w-full flex-col items-center gap-[30px] lg:min-h-[564px] lg:flex-row lg:items-stretch lg:justify-between lg:gap-[24px]">
            <div className="flex w-full flex-col items-center gap-[30px] text-center lg:w-[631px] lg:items-start lg:justify-between lg:gap-0 lg:text-left">
              <div className="flex flex-col items-center gap-[30px] lg:items-start lg:gap-5">
                {headingMain || headingHighlighted ? (
                  <h2 className="type-h2 w-[328px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] lg:w-full">
                    {headingHighlighted ? <GradientText className="gradient-text-podcast-insights">{headingHighlighted}</GradientText> : null}
                    {joiner}
                    {headingMain}
                  </h2>
                ) : null}
                {body ? (
                  <p className="w-[300px] text-[16px] leading-[1.3] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] lg:w-full lg:text-[18px] lg:leading-[24px]">
                    {body}
                  </p>
                ) : null}
                <AskPodcastAIButton icon="swirl" />
              </div>

              {topicPills.length > 0 ? (
                <ul className="flex w-full flex-col gap-[5px] lg:w-[596px] lg:flex-row lg:flex-wrap lg:content-center">
                  {topicPills.map((pill, index) => (
                    <li
                      className="inline-flex items-center justify-center rounded-[100px] bg-[var(--color-hr-black-box)] px-[14px] py-[6px] text-[16px] font-medium leading-[normal] text-[var(--color-hr-pure-white)] lg:text-[18px] lg:font-normal lg:leading-[24px]"
                      key={`topic-pill-${index}-${pill}`}
                    >
                      {pill}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            {bullets.length > 0 ? (
              <ul className="flex w-full flex-col gap-[10px] lg:w-[625px]">
                {bullets.map((bullet, index) => (
                  <li
                    className="rounded-[20px] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-off-white)] p-[12px] text-center text-[16px] leading-[1.3] text-[var(--color-hr-dark)] dark:border-[var(--color-border-inverse-10)] dark:bg-[var(--color-surface-inverse-10)] dark:text-[var(--color-text-inverse)] lg:text-left lg:text-[18px] lg:leading-[24px]"
                    key={`insight-${index}`}
                  >
                    {bullet}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}

        <PodcastBestMoments reels={reels} />
      </div>
    </section>
  );
}
