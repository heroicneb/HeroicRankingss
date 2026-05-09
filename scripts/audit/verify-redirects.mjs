#!/usr/bin/env node
/**
 * Pre-cutover redirect verification.
 *
 * Walks every rule in next.config.ts redirects() and confirms each one
 * returns a permanent (308 / 301) redirect to the expected destination,
 * and that the destination itself returns 200.
 *
 * Post Phase 4d (legacy URL strict-match): only 12 redirect rules
 * remain — slug renames + 9 historical BCMS short URLs + 2 legacy
 * aliases (`/marketing/`, `/web-design-development/`). Every other
 * legacy heroicrankings.com URL serves directly on the new site.
 * See docs/migration/redirect-map.md for the full rationale.
 *
 * Usage:
 *   AUDIT_BASE=http://localhost:3030 node scripts/audit/verify-redirects.mjs
 *   AUDIT_BASE=https://heroic-rankings-final.vercel.app node scripts/audit/verify-redirects.mjs
 *   AUDIT_BASE=https://heroicrankings.com node scripts/audit/verify-redirects.mjs   # post-cutover
 */

const BASE = process.env.AUDIT_BASE ?? "http://localhost:3030";

// Mirror of the rules in next.config.ts. Source ≠ destination only —
// identity rules (legacy paths the new site serves directly) are NOT
// in this list because there's nothing to assert: those are exercised
// by scripts/audit/verify-legacy-urls.mjs against the inventory.
const RULES = [
  // Slug rename — Number Artist case study became DIY Craft eCom Brand.
  // Source in next.config.ts is the un-trailing-slash form, but with
  // global `trailingSlash: true` the user-facing legacy URL is the
  // trailing-slash form. We test the trailing-slash form because that's
  // what external backlinks would have used; resolution is two-hop
  // (slash add then rename) but follow() lands on 200 either way.
  {
    from: "/case-study/number-artist/",
    to: "/case-study/diy-craft-ecom-brand",
  },

  // 9 historical BCMS-internal short URLs → canonical /seo/<cat>/<slug>/.
  {
    from: "/backlinks-management/",
    to: "/seo/linkbuilding/backlinks-management/",
  },
  {
    from: "/how-to-create-a-link-building-strategy/",
    to: "/seo/linkbuilding/how-to-create-a-link-building-strategy/",
  },
  {
    from: "/benefits-of-link-building/",
    to: "/seo/linkbuilding/benefits-of-link-building/",
  },
  {
    from: "/lets-discuss-google-search-updates/",
    to: "/seo/on-page/lets-discuss-google-search-updates/",
  },
  {
    from: "/marketing/first-step-in-marketing-research-process/",
    to: "/seo/on-page/first-step-in-marketing-research-process/",
  },
  {
    from: "/marketing/ppc/seo-vs-google-ads/",
    to: "/seo/technical/seo-vs-google-ads/",
  },
  {
    from: "/process-that-affects-visibility-of-website/",
    to: "/seo/on-page/process-that-affects-visibility-of-website/",
  },
  {
    from: "/seo/how-to-grow-your-business-online/",
    to: "/seo/on-page/how-to-grow-your-business-online/",
  },
  {
    from: "/seo/ranking-factors-seo/",
    to: "/seo/technical/ranking-factors-seo/",
  },

  // 2 legacy aliases.
  { from: "/marketing/", to: "/seo" },
  { from: "/web-design-development/", to: "/" },
];

async function head(url) {
  try {
    const res = await fetch(url, { redirect: "manual" });
    return {
      status: res.status,
      location: res.headers.get("location"),
    };
  } catch (e) {
    return { status: 0, location: null, error: String(e.message ?? e) };
  }
}

async function follow(url) {
  try {
    const res = await fetch(url, { redirect: "follow" });
    return { status: res.status };
  } catch (e) {
    return { status: 0, error: String(e.message ?? e) };
  }
}

let pass = 0;
let fail = 0;
const failures = [];

console.log(`Verifying ${RULES.length} redirect rules against ${BASE}\n`);

for (const rule of RULES) {
  const url = `${BASE}${rule.from}`;
  const r = await head(url);
  // Accept either trailing-slash or non-trailing-slash on the Location
  // header — Next normalises destinations per `trailingSlash: true`.
  const loc = r.location ?? "";
  const expectedNoSlash = rule.to.replace(/\/$/, "");
  const expectedSlash = expectedNoSlash + "/";
  const isRedirect = r.status === 301 || r.status === 308;
  const locOk =
    loc.endsWith(rule.to) ||
    loc.endsWith(expectedNoSlash) ||
    loc.endsWith(expectedSlash);
  if (isRedirect && locOk) {
    // Also confirm the destination resolves to 200.
    const followRes = await follow(url);
    if (followRes.status === 200) {
      pass++;
      console.log(`✓ ${rule.from} → ${rule.to} (${r.status})`);
    } else {
      fail++;
      console.log(
        `✗ ${rule.from} → ${rule.to} redirected (${r.status}) but destination returned ${followRes.status}`,
      );
      failures.push({ ...rule, ...r, finalStatus: followRes.status });
    }
  } else {
    fail++;
    const detail = r.error
      ? `error: ${r.error}`
      : `status=${r.status} location=${r.location ?? "(none)"}`;
    console.log(`✗ ${rule.from} → expected ${rule.to}, got ${detail}`);
    failures.push({ ...rule, ...r });
  }
}

console.log(`\n${pass}/${RULES.length} pass, ${fail} fail`);
if (fail > 0) {
  process.exitCode = 1;
}
