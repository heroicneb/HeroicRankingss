import { defineArrayMember, defineField, defineType } from "sanity";

import {
  ctaFields,
  faqField,
  headingField,
  iconField,
  imageWithAlt,
  labelField,
  seoField,
  titledItem,
} from "../lib/pageFields";

/* Link Building page — fixed sections in page order, one tab each. */
export const linkBuildingPage = defineType({
  name: "linkBuildingPage",
  title: "Link Building Page",
  type: "document",
  groups: [
    { name: "hero", title: "1. Hero", default: true },
    { name: "whyBacklinks", title: "2. Why Backlinks" },
    { name: "howWeBuild", title: "3. How We Build Links" },
    { name: "solutions", title: "4. Solutions" },
    { name: "competitorInsights", title: "5. Competitor Insights" },
    { name: "whyChoose", title: "6. Why Choose Us" },
    { name: "faq", title: "7. FAQ" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "hero",
      title: "Hero",
      type: "object",
      group: "hero",
      fields: [
        defineField({ name: "title", title: "Page title (H1)", type: "gradientHeading" }),
        defineField({ name: "tagline", title: "Tagline under the title", type: "string" }),
        labelField("/ Network /"),
        headingField,
        defineField({ name: "body", title: "Paragraph", type: "simpleText" }),
        ...ctaFields,
        imageWithAlt("image", "Statue image"),
      ],
    }),

    defineField({
      name: "whyBacklinks",
      title: "Why Backlinks",
      type: "object",
      group: "whyBacklinks",
      fields: [
        headingField,
        defineField({ name: "paragraphs", title: "Paragraphs", type: "array", of: [defineArrayMember({ type: "text", rows: 4 })] }),
        imageWithAlt("image", "Illustration", "Marble search-bar illustration on the left."),
      ],
    }),

    defineField({
      name: "howWeBuild",
      title: "How We Build Links",
      type: "object",
      group: "howWeBuild",
      fields: [
        labelField("/ Link Building /"),
        headingField,
        defineField({ name: "intro", title: "Intro paragraph", type: "text", rows: 3 }),
        defineField({
          name: "cards",
          title: "Tactic cards",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "tacticCard",
              fields: [
                defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
                defineField({ name: "body", title: "Body", type: "text", rows: 5 }),
              ],
              preview: { select: { title: "title" } },
            }),
          ],
        }),
        defineField({ name: "closing", title: "Closing paragraph", type: "text", rows: 3 }),
      ],
    }),

    defineField({
      name: "solutions",
      title: "Solutions",
      type: "object",
      group: "solutions",
      fields: [
        labelField("/ Solutions /"),
        headingField,
        defineField({
          name: "cards",
          title: "Service cards",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "serviceCard",
              fields: [
                defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
                defineField({ name: "subtitle", title: "Subtitle (gradient)", type: "string" }),
                defineField({ name: "body", title: "Body", type: "text", rows: 5 }),
                ...ctaFields,
                iconField,
              ],
              preview: { select: { title: "title", subtitle: "subtitle", media: "icon" } },
            }),
          ],
        }),
        defineField({
          name: "banner",
          title: "Process banner",
          type: "object",
          fields: [
            headingField,
            defineField({
              name: "processSteps",
              title: "Process steps",
              type: "array",
              description: "Five steps: the label is the pill, the description shows for the active step.",
              of: [
                defineArrayMember({
                  type: "object",
                  name: "processStep",
                  fields: [
                    defineField({ name: "label", title: "Step label", type: "string", validation: (r) => r.required() }),
                    defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
                  ],
                  preview: { select: { title: "label" } },
                }),
              ],
              validation: (rule) => rule.max(6).warning("The pill row fits up to six steps."),
            }),
            ...ctaFields,
          ],
        }),
      ],
    }),

    defineField({
      name: "competitorInsights",
      title: "Competitor Insights",
      type: "object",
      group: "competitorInsights",
      fields: [
        labelField("/ Competitor Insights /"),
        headingField,
        defineField({
          name: "items",
          title: "Charts",
          type: "array",
          description: "Accordion rows; the first one is open by default.",
          of: [
            defineArrayMember({
              type: "object",
              name: "insightItem",
              fields: [
                defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
                imageWithAlt("chart", "Chart image"),
                defineField({ name: "paragraphs", title: "Paragraphs", type: "array", of: [defineArrayMember({ type: "text", rows: 3 })] }),
              ],
              preview: { select: { title: "title", media: "chart" } },
            }),
          ],
        }),
      ],
    }),

    defineField({
      name: "whyChoose",
      title: "Why Choose Us",
      type: "object",
      group: "whyChoose",
      fields: [
        labelField("/ Guided by Results /"),
        headingField,
        defineField({ name: "items", title: "Reasons", type: "array", of: [titledItem("reason", { icon: true })] }),
        defineField({ name: "ctaTitle", title: "CTA cell title", type: "string" }),
        ...ctaFields,
      ],
    }),

    { ...faqField, group: "faq" },
    { ...seoField, group: "seo" },
  ],
  preview: { prepare: () => ({ title: "Link Building Page" }) },
});
