#!/usr/bin/env node
/**
 * Screenshot audit tool — captures full-page screenshots for Figma comparison.
 *
 * Usage:
 *   node scripts/screenshot-audit.mjs <route> <width> <theme>
 *
 * Examples:
 *   node scripts/screenshot-audit.mjs / 1440 light
 *   node scripts/screenshot-audit.mjs /about-us 1440 dark
 *   node scripts/screenshot-audit.mjs /contact 375 light
 */

import { chromium } from "@playwright/test";
import { mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(__dirname, "../docs/audit/screenshots");

const [, , route = "/", width = "1440", theme = "light"] = process.argv;
const viewportWidth = parseInt(width, 10);
const baseUrl = process.env.BASE_URL || "http://localhost:3002";

const slug = route === "/" ? "index" : route.replace(/^\//, "").replace(/\//g, "-");
const filename = `${slug}-${viewportWidth}-${theme}.png`;
const outPath = resolve(OUT_DIR, filename);

mkdirSync(OUT_DIR, { recursive: true });

async function run() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: viewportWidth, height: 900 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  await page.goto(`${baseUrl}${route}`, { waitUntil: "load", timeout: 60000 });

  // Force theme via localStorage (next-themes reads this on mount)
  await page.evaluate((t) => {
    localStorage.setItem("hr-theme", t);
  }, theme);
  await page.reload({ waitUntil: "load", timeout: 60000 });

  // Ensure correct class is applied
  if (theme === "light") {
    await page.evaluate(() => {
      document.documentElement.classList.remove("dark");
      document.documentElement.style.colorScheme = "light";
    });
  } else {
    await page.evaluate(() => {
      document.documentElement.classList.add("dark");
      document.documentElement.style.colorScheme = "dark";
    });
  }

  // Let animations settle
  await page.waitForTimeout(1500);

  await page.screenshot({ path: outPath, fullPage: true });
  console.log(`Saved: ${outPath}`);

  await browser.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
