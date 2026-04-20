import { describe, expect, it } from "vitest";

import robots from "./robots";

describe("robots route", () => {
  it("disallows internal preview route and exposes sitemap", () => {
    const result = robots();
    const rules = Array.isArray(result.rules) ? result.rules : [result.rules];
    const defaultRule = rules[0];

    expect(defaultRule?.userAgent).toBe("*");
    expect(defaultRule?.disallow).toContain("/navbar-preview");
    expect(result.sitemap).toMatch(/\/sitemap\.xml$/);
  });
});
