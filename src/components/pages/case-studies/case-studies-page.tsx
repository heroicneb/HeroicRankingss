import type { Metadata } from "next";
import Image from "next/image";

import { AppLink } from "@/components/ui/app-link";
import { DiagonalArrowIcon } from "@/components/ui/icons/decorative";
import { createPageMetadata } from "@/lib/metadata";
import type { SanityCaseStudy } from "@/lib/sanity-data";
import { PageLinks } from "@/components/ui/page-links";
import { SubscribeBar } from "@/components/ui/subscribe-bar";

import { CASE_STUDY_PANEL_BY_SLUG } from "./parts/case-study-panels";

export const metadata: Metadata = createPageMetadata({
  title: "Case Studies",
  description:
    "Review Heroic Rankings case studies to see how data-driven SEO strategy translated into measurable traffic and revenue growth.",
  path: "/case-study",
});

const PAGE_SIZE = 9;

interface CaseStudyCardData {
  date: string;
  description: string;
  href: string;
  panelImageSrc: string;
  panelLabel: string;
  panelLabelClassName: string;
  panelLabelColorClassName: string;
  /** True when the panel image already shows the brand, so no text label is drawn. */
  panelLabelHidden?: boolean;
  title: string;
}

const CASE_STUDY_CARDS: CaseStudyCardData[] = [
  {
    title: "Affinda",
    panelLabel: "Affinda",
    description:
      "Affinda is a leading provider of AI-powered document parsing and data extraction solutions.",
    date: "December 1, 2024",
    panelImageSrc: "/case-studies/imgGroup44.svg",
    panelLabelClassName: "left-1/2 -translate-x-1/2",
    panelLabelColorClassName: "text-[var(--color-hr-pure-white)]",
    href: "/case-study/affinda",
  },
  {
    title: "My Baskets",
    panelLabel: "My Baskets",
    description:
      "My Baskets is a leading Canadian online retailer specializing in luxury gift baskets for various occasions.",
    date: "December 1, 2024",
    panelImageSrc: "/case-studies/my-baskets-cs-f.png",

    panelLabelClassName: "left-1/2 -translate-x-1/2",
    panelLabelColorClassName:
      "text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]",
    href: "/case-study/my-baskets",
  },
  {
    title: "Nagish",
    panelLabel: "Nagish",
    description:
      "Nagish is a pioneering company dedicated to making communication more accessible for individuals with hearing impairments.",
    date: "December 24, 2024",
    panelImageSrc: "/case-studies/imgGroup34.svg",

    panelLabelClassName: "left-1/2 -translate-x-1/2",
    panelLabelColorClassName: "text-[var(--color-hr-pure-white)]",
    href: "/case-study/nagish",
  },
  {
    title: "Art by Maudsch",
    panelLabel: "Art by Maudsch",
    description:
      "Art by Maudsch is an online platform dedicated to selling unique, handmade artworks by contemporary artists.",
    date: "December 24, 2024",
    panelImageSrc: "/case-studies/imgGroup31.svg",

    panelLabelClassName: "left-1/2 -translate-x-1/2",
    panelLabelColorClassName: "text-[var(--color-hr-pure-white)]",
    href: "/case-study/art-by-maudsch",
  },
  {
    title: "DesignRush",
    panelLabel: "DesignRush",
    description:
      "DesignRush is a B2B platform connecting businesses with top agencies in web design, marketing, branding, and technology.",
    date: "December 1, 2024",
    panelImageSrc: "/case-studies/imgGroup53.svg",

    panelLabelClassName: "left-1/2 -translate-x-1/2",
    panelLabelColorClassName: "text-[var(--color-hr-pure-white)]",
    href: "/case-study/designrush",
  },
  {
    title: "DIY Craft eCom Brand",
    panelLabel: "DIY Craft eCom",
    description:
      "DIY Craft eCom Brand provides intricate and customized paint-by-number kits designed for art lovers of all skill levels.",
    date: "December 24, 2024",
    panelImageSrc: "/case-studies/imgGroup52.svg",

    panelLabelClassName: "left-1/2 -translate-x-1/2",
    panelLabelColorClassName: "text-[var(--color-hr-pure-white)]",
    href: "/case-study/diy-craft-ecom-brand",
  },
  {
    title: "Support Adventure",
    panelLabel: "Support Adventure",
    description:
      "Support Adventure is a remote staffing agency specializing in placing top-tier customer support and IT helpdesk talent for growing businesses.",
    date: "December 24, 2024",
    panelImageSrc: "/case-studies/support-adventure-case-study-f.png",
    panelLabelClassName: "left-1/2 -translate-x-1/2",
    panelLabelColorClassName: "text-[var(--color-hr-pure-white)]",
    href: "/case-study/support-adventure",
  },
];

