/**
 * Legacy URL → final Sanity URL composer.
 *
 * Per Codex: composed (one-hop, no chains). Includes:
 * - 11 BCMS internal redirects (composed to one hop)
 * - /seo/ namespace
 * - /blog → /insights
 * - /case-study → /case-studies
 * - /about → /about-us, /about/<slug> → /team/<slug>
 * - /partnership, /contact, /privacy-policy
 *
 * Used during body conversion (rewrite anchors) AND during validation
 * (verify zero legacy URLs remain).
 */

import { SERVICE_MAP } from "./service-map.mjs";

/** Static page redirects — exact match. */
const STATIC_PAGES = {
  "/blog/": "/insights",
  "/blog": "/insights",
  "/case-study/": "/case-studies",
  "/case-study": "/case-studies",
  "/about/": "/about-us",
  "/about": "/about-us",
  "/partnership/": "/partnership",
  "/partnership": "/partnership",
  "/contact/": "/contact",
  "/contact": "/contact",
  "/privacy-policy/": "/privacy-policy",
  "/privacy-policy": "/privacy-policy",
  "/seo/": "/seo-services",
  "/seo": "/seo-services",
};

/** Service category exact-match redirects (must come before /seo/<cat>/<slug>/). */
const SERVICE_CATEGORY_PAGES = {
  "/seo/technical/": "/technical-seo",
  "/seo/technical": "/technical-seo",
  "/seo/on-page/": "/on-page-seo",
  "/seo/on-page": "/on-page-seo",
  "/seo/local/": "/local-seo",
  "/seo/local": "/local-seo",
  "/seo/keyword-research/": "/keyword-strategy",
  "/seo/keyword-research": "/keyword-strategy",
  "/seo/content-creation/": "/content-creation",
  "/seo/content-creation": "/content-creation",
  "/seo/linkbuilding/": "/link-building",
  "/seo/linkbuilding": "/link-building",
  "/seo/e-commerce/": "/ecommerce-seo",
  "/seo/e-commerce": "/ecommerce-seo",
  "/seo/managed/": "/insights",
  "/seo/managed": "/insights",
};

/** Case study slug aliases (one renamed). */
const CASE_STUDY_ALIASES = {
  "number-artist": "diy-craft-ecom-brand",
};

/**
 * BCMS internal one-hop redirects (composed). Each entry is the final
 * destination — no chain follow needed.
 */
const BCMS_INTERNAL_REDIRECTS = {
  "/backlinks-management/": "/insights/backlinks-management",
  "/how-to-create-a-link-building-strategy/":
    "/insights/how-to-create-a-link-building-strategy",
  "/benefits-of-link-building/": "/insights/benefits-of-link-building",
  "/lets-discuss-google-search-updates/":
    "/insights/lets-discuss-google-search-updates",
  "/marketing/": "/seo-services",
  "/marketing/first-step-in-marketing-research-process/":
    "/insights/first-step-in-marketing-research-process",
  "/web-design-development/": "/",
  "/marketing/ppc/seo-vs-google-ads/": "/insights/seo-vs-google-ads",
  "/process-that-affects-visibility-of-website/":
    "/insights/process-that-affects-visibility-of-website",
  "/seo/how-to-grow-your-business-online/":
    "/insights/how-to-grow-your-business-online",
  "/seo/ranking-factors-seo/": "/insights/ranking-factors-seo",
};

const SITE_HOSTNAMES = new Set([
  "heroicrankings.com",
  "www.heroicrankings.com",
]);

function normalizeRelative(pathname) {
  // strip duplicate slashes; preserve trailing slash
  return pathname.replace(/\/{2,}/g, "/");
}

/**
 * Match a relative pathname against parameterized rules.
 * Returns the rewritten pathname, or null if no rule matched.
 */
