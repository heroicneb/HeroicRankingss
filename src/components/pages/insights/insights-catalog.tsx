"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { InsightsPagination } from "@/components/pages/insights/insights-pagination";
import { AppLink } from "@/components/ui/app-link";
import { BLOG_POSTS } from "@/data/blog-posts";
import type { BlogPostEntry } from "@/data/blog-posts";
import { ChevronDownIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";
import { getPostHref } from "@/lib/post-url";
import type { SanityPostSummary } from "@/lib/sanity-data";

type CategoryTab = "All" | "Marketing" | "SEO" | "Link Building";

const CATEGORY_TABS: CategoryTab[] = [
  "All",
  "Marketing",
  "SEO",
  "Link Building",
];
const MOBILE_CATEGORY_LISTBOX_ID = "insights-category-listbox";
// WHY: matches the legacy heroicrankings.com blog (12 per page, numbered pages).
const PAGE_SIZE = 12;
const CATEGORY_PARAM: Record<CategoryTab, string | null> = {
  All: null,
  Marketing: "marketing",
  SEO: "seo",
  "Link Building": "link-building",
};

function tabFromParam(value: string | null): CategoryTab {
  const match = (Object.keys(CATEGORY_PARAM) as CategoryTab[]).find((tab) => CATEGORY_PARAM[tab] === value);
  return match ?? "All";
}
const STATIC_CARD_BY_SLUG = new Map(
  BLOG_POSTS.map((card) => [card.slug, card]),
);

function formatPublishedDate(dateValue: string | null): string {
  if (!dateValue) return "Draft";

  const parsedDate = new Date(dateValue);
  if (Number.isNaN(parsedDate.getTime())) return "Draft";

  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parsedDate);
}

function mapPostCategory(post: SanityPostSummary): BlogPostEntry["category"] {
  const normalized = post.categories.map((category) => category.toLowerCase());

  if (normalized.includes("link-building")) return "Link Building";
  if (normalized.includes("seo")) return "SEO";
  return "Marketing";
}

function mapPostToCatalogCard(post: SanityPostSummary): BlogPostEntry {
  const staticFallback = STATIC_CARD_BY_SLUG.get(post.slug);
  const href = getPostHref(post);

  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt ?? staticFallback?.excerpt ?? "",
    date: post.publishedAt
      ? formatPublishedDate(post.publishedAt)
      : (staticFallback?.date ?? "Draft"),
    href: href ?? "/blog",
    category: mapPostCategory(post),
    imageSrc:
      post.mainImageUrl ||
      staticFallback?.imageSrc ||
      "/insights/imgSubtract1.png",
    // Cards without a urlCategory have no canonical URL — render as
    // non-link via existing isPublished=false rendering path.
    isPublished: href !== null,
  };
}

function InsightBlogCard({ card }: { card: BlogPostEntry }) {
  const cardShellClassName =
    "block w-full max-w-[348px] overflow-hidden rounded-[30px] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-pure-white)] pb-[20px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-hr-accent)] focus-visible:ring-offset-2 dark:border-[var(--color-border-inverse-10)] dark:bg-[var(--color-bg-dark)] lg:h-[467px] lg:max-w-none lg:rounded-[40px] lg:pb-0";

  const cardContent = (
    <>
      <div className="relative h-[174px] w-full overflow-hidden rounded-[20px] lg:h-[207px] lg:rounded-t-[40px] lg:rounded-b-none">
        <Image
          alt={`${card.title} cover image`}
          className="object-cover object-center"
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          src={card.imageSrc}
        />
      </div>

      <div className="mt-[20px] flex flex-col items-center gap-[20px] lg:mt-0 lg:block lg:px-5 lg:pt-5">
        <div className="flex w-[286px] flex-col items-center gap-[10px] text-center lg:w-full lg:items-start lg:text-left">
          <h3 className="line-clamp-3 text-[28px] font-normal leading-[1.2] tracking-[-0.56px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] lg:min-h-[84px] lg:text-[32px] lg:leading-[32px] lg:tracking-[-0.64px]">
            {card.title}
          </h3>
          <p className="text-[16px] font-normal leading-[1.3] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] lg:h-[72px] lg:overflow-hidden lg:text-[18px] lg:leading-[24px]">
            {card.excerpt}
          </p>
        </div>

        <div className="flex items-center gap-2 lg:mt-5">
          <p className="text-[16px] font-normal leading-[1.3] text-[var(--color-hr-grey)] dark:text-[var(--color-text-inverse-50)] lg:text-[18px] lg:leading-[24px]">
            {card.date}
          </p>
          {!card.isPublished ? (
            <span className="rounded-full bg-[var(--color-hr-off-white)] px-2 py-1 text-[12px] leading-none text-[var(--color-hr-grey)] dark:bg-[var(--color-surface-inverse-10)] dark:text-[var(--color-text-inverse-60)]">
              Coming soon
            </span>
          ) : null}
        </div>
      </div>
    </>
  );

  if (!card.isPublished) {
    return (
      <article
        aria-label={`Insight coming soon: ${card.title}`}
        className={cardShellClassName}
      >
        {cardContent}
      </article>
    );
  }

  return (
    <AppLink
      aria-label={`Open blog article: ${card.title}`}
      className={cardShellClassName}
      href={card.href}
    >
      {cardContent}
    </AppLink>
  );
}

interface InsightsCatalogProps {
  cmsPosts?: SanityPostSummary[];
  /** `category` query param from the URL. */
  category?: string | null;
  /** `page` query param from the URL. */
  page?: string | null;
}

/**
 * WHY: the active category and page live in the URL (?category=…&page=…) and
 * arrive as props from the route, so every archive page is server-rendered,
 * shareable and crawlable, and the back button works.
 */
