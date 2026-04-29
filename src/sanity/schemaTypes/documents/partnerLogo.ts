import { defineField, defineType } from "sanity";

export const partnerLogo = defineType({
  name: "partnerLogo",
  title: "Partner Logo",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Partner Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      validation: (rule) => rule.required(),
      fields: [defineField({ name: "alt", title: "Alt Text", type: "string" })],
    }),
    defineField({
      name: "url",
      title: "Partner Website",
      type: "url",
    }),
    defineField({
      name: "featured",
      title: "Featured (homepage strip)",
      type: "boolean",
      description:
        "Show in the homepage 'Featured and Recognized by Industry Leaders' strip. Keep to ~4 for the design grid.",
      initialValue: false,
    }),
    defineField({
      name: "partner",
      title: "Partner (partnership page)",
      type: "boolean",
      description:
        "Show on the /partnership page partner grid. Used for agency-partnership relationships.",
      initialValue: false,
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
    }),
  ],
  orderings: [
    {
      title: "Display Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "name", media: "logo" },
  },
});
