"use client";

import { useEffect, useRef, useState } from "react";

import Image from "next/image";

import { AppLink } from "@/components/ui/app-link";
import { Container } from "@/components/ui/container";
import { ArrowUpRightIcon } from "@/components/ui/icons";
import { GradientArrowUpRightIcon } from "@/components/ui/icons/decorative";
import { SectionLabel } from "@/components/ui/section-label";
import { cn } from "@/lib/cn";
import type { SanityTestimonial } from "@/lib/sanity-data";
import type { Testimonial } from "@/types";

const MOBILE_CARD_WIDTH = 350;
const MOBILE_CARD_GAP = 5;
const MOBILE_DEFAULT_INDEX = 1;

type TestimonialEntry = Testimonial & {
  mobileCardHeightClassName: string;
  mobileTopSpacingClassName: string;
  mobileLogoWidth: number;
  mobileLogoHeight: number;
};

const TESTIMONIALS: TestimonialEntry[] = [
  {
    quote:
      "Amazing results! HR is an amazing team made of honest people and amazing experts. They deliver the results they promise!",
    name: "Gianluca Ferruggia",
    role: "/  General Manager  /",
    avatarSrc: "/figma/testimonials/avatar-1.png",
    avatarAlt: "Gianluca Ferruggia",
    logoSrc: "/figma/testimonials/logo-designrush.png",
    logoAlt: "DesignRush",
    logoWidth: 115,
    logoHeight: 27,
    logoOffsetTop: 25.65,
    mobileCardHeightClassName: "h-[622px]",
    mobileTopSpacingClassName: "gap-[43px]",
    mobileLogoWidth: 132,
    mobileLogoHeight: 30,
  },
  {
    quote:
      "HeroicRanking is our secret weapon! Their technical SEO know-how and link-building skills boosted rankings and brought more traffic to every project we collaborated on. They know their stuff and are great to work with. Highly recommend!",
    name: "Momcilo Popov",
    role: "/  Co-Founder  /",
    avatarSrc: "/figma/testimonials/avatar-2.png",
    avatarAlt: "Momcilo Popov",
    logoSrc: "/figma/testimonials/logo-bcms.png",
    logoAlt: "bcms",
    logoWidth: 110,
    logoHeight: 35,
    logoOffsetTop: 21,
    mobileCardHeightClassName: "h-[624px]",
    mobileTopSpacingClassName: "gap-[50px]",
    mobileLogoWidth: 126,
    mobileLogoHeight: 40,
  },
  {
    quote:
      "Best in the game regarding off-page SEO and the team that is enjoyable to work with over and over again! Looking forward to more of our successes!",
    name: "Nik Vujic",
    role: "/  Founder  /",
    avatarSrc: "/figma/testimonials/avatar-3.png",
    avatarAlt: "Nik Vujic",
    logoSrc: "/figma/testimonials/logo-gsd.png",
    logoAlt: "GSD",
    logoWidth: 90,
    logoHeight: 31,
    logoOffsetTop: 22.74,
    mobileCardHeightClassName: "h-[622px]",
    mobileTopSpacingClassName: "gap-[50px]",
    mobileLogoWidth: 90,
    mobileLogoHeight: 31,
  },
];

