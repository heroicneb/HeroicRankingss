import Image from "next/image";
import Link from "next/link";

import { GradientText } from "@/components/ui/gradient-text";
import { ArrowUpRightIcon } from "@/components/ui/icons";
import { SectionLabel } from "@/components/ui/section-label";
import { cn } from "@/lib/cn";
import type { SanityTeamMemberDetail } from "@/lib/sanity-data";

const SOCIAL_PLATFORM_LABELS: Record<string, string> = {
  linkedin: "LinkedIn",
  twitter: "X",
  instagram: "Instagram",
  github: "GitHub",
  youtube: "YouTube",
  website: "Website",
};

const SOCIAL_DISPLAY_ORDER = [
  "LinkedIn",
  "X",
  "Instagram",
  "Website",
  "YouTube",
  "GitHub",
];

interface SocialLinkDisplay {
  label: string;
  url: string;
}

function orderSocials(links: SocialLinkDisplay[]): SocialLinkDisplay[] {
  return [...links].sort(
    (a, b) =>
      SOCIAL_DISPLAY_ORDER.indexOf(a.label) -
      SOCIAL_DISPLAY_ORDER.indexOf(b.label),
  );
}

function normalizeRoleLabel(role: string): string {
  return role.replace(/^\/\s*|\s*\/$/g, "").trim();
}

function legacyBioParagraphs(member: SanityTeamMemberDetail): string[] {
  return (member.bioParagraphs ?? [])
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
}

interface TeamMemberDetailProps {
  member: SanityTeamMemberDetail;
}

