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

function normalizeBioParagraphs(member: SanityTeamMemberDetail): string[] {
  const fromArray = (member.bioParagraphs ?? [])
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0);
  if (fromArray.length > 0) {
    return fromArray;
  }
  const single = member.bio?.trim();
  return single ? [single] : [];
}

function normalizeRoleLabel(role: string): string {
  // Strip the decorative "/ Foo /" wrapper if present so JSON-LD jobTitle
  // and the on-page eyebrow stay consistent with the popup design.
  return role.replace(/^\/\s*|\s*\/$/g, "").trim();
}

interface TeamMemberDetailProps {
  member: SanityTeamMemberDetail;
}

export function TeamMemberDetail({ member }: TeamMemberDetailProps) {
  const bioParagraphs = normalizeBioParagraphs(member);
  const roleLabel = normalizeRoleLabel(member.role);
  const photoSrc = member.cardImageUrl || member.photoUrl;
  const photoAlt = member.cardImageAlt || member.photoAlt;

  const socials = orderSocials(
    (member.socialLinks ?? [])
      .filter((link) => link.url?.trim().length)
      .map((link) => ({
        label: SOCIAL_PLATFORM_LABELS[link.platform] ?? link.platform,
        url: link.url.trim(),
      })),
  );

  const linkedinUrl = socials.find(
    (social) => social.label === "LinkedIn",
  )?.url;
  const phone = member.contact?.phone?.trim() ?? "";
  const email = member.contact?.email?.trim() ?? "";

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

        <div className="grid gap-[40px] lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-[60px]">
          <div>
            <p className="text-[18px] font-normal leading-[24px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
              {roleLabel || member.role}
            </p>

            <h1 className="mt-5 text-[40px] leading-[1.15] tracking-[-0.8px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] lg:mt-[44px] lg:text-[62px] lg:leading-[80px] lg:tracking-[-1.24px]">
              <GradientText className="gradient-text-brand-about-us-popup-name">
                {member.name}
              </GradientText>
            </h1>

            <div
              aria-hidden
              className="mt-[30px] h-px w-full bg-[var(--color-hr-light-grey)] dark:bg-[var(--color-border-inverse-10)] lg:mt-[40px]"
            />

            {bioParagraphs.length > 0 ? (
              <div className="mt-[30px] grid gap-5 text-[18px] font-normal leading-[24px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] md:grid-cols-2 md:gap-x-[40px] lg:mt-[60px]">
                {bioParagraphs.map((paragraph, index) => (
                  <p key={`${member._id}-bio-${index}`}>{paragraph}</p>
                ))}
              </div>
            ) : null}

            {phone || email || socials.length > 0 ? (
              <div className="mt-[40px] grid gap-[20px] lg:mt-[60px]">
                <p className="text-[14px] font-medium uppercase tracking-[0.08em] text-[var(--color-hr-grey)] dark:text-[var(--color-text-inverse-50)]">
                  Contact
                </p>
                <div className="flex flex-wrap gap-[10px]">
                  {phone ? (
                    <ContactPill href={`tel:${phone}`}>{phone}</ContactPill>
                  ) : null}
                  {email ? (
                    <ContactPill href={`mailto:${email}`}>{email}</ContactPill>
                  ) : null}
                  {socials.map((social) => (
                    <ContactPill href={social.url} key={social.label} external>
                      {social.label}
                    </ContactPill>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <aside className="lg:pt-[60px]">
            <div className="relative mx-auto h-[480px] w-full max-w-[360px] overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-light-grey)] dark:border-[var(--color-border-inverse-10)] lg:h-[642px]">
              {photoSrc ? (
                <Image
                  alt={photoAlt}
                  className="h-full w-full object-cover"
                  fill
                  priority
                  sizes="(min-width: 1024px) 360px, 90vw"
                  src={photoSrc}
                />
              ) : null}
            </div>

            {linkedinUrl ? (
              <a
                aria-label={`Open ${member.name} on LinkedIn`}
                className={cn(
                  "motion-interactive motion-interactive-press group mt-[20px] inline-flex w-full items-center justify-between gap-[12px] rounded-[var(--radius-pill)] border border-[var(--color-hr-dark)] bg-[var(--color-hr-dark)] px-[20px] py-[14px] text-[16px] font-medium leading-[24px] text-[var(--color-hr-off-white)]",
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
          </aside>
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
