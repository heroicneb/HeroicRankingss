import { describe, expect, it } from "vitest";

import { STATS_CTA_HEIGHT_CLASS } from "./stats";

describe("Stats", () => {
  it("uses the figma-matched CTA height class", () => {
    expect(STATS_CTA_HEIGHT_CLASS).toBe("h-[51px]");
  });
});
