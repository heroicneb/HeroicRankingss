import { describe, expect, it } from "vitest";

import { createPageMetadata } from "./metadata";

describe("createPageMetadata", () => {
  it("normalizes canonical path and preserves social metadata defaults", () => {
    const metadata = createPageMetadata({
      title: "Contact",
      description: "Contact page description",
      path: "contact",
    });

    expect(metadata.alternates?.canonical).toBe("/contact");
    expect(metadata.openGraph?.images).toEqual([
      {
        alt: "Heroic Rankings Open Graph Image",
        height: 630,
        url: "/opengraph-image",
        width: 1200,
      },
    ]);
    expect(metadata.twitter).toMatchObject({
      card: "summary_large_image",
    });
  });
});
