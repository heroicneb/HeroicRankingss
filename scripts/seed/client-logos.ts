/**
 * Seeds the "Client Logo" documents behind the homepage "/ Trusted By /" logo
 * field from the built-in white set in public/trusted-by, and fills the
 * Homepage document's Trusted By label/heading when missing (--force to
 * overwrite the copy). Re-runnable: documents are matched by id.
 *
 *   node --env-file=.env.local --experimental-strip-types scripts/seed/client-logos.ts [--force]
 */
import { DEFAULT_HOME_CONTENT } from "../../src/components/pages/home/home-content.ts";
import { DEFAULT_CLIENT_LOGOS } from "../../src/components/sections/trusted-by/trusted-by-data.ts";

import { createSeedClient, headingBlocks, uploadImage } from "./lib.ts";

const WEBSITES: Record<string, string> = {
  Affinda: "https://affinda.com/",
  Draftable: "https://www.draftable.com/",
  Zoomerang: "https://zoomerang.app/",
  BCMS: "https://thebcms.com/",
  SyncSpider: "https://syncspider.com/",
  Nagish: "https://nagish.com/",
  "Cirrus Insight": "https://www.cirrusinsight.com/",
  FrontBrick: "https://frontbrick.io/",
  OneLogin: "https://onelogin.com/",
  "One Identity": "https://oneidentity.com/",
  Nursa: "https://nursa.com/",
  DesignRush: "https://www.designrush.com/",
  "Warrior Willpower": "https://warriorwillpower.com/",
  "Art by Maudsch": "https://artbymaudsch.com/",
  "My Baskets": "https://www.mybaskets.ca/",
  "Zip Moving & Storage": "https://www.zipmoving.us/",
  "Support Adventure": "https://supportadventure.com/",
  "Gabriel & Co.": "https://www.gabrielny.com/",
  TradingView: "https://www.tradingview.com/",
};

const slugify = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

async function main() {
  const force = process.argv.includes("--force");
  const client = createSeedClient();

  for (const [index, item] of DEFAULT_CLIENT_LOGOS.entries()) {
    const id = `client-logo-${slugify(item.name)}`;
    const logo = await uploadImage(client, { src: item.src, width: item.width, height: item.height, alt: item.name });
    await client.createIfNotExists({ _id: id, _type: "clientLogo", name: item.name });
    await client
      .patch(id)
      .set({ name: item.name, logo, logoHeight: item.logoHeight, url: WEBSITES[item.name] ?? null, order: index + 1 })
      .commit();
    console.log(`${index + 1}. ${item.name} → ${id}`);
  }

  const hasCopy = await client.fetch<boolean>(`defined(*[_id == "homePage"][0].trustedBy.heading)`);
  if (hasCopy && !force) {
    console.log("homePage already has trustedBy copy (use --force to overwrite)");
    return;
  }
  const c = DEFAULT_HOME_CONTENT.trustedBy;
  await client.patch("homePage").set({ trustedBy: { label: c.label, heading: headingBlocks(c.heading) } }).commit();
  console.log("homePage.trustedBy written");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
