/** Normalize a URL path: ensure leading slash, strip trailing slash (except root "/"), handle empty string. */
export function normalizePath(path: string): string {
  if (!path || path === "") {
    return "/";
  }

  const withLeadingSlash = path.startsWith("/") ? path : `/${path}`;

  if (withLeadingSlash.length > 1 && withLeadingSlash.endsWith("/")) {
    return withLeadingSlash.slice(0, -1);
  }

  return withLeadingSlash;
}
