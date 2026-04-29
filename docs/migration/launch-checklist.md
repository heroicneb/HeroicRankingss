# Heroic Rankings — Production Cutover Checklist

Single source of truth for everything that has to flip when DNS moves
from the legacy heroicrankings.com to this Vercel deploy.

Author and reviewer should both sign off in order. Steps are grouped
into **Pre-flight** (do before cutover, reversible), **Cutover** (the
moment DNS swaps), and **Post-cutover** (verify within 30 min of swap).

---

## Pre-flight (T-1 day)

### Re-run audits against the staging URL

```bash
AUDIT_BASE=https://heroic-rankings-final.vercel.app \
  node scripts/audit/render-audit.mjs

AUDIT_BASE=https://heroic-rankings-final.vercel.app \
  node scripts/audit/verify-redirects.mjs

node --env-file=.env.local scripts/audit/case-study-coverage.mjs
```

Expected: render-audit 100/100, verify-redirects 35/35, case-study
coverage unchanged. Fail any check → fix before continuing.

### Content sanity

- Open `/insights`, `/case-studies`, `/about-us`, `/podcast`, `/team/<each>`
  in a browser. Visually confirm: thumbnails load, no white-on-white
  panels, no Lorem-ipsum survivors.
- Sanity Studio review: every published doc has a unique `mainImage` /
  `heroImage` / `photo` ref. The audit-fixture docs (IDs prefixed
  `audit-fixture-`) stay published — the GROQ filter hides them but
  keeps them queryable from `scripts/audit/*`.
- Verify `next.config.ts` `redirects()` matches the latest entries in
  `docs/migration/redirect-map.md`. The verify-redirects script covers
  every static rule plus a sample of each parameterized pattern.

### Note on audit-fixture HTTP status

