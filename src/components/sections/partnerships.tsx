import { AppLink } from "@/components/ui/app-link";
import { GradientArrowUpRightIcon } from "@/components/ui/icons/decorative";
import { SectionLabel } from "@/components/ui/section-label";
import { GradientHeading } from "@/components/ui/gradient-heading";
import { DEFAULT_HOME_CONTENT, type HomeContent } from "@/components/pages/home/home-content";

interface PartnershipsProps {
  content?: HomeContent["partnerships"];
}

export function Partnerships({ content = DEFAULT_HOME_CONTENT.partnerships }: PartnershipsProps) {
  return (
    <section className="pb-24 pt-10" id="partnerships">
      <div className="mx-auto max-w-[var(--size-page-max)] px-[10px]">
        {/* Mobile layout (< lg) — single column: label → H3 → body paragraphs → full-width CTA */}
        <div className="overflow-hidden rounded-[30px] border border-[var(--color-hr-accent)] bg-[linear-gradient(80.38deg,var(--color-bg-inverse)_35.359%,var(--color-case-art-maudsch)_142.03%)] px-[15px] py-[60px] lg:hidden">
          <div className="mx-auto flex w-full max-w-[350px] flex-col items-center gap-10 text-center text-[var(--color-hr-pure-white)]" data-reveal>
            <SectionLabel className="text-[16px] text-[var(--color-hr-pure-white)]">
              {content.label}
            </SectionLabel>

            <p className="w-full text-[32px] font-normal leading-[1.2] tracking-[-0.64px] text-[var(--color-hr-pure-white)]">
              <GradientHeading highlightClassName="gradient-text-brand-partnerships" segments={content.statement} />
            </p>

            <div className="w-full space-y-5 text-[16px] leading-[1.3] text-[var(--color-hr-pure-white)]">
              {content.paragraphs.map((paragraph, index) => (
                <p key={`partnerships-mobile-${index}`}>{paragraph}</p>
              ))}
            </div>

            <AppLink
              href={content.ctaUrl}
              className="type-cta inline-flex h-[45px] w-full items-center justify-center gap-[9px] rounded-[16px] whitespace-nowrap border border-[var(--color-hr-accent)] bg-transparent px-5 text-[var(--color-hr-pure-white)] hover:bg-[color-mix(in_srgb,var(--color-hr-pure-white)_8%,transparent)]"
            >
              {content.ctaLabel}
              <GradientArrowUpRightIcon className="h-[11px] w-[11px] shrink-0" />
            </AppLink>
          </div>
        </div>

        {/* Desktop layout (lg+) — two-column: left = label+H3+CTA, right = two body paragraphs */}
        <div className="hidden overflow-hidden rounded-[var(--radius-card)] bg-[linear-gradient(40.898deg,var(--color-bg-inverse)_35.359%,var(--color-case-art-maudsch)_142.03%)] lg:block lg:px-[70px] lg:py-[80px]">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,418px)] lg:gap-[140px] lg:items-start" data-reveal-stagger>
            <div className="max-w-[600px]">
              <SectionLabel className="text-[var(--color-hr-pure-white)]">
                {content.label}
              </SectionLabel>
              <p className="mt-5 max-w-[600px] text-[32px] font-normal leading-[1.2] tracking-[-0.64px] text-[var(--color-hr-pure-white)]">
                <GradientHeading highlightClassName="gradient-text-brand-partnerships" segments={content.statement} />
              </p>
              <AppLink
                href={content.ctaUrl}
                className="type-cta mt-10 inline-flex h-[45px] w-[194px] items-center justify-center gap-[9px] rounded-[var(--radius-button)] whitespace-nowrap border border-[var(--color-hr-accent)] bg-transparent px-5 text-[var(--color-hr-pure-white)] hover:bg-[color-mix(in_srgb,var(--color-hr-pure-white)_8%,transparent)] focus-visible:ring-offset-[var(--color-hr-gradient-start)]"
              >
                {content.ctaLabel}
                <GradientArrowUpRightIcon className="h-[11px] w-[11px] shrink-0" />
              </AppLink>
            </div>

            <div className="max-w-[418px] text-[var(--color-hr-pure-white)]">
              {content.paragraphs.map((paragraph, index) => (
                <p className={index ? "type-paragraph mt-6" : "type-paragraph"} key={`partnerships-desktop-${index}`}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
