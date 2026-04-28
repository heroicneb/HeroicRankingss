"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import type { KeyboardEvent, MouseEvent } from "react";
import Image from "next/image";

import { GradientText } from "@/components/ui/gradient-text";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";
import { generateVCard, generateVCardFilename } from "@/lib/vcard";
import type { TeamMemberPopupData, TeamMemberPopupSocial } from "@/types";

interface TeamMemberPopupProps {
  member: TeamMemberPopupData;
  onClose: () => void;
  onPrevious: (() => void) | null;
  onNext: (() => void) | null;
}

const SOCIAL_ORDER = ["Instagram", "X", "LinkedIn"];

function orderSocials(socials: TeamMemberPopupSocial[]): TeamMemberPopupSocial[] {
  return [...socials].sort(
    (a, b) => SOCIAL_ORDER.indexOf(a.label) - SOCIAL_ORDER.indexOf(b.label),
  );
}

function pickPrimaryUrl(member: TeamMemberPopupData): string | undefined {
  const linkedin = member.socials.find((social) => social.label === "LinkedIn");
  if (linkedin?.url) return linkedin.url;
  return member.socials.find((social) => Boolean(social.url))?.url;
}

function downloadVCard(member: TeamMemberPopupData) {
  if (typeof window === "undefined") return;

  const vcard = generateVCard({
    name: member.name,
    role: member.role.replace(/^\/\s*|\s*\/$/g, "").trim() || undefined,
    company: "Heroic Rankings",
    email: member.contact.email || undefined,
    phone: member.contact.phone || undefined,
    url: pickPrimaryUrl(member),
  });

  if (!vcard) return;

  const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = generateVCardFilename(member.name);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function ContactPill({
  href,
  className,
  children,
}: {
  href?: string;
  className: string;
  children: React.ReactNode;
}) {
  if (href) {
    return (
      <a
        className={className}
        href={href}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        target={href.startsWith("http") ? "_blank" : undefined}
      >
        {children}
      </a>
    );
  }
  return <span className={className}>{children}</span>;
}

function ContactPillStack({
  member,
  variant,
}: {
  member: TeamMemberPopupData;
  variant: "light" | "dark";
}) {
  const orderedSocials = useMemo(
    () => orderSocials(member.socials.filter((social) => Boolean(social.url))),
    [member.socials],
  );

  const lightPillBase =
    "inline-flex items-center justify-center rounded-[var(--radius-pill)] bg-[var(--color-hr-off-white)] px-[14px] py-[6px] text-[18px] font-normal leading-[27px] text-[var(--color-hr-dark)] dark:bg-[var(--color-bg-dark)] dark:text-[var(--color-text-inverse)]";
  const darkPillBase =
    "inline-flex items-center justify-center rounded-[var(--radius-pill)] bg-[var(--color-hr-dark)] px-[14px] py-[6px] text-[18px] font-normal leading-[27px] text-[var(--color-hr-off-white)] dark:bg-[var(--color-text-inverse)] dark:text-[var(--color-text-fill-dark)]";

  const pillBase = variant === "light" ? lightPillBase : darkPillBase;
  const phone = member.contact.phone?.trim() ?? "";
  const email = member.contact.email?.trim() ?? "";

  return (
    <div className="flex w-full flex-col items-center gap-[10px]">
      {phone ? (
        <ContactPill
          className={cn(pillBase, "w-fit")}
          href={`tel:${phone}`}
        >
          {phone}
        </ContactPill>
      ) : null}

      {email ? (
        <ContactPill
          className={cn(pillBase, "w-full")}
          href={`mailto:${email}`}
        >
          {email}
        </ContactPill>
      ) : null}

      {orderedSocials.length > 0 ? (
        <div className="flex w-full items-center justify-center gap-[10px]">
          {orderedSocials.map((social) => (
            <ContactPill
              className={cn(pillBase, "w-fit")}
              href={social.url}
              key={social.label}
            >
              {social.label}
            </ContactPill>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function SaveToContactsButton({
  member,
  variant,
}: {
  member: TeamMemberPopupData;
  variant: "light" | "dark";
}) {
  const disabled =
    !member.contact.email?.trim() &&
    !member.contact.phone?.trim() &&
    !member.name?.trim();

  const lightVariantClass =
    "border-[var(--color-hr-pure-white)] text-[var(--color-hr-pure-white)] hover:bg-[var(--color-glass-dark-15)]";
  const darkVariantClass =
    "border-[var(--color-hr-dark)] text-[var(--color-hr-dark)] hover:bg-[var(--color-hr-dark)] hover:text-[var(--color-hr-off-white)] dark:border-[var(--color-text-inverse)] dark:text-[var(--color-text-inverse)] dark:hover:bg-[var(--color-text-inverse)] dark:hover:text-[var(--color-text-fill-dark)]";

  return (
    <button
      className={cn(
        "motion-interactive inline-flex w-full items-center justify-center rounded-[16px] border px-[14px] py-[10px] text-[16px] font-medium leading-[24px] transition-colors",
        variant === "light" ? lightVariantClass : darkVariantClass,
        disabled ? "cursor-not-allowed opacity-50" : "",
      )}
      disabled={disabled}
      onClick={() => downloadVCard(member)}
      type="button"
    >
      Save to Contacts
    </button>
  );
}

export function TeamMemberPopup({
  member,
  onClose,
  onPrevious,
  onNext,
}: TeamMemberPopupProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    if (!dialog.open) {
      dialog.showModal();
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" && onPrevious) {
        onPrevious();
      }

      if (event.key === "ArrowRight" && onNext) {
        onNext();
      }
    },
    [onNext, onPrevious],
  );

  const handleBackdropClick = useCallback(
    (event: MouseEvent<HTMLDialogElement>) => {
      if (event.target === event.currentTarget) {
        onClose();
      }
    },
    [onClose],
  );

  return (
    <dialog
      ref={dialogRef}
      className="team-popup-dialog fixed inset-0 z-50 m-0 h-dvh w-dvw max-h-dvh max-w-none bg-transparent p-[5px] backdrop:bg-[var(--color-overlay-scrim)]"
      onCancel={onClose}
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
    >
      <div className="mx-auto h-full w-full max-w-[1440px]">
        <TeamMemberPopupMobile
          member={member}
          onClose={onClose}
          onNext={onNext}
          onPrevious={onPrevious}
        />
        <TeamMemberPopupDesktop
          member={member}
          onClose={onClose}
          onNext={onNext}
          onPrevious={onPrevious}
        />
      </div>
    </dialog>
  );
}

function TeamMemberPopupMobile({
  member,
  onClose,
  onPrevious,
  onNext,
}: TeamMemberPopupProps) {
  const flatBio = useMemo(
    () => [...member.bioParagraphs[0], ...member.bioParagraphs[1]],
    [member.bioParagraphs],
  );

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto rounded-[20px] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-off-white)] px-[15px] py-[20px] dark:border-[var(--color-border-inverse-10)] dark:bg-[var(--color-bg-dark)] lg:hidden">
      <div className="flex items-center justify-between">
        <button
          aria-label="Previous team member"
          className="motion-interactive motion-interactive-press inline-flex size-[44px] items-center justify-start text-[var(--color-hr-dark)] disabled:cursor-default disabled:opacity-30 dark:text-[var(--color-text-inverse)]"
          disabled={!onPrevious}
          onClick={onPrevious ?? undefined}
          type="button"
        >
          <ChevronLeftIcon className="h-[14px] w-[7px]" />
        </button>

        <button
          className="text-[18px] font-normal leading-[24px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]"
          onClick={onClose}
          type="button"
        >
          Close
        </button>

        <button
          aria-label="Next team member"
          className="motion-interactive motion-interactive-press inline-flex size-[44px] items-center justify-end text-[var(--color-hr-dark)] disabled:cursor-default disabled:opacity-30 dark:text-[var(--color-text-inverse)]"
          disabled={!onNext}
          onClick={onNext ?? undefined}
          type="button"
        >
          <ChevronRightIcon className="h-[14px] w-[7px]" />
        </button>
      </div>

      <div className="mt-[40px] flex flex-1 flex-col items-center">
        <div className="size-[126px] overflow-hidden rounded-[30px] bg-[#A9A9A9]">
          {member.cardImageSrc ? (
            <Image
              alt={member.cardImageAlt}
              className="size-full object-cover"
              height={126}
              sizes="126px"
              src={member.cardImageSrc}
              width={126}
            />
          ) : null}
        </div>

        <p className="mt-5 text-center text-[18px] font-normal tracking-[-0.36px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
          {member.role}
        </p>

        <h2 className="mt-[10px] text-center text-[28px] font-normal leading-[1.2] tracking-[-0.56px]">
          <GradientText className="gradient-text-brand-about-us-popup-name">
            {member.name}
          </GradientText>
        </h2>

        {flatBio.length > 0 ? (
          <div className="mt-[30px] w-[254px] text-center text-[16px] font-normal leading-[1.2] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
            {flatBio.map((paragraph, index) => (
              <p
                className={index > 0 ? "mt-[10px]" : ""}
                key={`${member.name}-mobile-bio-${index}`}
              >
                {paragraph}
              </p>
            ))}
          </div>
        ) : null}

        <div className="mt-[30px] flex w-full flex-col items-center gap-[20px] pb-1">
          <div className="w-[240px]">
            <ContactPillStack member={member} variant="dark" />
          </div>

          <div className="w-[251px]">
            <SaveToContactsButton member={member} variant="dark" />
          </div>
        </div>
      </div>
    </div>
  );
}

function TeamMemberPopupDesktop({
  member,
  onClose,
  onPrevious,
  onNext,
}: TeamMemberPopupProps) {
  const [bioCol1, bioCol2] = member.bioParagraphs;
  const hasAnyBio = bioCol1.length > 0 || bioCol2.length > 0;

  return (
    <div className="relative hidden h-full w-full overflow-y-auto rounded-[var(--radius-card)] bg-[var(--color-hr-off-white)] dark:bg-[var(--color-bg-dark)] lg:block">
      <button
        aria-label="Close popup"
        className="motion-interactive absolute right-6 top-6 z-10 text-[18px] font-normal leading-[24px] text-[var(--color-hr-dark)] hover:opacity-70 dark:text-[var(--color-text-inverse)] min-[1440px]:right-[80px] min-[1440px]:top-[40px]"
        onClick={onClose}
        type="button"
      >
        Close
      </button>

      <div className="relative px-6 pb-10 pt-24 min-[1440px]:h-[900px] min-[1440px]:px-0 min-[1440px]:pb-0 min-[1440px]:pt-0">
        <div className="min-[1440px]:absolute min-[1440px]:left-[80px] min-[1440px]:top-[129px] min-[1440px]:w-[867px]">
          <p className="text-[18px] font-normal leading-[24px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
            {member.role}
          </p>

          <h2 className="mt-5 text-[52px] leading-[1.15] tracking-[-1.04px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] min-[1440px]:mt-[44px] min-[1440px]:w-[480px] min-[1440px]:text-[62px] min-[1440px]:leading-[80px] min-[1440px]:tracking-[-1.24px]">
            <GradientText className="gradient-text-brand-about-us-popup-name">
              {member.name}
            </GradientText>
          </h2>

          <div className="mt-[30px] h-px w-full bg-[var(--color-hr-light-grey)] dark:bg-[var(--color-border-inverse-10)] min-[1440px]:mt-[40px]" />

          {hasAnyBio ? (
            <div className="mt-10 grid gap-5 md:grid-cols-2 min-[1440px]:mt-[100px] min-[1440px]:gap-x-[40px]">
              <div className="text-[18px] font-normal leading-[24px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] min-[1440px]:w-[413px]">
                {bioCol1.map((paragraph, index) => (
                  <p
                    className={index > 0 ? "mt-5" : ""}
                    key={`${member.name}-desktop-bio-l-${index}`}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
              <div className="text-[18px] font-normal leading-[24px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] min-[1440px]:w-[414px]">
                {bioCol2.map((paragraph, index) => (
                  <p
                    className={index > 0 ? "mt-5" : ""}
                    key={`${member.name}-desktop-bio-r-${index}`}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="relative mx-auto mt-10 h-[642px] w-[305px] overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-hr-light-grey)] bg-[#A9A9A9] dark:border-[var(--color-border-inverse-10)] min-[1440px]:absolute min-[1440px]:left-[calc(75%-25px)] min-[1440px]:top-[129px] min-[1440px]:mt-0">
          {member.cardImageSrc ? (
            <Image
              alt={member.cardImageAlt}
              className="h-full w-full object-cover"
              fill
              sizes="(min-width: 1024px) 305px, 70vw"
              src={member.cardImageSrc}
            />
          ) : null}

          <div className="team-popup-card-glass absolute bottom-5 left-1/2 w-[291px] -translate-x-1/2 rounded-[var(--radius-card)] p-5 min-[1440px]:bottom-auto min-[1440px]:left-1/2 min-[1440px]:top-[295px]">
            <div className="flex flex-col gap-5">
              <ContactPillStack member={member} variant="light" />
              <SaveToContactsButton member={member} variant="light" />
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between min-[1440px]:absolute min-[1440px]:left-[80px] min-[1440px]:right-[80px] min-[1440px]:top-[836px] min-[1440px]:mt-0">
          {onPrevious ? (
            <button
              className="motion-interactive inline-flex items-center gap-[10px] text-[18px] font-normal leading-[24px] text-[var(--color-hr-grey)] hover:text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse-50)] dark:hover:text-[var(--color-text-inverse)]"
              onClick={onPrevious}
              type="button"
            >
              <ChevronLeftIcon className="h-[14px] w-[7px]" />
              Previous
            </button>
          ) : (
            <span aria-hidden />
          )}

          {onNext ? (
            <button
              className="motion-interactive inline-flex items-center gap-[10px] text-[18px] font-normal leading-[24px] text-[var(--color-hr-dark)] hover:opacity-70 dark:text-[var(--color-text-inverse)]"
              onClick={onNext}
              type="button"
            >
              Next
              <ChevronRightIcon className="h-[14px] w-[7px]" />
            </button>
          ) : (
            <span aria-hidden />
          )}
        </div>
      </div>
    </div>
  );
}
