#!/usr/bin/env node
/**
 * BCMS Parity Check — pull one entry per major template (case-study, blog, person)
 * and dump the parsed field structure for side-by-side comparison with public HTML.
 *
 * Per Codex 2026-04-28 advisory: verify whether BCMS API exposes structured fields
 * that the rendered HTML loses, before committing to API as migration source.
 *
 * Usage:
 *   BCMS_API_KEY=<id.secret.instanceId> node scripts/bcms-parity-check.mjs
 */

import { writeFileSync } from "node:fs";

const apiKey = process.env.BCMS_API_KEY;
const instanceId = "6710e3bdeeda0c4a2de4b330";
const cmsOrigin = "https://app.thebcms.com";

if (!apiKey) {
  console.error("Missing BCMS_API_KEY env var.");
  process.exit(1);
}

const fullKey = apiKey.split(".").length === 3 ? apiKey : `${apiKey}.${instanceId}`;

async function bcmsFetch(path) {
  const res = await fetch(`${cmsOrigin}${path}`, {
    headers: { Authorization: `ApiKey ${fullKey}` },
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} ${path}`);
  return res.json();
}

const TEMPLATE_IDS = {
  "case-study": "671a222fb98a24129383bd5a",
  blog: "6718e04bef5de485dc93f929",
  person: "6718e069ef5de485dc93f92a",
};

const SAMPLES = [
  // [templateName, slug, public URL on heroicrankings.com]
  ["case-study", "designrush", "https://heroicrankings.com/case-study/designrush/"],
  ["blog", null, null], // will pick first blog entry; resolve URL after
  ["person", "nebojsa-jankovic", "https://heroicrankings.com/about/nebojsa-jankovic/"],
];

const report = {
  timestamp: new Date().toISOString(),
  samples: [],
};

for (const [templateName, slug, publicUrl] of SAMPLES) {
  const templateId = TEMPLATE_IDS[templateName];
  console.log(`\n=== ${templateName.toUpperCase()} ===`);

  let entry;
  if (slug) {
    // Fetch by slug, parsed; response shape is { item: ... } not the entry directly
    try {
      const data = await bcmsFetch(`/api/v3/instance/${instanceId}/template/${templateId}/entry/${slug}/parse`);
      entry = data.item ?? data;
    } catch (err) {
      console.log(`  ✗ slug fetch failed: ${err.message}`);
      const all = await bcmsFetch(`/api/v3/instance/${instanceId}/template/${templateId}/entry/all/parsed`);
      entry = all.items.find((e) => e.meta?.en?.slug === slug);
    }
  } else {
    const all = await bcmsFetch(`/api/v3/instance/${instanceId}/template/${templateId}/entry/all/parsed`);
    entry = all.items[0];
  }

  if (!entry) {
    console.log(`  ✗ no entry found`);
    continue;
  }

  const meta = entry.meta?.en ?? {};
  // Content shape is `{ en: { nodes: [...], plainText: "..." } }` in parsed responses
  const content = entry.content?.en ?? entry.content?.[0] ?? null;

  console.log(`  _id: ${entry._id}`);
  console.log(`  slug: ${meta.slug}`);
  console.log(`  title: ${meta.title}`);
  console.log(`  meta keys: ${Object.keys(meta).join(", ")}`);
  console.log(`  content nodes: ${content?.nodes?.length ?? 0}`);
  if (content?.plainText) {
    console.log(`  content plainText length: ${content.plainText.length} chars`);
  }

  // Inspect array fields specifically (the structured stuff we care about)
  for (const [key, val] of Object.entries(meta)) {
    if (Array.isArray(val)) {
      console.log(`  ${key}[]: ${val.length} items`);
      if (val.length > 0 && typeof val[0] === "object") {
        console.log(`    item keys: ${Object.keys(val[0]).join(", ")}`);
      }
    } else if (val && typeof val === "object") {
      console.log(`  ${key}{}: keys = ${Object.keys(val).join(", ")}`);
    }
  }

  report.samples.push({
    template: templateName,
    slug: meta.slug,
    public_url: publicUrl,
    bcms_id: entry._id,
    meta,
    content_summary: content
      ? {
          lng: content.lng,
          node_count: content.nodes?.length ?? 0,
          plain_text_chars: content.plainText?.length ?? 0,
          first_5_node_types: (content.nodes ?? []).slice(0, 5).map((n) => n.type),
        }
      : null,
    full_content: content,
  });
}

writeFileSync("scripts/bcms-parity-report.json", JSON.stringify(report, null, 2));
console.log("\n================================================================");
console.log("  Parity report written to scripts/bcms-parity-report.json");
console.log("================================================================");
