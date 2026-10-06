import { describe, expect, it } from "vitest";

import { buildConfirmationEmail, buildTeamEmail, parseRecipients, readResendConfig, type ResendConfig } from "./resend";

const config: ResendConfig = {
  apiKey: "re_k",
  from: "Heroic Rankings <hello@notifications.example.com>",
  contactRecipients: ["sales@example.com"],
  partnershipRecipients: ["partners@example.com"],
  replyTo: "sales@example.com",
  confirmationEnabled: true,
};

describe("parseRecipients", () => {
  it("splits on commas, semicolons and spaces, lower-cases and de-duplicates", () => {
    expect(parseRecipients(" A@x.com, b@x.com;a@x.com  c@x.com ")).toEqual(["a@x.com", "b@x.com", "c@x.com"]);
    expect(parseRecipients("")).toEqual([]);
    expect(parseRecipients(undefined)).toEqual([]);
    expect(parseRecipients("not-an-email")).toEqual([]);
  });
});

describe("readResendConfig", () => {
  const base = { RESEND_API_KEY: "re_k", CONTACT_FORM_TO: "a@x.com" };

  it("is null without the key or the contact recipients", () => {
    expect(readResendConfig({ ...base, RESEND_API_KEY: "" })).toBeNull();
    expect(readResendConfig({ ...base, CONTACT_FORM_TO: "" })).toBeNull();
  });

  it("fills the defaults: notifications sender, sales Reply-To, confirmation on, partnership falls back to contact", () => {
    expect(readResendConfig(base)).toMatchObject({
      from: "Heroic Rankings <hello@notifications.heroicrankings.com>",
      replyTo: "sales@heroicrankings.com",
      confirmationEnabled: true,
      partnershipRecipients: ["a@x.com"],
    });
    expect(readResendConfig({ ...base, PARTNERSHIP_FORM_TO: "p@x.com", FORM_REPLY_TO: "r@x.com", FORM_CONFIRMATION_ENABLED: "FALSE" })).toMatchObject({
      partnershipRecipients: ["p@x.com"],
      replyTo: "r@x.com",
      confirmationEnabled: false,
    });
  });
});

describe("buildTeamEmail", () => {
  it("escapes HTML in submitted text and keeps the plain-text copy verbatim", () => {
    const message = buildTeamEmail(
      { formType: "contact", fullName: "<b>Ana</b>", companyEmail: "ana@x.com", companyName: "A & B", projectOverview: "Line 1\nLine 2", submittedAt: "" },
      config,
    );
    expect(message.html).toContain("&lt;b&gt;Ana&lt;/b&gt;");
    expect(message.html).toContain("A &amp; B");
    expect(message.html).not.toContain("<b>Ana</b>");
    expect(message.text).toContain("Company: A & B");
    expect(message.text).toContain("Line 1\nLine 2");
    expect(message.to).toEqual(["sales@example.com"]);
    expect(message.reply_to).toBe("ana@x.com");
    expect(message.tags).toEqual([
      { name: "form", value: "contact" },
      { name: "kind", value: "team" },
    ]);
  });

  it("formats the client timestamp, skips empty fields and routes partnership requests", () => {
    const message = buildTeamEmail({ formType: "partnership", fullName: "Jo", companyEmail: "jo@x.com", source: "/white-label-seo-partnership/", submittedAt: "1790000000000" }, config);
    expect(message.text).toContain("Submitted: 2026-09-21");
    expect(message.text).not.toContain("Company:");
    expect(message.text).toContain("Page: /white-label-seo-partnership/");
    expect(message.to).toEqual(["partners@example.com"]);
  });
});

describe("buildConfirmationEmail", () => {
  it("greets by first name, replies to the team address and never echoes the visitor's text", () => {
    const message = buildConfirmationEmail(
      { formType: "contact", fullName: "Taylor Swift", companyEmail: "t@x.com", projectOverview: "SECRET PROJECT TEXT", submittedAt: "" },
      config,
    );
    expect(message.to).toEqual(["t@x.com"]);
    expect(message.reply_to).toBe("sales@example.com");
    expect(message.subject).toBe("We received your message, Taylor");
    expect(message.text).toContain("Hi Taylor,");
    expect(message.text).not.toContain("SECRET PROJECT TEXT");
    expect(message.html).not.toContain("SECRET PROJECT TEXT");
    expect(message.tags).toContainEqual({ name: "kind", value: "confirmation" });
  });

  it("uses the partnership wording for partnership requests", () => {
    const message = buildConfirmationEmail({ formType: "partnership", fullName: "Jo Lee", companyEmail: "jo@x.com", submittedAt: "" }, config);
    expect(message.subject).toBe("We received your partnership request, Jo");
    expect(message.text).toContain("partnering with Heroic Rankings");
  });
});
