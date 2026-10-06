import { DEFAULT_HOME_CONTENT, type HomeContent } from "@/components/pages/home/home-content";
import { AppLink } from "@/components/ui/app-link";
import { GradientHeading } from "@/components/ui/gradient-heading";
import { GradientArrowUpRightIcon } from "@/components/ui/icons/decorative";
import { SectionLabel } from "@/components/ui/section-label";

import { PortalDeck } from "./partnerships/portal-deck";

/*
 * "/ The Value We Bring /": the homepage's door to the white-label
 * partnership page. Left: statement, one-line summary, the three partner
 * paths and the CTA. Right: the partner portal as a deck of four screens
 * with a legend (see ./partnerships/portal-deck.tsx).
 */

interface PartnershipsProps {
  content?: HomeContent["partnerships"];
}

export function Partnerships({ content = DEFAULT_HOME_CONTENT.partnerships }: PartnershipsProps) {
  return (
    <section className="pb-24 pt-10" id="partnerships">
      <div className="mx-auto max-w-[var(--size-page-max)] px-[10px]">
        <div className="overflow-hidden rounded-[30px] border border-[var(--color-hr-accent)] bg-[linear-gradient(40.898deg,var(--color-bg-inverse)_35.359%,var(--color-case-art-maudsch)_142.03%)] px-[15px] py-[60px] text-[var(--color-hr-pure-white)] lg:rounded-[var(--radius-card)] lg:px-[70px] lg:py-[80px]">
          <div className="grid gap-[40px] lg:grid-cols-[minmax(0,1fr)_minmax(0,560px)] lg:items-center lg:gap-[80px]">
            <div className="mx-auto w-full max-w-[350px] text-center lg:mx-0 lg:max-w-[600px] lg:text-left" data-reveal>
              <SectionLabel className="text-[var(--color-hr-pure-white)]">{content.label}</SectionLabel>
              <p className="mt-5 text-[32px] font-normal leading-[1.2] tracking-[-0.64px] text-[var(--color-hr-pure-white)]">
                <GradientHeading highlightClassName="gradient-text-brand-partnerships" segments={content.statement} />
              </p>
              <p className="type-paragraph mt-6 text-[var(--color-text-inverse-80)]">{content.summary}</p>
              <ul aria-label="Ways to partner" className="mt-[18px] flex flex-wrap justify-center gap-[8px] lg:justify-start">
                {content.paths.map((path) => (
                  <li className="rounded-full border border-[var(--color-border-inverse-15)] px-[12px] py-[6px] text-[13px] leading-[16px] text-[var(--color-text-inverse-95)]" key={path}>
                    {path}
                  </li>
                ))}
              </ul>
              <AppLink
                className="type-cta mt-10 inline-flex h-[45px] w-full items-center justify-center gap-[9px] whitespace-nowrap rounded-[var(--radius-button)] border border-[var(--color-hr-accent)] bg-transparent px-5 text-[var(--color-hr-pure-white)] hover:bg-[color-mix(in_srgb,var(--color-hr-pure-white)_8%,transparent)] focus-visible:ring-offset-[var(--color-hr-gradient-start)] lg:w-auto lg:min-w-[194px]"
                href={content.ctaUrl}
              >
                {content.ctaLabel}
                <GradientArrowUpRightIcon className="h-[11px] w-[11px] shrink-0" />
              </AppLink>
            </div>

            <div className="mx-auto w-full max-w-[560px] lg:mx-0" data-reveal>
              <PortalDeck eyebrow={content.portalEyebrow} screens={content.screens} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
