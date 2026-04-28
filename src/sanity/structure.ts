import type { StructureResolver } from "sanity/structure";

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
      S.listItem()
        .title("Partnership Page")
        .id("partnershipPage")
        .child(
          S.document().schemaType("partnershipPage").documentId("partnershipPage"),
        ),

      S.divider(),

      // Content collections
      S.documentTypeListItem("post").title("Blog Posts"),
      S.documentTypeListItem("servicePage").title("Service Pages"),
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
