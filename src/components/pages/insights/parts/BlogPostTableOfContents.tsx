"use client";

import { useEffect, useMemo, useState } from "react";
import type { PortableTextBlock } from "@portabletext/react";

import { cn } from "@/lib/cn";

interface BlogPostTableOfContentsProps {
  body: PortableTextBlock[] | null;
}

interface TocItem {
  id: string;
  label: string;
}

const STICKY_OFFSET_PX = 120;

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function extractText(block: PortableTextBlock): string {
  // Portable Text blocks have a `children` array of spans with a `text` field.
  const children = (block as unknown as { children?: Array<{ text?: string }> }).children;
  if (!Array.isArray(children)) return "";
  return children
    .map((child) => (typeof child.text === "string" ? child.text : ""))
    .join("")
    .trim();
}

/**
 * Derive TOC items from H2 blocks in the body. Headings get a deterministic
 * slug id so the TOC can deep-link and scroll-spy can match them.
 */
export function deriveTocItems(body: PortableTextBlock[] | null): TocItem[] {
  if (!body) return [];
  const seen = new Set<string>();
  const items: TocItem[] = [];

  for (const block of body) {
    if (block._type !== "block") continue;
    const style = (block as unknown as { style?: string }).style;
    if (style !== "h2") continue;
    const text = extractText(block);
    if (!text) continue;
    let id = slugify(text);
    if (!id) continue;
    let suffix = 2;
    while (seen.has(id)) {
      id = `${slugify(text)}-${suffix}`;
      suffix += 1;
    }
    seen.add(id);
    items.push({ id, label: text });
  }

  return items;
}

/**
 * Sticky desktop-only TOC. Derives items from H2 blocks in the post body
 * and uses IntersectionObserver to highlight the in-view section.
 *
 * IDs must match the H2 ids rendered by the body's Portable Text serializer
 * — use the same `slugify` helper there, or read the heading text directly
 * via DOM and rewrite its id at mount time.
 */
export function BlogPostTableOfContents({ body }: BlogPostTableOfContentsProps) {
  const items = useMemo(() => deriveTocItems(body), [body]);
  const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null);

  // Patch existing rendered H2s in the DOM with the matching slugified id so
  // anchor scroll + IntersectionObserver can target them. The Portable Text
  // serializers do not emit ids themselves; we slug here to keep the renderer
  // pure HTML and avoid duplicating the slug logic in two places.
  useEffect(() => {
    if (items.length === 0) return;
    if (typeof document === "undefined") return;

    const article = document.querySelector("article[data-blog-post-body='true']");
    if (!article) return;
    const headings = Array.from(article.querySelectorAll<HTMLHeadingElement>("h2"));

    headings.forEach((heading, index) => {
      const item = items[index];
      if (!item) return;
      heading.id = item.id;
      heading.style.scrollMarginTop = `${STICKY_OFFSET_PX}px`;
    });
  }, [items]);

  useEffect(() => {
    if (items.length === 0) return;
    if (typeof window === "undefined") return;

    const elements: HTMLElement[] = [];
    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el) elements.push(el);
    }
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.target.id) {
            setActiveId(entry.target.id);
          }
        }
      },
      {
        rootMargin: `-${STICKY_OFFSET_PX}px 0px -60% 0px`,
        threshold: 0.1,
      },
    );

    for (const element of elements) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [items]);

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    if (typeof window === "undefined") return;
    const el = document.getElementById(id);
    if (!el) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
    window.history.pushState(null, "", `${window.location.pathname}#${id}`);
    setActiveId(id);
  };

  if (items.length === 0) return null;

  return (
    <nav aria-label="Table of contents" className="flex w-full flex-col gap-[10px]">
      {items.map((item) => {
        const isActive = activeId === item.id;
        return (
          <a
            className={cn(
              "motion-interactive motion-interactive-press min-h-[44px] rounded-[20px] px-[14px] py-[10px] text-[14px] font-normal leading-[20px] tracking-[-0.28px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-hr-accent)] focus-visible:ring-offset-2",
              isActive
                ? "bg-[var(--color-hr-dark)] text-[var(--color-hr-off-white)] dark:bg-[var(--color-text-inverse)] dark:text-[var(--color-text-fill-dark)]"
                : "bg-[var(--color-hr-off-white)] text-[var(--color-hr-grey)] hover:bg-[color-mix(in_srgb,var(--color-hr-off-white)_84%,var(--color-hr-light-grey)_16%)] dark:bg-[var(--color-surface-inverse-10)] dark:text-[var(--color-text-inverse-60)]",
            )}
            href={`#${item.id}`}
            key={item.id}
            onClick={(event) => handleClick(event, item.id)}
          >
            {item.label}
          </a>
        );
      })}
    </nav>
  );
}
