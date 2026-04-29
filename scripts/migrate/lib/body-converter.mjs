/**
 * BCMS body nodes → Sanity PortableText converter.
 *
 * BCMS node shape (parsed): { type, value, attrs?, widgetName? }
 *   - paragraph:   value = HTML string ("<p>...</p>")
 *   - heading:     value = HTML string with <h1>..<h6>; attrs.level may be set
 *   - bulletList:  value = HTML string "<ul>...</ul>"
 *   - orderedList: value = HTML string "<ol>...</ol>"; attrs.start optional
 *   - widget:      value = object; widgetName ∈ {image, table, cta2, video}
 *
 * Widget handling (per inventory: 335 image / 18 table / 3 cta2 / 1 video):
 *   - image  → PortableText image block (re-host via asset registry)
 *   - table  → custom `table` PT block { header: string[], rows: [{cols: string[]}] }
 *   - cta2   → custom `ctaBlock` { description: plain text, label, href }
 *   - video  → custom `videoEmbed` { url, caption? }
 *
 * Schema is extended in src/sanity/schemaTypes/objects/portableText.ts to
 * accept these block types directly.
 *
 * Other unsupported types (table from non-widget, codeBlock, custom widgets
 * not listed) MUST THROW per Codex's "fail loud" rule.
 *
 * Output: array of Sanity PortableText blocks, with deterministic
 * _key = `<entryId>-body-<index>` for top-level blocks.
 */

import { htmlToBlocks } from "@portabletext/block-tools";
import { compileSchema } from "@portabletext/schema";
import { JSDOM } from "jsdom";
import { rewriteUrl } from "./url-rewriter.mjs";

const KNOWN_NODE_TYPES = new Set([
  "paragraph",
  "heading",
  "bulletList",
  "orderedList",
  "widget",
  "text", // bare text seen rarely in some BCMS variants
]);

const SUPPORTED_WIDGET_NAMES = new Set(["image", "table", "cta2", "video"]);

// Compiled schema for htmlToBlocks. Mirrors src/sanity/schemaTypes/objects/portableText.ts:
// styles {normal,h2,h3,h4,blockquote}, lists {bullet,number}, decorators
// {strong,em,code}, annotation `link` {href, openInNewTab}.
const BLOCK_SCHEMA = compileSchema({
  decorators: [{ name: "strong" }, { name: "em" }, { name: "code" }],
  annotations: [
    {
      name: "link",
      fields: [
        { name: "href", type: "string" },
        { name: "openInNewTab", type: "boolean" },
      ],
    },
  ],
  styles: [
    { name: "normal" },
    { name: "h2" },
    { name: "h3" },
    { name: "h4" },
    { name: "blockquote" },
  ],
  lists: [{ name: "bullet" }, { name: "number" }],
  inlineObjects: [],
  blockObjects: [],
});

/**
 * Convert a BCMS rich-text value (`{ nodes: [...] }`) to a normalized
 * plain-text string. Used for case-study fields whose Sanity target is
 * `text`, not portable text. Preserves paragraph breaks; strips tags and
 * decodes entities.
 */
export function richTextToPlainText(richText) {
  if (!richText) return "";
  const nodes = Array.isArray(richText)
    ? richText
    : Array.isArray(richText.nodes)
      ? richText.nodes
      : [];
  if (nodes.length === 0) return "";
  const parts = [];
  for (const node of nodes) {
    if (typeof node !== "object" || !node) continue;
    const { type, value } = node;
    if (typeof value === "string") {
      parts.push(htmlToText(value).trim());
    } else if (type === "widget") {
      // ignore widget objects in plain-text reduction
      continue;
    } else if (Array.isArray(value)) {
      parts.push(richTextToPlainText({ nodes: value }).trim());
    }
  }
  return parts.filter(Boolean).join("\n\n");
}

/**
 * Convert a BCMS rich-text value to PortableText.
 *
 * `ctx` provides:
 *   - assetRegistry: { ensureAsset, imageFieldFor }
 *   - entryId: string used in deterministic _key prefix
 *   - entrySlug?: string used in error messages for clearer diagnostics
 *   - logger?: from logger.mjs
 *
 * Returns Promise<PortableText[]>.
 */
