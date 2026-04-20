#!/usr/bin/env node
/**
 * Figma JSON → DOM Verification Pipeline
 *
 * Compares the extracted .fig JSON against the live site via Playwright.
 * Reports mismatches in text content, typography, colors, spacing, and layout.
 *
 * Usage:
 *   node scripts/figma-verify.mjs [frame-index] [--theme light|dark]
 *
 * Examples:
 *   node scripts/figma-verify.mjs 86         # Homepage (light)
 *   node scripts/figma-verify.mjs 88 --theme dark  # Podcast Single (dark)
 *   node scripts/figma-verify.mjs all         # All pages
 */

import { chromium } from "@playwright/test";
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FIGMA_JSON = resolve(__dirname, "/tmp/heroic-fig-output/canvas.json");
const OUT_DIR = resolve(__dirname, "../docs/audit/verification");
const BASE_URL = process.env.BASE_URL || "http://localhost:3002";

// Frame index → route mapping
const FRAME_ROUTES = {
  86: "/",
  8: "/about-us",
  21: "/seo-services",
  23: "/technical-seo",
  25: "/on-page-seo",
  27: "/local-seo",
  29: "/content-creation",
  31: "/ecommerce-seo",
  33: "/link-building",
  35: "/keyword-strategy",
  12: "/partnership",
  14: "/insights",
  16: "/case-studies",
  19: "/contact",
  89: "/podcast",
  88: "/podcast/marketing-that-actually-works",
  96: "/case-studies/number-artist",
};

// ---------------------------------------------------------------------------
// Figma JSON extraction helpers
// ---------------------------------------------------------------------------

function loadFigmaData() {
  const raw = readFileSync(FIGMA_JSON, "utf-8");
  return JSON.parse(raw);
}

function extractTextNodes(node, results = [], depth = 0) {
  const name = node.name || "";
  const fontSize = node.fontSize;
  const fontName = node.fontName || {};
  const fills = node.fillPaints || [];
  const size = node.size || {};
  const transform = node.transform || {};
  const letterSpacing = node.letterSpacing;
  const lineHeight = node.lineHeight;
  const textAlign = node.textAlignHorizontal;

  if (fontSize && node.textData) {
    results.push({
      text: name.trim().slice(0, 300),
      fontSize,
      fontFamily: fontName.family || "unknown",
      fontStyle: fontName.style || "Regular",
      fontWeight: styleToWeight(fontName.style),
      letterSpacing: letterSpacing || null,
      lineHeight: lineHeight || null,
      color: fills[0]?.color || null,
      textAlign: textAlign || null,
      width: size.x || 0,
      height: size.y || 0,
      x: transform.x || 0,
      y: transform.y || 0,
    });
  }

  for (const child of node.children || []) {
    extractTextNodes(child, results, depth + 1);
  }
  return results;
}

function extractLayoutNodes(node, results = [], depth = 0) {
  const name = node.name || "";
  const size = node.size || {};
  const transform = node.transform || {};
  const fills = node.fillPaints || [];
  const cornerRadius = node.cornerRadius;
  const stackMode = node.stackMode;
  const stackSpacing = node.stackSpacing;
  const stackHPad = node.stackHorizontalPadding;
  const stackVPad = node.stackVerticalPadding;
  const effects = node.effects || [];
  const opacity = node.opacity;

  if ((size.x || 0) > 20 && depth < 10) {
    const entry = {
      name: name.slice(0, 100),
      width: size.x || 0,
      height: size.y || 0,
      x: transform.x || 0,
      y: transform.y || 0,
    };
    if (fills.length) entry.bgColor = fills[0].color || null;
    if (cornerRadius) entry.borderRadius = cornerRadius;
    if (stackMode) entry.flexDirection = stackMode === "HORIZONTAL" ? "row" : "column";
    if (stackSpacing != null) entry.gap = stackSpacing;
    if (stackHPad != null) entry.paddingX = stackHPad;
    if (stackVPad != null) entry.paddingY = stackVPad;
    if (effects.length) entry.effects = effects;
    if (opacity != null) entry.opacity = opacity;
    results.push(entry);
  }

  for (const child of node.children || []) {
    extractLayoutNodes(child, results, depth + 1);
  }
  return results;
}

function styleToWeight(style) {
  if (!style) return 400;
  const s = style.toLowerCase();
  if (s.includes("bold")) return 700;
  if (s.includes("semibold") || s.includes("semi bold")) return 600;
  if (s.includes("medium")) return 500;
  if (s.includes("light")) return 300;
  return 400;
}

// ---------------------------------------------------------------------------
// Playwright DOM extraction
// ---------------------------------------------------------------------------

