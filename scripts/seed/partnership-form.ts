/**
 * Writes the default "Is This You?" form copy into the Partnership document
 * (recognize.form). Only fills it when missing; pass --force to overwrite.
 *
 *   node --env-file=.env.local --experimental-strip-types scripts/seed/partnership-form.ts [--force]
 */
import { DEFAULT_PARTNERSHIP_CONTENT } from "../../src/components/pages/partnership/partnership-content.ts";

import { createSeedClient } from "./lib.ts";

async function main() {
  const force = process.argv.includes("--force");
  const client = createSeedClient();
  const existing = await client.fetch<boolean>(`defined(*[_id == "partnershipPage"][0].recognize.form.heading)`);
  if (existing && !force) {
    console.log("partnershipPage already has recognize.form (use --force to overwrite)");
    return;
  }
  await client.patch("partnershipPage").set({ "recognize.form": DEFAULT_PARTNERSHIP_CONTENT.recognize.form }).commit();
  console.log("partnershipPage.recognize.form written");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
