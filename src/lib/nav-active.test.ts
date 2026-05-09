import { describe, expect, it } from "vitest";

import { isNavItemActive } from "./nav-active";

describe("isNavItemActive", () => {
  it("treats insight detail routes as active for Insights nav item", () => {
    expect(isNavItemActive("/insights/market-research-guide", { href: "/insights", label: "Insights" })).toBe(true);
  });

  it("treats SEO service routes as active for SEO nav item", () => {
    expect(isNavItemActive("/seo/technical", { href: "/seo", label: "SEO" })).toBe(true);
  });

  it("uses exact matching for standard nav items", () => {
    expect(isNavItemActive("/about-us", { href: "/about-us", label: "About Us" })).toBe(true);
    expect(isNavItemActive("/contact", { href: "/about-us", label: "About Us" })).toBe(false);
  });
});
