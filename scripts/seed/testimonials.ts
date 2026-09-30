/**
 * Seeds the "Testimonials" documents behind "/ Dedication / What Our Clients
 * Say" (homepage + About): the three original cards plus the four Clutch
 * reviews, each with its avatar and company logo uploaded from
 * public/figma/testimonials. Re-runnable: documents are matched by id and
 * images are re-uploaded (Sanity de-duplicates identical files).
 *
 *   node --env-file=.env.local --experimental-strip-types scripts/seed/testimonials.ts
 */
import { DEFAULT_TESTIMONIALS } from "../../src/components/sections/testimonials-data.ts";

import { createSeedClient, uploadImage } from "./lib.ts";

/** Existing document ids (migrated from the old CMS) keyed by author, so the three original cards are updated rather than duplicated. */
const EXISTING_IDS: Record<string, string> = {
  "Gianluca Ferruggia": "migrate-testimonial-6718c4bfef5de485dc93f8ed",
  "Momcilo Popov": "migrate-testimonial-6718c4d2ef5de485dc93f8ee",
  "Nik Vujic": "migrate-testimonial-6718c4e5ef5de485dc93f8ef",
};

const COMPANY: Record<string, string> = {
  "Gianluca Ferruggia": "DesignRush",
  "Ryan O'Connor": "Cirrus Insight",
  "Momcilo Popov": "BCMS",
  "Tal Braiman": "Support Adventure",
  "Nik Vujic": "GetStuffDigital",
  "Filip Radotic": "SyncSpider",
  "Dragan Stanojevic": "My Baskets",
};

const slugify = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

async function main() {
  const client = createSeedClient();
  for (const [index, t] of DEFAULT_TESTIMONIALS.entries()) {
    const id = EXISTING_IDS[t.name] ?? `testimonial-${slugify(t.name)}`;
    const avatar = await uploadImage(client, { src: t.avatarSrc, width: 400, height: 400, alt: t.avatarAlt });
    const companyLogo = await uploadImage(client, { src: t.logoSrc, width: t.logoWidth, height: t.logoHeight, alt: t.logoAlt });
    await client
      .createIfNotExists({ _id: id, _type: "testimonial", quote: t.quote, authorName: t.name })
      .then(() =>
        client
          .patch(id)
          .set({
            quote: t.quote,
            authorName: t.name,
            authorTitle: t.role,
            company: COMPANY[t.name] ?? t.logoAlt,
            avatar,
            companyLogo,
            rating: t.rating ?? 5,
            featured: true,
            sourceUrl: t.sourceUrl ?? null,
            order: index + 1,
          })
          .commit(),
      );
    console.log(`${index + 1}. ${t.name} (${COMPANY[t.name]}) → ${id}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
