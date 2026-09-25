import { SectionLabel } from "@/components/ui/section-label";
import { TwoToneHeading } from "@/components/ui/two-tone-heading";
import type { SanityCaseStudyDetail } from "@/lib/sanity-data";

type CaseOverviewData = NonNullable<SanityCaseStudyDetail["caseOverview"]>;

interface CaseStudyOverviewProps {
  data: CaseOverviewData | null | undefined;
}

/**
 * Case overview (Figma 2255:932): label, 52/60 two-tone H2 held to ~560px so
 * it wraps like the frame, then a full-width 18/24 body. Blank lines in the
 * body field become separate paragraphs.
 */
export function CaseStudyOverview({ data }: CaseStudyOverviewProps) {
  if (!data) return null;
  const headingMain = data.headingMain ?? "";
  const headingHighlighted = data.headingHighlighted ?? "";
  const hasHeading = Boolean(headingMain || headingHighlighted);
  const paragraphs = (data.body ?? "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  if (!data.label && !hasHeading && paragraphs.length === 0) return null;

  return (
    <section className="px-[20px] pb-[60px] lg:px-[80px] lg:pb-[120px]" id="case-study-overview">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-[20px] text-center lg:text-left">
        {data.label ? <SectionLabel>{data.label}</SectionLabel> : null}
        {hasHeading ? (
          <TwoToneHeading
            as="h2"
            className="mx-auto max-w-[561px] font-normal text-[28px] leading-[1.2] tracking-[-0.56px] text-[var(--color-hr-pure-black)] dark:text-[var(--color-text-inverse)] lg:mx-0 lg:text-[52px] lg:leading-[60px] lg:tracking-[-1.04px]"
            highlighted={headingHighlighted}
            main={headingMain}
          />
        ) : null}
        {paragraphs.length > 0 ? (
          <div className="space-y-[16px]">
            {paragraphs.map((paragraph, index) => (
              <p className="text-[16px] leading-[1.3] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] lg:text-[18px] lg:leading-[24px]" key={index}>
                {paragraph}
              </p>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
