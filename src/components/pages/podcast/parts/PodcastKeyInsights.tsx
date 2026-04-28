import Image from "next/image";

import type { SanityPodcastEpisodeDetail } from "@/lib/sanity-data";

interface PodcastKeyInsightsProps {
  insights: SanityPodcastEpisodeDetail["keyInsights"];
}

/**
 * Key Insights panel (Figma `2223:105` desktop / `2223:761` mobile).
 *
 * Light off-white panel with two columns on desktop:
 *   - Left (631): two-tone H2 + body + outlined "Ask Podcast AI" button
 *     (sparkle icon) + 4 dark topic pills.
 *   - Right (625): vertical stack of insight cards (one per bullet).
 *
 * Mobile collapses to a single centered column with full-width topic pills
 * and full-width insight cards.
 *
 * Returns `null` when no insight data is provided so the page collapses
 * cleanly between sections.
 */
export function PodcastKeyInsights({ insights }: PodcastKeyInsightsProps) {
  if (!insights) return null;

  const headingMain = insights.headingMain ?? "";
  const headingHighlighted = insights.headingHighlighted ?? "";
  const body = insights.body ?? "";
  const topicPills = insights.topicPills ?? [];
  const bullets = insights.bullets ?? [];

  if (
    !headingMain &&
    !headingHighlighted &&
    !body &&
    topicPills.length === 0 &&
    bullets.length === 0
  ) {
    return null;
  }

  return (
    <section
      className="px-[20px] pb-[60px] lg:px-[80px] lg:pb-[120px]"
      id="podcast-key-insights"
    >
      <div className="mx-auto w-full max-w-[1440px]">
        <div className="rounded-[30px] bg-[var(--color-hr-off-white)] px-[15px] py-[60px] lg:rounded-[40px] lg:px-[60px] lg:py-[80px] dark:bg-[var(--color-surface-inverse-10)]">
          <div className="grid grid-cols-1 gap-[40px] lg:grid-cols-[631px_minmax(0,1fr)] lg:gap-[60px]">
            {/* Left column */}
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
              {headingMain || headingHighlighted ? (
                <h2 className="font-normal text-[28px] leading-[1.2] tracking-[-0.56px] text-[var(--color-hr-pure-black)] lg:text-[52px] lg:leading-[60px] lg:tracking-[-1.04px] dark:text-[var(--color-text-inverse)]">
                  {headingHighlighted ? (
                    <span className="gradient-text-brand">
                      {headingHighlighted}
                    </span>
                  ) : null}
                  {headingHighlighted && headingMain ? " " : null}
                  {headingMain ? <span>{headingMain}</span> : null}
                </h2>
              ) : null}

              {body ? (
                <p className="mt-[20px] max-w-[300px] text-[16px] leading-[1.3] text-[var(--color-hr-dark)] lg:mt-[24px] lg:max-w-none lg:text-[18px] lg:leading-[24px] dark:text-[var(--color-text-inverse)]">
                  {body}
                </p>
              ) : null}

              {/* TODO: wire to AI chat overlay (PodcastAISection backend not yet built) */}
              <button
                aria-label="Ask Podcast AI"
                className="motion-interactive motion-interactive-press mt-[24px] inline-flex items-center gap-[8px] rounded-[100px] border border-[var(--color-hr-accent)] bg-transparent px-[18px] py-[10px] text-[16px] font-medium leading-[20px] text-[var(--color-hr-pure-black)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-hr-accent)] focus-visible:ring-offset-2 dark:text-[var(--color-text-inverse)]"
                type="button"
              >
                <Image
                  alt=""
                  aria-hidden
                  className="dark:brightness-0 dark:invert"
                  height={20}
                  src="/podcast/ask-ai.svg"
                  width={20}
                />
                Ask Podcast AI
              </button>

              {topicPills.length > 0 ? (
                <ul className="mt-[24px] flex w-full flex-col gap-[10px] lg:mt-[30px] lg:flex-row lg:flex-wrap">
                  {topicPills.map((pill, index) => (
                    <li
                      key={`topic-pill-${index}-${pill}`}
                      className="inline-flex items-center justify-center rounded-[100px] bg-[var(--color-hr-black-box)] px-[18px] py-[10px] text-[16px] font-medium leading-[20px] text-[var(--color-hr-pure-white)]"
                    >
                      {pill}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            {/* Right column: insight cards */}
            {bullets.length > 0 ? (
              <ul className="flex flex-col gap-[10px]">
                {bullets.map((bullet, index) => (
                  <li
                    key={`insight-${index}`}
                    className="rounded-[20px] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-off-white)] p-[12px] text-center text-[16px] leading-[1.3] text-[var(--color-hr-dark)] lg:text-left lg:text-[18px] lg:leading-[24px] dark:border-[var(--color-border-inverse-15)] dark:bg-[var(--color-surface-inverse-10)] dark:text-[var(--color-text-inverse)]"
                  >
                    {bullet}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
