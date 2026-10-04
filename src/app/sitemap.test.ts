import { beforeEach, describe, expect, it, vi } from "vitest";

const { getSitemapEntriesMock } = vi.hoisted(() => ({
  getSitemapEntriesMock: vi.fn(),
}));

vi.mock("@/lib/sanity-data", () => ({
  getSitemapEntries: getSitemapEntriesMock,
}));

import sitemap from "./sitemap";

describe("sitemap route", () => {
  beforeEach(() => {
    getSitemapEntriesMock.mockResolvedValue({
      // WHY: the query already drops posts without urlCategory; the route must not invent URLs for them.
      posts: [{ slug: "market-research-guide", urlCategory: "managed", _updatedAt: "2026-09-01T10:00:00Z" }],
      caseStudies: [{ slug: "affinda", _updatedAt: "2026-08-15T10:00:00Z" }],
      team: [{ slug: "nebojsa-jankovic", _updatedAt: "2026-07-01T10:00:00Z" }],
      episodes: [{ slug: "sara-miller", _updatedAt: "2026-10-04T10:00:00Z" }],
      pages: [{ _id: "homePage", _updatedAt: "2026-10-02T10:00:00Z" }],
    });
  });

  it("emits every template at its trailing-slash URL", async () => {
    const entries = await sitemap();
    const urls = entries.map((entry) => entry.url);

    expect(urls).toContain("https://heroicrankings.com/");
    expect(urls).toContain("https://heroicrankings.com/seo/managed/market-research-guide/");
    expect(urls).toContain("https://heroicrankings.com/case-study/affinda/");
    expect(urls).toContain("https://heroicrankings.com/about/nebojsa-jankovic/");
    expect(urls).toContain("https://heroicrankings.com/podcast/sara-miller/");
    expect(urls).toContain("https://heroicrankings.com/podcast/");
    expect(urls.every((url) => url.endsWith("/"))).toBe(true);
    expect(new Set(urls).size).toBe(urls.length);
  });

  it("carries each document's edit date and the newest item date on listings", async () => {
    const entries = await sitemap();
    const byUrl = new Map(entries.map((entry) => [entry.url, entry]));

    expect(byUrl.get("https://heroicrankings.com/")?.lastModified).toBe("2026-10-02T10:00:00Z");
    expect(byUrl.get("https://heroicrankings.com/podcast/sara-miller/")?.lastModified).toBe("2026-10-04T10:00:00Z");
    expect(byUrl.get("https://heroicrankings.com/podcast/")?.lastModified).toBe("2026-10-04T10:00:00Z");
    expect(byUrl.get("https://heroicrankings.com/blog/")?.lastModified).toBe("2026-09-01T10:00:00Z");
    // WHY: a route with no dated source must omit lastModified rather than fake it.
    expect(byUrl.get("https://heroicrankings.com/seo/")).not.toHaveProperty("lastModified");
  });

  it("emits exactly the team members the data layer returns", async () => {
    getSitemapEntriesMock.mockResolvedValue({ posts: [], caseStudies: [], team: [], episodes: [], pages: [] });
    const entries = await sitemap();
    const urls = entries.map((entry) => entry.url);

    expect(urls.some((url) => url.includes("/about/") && url !== "https://heroicrankings.com/about/")).toBe(false);
    expect(urls).toContain("https://heroicrankings.com/about/");
  });

  it("still lists the static routes when the CMS is unreachable", async () => {
    getSitemapEntriesMock.mockRejectedValue(new Error("offline"));
    const entries = await sitemap();
    const urls = entries.map((entry) => entry.url);

    expect(urls).toContain("https://heroicrankings.com/");
    expect(urls).toContain("https://heroicrankings.com/seo/linkbuilding/");
    expect(urls.length).toBeGreaterThan(10);
  });
});
