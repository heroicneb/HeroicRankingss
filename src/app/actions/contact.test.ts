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
