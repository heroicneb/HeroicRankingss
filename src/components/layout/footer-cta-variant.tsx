"use client";

import type { ReactNode } from "react";

import { usePathname } from "next/navigation";

import { AppLink } from "@/components/ui/app-link";
import { GradientArrowUpRightIcon } from "@/components/ui/icons/decorative";

const GRADIENT_SPAN_CLASS =
  "gradient-text-brand gradient-text-brand-about-us-cta-copy";
const GRADIENT_STYLE = { lineHeight: "inherit" } as const;

interface CtaVariant {
  heading: ReactNode;
  body: ReactNode;
  ctaLabel: string;
  ctaWidth: string;
  headingMaxW?: string;
  bodyMaxW?: string;
  rootMaxW?: string;
}

const EXPANDED_CTA_WIDTH = "w-full max-w-[251px] lg:w-[198px]";

const CTA_VARIANTS: Record<string, CtaVariant> = {
  "/seo/keyword-research": {
    heading: (
      <>
        Dominate{" "}
        <span className={GRADIENT_SPAN_CLASS} style={GRADIENT_STYLE}>
          Your Market
        </span>
        <br />
        with targeted keywords that convert
      </>
    ),
    body: "Contact Us to schedule a consultation and learn how our SEO keyword research can enhance your organic traffic and keyword positions and AI presence.",
    ctaLabel: "Get Started Today",
    ctaWidth: EXPANDED_CTA_WIDTH,
    headingMaxW: "max-w-[612px]",
    bodyMaxW: "lg:max-w-[800px]",
    rootMaxW: "max-w-[800px]",
  },
  "/seo/local": {
    heading: (
      <>
        Dominate{" "}
        <span className={GRADIENT_SPAN_CLASS} style={GRADIENT_STYLE}>
          Your Market
        </span>
        <br />
        with Local SEO Success
      </>
    ),
    body: "Contact Us to schedule a consultation and learn how our local SEO services can enhance your local presence, connect you with nearby customers, and increase foot traffic to your business.",
    ctaLabel: "Get Started Today",
    ctaWidth: EXPANDED_CTA_WIDTH,
  },
  "/seo/on-page": {
    heading: (
      <>
        Start Generating SEO
        <br />
        <span className={GRADIENT_SPAN_CLASS} style={GRADIENT_STYLE}>
          Organic Revenue
        </span>
      </>
    ),
    body: "Start generating consistent organic SEO revenue and watch your business grow with sustainable, long-term results.",
    ctaLabel: "Get Started Today",
    ctaWidth: EXPANDED_CTA_WIDTH,
    bodyMaxW: "lg:max-w-[532px]",
    rootMaxW: "max-w-[600px]",
  },
  "/seo/content-creation": {
    heading: (
      <>
        Map Out Your Content for{" "}
        <span className={GRADIENT_SPAN_CLASS} style={GRADIENT_STYLE}>
          Maximum Impact
        </span>
      </>
    ),
    body: "Take control of your content strategy and map out a clear path to success. With a well-planned approach, you can engage your audience, boost search rankings, and drive meaningful results. Let us help you master your content and achieve long-term growth.",
    ctaLabel: "Get Started Today",
    ctaWidth: EXPANDED_CTA_WIDTH,
    bodyMaxW: "lg:max-w-[1130px]",
    rootMaxW: "max-w-[1130px]",
  },
  "/seo/technical": {
    heading: (
      <>
        Perfect Your Site with
        <br />
        <span className={GRADIENT_SPAN_CLASS} style={GRADIENT_STYLE}>
          Technical SEO Precision
        </span>
      </>
    ),
    body: "Contact us to schedule a consultation and discover how our technical SEO services can optimize your website's infrastructure, enhance user experience, and boost your search engine rankings.",
    ctaLabel: "Get Started Today",
    ctaWidth: EXPANDED_CTA_WIDTH,
    headingMaxW: "max-w-[600px]",
    bodyMaxW: "lg:max-w-[814px]",
    rootMaxW: "max-w-[814px]",
  },
  "/seo": {
    heading: (
      <>
        Ready to Turn Search
        <br />
        Into a{" "}
        <span className={GRADIENT_SPAN_CLASS} style={GRADIENT_STYLE}>
          Growth Engine
        </span>
      </>
    ),
    body: "Scale your business with a framework that is adjustable to any industry. Contact us today to start your SEO journey with Heroic Rankings.",
    ctaLabel: "Get Started Today",
    ctaWidth: EXPANDED_CTA_WIDTH,
  },
  "/seo/e-commerce": {
    heading: (
      <>
        Turn Shoppers into{" "}
        <span className={GRADIENT_SPAN_CLASS} style={GRADIENT_STYLE}>
          Loyal Customers
        </span>
        <br />
        and Drive Sustainable Growth
      </>
    ),
    body: "Maximizing your e-commerce store's organic growth requires a strategic SEO approach. Optimizing your site helps you reach more customers, attract steady traffic, and increase sales over time, all while cutting down on ad costs and improving your overall return on investment.",
    ctaLabel: "Get Started Today",
    ctaWidth: EXPANDED_CTA_WIDTH,
    headingMaxW: "max-w-[842px]",
    bodyMaxW: "lg:max-w-[1188px]",
    rootMaxW: "max-w-[1188px]",
  },
  "/seo/linkbuilding": {
    heading: (
      <>
        Strengthen Your{" "}
        <span className={GRADIENT_SPAN_CLASS} style={GRADIENT_STYLE}>
          Backlink Portfolio
        </span>
        <br />
        Through Effective Link Building
      </>
    ),
    body: "Build a diverse and high-quality backlink portfolio that boosts your search engine rankings, increases domain authority, and drives sustainable organic growth for your website.",
    ctaLabel: "Get Started Today",
    ctaWidth: EXPANDED_CTA_WIDTH,
  },
};

