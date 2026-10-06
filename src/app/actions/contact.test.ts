import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { headersMock } = vi.hoisted(() => {
  return {
    headersMock: vi.fn(),
  };
});

vi.mock("next/headers", () => {
  return {
    headers: headersMock,
  };
});

const ENV_KEYS = [
  "CONTACT_FORM_WEBHOOK_URL",
  "CONTACT_FORM_WEBHOOK_SECRET",
  "CONTACT_FORM_WEBHOOK_MAX_ATTEMPTS",
  "CONTACT_FORM_WEBHOOK_RETRY_BASE_DELAY_MS",
  "CONTACT_FORM_WEBHOOK_ATTEMPT_TIMEOUT_MS",
  "CONTACT_FORM_RATE_LIMIT_WINDOW_MS",
  "CONTACT_FORM_RATE_LIMIT_MAX_SUBMISSIONS",
  "CONTACT_FORM_RATE_LIMIT_STORE_MAX_ENTRIES",
  "UPSTASH_REDIS_REST_URL",
  "UPSTASH_REDIS_REST_TOKEN",
  "MAILJET_API_KEY",
  "MAILJET_SECRET_KEY",
  "MAILJET_FROM_EMAIL",
  "MAILJET_FROM_NAME",
  "CONTACT_FORM_TO",
  "PARTNERSHIP_FORM_TO",
] as const;

function clearContactEnv() {
  for (const key of ENV_KEYS) {
    delete process.env[key];
  }
}

function setContactEnv(values: Partial<Record<(typeof ENV_KEYS)[number], string>>) {
  for (const [key, value] of Object.entries(values)) {
    if (value !== undefined) {
      process.env[key] = value;
    }
  }
}

function createValidFormData() {
  const formData = new FormData();
  formData.set("fullName", "Taylor Swift");
  formData.set("companyName", "Heroic Rankings");
  formData.set("companyEmail", "hello@example.com");
  formData.set("heardFrom", "LinkedIn");
  formData.set("projectOverview", "Need a technical SEO audit.");
  formData.set("submittedAt", String(Date.now() - 5_000));
  formData.set("website", "");
  return formData;
}

async function importSubmitContactForm() {
  vi.resetModules();
  const contactModule = await import("./contact");
  return contactModule.submitContactForm;
}

beforeEach(() => {
  clearContactEnv();
  headersMock.mockReset();
  headersMock.mockResolvedValue(
    new Headers({
      "x-forwarded-for": "203.0.113.1",
      "user-agent": "vitest",
      "x-vercel-ip-country": "US",
    }),
  );

  delete (globalThis as { __contactRateLimitStore?: unknown }).__contactRateLimitStore;
  vi.stubGlobal("fetch", vi.fn());
});

afterEach(() => {
  vi.unstubAllGlobals();
  clearContactEnv();
  delete (globalThis as { __contactRateLimitStore?: unknown }).__contactRateLimitStore;
});

