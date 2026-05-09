import { defineQuery } from "next-sanity";

// Pre-launch audit fixtures live in the production dataset under
// deterministic IDs prefixed with `audit-fixture-`. Each public-facing
// query gates them via `!(_id match "audit-fixture-*")` so the docs
// stay queryable from audit scripts but never leak to the site.

// --- Blog Posts ---

export const POSTS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current) && !(_id match "audit-fixture-*")] | order(publishedAt desc) [0...12] {
    _id,
    title,
    slug,
    excerpt,
    mainImage { ..., asset->{ _id, _type, metadata { lqip } } },
    publishedAt,
    categories,
    author-> { name, photo }
  }
`);

export const POST_BY_SLUG_QUERY = defineQuery(`
  *[_type == "post" && slug.current == $slug && !(_id match "audit-fixture-*")][0] {
    _id,
    title,
    titleHighlighted,
    slug,
    excerpt,
    mainImage { ..., asset->{ _id, _type, metadata { lqip } } },
    body,
    publishedAt,
    categories,
    author-> {
      name,
      role,
      photo { ..., asset->{ _id, _type, metadata { lqip } } },
      bio,
      bioParagraphs,
      linkedin
    },
    seo
  }
`);

export const POST_SLUGS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current) && !(_id match "audit-fixture-*")].slug.current
`);

// --- Case Studies ---

export const CASE_STUDIES_QUERY = defineQuery(`
  *[_type == "caseStudy" && defined(slug.current) && !(_id match "audit-fixture-*")] | order(publishedAt desc) {
    _id,
    title,
    slug,
    client,
    panelLabel,
    excerpt,
    publishedAt,
    heroImage { ..., asset->{ _id, _type, metadata { lqip } } },
    cardImage { ..., asset->{ _id, _type, metadata { lqip } } },
    metrics,
    services,
    featured,
    quoteText
  }
`);

export const CASE_STUDY_BY_SLUG_QUERY = defineQuery(`
  *[_type == "caseStudy" && slug.current == $slug && !(_id match "audit-fixture-*")][0] {
    _id,
    title,
    titleHighlighted,
    slug,
    client,
    panelLabel,
    excerpt,
    heroImage { ..., asset->{ _id, _type, metadata { lqip } } },
    metrics,
    body,
    services,
    publishedAt,
    heroSubtitle,
    heroMetrics,
    caseOverview,
    objectiveChallenges {
      label,
      headingMain,
      headingHighlighted,
      body,
      items[] { _key, number, title, body }
    },
    strategyPillars[] {
      _key,
      title,
      intro,
      bullets,
      icon { ..., asset->{ _id, _type, metadata { lqip } } }
    },
    journeyTimeline,
    numbersThatMatter {
      label,
      headingMain,
      headingHighlighted,
      body,
      items[] {
        _key,
        value,
        label,
        sub,
        icon { ..., asset->{ _id, _type, metadata { lqip } } }
      }
    },
    growthChart,
    proofData {
      label,
      headingMain,
      headingHighlighted,
      body,
      items[] {
        _key,
        title,
        body,
        image { ..., asset->{ _id, _type, metadata { lqip } } },
        metricTags,
        isFullWidth
      }
    },
    beforeAfter,
    conclusion,
    ctaFooter,
    seo
  }
`);

export const CASE_STUDY_SLUGS_QUERY = defineQuery(`
  *[_type == "caseStudy" && defined(slug.current) && !(_id match "audit-fixture-*")].slug.current
`);

export const FEATURED_CASE_STUDIES_QUERY = defineQuery(`
  *[_type == "caseStudy" && featured == true && !(_id match "audit-fixture-*")] | order(publishedAt desc) [0...6] {
    _id,
    title,
    slug,
    client,
    excerpt,
    heroImage,
    quoteText
  }
`);

// --- Testimonials ---

export const TESTIMONIALS_QUERY = defineQuery(`
  *[_type == "testimonial" && !(_id match "audit-fixture-*")] | order(order asc) {
    _id,
    quote,
    authorName,
    authorTitle,
    company,
    avatar,
    companyLogo,
    rating,
    featured
  }
`);

// --- FAQ Items ---

export const FAQ_BY_SERVICE_QUERY = defineQuery(`
  *[_type == "faqItem" && servicePage == $service] | order(order asc) {
    _id,
    question,
    answer
  }
`);

// --- Team Members ---

export const TEAM_MEMBERS_QUERY = defineQuery(`
  *[_type == "teamMember" && showOnAboutPage != false && !(_id match "audit-fixture-*")] | order(order asc) {
    _id,
    name,
    slug,
    role,
    department,
    photo { ..., asset->{ _id, _type, metadata { lqip } } },
    cardImage { ..., asset->{ _id, _type, metadata { lqip } } },
    bio,
    bioParagraphs,
    contact,
    socialLinks[] { _key, platform, url },
    linkedin,
    showOnAboutPage
  }
`);

