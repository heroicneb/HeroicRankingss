import { defineField, defineType } from "sanity";

export const caseStudy = defineType({
  name: "caseStudy",
  title: "Case Study",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "overview", title: "Overview" },
    { name: "strategy", title: "Strategy" },
    { name: "proof", title: "Proof" },
    { name: "closing", title: "Closing" },
    { name: "seo", title: "SEO & Meta" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "hero",
      validation: (rule) =>
        rule
          .required()
          .error(
            "Title is required and renders as the H1 on the case study page.",
          ),
    }),
    defineField({
      name: "titleHighlighted",
      title: "Title — Highlighted Substring",
      type: "string",
      group: "hero",
      description:
        "Optional. Substring of Title to render in gradient (two-tone H1). Must appear in Title exactly.",
      validation: (rule) =>
        rule.custom((value, context) => {
          if (!value) return true;
          const title = (context.document?.title as string | undefined) ?? "";
          if (!title.includes(value)) {
            return "Highlighted substring must appear exactly in the Title.";
          }
          return true;
        }),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "hero",
      options: { source: "title", maxLength: 96 },
      validation: (rule) =>
        rule
          .required()
          .error(
            "Slug is required — it forms the URL: /case-studies/<slug>. Click Generate after the title is filled.",
          ),
    }),
    defineField({
      name: "heroSubtitle",
      title: "Hero Subtitle",
      type: "text",
      rows: 2,
      group: "hero",
      description: "Subtitle shown below the hero H1.",
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      group: "hero",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt Text", type: "string" })],
    }),
    defineField({
      name: "heroMetrics",
      title: "Hero Metric Tiles",
      type: "array",
      group: "hero",
      validation: (rule) =>
        rule
          .max(3)
          .error("Up to 3 hero metric tiles are shown beside the hero."),
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "value",
              type: "string",
              validation: (r) =>
                r
                  .required()
                  .error('Big number/value (e.g. "+312%"). Required.'),
            }),
            defineField({
              name: "label",
              type: "string",
              validation: (r) =>
                r
                  .required()
                  .error(
                    'Short label below the value (e.g. "organic traffic"). Required.',
                  ),
            }),
          ],
          preview: { select: { title: "value", subtitle: "label" } },
        },
      ],
    }),
    defineField({
      name: "panelLabel",
      title: "Panel Label",
      type: "string",
      group: "hero",
      description:
        'Label shown on the case study card image (e.g. "E-Commerce", "SaaS Platform").',
    }),
    defineField({
      name: "client",
      title: "Client Name",
      type: "string",
      group: "hero",
      validation: (rule) =>
        rule
          .required()
          .error(
            "Client name is required and shown in the hero and on the index card.",
          ),
    }),
    defineField({
      name: "cardImage",
      title: "Card Image",
      type: "image",
      group: "hero",
      description:
        "Thumbnail shown on the case studies grid page. If empty, heroImage is used.",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt Text", type: "string" })],
    }),
    defineField({
      name: "excerpt",
      title: "Short Description",
      type: "text",
      rows: 3,
      group: "hero",
      description: "Used on the case studies index card and in social shares.",
    }),
    defineField({
      name: "featured",
      title: "Featured on homepage",
      type: "boolean",
      group: "hero",
      description: "Show on the homepage case studies section.",
      initialValue: false,
    }),
    defineField({
      name: "quoteText",
      title: "Quote Text",
      type: "text",
      rows: 3,
      group: "hero",
      description: "Rotating quote text displayed on the homepage.",
    }),
    defineField({
      name: "metrics",
      title: "Key Metrics (homepage rotation)",
      type: "array",
      group: "hero",
      description:
        "Metrics surfaced on the homepage rotating case study panel.",
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
      name: "caseOverview",
      title: "Case Overview Section",
      type: "object",
      group: "overview",
      fields: [
        defineField({
          name: "label",
          type: "string",
          description: 'Section label, e.g. "/ Case Overview /"',
        }),
        defineField({
          name: "headingMain",
          type: "string",
          description: "First part of heading (solid color)",
        }),
        defineField({
          name: "headingHighlighted",
          type: "string",
          description: "Second part (gradient)",
        }),
        defineField({ name: "body", type: "text", rows: 6 }),
      ],
    }),
    defineField({
      name: "objectiveChallenges",
      title: "Objective & Challenges",
      type: "object",
      group: "overview",
      fields: [
        defineField({ name: "label", type: "string" }),
        defineField({ name: "headingMain", type: "string" }),
        defineField({ name: "headingHighlighted", type: "string" }),
        defineField({ name: "body", type: "text", rows: 4 }),
        defineField({
          name: "items",
          type: "array",
          validation: (rule) =>
            rule
              .length(3)
              .error("Exactly 3 challenge items are required for the layout."),
          of: [
            {
              type: "object",
              fields: [
                defineField({
                  name: "number",
                  type: "string",
                  validation: (r) =>
                    r.required().error('Step number, e.g. "01". Required.'),
                }),
                defineField({
                  name: "title",
                  type: "string",
                  validation: (r) =>
                    r.required().error("Challenge title is required."),
                }),
                defineField({
                  name: "body",
                  type: "text",
                  rows: 3,
                  validation: (r) =>
                    r.required().error("Challenge body is required."),
                }),
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
      group: "strategy",
      validation: (rule) =>
        rule
          .length(6)
          .error(
            "Exactly 6 strategy pillars are required — the design is a 3x2 grid.",
          ),
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "title",
              type: "string",
              validation: (r) =>
                r.required().error("Pillar title is required."),
            }),
            defineField({
              name: "intro",
              type: "text",
              rows: 2,
              validation: (r) =>
                r.required().error("Pillar intro paragraph is required."),
            }),
            defineField({
              name: "bullets",
              type: "array",
              of: [{ type: "string" }],
              validation: (r) =>
                r.min(2).max(8).error("Each pillar needs 2–8 bullet points."),
            }),
            defineField({
              name: "icon",
              type: "image",
              options: { hotspot: false },
              fields: [
                defineField({
                  name: "alt",
                  type: "string",
                  validation: (r) =>
                    r
                      .required()
                      .error("Icon alt text is required for accessibility."),
                }),
              ],
              validation: (r) =>
                r.required().error("Pillar icon image is required."),
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
      group: "strategy",
      fields: [
        defineField({ name: "label", type: "string" }),
        defineField({ name: "headingMain", type: "string" }),
        defineField({ name: "headingHighlighted", type: "string" }),
        defineField({
          name: "items",
          type: "array",
          validation: (rule) =>
            rule.min(4).max(6).error("Timeline supports 4–6 milestones."),
          of: [
            {
              type: "object",
              fields: [
                defineField({
                  name: "title",
                  type: "string",
                  validation: (r) =>
                    r.required().error("Milestone title is required."),
                }),
                defineField({
                  name: "body",
                  type: "text",
                  rows: 3,
                  validation: (r) =>
                    r.required().error("Milestone description is required."),
                }),
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
      group: "strategy",
      fields: [
        defineField({ name: "label", type: "string" }),
        defineField({ name: "headingMain", type: "string" }),
        defineField({ name: "headingHighlighted", type: "string" }),
        defineField({ name: "body", type: "text", rows: 5 }),
        defineField({
          name: "items",
          type: "array",
          validation: (rule) =>
            rule
              .min(4)
              .max(8)
              .error("Provide 4–8 metric tiles for this section."),
          of: [
            {
              type: "object",
              fields: [
                defineField({
                  name: "value",
                  type: "string",
                  validation: (r) =>
                    r.required().error('Stat value (e.g. "8.4M"). Required.'),
                }),
                defineField({
                  name: "label",
                  type: "string",
                  validation: (r) =>
                    r.required().error("Stat label is required."),
                }),
                defineField({ name: "sub", type: "string" }),
                defineField({
                  name: "icon",
                  type: "image",
                  options: { hotspot: false },
                  fields: [
                    defineField({
                      name: "alt",
                      type: "string",
                      validation: (r) =>
                        r
                          .required()
                          .error(
                            "Icon alt text is required for accessibility.",
                          ),
                    }),
                  ],
                }),
              ],
              preview: {
                select: { title: "value", subtitle: "label", media: "icon" },
              },
            },
          ],
        }),
      ],
    }),
    defineField({
      name: "growthChart",
      title: "Growth Trajectory Line Chart",
      type: "object",
      group: "strategy",
      fields: [
        defineField({ name: "headingMain", type: "string" }),
        defineField({ name: "headingHighlighted", type: "string" }),
        defineField({ name: "leftAxisLabel", type: "string" }),
        defineField({ name: "rightAxisLabel", type: "string" }),
        defineField({
          name: "months",
          type: "array",
          of: [{ type: "string" }],
          validation: (r) =>
            r
              .min(3)
              .max(36)
              .error("Provide 3–36 month labels (one per X-axis tick)."),
          description: 'Month labels, e.g. ["JAN24", "MAR24", ...]',
        }),
        defineField({
          name: "series",
          type: "array",
          validation: (r) =>
            r
              .min(1)
              .max(5)
              .error(
                "Add 1–5 data series. Each series must have one point per month.",
              ),
          of: [
            {
              type: "object",
              fields: [
                defineField({
                  name: "label",
                  type: "string",
                  validation: (r) =>
                    r.required().error("Series label is required."),
                }),
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
                  validation: (r) =>
                    r
                      .required()
                      .error("Pick a color/trace style for the series."),
                }),
                defineField({
                  name: "points",
                  type: "array",
                  of: [{ type: "number" }],
                  validation: (r) =>
                    r
                      .required()
                      .error(
                        "Series needs a points array. Length must equal months.",
                      ),
                }),
              ],
              preview: { select: { title: "label", subtitle: "color" } },
            },
          ],
        }),
        defineField({
          name: "tooltipMonth",
          type: "string",
          description: "Month label to highlight (e.g., DEC25)",
        }),
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
        rule.custom((chart: unknown) => {
          if (!chart || typeof chart !== "object") return true;
          const c = chart as {
            months?: unknown[];
            series?: Array<{ label?: string; points?: unknown[] }>;
          };
          const monthsLen = c.months?.length ?? 0;
          const series = c.series ?? [];
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
      group: "proof",
      fields: [
        defineField({ name: "label", type: "string" }),
        defineField({ name: "headingMain", type: "string" }),
        defineField({ name: "headingHighlighted", type: "string" }),
        defineField({ name: "body", type: "text", rows: 4 }),
        defineField({
          name: "items",
          type: "array",
          validation: (r) =>
            r.max(8).error("Up to 8 analytics cards in this section."),
          of: [
            {
              type: "object",
              fields: [
                defineField({
                  name: "title",
                  type: "string",
                  validation: (r) =>
                    r.required().error("Card title is required."),
                }),
                defineField({
                  name: "body",
                  type: "text",
                  rows: 3,
                  validation: (r) =>
                    r.required().error("Card body is required."),
                }),
                defineField({
                  name: "image",
                  type: "image",
                  options: { hotspot: true },
                  fields: [
                    defineField({
                      name: "alt",
                      type: "string",
                      validation: (r) =>
                        r
                          .required()
                          .error(
                            "Image alt text is required for accessibility.",
                          ),
                    }),
                  ],
                  validation: (r) =>
                    r.required().error("Analytics screenshot is required."),
                }),
                defineField({
                  name: "metricTags",
                  type: "array",
                  validation: (r) =>
                    r.max(4).error("Up to 4 metric tags per card."),
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
      group: "proof",
      fields: [
        defineField({ name: "label", type: "string" }),
        defineField({ name: "headingMain", type: "string" }),
        defineField({ name: "headingHighlighted", type: "string" }),
        defineField({ name: "body", type: "text", rows: 3 }),
        defineField({
          name: "items",
          type: "array",
          validation: (r) =>
            r
              .length(5)
              .error(
                "Exactly 5 before/after rows are required for this layout.",
              ),
          of: [
            {
              type: "object",
              fields: [
                defineField({
                  name: "label",
                  type: "string",
                  validation: (r) =>
                    r.required().error("Row label is required."),
                }),
                defineField({
                  name: "before",
                  type: "string",
                  validation: (r) =>
                    r.required().error('"Before" value is required.'),
                }),
                defineField({
                  name: "after",
                  type: "string",
                  validation: (r) =>
                    r.required().error('"After" value is required.'),
                }),
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
      group: "closing",
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
      group: "closing",
      description:
        "Overrides the global FooterCtaVariant on this case study only.",
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
      name: "body",
      title: "Full Case Study (legacy long-form)",
      type: "portableText",
      group: "seo",
      description:
        "Legacy long-form portable text body. Most new case studies use the structured sections above instead.",
    }),
    defineField({
      name: "services",
      title: "Services Used",
      type: "array",
      group: "seo",
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
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      group: "seo",
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      group: "seo",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "client", media: "heroImage" },
  },
});
