import Image from "next/image";

import { SectionLabel } from "@/components/ui/section-label";
import { TwoToneHeading } from "@/components/ui/two-tone-heading";
import { cn } from "@/lib/cn";
import type { SanityCaseStudyDetail } from "@/lib/sanity-data";
import { urlFor } from "@/sanity/lib/image";

type ProofDataData = NonNullable<SanityCaseStudyDetail["proofData"]>;
type ProofItem = NonNullable<ProofDataData["items"]>[number];
type MetricTag = NonNullable<ProofItem["metricTags"]>[number];

interface CaseStudyProofDataProps {
  data: ProofDataData | null | undefined;
}

function getImageUrl(item: ProofItem): string | null {
  if (!item.image) return null;
  try {
    return urlFor(item.image).width(item.isFullWidth ? 2440 : 1140).url();
  } catch {
    return null;
  }
}

/** Metric tag (Figma 2255:1275): bordered 10px pill, 18px, gradient value. */
function MetricTagPill({ tag }: { tag: MetricTag }) {
  if (!tag.label && !tag.value) return null;
  return (
    <span className="inline-flex items-center gap-[6px] rounded-[10px] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-pure-white)] px-[12px] py-[8px] text-[18px] leading-[24px] text-[var(--color-hr-dark)] dark:border-[var(--color-hr-dark-line)] dark:bg-[var(--color-hr-black-box)] dark:text-[var(--color-text-inverse)]">
      {tag.label ? <span>{tag.label}:</span> : null}
      {tag.value ? <span className={cn(tag.isAccent ? "gradient-text-brand" : undefined)}>{tag.value}</span> : null}
    </span>
  );
}

/**
 * Analytics card (Figma 2255:1251–1296). Half-width cards stack image, title,
 * body and tags; full-width cards put the title and body side by side under
 * the image. Off-white with a hairline border and 40px radius, 30px padding.
 */
function ProofCard({ item }: { item: ProofItem }) {
  const imageUrl = getImageUrl(item);
  const lqip = item.image?.asset?.metadata?.lqip;
  const alt = item.image?.alt ?? item.title;
  const tags = (item.metricTags ?? []).filter((t): t is MetricTag => Boolean(t && (t.label || t.value)));
  const full = Boolean(item.isFullWidth);

  return (
    <article
      className={cn(
        "flex flex-col gap-[30px] rounded-[22px] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-off-white)] p-[15px] dark:border-[var(--color-hr-dark-line)] dark:bg-[var(--color-surface-inverse-10)] lg:rounded-[40px] lg:p-[30px]",
        full ? "lg:col-span-2" : null,
      )}
    >
      {imageUrl ? (
        <figure className={cn("relative w-full overflow-hidden rounded-[10px] bg-[var(--color-hr-black-box)]", full ? "aspect-[1220/560]" : "aspect-[570/326]")}>
          <Image
            alt={alt}
            blurDataURL={lqip}
            className="object-cover"
            fill
            placeholder={lqip ? "blur" : "empty"}
            sizes={full ? "(min-width: 1024px) 1220px, 100vw" : "(min-width: 1024px) 570px, 100vw"}
            src={imageUrl}
          />
        </figure>
      ) : null}
      <div className={cn("flex flex-col gap-[4px]", full ? "lg:flex-row lg:items-start lg:justify-between lg:gap-[40px]" : null)}>
        <h3 className="font-normal text-[22px] leading-[1.2] tracking-[-0.44px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] lg:text-[32px] lg:tracking-[-0.64px]">
          {item.title}
        </h3>
        {item.body ? (
          <p className={cn("text-[16px] leading-[1.3] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] lg:text-[18px] lg:leading-[24px]", full ? "lg:w-[600px] lg:shrink-0" : "max-w-[478px]")}>
            {item.body}
          </p>
        ) : null}
      </div>
      {tags.length > 0 ? (
        <ul className="flex flex-wrap gap-[10px]">
          {tags.map((tag, index) => (
            <li key={tag._key ?? `${tag.label ?? "tag"}-${index}`}>
              <MetricTagPill tag={tag} />
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}

/**
 * The Proof Is in the Data (Figma 2255:941, 2255:975): label, two-tone
 * heading beside a 630px paragraph, then the analytics cards in a 2-column
 * grid where full-width cards span both columns.
 */
export function CaseStudyProofData({ data }: CaseStudyProofDataProps) {
  if (!data) return null;
  const items = data.items ?? [];
  if (items.length === 0) return null;
  const headingMain = data.headingMain ?? "";
  const headingHighlighted = data.headingHighlighted ?? "";
  const hasHeading = Boolean(headingMain || headingHighlighted);

  return (
    <section className="px-[20px] pb-[60px] lg:px-[80px] lg:pb-[120px]" id="case-study-proof">
      <div className="mx-auto w-full max-w-[1280px]">
        {data.label ? <SectionLabel className="text-center lg:text-left">{data.label}</SectionLabel> : null}
        <div className="mt-[20px] flex flex-col items-center gap-[20px] text-center lg:flex-row lg:items-start lg:justify-between lg:gap-[60px] lg:text-left">
          {hasHeading ? (
            <TwoToneHeading
              as="h2"
              className="shrink-0 font-normal text-[28px] leading-[1.2] tracking-[-0.56px] text-[var(--color-hr-pure-black)] dark:text-[var(--color-text-inverse)] lg:text-[52px] lg:leading-[60px] lg:tracking-[-1.04px]"
              highlighted={headingHighlighted}
              main={headingMain}
            />
          ) : null}
          {data.body ? <p className="max-w-[630px] text-[16px] leading-[1.3] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] lg:text-[18px] lg:leading-[24px]">{data.body}</p> : null}
        </div>
        <div className="mt-[40px] grid grid-cols-1 gap-[20px] lg:mt-[80px] lg:grid-cols-2">
          {items.map((item, index) => (
            <ProofCard item={item} key={item._key ?? `${item.title}-${index}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
