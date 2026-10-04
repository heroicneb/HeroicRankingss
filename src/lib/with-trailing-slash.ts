/**
 * The site serves every page at its trailing-slash URL (next.config trailingSlash).
 * Internal links written without the slash cost a 308 hop, so links are normalised
 * before render. Files, API routes, Next internals, external URLs and anchors are
 * left alone. Absolute links to the site's own domain become relative first.
 */
export function withTrailingSlash(href: string): string {
  if (typeof href !== "string" || href === "") return href;
  let value = href.replace(/^https?:\/\/(www\.)?heroicrankings\.com(?=\/|$)/, "");
  if (value === "") value = "/";
  if (!value.startsWith("/") || value.startsWith("//")) return value;
  const match = value.match(/^([^?#]*)(.*)$/);
  const path = match?.[1] ?? value;
  const rest = match?.[2] ?? "";
  if (path === "" || path.endsWith("/")) return value;
  if (/\.[a-z0-9]{2,5}$/i.test(path)) return value;
  if (path.startsWith("/api/") || path.startsWith("/_next/") || path === "/api") return value;
  return `${path}/${rest}`;
}
