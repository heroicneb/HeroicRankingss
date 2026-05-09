import { describe, it, expect } from "vitest";
import { getPostHref } from "@/lib/post-url";

describe("getPostHref", () => {
  it("builds /seo/<urlCategory>/<slug>/ when both present", () => {
    expect(
      getPostHref({ slug: "best-ahrefs-alternatives", urlCategory: "managed" }),
    ).toBe("/seo/managed/best-ahrefs-alternatives/");
  });

  it("returns null when urlCategory is missing", () => {
    expect(getPostHref({ slug: "x", urlCategory: null })).toBeNull();
    expect(getPostHref({ slug: "x" })).toBeNull();
  });

  it("trailing slash matches legacy URL form", () => {
    expect(
      getPostHref({
        slug: "ranking-factors-seo",
        urlCategory: "technical",
      })?.endsWith("/"),
    ).toBe(true);
  });
});
