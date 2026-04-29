#!/usr/bin/env node
/**
 * BCMS Full Inventory — exhaustive enumeration of all templates, entries,
 * locales, statuses, field-fill rates, body-node types, and reference graph.
 *
 * Codex advisory (2026-04-28): prior spike only sampled entries. This script
 * fetches every entry in every template and aggregates unknowns so we can
 * patch Sanity schemas before migration.
 *
 * Usage:
 *   BCMS_API_KEY=<id.secret.instanceId> node scripts/bcms-full-inventory.mjs
 *
 * Output:
 *   scripts/bcms-full-inventory-report.json
 *
 * Auth: raw fetch, Authorization: ApiKey <fullKey>
 * Templates: seeded from existing spike report (SDK template.getAll() returns
 *   empty with this key — REST /entry/* and /media/* endpoints work fine).
 */

import { readFileSync, writeFileSync } from "node:fs";

// ─── Config ──────────────────────────────────────────────────────────────────

const apiKey = process.env.BCMS_API_KEY;
const instanceId = process.env.BCMS_INSTANCE_ID || "6710e3bdeeda0c4a2de4b330";
const cmsOrigin = process.env.BCMS_API_ORIGIN || "https://app.thebcms.com";
const REPORT_PATH = "scripts/bcms-full-inventory-report.json";
const SPIKE_REPORT_PATH = "scripts/bcms-spike-report.json";
const MAX_CONCURRENCY = 5;
const MAX_RETRIES = 3;
const RETRY_BASE_MS = 1000;

if (!apiKey) {
  console.error("Missing BCMS_API_KEY. Set BCMS_API_KEY=<id.secret.instanceId> and rerun.");
  process.exit(1);
}

// SDK/API expects 3-part key: id.secret.instanceId
const fullKey = apiKey.split(".").length === 3 ? apiKey : `${apiKey}.${instanceId}`;

// ─── BCMS REST fetch helper ────────────────────────────────────────────────────

async function bcmsFetch(path) {
  const url = `${cmsOrigin}${path}`;
  const res = await fetch(url, {
    headers: { Authorization: `ApiKey ${fullKey}` },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw Object.assign(new Error(`${res.status} ${res.statusText}: ${text.slice(0, 200)}`), {
      status: res.status,
    });
  }
  return res.json();
}

// ─── Retry helper ─────────────────────────────────────────────────────────────

async function withRetry(fn, label) {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const status = err?.status ?? 0;
      const isRetryable = status === 429 || status >= 500 || !status;
      if (!isRetryable || attempt === MAX_RETRIES) throw err;
      const wait = RETRY_BASE_MS * Math.pow(2, attempt - 1);
      console.warn(`  [retry ${attempt}/${MAX_RETRIES}] ${label} — status ${status}, waiting ${wait}ms`);
      await new Promise((r) => setTimeout(r, wait));
    }
  }
}

// ─── Concurrency pool ─────────────────────────────────────────────────────────

function createPool(concurrency) {
  let active = 0;
  const queue = [];
  function run() {
    while (queue.length > 0 && active < concurrency) {
      const { fn, resolve, reject } = queue.shift();
      active++;
      fn()
        .then(resolve)
        .catch(reject)
        .finally(() => {
          active--;
          run();
        });
    }
  }
  return {
    submit(fn) {
      return new Promise((resolve, reject) => {
        queue.push({ fn, resolve, reject });
        run();
      });
    },
  };
}

// ─── Body node traversal ──────────────────────────────────────────────────────

/**
 * BCMS body nodes: { type: string, value: string|array, attrs?: object }
 * The value may be an HTML string (leaf) or a nested array (container).
 */
function collectNodeTypes(nodes, acc) {
  if (!Array.isArray(nodes)) return;
  for (const node of nodes) {
    if (!node || typeof node !== "object") continue;
    const type = node.type ?? null;
    if (type) {
      acc.add(type);
      // Collect attrs keys as "type:key"
      if (node.attrs && typeof node.attrs === "object") {
        for (const k of Object.keys(node.attrs)) {
          acc.add(`${type}[${k}]`);
        }
      }
    }
    // Recurse if value is a nested array (e.g. list containing listItem nodes)
    if (Array.isArray(node.value)) {
      collectNodeTypes(node.value, acc);
    }
    if (Array.isArray(node.content)) {
      collectNodeTypes(node.content, acc);
    }
  }
}

