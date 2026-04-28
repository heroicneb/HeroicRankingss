import Image from "next/image";

import { MetricTile } from "@/components/ui/metric-tile";
import type { SanityCaseStudyDetail } from "@/lib/sanity-data";
import { urlFor } from "@/sanity/lib/image";

interface CaseStudyHeroPanelProps {
  data: SanityCaseStudyDetail;
}

interface SanityImageRef {
  asset?: { _ref?: string; _type?: string; metadata?: { lqip?: string } };
  alt?: string | null;
}

function imageUrl(source: SanityImageRef | null | undefined, width: number) {
  if (!source?.asset) return null;
  try {
    return urlFor(source).width(width).url();
  } catch {
    return null;
  }
}

/**
 * Hero metrics grid + dark hero image strip beneath the H1.
 *
 * Renders the 3 hero `MetricTile` cards (Figma `2255:918` desktop) on a
 * 3-up grid above 1024px and as a vertical stack on mobile. Followed by
 * the dark gradient hero image strip (Figma `2255:931`).
 *
 * Returns `null` when both `heroMetrics` and `heroImage` are absent so the
 * page can collapse cleanly.
 */
export function CaseStudyHeroPanel({ data }: CaseStudyHeroPanelProps) {
  const metrics = data.heroMetrics ?? [];
  const heroImage = data.heroImage as SanityImageRef | null | undefined;
  const heroImageUrl = imageUrl(heroImage, 1600);

  if (metrics.length === 0 && !heroImageUrl) return null;

  const heroImageLqip = heroImage?.asset?.metadata?.lqip;
  const heroImageAlt = heroImage?.alt ?? `${data.title} hero image`;

  return (
    <section className="px-[20px] pb-[40px] lg:px-[80px] lg:pb-[100px]">
      <div className="mx-auto w-full max-w-[1440px]">
        {metrics.length > 0 ? (
          <div className="grid grid-cols-1 gap-[10px] lg:grid-cols-3 lg:gap-[20px]">
            {metrics.map((metric, index) => (
              <MetricTile
                key={`${metric.label}-${index}`}
                label={metric.label}
                value={metric.value}
                variant="light"
              />
            ))}
          </div>
        ) : null}

        {heroImageUrl ? (
          <figure
            className={
              metrics.length > 0
                ? "relative mt-[24px] aspect-[350/255] w-full overflow-hidden rounded-[30px] lg:mt-[40px] lg:aspect-[1420/684] lg:rounded-[40px]"
                : "relative aspect-[350/255] w-full overflow-hidden rounded-[30px] lg:aspect-[1420/684] lg:rounded-[40px]"
            }
            style={{
              background:
                "linear-gradient(52.4deg, var(--color-hr-dark) 35%, var(--color-hr-art-maudsch) 142%)",
            }}
          >
            <Image
              alt={heroImageAlt}
              blurDataURL={heroImageLqip}
              className="object-cover"
              fetchPriority="high"
              fill
              placeholder={heroImageLqip ? "blur" : "empty"}
              priority
              sizes="(min-width: 1024px) 1420px, 100vw"
              src={heroImageUrl}
            />
          </figure>
        ) : null}
      </div>
    </section>
  );
}
