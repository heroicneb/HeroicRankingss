/* Seeds the "Reddit Marketing Page" document from the built-in default content. */

import { DEFAULT_REDDIT_MARKETING_CONTENT as c, REDDIT_MARKETING_DEFAULT_SEO as seo } from "../../src/components/pages/reddit-marketing/reddit-marketing-content.ts";
import type { IconItem } from "../../src/components/pages/reddit-marketing/reddit-marketing-content.ts";
import { createSeedClient, faqEntries, headingBlocks, key, replaceSingleton, uploadImage } from "./lib.ts";

const client = createSeedClient();

async function iconItems(type: string, items: IconItem[]) {
  const out = [];
  for (const item of items) {
    out.push({ _type: type, _key: key(type), title: item.title, description: item.description, icon: await uploadImage(client, item.icon) });
  }
  return out;
}

async function main() {
  const whatWeDoCards = [];
  for (const card of c.whatWeDo.cards) {
    whatWeDoCards.push({ _type: "serviceCard", _key: key("sc"), title: card.title, subtitle: card.subtitle, description: card.description, icon: await uploadImage(client, card.icon) });
  }

  await replaceSingleton(client, {
    _id: "redditMarketingPage",
    _type: "redditMarketingPage",
    hero: {
      heading: headingBlocks(c.hero.heading),
      subtitle: c.hero.subtitle,
      tagline: c.hero.tagline,
      ctaLabel: c.hero.ctaLabel,
      ctaUrl: c.hero.ctaUrl,
      image: await uploadImage(client, c.hero.image),
    },
    whyDifferent: { label: c.whyDifferent.label, heading: headingBlocks(c.whyDifferent.heading), intro: c.whyDifferent.intro, items: await iconItems("differenceItem", c.whyDifferent.items) },
    opportunity: { label: c.opportunity.label, heading: headingBlocks(c.opportunity.heading), intro: c.opportunity.intro, cards: await iconItems("opportunityCard", c.opportunity.cards) },
    whatWeDo: { label: c.whatWeDo.label, heading: headingBlocks(c.whatWeDo.heading), intro: c.whatWeDo.intro, cards: whatWeDoCards },
    serviceMenu: { label: c.serviceMenu.label, heading: headingBlocks(c.serviceMenu.heading), cards: c.serviceMenu.cards.map((card) => ({ _type: "menuCard", _key: key("mc"), ...card })) },
    whatYouWin: { label: c.whatYouWin.label, heading: headingBlocks(c.whatYouWin.heading), intro: c.whatYouWin.intro, cards: await iconItems("winCard", c.whatYouWin.cards) },
    process: { label: c.process.label, heading: headingBlocks(c.process.heading), intro: c.process.intro, steps: c.process.steps.map((step) => ({ _type: "processStep", _key: key("ps"), ...step })) },
    reporting: { label: c.reporting.label, heading: headingBlocks(c.reporting.heading), intro: c.reporting.intro, cards: c.reporting.cards.map((card) => ({ _type: "metricCard", _key: key("rc"), ...card })) },
    whyTrust: {
      label: c.whyTrust.label,
      heading: headingBlocks(c.whyTrust.heading),
      items: c.whyTrust.items.map((item) => ({ _type: "trustItem", _key: key("ti"), ...item })),
      ctaTitle: c.whyTrust.ctaTitle,
      ctaLabel: c.whyTrust.ctaLabel,
      ctaUrl: c.whyTrust.ctaUrl,
    },
    faq: { items: faqEntries(c.faq.items) },
    seo: { _type: "seo", metaTitle: seo.title, metaDescription: seo.description },
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
