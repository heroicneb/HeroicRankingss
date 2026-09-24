import { cache } from "react";
import type { PortableTextBlock } from "@portabletext/react";
import { urlFor } from "@/sanity/lib/image";
import { client } from "@/sanity/lib/client";
import {
  SITE_SETTINGS_QUERY,
  POSTS_QUERY,
  POST_BY_SLUG_QUERY,
  POST_SLUGS_QUERY,
  POST_URLS_QUERY,
  TEAM_MEMBERS_QUERY,
  TEAM_MEMBER_BY_SLUG_QUERY,
  TEAM_MEMBER_SLUGS_QUERY,
  CASE_STUDIES_QUERY,
  CASE_STUDY_BY_SLUG_QUERY,
  CASE_STUDY_SLUGS_QUERY,
  CONTACT_PAGE_QUERY,
  FAQ_BY_SERVICE_QUERY,
  LEGAL_PAGE_BY_SLUG_QUERY,
  PARTNER_LOGOS_QUERY,
  LINK_BUILDING_PAGE_QUERY,
  PARTNERSHIP_PAGE_QUERY,
  REDDIT_MARKETING_PAGE_QUERY,
  SEO_SERVICE_PAGE_QUERY,
  PODCAST_EPISODES_QUERY,
  PODCAST_EPISODE_BY_SLUG_QUERY,
  PODCAST_EPISODE_SLUGS_QUERY,
  TESTIMONIALS_QUERY,
} from "@/sanity/lib/queries";
import type { NavItem, NavLink } from "@/types";
import {
  DEFAULT_PARTNERSHIP_CONTENT,
  type PartnershipContent,
} from "@/components/pages/partnership/partnership-content";
import {
  DEFAULT_LINK_BUILDING_CONTENT,
  type LinkBuildingContent,
} from "@/components/pages/link-building/link-building-content";
import {
  DEFAULT_REDDIT_MARKETING_CONTENT,
  type RedditMarketingContent,
} from "@/components/pages/reddit-marketing/reddit-marketing-content";
import type { RichBlock } from "@/components/pages/shared/page-content";
import type { SeoServiceContent, SeoServicePageKey } from "@/components/pages/shared/seo-service-content";
import { seoServicePage } from "@/components/pages/shared/seo-service-registry";
import {
  faqEntries,
  headingSegments,
  listOr,
  pageImage,
  text,
  type SanityRawPageImage,
} from "@/lib/page-content-mappers";

// ── Sanity Image Reference ────────────────────────────────────────
// Represents a Sanity image field with expanded asset metadata (via `asset->`)

interface SanityImageRef {
  _type: "image";
  asset?: {
    _ref?: string;
    _type?: string;
    metadata?: { lqip?: string };
  };
  alt?: string;
  hotspot?: { x: number; y: number; height: number; width: number };
  crop?: { top: number; bottom: number; left: number; right: number };
}

// ── SEO sub-object ────────────────────────────────────────────────

interface SanitySeo {
  metaTitle?: string | null;
  metaDescription?: string | null;
}

// ── Raw Sanity response types (what GROQ queries return) ──────────

/** Raw post from POSTS_QUERY (list view) */
interface SanityRawPost {
  _id: string;
  title: string;
  titleHighlighted?: string | null;
  slug?: { current: string };
  excerpt?: string | null;
  mainImage?: SanityImageRef | null;
  publishedAt?: string | null;
  categories?: unknown[] | null;
  urlCategory?: string | null;
  author?: { name?: string; photo?: SanityImageRef | null } | null;
}

/** Raw post from POST_BY_SLUG_QUERY (detail view) */
interface SanityRawPostDetail extends SanityRawPost {
  body?: PortableTextBlock[] | null;
  author?: {
    name?: string;
    role?: string;
    photo?: SanityImageRef | null;
    bio?: string | null;
    bioParagraphs?: string[] | null;
    linkedin?: string | null;
  } | null;
  seo?: SanitySeo | null;
}

/** Raw case study from CASE_STUDIES_QUERY (list view) */
interface SanityRawCaseStudy {
  _id: string;
  title: string;
  slug?: { current: string };
  client: string;
  panelLabel?: string | null;
  excerpt?: string | null;
  publishedAt?: string | null;
  heroImage?: SanityImageRef | null;
  cardImage?: SanityImageRef | null;
  metrics?: SanityRawMetric[] | null;
  services?: string[] | null;
  featured?: boolean;
  quoteText?: string | null;
}

/** Raw metric sub-object within case studies */
interface SanityRawMetric {
  _key?: string;
  label?: string | null;
  value?: string | null;
  description?: string | null;
}

/** Raw FAQ item from FAQ_BY_SERVICE_QUERY */
/** Raw team member from TEAM_MEMBERS_QUERY */
interface SanityRawTeamMember {
  _id: string;
  name: string;
  slug?: { current: string } | null;
  role: string;
  department?: string | null;
  photo?: SanityImageRef | null;
  cardImage?: SanityImageRef | null;
  bio?: string | null;
  bioParagraphs?: string[] | null;
  personalTraits?: string | null;
  spareTimeBullets?: string[] | null;
  qaItems?: Array<{ question: string; answer: string }> | null;
  lifestylePhotos?: Array<{
    url: string | null;
    alt: string | null;
    width?: number | null;
    height?: number | null;
    lqip?: string | null;
  }> | null;
  contact?: { email?: string | null; phone?: string | null } | null;
  socialLinks?: SanityRawSocialLink[] | null;
  linkedin?: string | null;
  showOnAboutPage?: boolean;
  _createdAt?: string | null;
  _updatedAt?: string | null;
}

/** Social link sub-object used in team members and site settings */
interface SanityRawSocialLink {
  _key: string;
  platform: string;
  url: string;
}

/** Raw partner logo from PARTNER_LOGOS_QUERY */
interface SanityRawPartnerLogo {
  _id: string;
  name: string;
  logo?: SanityImageRef | null;
  url?: string | null;
}

/** Raw nav item sub-object used in site settings */
interface SanityRawNavItem {
  _key: string;
  label: string;
  href: string;
  children?: SanityRawNavChild[] | null;
}

/** Raw nav child sub-object used in nav items */
interface SanityRawNavChild {
  _key: string;
  label: string;
  href: string;
}

/** Raw footer nav item sub-object */
interface SanityRawFooterNavItem {
  _key: string;
  label: string;
  href: string;
}

/** Raw site settings from SITE_SETTINGS_QUERY */
interface SanityRawSiteSettings {
  companyName?: string | null;
  phone?: string | null;
  email?: string | null;
  socialLinks?: SanityRawSocialLink[] | null;
  copyrightText?: string | null;
  navItems?: SanityRawNavItem[] | null;
  footerNavItems?: SanityRawFooterNavItem[] | null;
  footerCtaHeading?: string | null;
  footerCtaBody?: string | null;
  footerCtaLabel?: string | null;
  footerCtaUrl?: string | null;
  headerCtaLabel?: string | null;
  headerCtaUrl?: string | null;
}

