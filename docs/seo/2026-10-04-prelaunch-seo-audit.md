# Pre-launch SEO / AEO / GEO audit — new heroicrankings.com

Date: 2026-10-04 · Branch `feat/homepage-motion` (commit 7340713) · Audited against a local production build with the indexing lock off (`NEXT_PUBLIC_SITE_INDEXING=true`, `NEXT_PUBLIC_SITE_URL=https://heroicrankings.com`), compared with the live heroicrankings.com.

Method: crawled all 132 sitemap URLs plus the podcast pages and parsed titles, descriptions, canonicals, robots, headings, images, JSON-LD and word counts; tested every one of the 129 URLs in the live site's sitemap against the new build; checked all 194 distinct internal links; ran Lighthouse 12 (mobile, simulated throttling) on six new-site templates and three live pages; reviewed the SEO code (`metadata.ts`, `robots.ts`, `sitemap.ts`, `components/seo/*`, security headers).

## 1. Verdict

The new site is structurally sound and safe to migrate: every live URL resolves, metadata is complete and unique everywhere, security headers are excellent, and schema coverage already exceeds the live site on posts. Three things must be fixed before the DNS cutover (section 8, P0), and the homepage needs a performance pass: it scores 53 on mobile against 72 for the live homepage, mainly from oversized images and a heavy initial payload. Everything else is incremental.

## 2. Lighthouse (mobile, simulated 4G)

| Page | New: Perf / A11y / Best practices / SEO | New LCP · TBT | Live: Perf / A11y / BP / SEO | Live LCP |
|---|---|---|---|---|
| Home | **53** / 97 / 96 / 100 | 10.9 s · 810 ms | 72 / 91 / 79 / 100 | 3.2 s |
| Service (link building) | 82 / 100 / 96 / 100 | 5.0 s · 10 ms | 70 / 92 / 79 / 100 | 8.2 s |
| Blog post | 86 / 100 / 96 / 100 | 4.2 s · 10 ms | 97 / 92 / 79 / 100 | 1.9 s |
| Case study | 80 / 96 / 96 / 100 | 5.5 s · 30 ms | – | – |
| Podcast episode | 82 / 100 / 96 / 100 | 4.8 s · 20 ms | – | – |
| Partnership | 86 / 93 / 96 / 100 | 4.2 s · 10 ms | – | – |

