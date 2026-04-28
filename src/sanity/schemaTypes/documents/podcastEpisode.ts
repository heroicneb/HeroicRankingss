import { defineField, defineType } from "sanity";

export const podcastEpisode = defineType({
  name: "podcastEpisode",
  title: "Podcast Episode",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required().max(160),
    }),
    defineField({
      name: "titleHighlighted",
      title: "Title Highlighted Substring",
      type: "string",
      description:
        'The portion of the title to render with brand gradient, e.g. "That Actually Works". Must be a substring of title.',
      validation: (rule) =>
        rule.custom((value, context) => {
          if (!value) return true;
          const title = (context.document?.title as string | undefined) ?? "";
          if (!title.includes(value)) {
            return "Highlighted substring must appear exactly in the title.";
          }
          return true;
        }),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "episodeNumber",
      title: "Episode Number",
      type: "number",
      validation: (rule) =>
        rule
          .required()
          .integer()
          .positive()
          .custom(async (value, context) => {
            if (!value) return true;
            const { document, getClient } = context;
            const client = getClient({ apiVersion: "2026-03-01" });
            const id = document?._id?.replace(/^drafts\./, "");
            const dupes = await client.fetch(
              `*[_type == "podcastEpisode" && episodeNumber == $value && _id != $id && _id != $draftId]._id`,
              { value, id, draftId: `drafts.${id}` },
            );
            return (
              dupes.length === 0 ||
              `Episode number ${value} is already used by another episode.`
            );
          }),
    }),
    defineField({
      name: "duration",
      title: "Duration",
      type: "string",
      description: 'Display string, e.g. "1h 44min" or "50 min".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "guest",
      title: "Guest",
      type: "object",
      fields: [
        defineField({
          name: "name",
          type: "string",
          validation: (r) => r.required(),
        }),
        defineField({
          name: "role",
          type: "string",
          description: 'e.g. "Founder, CrowdTamers"',
        }),
        defineField({ name: "company", type: "string" }),
        defineField({
          name: "photo",
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              type: "string",
              validation: (r) => r.required(),
            }),
          ],
        }),
        defineField({ name: "bio", type: "text", rows: 3 }),
        defineField({ name: "linkedinUrl", type: "url" }),
        defineField({ name: "twitterUrl", type: "url" }),
        defineField({ name: "websiteUrl", type: "url" }),
      ],
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      validation: (r) => r.required(),
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          validation: (r) => r.required(),
        }),
      ],
    }),
    defineField({
      name: "videoEmbedUrl",
      title: "Video Embed URL",
      type: "url",
      description: "YouTube, Vimeo, or direct mp4 URL",
    }),
    defineField({
      name: "keyInsights",
      title: "Key Insights Section",
      type: "object",
      fields: [
        defineField({ name: "headingMain", type: "string" }),
        defineField({ name: "headingHighlighted", type: "string" }),
        defineField({ name: "body", type: "text", rows: 4 }),
        defineField({
          name: "topicPills",
          type: "array",
          of: [{ type: "string" }],
          validation: (r) => r.max(8),
        }),
        defineField({
          name: "bullets",
          type: "array",
          of: [{ type: "string" }],
          validation: (r) => r.min(1).max(10),
        }),
      ],
    }),
    defineField({
      name: "bestMoments",
      title: "Best Moments (Reels)",
      type: "array",
      validation: (r) => r.max(6),
      of: [
        {
          type: "object",
          name: "reel",
          fields: [
            defineField({ name: "title", type: "string" }),
            defineField({
              name: "thumbnail",
              type: "image",
              options: { hotspot: true },
              fields: [
                defineField({
                  name: "alt",
                  type: "string",
                  validation: (r) => r.required(),
                }),
              ],
              validation: (r) => r.required(),
            }),
            defineField({
              name: "videoUrl",
              type: "url",
              validation: (r) => r.required(),
            }),
            defineField({ name: "caption", type: "text", rows: 2 }),
          ],
          preview: { select: { title: "title", media: "thumbnail" } },
        },
      ],
    }),
    defineField({
      name: "transcript",
      title: "Transcript",
      type: "portableText",
    }),
    defineField({
      name: "relatedEpisodes",
      title: "Related Episodes",
      type: "array",
      validation: (r) => r.unique().max(3),
      of: [{ type: "reference", to: [{ type: "podcastEpisode" }] }],
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
    }),
  ],
  orderings: [
    {
      name: "newest",
      title: "Newest first",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
    {
      name: "episodeNumberDesc",
      title: "Episode # high to low",
      by: [{ field: "episodeNumber", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "guest.name", media: "heroImage" },
    prepare: ({ title, subtitle, media }) => ({
      title,
      subtitle: subtitle ? `with ${subtitle}` : undefined,
      media,
    }),
  },
});
