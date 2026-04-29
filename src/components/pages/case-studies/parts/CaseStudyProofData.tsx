import Image from "next/image";

import { SectionLabel } from "@/components/ui/section-label";
import { TwoToneHeading } from "@/components/ui/two-tone-heading";
import type { SanityCaseStudyDetail } from "@/lib/sanity-data";
import { cn } from "@/lib/cn";
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
    return urlFor(item.image)
      .width(item.isFullWidth ? 1600 : 900)
      .url();
  } catch {
    return null;
  }
}

function MetricTagPill({ tag }: { tag: MetricTag }) {
  if (!tag.label && !tag.value) return null;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-[6px] rounded-full border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-pure-white)] px-[16px] py-[8px] text-[14px] font-medium leading-[1.2] text-[var(--color-hr-dark)]",
        tag.isAccent ? "border-[var(--color-hr-accent)]" : null,
      )}
    >
      {tag.label ? <span className="opacity-70">{tag.label}:</span> : null}
      {tag.value ? (
        <span className={tag.isAccent ? "gradient-text-brand" : undefined}>
          {tag.value}
        </span>
      ) : null}
    </span>
  );
}

function ProofCard({ item }: { item: ProofItem }) {
  const imageUrl = getImageUrl(item);
  const lqip = item.image?.asset?.metadata?.lqip;
  const alt = item.image?.alt ?? item.title;
  const tags = (item.metricTags ?? []).filter((t): t is MetricTag =>
    Boolean(t && (t.label || t.value)),
  );

  return (
    <article
      className={cn(
        "flex flex-col gap-[20px] rounded-[22px] bg-[var(--color-hr-off-white)] p-[24px] lg:rounded-[30px] lg:p-[30px]",
        item.isFullWidth ? "lg:col-span-2" : null,
      )}
    >
      {imageUrl ? (
        <figure
          className={cn(
            "relative w-full overflow-hidden rounded-[16px]",
            item.isFullWidth ? "aspect-[1220/560]" : "aspect-[570/326]",
          )}
        >
          <Image
            alt={alt}
            blurDataURL={lqip}
            className="object-cover"
            fill
            placeholder={lqip ? "blur" : "empty"}
            sizes={
              item.isFullWidth
                ? "(min-width: 1024px) 1220px, 100vw"
                : "(min-width: 1024px) 570px, 100vw"
            }
            src={imageUrl}
          />
        </figure>
      ) : null}

      <h3 className="font-normal text-[22px] leading-[1.2] tracking-[-0.44px] text-[var(--color-hr-pure-black)] lg:text-[28px] lg:tracking-[-0.56px]">
        {item.title}
      </h3>

      {item.body ? (
        <p className="type-paragraph text-[var(--color-hr-dark)]">
          {item.body}
        </p>
      ) : null}

      {tags.length > 0 ? (
        <ul className="flex flex-wrap gap-[8px]">
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
 * The Proof Is in the Data section (Figma `2255:975` desktop / `2255:1764`
 * mobile).
 *
 * Renders a mixed grid of analytics-screenshot cards. Desktop: 2-column
 * grid; cards flagged with `isFullWidth` span both columns. Mobile:
 * single-column stack. Each card surfaces a screenshot, title, body, and
 * up to 4 metric tag pills.
 */
export function CaseStudyProofData({ data }: CaseStudyProofDataProps) {
  if (!data) return null;
  const items = data.items ?? [];
  if (items.length === 0) return null;

  const headingMain = data.headingMain ?? "";
  const headingHighlighted = data.headingHighlighted ?? "";
  const hasHeading = Boolean(headingMain || headingHighlighted);

  return (
    <section
      className="px-[20px] pb-[60px] pt-[40px] lg:px-[80px] lg:pb-[120px] lg:pt-[80px]"
      id="case-study-proof"
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
            className="mt-[14px] max-w-[860px] text-center font-normal text-[28px] leading-[1.2] tracking-[-0.56px] lg:mt-[20px] lg:text-left lg:text-[52px] lg:leading-[60px] lg:tracking-[-1.04px] text-[var(--color-hr-pure-black)] dark:text-[var(--color-text-inverse)]"
            highlighted={headingHighlighted}
            main={headingMain}
          />
        ) : null}

        {data.body ? (
          <p className="mt-[20px] max-w-[900px] text-center text-[16px] leading-[1.3] text-[var(--color-hr-dark)] lg:mt-[30px] lg:text-left lg:text-[18px] lg:leading-[24px] dark:text-[var(--color-text-inverse)]">
            {data.body}
          </p>
        ) : null}

        <div className="mt-[40px] grid grid-cols-1 gap-[20px] lg:mt-[60px] lg:grid-cols-2">
          {items.map((item, index) => (
            <ProofCard
              key={item._key ?? `${item.title}-${index}`}
              item={item}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
