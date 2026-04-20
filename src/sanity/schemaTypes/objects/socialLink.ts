import { defineField, defineType } from "sanity";

export const socialLink = defineType({
  name: "socialLink",
  title: "Social Link",
  type: "object",
  fields: [
    defineField({
      name: "platform",
      title: "Platform",
      type: "string",
      options: {
        list: [
          { title: "LinkedIn", value: "linkedin" },
          { title: "Twitter / X", value: "twitter" },
          { title: "Instagram", value: "instagram" },
          { title: "GitHub", value: "github" },
          { title: "YouTube", value: "youtube" },
          { title: "Website", value: "website" },
        ],
        layout: "dropdown",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "url",
      validation: (rule) =>
        rule.required().uri({ scheme: ["http", "https"] }),
    }),
  ],
  preview: {
    select: { platform: "platform", url: "url" },
    prepare(selection) {
      return { title: selection.platform as string, subtitle: selection.url as string };
    },
  },
});
