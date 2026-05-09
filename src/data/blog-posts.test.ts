import { describe, expect, it } from "vitest";

import { BLOG_POSTS, PUBLISHED_BLOG_POSTS } from "./blog-posts";

describe("blog post dataset", () => {
  it("keeps published subset aligned with published flag", () => {
    expect(PUBLISHED_BLOG_POSTS.length).toBeGreaterThan(0);
    expect(PUBLISHED_BLOG_POSTS.every((entry) => entry.isPublished)).toBe(true);
  });

  it("keeps unpublished entries routed to catalog fallback", () => {
    const unpublished = BLOG_POSTS.filter((entry) => !entry.isPublished);
    expect(unpublished.every((entry) => entry.href === "/blog")).toBe(true);
  });
});
