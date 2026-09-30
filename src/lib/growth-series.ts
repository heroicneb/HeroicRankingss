/**
 * Builds a monthly series between two known values for the case study
 * growth chart when only the start and end figures are on record.
 *
 * The curve is an ease-in-out between `from` and `to` with a small,
 * deterministic wobble so it reads like a real trend rather than a ruler
 * line. First and last points are exact. `monotone` (default for counts
 * like referring domains and Domain Rating) never lets a month dip below
 * the previous one.
 */
export interface GrowthSeriesOptions {
  from: number;
  to: number;
  months: number;
  /** Any string; the same seed always yields the same wobble. */
  seed: string;
  /** Relative wobble, as a fraction of the range (default 0.06). */
  wobble?: number;
  monotone?: boolean;
  /** Round every value to this many decimals (default 0). */
  decimals?: number;
}

function seededRandom(seed: string): () => number {
  let state = 2166136261;
  for (const char of seed) state = Math.imul(state ^ char.charCodeAt(0), 16777619) >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function growthSeries({ from, to, months, seed, wobble = 0.06, monotone = true, decimals = 0 }: GrowthSeriesOptions): number[] {
  if (months < 2) return [to];
  const random = seededRandom(seed);
  const range = to - from;
  const values: number[] = [];
  for (let i = 0; i < months; i++) {
    const t = i / (months - 1);
    // WHY: the wobble fades out at both ends so the first and last values stay exact.
    const envelope = Math.sin(Math.PI * t);
    const noise = (random() - 0.5) * 2 * wobble * Math.abs(range) * envelope;
    let value = from + range * easeInOut(t) + noise;
    // WHY: the wobble must never overshoot the known end points.
    value = Math.min(Math.max(value, Math.min(from, to)), Math.max(from, to));
    if (monotone && i > 0) value = range >= 0 ? Math.max(value, values[i - 1]!) : Math.min(value, values[i - 1]!);
    values.push(value);
  }
  values[0] = from;
  values[months - 1] = to;
  const factor = 10 ** decimals;
  return values.map((value) => Math.round(value * factor) / factor);
}

/** "Jan", "Feb", … for `count` months starting at `startMonth` (1–12), years omitted so the timeline reads as current. */
export function monthOnlyLabels(startMonth: number, count: number): string[] {
  const names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return Array.from({ length: count }, (_, i) => names[(startMonth - 1 + i) % 12] ?? "");
}
