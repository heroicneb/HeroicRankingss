#!/usr/bin/env node
/**
 * Seed audit fixtures into Sanity for design parity testing.
 *
 * Creates 1 fixture per detail-page type (case study, podcast episode,
 * blog post, team member) with synthetic content that exercises every
 * field affecting layout. Document IDs are prefixed `audit-fixture-`
 * for easy cleanup.
 *
 * Usage:
 *   SANITY_AUTH_TOKEN=<editor-token> node scripts/seed-audit-fixtures.mjs
 *
 * Cleanup:
 *   npx sanity documents delete --query '*[_id match "audit-fixture-*"]'
 *
 * Token resolution mirrors scripts/seed-all-content.mjs:
 *   1. SANITY_AUTH_TOKEN  (preferred — task spec)
 *   2. SANITY_API_WRITE_TOKEN
 *   3. SANITY_API_WRITE_TOKEN inside .env.local
 *   4. ~/.config/sanity/config.json (Sanity CLI auth)
 */

import { createClient } from "@sanity/client";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// ── Config ──────────────────────────────────────────────────────────────
const PROJECT_ID = "5cr26y9m";
const DATASET = "production";
const API_VERSION = "2026-02-19";

// Stable picsum seed → reproducible 1600x900 placeholder for every image field.
const PLACEHOLDER_IMAGE_URL = "https://picsum.photos/seed/audit-fixture/1600/900";
const PLACEHOLDER_ASSET_FILENAME = "audit-fixture-placeholder.jpg";
// Deterministic asset ID — re-runs reuse the same asset, no duplicate uploads.
const PLACEHOLDER_ASSET_ID = "image-audit-fixture-placeholder";

// ── Token resolution ────────────────────────────────────────────────────
function resolveWriteToken() {
  if (process.env.SANITY_AUTH_TOKEN) return process.env.SANITY_AUTH_TOKEN;
  if (process.env.SANITY_API_WRITE_TOKEN) return process.env.SANITY_API_WRITE_TOKEN;

  try {
    const envLocal = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
    const match = envLocal.match(/SANITY_API_WRITE_TOKEN="?([^"\n]+)"?/);
    if (match) return match[1];
  } catch {
    // .env.local missing — fall through.
  }

  try {
    const configPath = resolve(process.env.HOME ?? "", ".config/sanity/config.json");
    const config = JSON.parse(readFileSync(configPath, "utf8"));
    if (config.authToken) return config.authToken;
  } catch {
    // CLI config missing — fall through.
  }

  return null;
}

const token = resolveWriteToken();

if (!token) {
  console.error(
    "\nNo Sanity write token found.\n" +
      "Set SANITY_AUTH_TOKEN (preferred) or SANITY_API_WRITE_TOKEN, or run `npx sanity login`.\n",
  );
  process.exit(1);
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: API_VERSION,
  token,
  useCdn: false,
});

// ── Helpers ─────────────────────────────────────────────────────────────

let _keyCounter = 0;
/** Stable, unique-within-run key generator. Each fixture gets its own keys. */
function k(prefix = "k") {
  _keyCounter += 1;
  return `${prefix}-${_keyCounter.toString(36)}`;
}

/**
 * Build a Portable Text block with proper shape: _type/block, _key, style,
 * markDefs, and span children. Optional spans for inline marks/links.
 *
 * @param {string|Array<{text: string, marks?: string[]}>} text
 * @param {object} [opts]
 * @param {string} [opts.style="normal"] — block style (normal, h2, h3, h4, blockquote)
 * @param {Array<{_key:string,_type:string,[k:string]:any}>} [opts.markDefs]
 */
function pt(text, opts = {}) {
  const style = opts.style ?? "normal";
  const markDefs = opts.markDefs ?? [];
  const children = Array.isArray(text)
    ? text.map((seg) => ({
        _type: "span",
        _key: k("sp"),
        text: seg.text,
        marks: seg.marks ?? [],
      }))
    : [{ _type: "span", _key: k("sp"), text, marks: [] }];

  return {
    _type: "block",
    _key: k("blk"),
    style,
    markDefs,
    children,
  };
}

/** Build an image field referencing the shared placeholder asset. */
function img(alt) {
  return {
    _type: "image",
    asset: { _type: "reference", _ref: PLACEHOLDER_ASSET_ID },
    alt,
  };
}