/** Raw partnership page from PARTNERSHIP_PAGE_QUERY */
interface SanityRawPartnershipPage {
  _id: string;
  hero?: { heading?: PortableTextBlock[] | null; intro?: string | null; image?: SanityRawPageImage | null } | null;
  recognize?: {
    label?: string | null;
    heading?: PortableTextBlock[] | null;
    items?: Array<{ _key: string; title?: string | null; description?: string | null; icon?: SanityRawPageImage | null }> | null;
  } | null;
  amplify?: {
    label?: string | null;
    heading?: PortableTextBlock[] | null;
    intro?: string | null;
    cards?: Array<{
      _key: string;
      title?: string | null;
      subtitle?: string | null;
      paragraphs?: string[] | null;
      ctaLabel?: string | null;
      ctaUrl?: string | null;
      icon?: SanityRawPageImage | null;
    }> | null;
  } | null;
  scale?: {
    label?: string | null;
    heading?: PortableTextBlock[] | null;
    paragraphs?: RichBlock[] | null;
    logos?: Array<{ _key: string; keepColor?: boolean | null; image?: SanityRawPageImage | null }> | null;
  } | null;
  darkCta?: { heading?: PortableTextBlock[] | null; body?: string | null; ctaLabel?: string | null; ctaUrl?: string | null } | null;
  differentiators?: {
    label?: string | null;
    heading?: PortableTextBlock[] | null;
    items?: Array<{ _key: string; title?: string | null; description?: RichBlock[] | null; icon?: SanityRawPageImage | null }> | null;
  } | null;
  nextSteps?: {
    label?: string | null;
    heading?: PortableTextBlock[] | null;
    paragraphs?: string[] | null;
    items?: Array<{ _key: string; title?: string | null; description?: string | null; icon?: SanityRawPageImage | null }> | null;
  } | null;
  faq?: { items?: Array<{ _key: string; question?: string | null; answer?: string | null }> | null } | null;
  seo?: SanitySeo | null;
}

/** Raw contact page from CONTACT_PAGE_QUERY */
interface SanityRawContactPage {
  _id: string;
  title: string;
  intro?: string | null;
  email?: string | null;
  seo?: SanitySeo | null;
}

/** Raw legal page from LEGAL_PAGE_BY_SLUG_QUERY */
interface SanityRawLegalPage {
  _id: string;
  title: string;
  slug?: { current: string };
  intro?: string | null;
  body?: PortableTextBlock[] | null;
  contactEmail?: string | null;
  seo?: SanitySeo | null;
}

/** Raw service card sub-object */
/** Raw process step sub-object */
/** Raw why-choose item sub-object */
/** Raw related case study reference (expanded via `->`) */
interface SanityRawRelatedCaseStudy {
  _id: string;
  title: string;
  slug?: { current: string };
  client: string;
  excerpt?: string | null;
  heroImage?: SanityImageRef | null;
}

// ── Helpers ────────────────────────────────────────────────────────

function imageUrl(
  source: SanityImageRef | null | undefined,
  width?: number,
): string {
  if (!source) return "";
  try {
    const builder = urlFor(source);
    return width ? builder.width(width).url() : builder.url();
  } catch {
    return "";
  }
}

function imageLqip(
  source: SanityImageRef | null | undefined,
): string | undefined {
  if (!source || typeof source !== "object") return undefined;
  const asset = source.asset;
  if (!asset || typeof asset !== "object") return undefined;
  const metadata = asset.metadata;
  if (!metadata || typeof metadata !== "object") return undefined;
  const lqip = metadata.lqip;
  return typeof lqip === "string" ? lqip : undefined;
}

// ── Blog Posts ────────────────────────────────────────────────────

export interface SanityPostSummary {
  _id: string;
  categories: string[];
  urlCategory: string | null;
  excerpt: string | null;
  mainImageAlt: string;
  mainImageLqip: string | undefined;
  mainImageUrl: string;
  publishedAt: string | null;
  slug: string;
  title: string;
  titleHighlighted: string | null;
}

export interface SanityPostAuthor {
  name: string | null;
  role: string | null;
  bio: string | null;
  bioParagraphs: string[] | null;
  linkedin: string | null;
  photoUrl: string;
  photoAlt: string;
  photoLqip: string | undefined;
}

export interface SanityPostDetail extends SanityPostSummary {
  authorName: string | null;
  authorRole: string | null;
  author: SanityPostAuthor | null;
  body: PortableTextBlock[] | null;
  seoDescription: string | null;
  seoTitle: string | null;
}

export async function getPosts(): Promise<SanityPostSummary[]> {
  const data = await client.fetch(
    POSTS_QUERY,
    {},
    { next: { tags: ["post"], revalidate: false } },
  );
  if (!data) return [];

  return (data as SanityRawPost[]).map((post) => ({
    _id: post._id,
    title: post.title,
    titleHighlighted: post.titleHighlighted ?? null,
    slug: post.slug?.current ?? "",
    excerpt: post.excerpt ?? null,
    mainImageUrl: imageUrl(post.mainImage, 1200),
    mainImageLqip: imageLqip(post.mainImage),
    mainImageAlt: post.mainImage?.alt ?? post.title,
    publishedAt: post.publishedAt ?? null,
    categories: (post.categories ?? []).filter(
      (category: unknown): category is string => typeof category === "string",
    ),
    urlCategory: post.urlCategory ?? null,
  }));
}

export const getPostBySlug = cache(
  async (slug: string): Promise<SanityPostDetail | null> => {
    const data = await client.fetch(
      POST_BY_SLUG_QUERY,
      { slug },
      { next: { tags: ["post"], revalidate: false } },
    );
    if (!data) return null;

    const post = data as SanityRawPostDetail;
    const rawAuthor = post.author ?? null;
    const author: SanityPostAuthor | null = rawAuthor
      ? {
          name: rawAuthor.name ?? null,
          role: rawAuthor.role ?? null,
          bio: rawAuthor.bio ?? null,
          bioParagraphs: rawAuthor.bioParagraphs ?? null,
          linkedin: rawAuthor.linkedin ?? null,
          photoUrl: imageUrl(rawAuthor.photo, 600),
          photoAlt: rawAuthor.photo?.alt ?? rawAuthor.name ?? "",
          photoLqip: imageLqip(rawAuthor.photo),
        }
      : null;

    return {
      _id: post._id,
      title: post.title,
      titleHighlighted: post.titleHighlighted ?? null,
      slug: post.slug?.current ?? slug,
      excerpt: post.excerpt ?? null,
      mainImageUrl: imageUrl(post.mainImage, 1200),
      mainImageLqip: imageLqip(post.mainImage),
      mainImageAlt: post.mainImage?.alt ?? post.title,
      publishedAt: post.publishedAt ?? null,
      categories: (post.categories ?? []).filter(
        (category: unknown): category is string => typeof category === "string",
      ),
      urlCategory: post.urlCategory ?? null,
      body: post.body ?? null,
      authorName: rawAuthor?.name ?? null,
      authorRole: rawAuthor?.role ?? null,
      author,
      seoTitle: post.seo?.metaTitle ?? null,
      seoDescription: post.seo?.metaDescription ?? null,
    };
  },
);

export async function getPostSlugs(): Promise<string[]> {
  const data = await client.fetch<unknown[]>(
    POST_SLUGS_QUERY,
    {},
    URL_PARAM_FETCH,
  );
  if (!data) return [];

  return data.filter(
    (slug): slug is string => typeof slug === "string" && isSafeSlug(slug),
  );
}

/**
 * Returns all post {slug, urlCategory} pairs — used by sitemap.ts and any
 * caller that needs the legacy /seo/<urlCategory>/<slug>/ URL form for
 * every post (not just the 12 most recent that POSTS_QUERY caps).
 *
 * Posts without urlCategory are returned with urlCategory: null — callers
 * filter them out of URL lists (no canonical URL until the editor sets it).
 */
