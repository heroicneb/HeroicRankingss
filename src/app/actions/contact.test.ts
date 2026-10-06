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
  "RESEND_API_KEY",
  "RESEND_FROM_EMAIL",
  "CONTACT_FORM_TO",
  "PARTNERSHIP_FORM_TO",
  "FORM_REPLY_TO",
  "FORM_CONFIRMATION_ENABLED",
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

describe("Resend delivery", () => {
  const resendEnv = {
    RESEND_API_KEY: "re_test",
    RESEND_FROM_EMAIL: "Heroic Rankings <hello@notifications.example.com>",
    CONTACT_FORM_TO: "sales@example.com, team@example.com",
    PARTNERSHIP_FORM_TO: "partners@example.com",
  };
  const ok = () => new Response(JSON.stringify({ id: "msg_1" }), { status: 200 });
  const parseBody = (init: RequestInit) => JSON.parse(init.body as string) as Record<string, unknown>;
  const call = (fetchMock: ReturnType<typeof vi.fn>, index: number) => fetchMock.mock.calls[index] as unknown as [string, RequestInit];

  it("emails the team through Resend and then confirms to the visitor", async () => {
    setContactEnv(resendEnv);
    const fetchMock = vi.fn(async () => ok());
    vi.stubGlobal("fetch", fetchMock);
    const submitContactForm = await importSubmitContactForm();

    const result = await submitContactForm({ success: false, error: null }, createValidFormData());

    expect(result).toEqual({ success: true, error: null });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    const [teamUrl, teamInit] = call(fetchMock, 0);
    expect(teamUrl).toBe("https://api.resend.com/emails");
    const headers = teamInit.headers as Record<string, string>;
    expect(headers.Authorization).toBe("Bearer re_test");
    expect(headers["Idempotency-Key"]).toMatch(/^[a-f0-9]{64}$/);
    const team = parseBody(teamInit);
    expect(team.from).toBe(resendEnv.RESEND_FROM_EMAIL);
    expect(team.to).toEqual(["sales@example.com", "team@example.com"]);
    expect(team.reply_to).toBe("hello@example.com");
    expect(team.subject).toBe("New contact request: Taylor Swift · Heroic Rankings");
    expect(team.text).toContain("Need a technical SEO audit.");

    const [, confirmInit] = call(fetchMock, 1);
    const confirmation = parseBody(confirmInit);
    expect(confirmation.to).toEqual(["hello@example.com"]);
    expect(confirmation.reply_to).toBe("sales@heroicrankings.com");
    expect(confirmation.subject).toBe("We received your message, Taylor");
    // WHY: the confirmation must never echo the visitor's text.
    expect(confirmation.text).not.toContain("Need a technical SEO audit.");
    expect((confirmInit.headers as Record<string, string>)["Idempotency-Key"]).not.toBe(headers["Idempotency-Key"]);
  });

  it("sends partnership requests to the partnership recipients", async () => {
    setContactEnv(resendEnv);
    const fetchMock = vi.fn(async () => ok());
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
    const team = parseBody(call(fetchMock, 0)[1]);
    expect(team.to).toEqual(["partners@example.com"]);
    expect(team.subject).toBe("New partnership request: Jordan Lee");
    const confirmation = parseBody(call(fetchMock, 1)[1]);
    expect(confirmation.subject).toBe("We received your partnership request, Jordan");
  });

  it("skips the confirmation when it is disabled, and still delivers", async () => {
    setContactEnv({ ...resendEnv, FORM_CONFIRMATION_ENABLED: "false" });
    const fetchMock = vi.fn(async () => ok());
    vi.stubGlobal("fetch", fetchMock);
    const submitContactForm = await importSubmitContactForm();

    const result = await submitContactForm({ success: false, error: null }, createValidFormData());

    expect(result).toEqual({ success: true, error: null });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("fails the submission when Resend rejects the team email, without sending a confirmation", async () => {
    setContactEnv(resendEnv);
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ statusCode: 403, message: "domain not verified" }), { status: 403 }));
    vi.stubGlobal("fetch", fetchMock);
    const submitContactForm = await importSubmitContactForm();

    const result = await submitContactForm({ success: false, error: null }, createValidFormData());

    expect(result.success).toBe(false);
    expect(result.error).toContain("could not submit");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("still succeeds when the confirmation fails after the team email was accepted", async () => {
    setContactEnv(resendEnv);
    let calls = 0;
    const fetchMock = vi.fn(async () => (++calls === 1 ? ok() : new Response("{}", { status: 422 })));
    vi.stubGlobal("fetch", fetchMock);
    const submitContactForm = await importSubmitContactForm();

    const result = await submitContactForm({ success: false, error: null }, createValidFormData());

    expect(result).toEqual({ success: true, error: null });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("counts the submission as delivered when Resend succeeds and the webhook fails", async () => {
    setContactEnv({ ...resendEnv, FORM_CONFIRMATION_ENABLED: "false", CONTACT_FORM_WEBHOOK_URL: "https://hooks.example.com/contact", CONTACT_FORM_WEBHOOK_SECRET: "s", CONTACT_FORM_WEBHOOK_MAX_ATTEMPTS: "1" });
    const fetchMock = vi.fn(async (url: string) => (url.startsWith("https://api.resend.com") ? ok() : new Response("nope", { status: 400 })));
    vi.stubGlobal("fetch", fetchMock);
    const submitContactForm = await importSubmitContactForm();

    const result = await submitContactForm({ success: false, error: null }, createValidFormData());

    expect(result).toEqual({ success: true, error: null });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
