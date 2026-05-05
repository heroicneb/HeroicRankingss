#!/usr/bin/env node
/**
 * Applies auto-extracted case-study content to Sanity. Source data was mined
 * from https://heroicrankings.com/case-study/<slug>/ legacy prose by Claude
 * via Playwright (commit-history reference).
 *
 * Sections written: titleHighlighted, heroSubtitle, heroMetrics,
 * numbersThatMatter (label + heading + body + items[]), beforeAfter
 * (label + heading + body + items[]).
 *
 * Skipped:
 *   - growthChart   (needs monthly series data Nebojsa hasn't supplied)
 *   - ctaFooter     (global FooterCtaVariant fallback works)
 *   - proofData[].image (needs Ahrefs/GSC PNGs from Nebojsa)
 *
 * Usage:
 *   --dry-run    : print what would change, no writes
 *   --apply      : write revision-guarded patches + per-doc snapshot first
 */

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { createClient } from "@sanity/client";

import {
  PROJECT_ID,
  DATASET,
  API_VERSION,
  resolveWriteToken,
} from "./lib/sanity-client.mjs";

const DRAFT_PATH = path.resolve(
  "scripts/migrate/case-studies-content-draft.json",
);
const SNAPSHOT_PATH = path.resolve(
  "scripts/migrate/case-studies-pre-apply-snapshot.json",
);

function makeWriteClient() {
  const token = resolveWriteToken();
  if (!token) {
    throw new Error(
      "No Sanity write token found. Set SANITY_AUTH_TOKEN or SANITY_API_WRITE_TOKEN.",
    );
  }
  return createClient({
    projectId: PROJECT_ID,
    dataset: DATASET,
    apiVersion: API_VERSION,
    token,
    useCdn: false,
  });
}

function buildPatchData(slugContent) {
  const data = {};

  if (slugContent.titleHighlighted) {
    data.titleHighlighted = slugContent.titleHighlighted;
  }
  if (slugContent.heroSubtitle) {
    data.heroSubtitle = slugContent.heroSubtitle;
  }

  if (Array.isArray(slugContent.heroMetrics)) {
    data.heroMetrics = slugContent.heroMetrics.map((m, i) => ({
      _key: `hm-${i}`,
      value: m.value,
      label: m.label,
    }));
  }

  if (slugContent.numbersThatMatter) {
    const ntm = slugContent.numbersThatMatter;
    data.numbersThatMatter = {
      ...(ntm.label ? { label: ntm.label } : {}),
      ...(ntm.headingMain ? { headingMain: ntm.headingMain } : {}),
      ...(ntm.headingHighlighted
        ? { headingHighlighted: ntm.headingHighlighted }
        : {}),
      ...(ntm.body ? { body: ntm.body } : {}),
      items: (ntm.items || []).map((it, i) => ({
        _key: `ntm-${i}`,
        value: it.value,
        label: it.label,
        ...(it.sub ? { sub: it.sub } : {}),
      })),
    };
  }

  if (slugContent.beforeAfter) {
    const ba = slugContent.beforeAfter;
    data.beforeAfter = {
      ...(ba.label ? { label: ba.label } : {}),
      ...(ba.headingMain ? { headingMain: ba.headingMain } : {}),
      ...(ba.headingHighlighted
        ? { headingHighlighted: ba.headingHighlighted }
        : {}),
      ...(ba.body ? { body: ba.body } : {}),
      items: (ba.items || []).map((it, i) => ({
        _key: `ba-${i}`,
        label: it.label,
        before: it.before,
        after: it.after,
      })),
    };
  }

  return data;
}

async function run() {
  const argv = new Set(process.argv.slice(2));
  const apply = argv.has("--apply");
  const dryRun = argv.has("--dry-run") || !apply;

  if (!dryRun && !apply) {
    console.error("Usage: --dry-run | --apply");
    process.exit(2);
  }

  const draftRaw = await readFile(DRAFT_PATH, "utf8");
  const draft = JSON.parse(draftRaw);
  const slugs = Object.keys(draft).filter((k) => !k.startsWith("_"));

  const client = makeWriteClient();

  // Fetch live revision per slug.
  const live = await client.fetch(
    `*[_type == "caseStudy" && slug.current in $slugs]{
      _id, _rev, _updatedAt, "slug": slug.current, title
    }`,
    { slugs },
  );
  const liveBySlug = Object.fromEntries(live.map((d) => [d.slug, d]));

  const missing = slugs.filter((s) => !liveBySlug[s]);
  if (missing.length > 0) {
    console.error("✗ Missing case-study docs in Sanity:", missing);
    process.exit(2);
  }

  // Validation: ensure titleHighlighted appears in the live title.
  const titleErrors = [];
  for (const slug of slugs) {
    const hl = draft[slug].titleHighlighted;
    const liveTitle = liveBySlug[slug].title || "";
    if (hl && !liveTitle.includes(hl)) {
      titleErrors.push(
        `${slug}: titleHighlighted="${hl}" not found in title="${liveTitle}"`,
      );
    }
  }
  if (titleErrors.length > 0) {
    console.error("✗ titleHighlighted validation failed:");
    for (const e of titleErrors) console.error(`  ${e}`);
    process.exit(2);
  }

  if (dryRun) {
    console.log("─── DRY RUN ───");
    for (const slug of slugs) {
      const live = liveBySlug[slug];
      const data = buildPatchData(draft[slug]);
      console.log(`\n[${slug}]  _id=${live._id}  _rev=${live._rev}`);
      console.log(`  titleHighlighted: ${data.titleHighlighted ?? "—"}`);
      console.log(
        `  heroSubtitle: ${(data.heroSubtitle || "").slice(0, 80)}`,
      );
      console.log(`  heroMetrics: ${data.heroMetrics?.length ?? 0}`);
      console.log(
        `  numbersThatMatter.items: ${data.numbersThatMatter?.items?.length ?? 0}`,
      );
      console.log(
        `  beforeAfter.items: ${data.beforeAfter?.items?.length ?? 0}`,
      );
    }
    console.log("\n→ Pass --apply to write.");
    return;
  }

  // Snapshot before apply.
  const ids = slugs.map((s) => liveBySlug[s]._id);
  const fullDocs = await client.fetch(`*[_id in $ids]`, { ids });
  await writeFile(SNAPSHOT_PATH, JSON.stringify(fullDocs, null, 2) + "\n");
  console.log(`✓ Pre-apply snapshot written to ${SNAPSHOT_PATH}`);

  for (const slug of slugs) {
    const live = liveBySlug[slug];
    const data = buildPatchData(draft[slug]);
    await client.patch(live._id).ifRevisionId(live._rev).set(data).commit();
    console.log(`  ✓ ${slug} patched`);
  }
  console.log(`✓ Apply complete. Snapshot at ${SNAPSHOT_PATH}`);
}

await run();
