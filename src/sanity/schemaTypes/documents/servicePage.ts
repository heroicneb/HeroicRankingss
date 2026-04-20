import { defineField, defineType } from "sanity";

const SERVICE_TYPES = [
  { title: "SEO Services", value: "seo-services" },
  { title: "On-Page SEO", value: "on-page-seo" },
  { title: "Technical SEO", value: "technical-seo" },
  { title: "Local SEO", value: "local-seo" },
  { title: "E-commerce SEO", value: "ecommerce-seo" },
  { title: "Content Creation", value: "content-creation" },
  { title: "Keyword Strategy", value: "keyword-strategy" },
  { title: "Link Building", value: "link-building" },
];

export const servicePage = defineType({
  name: "servicePage",
  title: "Service Page",
  type: "document",
  fields: [
    defineField({
      name: "serviceType",
      title: "Service Type",
      type: "string",
      options: { list: SERVICE_TYPES, layout: "dropdown" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "URL Slug",
      type: "slug",
      description: "Must match the Next.js route (e.g. on-page-seo).",
      options: { source: "serviceType", maxLength: 60 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroTitle",
      title: "Hero Title",
      type: "string",
      description: "Main H1 on the service page hero.",
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: "heroDescription",
      title: "Hero Description",
      type: "text",
      rows: 3,
      description: "Supporting paragraph below the hero title.",
      validation: (rule) => rule.max(300),
    }),
    defineField({
      name: "heroCtaLabel",
      title: "Hero CTA Button Label",
      type: "string",
      initialValue: "Get a Free Audit",
      validation: (rule) => rule.max(40),
    }),
    defineField({
      name: "heroCtaUrl",
      title: "Hero CTA Button URL",
      type: "string",
      initialValue: "/contact",
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alternative text",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "solutionSectionLabel",
      title: "Solution Section Label",
      type: "string",
      initialValue: "/  Solutions  /",
    }),
    defineField({
      name: "solutionSectionHeading",
      title: "Solution Section Heading",
      type: "string",
    }),
    defineField({
      name: "serviceCards",
      title: "Service Cards",
      type: "array",
      of: [
        {
          type: "object",
          name: "serviceCard",
          title: "Service Card",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "subtitle",
              title: "Subtitle",
              type: "string",
            }),
            defineField({
              name: "body",
              title: "Body",
              type: "text",
              rows: 4,
            }),
            defineField({
              name: "icon",
              title: "Icon",
              type: "image",
              options: { hotspot: true },
              fields: [
                defineField({
                  name: "alt",
                  title: "Alternative text",
                  type: "string",
                }),
              ],
            }),
            defineField({
              name: "iconSrc",
              title: "Icon Path (Legacy)",
              type: "string",
              description:
                "Deprecated fallback path to icon in /public (e.g. /on-page-seo/icon.svg). Prefer the Icon image field.",
            }),
          ],
          preview: {
            select: { title: "title", subtitle: "subtitle" },
          },
        },
      ],
    }),
    defineField({
      name: "processSteps",
      title: "Process Steps",
      type: "array",
      of: [
        {
          type: "object",
          name: "processStep",
          title: "Process Step",
          fields: [
            defineField({
              name: "title",
              title: "Step Title",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "description",
              title: "Step Description",
              type: "text",
              rows: 3,
            }),
          ],
          preview: {
            select: { title: "title" },
          },
        },
      ],
      validation: (rule) => rule.max(8),
    }),
    defineField({
      name: "whyChooseItems",
      title: "Why Choose Us Items",
      type: "array",
      of: [
        {
          type: "object",
          name: "whyChooseItem",
          title: "Why Choose Item",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 2,
            }),
            defineField({
              name: "icon",
              title: "Icon",
              type: "image",
              options: { hotspot: true },
              fields: [
                defineField({
                  name: "alt",
                  title: "Alternative text",
                  type: "string",
                }),
              ],
            }),
            defineField({
              name: "iconSrc",
              title: "Icon Path (Legacy)",
              type: "string",
            }),
          ],
          preview: {
            select: { title: "title" },
          },
        },
      ],
    }),
    defineField({
      name: "faqItems",
      title: "FAQ Items",
      type: "array",
      of: [{ type: "reference", to: [{ type: "faqItem" }] }],
    }),
    defineField({
      name: "relatedCaseStudies",
      title: "Related Case Studies",
      type: "array",
      of: [{ type: "reference", to: [{ type: "caseStudy" }] }],
      validation: (rule) => rule.max(6),
    }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
  orderings: [
    {
      title: "Service Type A\u2013Z",
      name: "serviceTypeAsc",
      by: [{ field: "serviceType", direction: "asc" }],
    },
  ],
  preview: {
    select: { heroTitle: "heroTitle", serviceType: "serviceType" },
    prepare(selection) {
      return {
        title: (selection.heroTitle as string) ?? "Untitled service",
        subtitle: (selection.serviceType as string) ?? "",
      };
    },
  },
});