/**
 * Upload (or reuse) the placeholder image asset. Idempotent: if an asset with
 * PLACEHOLDER_ASSET_ID already exists, returns it without re-uploading.
 */
async function ensurePlaceholderAsset() {
  // Check if asset already exists.
  const existing = await client.getDocument(PLACEHOLDER_ASSET_ID).catch(() => null);
  if (existing) {
    console.log(`  ✓ reusing placeholder asset ${PLACEHOLDER_ASSET_ID}`);
    return PLACEHOLDER_ASSET_ID;
  }

  console.log(`  ↓ fetching ${PLACEHOLDER_IMAGE_URL}`);
  const res = await fetch(PLACEHOLDER_IMAGE_URL, { redirect: "follow" });
  if (!res.ok) {
    throw new Error(`Failed to fetch placeholder image: ${res.status} ${res.statusText}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());

  // Upload with explicit _id so re-runs are idempotent.
  // @sanity/client supports passing an `_id` option to assets.upload.
  const uploaded = await client.assets.upload("image", buf, {
    filename: PLACEHOLDER_ASSET_FILENAME,
    contentType: "image/jpeg",
    _id: PLACEHOLDER_ASSET_ID,
  });
  console.log(`  ✓ uploaded image asset ${uploaded._id}`);
  return uploaded._id;
}

async function createOrReplace(doc) {
  await client.createOrReplace(doc);
  console.log(`  ✓ created ${doc._type} ${doc._id}`);
}

// ── Fixture 1: caseStudy ────────────────────────────────────────────────
function buildCaseStudyFixture() {
  return {
    _id: "audit-fixture-case-study",
    _type: "caseStudy",
    title:
      "Audit Fixture — Long Title To Test H1 Wrapping Across Multiple Lines With Highlighted Substring",
    slug: { _type: "slug", current: "audit-fixture-case-study" },
    client: "Audit Fixture Client",
    panelLabel: "Audit Fixture",
    excerpt:
      "Synthetic case-study fixture used by the design parity audit. Every layout-affecting field is populated; arrays hit the schema-mandated lengths.",
    heroImage: img("Audit fixture hero image — synthetic placeholder"),
    cardImage: img("Audit fixture card image — synthetic placeholder"),
    metrics: [
      { _key: k("m"), label: "Organic Traffic", value: "+312%", description: "12-month growth" },
      { _key: k("m"), label: "Qualified Leads", value: "+218%", description: "Year over year" },
      { _key: k("m"), label: "Pipeline Revenue", value: "$4.2M", description: "Attributable to SEO" },
    ],
    body: [
      pt("This case study fixture exists to exercise every Portable Text rendering path."),
      pt("The body field is intentionally short — long PortableText is exercised via the conclusion field instead."),
    ],
    services: ["technical-seo", "on-page-seo", "content-creation", "link-building"],
    featured: false, // intentionally false — homepage rotation should NOT pick up the fixture
    quoteText: "Audit fixture quote text — appears in homepage rotating quote when featured=true.",
    heroSubtitle:
      "A subtitle that runs long enough to test 2-line wrapping and the gap between H1 and supporting copy.",
    heroMetrics: [
      { _key: k("hm"), value: "+312%", label: "Organic Traffic" },
      { _key: k("hm"), value: "+218%", label: "Qualified Leads" },
      { _key: k("hm"), value: "$4.2M", label: "Pipeline Revenue" },
    ],
    caseOverview: {
      // schema fields: label, headingMain, headingHighlighted, body
      // NOTE: task spec mentions "supportingImage" inside caseOverview but the
      // schema does NOT define that field. Omitted — schema is the source of truth.
      label: "/ Case Overview /",
      headingMain: "How we built durable",
      headingHighlighted: "compounding organic growth",
      body: "Six paragraphs of synthetic overview body copy. The fixture pads this string to ~600 characters so the case-overview text column wraps to roughly the same line count as a real client narrative would. Repetition is intentional. Repetition is intentional. Repetition is intentional. Repetition is intentional.",
    },
    objectiveChallenges: {
      label: "/ Objective & Challenges /",
      headingMain: "Three constraints we",
      headingHighlighted: "engineered around",
      body: "Short framing paragraph that introduces the three constraint cards below.",
      items: [
        {
          _key: k("oc"),
          number: "01",
          title: "Indexation ceiling",
          body: "Crawl budget was capped by 40k+ low-value parameter URLs draining authority from the money pages.",
        },
        {
          _key: k("oc"),
          number: "02",
          title: "Authority gap vs. incumbents",
          body: "Domain rating trailed the top-3 competitors by 18 points, blocking ranking gains on commercial terms.",
        },
        {
          _key: k("oc"),
          number: "03",
          title: "Content/intent mismatch",
          body: "Existing pages targeted high-volume head terms with informational copy that converted at 0.4%.",
        },
      ],
    },
    strategyPillars: [
      ...Array.from({ length: 6 }, (_, i) => ({
        _key: k("pillar"),
        title: `Pillar ${i + 1} — ${
          [
            "Technical foundation",
            "Information architecture",
            "Content depth",
            "Authority acquisition",
            "Conversion optimization",
            "Measurement & reporting",
          ][i]
        }`,
        intro: `Two-line intro for pillar ${i + 1}. Describes the strategic angle this pillar addresses across the engagement.`,
        bullets: [
          `Pillar ${i + 1} — sub-tactic A executed in weeks 1-4`,
          `Pillar ${i + 1} — sub-tactic B executed in weeks 5-8`,
          `Pillar ${i + 1} — sub-tactic C executed in weeks 9-12`,
          `Pillar ${i + 1} — measurement loop and validation`,
        ],
        icon: img(`Pillar ${i + 1} icon — synthetic placeholder`),
      })),
    ],
    journeyTimeline: {
      label: "/ Journey to Success /",
      headingMain: "Twelve months",
      headingHighlighted: "of compounding wins",
      items: [
        { _key: k("j"), title: "Month 0 — Discovery", body: "Audit, log analysis, and competitive teardown." },
        { _key: k("j"), title: "Month 1-3 — Foundation", body: "Crawl/indexation cleanup, template fixes, schema." },
        { _key: k("j"), title: "Month 4-6 — Velocity", body: "Content production hits cadence; first link wins land." },
        { _key: k("j"), title: "Month 7-9 — Authority", body: "Editorial placements compound; rankings climb." },
        { _key: k("j"), title: "Month 10-12 — Scale", body: "Pipeline-attributed organic revenue crosses target." },
      ],
    },
    numbersThatMatter: {
      label: "/ The Numbers That Matter /",
      headingMain: "Outcomes that moved",
      headingHighlighted: "business KPIs",
      body: "Four-stat dark-section panel. Each stat has a value, a label, an optional sub-line, and an icon.",
      items: [
        {
          _key: k("n"),
          value: "+312%",
          label: "Organic Traffic",
          sub: "vs. baseline month",
          icon: img("Traffic icon — synthetic placeholder"),
        },
        {
          _key: k("n"),
          value: "+218%",
          label: "Qualified Leads",
          sub: "MQLs from organic",
          icon: img("Leads icon — synthetic placeholder"),
        },
        {
          _key: k("n"),
          value: "$4.2M",
          label: "Pipeline Revenue",
          sub: "Attributable to SEO",
          icon: img("Revenue icon — synthetic placeholder"),
        },
        {
          _key: k("n"),
          value: "Top 3",
          label: "Commercial Keywords",
          sub: "On 47 of 60 targets",
          icon: img("Rankings icon — synthetic placeholder"),
        },
      ],
    },
    growthChart: {
      headingMain: "Growth trajectory across",
      headingHighlighted: "twelve reporting months",
      leftAxisLabel: "Sessions",
      rightAxisLabel: "Conversions",
      months: [
        "JAN25", "FEB25", "MAR25", "APR25", "MAY25", "JUN25",
        "JUL25", "AUG25", "SEP25", "OCT25", "NOV25", "DEC25",
      ],
      series: [
        {
          _key: k("ser"),
          label: "Organic Sessions",
          color: "gradient-light",
          points: [12000, 14500, 18200, 22000, 28500, 36000, 45000, 53000, 61000, 70000, 78000, 87500],
        },
        {
          _key: k("ser"),
          label: "MQL Volume",
          color: "white-trace",
          points: [180, 220, 280, 340, 420, 510, 620, 720, 820, 920, 1010, 1120],
        },
        {
          _key: k("ser"),
          label: "Branded Search",
          color: "grey-trace",
          points: [4200, 4400, 4700, 5100, 5500, 6100, 6800, 7400, 8100, 8800, 9400, 10200],
        },
      ],
      tooltipMonth: "DEC25",
      tooltipMetrics: [
        { _key: k("tt"), label: "Sessions", value: "87.5k" },
        { _key: k("tt"), label: "MQLs", value: "1,120" },
        { _key: k("tt"), label: "Pipeline", value: "$4.2M" },
      ],
    },
    proofData: {
      label: "/ The Proof Is in the Data /",
      headingMain: "Analytics screenshots",
      headingHighlighted: "you can verify",
      body: "Mixed-width grid of analytics cards. Some are full-width (charts), some standard (single-stat).",
      items: [
        {
          _key: k("p"),
          title: "GSC clicks — 12-month line chart",
          body: "Full-width Google Search Console screenshot showing sustained click growth from launch to month 12.",
          image: img("GSC clicks chart — synthetic placeholder"),
          metricTags: [
            { _key: k("mt"), label: "Clicks", value: "+312%", isAccent: true },
            { _key: k("mt"), label: "Impressions", value: "+187%", isAccent: false },
            { _key: k("mt"), label: "CTR", value: "4.8%", isAccent: false },
          ],
          isFullWidth: true,
        },
        {
          _key: k("p"),
          title: "GA4 — Conversion uplift",
          body: "Standard-width tile. Conversion-rate tile from GA4, day-over-day comparison.",
          image: img("GA4 conversion screenshot — synthetic placeholder"),
          metricTags: [
            { _key: k("mt"), label: "CVR", value: "3.4%", isAccent: true },
            { _key: k("mt"), label: "Δ", value: "+1.8pp", isAccent: false },
          ],
          isFullWidth: false,
        },
        {
          _key: k("p"),
          title: "Ahrefs — Domain Rating progression",
          body: "Standard-width tile. DR climb visualized across the 12-month engagement.",
          image: img("Ahrefs DR chart — synthetic placeholder"),
          metricTags: [
            { _key: k("mt"), label: "DR", value: "62", isAccent: true },
            { _key: k("mt"), label: "Δ", value: "+18", isAccent: false },
          ],
          isFullWidth: false,
        },
        {
          _key: k("p"),
          title: "Server logs — crawl efficiency",
          body: "Full-width log-file analysis chart showing crawl budget redirected from low-value to revenue pages.",
          image: img("Server log analysis — synthetic placeholder"),
          metricTags: [
            { _key: k("mt"), label: "Crawl waste", value: "-71%", isAccent: true },
            { _key: k("mt"), label: "Money pages crawled", value: "+340%", isAccent: false },
          ],
          isFullWidth: true,
        },
      ],
    },
    beforeAfter: {
      label: "/ Before vs After /",
      headingMain: "Five paired stats",
      headingHighlighted: "from baseline to today",
      body: "Schema requires exactly 5 items in the comparison grid.",
      items: [
        { _key: k("ba"), label: "Organic Sessions / mo", before: "12,000", after: "87,500" },
        { _key: k("ba"), label: "Top-3 Rankings", before: "8 keywords", after: "47 keywords" },
        { _key: k("ba"), label: "Domain Rating", before: "44", after: "62" },
        { _key: k("ba"), label: "Conversion Rate", before: "1.6%", after: "3.4%" },
        { _key: k("ba"), label: "MQLs / mo", before: "180", after: "1,120" },
      ],
    },
    conclusion: {
      heading: "What this engagement proves",
      gradientSubhead:
        "A two-line gradient subheading testing the wrap behaviour and the visual relationship to the conclusion body.",
      body: [
        pt(
          "Paragraph one of the conclusion. Establishes that the program delivered against the original objective and explicitly references the three constraints framed at the top of the page.",
        ),
        pt(
          "Paragraph two of the conclusion. Discusses the durability of the gains — content compounding, link velocity sustained, and technical health stable across the final three reporting months.",
        ),
        pt(
          "Paragraph three of the conclusion. Closes with the expected continuation pattern and the next-quarter expansion roadmap. Ends with a forward-looking sentence designed to set up the per-case-study CTA panel.",
        ),
      ],
    },
    ctaFooter: {
      label: "/ Per-Case-Study CTA /",
      headingMain: "Ready to compound",
      headingHighlighted: "your own organic growth",
      body: "Override of the global FooterCtaVariant — confirms per-case-study CTA path renders correctly.",
      primaryCta: { label: "Start a Strategy Call", url: "/contact" },
      secondaryCta: { label: "See More Case Studies", url: "/case-studies" },
    },
    publishedAt: new Date().toISOString(),
    seo: {
      _type: "seo",
      metaTitle: "Audit Fixture Case Study | Heroic Rankings",
      metaDescription:
        "Synthetic audit fixture for design parity testing. Should not be indexed in production.",
    },
  };
}

// ── Fixture 2: podcastEpisode ───────────────────────────────────────────
function buildPodcastEpisodeFixture() {
  const title =
    "Audit Fixture — Building Marketing Programs That Actually Work In 2026";
  const titleHighlighted = "That Actually Work"; // must be substring of title

  return {
    _id: "audit-fixture-podcast-episode",
    _type: "podcastEpisode",
    title,
    titleHighlighted,
    slug: { _type: "slug", current: "audit-fixture-podcast-episode" },
    episodeNumber: 99, // chosen to not collide with real episodes (0-98 range)
    duration: "42 min",
    guest: {
      name: "Audit Fixture Guest",
      role: "Founder, Audit Fixture Co.",
      company: "Audit Fixture Co.",
      photo: img("Audit fixture guest portrait — synthetic placeholder"),
      bio: "Three-line synthetic guest bio used to verify the guest panel renders at full height with all metadata fields populated.",
      linkedinUrl: "https://www.linkedin.com/in/audit-fixture-guest",
      twitterUrl: "https://x.com/auditfixture",
      websiteUrl: "https://example.com/audit-fixture-guest",
    },
    description:
      "Audit fixture description. Four-line synthetic copy that exercises the description block above the video embed, validates wrap behaviour, and ensures spacing tokens match Figma at every breakpoint.",
    heroImage: img("Audit fixture episode hero — synthetic placeholder"),
    videoEmbedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    keyInsights: {
      headingMain: "Five lessons from",
      headingHighlighted: "this conversation",
      body: "Synthetic body copy introducing the topic pills and bullet list. Two sentences.",
      topicPills: [
        "Demand Generation",
        "Brand Building",
        "PLG vs Sales-Led",
        "Founder Marketing",
        "Attribution",
      ],
      bullets: [
        "Synthetic insight 1 — covers the framing of demand generation vs lead generation as distinct disciplines.",
        "Synthetic insight 2 — argues that brand investment compounds where performance spend cannot.",
        "Synthetic insight 3 — examines when PLG falls apart and where founder-led sales reasserts.",
        "Synthetic insight 4 — defines the cadence at which founder-driven content becomes a moat.",
        "Synthetic insight 5 — outlines the attribution model that holds up under board scrutiny.",
        "Synthetic insight 6 — closes with the operating principle that ties the previous five together.",
      ],
    },
    bestMoments: Array.from({ length: 6 }, (_, i) => ({
      _key: k("reel"),
      _type: "reel",
      title: `Best Moment ${i + 1} — ${
        [
          "Why founder content compounds",
          "The death of channel-only attribution",
          "Brand as a hiring multiplier",
          "When PLG stops scaling",
          "The 90-day demand-gen reset",
          "What VCs misread about marketing",
        ][i]
      }`,
      thumbnail: img(`Best moment ${i + 1} thumbnail — synthetic placeholder`),
      videoUrl: `https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=${(i + 1) * 600}s`,
      caption: `Two-line caption for clip ${i + 1}. Includes the timestamp ${
        Math.floor((i + 1) * 10)
      }:00 and a one-sentence hook describing the moment's significance.`,
    })),
    transcript: [
      pt("Host: Welcome to the show. Today we're talking with our audit fixture guest about building marketing programs that compound.", { style: "normal" }),
      pt("Guest: Thanks for having me. I want to start with a controversial premise.", { style: "normal" }),
      pt(
        [
          { text: "Guest: ", marks: [] },
          { text: "Most marketing programs are built backwards", marks: ["strong"] },
          { text: ". They start with channels, then optimize toward attribution, and end up optimizing toward what is measurable rather than what produces compounding return.", marks: [] },
        ],
      ),
      pt("Host: Walk us through what 'built backwards' means in concrete terms.", { style: "normal" }),
      pt("Guest: When you start with channel selection — Google Ads, LinkedIn, SEO, content — you've already lost. You're picking instruments before you know what you're playing.", { style: "normal" }),
      pt("Host: So where should it start?", { style: "normal" }),
      pt("Guest: With the question: what kind of demand are we trying to create or capture, and what is the durability profile of that demand once we stop spending on it?", { style: "normal" }),
      pt("Host: That's a brand investment framing.", { style: "normal" }),
      pt("Guest: It is. And the reason most teams flinch from it is because they're held to attribution windows that punish brand work and reward last-click capture.", { style: "normal" }),
      pt("Host: Final question — if a founder is starting today, what's the first thing they invest in?", { style: "normal" }),
      pt("Guest: Founder-driven content. Compounds for years. No paid channel matches the half-life. Thanks for the conversation.", { style: "normal" }),
    ],
    relatedEpisodes: [], // empty by design — single-document audit, no peer fixtures needed
    publishedAt: new Date().toISOString(),
    seo: {
      _type: "seo",
      metaTitle: "Audit Fixture Episode 99 | Heroic Rankings Podcast",
      metaDescription:
        "Synthetic audit fixture for design parity testing. Should not be indexed in production.",
    },
  };
}

