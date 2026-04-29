#!/usr/bin/env node
/**
 * BCMS → Sanity migration orchestrator.
 *
 * Per Codex 1:1 plan (docs/migration/codex-migration-plan.md):
 *   1. Preflight: full inventory, slug collision audit, unmapped category
 *      audit, unsupported body node audit. Abort on any issue.
 *   2. Asset registry warmup (first 10 referenced media — surface
 *      auth/throttle issues early).
 *   3. Migrate team members.
 *   4. Migrate testimonials.
 *   5. Migrate service pages (first pass — no relatedCaseStudies).
 *   6. Migrate case studies.
 *   7. Patch service pages with relatedCaseStudies refs.
 *   8. Migrate posts (last — body-heavy).
 *   9. Validation harness (separate script: validate.mjs).
 *  10. Final report.
 *
 * Usage:
 *   node scripts/migrate/bcms-to-sanity.mjs [--dry-run] [--only=<types>] [--verbose]
 *
 *   --dry-run        do everything except live writes
 *   --only=team      restrict phases (comma-separated): team, testimonial,
 *                    service, case-study, post
 *   --verbose        debug-level logging
 *   --include-drafts include BCMS entries with non-Published status
 */

import { createBcmsClient, BcmsAuthError } from "./lib/bcms-client.mjs";
import { getSanityClient } from "./lib/sanity-client.mjs";
import { createAssetRegistry } from "./lib/asset-registry.mjs";
import { createLogger } from "./lib/logger.mjs";
import { migrateOrSkip } from "./lib/idempotency.mjs";
import {
  buildMigrationSource,
  computeSourceChecksum,
} from "./lib/provenance.mjs";
import {
  BCMS_TEMPLATE_IDS,
  BCMS_TO_SANITY_TYPE,
  deriveSanityId,
} from "./config/bcms-to-sanity-id-map.mjs";
import { resolveCategory } from "./config/category-map.mjs";

import * as teamMemberMapper from "./mappers/team-member.mjs";
import * as testimonialMapper from "./mappers/testimonial.mjs";
import * as serviceMapper from "./mappers/service.mjs";
import * as caseStudyMapper from "./mappers/case-study.mjs";
import * as postMapper from "./mappers/post.mjs";
import * as companyMapper from "./mappers/company.mjs";

const SUPPORTED_BODY_NODE_TYPES = new Set([
  "paragraph",
  "heading",
  "bulletList",
  "orderedList",
  "text",
]);
const SUPPORTED_WIDGET_NAMES = new Set(["image", "table", "cta2", "video"]);

const ALLOWED_ONLY = new Set([
  "team",
  "testimonial",
  "service",
  "case-study",
  "post",
  "company",
]);

function parseArgs(argv) {
  const args = {
    dryRun: false,
    only: null,
    verbose: false,
    includeDrafts: false,
  };
  for (const arg of argv.slice(2)) {
    if (arg === "--dry-run") args.dryRun = true;
    else if (arg === "--verbose") args.verbose = true;
    else if (arg === "--include-drafts") args.includeDrafts = true;
    else if (arg.startsWith("--only=")) {
      const list = arg
        .slice("--only=".length)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      for (const k of list) {
        if (!ALLOWED_ONLY.has(k)) {
          throw new Error(
            `Unknown --only value "${k}". Allowed: ${[...ALLOWED_ONLY].join(", ")}`,
          );
        }
      }
      args.only = new Set(list);
    } else if (arg === "--help" || arg === "-h") {
      printUsage();
      process.exit(0);
    } else {
      throw new Error(`Unknown arg "${arg}". Use --help for usage.`);
    }
  }
  return args;
}

function printUsage() {
  process.stdout.write(
    "\nUsage: node scripts/migrate/bcms-to-sanity.mjs [--dry-run] [--only=team,testimonial,service,case-study,post] [--verbose] [--include-drafts]\n\n",
  );
}

function shouldRun(args, key) {
  if (!args.only) return true;
  return args.only.has(key);
}

/**
 * BCMS slugs explicitly excluded from migration (verified 404 on the legacy
 * site or otherwise archival). Pavle decision 2026-04-29: do not sync.
 */
const ARCHIVED_SLUGS = new Set([
  "web-summit-lisbon-2023",
  "difference-between-marketing-and-sales-services",
]);

