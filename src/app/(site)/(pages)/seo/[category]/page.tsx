import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { BlogPostDetailContent } from "@/components/pages/insights/blog-post-detail-content";
import { ArticleSchema } from "@/components/seo/article-schema";
import { FaqSchema } from "@/components/seo/faq-schema";
import { createPageMetadata } from "@/lib/metadata";
import { getPostBySlug } from "@/lib/sanity-data";
import { SITE_URL } from "@/lib/site";

/*
 * /seo/<slug>/ for posts with no URL category (pillar guides). The static
 * service routes (/seo/technical/ …) win over this dynamic segment; anything
 * else here that is not such a post is a 404.
 */

interface HubRouteProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: HubRouteProps): Promise<Metadata> {
  const { category: slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || post.urlCategory) notFound();

  return createPageMetadata({
    title: post.seoTitle?.trim() || post.title,
    exactTitle: Boolean(post.seoTitle?.trim()),
    description: post.seoDescription?.trim() || post.excerpt || "Explore insights from Heroic Rankings.",
    path: `/seo/${slug}`,
    ogType: "article",
    image: post.ogImageUrl ? { url: post.ogImageUrl, alt: post.mainImageAlt } : null,
  });
}

/*
 * WHY: every page on this site renders on demand (nonce-based CSP), so a
 * static-params list buys nothing here, and it is actively harmful: when it
 * comes back empty at build time (no category-less post yet), Next marks the
 * route static and every on-demand render of it fails with a 500. Forcing
 * dynamic rendering keeps the route behaving like /seo/[category]/[slug].
 */
export const dynamic = "force-dynamic";

export default async function HubPostPage({ params }: HubRouteProps) {
  const { category: slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || post.urlCategory) notFound();

  const faqItems = post.faqItems;

  return (
    <>
      {faqItems.length ? (
        <Suspense fallback={null}>
          <FaqSchema items={faqItems} />
        </Suspense>
      ) : null}
      <Suspense fallback={null}>
        <ArticleSchema
          author={post.author?.name ?? post.authorName}
          authorUrl={post.author?.slug ? `${SITE_URL}/about/${post.author.slug}/` : null}
          dateModified={post.updatedAt}
          datePublished={post.publishedAt}
          description={post.excerpt}
          headline={post.title}
          image={post.mainImageUrl || null}
          type="BlogPosting"
          url={`${SITE_URL}/seo/${slug}/`}
        />
      </Suspense>
      <BlogPostDetailContent post={post} />
    </>
  );
}
