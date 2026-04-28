import Image from "next/image";
import type { PortableTextComponents } from "@portabletext/react";

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

/**
 * Custom Portable Text serializers for the blog post detail page.
 *
 * Mobile body text is centered (per Figma 2339:195); desktop is left-aligned.
 * Headings, blockquotes, and paragraphs use the project's typography utility
 * classes so they render against tokenized type and color values only.
 */
export const portableTextComponents: PortableTextComponents = {
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
      const isExternal = href.startsWith("http://") || href.startsWith("https://");
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
    h2: ({ children }) => (
      <h2 className="mt-[60px] mb-[20px] text-[28px] font-normal leading-[34px] tracking-[-0.56px] text-[var(--color-hr-dark)] lg:text-[40px] lg:leading-[48px] lg:tracking-[-0.8px] dark:text-[var(--color-text-inverse)]">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-[40px] mb-[16px] text-[22px] font-normal leading-[28px] tracking-[-0.44px] text-[var(--color-hr-dark)] lg:text-[28px] lg:leading-[34px] lg:tracking-[-0.56px] dark:text-[var(--color-text-inverse)]">
        {children}
      </h3>
    ),
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
