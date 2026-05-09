import { describe, expect, it } from "vitest";

import { buildMobileMenuItems } from "./mobile-menu";

describe("buildMobileMenuItems", () => {
  it("includes the podcast route when it exists in the navbar items", () => {
    const items = buildMobileMenuItems([
      { label: "Home", href: "/" },
      { label: "About Us", href: "/about" },
      {
        label: "SEO",
        href: "/seo",
        children: [
          { label: "On-Page SEO Services", href: "/seo/on-page" },
          { label: "Technical SEO Services", href: "/seo/technical" },
          { label: "Local SEO Services", href: "/seo/local" },
          { label: "E-commerce Services", href: "/seo/e-commerce" },
          { label: "Content Creation Services", href: "/seo/content-creation" },
          { label: "Keyword Strategy Services", href: "/seo/keyword-research" },
        ],
      },
      { label: "Link Building", href: "/seo/linkbuilding" },
      { label: "Partnership", href: "/partnership" },
      { label: "Insights", href: "/blog" },
      { label: "Case Studies", href: "/case-study" },
      { label: "Podcast", href: "/podcast" },
    ]);

    expect(items.map((item) => item.label)).toContain("Podcast");
    expect(items.find((item) => item.label === "Podcast")).toEqual({
      label: "Podcast",
      href: "/podcast",
    });
  });
});
