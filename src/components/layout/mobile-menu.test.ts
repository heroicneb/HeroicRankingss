import { describe, expect, it } from "vitest";

import { buildMobileMenuItems } from "./mobile-menu";

describe("buildMobileMenuItems", () => {
  it("includes the podcast route when it exists in the navbar items", () => {
    const items = buildMobileMenuItems([
      { label: "Home", href: "/" },
      { label: "About Us", href: "/about-us" },
      {
        label: "SEO",
        href: "/seo-services",
        children: [
          { label: "On-Page SEO Services", href: "/on-page-seo" },
          { label: "Technical SEO Services", href: "/technical-seo" },
          { label: "Local SEO Services", href: "/local-seo" },
          { label: "E-commerce Services", href: "/ecommerce-seo" },
          { label: "Content Creation Services", href: "/content-creation" },
          { label: "Keyword Strategy Services", href: "/keyword-strategy" },
        ],
      },
      { label: "Link Building", href: "/link-building" },
      { label: "Partnership", href: "/partnership" },
      { label: "Insights", href: "/insights" },
      { label: "Case Studies", href: "/case-studies" },
      { label: "Podcast", href: "/podcast" },
    ]);

    expect(items.map((item) => item.label)).toContain("Podcast");
    expect(items.find((item) => item.label === "Podcast")).toEqual({
      label: "Podcast",
      href: "/podcast",
    });
  });
});
