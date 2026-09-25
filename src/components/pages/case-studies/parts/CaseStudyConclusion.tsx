import { PortableText } from "@portabletext/react";

import type { SanityCaseStudyDetail } from "@/lib/sanity-data";
import { portableTextComponents } from "@/sanity/lib/portable-text-components";

type ConclusionData = NonNullable<SanityCaseStudyDetail["conclusion"]>;

interface CaseStudyConclusionProps {
  data: ConclusionData | null | undefined;
}

/**
 * Conclusion panel (Figma 2255:1373): "Conclusion" 52/60 solid, a 32px
 * full-gradient lead line 40px below, then 18/24 body paragraphs 40px below.
 */
export function CaseStudyConclusion({ data }: CaseStudyConclusionProps) {
  if (!data) return null;
  const heading = data.heading ?? "";
  const subhead = data.gradientSubhead ?? "";
  const body = data.body ?? null;
  if (!heading && !subhead && !(body && body.length > 0)) return null;

  return (
    <section className="pb-[10px]" id="case-study-conclusion">
      <div className="mx-auto w-full max-w-[1440px] px-[10px]">
        <div className="rounded-[22px] bg-[var(--color-hr-off-white)] px-[20px] py-[40px] dark:bg-[var(--color-surface-inverse-10)] lg:rounded-[40px] lg:px-[70px] lg:py-[120px]">
          {heading ? (
            <h2 className="font-normal text-[32px] leading-[1.2] tracking-[-0.64px] text-[var(--color-hr-pure-black)] dark:text-[var(--color-text-inverse)] lg:text-[52px] lg:leading-[60px] lg:tracking-[-1.04px]">
              {heading}
            </h2>
          ) : null}
          {subhead ? (
            <p className="gradient-text-brand mt-[20px] font-normal text-[22px] leading-[normal] lg:mt-[40px] lg:text-[32px] lg:leading-[1.2] lg:tracking-[-0.64px]">
              {subhead}
            </p>
          ) : null}
          {body && body.length > 0 ? (
            <div className="mt-[20px] space-y-[20px] text-[16px] leading-[1.3] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] lg:mt-[40px] lg:text-[18px] lg:leading-[24px] [&_p+p]:mt-[20px]">
              <PortableText components={portableTextComponents} value={body} />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
