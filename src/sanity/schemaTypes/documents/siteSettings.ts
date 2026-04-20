import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "companyName",
      title: "Company Name",
      type: "string",
      initialValue: "Heroic Rankings",
    }),
    defineField({
      name: "phone",
      title: "Phone / Fax",
      type: "string",
      description: "Primary phone/fax number with country code.",
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
    }),
    defineField({
      name: "socialLinks",
      title: "Social Links",
      type: "array",
      of: [{ type: "socialLink" }],
    }),
    defineField({
      name: "copyrightText",
      title: "Copyright Text",
      type: "string",
      initialValue: "©2026 Heroic Rankings",
    }),
    defineField({
      name: "navItems",
      title: "Navigation Items",
      type: "array",
      description: "Main navigation items. Supports one level of children (dropdown).",
      of: [
        {
          type: "object",
          name: "navItem",
          title: "Nav Item",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "href",
              title: "URL",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "children",
              title: "Dropdown Items",
              type: "array",
              of: [
                {
                  type: "object",
                  name: "navLink",
                  title: "Nav Link",
                  fields: [
                    defineField({
                      name: "label",
                      title: "Label",
                      type: "string",
                      validation: (rule) => rule.required(),
                    }),
                    defineField({
                      name: "href",
                      title: "URL",
                      type: "string",
                      validation: (rule) => rule.required(),
                    }),
                  ],
                  preview: {
                    select: { title: "label", subtitle: "href" },
                  },
                },
              ],
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "href" },
          },
        },
      ],
    }),
    defineField({
      name: "footerNavItems",
      title: "Footer Navigation Items",
      type: "array",
      of: [
        {
          type: "object",
          name: "footerNavLink",
          title: "Footer Link",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "href",
              title: "URL",
              type: "string",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "href" },
          },
        },
      ],
    }),
    defineField({
      name: "footerCtaHeading",
      title: "Footer CTA Heading",
      type: "string",
    }),
    defineField({
      name: "footerCtaBody",
      title: "Footer CTA Body",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "footerCtaLabel",
      title: "Footer CTA Button Label",
      type: "string",
    }),
    defineField({
      name: "footerCtaUrl",
      title: "Footer CTA Button URL",
      type: "string",
      description: "Site-relative path (e.g. /contact) or absolute URL.",
      validation: (rule) =>
        rule.custom((value) => {
          if (!value) return true;
          if (value.startsWith("/") || value.startsWith("http://") || value.startsWith("https://")) {
            return true;
          }
          return "Use an absolute URL or a site-relative path starting with /";
        }),
    }),
    defineField({
      name: "headerCtaLabel",
      title: "Header CTA Label",
      type: "string",
    }),
    defineField({
      name: "headerCtaUrl",
      title: "Header CTA URL",
      type: "string",
      description: "Site-relative path (e.g. /contact) or absolute URL.",
      validation: (rule) =>
        rule.custom((value) => {
          if (!value) return true;
          if (value.startsWith("/") || value.startsWith("http://") || value.startsWith("https://")) {
            return true;
          }
          return "Use an absolute URL or a site-relative path starting with /";
        }),
    }),
  ],
  preview: {
    prepare() {
      return { title: "Site Settings" };
    },
  },
});
