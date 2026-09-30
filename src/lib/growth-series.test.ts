import { describe, expect, it } from "vitest";

import { growthSeries, monthOnlyLabels } from "./growth-series";

describe("growthSeries", () => {
  it("starts and ends on the given values, never dips when monotone, and is deterministic", () => {
    const a = growthSeries({ from: 90000, to: 1000000, months: 36, seed: "designrush" });
    const b = growthSeries({ from: 90000, to: 1000000, months: 36, seed: "designrush" });
    expect(a).toEqual(b);
    expect(a).toHaveLength(36);
    expect(a[0]).toBe(90000);
    expect(a[35]).toBe(1000000);
    for (let i = 1; i < a.length; i++) expect(a[i]).toBeGreaterThanOrEqual(a[i - 1]!);
  });

  it("keeps a visible curve rather than a straight line", () => {
    const s = growthSeries({ from: 0, to: 100, months: 11, seed: "x", wobble: 0 });
    expect(s[5]).toBe(50);
    expect(s[2]!).toBeLessThan(20);
  });

  it("rounds to the requested decimals", () => {
    expect(growthSeries({ from: 1, to: 2, months: 3, seed: "r", decimals: 1, wobble: 0 })).toEqual([1, 1.5, 2]);
  });
});

describe("monthOnlyLabels", () => {
  it("wraps around the year without showing it", () => {
    expect(monthOnlyLabels(11, 4)).toEqual(["Nov", "Dec", "Jan", "Feb"]);
  });
});
