import { describe, expect, it } from "vitest";

import { withTrailingSlash } from "./with-trailing-slash";

describe("withTrailingSlash", () => {
  it("adds the slash to internal paths", () => {
    expect(withTrailingSlash("/seo")).toBe("/seo/");
    expect(withTrailingSlash("/seo/linkbuilding")).toBe("/seo/linkbuilding/");
  });
  it("keeps query strings and anchors after the slash", () => {
    expect(withTrailingSlash("/blog?page=2")).toBe("/blog/?page=2");
    expect(withTrailingSlash("/seo#faq")).toBe("/seo/#faq");
  });
  it("leaves root, files, api and externals alone", () => {
    expect(withTrailingSlash("/")).toBe("/");
    expect(withTrailingSlash("/seo/")).toBe("/seo/");
    expect(withTrailingSlash("/sitemap.xml")).toBe("/sitemap.xml");
    expect(withTrailingSlash("/api/chat")).toBe("/api/chat");
    expect(withTrailingSlash("https://example.com/x")).toBe("https://example.com/x");
    expect(withTrailingSlash("mailto:a@b.com")).toBe("mailto:a@b.com");
    expect(withTrailingSlash("#top")).toBe("#top");
  });
  it("turns absolute same-site links into relative ones", () => {
    expect(withTrailingSlash("https://heroicrankings.com/seo/technical")).toBe("/seo/technical/");
    expect(withTrailingSlash("https://www.heroicrankings.com/")).toBe("/");
  });
});
