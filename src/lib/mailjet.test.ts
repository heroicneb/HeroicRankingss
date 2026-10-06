import { describe, expect, it } from "vitest";

import { buildFormEmail, isMailjetSuccessBody, parseRecipients, readMailjetConfig, type MailjetConfig } from "./mailjet";

const config: MailjetConfig = {
  apiKey: "k",
  secretKey: "s",
  fromEmail: "website@example.com",
  fromName: "Heroic Rankings Website",
  contactRecipients: ["sales@example.com"],
  partnershipRecipients: ["partners@example.com"],
};

describe("parseRecipients", () => {
  it("splits on commas, semicolons and spaces, lower-cases and de-duplicates", () => {
    expect(parseRecipients(" A@x.com, b@x.com;a@x.com  c@x.com ")).toEqual(["a@x.com", "b@x.com", "c@x.com"]);
    expect(parseRecipients("")).toEqual([]);
    expect(parseRecipients(undefined)).toEqual([]);
    expect(parseRecipients("not-an-email")).toEqual([]);
  });
});

describe("readMailjetConfig", () => {
  const base = { MAILJET_API_KEY: "k", MAILJET_SECRET_KEY: "s", MAILJET_FROM_EMAIL: "f@x.com", CONTACT_FORM_TO: "a@x.com" };

  it("is null when any required value is missing", () => {
    for (const key of Object.keys(base)) {
      expect(readMailjetConfig({ ...base, [key]: "" })).toBeNull();
    }
  });

  it("falls back to the contact recipients for partnership requests and names the sender", () => {
    const parsed = readMailjetConfig(base);
    expect(parsed?.partnershipRecipients).toEqual(["a@x.com"]);
    expect(parsed?.fromName).toBe("Heroic Rankings Website");
    expect(readMailjetConfig({ ...base, PARTNERSHIP_FORM_TO: "p@x.com", MAILJET_FROM_NAME: "HR" })).toMatchObject({ partnershipRecipients: ["p@x.com"], fromName: "HR" });
  });
});

describe("buildFormEmail", () => {
  it("escapes HTML in submitted text and keeps the plain-text copy verbatim", () => {
    const message = buildFormEmail(
      { formType: "contact", fullName: "<b>Ana</b>", companyEmail: "ana@x.com", companyName: "A & B", projectOverview: "Line 1\nLine 2", submittedAt: "" },
      config,
    );
    expect(message.HTMLPart).toContain("&lt;b&gt;Ana&lt;/b&gt;");
    expect(message.HTMLPart).toContain("A &amp; B");
    expect(message.HTMLPart).not.toContain("<b>Ana</b>");
    expect(message.TextPart).toContain("Company: A & B");
    expect(message.TextPart).toContain("Line 1\nLine 2");
    expect(message.To).toEqual([{ Email: "sales@example.com" }]);
    expect(message.CustomID).toBe("website-contact");
  });

  it("formats the client timestamp and skips empty fields", () => {
    const message = buildFormEmail({ formType: "partnership", fullName: "Jo", companyEmail: "jo@x.com", source: "/white-label-seo-partnership/", submittedAt: "1790000000000" }, config);
    expect(message.TextPart).toContain("Submitted: 2026-09-21");
    expect(message.TextPart).not.toContain("Company:");
    expect(message.TextPart).toContain("Page: /white-label-seo-partnership/");
    expect(message.To).toEqual([{ Email: "partners@example.com" }]);
  });
});

describe("isMailjetSuccessBody", () => {
  it("accepts success statuses and unparseable bodies, rejects a message error", () => {
    expect(isMailjetSuccessBody({ Messages: [{ Status: "success" }] })).toBe(true);
    expect(isMailjetSuccessBody(null)).toBe(true);
    expect(isMailjetSuccessBody({})).toBe(true);
    expect(isMailjetSuccessBody({ Messages: [{ Status: "error" }] })).toBe(false);
  });
});
