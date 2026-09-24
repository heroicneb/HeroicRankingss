import { defineArrayMember, defineField, defineType } from "sanity";

/*
 * Partnership page — fixed sections, one field group per section, in the
 * order they appear on /partnership. Layout, colours and icons' sizes are
 * owned by the code; editors own every word, image and link.
 */

const imageWithAlt = (name: string, title: string, description?: string) =>
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

const iconField = defineField({
  name: "icon",
  title: "Icon",
  type: "image",
  description: "Square line icon (SVG preferred). Rendered inside a 50×50 tile.",
  options: { accept: "image/svg+xml,image/png" },
  fields: [
    defineField({ name: "alt", title: "Alt text", type: "string" }),
  ],
});

const labelField = (initial: string) =>
  defineField({
    name: "label",
    title: "Section label",
    type: "string",
    description: `Small label above the heading, e.g. "${initial}".`,
    validation: (rule) => rule.max(60),
  });

const headingField = defineField({
  name: "heading",
  title: "Heading",
  type: "gradientHeading",
  description: "Select words and choose Highlight to render them in the brand gradient.",
});

export const partnershipPage = defineType({
  name: "partnershipPage",
  title: "Partnership Page",
  type: "document",
  groups: [
    { name: "hero", title: "1. Hero", default: true },
    { name: "recognize", title: "2. Partner With Us" },
    { name: "amplify", title: "3. Amplify Authority" },
    { name: "scale", title: "4. Designed to Scale" },
    { name: "darkCta", title: "5. Partner Portal CTA" },
    { name: "differentiators", title: "6. Distinct Advantage" },
    { name: "nextSteps", title: "7. What's Next" },
    { name: "faq", title: "8. FAQ" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "hero",
      title: "Hero",
      type: "object",
      group: "hero",
      fields: [
        headingField,
        defineField({
          name: "intro",
          title: "Intro paragraph",
          type: "text",
          rows: 4,
          validation: (rule) => rule.max(400).warning("Keep the intro under 400 characters."),
        }),
        imageWithAlt("image", "Hero image", "Large statue image shown below the intro."),
      ],
    }),

    defineField({
      name: "recognize",
      title: "Partner With Us",
      type: "object",
      group: "recognize",
      fields: [
        labelField("/ Partner With Us /"),
        headingField,
        defineField({
          name: "items",
          title: "Audience items",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "audienceItem",
              fields: [
                defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
                defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
                iconField,
              ],
              preview: { select: { title: "title", media: "icon" } },
            }),
          ],
          validation: (rule) => rule.max(6).warning("The design fits up to six items."),
        }),
      ],
    }),

    defineField({
      name: "amplify",
      title: "Amplify Authority",
      type: "object",
      group: "amplify",
      fields: [
        labelField("/ Amplify Authority /"),
        headingField,
        defineField({ name: "intro", title: "Intro paragraph", type: "text", rows: 3 }),
        defineField({
          name: "cards",
          title: "Cards",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "amplifyCard",
              fields: [
                defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
                defineField({ name: "subtitle", title: "Subtitle (gradient)", type: "string" }),
                defineField({
                  name: "paragraphs",
                  title: "Paragraphs",
                  type: "array",
                  of: [defineArrayMember({ type: "text", rows: 4 })],
                }),
                iconField,
                defineField({ name: "ctaLabel", title: "Button label (optional)", type: "string" }),
                defineField({ name: "ctaUrl", title: "Button link", type: "string", description: "e.g. /contact" }),
              ],
              preview: { select: { title: "title", subtitle: "subtitle", media: "icon" } },
            }),
          ],
          validation: (rule) => rule.max(3).warning("The design is a three-card row."),
        }),
      ],
    }),

    defineField({
      name: "scale",
      title: "Designed to Scale",
      type: "object",
      group: "scale",
      fields: [
        labelField("/ Amplify Authority /"),
        headingField,
        defineField({ name: "paragraphs", title: "Paragraphs", type: "simpleText" }),
        defineField({
          name: "logos",
          title: "Partner logos",
          type: "array",
          description: "Shown in a 4×4 grid; empty cells are filled automatically.",
          of: [
            defineArrayMember({
              type: "object",
              name: "logoCell",
              fields: [
                imageWithAlt("image", "Logo"),
                defineField({
                  name: "keepColor",
                  title: "Keep original colours",
                  type: "boolean",
                  description: "Off = logo is shown in solid black (white in dark mode).",
                  initialValue: false,
                }),
              ],
              preview: { select: { title: "image.alt", media: "image" } },
            }),
          ],
          validation: (rule) => rule.max(16),
        }),
      ],
    }),

    defineField({
      name: "darkCta",
      title: "Partner Portal CTA",
      type: "object",
      group: "darkCta",
      fields: [
        headingField,
        defineField({ name: "body", title: "Paragraph", type: "text", rows: 4 }),
        defineField({ name: "ctaLabel", title: "Button label", type: "string" }),
        defineField({ name: "ctaUrl", title: "Button link", type: "string", description: "e.g. /contact" }),
      ],
    }),

    defineField({
      name: "differentiators",
      title: "Distinct Advantage",
      type: "object",
      group: "differentiators",
      fields: [
        labelField("/ Distinct Advantage /"),
        headingField,
        defineField({
          name: "items",
          title: "Items",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "differentiator",
              fields: [
                defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
                defineField({ name: "description", title: "Description", type: "simpleText" }),
                iconField,
              ],
              preview: { select: { title: "title", media: "icon" } },
            }),
          ],
        }),
      ],
    }),

    defineField({
      name: "nextSteps",
      title: "What's Next",
      type: "object",
      group: "nextSteps",
      fields: [
        labelField("/ White Label SEO Process /"),
        headingField,
        defineField({
          name: "paragraphs",
          title: "Intro paragraphs",
          type: "array",
          of: [defineArrayMember({ type: "text", rows: 3 })],
        }),
        defineField({
          name: "items",
          title: "Service cards",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "nextStep",
              fields: [
                defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
                defineField({ name: "description", title: "Description", type: "text", rows: 4 }),
                iconField,
              ],
              preview: { select: { title: "title", media: "icon" } },
            }),
          ],
        }),
      ],
    }),

    defineField({
      name: "faq",
      title: "FAQ",
      type: "object",
      group: "faq",
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
    }),

    defineField({ name: "seo", title: "SEO", type: "seo", group: "seo" }),
  ],
  preview: {
    prepare: () => ({ title: "Partnership Page" }),
  },
});
