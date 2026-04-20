import { describe, expect, it } from "vitest";

import {
  CONTACT_FORM_HEARD_FROM_EMPTY_VALUE,
  CONTACT_FORM_HEARD_FROM_OPTIONS,
  isAllowedContactHeardFrom,
  isValidContactEmail,
} from "./contact-validation";

describe("contact validation helpers", () => {
  it("accepts valid email formats and rejects invalid ones", () => {
    expect(isValidContactEmail("hello@example.com")).toBe(true);
    expect(isValidContactEmail("invalid-email")).toBe(false);
  });

  it("allows only known heard-from options plus empty value", () => {
    expect(isAllowedContactHeardFrom(CONTACT_FORM_HEARD_FROM_EMPTY_VALUE)).toBe(true);
    expect(isAllowedContactHeardFrom(CONTACT_FORM_HEARD_FROM_OPTIONS[0])).toBe(true);
    expect(isAllowedContactHeardFrom("Unknown Option")).toBe(false);
  });
});