export async function convertBody(richText, ctx) {
  if (!ctx) throw new Error("convertBody: ctx required");
  const { assetRegistry, entryId, entrySlug, logger } = ctx;
  if (!entryId) throw new Error("convertBody: ctx.entryId required");

  const nodes = Array.isArray(richText)
    ? richText
    : Array.isArray(richText?.nodes)
      ? richText.nodes
      : [];

  if (!Array.isArray(nodes) || nodes.length === 0) return [];

  const idLabel = entrySlug ? `${entrySlug} (${entryId})` : entryId;

  // Pre-validate every node type up-front. Fail loud per Codex.
  for (const node of nodes) {
    if (!node || typeof node !== "object") continue;
    const t = node.type;
    if (!KNOWN_NODE_TYPES.has(t)) {
      throw new Error(
        `Unsupported BCMS body node type "${t}" in entry ${idLabel}. Add a handler or extend the schema.`,
      );
    }
    if (t === "widget") {
      const wn = node.widgetName;
      if (!SUPPORTED_WIDGET_NAMES.has(wn)) {
        throw new Error(
          `Unsupported BCMS widget "${wn}" in entry ${idLabel}. Supported: ${[...SUPPORTED_WIDGET_NAMES].join(", ")}.`,
        );
      }
    }
  }

  const out = [];
  let blockIdx = 0;

  function nextKey() {
    const k = `${entryId}-body-${blockIdx++}`;
    return k;
  }

  for (const node of nodes) {
    const t = node.type;

    if (t === "widget") {
      const block = await widgetToBlock(node, {
        assetRegistry,
        logger,
        nextKey,
        entryLabel: idLabel,
      });
      if (block) out.push(block);
      continue;
    }

    // Text-bearing node: BCMS gives an HTML string in `value`.
    let html = typeof node.value === "string" ? node.value : "";

    if (t === "heading" && html && !/^<h[1-6]/i.test(html.trim())) {
      const lvl = Number(node.attrs?.level) || 2;
      html = `<h${lvl}>${html}</h${lvl}>`;
    }
    if (t === "paragraph" && html && !/^<p[\s>]/i.test(html.trim())) {
      html = `<p>${html}</p>`;
    }

    if (!html.trim()) continue;

    // Pre-process: extract any embedded <img> from inline HTML (rare for
    // blogs, possible for case-study rich-text). Resolve via asset registry.
    const { cleanedHtml, embeddedImages } = await extractInlineImages(
      html,
      assetRegistry,
      logger,
    );

    // Rewrite anchors before block conversion so link markDefs hold final URLs.
    const rewrittenHtml = rewriteAnchorsInHtml(cleanedHtml);

    let blocks;
    try {
      blocks = htmlToBlocks(rewrittenHtml, BLOCK_SCHEMA, {
        parseHtml: (h) => new JSDOM(h).window.document,
      });
    } catch (err) {
      throw new Error(
        `htmlToBlocks failed for entry ${idLabel} on node "${t}": ${err?.message ?? err}`,
      );
    }
    if (!Array.isArray(blocks)) blocks = [];

    for (const block of blocks) {
      block._key = nextKey();
      stampChildrenKeys(block, block._key);
      out.push(block);
    }

    // Append inline images (extracted above) in source order.
    for (const img of embeddedImages) {
      out.push({
        _type: "image",
        _key: nextKey(),
        ...(img.asset ? { asset: img.asset } : {}),
        ...(img._dryRun ? { _bcmsId: img._bcmsId, _dryRun: true } : {}),
        alt: img.alt ?? "",
      });
    }
  }

  return out;
}

/**
 * Dispatch a BCMS widget node to the appropriate Sanity PortableText block.
 */
async function widgetToBlock(node, ctx) {
  const { assetRegistry, nextKey, entryLabel, logger } = ctx;
  const wn = node.widgetName;
  const value = node.value ?? {};
  const key = nextKey();

  switch (wn) {
    case "image": {
      const media = value?.image ?? value;
      if (!media || typeof media !== "object") {
        throw new Error(
          `Widget "image" in ${entryLabel} has no media payload (value=${JSON.stringify(value).slice(0, 120)})`,
        );
      }
      const field = await assetRegistry.imageFieldFor(media, media.alt_text || "");
      const out = {
        _type: "image",
        _key: key,
        alt: field.alt ?? "",
      };
      if (field.asset) out.asset = field.asset;
      if (field._dryRun) {
        out._bcmsId = field._bcmsId;
        out._dryRun = true;
      }
      if (media.caption) out.caption = media.caption;
      return out;
    }

    case "table": {
      // BCMS shape: { header: { cols: string[] }, rows: { cols: string[] }[] }
      const headerCols = Array.isArray(value?.header?.cols)
        ? value.header.cols.map((c) => String(c ?? ""))
        : [];
      const rows = Array.isArray(value?.rows)
        ? value.rows.map((r, i) => ({
            _type: "tableRow",
            _key: `${key}-r${i}`,
            cols: Array.isArray(r?.cols) ? r.cols.map((c) => String(c ?? "")) : [],
          }))
        : [];
      return {
        _type: "table",
        _key: key,
        header: headerCols,
        rows,
      };
    }

    case "cta2": {
      // BCMS shape: { description: { nodes: [...] }, label: string, href: string }
      const description = richTextToPlainText(value?.description);
      const rawHref = typeof value?.href === "string" ? value.href : "";
      const href = rewriteUrl(rawHref);
      const label = typeof value?.label === "string" ? value.label : "";
      if (!label || !href) {
        logger?.warn?.(
          "body",
          null,
          `cta2 widget in ${entryLabel} missing label or href (label=${JSON.stringify(label)}, href=${JSON.stringify(href)})`,
        );
      }
      return {
        _type: "ctaBlock",
        _key: key,
        description,
        label,
        href,
      };
    }

    case "video": {
      // BCMS shape: { youtube_src: string }
      const url = typeof value?.youtube_src === "string"
        ? value.youtube_src
        : typeof value?.url === "string"
          ? value.url
          : "";
      if (!url) {
        throw new Error(`Widget "video" in ${entryLabel} has no youtube_src/url.`);
      }
      const out = {
        _type: "videoEmbed",
        _key: key,
        url,
      };
      if (value?.caption) out.caption = String(value.caption);
      return out;
    }

    default:
      throw new Error(`Unsupported widget "${wn}" in entry ${entryLabel}.`);
  }
}

