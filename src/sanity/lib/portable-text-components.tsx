import Image from "next/image";
import type {
  PortableTextBlock,
  PortableTextComponents,
} from "@portabletext/react";

import { urlFor } from "@/sanity/lib/image";

interface SanityImageBlockValue {
  _type: "image";
  alt?: string;
  caption?: string;
  asset?: {
    _ref?: string;
    metadata?: { lqip?: string };
  };
}

interface PortableTextLinkValue {
  href?: string;
  openInNewTab?: boolean;
}

interface TableBlockValue {
  _type: "table";
  header?: string[];
  rows?: Array<{ _key?: string; cols?: string[] }>;
}

interface CtaBlockValue {
  _type: "ctaBlock";
  description?: string;
  label?: string;
  href?: string;
}

interface VideoEmbedValue {
  _type: "videoEmbed";
  url?: string;
  caption?: string;
}

const CELL_CLASSNAME =
  "border-b border-[var(--color-hr-light-grey)] px-[16px] py-[12px] align-top text-[16px] leading-[22px] text-[var(--color-hr-dark)] dark:border-[var(--color-border-inverse-10)] dark:text-[var(--color-text-inverse)]";

const SAFE_HREF = /^(\/|https?:\/\/|mailto:|tel:)/;

/** Only embed players we explicitly allow in the CSP frame-src (see src/lib/csp.ts). */
function toEmbedUrl(raw: string | undefined): string | null {
  if (!raw) return null;
  try {
    const url = new URL(raw);
    const host = url.hostname.replace(/^www\./, "");
    if (host === "youtube.com" || host === "youtube-nocookie.com") {
      if (url.pathname.startsWith("/embed/")) return url.toString();
      const id = url.searchParams.get("v");
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }
    if (host === "youtu.be") {
      const id = url.pathname.slice(1);
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }
    if (host === "player.vimeo.com") return url.toString();
    if (host === "vimeo.com") {
      const id = url.pathname.split("/").filter(Boolean)[0];
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }
  } catch {
    return null;
  }
  return null;
}

const HEADING_SCROLL_MARGIN_PX = 120;

const H2_CLASSNAME =
  "mt-[60px] mb-[20px] text-[28px] font-normal leading-[34px] tracking-[-0.56px] text-[var(--color-hr-dark)] lg:text-[40px] lg:leading-[48px] lg:tracking-[-0.8px] dark:text-[var(--color-text-inverse)]";

const H3_CLASSNAME =
  "mt-[40px] mb-[16px] text-[22px] font-normal leading-[28px] tracking-[-0.44px] text-[var(--color-hr-dark)] lg:text-[28px] lg:leading-[34px] lg:tracking-[-0.56px] dark:text-[var(--color-text-inverse)]";

function renderHeading(
  level: 2 | 3,
  className: string,
  headingIds: Map<string, string>,
  value: PortableTextBlock,
  children: React.ReactNode,
) {
  const key = (value as { _key?: string })._key;
  const id = key ? headingIds.get(key) : undefined;
  const style = id
    ? { scrollMarginTop: `${HEADING_SCROLL_MARGIN_PX}px` }
    : undefined;
  if (level === 2) {
    return (
      <h2 className={className} id={id} style={style}>
        {children}
      </h2>
    );
  }
  return (
    <h3 className={className} id={id} style={style}>
      {children}
    </h3>
  );
}

/**
 * Factory: build PortableText serializers with optional heading id map.
 * Pass a `headingIds` map (block _key -> slug id) to emit anchor ids on H2/H3
 * server-side; deep links + scroll-spy then work without DOM patching.
 * Pass nothing for blocks where anchor links don't apply (case study conclusion etc).
 */
