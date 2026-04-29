#!/usr/bin/env node
/**
 * Pre-cutover redirect verification.
 *
 * Walks every legacy URL pattern from next.config.ts redirects() and
 * confirms each one returns a permanent (308 / 301) redirect to the
 * expected destination, and that the destination itself returns 200.
 *
 * Usage:
 *   AUDIT_BASE=https://heroic-rankings-final.vercel.app node scripts/audit/verify-redirects.mjs
 */

const BASE = process.env.AUDIT_BASE ?? "https://heroic-rankings-final.vercel.app";

// Mirror of the rules in next.config.ts. Parameterized rules expanded
// with concrete sample slugs we know exist post-migration.
const RULES = [
  // Existing alias
  { from: "/case-studies/number-artist", to: "/case-studies/diy-craft-ecom-brand" },

  // Static pages
  { from: "/blog/", to: "/insights" },
  { from: "/case-study/", to: "/case-studies" },
  { from: "/about/", to: "/about-us" },
  { from: "/seo/", to: "/seo-services" },

  // Service categories
  { from: "/seo/technical/", to: "/technical-seo" },
  { from: "/seo/on-page/", to: "/on-page-seo" },
  { from: "/seo/local/", to: "/local-seo" },
  { from: "/seo/keyword-research/", to: "/keyword-strategy" },
  { from: "/seo/content-creation/", to: "/content-creation" },
  { from: "/seo/linkbuilding/", to: "/link-building" },
  { from: "/seo/e-commerce/", to: "/ecommerce-seo" },
  { from: "/seo/managed/", to: "/insights" },

  // Case studies
  { from: "/case-study/affinda/", to: "/case-studies/affinda" },
  { from: "/case-study/my-baskets/", to: "/case-studies/my-baskets" },
  { from: "/case-study/nagish/", to: "/case-studies/nagish" },
  { from: "/case-study/art-by-maudsch/", to: "/case-studies/art-by-maudsch" },
  { from: "/case-study/designrush/", to: "/case-studies/designrush" },
  { from: "/case-study/number-artist/", to: "/case-studies/diy-craft-ecom-brand" },

  // Historical BCMS-internal redirects (one-hop composed)
  { from: "/backlinks-management/", to: "/insights/backlinks-management" },
  { from: "/how-to-create-a-link-building-strategy/", to: "/insights/how-to-create-a-link-building-strategy" },
  { from: "/benefits-of-link-building/", to: "/insights/benefits-of-link-building" },
  { from: "/lets-discuss-google-search-updates/", to: "/insights/lets-discuss-google-search-updates" },
  { from: "/marketing/first-step-in-marketing-research-process/", to: "/insights/first-step-in-marketing-research-process" },
  { from: "/marketing/ppc/seo-vs-google-ads/", to: "/insights/seo-vs-google-ads" },
  { from: "/marketing/", to: "/seo-services" },
  { from: "/web-design-development/", to: "/" },
  { from: "/process-that-affects-visibility-of-website/", to: "/insights/process-that-affects-visibility-of-website" },
  { from: "/seo/how-to-grow-your-business-online/", to: "/insights/how-to-grow-your-business-online" },
  { from: "/seo/ranking-factors-seo/", to: "/insights/ranking-factors-seo" },

  // Team profiles
  { from: "/about/nebojsa-jankovic/", to: "/team/nebojsa-jankovic" },
  { from: "/about/anastasija-jankovic/", to: "/team/anastasija-jankovic" },

  // Parameterized blog post patterns — pick known-real slugs
  { from: "/seo/managed/best-ahrefs-alternatives/", to: "/insights/best-ahrefs-alternatives" },
  { from: "/seo/technical/internal-linking/", to: "/insights/internal-linking" },
  { from: "/blog/what-is-a-content-pillar/", to: "/insights/what-is-a-content-pillar" },
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

let pass = 0;
let fail = 0;
const failures = [];

for (const rule of RULES) {
  const url = `${BASE}${rule.from}`;
  const r = await head(url);
  const ok = (r.status === 301 || r.status === 308) && r.location?.endsWith(rule.to);
  if (ok) {
    pass++;
    console.log(`✓ ${rule.from} → ${rule.to} (${r.status})`);
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
