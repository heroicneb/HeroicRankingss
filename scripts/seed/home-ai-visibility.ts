/**
 * Writes the default "AI Visibility" copy into the Homepage document so
 * editors can change it in the Studio. Only fills the group when it is
 * missing; pass --force to overwrite.
 *
 *   node --env-file=.env.local --experimental-strip-types scripts/seed/home-ai-visibility.ts [--force]
 */
import { DEFAULT_HOME_CONTENT } from "../../src/components/pages/home/home-content.ts";

import { createSeedClient, headingBlocks, key } from "./lib.ts";

async function main() {
  const force = process.argv.includes("--force");
  const client = createSeedClient();
  const c = DEFAULT_HOME_CONTENT.aiVisibility;
  const value = {
    label: c.label,
    heading: headingBlocks(c.heading),
    intro: c.intro,
    scenarios: c.scenarios.map((s) => ({ _type: "aiScenario", _key: key("sc"), label: s.label, prompt: s.prompt, answerWithout: s.answerWithout, answerWith: s.answerWith })),
    sources: c.sources.map((s) => ({ _type: "aiSource", _key: key("src"), label: s.label, detail: s.detail, service: s.service, href: s.href })),
    pillars: c.pillars.map((p) => ({ _type: "aiPillar", _key: key("pl"), title: p.title, body: p.body, ctaLabel: p.ctaLabel, href: p.href })),
    proof: c.proof.map((p) => ({ _type: "aiProofStat", _key: key("pr"), label: p.label, value: p.value, prefix: p.prefix, suffix: p.suffix })),
    proofNote: c.proofNote,
    proofHref: c.proofHref,
    ctaLabel: c.ctaLabel,
    ctaUrl: c.ctaUrl,
    disclaimer: c.disclaimer,
  };
  const existing = await client.fetch<boolean>(`defined(*[_id == "homePage"][0].aiVisibility.scenarios)`);
  if (existing && !force) {
    console.log("homePage already has aiVisibility (use --force to overwrite)");
    return;
  }
  await client.patch("homePage").set({ aiVisibility: value }).commit();
  console.log(`wrote aiVisibility: ${c.scenarios.length} scenarios, ${c.sources.length} sources, ${c.pillars.length} pillars, ${c.proof.length} proof stats`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
