# Cutover checklist: heroicrankings.com → the new site on Vercel

Written 2026-10-07 after the final pre-launch crawl. Tick the boxes in order. Rollback at any point is step 6 in reverse.

## Pre-launch crawl result (2026-10-07)

- Live site: 140 pages crawled (sitemap + every internal link). All 140 resolve on the new site: 127 at the same URL, 10 are `/blog/?page=N` and `/case-study/?page=1` listings (same listing pages, pagination works, canonical `/blog/` like the live site), 3 are intentional 308 redirects (`/partnership/` → `/white-label-seo-partnership/`, `/case-study/number-artist/` → `/case-study/diy-craft-ecom-brand/`, `/seo/how-to-grow-your-business-online/` → `/seo/on-page/how-to-grow-your-business-online/`).
- New site: 151 indexable pages (24 new: podcast hub + 15 episodes, 5 case studies, Reddit marketing, white-label partnership, one team profile). 0 orphan pages. 0 broken internal links after fixing five old-shape in-body links (they were 404 on the live site too).
- SEO checks on all 151 pages: title present and ≤65 chars, description 70–165 chars, exactly one H1, canonical on heroicrankings.com, JSON-LD present, no image without alt, no duplicate titles or descriptions. 120 titles differ from the live site on purpose (meta-title work from the audit).
- Analytics on the deployed build: GA4 `G-JQPE5M229E` and Clarity present. `noindex` header on every page and `Disallow: /` in robots.txt until `NEXT_PUBLIC_SITE_INDEXING=true`.

## Phase 0: before touching DNS (do all of these first)

1. **Push and deploy.** GitHub Desktop → push `feat/homepage-motion`. In Vercel → Settings → Git check the Production Branch. If it is `main`, merge `feat/homepage-motion` into `main` (GitHub Desktop) and push; Vercel builds production from it. If it is `feat/homepage-motion`, pushing is enough.
2. **Production environment variables** (Vercel → Settings → Environment Variables, environment **Production**):
   - `NEXT_PUBLIC_SITE_URL` = `https://heroicrankings.com`
   - `NEXT_PUBLIC_SITE_INDEXING` = `true` — **Production only**. Leave it unset for Preview so `*.vercel.app` previews stay noindex.
   - `RESEND_API_KEY`, `CONTACT_FORM_TO`, `PARTNERSHIP_FORM_TO` (already set; confirm they are on Production too)
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_STUDIO_URL` (already set)
   Then Deployments → latest production → **Redeploy** so the build picks the values up.
3. **Domains in Vercel** (Settings → Domains): add `heroicrankings.com` and `www.heroicrankings.com`. Set `www` to **Redirect to heroicrankings.com** (308). Vercel then shows the DNS it expects: `A @ 76.76.21.21` and `CNAME www cname.vercel-dns.com`. If Vercel says the domain is used by another project or account, either remove it there or add the `_vercel` TXT record Vercel shows (that is only verification; it does not move traffic).
4. **Sanity CORS** (sanity.io/manage → project → API → CORS origins): add `https://heroicrankings.com` and `https://www.heroicrankings.com`, "Allow credentials" on. Needed for `/studio` and live preview on the new domain.
5. **Resend**: Domains → `notifications.heroicrankings.com` shows Verified. (Forms already tested end to end.)
6. **Write down the current Cloudflare DNS for rollback**: the `A`/`AAAA`/`CNAME` values for `@` and `www` (screenshot the DNS page). Rollback = put these back.

## Phase 1: the switch (Cloudflare → heroicrankings.com → DNS → Records)

7. `@` (root): edit the `A` record to `76.76.21.21`, proxy status **DNS only** (grey cloud). Delete any other `A`/`AAAA` records for `@`.
8. `www`: edit (or create) `CNAME www → cname.vercel-dns.com`, **DNS only**.
9. **Do not touch**: `MX` (Google Workspace), `TXT @` (SPF, google-site-verification), `TXT _dmarc`, `TXT mailjet._domainkey`, `TXT google._domainkey`, `TXT resend._domainkey`, everything under `portal`, `notifications` and `send.notifications`.
10. Why DNS only: Vercel issues the TLS certificate and serves from its edge; with the orange cloud Vercel cannot validate the certificate reliably and Cloudflare features (Rocket Loader, minify, email obfuscation) interfere with Next.js. If you want Cloudflare's proxy later, enable it only after Vercel shows a valid certificate, set SSL/TLS to **Full (strict)**, and keep Rocket Loader off.
11. Cloudflare → Rules: review Page Rules, Redirect Rules and Workers left from the old site. Remove any that rewrite paths or force the old `www` behaviour; the new site handles `http→https`, `www→apex`, trailing slashes and the old-URL redirects itself.
12. Back in Vercel → Domains, wait until both domains show **Valid Configuration** and a certificate (usually 1–10 minutes).

## Phase 2: verify within the first hour

13. In a private window: `https://heroicrankings.com/` shows the new site; `http://heroicrankings.com/` → https; `https://www.heroicrankings.com/` → apex.
14. `https://heroicrankings.com/robots.txt` has no `Disallow: /` and lists the sitemap; the response has **no** `X-Robots-Tag: noindex` header; `https://heroicrankings.com/sitemap.xml` returns 151 URLs.
15. `https://heroicrankings.com/partnership/` → white-label page; `/case-study/number-artist/` → DIY craft case study; `/marketing/` → `/seo/`.
16. Submit one real test on `/contact/` and one on `/white-label-seo-partnership/`: team email in sales@heroicrankings.com, confirmation in the submitter's inbox.
17. GA4 → Realtime shows your visit; Clarity shows a session.
18. Google Search Console (existing `heroicrankings.com` property, no new property): Sitemaps → resubmit `https://heroicrankings.com/sitemap.xml`; URL Inspection → Request indexing for `/`, `/seo/`, `/seo/linkbuilding/`, `/white-label-seo-partnership/`, `/podcast/`, `/blog/`.
19. `/studio/` loads and lets you edit (confirms Sanity CORS).

## Phase 3: the following two weeks

20. Keep the old hosting alive for at least a week (rollback is a DNS change). Mailjet can lapse after that; the new site never uses it.
21. GSC → Pages: watch for 404 spikes and "Page with redirect" entries; Vercel → Logs: filter status 404.
22. GSC → Core Web Vitals and Lighthouse on mobile for `/`, a post and a service page.
23. Optional later: redirect the `heroicrankingss.vercel.app` production alias to the domain (`has: host` redirect in `next.config.ts`); canonicals already point at heroicrankings.com, so this is tidiness, not a fix.

## Rollback

Put back the `A`/`CNAME` values from step 6 (DNS only is fine). The old site is live again within minutes. Nothing on Vercel needs to change.

## Done: 2026-10-07, evening

DNS switched (root `A 76.76.21.21`, `www` → Vercel, both DNS only). Verified from outside right after:
home 200 via Vercel with the latest build (team clip, portal deck, new favicon), Let's Encrypt certificate issued, HSTS on;
http → https 308, www → apex 301; `/partnership/`, `/case-study/number-artist/`, `/marketing/` and
`/seo/how-to-grow-your-business-online/` redirect 308 to their new URLs; robots.txt allows crawling and names the
sitemap; no `X-Robots-Tag` header on any page; sitemap 200 with 151 URLs on heroicrankings.com; GA4 and Clarity in the
HTML; portal.heroicrankings.com and Google Workspace MX untouched. Sitemap resubmitted in Search Console by Nebojsa.
