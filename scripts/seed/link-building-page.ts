/* Seeds the "Link Building Page" document from the built-in default content. */

import { DEFAULT_LINK_BUILDING_CONTENT as c, LINK_BUILDING_DEFAULT_SEO as seo } from "../../src/components/pages/link-building/link-building-content.ts";
import { createSeedClient, faqEntries, headingBlocks, key, replaceSingleton, uploadImage, withKeys } from "./lib.ts";

const client = createSeedClient();

async function main() {
  const solutionCards = [];
  for (const card of c.solutions.cards) {
    solutionCards.push({
      _type: "serviceCard",
      _key: key("sc"),
      title: card.title,
      subtitle: card.subtitle,
      body: card.body,
      ctaLabel: card.ctaLabel,
      ctaUrl: card.ctaUrl,
      icon: await uploadImage(client, card.icon),
    });
  }
  const insights = [];
  for (const item of c.competitorInsights.items) {
    insights.push({ _type: "insightItem", _key: key("ci"), title: item.title, paragraphs: item.paragraphs, chart: await uploadImage(client, item.chart) });
  }
  const reasons = [];
  for (const item of c.whyChoose.items) {
    reasons.push({ _type: "reason", _key: key("wc"), title: item.title, description: item.description, icon: await uploadImage(client, item.icon) });
  }

  await replaceSingleton(client, {
    _id: "linkBuildingPage",
    _type: "linkBuildingPage",
    hero: {
      title: headingBlocks(c.hero.title),
      tagline: c.hero.tagline,
      label: c.hero.label,
      heading: headingBlocks(c.hero.heading),
      body: withKeys(c.hero.body),
      ctaLabel: c.hero.ctaLabel,
      ctaUrl: c.hero.ctaUrl,
      image: await uploadImage(client, c.hero.image),
    },
    whyBacklinks: { heading: headingBlocks(c.whyBacklinks.heading), paragraphs: c.whyBacklinks.paragraphs, image: await uploadImage(client, c.whyBacklinks.image) },
    howWeBuild: {
      label: c.howWeBuild.label,
      heading: headingBlocks(c.howWeBuild.heading),
      intro: c.howWeBuild.intro,
      cards: c.howWeBuild.cards.map((card) => ({ _type: "tacticCard", _key: key("tc"), ...card })),
      closing: c.howWeBuild.closing,
    },
    solutions: {
      label: c.solutions.label,
      heading: headingBlocks(c.solutions.heading),
      cards: solutionCards,
      banner: {
        heading: headingBlocks(c.solutions.banner.heading),
        processSteps: c.solutions.banner.processSteps.map((step) => ({ _type: "processStep", _key: key("ps"), ...step })),
        ctaLabel: c.solutions.banner.ctaLabel,
        ctaUrl: c.solutions.banner.ctaUrl,
      },
    },
    competitorInsights: { label: c.competitorInsights.label, heading: headingBlocks(c.competitorInsights.heading), items: insights },
    whyChoose: {
      label: c.whyChoose.label,
      heading: headingBlocks(c.whyChoose.heading),
      items: reasons,
      ctaTitle: c.whyChoose.ctaTitle,
      ctaLabel: c.whyChoose.ctaLabel,
      ctaUrl: c.whyChoose.ctaUrl,
    },
    faq: { items: faqEntries(c.faq.items) },
    seo: { _type: "seo", metaTitle: seo.title, metaDescription: seo.description },
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
