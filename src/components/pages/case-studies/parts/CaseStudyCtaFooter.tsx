import { AppLink } from "@/components/ui/app-link";
import { SectionLabel } from "@/components/ui/section-label";
import { TwoToneHeading } from "@/components/ui/two-tone-heading";
import type { SanityCaseStudyDetail } from "@/lib/sanity-data";

type CtaFooterData = NonNullable<SanityCaseStudyDetail["ctaFooter"]>;

interface CaseStudyCtaFooterProps {
  data: CtaFooterData | null | undefined;
}

/**
 * Per-case-study final CTA footer (Figma `2255:1333` desktop / `2255:1869`
 * mobile).
 *
 * Dark `#151419` rounded panel framed by an accent purple border with
 * decorative radial blurs. Renders the start-scaling label, gradient
 * two-tone heading, body text, and up to two CTAs (gradient primary +
 * outlined secondary). Section collapses entirely when no copy is
 * configured.
 */
export function CaseStudyCtaFooter({ data }: CaseStudyCtaFooterProps) {
  if (!data) return null;

  const headingMain = data.headingMain ?? "";
  const headingHighlighted = data.headingHighlighted ?? "";
  const hasHeading = Boolean(headingMain || headingHighlighted);

  const primary = data.primaryCta;
  const secondary = data.secondaryCta;
  const hasCtas = Boolean(
    (primary?.label && primary?.url) || (secondary?.label && secondary?.url),
  );

  if (!data.label && !hasHeading && !data.body && !hasCtas) return null;

  return (
    <section
      className="px-[20px] pb-[80px] pt-[20px] lg:px-[80px] lg:pb-[120px] lg:pt-[40px]"
      id="case-study-cta"
    >
      <div className="mx-auto w-full max-w-[1440px]">
        <div className="surface-radial relative overflow-hidden rounded-[30px] border border-[var(--color-hr-accent)] px-[24px] py-[60px] text-center lg:rounded-[40px] lg:px-[80px] lg:py-[100px]">
          {/* Decorative blurs */}
          <span
            aria-hidden
            className="pointer-events-none absolute -left-[80px] top-[40px] size-[260px] rounded-full bg-[var(--color-hr-accent)] opacity-30 blur-[120px]"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute -right-[80px] bottom-[40px] size-[260px] rounded-full bg-[var(--color-brand-700)] opacity-40 blur-[140px]"
          />

          <div className="relative">
            {data.label ? (
              <SectionLabel className="text-[var(--color-hr-pure-white)] dark:text-[var(--color-text-inverse)]">
                {data.label}
              </SectionLabel>
            ) : null}

            {hasHeading ? (
              <TwoToneHeading
                as="h2"
                className="mx-auto mt-[14px] max-w-[860px] text-center font-normal text-[28px] leading-[1.2] tracking-[-0.56px] text-[var(--color-hr-pure-white)] lg:mt-[20px] lg:text-[52px] lg:leading-[60px] lg:tracking-[-1.04px]"
                gradientClass="gradient-text-brand-light"
                highlighted={headingHighlighted}
                main={headingMain}
              />
            ) : null}

            {data.body ? (
              <p className="mx-auto mt-[20px] max-w-[760px] text-[16px] leading-[1.3] text-[var(--color-hr-pure-white)] lg:mt-[30px] lg:text-[18px] lg:leading-[24px]">
                {data.body}
              </p>
            ) : null}

            {hasCtas ? (
              <div className="mt-[30px] flex flex-col items-stretch justify-center gap-[12px] lg:mt-[40px] lg:flex-row lg:items-center lg:gap-[16px]">
                {primary?.label && primary?.url ? (
                  <AppLink
                    className="type-cta inline-flex h-[45px] items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[var(--color-hr-accent)] bg-[linear-gradient(110deg,var(--color-hr-gradient-start),var(--color-hr-gradient-end))] px-[20px] text-[var(--color-hr-pure-white)] hover:opacity-90"
                    href={primary.url}
                  >
                    {primary.label}
                  </AppLink>
                ) : null}
                {secondary?.label && secondary?.url ? (
                  <AppLink
                    className="type-cta inline-flex h-[45px] items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[var(--color-border-inverse-20)] bg-transparent px-[20px] text-[var(--color-hr-pure-white)] hover:bg-[var(--color-surface-inverse-10)]"
                    href={secondary.url}
                  >
                    {secondary.label}
                  </AppLink>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
