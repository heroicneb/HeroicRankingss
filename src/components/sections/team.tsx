import { DEFAULT_HOME_CONTENT, splitSegments, type HomeContent } from "@/components/pages/home/home-content";
import { AppLink } from "@/components/ui/app-link";
import { Container } from "@/components/ui/container";
import { GradientHeading } from "@/components/ui/gradient-heading";
import { GradientArrowUpRightIcon } from "@/components/ui/icons/decorative";
import { SectionLabel } from "@/components/ui/section-label";

import { TeamVideo } from "./team-video";

interface TeamProps {
  content?: HomeContent["team"];
}

/*
 * "/ The Team /": statement, headcount and CTA on the left; on the right the
 * team clip (see ./team-video.tsx) in place of the former two founder cards.
 * The clip starts at the 9 s mark of the source (the office as a lit model),
 * zooms out into the network and rewinds; 4:3, 1008×756. Phones get the
 * opening frame as a still.
 */
const TEAM_CLIP = {
  src: "/team/about-us-anim-v2.mp4",
  poster: "/team/about-us-anim-v2-poster.webp",
  posterAlt: "The Heroic Rankings office as a lit model floating in the dark, seen from above",
  width: 1008,
  height: 756,
};
const TEAM_FRAME = "team-video relative w-full overflow-hidden rounded-[30px] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-dark)] [aspect-ratio:4/3] dark:border-[var(--color-border-inverse-10)] lg:rounded-[var(--radius-card)]";

export function Team({ content = DEFAULT_HOME_CONTENT.team }: TeamProps) {
  const headingLines = splitSegments(content.heading);
  return (
    <section className="section-shell pt-[60px] lg:pt-16">
      <Container>
        {/* WHY: one DOM for every width (grid areas on lg), so the page has a single H2 for this section. */}
        <div className="mx-auto flex max-w-[350px] flex-col items-center lg:grid lg:max-w-none lg:grid-cols-[minmax(0,506px)_minmax(0,630px)] lg:grid-rows-[auto_auto_1fr] lg:items-start lg:justify-between lg:gap-x-10 min-[1360px]:gap-x-[144px]">
          <div className="flex w-full max-w-[348px] flex-col items-center gap-5 text-center lg:col-start-1 lg:row-start-1 lg:block lg:max-w-[506px] lg:text-left" data-reveal>
            <SectionLabel>{content.label}</SectionLabel>
            <h2 className="type-h2 text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] lg:mt-5 lg:max-w-[506px]">
              {headingLines.map((line, index) => (
                <span className="lg:block" key={`team-heading-${index}`}>
                  {index > 0 ? " " : null}
                  <GradientHeading highlightClassName="gradient-text-brand-about-heading" segments={line} />
                </span>
              ))}
            </h2>
          </div>

          <div className="mt-10 flex flex-col items-center pb-[10px] lg:col-start-1 lg:row-start-2 lg:mt-5 lg:items-start lg:pb-0" data-reveal>
            <p className="text-[120px] font-semibold leading-none tracking-[-0.02em] text-transparent [text-shadow:none] [-webkit-text-stroke:1px_var(--color-hr-accent)] lg:text-[72px] min-[1280px]:text-[120px]">
              {content.statValue}
            </p>
            <p className="type-paragraph mt-1 text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
              {content.statLabel}
            </p>
          </div>

          <div className="mt-10 w-full max-w-[350px] lg:col-start-2 lg:row-start-1 lg:row-span-3 lg:mt-0 lg:max-w-[630px] lg:self-center lg:justify-self-end" data-reveal>
            <TeamVideo {...TEAM_CLIP} className={TEAM_FRAME} sizes="(min-width: 1024px) 630px, 350px" />
          </div>

          <AppLink
            className="type-cta motion-interactive motion-interactive-press mt-10 inline-flex h-[45px] w-full max-w-[350px] items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[var(--color-hr-accent)] bg-transparent px-5 text-[var(--color-hr-dark)] hover:bg-[var(--color-hr-off-white)] dark:text-[var(--color-text-inverse)] dark:hover:bg-[var(--color-surface-inverse-10)] lg:col-start-1 lg:row-start-3 lg:mt-12 lg:w-auto lg:justify-self-start"
            href={content.ctaUrl}
            motionPreset="none"
          >
            {content.ctaLabel}
            <GradientArrowUpRightIcon className="size-[10px]" />
          </AppLink>
        </div>
      </Container>
    </section>
  );
}
