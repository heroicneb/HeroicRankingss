/**
 * BCMS template _id → name mapping (seeded from spike).
 *
 * Source of truth: scripts/bcms-spike-report.json (when populated) and
 * scripts/bcms-parity-check.mjs (TEMPLATE_IDS constant). Listed explicitly
 * here so the migration suite can resolve template ids without depending on
 * `template/all` succeeding for this API key scope.
 */

export const BCMS_TEMPLATE_IDS = {
  "case-study": "671a222fb98a24129383bd5a",
  blog: "6718e04bef5de485dc93f929",
  person: "6718e069ef5de485dc93f92a",
  service: "671a5d7be93230ec1d3de24d",
  testimonial: "67ba9bb84e9c0f4cf5ab35bf", // from BCMS data; verified at preflight
  "blog-category": "6718e5f0ef5de485dc93f93f",
  certificate: "67c9f2c9c1a1f1e8b6c45c7d", // verified at preflight
  company: "6718e1aaef5de485dc93f937", // verified at preflight
};

/**
 * Mapping from BCMS template name → Sanity document _type.
 * `null` means: do NOT migrate this template as a Sanity document
 * (used as lookup-only or deferred per Codex).
 */
export const BCMS_TO_SANITY_TYPE = {
  "case-study": "caseStudy",
  blog: "post",
  person: "teamMember",
  service: "servicePage",
  testimonial: "testimonial",
  "blog-category": null, // lookup-only, see codex plan
  certificate: null, // deferred — no Sanity consumer
  company: null, // deferred — no Sanity consumer
};

/**
 * Sanity types in dependency order (per Codex sequencing).
 * Asset registry warmup runs separately before this list.
 */
export const MIGRATION_ORDER = [
  "teamMember",
  "testimonial",
  "servicePage", // first pass (no relatedCaseStudies)
  "caseStudy",
  // patch servicePage with relatedCaseStudies happens after caseStudy
  "post", // last (body-heavy)
];

/**
 * Reverse lookup: BCMS template name from id.
 */
export function templateNameFromId(id) {
  for (const [name, tid] of Object.entries(BCMS_TEMPLATE_IDS)) {
    if (tid === id) return name;
  }
  return null;
}

/**
 * Deterministic Sanity _id derivation: `migrate-<sanityType>-<bcmsId>`.
 * Per Codex: NO dots — Sanity treats dotted ids as private subpaths.
 */
export function deriveSanityId(sanityType, bcmsId) {
  if (!sanityType || !bcmsId) {
    throw new Error(`deriveSanityId requires both sanityType and bcmsId (got ${sanityType}, ${bcmsId}).`);
  }
  if (bcmsId.includes(".")) {
    throw new Error(`bcmsId must not contain dots: ${bcmsId}`);
  }
  return `migrate-${sanityType}-${bcmsId}`;
}
