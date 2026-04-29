## VERDICT (revised)
The BCMS API should remain the primary migration source, but the basis has changed: this is now a structured-API-first migration, not a prose-scrape fallback. The spike/parity data in [bcms-spike-report.json](/Users/pavle/Developer/clients/heroic/heroic-rankings-final/scripts/bcms-spike-report.json:1132), [bcms-parity-report.json](/Users/pavle/Developer/clients/heroic/heroic-rankings-final/scripts/bcms-parity-report.json:104), and the stale assumption in [2026-04-28-heroic-rankings-bundled-launch-design.md](/Users/pavle/Developer/clients/heroic/heroic-rankings-final/docs/superpowers/specs/2026-04-28-heroic-rankings-bundled-launch-design.md:441) conflict directly: BCMS case studies already contain structured `challenges`, `strategy_items`, `execution_cards`, `results_cards`, and `conclusion_content`. The plan should therefore be: import BCMS structure deterministically, relax the few over-constrained Sanity shapes that would otherwise force lossy coercion, and treat redirects plus body conversion as launch blockers.

## FIELD MAPPING — case-study
Grounded in [bcms-spike-report.json](/Users/pavle/Developer/clients/heroic/heroic-rankings-final/scripts/bcms-spike-report.json:1132), [bcms-parity-report.json](/Users/pavle/Developer/clients/heroic/heroic-rankings-final/scripts/bcms-parity-report.json:5), and [caseStudy.ts](/Users/pavle/Developer/clients/heroic/heroic-rankings-final/src/sanity/schemaTypes/documents/caseStudy.ts:16).

| BCMS prop | type | Sanity field | conversion notes |
|---|---|---|---|
| `title` | string | `title` | Exact copy. |
| `slug` | slug | `slug.current` | Exact copy; abort on cross-type slug collision before import. |
| `seo` | object | `seo.metaTitle`, `seo.metaDescription`, `seo.ogImage` | Field-map into the shared SEO object from [seo.ts](/Users/pavle/Developer/clients/heroic/heroic-rankings-final/src/sanity/schemaTypes/objects/seo.ts:3). |
| `read_time` | string/number | none currently | Add field or keep in provenance; current schema drops it. |
| `date` | date | `publishedAt` | Normalize to ISO datetime. |
| `service_featured_title` | string | `caseOverview.headingMain` | Best fit for current schema; keep `headingHighlighted` empty unless a deterministic split rule is introduced. |
| `service_featured_description` | rich text | `caseOverview.body` | Convert to normalized plain text because current field is `text`, not Portable Text. |
| `hero_image` | media | `heroImage` | Re-host to Sanity; preserve alt/caption at field level. |
| `description` | string | `excerpt` | Exact copy, trimmed. |
| `our_job` | string | `services[]` | Only via explicit enum map to current values in [caseStudy.ts](/Users/pavle/Developer/clients/heroic/heroic-rankings-final/src/sanity/schemaTypes/documents/caseStudy.ts:696); if unmapped, leave unset and report. |
| `website` | object `{label,href}` | none currently | Schema gap. Add a field if 1:1 fidelity matters; do not drop silently. |
| `objective` | rich text | `objectiveChallenges.body` | Convert to plain text summary for current schema. |
| `challenges[]` | array<object> | `objectiveChallenges.items[]` | `title -> title`, `description -> body`, `_key` deterministic, `number` from index (`01`,`02`,`03`); `subtitle` has no slot, so either prepend to `body` or extend schema. |
| `strategy_items[]` | array<rich text> | `strategyPillars[]` | Current schema is not 1:1 compatible: it requires exactly 6 items, each with `title`, `intro`, `bullets`, and required `icon` [caseStudy.ts](/Users/pavle/Developer/clients/heroic/heroic-rankings-final/src/sanity/schemaTypes/documents/caseStudy.ts:260). Sample BCMS data includes one intro item plus five strategies and no icons. Relax schema first. |
| `execution_description` | string | none currently in `journeyTimeline` | Current `journeyTimeline` has no body field [caseStudy.ts](/Users/pavle/Developer/clients/heroic/heroic-rankings-final/src/sanity/schemaTypes/documents/caseStudy.ts:317). Add one or preserve in provenance; otherwise this is lost. |
| `execution_cards[]` | array<object> | `journeyTimeline.items[]` | `title -> title`, rich-text `description -> body` as plain text; `subtitle` has no slot. |
| `results_description` | string | `proofData.body` | Best current fit. |
| `results_cards[]` | array<object> | `proofData.items[]` | Use `title -> title`, rich-text `description -> body`, `media -> image`. Current schema wrongly requires `image` on every card [caseStudy.ts](/Users/pavle/Developer/clients/heroic/heroic-rankings-final/src/sanity/schemaTypes/documents/caseStudy.ts:524); BCMS sample includes a card with no media [bcms-parity-report.json](/Users/pavle/Developer/clients/heroic/heroic-rankings-final/scripts/bcms-parity-report.json:262). Make `image` optional before import. |
| `results_cards_as_accordion` | boolean | none currently | Preserve in provenance or add a presentation flag; otherwise you lose layout intent. |
| `conclusion_description` | rich text | `conclusion.body` | Prepend, then append `conclusion_content.description` blocks. |
| `conclusion_content.title` | string | `conclusion.heading` | Exact copy. |
| `conclusion_content.subtitle` | string/null | `conclusion.gradientSubhead` | Exact copy when present. |
| `conclusion_content.description` | rich text | `conclusion.body` | Convert to Portable Text; append after `conclusion_description`. |
| `full_content` if present in `content.en` | rich text | `body` | Use only as legacy appendix; sample case study had this empty. |

