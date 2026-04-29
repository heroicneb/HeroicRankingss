import { defineArrayMember, defineType } from "sanity";

export const portableText = defineType({
  name: "portableText",
  title: "Rich Text",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "H2", value: "h2" },
        { title: "H3", value: "h3" },
        { title: "H4", value: "h4" },
        { title: "Quote", value: "blockquote" },
      ],
      marks: {
        decorators: [
          { title: "Bold", value: "strong" },
          { title: "Italic", value: "em" },
          { title: "Code", value: "code" },
        ],
        annotations: [
          {
            name: "link",
            type: "object",
            title: "Link",
            fields: [
              {
                name: "href",
                type: "url",
                title: "URL",
                validation: (rule) =>
                  rule.uri({ scheme: ["http", "https", "mailto", "tel"] }),
              },
              {
                name: "openInNewTab",
                type: "boolean",
                title: "Open in new tab",
                initialValue: false,
              },
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alt Text",
          validation: (rule) => rule.required(),
        },
        {
          name: "caption",
          type: "string",
          title: "Caption",
        },
      ],
    }),
    // Table block — preserves BCMS `widget:table` widgets (header cols + rows of cols).
    defineArrayMember({
      type: "object",
      name: "table",
      title: "Table",
      fields: [
        {
          name: "header",
          type: "array",
          title: "Header columns",
          of: [{ type: "string" }],
        },
        {
          name: "rows",
          type: "array",
          title: "Rows",
          of: [
            {
              type: "object",
              name: "tableRow",
              fields: [
                {
                  name: "cols",
                  type: "array",
                  title: "Cells",
                  of: [{ type: "string" }],
                },
              ],
              preview: {
                select: { col0: "cols.0", col1: "cols.1" },
                prepare: ({ col0, col1 }) => ({
                  title: [col0, col1].filter(Boolean).join(" | ") || "(row)",
                }),
              },
            },
          ],
        },
      ],
      preview: {
        select: { rows: "rows" },
        prepare: ({ rows }) => ({
          title: `Table (${Array.isArray(rows) ? rows.length : 0} rows)`,
        }),
      },
    }),
    // CTA block — preserves BCMS `widget:cta2` widgets (description + label + href).
    defineArrayMember({
      type: "object",
      name: "ctaBlock",
      title: "Call to Action",
      fields: [
        {
          name: "description",
          type: "text",
          title: "Description",
          rows: 2,
          description:
            "Plain-text description shown above the CTA button. Migrated from BCMS cta2 widget.",
        },
        {
          name: "label",
          type: "string",
          title: "Button label",
          validation: (rule) => rule.required(),
        },
        {
          name: "href",
          type: "url",
          title: "Button URL",
          validation: (rule) =>
            rule.required().uri({ scheme: ["http", "https", "mailto", "tel"] }),
        },
      ],
      preview: {
        select: { label: "label", href: "href" },
        prepare: ({ label, href }) => ({
          title: label ?? "(unlabeled CTA)",
          subtitle: href ?? "(no link)",
        }),
      },
    }),
    // Video embed block — preserves BCMS `widget:video` widgets (youtube_src).
    defineArrayMember({
      type: "object",
      name: "videoEmbed",
      title: "Video Embed",
      fields: [
        {
          name: "url",
          type: "url",
          title: "Video URL",
          description: "YouTube/Vimeo embed URL.",
          validation: (rule) =>
            rule.required().uri({ scheme: ["http", "https"] }),
        },
        {
          name: "caption",
          type: "string",
          title: "Caption",
        },
      ],
      preview: {
        select: { url: "url", caption: "caption" },
        prepare: ({ url, caption }) => ({
          title: caption ?? "Video embed",
          subtitle: url,
        }),
      },
    }),
  ],
});
