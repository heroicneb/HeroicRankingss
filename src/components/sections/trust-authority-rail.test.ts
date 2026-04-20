import { describe, expect, it } from "vitest";

import { TRUST_AUTHORITY_RAIL_HEIGHT_CLASS } from "./trust-authority-rail";

describe("TrustAuthorityRail", () => {
  it("uses the figma-matched rail height class", () => {
    expect(TRUST_AUTHORITY_RAIL_HEIGHT_CLASS).toBe("h-[580px]");
  });
});
