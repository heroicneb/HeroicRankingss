"use client";

import { ProofVisual } from "@/components/charts/ProofVisual";
import { resolveArticleVisual } from "@/components/charts/article-visuals";

/**
 * A data visual inside a blog post: the same dark proof card the case studies
 * use (count-up stats, chart, table), picked by id in the Studio. Unknown ids
 * render nothing, so a removed visual never breaks a post.
 */
export function ArticleVisual({ visualId, caption }: { visualId?: string | null; caption?: string | null }) {
  const spec = resolveArticleVisual(visualId);
  if (!spec) return null;
  return (
    <figure className="my-[32px] lg:my-[40px]">
      <ProofVisual chartAspectClassName="aspect-[4/3] sm:aspect-[16/9] lg:aspect-[900/360]" spec={spec} />
      {caption ? <figcaption className="mt-[10px] text-[13px] leading-[18px] text-[var(--color-hr-grey)] dark:text-[var(--color-text-inverse-50)]">{caption}</figcaption> : null}
    </figure>
  );
}