export const TEAM_MEMBER_BY_SLUG_QUERY = defineQuery(`
  *[_type == "teamMember" && slug.current == $slug && !(_id match "audit-fixture-*")][0] {
    _id,
    name,
    slug,
    role,
    department,
    photo { ..., asset->{ _id, _type, metadata { lqip } } },
    cardImage { ..., asset->{ _id, _type, metadata { lqip } } },
    bio,
    bioParagraphs,
    personalTraits,
    spareTimeBullets,
    qaItems[]{ question, answer },
    "lifestylePhotos": lifestylePhotos[]{
      "url": asset->url,
      "alt": alt,
      "width": asset->metadata.dimensions.width,
      "height": asset->metadata.dimensions.height,
      "lqip": asset->metadata.lqip
    },
    contact,
    socialLinks[] { _key, platform, url },
    linkedin,
    showOnAboutPage,
    _createdAt,
    _updatedAt
  }
`);

export const TEAM_MEMBER_SLUGS_QUERY = defineQuery(`
  *[
    _type == "teamMember"
    && defined(slug.current)
    && showOnAboutPage != false
    && !(_id match "audit-fixture-*")
  ].slug.current
`);

// --- Partner Logos ---

export const PARTNER_LOGOS_QUERY = defineQuery(`
  *[_type == "partnerLogo" && featured == true && !(_id match "audit-fixture-*")] | order(order asc) {
    _id,
    name,
    logo,
    url,
    featured,
    partner
  }
`);

export const PARTNERSHIP_LOGOS_QUERY = defineQuery(`
  *[_type == "partnerLogo" && partner == true && !(_id match "audit-fixture-*")] | order(order asc) {
    _id,
    name,
    logo,
    url,
    featured,
    partner
  }
`);

export const ALL_PARTNER_LOGOS_QUERY = defineQuery(`
  *[_type == "partnerLogo" && !(_id match "audit-fixture-*")] | order(order asc) {
    _id,
    name,
    logo,
    url,
    featured,
    partner
  }
`);

// --- Site Settings ---

export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings"][0] {
    companyName,
    phone,
    email,
    socialLinks[] { _key, platform, url },
    copyrightText,
    navItems[] { _key, label, href, children[] { _key, label, href } },
    footerNavItems[] { _key, label, href },
    footerCtaHeading,
    footerCtaBody,
    footerCtaLabel,
    footerCtaUrl,
    headerCtaLabel,
    headerCtaUrl
  }
`);

// --- Partnership Page ---

export const PARTNERSHIP_PAGE_QUERY = defineQuery(`
  *[_type == "partnershipPage"][0] {
    _id,
    title,
    intro,
    heroCtaLabel,
    heroCtaUrl,
    body,
    seo
  }
`);

// --- Contact + Legal Pages ---

export const CONTACT_PAGE_QUERY = defineQuery(`
  *[_type == "contactPage"][0] {
    _id,
    title,
    intro,
    email,
    seo
  }
`);

export const LEGAL_PAGE_BY_SLUG_QUERY = defineQuery(`
  *[_type == "legalPage" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    intro,
    body,
    contactEmail,
    seo
  }
`);

// --- Service Pages ---

export const SERVICE_PAGE_BY_SLUG_QUERY = defineQuery(`
  *[_type == "servicePage" && slug.current == $slug && !(_id match "audit-fixture-*")][0] {
    _id,
    serviceType,
    slug,
    heroTitle,
    heroDescription,
    heroCtaLabel,
    heroCtaUrl,
    heroImage { ..., asset->{ _id, _type, metadata { lqip } } },
    solutionSectionLabel,
    solutionSectionHeading,
    serviceCards[] { _key, title, subtitle, body, icon, iconSrc },
    processSteps[] { _key, title, description },
    whyChooseItems[] { _key, title, description, icon, iconSrc },
    faqItems[]-> { _id, question, answer },
    relatedCaseStudies[]-> { _id, title, slug, client, excerpt, heroImage { ..., asset->{ _id, _type, metadata { lqip } } } },
    seo
  }
`);

// --- Podcast Episodes ---

export const PODCAST_EPISODES_QUERY = defineQuery(`
  *[_type == "podcastEpisode" && defined(slug.current) && !(_id match "audit-fixture-*")] | order(publishedAt desc) {
    _id,
    title,
    titleHighlighted,
    slug,
    episodeNumber,
    duration,
    description,
    publishedAt,
    guest { name, role, company },
    heroImage { ..., asset->{ _id, _type, metadata { lqip } } }
  }
`);

export const PODCAST_EPISODE_BY_SLUG_QUERY = defineQuery(`
  *[_type == "podcastEpisode" && slug.current == $slug && !(_id match "audit-fixture-*")][0] {
    _id,
    title,
    titleHighlighted,
    slug,
    episodeNumber,
    duration,
    chatbotEpisodeId,
    description,
    publishedAt,
    videoEmbedUrl,
    guest {
      name,
      role,
      company,
      bio,
      linkedinUrl,
      twitterUrl,
      websiteUrl,
      photo { ..., asset->{ _id, _type, metadata { lqip } } }
    },
    heroImage { ..., asset->{ _id, _type, metadata { lqip } } },
    keyInsights,
    bestMoments[] {
      _key,
      title,
      thumbnail { ..., asset->{ _id, _type, metadata { lqip } } },
      videoUrl,
      caption
    },
    transcript,
    relatedEpisodes[]-> {
      _id,
      title,
      slug,
      episodeNumber,
      duration,
      heroImage { ..., asset->{ _id, _type, metadata { lqip } } },
      guest { name }
    },
    seo
  }
`);

export const PODCAST_EPISODE_SLUGS_QUERY = defineQuery(`
  *[_type == "podcastEpisode" && defined(slug.current) && !(_id match "audit-fixture-*")].slug.current
`);