const ELEVATE_VARIANT: CtaVariant = {
  heading: <>Ready to grow together</>,
  body: (
    <>
      Our success is measured in your results. We built Heroic Rankings on a
      simple belief &mdash; a real SEO agency can only grow by growing its
      clients. So we don&apos;t just run campaigns. We build long-term
      partnerships where your growth is the only metric that matters.
    </>
  ),
  ctaLabel: "Start Growing",
  ctaWidth: EXPANDED_CTA_WIDTH,
};

const DEFAULT_VARIANT: CtaVariant = ELEVATE_VARIANT;

function resolveVariant(pathname: string): CtaVariant {
  const exact = CTA_VARIANTS[pathname];
  if (exact) return exact;

  if (
    pathname.startsWith("/blog") ||
    pathname.startsWith("/case-study") ||
    pathname === "/contact" ||
    pathname === "/about-us" ||
    pathname.startsWith("/partnership")
  ) {
    return ELEVATE_VARIANT;
  }

  return DEFAULT_VARIANT;
}

interface FooterCtaVariantProps {
  cmsBody?: string | null;
  cmsHeading?: string | null;
  cmsLabel?: string | null;
  cmsUrl?: string | null;
}

export function FooterCtaVariant({
  cmsBody,
  cmsHeading,
  cmsLabel,
  cmsUrl,
}: FooterCtaVariantProps) {
  const pathname = usePathname();
  const { heading, body, ctaLabel, ctaWidth, headingMaxW, bodyMaxW, rootMaxW } =
    resolveVariant(pathname);
  const resolvedHeading = heading;
  const resolvedBody = body;
  const resolvedCtaLabel = ctaLabel;
  const resolvedCtaUrl = cmsUrl?.trim() || "/contact";
  void cmsHeading;
  void cmsBody;
  void cmsLabel;

  return (
    <div
      className={`flex w-full ${rootMaxW ?? "max-w-[750.646px]"} flex-col items-center gap-[40px] text-center`}
    >
      <div className="w-full text-[var(--color-hr-pure-white)]">
        <p className="type-section-label">
          /{"  "}Start Scaling{"  "}/
        </p>
        <h2
          className={`type-h2 mx-auto mt-5 w-full ${headingMaxW ?? "max-w-[549px]"} text-[var(--color-hr-pure-white)]`}
        >
          {resolvedHeading}
        </h2>
      </div>

      <div
        className={`flex w-full ${bodyMaxW ?? "max-w-[724px]"} flex-col items-center gap-[40px]`}
      >
        <p className="type-paragraph w-full max-w-[294px] text-center text-[var(--color-hr-pure-white)] lg:max-w-none">
          {resolvedBody}
        </p>
        <AppLink
          className={`${ctaWidth} type-cta motion-interactive motion-interactive-press inline-flex items-center justify-center gap-2 rounded-[var(--radius-button)] whitespace-nowrap border border-[var(--color-hr-accent)] bg-transparent h-[45px] px-5 text-[var(--color-hr-pure-white)] hover:bg-[color-mix(in_srgb,var(--color-hr-pure-white)_8%,transparent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-hr-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-hr-dark)] [&_svg]:text-[var(--color-hr-pure-white)]`}
          href={resolvedCtaUrl}
          motionPreset="none"
        >
          {resolvedCtaLabel}
          <GradientArrowUpRightIcon className="size-4" />
        </AppLink>
      </div>
    </div>
  );
}
