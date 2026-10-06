import { defineArrayMember, defineField, defineType } from "sanity";

/*
 * Home page — fixed sections, one field group per section, in the order
 * they appear on "/". Layout, motion, the hero video and the about artwork
 * are owned by the code; editors own every word, link, stat and team pick.
 * Sections fed by other documents (partner logos, featured case studies,
 * blog posts, testimonials) only carry their heading and button here.
 */

const imageWithAlt = (name: string, title: string, description?: string) =>
  defineField({
    name,
    title,
    type: "image",
    description,
    options: { hotspot: true },
    fields: [
      defineField({
        name: "alt",
        title: "Alt text",
        type: "string",
        validation: (rule) => rule.max(160).warning("Keep alt text short."),
      }),
    ],
  });

const labelField = (initial: string) =>
  defineField({
    name: "label",
    title: "Section label",
    type: "string",
    description: `Small label above the heading, e.g. "${initial}".`,
    validation: (rule) => rule.max(60),
  });

const headingField = (description = "Select words and choose Highlight to render them in the brand gradient.") =>
  defineField({
    name: "heading",
    title: "Heading",
    type: "gradientHeading",
    description,
  });

const ctaFields = (initialLabel: string, initialUrl: string) => [
  defineField({
    name: "ctaLabel",
    title: "Button label",
    type: "string",
    description: `e.g. "${initialLabel}"`,
    validation: (rule) => rule.max(40),
  }),
  defineField({
    name: "ctaUrl",
    title: "Button link",
    type: "string",
    description: `e.g. ${initialUrl}`,
  }),
];