// URL-safe slug guard. Defensive backstop after the real fix
// (`stega: false` on URL-param fetches below).
// Why this exists: Sanity's stega visual-editing feature (enabled on
// Vercel preview in src/sanity/lib/client.ts) appends ~1KB of zero-width
// Unicode chars to every string field for click-to-edit metadata. When
// `urlCategory: "technical"` came back as `"technical" + 984 zero-width
// chars`, generateStaticParams used it as a filesystem path and Vercel's
// build choked with ENAMETOOLONG. Per Sanity docs, URL-param fetches
// must pass `{ stega: false, perspective: "published" }`. The regex
// stays as a guard so any future regression fails closed.
const SAFE_SLUG = /^[a-z0-9](?:[a-z0-9-]{0,79})$/;

function isSafeSlug(slug: string): boolean {
  return SAFE_SLUG.test(slug);
}

// Fetch options for URL-param queries (slugs, urlCategory). Disables
// stega so returned strings can be used directly as filesystem paths.
const URL_PARAM_FETCH = {
  stega: false,
  perspective: "published" as const,
};

export async function getPostUrls(): Promise<
  Array<{ slug: string; urlCategory: string | null }>
> {
  const data = await client.fetch<
    Array<{ slug?: string | null; urlCategory?: string | null }>
  >(POST_URLS_QUERY, {}, URL_PARAM_FETCH);
  if (!data) return [];

  return data
    .filter(
      (row): row is { slug: string; urlCategory?: string | null } =>
        typeof row?.slug === "string" && isSafeSlug(row.slug),
    )
    .map((row) => ({
      slug: row.slug,
      urlCategory: row.urlCategory ?? null,
    }));
}

// ── Partnership Page ───────────────────────────────────────────────

export interface SanityPartnershipPage {
  _id: string;
  content: PartnershipContent;
  seo: { metaTitle: string | null; metaDescription: string | null } | null;
}

export async function getPartnershipPage(): Promise<SanityPartnershipPage | null> {
  const data = await client.fetch(
    PARTNERSHIP_PAGE_QUERY,
    {},
    { next: { tags: ["partnershipPage"], revalidate: false } },
  );
  if (!data) return null;

  const raw = data as SanityRawPartnershipPage;
  const d = DEFAULT_PARTNERSHIP_CONTENT;

  const content: PartnershipContent = {
    hero: {
      heading: headingSegments(raw.hero?.heading, d.hero.heading),
      intro: text(raw.hero?.intro, d.hero.intro),
      image: pageImage(raw.hero?.image, d.hero.image),
    },
    recognize: {
      label: text(raw.recognize?.label, d.recognize.label),
      heading: headingSegments(raw.recognize?.heading, d.recognize.heading),
      items: raw.recognize?.items?.length
        ? raw.recognize.items.map((item, i) => ({
            title: item.title ?? "",
            description: item.description ?? "",
            icon: pageImage(item.icon, d.recognize.items[i]?.icon ?? null),
          }))
        : d.recognize.items,
    },
    amplify: {
      label: text(raw.amplify?.label, d.amplify.label),
      heading: headingSegments(raw.amplify?.heading, d.amplify.heading),
      intro: text(raw.amplify?.intro, d.amplify.intro),
      cards: raw.amplify?.cards?.length
        ? raw.amplify.cards.map((card, i) => ({
            title: card.title ?? "",
            subtitle: card.subtitle ?? "",
            paragraphs: card.paragraphs ?? [],
            icon: pageImage(card.icon, d.amplify.cards[i]?.icon ?? null),
            ctaLabel: card.ctaLabel?.trim() || null,
            ctaUrl: card.ctaUrl?.trim() || null,
          }))
        : d.amplify.cards,
    },
    scale: {
      label: text(raw.scale?.label, d.scale.label),
      heading: headingSegments(raw.scale?.heading, d.scale.heading),
      paragraphs: raw.scale?.paragraphs?.length ? raw.scale.paragraphs : d.scale.paragraphs,
      logos: raw.scale?.logos?.length
        ? raw.scale.logos.flatMap((cell) => {
            const image = pageImage(cell.image, null);
            return image ? [{ image, keepColor: Boolean(cell.keepColor) }] : [];
          })
        : d.scale.logos,
    },
    darkCta: {
      heading: headingSegments(raw.darkCta?.heading, d.darkCta.heading),
      body: text(raw.darkCta?.body, d.darkCta.body),
      ctaLabel: text(raw.darkCta?.ctaLabel, d.darkCta.ctaLabel),
      ctaUrl: text(raw.darkCta?.ctaUrl, d.darkCta.ctaUrl),
    },
    differentiators: {
      label: text(raw.differentiators?.label, d.differentiators.label),
      heading: headingSegments(raw.differentiators?.heading, d.differentiators.heading),
      items: raw.differentiators?.items?.length
        ? raw.differentiators.items.map((item, i) => ({
            title: item.title ?? "",
            description: item.description ?? [],
            icon: pageImage(item.icon, d.differentiators.items[i]?.icon ?? null),
          }))
        : d.differentiators.items,
    },
    nextSteps: {
      label: text(raw.nextSteps?.label, d.nextSteps.label),
      heading: headingSegments(raw.nextSteps?.heading, d.nextSteps.heading),
      paragraphs: raw.nextSteps?.paragraphs?.length ? raw.nextSteps.paragraphs : d.nextSteps.paragraphs,
      items: raw.nextSteps?.items?.length
        ? raw.nextSteps.items.map((item, i) => ({
            title: item.title ?? "",
            description: item.description ?? "",
            icon: pageImage(item.icon, d.nextSteps.items[i]?.icon ?? null),
          }))
        : d.nextSteps.items,
    },
    faq: {
      items: raw.faq?.items?.length
        ? raw.faq.items.map((item) => ({ question: item.question ?? "", answer: item.answer ?? "" }))
        : d.faq.items,
    },
  };

  return {
    _id: raw._id,
    content,
    seo: raw.seo ? { metaTitle: raw.seo.metaTitle ?? null, metaDescription: raw.seo.metaDescription ?? null } : null,
  };
}

export interface SanityContactPage {
  _id: string;
  email: string | null;
  intro: string | null;
  seoDescription: string | null;
  seoTitle: string | null;
  title: string;
}

export interface SanityLegalPage {
  _id: string;
  body: PortableTextBlock[] | null;
  contactEmail: string | null;
  intro: string | null;
  seoDescription: string | null;
  seoTitle: string | null;
  slug: string;
  title: string;
}

export async function getContactPage(): Promise<SanityContactPage | null> {
  const data = await client.fetch(
    CONTACT_PAGE_QUERY,
    {},
    { next: { tags: ["contactPage"], revalidate: false } },
  );
  if (!data) return null;

  const page = data as SanityRawContactPage;
  return {
    _id: page._id,
    title: page.title,
    intro: page.intro ?? null,
    email: page.email ?? null,
    seoTitle: page.seo?.metaTitle ?? null,
    seoDescription: page.seo?.metaDescription ?? null,
  };
}

