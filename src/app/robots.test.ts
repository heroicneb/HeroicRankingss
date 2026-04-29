import { describe, expect, it } from "vitest";

import robots from "./robots";

describe("robots route", () => {
  it("blocks all crawling pre-launch and still exposes the sitemap", () => {
    const result = robots();
    const rules = Array.isArray(result.rules) ? result.rules : [result.rules];
    const defaultRule = rules[0];

    expect(defaultRule?.userAgent).toBe("*");
    expect(defaultRule?.disallow).toBe("/");
    expect(result.sitemap).toMatch(/\/sitemap\.xml$/);
  });
});
