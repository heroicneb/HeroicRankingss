import { defineField, defineType } from "sanity";

export const partnershipPage = defineType({
  name: "partnershipPage",
  title: "Partnership Page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: "intro",
      title: "Intro",
      type: "text",
      rows: 4,
      validation: (rule) => rule.max(320),
    }),
    defineField({
      name: "heroCtaLabel",
      title: "Hero CTA Label",
      type: "string",
      validation: (rule) => rule.max(40),
    }),
    defineField({
      name: "heroCtaUrl",
      title: "Hero CTA URL",
      type: "string",
      validation: (rule) =>
        rule.custom((value) => {
          if (!value) return true;
          if (value.startsWith("/") || value.startsWith("http://") || value.startsWith("https://")) {
            return true;
          }
          return "Use an absolute URL or a site-relative path starting with /";
        }),
    }),
    defineField({
      name: "body",
      title: "Body Content",
      type: "portableText",
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "heroCtaLabel",
    },
  },
});
