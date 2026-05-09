import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { BlogPostDetailContent } from "@/components/pages/insights/blog-post-detail-content";
import { ArticleSchema } from "@/components/seo/article-schema";
import { createPageMetadata } from "@/lib/metadata";
import { getPostBySlug, getPostUrls } from "@/lib/sanity-data";

export const dynamic = "force-dynamic";

interface PostRouteProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: PostRouteProps): Promise<Metadata> {
  const { category, slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post || !post.urlCategory || post.urlCategory !== category) {
    notFound();
  }

  return createPageMetadata({
    title: post.seoTitle?.trim() || post.title,
    description:
      post.seoDescription?.trim() ||
      post.excerpt ||
      "Explore insights from Heroic Rankings.",
    path: `/seo/${category}/${slug}`,
    ogType: "article",
  });
}

export async function generateStaticParams() {
  const posts = await getPostUrls();
  return posts
    .filter((post) => post.urlCategory && post.slug)
    .map((post) => ({
      category: post.urlCategory as string,
      slug: post.slug,
    }));
}

export default async function Page({ params }: PostRouteProps) {
  const { category, slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Strict category match — if a post has urlCategory but it doesn't match
  // the URL segment, return 404. This prevents the same post from being
  // served under multiple URLs (duplicate content + canonical drift).
  if (post.urlCategory !== category) {
    notFound();
  }

  return (
    <>
      <Suspense fallback={null}>
        <ArticleSchema
          author={post.authorName}
          datePublished={post.publishedAt}
          description={post.excerpt}
          headline={post.title}
          image={post.mainImageUrl || null}
        />
      </Suspense>
      <BlogPostDetailContent post={post} />
    </>
  );
}