// ── Fixture 3: post (insights blog) ─────────────────────────────────────
function buildPostFixture(authorRefId) {
  return {
    _id: "audit-fixture-blog-post",
    _type: "post",
    title: "Audit Fixture — How To Build A Compounding SEO Program In 2026",
    slug: { _type: "slug", current: "audit-fixture-blog-post" },
    excerpt:
      "Synthetic audit-fixture excerpt covering wrap behaviour and excerpt-region styling on the insights detail page.",
    mainImage: img("Audit fixture blog hero — synthetic placeholder"),
    body: [
      // Intro
      pt(
        "This audit fixture exercises every Portable Text rendering path used on the insights detail page: H2 headings (drive table-of-contents), H3 sub-headings, normal paragraphs, lists, inline strong, and inline links.",
      ),
      // H2 #1 — TOC entry
      pt("Why compounding SEO beats channel arbitrage", { style: "h2" }),
      pt(
        "Paragraph under H2 #1. Establishes that organic search compounds where paid channels do not, and frames the rest of the post around the consequences of that asymmetry.",
      ),
      // H3 under H2 #1
      pt("The channel-arbitrage trap", { style: "h3" }),
      pt(
        [
          { text: "When a team is judged on ", marks: [] },
          { text: "last-click attribution", marks: ["strong"] },
          { text: ", they will optimize toward the channels that show up cleanly in the report — and walk past the channels that compound silently in the background.", marks: [] },
        ],
      ),
      // H2 #2 — TOC entry
      pt("The three foundations of a compounding program", { style: "h2" }),
      pt("Paragraph under H2 #2. Introduces the bullet list of foundations."),
      // Bulleted list — schema portableText doesn't define list-specific styles
      // beyond the standard block list flag. Use listItem: "bullet" on each block.
      {
        _type: "block",
        _key: k("blk"),
        style: "normal",
        listItem: "bullet",
        level: 1,
        markDefs: [],
        children: [{ _type: "span", _key: k("sp"), text: "Technical foundation — crawl, index, render, perform.", marks: [] }],
      },
      {
        _type: "block",
        _key: k("blk"),
        style: "normal",
        listItem: "bullet",
        level: 1,
        markDefs: [],
        children: [{ _type: "span", _key: k("sp"), text: "Information architecture — topical authority via clusters.", marks: [] }],
      },
      {
        _type: "block",
        _key: k("blk"),
        style: "normal",
        listItem: "bullet",
        level: 1,
        markDefs: [],
        children: [{ _type: "span", _key: k("sp"), text: "Authority acquisition — editorial links from relevant domains.", marks: [] }],
      },
      // H3 under H2 #2
      pt("Why these three sit on top of all tactics", { style: "h3" }),
      // Inline link example
      (() => {
        const linkKey = k("link");
        return {
          _type: "block",
          _key: k("blk"),
          style: "normal",
          markDefs: [
            { _type: "link", _key: linkKey, href: "https://www.heroicrankings.com/case-studies", openInNewTab: false },
          ],
          children: [
            { _type: "span", _key: k("sp"), text: "Concrete examples of these foundations in production are documented in our ", marks: [] },
            { _type: "span", _key: k("sp"), text: "case studies", marks: [linkKey] },
            { _type: "span", _key: k("sp"), text: ", where each engagement maps to a specific permutation of the three.", marks: [] },
          ],
        };
      })(),
      // H2 #3 — TOC entry
      pt("How to start this week", { style: "h2" }),
      pt(
        "Closing paragraph. Synthetic action-oriented copy that wraps to roughly the same length as the average closing paragraph on a real Heroic insight, validating the bottom-of-article spacing and CTA region.",
      ),
    ],
    // post.author is a reference to teamMember. The teamMember fixture is created
    // in the same run BEFORE the post, so this _ref always resolves.
    author: { _type: "reference", _ref: authorRefId },
    categories: ["seo"], // schema enum is lowercase; task said ["SEO"] — using schema value
    publishedAt: new Date().toISOString(),
    seo: {
      _type: "seo",
      metaTitle: "Audit Fixture Blog Post | Heroic Rankings Insights",
      metaDescription:
        "Synthetic audit fixture for design parity testing. Should not be indexed in production.",
    },
  };
}

