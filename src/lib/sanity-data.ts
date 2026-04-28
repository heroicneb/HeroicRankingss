import { cache } from "react";
import type { PortableTextBlock } from "@portabletext/react";
import { sanityFetch } from "@/sanity/lib/live";
import { urlFor } from "@/sanity/lib/image";
import { client } from "@/sanity/lib/client";
import {
  SITE_SETTINGS_QUERY,
  POSTS_QUERY,
  POST_BY_SLUG_QUERY,
  POST_SLUGS_QUERY,
  TEAM_MEMBERS_QUERY,
  CASE_STUDIES_QUERY,
  CASE_STUDY_BY_SLUG_QUERY,
  CASE_STUDY_SLUGS_QUERY,
  CONTACT_PAGE_QUERY,
  FAQ_BY_SERVICE_QUERY,
  LEGAL_PAGE_BY_SLUG_QUERY,
  PARTNER_LOGOS_QUERY,
  PARTNERSHIP_PAGE_QUERY,
  PODCAST_EPISODES_QUERY,
  PODCAST_EPISODE_BY_SLUG_QUERY,
  PODCAST_EPISODE_SLUGS_QUERY,
  SERVICE_PAGE_BY_SLUG_QUERY,
  TESTIMONIALS_QUERY,
} from "@/sanity/lib/queries";
import type { NavItem, NavLink } from "@/types";

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
  slug?: { current: string };
  excerpt?: string | null;
  mainImage?: SanityImageRef | null;
  publishedAt?: string | null;
  categories?: unknown[] | null;
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
interface SanityRawFaqItem {
  _id: string;
  question: string;
  answer: string;
}

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
  contact?: { email?: string | null; phone?: string | null } | null;
  socialLinks?: SanityRawSocialLink[] | null;
  linkedin?: string | null;
  showOnAboutPage?: boolean;
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
  title: string;
  intro?: string | null;
  heroCtaLabel?: string | null;
  heroCtaUrl?: string | null;
  body?: PortableTextBlock[] | null;
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
interface SanityRawServiceCard {
  _key: string;
  title: string;
  subtitle?: string | null;
  body?: string | null;
  icon?: SanityImageRef | null;
  iconSrc?: string | null;
}

/** Raw process step sub-object */
interface SanityRawProcessStep {
  _key: string;
  title: string;
  description?: string | null;
}

/** Raw why-choose item sub-object */
interface SanityRawWhyChooseItem {
  _key: string;
  title: string;
  description?: string | null;
  icon?: SanityImageRef | null;
  iconSrc?: string | null;
}

/** Raw related case study reference (expanded via `->`) */
interface SanityRawRelatedCaseStudy {
  _id: string;
  title: string;
  slug?: { current: string };
  client: string;
  excerpt?: string | null;
  heroImage?: SanityImageRef | null;
}

/** Raw service page from SERVICE_PAGE_BY_SLUG_QUERY */
interface SanityRawServicePage {
  _id: string;
  serviceType: string;
  slug?: { current: string };
  heroTitle: string;
  heroDescription?: string | null;
  heroCtaLabel?: string | null;
  heroCtaUrl?: string | null;
  heroImage?: SanityImageRef | null;
  solutionSectionLabel?: string | null;
  solutionSectionHeading?: string | null;
  serviceCards?: SanityRawServiceCard[] | null;
  processSteps?: SanityRawProcessStep[] | null;
  whyChooseItems?: SanityRawWhyChooseItem[] | null;
  faqItems?: SanityRawFaqItem[] | null;
  relatedCaseStudies?: SanityRawRelatedCaseStudy[] | null;
  seo?: SanitySeo | null;
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
  excerpt: string | null;
  mainImageAlt: string;
  mainImageLqip: string | undefined;
  mainImageUrl: string;
  publishedAt: string | null;
  slug: string;
  title: string;
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
  const { data } = await sanityFetch({ query: POSTS_QUERY });
  if (!data) return [];

  return (data as SanityRawPost[]).map((post) => ({
    _id: post._id,
    title: post.title,
    slug: post.slug?.current ?? "",
    excerpt: post.excerpt ?? null,
    mainImageUrl: imageUrl(post.mainImage, 1200),
    mainImageLqip: imageLqip(post.mainImage),
    mainImageAlt: post.mainImage?.alt ?? post.title,
    publishedAt: post.publishedAt ?? null,
    categories: (post.categories ?? []).filter(
      (category: unknown): category is string => typeof category === "string",
    ),
  }));
}