Current Sanity fields with no BCMS source and therefore editor-owned or defaulted: `titleHighlighted`, `heroSubtitle`, `heroMetrics`, `panelLabel`, `featured`, `quoteText`, `metrics`, `growthChart`, `beforeAfter`, `ctaFooter`, and possibly `client` unless you derive `client = website.label ?? title`.

## FIELD MAPPING — blog → post
Grounded in [bcms-spike-report.json](/Users/pavle/Developer/clients/heroic/heroic-rankings-final/scripts/bcms-spike-report.json:554), [bcms-parity-report.json](/Users/pavle/Developer/clients/heroic/heroic-rankings-final/scripts/bcms-parity-report.json:339), [post.ts](/Users/pavle/Developer/clients/heroic/heroic-rankings-final/src/sanity/schemaTypes/documents/post.ts:3), and [portableText.ts](/Users/pavle/Developer/clients/heroic/heroic-rankings-final/src/sanity/schemaTypes/objects/portableText.ts:3).

| BCMS prop | type | Sanity field | conversion notes |
|---|---|---|---|
| `title` | string | `title` | Exact copy. |
| `slug` | slug | `slug.current` | Exact copy. |
| `seo` | object | `seo.metaTitle`, `seo.metaDescription`, `seo.ogImage` | Field-map into shared SEO object. |
| `cover_image` | media | `mainImage` | Re-host; require alt. |
| `date` | date | `publishedAt` | Normalize to ISO datetime. |
| `read_time` | string/number | none currently | Add field or keep in provenance; current schema drops it. |
| `description` | string | `excerpt` | Exact copy. |
| `author` | entry pointer | `author` | Resolve to imported `teamMember` by BCMS ID. |
| `category` | entry pointer | `categories[]` | Deterministic map from BCMS category slug/title to current enum values in [post.ts](/Users/pavle/Developer/clients/heroic/heroic-rankings-final/src/sanity/schemaTypes/documents/post.ts:102); abort on unmapped category. |
| `related_service` | entry pointer | none currently | Add a reference field if parity matters; current schema drops it. |
| `content.en` / `full_content` | node array | `body` | Convert BCMS node HTML to Portable Text; fail on unsupported blocks rather than flattening. |