function matchParameterized(pathname) {
  // /case-study/<slug>/  (incl. legacy alias)
  let m = pathname.match(/^\/case-study\/([^\/]+)\/?$/);
  if (m) {
    const slug = CASE_STUDY_ALIASES[m[1]] ?? m[1];
    return `/case-studies/${slug}`;
  }
  // /about/<slug>/ → /team/<slug>
  m = pathname.match(/^\/about\/([^\/]+)\/?$/);
  if (m) return `/team/${m[1]}`;

  // /seo/<service>/  → service page (only if known service)
  m = pathname.match(/^\/seo\/([^\/]+)\/?$/);
  if (m && SERVICE_MAP[m[1]]) {
    return `/${SERVICE_MAP[m[1]]}`;
  }

  // /seo/<category>/<slug>/ → /insights/<slug>
  m = pathname.match(/^\/seo\/([^\/]+)\/([^\/]+)\/?$/);
  if (m) return `/insights/${m[2]}`;

  // /blog/<slug>/ → /insights/<slug>
  m = pathname.match(/^\/blog\/([^\/]+)\/?$/);
  if (m) return `/insights/${m[1]}`;

  return null;
}

/**
 * Rewrite a single href (legacy → final). Returns the input unchanged
 * if no rule applies. External hosts (not the site) and mailto/tel/anchors
 * pass through unchanged.
 */
export function rewriteUrl(href) {
  if (typeof href !== "string" || href.length === 0) return href;
  // Pass through anchors, mailto, tel, javascript, data
  if (/^(mailto:|tel:|javascript:|data:|#)/i.test(href)) return href;

  // Absolute URL: rewrite only if it points at the site itself.
  let pathname;
  let qs = "";
  let frag = "";
  if (/^https?:\/\//i.test(href)) {
    let url;
    try {
      url = new URL(href);
    } catch {
      return href;
    }
    if (!SITE_HOSTNAMES.has(url.hostname)) return href; // external — leave alone
    pathname = url.pathname;
    qs = url.search;
    frag = url.hash;
  } else if (href.startsWith("/")) {
    const split = splitRelative(href);
    pathname = split.pathname;
    qs = split.qs;
    frag = split.frag;
  } else {
    // Relative without leading slash — leave alone (rare in BCMS body)
    return href;
  }

  pathname = normalizeRelative(pathname);

  let rewritten =
    BCMS_INTERNAL_REDIRECTS[pathname] ??
    SERVICE_CATEGORY_PAGES[pathname] ??
    STATIC_PAGES[pathname] ??
    null;

  if (!rewritten) {
    rewritten = matchParameterized(pathname);
  }

  const finalPath = rewritten ?? pathname;
  return `${finalPath}${qs}${frag}`;
}

function splitRelative(rel) {
  let pathname = rel;
  let qs = "";
  let frag = "";
  const hashIdx = rel.indexOf("#");
  if (hashIdx !== -1) {
    frag = rel.slice(hashIdx);
    pathname = rel.slice(0, hashIdx);
  }
  const qIdx = pathname.indexOf("?");
  if (qIdx !== -1) {
    qs = pathname.slice(qIdx);
    pathname = pathname.slice(0, qIdx);
  }
  return { pathname, qs, frag };
}

/**
 * Compute the canonical legacy URL for a given BCMS template + slug.
 * Used as `migrationSource.legacyUrl`.
 */
export function legacyUrlFor(template, slug, opts = {}) {
  const origin = opts.origin ?? "https://heroicrankings.com";
  if (!slug) return null;
  switch (template) {
    case "case-study":
      return `${origin}/case-study/${slug}/`;
    case "blog":
      return `${origin}/blog/${slug}/`;
    case "person":
      return `${origin}/about/${slug}/`;
    case "service":
      return `${origin}/seo/${slug}/`;
    case "testimonial":
    case "blog-category":
    case "certificate":
    case "company":
      return null;
    default:
      return null;
  }
}

/** Exposed for tests/preflight diagnostics. */
export const URL_MAP_RULES = {
  STATIC_PAGES,
  SERVICE_CATEGORY_PAGES,
  CASE_STUDY_ALIASES,
  BCMS_INTERNAL_REDIRECTS,
};