export function makePortableTextComponents(
  headingIds?: Map<string, string>,
): PortableTextComponents {
  const ids = headingIds ?? new Map<string, string>();

  return {
    types: {
      image: ({ value }) => {
        const v = value as SanityImageBlockValue | null;
        if (!v?.asset) return null;
        const lqip = v.asset.metadata?.lqip;
        const src = urlFor(v).width(1200).quality(85).url();
        return (
          <figure className="my-[40px]">
            <Image
              alt={v.alt ?? ""}
              blurDataURL={lqip}
              className="h-auto w-full rounded-[20px] lg:rounded-[30px]"
              height={800}
              placeholder={lqip ? "blur" : "empty"}
              sizes="(min-width: 1024px) 933px, 100vw"
              src={src}
              width={1200}
            />
            {v.caption ? (
              <figcaption className="mt-[10px] text-center text-[14px] leading-[20px] text-[var(--color-hr-grey)] dark:text-[var(--color-text-inverse-60)]">
                {v.caption}
              </figcaption>
            ) : null}
          </figure>
        );
      },
      table: ({ value }) => {
        const v = value as TableBlockValue | null;
        const rows = v?.rows ?? [];
        const header = v?.header ?? [];
        if (!rows.length && !header.length) return null;
        return (
          <div className="my-[40px] overflow-x-auto rounded-[20px] border border-[var(--color-hr-light-grey)] dark:border-[var(--color-border-inverse-10)]">
            <table className="w-full min-w-[560px] border-collapse text-left">
              {header.length ? (
                <thead className="bg-[var(--color-hr-off-white)] dark:bg-[var(--color-surface-inverse-10)]">
                  <tr>
                    {header.map((cell, index) => (
                      <th className={`${CELL_CLASSNAME} font-medium`} key={index} scope="col">
                        {cell}
                      </th>
                    ))}
                  </tr>
                </thead>
              ) : null}
              <tbody>
                {rows.map((row, rowIndex) => (
                  <tr key={row._key ?? rowIndex}>
                    {(row.cols ?? []).map((cell, cellIndex) => (
                      <td className={CELL_CLASSNAME} key={cellIndex}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      },
      ctaBlock: ({ value }) => {
        const v = value as CtaBlockValue | null;
        if (!v?.label) return null;
        const href = v.href && SAFE_HREF.test(v.href) ? v.href : "/contact";
        const isExternal = href.startsWith("http");
        return (
          <aside className="my-[40px] flex flex-col items-start gap-[20px] rounded-[30px] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-off-white)] p-[30px] dark:border-[var(--color-border-inverse-10)] dark:bg-[var(--color-surface-inverse-10)] lg:flex-row lg:items-center lg:justify-between">
            {v.description ? (
              <p className="text-[18px] leading-[24px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
                {v.description}
              </p>
            ) : null}
            <a
              className="type-cta inline-flex h-[45px] shrink-0 items-center justify-center rounded-[var(--radius-button)] border border-[var(--color-hr-accent)] px-5 text-[var(--color-hr-dark)] hover:bg-[var(--color-hr-pure-white)] dark:text-[var(--color-text-inverse)] dark:hover:bg-[var(--color-surface-inverse-10)]"
              href={href}
              rel={isExternal ? "noopener noreferrer" : undefined}
              target={isExternal ? "_blank" : undefined}
            >
              {v.label}
            </a>
          </aside>
        );
      },
      videoEmbed: ({ value }) => {
        const v = value as VideoEmbedValue | null;
        const src = toEmbedUrl(v?.url);
        if (!src) return null;
        return (
          <figure className="my-[40px]">
            <div className="relative aspect-video overflow-hidden rounded-[20px] lg:rounded-[30px]">
              <iframe
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                src={src}
                title={v?.caption ?? "Embedded video"}
              />
            </div>
            {v?.caption ? (
              <figcaption className="mt-[10px] text-center text-[14px] leading-[20px] text-[var(--color-hr-grey)] dark:text-[var(--color-text-inverse-60)]">
                {v.caption}
              </figcaption>
            ) : null}
          </figure>
        );
      },
    },
    marks: {
      link: ({ value, children }) => {
        const v = value as PortableTextLinkValue | undefined;
        const href = v?.href ?? "#";
        const isExternal =
          href.startsWith("http://") || href.startsWith("https://");
        const openInNewTab = v?.openInNewTab ?? isExternal;
        return (
          <a
            className="underline decoration-from-font underline-offset-[3px] text-[var(--color-hr-dark)] hover:text-[var(--color-hr-accent)] dark:text-[var(--color-text-inverse)] dark:hover:text-[var(--color-hr-accent)]"
            href={href}
            rel={openInNewTab ? "noopener noreferrer" : undefined}
            target={openInNewTab ? "_blank" : undefined}
          >
            {children}
          </a>
        );
      },
    },
    block: {
      h2: ({ children, value }) =>
        renderHeading(2, H2_CLASSNAME, ids, value, children),
      h3: ({ children, value }) =>
        renderHeading(3, H3_CLASSNAME, ids, value, children),
      blockquote: ({ children }) => (
        <blockquote className="my-[30px] border-l-[4px] border-[var(--color-hr-accent)] pl-[20px] text-[16px] italic leading-[22px] text-[var(--color-hr-grey)] lg:text-[18px] lg:leading-[24px] dark:text-[var(--color-text-inverse-60)]">
          {children}
        </blockquote>
      ),
      normal: ({ children }) => (
        <p className="mb-[20px] text-[16px] font-normal leading-[21px] text-[var(--color-hr-dark)] lg:text-[18px] lg:leading-[24px] dark:text-[var(--color-text-inverse)]">
          {children}
        </p>
      ),
    },
    list: {
      bullet: ({ children }) => (
        <ul className="mb-[20px] list-disc pl-[24px] text-[16px] leading-[21px] text-[var(--color-hr-dark)] marker:text-[var(--color-hr-accent)] lg:text-[18px] lg:leading-[24px] dark:text-[var(--color-text-inverse)]">
          {children}
        </ul>
      ),
      number: ({ children }) => (
        <ol className="mb-[20px] list-decimal pl-[24px] text-[16px] leading-[21px] text-[var(--color-hr-dark)] marker:text-[var(--color-hr-accent)] lg:text-[18px] lg:leading-[24px] dark:text-[var(--color-text-inverse)]">
          {children}
        </ol>
      ),
    },
    listItem: {
      bullet: ({ children }) => <li className="mb-[8px]">{children}</li>,
      number: ({ children }) => <li className="mb-[8px]">{children}</li>,
    },
  };
}

/**
 * Default serializers without heading id support — used by non-blog contexts
 * (e.g. case study conclusion) where deep linking doesn't apply.
 */
export const portableTextComponents: PortableTextComponents =
  makePortableTextComponents();
