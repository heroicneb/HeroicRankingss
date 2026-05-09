#!/usr/bin/env node
/**
 * Updates `siteSettings.navItems[].href`, `navItems[].children[].href`, and
 * `footerNavItems[].href` from legacy-style new-site URLs (e.g. /about-us,
 * /seo-services, /technical-seo, /insights, /case-studies) to the
 * legacy-matching paths set by the route-rename phases of
 * docs/plans/2026-05-09-legacy-url-path-match.md.
 *
 * Codex adversarial audit (task-moy7rim3-a9awng) flagged 102 pages each
 * rendering the legacy-style nav hrefs in the HTML (Check #10) — every
 * page renders the navbar + footer which read this Sanity data, so the
 * old URLs surfaced site-wide. After this script runs all rendered
 * navigation matches the legacy heroicrankings.com URL structure.
 *
 * Idempotent: if a href is already set to the new value (or any unknown
 * value), the script leaves it alone.
 *
 * Usage:
 *   node scripts/migrate/2026-05-09-update-site-settings-nav-urls.mjs            # dry run (default)
 *   node scripts/migrate/2026-05-09-update-site-settings-nav-urls.mjs --apply    # commit changes
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { getSanityClient } from "./lib/sanity-client.mjs";

const APPLY = process.argv.includes("--apply");
const SNAPSHOT_PATH = path.resolve(
  "scripts/migrate/2026-05-09-site-settings-nav-snapshot.json",
);

const URL_MAP = {
  "/about-us": "/about",
  "/seo-services": "/seo",
  "/on-page-seo": "/seo/on-page",
  "/technical-seo": "/seo/technical",
  "/local-seo": "/seo/local",
  "/ecommerce-seo": "/seo/e-commerce",
  "/content-creation": "/seo/content-creation",
  "/keyword-strategy": "/seo/keyword-research",
  "/link-building": "/seo/linkbuilding",
  "/insights": "/blog",
  "/case-studies": "/case-study",
};

function remap(href) {
  if (typeof href !== "string") return href;
  // Trim trailing slash for lookup, restore from new value (which has no slash).
  const stripped = href.replace(/\/$/, "");
  if (stripped in URL_MAP) return URL_MAP[stripped];
  return href;
}

const client = getSanityClient();
if (!client) {
  console.error(
    "No Sanity write token — set SANITY_API_WRITE_TOKEN in .env.local",
  );
  process.exit(2);
}

const live = await client.fetch(
  `*[_type=="siteSettings"][0]{
    _id,
    _rev,
    navItems[]{_key, label, href, children[]{_key, label, href}},
    footerNavItems[]{_key, label, href}
  }`,
);

if (!live?._id) {
  console.error("No siteSettings document found.");
  process.exit(1);
}

await mkdir(path.dirname(SNAPSHOT_PATH), { recursive: true });
await writeFile(SNAPSHOT_PATH, JSON.stringify(live, null, 2) + "\n");
console.log(`Snapshot: ${SNAPSHOT_PATH}`);

const changes = [];
const newNavItems = (live.navItems ?? []).map((item) => {
  const next = { ...item };
  const newHref = remap(item.href);
  if (newHref !== item.href) {
    changes.push({ path: `navItems[${item._key}].href`, from: item.href, to: newHref });
    next.href = newHref;
  }
  if (Array.isArray(item.children)) {
    next.children = item.children.map((child) => {
      const childHref = remap(child.href);
      if (childHref !== child.href) {
        changes.push({
          path: `navItems[${item._key}].children[${child._key}].href`,
          from: child.href,
          to: childHref,
        });
        return { ...child, href: childHref };
      }
      return child;
    });
  }
  return next;
});

const newFooterNavItems = (live.footerNavItems ?? []).map((item) => {
  const newHref = remap(item.href);
  if (newHref !== item.href) {
    changes.push({
      path: `footerNavItems[${item._key}].href`,
      from: item.href,
      to: newHref,
    });
    return { ...item, href: newHref };
  }
  return item;
});

console.log("\n=== plan ===");
if (changes.length === 0) {
  console.log("  no changes — already aligned");
} else {
  for (const c of changes) {
    console.log(`  ${c.path}\n    ${c.from}  →  ${c.to}`);
  }
}

if (!APPLY) {
  console.log(`\nDry run complete (${changes.length} changes). Re-run with --apply to commit.`);
  process.exit(0);
}

if (changes.length === 0) {
  console.log("\nNothing to apply.");
  process.exit(0);
}

try {
  const result = await client
    .patch(live._id)
    .ifRevisionId(live._rev)
    .set({ navItems: newNavItems, footerNavItems: newFooterNavItems })
    .commit();
  console.log(`\nCommitted patch ${result._id} rev ${result._rev} (${changes.length} hrefs updated).`);
} catch (err) {
  const msg = err instanceof Error ? err.message : String(err);
  console.error("\nCommit failed:", msg);
  console.error(`Snapshot preserved at ${SNAPSHOT_PATH} for rollback.`);
  process.exit(1);
}
