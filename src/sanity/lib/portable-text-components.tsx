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
