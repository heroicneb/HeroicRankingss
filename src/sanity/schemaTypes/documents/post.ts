import { defineField, defineType } from "sanity";

export const post = defineType({
  name: "post",
  title: "Blog Post",
  type: "document",
  groups: [
    { name: "article", title: "Article", default: true },
    { name: "seo", title: "SEO & Meta" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "article",
      validation: (rule) =>
        rule
          .required()
          .max(120)
          .error(
            "Title is required (max 120 chars) and renders as the H1 on the post page.",
          ),
    }),
    defineField({
      name: "titleHighlighted",
      title: "Title — Highlighted Substring",
      type: "string",
      group: "article",
      description:
        "Optional. Substring of Title to render in gradient (two-tone H1). Must appear in Title exactly.",
      validation: (rule) =>
        rule.custom((value, context) => {
          if (!value) return true;
          const title = (context.document?.title as string | undefined) ?? "";
          if (!title.includes(value)) {
            return "Highlighted substring must appear exactly in the Title.";
          }
          return true;
        }),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "article",
      options: { source: "title", maxLength: 96 },
      validation: (rule) =>
        rule
          .required()
          .error(
            "Slug is required — it forms the URL: /blog/<slug>. Click Generate after the title is filled.",
          ),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      group: "article",
      description:
        "Short blurb (max 200 chars) shown on the index card and used as the meta description fallback.",
      validation: (rule) =>
        rule
          .max(200)
          .error(
            "Keep the excerpt under 200 characters — it's a one-line teaser.",
          ),
    }),
    defineField({
      name: "mainImage",
      title: "Main Image",
      type: "image",
      group: "article",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
          validation: (rule) =>
            rule
              .required()
              .error("Alt text is required for accessibility and SEO."),
        }),
      ],
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      group: "article",
      to: [{ type: "teamMember" }],
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      group: "article",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      group: "article",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "SEO", value: "seo" },
          { title: "Marketing", value: "marketing" },
          { title: "Case Study", value: "case-study" },
          { title: "Industry News", value: "industry-news" },
          { title: "Technical SEO", value: "technical-seo" },
          { title: "On-Page SEO", value: "on-page-seo" },
          { title: "Local SEO", value: "local-seo" },
          { title: "Ecommerce SEO", value: "ecommerce-seo" },
          { title: "Keyword Research", value: "keyword-research" },
          { title: "Content Creation", value: "content-creation" },
          { title: "Link Building", value: "link-building" },
          { title: "Managed", value: "managed" },
        ],
      },
    }),
    defineField({
      name: "urlCategory",
      title: "URL Category",
      type: "string",
      group: "article",
      description:
        "Drives the /seo/<urlCategory>/<slug>/ URL path for this post. Match the legacy heroicrankings.com category exactly. Required for the post to appear at its canonical URL.",
      options: {
        list: [
          { title: "Content Creation", value: "content-creation" },
          { title: "E-Commerce", value: "e-commerce" },
          { title: "Keyword Research", value: "keyword-research" },
          { title: "Link Building", value: "linkbuilding" },
          { title: "Local SEO", value: "local" },
          { title: "Managed", value: "managed" },
          { title: "On-Page SEO", value: "on-page" },
          { title: "Technical SEO", value: "technical" },
        ],
        layout: "dropdown",
      },
      validation: (rule) =>
        rule
          .required()
          .custom((value) => {
            const allowed = [
              "content-creation",
              "e-commerce",
              "keyword-research",
              "linkbuilding",
              "local",
              "managed",
              "on-page",
              "technical",
            ];
            if (!value) {
              return "URL category is required. It picks the legacy /seo/<category>/<slug>/ path segment for this post.";
            }
            if (!allowed.includes(value as string)) {
              return "URL category is required. It picks the legacy /seo/<category>/<slug>/ path segment for this post.";
            }
            return true;
          })
          .error(
            "URL category is required. It picks the legacy /seo/<category>/<slug>/ path segment for this post.",
          ),
    }),
    defineField({
      name: "readTime",
      title: "Read Time",
      type: "string",
      group: "article",
      description:
        'Display label like "5 min read". Migrated from BCMS `read_time` field.',
    }),
    defineField({
      name: "relatedService",
      title: "Related Service",
      type: "string",
      group: "article",
      description:
        "Optional. Slug/key of the service this post relates to (e.g. `link-building`). Migrated from BCMS `related_service` reference.",
      options: {
        list: [
          { title: "Technical SEO", value: "technical-seo" },
          { title: "On-Page SEO", value: "on-page-seo" },
          { title: "Local SEO", value: "local-seo" },
          { title: "Ecommerce SEO", value: "ecommerce-seo" },
          { title: "Keyword Strategy", value: "keyword-strategy" },
          { title: "Content Creation", value: "content-creation" },
          { title: "Link Building", value: "link-building" },
          { title: "Managed SEO", value: "managed" },
        ],
      },
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "portableText",
      group: "article",
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      group: "seo",
    }),
  ],
  orderings: [
    {
      title: "Published Date, New",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      media: "mainImage",
      date: "publishedAt",
    },
    prepare({ title, media, date }) {
      return {
        title,
        media,
        subtitle: date
          ? new Date(date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "Draft",
      };
    },
  },
});
