import { SectionLabel } from "@/components/ui/section-label";
import { TwoToneHeading } from "@/components/ui/two-tone-heading";
import type { SanityCaseStudyDetail } from "@/lib/sanity-data";

type CaseOverviewData = NonNullable<SanityCaseStudyDetail["caseOverview"]>;

interface CaseStudyOverviewProps {
  data: CaseOverviewData | null | undefined;
}

/**
 * Case Overview section (Figma `2255:932` desktop / `2255:1416` mobile).
 *
 * Section label + two-tone H2 + body paragraph. Body string is split on
 * newlines so editors can emit multiple paragraphs from one Sanity text
 * field.
 */
export function CaseStudyOverview({ data }: CaseStudyOverviewProps) {
  if (!data) return null;

  const headingMain = data.headingMain ?? "";
  const headingHighlighted = data.headingHighlighted ?? "";
  const hasHeading = Boolean(headingMain || headingHighlighted);

  const paragraphs = (data.body ?? "")
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  if (!data.label && !hasHeading && paragraphs.length === 0) return null;

  return (
    <section
      className="px-[20px] pb-[60px] lg:px-[80px] lg:pb-[120px]"
      id="case-study-overview"
    >
      <div className="mx-auto w-full max-w-[1440px]">
        {data.label ? (
          <SectionLabel className="text-center lg:text-left">
            {data.label}
          </SectionLabel>
        ) : null}

        {hasHeading ? (
          <TwoToneHeading
            as="h2"
            className="mt-[14px] max-w-[900px] text-center font-normal text-[28px] leading-[1.2] tracking-[-0.56px] lg:mt-[20px] lg:text-left lg:text-[52px] lg:leading-[60px] lg:tracking-[-1.04px] text-[var(--color-hr-pure-black)] dark:text-[var(--color-text-inverse)]"
            highlighted={headingHighlighted}
            main={headingMain}
          />
        ) : null}

        {paragraphs.length > 0 ? (
          <div className="mt-[20px] max-w-[920px] space-y-[16px] text-center lg:mt-[30px] lg:text-left">
            {paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className="text-[16px] leading-[1.3] text-[var(--color-hr-dark)] lg:text-[18px] lg:leading-[24px] dark:text-[var(--color-text-inverse)]"
              >
                {paragraph}
              </p>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
