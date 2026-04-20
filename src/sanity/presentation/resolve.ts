import { defineDocuments, defineLocations } from "sanity/presentation";

export const mainDocuments = defineDocuments([
  {
    route: "/insights/:slug",
    filter: `_type == "post" && slug.current == $slug`,
  },
  {
    route: "/case-studies/:slug",
    filter: `_type == "caseStudy" && slug.current == $slug`,
  },
  {
    route: "/team/:slug",
    filter: `_type == "teamMember" && slug.current == $slug`,
  },
]);

export const locations = {
  post: defineLocations({
    select: { title: "title", slug: "slug.current" },
    resolve: (doc) => ({
      locations: [
        {
          title: doc?.title || "Untitled",
          href: `/insights/${doc?.slug}`,
        },
        { title: "Insights", href: "/insights" },
      ],
    }),
  }),
  caseStudy: defineLocations({
    select: { title: "title", slug: "slug.current" },
    resolve: (doc) => ({
      locations: [
        {
          title: doc?.title || "Untitled",
          href: `/case-studies/${doc?.slug}`,
        },
        { title: "Case Studies", href: "/case-studies" },
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
    select: { title: "name", slug: "slug.current" },
    resolve: (doc) => ({
      locations: [
        ...(doc?.slug
          ? [{ title: doc?.title || "Team Member", href: `/team/${doc.slug}` }]
          : []),
        { title: "About Us", href: "/about-us" },
      ],
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
