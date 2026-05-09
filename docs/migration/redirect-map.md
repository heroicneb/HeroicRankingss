# Heroic Rankings — Legacy URL Redirect Map (final)

Strict literal match per `docs/migration/legacy-url-verification-baseline.md`.
The new site serves the legacy heroicrankings.com URL structure directly:
no redirects needed for the 102 indexed legacy URLs.

Verify: `node scripts/audit/verify-legacy-urls.mjs` → 102/102 PASS.

## Redirects still in `next.config.ts`

Only retained where source ≠ destination (slug renames + legacy short URLs):

| Source | Destination | Reason |
|---|---|---|
| `/case-study/number-artist` | `/case-study/diy-craft-ecom-brand` | Slug rename — Number Artist → DIY Craft eCom Brand |
| `/backlinks-management/` | `/seo/linkbuilding/backlinks-management/` | Pre-restructure legacy short URL |
| `/how-to-create-a-link-building-strategy/` | `/seo/linkbuilding/how-to-create-a-link-building-strategy/` | Same |
| `/benefits-of-link-building/` | `/seo/linkbuilding/benefits-of-link-building/` | Same |
| `/lets-discuss-google-search-updates/` | `/seo/on-page/lets-discuss-google-search-updates/` | Same |
| `/marketing/first-step-in-marketing-research-process/` | `/seo/on-page/first-step-in-marketing-research-process/` | Same |
| `/marketing/ppc/seo-vs-google-ads/` | `/seo/technical/seo-vs-google-ads/` | Same |
| `/process-that-affects-visibility-of-website/` | `/seo/on-page/process-that-affects-visibility-of-website/` | Same |
| `/seo/how-to-grow-your-business-online/` | `/seo/on-page/how-to-grow-your-business-online/` | Same |
| `/seo/ranking-factors-seo/` | `/seo/technical/ranking-factors-seo/` | Same |
| `/marketing/` | `/seo` | Legacy alias |
| `/web-design-development/` | `/` | Legacy alias |

## What's NOT in `next.config.ts` (dropped during phases 1–4c)

- `/blog/`, `/case-study/`, `/about/`, `/seo/` + 7 SEO category hubs — all serve directly.
- 6 case-study `/case-study/<slug>/` rules — now identity.
- `/about/<slug>/` → `/team/<slug>/` — replaced by route merge into `/about/<slug>/`.
- `/seo/managed/` → `/blog` — dropped: legacy doesn't serve `/seo/managed/` either (it's a phantom hub; only individual `/seo/managed/<slug>/` posts exist on legacy + new).
- `/blog/<slug>/` ↔ `/seo/<cat>/<slug>/` — circular pair, dropped after route consolidation.
- `/seo/<cat>/<slug>/` → `/blog/<slug>/` catch-all — dropped now that the dynamic route serves directly.

## Verification protocol

1. `node scripts/audit/verify-legacy-urls.mjs` — checks all 102 legacy paths return HTTP 200 (after follow). Reads `docs/migration/legacy-url-inventory.txt`.
2. `node scripts/audit/verify-redirects.mjs` — checks the 12 retained redirect rules each emit a 308 with the correct `Location` header and the final destination is HTTP 200.

Ship gate: both must report 0 failures against `AUDIT_BASE=https://heroic-rankings-final.vercel.app` AND post-cutover `https://heroicrankings.com`.