/**
 * Stamp deterministic _key on PortableText block children and markDefs
 * derived from the top-level block key.
 */
function stampChildrenKeys(block, baseKey) {
  if (Array.isArray(block.children)) {
    block.children.forEach((child, i) => {
      child._key = `${baseKey}-c${i}`;
    });
  }
  if (Array.isArray(block.markDefs)) {
    block.markDefs.forEach((def, i) => {
      const newKey = `${baseKey}-m${i}`;
      const oldKey = def._key;
      def._key = newKey;
      if (oldKey && oldKey !== newKey && Array.isArray(block.children)) {
        for (const child of block.children) {
          if (Array.isArray(child.marks)) {
            child.marks = child.marks.map((m) => (m === oldKey ? newKey : m));
          }
        }
      }
    });
  }
}

/**
 * Rewrite href values on every <a> inside the HTML string. Preserves
 * external hrefs, mailto/tel/anchors. jsdom for parsing/serialization.
 */
function rewriteAnchorsInHtml(html) {
  if (!html || !html.includes("<a")) return html;
  const dom = new JSDOM(`<!DOCTYPE html><body>${html}</body>`);
  const doc = dom.window.document;
  const anchors = doc.querySelectorAll("a[href]");
  for (const a of anchors) {
    const href = a.getAttribute("href");
    const next = rewriteUrl(href);
    if (next !== href) a.setAttribute("href", next);
  }
  return doc.body.innerHTML;
}

/**
 * Walk an HTML fragment, extract every <img>, replace with a marker comment,
 * and resolve each img's BCMS asset via the asset registry.
 */
async function extractInlineImages(html, assetRegistry, logger) {
  if (!html.includes("<img")) {
    return { cleanedHtml: html, embeddedImages: [] };
  }
  const dom = new JSDOM(`<!DOCTYPE html><body>${html}</body>`);
  const doc = dom.window.document;
  const imgs = doc.querySelectorAll("img");
  const embeddedImages = [];
  for (const img of imgs) {
    const src = img.getAttribute("src") ?? "";
    const alt = img.getAttribute("alt") ?? "";
    const idMatch = src.match(/\/media\/([0-9a-f]{24})\//i);
    if (idMatch) {
      try {
        const field = await assetRegistry.imageFieldFor(idMatch[1], alt);
        embeddedImages.push(field);
      } catch (err) {
        logger?.warn?.(
          "body",
          null,
          `inline <img src="${src}"> failed to resolve via asset registry: ${err?.message ?? err}`,
        );
      }
    } else {
      logger?.warn?.(
        "body",
        null,
        `inline <img src="${src}"> has no recoverable BCMS media id; image dropped from PortableText. Use a widget node upstream.`,
      );
    }
    img.parentNode?.removeChild(img);
  }
  return {
    cleanedHtml: doc.body.innerHTML,
    embeddedImages,
  };
}

/** Decode HTML entities and strip tags. Used for plain-text reductions. */
function htmlToText(html) {
  // Insert a newline marker before block-ish elements so list items and
  // sibling block tags don't collapse into a single concatenated string
  // when textContent strips markup. The marker is a literal "\n" the
  // whitespace pass below preserves (we run \s collapsing per-line, not
  // across the whole string).
  const withBreaks = String(html).replace(
    /<\/?(li|p|br|h[1-6]|tr|div)\b[^>]*>/gi,
    "\n",
  );
  const dom = new JSDOM(`<!DOCTYPE html><body>${withBreaks}</body>`);
  const text = dom.window.document.body.textContent ?? "";
  return text
    .replace(/ /g, " ") // NBSP
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join("\n");
}