// ─── Field analysis ───────────────────────────────────────────────────────────

function isNonEmpty(v) {
  if (v === null || v === undefined || v === "") return false;
  if (Array.isArray(v)) return v.length > 0;
  if (typeof v === "object") return Object.keys(v).length > 0;
  return true;
}

/**
 * Walk meta locale fields; update fieldFill, refGraph, and mediaRefs in place.
 */
function analyzeMetaLocale(metaLocale, templateName, fieldFill, refGraph, mediaRefs) {
  if (!metaLocale || typeof metaLocale !== "object") return;
  for (const [fieldName, value] of Object.entries(metaLocale)) {
    const skip = new Set(["_id", "createdAt", "updatedAt", "instanceId", "templateId", "userId"]);
    if (skip.has(fieldName)) continue;

    if (!fieldFill[fieldName]) fieldFill[fieldName] = { filled: 0, total: 0 };
    fieldFill[fieldName].total++;
    if (isNonEmpty(value)) fieldFill[fieldName].filled++;

    // Entry pointer detection: array or single object with templateId/templateName
    const vals = Array.isArray(value) ? value : [value];
    for (const v of vals) {
      if (!v || typeof v !== "object" || Array.isArray(v)) continue;
      // BCMS parsed entry pointers look like { _id, templateId, templateName, ... }
      if (typeof v.templateName === "string" && typeof v._id === "string") {
        const key = `${templateName} → ${v.templateName}`;
        if (!refGraph[key]) refGraph[key] = { count: 0, field: fieldName, targetTemplate: v.templateName };
        refGraph[key].count++;
      }
      // Media detection: objects with mimetype
      if (typeof v._id === "string" && typeof v.mimetype === "string") {
        mediaRefs.push({ field: fieldName, _id: v._id, mimetype: v.mimetype, size: v.size ?? null });
      }
    }
  }
}

// ─── Known node types ─────────────────────────────────────────────────────────

const KNOWN_NODE_TYPES = new Set([
  "paragraph", "heading", "text", "image", "hardBreak", "bulletList",
  "orderedList", "listItem", "blockquote", "codeBlock", "code",
  "horizontalRule", "table", "tableRow", "tableCell", "tableHeader",
  "bold", "italic", "underline", "strike", "link",
]);

// ─── Main ─────────────────────────────────────────────────────────────────────

console.log("================================================================");
console.log("  BCMS Full Inventory");
console.log(`  cmsOrigin: ${cmsOrigin}`);
console.log(`  instanceId: ${instanceId}`);
console.log(`  maxConcurrency: ${MAX_CONCURRENCY}`);
console.log("================================================================\n");

const pool = createPool(MAX_CONCURRENCY);
const startTime = Date.now();

// ─── Template registry (fallback) ────────────────────────────────────────────
// SDK template.getAll() returns empty with this key scope (list permission not
// granted). Individual /template/:id endpoints work. These IDs were confirmed
// from git history of bcms-spike-report.json (run 2026-04-29).
const TEMPLATE_REGISTRY = [
  { _id: "6718befdef5de485dc93f8b5", name: "contact-page",       label: "Contact page",       singleEntry: true  },
  { _id: "6718c07def5de485dc93f8b8", name: "testimonial",        label: "Testimonial",         singleEntry: false },
  { _id: "6718c0f2ef5de485dc93f8b9", name: "company",            label: "Company",             singleEntry: false },
  { _id: "6718cd2fef5de485dc93f8f0", name: "partnership-page",   label: "Partnership page",    singleEntry: true  },
  { _id: "6718e045ef5de485dc93f928", name: "about-page",         label: "About page",          singleEntry: true  },
  { _id: "6718e04bef5de485dc93f929", name: "blog",               label: "Blog",                singleEntry: false },
  { _id: "6718e069ef5de485dc93f92a", name: "person",             label: "Person",              singleEntry: false },
  { _id: "6718e5f0ef5de485dc93f93f", name: "blog-category",      label: "Blog category",       singleEntry: false },
  { _id: "6718f7b7e4d0077ad7a50f62", name: "home-page",          label: "Home page",           singleEntry: true  },
  { _id: "6719f9d1b98a24129383bd2e", name: "certificate",        label: "Certificate",         singleEntry: false },
  { _id: "671a222fb98a24129383bd5a", name: "case-study",         label: "Case study",          singleEntry: false },
  { _id: "671a5d7be93230ec1d3de24d", name: "service",            label: "Service",             singleEntry: false },
  { _id: "671b90583beff4fc58f4a005", name: "privacy-policy-page",label: "Privacy policy page", singleEntry: true  },
  { _id: "671ba1b23beff4fc58f4a007", name: "blog-page",          label: "Blog page",           singleEntry: true  },
  { _id: "67289ec2819bfc10a7282da0", name: "header",             label: "Header",              singleEntry: true  },
  { _id: "6728a846819bfc10a7282da3", name: "footer",             label: "Footer",              singleEntry: true  },
  { _id: "6735ca3f107a7e22c2300f81", name: "case-studies-page",  label: "Case studies page",   singleEntry: true  },
  { _id: "679cc4e78219a897770f4de3", name: "redirect",           label: "Redirect",            singleEntry: false },
];