const CASE_STUDY_PANEL_FALLBACKS = CASE_STUDY_PANEL_BY_SLUG;

function formatPublishedDate(dateValue: string | null): string | null {
  if (!dateValue) return null;

  const parsedDate = new Date(dateValue);
  if (Number.isNaN(parsedDate.getTime())) return null;

  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parsedDate);
}

function CaseStudyCard({
  date,
  description,
  href,
  panelImageSrc,
  panelLabel,
  panelLabelClassName,
  panelLabelColorClassName,
  panelLabelHidden,
  title,
}: CaseStudyCardData) {
  return (
    <AppLink
      aria-label={`Open case study: ${title}`}
      className="block h-[501px] w-full max-w-[413px] overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-pure-white)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-hr-accent)] focus-visible:ring-offset-2 dark:border-[var(--color-border-inverse-10)] dark:bg-[var(--color-bg-dark)]"
      href={href}
    >
      <div className="relative h-[305px]">
        <Image
          alt=""
          aria-hidden
          className="rounded-tl-[var(--radius-card)] rounded-tr-[var(--radius-card)] object-cover"
          fill
          sizes="(min-width: 1280px) 413px, (min-width: 768px) 42vw, calc(100vw - 40px)"
          src={panelImageSrc}
        />

        {!panelLabelHidden ? (
          <p
            className={`absolute top-[131px] text-[32px] font-normal leading-[32px] tracking-[-0.64px] ${panelLabelClassName} ${panelLabelColorClassName}`}
          >
            {panelLabel}
          </p>
        ) : null}

        <span
          aria-hidden
          className="absolute bottom-5 right-5 inline-flex size-[72px] items-center justify-center rounded-full bg-[var(--color-hr-pure-white)] dark:bg-[var(--color-bg-dark)]"
        >
          <DiagonalArrowIcon className="size-5 text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]" />
        </span>
      </div>

      <div className="flex h-[196px] flex-col px-5 pt-5">
        <h2 className="text-[24px] font-medium leading-[24px] tracking-[-0.48px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
          {title}
        </h2>
        <p className="mt-3 line-clamp-4 text-[18px] font-normal leading-[24px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
          {description}
        </p>
        <p className="mt-auto pb-5 text-[18px] font-normal leading-[24px] text-[var(--color-hr-grey)] dark:text-[var(--color-text-inverse-50)]">
          {date}
        </p>
      </div>
    </AppLink>
  );
}