Caveats: the new site ran on localhost (TTFB 30 ms; Vercel will add network latency but still beat the live site's 520–1,310 ms TTFB). Lighthouse lab numbers are not Core Web Vitals field data; the new domain has no CrUX history yet.

Homepage weight breakdown: HTML 1,088 KB (160 KB inline CSS, 419 KB React server-component payload, 133 `<img>` tags, 45 KB inline SVG), 18 script chunks totalling 1,091 KB uncompressed, total transfer 2.9 MB vs 1.3 MB live. Lighthouse flags 1.6 MB of image savings: the Services cards request 1920 px / quality 95 renditions on a 375 px viewport (one card image alone is 656 KB).

## 3. Migration safety (live URLs → new site)

- 129 URLs in the live sitemap: 127 return 200 at the same URL, 2 redirect with 308 (`/partnership/` → `/white-label-seo-partnership/`, `/case-study/number-artist/` → `/case-study/diy-craft-ecom-brand`). None are missing.
- The `number-artist` redirect target lacks the trailing slash, so it is a two-hop redirect. Fix the destination to `/case-study/diy-craft-ecom-brand/`.
- New sitemap: 132 URLs (adds `/seo/reddit-marketing/`, the white-label page, two case studies, one team page). **The 16 podcast pages are not in the sitemap** although they are indexable and linked from the nav.
- All sitemap entries share one `lastmod` (build time), which makes the field meaningless to Google. Use real publish/update dates per URL.
- Trailing-slash and 404 handling are correct (`/seo` → `/seo/` 308; unknown paths return a real 404).

## 4. Metadata and on-page

Good: 132/132 pages have a unique title and description, a self-referencing canonical, exactly one H1, `robots: index, follow` once the lock is off, and every image has an `alt` attribute (840 decorative images use empty alt, which is correct). Descriptions are all 70–160 characters. `lang="en"`, viewport, Open Graph and Twitter cards present on every page.

Issues:
- **Service page titles are too short and unbranded**: "SEO Services" (12 chars), "Link Building Services" (22), "Contact Heroic Rankings". The live site uses e.g. "Managed SEO Services | Heroic Rankings". These came through the metadata sheet as exact titles; I recommend `<Service> Services | Heroic Rankings` or a benefit-led 50–60 character title. Ten pages affected.
- 24 post titles exceed 60 characters and will be truncated in results (e.g. "Authenticity in Marketing: Why Being Real Is the New Standard for Brand Success", 79). Candidates to shorten in the Studio.
- **Open Graph image is the generic site image on 125 of 132 pages.** Posts, case studies and podcast episodes should use their own hero image for social and AI-answer previews. Team pages already generate a personal OG image.
- Posts show no visible publish date, no "Updated" date and no `<time>` element. Google and AI engines use visible dates for freshness; the data exists in Sanity.

## 5. Structured data

Present on every page: `WebSite`, `Organization`, `BreadcrumbList`. Per template: service pages `FAQPage` (9/9); partnership `FAQPage`; posts `Article` (103/103) + `FAQPage` (65/103, the other 38 have no FAQ content); team pages `ProfilePage` + `Person`; case studies and podcast episodes nothing beyond the base set; homepage nothing beyond the base set.

Gaps against the live site and against what AI engines consume:
- `Organization` has only a phone contact and two `sameAs` links. The LinkedIn and X handles in the schema (`heroic-rankings`, `heroic_rankings`) differ from the ones in the site footer (`heroicrankings`); one of them is wrong. Add Instagram and YouTube (`@HeroicRankings`), a description, founding date, address/area served, founder (Nebojsa Jankovic, linked to his profile page) and the logo as a PNG rather than SVG.
- `Article` lacks `dateModified`, `mainEntityOfPage`, `author.url` (link to `/about/<slug>/`) and `publisher.logo`. These are the fields Google's article guidelines and most AI citation systems key on.
- `BreadcrumbList` labels are generated from URL slugs with a legacy map, producing "Seo", "Linkbuilding", "Case Study" instead of "SEO Services", "Link Building", "Case Studies".
- Service pages have no `Service` / `Offer` markup (the live site has `Service`, `Offer`, `OfferCatalog`). Podcast episodes have no `PodcastEpisode` / `VideoObject`. Case studies have no `Article`/`CreativeWork`. The homepage has no `WebPage` with `speakable`.

## 6. Content, AEO and GEO signals

- Depth is strong: posts average 3,300 words (min 1,613), none thin; each has a Key Takeaways block, which is the passage format AI Overviews and chat engines quote. Internal linking averages 28 links per post.
- FAQ blocks with matching schema on 65 posts and all service pages: good for direct answers.
- robots.txt allows all crawlers, including AI bots (GPTBot, ClaudeBot, PerplexityBot, Google-Extended) once the lock is off. No `llms.txt`; low priority, it is not a ranking or citation lever today.
- Missing E-E-A-T surface: no visible author byline linking to the author's profile page on posts, no visible dates (see §4). The author profile pages themselves are well marked up.
- One broken internal link: a post links to `/seo/on-page/b2b-seo-solutions-2024/` (the post is `…-2026/`).
- 53 internal links omit the trailing slash (`/seo`, `/contact`, many legacy in-body post links), each costing a 308 hop. Normalise hrefs to the trailing-slash form.
- Keyword/entity consistency: the podcast is named "Ranking Heroes" on Instagram/YouTube and "Ranking Heroes SEO Podcast" on site; keep `Organization`/`PodcastSeries` naming identical across properties.

## 7. Technical, security, accessibility

- Security headers: HSTS with preload, nonce-based CSP, X-Frame-Options DENY, nosniff, referrer and permissions policies. The live site scores 79 on best practices; the new site 96.
- **Console errors on every page**: Sanity Live's event stream is blocked by CORS because the serving origin is not in Sanity's CORS allow-list. Before cutover add `https://heroicrankings.com` and `https://www.heroicrankings.com` (and keep the Vercel preview origin) in Sanity → API → CORS origins. Without it, live content updates will not reach visitors' open tabs and the console stays noisy.
- No analytics or tag manager script is present in the new build. If GA4/GTM is expected at launch, it needs adding (with consent handling), otherwise launch day traffic will be unmeasured.
- Accessibility: homepage colour contrast fails on the four AI-section source chips, and four "Open …" links have aria-labels that do not match their visible text; the partnership portal mock's primary button fails contrast. Case study 96, everything else 100.
- The `inlineCss` option inlines 160 KB of CSS into every HTML response. It removes a render-blocking request but adds 160 KB to every page view; worth measuring on Vercel and reconsidering.

## 8. Prioritised fixes

**P0 — before DNS cutover**
1. Sanity CORS origins for the production domain(s).
2. Add podcast URLs to the sitemap; use real `lastmod` dates.
3. Homepage performance: correct `sizes`/quality on the Services card images, make the hero poster the priority LCP image, lazy-load below-the-fold client components (Answer Engine, logo field, charts), trim the serialised payload. Target ≥ 80 mobile.
4. Fix the broken post link and normalise trailing slashes in internal links; fix the `number-artist` redirect target.
5. Confirm analytics/consent setup; set `NEXT_PUBLIC_SITE_INDEXING=true` and `NEXT_PUBLIC_SITE_URL=https://heroicrankings.com` in Vercel production; www → apex redirect; submit the sitemap in Search Console on the domain property.

**P1 — first week after launch**
6. `Article`: `dateModified`, `mainEntityOfPage`, `author.url`, `publisher.logo`; visible publish/updated dates and author byline on posts.
7. `Organization` enrichment and one consistent set of social handles; `Service` schema on service pages; `PodcastEpisode`/`VideoObject` on episodes; breadcrumb labels.
8. Per-page Open Graph images for posts, case studies and podcasts.
9. Service page titles to ~55 characters with the brand.

**P2 — later**
10. Contrast fixes; shorten the 24 long post titles; case-study schema; JS/CSS diet; optional `llms.txt`.

## 9. About the claude-seo plugin (github.com/AgricIDaniel/claude-seo)

MIT-licensed, ~18k stars, v2.4.1 (Sept 2026). It wraps 26 sub-skills (technical, content/E-E-A-T, schema, GEO/AEO citability scoring, sitemap) and runs without API keys by fetching the target URL; optional PageSpeed/CrUX/Search Console keys enrich it. It is a good second opinion once the P0/P1 fixes are in, pointed at the Vercel preview or the live domain. Install from an interactive `claude` terminal (not from this session):

```
/plugin marketplace add AgriciDaniel/claude-seo
/plugin install claude-seo@agricidaniel-claude-seo
/seo setup
```

Then run `/seo audit https://heroicrankingss.vercel.app` (or the live domain after cutover). It needs Python 3.10+; this Mac has 3.9.6, so Python will need updating first.
