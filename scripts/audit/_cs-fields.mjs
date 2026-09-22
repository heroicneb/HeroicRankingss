import { createClient } from "@sanity/client";

const c = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01", useCdn: false,
});

const r = await c.fetch(`*[_type == "caseStudy" && defined(slug.current) && !(_id match "audit-fixture-*")] | order(slug.current asc){
  "slug": slug.current,
  title,
  titleHighlighted,
  heroSubtitle,
  panelLabel,
  client,
  "heroImage": defined(heroImage.asset),
  "heroPanel": {
    "exists": defined(heroPanel),
    "metricCount": count(heroPanel.metrics)
  },
  "caseOverview": defined(caseOverview),
  "objectiveChallenges_items": count(objectiveChallenges.items),
  "strategyPillars": count(strategyPillars),
  "journeyTimeline_items": count(journeyTimeline.items),
  "numbersThatMatter": {
    "exists": defined(numbersThatMatter),
    "itemCount": count(numbersThatMatter.items)
  },
  "growthChart": defined(growthChart),
  "proofData_items": count(proofData.items),
  "beforeAfter": defined(beforeAfter),
  "conclusion": defined(conclusion),
  "ctaFooter": defined(ctaFooter)
}`);
console.log(JSON.stringify(r, null, 2));
