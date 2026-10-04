"use client";

import { useEffect, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";

import Image from "next/image";

import { AppLink } from "@/components/ui/app-link";
import { Container } from "@/components/ui/container";
import { GradientArrowUpRightIcon } from "@/components/ui/icons/decorative";
import { SectionLabel } from "@/components/ui/section-label";
import { GradientHeading } from "@/components/ui/gradient-heading";
import { DEFAULT_HOME_CONTENT, type HomeContent } from "@/components/pages/home/home-content";
import { cn } from "@/lib/cn";
import type { SanityTestimonial } from "@/lib/sanity-data";
import type { Testimonial } from "@/types";

import { DEFAULT_TESTIMONIALS, TESTIMONIAL_ASSETS as ASSETS } from "./testimonials-data";

/** Seconds each card takes to cross; the loop time scales with the number of cards. */
const SECONDS_PER_CARD = 6;

/*
 * "/ Dedication / What Our Clients Say": one continuous row of cards that
 * glides left. Hover, keyboard focus or a held touch pauses it; reduced
 * motion turns it into a plain horizontal scroller. Cards come from the
 * Sanity "Testimonials" documents (seeded by scripts/seed/testimonials.ts);
 * the list below is the built-in fallback.
 */

function withWrappedQuotes(text: string) {
  const trimmed = text
    .trim()
    .replace(/^["“]+/, "")
    .replace(/["”]+$/, "");
  return `"${trimmed}"`;
}

function cmsToEntry(t: SanityTestimonial, fallback: Testimonial | undefined): Testimonial {
  return {
    quote: t.quote,
    name: t.authorName,
    role: t.authorTitle || t.company || "",
    avatarSrc: t.avatarUrl || fallback?.avatarSrc || `${ASSETS}/avatar-1.png`,
    avatarAlt: t.avatarAlt,
    logoSrc: t.companyLogoUrl || fallback?.logoSrc || `${ASSETS}/logo-designrush.png`,
    logoAlt: t.companyLogoAlt || t.company || "",
    // WHY: CMS logos are sized by the pill; the fallback widths only matter for the built-in files.
    logoWidth: fallback?.logoWidth ?? 120,
    logoHeight: fallback?.logoHeight ?? 36,
    rating: t.rating,
    sourceUrl: t.sourceUrl,
  };
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden className={className} fill="currentColor" viewBox="0 0 16 16">
      <path d="M8 1.5l1.9 4.1 4.5.5-3.3 3.1.9 4.4L8 11.4l-3.9 2.2.9-4.4L1.6 6.1l4.5-.5L8 1.5z" />
    </svg>
  );
}

/** "5.0 on Clutch" pill linking to the original review. */
function RatingBadge({ rating, href, tabIndex }: { rating: number; href: string; tabIndex?: number }) {
  return (
    <a
      // WHY: the accessible name must contain the visible "5.0 on Clutch" text.
      aria-label={`${rating.toFixed(1)} on Clutch. Read the review on Clutch`}
      className="motion-interactive inline-flex shrink-0 items-center gap-[6px] whitespace-nowrap rounded-full border border-[var(--color-hr-accent)] px-[12px] py-[6px] text-[13px] leading-[16px] text-[var(--color-hr-dark)] hover:bg-[var(--color-hr-off-white)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-hr-accent)] dark:text-[var(--color-text-inverse)] dark:hover:bg-[var(--color-surface-inverse-10)]"
      href={href}
      rel="noopener noreferrer"
      tabIndex={tabIndex}
      target="_blank"
    >
      <StarIcon className="size-[12px] text-[var(--color-hr-accent)]" />
      <span>
        <span className="font-bold">{rating.toFixed(1)}</span> on Clutch
      </span>
    </a>
  );
}

function TestimonialCard({ testimonial, hidden = false }: { testimonial: Testimonial; hidden?: boolean }) {
  return (
    <article
      aria-hidden={hidden || undefined}
      className={cn(
        "mr-[10px] flex w-[350px] shrink-0 flex-col justify-between rounded-[30px] bg-[var(--color-hr-off-white)] p-5 lg:mr-5",
        "text-[var(--color-hr-dark)] dark:border dark:border-[var(--color-border-inverse-10)] dark:bg-[var(--color-bg-dark)] dark:text-[var(--color-text-inverse)]",
        "min-h-[560px] lg:min-h-[574px] lg:w-[413px] lg:rounded-[var(--radius-card)]",
      )}
      tabIndex={hidden ? -1 : 0}
    >
      <div className="flex flex-col gap-[43px] lg:gap-[58px]">
        <div className="flex items-center justify-between">
          <Image
            alt={testimonial.avatarAlt}
            className="size-[77px] rounded-full object-cover"
            height={77}
            loading="lazy"
            sizes="77px"
            src={testimonial.avatarSrc}
            width={77}
          />
          <div className="flex h-[77px] w-[160px] items-center justify-center overflow-hidden rounded-[66px] border border-[var(--color-hr-dark)] bg-[var(--color-hr-off-white)] px-[18px] dark:border-[var(--color-border-inverse-20)] dark:bg-[var(--color-surface-inverse-95)]">
            <Image
              alt={testimonial.logoAlt}
              className="h-auto max-h-[44px] w-auto max-w-[124px] object-contain"
              height={testimonial.logoHeight}
              loading="lazy"
              sizes="124px"
              src={testimonial.logoSrc}
              width={testimonial.logoWidth}
            />
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <Image alt="" aria-hidden height={15} src={`${ASSETS}/quote-mark.svg`} width={22} />
          <p className="type-h4 w-full max-w-[373px] leading-[1.2] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
            {withWrappedQuotes(testimonial.quote)}
          </p>
        </div>
      </div>

      <div className="flex items-end justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-[10px]">
          {hidden ? (
            <p className="type-h4 text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">{testimonial.name}</p>
          ) : (
            <h3 className="type-h4 text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">{testimonial.name}</h3>
          )}
          <p className="type-paragraph text-[var(--color-hr-grey)] dark:text-[var(--color-text-inverse-50)]">/ {testimonial.role} /</p>
        </div>
        {testimonial.sourceUrl && testimonial.rating ? <RatingBadge href={testimonial.sourceUrl} rating={testimonial.rating} tabIndex={hidden ? -1 : undefined} /> : null}
      </div>
    </article>
  );
}

interface TestimonialsProps {
  cmsTestimonials?: SanityTestimonial[];
  /** Hide the "Become a Satisfied Client" button (the About page has its own CTA block). */
  showCta?: boolean;
  content?: HomeContent["testimonials"];
}

export function Testimonials({ cmsTestimonials, showCta = true, content = DEFAULT_HOME_CONTENT.testimonials }: TestimonialsProps = {}) {
  const testimonials: Testimonial[] = cmsTestimonials?.length
    ? [...cmsTestimonials]
        .sort((a, b) => (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER))
        .map((t) => cmsToEntry(t, DEFAULT_TESTIMONIALS.find((d) => d.name === t.authorName)))
    : DEFAULT_TESTIMONIALS;

  const [held, setHeld] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  // WHY: on phones a held finger pauses the row; lifting it (or scrolling the page, which cancels the pointer) resumes.
  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch" || event.pointerType === "pen") setHeld(true);
  };
  const release = () => setHeld(false);

  return (
    <section className="pb-[60px] pt-[60px] lg:pb-[120px] lg:pt-[120px]" id="testimonials">
      <Container>
        <div className="grid gap-[30px] xl:grid-cols-[393px_1fr] xl:items-end" data-reveal>
          <div className="mx-auto w-full max-w-[350px] text-center xl:mx-0 xl:max-w-[393px] xl:text-left">
            <SectionLabel>{content.label}</SectionLabel>
            <h2 className="type-h2 mt-5 text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
              <GradientHeading highlightClassName="gradient-text-brand-testimonials" segments={content.heading} />
            </h2>
          </div>

          {showCta ? (
            <div className="flex justify-center xl:justify-end">
              <AppLink
                className="type-cta motion-interactive motion-interactive-press inline-flex h-[45px] w-full max-w-[350px] items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[var(--color-hr-accent)] bg-transparent text-[var(--color-hr-dark)] hover:bg-[var(--color-hr-off-white)] dark:text-[var(--color-text-inverse)] dark:hover:bg-[var(--color-surface-inverse-10)] xl:max-w-[253px]"
                href={content.ctaUrl}
                motionPreset="none"
              >
                {content.ctaLabel}
                <GradientArrowUpRightIcon className="size-[10px]" />
              </AppLink>
            </div>
          ) : null}
        </div>
      </Container>

      <div
        aria-label="Client reviews"
        className={cn("testimonial-marquee mt-[40px] w-full lg:mt-[69px]", reducedMotion ? "services-scroll-rail overflow-x-auto" : "overflow-hidden [touch-action:pan-y]")}
        data-paused={held ? "true" : undefined}
        onPointerCancel={release}
        onPointerDown={onPointerDown}
        onPointerLeave={release}
        onPointerUp={release}
        role="region"
        style={{ "--marquee-duration": `${testimonials.length * SECONDS_PER_CARD}s` } as CSSProperties}
      >
        <div className={cn("flex w-max", reducedMotion ? "px-[20px]" : "testimonial-marquee-track")}>
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.name} testimonial={testimonial} />
          ))}
          {/* WHY: the second copy makes the loop seamless; it is hidden from assistive tech and the tab order. */}
          {!reducedMotion
            ? testimonials.map((testimonial) => <TestimonialCard hidden key={`copy-${testimonial.name}`} testimonial={testimonial} />)
            : null}
        </div>
      </div>
    </section>
  );
}