describe("submitContactForm", () => {
  it("returns unavailable state when webhook configuration is incomplete", async () => {
    setContactEnv({
      CONTACT_FORM_WEBHOOK_URL: "https://example.com/webhook",
    });
    const submitContactForm = await importSubmitContactForm();
    const formData = createValidFormData();

    const result = await submitContactForm({ success: false, error: null }, formData);

    expect(result.success).toBe(false);
    expect(result.error).toContain("temporarily unavailable");
    expect(fetch).not.toHaveBeenCalled();
  });

  it("retries transient webhook failures and succeeds on later attempt", async () => {
    setContactEnv({
      CONTACT_FORM_WEBHOOK_URL: "https://example.com/webhook",
      CONTACT_FORM_WEBHOOK_SECRET: "test-secret",
      CONTACT_FORM_WEBHOOK_MAX_ATTEMPTS: "2",
      CONTACT_FORM_WEBHOOK_RETRY_BASE_DELAY_MS: "1",
      CONTACT_FORM_WEBHOOK_ATTEMPT_TIMEOUT_MS: "1000",
    });
    const submitContactForm = await importSubmitContactForm();
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValueOnce(new Response("retry", { status: 503 }));
    fetchMock.mockResolvedValueOnce(new Response("ok", { status: 200 }));

    const result = await submitContactForm({ success: false, error: null }, createValidFormData());

    expect(result.success).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    const firstCallOptions = fetchMock.mock.calls[0]?.[1];
    const firstCallHeaders = firstCallOptions?.headers as Record<string, string>;
    expect(firstCallHeaders["X-Heroic-Signature"]).toMatch(/^[a-f0-9]{64}$/);
    expect(firstCallHeaders["X-Heroic-Signature-Timestamp"]).toMatch(/^\d+$/);
    expect(firstCallHeaders["X-Heroic-Signature-Version"]).toBe("v1");
  });

  it("blocks repeated submissions when rate limit is exceeded", async () => {
    setContactEnv({
      CONTACT_FORM_WEBHOOK_URL: "https://example.com/webhook",
      CONTACT_FORM_WEBHOOK_SECRET: "test-secret",
      CONTACT_FORM_RATE_LIMIT_MAX_SUBMISSIONS: "1",
      CONTACT_FORM_WEBHOOK_MAX_ATTEMPTS: "1",
    });
    const submitContactForm = await importSubmitContactForm();
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValue(new Response("ok", { status: 200 }));

    const firstResult = await submitContactForm({ success: false, error: null }, createValidFormData());
    const secondResult = await submitContactForm({ success: false, error: null }, createValidFormData());

    expect(firstResult.success).toBe(true);
    expect(secondResult.success).toBe(false);
    expect(secondResult.error).toContain("Too many submissions");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("uses distributed rate limiting when Upstash REST config is set", async () => {
    setContactEnv({
      CONTACT_FORM_WEBHOOK_URL: "https://example.com/webhook",
      CONTACT_FORM_WEBHOOK_SECRET: "test-secret",
      CONTACT_FORM_RATE_LIMIT_MAX_SUBMISSIONS: "1",
      CONTACT_FORM_WEBHOOK_MAX_ATTEMPTS: "1",
      UPSTASH_REDIS_REST_URL: "https://redis.example.com",
      UPSTASH_REDIS_REST_TOKEN: "upstash-token",
    });
    const submitContactForm = await importSubmitContactForm();
    const fetchMock = vi.mocked(fetch);
    let distributedCounter = 0;

    fetchMock.mockImplementation(async (input) => {
      const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;

      if (url === "https://redis.example.com/pipeline") {
        distributedCounter += 1;
        return new Response(JSON.stringify([{ result: distributedCounter }, { result: 1 }]), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (url === "https://example.com/webhook") {
        return new Response("ok", { status: 200 });
      }

      return new Response("unexpected", { status: 500 });
    });

    const firstResult = await submitContactForm({ success: false, error: null }, createValidFormData());
    const secondResult = await submitContactForm({ success: false, error: null }, createValidFormData());

    expect(firstResult.success).toBe(true);
    expect(secondResult.success).toBe(false);
    expect(secondResult.error).toContain("Too many submissions");
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });
});

describe("Mailjet delivery", () => {
  const mailjetEnv = {
    MAILJET_API_KEY: "test-key",
    MAILJET_SECRET_KEY: "test-secret",
    MAILJET_FROM_EMAIL: "website@example.com",
    CONTACT_FORM_TO: "sales@example.com, team@example.com",
    PARTNERSHIP_FORM_TO: "partners@example.com",
  };

  it("delivers the contact form through Mailjet when no webhook is configured", async () => {
    setContactEnv(mailjetEnv);
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ Messages: [{ Status: "success" }] }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const submitContactForm = await importSubmitContactForm();

    const result = await submitContactForm({ success: false, error: null }, createValidFormData());

    expect(result).toEqual({ success: true, error: null });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://api.mailjet.com/v3.1/send");
    expect((init.headers as Record<string, string>).Authorization).toBe(`Basic ${Buffer.from("test-key:test-secret").toString("base64")}`);
    const body = JSON.parse(init.body as string) as { Messages: Array<Record<string, unknown>> };
    const message = body.Messages[0]!;
    expect(message.To).toEqual([{ Email: "sales@example.com" }, { Email: "team@example.com" }]);
    expect(message.ReplyTo).toEqual({ Email: "hello@example.com", Name: "Taylor Swift" });
    expect(message.Subject).toBe("New contact request: Taylor Swift · Heroic Rankings");
    expect(message.TextPart).toContain("Need a technical SEO audit.");
  });

  it("sends partnership requests to the partnership recipients", async () => {
    setContactEnv(mailjetEnv);
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ Messages: [{ Status: "success" }] }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    vi.resetModules();
    const { submitPartnershipForm } = await import("./contact");
    const formData = new FormData();
    formData.set("fullName", "Jordan Lee");
    formData.set("companyEmail", "jordan@agency.example");
    formData.set("submittedAt", String(Date.now() - 5_000));
    formData.set("website", "");

    const result = await submitPartnershipForm({ success: false, error: null }, formData);

    expect(result).toEqual({ success: true, error: null });
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const message = (JSON.parse(init.body as string) as { Messages: Array<Record<string, unknown>> }).Messages[0]!;
    expect(message.To).toEqual([{ Email: "partners@example.com" }]);
    expect(message.Subject).toBe("New partnership request: Jordan Lee");
    expect(message.CustomID).toBe("website-partnership");
  });

  it("treats a 200 with a per-message error as a failed delivery", async () => {
    setContactEnv(mailjetEnv);
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ Messages: [{ Status: "error", Errors: [{ ErrorMessage: "bad sender" }] }] }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const submitContactForm = await importSubmitContactForm();

    const result = await submitContactForm({ success: false, error: null }, createValidFormData());

    expect(result.success).toBe(false);
    expect(result.error).toContain("could not submit");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("counts the submission as delivered when Mailjet succeeds and the webhook fails", async () => {
    setContactEnv({ ...mailjetEnv, CONTACT_FORM_WEBHOOK_URL: "https://hooks.example.com/contact", CONTACT_FORM_WEBHOOK_SECRET: "s", CONTACT_FORM_WEBHOOK_MAX_ATTEMPTS: "1" });
    const fetchMock = vi.fn(async (url: string) =>
      url.startsWith("https://api.mailjet.com") ? new Response(JSON.stringify({ Messages: [{ Status: "success" }] }), { status: 200 }) : new Response("nope", { status: 400 }),
    );
    vi.stubGlobal("fetch", fetchMock);
    const submitContactForm = await importSubmitContactForm();

    const result = await submitContactForm({ success: false, error: null }, createValidFormData());

    expect(result).toEqual({ success: true, error: null });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
