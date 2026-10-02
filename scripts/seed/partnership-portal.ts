/**
 * Writes the default "/ Inside the Portal /" copy into the Partnership
 * document so editors can change it in the Studio. Only fills the group when
 * it is missing; pass --force to overwrite.
 *
 *   node --env-file=.env.local --experimental-strip-types scripts/seed/partnership-portal.ts [--force]
 */
import { DEFAULT_PARTNERSHIP_CONTENT } from "../../src/components/pages/partnership/partnership-content.ts";

import { createSeedClient, headingBlocks, key } from "./lib.ts";

async function main() {
  const force = process.argv.includes("--force");
  const client = createSeedClient();
  const c = DEFAULT_PARTNERSHIP_CONTENT.portal;
  const existing = await client.fetch<boolean>(`defined(*[_id == "partnershipPage"][0].portal.steps)`);
  if (existing && !force) {
    console.log("partnershipPage already has portal copy (use --force to overwrite)");
    return;
  }
  await client
    .patch("partnershipPage")
    .set({
      portal: {
        label: c.label,
        heading: headingBlocks(c.heading),
        intro: c.intro,
        steps: c.steps.map((s) => ({ _type: "portalStep", _key: key("ps"), title: s.title, description: s.description })),
      },
    })
    .commit();
  console.log("partnershipPage.portal written");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
