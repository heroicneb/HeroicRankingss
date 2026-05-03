import { PortableText } from "@portabletext/react";

import { buildHeadingIdMap } from "@/lib/heading-slug";
import type { SanityPostDetail } from "@/lib/sanity-data";
import { SITE_URL } from "@/lib/site";
import { makePortableTextComponents } from "@/sanity/lib/portable-text-components";

import { BlogPostAuthorCard } from "./parts/BlogPostAuthorCard";
import { BlogPostHeader } from "./parts/BlogPostHeader";
import { BlogPostHero } from "./parts/BlogPostHero";
import { BlogPostShareBar } from "./parts/BlogPostShareBar";
import { BlogPostTableOfContents } from "./parts/BlogPostTableOfContents";

interface BlogPostDetailContentProps {
  post: SanityPostDetail;
}

/**
 * Sanity-driven blog post detail page (Figma 2339:27 desktop / 2339:195 mobile).
 *
 * Two-column desktop:
 *   - Left (305): sticky TOC (scroll-spy via IntersectionObserver) + author card
 *   - Right (933): hero image + portable-text body + share bar
 *
 * Single-column mobile (TOC dropped per Figma; "Get summary" collapses to a
 * dropdown card; body text centered).
 *
 * H2/H3 anchor ids are computed once from the body and emitted by the
 * PortableText serializer, so TOC links + scroll-spy + first-load #hash
 * deep-links all resolve without DOM patching.
 */
export function BlogPostDetailContent({ post }: BlogPostDetailContentProps) {
  const articleUrl = post.slug ? `${SITE_URL}/insights/${post.slug}` : SITE_URL;
  const headingIds = buildHeadingIdMap(post.body);
  const components = makePortableTextComponents(headingIds);

  return (
    <article
      className="pb-[100px] pt-[60px] lg:pb-[160px] lg:pt-[183px]"
      id="insight-blog-post"
    >
      <div className="mx-auto w-full max-w-[1440px] px-[20px] lg:px-[80px]">
        <BlogPostHeader articleUrl={articleUrl} post={post} />

        <div className="mt-[40px] lg:mt-[60px] lg:grid lg:grid-cols-[305px_minmax(0,933px)] lg:gap-[40px]">
          {/* Desktop-only left column: TOC stays sticky as user scrolls
              the article body. Author card flows below in normal layout
              so its full bio is always visible (longer bios were getting
              clipped by the previous max-h-[calc(100vh-120px)] cap). */}
          <aside className="hidden lg:flex lg:flex-col lg:gap-[50px]">
            <div className="sticky top-[100px]">
              <BlogPostTableOfContents body={post.body} />
            </div>
            <BlogPostAuthorCard author={post.author} />
          </aside>

          {/* Right column: hero image + body + share bar */}
          <div className="text-center lg:text-left">
            <BlogPostHero post={post} />
            {post.body && post.body.length > 0 ? (
              <div className="mt-[40px] lg:mt-[60px]">
                <PortableText components={components} value={post.body} />
              </div>
            ) : null}
            <BlogPostShareBar articleUrl={articleUrl} post={post} />
          </div>
        </div>

        {/* Mobile-only author card after share bar (Figma 2339:248) */}
        <div className="mt-[40px] lg:hidden">
          <p className="mb-[20px] text-center text-[24px] font-medium leading-[28px] tracking-[-0.48px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
            Author
          </p>
          <BlogPostAuthorCard author={post.author} />
        </div>
      </div>
    </article>
  );
}
