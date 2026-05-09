import { defineDocuments, defineLocations } from "sanity/presentation";

export const mainDocuments = defineDocuments([
  {
    route: "/blog/:slug",
    filter: `_type == "post" && slug.current == $slug`,
  },
  {
    route: "/case-study/:slug",
    filter: `_type == "caseStudy" && slug.current == $slug`,
  },
  {
    route: "/podcast/:slug",
    filter: `_type == "podcastEpisode" && slug.current == $slug`,
  },
]);

export const locations = {
  post: defineLocations({
    select: { title: "title", slug: "slug.current" },
    resolve: (doc) => ({
      locations: [
        {
          title: doc?.title || "Untitled",
          href: `/blog/${doc?.slug}`,
        },
        { title: "Insights", href: "/blog" },
      ],
    }),
  }),
  caseStudy: defineLocations({
    select: { title: "title", slug: "slug.current" },
    resolve: (doc) => ({
      locations: [
        {
          title: doc?.title || "Untitled",
          href: `/case-study/${doc?.slug}`,
        },
        { title: "Case Studies", href: "/case-study" },
      ],
    }),
  }),
  podcastEpisode: defineLocations({
    select: { title: "title", slug: "slug.current" },
    resolve: (doc) => ({
      locations: [
        {
          title: doc?.title || "Untitled",
          href: `/podcast/${doc?.slug}`,
        },
        { title: "Podcast", href: "/podcast" },
      ],
    }),
  }),
  testimonial: defineLocations({
    select: { title: "authorName" },
    resolve: () => ({
      locations: [{ title: "Homepage", href: "/" }],
    }),
  }),
  teamMember: defineLocations({
    select: { title: "name" },
    resolve: (doc) => ({
      locations: [{ title: doc?.title || "About Us", href: "/about" }],
    }),
  }),
  faqItem: defineLocations({
    select: { title: "question" },
    resolve: () => ({
      locations: [{ title: "Homepage", href: "/" }],
    }),
  }),
  partnerLogo: defineLocations({
    select: { title: "name" },
    resolve: () => ({
      locations: [{ title: "Partnership", href: "/partnership" }],
    }),
  }),
  servicePage: defineLocations({
    select: { title: "heroTitle", slug: "slug.current" },
    resolve: (doc) => ({
      locations: [
        ...(doc?.slug
          ? [{ title: doc?.title || "Service Page", href: `/${doc.slug}` }]
          : []),
      ],
    }),
  }),
  siteSettings: defineLocations({
    select: { title: "companyName" },
    resolve: () => ({
      locations: [
        { title: "Homepage", href: "/" },
        { title: "All Pages (Navbar & Footer)", href: "/" },
      ],
    }),
  }),
  partnershipPage: defineLocations({
    select: { title: "title" },
    resolve: () => ({
      locations: [{ title: "Partnership", href: "/partnership" }],
    }),
  }),
  contactPage: defineLocations({
    select: { title: "title" },
    resolve: () => ({
      locations: [{ title: "Contact", href: "/contact" }],
    }),
  }),
  legalPage: defineLocations({
    select: { title: "title", slug: "slug.current" },
    resolve: (doc) => ({
      locations: [
        ...(doc?.slug
          ? [{ title: doc?.title || "Legal Page", href: `/${doc.slug}` }]
          : []),
      ],
    }),
  }),
};
