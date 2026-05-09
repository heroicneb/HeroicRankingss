import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

process.env.NEXT_PUBLIC_SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "test";
process.env.NEXT_PUBLIC_SANITY_PROJECT_ID =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "test-project";

const { getPostSlugsMock, getPostBySlugMock } = vi.hoisted(() => ({
  getPostSlugsMock: vi.fn(),
  getPostBySlugMock: vi.fn(),
}));

vi.mock("@/lib/sanity-data", () => ({
  getPostSlugs: getPostSlugsMock,
  getPostBySlug: getPostBySlugMock,
}));

describe("insight detail route", () => {
  let generateMetadata: typeof import("./page").generateMetadata;
  let generateStaticParams: typeof import("./page").generateStaticParams;

  beforeAll(async () => {
    const pageModule = await import("./page");
    generateMetadata = pageModule.generateMetadata;
    generateStaticParams = pageModule.generateStaticParams;
  });

  beforeEach(() => {
    getPostSlugsMock.mockResolvedValue(["market-research-guide", "seo-trends-2026"]);
    getPostBySlugMock.mockResolvedValue({
      _id: "post-1",
      title: "Market Research Guide",
      slug: "market-research-guide",
      excerpt: "How to run practical market research for SEO.",
      mainImageUrl: "",
      mainImageAlt: "cover image",
      publishedAt: "2026-02-01T00:00:00.000Z",
      categories: [],
      body: null,
      authorName: null,
      authorRole: null,
      seoTitle: "Market Research Guide",
      seoDescription: "How to run practical market research for SEO.",
    });
  });

  it("generates params from CMS slugs", async () => {
    await expect(generateStaticParams()).resolves.toEqual([
      { slug: "market-research-guide" },
      { slug: "seo-trends-2026" },
    ]);
  });

  it("derives metadata from CMS fields", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: "market-research-guide" }),
    });

    expect(metadata.title).toBe("Market Research Guide");
    expect(metadata.description).toBe("How to run practical market research for SEO.");
  });
});