export async function getLegalPageBySlug(
  slug: string,
): Promise<SanityLegalPage | null> {
  const data = await client.fetch(
    LEGAL_PAGE_BY_SLUG_QUERY,
    { slug },
    { next: { tags: ["legalPage"], revalidate: false } },
  );
  if (!data) return null;

  const page = data as SanityRawLegalPage;
  return {
    _id: page._id,
    title: page.title,
    slug: page.slug?.current ?? slug,
    intro: page.intro ?? null,
    body: page.body ?? null,
    contactEmail: page.contactEmail ?? null,
    seoTitle: page.seo?.metaTitle ?? null,
    seoDescription: page.seo?.metaDescription ?? null,
  };
}

// ── Site Settings ──────────────────────────────────────────────────

export interface SiteSettings {
  companyName: string;
  phone: string;
  email: string;
  socialLinks: Array<{ platform: string; url: string }>;
  copyrightText: string;
  navItems: NavItem[];
  footerNavItems: NavLink[];
  footerCtaHeading: string | null;
  footerCtaBody: string | null;
  footerCtaLabel: string | null;
  footerCtaUrl: string | null;
  headerCtaLabel: string | null;
  headerCtaUrl: string | null;
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const data = await client.fetch(
    SITE_SETTINGS_QUERY,
    {},
    { next: { tags: ["siteSettings"], revalidate: false } },
  );
  if (!data) return null;

  const settings = data as SanityRawSiteSettings;
  return {
    companyName: settings.companyName ?? "Heroic Rankings",
    phone: settings.phone ?? "+1 307 336 7191",
    email: settings.email ?? "info@heroicrankings.com",
    socialLinks: (settings.socialLinks ?? []).map(
      (sl: SanityRawSocialLink) => ({
        platform: sl.platform,
        url: sl.url,
      }),
    ),
    copyrightText: settings.copyrightText ?? "©2026 Heroic Rankings",
    navItems: (settings.navItems ?? []).map((item: SanityRawNavItem) => ({
      label: item.label,
      href: item.href,
      children: item.children?.map((child: SanityRawNavChild) => ({
        label: child.label,
        href: child.href,
      })),
    })),
    footerNavItems: (settings.footerNavItems ?? []).map(
      (item: SanityRawFooterNavItem) => ({
        label: item.label,
        href: item.href,
      }),
    ),
    footerCtaHeading: settings.footerCtaHeading ?? null,
    footerCtaBody: settings.footerCtaBody ?? null,
    footerCtaLabel: settings.footerCtaLabel ?? null,
    footerCtaUrl: settings.footerCtaUrl ?? null,
    headerCtaLabel: settings.headerCtaLabel ?? null,
    headerCtaUrl: settings.headerCtaUrl ?? null,
  };
}

// ── Team Members ──────────────────────────────────────────────────

export interface SanityTeamMember {
  _id: string;
  name: string;
  slug: { current: string } | null;
  role: string;
  department: string | null;
  photoUrl: string;
  photoAlt: string;
  photoLqip: string | undefined;
  cardImageUrl: string;
  cardImageAlt: string;
  cardImageLqip: string | undefined;
  bio: string | null;
  bioParagraphs: string[] | null;
  personalTraits: string | null;
  spareTimeBullets: string[];
  qaItems: Array<{ question: string; answer: string }>;
  lifestylePhotos: Array<{
    url: string;
    alt: string;
    width: number | null;
    height: number | null;
    lqip: string | undefined;
  }>;
  contact: { email: string | null; phone: string | null } | null;
  socialLinks: Array<{ platform: string; url: string }>;
}

/** Detail view for /about/[slug] — adds createdAt/updatedAt for ProfilePage schema. */
export interface SanityTeamMemberDetail extends SanityTeamMember {
  createdAt: string | null;
  updatedAt: string | null;
}

function mapTeamMember(m: SanityRawTeamMember): SanityTeamMember {
  return {
    _id: m._id,
    name: m.name,
    slug: m.slug ?? null,
    role: m.role,
    department: m.department ?? null,
    photoUrl: imageUrl(m.photo, 600),
    photoAlt: m.photo?.alt ?? `${m.name} portrait`,
    photoLqip: imageLqip(m.photo),
    cardImageUrl: imageUrl(m.cardImage, 600),
    cardImageAlt: m.cardImage?.alt ?? m.name,
    cardImageLqip: imageLqip(m.cardImage),
    bio: m.bio ?? null,
    bioParagraphs: m.bioParagraphs ?? null,
    personalTraits: m.personalTraits?.trim() || null,
    spareTimeBullets: (m.spareTimeBullets ?? []).filter(
      (b): b is string => typeof b === "string" && b.trim().length > 0,
    ),
    qaItems: (m.qaItems ?? []).filter(
      (q): q is { question: string; answer: string } =>
        Boolean(q?.question?.trim() && q?.answer?.trim()),
    ),
    lifestylePhotos: (m.lifestylePhotos ?? [])
      .filter((p): p is NonNullable<typeof p> & { url: string } =>
        Boolean(p?.url),
      )
      .map((p) => ({
        url: p.url,
        alt: (p.alt ?? "").trim(),
        width: p.width ?? null,
        height: p.height ?? null,
        lqip: p.lqip ?? undefined,
      })),
    contact: m.contact
      ? { email: m.contact.email ?? null, phone: m.contact.phone ?? null }
      : null,
    socialLinks: (m.socialLinks ?? []).map((sl: SanityRawSocialLink) => ({
      platform: sl.platform,
      url: sl.url,
    })),
  };
}

export async function getTeamMembers(): Promise<SanityTeamMember[]> {
  const data = await client.fetch(
    TEAM_MEMBERS_QUERY,
    {},
    { next: { tags: ["teamMember"], revalidate: false } },
  );
  if (!data) return [];

  return (data as SanityRawTeamMember[]).map(mapTeamMember);
}

export const getTeamMemberBySlug = cache(
  async (slug: string): Promise<SanityTeamMemberDetail | null> => {
    const data = await client.fetch(
      TEAM_MEMBER_BY_SLUG_QUERY,
      { slug },
      { next: { tags: ["teamMember"], revalidate: false } },
    );
    if (!data) return null;

    const raw = data as SanityRawTeamMember;
    return {
      ...mapTeamMember(raw),
      createdAt: raw._createdAt ?? null,
      updatedAt: raw._updatedAt ?? null,
    };
  },
);

export async function getTeamMemberSlugs(): Promise<string[]> {
  const data = await client.fetch<unknown[]>(
    TEAM_MEMBER_SLUGS_QUERY,
    {},
    URL_PARAM_FETCH,
  );
  if (!data) return [];

  return data.filter(
    (slug): slug is string => typeof slug === "string" && isSafeSlug(slug),
  );
}

// ── Testimonials ──────────────────────────────────────────────────

export interface SanityTestimonial {
  _id: string;
  quote: string;
  authorName: string;
  authorTitle: string | null;
  company: string | null;
  avatarUrl: string;
  avatarAlt: string;
  companyLogoUrl: string;
  companyLogoAlt: string;
  rating: number | null;
  featured: boolean;
}

/** Raw testimonial from TESTIMONIALS_QUERY */
interface SanityRawTestimonial {
  _id: string;
  quote: string;
  authorName: string;
  authorTitle?: string | null;
  company?: string | null;
  avatar?: SanityImageRef | null;
  companyLogo?: SanityImageRef | null;
  rating?: number | null;
  featured?: boolean;
}