Visiting `/podcast/audit-fixture-podcast-episode` returns HTTP 200 with
the Next.js not-found UI rendered (the M1 GROQ gate makes
`getPodcastEpisodeBySlug` return `null`, which calls `notFound()` —
but `force-dynamic` + Next 16 doesn't propagate the 404 status).
Cosmetic only: every listing query filters fixtures, and `X-Robots-Tag`
+ `<meta robots>` + `robots.txt` all forbid indexing. Skip unless we
add real podcast episodes that share an `audit-fixture-` ID prefix
(don't — use `migrate-` or `cms-`).

---

## Cutover (T-0)

### 1. Flip `NEXT_PUBLIC_SITE_URL` (if not already)

In Vercel project env vars, confirm `NEXT_PUBLIC_SITE_URL=https://heroicrankings.com`
on **Production** environment. The fallback in `src/lib/site.ts` already
uses `https://heroicrankings.com` so a missing env var won't break the
build, but the explicit set is required for `metadataBase`,
`alternates.canonical`, sitemap entries, OpenGraph URLs, and JSON-LD
to all line up.

### 2. Remove the noindex triple-lock

Three independent locks were added pre-launch. **All three must come
off in one PR**, otherwise mismatched signals confuse crawlers. Open
the PR, merge, and confirm Vercel deploy reaches Ready before flipping
DNS.

#### 2a. `src/app/layout.tsx` — `metadata.robots`

```ts
robots: {
  index: true,
  follow: true,
},
```

Replaces the current `index: false, follow: false, nocache: true,
googleBot: { ... }` block.

#### 2b. `src/app/robots.ts`

```ts
return {
  rules: [
    {
      userAgent: "*",
      allow: "/",
      disallow: ["/navbar-preview", "/studio"],
    },
  ],
  sitemap: `${SITE_URL}/sitemap.xml`,
};
```

Restores the per-path disallow list (the form before `b621215`).
Update `src/app/robots.test.ts` to match — currently asserts
`disallow === "/"`.

#### 2c. `middleware.ts`

Delete the `X-Robots-Tag` header line (added in `e6616f5`):

```ts
response.headers.set(
  "X-Robots-Tag",
  "noindex, nofollow, noarchive, nosnippet, noimageindex",
);
```

### 3. DNS swap

Point `heroicrankings.com` and `www.heroicrankings.com` A/CNAME records
at Vercel per their domain setup wizard. Lower TTL to 300s 24h before
the swap so rollback is fast.

### 4. Vercel domain attach

In Vercel project → Settings → Domains, add `heroicrankings.com` and
`www.heroicrankings.com`. Vercel will issue Let's Encrypt certs;
verify both resolve with HTTPS within 10 min.

---

## Post-cutover (T+0 to T+30 min)

### Smoke test on the real domain

```bash
AUDIT_BASE=https://heroicrankings.com \
  node scripts/audit/render-audit.mjs

AUDIT_BASE=https://heroicrankings.com \
  node scripts/audit/verify-redirects.mjs
```

Expected: 100/100 render + 35/35 redirects.

### Confirm noindex IS gone

```bash
curl -sI https://heroicrankings.com/ | grep -iE "x-robots-tag|content-security"
curl -s   https://heroicrankings.com/robots.txt
```

- No `x-robots-tag` header should appear.
- `robots.txt` body should show `Allow: /` plus the two disallow paths,
  not `Disallow: /`.
- Page source should NOT contain `<meta name="robots" content="noindex">`.

### Verify a few legacy URLs end-to-end on the real domain

```bash
for url in \
  /blog/ \
  /case-study/affinda/ \
  /seo/managed/best-ahrefs-alternatives/ \
  /about/nebojsa-jankovic/ \
  /case-study/number-artist/; do
  echo "=== $url ==="
  curl -sIL "https://heroicrankings.com$url" \
    | grep -iE "^location:|^HTTP" | head -4
done
```

Each should show one 308 redirect followed by a 200 on the new path.

### Search Console

1. Add the new property `https://heroicrankings.com` (HTTPS, root-domain
   variant). The legacy property may already be verified — keep both.
2. Submit `https://heroicrankings.com/sitemap.xml`.
3. Use the URL Inspection tool on 5–10 high-traffic legacy URLs to
   request indexing of the new equivalents.
4. Watch the **Coverage** report over the next 14 days. Expected
   pattern: legacy URLs drop into "Page with redirect" status; new
   URLs move from "Discovered" → "Crawled" → "Indexed". Drops in
   impressions for 7–14 days are normal.

### Analytics

- Vercel Analytics is wired (`@vercel/analytics`) and starts collecting
  automatically once the domain attaches.
- If GA4 / GTM is required, add the script in `(site)/layout.tsx`
  alongside `<Analytics />` with the request nonce
  (`headers().get(CSP_NONCE_HEADER)`) — the strict CSP will block
  unnoned inline scripts, same root cause as H5.

### Performance & SEO baselines

- Run Lighthouse on `/`, `/seo-services`, `/insights`, one case study,
  one team profile. Save the reports under `docs/audits/2026-XX-XX-launch/`
  for week-1 baseline.
- Spot-check Core Web Vitals in the Vercel Speed Insights dashboard
  after 24h of production traffic.

---

## Rollback plan

If anything is materially broken in the first hour:

1. In Vercel → Settings → Domains, detach `heroicrankings.com` and
   `www.heroicrankings.com`.
2. Re-attach them to the legacy origin's IP / CNAME (whatever was there
   before). DNS TTL was lowered to 300s pre-flight, so propagation
   should complete in 5–10 min.
3. Investigate on `heroic-rankings-final.vercel.app` (still the staging
   alias) without time pressure.
4. The noindex triple-lock revert PR can stay merged — but re-add it
   if the staging URL stays public during diagnosis (we don't want
   crawlers indexing both origins simultaneously).

---

## Open decisions still parked

- **BCMS asset strategy** post-launch: re-host complete? Still some
  hot-linked references? Audit `media-parity-extract.mjs` output before
  decommissioning the BCMS instance.
- **Search Console legacy property**: keep verified for at least 90 days
  to track redirect crawl progress, then unlist.
- **Sitemap fixtures**: confirmed clean — `src/app/sitemap.ts` reads
  through the gated `getPostSlugs / getCaseStudySlugs /
  getTeamMemberSlugs` queries, so the audit-fixture filter applies
  automatically. Verified `/sitemap.xml` returns zero `audit-fixture-*`
  entries on staging.
- **Podcast in sitemap**: `src/app/sitemap.ts` currently omits podcast
  episodes entirely. Add `getPodcastEpisodeSlugs()` once real episodes
  ship — pre-launch the only podcast doc is the audit fixture, which
  the gate would hide anyway.
