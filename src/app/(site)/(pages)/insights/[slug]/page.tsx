import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { BlogPostDetailContent } from "@/components/pages/insights/blog-post-detail-content";
import { ArticleSchema } from "@/components/seo/article-schema";
import { createPageMetadata } from "@/lib/metadata";
import { getPostBySlug, getPostSlugs } from "@/lib/sanity-data";

export const dynamic = "force-dynamic";

interface InsightPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: InsightPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return createPageMetadata({
    title: post.seoTitle?.trim() || post.title,
    description:
      post.seoDescription?.trim() ||
      post.excerpt ||
      "Explore insights from Heroic Rankings.",
    path: `/insights/${slug}`,
    ogType: "article",
  });
}

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function InsightPostPage({
  params,
}: InsightPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
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