export const homePage = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  groups: [
    { name: "hero", title: "1. Hero", default: true },
    { name: "services", title: "2. Services" },
    { name: "aiVisibility", title: "2b. AI Visibility" },
    { name: "about", title: "3. About" },
    { name: "team", title: "4. Team" },
    { name: "stats", title: "5. Guided by Data" },
    { name: "featuredLogos", title: "6. Featured Logos" },
    { name: "caseStudies", title: "7. Proven Results" },
    { name: "trustedBy", title: "7b. Trusted By" },
    { name: "trust", title: "8. Certifications" },
    { name: "partnerships", title: "9. Partnerships" },
    { name: "blog", title: "10. Blog" },
    { name: "testimonials", title: "11. Testimonials" },
    { name: "featuredPodcasts", title: "12. Featured Podcasts" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "hero",
      title: "Hero",
      type: "object",
      group: "hero",
      fields: [
        headingField(
          "One block per line. The words animate in one by one, so Highlight has no effect here.",
        ),
        defineField({
          name: "paragraphs",
          title: "Intro paragraphs",
          type: "array",
          of: [defineArrayMember({ type: "text", rows: 3 })],
          validation: (rule) => rule.max(3).warning("The design fits two short paragraphs."),
        }),
        ...ctaFields("Get Found Everywhere", "/contact"),
      ],
    }),

    defineField({
      name: "services",
      title: "Services",
      type: "object",
      group: "services",
      fields: [
        labelField("/ Services /"),
        headingField(),
        ...ctaFields("Book a Strategy Call", "/contact"),
        defineField({
          name: "cards",
          title: "Service cards",
          type: "array",
          description:
            "Flip cards in the horizontal rail. Cards keep their built-in statue artwork unless you upload a photo.",
          of: [
            defineArrayMember({
              type: "object",
              name: "serviceCard",
              fields: [
                defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
                defineField({
                  name: "descriptionLines",
                  title: "Back-of-card text",
                  type: "array",
                  description: "One entry per line. A single entry renders as a running paragraph.",
                  of: [defineArrayMember({ type: "string" })],
                }),
                defineField({ name: "url", title: "Link", type: "string", description: "e.g. /seo/on-page" }),
                imageWithAlt("image", "Photo (optional)", "Replaces the built-in artwork for this card."),
              ],
              preview: { select: { title: "title", subtitle: "url", media: "image" } },
            }),
          ],
          validation: (rule) => rule.max(8).warning("The rail is designed for up to eight cards."),
        }),
      ],
    }),

    defineField({
      name: "aiVisibility",
      title: "AI Visibility",
      type: "object",
      group: "aiVisibility",
      description: "The Answer Engine section: a buyer's question, the sources an AI pulls from, and the reply with and without our work.",
      fields: [
        labelField("/ AI Visibility /"),
        headingField(),
        defineField({ name: "intro", title: "Intro paragraph", type: "text", rows: 3 }),
        defineField({
          name: "scenarios",
          title: "Buyer scenarios",
          type: "array",
          description: "The chips above the simulator. Each has the question an AI is asked and its reply without and with our work.",
          of: [
            defineArrayMember({
              type: "object",
              name: "aiScenario",
              fields: [
                defineField({ name: "label", title: "Chip label", type: "string", validation: (r) => r.required().max(24) }),
                defineField({ name: "prompt", title: "Buyer's question", type: "text", rows: 2, validation: (r) => r.required() }),
                defineField({ name: "answerWithout", title: "AI reply without our work", type: "text", rows: 3 }),
                defineField({ name: "answerWith", title: "AI reply with our work", type: "text", rows: 3 }),
              ],
              preview: { select: { title: "label", subtitle: "prompt" } },
            }),
          ],
        }),
        defineField({
          name: "sources",
          title: "Sources the AI draws on",
          type: "array",
          description: "The five nodes feeding the answer. Each names the service that earns it.",
          of: [
            defineArrayMember({
              type: "object",
              name: "aiSource",
              fields: [
                defineField({ name: "label", title: "Label", type: "string", validation: (r) => r.required().max(24) }),
                defineField({ name: "detail", title: "What it is", type: "text", rows: 2 }),
                defineField({
                  name: "services",
                  title: "Services that earn it",
                  type: "array",
                  description: "Each one links to its own page; shown joined with \"+\".",
                  of: [
                    defineArrayMember({
                      type: "object",
                      name: "aiSourceService",
                      fields: [
                        defineField({ name: "label", title: "Service", type: "string", validation: (r) => r.required() }),
                        defineField({ name: "href", title: "Link", type: "string", description: "e.g. /seo/technical/" }),
                      ],
                      preview: { select: { title: "label", subtitle: "href" } },
                    }),
                  ],
                }),
              ],
              preview: { select: { title: "label", subtitle: "detail" } },
            }),
          ],
        }),
        defineField({
          name: "pillars",
          title: "How we get you cited",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "aiPillar",
              fields: [
                defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
                defineField({ name: "body", title: "Body", type: "text", rows: 3 }),
                defineField({ name: "ctaLabel", title: "Link label", type: "string" }),
                defineField({ name: "href", title: "Link", type: "string" }),
              ],
              preview: { select: { title: "title", subtitle: "ctaLabel" } },
            }),
          ],
        }),
        defineField({
          name: "proof",
          title: "Proof numbers",
          type: "array",
          description: "Count-up tiles. Use real client numbers only.",
          of: [
            defineArrayMember({
              type: "object",
              name: "aiProofStat",
              fields: [
                defineField({ name: "label", title: "Label", type: "string", validation: (r) => r.required() }),
                defineField({ name: "value", title: "Value", type: "number", validation: (r) => r.required() }),
                defineField({ name: "prefix", title: "Prefix", type: "string", description: "e.g. $" }),
                defineField({ name: "suffix", title: "Suffix", type: "string", description: "e.g. +" }),
              ],
              preview: { select: { title: "label", subtitle: "value" } },
            }),
          ],
        }),
        defineField({ name: "proofNote", title: "Proof note", type: "string", description: "Line under the numbers, e.g. where they come from." }),
        defineField({ name: "proofHref", title: "Proof link", type: "string", description: "e.g. /case-study/diy-craft-ecom-brand/" }),
        ...ctaFields("See how AI describes your brand", "/contact"),
        defineField({ name: "disclaimer", title: "Disclaimer", type: "string" }),
      ],
    }),

    defineField({
      name: "about",
      title: "About",
      type: "object",
      group: "about",
      fields: [
        labelField("/ About /"),
        headingField(),
        defineField({
          name: "paragraphs",
          title: "Paragraphs",
          type: "gradientHeading",
          description: "One block per paragraph. Select words and choose Highlight for the gradient emphasis.",
        }),
      ],
    }),

    defineField({
      name: "team",
      title: "Team",
      type: "object",
      group: "team",
      fields: [
        labelField("/  The Team  /"),
        headingField("One block per line on desktop."),
        defineField({ name: "statValue", title: "Big number", type: "string", description: 'e.g. "20+"' }),
        defineField({ name: "statLabel", title: "Number caption", type: "string", description: 'e.g. "professionals in our team"' }),
        ...ctaFields("More About Us", "/about"),
        defineField({
          name: "members",
          title: "Featured team members",
          type: "array",
          description: "Pick the two people shown on the homepage. Name, role and photo come from their Team Member entry.",
          of: [defineArrayMember({ type: "reference", to: [{ type: "teamMember" }] })],
          validation: (rule) => rule.max(2).warning("The design shows two members."),
        }),
      ],
    }),

    defineField({
      name: "stats",
      title: "Guided by Data",
      type: "object",
      group: "stats",
      fields: [
        labelField("/ Guided by Data /"),
        headingField("One block per line on desktop."),
        defineField({ name: "body", title: "Paragraph", type: "text", rows: 4 }),
        ...ctaFields("Get Started Today", "/contact"),
        defineField({
          name: "items",
          title: "Stats",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "statItem",
              fields: [
                defineField({
                  name: "metric",
                  title: "Metric",
                  type: "string",
                  description: 'Shown in outlined capitals, e.g. "100% CLIENT retention rate". The first number counts up.',
                  validation: (r) => r.required(),
                }),
                defineField({ name: "detail", title: "Caption", type: "string" }),
                imageWithAlt("image", "Circle photo"),
              ],
              preview: { select: { title: "metric", subtitle: "detail", media: "image" } },
            }),
          ],
          validation: (rule) => rule.max(3).warning("The design is a three-column row."),
        }),
      ],
    }),

    defineField({
      name: "featuredLogos",
      title: "Featured Logos",
      type: "object",
      group: "featuredLogos",
      description: "The logos themselves come from Partner Logos with “Featured” ticked.",
      fields: [headingField()],
    }),

    defineField({
      name: "caseStudies",
      title: "Proven Results",
      type: "object",
      group: "caseStudies",
      description: "The three cards come from Case Studies with “Featured on homepage” ticked.",
      fields: [
        labelField("/  Proven Results  /"),
        headingField(),
        defineField({ name: "body", title: "Paragraph", type: "text", rows: 4 }),
        ...ctaFields("See For Yourself", "/case-study"),
        defineField({
          name: "quotes",
          title: "Rotating result quotes",
          type: "gradientHeading",
          description: "One block per quote. Highlight the key result, e.g. “156% increase”.",
          validation: (rule) => rule.max(12),
        }),
      ],
    }),

    defineField({
      name: "trust",
      title: "Certifications",
      type: "object",
      group: "trust",
      fields: [
        labelField("/ Trust and Authority /"),
        headingField(),
        ...ctaFields("Work with Certified SEO Experts", "/contact"),
        defineField({
          name: "certifications",
          title: "Certifications",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "certification",
              fields: [
                defineField({ name: "label", title: "Name", type: "string", validation: (r) => r.required() }),
                defineField({
                  name: "tone",
                  title: "Badge",
                  type: "string",
                  options: {
                    list: [
                      { title: "Google", value: "google" },
                      { title: "HubSpot", value: "hubspot" },
                    ],
                    layout: "radio",
                  },
                  initialValue: "hubspot",
                }),
              ],
              preview: { select: { title: "label", subtitle: "tone" } },
            }),
          ],
        }),
      ],
    }),

    defineField({
      name: "partnerships",
      title: "Partnerships",
      type: "object",
      group: "partnerships",
      fields: [
        labelField("/ The Value We Bring /"),
        defineField({
          name: "statement",
          title: "Statement",
          type: "gradientHeading",
          description: "The large sentence. Select words and choose Highlight for the gradient.",
        }),
        defineField({
          name: "summary",
          title: "Summary",
          type: "text",
          rows: 3,
          description: "One or two sentences under the statement.",
        }),
        defineField({
          name: "paths",
          title: "Ways to partner",
          type: "array",
          description: "Short pills, e.g. White-label SEO · Affiliate program · Reseller partnership.",
          of: [defineArrayMember({ type: "string" })],
          validation: (rule) => rule.max(4).warning("The design fits three or four pills."),
        }),
        defineField({
          name: "portalEyebrow",
          title: "Portal eyebrow",
          type: "string",
          description: 'Small label above the screen deck, e.g. "Partner portal".',
        }),
        defineField({
          name: "screens",
          title: "Portal screens",
          type: "array",
          description: "Legend for the four screens, in order: Dashboard, Deliverable thread, Reports, Deliverables. The pictures are fixed.",
          of: [
            defineArrayMember({
              type: "object",
              name: "portalScreen",
              fields: [
                defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required().max(28) }),
                defineField({ name: "caption", title: "Caption", type: "string", validation: (r) => r.max(70) }),
              ],
              preview: { select: { title: "title", subtitle: "caption" } },
            }),
          ],
          validation: (rule) => rule.max(4),
        }),
        ...ctaFields("Become a Partner", "/white-label-seo-partnership/"),
      ],
    }),

    defineField({
      name: "blog",
      title: "Blog",
      type: "object",
      group: "blog",
      description: "The three cards are the newest blog posts.",
      fields: [labelField("/  Featured Blogs  /"), headingField(), ...ctaFields("View More Blogs", "/blog")],
    }),

    defineField({
      name: "trustedBy",
      title: "Trusted By",
      type: "object",
      group: "trustedBy",
      description: "The floating logos come from the Client Logo documents.",
      fields: [labelField("/  Trusted By  /"), headingField()],
    }),

    defineField({
      name: "testimonials",
      title: "Testimonials",
      type: "object",
      group: "testimonials",
      description: "The cards come from the Testimonials documents.",
      fields: [labelField("/  Dedication  /"), headingField(), ...ctaFields("Become a Satisfied Client", "/contact")],
    }),

    defineField({
      name: "featuredPodcasts",
      title: "Featured Podcasts",
      type: "object",
      group: "featuredPodcasts",
      description: "Heading and button only; the three newest Podcast Episode documents fill the cards.",
      fields: [labelField("/ Featured Podcasts /"), headingField(), ...ctaFields("View All Episodes", "/podcast")],
    }),
    defineField({ name: "seo", title: "SEO", type: "seo", group: "seo" }),
  ],
  preview: {
    prepare: () => ({ title: "Home Page" }),
  },
});
