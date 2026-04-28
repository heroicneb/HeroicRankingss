# Heroic Rankings — Legacy URL Redirect Map (Draft)

Source: `https://heroicrankings.com/sitemap.xml` (95 URLs as of 2026-04-28).

Codex flagged redirects as **launch-day infrastructure**, not post-launch cleanup
(`docs/superpowers/specs/2026-04-28-launch-state-consolidation.md` — overrides
the original "descope" decision). Implement before DNS cutover.

Implementation target: extend the existing `redirects()` array in `next.config.ts`.

## Rules applied

- 1:1 mapping where a clear successor exists
- Closest topical match where exact 1:1 doesn't exist
- No many-to-one funneling to homepage (Codex HIGH risk: triggers soft-404)
- One-hop only (no chains)
- `permanent: true` (308 in Next 16, semantically equivalent to 301)
- Trailing slashes match the legacy URL form exactly

## Static page redirects

| Legacy URL | New URL |
|---|---|
| `/blog/` | `/insights` |
| `/case-study/` | `/case-studies` |
| `/about/` | `/about-us` |
| `/partnership/` | `/partnership` |
| `/contact/` | `/contact` |
| `/privacy-policy/` | `/privacy-policy` |
| `/seo/` | `/seo-services` |

## Service category redirects (not blog hub)

The `/seo/<category>/` URLs are service category pages on the legacy site, not
blog category indexes. Map each to its respective service page on the new site.

| Legacy URL | New URL |
|---|---|
| `/seo/technical/` | `/technical-seo` |
| `/seo/on-page/` | `/on-page-seo` |
| `/seo/local/` | `/local-seo` |
| `/seo/keyword-research/` | `/keyword-strategy` |
| `/seo/content-creation/` | `/content-creation` |
| `/seo/linkbuilding/` | `/link-building` |
| `/seo/e-commerce/` | `/ecommerce-seo` |
| `/seo/managed/` | `/insights` |

> **Note on `/seo/managed/`**: this one is genuinely the blog hub on the legacy
> site (where most articles live under `/seo/managed/<slug>/`). Mapping to
> `/insights` is correct.

## Case study redirects (per-slug)

| Legacy URL | New URL |
|---|---|
| `/case-study/affinda/` | `/case-studies/affinda` |
| `/case-study/my-baskets/` | `/case-studies/my-baskets` |
| `/case-study/nagish/` | `/case-studies/nagish` |
| `/case-study/art-by-maudsch/` | `/case-studies/art-by-maudsch` |
| `/case-study/designrush/` | `/case-studies/designrush` |
| `/case-study/number-artist/` | `/case-studies/diy-craft-ecom-brand` (already in `next.config.ts`) |

## Blog post redirects (per-slug, parameterized)

All legacy blog posts under `/seo/<category>/<slug>/` and `/blog/<slug>/` map
to `/insights/<slug>`. Implementable as two parameterized rules:

```ts
{ source: "/seo/:category/:slug/", destination: "/insights/:slug", permanent: true },
{ source: "/blog/:slug/",          destination: "/insights/:slug", permanent: true },
```

Coverage: ~72+ blog post URLs across `managed`, `content-creation`, `on-page`,
`technical`, `linkbuilding`, etc. categories.

**Order matters**: the service-category redirects above must come BEFORE the
parameterized `/seo/:category/:slug/` rule, otherwise `/seo/technical/` would
match the slug pattern and redirect incorrectly.

## Team profile redirects — DECISION REQUIRED

Legacy URL pattern: `/about/<slug>/` (e.g., `/about/nebojsa-jankovic/`).
There are 7 indexed team profile URLs.

The new site **removed** the `/team/[slug]` route in PR 1.5. Two options:

### Option A — Anchor deep-links (current default in this draft)

```ts
{ source: "/about/:slug/", destination: "/about-us#:slug", permanent: true },
```

- Pro: zero new code to ship
- Con: Codex HIGH risk — collapses public ProfilePage URLs into anchor
  fragments, weakens person/author entity SEO, breaks any external backlink
  expecting a real page

### Option B — Re-add `/team/[slug]` route with ProfilePage schema

Resurrect the route file, render the team-member popup as a full page (not
just a popup), add `Person` + `ProfilePage` JSON-LD schema. Map redirects:

```ts
{ source: "/about/:slug/", destination: "/team/:slug", permanent: true },
```

- Pro: preserves entity URLs, proper E-E-A-T signal, ProfilePage schema works,
  external backlinks resolve to real pages
- Con: ~3-4h to re-add the route + Person schema + tests + sitemap update

**Codex explicitly recommends Option B.** This draft uses Option A as default
pending Pavle's call.

## Asset redirects — NOT recommended

