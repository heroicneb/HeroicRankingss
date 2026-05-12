import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { BlogPostDetailContent } from "@/components/pages/insights/blog-post-detail-content";
import { ArticleSchema } from "@/components/seo/article-schema";
import { createPageMetadata } from "@/lib/metadata";
import { getPostBySlug, getPostUrls } from "@/lib/sanity-data";

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

// Strict guard: only ASCII URL-safe segments. Rejects any hidden
// Unicode (zero-width joiner, BOM, bidi marks) that would otherwise
// expand the prerender path beyond ENAMETOOLONG limits. Logs rejected
// rows so we can hunt the source.
const URL_SEG = /^[a-z0-9](?:[a-z0-9-]{0,79})$/;

export async function generateStaticParams() {
  const posts = await getPostUrls();
  const safe: Array<{ category: string; slug: string }> = [];
  for (const post of posts) {
    if (!post.urlCategory || !post.slug) continue;
    if (!URL_SEG.test(post.urlCategory) || !URL_SEG.test(post.slug)) {
      console.error(
        `[generateStaticParams seo/[cat]/[slug]] rejected: cat=%j (len=%d) slug=%j (len=%d) codepoints=%j`,
        post.urlCategory,
        post.urlCategory.length,
        post.slug,
        post.slug.length,
        Array.from(post.urlCategory + "|" + post.slug).map((c) =>
          c.codePointAt(0)?.toString(16),
        ),
      );
      continue;
    }
    safe.push({ category: post.urlCategory, slug: post.slug });
  }
  return safe;
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