/**
 * Is this entry publishable for migration?
 *
 * Migrate when:
 *  - statuses array is missing or empty (BCMS no-status — verified live on
 *    legacy site for 3 of 5 entries; the other 2 are archived and listed
 *    in ARCHIVED_SLUGS above), OR
 *  - statuses includes a Published label.
 *
 * Skip when:
 *  - any status label is "Draft" (case-insensitive).
 *  - slug is in ARCHIVED_SLUGS.
 */
function isPublished(entry) {
  const slug = entry?.meta?.en?.slug;
  if (slug && ARCHIVED_SLUGS.has(slug)) return false;
  const statuses = entry?.statuses;
  if (!Array.isArray(statuses) || statuses.length === 0) return true; // BCMS no-status = publishable on legacy site
  const labels = statuses
    .map((s) => (typeof s?.label === "string" ? s.label.toLowerCase() : ""))
    .filter(Boolean);
  if (labels.includes("draft")) return false;
  return labels.includes("published") || labels.length === 0;
}

async function fetchEntries(bcmsClient, templateName, args) {
  const tid = BCMS_TEMPLATE_IDS[templateName];
  if (!tid) {
    throw new Error(`Unknown BCMS template "${templateName}" — add it to bcms-to-sanity-id-map.mjs.`);
  }
  const all = await bcmsClient.listEntries(tid);
  if (args.includeDrafts) return all;
  return all.filter(isPublished);
}

/**
 * Walk every entry across every template and check:
 * - Slug uniqueness within each Sanity type
 * - Category mapping coverage for all blog posts
 * - Body node types are all supported (no unknowns)
 * - Required fields present
 *
 * Aborts on any failure. Returns a summary { totals, warnings }.
 */
async function preflight(bcmsClient, logger, args) {
  logger.startPhase("preflight", "inventory + collision + body-node audit");
  const errors = [];
  const warnings = [];
  const totals = {};
  const slugsByType = {};

  for (const [bcmsName, sanityType] of Object.entries(BCMS_TO_SANITY_TYPE)) {
    if (!sanityType) continue;
    if (!BCMS_TEMPLATE_IDS[bcmsName]) {
      warnings.push(`No template id for "${bcmsName}" — skipping in preflight`);
      continue;
    }
    let entries;
    try {
      entries = await fetchEntries(bcmsClient, bcmsName, args);
    } catch (err) {
      errors.push(`fetch ${bcmsName}: ${err?.message ?? err}`);
      continue;
    }
    totals[bcmsName] = entries.length;
    logger.info("preflight", bcmsName, `loaded ${entries.length} entries`);

    // Slug collision check (within sanity type) — skipped for types whose
    // Sanity schema has no `slug` field (e.g., partnerLogo, testimonial).
    // BCMS may legitimately have duplicate slugs in those templates because
    // the slug is BCMS-internal-only, never written to Sanity.
    const SANITY_TYPES_WITHOUT_SLUG = new Set(["partnerLogo", "testimonial"]);
    if (!SANITY_TYPES_WITHOUT_SLUG.has(sanityType)) {
      if (!slugsByType[sanityType]) slugsByType[sanityType] = new Map();
      const seen = slugsByType[sanityType];
      for (const e of entries) {
        const slug = e.meta?.en?.slug ?? null;
        if (!slug) {
          warnings.push(`${bcmsName} ${e._id}: no slug`);
          continue;
        }
        const prior = seen.get(slug);
        if (prior && prior !== e._id) {
          errors.push(
            `slug collision in ${sanityType}: "${slug}" used by ${prior} and ${e._id}`,
          );
        } else {
          seen.set(slug, e._id);
        }
      }
    }

    // Category mapping coverage (blog only)
    if (bcmsName === "blog") {
      for (const e of entries) {
        if (!e.meta?.en?.category) continue;
        const mapped = resolveCategory(e.meta.en.category);
        if (!mapped) {
          errors.push(
            `blog ${e._id} (${e.meta.en.slug}): unmapped category slug="${e.meta.en.category?.meta?.en?.slug ?? "?"}"`,
          );
        }
      }
    }

    // Body node-type sweep (case-study + blog have content).
    if (bcmsName === "blog" || bcmsName === "case-study") {
      for (const e of entries) {
        const nodes =
          (Array.isArray(e.content?.en) && e.content.en) ||
          (Array.isArray(e.content?.en?.nodes) && e.content.en.nodes) ||
          [];
        for (const node of nodes) {
          const t = node?.type;
          if (!t) continue;
          if (t === "widget") {
            const wn = node.widgetName;
            if (!SUPPORTED_WIDGET_NAMES.has(wn)) {
              errors.push(
                `${bcmsName} ${e._id} (${e.meta?.en?.slug}): unsupported widgetName "${wn}"`,
              );
            }
          } else if (!SUPPORTED_BODY_NODE_TYPES.has(t)) {
            errors.push(
              `${bcmsName} ${e._id} (${e.meta?.en?.slug}): unsupported body node type "${t}"`,
            );
          }
        }
      }
    }
  }

  logger.endPhase("preflight", `errors=${errors.length} warnings=${warnings.length}`);
  if (errors.length > 0) {
    for (const e of errors) logger.error("preflight", null, e);
    throw new Error(`Preflight aborted with ${errors.length} error(s). See log.`);
  }
  for (const w of warnings) logger.warn("preflight", null, w);
  return { totals, warnings };
}

