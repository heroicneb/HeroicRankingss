/**
 * BCMS blog-category — LOOKUP ONLY (per Codex).
 *
 * The current Sanity post model uses string enums for categories, not
 * reference documents. This module exposes a `lookup()` function that
 * resolves a BCMS category entry pointer to the Sanity enum value, but
 * does NOT emit a Sanity document.
 */

import { resolveCategory } from "../config/category-map.mjs";

export const TEMPLATE = "blog-category";
export const SANITY_TYPE = null;

export function lookup(bcmsCategoryRef) {
  return resolveCategory(bcmsCategoryRef);
}

export const META = {
  template: TEMPLATE,
  sanityType: SANITY_TYPE,
  ownedPaths: [],
};