export function InsightsCatalog({ cmsPosts, category, page: pageParam }: InsightsCatalogProps) {
  const router = useRouter();
  const pathname = usePathname();
  const activeTab = tabFromParam(category ?? null);
  const requestedPage = Math.max(1, Number.parseInt(pageParam ?? "1", 10) || 1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const mobileDropdownRef = useRef<HTMLDivElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);

  const navigate = (tab: CategoryTab, page: number) => {
    const params = new URLSearchParams();
    const category = CATEGORY_PARAM[tab];
    if (category) params.set("category", category);
    if (page > 1) params.set("page", String(page));
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    // WHY: keep the tabs in view when a new page loads instead of jumping to the top of the document.
    gridRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  };

  const catalogCards = useMemo(
    () => (cmsPosts?.length ? cmsPosts.map(mapPostToCatalogCard) : BLOG_POSTS),
    [cmsPosts],
  );

  useEffect(() => {
    if (!isDropdownOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      const dropdownElement = mobileDropdownRef.current;
      if (!dropdownElement) {
        return;
      }

      if (!dropdownElement.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isDropdownOpen]);

  const filteredCards = useMemo(() => {
    if (activeTab === "All") {
      return catalogCards;
    }

    return catalogCards.filter((card) => card.category === activeTab);
  }, [activeTab, catalogCards]);

  const selectTab = (tab: CategoryTab) => navigate(tab, 1);

  const pageCount = Math.max(1, Math.ceil(filteredCards.length / PAGE_SIZE));
  const page = Math.min(requestedPage, pageCount);
  const visibleCards = filteredCards.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <div className="mx-auto w-full max-w-[350px] px-[10px] lg:hidden">
        <div className="relative" ref={mobileDropdownRef}>
          <button
            aria-controls={MOBILE_CATEGORY_LISTBOX_ID}
            aria-expanded={isDropdownOpen}
            aria-haspopup="listbox"
            aria-label="Filter insights by category"
            className="inline-flex h-[45px] w-full items-center justify-between rounded-[16px] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-pure-white)] px-[10px] text-[16px] font-normal leading-[1.3] text-[var(--color-hr-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-hr-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-hr-pure-white)] dark:border-[var(--color-border-inverse-10)] dark:bg-[var(--color-bg-dark)] dark:text-[var(--color-text-inverse)] dark:focus-visible:ring-offset-[var(--color-bg-dark)]"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            type="button"
          >
            {activeTab}
            <ChevronDownIcon
              className={cn(
                "size-3 transition-transform",
                isDropdownOpen ? "rotate-180" : "",
              )}
            />
          </button>

          {isDropdownOpen ? (
            <div
              aria-label="Insight categories"
              className="absolute left-0 right-0 top-[calc(100%+8px)] z-10 rounded-[16px] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-pure-white)] p-2 shadow-[var(--shadow-navbar)] dark:border-[var(--color-border-inverse-10)] dark:bg-[var(--color-bg-dark)]"
              id={MOBILE_CATEGORY_LISTBOX_ID}
              role="listbox"
            >
              {CATEGORY_TABS.map((tab) => (
                <button
                  aria-selected={activeTab === tab}
                  className={cn(
                    "block min-h-[44px] w-full rounded-[12px] px-3 py-2 text-left text-[16px] text-[var(--color-hr-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-hr-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-hr-pure-white)] dark:text-[var(--color-text-inverse)] dark:focus-visible:ring-offset-[var(--color-bg-dark)]",
                    activeTab === tab
                      ? "bg-[var(--color-hr-off-white)] dark:bg-[var(--color-surface-inverse-10)]"
                      : "",
                  )}
                  key={tab}
                  onClick={() => {
                    selectTab(tab);
                    setIsDropdownOpen(false);
                  }}
                  role="option"
                  type="button"
                >
                  {tab}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-10 hidden flex-wrap items-center gap-[10px] px-[15px] lg:flex">
        {CATEGORY_TABS.map((tab) => {
          const isActive = activeTab === tab;

          return (
            <button
              className={cn(
                "motion-interactive motion-interactive-press rounded-[100px] px-[14px] py-[6px] text-[18px] font-normal leading-[24px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-hr-accent)] focus-visible:ring-offset-2",
                isActive
                  ? "bg-[var(--color-hr-dark)] text-[var(--color-hr-off-white)] dark:bg-[var(--color-text-inverse)] dark:text-[var(--color-text-fill-dark)]"
                  : "bg-[var(--color-hr-off-white)] text-[var(--color-hr-grey)] hover:bg-[color-mix(in_srgb,var(--color-hr-off-white)_84%,var(--color-hr-light-grey)_16%)] dark:bg-[var(--color-surface-inverse-10)] dark:text-[var(--color-text-inverse-60)] dark:hover:bg-[var(--color-surface-inverse-10)]",
              )}
              key={tab}
              onClick={() => selectTab(tab)}
              type="button"
            >
              {tab}
            </button>
          );
        })}
      </div>

      <div
        className="mx-auto mt-10 flex w-full scroll-mt-[120px] flex-col items-center gap-[30px] pb-[10px] lg:grid lg:max-w-none lg:grid-cols-3 lg:gap-x-[21px] lg:gap-y-5 lg:px-[15px]"
        ref={gridRef}
      >
        {visibleCards.map((card) => (
          <InsightBlogCard card={card} key={card.slug} />
        ))}
      </div>

      <InsightsPagination onPageChange={(next) => navigate(activeTab, next)} page={page} pageCount={pageCount} />

      <div className="pb-[40px]" />
    </>
  );
}
