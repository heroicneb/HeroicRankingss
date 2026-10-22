/**
 * Undoes the 2026-10-23 reseed of the SEO hub document on the live dataset:
 * the published `seoServicePage-seo-services` goes back to its last version
 * before the reseed, 2026-10-22 22:36 UTC (Sanity history API, as of 12:00 UTC that day), and the new copy is kept as the
 * DRAFT of the same document, so localhost (which reads drafts) shows it and
 * production does not until someone presses Publish in the Studio.
 *
 *   node --env-file=.env.local --experimental-strip-types scripts/seo/restore-hub-2026-10-23.ts [--apply]
 */
const token = process.env.SANITY_API_WRITE_TOKEN;
if (!token) throw new Error("SANITY_API_WRITE_TOKEN missing");
const ID = "seoServicePage-seo-services";
const BASE = "https://y4pfm1uv.api.sanity.io/v2021-06-07";
const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
type Doc = Record<string, unknown> & { _id: string; _updatedAt?: string; solutions?: { hubCards?: unknown[] }; faq?: { items?: unknown[] }; seo?: { metaTitle?: string } };

const apply = process.argv.includes("--apply");
const histRes = await fetch(`${BASE}/data/history/production/documents/${ID}?time=2026-10-22T12:00:00Z`, { headers });
const hist = (await histRes.json()) as { documents?: Doc[] };
const old = hist.documents?.[0];
if (!old) throw new Error(`history lookup failed: ${histRes.status} ${JSON.stringify(hist).slice(0, 200)}`);
console.log("previous live version:", old._updatedAt, "| cards:", old.solutions?.hubCards?.length, "| faq:", old.faq?.items?.length, "| title:", old.seo?.metaTitle);
if (old.solutions?.hubCards?.length !== 7 || old.faq?.items?.length !== 3) throw new Error("unexpected previous version, stopping");

const cur = (await (await fetch(`${BASE}/data/doc/production/${ID}`, { headers })).json()) as { documents?: Doc[] };
const now = cur.documents?.[0];
if (!now) throw new Error("current document missing");
console.log("current live version:", now._updatedAt, "| cards:", now.solutions?.hubCards?.length, "| faq:", now.faq?.items?.length, "| title:", now.seo?.metaTitle);

const strip = (d: Doc, id: string) => { const copy: Record<string, unknown> = { ...d, _id: id }; delete copy._rev; delete copy._updatedAt; delete copy._createdAt; return copy; };
if (!apply) { console.log("dry run: would publish the previous version and keep the current one as drafts." + ID); process.exit(0); }
const res = await fetch(`${BASE}/data/mutate/production?returnIds=true`, {
  method: "POST", headers,
  body: JSON.stringify({ mutations: [{ createOrReplace: strip(now, `drafts.${ID}`) }, { createOrReplace: strip(old, ID) }] }),
});
console.log("mutate:", res.status, JSON.stringify(await res.json()).slice(0, 160));
