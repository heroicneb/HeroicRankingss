import Image from "next/image";

import type { SanityPostAuthor } from "@/lib/sanity-data";

interface BlogPostAuthorCardProps {
  author: SanityPostAuthor | null;
}

function LinkedInGlyph() {
  return (
    <svg
      aria-hidden="true"
      className="h-[24px] w-[24px]"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45C23.2 24 24 23.23 24 22.28V1.72C24 .77 23.2 0 22.22 0Z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * Author card for the blog detail page. Photo with absolute LinkedIn FAB
 * top-right (over the photo edge), then name (24/medium), role
 * (`/  Role  /` 18/24 grey), and bio paragraphs (18/24 grey).
 *
 * Desktop width: 305px (Figma 2339:106). Mobile width: 350px (Figma 2339:248).
 */
export function BlogPostAuthorCard({ author }: BlogPostAuthorCardProps) {
  if (!author) return null;

  const bioParagraphs = author.bioParagraphs?.length
    ? author.bioParagraphs
    : author.bio
      ? [author.bio]
      : [];

  const role = author.role?.trim() ?? "";
  const decoratedRole = role && !role.includes("/") ? `/  ${role}  /` : role;

  return (
    <article className="relative w-full overflow-hidden rounded-[40px] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-pure-white)] dark:border-[var(--color-border-inverse-15)] dark:bg-[var(--color-bg-dark)]">
      {/* Photo */}
      {author.photoUrl ? (
        <div className="relative aspect-square w-full overflow-hidden">
          <Image
            alt={author.photoAlt}
            blurDataURL={author.photoLqip}
            className="object-cover"
            fill
            placeholder={author.photoLqip ? "blur" : "empty"}
            sizes="(min-width: 1024px) 305px, 350px"
            src={author.photoUrl}
          />
        </div>
      ) : (
        <div
          aria-hidden
          className="aspect-square w-full bg-[var(--color-hr-off-white)] dark:bg-[var(--color-surface-inverse-10)]"
        />
      )}

      {/* LinkedIn FAB — overlaps top-right of photo */}
      {author.linkedin ? (
        <a
          aria-label={`${author.name ?? "Author"} on LinkedIn`}
          className="motion-interactive motion-interactive-press absolute right-[20px] top-[20px] inline-flex size-[72px] items-center justify-center rounded-full bg-[var(--color-hr-pure-white)] text-[var(--color-hr-dark)] shadow-[0_4px_12px_rgba(0,0,0,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-hr-accent)] focus-visible:ring-offset-2 dark:bg-[var(--color-text-inverse)] dark:text-[var(--color-text-fill-dark)]"
          href={author.linkedin}
          rel="noopener noreferrer"
          target="_blank"
        >
          <LinkedInGlyph />
        </a>
      ) : null}

      {/* Text block */}
      <div className="px-[24px] py-[24px] lg:px-[20px]">
        {author.name ? (
          <p className="text-[24px] font-medium leading-[28px] tracking-[-0.48px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
            {author.name}
          </p>
        ) : null}
        {decoratedRole ? (
          <p className="mt-[6px] text-[18px] font-normal leading-[24px] text-[var(--color-hr-grey)] dark:text-[var(--color-text-inverse-60)]">
            {decoratedRole}
          </p>
        ) : null}
        {bioParagraphs.length > 0 ? (
          <div className="mt-[16px] space-y-[12px] text-[18px] font-normal leading-[24px] text-[var(--color-hr-grey)] dark:text-[var(--color-text-inverse-60)]">
            {bioParagraphs.map((paragraph, index) => (
              <p key={`bio-${index + 1}`}>{paragraph}</p>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}
