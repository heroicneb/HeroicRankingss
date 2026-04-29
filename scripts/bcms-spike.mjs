#!/usr/bin/env node
/**
 * BCMS API spike — discover templates, sample one entry per template,
 * check one media. Used to evaluate fidelity vs public-HTML scrape.
 *
 * Per Codex 2026-04-28 advisory: spike must verify whether BCMS API
 * returns richer structured fields than what the public HTML exposes,
 * before committing to it as the migration source.
 *
 * Usage:
 *   BCMS_API_KEY=<id.secret> node scripts/bcms-spike.mjs
 */

import { Client } from "@thebcms/client";
import { writeFileSync } from "node:fs";

const apiKey = process.env.BCMS_API_KEY;
const instanceId = process.env.BCMS_INSTANCE_ID || "6710e3bdeeda0c4a2de4b330";
const cmsOrigin = process.env.BCMS_API_ORIGIN || "https://app.thebcms.com";

if (!apiKey) {
  console.error("Missing BCMS_API_KEY env var. Set BCMS_API_KEY=<id.secret> and rerun.");
  process.exit(1);
}

console.log("================================================================");
console.log("  BCMS API Spike");
console.log(`  cmsOrigin: ${cmsOrigin}`);
console.log(`  instanceId: ${instanceId}`);
console.log("================================================================\n");

// SDK expects apiKey in `id.secret.instanceId` 3-part format.
// If the env var only has 2 parts, append instanceId.
const fullApiKey = apiKey.split(".").length === 3 ? apiKey : `${apiKey}.${instanceId}`;
const client = new Client({
  apiKey: fullApiKey,
  cmsOrigin,
  injectSvg: false,
  useMemCache: true,
});

const report = {
  timestamp: new Date().toISOString(),
  cmsOrigin,
  instanceId,
  templates: [],
  entries_per_template: {},
  sample_media: null,
  errors: [],
};

// 1. Discover templates
try {
  console.log("[1/3] Discovering templates...");
  const templates = await client.template.getAll();
  console.log(`  found ${templates.length} templates:`);
  for (const t of templates) {
    console.log(`    - ${t.name} (label: ${t.label}, id: ${t._id})`);
    report.templates.push({
      _id: t._id,
      name: t.name,
      label: t.label,
      desc: t.desc,
      singleEntry: t.singleEntry,
      props_count: Array.isArray(t.props) ? t.props.length : 0,
      props: Array.isArray(t.props)
        ? t.props.map((p) => ({
            id: p.id,
            name: p.name,
            label: p.label,
            type: p.type,
            array: p.array,
            required: p.required,
          }))
        : [],
    });
  }
  console.log("");
} catch (err) {
  console.error("  ✗ template.getAll failed:", err?.message ?? err);
  report.errors.push({ step: "templates", error: String(err?.message ?? err) });
}

// 2. Sample one entry per template
console.log("[2/3] Sampling one entry per template...");
for (const t of report.templates) {
  try {
    const entries = await client.entry.getAll(t.name);
    const count = entries.length;
    const sample = entries[0] ?? null;
    console.log(`  ${t.name}: ${count} entries`);
    report.entries_per_template[t.name] = {
      count,
      sample_keys: sample
        ? {
            top_level: Object.keys(sample),
            meta_locales: sample.meta ? Object.keys(sample.meta) : [],
            meta_props_first_locale:
              sample.meta && Object.keys(sample.meta).length > 0
                ? Object.keys(sample.meta[Object.keys(sample.meta)[0]])
                : [],
          }
        : null,
      sample_first_entry: sample,
    };
  } catch (err) {
    console.error(`  ✗ ${t.name}:`, err?.message ?? err);
    report.errors.push({
      step: "entries",
      template: t.name,
      error: String(err?.message ?? err),
    });
  }
}
console.log("");

// 3. Sample one media
console.log("[3/3] Sampling one media item...");
try {
  const all = await client.media.getAll();
  console.log(`  total media: ${all.length}`);
  const first = all[0];
  if (first) {
    console.log(`  sample media: ${first._id} (${first.name}, ${first.type})`);
    report.sample_media = {
      _id: first._id,
      name: first.name,
      type: first.type,
      mimetype: first.mimetype,
      size: first.size,
      width: first.width,
      height: first.height,
      altText: first.altText,
      caption: first.caption,
      hasAllKeys: Object.keys(first),
      raw: first,
    };
  }
} catch (err) {
  console.error("  ✗ media.getAll failed:", err?.message ?? err);
  report.errors.push({ step: "media", error: String(err?.message ?? err) });
}

// Write full report
const reportPath = "scripts/bcms-spike-report.json";
writeFileSync(reportPath, JSON.stringify(report, null, 2));

console.log("");
console.log("================================================================");
console.log(`  Spike complete. Full report at ${reportPath}`);
console.log(`  Templates: ${report.templates.length}`);
console.log(
  `  Total entries: ${Object.values(report.entries_per_template)
    .map((r) => r?.count ?? 0)
    .reduce((a, b) => a + b, 0)}`,
);
console.log(`  Errors: ${report.errors.length}`);
console.log("================================================================");
