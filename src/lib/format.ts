/**
 * Format a date string into a human-readable published date.
 *
 * @example formatPublishedDate("2026-01-15") // "January 15, 2026"
 */
export function formatPublishedDate(dateValue: string | null | undefined): string | null {
  if (!dateValue) return null;

  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) return null;

  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parsed);
}