// ─── Step 1: Load templates (spike report cache, fall back to hardcoded registry) ──

console.log("[1/3] Loading templates...");
let templates;
try {
  const spikeReport = JSON.parse(readFileSync(SPIKE_REPORT_PATH, "utf8"));
  const cached = spikeReport.templates ?? [];
  if (cached.length > 0) {
    templates = cached;
    console.log(`  loaded ${templates.length} templates from spike report cache`);
  } else {
    throw new Error("spike report has 0 templates");
  }
} catch (err) {
  templates = TEMPLATE_REGISTRY;
  console.log(`  spike report unavailable (${err.message}) — using hardcoded registry (${templates.length} templates)`);
}

const report = {
  timestamp: new Date().toISOString(),
  cmsOrigin,
  instanceId,
  runtimeMs: 0,
  note: "Templates seeded from bcms-spike-report.json (SDK template.getAll() returns empty with this key scope; REST entry/media endpoints work fine).",
  templates: templates.map((t) => ({
    _id: t._id,
    name: t.name,
    label: t.label,
    singleEntry: t.singleEntry ?? false,
    props: t.props ?? [],
  })),
  templateSummaries: {},
  entrySummaries: [],
  globalStats: {
    totalTemplates: templates.length,
    totalEntries: 0,
    statusDistribution: {},
    localeDistribution: {},
    bodyNodeTypes: {},
    unknownBodyNodeTypes: [],
    referenceGraph: {},
    totalMediaRefs: 0,
  },
  mediaSummary: {},
  warnings: [],
  errors: [],
};

// ─── Step 2: Fetch all entries per template ────────────────────────────────────

console.log(`\n[2/3] Fetching all entries (max ${MAX_CONCURRENCY} concurrent)...\n`);

