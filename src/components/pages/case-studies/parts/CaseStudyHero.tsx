import { GradientText } from "@/components/ui/gradient-text";
import { SectionLabel } from "@/components/ui/section-label";
import type { SanityCaseStudyDetail } from "@/lib/sanity-data";
import { splitTitle } from "@/lib/split-title";

interface CaseStudyHeroProps {
  data: SanityCaseStudyDetail;
}

/**
 * Top-of-page case study hero (Figma `2255:918` desktop / `2255:1401` mobile).
 *
 * Renders the "/ Case Study /" section label, a two-tone H1 (solid + gradient
 * via `titleHighlighted`), and an optional subtitle. Falls back to full
 * gradient when `titleHighlighted` is not configured. The 3 metric tiles
 * below the H1 are delegated to {@link CaseStudyHeroPanel}.
 */
export function CaseStudyHero({ data }: CaseStudyHeroProps) {
  if (!data?.title) return null;

  const { before, gradient, after } = splitTitle(
    data.title,
    data.titleHighlighted,
  );
  const hasHighlight = gradient.length > 0;

  return (
    <section
      className="px-[20px] pb-[40px] pt-[100px] lg:px-[80px] lg:pb-[60px] lg:pt-[160px]"
      id="case-study-hero"
    >
      <div className="mx-auto w-full max-w-[1440px]">
        <SectionLabel className="text-center lg:text-left">
          / Case Study /
        </SectionLabel>

        <h1 className="mt-[20px] text-center font-normal text-[38px] leading-[1.2] tracking-[-0.76px] text-[var(--color-hr-pure-black)] lg:mt-[30px] lg:text-left lg:text-[62px] lg:leading-[80px] lg:tracking-[-1.24px] dark:text-[var(--color-text-inverse)]">
          {hasHighlight ? (
            <>
              {before ? <span>{before}</span> : null}
              <GradientText>{gradient}</GradientText>
              {after ? <span>{after}</span> : null}
            </>
          ) : (
            <GradientText>{data.title}</GradientText>
          )}
        </h1>

        {data.heroSubtitle ? (
          <p className="mx-auto mt-[20px] max-w-[860px] text-center text-[16px] leading-[1.3] text-[var(--color-hr-dark)] lg:mx-0 lg:mt-[30px] lg:text-left lg:text-[18px] lg:leading-[24px] dark:text-[var(--color-text-inverse)]">
            {data.heroSubtitle}
          </p>
        ) : null}
      </div>
    </section>
  );
}