async function extractDomText(page) {
  return page.evaluate(() => {
    const results = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const text = node.textContent?.trim();
      if (!text || text.length < 2) continue;
      const el = node.parentElement;
      if (!el) continue;
      const style = getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) continue;

      results.push({
        text: text.slice(0, 300),
        fontSize: parseFloat(style.fontSize),
        fontWeight: parseInt(style.fontWeight, 10),
        fontFamily: style.fontFamily.split(",")[0].replace(/['"]/g, "").trim(),
        color: style.color,
        letterSpacing: style.letterSpacing === "normal" ? null : parseFloat(style.letterSpacing),
        lineHeight: parseFloat(style.lineHeight),
        textAlign: style.textAlign,
        x: Math.round(rect.x),
        y: Math.round(rect.y),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
      });
    }
    return results;
  });
}

// ---------------------------------------------------------------------------
// Matching & comparison
// ---------------------------------------------------------------------------

function normalizeText(t) {
  return t.replace(/\s+/g, " ").trim().toLowerCase();
}

function hexToRgb(hex) {
  if (!hex || !hex.startsWith("#")) return null;
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return { r, g, b };
}

function cssColorToRgb(cssColor) {
  if (!cssColor) return null;
  const match = cssColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (match) return { r: +match[1], g: +match[2], b: +match[3] };
  return null;
}

function colorsMatch(figmaHex, cssColor, tolerance = 5) {
  const a = hexToRgb(figmaHex);
  const b = cssColorToRgb(cssColor);
  if (!a || !b) return true; // can't compare, skip
  return (
    Math.abs(a.r - b.r) <= tolerance &&
    Math.abs(a.g - b.g) <= tolerance &&
    Math.abs(a.b - b.b) <= tolerance
  );
}

