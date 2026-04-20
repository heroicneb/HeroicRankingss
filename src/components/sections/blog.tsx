import { AppLink } from "@/components/ui/app-link";
import { Container } from "@/components/ui/container";
import { PUBLISHED_BLOG_POSTS } from "@/data/blog-posts";
import { ArrowUpRightIcon } from "@/components/ui/icons";
import { GradientArrowUpRightIcon } from "@/components/ui/icons/decorative";
import { SectionLabel } from "@/components/ui/section-label";
import type { SanityPostSummary } from "@/lib/sanity-data";

interface BlogCardItem {
  slug: string;
  title: string;
  excerpt: string | null;
  date: string | null;
  href: string;
}

function mapCmsPosts(cmsPosts: SanityPostSummary[]): BlogCardItem[] {
  return cmsPosts.map((post) => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    date: post.publishedAt
      ? new Intl.DateTimeFormat("en-US", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }).format(new Date(post.publishedAt))
      : null,
    href: `/insights/${post.slug}`,
  }));
}

interface BlogProps {
  cmsPosts?: SanityPostSummary[];
}

export function Blog({ cmsPosts }: BlogProps) {
  const posts: BlogCardItem[] =
    cmsPosts && cmsPosts.length > 0
      ? mapCmsPosts(cmsPosts)
      : PUBLISHED_BLOG_POSTS.map((p) => ({
          slug: p.slug,
          title: p.title,
          excerpt: p.excerpt,
          date: p.date,
          href: p.href,
        }));
  return (
    <section
      className="pb-[60px] pt-[40px] lg:pb-[120px] lg:pt-[20px]"
      id="blog"
    >
      <Container>
        <div className="grid gap-8 lg:grid-cols-[577px_1fr] lg:items-end">
          <div className="text-center lg:text-left">
            <SectionLabel>
              /{"  "}Featured Blogs{"  "}/
            </SectionLabel>
            <h2 className="type-h2 mt-5 text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
              Insights and Trends in Our{" "}
              <span className="gradient-text-brand gradient-text-brand-blog">
                Most Popular Reads
              </span>
            </h2>
          </div>

          <div className="flex justify-center lg:justify-end">
            <AppLink
              className="type-cta motion-interactive motion-interactive-press inline-flex h-[47px] w-fit min-w-max items-center justify-center gap-[10px] rounded-[16px] border border-[var(--color-hr-accent)] bg-transparent px-5 py-3 text-[var(--color-hr-dark)] hover:bg-[var(--color-hr-off-white)] dark:text-[var(--color-text-inverse)] dark:hover:bg-[var(--color-surface-inverse-10)]"
              href="/insights"
              motionPreset="none"
            >
              View More Blogs
              <GradientArrowUpRightIcon className="size-[10px]" />
            </AppLink>
          </div>
        </div>
      </Container>

      <Container className="mt-[40px] lg:mt-20">
        <div className="grid gap-5 lg:grid-cols-3">
          {posts.map((blog) => (
            <AppLink
              aria-label={`Open featured blog: ${blog.title}`}
              className="mx-auto block w-full max-w-[348px] rounded-[30px] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-pure-white)] p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-hr-accent)] focus-visible:ring-offset-2 dark:border-[var(--color-border-inverse-10)] dark:bg-[var(--color-bg-dark)] lg:h-[467px] lg:max-w-none lg:rounded-[var(--radius-card)]"
              href={blog.href}
              id={`featured-blog-${blog.slug}`}
              key={blog.slug}
            >
              <div className="surface-radial h-[174px] rounded-[20px] lg:h-[207px] lg:rounded-[30px]" />
              <h3 className="type-h4 mt-5 text-center font-normal text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] lg:text-left">
                {blog.title}
              </h3>
              <p className="type-paragraph mt-5 text-center text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse-50)] lg:text-left">
                {blog.excerpt}
              </p>
              <p className="type-paragraph mt-5 text-center text-[var(--color-hr-grey)] dark:text-[var(--color-text-inverse-50)] lg:text-left">
                {blog.date}
              </p>
            </AppLink>
          ))}
        </div>
      </Container>
    </section>
  );
}