export const getPostBySlug = cache(
  async (slug: string): Promise<SanityPostDetail | null> => {
    const { data } = await sanityFetch({
      query: POST_BY_SLUG_QUERY,
      params: { slug },
    });
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
      slug: post.slug?.current ?? slug,
      excerpt: post.excerpt ?? null,
      mainImageUrl: imageUrl(post.mainImage, 1200),
      mainImageLqip: imageLqip(post.mainImage),
      mainImageAlt: post.mainImage?.alt ?? post.title,
      publishedAt: post.publishedAt ?? null,
      categories: (post.categories ?? []).filter(
        (category: unknown): category is string => typeof category === "string",
      ),
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
  const data = await client.fetch<unknown[]>(POST_SLUGS_QUERY);
  if (!data) return [];

  return data.filter(
    (slug): slug is string => typeof slug === "string" && slug.length > 0,
  );
}

// ── Partnership Page ───────────────────────────────────────────────

export interface SanityPartnershipPage {
  _id: string;
  body: PortableTextBlock[] | null;
  heroCtaLabel: string | null;
  heroCtaUrl: string | null;
  intro: string | null;
  seoDescription: string | null;
  seoTitle: string | null;
  title: string;
}

export async function getPartnershipPage(): Promise<SanityPartnershipPage | null> {
  const { data } = await sanityFetch({ query: PARTNERSHIP_PAGE_QUERY });
  if (!data) return null;

  const page = data as SanityRawPartnershipPage;
  return {
    _id: page._id,
    title: page.title,
    intro: page.intro ?? null,
    heroCtaLabel: page.heroCtaLabel ?? null,
    heroCtaUrl: page.heroCtaUrl ?? null,
    body: page.body ?? null,
    seoTitle: page.seo?.metaTitle ?? null,
    seoDescription: page.seo?.metaDescription ?? null,
  };
}

// ── Contact + Legal Pages ─────────────────────────────────────────

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
  const { data } = await sanityFetch({ query: CONTACT_PAGE_QUERY });
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
  const { data } = await sanityFetch({
    query: LEGAL_PAGE_BY_SLUG_QUERY,
    params: { slug },
  });
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
  const { data } = await sanityFetch({ query: SITE_SETTINGS_QUERY });
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
  contact: { email: string | null; phone: string | null } | null;
  socialLinks: Array<{ platform: string; url: string }>;
}

export async function getTeamMembers(): Promise<SanityTeamMember[]> {
  const { data } = await sanityFetch({ query: TEAM_MEMBERS_QUERY });
  if (!data) return [];

  return (data as SanityRawTeamMember[]).map((m) => ({
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
    contact: m.contact
      ? { email: m.contact.email ?? null, phone: m.contact.phone ?? null }
      : null,
    socialLinks: (m.socialLinks ?? []).map((sl: SanityRawSocialLink) => ({
      platform: sl.platform,
      url: sl.url,
    })),
  }));
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
  const { data } = await sanityFetch({ query: TESTIMONIALS_QUERY });
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
  const { data } = await sanityFetch({ query: CASE_STUDIES_QUERY });
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
    const { data } = await sanityFetch({
      query: CASE_STUDY_BY_SLUG_QUERY,
      params: { slug },
    });

    return (data as SanityCaseStudyDetail | null) ?? null;
  },
);

export async function getCaseStudySlugs(): Promise<string[]> {
  const data = await client.fetch<unknown[]>(CASE_STUDY_SLUGS_QUERY);
  if (!data) return [];

  return data.filter(
    (slug): slug is string => typeof slug === "string" && slug.length > 0,
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
    const { data } = await sanityFetch({ query: PODCAST_EPISODES_QUERY });
    return (data as SanityPodcastEpisodeSummary[] | null) ?? [];
  },
);

export const getPodcastEpisodeBySlug = cache(
  async (slug: string): Promise<SanityPodcastEpisodeDetail | null> => {
    const { data } = await sanityFetch({
      query: PODCAST_EPISODE_BY_SLUG_QUERY,
      params: { slug },
    });
    return (data as SanityPodcastEpisodeDetail | null) ?? null;
  },
);