export function TeamMemberDetail({ member }: TeamMemberDetailProps) {
  const roleLabel = normalizeRoleLabel(member.role);
  const cardPhoto = member.cardImageUrl || member.photoUrl;
  const cardPhotoAlt = member.cardImageAlt || member.photoAlt;

  const socials = orderSocials(
    (member.socialLinks ?? [])
      .filter((link) => link.url?.trim().length)
      .map((link) => ({
        label: SOCIAL_PLATFORM_LABELS[link.platform] ?? link.platform,
        url: link.url.trim(),
      })),
  );
  const linkedinUrl = socials.find((s) => s.label === "LinkedIn")?.url;
  const phone = member.contact?.phone?.trim() ?? "";
  const email = member.contact?.email?.trim() ?? "";

  const photos = member.lifestylePhotos ?? [];
  const isStickyEligible = photos.length >= 5;

  const bioBlock = (() => {
    const trimmedBio = member.bio?.trim();
    if (trimmedBio) return [trimmedBio];
    if (member.qaItems.length > 0) return [];
    return legacyBioParagraphs(member);
  })();

  return (
    <article
      className="pb-[100px] pt-[120px] lg:pb-[160px] lg:pt-[183px]"
      id="team-member-detail"
    >
      <div className="mx-auto w-full max-w-[1440px] px-[20px] lg:px-[80px]">
        <div className="mb-[20px] flex items-center justify-between gap-3 lg:mb-[40px]">
          <SectionLabel className="text-left">/ Our Team /</SectionLabel>
          <Link
            aria-label="Back to team"
            className="motion-interactive inline-flex items-center gap-[8px] text-[16px] font-normal leading-[24px] text-[var(--color-hr-grey)] hover:text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse-50)] dark:hover:text-[var(--color-text-inverse)]"
            href="/about-us#about-us-team"
          >
            Back to team
          </Link>
        </div>

        <div className="grid gap-[40px] lg:grid-cols-12 lg:gap-[40px]">
          <div
            className={cn(
              "lg:col-span-7",
              isStickyEligible
                ? "lg:sticky lg:top-[100px] lg:h-fit lg:self-start"
                : "lg:h-fit lg:self-start",
            )}
          >
            <div className="rounded-[var(--radius-card)] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-off-white)] p-[24px] dark:border-[var(--color-border-inverse-10)] dark:bg-[var(--color-bg-dark)] lg:p-[60px]">
              <div className="flex items-start gap-[20px]">
                {cardPhoto ? (
                  <div className="relative size-[80px] shrink-0 overflow-hidden rounded-[20px] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-light-grey)] dark:border-[var(--color-border-inverse-10)]">
                    <Image
                      alt={cardPhotoAlt}
                      className="h-full w-full object-cover"
                      fill
                      priority
                      sizes="80px"
                      src={cardPhoto}
                    />
                  </div>
                ) : null}
                <div className="flex min-w-0 flex-1 flex-col">
                  <p className="text-[16px] font-normal leading-[24px] text-[var(--color-hr-grey)] dark:text-[var(--color-text-inverse-50)]">
                    {roleLabel || member.role}
                  </p>
                  <h1 className="mt-[6px] text-[28px] leading-[1.15] tracking-[-0.56px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] lg:text-[40px] lg:leading-[1.15] lg:tracking-[-0.8px]">
                    <GradientText className="gradient-text-brand-about-us-popup-name">
                      {member.name}
                    </GradientText>
                  </h1>
                </div>
              </div>

              <div
                aria-hidden
                className="mt-[30px] h-px w-full bg-[var(--color-hr-light-grey)] dark:bg-[var(--color-border-inverse-10)] lg:mt-[40px]"
              />

              {bioBlock.length > 0 ? (
                <div className="mt-[30px] flex flex-col gap-5 text-[16px] font-normal leading-[24px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] lg:text-[18px]">
                  {bioBlock.map((paragraph, index) => (
                    <p
                      className="whitespace-pre-line"
                      key={`${member._id}-bio-${index}`}
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              ) : null}

              {member.qaItems.length > 0 ? (
                <dl className="mt-[30px] flex flex-col gap-[24px]">
                  {member.qaItems.map((item, index) => (
                    <div
                      className="flex flex-col gap-[8px]"
                      key={`${member._id}-qa-${index}`}
                    >
                      <dt className="text-[16px] font-medium leading-[22px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] lg:text-[18px]">
                        {item.question}
                      </dt>
                      <dd className="text-[16px] font-normal leading-[24px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] lg:text-[18px]">
                        {item.answer}
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : null}

              {member.personalTraits || member.spareTimeBullets.length > 0 ? (
                <div
                  aria-hidden
                  className="mt-[30px] h-px w-full bg-[var(--color-hr-light-grey)] dark:bg-[var(--color-border-inverse-10)] lg:mt-[40px]"
                />
              ) : null}

              {member.personalTraits ? (
                <div className="mt-[30px] flex flex-col gap-[8px]">
                  <h4 className="type-h4 text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
                    Personal traits
                  </h4>
                  <p className="text-[16px] font-normal leading-[24px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] lg:text-[18px]">
                    {member.personalTraits}
                  </p>
                </div>
              ) : null}

              {member.spareTimeBullets.length > 0 ? (
                <div className="mt-[24px] flex flex-col gap-[12px]">
                  <h4 className="type-h4 text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
                    Spare time
                  </h4>
                  <ul className="ml-[18px] list-disc text-[16px] font-normal leading-[24px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] lg:text-[18px]">
                    {member.spareTimeBullets.map((bullet, index) => (
                      <li key={`${member._id}-bullet-${index}`}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {phone || email || socials.length > 0 ? (
                <>
                  <div
                    aria-hidden
                    className="mt-[30px] h-px w-full bg-[var(--color-hr-light-grey)] dark:bg-[var(--color-border-inverse-10)] lg:mt-[40px]"
                  />
                  <div className="mt-[24px] flex flex-col gap-[16px]">
                    <p className="text-[14px] font-medium uppercase tracking-[0.08em] text-[var(--color-hr-grey)] dark:text-[var(--color-text-inverse-50)]">
                      Contact
                    </p>
                    <div className="flex flex-wrap gap-[10px]">
                      {phone ? (
                        <ContactPill href={`tel:${phone}`}>{phone}</ContactPill>
                      ) : null}
                      {email ? (
                        <ContactPill href={`mailto:${email}`}>
                          {email}
                        </ContactPill>
                      ) : null}
                      {socials
                        .filter((s) => s.label !== "LinkedIn")
                        .map((social) => (
                          <ContactPill
                            external
                            href={social.url}
                            key={social.label}
                          >
                            {social.label}
                          </ContactPill>
                        ))}
                    </div>
                  </div>
                </>
              ) : null}

              {linkedinUrl ? (
                <a
                  aria-label={`Open ${member.name} on LinkedIn`}
                  className={cn(
                    "motion-interactive motion-interactive-press group mt-[24px] inline-flex w-full items-center justify-between gap-[12px] rounded-[var(--radius-pill)] border border-[var(--color-hr-dark)] bg-[var(--color-hr-dark)] px-[20px] py-[14px] text-[16px] font-medium leading-[24px] text-[var(--color-hr-off-white)]",
                    "hover:bg-transparent hover:text-[var(--color-hr-dark)]",
                    "dark:border-[var(--color-text-inverse)] dark:bg-[var(--color-text-inverse)] dark:text-[var(--color-text-fill-dark)]",
                    "dark:hover:bg-transparent dark:hover:text-[var(--color-text-inverse)]",
                  )}
                  href={linkedinUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Connect on LinkedIn
                  <ArrowUpRightIcon className="size-5" />
                </a>
              ) : null}
            </div>
          </div>

          {photos.length > 0 ? (
            <aside className="lg:col-span-5">
              <ul className="flex flex-col gap-[24px] lg:gap-[40px]">
                {photos.map((photo, index) => {
                  const portrait = (photo.height ?? 1) > (photo.width ?? 1);
                  const offsetClass =
                    index % 2 === 0 ? "lg:ml-0" : "lg:ml-[60px]";
                  return (
                    <li
                      className={cn(
                        offsetClass,
                        "overflow-hidden rounded-[var(--radius-card)] shadow-[var(--shadow-card)]",
                      )}
                      key={`${member._id}-photo-${index}`}
                    >
                      <Image
                        alt={photo.alt}
                        className={cn(
                          "h-full w-full object-cover",
                          portrait ? "aspect-[3/4]" : "aspect-[4/3]",
                        )}
                        height={photo.height ?? 800}
                        loading={index === 0 ? undefined : "lazy"}
                        priority={index === 0}
                        sizes="(min-width: 1024px) 30vw, 100vw"
                        src={photo.url}
                        width={photo.width ?? 1067}
                      />
                    </li>
                  );
                })}
              </ul>
            </aside>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function ContactPill({
  href,
  external,
  children,
}: {
  href: string;
  external?: boolean;
  children: React.ReactNode;
}) {
  const pillClass =
    "inline-flex items-center justify-center rounded-[var(--radius-pill)] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-off-white)] px-[16px] py-[8px] text-[16px] font-normal leading-[24px] text-[var(--color-hr-dark)] transition-colors hover:bg-[var(--color-hr-light-grey)] dark:border-[var(--color-border-inverse-10)] dark:bg-[var(--color-bg-dark)] dark:text-[var(--color-text-inverse)] dark:hover:bg-[var(--color-surface-inverse-20)]";
  return (
    <a
      className={pillClass}
      href={href}
      rel={external ? "noopener noreferrer" : undefined}
      target={external ? "_blank" : undefined}
    >
      {children}
    </a>
  );
}
