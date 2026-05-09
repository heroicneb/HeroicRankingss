# Legacy URL Verification Baseline (heroicrankings.com)

> **Source:** `https://heroicrankings.com/sitemap.xml` fetched 2026-05-09.
> **Total:** 102 URLs.
> **Use:** every URL listed here MUST resolve to HTTP 200 on the new site post-cutover. This is the ground-truth verification target for the legacy URL path-match work tracked in `docs/plans/2026-05-09-legacy-url-path-match.md`.

## Inventory (sorted, deduped)

```
/
/about/
/about/anastasija-jankovic/
/about/andjela-knezevic/
/about/nebojsa-jankovic/
/about/slobodan-kacavenda/
/about/srdjan-gombar/
/about/stefan-cvetkovic/
/about/una-stanojevic/
/blog/
/case-study/
/case-study/affinda/
/case-study/art-by-maudsch/
/case-study/designrush/
/case-study/my-baskets/
/case-study/nagish/
/case-study/number-artist/
/contact/
/partnership/
/privacy-policy/
/seo/
/seo/content-creation/
/seo/e-commerce/
/seo/keyword-research/
/seo/linkbuilding/
/seo/local/
/seo/managed/
/seo/on-page/
/seo/technical/
```

29 "structural" routes above (root + hubs + categories + 7 team profiles + 6 case studies).

73 blog-post URLs under `/seo/<category>/<slug>/`:

```
/seo/content-creation/ai-content-for-seo-to-protect-rankings/
/seo/content-creation/authenticity-in-marketing/
/seo/content-creation/benefits-of-blogging-for-small-businesses-in-2026/
/seo/content-creation/content-marketing-statistics-2026/
/seo/content-creation/google-eeat-and-seo-in-2026/
/seo/content-creation/how-to-build-b2b-content-marketing-strategy/
/seo/content-creation/how-to-repurpose-old-blog-posts/
/seo/content-creation/seo-content-checklist/
/seo/content-creation/sonic-branding/
/seo/content-creation/top-content-marketing-strategies/
/seo/content-creation/topic-clusters-for-seo/
/seo/content-creation/weird-designs-in-branding/
/seo/content-creation/what-are-organic-keywords/
/seo/keyword-research/difference-between-marketing-and-sales-services/
/seo/linkbuilding/backlink-audit-guide/
/seo/linkbuilding/backlinks-management/
/seo/linkbuilding/benefits-of-link-building/
/seo/linkbuilding/best-backlinks-guide/
/seo/linkbuilding/craft-stunning-linkable-assets/
/seo/linkbuilding/dofollow-and-nofollow-links/
/seo/linkbuilding/how-many-backlinks-do-i-need-to-rank/
/seo/linkbuilding/how-to-create-a-link-building-strategy/
/seo/linkbuilding/international-link-building-guide/
/seo/linkbuilding/link-authority-essentials/
/seo/linkbuilding/link-building-statistics-2026/
/seo/linkbuilding/link-earning-strategies/
/seo/linkbuilding/link-exchange/
/seo/linkbuilding/outsourcing-link-building/
/seo/local/web-summit-lisbon-2023/
/seo/managed/5-reasons-your-seo-campaign-isnt-giving-you-the-results-you-want/
/seo/managed/ahrefs-vs-majestic-comparison/
/seo/managed/ahrefs-vs-moz-comparison/
/seo/managed/best-ahrefs-alternatives/
/seo/managed/best-competitor-analysis-tools/
/seo/managed/best-google-trends-alternatives/
/seo/managed/cro-statistics-2026/
/seo/managed/google-ai-overview-statistics-2026/
/seo/managed/google-search-statistics-and-trends/
/seo/managed/how-many-ads-do-we-see-a-day/
/seo/managed/how-to-do-market-research-guide/
/seo/managed/marketing-fundamentals/
/seo/managed/marketing-mistakes-you-need-to-stop-making/
/seo/managed/saas-seo-strategies/
/seo/managed/screaming-frog-vs-ahrefs-comparison/
/seo/managed/seo-principles-to-boost-your-rank/
/seo/managed/seo-proposal-breakdown/
/seo/managed/surfer-seo-vs-ahrefs-comparison/
/seo/managed/the-psychology-of-email-fatigue/
/seo/managed/top-backlink-analysis-tools-in-2026/
/seo/managed/top-link-building-tools-in-2026/
/seo/on-page/ai-for-seo-new-approaches/
/seo/on-page/b2b-seo-solutions-2026/
/seo/on-page/dive-into-google-algorithm-updates-2023/
/seo/on-page/first-step-in-marketing-research-process/
/seo/on-page/guide-to-keyword-research-strategies/
/seo/on-page/how-to-add-schema-markup/
/seo/on-page/how-to-do-an-internal-link-audit/
/seo/on-page/how-to-grow-your-business-online/
/seo/on-page/international-seo/
/seo/on-page/lets-discuss-google-search-updates/
/seo/on-page/mobile-seo-checklist-best-practices/
/seo/on-page/outdated-seo-practices-to-avoid-in-2026/
/seo/on-page/process-that-affects-visibility-of-website/
/seo/on-page/search-engine-rank-seo-stats-2024/
/seo/on-page/top-5-seo-myths/
/seo/on-page/what-is-a-content-pillar/
/seo/on-page/what-is-a-website-title/
/seo/on-page/what-is-internal-linking/
/seo/on-page/zero-click-searches/
/seo/technical/benefits-of-custom-software-development/
/seo/technical/ranking-factors-seo/
/seo/technical/ranking-high-search-engine-results/
/seo/technical/seo-marketing-practices-2026/
/seo/technical/seo-vs-google-ads/
```

## Distribution

| Category | Posts |
|---|---:|
| /seo/managed/ | 21 |
| /seo/on-page/ | 19 |
| /seo/linkbuilding/ | 14 |
| /seo/content-creation/ | 13 |
| /seo/technical/ | 5 |
| /seo/keyword-research/ | 1 |
| /seo/local/ | 1 |
| **Total posts** | **73** |

## Decision: strict literal match (A)

Per Pavle 2026-05-09: the new site **must serve every legacy URL at the same path with HTTP 200**. No 308 redirects for posts. This means:

- New route `/seo/[category]/[slug]/page.tsx` renders blog post detail.
- `Sanity post.urlCategory` field (NEW — required, enum) drives the URL category segment.
- Hub at `/blog/` (separate landing page listing all posts across categories).
- Sitemap emits the `/seo/<category>/<slug>/` form for each post.

**Category slug values (legacy form):**

```
content-creation
e-commerce
keyword-research
linkbuilding
local
managed
on-page
technical
```

These are the URL segments. Sanity `post.urlCategory` enum must use exactly these eight values.

## Verification protocol

After every phase:

```bash
node scripts/audit/verify-legacy-urls.mjs
```

Expected output: `102/102 OK` against the deployed Vercel preview, then again against production after cutover. Script TBD but spec:

```ts
const baseline = readFileSync('docs/migration/legacy-url-inventory.txt', 'utf8').trim().split('\n');
const base = process.env.AUDIT_BASE ?? 'http://localhost:3030';
for (const path of baseline) {
  const res = await fetch(`${base}${path}`, { redirect: 'follow' });
  if (res.status !== 200) console.error(`FAIL ${path} → ${res.status}`);
}
```

## Source artifacts

- `docs/migration/legacy-url-inventory.txt` — raw 102-line newline-delimited list (machine-readable).
- This document — categorized + decision context.