function withWrappedQuotes(text: string) {
  const trimmed = text
    .trim()
    .replace(/^["“]+/, "")
    .replace(/["”]+$/, "");
  return `"${trimmed}"`;
}

interface TestimonialsProps {
  cmsTestimonials?: SanityTestimonial[];
}

function cmsToEntry(t: SanityTestimonial): TestimonialEntry {
  return {
    quote: t.quote,
    name: t.authorName,
    role: t.authorTitle
      ? `/ ${t.authorTitle} /`
      : t.company
        ? `/ ${t.company} /`
        : "",
    avatarSrc: t.avatarUrl || "/figma/testimonials/avatar-1.png",
    avatarAlt: t.avatarAlt,
    logoSrc: t.companyLogoUrl || "/figma/testimonials/logo-designrush.png",
    logoAlt: t.companyLogoAlt,
    logoWidth: 115,
    logoHeight: 27,
    logoOffsetTop: 25.65,
    mobileCardHeightClassName: "h-[622px]",
    mobileTopSpacingClassName: "gap-[43px]",
    mobileLogoWidth: 132,
    mobileLogoHeight: 30,
  };
}

export function Testimonials({ cmsTestimonials }: TestimonialsProps = {}) {
  const cmsReady =
    cmsTestimonials &&
    cmsTestimonials.length > 0 &&
    cmsTestimonials.every((t) => t.avatarUrl && t.companyLogoUrl);
  const testimonials: TestimonialEntry[] = cmsReady
    ? cmsTestimonials.map(cmsToEntry)
    : TESTIMONIALS;

  const [mobileIndicatorIndex, setMobileIndicatorIndex] =
    useState(MOBILE_DEFAULT_INDEX);
  const railRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rail = railRef.current;

    if (!rail) {
      return;
    }

    const cardStep = MOBILE_CARD_WIDTH + MOBILE_CARD_GAP;
    const maxIndicatorIndex = testimonials.length - 1;
    const isDesktop = () => window.innerWidth >= 1024;

    const updateIndicator = () => {
      if (isDesktop()) {
        return;
      }

      const nextIndex = Math.round(rail.scrollLeft / cardStep);
      setMobileIndicatorIndex(
        Math.max(0, Math.min(maxIndicatorIndex, nextIndex)),
      );
    };

    const setInitialPosition = () => {
      if (isDesktop()) {
        return;
      }

      rail.scrollLeft = cardStep * MOBILE_DEFAULT_INDEX;
      setMobileIndicatorIndex(MOBILE_DEFAULT_INDEX);
    };

    setInitialPosition();
    updateIndicator();

    let resizeRafId = 0;
    const onResize = () => {
      cancelAnimationFrame(resizeRafId);
      resizeRafId = requestAnimationFrame(updateIndicator);
    };

    rail.addEventListener("scroll", updateIndicator, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      rail.removeEventListener("scroll", updateIndicator);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(resizeRafId);
    };
  }, [testimonials.length]);

  const scrollToMobileCard = (index: number) => {
    const rail = railRef.current;

    if (!rail) {
      return;
    }

    rail.scrollTo({
      left: (MOBILE_CARD_WIDTH + MOBILE_CARD_GAP) * index,
      behavior: "smooth",
    });
  };

  return (
    <section
      className="pb-[60px] pt-[60px] lg:pb-[120px] lg:pt-[120px]"
      id="testimonials"
    >
      <Container>
        <div className="grid gap-[30px] xl:grid-cols-[393px_1fr] xl:items-end">
          <div className="mx-auto w-full max-w-[350px] text-center xl:mx-0 xl:max-w-[393px] xl:text-left">
            <SectionLabel>
              /{"  "}Dedication{"  "}/
            </SectionLabel>
            <h2 className="type-h2 mt-5 text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
              What Our{" "}
              <span className="gradient-text-brand gradient-text-brand-testimonials">
                Clients
              </span>{" "}
              Say
            </h2>
          </div>

          <div className="flex justify-center xl:justify-end">
            <AppLink
              className="type-cta motion-interactive motion-interactive-press inline-flex h-[45px] w-full max-w-[350px] items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[var(--color-hr-accent)] bg-transparent text-[var(--color-hr-dark)] hover:bg-[var(--color-hr-off-white)] dark:text-[var(--color-text-inverse)] dark:hover:bg-[var(--color-surface-inverse-10)] xl:max-w-[253px]"
              href="/contact"
              motionPreset="none"
            >
              Become a Satisfied Client
              <GradientArrowUpRightIcon className="size-[10px]" />
            </AppLink>
          </div>
        </div>
      </Container>

      <Container className="mt-[40px] lg:mt-[69px]">
        <div
          className="services-scroll-rail overflow-x-auto snap-x snap-mandatory lg:hidden"
          ref={railRef}
        >
          <div className="mx-auto flex w-max gap-[5px] px-[20px]">
            {testimonials.map((testimonial) => (
              <article
                className={cn(
                  "flex w-[350px] shrink-0 snap-center flex-col justify-between rounded-[30px] bg-[var(--color-hr-off-white)] p-5",
                  "text-[var(--color-hr-dark)] dark:bg-[var(--color-bg-dark)] dark:text-[var(--color-text-inverse)]",
                  testimonial.mobileCardHeightClassName,
                )}
                key={`mobile-${testimonial.name}`}
              >
                <div
                  className={cn(
                    "flex flex-col",
                    testimonial.mobileTopSpacingClassName,
                  )}
                >
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
                    <div
                      className={cn(
                        "flex h-[77px] w-[160px] items-center justify-center overflow-hidden rounded-[66px] border border-[var(--color-hr-dark)]",
                        "bg-[var(--color-hr-off-white)] dark:border-[var(--color-border-inverse-20)] dark:bg-[var(--color-surface-inverse-95)]",
                      )}
                    >
                      <Image
                        alt={testimonial.logoAlt}
                        className="object-contain"
                        height={testimonial.mobileLogoHeight}
                        loading="lazy"
                        sizes={`${testimonial.mobileLogoWidth}px`}
                        src={testimonial.logoSrc}
                        width={testimonial.mobileLogoWidth}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-5">
                    <span
                      aria-hidden
                      className="text-[40px] font-medium leading-none tracking-[-0.04em] text-[var(--color-hr-accent)]"
                    >
                      “
                    </span>
                    <p className="type-h4 w-full max-w-[310px] leading-[1.6] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
                      {withWrappedQuotes(testimonial.quote)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-[10px]">
                  <h3 className="type-h4 text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
                    {testimonial.name}
                  </h3>
                  <p className="type-paragraph text-[var(--color-hr-grey)] dark:text-[var(--color-text-inverse-50)]">
                    {testimonial.role}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-[30px] flex items-center justify-center lg:hidden">
          {testimonials.map((testimonial, index) => (
            <button
              aria-label={`Go to testimonial ${index + 1}`}
              className="relative flex items-center justify-center p-[19px]"
              key={`mobile-indicator-${testimonial.name}`}
              onClick={() => scrollToMobileCard(index)}
              type="button"
            >
              <span
                className={cn(
                  "block size-[6px] rounded-full transition-colors duration-200",
                  index === mobileIndicatorIndex
                    ? "bg-[var(--color-hr-dark)] dark:bg-[var(--color-text-inverse)]"
                    : "bg-[var(--color-hr-light-grey)] dark:bg-[var(--color-border-inverse-20)]",
                )}
              />
            </button>
          ))}
        </div>

        <div className="hidden gap-5 lg:grid lg:grid-cols-2 xl:grid-cols-3">
          {testimonials.map((testimonial) => (
            <article
              className="relative mx-auto h-[574px] w-full max-w-[413px] overflow-hidden rounded-[var(--radius-card)] dark:border dark:border-[var(--color-border-inverse-10)] bg-[var(--color-hr-off-white)] dark:bg-[var(--color-bg-dark)]"
              key={`desktop-${testimonial.name}`}
            >
              <Image
                alt={testimonial.avatarAlt}
                className="absolute left-5 top-5 size-[77px] rounded-full object-cover"
                height={77}
                loading="lazy"
                sizes="77px"
                src={testimonial.avatarSrc}
                width={77}
              />

              <div className="absolute left-[233px] top-5 h-[77px] w-[160px] rounded-[66px] border border-[var(--color-hr-dark)] dark:border-[var(--color-border-inverse-20)] bg-[var(--color-hr-off-white)] dark:bg-[var(--color-surface-inverse-95)]">
                <div className="relative h-full w-full">
                  <Image
                    alt={testimonial.logoAlt}
                    className="absolute left-1/2 -translate-x-1/2 object-contain"
                    height={testimonial.logoHeight}
                    loading="lazy"
                    sizes={`${testimonial.logoWidth}px`}
                    src={testimonial.logoSrc}
                    style={{ top: testimonial.logoOffsetTop }}
                    width={testimonial.logoWidth}
                  />
                </div>
              </div>

              <span
                aria-hidden
                className="absolute left-5 top-[137px] text-[40px] font-medium leading-none tracking-[-0.04em] text-[var(--color-hr-accent)]"
              >
                “
              </span>
              <p className="type-h4 absolute left-5 top-[191px] w-[373px] leading-[1.6] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
                {withWrappedQuotes(testimonial.quote)}
              </p>
              <h3 className="type-h4 absolute left-5 top-[480px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
                {testimonial.name}
              </h3>
              <p className="type-paragraph absolute left-5 top-[521px] text-[var(--color-hr-grey)] dark:text-[var(--color-text-inverse-50)]">
                {testimonial.role}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
