/**
 * Month label without the year, for chart axes that should read as current:
 * "MAY25" → "May", "Sep 2024" → "Sep", "2024-09" → "Sep", "Sep '24" → "Sep".
 * Anything that is not recognisably a month is returned unchanged.
 */
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function monthOnly(label: string): string {
  const trimmed = label.trim();
  const iso = trimmed.match(/^(\d{4})-(\d{1,2})/);
  if (iso) {
    const index = Number(iso[2]) - 1;
    return MONTHS[index] ?? trimmed;
  }
  const word = trimmed.match(/^([A-Za-z]{3,9})\.?[\s'’-]*(\d{2}|\d{4})?$/);
  if (!word?.[1]) return trimmed;
  const name = word[1];
  const known = MONTHS.find((month) => name.toLowerCase().startsWith(month.toLowerCase()));
  return known ? (name.length > 3 ? name[0]!.toUpperCase() + name.slice(1).toLowerCase() : known) : trimmed;
}
