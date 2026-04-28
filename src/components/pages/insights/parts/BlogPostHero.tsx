import Image from "next/image";

import type { SanityPostDetail } from "@/lib/sanity-data";

interface BlogPostHeroProps {
  post: SanityPostDetail;
}

/**
 * Hero image for the article body. Uses LQIP placeholder + responsive sizes.
 * Desktop: 933x466.5 rounded-[30px] (Figma 2339:122).
 * Mobile: 350x175 rounded-[20px] (Figma 2339:229).
 */
export function BlogPostHero({ post }: BlogPostHeroProps) {
  if (!post.mainImageUrl) return null;

  return (
    <div className="relative aspect-[2/1] w-full overflow-hidden rounded-[20px] lg:rounded-[30px]">
      <Image
        alt={post.mainImageAlt}
        blurDataURL={post.mainImageLqip}
        className="object-cover"
        fetchPriority="high"
        fill
        placeholder={post.mainImageLqip ? "blur" : "empty"}
        priority
        quality={90}
        sizes="(min-width: 1024px) 933px, 100vw"
        src={post.mainImageUrl}
      />
    </div>
  );
}
