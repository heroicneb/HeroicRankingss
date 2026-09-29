import { describe, expect, it } from "vitest";

import { monthOnly } from "./month-label";

describe("monthOnly", () => {
  it("drops the year in the formats the Studio uses", () => {
    expect(monthOnly("MAY25")).toBe("May");
    expect(monthOnly("Sep 2024")).toBe("Sep");
    expect(monthOnly("Sep '24")).toBe("Sep");
    expect(monthOnly("2024-09")).toBe("Sep");
    expect(monthOnly("September 2024")).toBe("September");
    expect(monthOnly("Dec")).toBe("Dec");
  });

  it("leaves labels it does not recognise alone", () => {
    expect(monthOnly("Week 3")).toBe("Week 3");
    expect(monthOnly("Q1 2024")).toBe("Q1 2024");
  });
});
