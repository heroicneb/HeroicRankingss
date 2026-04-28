import { describe, it, expect } from "vitest";
import { generateVCard, generateVCardFilename } from "../vcard";

describe("generateVCard", () => {
  it("uses CRLF line endings (RFC 6350)", () => {
    const out = generateVCard({ name: "Nebojša Janković", email: "n@hr.com" });
    expect(out).toContain("\r\n");
    // verify there are no bare \n that aren't part of \r\n
    const lines = out.split("\r\n");
    for (const line of lines) expect(line).not.toContain("\n");
  });

  it("escapes special characters in field values", () => {
    const out = generateVCard({ name: "Smith, John; Jr.", email: "a@b.com" });
    expect(out).toContain("FN:Smith\\, John\\; Jr.");
  });

  it("normalizes phone to E.164", () => {
    const out = generateVCard({ name: "X", phone: "+1 (555) 555-1234" });
    expect(out).toContain("TEL:+15555551234");
  });

  it("rejects invalid phone, omits the field", () => {
    const out = generateVCard({ name: "X", phone: "not-a-number" });
    expect(out).not.toContain("TEL:");
  });

  it("returns empty string for empty input", () => {
    expect(generateVCard({})).toBe("");
  });

  it("handles diacritics safely in field values", () => {
    const out = generateVCard({ name: "Nebojša Janković" });
    expect(out).toContain("FN:Nebojša Janković");
  });

  it("includes BEGIN:VCARD / VERSION:3.0 / END:VCARD framing", () => {
    const out = generateVCard({ name: "X" });
    expect(out).toMatch(/^BEGIN:VCARD\r\n/);
    expect(out).toContain("VERSION:3.0\r\n");
    expect(out).toMatch(/END:VCARD\r\n$/);
  });

  it("emits TITLE when role + company both present", () => {
    const out = generateVCard({ name: "X", role: "Founder", company: "Heroic Rankings" });
    expect(out).toContain("TITLE:Founder\\, Heroic Rankings");
  });

  it("emits TITLE when role only", () => {
    const out = generateVCard({ name: "X", role: "Founder" });
    expect(out).toContain("TITLE:Founder");
  });

  it("emits URL field when provided", () => {
    const out = generateVCard({ name: "X", url: "https://linkedin.com/in/x" });
    expect(out).toContain("URL:https://linkedin.com/in/x");
  });
});

describe("generateVCardFilename", () => {
  it("ASCII-only, slug-derived from name", () => {
    expect(generateVCardFilename("Nebojša Janković")).toBe("nebojsa-jankovic.vcf");
  });

  it("strips diacritics consistently", () => {
    expect(generateVCardFilename("Café Müller")).toBe("cafe-muller.vcf");
  });

  it("collapses multiple non-alphanumeric chars to a single hyphen", () => {
    expect(generateVCardFilename("John  ---  Doe")).toBe("john-doe.vcf");
  });

  it("trims leading/trailing hyphens", () => {
    expect(generateVCardFilename("---X---")).toBe("x.vcf");
  });
});
