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

const introField = defineField({ name: "intro", title: "Intro paragraph", type: "text", rows: 4 });

/* Reddit Marketing page — fixed sections in page order, one tab each. */
export const redditMarketingPage = defineType({
  name: "redditMarketingPage",
  title: "Reddit Marketing Page",
  type: "document",
  groups: [
    { name: "hero", title: "1. Hero", default: true },
    { name: "whyDifferent", title: "2. Why Reddit Is Different" },
    { name: "opportunity", title: "3. The Opportunity" },
    { name: "whatWeDo", title: "4. What We Do" },
    { name: "serviceMenu", title: "5. Service Menu" },
    { name: "whatYouWin", title: "6. What You Win" },
    { name: "process", title: "7. Our Process" },
    { name: "reporting", title: "8. Reporting" },
    { name: "whyTrust", title: "9. Why Heroic Rankings" },
    { name: "faq", title: "10. FAQ" },
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
        defineField({ name: "subtitle", title: "Subtitle", type: "text", rows: 2 }),
        defineField({ name: "tagline", title: "Tagline", type: "string" }),
        ...ctaFields,
        imageWithAlt("image", "Statue image", "Transparent PNG/WebP; it overflows the gradient block."),
      ],
    }),

    defineField({
      name: "whyDifferent",
      title: "Why Reddit Is Different",
      type: "object",
      group: "whyDifferent",
      fields: [
        labelField("/ Why Reddit Is Different /"),
        headingField,
        introField,
        defineField({
          name: "items",
          title: "Items",
          type: "array",
          description: "Description: press Enter for the line break used in the design.",
          of: [titledItem("differenceItem", { icon: true })],
        }),
      ],
    }),

    defineField({
      name: "opportunity",
      title: "The Opportunity",
      type: "object",
      group: "opportunity",
      fields: [labelField("/ The Opportunity /"), headingField, introField, defineField({ name: "cards", title: "Cards", type: "array", of: [titledItem("opportunityCard", { icon: true })] })],
    }),

    defineField({
      name: "whatWeDo",
      title: "What We Do",
      type: "object",
      group: "whatWeDo",
      fields: [
        labelField("/ What We Do /"),
        headingField,
        introField,
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
                defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
                iconField,
              ],
              preview: { select: { title: "title", subtitle: "subtitle", media: "icon" } },
            }),
          ],
        }),
      ],
    }),

    defineField({
      name: "serviceMenu",
      title: "Service Menu",
      type: "object",
      group: "serviceMenu",
      fields: [
        labelField("/ Full Service Menu /"),
        headingField,
        defineField({
          name: "cards",
          title: "Menu columns",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "menuCard",
              fields: [
                defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
                defineField({ name: "items", title: "Bullet points", type: "array", of: [defineArrayMember({ type: "string" })] }),
              ],
              preview: { select: { title: "title" } },
            }),
          ],
        }),
      ],
    }),

    defineField({
      name: "whatYouWin",
      title: "What You Win",
      type: "object",
      group: "whatYouWin",
      fields: [labelField("/ What You Win /"), headingField, introField, defineField({ name: "cards", title: "Cards", type: "array", of: [titledItem("winCard", { icon: true })] })],
    }),

    defineField({
      name: "process",
      title: "Our Process",
      type: "object",
      group: "process",
      fields: [
        labelField("/ Our Process /"),
        headingField,
        introField,
        defineField({
          name: "steps",
          title: "Steps",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "processStep",
              fields: [
                defineField({ name: "number", title: "Number", type: "string", description: 'e.g. "01"' }),
                defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
                defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
                defineField({ name: "optional", title: 'Show "Optional" badge', type: "boolean", initialValue: false }),
              ],
              preview: { select: { title: "title", subtitle: "number" } },
            }),
          ],
        }),
      ],
    }),

    defineField({
      name: "reporting",
      title: "Reporting",
      type: "object",
      group: "reporting",
      fields: [
        labelField("/ Reporting /"),
        headingField,
        introField,
        defineField({
          name: "cards",
          title: "Metric cards",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "metricCard",
              fields: [
                defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
                defineField({ name: "body", title: "Body", type: "text", rows: 2 }),
              ],
              preview: { select: { title: "title" } },
            }),
          ],
        }),
      ],
    }),

    defineField({
      name: "whyTrust",
      title: "Why Heroic Rankings",
      type: "object",
      group: "whyTrust",
      fields: [
        labelField("/ Why Heroic Rankings /"),
        headingField,
        defineField({ name: "items", title: "Reasons", type: "array", of: [titledItem("trustItem")] }),
        defineField({ name: "ctaTitle", title: "CTA cell title", type: "string" }),
        ...ctaFields,
      ],
    }),

    { ...faqField, group: "faq" },
    { ...seoField, group: "seo" },
  ],
  preview: { prepare: () => ({ title: "Reddit Marketing Page" }) },
});
