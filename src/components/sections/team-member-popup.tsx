"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import type { KeyboardEvent, MouseEvent } from "react";
import Image from "next/image";

import { GradientText } from "@/components/ui/gradient-text";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";
import type { TeamMemberPopupData } from "@/types";

interface TeamMemberPopupProps {
  member: TeamMemberPopupData;
  onClose: () => void;
  onPrevious: (() => void) | null;
  onNext: (() => void) | null;
}

const SOCIAL_ORDER = ["Instagram", "X", "LinkedIn"];

function ContactChip({
  children,
  href,
  className,
}: {
  children: React.ReactNode;
  href?: string;
  className: string;
}) {
  if (href) {
    return (
      <a className={className} href={href} rel="noopener noreferrer" target="_blank">
        {children}
      </a>
    );
  }

  return <span className={className}>{children}</span>;
}

export function TeamMemberPopup({ member, onClose, onPrevious, onNext }: TeamMemberPopupProps) {
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

  const mobileBioParagraphs = useMemo(() => [...member.bioParagraphs[0], ...member.bioParagraphs[1]], [member.bioParagraphs]);
  const mobileSocials = useMemo(
    () => [...member.socials].sort((a, b) => SOCIAL_ORDER.indexOf(a.label) - SOCIAL_ORDER.indexOf(b.label)),
    [member.socials],
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
        <div className="flex h-full w-full flex-col overflow-hidden rounded-[20px] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-off-white)] px-[15px] py-[20px] dark:border-[var(--color-border-inverse-10)] dark:bg-[var(--color-bg-dark)] lg:hidden">
          <div className="flex items-center justify-between">
            <button
              aria-label="Previous team member"
              className="motion-interactive motion-interactive-press inline-flex size-[44px] items-center justify-start text-[var(--color-hr-dark)] disabled:cursor-default disabled:text-[var(--color-hr-grey)] dark:text-[var(--color-text-inverse)] dark:disabled:text-[var(--color-text-inverse-50)]"
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
              className="motion-interactive motion-interactive-press inline-flex size-[44px] items-center justify-end text-[var(--color-hr-dark)] disabled:cursor-default disabled:text-[var(--color-hr-grey)] dark:text-[var(--color-text-inverse)] dark:disabled:text-[var(--color-text-inverse-50)]"
              disabled={!onNext}
              onClick={onNext ?? undefined}
              type="button"
            >
              <ChevronRightIcon className="h-[14px] w-[7px]" />
            </button>
          </div>

          <div className="mt-[40px] flex-1 overflow-y-auto">
            <div className="flex flex-col items-center">
              <Image
                alt={member.cardImageAlt}
                className="size-[126px] rounded-[30px] object-cover"
                height={126}
                sizes="126px"
                src={member.cardImageSrc}
                width={126}
              />

              <p className="mt-5 text-center text-[18px] font-normal tracking-[-0.36px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
                {member.role}
              </p>

              <h2 className="mt-[10px] text-center text-[28px] font-normal leading-[1.2] tracking-[-0.56px]">
                <GradientText className="gradient-text-brand-about-us-popup-name">{member.name}</GradientText>
              </h2>

              <div className="mt-[30px] w-[254px] text-center text-[16px] font-normal leading-[1.2] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
                {mobileBioParagraphs.map((paragraph, index) => (
                  <p className={index > 0 ? "mt-[10px]" : ""} key={`${member.name}-bio-${index + 1}`}>
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="mt-[30px] flex w-full flex-col items-center gap-[30px] pb-1">
                <div className="flex w-[240px] flex-col items-center gap-[10px]">
                  <ContactChip
                    className="inline-flex w-fit items-center justify-center rounded-[100px] bg-[var(--color-hr-dark)] px-[14px] py-[6px] text-[18px] font-normal leading-[27px] text-[var(--color-hr-off-white)] dark:bg-[var(--color-text-inverse)] dark:text-[var(--color-text-fill-dark)]"
                    href={member.contact.phone ? `tel:${member.contact.phone}` : undefined}
                  >
                    {member.contact.phone ?? "Contact via email"}
                  </ContactChip>

                  <ContactChip
                    className="inline-flex w-full items-center justify-center rounded-[100px] bg-[var(--color-hr-dark)] px-[14px] py-[6px] text-[18px] font-normal leading-[24px] text-[var(--color-hr-off-white)] dark:bg-[var(--color-text-inverse)] dark:text-[var(--color-text-fill-dark)]"
                    href={`mailto:${member.contact.email}`}
                  >
                    {member.contact.email}
                  </ContactChip>

                  <div className="flex items-center justify-center gap-[10px]">
                    {mobileSocials.map((social) => (
                      <ContactChip
                        className="inline-flex items-center justify-center rounded-[100px] bg-[var(--color-hr-dark)] px-[14px] py-[6px] text-[18px] font-normal leading-[27px] text-[var(--color-hr-off-white)] dark:bg-[var(--color-text-inverse)] dark:text-[var(--color-text-fill-dark)]"
                        href={social.url}
                        key={social.label}
                      >
                        {social.label}
                      </ContactChip>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        <div className="relative hidden h-full w-full overflow-y-auto rounded-[var(--radius-card)] bg-[var(--color-hr-off-white)] dark:bg-[var(--color-bg-dark)] lg:block">
          <button
            aria-label="Close popup"
            className="type-paragraph motion-interactive absolute right-6 top-6 z-10 text-[var(--color-hr-dark)] hover:opacity-70 dark:text-[var(--color-text-inverse)] min-[1440px]:right-[80px] min-[1440px]:top-[40px]"
            onClick={onClose}
            type="button"
          >
            Close
          </button>

          <div className="relative px-6 pb-10 pt-24 min-[1440px]:h-[900px] min-[1440px]:px-0 min-[1440px]:pb-0 min-[1440px]:pt-0">
            <div className="min-[1440px]:absolute min-[1440px]:left-[80px] min-[1440px]:top-[129px] min-[1440px]:w-[867px]">
              <p className="type-section-label text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
                {member.role}
              </p>

              <h2 className="mt-5 text-[52px] leading-[1.15] tracking-[var(--tracking-tight-token)] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] min-[1440px]:w-[480px] min-[1440px]:text-[62px] min-[1440px]:leading-[80px] min-[1440px]:tracking-[-1.24px]">
                <GradientText className="gradient-text-brand-about-us-popup-name">{member.name}</GradientText>
              </h2>

              <div className="mt-[30px] h-px w-full bg-[var(--color-hr-light-grey)] dark:bg-[var(--color-border-inverse-10)] min-[1440px]:mt-[40px]" />

              <div className="mt-10 grid gap-5 md:grid-cols-2 min-[1440px]:mt-[100px] min-[1440px]:grid-cols-2 min-[1440px]:gap-x-[40px]">
                <div className="type-paragraph text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
                  {member.bioParagraphs[0].map((paragraph, index) => (
                    <p className={index > 0 ? "mt-5" : ""} key={`desktop-left-${index + 1}`}>
                      {paragraph}
                    </p>
                  ))}
                </div>

                <div className="type-paragraph text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
                  {member.bioParagraphs[1].map((paragraph, index) => (
                    <p className={index > 0 ? "mt-5" : ""} key={`desktop-right-${index + 1}`}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative mx-auto mt-10 h-[642px] w-[305px] overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-hr-light-grey)] dark:border-[var(--color-border-inverse-10)] min-[1440px]:absolute min-[1440px]:left-[calc(75%-25px)] min-[1440px]:top-[129px] min-[1440px]:mt-0">
              <Image
                alt={member.cardImageAlt}
                className="h-full w-full object-cover"
                fill
                sizes="(min-width: 1024px) 305px, 70vw"
                src={member.cardImageSrc}
              />

              <div className="team-popup-card-glass absolute bottom-0 left-0 right-0 rounded-b-[var(--radius-card)] p-5 min-[1440px]:bottom-auto min-[1440px]:left-[7px] min-[1440px]:right-auto min-[1440px]:top-[295px] min-[1440px]:w-[291px] min-[1440px]:rounded-[var(--radius-card)]">
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-[10px]">
                    <ContactChip
                      className="inline-flex w-fit items-center rounded-[var(--radius-pill)] bg-[var(--color-hr-off-white)] px-[14px] py-[6px] leading-[27px] text-[var(--color-hr-dark)] dark:bg-[var(--color-bg-dark)] dark:text-[var(--color-text-inverse)]"
                      href={member.contact.phone ? `tel:${member.contact.phone}` : undefined}
                    >
                      {member.contact.phone ?? "Contact via email"}
                    </ContactChip>

                    <ContactChip
                      className="inline-flex w-full items-center justify-center rounded-[var(--radius-pill)] bg-[var(--color-hr-off-white)] px-[14px] py-[6px] text-[var(--color-hr-dark)] dark:bg-[var(--color-bg-dark)] dark:text-[var(--color-text-inverse)]"
                      href={`mailto:${member.contact.email}`}
                    >
                      {member.contact.email}
                    </ContactChip>

                    {member.socials.map((social) => (
                      <ContactChip
                        className="inline-flex w-fit items-center rounded-[var(--radius-pill)] bg-[var(--color-hr-off-white)] px-[14px] py-[6px] leading-[27px] text-[var(--color-hr-dark)] dark:bg-[var(--color-bg-dark)] dark:text-[var(--color-text-inverse)]"
                        href={social.url}
                        key={social.label}
                      >
                        {social.label}
                      </ContactChip>
                    ))}
                  </div>

                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between min-[1440px]:absolute min-[1440px]:left-[80px] min-[1440px]:right-[80px] min-[1440px]:top-[836px] min-[1440px]:mt-0">
              <button
                className={cn(
                  "type-paragraph inline-flex items-center gap-[10px] text-[var(--color-hr-grey)] dark:text-[var(--color-text-inverse-50)]",
                  onPrevious
                    ? "motion-interactive hover:text-[var(--color-hr-dark)] dark:hover:text-[var(--color-text-inverse)]"
                    : "cursor-default opacity-70",
                )}
                disabled={!onPrevious}
                onClick={onPrevious ?? undefined}
                type="button"
              >
                <ChevronLeftIcon className="h-[14px] w-[7px]" />
                Previous
              </button>

              <button
                className={cn(
                  "type-paragraph inline-flex items-center gap-[10px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]",
                  onNext ? "motion-interactive hover:opacity-70" : "cursor-default opacity-70",
                )}
                disabled={!onNext}
                onClick={onNext ?? undefined}
                type="button"
              >
                Next
                <ChevronRightIcon className="h-[14px] w-[7px]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
}