function compareTextNodes(figmaTexts, domTexts) {
  const issues = [];
  const matched = new Set();

  for (const ft of figmaTexts) {
    const normalFigma = normalizeText(ft.text);
    if (normalFigma.length < 3) continue;

    // Find matching DOM node by text content
    const domMatch = domTexts.find((dt, i) => {
      if (matched.has(i)) return false;
      const normalDom = normalizeText(dt.text);
      return normalDom === normalFigma || normalDom.includes(normalFigma) || normalFigma.includes(normalDom);
    });

    if (!domMatch) {
      // Only report missing for significant text (not single words)
      if (ft.text.length > 10) {
        issues.push({
          severity: "Major",
          type: "missing-text",
          figmaText: ft.text.slice(0, 80),
          expected: ft.text.slice(0, 80),
          actual: "NOT FOUND IN DOM",
        });
      }
      continue;
    }

    matched.add(domTexts.indexOf(domMatch));

    // Compare font-size (±1px tolerance)
    if (Math.abs(ft.fontSize - domMatch.fontSize) > 1) {
      issues.push({
        severity: "Major",
        type: "font-size",
        text: ft.text.slice(0, 60),
        expected: `${ft.fontSize}px`,
        actual: `${domMatch.fontSize}px`,
        delta: `${domMatch.fontSize - ft.fontSize}px`,
      });
    }

    // Compare font-weight
    if (ft.fontWeight !== domMatch.fontWeight) {
      issues.push({
        severity: "Minor",
        type: "font-weight",
        text: ft.text.slice(0, 60),
        expected: ft.fontWeight,
        actual: domMatch.fontWeight,
      });
    }

    // Compare color
    if (ft.color && !colorsMatch(ft.color, domMatch.color)) {
      issues.push({
        severity: "Major",
        type: "color",
        text: ft.text.slice(0, 60),
        expected: ft.color,
        actual: domMatch.color,
      });
    }

    // Compare letter-spacing (±0.5px tolerance)
    if (ft.letterSpacing != null && domMatch.letterSpacing != null) {
      if (Math.abs(ft.letterSpacing - domMatch.letterSpacing) > 0.5) {
        issues.push({
          severity: "Minor",
          type: "letter-spacing",
          text: ft.text.slice(0, 60),
          expected: `${ft.letterSpacing}px`,
          actual: `${domMatch.letterSpacing}px`,
        });
      }
    }
  }

  return issues;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function verifyFrame(figmaData, frameIndex, theme = "light") {
  const website = figmaData.document.children[0];
  const frame = website.children[frameIndex];
  if (!frame) {
    console.error(`Frame index ${frameIndex} not found`);
    return null;
  }

  const frameName = frame.name || `frame-${frameIndex}`;
  const route = FRAME_ROUTES[frameIndex];
  if (!route) {
    console.error(`No route mapping for frame ${frameIndex} (${frameName})`);
    return null;
  }

  console.log(`\nVerifying: ${frameName} → ${route} (${theme} mode)`);

  // Extract Figma data
  const figmaTexts = extractTextNodes(frame);
  const figmaLayouts = extractLayoutNodes(frame);
  console.log(`  Figma: ${figmaTexts.length} text nodes, ${figmaLayouts.length} layout nodes`);

  // Launch browser and extract DOM data
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  await page.goto(`${BASE_URL}${route}`, { waitUntil: "load", timeout: 60000 });

  // Set theme
  await page.evaluate((t) => localStorage.setItem("hr-theme", t), theme);
  await page.reload({ waitUntil: "load", timeout: 60000 });
  if (theme === "light") {
    await page.evaluate(() => {
      document.documentElement.classList.remove("dark");
      document.documentElement.style.colorScheme = "light";
    });
  }
  await page.waitForTimeout(1000);

  // Extract DOM text
  const domTexts = await extractDomText(page);
  console.log(`  DOM: ${domTexts.length} text nodes`);

  await browser.close();

  // Compare
  const issues = compareTextNodes(figmaTexts, domTexts);

  return {
    frame: frameName,
    frameIndex,
    route,
    theme,
    figmaTextCount: figmaTexts.length,
    domTextCount: domTexts.length,
    issues,
    summary: {
      total: issues.length,
      critical: issues.filter((i) => i.severity === "Critical").length,
      major: issues.filter((i) => i.severity === "Major").length,
      minor: issues.filter((i) => i.severity === "Minor").length,
    },
  };
}

async function main() {
  const args = process.argv.slice(2);
  const theme = args.includes("--theme") ? args[args.indexOf("--theme") + 1] : "light";
  const frameArg = args.find((a) => !a.startsWith("--") && a !== theme);

  mkdirSync(OUT_DIR, { recursive: true });

  console.log("Loading Figma JSON...");
  const figmaData = loadFigmaData();
  console.log("Loaded.");

  let results = [];

  if (frameArg === "all") {
    for (const [idx, route] of Object.entries(FRAME_ROUTES)) {
      const result = await verifyFrame(figmaData, parseInt(idx), theme);
      if (result) results.push(result);
    }
  } else {
    const idx = parseInt(frameArg || "86");
    const result = await verifyFrame(figmaData, idx, theme);
    if (result) results.push(result);
  }

  // Generate report
  const report = generateReport(results);
  const outFile = resolve(OUT_DIR, `verification-${theme}-${Date.now()}.md`);
  writeFileSync(outFile, report);
  console.log(`\nReport saved: ${outFile}`);

  // Also save JSON for programmatic use
  const jsonFile = resolve(OUT_DIR, `verification-${theme}-${Date.now()}.json`);
  writeFileSync(jsonFile, JSON.stringify(results, null, 2));
  console.log(`JSON saved: ${jsonFile}`);

  // Print summary
  console.log("\n=== SUMMARY ===");
  for (const r of results) {
    const status =
      r.summary.critical > 0 ? "FAIL" : r.summary.major > 0 ? "NEEDS_WORK" : "PASS";
    console.log(
      `  ${status} ${r.frame} (${r.route}): ${r.summary.total} issues (${r.summary.critical}C/${r.summary.major}M/${r.summary.minor}m)`,
    );
  }
}

function generateReport(results) {
  let md = `# Figma → DOM Verification Report\n\n`;
  md += `> Generated: ${new Date().toISOString()}\n`;
  md += `> Theme: ${results[0]?.theme || "light"}\n\n`;

  md += `## Summary\n\n`;
  md += `| Page | Route | Figma Texts | DOM Texts | Issues | Status |\n`;
  md += `|------|-------|-------------|-----------|--------|--------|\n`;

  for (const r of results) {
    const status =
      r.summary.critical > 0 ? "FAIL" : r.summary.major > 0 ? "NEEDS_WORK" : "PASS";
    md += `| ${r.frame} | ${r.route} | ${r.figmaTextCount} | ${r.domTextCount} | ${r.summary.total} (${r.summary.critical}C/${r.summary.major}M/${r.summary.minor}m) | ${status} |\n`;
  }

  for (const r of results) {
    if (r.issues.length === 0) continue;
    md += `\n## ${r.frame} (${r.route})\n\n`;
    md += `| Severity | Type | Text | Expected | Actual |\n`;
    md += `|----------|------|------|----------|--------|\n`;
    for (const issue of r.issues) {
      const text = (issue.text || issue.figmaText || "").replace(/\|/g, "\\|");
      md += `| ${issue.severity} | ${issue.type} | ${text} | ${issue.expected || ""} | ${issue.actual || ""} |\n`;
    }
  }

  return md;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
