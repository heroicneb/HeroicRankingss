import { PortableText } from "@portabletext/react";

import { portableTextComponents } from "@/sanity/lib/portable-text-components";
import type { SanityCaseStudyDetail } from "@/lib/sanity-data";

type ConclusionData = NonNullable<SanityCaseStudyDetail["conclusion"]>;

interface CaseStudyConclusionProps {
  data: ConclusionData | null | undefined;
}

/**
 * Conclusion panel (Figma `2255:1373` desktop / `2255:1865` mobile).
 *
 * Light grey rounded panel with a solid-black H2 ("Conclusion"), a
 * gradient subhead, and a Portable Text body. Subhead and body are both
 * optional — section collapses if all three are absent.
 */
export function CaseStudyConclusion({ data }: CaseStudyConclusionProps) {
  if (!data) return null;
  const heading = data.heading ?? "";
  const subhead = data.gradientSubhead ?? "";
  const body = data.body ?? null;

  if (!heading && !subhead && !(body && body.length > 0)) return null;

  return (
    <section
      className="px-[20px] pb-[60px] lg:px-[80px] lg:pb-[120px]"
      id="case-study-conclusion"
    >
      <div className="mx-auto w-full max-w-[1440px]">
        <div className="rounded-[22px] bg-[var(--color-hr-off-white)] px-[24px] py-[40px] lg:rounded-[40px] lg:px-[80px] lg:py-[80px]">
          {heading ? (
            <h2 className="font-normal text-[28px] leading-[1.2] tracking-[-0.56px] text-[var(--color-hr-pure-black)] lg:text-[52px] lg:leading-[60px] lg:tracking-[-1.04px]">
              {heading}
            </h2>
          ) : null}

          {subhead ? (
            <p className="gradient-text-brand mt-[14px] text-[20px] font-normal leading-[1.3] lg:mt-[20px] lg:text-[24px] lg:leading-[1.3]">
              {subhead}
            </p>
          ) : null}

          {body && body.length > 0 ? (
            <div className="mt-[20px] max-w-[920px] text-[16px] leading-[1.3] text-[var(--color-hr-dark)] lg:mt-[30px] lg:text-[18px] lg:leading-[24px]">
              <PortableText components={portableTextComponents} value={body} />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