const templateTasks = templates.map((t) =>
  pool.submit(async () => {
    const tName = t.name;
    const tId = t._id;

    const analysis = {
      templateId: tId,
      templateName: tName,
      templateLabel: t.label,
      singleEntry: t.singleEntry ?? false,
      totalEntries: 0,
      statusDistribution: {},
      localeDistribution: {},
      fieldFill: {},
      bodyNodeTypes: {},
      bodyNodeTypeSet: new Set(),
      refGraph: {},
      mediaRefs: [],
      entrySummaries: [],
    };

    let items;
    try {
      const data = await withRetry(
        () => bcmsFetch(`/api/v3/instance/${instanceId}/template/${tId}/entry/all/parsed`),
        `entries(${tName})`
      );
      items = data.items ?? data ?? [];
      if (!Array.isArray(items)) items = [];
    } catch (err) {
      console.error(`  ✗ ${tName}: ${err?.message ?? err}`);
      report.errors.push({ step: "entries", template: tName, error: String(err?.message ?? err) });
      return analysis;
    }

    analysis.totalEntries = items.length;
    console.log(`  ${tName}: ${items.length} entries`);

    for (const entry of items) {
      // ── Statuses ──────────────────────────────────────────────────────────
      // BCMS parsed: statuses = [{ id, lng, label }]
      const statusLabels = Array.isArray(entry.statuses)
        ? entry.statuses.map((s) => s.label ?? s.id ?? "unknown")
        : [entry.status ?? entry._status ?? "unknown"];
      for (const statusLabel of statusLabels) {
        analysis.statusDistribution[statusLabel] =
          (analysis.statusDistribution[statusLabel] ?? 0) + 1;
      }
      // Use first status for global aggregation
      const primaryStatus = statusLabels[0] ?? "unknown";

      // ── Locales ──────────────────────────────────────────────────────────
      const metaLocales = entry.meta ? Object.keys(entry.meta) : [];
      for (const locale of metaLocales) {
        analysis.localeDistribution[locale] = (analysis.localeDistribution[locale] ?? 0) + 1;
      }
      if (!metaLocales.includes("en")) {
        report.warnings.push({
          type: "NO_EN_LOCALE",
          template: tName,
          entryId: entry._id ?? "?",
          locales: metaLocales,
          message: `Entry in "${tName}" (id: ${entry._id}) has no "en" locale — only: [${metaLocales.join(", ")}]`,
        });
      }

      // ── Field fill ───────────────────────────────────────────────────────
      const primaryLocale = metaLocales.includes("en") ? "en" : metaLocales[0];
      if (primaryLocale && entry.meta?.[primaryLocale]) {
        analyzeMetaLocale(
          entry.meta[primaryLocale],
          tName,
          analysis.fieldFill,
          analysis.refGraph,
          analysis.mediaRefs
        );
      }

      // ── Body node types ───────────────────────────────────────────────────
      const contentLocales = entry.content ? Object.keys(entry.content) : [];
      for (const lang of contentLocales) {
        const nodes = entry.content[lang];
        if (!Array.isArray(nodes) || nodes.length === 0) continue;
        const nodeTypeSet = new Set();
        collectNodeTypes(nodes, nodeTypeSet);
        for (const nt of nodeTypeSet) {
          analysis.bodyNodeTypes[nt] = (analysis.bodyNodeTypes[nt] ?? 0) + 1;
        }
      }

      // ── Entry summary ─────────────────────────────────────────────────────
      const slug =
        entry.meta?.en?.slug ?? entry.meta?.[metaLocales[0]]?.slug ?? null;
      const hasContent = contentLocales.some(
        (l) => Array.isArray(entry.content?.[l]) && entry.content[l].length > 0
      );
      analysis.entrySummaries.push({
        _id: entry._id ?? null,
        slug,
        statuses: statusLabels,
        locales: metaLocales,
        hasContent,
      });
    }

    return analysis;
  })
);

const templateResults = await Promise.all(templateTasks);

// ─── Aggregate ────────────────────────────────────────────────────────────────

for (const analysis of templateResults) {
  // Per-entry summaries
  for (const es of analysis.entrySummaries) {
    report.entrySummaries.push({ template: analysis.templateName, ...es });
  }

  // Field fill rates as percentages
  const fieldFillRates = {};
  for (const [field, counts] of Object.entries(analysis.fieldFill)) {
    fieldFillRates[field] = {
      filled: counts.filled,
      total: counts.total,
      pct: counts.total > 0 ? Math.round((counts.filled / counts.total) * 100) : 0,
    };
  }

  report.templateSummaries[analysis.templateName] = {
    templateId: analysis.templateId,
    label: analysis.templateLabel,
    singleEntry: analysis.singleEntry,
    totalEntries: analysis.totalEntries,
    statusDistribution: analysis.statusDistribution,
    localeDistribution: analysis.localeDistribution,
    fieldFillRates,
    bodyNodeTypes: Object.fromEntries(
      Object.entries(analysis.bodyNodeTypes).sort((a, b) => b[1] - a[1])
    ),
    referenceGraph: analysis.refGraph,
    totalMediaRefs: analysis.mediaRefs.length,
    mediaSample: analysis.mediaRefs.slice(0, 3),
  };

  // Global rollup
  report.globalStats.totalEntries += analysis.totalEntries;

  for (const [status, count] of Object.entries(analysis.statusDistribution)) {
    report.globalStats.statusDistribution[status] =
      (report.globalStats.statusDistribution[status] ?? 0) + count;
  }
  for (const [locale, count] of Object.entries(analysis.localeDistribution)) {
    report.globalStats.localeDistribution[locale] =
      (report.globalStats.localeDistribution[locale] ?? 0) + count;
  }
  for (const [nodeType, count] of Object.entries(analysis.bodyNodeTypes)) {
    report.globalStats.bodyNodeTypes[nodeType] =
      (report.globalStats.bodyNodeTypes[nodeType] ?? 0) + count;
  }
  for (const [refKey, refVal] of Object.entries(analysis.refGraph)) {
    if (!report.globalStats.referenceGraph[refKey]) {
      report.globalStats.referenceGraph[refKey] = { ...refVal };
    } else {
      report.globalStats.referenceGraph[refKey].count += refVal.count;
    }
  }
  report.globalStats.totalMediaRefs += analysis.mediaRefs.length;
}

