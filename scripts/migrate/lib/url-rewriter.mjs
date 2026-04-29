/**
 * URL rewriter — thin wrapper over the static maps in config/url-map.mjs.
 *
 * Per Codex: rewrite internal anchors during body conversion AND verify
 * zero legacy URLs remain at validation time. The rewriter normalizes
 * site-internal links to the final IA in one hop.
 */

import { rewriteUrl as _rewrite } from "../config/url-map.mjs";

export function rewriteUrl(href) {
  return _rewrite(href);
}

/**
 * Detect whether an href still points at a legacy IA path. Used by the
 * validation harness as the "zero legacy URLs" gate.
 */
export function isLegacyUrl(href) {
  if (typeof href !== "string") return false;
  return _rewrite(href) !== href;
}
