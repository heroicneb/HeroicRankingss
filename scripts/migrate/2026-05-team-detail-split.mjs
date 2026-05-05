#!/usr/bin/env node
/**
 * Splits unstructured `bioParagraphs[]` into qaItems + personalTraits +
 * spareTimeBullets, and copies `cards[].image` → lifestylePhotos[].
 *
 * Two phases:
 *   --draft  → reads 7 active members, writes auto-extracted JSON to
 *              scripts/migrate/team-detail-draft.json. NO Sanity writes.
 *              Human reviews + edits draft before --apply.
 *   --apply  → reads reviewed draft, writes revision-guarded patches.
 *              Refuses if any lifestylePhotos[].alt is empty.
 *
 * Codex feedback: regex is a warning system, NOT the parser of record.
 * Manual review is the source of truth for 7 docs.
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { createClient } from "@sanity/client";

import {
  PROJECT_ID,
  DATASET,
  API_VERSION,
  resolveWriteToken,
} from "./lib/sanity-client.mjs";

const DRAFT_PATH = path.resolve("scripts/migrate/team-detail-draft.json");
const SNAPSHOT_PATH = path.resolve(
  "scripts/migrate/team-detail-pre-apply-snapshot.json",
);

const TRAITS_QUESTION_REGEX = /name 3 of your personal traits/i;
const SPARE_TIME_QUESTION_REGEX = /spare time/i;

function makeReadClient() {
  return createClient({
    projectId: PROJECT_ID,
    dataset: DATASET,
    apiVersion: API_VERSION,
    useCdn: true,
  });
}

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

/**
 * Heuristic split of bioParagraphs[]. Returns the auto-derived shape +
 * a list of human-review _warnings. NOT authoritative.
 */
function autoSplit(member) {
  const paras = (member.bioParagraphs || [])
    .map((p) => p.trim())
    .filter(Boolean);
  const warnings = [];

  const traitsIdx = paras.findIndex((p) => TRAITS_QUESTION_REGEX.test(p));
  const spareIdx = paras.findIndex((p) => SPARE_TIME_QUESTION_REGEX.test(p));
  if (traitsIdx === -1) warnings.push("traits question not found");
  if (spareIdx === -1) warnings.push("spare-time question not found");
  if (traitsIdx >= 0 && spareIdx >= 0 && spareIdx <= traitsIdx) {
    warnings.push("spare-time question precedes traits question — atypical");
  }

  const personalTraits =
    traitsIdx >= 0 && paras[traitsIdx + 1] ? paras[traitsIdx + 1] : "";
  const rawSpare = spareIdx >= 0 ? paras[spareIdx + 1] || "" : "";

  // Bullet split: try \n first, fall back to period-jammed, fall back to single-prose.
  let spareTimeBullets = [];
  if (rawSpare.includes("\n")) {
    spareTimeBullets = rawSpare
      .split(/\n+/)
      .map((b) => b.replace(/^[-•\s]+/, "").trim())
      .filter(Boolean);
  } else if ((rawSpare.match(/\.[A-Z]/g) || []).length >= 2) {
    spareTimeBullets = rawSpare
      .split(/\.(?=[A-Z])/)
      .map((b) => b.replace(/\.$/, "").trim())
      .filter(Boolean);
    warnings.push("period-jammed bullets — verify split");
  } else if (rawSpare.length > 0) {
    spareTimeBullets = [rawSpare];
    warnings.push(
      "single-prose hobbies — kept as one bullet, may want to split",
    );
  }

  // qaItems: paragraphs before traitsIdx, paired odd=Q / even=A.
  const beforeTraits = traitsIdx >= 0 ? paras.slice(0, traitsIdx) : [];
  const qaItems = [];
  if (beforeTraits.length === 1) {
    warnings.push(
      "single paragraph before traits — likely Nebojsa-style long-form bio (qaItems = [], leave bio in `bio` field instead)",
    );
  } else if (beforeTraits.length % 2 !== 0) {
    warnings.push(
      `${beforeTraits.length} paragraphs before traits — odd count, manual pairing required (e.g. Stefan merged-Q case)`,
    );
  }
  for (let i = 0; i + 1 < beforeTraits.length; i += 2) {
    qaItems.push({ question: beforeTraits[i], answer: beforeTraits[i + 1] });
  }

  return { personalTraits, spareTimeBullets, qaItems, warnings };
}

