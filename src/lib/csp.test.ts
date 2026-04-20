import { describe, expect, it } from "vitest";

import { buildContentSecurityPolicy } from "./csp";

describe("buildContentSecurityPolicy", () => {
  it("uses nonce-based strict-dynamic for scripts, unsafe-inline for styles, and Sanity origins", () => {
    const nonce = "test-nonce";
    const policy = buildContentSecurityPolicy(nonce);

    expect(policy).toContain(`script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`);
    expect(policy).toContain("style-src 'self' 'unsafe-inline'");
    expect(policy).toContain("https://*.sanity.io");
    expect(policy).toContain("https://*.api.sanity.io");
  });
});