export async function getTestimonials(): Promise<SanityTestimonial[]> {
  const data = await client.fetch(
    TESTIMONIALS_QUERY,
    {},
    { next: { tags: ["testimonial"], revalidate: false } },
  );
  if (!data) return [];

  return (data as SanityRawTestimonial[]).map((t) => ({
    _id: t._id,
    quote: t.quote,
    authorName: t.authorName,
    authorTitle: t.authorTitle ?? null,
    company: t.company ?? null,
    avatarUrl: imageUrl(t.avatar, 200),
    avatarAlt: t.avatar?.alt ?? t.authorName,
    companyLogoUrl: imageUrl(t.companyLogo, 400),
    companyLogoAlt: t.companyLogo?.alt ?? t.company ?? "",
    rating: t.rating ?? null,
    featured: t.featured ?? false,
  }));
}

// ── Case Studies ──────────────────────────────────────────────────

export interface SanityCaseStudy {
  _id: string;
  title: string;
  slug: string;
  client: string;
  panelLabel: string | null;
  excerpt: string | null;
  publishedAt: string | null;
  heroImageUrl: string;
  heroImageLqip: string | undefined;
  cardImageUrl: string;
  cardImageLqip: string | undefined;
  services: string[];
  featured: boolean;
  quoteText: string | null;
}

export async function getCaseStudies(): Promise<SanityCaseStudy[]> {
  const data = await client.fetch(
    CASE_STUDIES_QUERY,
    {},
    { next: { tags: ["caseStudy"], revalidate: false } },
  );
  if (!data) return [];

  return (data as SanityRawCaseStudy[]).map((cs) => ({
    _id: cs._id,
    title: cs.title,
    slug: cs.slug?.current ?? "",
    client: cs.client,
    panelLabel: cs.panelLabel ?? null,
    excerpt: cs.excerpt ?? null,
    publishedAt: cs.publishedAt ?? null,
    heroImageUrl: imageUrl(cs.heroImage, 800),
    heroImageLqip: imageLqip(cs.heroImage),
    cardImageUrl: imageUrl(cs.cardImage ?? cs.heroImage, 800),
    cardImageLqip: imageLqip(cs.cardImage) ?? imageLqip(cs.heroImage),
    services: cs.services ?? [],
    featured: cs.featured ?? false,
    quoteText: cs.quoteText ?? null,
  }));
}

export interface CaseStudyGrowthChartData {
  headingMain?: string | null;
  headingHighlighted?: string | null;
  leftAxisLabel?: string | null;
  rightAxisLabel?: string | null;
  months?: string[] | null;
  series?: Array<{ label: string; color: string; points: number[] }> | null;
  tooltipMonth?: string | null;
  tooltipMetrics?: Array<{
    label?: string | null;
    value?: string | null;
  }> | null;
}

export interface SanityCaseStudyDetail {
  body?: PortableTextBlock[] | null;
  client: string;
  panelLabel?: string | null;
  slug?: { current: string } | null;
  excerpt?: string | null;
  heroImage?: SanityImageRef | null;
  metrics?: Array<{
    _key?: string;
    description?: string | null;
    label?: string | null;
    value?: string | null;
  }> | null;
  publishedAt?: string | null;
  seo?: {
    metaDescription?: string | null;
    metaTitle?: string | null;
  } | null;
  services?: string[] | null;
  title: string;
  titleHighlighted?: string | null;
  // ── Extended structured fields (PR 2.3 schema) ──
  heroSubtitle?: string | null;
  heroMetrics?: Array<{ _key?: string; value: string; label: string }> | null;
  caseOverview?: {
    label?: string | null;
    headingMain?: string | null;
    headingHighlighted?: string | null;
    body?: string | null;
  } | null;
  objectiveChallenges?: {
    label?: string | null;
    headingMain?: string | null;
    headingHighlighted?: string | null;
    body?: string | null;
    items?: Array<{
      _key?: string;
      number: string;
      title: string;
      body: string;
    }> | null;
  } | null;
  strategyPillars?: Array<{
    _key?: string;
    title: string;
    intro: string;
    bullets?: string[] | null;
    icon?: SanityImageRef | null;
  }> | null;
  journeyTimeline?: {
    label?: string | null;
    headingMain?: string | null;
    headingHighlighted?: string | null;
    items?: Array<{ _key?: string; title: string; body: string }> | null;
  } | null;
  numbersThatMatter?: {
    label?: string | null;
    headingMain?: string | null;
    headingHighlighted?: string | null;
    body?: string | null;
    items?: Array<{
      _key?: string;
      value: string;
      label: string;
      sub?: string | null;
      icon?: SanityImageRef | null;
    }> | null;
  } | null;
  growthChart?: CaseStudyGrowthChartData | null;
  proofData?: {
    label?: string | null;
    headingMain?: string | null;
    headingHighlighted?: string | null;
    body?: string | null;
    items?: Array<{
      _key?: string;
      title: string;
      body: string;
      image?: SanityImageRef | null;
      metricTags?: Array<{
        _key?: string;
        label?: string | null;
        value?: string | null;
        isAccent?: boolean | null;
      }> | null;
      isFullWidth?: boolean | null;
    }> | null;
  } | null;
  beforeAfter?: {
    label?: string | null;
    headingMain?: string | null;
    headingHighlighted?: string | null;
    body?: string | null;
    items?: Array<{
      _key?: string;
      label: string;
      before: string;
      after: string;
    }> | null;
  } | null;
  conclusion?: {
    heading?: string | null;
    gradientSubhead?: string | null;
    body?: PortableTextBlock[] | null;
  } | null;
  ctaFooter?: {
    label?: string | null;
    headingMain?: string | null;
    headingHighlighted?: string | null;
    body?: string | null;
    primaryCta?: { label?: string | null; url?: string | null } | null;
    secondaryCta?: { label?: string | null; url?: string | null } | null;
  } | null;
}

export const getCaseStudyBySlug = cache(
  async (slug: string): Promise<SanityCaseStudyDetail | null> => {
    const data = await client.fetch(
      CASE_STUDY_BY_SLUG_QUERY,
      { slug },
      { next: { tags: ["caseStudy"], revalidate: false } },
    );

    return (data as SanityCaseStudyDetail | null) ?? null;
  },
);

export async function getCaseStudySlugs(): Promise<string[]> {
  const data = await client.fetch<unknown[]>(
    CASE_STUDY_SLUGS_QUERY,
    {},
    URL_PARAM_FETCH,
  );
  if (!data) return [];

  return data.filter(
    (slug): slug is string => typeof slug === "string" && isSafeSlug(slug),
  );
}

// ── Podcast Episodes ──────────────────────────────────────────────

export interface SanityPodcastEpisodeSummary {
  _id: string;
  title: string;
  titleHighlighted?: string | null;
  slug: { current: string };
  episodeNumber: number;
  duration: string;
  description: string;
  publishedAt: string;
  guest?: {
    name?: string | null;
    role?: string | null;
    company?: string | null;
  } | null;
  heroImage?: SanityImageRef | null;
}

export interface SanityPodcastEpisodeDetail extends SanityPodcastEpisodeSummary {
  chatbotEpisodeId?: string | null;
  videoEmbedUrl?: string | null;
  guest?: {
    name?: string | null;
    role?: string | null;
    company?: string | null;
    bio?: string | null;
    linkedinUrl?: string | null;
    twitterUrl?: string | null;
    websiteUrl?: string | null;
    photo?: SanityImageRef | null;
  } | null;
  keyInsights?: {
    headingMain?: string | null;
    headingHighlighted?: string | null;
    body?: string | null;
    topicPills?: string[] | null;
    bullets?: string[] | null;
  } | null;
  bestMoments?: Array<{
    _key?: string;
    title?: string | null;
    thumbnail?: SanityImageRef | null;
    videoUrl?: string | null;
    caption?: string | null;
  }> | null;
  transcript?: PortableTextBlock[] | null;
  relatedEpisodes?: Array<{
    _id: string;
    title: string;
    slug: { current: string };
    episodeNumber: number;
    duration: string;
    heroImage?: SanityImageRef | null;
    guest?: { name?: string | null } | null;
  }> | null;
  seo?: SanitySeo | null;
}