async function runDraft() {
  const client = makeReadClient();
  const members = await client.fetch(`
    *[_type == "teamMember" && showOnAboutPage != false && !(_id match "audit-fixture-*")]
    | order(order asc) {
      _id, _rev, _updatedAt, name, "slug": slug.current, role,
      bio, bioParagraphs,
      "cards": cards[]{ "asset": image.asset._ref, "alt": image.alt, "url": image.asset->url }
    }
  `);

  const draft = {};
  for (const m of members) {
    const split = autoSplit(m);
    const photoCards = (m.cards || []).filter((c) => c?.asset);
    draft[m.slug] = {
      _id: m._id,
      _rev: m._rev,
      _updatedAt: m._updatedAt,
      name: m.name,
      role: m.role,
      bio: m.bio || null,
      bioParagraphs_legacy: m.bioParagraphs || [],
      personalTraits: split.personalTraits,
      spareTimeBullets: split.spareTimeBullets,
      qaItems: split.qaItems,
      lifestylePhotos: photoCards.map((c, i) => ({
        _ref: c.asset,
        url: c.url,
        alt: "", // FILLED IN BY VISION PASS — leave empty here
        _index: i,
      })),
      _warnings: split.warnings,
    };
  }

  await mkdir(path.dirname(DRAFT_PATH), { recursive: true });
  await writeFile(DRAFT_PATH, JSON.stringify(draft, null, 2) + "\n");
  console.log(`✓ Draft written to ${DRAFT_PATH}`);
  console.log(`  ${Object.keys(draft).length} members.`);
  console.log(
    "  Review _warnings, fix qaItems pairing, then run vision pass for alts.",
  );
}

async function runApply() {
  const draftRaw = await readFile(DRAFT_PATH, "utf8");
  const draft = JSON.parse(draftRaw);

  // Refuse if any lifestylePhotos[].alt is empty.
  const missingAlts = [];
  for (const [slug, doc] of Object.entries(draft)) {
    for (const p of doc.lifestylePhotos || []) {
      if (!p.alt?.trim()) missingAlts.push(`${slug}#${p._index}`);
    }
  }
  if (missingAlts.length > 0) {
    console.error("✗ Empty lifestylePhotos[].alt — refusing to apply:");
    for (const x of missingAlts) console.error(`  ${x}`);
    process.exit(2);
  }

  const client = makeWriteClient();

  // Snapshot before apply.
  const ids = Object.values(draft).map((d) => d._id);
  const liveDocs = await client.fetch(`*[_id in $ids]`, { ids });
  await writeFile(SNAPSHOT_PATH, JSON.stringify(liveDocs, null, 2) + "\n");
  console.log(`✓ Pre-apply snapshot written to ${SNAPSHOT_PATH}`);

  // Revision-guarded patches.
  for (const [slug, doc] of Object.entries(draft)) {
    const patchData = {
      personalTraits: doc.personalTraits || null,
      spareTimeBullets: doc.spareTimeBullets || [],
      qaItems: (doc.qaItems || []).map((q, i) => ({
        _key: `qa-${i}`,
        question: q.question,
        answer: q.answer,
      })),
      lifestylePhotos: (doc.lifestylePhotos || []).map((p, i) => ({
        _key: `photo-${i}`,
        _type: "image",
        asset: { _type: "reference", _ref: p._ref },
        alt: p.alt,
      })),
    };
    if (typeof doc.bio_replace === "string" && doc.bio_replace.trim()) {
      patchData.bio = doc.bio_replace.trim();
    }
    const patch = client.patch(doc._id).ifRevisionId(doc._rev).set(patchData);
    await patch.commit();
    console.log(`  ✓ ${slug} patched`);
  }
  console.log(`✓ Apply complete. Backup at ${SNAPSHOT_PATH}`);
}

const [, , mode] = process.argv;
if (mode === "--draft") {
  await runDraft();
} else if (mode === "--apply") {
  await runApply();
} else {
  console.error(
    "Usage: node scripts/migrate/2026-05-team-detail-split.mjs --draft | --apply",
  );
  process.exit(2);
}
