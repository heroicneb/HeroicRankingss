import { beforeEach, describe, expect, it, vi } from "vitest";

const { getPostSlugsMock, getCaseStudySlugsMock, getTeamMemberSlugsMock } =
  vi.hoisted(() => ({
    getPostSlugsMock: vi.fn(),
    getCaseStudySlugsMock: vi.fn(),
    getTeamMemberSlugsMock: vi.fn(),
  }));

vi.mock("@/lib/sanity-data", () => ({
  getPostSlugs: getPostSlugsMock,
  getCaseStudySlugs: getCaseStudySlugsMock,
  getTeamMemberSlugs: getTeamMemberSlugsMock,
}));

import sitemap from "./sitemap";

describe("sitemap route", () => {
  beforeEach(() => {
    getPostSlugsMock.mockResolvedValue(["market-research-guide"]);
    getCaseStudySlugsMock.mockResolvedValue(["affinda"]);
    getTeamMemberSlugsMock.mockResolvedValue(["nebojsa-jankovic"]);
  });

  it("includes homepage, insight, case study, and visible team routes", async () => {
    const entries = await sitemap();
    const urls = entries.map((entry) => entry.url);

    expect(urls).toContain("https://heroicrankings.com");
    expect(urls).toContain(
      "https://heroicrankings.com/blog/market-research-guide",
    );
    expect(urls).toContain("https://heroicrankings.com/case-studies/affinda");
    expect(urls).toContain("https://heroicrankings.com/team/nebojsa-jankovic");
  });

  it("does not emit team URLs when data layer returns no visible members", async () => {
    // The GROQ query upstream filters by showOnAboutPage != false. This test
    // asserts the sitemap surface emits exactly what the data layer returns —
    // no double-filtering, no leak of hidden members.
    getTeamMemberSlugsMock.mockResolvedValue([]);
    const entries = await sitemap();
    const urls = entries.map((entry) => entry.url);

    expect(urls.some((url) => url.includes("/team/"))).toBe(false);
  });
});
