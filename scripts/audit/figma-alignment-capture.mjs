#!/usr/bin/env node
/**
 * Figma alignment capture (site side).
 *
 * For each (template, viewport) pair:
 *   - Resize browser
 *   - Pre-seed localStorage `hr-theme=light` so next-themes lands on light
 *     before paint (light mode is the design source-of-truth per Pavle)
 *   - Navigate to the route on staging
 *   - Wait for network idle + theme to apply
 *   - Capture full-page screenshot to docs/audits/figma-alignment/<id>/<viewport>-site.png
 *
 * Figma reference screenshots are fetched separately via the Figma MCP from
 * the controlling Claude session and saved alongside as `<viewport>-figma.png`.
 *
 * Usage:
 *   AUDIT_BASE=https://heroic-rankings-final.vercel.app \
 *     node scripts/audit/figma-alignment-capture.mjs
 */

import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { dirname } from "node:path";

const BASE = process.env.AUDIT_BASE ?? "https://heroic-rankings-final.vercel.app";

const TEMPLATES = [
  {
    id: "blog-index",
    route: "/blog/",
    viewports: ["desktop"],
  },
  {
    id: "blog-single",
    route: "/seo/managed/best-ahrefs-alternatives/",
    viewports: ["desktop", "mobile"],
  },
  {
    id: "case-studies-index",
    route: "/case-study/",
    viewports: ["desktop"],
  },
  {
    id: "case-study-single",
    route: "/case-study/designrush/",
    viewports: ["desktop", "mobile"],
  },
  {
    id: "podcast-index",
    route: "/podcast/",
    viewports: ["desktop"],
  },
  {
    id: "podcast-single",
    route: "/podcast/audit-fixture-podcast-episode/",
    viewports: ["desktop", "mobile"],
  },
  {
    id: "team-detail",
    route: "/about/nebojsa-jankovic/",
    viewports: ["desktop", "mobile"],
  },
  {
    id: "about-us",
    route: "/about/",
    viewports: ["desktop", "mobile"],
  },
];

const VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  mobile: { width: 375, height: 812 },
};

const OUT_ROOT = "docs/audits/figma-alignment";

async function ensureDir(filePath) {
  await mkdir(dirname(filePath), { recursive: true });
}

async function captureOne(browser, template, viewport) {
  const size = VIEWPORTS[viewport];
  const context = await browser.newContext({
    viewport: size,
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  // Pre-seed light theme on the origin so next-themes reads it before paint.
  // Has to land BEFORE the first navigation; do it via an init script that
  // writes localStorage on every document the context loads.
  await context.addInitScript(() => {
    try {
      window.localStorage.setItem("hr-theme", "light");
    } catch {
      /* localStorage may be unavailable in some sandboxes; ignore */
    }
  });

  const url = `${BASE}${template.route}`;
  // `load` instead of `networkidle` — Sanity Live keeps a long-poll open and
  // would never fire networkidle within a sane timeout.
  await page.goto(url, { waitUntil: "load", timeout: 45000 });
  await page.waitForFunction(
    () => document.documentElement.classList.contains("light"),
    { timeout: 5000 },
  ).catch(() => {
    /* if we never see the class, capture anyway and let the diff show it */
  });
  // Wait long enough for next-themes hydration + any late-mount components.
  // Then reload once so the inline theme script runs against an already-set
  // storage (avoids the rare first-paint dark flash that survives 800ms).
  await page.waitForTimeout(1500);
  await page.reload({ waitUntil: "load" });
  await page.waitForFunction(
    () => document.documentElement.classList.contains("light"),
    { timeout: 5000 },
  ).catch(() => {});
  await page.waitForTimeout(1500);

  const outPath = `${OUT_ROOT}/${template.id}/${viewport}-site.png`;
  await ensureDir(outPath);
  await page.screenshot({ path: outPath, fullPage: true, type: "png" });
  await context.close();
  console.log(`✓ ${template.id} / ${viewport} → ${outPath}`);
}

(async () => {
  console.log(`Capture base: ${BASE}`);
  const browser = await chromium.launch();
  try {
    for (const template of TEMPLATES) {
      for (const viewport of template.viewports) {
        await captureOne(browser, template, viewport);
      }
    }
  } finally {
    await browser.close();
  }
})();