export async function getPodcastEpisodeSlugs(): Promise<string[]> {
  const data = await client.fetch<unknown[]>(PODCAST_EPISODE_SLUGS_QUERY);
  if (!data) return [];

  return data.filter(
    (slug): slug is string => typeof slug === "string" && slug.length > 0,
  );
}

// ── FAQ Items ─────────────────────────────────────────────────────

export interface SanityFaqItem {
  _id: string;
  question: string;
  answer: string;
}

export async function getFaqItemsByService(
  service: string,
): Promise<SanityFaqItem[]> {
  const { data } = await sanityFetch({
    query: FAQ_BY_SERVICE_QUERY,
    params: { service },
  });
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
  const { data } = await sanityFetch({ query: PARTNER_LOGOS_QUERY });
  if (!data) return [];

  return (data as SanityRawPartnerLogo[]).map((l) => ({
    _id: l._id,
    name: l.name,
    logoUrl: imageUrl(l.logo),
    url: l.url ?? null,
  }));
}

// ── Service Page ──────────────────────────────────────────────────

export interface SanityServicePage {
  _id: string;
  serviceType: string;
  slug: string;
  heroTitle: string;
  heroDescription: string | null;
  heroCtaLabel: string | null;
  heroCtaUrl: string | null;
  heroImageUrl: string;
  heroImageLqip: string | undefined;
  solutionSectionLabel: string | null;
  solutionSectionHeading: string | null;
  serviceCards: Array<{
    title: string;
    subtitle: string | null;
    body: string | null;
    iconUrl: string | null;
  }>;
  processSteps: Array<{ title: string; description: string | null }>;
  whyChooseItems: Array<{
    title: string;
    description: string | null;
    iconUrl: string | null;
  }>;
  faqItems: SanityFaqItem[];
  relatedCaseStudies: Array<{
    _id: string;
    title: string;
    slug: string;
    client: string;
    excerpt: string | null;
    heroImageUrl: string;
  }>;
}

export async function getServicePage(
  slug: string,
): Promise<SanityServicePage | null> {
  const { data } = await sanityFetch({
    query: SERVICE_PAGE_BY_SLUG_QUERY,
    params: { slug },
  });
  if (!data) return null;

  const d = data as SanityRawServicePage;
  return {
    _id: d._id,
    serviceType: d.serviceType,
    slug: d.slug?.current ?? slug,
    heroTitle: d.heroTitle,
    heroDescription: d.heroDescription ?? null,
    heroCtaLabel: d.heroCtaLabel ?? null,
    heroCtaUrl: d.heroCtaUrl ?? null,
    heroImageUrl: imageUrl(d.heroImage, 1200),
    heroImageLqip: imageLqip(d.heroImage),
    solutionSectionLabel: d.solutionSectionLabel ?? null,
    solutionSectionHeading: d.solutionSectionHeading ?? null,
    serviceCards: (d.serviceCards ?? []).map((c: SanityRawServiceCard) => ({
      title: c.title,
      subtitle: c.subtitle ?? null,
      body: c.body ?? null,
      iconUrl: imageUrl(c.icon, 200) || c.iconSrc || null,
    })),
    processSteps: (d.processSteps ?? []).map((s: SanityRawProcessStep) => ({
      title: s.title,
      description: s.description ?? null,
    })),
    whyChooseItems: (d.whyChooseItems ?? []).map(
      (w: SanityRawWhyChooseItem) => ({
        title: w.title,
        description: w.description ?? null,
        iconUrl: imageUrl(w.icon, 200) || w.iconSrc || null,
      }),
    ),
    faqItems: (d.faqItems ?? []).filter(Boolean).map((f: SanityRawFaqItem) => ({
      _id: f._id,
      question: f.question,
      answer: f.answer,
    })),
    relatedCaseStudies: (d.relatedCaseStudies ?? [])
      .filter(Boolean)
      .map((cs: SanityRawRelatedCaseStudy) => ({
        _id: cs._id,
        title: cs.title,
        slug: cs.slug?.current ?? "",
        client: cs.client,
        excerpt: cs.excerpt ?? null,
        heroImageUrl: imageUrl(cs.heroImage, 800),
      })),
  };
}
