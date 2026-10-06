/**
 * Writes the "/ The Value We Bring /" copy (summary, partner paths, portal
 * deck legend, CTA link) into the Homepage document and drops the old
 * two-paragraph field. Keeps the editor's label and statement.
 *
 *   node --env-file=.env.local --experimental-strip-types scripts/seed/home-partnerships.ts
 */
import { DEFAULT_HOME_CONTENT } from "../../src/components/pages/home/home-content.ts";

import { createSeedClient, key } from "./lib.ts";

async function main() {
  const client = createSeedClient();
  const c = DEFAULT_HOME_CONTENT.partnerships;
  await client
    .patch("homePage")
    .set({
      "partnerships.summary": c.summary,
      "partnerships.paths": c.paths,
      "partnerships.portalEyebrow": c.portalEyebrow,
      "partnerships.screens": c.screens.map((s) => ({ _type: "portalScreen", _key: key("ps"), title: s.title, caption: s.caption })),
      "partnerships.ctaUrl": c.ctaUrl,
    })
    .unset(["partnerships.paragraphs"])
    .commit();
  console.log(`wrote partnerships: ${c.paths.length} paths, ${c.screens.length} screens`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