function mergeCmsWithHardcoded(
  cmsCaseStudies?: SanityCaseStudy[],
): CaseStudyCardData[] {
  if (!cmsCaseStudies?.length) return CASE_STUDY_CARDS;

  const cardsFromCms = cmsCaseStudies
    .filter((caseStudy) => caseStudy.slug)
    .map((caseStudy) => {
      const panelFallback = CASE_STUDY_PANEL_FALLBACKS[caseStudy.slug];

      return {
        title: caseStudy.title,
        // Figma SoT shows the brand NAME on the index card (e.g. "Affinda",
        // "DesignRush"), not the legacy URL. Migrated `client` holds the URL
        // form (`affinda.com`, `www.designrush.com`), so prefer the explicit
        // panelLabel first, then the brand title, and fall back to `client`
        // only when neither is set.
        panelLabel: caseStudy.panelLabel ?? caseStudy.title ?? caseStudy.client,
        description:
          caseStudy.excerpt ??
          "Explore how Heroic Rankings delivered measurable SEO growth for this client.",
        date:
          formatPublishedDate(caseStudy.publishedAt) ??
          "Case study in progress",
        // Always prefer the brand-color SVG panel keyed by slug — that's the
        // Figma source-of-truth for this card (flat brand panel + URL/client
        // overlay, no photo). Falling back to caseStudy.cardImage / heroImage
        // produced the regression where every card rendered the same shared
        // hero photo, especially visible in light mode (see audit
        // docs/audits/figma-alignment/REPORT.md §3).
        panelImageSrc:
          panelFallback?.panelImageSrc ||
          caseStudy.cardImageUrl ||
          caseStudy.heroImageUrl ||
          "/case-studies/imgGroup44.svg",
        panelLabelClassName:
          panelFallback?.panelLabelClassName ?? "left-1/2 -translate-x-1/2",
        panelLabelColorClassName:
          panelFallback?.panelLabelColorClassName ??
          "text-[var(--color-hr-pure-white)]",
        panelLabelHidden: panelFallback?.panelLabelHidden ?? false,
        href: `/case-study/${caseStudy.slug}`,
      } satisfies CaseStudyCardData;
    });

  return cardsFromCms.length > 0 ? cardsFromCms : CASE_STUDY_CARDS;
}

interface CaseStudiesPageProps {
  cmsCaseStudies?: SanityCaseStudy[];
  /** `page` query param from the URL. */
  page?: string | null;
}

const hrefForPage = (n: number) => (n <= 1 ? "/case-study/" : `/case-study/?page=${n}`);

/**
 * Case studies index: a uniform 3-up grid (2-up on tablets, 1-up on phones),
 * nine cards per page, with link-based pagination when there are more.
 */
export default function CaseStudiesPage({ cmsCaseStudies, page: pageParam }: CaseStudiesPageProps) {
  const cards = mergeCmsWithHardcoded(cmsCaseStudies);
  const pageCount = Math.max(1, Math.ceil(cards.length / PAGE_SIZE));
  const requested = Math.max(1, Number.parseInt(pageParam ?? "1", 10) || 1);
  const page = Math.min(requested, pageCount);
  const visible = cards.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <section className="pb-[60px] pt-[109px] lg:pb-[120px]" id="case-studies">
      <div className="mx-auto w-full max-w-[1440px] px-5 md:px-10 xl:px-[80px]">
        <h1 className="mx-auto w-full max-w-[857px] text-center text-[48px] font-normal leading-[60px] tracking-[-1.24px] sm:text-[56px] sm:leading-[72px] xl:text-[62px] xl:leading-[80px]">
          <span className="gradient-text-brand gradient-text-brand-about-us-hero-title">
            Success Stories
          </span>
        </h1>
        <p className="mx-auto mt-[7px] w-full max-w-[734px] text-center text-[18px] font-normal leading-[24px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
          Work we&apos;re proud to stand behind.
          <br />
          See what this looks like in practice &amp; how our execution performs
          over time.
        </p>
        <div className="mt-10 flex justify-center">
          <SubscribeBar />
        </div>

        <div className="mx-auto mt-20 grid w-full max-w-[1280px] grid-cols-1 justify-items-center gap-5 md:grid-cols-2 xl:mt-[122px] xl:grid-cols-3">
          {visible.map((card) => (
            <CaseStudyCard key={card.href} {...card} />
          ))}
        </div>

        <PageLinks ariaLabel="Case study pages" className="mt-[60px]" hrefFor={hrefForPage} page={page} pageCount={pageCount} />
      </div>
    </section>
  );
}
