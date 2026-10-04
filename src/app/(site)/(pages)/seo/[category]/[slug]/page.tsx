import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { BlogPostDetailContent } from "@/components/pages/insights/blog-post-detail-content";
import { ArticleSchema } from "@/components/seo/article-schema";
import { FaqSchema } from "@/components/seo/faq-schema";
import { createPageMetadata } from "@/lib/metadata";
import { getPostBySlug, getPostUrls } from "@/lib/sanity-data";
import { SITE_URL } from "@/lib/site";

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
    exactTitle: Boolean(post.seoTitle?.trim()),
    description:
      post.seoDescription?.trim() ||
      post.excerpt ||
      "Explore insights from Heroic Rankings.",
    path: `/seo/${category}/${slug}`,
    ogType: "article",
    image: post.ogImageUrl ? { url: post.ogImageUrl, alt: post.mainImageAlt } : null,
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

  // WHY: resolved by the data layer from the post's "FAQ schema" field (auto from the article, manual list, or off).
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
          url={`${SITE_URL}/seo/${category}/${slug}/`}
        />
      </Suspense>
      <BlogPostDetailContent post={post} />
    </>
  );
}
