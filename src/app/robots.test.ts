import { describe, expect, it } from "vitest";

import { buildRobotsTxt, GET } from "./robots.txt/route";

describe("robots route", () => {
  it("blocks all crawling pre-launch and still exposes the sitemap", () => {
    const text = buildRobotsTxt(false);
    expect(text).toMatch(/^User-agent: \*\nDisallow: \/\n/);
    expect(text).toMatch(/Sitemap: https:\/\/[^\n]+\/sitemap\.xml/);
  });

  it("opens the site at cutover but keeps API, Studio and previews out", () => {
    const text = buildRobotsTxt(true);
    expect(text).toContain("Allow: /\n");
    expect(text).toContain("Disallow: /api/");
    expect(text).toContain("Disallow: /studio/");
    expect(text).not.toMatch(/^Disallow: \/$/m);
  });

  it("carries the shield as comment lines after the rules", () => {
    const text = buildRobotsTxt(true);
    const comments = text.split("\n").filter((line) => line.startsWith("#"));
    expect(comments.length).toBe(22);
    expect(text.indexOf("Sitemap:")).toBeLessThan(text.indexOf("#"));
  });

  it("serves plain text", async () => {
    const response = GET();
    expect(response.headers.get("Content-Type")).toContain("text/plain");
    expect(await response.text()).toContain("User-agent: *");
  });
});
