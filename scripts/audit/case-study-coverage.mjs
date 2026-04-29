import { createClient } from "@sanity/client";
const c = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01", useCdn: false,
});
const SECTIONS = [
  ["heroPanel", "heroPanel"],
  ["caseOverview", "caseOverview"],
  ["objectiveChallenges", "objectiveChallenges.items"],
  ["strategyPillars", "strategyPillars"],
  ["journeyTimeline", "journeyTimeline.items"],
  ["numbersThatMatter", "numbersThatMatter"],
  ["growthChart", "growthChart"],
  ["proofData", "proofData.items"],
  ["beforeAfter", "beforeAfter"],
  ["conclusion", "conclusion"],
  ["ctaFooter", "ctaFooter"],
];
const projection = SECTIONS.map(([name]) => `"has_${name}": defined(${name}) && (${name} != null && ${name} != [])`).join(",\n  ");
const r = await c.fetch(`*[_type == "caseStudy" && defined(slug.current) && !(_id match "audit-fixture-*")] | order(slug.current asc) {
  "slug": slug.current, title,
  ${projection}
}`);
console.log("Slug".padEnd(28) + SECTIONS.map(([n]) => n.slice(0, 8).padEnd(9)).join(""));
console.log("-".repeat(28 + SECTIONS.length * 9));
for (const cs of r) {
  const row = cs.slug.padEnd(28) + SECTIONS.map(([n]) => (cs[`has_${n}`] ? "✓" : "·").padEnd(9)).join("");
  console.log(row);
}
