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

/*
 * One document type for the SEO hub and the six service pages
 * (on-page, technical, local, keyword strategy, content creation,
 * e-commerce). `pageKey` ties a document to its route; the Studio lists one
 * fixed document per page under "Service Pages".
 */
export const seoServicePage = defineType({
  name: "seoServicePage",
  title: "Service Page",
  type: "document",
  groups: [
    { name: "hero", title: "1. Hero", default: true },
    { name: "solutions", title: "2. Solutions" },
    { name: "whyChoose", title: "3. Why Choose Us" },
    { name: "faq", title: "4. FAQ" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "pageKey",
      title: "Page",
      type: "string",
      readOnly: true,
      hidden: true,
      description: "Which route this document powers. Set by the seed; do not change.",
    }),
    defineField({ name: "title", title: "Studio title", type: "string", readOnly: true, hidden: true }),

    defineField({
      name: "hero",
      title: "Hero",
      type: "object",
      group: "hero",
      fields: [
        defineField({ name: "title", title: "Page title (H1)", type: "gradientHeading" }),
        defineField({ name: "tagline", title: "Tagline under the title", type: "gradientHeading" }),
        labelField("/ Solutions /"),
        headingField,
        defineField({
          name: "paragraphs",
          title: "Paragraphs",
          type: "array",
          of: [defineArrayMember({ type: "text", rows: 4 })],
        }),
        ...ctaFields,
        imageWithAlt("image", "Hero image"),
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
          description: "Used by the six service pages.",
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
          name: "hubCards",
          title: "Service overview cards (SEO hub only)",
          type: "array",
          description: "Flip cards on /seo. Order matters: the layout assigns card sizes by position.",
          of: [
            defineArrayMember({
              type: "object",
              name: "hubCard",
              fields: [
                defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
                defineField({ name: "description", title: "Front description", type: "string" }),
                defineField({ name: "descriptionGradient", title: "Show description in gradient", type: "boolean", initialValue: false }),
                imageWithAlt("image", "Front image"),
                defineField({ name: "backIntro", title: "Back intro", type: "text", rows: 3 }),
                defineField({ name: "backPoints", title: "Back bullet points", type: "array", of: [defineArrayMember({ type: "string" })] }),
                defineField({ name: "href", title: "Link", type: "string", description: "e.g. /seo/on-page" }),
              ],
              preview: { select: { title: "title", subtitle: "description", media: "image" } },
            }),
          ],
        }),
        defineField({
          name: "banner",
          title: "Process banner",
          type: "object",
          description: "The 'Fastest and Most Effective way to Get Started' box under the cards.",
          fields: [
            headingField,
            defineField({
              name: "steps",
              title: "Process steps",
              type: "array",
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
  preview: {
    select: { title: "title", subtitle: "pageKey" },
    prepare: ({ title, subtitle }) => ({ title: title ?? "Service Page", subtitle }),
  },
});