export const getPodcastEpisodes = cache(
  async (): Promise<SanityPodcastEpisodeSummary[]> => {
    const data = await client.fetch(
      PODCAST_EPISODES_QUERY,
      {},
      { next: { tags: ["podcastEpisode"], revalidate: false } },
    );
    return (data as SanityPodcastEpisodeSummary[] | null) ?? [];
  },
);

export const getPodcastEpisodeBySlug = cache(
  async (slug: string): Promise<SanityPodcastEpisodeDetail | null> => {
    const data = await client.fetch(
      PODCAST_EPISODE_BY_SLUG_QUERY,
      { slug },
      { next: { tags: ["podcastEpisode"], revalidate: false } },
    );
    return (data as SanityPodcastEpisodeDetail | null) ?? null;
  },
);

export async function getPodcastEpisodeSlugs(): Promise<string[]> {
  const data = await client.fetch<unknown[]>(
    PODCAST_EPISODE_SLUGS_QUERY,
    {},
    URL_PARAM_FETCH,
  );
  if (!data) return [];

  return data.filter(
    (slug): slug is string => typeof slug === "string" && isSafeSlug(slug),
  );
}

// ── FAQ Items ─────────────────────────────────────────────────────

/** Raw faq item from FAQ_BY_SERVICE_QUERY */
interface SanityRawFaqItem {
  _id: string;
  question: string;
  answer: string;
  category?: string | null;
  servicePage?: string | null;
  order?: number | null;
}

export interface SanityFaqItem {
  _id: string;
  question: string;
  answer: string;
}

export async function getFaqItemsByService(
  service: string,
): Promise<SanityFaqItem[]> {
  const data = await client.fetch(
    FAQ_BY_SERVICE_QUERY,
    { service },
    { next: { tags: ["faqItem"], revalidate: false } },
  );
  if (!data) return [];

  return (data as SanityRawFaqItem[]).map((f) => ({
    _id: f._id,
    question: f.question,
    answer: f.answer,
  }));
}

// ── Partner Logos ─────────────────────────────────────────────────

export interface SanityPartnerLogo {
  _id: string;
  name: string;
  logoUrl: string;
  url: string | null;
}

export async function getPartnerLogos(): Promise<SanityPartnerLogo[]> {
  const data = await client.fetch(
    PARTNER_LOGOS_QUERY,
    {},
    { next: { tags: ["partnerLogo"], revalidate: false } },
  );
  if (!data) return [];

  return (data as SanityRawPartnerLogo[]).map((l) => ({
    _id: l._id,
    name: l.name,
    logoUrl: imageUrl(l.logo),
    url: l.url ?? null,
  }));
}

// ── Service Page ──────────────────────────────────────────────────



// ---------------------------------------------------------------------------
// Fixed-section service pages
// ---------------------------------------------------------------------------

type RawHeading = PortableTextBlock[] | null;
interface RawIconItem { _key: string; title?: string | null; description?: string | null; icon?: SanityRawPageImage | null }
interface RawFaq { items?: Array<{ question?: string | null; answer?: string | null }> | null }
interface RawSeoPage { seo?: SanitySeo | null }

const seoOf = (raw: RawSeoPage) =>
  raw.seo ? { metaTitle: raw.seo.metaTitle ?? null, metaDescription: raw.seo.metaDescription ?? null } : null;

interface SanityRawLinkBuildingPage extends RawSeoPage {
  _id: string;
  hero?: {
    title?: RawHeading; tagline?: string | null; label?: string | null; heading?: RawHeading;
    body?: RichBlock[] | null; ctaLabel?: string | null; ctaUrl?: string | null; image?: SanityRawPageImage | null;
  } | null;
  whyBacklinks?: { heading?: RawHeading; paragraphs?: string[] | null; image?: SanityRawPageImage | null } | null;
  howWeBuild?: {
    label?: string | null; heading?: RawHeading; intro?: string | null;
    cards?: Array<{ _key: string; title?: string | null; body?: string | null }> | null; closing?: string | null;
  } | null;
  solutions?: {
    label?: string | null; heading?: RawHeading;
    cards?: Array<{ _key: string; title?: string | null; subtitle?: string | null; body?: string | null; ctaLabel?: string | null; ctaUrl?: string | null; icon?: SanityRawPageImage | null }> | null;
    banner?: { heading?: RawHeading; processSteps?: Array<{ _key: string; label?: string | null; description?: string | null }> | null; ctaLabel?: string | null; ctaUrl?: string | null } | null;
  } | null;
  competitorInsights?: {
    label?: string | null; heading?: RawHeading;
    items?: Array<{ _key: string; title?: string | null; paragraphs?: string[] | null; chart?: SanityRawPageImage | null }> | null;
  } | null;
  whyChoose?: { label?: string | null; heading?: RawHeading; items?: RawIconItem[] | null; ctaTitle?: string | null; ctaLabel?: string | null; ctaUrl?: string | null } | null;
  faq?: RawFaq | null;
}

export interface SanityLinkBuildingPage {
  _id: string;
  content: LinkBuildingContent;
  seo: { metaTitle: string | null; metaDescription: string | null } | null;
}

