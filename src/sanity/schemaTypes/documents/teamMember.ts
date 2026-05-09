import { defineField, defineType } from "sanity";

export const teamMember = defineType({
  name: "teamMember",
  title: "Team Member",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Full Name",
      type: "string",
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "role",
      title: "Role / Title",
      type: "string",
      description:
        'E.g. "SEO Director", "Content Strategist", "Founder & CEO".',
      validation: (rule) => rule.required().max(100),
    }),
    defineField({
      name: "department",
      title: "Department",
      type: "string",
      options: {
        list: [
          { title: "Leadership", value: "leadership" },
          { title: "SEO & Strategy", value: "seo-strategy" },
          { title: "Content", value: "content" },
          { title: "Link Building", value: "link-building" },
          { title: "Technical SEO", value: "technical-seo" },
          { title: "Operations", value: "operations" },
        ],
        layout: "dropdown",
      },
    }),
    defineField({
      name: "photo",
      title: "Photo",
      type: "image",
      description:
        "Headshot for team grid. Square crop works best (min 400x400 px).",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: "cardImage",
      title: "Card Image (Popup)",
      type: "image",
      description:
        "Larger portrait image used in the team member popup/modal card.",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: "bio",
      title: "Short Bio",
      type: "text",
      rows: 4,
      description: "Short professional biography for author box and team grid.",
      validation: (rule) =>
        rule
          .max(500)
          .warning("Keep bios under 500 characters for clean display"),
    }),
    defineField({
      name: "bioParagraphs",
      title: "Extended Bio (Legacy)",
      type: "array",
      description:
        "Legacy field — replaced by qaItems + personalTraits + spareTimeBullets. Kept hidden + read-only for one release as rollback source. Will be removed in a follow-up after parity verified.",
      of: [{ type: "text" }],
      readOnly: true,
      hidden: ({ document }) =>
        Boolean(
          (document?.qaItems as unknown[] | undefined)?.length ||
          (document?.personalTraits as string | undefined)?.length,
        ),
    }),
    defineField({
      name: "personalTraits",
      title: "Personal Traits",
      type: "string",
      description:
        'Three-word self-description, e.g. "Resilient, dedicated, and ambitious."',
      validation: (rule) => rule.max(140),
    }),
    defineField({
      name: "spareTimeBullets",
      title: "Spare-Time Bullets",
      type: "array",
      of: [{ type: "string" }],
      description:
        "Hobbies / spare-time activities, one per item. Renders as bullet list.",
      validation: (rule) => rule.max(8),
    }),
    defineField({
      name: "qaItems",
      title: "Q&A Items",
      type: "array",
      description:
        "Question/answer pairs above traits. Each renders as a Q (heading) + A (paragraph).",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "question",
              type: "string",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "answer",
              type: "text",
              rows: 4,
              validation: (r) => r.required(),
            }),
          ],
          preview: { select: { title: "question", subtitle: "answer" } },
        },
      ],
      validation: (rule) => rule.max(6),
    }),
    defineField({
      name: "lifestylePhotos",
      title: "Lifestyle Photos",
      type: "array",
      description:
        "Personal/lifestyle photos rendered in the right column on /about/[slug]. 3–6 recommended; sticky bio card requires >=5.",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              type: "string",
              title: "Alt Text",
              description:
                "Required. Scene-accurate, ~125 chars max. First photo can include full name + role; rest scene-only or first-name + scene to avoid keyword stuffing.",
              validation: (r) => r.required().max(140),
            }),
          ],
        },
      ],
      validation: (rule) => rule.max(8),
    }),
    defineField({
      name: "contact",
      title: "Contact",
      type: "object",
      fields: [
        defineField({
          name: "email",
          title: "Email Address",
          type: "string",
          validation: (rule) =>
            rule.custom((val?: string) => {
              if (!val) return true;
              if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val))
                return "Must be a valid email address";
              return true;
            }),
        }),
        defineField({
          name: "phone",
          title: "Phone Number",
          type: "string",
          description: "Include country code, e.g. +1 416 555 0100",
        }),
      ],
    }),
    defineField({
      name: "socialLinks",
      title: "Social Links",
      type: "array",
      of: [{ type: "socialLink" }],
      description: "LinkedIn is most important for an SEO agency team page.",
      validation: (rule) =>
        rule.max(6).warning("More than 6 social links becomes noisy"),
    }),
    defineField({
      name: "linkedin",
      title: "LinkedIn URL (Legacy)",
      type: "url",
      description:
        "Deprecated — use Social Links instead. Kept for backward compatibility.",
      validation: (rule) =>
        rule.uri({ scheme: ["https"], allowRelative: false }),
      hidden: true,
    }),
    defineField({
      name: "showOnAboutPage",
      title: "Show on About Page",
      type: "boolean",
      description: "Uncheck to hide from the public team grid.",
      initialValue: true,
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
    }),
    defineField({
      name: "cards",
      title: "Cards / Gallery (Legacy)",
      type: "array",
      description:
        "Legacy field — replaced by lifestylePhotos. Kept hidden + read-only for one release as rollback source. Will be removed in a follow-up after parity verified.",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "title",
              type: "string",
              validation: (r) => r.required(),
            }),
            defineField({ name: "subtitle", type: "string" }),
            defineField({ name: "description", type: "text", rows: 4 }),
            defineField({
              name: "image",
              type: "image",
              options: { hotspot: true },
              fields: [
                defineField({
                  name: "alt",
                  type: "string",
                  description: "Required when image is set.",
                }),
              ],
            }),
          ],
          preview: {
            select: { title: "title", subtitle: "subtitle", media: "image" },
          },
        },
      ],
      readOnly: true,
      hidden: ({ document }) =>
        Boolean((document?.lifestylePhotos as unknown[] | undefined)?.length),
      validation: (rule) =>
        rule
          .max(12)
          .warning("More than 12 cards is unusual for a team profile."),
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      description: "Optional. Used by /about/[slug] page metadata.",
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
    select: { title: "name", subtitle: "role", media: "photo" },
  },
});
