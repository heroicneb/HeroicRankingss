"use client";

import { useEffect, useMemo, useState } from "react";
import type { PortableTextBlock } from "@portabletext/react";

import { cn } from "@/lib/cn";
import { buildHeadingIdMap, extractBlockText } from "@/lib/heading-slug";

interface BlogPostTableOfContentsProps {
  body: PortableTextBlock[] | null;
}

interface TocItem {
  id: string;
  label: string;
}

const STICKY_OFFSET_PX = 120;

/**
 * Derive TOC items from H2 blocks in the body. Heading anchor ids are emitted
 * by the PortableText H2 serializer using the same `buildHeadingIdMap` helper,
 * so TOC ids and rendered DOM ids stay in sync without DOM patching.
 */
export function deriveTocItems(body: PortableTextBlock[] | null): TocItem[] {
  if (!body) return [];
  const idMap = buildHeadingIdMap(body);
  const items: TocItem[] = [];

  for (const block of body) {
    if (block._type !== "block") continue;
    const style = (block as { style?: string }).style;
    if (style !== "h2") continue;
    const key = (block as { _key?: string })._key;
    if (!key) continue;
    const id = idMap.get(key);
    if (!id) continue;
    const label = extractBlockText(block);
    if (!label) continue;
    items.push({ id, label });
  }

  return items;
}

/**
 * Sticky desktop-only TOC. Derives items from H2 blocks in the post body
 * and uses IntersectionObserver to highlight the in-view section.
 */
export function BlogPostTableOfContents({
  body,
}: BlogPostTableOfContentsProps) {
  const items = useMemo(() => deriveTocItems(body), [body]);
  const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null);

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

  const handleClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    event.preventDefault();
    if (typeof window === "undefined") return;
    const el = document.getElementById(id);
    if (!el) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    el.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
    window.history.pushState(null, "", `${window.location.pathname}#${id}`);
    setActiveId(id);
  };

  if (items.length === 0) return null;

  return (
    <nav
      aria-label="Table of contents"
      className="flex w-full flex-col gap-[10px]"
    >
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