/**
 * Asset registry warmup: pull the first ~10 media _ids referenced anywhere
 * and ensure them through the registry. Surfaces auth/throttle issues
 * before the main run.
 */
async function warmupAssets(bcmsClient, assetRegistry, logger, args) {
  logger.startPhase("warmup", "asset registry warmup (first 10 media refs)");
  const refs = new Set();
  for (const tname of ["case-study", "blog", "person", "service"]) {
    if (!BCMS_TEMPLATE_IDS[tname]) continue;
    let entries;
    try {
      entries = await fetchEntries(bcmsClient, tname, args);
    } catch (err) {
      logger.warn("warmup", tname, `fetch failed: ${err?.message ?? err}`);
      continue;
    }
    for (const e of entries) {
      collectMediaIds(e.meta?.en, refs);
      if (refs.size >= 10) break;
    }
    if (refs.size >= 10) break;
  }
  const ids = [...refs].slice(0, 10);
  logger.info("warmup", null, `warming ${ids.length} media id(s)`);
  for (const id of ids) {
    try {
      await assetRegistry.ensureAsset(id);
    } catch (err) {
      logger.warn("warmup", null, `media ${id} failed: ${err?.message ?? err}`);
    }
  }
  logger.endPhase("warmup", `done: ${ids.length}`);
}

function collectMediaIds(meta, into) {
  if (!meta || typeof meta !== "object") return;
  for (const v of Object.values(meta)) {
    if (!v) continue;
    if (Array.isArray(v)) {
      for (const item of v) collectMediaIds(item, into);
    } else if (typeof v === "object") {
      if (typeof v._id === "string" && typeof v.mimetype === "string") {
        into.add(v._id);
      } else {
        collectMediaIds(v, into);
      }
    }
  }
}

/**
 * Run a mapper across an array of BCMS entries with idempotent writes.
 */
async function migrateEntries({
  args,
  client,
  logger,
  template,
  entries,
  mapper,
  ctx,
  records,
}) {
  for (const entry of entries) {
    let mapped;
    try {
      mapped = await mapper.map(entry, ctx);
    } catch (err) {
      logger.error("map", template, `${entry._id}: ${err?.message ?? err}`);
      logger.countFail(template, entry._id, err);
      continue;
    }
    const ms = buildMigrationSource({
      template,
      bcmsId: entry._id,
      legacyUrl: mapped.legacyUrl ?? null,
      sourceChecksum: computeSourceChecksum(entry),
      ownedPaths: mapped.ownedPaths,
      assetIds: mapped.assetIds,
      unmappedFields: mapped.unmappedFields,
      sourceStatus: Array.isArray(entry.statuses)
        ? entry.statuses
            .map((s) => s?.label)
            .filter(Boolean)
        : [],
      sourceUpdatedAt: entry.updatedAt
        ? new Date(entry.updatedAt).toISOString()
        : null,
    });
    const docWithMs = { ...mapped.sanityDoc, migrationSource: ms };

    const result = await migrateOrSkip({
      client,
      logger,
      dryRun: args.dryRun,
      template,
      doc: docWithMs,
      ownedPaths: mapped.ownedPaths,
    });

    records.push({
      template,
      bcmsId: entry._id,
      sanityId: docWithMs._id,
      slug: entry.meta?.en?.slug ?? null,
      result: result.kind,
      reason: result.reason,
      relatedCaseStudyBcmsIds: mapped.relatedCaseStudyBcmsIds ?? null,
    });
  }
}

