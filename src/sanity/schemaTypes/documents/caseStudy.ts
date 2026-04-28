import { defineField, defineType } from "sanity";

export const caseStudy = defineType({
  name: "caseStudy",
  title: "Case Study",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "client",
      title: "Client Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "panelLabel",
      title: "Panel Label",
      type: "string",
      description: 'Label shown on the case study card image (e.g. "E-Commerce", "SaaS Platform").',
    }),
    defineField({
      name: "excerpt",
      title: "Short Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Alt Text", type: "string" }),
      ],
    }),
    defineField({
      name: "cardImage",
      title: "Card Image",
      type: "image",
      description: "Thumbnail shown on the case studies grid page. If empty, heroImage is used.",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Alt Text", type: "string" }),
      ],
    }),
    defineField({
      name: "metrics",
      title: "Key Metrics",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "label", title: "Label", type: "string" }),
            defineField({ name: "value", title: "Value", type: "string" }),
            defineField({
              name: "description",
              title: "Description",
              type: "string",
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "value" },
          },
        },
      ],
    }),
    defineField({
      name: "body",
      title: "Full Case Study",
      type: "portableText",
    }),
    defineField({
      name: "services",
      title: "Services Used",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Technical SEO", value: "technical-seo" },
          { title: "On-Page SEO", value: "on-page-seo" },
          { title: "Content Creation", value: "content-creation" },
          { title: "Link Building", value: "link-building" },
          { title: "Local SEO", value: "local-seo" },
          { title: "E-commerce SEO", value: "ecommerce-seo" },
          { title: "Keyword Strategy", value: "keyword-strategy" },
        ],
      },
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      description: "Show on homepage case studies section.",
      initialValue: false,
    }),
    defineField({
      name: "quoteText",
      title: "Quote Text",
      type: "text",
      rows: 3,
      description: "Rotating quote text displayed on the homepage.",
    }),
    defineField({
      name: "heroSubtitle",
      title: "Hero Subtitle",
      type: "text",
      rows: 2,
      description: "Subtitle shown below the hero H1.",
    }),
    defineField({
      name: "heroMetrics",
      title: "Hero Metric Tiles",
      type: "array",
      validation: (rule) => rule.max(3),
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "value", type: "string", validation: (r) => r.required() }),
            defineField({ name: "label", type: "string", validation: (r) => r.required() }),
          ],
          preview: { select: { title: "value", subtitle: "label" } },
        },
      ],
    }),
    defineField({
      name: "caseOverview",
      title: "Case Overview Section",
      type: "object",
      fields: [
        defineField({ name: "label", type: "string", description: 'Section label, e.g. "/ Case Overview /"' }),
        defineField({ name: "headingMain", type: "string", description: "First part of heading (solid color)" }),
        defineField({ name: "headingHighlighted", type: "string", description: "Second part (gradient)" }),
        defineField({ name: "body", type: "text", rows: 6 }),
      ],
    }),
    defineField({
      name: "objectiveChallenges",
      title: "Objective & Challenges",
      type: "object",
      fields: [
        defineField({ name: "label", type: "string" }),
        defineField({ name: "headingMain", type: "string" }),
        defineField({ name: "headingHighlighted", type: "string" }),
        defineField({ name: "body", type: "text", rows: 4 }),
        defineField({
          name: "items",
          type: "array",
          validation: (rule) => rule.length(3),
          of: [
            {
              type: "object",
              fields: [
                defineField({ name: "number", type: "string", validation: (r) => r.required() }),
                defineField({ name: "title", type: "string", validation: (r) => r.required() }),
                defineField({ name: "body", type: "text", rows: 3, validation: (r) => r.required() }),
              ],
              preview: { select: { title: "title", subtitle: "number" } },
            },
          ],
        }),
      ],
    }),
    defineField({
      name: "strategyPillars",
      title: "Six Pillars Cards",
      type: "array",
      validation: (rule) => rule.length(6),
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "title", type: "string", validation: (r) => r.required() }),
            defineField({ name: "intro", type: "text", rows: 2, validation: (r) => r.required() }),
            defineField({
              name: "bullets",
              type: "array",
              of: [{ type: "string" }],
              validation: (r) => r.min(2).max(8),
            }),
            defineField({
              name: "icon",
              type: "image",
              options: { hotspot: false },
              fields: [defineField({ name: "alt", type: "string", validation: (r) => r.required() })],
              validation: (r) => r.required(),
            }),
          ],
          preview: { select: { title: "title", media: "icon" } },
        },
      ],
    }),
    defineField({
      name: "journeyTimeline",
      title: "Journey to Success Timeline",
      type: "object",
      fields: [
        defineField({ name: "label", type: "string" }),
        defineField({ name: "headingMain", type: "string" }),
        defineField({ name: "headingHighlighted", type: "string" }),
        defineField({
          name: "items",
          type: "array",
          validation: (rule) => rule.min(4).max(6),
          of: [
            {
              type: "object",
              fields: [
                defineField({ name: "title", type: "string", validation: (r) => r.required() }),
                defineField({ name: "body", type: "text", rows: 3, validation: (r) => r.required() }),
              ],
              preview: { select: { title: "title" } },
            },
          ],
        }),
      ],
    }),
    defineField({
      name: "numbersThatMatter",
      title: "The Numbers That Matter (Dark Section)",
      type: "object",
      fields: [
        defineField({ name: "label", type: "string" }),
        defineField({ name: "headingMain", type: "string" }),
        defineField({ name: "headingHighlighted", type: "string" }),
        defineField({ name: "body", type: "text", rows: 5 }),
        defineField({
          name: "items",
          type: "array",
          validation: (rule) => rule.min(4).max(8),
          of: [
            {
              type: "object",
              fields: [
                defineField({ name: "value", type: "string", validation: (r) => r.required() }),
                defineField({ name: "label", type: "string", validation: (r) => r.required() }),
                defineField({ name: "sub", type: "string" }),
                defineField({
                  name: "icon",
                  type: "image",
                  options: { hotspot: false },
                  fields: [defineField({ name: "alt", type: "string", validation: (r) => r.required() })],
                }),
              ],
              preview: { select: { title: "value", subtitle: "label", media: "icon" } },
            },
          ],
        }),
      ],
    }),
    defineField({
      name: "growthChart",
      title: "Growth Trajectory Line Chart",
      type: "object",
      fields: [
        defineField({ name: "headingMain", type: "string" }),
        defineField({ name: "headingHighlighted", type: "string" }),
        defineField({ name: "leftAxisLabel", type: "string" }),
        defineField({ name: "rightAxisLabel", type: "string" }),
        defineField({
          name: "months",
          type: "array",
          of: [{ type: "string" }],
          validation: (r) => r.min(3).max(36),
          description: 'Month labels, e.g. ["JAN24", "MAR24", ...]',
        }),
        defineField({
          name: "series",
          type: "array",
          validation: (r) => r.min(1).max(5),
          of: [
            {
              type: "object",
              fields: [
                defineField({ name: "label", type: "string", validation: (r) => r.required() }),
                defineField({
                  name: "color",
                  type: "string",
                  options: {
                    list: [
                      { title: "Light gradient", value: "gradient-light" },
                      { title: "White trace", value: "white-trace" },
                      { title: "Grey trace", value: "grey-trace" },
                    ],
                  },
                  validation: (r) => r.required(),
                }),
                defineField({
                  name: "points",
                  type: "array",
                  of: [{ type: "number" }],
                  validation: (r) => r.required(),
                }),
              ],
              preview: { select: { title: "label", subtitle: "color" } },
            },
          ],
        }),
        defineField({ name: "tooltipMonth", type: "string", description: "Month label to highlight (e.g., DEC25)" }),
        defineField({
          name: "tooltipMetrics",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                defineField({ name: "label", type: "string" }),
                defineField({ name: "value", type: "string" }),
              ],
            },
          ],
        }),
      ],
      validation: (rule) =>
        rule.custom((chart: any) => {
          if (!chart) return true;
          const monthsLen = chart.months?.length ?? 0;
          const series = chart.series ?? [];
          for (const s of series) {
            if ((s?.points?.length ?? 0) !== monthsLen) {
              return `Series "${s?.label ?? "(unnamed)"}" has ${s?.points?.length ?? 0} points but months has ${monthsLen}.`;
            }
          }
          return true;
        }),
    }),
    defineField({
      name: "proofData",
      title: "The Proof Is in the Data — Analytics Cards",
      type: "object",
      fields: [
        defineField({ name: "label", type: "string" }),
        defineField({ name: "headingMain", type: "string" }),
        defineField({ name: "headingHighlighted", type: "string" }),
        defineField({ name: "body", type: "text", rows: 4 }),
        defineField({
          name: "items",
          type: "array",
          validation: (r) => r.max(8),
          of: [
            {
              type: "object",
              fields: [
                defineField({ name: "title", type: "string", validation: (r) => r.required() }),
                defineField({ name: "body", type: "text", rows: 3, validation: (r) => r.required() }),
                defineField({
                  name: "image",
                  type: "image",
                  options: { hotspot: true },
                  fields: [defineField({ name: "alt", type: "string", validation: (r) => r.required() })],
                  validation: (r) => r.required(),
                }),
                defineField({
                  name: "metricTags",
                  type: "array",
                  validation: (r) => r.max(4),
                  of: [
                    {
                      type: "object",
                      fields: [
                        defineField({ name: "label", type: "string" }),
                        defineField({ name: "value", type: "string" }),
                        defineField({ name: "isAccent", type: "boolean" }),
                      ],
                    },
                  ],
                }),
                defineField({ name: "isFullWidth", type: "boolean" }),
              ],
              preview: { select: { title: "title", media: "image" } },
            },
          ],
        }),
      ],
    }),
    defineField({
      name: "beforeAfter",
      title: "Before vs After (5-stat comparison)",
      type: "object",
      fields: [
        defineField({ name: "label", type: "string" }),
        defineField({ name: "headingMain", type: "string" }),
        defineField({ name: "headingHighlighted", type: "string" }),
        defineField({ name: "body", type: "text", rows: 3 }),
        defineField({
          name: "items",
          type: "array",
          validation: (r) => r.length(5),
          of: [
            {
              type: "object",
              fields: [
                defineField({ name: "label", type: "string", validation: (r) => r.required() }),
                defineField({ name: "before", type: "string", validation: (r) => r.required() }),
                defineField({ name: "after", type: "string", validation: (r) => r.required() }),
              ],
              preview: { select: { title: "label", subtitle: "after" } },
            },
          ],
        }),
      ],
    }),
    defineField({
      name: "conclusion",
      title: "Conclusion Panel",
      type: "object",
      fields: [
        defineField({ name: "heading", type: "string" }),
        defineField({ name: "gradientSubhead", type: "text", rows: 2 }),
        defineField({ name: "body", type: "portableText" }),
      ],
    }),
    defineField({
      name: "ctaFooter",
      title: "Per-Case-Study Final CTA",
      type: "object",
      description: "Overrides the global FooterCtaVariant on this case study only.",
      fields: [
        defineField({ name: "label", type: "string" }),
        defineField({ name: "headingMain", type: "string" }),
        defineField({ name: "headingHighlighted", type: "string" }),
        defineField({ name: "body", type: "text", rows: 3 }),
        defineField({
          name: "primaryCta",
          type: "object",
          fields: [
            defineField({ name: "label", type: "string" }),
            defineField({ name: "url", type: "string" }),
          ],
        }),
        defineField({
          name: "secondaryCta",
          type: "object",
          fields: [
            defineField({ name: "label", type: "string" }),
            defineField({ name: "url", type: "string" }),
          ],
        }),
      ],
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
    }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
  preview: {
    select: { title: "title", subtitle: "client", media: "heroImage" },
  },
});
