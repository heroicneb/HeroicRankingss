import { defineQuery } from "next-sanity";

// Pre-launch audit fixtures live in the production dataset under
// deterministic IDs prefixed with `audit-fixture-`. Each public-facing
// query gates them via `!(_id match "audit-fixture-*")` so the docs
// stay queryable from audit scripts but never leak to the site.

// --- Blog Posts ---

export const POSTS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current) && !(_id match "audit-fixture-*")] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    mainImage { ..., asset->{ _id, _type, metadata { lqip } } },
    publishedAt,
    categories,
    urlCategory,
    readTime,
    "bodyLength": length(pt::text(body)),
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
    _updatedAt,
    categories,
    urlCategory,
    readTime,
    "bodyLength": length(pt::text(body)),
    author-> {
      name,
      "slug": slug.current,
      role,
      photo { ..., asset->{ _id, _type, metadata { lqip } } },
      bio,
      bioParagraphs,
      linkedin
    },
    seo,
    faqSchema { mode, items[] { question, answer } }
  }
`);

export const POST_SLUGS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current) && !(_id match "audit-fixture-*")].slug.current
`);

export const POST_URLS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current) && !(_id match "audit-fixture-*")] {
    "slug": slug.current,
    urlCategory
  }
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
    _updatedAt,
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
    strategyIntro,
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
        interactiveVisual,
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
  *[_type == "caseStudy" && featured == true && defined(slug.current) && !(_id match "audit-fixture-*")] | order(publishedAt desc) [0...3] {
    _id,
    title,
    slug,
    client,
    panelLabel,
    excerpt,
    publishedAt,
    heroImage { ..., asset->{ _id, _type, metadata { lqip } } },
    cardImage { ..., asset->{ _id, _type, metadata { lqip } } },
    services,
    featured,
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
    featured,
    sourceUrl,
    order
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
    seo,
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

export const CLIENT_LOGOS_QUERY = defineQuery(`
  *[_type == "clientLogo" && defined(logo.asset) && !(_id match "audit-fixture-*")] | order(order asc, name asc) {
    _id,
    name,
    logo,
    "dimensions": logo.asset->metadata.dimensions,
    logoHeight,
    url
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

// Image projection shared by the fixed-section page documents.
const PAGE_IMAGE = `{ alt, asset->{ url, metadata { dimensions { width, height } } } }`;

export const HOME_PAGE_QUERY = defineQuery(`
  *[_type == "homePage"][0] {
    _id,
    hero { heading, paragraphs, ctaLabel, ctaUrl },
    services { label, heading, ctaLabel, ctaUrl, cards[] { _key, title, descriptionLines, url, image ${PAGE_IMAGE} } },
    about { label, heading, paragraphs },
    team {
      label, heading, statValue, statLabel, ctaLabel, ctaUrl,
      members[]-> { _id, name, role, slug, photo ${PAGE_IMAGE} }
    },
    aiVisibility {
      label, heading, intro,
      scenarios[] { _key, label, prompt, answerWithout, answerWith },
      sources[] { _key, label, detail, services[] { _key, label, href } },
      pillars[] { _key, title, body, ctaLabel, href },
      proof[] { _key, label, value, prefix, suffix },
      proofNote, proofHref, ctaLabel, ctaUrl, disclaimer
    },
    stats { label, heading, body, ctaLabel, ctaUrl, items[] { _key, metric, detail, image ${PAGE_IMAGE} } },
    featuredLogos { heading },
    caseStudies { label, heading, body, ctaLabel, ctaUrl, quotes },
    trustedBy { label, heading },
    featuredPodcasts { label, heading, ctaLabel, ctaUrl },
    trust { label, heading, ctaLabel, ctaUrl, certifications[] { _key, label, tone } },
    partnerships { label, statement, paragraphs, ctaLabel, ctaUrl },
    blog { label, heading, ctaLabel, ctaUrl },
    testimonials { label, heading, ctaLabel, ctaUrl },
    seo
  }
`);

export const PARTNERSHIP_PAGE_QUERY = defineQuery(`
  *[_type == "partnershipPage"][0] {
    _id,
    hero { heading, intro, image ${PAGE_IMAGE} },
    recognize { label, heading, items[] { _key, title, description, icon ${PAGE_IMAGE} }, form { heading, body, ctaLabel, successMessage } },
    portal { label, heading, intro, steps[] { _key, title, description } },
    amplify { label, heading, intro, cards[] { _key, title, subtitle, paragraphs, ctaLabel, ctaUrl, icon ${PAGE_IMAGE} } },
    scale { label, heading, paragraphs, logos[] { _key, keepColor, image ${PAGE_IMAGE} } },
    darkCta { heading, body, ctaLabel, ctaUrl },
    differentiators { label, heading, items[] { _key, title, description, icon ${PAGE_IMAGE} } },
    nextSteps { label, heading, paragraphs, items[] { _key, title, description, icon ${PAGE_IMAGE} } },
    faq { items[] { _key, question, answer } },
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
    "topicPills": keyInsights.topicPills,
    heroImage { ..., asset->{ _id, _type, metadata { lqip } } }
  }
`);

export const PODCAST_EPISODE_BY_SLUG_QUERY = defineQuery(`
  *[_type == "podcastEpisode" && slug.current == $slug && !(_id match "audit-fixture-*")][0] {
    _id,
    _updatedAt,
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

/** Everything the XML sitemap lists, with the last edit date of each document. */
export const SITEMAP_ENTRIES_QUERY = defineQuery(`{
  "posts": *[_type == "post" && defined(slug.current) && defined(urlCategory) && !(_id match "audit-fixture-*")]{ "slug": slug.current, urlCategory, _updatedAt },
  "caseStudies": *[_type == "caseStudy" && defined(slug.current) && !(_id match "audit-fixture-*")]{ "slug": slug.current, _updatedAt },
  "team": *[_type == "teamMember" && defined(slug.current) && showOnAboutPage != false && !(_id match "audit-fixture-*")]{ "slug": slug.current, _updatedAt },
  "episodes": *[_type == "podcastEpisode" && defined(slug.current) && !(_id match "audit-fixture-*")]{ "slug": slug.current, _updatedAt },
  "pages": *[_type in ["homePage", "partnershipPage", "contactPage", "legalPage", "linkBuildingPage", "redditMarketingPage", "seoServicePage"]]{ _id, _updatedAt }
}`);

export const PODCAST_EPISODE_SLUGS_QUERY = defineQuery(`
  *[_type == "podcastEpisode" && defined(slug.current) && !(_id match "audit-fixture-*")].slug.current
`);

// --- Fixed-section service pages ---

export const LINK_BUILDING_PAGE_QUERY = defineQuery(`
  *[_type == "linkBuildingPage"][0] {
    _id,
    hero { title, tagline, label, heading, body, ctaLabel, ctaUrl, image ${PAGE_IMAGE} },
    whyBacklinks { heading, paragraphs, image ${PAGE_IMAGE} },
    howWeBuild { label, heading, intro, cards[] { _key, title, body }, closing },
    solutions {
      label, heading,
      cards[] { _key, title, subtitle, body, ctaLabel, ctaUrl, icon ${PAGE_IMAGE} },
      banner { heading, processSteps[] { _key, label, description }, ctaLabel, ctaUrl }
    },
    competitorInsights { label, heading, items[] { _key, title, paragraphs, interactiveChart, chart ${PAGE_IMAGE} } },
    whyChoose { label, heading, items[] { _key, title, description, icon ${PAGE_IMAGE} }, ctaTitle, ctaLabel, ctaUrl },
    faq { items[] { _key, question, answer } },
    seo
  }
`);

export const REDDIT_MARKETING_PAGE_QUERY = defineQuery(`
  *[_type == "redditMarketingPage"][0] {
    _id,
    hero { heading, subtitle, tagline, ctaLabel, ctaUrl, image ${PAGE_IMAGE} },
    whyDifferent { label, heading, intro, items[] { _key, title, description, icon ${PAGE_IMAGE} } },
    opportunity { label, heading, intro, cards[] { _key, title, description, icon ${PAGE_IMAGE} } },
    whatWeDo { label, heading, intro, cards[] { _key, title, subtitle, description, icon ${PAGE_IMAGE} } },
    serviceMenu { label, heading, cards[] { _key, title, items } },
    whatYouWin { label, heading, intro, cards[] { _key, title, description, icon ${PAGE_IMAGE} } },
    process { label, heading, intro, steps[] { _key, number, title, description, optional } },
    reporting { label, heading, intro, cards[] { _key, title, body } },
    whyTrust { label, heading, items[] { _key, title, description }, ctaTitle, ctaLabel, ctaUrl },
    faq { items[] { _key, question, answer } },
    seo
  }
`);

export const SEO_SERVICE_PAGE_QUERY = defineQuery(`
  *[_type == "seoServicePage" && pageKey == $pageKey][0] {
    _id,
    hero { title, tagline, label, heading, paragraphs, ctaLabel, ctaUrl, image ${PAGE_IMAGE} },
    solutions {
      label, heading,
      cards[] { _key, title, subtitle, body, ctaLabel, ctaUrl, icon ${PAGE_IMAGE} },
      hubCards[] { _key, title, description, descriptionGradient, backIntro, backPoints, href, image ${PAGE_IMAGE} },
      banner { heading, steps[] { _key, label, description }, ctaLabel, ctaUrl }
    },
    whyChoose { label, heading, items[] { _key, title, description, icon ${PAGE_IMAGE} }, ctaTitle, ctaLabel, ctaUrl },
    faq { items[] { _key, question, answer } },
    seo
  }
`);
