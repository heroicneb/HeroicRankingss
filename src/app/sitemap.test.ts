import { beforeEach, describe, expect, it, vi } from "vitest";

const { getPostUrlsMock, getCaseStudySlugsMock, getTeamMemberSlugsMock } =
  vi.hoisted(() => ({
    getPostUrlsMock: vi.fn(),
    getCaseStudySlugsMock: vi.fn(),
    getTeamMemberSlugsMock: vi.fn(),
  }));

vi.mock("@/lib/sanity-data", () => ({
  getPostUrls: getPostUrlsMock,
  getCaseStudySlugs: getCaseStudySlugsMock,
  getTeamMemberSlugs: getTeamMemberSlugsMock,
}));

import sitemap from "./sitemap";

describe("sitemap route", () => {
  beforeEach(() => {
    getPostUrlsMock.mockResolvedValue([
      { slug: "market-research-guide", urlCategory: "managed" },
      { slug: "no-category-post", urlCategory: null },
    ]);
    getCaseStudySlugsMock.mockResolvedValue(["affinda"]);
    getTeamMemberSlugsMock.mockResolvedValue(["nebojsa-jankovic"]);
  });

  it("emits posts at /seo/<urlCategory>/<slug>/ to match legacy URL form", async () => {
    const entries = await sitemap();
    const urls = entries.map((entry) => entry.url);

    expect(urls).toContain("https://heroicrankings.com");
    expect(urls).toContain(
      "https://heroicrankings.com/seo/managed/market-research-guide",
    );
    expect(urls).toContain("https://heroicrankings.com/case-study/affinda");
    expect(urls).toContain("https://heroicrankings.com/about/nebojsa-jankovic");
  });

  it("skips posts without urlCategory until the editor fills the field", async () => {
    const entries = await sitemap();
    const urls = entries.map((entry) => entry.url);

    // The post with urlCategory: null should NOT appear in the sitemap —
    // it has no canonical URL until the editor sets the urlCategory field.
    expect(urls.some((url) => url.includes("no-category-post"))).toBe(false);
  });

  it("does not emit team URLs when data layer returns no visible members", async () => {
    // The GROQ query upstream filters by showOnAboutPage != false. This test
    // asserts the sitemap surface emits exactly what the data layer returns —
    // no double-filtering, no leak of hidden members.
    getTeamMemberSlugsMock.mockResolvedValue([]);
    const entries = await sitemap();
    const urls = entries.map((entry) => entry.url);

    expect(
      urls.some(
        (url) =>
          url.startsWith("https://heroicrankings.com/about/") &&
          url !== "https://heroicrankings.com/about",
      ),
    ).toBe(false);
  });
});
