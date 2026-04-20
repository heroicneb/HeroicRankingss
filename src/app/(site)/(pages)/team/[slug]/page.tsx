import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { AppLink } from "@/components/ui/app-link";
import { createPageMetadata } from "@/lib/metadata";
import { getTeamMemberBySlug, getTeamMemberSlugs } from "@/lib/sanity-data";

interface TeamMemberPageProps {
  params: Promise<{
    slug: string;
  }>;
}

function formatPlatformLabel(platform: string): string {
  const normalized = platform.trim().toLowerCase();
  if (normalized === "twitter" || normalized === "x") return "X";
  if (normalized === "linkedin") return "LinkedIn";
  if (normalized === "instagram") return "Instagram";
  return platform;
}

export async function generateStaticParams() {
  const slugs = await getTeamMemberSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: TeamMemberPageProps): Promise<Metadata> {
  const { slug } = await params;
  const member = await getTeamMemberBySlug(slug);

  if (!member) {
    notFound();
  }

  return createPageMetadata({
    title: `${member.name} | Team`,
    description:
      member.bio?.trim() ||
      `${member.name} — ${member.role} at Heroic Rankings.`,
    path: `/team/${slug}`,
  });
}

export default async function TeamMemberPage({ params }: TeamMemberPageProps) {
  const { slug } = await params;
  const member = await getTeamMemberBySlug(slug);

  if (!member) {
    notFound();
  }

  const imageSrc = member.cardImageUrl || member.photoUrl;
  const imageLqip = member.cardImageLqip || member.photoLqip;
  const bioParagraphs =
    member.bioParagraphs?.filter((paragraph) => paragraph.trim().length > 0) ??
    [];
  const hasBioParagraphs = bioParagraphs.length > 0;

  return (
    <section className="pb-[120px] pt-[100px] lg:pt-[109px]" id="team-member-profile">
      <div className="mx-auto w-full max-w-[1200px] px-5 md:px-10 xl:px-[80px]">
        <AppLink
          className="inline-flex min-h-[44px] items-center text-[16px] font-medium text-[var(--color-hr-grey)] underline underline-offset-4 hover:text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse-60)] dark:hover:text-[var(--color-text-inverse)]"
          href="/about-us"
        >
          Back to Team
        </AppLink>

        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[420px_1fr] lg:gap-14">
          <div>
            {imageSrc ? (
              <div className="overflow-hidden rounded-[30px] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-pure-white)] dark:border-[var(--color-border-inverse-10)] dark:bg-[var(--color-bg-dark)] lg:rounded-[40px]">
                <Image
                  alt={member.cardImageAlt || member.photoAlt || member.name}
                  blurDataURL={imageLqip}
                  className="h-auto w-full object-cover"
                  fetchPriority="high"
                  height={560}
                  placeholder={imageLqip ? "blur" : "empty"}
                  priority
                  sizes="(min-width: 1024px) 420px, 100vw"
                  src={imageSrc}
                  width={420}
                />
              </div>
            ) : null}
          </div>

          <div>
            <h1 className="text-[42px] font-normal leading-[52px] tracking-[-0.84px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] sm:text-[52px] sm:leading-[66px] xl:text-[62px] xl:leading-[80px]">
              {member.name}
            </h1>
            <p className="mt-3 text-[24px] font-normal leading-[30px] tracking-[-0.48px] text-[var(--color-hr-grey)] dark:text-[var(--color-text-inverse-60)]">
              {member.role}
            </p>

            {hasBioParagraphs ? (
              <div className="mt-8 space-y-5 text-[18px] leading-[24px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
                {bioParagraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            ) : member.bio ? (
              <p className="mt-8 text-[18px] leading-[24px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
                {member.bio}
              </p>
            ) : null}

            <div className="mt-10 flex flex-wrap gap-3">
              {member.contact?.phone ? (
                <a
                  className="inline-flex min-h-[44px] items-center rounded-full bg-[var(--color-hr-off-white)] px-4 py-2 text-[16px] text-[var(--color-hr-dark)] dark:bg-[var(--color-surface-inverse-10)] dark:text-[var(--color-text-inverse)]"
                  href={`tel:${member.contact.phone.replace(/\s/g, "")}`}
                >
                  {member.contact.phone}
                </a>
              ) : null}
              {member.contact?.email ? (
                <a
                  className="inline-flex min-h-[44px] items-center rounded-full bg-[var(--color-hr-off-white)] px-4 py-2 text-[16px] text-[var(--color-hr-dark)] dark:bg-[var(--color-surface-inverse-10)] dark:text-[var(--color-text-inverse)]"
                  href={`mailto:${member.contact.email}`}
                >
                  {member.contact.email}
                </a>
              ) : null}
              {member.socialLinks
                .filter((social) => social.url?.trim())
                .map((social) => (
                  <a
                    className="inline-flex min-h-[44px] items-center rounded-full bg-[var(--color-hr-off-white)] px-4 py-2 text-[16px] text-[var(--color-hr-dark)] hover:opacity-90 dark:bg-[var(--color-surface-inverse-10)] dark:text-[var(--color-text-inverse)]"
                    href={social.url}
                    key={`${social.platform}-${social.url}`}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {formatPlatformLabel(social.platform)}
                  </a>
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
