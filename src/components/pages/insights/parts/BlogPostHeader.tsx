import { GradientText } from "@/components/ui/gradient-text";
import type { SanityPostDetail } from "@/lib/sanity-data";
import { splitTitle } from "@/lib/split-title";

import { BlogPostGetSummary } from "./BlogPostGetSummary";

interface BlogPostHeaderProps {
  articleUrl: string;
  post: SanityPostDetail;
}

function formatCategoryLabel(category: string): string {
  return category
    .split("-")
    .map((word) =>
      word.length > 0 ? word[0]!.toUpperCase() + word.slice(1) : word,
    )
    .join(" ");
}

/**
 * Article header for the Sanity-driven insights detail page.
 *
 * Stack (per Figma 2339:67 desktop / 2339:218 mobile):
 *   - byline (`by {author} · in {category}`)
 *   - full-gradient H1
 *   - "Get summary" label + 5 AI pills (mobile collapses to dropdown card)
 *   - 1px divider
 */
export function BlogPostHeader({ articleUrl, post }: BlogPostHeaderProps) {
  const authorName = post.author?.name ?? post.authorName;
  const categoryRaw = post.categories[0];
  const categoryLabel = categoryRaw ? formatCategoryLabel(categoryRaw) : null;
  const { before, gradient, after } = splitTitle(
    post.title,
    post.titleHighlighted,
  );
  const hasHighlight = gradient.length > 0;

  return (
    <header className="w-full">
      {/* Byline */}
      <p className="text-center text-[16px] font-normal leading-[20px] tracking-[-0.32px] text-[var(--color-hr-dark)] lg:text-left lg:text-[18px] lg:leading-[24px] lg:tracking-normal dark:text-[var(--color-text-inverse)]">
        {authorName ? (
          <>
            <span>by </span>
            <span className="font-bold">{authorName}</span>
          </>
        ) : null}
        {authorName && categoryLabel ? (
          <span aria-hidden className="mx-[6px] gradient-text-brand">
            ·
          </span>
        ) : null}
        {categoryLabel ? (
          <>
            <span>in </span>
            <span className="font-bold">{categoryLabel}</span>
          </>
        ) : null}
      </p>

      {/* Two-tone H1 (solid + gradient via titleHighlighted), falls back to
          full gradient when no highlight is configured. */}
      <h1 className="mt-[20px] text-center text-[38px] font-normal leading-[1.2] tracking-[-0.76px] text-[var(--color-hr-pure-black)] lg:mt-[30px] lg:text-left lg:text-[62px] lg:leading-[80px] lg:tracking-[-1.24px] dark:text-[var(--color-text-inverse)]">
        {hasHighlight ? (
          <>
            {before ? <span>{before}</span> : null}
            <GradientText>{gradient}</GradientText>
            {after ? <span>{after}</span> : null}
          </>
        ) : (
          <GradientText>{post.title}</GradientText>
        )}
      </h1>

      {/* AI summary block (desktop pills inline / mobile collapsed dropdown) */}
      <div className="mt-[30px] flex justify-center lg:mt-[40px] lg:justify-start">
        <BlogPostGetSummary articleUrl={articleUrl} />
      </div>

      {/* Divider */}
      <div
        aria-hidden
        className="mt-[40px] h-px w-full bg-[var(--color-hr-light-grey)] lg:mt-[60px] dark:bg-[var(--color-border-inverse-15)]"
      />
    </header>
  );
}
