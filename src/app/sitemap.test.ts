import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  getPostSlugsMock,
  getCaseStudySlugsMock,
} = vi.hoisted(() => ({
  getPostSlugsMock: vi.fn(),
  getCaseStudySlugsMock: vi.fn(),
}));

vi.mock("@/lib/sanity-data", () => ({
  getPostSlugs: getPostSlugsMock,
  getCaseStudySlugs: getCaseStudySlugsMock,
}));

import sitemap from "./sitemap";

describe("sitemap route", () => {
  beforeEach(() => {
    getPostSlugsMock.mockResolvedValue(["market-research-guide"]);
    getCaseStudySlugsMock.mockResolvedValue(["affinda"]);
  });

  it("includes homepage and insight routes", async () => {
    const entries = await sitemap();
    const urls = entries.map((entry) => entry.url);

    expect(urls).toContain("https://heroicrankings.com");
    expect(urls).toContain("https://heroicrankings.com/insights/market-research-guide");
    expect(urls).toContain("https://heroicrankings.com/case-studies/affinda");
    expect(urls.some((url) => url.includes("/team/"))).toBe(false);
  });
});
