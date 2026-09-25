import Image from "next/image";

import type { SanityCaseStudyDetail } from "@/lib/sanity-data";
import { urlFor } from "@/sanity/lib/image";

interface CaseStudyHeroPanelProps {
  data: SanityCaseStudyDetail;
  /** Local /public path used when no Sanity heroImage asset is set. */
  fallbackImageSrc?: string;
}

/**
 * Hero metric pills + full-width image strip (Figma 2255:921 and 2255:931).
 *
 * Pills sit centred under the subtitle: off-white, rounded 20, light-gradient
 * value over a dark label. The strip below is 1420×684 on desktop and bleeds
 * to 10px from the viewport edge like the design; it shows the case study's
 * hero image when one is set, otherwise the frame's dark-to-indigo gradient.
 */
export function CaseStudyHeroPanel({ data, fallbackImageSrc }: CaseStudyHeroPanelProps) {
  const metrics = data.heroMetrics ?? [];
  const heroImage = data.heroImage?.asset ? data.heroImage : null;
  const heroImageUrl = heroImage ? urlFor(heroImage).width(2840).url() : (fallbackImageSrc ?? null);
  const heroImageAlt = (heroImage as { alt?: string } | null)?.alt ?? data.title ?? "";

  return (
    <section className="pb-[60px] pt-[30px] lg:pb-[120px] lg:pt-[40px]">
      {metrics.length > 0 ? (
        <div className="mx-auto flex w-full max-w-[1280px] flex-col items-stretch gap-[10px] px-[20px] lg:flex-row lg:items-stretch lg:justify-center lg:px-[80px]">
          {metrics.map((metric, index) => (
            <div
              className="flex flex-col items-center rounded-[20px] bg-[var(--color-hr-off-white)] px-[24px] py-[12px] text-center dark:bg-[var(--color-hr-black-box)] lg:px-[40px]"
              key={metric._key ?? `${metric.label}-${index}`}
            >
              <p className="gradient-text-brand-light w-full font-medium text-[24px] leading-[normal] tracking-[-0.48px]">
                {metric.value}
              </p>
              <p className="w-full text-[18px] leading-[24px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
                {metric.label}
              </p>
            </div>
          ))}
        </div>
      ) : null}

      <div className="mx-auto mt-[40px] w-full max-w-[1440px] px-[10px] lg:mt-[120px]">
        <figure className="relative aspect-[350/255] w-full overflow-hidden rounded-[30px] bg-[linear-gradient(52.4159deg,var(--color-hr-dark)_35.359%,var(--color-case-art-maudsch)_142.03%)] lg:aspect-[1420/684] lg:rounded-[40px]">
          {heroImageUrl ? (
            <Image
              alt={heroImageAlt}
              className="object-cover"
              fetchPriority="high"
              fill
              priority
              sizes="(min-width: 1024px) 1420px, 100vw"
              src={heroImageUrl}
            />
          ) : null}
        </figure>
      </div>
    </section>
  );
}
