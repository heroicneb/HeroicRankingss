import { DEFAULT_HOME_CONTENT, segmentsText, splitSegments, type HomeContent } from "@/components/pages/home/home-content";
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
 * The clip is 4:3 (1008×756 source); phones get its opening frame as a still.
 */
const TEAM_CLIP = {
  src: "/team/about-us-anim-v1.mp4",
  poster: "/team/about-us-anim-v1-poster.webp",
  posterAlt: "The Heroic Rankings team at work in the office, seen from above",
  width: 1008,
  height: 756,
};
const TEAM_FRAME = "team-video relative w-full overflow-hidden rounded-[30px] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-dark)] [aspect-ratio:4/3] dark:border-[var(--color-border-inverse-10)] lg:rounded-[var(--radius-card)]";

export function Team({ content = DEFAULT_HOME_CONTENT.team }: TeamProps) {
  const headingLines = splitSegments(content.heading);
  return (
    <section className="section-shell pt-[60px] lg:pt-16">
      <Container>
        <div className="mx-auto flex max-w-[350px] flex-col items-center lg:hidden" data-reveal>
          <div className="flex w-[348px] flex-col items-center gap-5 text-center">
            <SectionLabel>{content.label}</SectionLabel>
            <h2 className="type-h2 text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
              {headingLines.map(segmentsText).join(" ")}
            </h2>
          </div>

          <div className="mt-10 flex flex-col items-center pb-[10px]">
            <p className="text-[120px] font-semibold leading-none tracking-[-0.02em] text-transparent [text-shadow:none] [-webkit-text-stroke:1px_var(--color-hr-accent)]">
              {content.statValue}
            </p>
            <p className="type-paragraph mt-1 text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
              {content.statLabel}
            </p>
          </div>

          <div className="mt-10 w-full max-w-[350px]">
            <TeamVideo {...TEAM_CLIP} className={TEAM_FRAME} sizes="350px" />
          </div>

          <AppLink
            className="type-cta motion-interactive motion-interactive-press mt-10 inline-flex h-[45px] w-full max-w-[350px] items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[var(--color-hr-accent)] bg-transparent px-5 text-[var(--color-hr-dark)] hover:bg-[var(--color-hr-off-white)] dark:text-[var(--color-text-inverse)] dark:hover:bg-[var(--color-surface-inverse-10)]"
            href={content.ctaUrl}
            motionPreset="none"
          >
            {content.ctaLabel}
            <GradientArrowUpRightIcon className="size-[10px]" />
          </AppLink>
        </div>

        <div className="hidden gap-10 lg:grid min-[1360px]:grid-cols-[506px_630px] min-[1360px]:gap-[144px]">
          <div data-reveal>
            <SectionLabel>{content.label}</SectionLabel>
            <h2 className="type-h2 mt-5 max-w-[506px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
              {headingLines.map((line, index) => (
                <span className="block" key={`team-heading-${index}`}>
                  <GradientHeading highlightClassName="gradient-text-brand-about-heading" segments={line} />
                </span>
              ))}
            </h2>
            <p className="mt-5 text-[72px] font-semibold leading-none tracking-[-0.02em] text-transparent [text-shadow:none] [-webkit-text-stroke:1px_var(--color-hr-accent)] min-[1280px]:text-[120px]">
              {content.statValue}
            </p>
            <p className="type-paragraph mt-1 text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
              {content.statLabel}
            </p>
            <AppLink
              className="type-cta motion-interactive motion-interactive-press mt-12 inline-flex h-[45px] items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[var(--color-hr-accent)] bg-transparent px-5 text-[var(--color-hr-dark)] hover:bg-[var(--color-hr-off-white)] dark:text-[var(--color-text-inverse)] dark:hover:bg-[var(--color-surface-inverse-10)]"
              href={content.ctaUrl}
              motionPreset="none"
            >
              {content.ctaLabel}
              <GradientArrowUpRightIcon className="size-[10px]" />
            </AppLink>
          </div>
          <div className="w-full max-w-[630px] self-center" data-reveal>
            <TeamVideo {...TEAM_CLIP} className={TEAM_FRAME} sizes="630px" />
          </div>
        </div>
      </Container>
    </section>
  );
}