Current post fields with no BCMS source and therefore editor-owned: `titleHighlighted`. The bigger gap is not `titleHighlighted`; it is missing `related_service` and `read_time`.

## FIELD MAPPING — person → teamMember
Grounded in [bcms-spike-report.json](/Users/pavle/Developer/clients/heroic/heroic-rankings-final/scripts/bcms-spike-report.json:643), [bcms-parity-report.json](/Users/pavle/Developer/clients/heroic/heroic-rankings-final/scripts/bcms-parity-report.json:2627), [teamMember.ts](/Users/pavle/Developer/clients/heroic/heroic-rankings-final/src/sanity/schemaTypes/documents/teamMember.ts:3), and the live route consumer in [page.tsx](/Users/pavle/Developer/clients/heroic/heroic-rankings-final/src/app/(site)/(pages)/team/[slug]/page.tsx:81).

| BCMS prop | type | Sanity field | conversion notes |
|---|---|---|---|
| `title` | string | `name` | Exact copy. |
| `slug` | slug | `slug.current` | Exact copy. |
| `seo` | object | none currently | Schema gap if `/team/[slug]` needs legacy meta parity. |
| `bio` | string | `bio` | Exact copy. |
| `role` | string | `role` | Exact copy. |
| `image` | media | `photo` | Re-host; require alt. |
| `description` | rich text | `bioParagraphs[]` | Convert each top-level paragraph/list cluster into one paragraph string; do not jam raw HTML into `bio`. |
| `cards[]` | array<object> | none currently | Major gap. Current schema has only one `cardImage`, but BCMS sample has a 6-image gallery [bcms-parity-report.json](/Users/pavle/Developer/clients/heroic/heroic-rankings-final/scripts/bcms-parity-report.json:2627). Add a gallery/cards field; otherwise you lose real content. |
| `featured` | boolean | none currently | Add field only if homepage/team ordering uses it; otherwise keep in provenance. |
| `linkedin` | url | `linkedin` and `socialLinks[]` | Populate both. The route JSON-LD uses `socialLinks`, not hidden legacy `linkedin` [page.tsx](/Users/pavle/Developer/clients/heroic/heroic-rankings-final/src/app/(site)/(pages)/team/[slug]/page.tsx:81). |
| `team_member` | boolean | `showOnAboutPage` | Exact copy. |

Current team-member fields with no BCMS source and therefore editor-owned or defaulted: `department`, `cardImage`, `contact`, and `order`.

## FIELD MAPPING — service, company, testimonial, certificate, blog-category (briefly)
Grounded in [bcms-spike-report.json](/Users/pavle/Developer/clients/heroic/heroic-rankings-final/scripts/bcms-spike-report.json:1310), [servicePage.ts](/Users/pavle/Developer/clients/heroic/heroic-rankings-final/src/sanity/schemaTypes/documents/servicePage.ts:1), [testimonial.ts](/Users/pavle/Developer/clients/heroic/heroic-rankings-final/src/sanity/schemaTypes/documents/testimonial.ts:1), and [queries.ts](/Users/pavle/Developer/clients/heroic/heroic-rankings-final/src/sanity/lib/queries.ts:149).

| BCMS template | migrate / skip / defer | rationale |
|---|---|---|
| `service` | Migrate | Real launch consumer exists via `servicePage` schema and `SERVICE_PAGE_BY_SLUG_QUERY`. Also needed for `related_service` parity and service redirects. |
| `company` | Defer | I found no first-class `company` schema or query consumer in the current Sanity stack. Do not invent one for launch unless a page actually renders it. |
| `testimonial` | Migrate | Real schema and query consumer exist. This is low-risk, high-parity content. |
| `certificate` | Defer | I found no current Sanity schema/consumer for certificates. Launch only if a real UI depends on them. |
| `blog-category` | Do not migrate as public docs for this launch | Current post model uses string enums, not category references. Use BCMS category entries as lookup inputs plus provenance, not as a new live content type. |

