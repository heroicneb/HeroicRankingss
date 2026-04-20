import { PortableText } from "@portabletext/react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { portableTextComponents } from "@/components/sanity/PortableTextComponents";
import { ArticleSchema } from "@/components/seo/article-schema";
import { formatPublishedDate } from "@/lib/format";
import { createPageMetadata } from "@/lib/metadata";
import { getPostBySlug, getPostSlugs } from "@/lib/sanity-data";

interface InsightPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: InsightPostPageProps): Promise<Metadata> {
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

export default async function InsightPostPage({ params }: InsightPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const publishedAt = formatPublishedDate(post.publishedAt);

  return (
    <>
    <Suspense fallback={null}>
      <ArticleSchema
        headline={post.title}
        datePublished={post.publishedAt}
        author={post.authorName}
        image={post.mainImageUrl || null}
        description={post.excerpt}
      />
    </Suspense>
    <section className="pb-[130px] pt-[109px]" id="insight-post">
      <div className="mx-auto w-full max-w-[1440px] px-5 md:px-10 xl:px-[80px]">
        <h1 className="w-full max-w-[1196px] text-[42px] font-normal leading-[52px] tracking-[-0.84px] sm:text-[52px] sm:leading-[66px] xl:text-[62px] xl:leading-[80px] xl:tracking-[-1.24px]">
          <span className="gradient-text-brand">{post.title}</span>
        </h1>

        <div className="mt-6 flex flex-wrap items-center gap-2 text-[16px] font-normal leading-[22px] text-[var(--color-hr-grey)] dark:text-[var(--color-text-inverse-60)]">
          {post.authorName ? <span>By {post.authorName}</span> : null}
          {post.authorRole ? <span>· {post.authorRole}</span> : null}
          {publishedAt && post.publishedAt ? <time dateTime={post.publishedAt}>· {publishedAt}</time> : null}
        </div>

        {post.categories.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.categories.map((category) => (
              <span
                className="rounded-full bg-[var(--color-hr-off-white)] px-3 py-1 text-[14px] font-medium uppercase tracking-[0.06em] text-[var(--color-hr-grey)] dark:bg-[var(--color-surface-inverse-10)] dark:text-[var(--color-text-inverse-60)]"
                key={category}
              >
                {category.replace(/-/g, " ")}
              </span>
            ))}
          </div>
        ) : null}

        {post.mainImageUrl ? (
          <div className="relative mt-10 h-[260px] w-full overflow-hidden rounded-[30px] sm:h-[420px] lg:h-[560px] xl:h-[720px] xl:rounded-[40px]">
            <Image
              alt={post.mainImageAlt}
              blurDataURL={post.mainImageLqip}
              className="object-cover"
              fetchPriority="high"
              fill
              placeholder={post.mainImageLqip ? "blur" : "empty"}
              priority
              quality={95}
              sizes="(min-width: 1280px) 1280px, 100vw"
              src={post.mainImageUrl}
            />
          </div>
        ) : null}

        {post.excerpt ? (
          <p className="mt-8 w-full max-w-[954px] text-[20px] font-medium leading-[28px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
            {post.excerpt}
          </p>
        ) : null}

        {post.body?.length ? (
          <article className="mt-8 w-full max-w-[954px] text-[18px] font-normal leading-[24px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
            <PortableText components={portableTextComponents} value={post.body} />
          </article>
        ) : (
          <p className="mt-8 w-full max-w-[954px] text-[18px] font-normal leading-[24px] text-[var(--color-hr-grey)] dark:text-[var(--color-text-inverse-60)]">
            Full article content will appear here as soon as it is published in CMS.
          </p>
        )}
      </div>
    </section>
    </>
  );
}