export async function getLinkBuildingPage(): Promise<SanityLinkBuildingPage | null> {
  const data = await client.fetch(LINK_BUILDING_PAGE_QUERY, {}, { next: { tags: ["linkBuildingPage"], revalidate: false } });
  if (!data) return null;
  const raw = data as SanityRawLinkBuildingPage;
  const d = DEFAULT_LINK_BUILDING_CONTENT;

  const content: LinkBuildingContent = {
    hero: {
      title: headingSegments(raw.hero?.title, d.hero.title),
      tagline: text(raw.hero?.tagline, d.hero.tagline),
      label: text(raw.hero?.label, d.hero.label),
      heading: headingSegments(raw.hero?.heading, d.hero.heading),
      body: raw.hero?.body?.length ? raw.hero.body : d.hero.body,
      ctaLabel: text(raw.hero?.ctaLabel, d.hero.ctaLabel),
      ctaUrl: text(raw.hero?.ctaUrl, d.hero.ctaUrl),
      image: pageImage(raw.hero?.image, d.hero.image),
    },
    whyBacklinks: {
      heading: headingSegments(raw.whyBacklinks?.heading, d.whyBacklinks.heading),
      paragraphs: raw.whyBacklinks?.paragraphs?.length ? raw.whyBacklinks.paragraphs : d.whyBacklinks.paragraphs,
      image: pageImage(raw.whyBacklinks?.image, d.whyBacklinks.image),
    },
    howWeBuild: {
      label: text(raw.howWeBuild?.label, d.howWeBuild.label),
      heading: headingSegments(raw.howWeBuild?.heading, d.howWeBuild.heading),
      intro: text(raw.howWeBuild?.intro, d.howWeBuild.intro),
      cards: listOr(raw.howWeBuild?.cards, d.howWeBuild.cards, (c) => ({ title: c.title ?? "", body: c.body ?? "" })),
      closing: text(raw.howWeBuild?.closing, d.howWeBuild.closing),
    },
    solutions: {
      label: text(raw.solutions?.label, d.solutions.label),
      heading: headingSegments(raw.solutions?.heading, d.solutions.heading),
      cards: listOr(raw.solutions?.cards, d.solutions.cards, (c, i) => ({
        title: c.title ?? "",
        subtitle: c.subtitle ?? "",
        body: c.body ?? "",
        ctaLabel: text(c.ctaLabel, d.solutions.cards[i]?.ctaLabel ?? "Get Started"),
        ctaUrl: text(c.ctaUrl, "/contact"),
        icon: pageImage(c.icon, d.solutions.cards[i]?.icon ?? null),
      })),
      banner: {
        heading: headingSegments(raw.solutions?.banner?.heading, d.solutions.banner.heading),
        processSteps: listOr(raw.solutions?.banner?.processSteps, d.solutions.banner.processSteps, (s) => ({ label: s.label ?? "", description: s.description ?? "" })),
        ctaLabel: text(raw.solutions?.banner?.ctaLabel, d.solutions.banner.ctaLabel),
        ctaUrl: text(raw.solutions?.banner?.ctaUrl, d.solutions.banner.ctaUrl),
      },
    },
    competitorInsights: {
      label: text(raw.competitorInsights?.label, d.competitorInsights.label),
      heading: headingSegments(raw.competitorInsights?.heading, d.competitorInsights.heading),
      items: listOr(raw.competitorInsights?.items, d.competitorInsights.items, (item, i) => ({
        title: item.title ?? "",
        paragraphs: item.paragraphs ?? [],
        chart: pageImage(item.chart, d.competitorInsights.items[i]?.chart ?? null),
      })),
    },
    whyChoose: {
      label: text(raw.whyChoose?.label, d.whyChoose.label),
      heading: headingSegments(raw.whyChoose?.heading, d.whyChoose.heading),
      items: listOr(raw.whyChoose?.items, d.whyChoose.items, (item, i) => ({
        title: item.title ?? "",
        description: item.description ?? "",
        icon: pageImage(item.icon, d.whyChoose.items[i]?.icon ?? null),
      })),
      ctaTitle: text(raw.whyChoose?.ctaTitle, d.whyChoose.ctaTitle),
      ctaLabel: text(raw.whyChoose?.ctaLabel, d.whyChoose.ctaLabel),
      ctaUrl: text(raw.whyChoose?.ctaUrl, d.whyChoose.ctaUrl),
    },
    faq: { items: faqEntries(raw.faq?.items, d.faq.items) },
  };

  return { _id: raw._id, content, seo: seoOf(raw) };
}

interface SanityRawRedditMarketingPage extends RawSeoPage {
  _id: string;
  hero?: { heading?: RawHeading; subtitle?: string | null; tagline?: string | null; ctaLabel?: string | null; ctaUrl?: string | null; image?: SanityRawPageImage | null } | null;
  whyDifferent?: { label?: string | null; heading?: RawHeading; intro?: string | null; items?: RawIconItem[] | null } | null;
  opportunity?: { label?: string | null; heading?: RawHeading; intro?: string | null; cards?: RawIconItem[] | null } | null;
  whatWeDo?: { label?: string | null; heading?: RawHeading; intro?: string | null; cards?: Array<RawIconItem & { subtitle?: string | null }> | null } | null;
  serviceMenu?: { label?: string | null; heading?: RawHeading; cards?: Array<{ _key: string; title?: string | null; items?: string[] | null }> | null } | null;
  whatYouWin?: { label?: string | null; heading?: RawHeading; intro?: string | null; cards?: RawIconItem[] | null } | null;
  process?: { label?: string | null; heading?: RawHeading; intro?: string | null; steps?: Array<{ _key: string; number?: string | null; title?: string | null; description?: string | null; optional?: boolean | null }> | null } | null;
  reporting?: { label?: string | null; heading?: RawHeading; intro?: string | null; cards?: Array<{ _key: string; title?: string | null; body?: string | null }> | null } | null;
  whyTrust?: { label?: string | null; heading?: RawHeading; items?: Array<{ _key: string; title?: string | null; description?: string | null }> | null; ctaTitle?: string | null; ctaLabel?: string | null; ctaUrl?: string | null } | null;
  faq?: RawFaq | null;
}

export interface SanityRedditMarketingPage {
  _id: string;
  content: RedditMarketingContent;
  seo: { metaTitle: string | null; metaDescription: string | null } | null;
}

export async function getRedditMarketingPage(): Promise<SanityRedditMarketingPage | null> {
  const data = await client.fetch(REDDIT_MARKETING_PAGE_QUERY, {}, { next: { tags: ["redditMarketingPage"], revalidate: false } });
  if (!data) return null;
  const raw = data as SanityRawRedditMarketingPage;
  const d = DEFAULT_REDDIT_MARKETING_CONTENT;

  const iconItems = (items: RawIconItem[] | null | undefined, fallback: RedditMarketingContent["opportunity"]["cards"]) =>
    listOr(items, fallback, (item, i) => ({
      title: item.title ?? "",
      description: item.description ?? "",
      icon: pageImage(item.icon, fallback[i]?.icon ?? null),
    }));

  const content: RedditMarketingContent = {
    hero: {
      heading: headingSegments(raw.hero?.heading, d.hero.heading),
      subtitle: text(raw.hero?.subtitle, d.hero.subtitle),
      tagline: text(raw.hero?.tagline, d.hero.tagline),
      ctaLabel: text(raw.hero?.ctaLabel, d.hero.ctaLabel),
      ctaUrl: text(raw.hero?.ctaUrl, d.hero.ctaUrl),
      image: pageImage(raw.hero?.image, d.hero.image),
    },
    whyDifferent: {
      label: text(raw.whyDifferent?.label, d.whyDifferent.label),
      heading: headingSegments(raw.whyDifferent?.heading, d.whyDifferent.heading),
      intro: text(raw.whyDifferent?.intro, d.whyDifferent.intro),
      items: iconItems(raw.whyDifferent?.items, d.whyDifferent.items),
    },
    opportunity: {
      label: text(raw.opportunity?.label, d.opportunity.label),
      heading: headingSegments(raw.opportunity?.heading, d.opportunity.heading),
      intro: text(raw.opportunity?.intro, d.opportunity.intro),
      cards: iconItems(raw.opportunity?.cards, d.opportunity.cards),
    },
    whatWeDo: {
      label: text(raw.whatWeDo?.label, d.whatWeDo.label),
      heading: headingSegments(raw.whatWeDo?.heading, d.whatWeDo.heading),
      intro: text(raw.whatWeDo?.intro, d.whatWeDo.intro),
      cards: listOr(raw.whatWeDo?.cards, d.whatWeDo.cards, (c, i) => ({
        title: c.title ?? "",
        subtitle: c.subtitle ?? "",
        description: c.description ?? "",
        icon: pageImage(c.icon, d.whatWeDo.cards[i]?.icon ?? null),
      })),
    },
    serviceMenu: {
      label: text(raw.serviceMenu?.label, d.serviceMenu.label),
      heading: headingSegments(raw.serviceMenu?.heading, d.serviceMenu.heading),
      cards: listOr(raw.serviceMenu?.cards, d.serviceMenu.cards, (c) => ({ title: c.title ?? "", items: c.items ?? [] })),
    },
    whatYouWin: {
      label: text(raw.whatYouWin?.label, d.whatYouWin.label),
      heading: headingSegments(raw.whatYouWin?.heading, d.whatYouWin.heading),
      intro: text(raw.whatYouWin?.intro, d.whatYouWin.intro),
      cards: iconItems(raw.whatYouWin?.cards, d.whatYouWin.cards),
    },
    process: {
      label: text(raw.process?.label, d.process.label),
      heading: headingSegments(raw.process?.heading, d.process.heading),
      intro: text(raw.process?.intro, d.process.intro),
      steps: listOr(raw.process?.steps, d.process.steps, (s, i) => ({
        number: text(s.number, String(i + 1).padStart(2, "0")),
        title: s.title ?? "",
        description: s.description ?? "",
        optional: Boolean(s.optional),
      })),
    },
    reporting: {
      label: text(raw.reporting?.label, d.reporting.label),
      heading: headingSegments(raw.reporting?.heading, d.reporting.heading),
      intro: text(raw.reporting?.intro, d.reporting.intro),
      cards: listOr(raw.reporting?.cards, d.reporting.cards, (c) => ({ title: c.title ?? "", body: c.body ?? "" })),
    },
    whyTrust: {
      label: text(raw.whyTrust?.label, d.whyTrust.label),
      heading: headingSegments(raw.whyTrust?.heading, d.whyTrust.heading),
      items: listOr(raw.whyTrust?.items, d.whyTrust.items, (item) => ({ title: item.title ?? "", description: item.description ?? "" })),
      ctaTitle: text(raw.whyTrust?.ctaTitle, d.whyTrust.ctaTitle),
      ctaLabel: text(raw.whyTrust?.ctaLabel, d.whyTrust.ctaLabel),
      ctaUrl: text(raw.whyTrust?.ctaUrl, d.whyTrust.ctaUrl),
    },
    faq: { items: faqEntries(raw.faq?.items, d.faq.items) },
  };

  return { _id: raw._id, content, seo: seoOf(raw) };
}

