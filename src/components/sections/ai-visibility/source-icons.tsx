/** Small outline glyphs for the five source nodes (24×24, stroke currentColor). */
const PATHS: Record<string, string> = {
  site: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 0c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9m0-18C9.5 5.6 8.2 8.6 8.2 12s1.3 6.4 3.8 9M3.5 9h17M3.5 15h17",
  reddit: "M4 11.5a8 5.5 0 1 0 16 0 8 5.5 0 1 0-16 0Zm5-.5h.01M15 11h.01M9 14.5c1.8 1.2 4.2 1.2 6 0M12 6l1-3 3 1m2 2a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z",
  reviews: "M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.7l5.9-.9L12 3.5Z",
  listicles: "M5 6h1m3 0h10M5 12h1m3 0h10M5 18h1m3 0h10",
  authority: "M10 14a4 4 0 0 0 5.7 0l2.8-2.8a4 4 0 0 0-5.7-5.7l-1.4 1.4m2.6 3.1a4 4 0 0 0-5.7 0L5.5 12.8a4 4 0 0 0 5.7 5.7l1.4-1.4",
};

export function SourceIcon({ id, className }: { id: string; className?: string }) {
  const d = PATHS[id] ?? PATHS.site;
  return (
    <svg aria-hidden className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" viewBox="0 0 24 24">
      <path d={d} />
    </svg>
  );
}
