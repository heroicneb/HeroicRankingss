import { defineField, defineType } from "sanity";

export const podcastEpisode = defineType({
  name: "podcastEpisode",
  title: "Podcast Episode",
  type: "document",
  groups: [
    { name: "episode", title: "Episode", default: true },
    { name: "guest", title: "Guest" },
    { name: "content", title: "Content" },
    { name: "related", title: "Related" },
    { name: "seo", title: "SEO & Meta" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "episode",
      validation: (rule) =>
        rule
          .required()
          .max(160)
          .error(
            "Title is required (max 160 chars) and renders as the H1 on the episode page.",
          ),
    }),
    defineField({
      name: "titleHighlighted",
      title: "Title Highlighted Substring",
      type: "string",
      group: "episode",
      description:
        'The portion of the title to render with brand gradient, e.g. "That Actually Works". Must be a substring of the title.',
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
      group: "episode",
      options: { source: "title", maxLength: 96 },
      validation: (rule) =>
        rule
          .required()
          .error(
            "Slug is required — it forms the URL: /podcast/<slug>. Click Generate after the title is filled.",
          ),
    }),
    defineField({
      name: "episodeNumber",
      title: "Episode Number",
      type: "number",
      group: "episode",
      validation: (rule) =>
        rule
          .required()
          .integer()
          .positive()
          .error(
            "Episode number must be a positive integer (e.g. 1, 2, 3 ...).",
          )
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
      group: "episode",
      description: 'Display string, e.g. "1h 44min" or "50 min".',
      validation: (rule) =>
        rule
          .required()
          .error('Duration is required, e.g. "1h 44min" or "50 min".'),
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      group: "episode",
      validation: (r) =>
        r
          .required()
          .error(
            "Publish date is required — drives ordering on the podcast index.",
          ),
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      group: "episode",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          validation: (r) =>
            r
              .required()
              .error("Hero image alt text is required for accessibility."),
        }),
      ],
    }),
    defineField({
      name: "videoEmbedUrl",
      title: "Video Embed URL",
      type: "url",
      group: "episode",
      description: "YouTube, Vimeo, or direct mp4 URL.",
      validation: (r) =>
        r
          .uri({ scheme: ["http", "https"], allowRelative: false })
          .custom((value) => {
            if (!value) return true;
            try {
              const url = new URL(value);
              const allowedHosts = [
                "youtube.com",
                "www.youtube.com",
                "youtu.be",
                "vimeo.com",
                "player.vimeo.com",
              ];
              const isAllowedHost = allowedHosts.some(
                (host) =>
                  url.hostname === host || url.hostname.endsWith(`.${host}`),
              );
              const isMp4 = url.pathname.toLowerCase().endsWith(".mp4");
              if (!isAllowedHost && !isMp4) {
                return "Must be a YouTube, Vimeo, or direct .mp4 URL.";
              }
              return true;
            } catch {
              return "Invalid URL.";
            }
          }),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      group: "episode",
      validation: (r) =>
        r
          .required()
          .error(
            "Description is required — shown under the hero and used as the meta description fallback.",
          ),
    }),
    defineField({
      name: "guest",
      title: "Guest",
      type: "object",
      group: "guest",
      fields: [
        defineField({
          name: "name",
          type: "string",
          validation: (r) => r.required().error("Guest name is required."),
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
              validation: (r) =>
                r
                  .required()
                  .error("Guest photo alt text is required for accessibility."),
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
      name: "keyInsights",
      title: "Key Insights Section",
      type: "object",
      group: "content",
      fields: [
        defineField({ name: "headingMain", type: "string" }),
        defineField({ name: "headingHighlighted", type: "string" }),
        defineField({ name: "body", type: "text", rows: 4 }),
        defineField({
          name: "topicPills",
          type: "array",
          of: [{ type: "string" }],
          validation: (r) =>
            r.max(8).error("Up to 8 topic pills are shown above the insights."),
        }),
        defineField({
          name: "bullets",
          type: "array",
          of: [{ type: "string" }],
          validation: (r) =>
            r.min(1).max(10).error("Provide 1–10 key-insight bullets."),
        }),
      ],
    }),
    defineField({
      name: "bestMoments",
      title: "Best Moments (Reels)",
      type: "array",
      group: "content",
      validation: (r) => r.max(6).error("Up to 6 best-moment reels are shown."),
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
                  validation: (r) =>
                    r
                      .required()
                      .error(
                        "Thumbnail alt text is required for accessibility.",
                      ),
                }),
              ],
              validation: (r) =>
                r.required().error("Reel thumbnail is required."),
            }),
            defineField({
              name: "videoUrl",
              type: "url",
              validation: (r) =>
                r
                  .required()
                  .uri({ scheme: ["http", "https"], allowRelative: false })
                  .custom((value) => {
                    if (!value) return true;
                    try {
                      const url = new URL(value);
                      const allowedHosts = [
                        "youtube.com",
                        "www.youtube.com",
                        "youtu.be",
                        "vimeo.com",
                        "player.vimeo.com",
                        "tiktok.com",
                        "www.tiktok.com",
                        "instagram.com",
                        "www.instagram.com",
                      ];
                      const isAllowedHost = allowedHosts.some(
                        (host) =>
                          url.hostname === host ||
                          url.hostname.endsWith(`.${host}`),
                      );
                      const isMp4 = url.pathname.toLowerCase().endsWith(".mp4");
                      if (!isAllowedHost && !isMp4) {
                        return "Must be a YouTube, Vimeo, TikTok, Instagram, or direct .mp4 URL.";
                      }
                      return true;
                    } catch {
                      return "Invalid URL.";
                    }
                  })
                  .error("Reel video URL is required."),
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
      group: "content",
    }),
    defineField({
      name: "relatedEpisodes",
      title: "Related Episodes",
      type: "array",
      group: "related",
      validation: (r) =>
        r.unique().max(3).error("Pick up to 3 unique related episodes."),
      of: [{ type: "reference", to: [{ type: "podcastEpisode" }] }],
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      group: "seo",
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