// ── Fixture 4: teamMember ───────────────────────────────────────────────
function buildTeamMemberFixture() {
  return {
    _id: "audit-fixture-team-member",
    _type: "teamMember",
    name: "Audit Fixture Member",
    slug: { _type: "slug", current: "audit-fixture-team-member" },
    role: "/ Audit Fixture Role /",
    department: "leadership",
    photo: img("Audit fixture team member headshot — synthetic placeholder"),
    cardImage: img("Audit fixture team member popup card — synthetic placeholder"),
    bio: "Short single-paragraph bio used in the team grid and author byline. Synthetic and used purely to verify the byline text-overflow tokens at narrow widths.",
    bioParagraphs: [
      "Extended popup paragraph one. Synthetic copy that runs ~280 characters to validate the popup card's typographic block and confirm the line-height tokens match the Figma spec at desktop and mobile breakpoints alike.",
      "Extended popup paragraph two. Closes the popup with a forward-looking sentence and verifies the spacing between the two paragraphs in the modal layout.",
    ],
    contact: {
      email: "audit-fixture-member@example.com",
      phone: "+1 555 010 0099",
    },
    // The task spec says "linkedin url" — schema's `linkedin` field is hidden/legacy.
    // The active path is `socialLinks` with platform: "linkedin". Populating both
    // the modern array (used by the rendered page) — the legacy `linkedin` field
    // is intentionally omitted because it's hidden in Studio.
    socialLinks: [
      {
        _key: k("sl"),
        _type: "socialLink",
        platform: "linkedin",
        url: "https://www.linkedin.com/in/audit-fixture-member",
      },
      {
        _key: k("sl"),
        _type: "socialLink",
        platform: "twitter",
        url: "https://x.com/audit_fixture_member",
      },
    ],
    showOnAboutPage: false, // false on purpose — fixture should NOT appear on /about-us
    order: 9999, // sentinel order — sorts last in any orderRank query (task spec called it `orderRank`; schema field is `order`)
  };
}

