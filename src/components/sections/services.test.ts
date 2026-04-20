import { describe, expect, it } from "vitest";

import {
  getServiceCardArticleClassName,
  SERVICE_CARDS,
  SERVICES_HEADING_DESKTOP_LINES,
} from "./services";

describe("Services", () => {
  it("keeps the Link Building Services card visible in the desktop rail for the current Figma layout", () => {
    const linkBuildingCard = SERVICE_CARDS.find((card) => card.title === "Link Building Services");

    expect(linkBuildingCard).toBeDefined();
    expect(getServiceCardArticleClassName(linkBuildingCard!, false)).not.toContain("lg:hidden");
  });

  it("locks the desktop heading to the two Figma lines", () => {
    expect(SERVICES_HEADING_DESKTOP_LINES).toEqual([
      "Strategies for sustainable",
      "success and proven growth.",
    ]);
  });

  it("uses the current-copy Figma descriptions for the homepage service cards", () => {
    expect(SERVICE_CARDS.map((card) => card.backDescription)).toEqual([
      "Comprehensive support to ensure every aspect of your SEO strategy is optimized for success and tailored to your business needs.",
      "Gain visibility on top-tier websites and connect with your target audience to increase your site's authority and improve rankings. Strengthen online presence with exceptional link building strategies and reporting.",
      "Refine your website's content and architecture for enhanced search engine visibility and better search rankings.",
      "Optimize Your Infrastructure. Enhance User Experience. Boost Rankings.",
      "Dominate Your Local Market. Connect with Nearby Customers. Increase Foot Traffic.",
      "Optimize Your Online Store. Drive Conversions and Sales.",
      "Tell stories that matter. Connect with your audience. Turn engagement into conversions.",
      "Get the most out of your content. Target the Right Search. Find More Customers.",
    ]);
  });
});
