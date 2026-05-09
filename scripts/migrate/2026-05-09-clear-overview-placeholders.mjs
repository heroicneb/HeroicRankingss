#!/usr/bin/env node
/**
 * Clears literal placeholder caseOverview fields ("Test", "Missing info",
 * "Missing text") on 3 published case studies and corrects DesignRush
 * overview body copy that leaked the "My Baskets" client name.
 *
 * Auto-publish via Sanity transaction: patches the published doc directly,
 * no draft-then-publish round trip.
 *
 * Usage:
 *   node scripts/migrate/2026-05-09-clear-overview-placeholders.mjs
 */
import { getSanityClient } from "./lib/sanity-client.mjs";

const PATCHES = [
  { id: "migrate-caseStudy-67360e42107a7e22c2300fc8", slug: "nagish", op: "unset" },
  { id: "migrate-caseStudy-673764e0107a7e22c2300fff", slug: "art-by-maudsch", op: "unset" },
  { id: "migrate-caseStudy-6738a04c107a7e22c230103b", slug: "diy-craft-ecom-brand", op: "unset" },
  {
    id: "migrate-caseStudy-67389b07107a7e22c2301034",
    slug: "designrush",
    op: "set",
    body: "By implementing a comprehensive SEO strategy including technical SEO, on-page optimization, and content marketing, we helped DesignRush achieve significant growth in organic traffic and sales.",
  },
];

const client = getSanityClient();
if (!client) {
  console.error("No Sanity write token — set SANITY_API_WRITE_TOKEN in .env.local");
  process.exit(2);
}

const tx = client.transaction();
for (const p of PATCHES) {
  if (p.op === "unset") {
    tx.patch(p.id, (patch) => patch.unset(["caseOverview"]));
  } else {
    tx.patch(p.id, (patch) => patch.set({ "caseOverview.body": p.body }));
  }
}

const result = await tx.commit();
console.log(`Committed ${result.results.length} patches:`);
for (const r of result.results) {
  console.log(`  ${r.id} -> ${r.operation}`);
}
