/* Seeds one "seoServicePage" document per SEO service page from the built-in defaults. */

import { SEO_SERVICE_PAGES, seoServiceDocumentId } from "../../src/components/pages/shared/seo-service-registry.ts";
import { createSeedClient, faqEntries, headingBlocks, key, replaceSingleton, uploadImage } from "./lib.ts";

const client = createSeedClient();
const only = process.argv[2]; // optional page key to seed a single page

async function main() {
  for (const page of SEO_SERVICE_PAGES) {
    if (only && page.key !== only) continue;
    const c = page.content;

    const cards = [];
    for (const card of c.solutions.cards) {
      cards.push({ _type: "serviceCard", _key: key("sc"), title: card.title, subtitle: card.subtitle, body: card.body, ctaLabel: card.ctaLabel, ctaUrl: card.ctaUrl, icon: await uploadImage(client, card.icon) });
    }
    const hubCards = [];
    for (const card of c.solutions.hubCards) {
      hubCards.push({
        _type: "hubCard",
        _key: key("hc"),
        title: card.title,
        description: card.description,
        descriptionGradient: card.descriptionGradient,
        image: await uploadImage(client, card.image),
        backIntro: card.backIntro,
        backPoints: card.backPoints,
        href: card.href,
      });
    }
    const reasons = [];
    for (const item of c.whyChoose.items) {
      reasons.push({ _type: "reason", _key: key("wc"), title: item.title, description: item.description, icon: await uploadImage(client, item.icon) });
    }

    await replaceSingleton(client, {
      _id: seoServiceDocumentId(page.key),
      _type: "seoServicePage",
      pageKey: page.key,
      title: page.title,
      hero: {
        title: headingBlocks(c.hero.title),
        tagline: headingBlocks(c.hero.tagline),
        label: c.hero.label,
        heading: headingBlocks(c.hero.heading),
        paragraphs: c.hero.paragraphs,
        ctaLabel: c.hero.ctaLabel,
        ctaUrl: c.hero.ctaUrl,
        image: await uploadImage(client, c.hero.image),
      },
      solutions: {
        label: c.solutions.label,
        heading: headingBlocks(c.solutions.heading),
        cards,
        hubCards,
        banner: c.solutions.banner
          ? {
              heading: headingBlocks(c.solutions.banner.heading),
              steps: c.solutions.banner.steps.map((step) => ({ _type: "processStep", _key: key("ps"), ...step })),
              ctaLabel: c.solutions.banner.ctaLabel,
              ctaUrl: c.solutions.banner.ctaUrl,
            }
          : undefined,
      },
      whyChoose: {
        label: c.whyChoose.label,
        heading: headingBlocks(c.whyChoose.heading),
        items: reasons,
        ctaTitle: c.whyChoose.ctaTitle,
        ctaLabel: c.whyChoose.ctaLabel,
        ctaUrl: c.whyChoose.ctaUrl,
      },
      faq: { items: faqEntries(c.faq.items) },
      seo: { _type: "seo", metaTitle: page.seo.title, metaDescription: page.seo.description },
    });
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
