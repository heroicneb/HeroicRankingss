import { PortableText, type PortableTextBlock, type PortableTextComponents } from "@portabletext/react";

import type { RichBlock } from "@/components/pages/partnership/partnership-content";
import { cn } from "@/lib/cn";

interface RichParagraphsProps {
  blocks: RichBlock[];
  /** Applied to every paragraph. */
  paragraphClassName?: string;
}

/** Renders `simpleText` blocks (paragraphs with bold / italic / links). */
export function RichParagraphs({ blocks, paragraphClassName }: RichParagraphsProps) {
  const components: PortableTextComponents = {
    block: {
      normal: ({ children }) => <p className={cn("type-paragraph", paragraphClassName)}>{children}</p>,
    },
    marks: {
      strong: ({ children }) => <strong className="font-bold">{children}</strong>,
      em: ({ children }) => <em>{children}</em>,
      link: ({ children, value }) => {
        const href: string | undefined = value?.href;
        const safe = href && /^(\/|https?:\/\/|mailto:|tel:)/.test(href) ? href : "#";
        return (
          <a className="underline hover:no-underline" href={safe}>
            {children}
          </a>
        );
      },
    },
  };

  return <PortableText components={components} value={blocks as unknown as PortableTextBlock[]} />;
}
