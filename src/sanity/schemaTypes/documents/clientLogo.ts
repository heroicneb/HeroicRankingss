import { defineField, defineType } from "sanity";

/** One brand in the homepage "/ Trusted By /" logo field. */
export const clientLogo = defineType({
  name: "clientLogo",
  title: "Client Logo",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Client name",
      type: "string",
      description: "Read out by screen readers and used as the image alt text.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      description:
        "Upload the WHITE version of the logo on a transparent background (SVG or PNG). The field has a dark panel and shows every logo at the same brightness.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "logoHeight",
      title: "Display height (px)",
      type: "number",
      description: "How tall the logo renders inside its pill. Wordmarks look right at 24–28, square emblems at 36–40. Default 26.",
      initialValue: 26,
      validation: (rule) => rule.min(16).max(48),
    }),
    defineField({
      name: "url",
      title: "Client website",
      type: "url",
      description: "For reference only; the pills do not link anywhere.",
      validation: (rule) => rule.uri({ scheme: ["https", "http"] }),
    }),
    defineField({
      name: "order",
      title: "Display order",
      type: "number",
      description: "Lower numbers come first (top-left of the field, start of the grid on phones).",
    }),
  ],
  orderings: [{ title: "Display order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "name", media: "logo" } },
});
