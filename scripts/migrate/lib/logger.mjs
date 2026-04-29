/**
 * Structured logger for the migration suite.
 *
 * - Stdout format: `[level] [phase] [template] message` plus optional fields
 * - Persists a run report to scripts/migrate/.checkpoint/last-run.json
 * - Tallies per-template counts: created, patched, skipped, conflicted, failed
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const LEVEL_RANK = { debug: 10, info: 20, warn: 30, error: 40 };
const DEFAULT_REPORT_PATH = "scripts/migrate/.checkpoint/last-run.json";

export function createLogger(options = {}) {
  const minLevel = options.minLevel ?? "info";
  const reportPath = options.reportPath ?? DEFAULT_REPORT_PATH;
  const dryRun = options.dryRun === true;

  const minRank = LEVEL_RANK[minLevel] ?? 20;

  const counts = {
    created: 0,
    patched: 0,
    skipped: 0,
    conflicted: 0,
    failed: 0,
    assetsUploaded: 0,
    assetsReused: 0,
  };
  /** Per-template tallies. */
  const perTemplate = {};
  /** Conflicts and errors retained for the report file. */
  const conflicts = [];
  const errors = [];
  const phaseEvents = [];

  function bumpTemplate(template, key) {
    if (!template) return;
    if (!perTemplate[template]) {
      perTemplate[template] = {
        created: 0,
        patched: 0,
        skipped: 0,
        conflicted: 0,
        failed: 0,
      };
    }
    if (key in perTemplate[template]) perTemplate[template][key]++;
  }

  function emit(level, phase, template, message, extra) {
    if ((LEVEL_RANK[level] ?? 0) < minRank) return;
    const tag = `[${level}]${phase ? ` [${phase}]` : ""}${template ? ` [${template}]` : ""}`;
    const extraStr =
      extra && Object.keys(extra).length > 0
        ? ` ${JSON.stringify(extra)}`
        : "";
    process.stdout.write(`${tag} ${message}${extraStr}\n`);
  }

  return {
    debug(phase, template, message, extra) {
      emit("debug", phase, template, message, extra);
    },
    info(phase, template, message, extra) {
      emit("info", phase, template, message, extra);
    },
    warn(phase, template, message, extra) {
      emit("warn", phase, template, message, extra);
    },
    error(phase, template, message, extra) {
      emit("error", phase, template, message, extra);
      if (extra) errors.push({ phase, template, message, ...extra });
      else errors.push({ phase, template, message });
    },

    startPhase(phase, message) {
      phaseEvents.push({ phase, startedAt: new Date().toISOString(), message });
      emit("info", phase, null, `start: ${message ?? ""}`);
    },
    endPhase(phase, message) {
      phaseEvents.push({ phase, endedAt: new Date().toISOString(), message });
      emit("info", phase, null, `end: ${message ?? ""}`);
    },

    countCreate(template, docId) {
      counts.created++;
      bumpTemplate(template, "created");
      emit("info", "write", template, `created ${docId}`);
    },
    countPatch(template, docId) {
      counts.patched++;
      bumpTemplate(template, "patched");
      emit("info", "write", template, `patched ${docId}`);
    },
    countSkip(template, docId, reason) {
      counts.skipped++;
      bumpTemplate(template, "skipped");
      emit("debug", "write", template, `skip ${docId} (${reason ?? "unchanged"})`);
    },
    countConflict(template, docId, detail) {
      counts.conflicted++;
      bumpTemplate(template, "conflicted");
      conflicts.push({ template, docId, detail });
      emit("warn", "write", template, `conflict on ${docId}`, detail);
    },
    countFail(template, docId, err) {
      counts.failed++;
      bumpTemplate(template, "failed");
      const detail = {
        message: err?.message ?? String(err),
        stack: typeof err?.stack === "string" ? err.stack.split("\n").slice(0, 4).join("\n") : null,
      };
      errors.push({ phase: "write", template, docId, ...detail });
      emit("error", "write", template, `failed ${docId}`, detail);
    },

    countAssetUpload() {
      counts.assetsUploaded++;
    },
    countAssetReuse() {
      counts.assetsReused++;
    },

    /**
     * Write the run report to disk and return the in-memory snapshot.
     */
    flush() {
      const report = {
        finishedAt: new Date().toISOString(),
        dryRun,
        counts,
        perTemplate,
        conflicts,
        errors,
        phases: phaseEvents,
      };
      try {
        mkdirSync(dirname(reportPath), { recursive: true });
        writeFileSync(reportPath, JSON.stringify(report, null, 2));
      } catch (err) {
        emit("warn", "logger", null, `failed to write report: ${err?.message ?? err}`);
      }
      return report;
    },

    /** Read-only snapshot (no file write). Useful for tests. */
    snapshot() {
      return {
        counts: { ...counts },
        perTemplate: structuredClone(perTemplate),
        conflicts: structuredClone(conflicts),
        errors: structuredClone(errors),
      };
    },
  };
}