// ---------------------------------------------------------------------------
// SEO hub + six service pages (one document type, keyed by pageKey)
// ---------------------------------------------------------------------------

interface SanityRawSeoServicePage extends RawSeoPage {
  _id: string;
  hero?: {
    title?: RawHeading; tagline?: RawHeading; label?: string | null; heading?: RawHeading;
    paragraphs?: string[] | null; ctaLabel?: string | null; ctaUrl?: string | null; image?: SanityRawPageImage | null;
  } | null;
  solutions?: {
    label?: string | null; heading?: RawHeading;
    cards?: Array<{ _key: string; title?: string | null; subtitle?: string | null; body?: string | null; ctaLabel?: string | null; ctaUrl?: string | null; icon?: SanityRawPageImage | null }> | null;
    hubCards?: Array<{ _key: string; title?: string | null; description?: string | null; descriptionGradient?: boolean | null; backIntro?: string | null; backPoints?: string[] | null; href?: string | null; image?: SanityRawPageImage | null }> | null;
    banner?: { heading?: RawHeading; steps?: Array<{ _key: string; label?: string | null; description?: string | null }> | null; ctaLabel?: string | null; ctaUrl?: string | null } | null;
  } | null;
  whyChoose?: { label?: string | null; heading?: RawHeading; items?: RawIconItem[] | null; ctaTitle?: string | null; ctaLabel?: string | null; ctaUrl?: string | null } | null;
  faq?: RawFaq | null;
}

export interface SanitySeoServicePage {
  _id: string;
  content: SeoServiceContent;
  seo: { metaTitle: string | null; metaDescription: string | null } | null;
}

export async function getSeoServicePage(pageKey: SeoServicePageKey): Promise<SanitySeoServicePage | null> {
  const data = await client.fetch(SEO_SERVICE_PAGE_QUERY, { pageKey }, { next: { tags: ["seoServicePage"], revalidate: false } });
  if (!data) return null;
  const raw = data as SanityRawSeoServicePage;
  const d = seoServicePage(pageKey).content;

  const bannerRaw = raw.solutions?.banner;
  const banner = d.solutions.banner
    ? {
        heading: headingSegments(bannerRaw?.heading, d.solutions.banner.heading),
        steps: listOr(bannerRaw?.steps, d.solutions.banner.steps, (s) => ({ label: s.label ?? "", description: s.description ?? "" })),
        ctaLabel: text(bannerRaw?.ctaLabel, d.solutions.banner.ctaLabel),
        ctaUrl: text(bannerRaw?.ctaUrl, d.solutions.banner.ctaUrl),
      }
    : null;

  const content: SeoServiceContent = {
    hero: {
      title: headingSegments(raw.hero?.title, d.hero.title),
      tagline: headingSegments(raw.hero?.tagline, d.hero.tagline),
      label: text(raw.hero?.label, d.hero.label),
      heading: headingSegments(raw.hero?.heading, d.hero.heading),
      paragraphs: raw.hero?.paragraphs?.length ? raw.hero.paragraphs : d.hero.paragraphs,
      ctaLabel: text(raw.hero?.ctaLabel, d.hero.ctaLabel),
      ctaUrl: text(raw.hero?.ctaUrl, d.hero.ctaUrl),
      image: pageImage(raw.hero?.image, d.hero.image),
    },
    solutions: {
      label: text(raw.solutions?.label, d.solutions.label),
      heading: headingSegments(raw.solutions?.heading, d.solutions.heading),
      cards: listOr(raw.solutions?.cards, d.solutions.cards, (c, i) => ({
        title: c.title ?? "",
        subtitle: c.subtitle ?? "",
        body: c.body ?? "",
        ctaLabel: text(c.ctaLabel, d.solutions.cards[i]?.ctaLabel ?? "Get Started"),
        ctaUrl: text(c.ctaUrl, d.solutions.cards[i]?.ctaUrl ?? "/contact"),
        icon: pageImage(c.icon, d.solutions.cards[i]?.icon ?? null),
      })),
      hubCards: listOr(raw.solutions?.hubCards, d.solutions.hubCards, (c, i) => ({
        title: c.title ?? "",
        description: c.description ?? "",
        descriptionGradient: Boolean(c.descriptionGradient),
        image: pageImage(c.image, d.solutions.hubCards[i]?.image ?? null),
        backIntro: c.backIntro ?? "",
        backPoints: c.backPoints ?? [],
        href: text(c.href, d.solutions.hubCards[i]?.href ?? "/seo"),
      })),
      banner,
    },
    whyChoose: {
      label: text(raw.whyChoose?.label, d.whyChoose.label),
      heading: headingSegments(raw.whyChoose?.heading, d.whyChoose.heading),
      items: listOr(raw.whyChoose?.items, d.whyChoose.items, (item, i) => ({
        title: item.title ?? "",
        description: item.description ?? "",
        icon: pageImage(item.icon, d.whyChoose.items[i]?.icon ?? null),
      })),
      ctaTitle: text(raw.whyChoose?.ctaTitle, d.whyChoose.ctaTitle),
      ctaLabel: text(raw.whyChoose?.ctaLabel, d.whyChoose.ctaLabel),
      ctaUrl: text(raw.whyChoose?.ctaUrl, d.whyChoose.ctaUrl),
    },
    faq: { items: faqEntries(raw.faq?.items, d.faq.items) },
  };

  return { _id: raw._id, content, seo: seoOf(raw) };
}
