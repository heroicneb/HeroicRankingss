import type { StructureResolver } from "sanity/structure";

/* Fixed documents shown under "Service Pages": one per route, in menu order. */
const SEO_SERVICE_PAGES = [
  { key: "seo-services", title: "SEO Services (hub)" },
  { key: "on-page-seo", title: "On-Page SEO" },
  { key: "technical-seo", title: "Technical SEO" },
  { key: "local-seo", title: "Local SEO" },
  { key: "ecommerce-seo", title: "E-commerce SEO" },
  { key: "content-creation", title: "Content Creation" },
  { key: "keyword-strategy", title: "Keyword Strategy" },
] as const;

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      // Singletons
      S.listItem()
        .title("Site Settings")
        .id("siteSettings")
        .child(
          S.document().schemaType("siteSettings").documentId("siteSettings"),
        ),
      S.listItem()
        .title("Contact Page")
        .id("contactPage")
        .child(
          S.document().schemaType("contactPage").documentId("contactPage"),
        ),

      S.divider(),

      // Content collections
      S.documentTypeListItem("post").title("Blog Posts"),
      S.listItem()
        .title("Service Pages")
        .id("servicePages")
        .child(
          S.list()
            .title("Service Pages")
            .items([
              ...SEO_SERVICE_PAGES.map((page) =>
                S.listItem()
                  .title(page.title)
                  .id(`seoServicePage-${page.key}`)
                  .child(
                    S.document()
                      .schemaType("seoServicePage")
                      .documentId(`seoServicePage-${page.key}`),
                  ),
              ),
              S.listItem()
                .title("Link Building")
                .id("linkBuildingPage")
                .child(
                  S.document().schemaType("linkBuildingPage").documentId("linkBuildingPage"),
                ),
              S.listItem()
                .title("Reddit Marketing")
                .id("redditMarketingPage")
                .child(
                  S.document().schemaType("redditMarketingPage").documentId("redditMarketingPage"),
                ),
              S.divider(),
              S.listItem()
                .title("Partnership")
                .id("partnershipPage")
                .child(
                  S.document().schemaType("partnershipPage").documentId("partnershipPage"),
                ),
            ]),
        ),
      S.documentTypeListItem("legalPage").title("Legal Pages"),
      S.documentTypeListItem("caseStudy").title("Case Studies"),
      S.documentTypeListItem("testimonial").title("Testimonials"),
      S.documentTypeListItem("teamMember").title("Team Members"),
      S.documentTypeListItem("faqItem").title("FAQ Items"),
      S.documentTypeListItem("partnerLogo").title("Partner Logos"),

      S.divider(),

      // Podcast
      S.listItem()
        .title("Podcast Episodes")
        .child(
          S.documentTypeList("podcastEpisode")
            .title("Podcast Episodes")
            .defaultOrdering([{ field: "publishedAt", direction: "desc" }]),
        ),
    ]);
