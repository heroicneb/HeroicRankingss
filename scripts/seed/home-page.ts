/*
 * Seeds the "Home Page" document in Sanity from the built-in default content
 * (the copy that was hard-coded in the homepage sections).
 *
 * Usage (needs SANITY_API_WRITE_TOKEN in .env.local):
 *   node --env-file=.env.local --experimental-strip-types scripts/seed/home-page.ts
 *
 * Safe to re-run: it replaces the single `homePage` document.
 *
 * Service cards are seeded WITHOUT photos on purpose: their built-in statue
 * artwork is sprite-cropped per card in code, so the cards keep it until an
 * editor uploads a replacement. Stat circle photos are uploaded. Team members
 * are linked to the matching Team Member documents by slug.
 */

import { DEFAULT_HOME_CONTENT, quoteToSegments } from "../../src/components/pages/home/home-content.ts";
import { createSeedClient, headingBlocks, key, replaceSingleton, uploadImage } from "./lib.ts";

const client = createSeedClient();

async function main() {
  const c = DEFAULT_HOME_CONTENT;

  const memberSlugs = c.team.members.map((member) => member.url.split("/").pop() ?? "");
  const memberIds = await client.fetch<Array<{ _id: string; slug: string }>>(
    `*[_type == "teamMember" && slug.current in $slugs && !(_id match "drafts.*")]{ _id, "slug": slug.current }`,
    { slugs: memberSlugs },
  );
  const members = memberSlugs
    .map((slug) => memberIds.find((row) => row.slug === slug)?._id)
    .filter((id): id is string => Boolean(id))
    .map((id) => ({ _type: "reference", _key: key("tm"), _ref: id }));
  if (members.length !== memberSlugs.length) {
    console.warn(`Only ${members.length}/${memberSlugs.length} team members matched by slug; the rest fall back to code.`);
  }

  const statItems = [];
  for (const item of c.stats.items) {
    statItems.push({
      _type: "statItem",
      _key: key("st"),
      metric: item.metric,
      detail: item.detail,
      image: await uploadImage(client, item.image),
    });
  }

  const doc = {
    _id: "homePage",
    _type: "homePage",
    hero: {
      heading: headingBlocks(c.hero.heading),
      paragraphs: c.hero.paragraphs,
      ctaLabel: c.hero.ctaLabel,
      ctaUrl: c.hero.ctaUrl,
    },
    services: {
      label: c.services.label,
      heading: headingBlocks(c.services.heading),
      ctaLabel: c.services.ctaLabel,
      ctaUrl: c.services.ctaUrl,
      cards: c.services.cards.map((card) => ({
        _type: "serviceCard",
        _key: key("sc"),
        title: card.title,
        descriptionLines: card.descriptionLines,
        url: card.url ?? undefined,
      })),
    },
    about: {
      label: c.about.label,
      heading: headingBlocks(c.about.heading),
      paragraphs: headingBlocks(c.about.paragraphs.flatMap((p, i) => (i ? [{ break: true }, ...p] : p))),
    },
    team: {
      label: c.team.label,
      heading: headingBlocks(c.team.heading),
      statValue: c.team.statValue,
      statLabel: c.team.statLabel,
      ctaLabel: c.team.ctaLabel,
      ctaUrl: c.team.ctaUrl,
      members,
    },
    stats: {
      label: c.stats.label,
      heading: headingBlocks(c.stats.heading),
      body: c.stats.body,
      ctaLabel: c.stats.ctaLabel,
      ctaUrl: c.stats.ctaUrl,
      items: statItems,
    },
    featuredLogos: { heading: headingBlocks(c.featuredLogos.heading) },
    caseStudies: {
      label: c.caseStudies.label,
      heading: headingBlocks(c.caseStudies.heading),
      body: c.caseStudies.body,
      ctaLabel: c.caseStudies.ctaLabel,
      ctaUrl: c.caseStudies.ctaUrl,
      quotes: headingBlocks(
        c.caseStudies.quotes.flatMap((q, i) => (i ? [{ break: true }, ...quoteToSegments(q)] : quoteToSegments(q))),
      ),
    },
    trust: {
      label: c.trust.label,
      heading: headingBlocks(c.trust.heading),
      ctaLabel: c.trust.ctaLabel,
      ctaUrl: c.trust.ctaUrl,
      certifications: c.trust.certifications.map((item) => ({
        _type: "certification",
        _key: key("ce"),
        label: item.label,
        tone: item.tone,
      })),
    },
    partnerships: {
      label: c.partnerships.label,
      statement: headingBlocks(c.partnerships.statement),
      paragraphs: c.partnerships.paragraphs,
      ctaLabel: c.partnerships.ctaLabel,
      ctaUrl: c.partnerships.ctaUrl,
    },
    blog: {
      label: c.blog.label,
      heading: headingBlocks(c.blog.heading),
      ctaLabel: c.blog.ctaLabel,
      ctaUrl: c.blog.ctaUrl,
    },
    testimonials: {
      label: c.testimonials.label,
      heading: headingBlocks(c.testimonials.heading),
      ctaLabel: c.testimonials.ctaLabel,
      ctaUrl: c.testimonials.ctaUrl,
    },
    seo: {
      _type: "seo",
      metaTitle: "Data-Driven SEO Agency for Organic Growth",
      metaDescription:
        "Explore Heroic Rankings’ SEO services, proven case studies, certifications, and partnerships built for long-term organic growth.",
    },
  };

  await replaceSingleton(client, doc);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