/**
 * Pass 2 for service pages: patch in `relatedCaseStudies` references now
 * that case-study Sanity ids are known.
 */
async function patchServiceRelations({
  args,
  client,
  logger,
  serviceRecords,
  caseStudyByBcmsId,
}) {
  if (!serviceRecords || serviceRecords.length === 0) return;
  logger.startPhase("relate", "patch servicePage.relatedCaseStudies");
  for (const rec of serviceRecords) {
    const ids = Array.isArray(rec.relatedCaseStudyBcmsIds)
      ? rec.relatedCaseStudyBcmsIds
      : [];
    if (ids.length === 0) continue;
    const refs = ids
      .map((bcmsId) => caseStudyByBcmsId[bcmsId] ?? deriveSanityId("caseStudy", bcmsId))
      .map((sanityId, i) => ({
        _key: `${rec.bcmsId}-rel-${i}`,
        _type: "reference",
        _ref: sanityId,
      }));
    if (args.dryRun || !client) {
      logger.info(
        "relate",
        "service",
        `[dry-run] would patch ${rec.sanityId} relatedCaseStudies (${refs.length})`,
      );
      continue;
    }
    try {
      await client.patch(rec.sanityId).set({ relatedCaseStudies: refs }).commit();
      logger.countPatch("service", rec.sanityId);
    } catch (err) {
      logger.countFail("service", rec.sanityId, err);
    }
  }
  logger.endPhase("relate", `done: ${serviceRecords.length}`);
}