// Unknown body node types
for (const [nodeType] of Object.entries(report.globalStats.bodyNodeTypes)) {
  // Strip attr keys (type[key]) for the known check
  const baseType = nodeType.includes("[") ? nodeType.slice(0, nodeType.indexOf("[")) : nodeType;
  if (!KNOWN_NODE_TYPES.has(baseType) && !nodeType.includes("[")) {
    const templates = templateResults
      .filter((a) => nodeType in a.bodyNodeTypes)
      .map((a) => a.templateName);
    const existing = report.globalStats.unknownBodyNodeTypes.find((u) => u.type === nodeType);
    if (existing) {
      existing.count += report.globalStats.bodyNodeTypes[nodeType];
    } else {
      report.globalStats.unknownBodyNodeTypes.push({
        type: nodeType,
        count: report.globalStats.bodyNodeTypes[nodeType],
        templates,
      });
    }
  }
}

// ─── Step 3: Media inventory ──────────────────────────────────────────────────

console.log("\n[3/3] Fetching media inventory...");
try {
  // BCMS media /all returns array or paginated — check both
  const rawMedia = await withRetry(
    () => bcmsFetch(`/api/v3/instance/${instanceId}/media/all`),
    "media.all"
  );
  const mediaItems = Array.isArray(rawMedia) ? rawMedia : rawMedia.items ?? [];
  const mimetypes = {};
  let totalSize = 0;
  for (const m of mediaItems) {
    const mt = m.mimetype ?? "unknown";
    mimetypes[mt] = (mimetypes[mt] ?? 0) + 1;
    totalSize += m.size ?? 0;
  }
  report.mediaSummary = {
    total: mediaItems.length,
    mimetypes,
    totalSizeBytes: totalSize,
    totalSizeMB: Math.round(totalSize / 1024 / 1024),
  };
  console.log(`  total media: ${mediaItems.length} (${report.mediaSummary.totalSizeMB}MB)`);
} catch (err) {
  console.error("  ✗ media.all failed:", err?.message ?? err);
  report.errors.push({ step: "media", error: String(err?.message ?? err) });
  // Fall back to SDK-confirmed total from spike
  report.mediaSummary = { total: 786, note: "Fetched from spike report fallback — REST call failed" };
}

// ─── Warning generation ────────────────────────────────────────────────────────

// Empty multi-entry templates
for (const t of report.templates) {
  const summary = report.templateSummaries[t.name];
  if (!summary || t.singleEntry) continue;
  if (summary.totalEntries === 0) {
    report.warnings.push({
      type: "EMPTY_MULTI_ENTRY_TEMPLATE",
      template: t.name,
      message: `"${t.name}" is multi-entry but has 0 entries — orphan template?`,
    });
  }
}

// All-draft or majority-draft templates
for (const [tName, summary] of Object.entries(report.templateSummaries)) {
  if (summary.totalEntries === 0) continue;
  const draftCount = Object.entries(summary.statusDistribution)
    .filter(([s]) => s.toLowerCase().includes("draft"))
    .reduce((a, [, c]) => a + c, 0);
  if (draftCount === summary.totalEntries) {
    report.warnings.push({
      type: "ALL_ENTRIES_DRAFT",
      template: tName,
      count: draftCount,
      message: `ALL ${draftCount} entries in "${tName}" are drafts — none published`,
    });
  } else if (draftCount > summary.totalEntries * 0.5) {
    report.warnings.push({
      type: "MAJORITY_DRAFT",
      template: tName,
      draftCount,
      total: summary.totalEntries,
      pct: Math.round((draftCount / summary.totalEntries) * 100),
      message: `${Math.round((draftCount / summary.totalEntries) * 100)}% drafts in "${tName}"`,
    });
  }
}