Legacy images served from `https://cdn.thebcms.com/api/v3/org/.../instance/.../media/...`
should NOT be redirected. Either:

1. Re-host into Sanity assets at migration time (recommended; severs BCMS
   dependency post-launch)
2. Keep hot-linking BCMS CDN (risk: legacy BCMS instance becomes a permanent
   dependency)

This is a separate decision, made during migration script implementation.
Codex flagged as HIGH risk + launch-day decision.

## Final next.config.ts redirects() implementation

Extend the existing `redirects()` function. Order: specific → general.

```ts
async redirects() {
  return [
    // Existing case study override (kept)
    {
      source: "/case-studies/number-artist",
      destination: "/case-studies/diy-craft-ecom-brand",
      permanent: true,
    },

    // Static pages (no params)
    { source: "/blog/", destination: "/insights", permanent: true },
    { source: "/case-study/", destination: "/case-studies", permanent: true },
    { source: "/about/", destination: "/about-us", permanent: true },
    { source: "/partnership/", destination: "/partnership", permanent: true },
    { source: "/contact/", destination: "/contact", permanent: true },
    { source: "/privacy-policy/", destination: "/privacy-policy", permanent: true },
    { source: "/seo/", destination: "/seo-services", permanent: true },

    // Service category pages (specific, must come BEFORE parameterized /seo/:cat/:slug/)
    { source: "/seo/technical/", destination: "/technical-seo", permanent: true },
    { source: "/seo/on-page/", destination: "/on-page-seo", permanent: true },
    { source: "/seo/local/", destination: "/local-seo", permanent: true },
    { source: "/seo/keyword-research/", destination: "/keyword-strategy", permanent: true },
    { source: "/seo/content-creation/", destination: "/content-creation", permanent: true },
    { source: "/seo/linkbuilding/", destination: "/link-building", permanent: true },
    { source: "/seo/e-commerce/", destination: "/ecommerce-seo", permanent: true },
    { source: "/seo/managed/", destination: "/insights", permanent: true },

    // Case studies (per-slug, explicit list — 6 + 1 alias above)
    { source: "/case-study/affinda/", destination: "/case-studies/affinda", permanent: true },
    { source: "/case-study/my-baskets/", destination: "/case-studies/my-baskets", permanent: true },
    { source: "/case-study/nagish/", destination: "/case-studies/nagish", permanent: true },
    { source: "/case-study/art-by-maudsch/", destination: "/case-studies/art-by-maudsch", permanent: true },
    { source: "/case-study/designrush/", destination: "/case-studies/designrush", permanent: true },
    { source: "/case-study/number-artist/", destination: "/case-studies/diy-craft-ecom-brand", permanent: true },

    // Blog posts (parameterized — covers ~72 posts under /seo/<cat>/<slug>/)
    { source: "/seo/:category/:slug/", destination: "/insights/:slug", permanent: true },
    { source: "/blog/:slug/", destination: "/insights/:slug", permanent: true },

    // Team profiles — UPDATE WHEN OPTION A vs B DECIDED
    // Option A (current default — anchor deep-link, weaker SEO):
    { source: "/about/:slug/", destination: "/about-us#:slug", permanent: true },
    // Option B (Codex recommendation — re-add /team/[slug] route with ProfilePage schema):
    // { source: "/about/:slug/", destination: "/team/:slug", permanent: true },
  ];
}
```

Total redirects defined: ~30 entries. Covers all 95 legacy URLs.

## Verification plan (pre-cutover)

1. Run `npm run build` — confirm no syntax errors in next.config.ts
2. Run `npm run dev` — boot dev server
3. Test each pattern:
   ```bash
   curl -sI http://localhost:3000/blog/ | grep -i location
   curl -sI http://localhost:3000/case-study/affinda/ | grep -i location
   curl -sI http://localhost:3000/seo/technical/ | grep -i location
   curl -sI http://localhost:3000/seo/managed/marketing-fundamentals/ | grep -i location
   curl -sI http://localhost:3000/about/nebojsa-jankovic/ | grep -i location
   ```
   Each should return a 308 with the correct `Location:` header.
4. Run a Playwright sweep over every URL in the sitemap and verify the
   redirect lands on a 200 (or expected destination).

## Outstanding decisions before implementation

- [ ] Option A vs B for team profile URLs (Pavle decides)
- [ ] Asset strategy: BCMS CDN passthrough vs Sanity re-host (decided at
  migration script time)
- [ ] Confirm the 6 case study slugs map cleanly (5 keep their slugs, only
  `number-artist` is renamed to `diy-craft-ecom-brand`)
- [ ] Verify all `/seo/managed/<slug>/` post slugs will exist as Sanity
  `post` documents post-migration (otherwise we 301 to a 404)
