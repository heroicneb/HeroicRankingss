import { GradientText } from "@/components/ui/gradient-text";
import type { SanityCaseStudyDetail } from "@/lib/sanity-data";
import { splitTitle } from "@/lib/split-title";

interface CaseStudyHeroProps {
  data: SanityCaseStudyDetail;
}

/**
 * Case study hero (Figma 2255:918): a centred two-tone H1 — gradient part
 * on its own line, solid part below — and a centred subtitle. The metric
 * pills and image strip that follow live in `CaseStudyHeroPanel`.
 */
export function CaseStudyHero({ data }: CaseStudyHeroProps) {
  if (!data?.title) return null;
  const { before, gradient, after } = splitTitle(data.title, data.titleHighlighted);
  const hasHighlight = gradient.length > 0;
  // WHY: the frame breaks the line right after the gradient part when it leads.
  const gradientLeads = hasHighlight && !before.trim() && after.trim().length > 0;

  return (
    <section className="px-[20px] pt-[100px] lg:px-[80px] lg:pt-[203px]" id="case-study-hero">
      <div className="mx-auto flex w-full max-w-[665px] flex-col items-center gap-[20px] text-center">
        <h1 className="font-normal text-[38px] leading-[1.2] tracking-[-0.76px] text-[var(--color-hr-pure-black)] dark:text-[var(--color-text-inverse)] lg:text-[62px] lg:leading-[80px] lg:tracking-[-1.24px]">
          {!hasHighlight ? (
            <GradientText>{data.title}</GradientText>
          ) : gradientLeads ? (
            <>
              <GradientText>{gradient}</GradientText>
              <br aria-hidden />
              <span>{after.trim()}</span>
            </>
          ) : (
            <>
              {before ? <span>{before}</span> : null}
              <GradientText>{gradient}</GradientText>
              {after ? <span>{after}</span> : null}
            </>
          )}
        </h1>
        {data.heroSubtitle ? (
          <p className="max-w-[483px] text-[16px] leading-[1.3] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] lg:text-[18px] lg:leading-[24px]">
            {data.heroSubtitle}
          </p>
        ) : null}
      </div>
    </section>
  );
}
