import { defineArrayMember, defineType } from "sanity";

/**
 * A heading where editors can select words and mark them as "Highlight" —
 * rendered on the site as the brand gradient text. One block = one line;
 * Shift+Enter inside a block also breaks the line.
 */
export const gradientHeading = defineType({
  name: "gradientHeading",
  title: "Heading",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [{ title: "Line", value: "normal" }],
      lists: [],
      marks: {
        decorators: [{ title: "Highlight (gradient)", value: "highlight" }],
        annotations: [],
      },
    }),
  ],
  validation: (rule) => rule.max(3).warning("Headings rarely need more than three lines."),
});