// ── Main ────────────────────────────────────────────────────────────────
async function main() {
  console.log(`\n${"=".repeat(64)}`);
  console.log(`  Heroic Rankings — Sanity Audit Fixtures`);
  console.log(`  Project: ${PROJECT_ID} / Dataset: ${DATASET}`);
  console.log(`${"=".repeat(64)}\n`);

  console.log("[1/2] Image asset");
  await ensurePlaceholderAsset();
  console.log();

  console.log("[2/2] Fixture documents");
  // Order: teamMember first (post.author references it), then everything else.
  const teamMember = buildTeamMemberFixture();
  await createOrReplace(teamMember);

  const caseStudy = buildCaseStudyFixture();
  await createOrReplace(caseStudy);

  const podcastEpisode = buildPodcastEpisodeFixture();
  await createOrReplace(podcastEpisode);

  const post = buildPostFixture(teamMember._id);
  await createOrReplace(post);
  console.log();

  console.log(`${"=".repeat(64)}`);
  console.log(`  4 fixtures seeded. Cleanup: npx sanity documents delete --query '*[_id match "audit-fixture-*"]'`);
  console.log(`${"=".repeat(64)}\n`);
}

main().catch((err) => {
  console.error("\nFatal error seeding audit fixtures:");
  console.error(err);
  process.exit(1);
});
