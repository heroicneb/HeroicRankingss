/**
 * Split a title around a highlighted substring for two-tone H1 rendering.
 *
 * Returns `{ before, gradient, after }` so each segment can be rendered in its
 * own span. If the highlight is null/empty or not present in the title, the
 * full title is returned as `before` with empty `gradient`/`after` so callers
 * fall back to a solid render gracefully.
 *
 * Used by case study, podcast episode, and blog post hero headings. Schema
 * validation (`titleHighlighted.includes(title)`) prevents the silent-no-match
 * path for editor-entered content; this helper is the runtime safety net.
 */
export function splitTitle(
  title: string,
  highlighted: string | null | undefined,
): { before: string; gradient: string; after: string } {
  if (!highlighted) {
    return { before: title, gradient: "", after: "" };
  }
  const idx = title.indexOf(highlighted);
  if (idx === -1) {
    return { before: title, gradient: "", after: "" };
  }
  return {
    before: title.slice(0, idx),
    gradient: highlighted,
    after: title.slice(idx + highlighted.length),
  };
}
