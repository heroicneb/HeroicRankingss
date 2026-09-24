import { defineArrayMember, defineField } from "sanity";

/*
 * Field builders shared by the fixed-section page documents. Layout, colours
 * and icon sizes are owned by the code; these fields hold words, images and
 * links only.
 */

export const imageWithAlt = (name: string, title: string, description?: string) =>
  defineField({
    name,
    title,
    type: "image",
    description,
    options: { hotspot: true },
    fields: [
      defineField({
        name: "alt",
        title: "Alt text",
        type: "string",
        validation: (rule) => rule.max(160).warning("Keep alt text short."),
      }),
    ],
  });

export const iconField = defineField({
  name: "icon",
  title: "Icon",
  type: "image",
  description: "Square line icon (SVG preferred). Rendered inside a 50×50 tile.",
  options: { accept: "image/svg+xml,image/png" },
  fields: [defineField({ name: "alt", title: "Alt text", type: "string" })],
});

export const labelField = (example: string) =>
  defineField({
    name: "label",
    title: "Section label",
    type: "string",
    description: `Small label above the heading, e.g. "${example}".`,
    validation: (rule) => rule.max(60),
  });

export const headingField = defineField({
  name: "heading",
  title: "Heading",
  type: "gradientHeading",
  description: "Select words and choose Highlight to render them in the brand gradient.",
});

export const ctaFields = [
  defineField({ name: "ctaLabel", title: "Button label", type: "string" }),
  defineField({ name: "ctaUrl", title: "Button link", type: "string", description: "e.g. /contact" }),
];

/** Title + description (+ icon) item, the most common card/list shape. */
export const titledItem = (name: string, options: { icon?: boolean; richDescription?: boolean } = {}) =>
  defineArrayMember({
    type: "object",
    name,
    fields: [
      defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
      options.richDescription
        ? defineField({ name: "description", title: "Description", type: "simpleText" })
        : defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
      ...(options.icon ? [iconField] : []),
    ],
    preview: { select: { title: "title", ...(options.icon ? { media: "icon" } : {}) } },
  });

export const faqField = defineField({
  name: "faq",
  title: "FAQ",
  type: "object",
  fields: [
    defineField({
      name: "items",
      title: "Questions",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "faqEntry",
          fields: [
            defineField({ name: "question", title: "Question", type: "string", validation: (r) => r.required() }),
            defineField({ name: "answer", title: "Answer", type: "text", rows: 5 }),
          ],
          preview: { select: { title: "question" } },
        }),
      ],
    }),
  ],
});

export const seoField = defineField({ name: "seo", title: "SEO", type: "seo" });