## ASSET PIPELINE
1. Re-host everything to Sanity. Hotlinking BCMS media is the wrong launch choice because the BCMS URLs in the parity data keep the site operationally dependent on BCMS forever.
2. Build a media registry keyed by BCMS media `_id`, not filename. Filenames collide; IDs do not.
3. Download the original asset once per BCMS media item. Ignore BCMS `sizeTransforms`; upload originals and let Sanity generate derivatives.
4. Upload with bounded concurrency, `3-5` at a time, with retry on `429`/`5xx` using exponential backoff and a persistent checkpoint file so reruns resume cleanly.
5. Store `originalFilename`, BCMS `_id`, width, height, mimetype, size, and source URL in provenance or a manifest.
6. Apply alt/caption at the field usage level after upload. BCMS already gives `alt_text` and `caption` when present; when blank, generate a deterministic fallback from the content context, not the filename.
7. Use a stable usage key like `<entryId>:<fieldPath>:<index>` so the same Sanity asset can be reused across multiple fields without ambiguity.
8. Abort if a download hash changes for the same BCMS media `_id` during a run. That indicates source drift mid-migration.

Operational references: Sanity asset handling and uploads are documented in [Sanity Assets](https://www.sanity.io/docs/content-lake/assets), and BCMS media behavior in [BCMS Media](https://thebcms.com/docs/inside-bcms/media).

## REFERENCE RESOLUTION ORDER
1. Full preflight inventory: gather every BCMS entry ID, slug, status, locale, pointer, body-node type, and asset reference first. The current scripts only sample, which is not enough.
2. Canonical URL map: compute every final Next.js URL before body conversion so internal links can be rewritten once.
3. Asset registry: upload and register all referenced assets before document creation so image references are stable.
4. Team members: posts depend on authors, and `/about/:slug/ -> /team/:slug` is already the chosen route.
5. Testimonials: independent and already consumed.
6. Service pages: create base service docs before posts so `related_service` can resolve if you add the field.
7. Case studies: service pages may reference them later, but case studies themselves do not need posts.
8. Patch service pages with `relatedCaseStudies` after case studies exist.
9. Posts last: they are the most body-conversion-heavy and depend on author/category/service URL resolution.
10. Redirect config last, but before cutover: it depends on final slug outcomes, not guesses.

## BODY CONVERSION (BCMS nodes → PortableText)
1. Treat each BCMS node as structured input, not as a blob. If `value` is HTML string, convert. If `value` is an object, route through a custom handler or fail the page.
2. Use `htmlToBlocks()` with explicit `parseHtml` in Node and custom rules for links, lists, images, and unsupported tags. The official usage pattern is documented in [Portable Text block-tools](https://github.com/portabletext/editor/tree/main/packages/block-tools).
3. Preprocess HTML before conversion: decode entities, normalize NBSP and smart quotes, strip empty `<p>` wrappers, and preserve `<br>` as hard line breaks.
4. Rewrite internal anchors during conversion using the final composed redirect map. Do not leave legacy `/seo/...`, `/blog/...`, `/case-study/...`, or `/about/...` links inside Portable Text.
5. Convert `<img>` tags into Portable Text image blocks and re-host them through the asset pipeline. Current `portableText` supports block and image only [portableText.ts](/Users/pavle/Developer/clients/heroic/heroic-rankings-final/src/sanity/schemaTypes/objects/portableText.ts:3).
6. Preserve nested ordered and unordered lists exactly. The sample BCMS blog body already contains both.
7. Do not silently flatten tables or object-valued nodes. The parity sample contains object-valued nodes in blog content, and current Portable Text schema has no table block. Extend schema or fail import for those entries.
8. Do not silently flatten code blocks either. Current schema supports inline `code` decorator, not standalone code-block objects.
9. For case-study rich-text fields that currently target `text` fields, convert to normalized plain text with paragraph separation. For fields targeting `portableText`, keep real blocks.

## PROVENANCE FIELDS
Use a shared top-level `migrationSource` object on every migrated doc. Do not hide this in a sidecar only. Sidecars are fine for run logs, not for per-document operational truth.

| field | type | note |
|---|---|---|
| `migrationSource.provider` | string | `"bcms"` |
| `migrationSource.template` | string | `blog`, `case-study`, `person`, etc. |
| `migrationSource.bcmsId` | string | Source entry ID |
| `migrationSource.legacyUrl` | string | Canonical legacy public URL |
| `migrationSource.sourceChecksum` | string | Hash of normalized BCMS source payload |
| `migrationSource.lastAppliedOwnedChecksum` | string | Hash of importer-owned Sanity paths after write |
| `migrationSource.importedAt` | datetime | Last successful import time |
| `migrationSource.sourceUpdatedAt` | datetime/string | Source update timestamp if available |
| `migrationSource.sourceLocale` | string | Usually `en`, but do not assume globally |
| `migrationSource.sourceStatus` | array<string> | Preserve BCMS status labels |
| `migrationSource.ownedPaths` | array<string> | Exact Sanity paths the importer is allowed to patch |
| `migrationSource.assetIds` | array<string> | Referenced BCMS media IDs |
| `migrationSource.unmappedFields` | array<string> | Explicitly list anything dropped or deferred |

## IDEMPOTENCY
Use deterministic document IDs like `migrate-caseStudy-<bcmsId>` and `migrate-post-<bcmsId>`. Do not use dots in `_id`; Sanity treats dotted IDs as private subpaths and documents them as special-path IDs in [IDs and Paths](https://www.sanity.io/docs/content-lake/ids).

On rerun:
1. Recompute normalized source payload and `sourceChecksum`.
2. If checksum matches existing `migrationSource.sourceChecksum`, skip.
3. If checksum differs, recompute the exact importer-owned projection and compare it to `lastAppliedOwnedChecksum`.
4. If current owned fields differ from `lastAppliedOwnedChecksum`, an editor changed importer-owned content in Sanity. Skip and emit a conflict instead of overwriting.
5. Patch only `ownedPaths`, never the whole document.
6. Use `patch().set()` and `setIfMissing()` for defaults, plus `ifRevisionId()` to fail on concurrent edits. Sanity documents this in [JS client mutations](https://www.sanity.io/docs/apis-and-sdks/js-client-mutations) and [HTTP patches](https://www.sanity.io/docs/content-lake/http-patches).
7. Keep stable `_key`s for arrays from `<bcmsId>-<field>-<index>` so diffing is stable across reruns.

## VALIDATION HARNESS
1. Pre-import validation: no slug collisions, no unmapped categories, no unresolved pointers, no unsupported body node types, no missing redirect targets.
2. Document-level parity: compare BCMS source and Sanity doc field-by-field on all deterministic fields, including array counts and asset refs.
3. Render-level parity: render the new page in preview, fetch the legacy HTML, normalize whitespace/entities, and compare H1, meta title, meta description, canonical URL, hero image, section counts, and internal links.
4. Blog threshold: normalized visible text must match exactly apart from whitespace/entity normalization. Any dropped table/image/link is a fail.
5. Case-study threshold: exact counts for `challenges`, `strategy_items`, `execution_cards`, and `results_cards`; exact preservation of any card-level images and links.
6. Team threshold: exact name/role/bio parity, LinkedIn present in JSON-LD, and full gallery parity if `cards[]` is migrated.
7. Redirect threshold: every legacy URL resolves in one hop to the final URL and returns `200`. No chains, no loops.
8. Asset threshold: zero BCMS CDN URLs remain in rendered HTML or Sanity documents after migration.
9. Launch gate: fail launch on any unsupported body element, unresolved reference, redirect chain, or missing required image alt.

## REDIRECTS — final composed map
The draft in [redirect-map.md](/Users/pavle/Developer/clients/heroic/heroic-rankings-final/docs/migration/redirect-map.md:20) says “30 redirects,” but the repo currently grounds 24 explicit rules/patterns, not 30. The team-profile question is already resolved in code: Option B is live via `/about/:slug/ -> /team/:slug` in [next.config.ts](/Users/pavle/Developer/clients/heroic/heroic-rankings-final/next.config.ts:62).

Static/site:
- `/blog/` -> `/insights`
- `/case-study/` -> `/case-studies`
- `/about/` -> `/about-us`
- `/partnership/` -> `/partnership`
- `/contact/` -> `/contact`
- `/privacy-policy/` -> `/privacy-policy`
- `/seo/` -> `/seo-services`

Service categories:
- `/seo/technical/` -> `/technical-seo`
- `/seo/on-page/` -> `/on-page-seo`
- `/seo/local/` -> `/local-seo`
- `/seo/keyword-research/` -> `/keyword-strategy`
- `/seo/content-creation/` -> `/content-creation`
- `/seo/linkbuilding/` -> `/link-building`
- `/seo/e-commerce/` -> `/ecommerce-seo`
- `/seo/managed/` -> `/insights`

Case studies:
- `/case-study/affinda/` -> `/case-studies/affinda`
- `/case-study/my-baskets/` -> `/case-studies/my-baskets`
- `/case-study/nagish/` -> `/case-studies/nagish`
- `/case-study/art-by-maudsch/` -> `/case-studies/art-by-maudsch`
- `/case-study/designrush/` -> `/case-studies/designrush`
- `/case-study/number-artist/` -> `/case-studies/diy-craft-ecom-brand`

Blog patterns:
- `/seo/:category/:slug/` -> `/insights/:slug`
- `/blog/:slug/` -> `/insights/:slug`

Team:
- `/about/:slug/` -> `/team/:slug`

BCMS internal redirects, composed to one hop:
- `/backlinks-management/` -> `/insights/backlinks-management`
- `/how-to-create-a-link-building-strategy/` -> `/insights/how-to-create-a-link-building-strategy`
- `/benefits-of-link-building/` -> `/insights/benefits-of-link-building`
- `/lets-discuss-google-search-updates/` -> `/insights/lets-discuss-google-search-updates`
- `/marketing/` -> `/seo-services`
- `/marketing/first-step-in-marketing-research-process/` -> `/insights/first-step-in-marketing-research-process`
- `/web-design-development/` -> `/`
- `/marketing/ppc/seo-vs-google-ads/` -> `/insights/seo-vs-google-ads`
- `/process-that-affects-visibility-of-website/` -> `/insights/process-that-affects-visibility-of-website`
- `/seo/how-to-grow-your-business-online/` -> `/insights/how-to-grow-your-business-online`
- `/seo/ranking-factors-seo/` -> `/insights/ranking-factors-seo`

Do not add asset redirects. Rewriting body content and re-hosting assets is cleaner than preserving BCMS media paths.

## RISKS
| Severity | Risk | Why it bites | Mitigation |
|---|---|---|---|
| CRITICAL | Current Sanity schemas are stricter than BCMS payloads | `strategyPillars` requires 6 icon-bearing cards; `proofData.items[].image` is required; `teamMember` lacks gallery; `post` lacks `related_service` and `read_time` | Relax schemas before import or accept known data loss |
| CRITICAL | Redirect plan is stale/incomplete | Docs still debate team routing while code already chose Option B; draft “30 redirects” is not fully materialized | Freeze final redirect source of truth, generate from code, and one-hop compose BCMS redirects |
| CRITICAL | Body conversion can silently lose content | BCMS blog sample has object-valued nodes, nested lists, anchors, and entity quirks | Fail loud on unsupported nodes; extend PT schema before import if needed |
| HIGH | Locale/status blind spot | Current scripts read `meta.en` / `content.en` samples, not all entries/locales/statuses | Run a full inventory before migration |
| HIGH | Internal links inside bodies still point to legacy IA | Same-domain cutover hides this problem until users click deep links | Rewrite anchors during conversion using final URL map |
| HIGH | Hotlinked BCMS assets create a permanent dependency | Production stack would still rely on BCMS uptime and media URLs | Re-host all assets to Sanity |
| HIGH | Asset filename collisions | BCMS filenames are not unique | Key on BCMS media `_id`, not filename |
| HIGH | Slug collisions across types/routes | Posts, team, services, and case studies all move under new IA | Preflight global slug collision audit and abort on conflict |
| HIGH | Mid-run source drift | Content-bound is not the same as content-frozen | Freeze BCMS edits or record and reconcile drift |
| MEDIUM | Encoding and entity normalization | Sample data already shows NBSP-like characters and HTML entities | Normalize before checksum and before parity compare |
| MEDIUM | Draft/unpublished pointers | Nested pointers may resolve to non-published content | Filter by BCMS status and fail unresolved refs |
| MEDIUM | Rate limits during 786-asset re-host | Large media runs can stall or partially import | Throttle, checkpoint, retry, resume |

BCMS status handling reference: [BCMS Entries](https://thebcms.com/docs/inside-bcms/entries).

## SEQUENCING
1. Run a full BCMS inventory, not another sample: every template, every entry, every locale, every status, every pointer, every body-node type.
2. Audit slug collisions and finalize the canonical URL map across posts, team, services, and case studies.
3. Freeze BCMS content or define an explicit delta-import window.
4. Patch Sanity schemas where they are provably non-isomorphic with BCMS.
5. Build and test the asset registry and upload pipeline on a small batch.
6. Import team members and testimonials first.
7. Import service pages without cross-doc refs, then case studies.
8. Patch service-page references after case studies exist.
9. Import posts last with full body conversion and anchor rewriting.
10. Run parity harness on a representative batch, then on the full corpus.
11. Install the final redirect config and test one-hop resolution for every known legacy URL.
12. Cut over only after zero unsupported body nodes, zero unresolved refs, zero BCMS asset URLs, and zero redirect chains.

## DISAGREEMENTS
1. The old case-study assumption is dead. BCMS is not prose-only here; keeping the old plan would throw away structured source data.
2. The current Sanity schemas should not be treated as immutable if the goal is closest-possible legacy fidelity. Several are objectively over-constrained relative to the real BCMS payload.
3. `redirect-map.md` and `launch-state-consolidation.md` are already stale on the team-route question and on redirect readiness. Trust the code in [next.config.ts](/Users/pavle/Developer/clients/heroic/heroic-rankings-final/next.config.ts:62), not the older prose docs.
4. Dropping `person.cards[]`, `post.related_service`, `case-study.website`, or `results_cards_as_accordion` is not a neutral simplification. It is content loss.
5. “Same domain” does not make this low risk. This is still an IA change, a CMS change, an asset-host change, and a redirect-sensitive cutover.
6. The spike is enough to pick the direction, but not enough to certify cleanliness. Until you run the full locale/status/body-node audit, any claim that the corpus is simple is premature.

External references used for migration mechanics: [Sanity IDs and Paths](https://www.sanity.io/docs/content-lake/ids), [Sanity JS mutations](https://www.sanity.io/docs/apis-and-sdks/js-client-mutations), [Sanity HTTP patches](https://www.sanity.io/docs/content-lake/http-patches), [Sanity Assets](https://www.sanity.io/docs/content-lake/assets), [Portable Text block-tools](https://github.com/portabletext/editor/tree/main/packages/block-tools), [BCMS Entries](https://thebcms.com/docs/inside-bcms/entries), [BCMS Media](https://thebcms.com/docs/inside-bcms/media).

Codex session ID: 019dd8ea-0da3-71f1-966a-4312c4cb35ae
Resume in Codex: codex resume 019dd8ea-0da3-71f1-966a-4312c4cb35ae