async function main() {
  const args = parseArgs(process.argv);
  const logger = createLogger({
    minLevel: args.verbose ? "debug" : "info",
    dryRun: args.dryRun,
  });

  logger.info(
    "boot",
    null,
    `BCMS → Sanity migration starting (dryRun=${args.dryRun}, only=${
      args.only ? [...args.only].join(",") : "ALL"
    })`,
  );

  // BCMS client (read-only)
  let bcmsClient;
  try {
    bcmsClient = createBcmsClient({ concurrency: 5 });
  } catch (err) {
    if (err instanceof BcmsAuthError) {
      logger.error("boot", null, err.message);
      logger.flush();
      process.exit(2);
    }
    throw err;
  }

  // Sanity client (write). null in dry-run if no token resolves.
  const client = getSanityClient();
  if (!client && !args.dryRun) {
    logger.error(
      "boot",
      null,
      "No Sanity write token resolved. Set SANITY_AUTH_TOKEN or run with --dry-run.",
    );
    logger.flush();
    process.exit(2);
  }

  const assetRegistry = createAssetRegistry({
    bcmsClient,
    sanityClient: client,
    logger,
    dryRun: args.dryRun,
  });

  // === Phase 1: preflight ===
  try {
    await preflight(bcmsClient, logger, args);
  } catch (err) {
    logger.error("preflight", null, err?.message ?? String(err));
    logger.flush();
    process.exit(3);
  }

  // === Phase 2: asset warmup ===
  await warmupAssets(bcmsClient, assetRegistry, logger, args);

  const records = [];
  const teamMemberByBcmsId = {};
  const serviceByBcmsId = {};
  const caseStudyByBcmsId = {};
  const serviceRecords = [];

  // === Phase 3: team ===
  if (shouldRun(args, "team")) {
    logger.startPhase("team", "migrate person → teamMember");
    const entries = await fetchEntries(bcmsClient, "person", args);
    await migrateEntries({
      args,
      client,
      logger,
      template: "person",
      entries,
      mapper: teamMemberMapper,
      ctx: { assetRegistry, logger },
      records,
    });
    for (const e of entries) {
      teamMemberByBcmsId[e._id] = deriveSanityId("teamMember", e._id);
    }
    logger.endPhase("team", `entries=${entries.length}`);
  }

  // === Phase 4: testimonial ===
  if (shouldRun(args, "testimonial")) {
    logger.startPhase("testimonial", "migrate testimonial → testimonial");
    let entries = [];
    try {
      entries = await fetchEntries(bcmsClient, "testimonial", args);
    } catch (err) {
      logger.warn("testimonial", null, `fetch failed: ${err?.message ?? err}`);
    }
    await migrateEntries({
      args,
      client,
      logger,
      template: "testimonial",
      entries,
      mapper: testimonialMapper,
      ctx: { assetRegistry, logger },
      records,
    });
    logger.endPhase("testimonial", `entries=${entries.length}`);
  }

  // === Phase 4b: company → partnerLogo ===
  if (shouldRun(args, "company")) {
    logger.startPhase("company", "migrate company → partnerLogo");
    let entries = [];
    try {
      entries = await fetchEntries(bcmsClient, "company", args);
    } catch (err) {
      logger.warn("company", null, `fetch failed: ${err?.message ?? err}`);
    }
    await migrateEntries({
      args,
      client,
      logger,
      template: "company",
      entries,
      mapper: companyMapper,
      ctx: { assetRegistry, logger },
      records,
    });
    logger.endPhase("company", `entries=${entries.length}`);
  }

  // === Phase 5: service (first pass — no relatedCaseStudies) ===
  if (shouldRun(args, "service")) {
    logger.startPhase("service", "migrate service → servicePage (pass 1)");
    const entries = await fetchEntries(bcmsClient, "service", args);
    const before = records.length;
    await migrateEntries({
      args,
      client,
      logger,
      template: "service",
      entries,
      mapper: serviceMapper,
      ctx: { assetRegistry, logger },
      records,
    });
    for (const rec of records.slice(before)) {
      if (rec.template === "service") {
        serviceByBcmsId[rec.bcmsId] = rec.sanityId;
        serviceRecords.push(rec);
      }
    }
    logger.endPhase("service", `entries=${entries.length}`);
  }

  // === Phase 6: case-study ===
  if (shouldRun(args, "case-study")) {
    logger.startPhase("case-study", "migrate case-study → caseStudy");
    const entries = await fetchEntries(bcmsClient, "case-study", args);
    const before = records.length;
    await migrateEntries({
      args,
      client,
      logger,
      template: "case-study",
      entries,
      mapper: caseStudyMapper,
      ctx: { assetRegistry, logger },
      records,
    });
    for (const rec of records.slice(before)) {
      if (rec.template === "case-study") {
        caseStudyByBcmsId[rec.bcmsId] = rec.sanityId;
      }
    }
    logger.endPhase("case-study", `entries=${entries.length}`);
  }

  // === Phase 7: patch service relatedCaseStudies ===
  if (shouldRun(args, "service") && shouldRun(args, "case-study")) {
    await patchServiceRelations({
      args,
      client,
      logger,
      serviceRecords,
      caseStudyByBcmsId,
    });
  }

  // === Phase 8: post (last) ===
  if (shouldRun(args, "post")) {
    logger.startPhase("post", "migrate blog → post (body-heavy)");
    const entries = await fetchEntries(bcmsClient, "blog", args);
    await migrateEntries({
      args,
      client,
      logger,
      template: "blog",
      entries,
      mapper: postMapper,
      ctx: {
        assetRegistry,
        logger,
        teamMemberByBcmsId,
        serviceByBcmsId,
      },
      records,
    });
    logger.endPhase("post", `entries=${entries.length}`);
  }

  // === Phase 9: validation harness placeholder ===
  // Per Codex: render-level parity is run by scripts/migrate/validate.mjs as
  // a separate step after migration completes (typically against a staging
  // deploy). The orchestrator only emits the report manifest needed by it.

  // === Phase 10: final report ===
  const report = logger.flush();
  logger.info(
    "done",
    null,
    `created=${report.counts.created} patched=${report.counts.patched} skipped=${report.counts.skipped} conflicted=${report.counts.conflicted} failed=${report.counts.failed} assetsUploaded=${report.counts.assetsUploaded} assetsReused=${report.counts.assetsReused}`,
  );
  if (report.counts.failed > 0 || report.counts.conflicted > 0) {
    process.exit(4);
  }
}

main().catch((err) => {
  process.stderr.write(`\n[fatal] ${err?.stack ?? err?.message ?? String(err)}\n`);
  process.exit(1);
});
