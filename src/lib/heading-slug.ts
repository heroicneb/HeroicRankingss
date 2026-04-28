import type { PortableTextBlock } from "@portabletext/react";

export function slugifyHeading(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function extractBlockText(block: unknown): string {
  const children = (block as { children?: Array<{ text?: string }> }).children;
  if (!Array.isArray(children)) return "";
  return children
    .map((child) => (typeof child.text === "string" ? child.text : ""))
    .join("")
    .trim();
}

/**
 * Map heading block _key -> unique slug id (deduped on collision).
 * Covers h2 and h3 styles so deep links work on either depth.
 */
export function buildHeadingIdMap(
  body: PortableTextBlock[] | null,
): Map<string, string> {
  const map = new Map<string, string>();
  if (!body) return map;
  const seen = new Set<string>();

  for (const block of body) {
    if (block._type !== "block") continue;
    const style = (block as { style?: string }).style;
    if (style !== "h2" && style !== "h3") continue;
    const key = (block as { _key?: string })._key;
    if (!key) continue;
    const text = extractBlockText(block);
    if (!text) continue;
    const base = slugifyHeading(text);
    if (!base) continue;
    let id = base;
    let suffix = 2;
    while (seen.has(id)) {
      id = `${base}-${suffix}`;
      suffix += 1;
    }
    seen.add(id);
    map.set(key, id);
  }

  return map;
}
