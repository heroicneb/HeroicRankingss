import { defineField, defineType } from "sanity";

export const caseStudy = defineType({
  name: "caseStudy",
  title: "Case Study",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "client",
      title: "Client Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "panelLabel",
      title: "Panel Label",
      type: "string",
      description: 'Label shown on the case study card image (e.g. "E-Commerce", "SaaS Platform").',
    }),
    defineField({
      name: "excerpt",
      title: "Short Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Alt Text", type: "string" }),
      ],
    }),
    defineField({
      name: "cardImage",
      title: "Card Image",
      type: "image",
      description: "Thumbnail shown on the case studies grid page. If empty, heroImage is used.",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Alt Text", type: "string" }),
      ],
    }),
    defineField({
      name: "metrics",
      title: "Key Metrics",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "label", title: "Label", type: "string" }),
            defineField({ name: "value", title: "Value", type: "string" }),
            defineField({
              name: "description",
              title: "Description",
              type: "string",
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "value" },
          },
        },
      ],
    }),
    defineField({
      name: "body",
      title: "Full Case Study",
      type: "portableText",
    }),
    defineField({
      name: "services",
      title: "Services Used",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Technical SEO", value: "technical-seo" },
          { title: "On-Page SEO", value: "on-page-seo" },
          { title: "Content Creation", value: "content-creation" },
          { title: "Link Building", value: "link-building" },
          { title: "Local SEO", value: "local-seo" },
          { title: "E-commerce SEO", value: "ecommerce-seo" },
          { title: "Keyword Strategy", value: "keyword-strategy" },
        ],
      },
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      description: "Show on homepage case studies section.",
      initialValue: false,
    }),
    defineField({
      name: "quoteText",
      title: "Quote Text",
      type: "text",
      rows: 3,
      description: "Rotating quote text displayed on the homepage.",
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
    }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
  preview: {
    select: { title: "title", subtitle: "client", media: "heroImage" },
  },
});