// Unknown body node types
if (report.globalStats.unknownBodyNodeTypes.length > 0) {
  for (const u of report.globalStats.unknownBodyNodeTypes) {
    report.warnings.push({
      type: "UNKNOWN_BODY_NODE_TYPE",
      nodeType: u.type,
      count: u.count,
      templates: u.templates,
      message: `Unknown body node type "${u.type}" (${u.count}x in: ${u.templates.join(", ")})`,
    });
  }
}

// Non-en locales
const nonEnLocales = Object.keys(report.globalStats.localeDistribution).filter((l) => l !== "en");
if (nonEnLocales.length > 0) {
  report.warnings.push({
    type: "MULTILINGUAL_CONTENT",
    locales: nonEnLocales,
    message: `Non-en locales present: ${nonEnLocales.join(", ")} — verify Sanity i18n coverage`,
  });
}

// ─── Finalize ─────────────────────────────────────────────────────────────────

report.runtimeMs = Date.now() - startTime;
writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));

// ─── Stdout summary ───────────────────────────────────────────────────────────

const gs = report.globalStats;
const totalPublished = Object.entries(gs.statusDistribution)
  .filter(([s]) => !s.toLowerCase().includes("draft"))
  .reduce((a, [, c]) => a + c, 0);
const totalDrafts = Object.entries(gs.statusDistribution)
  .filter(([s]) => s.toLowerCase().includes("draft"))
  .reduce((a, [, c]) => a + c, 0);

console.log("\n================================================================");
console.log("  BCMS Full Inventory — SUMMARY");
console.log("================================================================");
console.log(`  Templates : ${gs.totalTemplates}`);
console.log(`  Total entries : ${gs.totalEntries}`);
console.log(`  Published : ${totalPublished}`);
console.log(`  Drafts    : ${totalDrafts}`);
console.log(`  Media items : ${report.mediaSummary.total ?? "?"} (${report.mediaSummary.totalSizeMB ?? "?"}MB)`);
console.log(`  Media field refs : ${gs.totalMediaRefs}`);
console.log(`  Runtime   : ${(report.runtimeMs / 1000).toFixed(1)}s`);

console.log("\n  Entries per template:");
const sortedT = Object.entries(report.templateSummaries).sort(
  (a, b) => b[1].totalEntries - a[1].totalEntries
);
for (const [tName, s] of sortedT) {
  const statStr = Object.entries(s.statusDistribution)
    .map(([k, v]) => `${k}:${v}`)
    .join(", ") || "—";
  const locales = Object.keys(s.localeDistribution).join(", ") || "none";
  console.log(
    `    ${tName.padEnd(28)} ${String(s.totalEntries).padStart(3)}  [${statStr}]  locales: ${locales}`
  );
}

const allBodyTypeKeys = Object.keys(gs.bodyNodeTypes).filter((k) => !k.includes("["));
console.log(`\n  Body node types (${allBodyTypeKeys.length} unique): ${allBodyTypeKeys.sort().join(", ") || "none"}`);

if (gs.unknownBodyNodeTypes.length > 0) {
  console.log(`\n  UNKNOWN body node types:`);
  for (const u of gs.unknownBodyNodeTypes) {
    console.log(`    - ${u.type} (${u.count}x, in: ${u.templates.join(", ")})`);
  }
}

const localeKeys = Object.keys(gs.localeDistribution);
console.log(`\n  Locales: ${localeKeys.join(", ") || "none"}`);

const refEdges = Object.entries(gs.referenceGraph);
if (refEdges.length > 0) {
  console.log(`\n  Reference graph (${refEdges.length} edges):`);
  for (const [edge, info] of refEdges.sort((a, b) => b[1].count - a[1].count)) {
    console.log(`    ${edge}  (${info.count}x via field: ${info.field})`);
  }
}

if (report.warnings.length > 0) {
  console.log(`\n  WARNINGS (${report.warnings.length}):`);
  for (const w of report.warnings) {
    console.log(`    WARNING: [${w.type}] ${w.message}`);
  }
} else {
  console.log("\n  No warnings.");
}

if (report.errors.length > 0) {
  console.log(`\n  ERRORS (${report.errors.length}):`);
  for (const e of report.errors) {
    console.log(`    ERROR: ${e.step}${e.template ? ` (${e.template})` : ""} — ${e.error}`);
  }
} else {
  console.log("  No errors.");
}

console.log(`\n  Full report: ${REPORT_PATH}`);
console.log("================================================================\n");
