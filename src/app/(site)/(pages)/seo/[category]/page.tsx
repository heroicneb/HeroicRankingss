import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { BlogPostDetailContent } from "@/components/pages/insights/blog-post-detail-content";
import { ArticleSchema } from "@/components/seo/article-schema";
import { FaqSchema } from "@/components/seo/faq-schema";
import { createPageMetadata } from "@/lib/metadata";
import { getPostBySlug, getPostUrls } from "@/lib/sanity-data";
import { SITE_URL } from "@/lib/site";

/*
 * /seo/<slug>/ for hub pages (pillar guides flagged "Hub page" in the
 * Studio). The static service routes (/seo/technical/ …) win over this
 * dynamic segment; anything else here that is not a hub post is a 404.
 */

interface HubRouteProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: HubRouteProps): Promise<Metadata> {
  const { category: slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post?.hubPage) notFound();

  return createPageMetadata({
    title: post.seoTitle?.trim() || post.title,
    exactTitle: Boolean(post.seoTitle?.trim()),
    description: post.seoDescription?.trim() || post.excerpt || "Explore insights from Heroic Rankings.",
    path: `/seo/${slug}`,
    ogType: "article",
    image: post.ogImageUrl ? { url: post.ogImageUrl, alt: post.mainImageAlt } : null,
  });
}

export async function generateStaticParams() {
  const posts = await getPostUrls();
  return posts.filter((post) => post.hubPage).map((post) => ({ category: post.slug }));
}

export default async function HubPostPage({ params }: HubRouteProps) {
  const { category: slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post?.hubPage) notFound();

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
