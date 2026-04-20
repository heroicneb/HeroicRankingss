import Image from "next/image";
import type { PortableTextComponents } from "@portabletext/react";
import { urlFor } from "@/sanity/lib/image";

export const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      return (
        <figure className="my-8">
          <Image
            alt={value.alt || "Blog illustration"}
            className="rounded-lg"
            height={600}
            sizes="(max-width: 768px) 100vw, 800px"
            src={urlFor(value).width(800).height(600).url()}
            width={800}
          />
          {value.caption && (
            <figcaption className="mt-2 text-center text-sm text-gray-500">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
  marks: {
    link: ({ children, value }) => {
      const href = value?.href;
      const isSafe = href && (href.startsWith("/") || href.startsWith("http://") || href.startsWith("https://") || href.startsWith("mailto:"));
      const target = value?.openInNewTab ? "_blank" : undefined;
      const rel = value?.openInNewTab ? "noopener noreferrer" : undefined;
      return (
        <a
          className="text-[var(--color-hr-accent)] underline hover:no-underline"
          href={isSafe ? href : "#"}
          rel={rel}
          target={target}
        >
          {children}
        </a>
      );
    },
  },
  block: {
    h2: ({ children }) => <h2 className="type-h2 mb-4 mt-12">{children}</h2>,
    h3: ({ children }) => <h3 className="type-h3 mb-3 mt-8">{children}</h3>,
    h4: ({ children }) => <h4 className="mb-2 mt-6 text-lg font-semibold">{children}</h4>,
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-4 border-[var(--color-hr-accent)] pl-4 italic text-gray-600 dark:text-gray-300">
        {children}
      </blockquote>
    ),
    normal: ({ children }) => <p className="type-paragraph mb-4">{children}</p>,
  },
};
