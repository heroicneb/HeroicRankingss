"use server";

import { createHash, createHmac } from "node:crypto";
import { headers } from "next/headers";

import {
  CONTACT_FORM_MAX_EMAIL_LENGTH,
  CONTACT_FORM_MAX_NAME_LENGTH,
  CONTACT_FORM_MAX_PROJECT_OVERVIEW_LENGTH,
  isAllowedContactHeardFrom,
  isValidContactEmail,
} from "@/lib/contact-validation";
import { SALES_EMAIL } from "@/lib/site";

export interface ContactFormState {
  success: boolean;
  error: string | null;
}

interface ContactSubmissionPayload {
  companyEmail: string;
  companyName: string;
  fullName: string;
  heardFrom: string;
  projectOverview: string;
  submittedAt: string;
}

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

interface DispatchResult {
  attempts: number;
  errorType: "http_error" | "network_error" | "unconfigured" | null;
  lastStatusCode: number | null;
  configured: boolean;
  delivered: boolean;
}

const MIN_HUMAN_SUBMIT_MS = 1500;
const WEBHOOK_RETRYABLE_STATUS_CODES = new Set([408, 429, 500, 502, 503, 504]);
const DEFAULT_RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const DEFAULT_RATE_LIMIT_MAX_SUBMISSIONS = 5;
const DEFAULT_RATE_LIMIT_STORE_MAX_ENTRIES = 10_000;
const DEFAULT_WEBHOOK_MAX_ATTEMPTS = 3;
const DEFAULT_WEBHOOK_RETRY_BASE_DELAY_MS = 250;
const DEFAULT_WEBHOOK_ATTEMPT_TIMEOUT_MS = 2500;
const WEBHOOK_SIGNATURE_VERSION = "v1";

const CONTACT_FORM_WEBHOOK_URL = process.env.CONTACT_FORM_WEBHOOK_URL?.trim() ?? "";
const CONTACT_FORM_WEBHOOK_SECRET = process.env.CONTACT_FORM_WEBHOOK_SECRET?.trim() ?? "";
const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL?.trim() ?? "";
const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN?.trim() ?? "";
const CONTACT_FORM_RATE_LIMIT_WINDOW_MS = getPositiveIntEnv("CONTACT_FORM_RATE_LIMIT_WINDOW_MS", DEFAULT_RATE_LIMIT_WINDOW_MS);
const CONTACT_FORM_RATE_LIMIT_MAX_SUBMISSIONS = getPositiveIntEnv("CONTACT_FORM_RATE_LIMIT_MAX_SUBMISSIONS", DEFAULT_RATE_LIMIT_MAX_SUBMISSIONS);
const CONTACT_FORM_RATE_LIMIT_STORE_MAX_ENTRIES = getPositiveIntEnv(
  "CONTACT_FORM_RATE_LIMIT_STORE_MAX_ENTRIES",
  DEFAULT_RATE_LIMIT_STORE_MAX_ENTRIES,
);
const CONTACT_FORM_WEBHOOK_MAX_ATTEMPTS = getPositiveIntEnv("CONTACT_FORM_WEBHOOK_MAX_ATTEMPTS", DEFAULT_WEBHOOK_MAX_ATTEMPTS);
const CONTACT_FORM_WEBHOOK_RETRY_BASE_DELAY_MS = getPositiveIntEnv(
  "CONTACT_FORM_WEBHOOK_RETRY_BASE_DELAY_MS",
  DEFAULT_WEBHOOK_RETRY_BASE_DELAY_MS,
);
const CONTACT_FORM_WEBHOOK_ATTEMPT_TIMEOUT_MS = getPositiveIntEnv(
  "CONTACT_FORM_WEBHOOK_ATTEMPT_TIMEOUT_MS",
  DEFAULT_WEBHOOK_ATTEMPT_TIMEOUT_MS,
);
const DISTRIBUTED_RATE_LIMIT_ENABLED = UPSTASH_REDIS_REST_URL !== "" && UPSTASH_REDIS_REST_TOKEN !== "";

declare global {
  var __contactRateLimitStore: Map<string, RateLimitEntry> | undefined;
}

function logContactEvent(
  level: "error" | "info" | "warn",
  event: string,
  details: Record<string, number | string | boolean | null>,
) {
  const payload = {
    event,
    ...details,
  };

  console[level]("contact_form_event", JSON.stringify(payload));
}

if (process.env.NODE_ENV === "production" && (CONTACT_FORM_WEBHOOK_URL === "" || CONTACT_FORM_WEBHOOK_SECRET === "")) {
  logContactEvent("warn", "contact_config_missing", {
    webhookSecretConfigured: CONTACT_FORM_WEBHOOK_SECRET !== "",
    webhookUrlConfigured: CONTACT_FORM_WEBHOOK_URL !== "",
  });
}

function getPositiveIntEnv(key: string, fallback: number) {
  const value = process.env[key];

  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
}

function getRequiredString(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return null;
  }

  return value.trim();
}

function getOptionalString(formData: FormData, key: string) {
  const value = formData.get(key);

  if (value === null) {
    return "";
  }

  if (typeof value !== "string") {
    return null;
  }

  return value.trim();
}

function getRateLimitStore() {
  if (!globalThis.__contactRateLimitStore) {
    globalThis.__contactRateLimitStore = new Map<string, RateLimitEntry>();
  }

  return globalThis.__contactRateLimitStore;
}

function pruneRateLimitStore(store: Map<string, RateLimitEntry>, now: number) {
  if (store.size < CONTACT_FORM_RATE_LIMIT_STORE_MAX_ENTRIES) {
    return;
  }

  for (const [key, entry] of store) {
    if (now - entry.windowStart >= CONTACT_FORM_RATE_LIMIT_WINDOW_MS) {
      store.delete(key);
    }

    if (store.size < CONTACT_FORM_RATE_LIMIT_STORE_MAX_ENTRIES) {
      return;
    }
  }

  while (store.size >= CONTACT_FORM_RATE_LIMIT_STORE_MAX_ENTRIES) {
    const oldestKey = store.keys().next().value;
    if (!oldestKey) {
      return;
    }

    store.delete(oldestKey);
  }
}

function consumeInMemoryRateLimitToken(rateLimitKey: string, now: number) {
  const store = getRateLimitStore();
  pruneRateLimitStore(store, now);

  const existing = store.get(rateLimitKey);

  if (!existing || now - existing.windowStart >= CONTACT_FORM_RATE_LIMIT_WINDOW_MS) {
    store.set(rateLimitKey, { count: 1, windowStart: now });
    return true;
  }

  if (existing.count >= CONTACT_FORM_RATE_LIMIT_MAX_SUBMISSIONS) {
    return false;
  }

  existing.count += 1;
  return true;
}

function extractPipelineResultValues(payload: unknown) {
  const resultEntries = Array.isArray(payload)
    ? payload
    : payload && typeof payload === "object" && Array.isArray((payload as { result?: unknown }).result)
      ? (payload as { result: unknown[] }).result
      : null;

  if (!resultEntries) {
    return null;
  }

  return resultEntries.map((entry) => {
    if (entry && typeof entry === "object" && "result" in entry) {
      return (entry as { result: unknown }).result;
    }

    return entry;
  });
}

function parseIncrementResult(payload: unknown) {
  const results = extractPipelineResultValues(payload);
  const firstResult = results?.[0];

  if (typeof firstResult === "number") {
    return firstResult;
  }

  if (typeof firstResult === "string") {
    const parsed = Number.parseInt(firstResult, 10);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

async function consumeDistributedRateLimitToken(rateLimitKey: string) {
  if (!DISTRIBUTED_RATE_LIMIT_ENABLED) {
    return null;
  }

  const redisKey = `contact:rate-limit:${rateLimitKey}`;
  const endpoint = `${UPSTASH_REDIS_REST_URL}/pipeline`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        ["INCR", redisKey],
        ["PEXPIRE", redisKey, String(CONTACT_FORM_RATE_LIMIT_WINDOW_MS), "NX"],
      ]),
    });

    if (!response.ok) {
      logContactEvent("warn", "rate_limit_distributed_unavailable", {
        statusCode: response.status,
      });
      return null;
    }

    const payload = (await response.json()) as unknown;
    const currentCount = parseIncrementResult(payload);

    if (currentCount === null) {
      logContactEvent("warn", "rate_limit_distributed_parse_failed", {
        hasPayload: payload !== null,
      });
      return null;
    }

    return currentCount <= CONTACT_FORM_RATE_LIMIT_MAX_SUBMISSIONS;
  } catch (error) {
    logContactEvent("warn", "rate_limit_distributed_error", {
      message: error instanceof Error ? error.message : "unknown_error",
    });
    return null;
  }
}

async function consumeRateLimitToken(rateLimitKey: string, now: number) {
  const distributedResult = await consumeDistributedRateLimitToken(rateLimitKey);

  if (distributedResult !== null) {
    return {
      allowed: distributedResult,
      backend: "upstash",
      degraded: false,
    } as const;
  }

  const inMemoryResult = consumeInMemoryRateLimitToken(rateLimitKey, now);

  return {
    allowed: inMemoryResult,
    backend: "in_memory",
    degraded: DISTRIBUTED_RATE_LIMIT_ENABLED,
  } as const;
}

function buildRateLimitKey(requestHeaders: Headers) {
  const ip = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown-ip";
  const userAgent = requestHeaders.get("user-agent")?.trim() ?? "unknown-user-agent";
  const country = requestHeaders.get("x-vercel-ip-country")?.trim() ?? "unknown-country";

  return createHash("sha256").update(`${ip}:${country}:${userAgent}`).digest("hex");
}

function createSignedWebhookHeaders(serializedPayload: string) {
  const timestamp = Date.now().toString();
  const signature = createHmac("sha256", CONTACT_FORM_WEBHOOK_SECRET)
    .update(`${timestamp}.${serializedPayload}`)
    .digest("hex");

  return {
    "Content-Type": "application/json",
    "X-Heroic-Signature": signature,
    "X-Heroic-Signature-Timestamp": timestamp,
    "X-Heroic-Signature-Version": WEBHOOK_SIGNATURE_VERSION,
  };
}

function getRetryDelayMs(attempt: number) {
  const exponential = CONTACT_FORM_WEBHOOK_RETRY_BASE_DELAY_MS * 2 ** (attempt - 1);
  return Math.min(exponential, 2500);
}

function shouldRetryStatusCode(statusCode: number) {
  return WEBHOOK_RETRYABLE_STATUS_CODES.has(statusCode);
}

function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function dispatchContactSubmission(payload: ContactSubmissionPayload): Promise<DispatchResult> {
  if (CONTACT_FORM_WEBHOOK_URL === "" || CONTACT_FORM_WEBHOOK_SECRET === "") {
    return {
      configured: false,
      delivered: false,
      attempts: 0,
      errorType: "unconfigured",
      lastStatusCode: null,
    };
  }

  const serializedPayload = JSON.stringify(payload);
  let lastStatusCode: number | null = null;

  for (let attempt = 1; attempt <= CONTACT_FORM_WEBHOOK_MAX_ATTEMPTS; attempt += 1) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CONTACT_FORM_WEBHOOK_ATTEMPT_TIMEOUT_MS);

    try {
      const response = await fetch(CONTACT_FORM_WEBHOOK_URL, {
        method: "POST",
        headers: createSignedWebhookHeaders(serializedPayload),
        body: serializedPayload,
        cache: "no-store",
        signal: controller.signal,
      });

      if (response.ok) {
        return {
          configured: true,
          delivered: true,
          attempts: attempt,
          errorType: null,
          lastStatusCode: response.status,
        };
      }

      lastStatusCode = response.status;
      const retryable = shouldRetryStatusCode(response.status);
      const isFinalAttempt = attempt >= CONTACT_FORM_WEBHOOK_MAX_ATTEMPTS;

      if (!retryable || isFinalAttempt) {
        return {
          configured: true,
          delivered: false,
          attempts: attempt,
          errorType: "http_error",
          lastStatusCode: response.status,
        };
      }
    } catch (error) {
      const isFinalAttempt = attempt >= CONTACT_FORM_WEBHOOK_MAX_ATTEMPTS;

      if (isFinalAttempt) {
        logContactEvent("error", "webhook_dispatch_failed", {
          attempts: attempt,
          message: error instanceof Error ? error.message : "unknown_error",
        });

        return {
          configured: true,
          delivered: false,
          attempts: attempt,
          errorType: "network_error",
          lastStatusCode,
        };
      }
    } finally {
      clearTimeout(timeoutId);
    }

    await sleep(getRetryDelayMs(attempt));
  }

  return {
    configured: true,
    delivered: false,
    attempts: CONTACT_FORM_WEBHOOK_MAX_ATTEMPTS,
    errorType: "network_error",
    lastStatusCode,
  };
}

export async function submitContactForm(
  _previousState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const requestHeaders = await headers();

  const honeypot = formData.get("website");

  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    logContactEvent("warn", "submission_blocked_honeypot", {
      botSignalDetected: true,
    });
    return { success: true, error: null };
  }

  if (honeypot !== null && typeof honeypot !== "string") {
    logContactEvent("warn", "submission_invalid_payload", {
      reason: "honeypot_not_string",
    });
    return { success: false, error: "Invalid submission payload." };
  }

  const rateLimitKey = buildRateLimitKey(requestHeaders);
  const rateLimitResult = await consumeRateLimitToken(rateLimitKey, Date.now());

  if (rateLimitResult.degraded) {
    logContactEvent("warn", "rate_limit_degraded_to_memory", {
      backend: rateLimitResult.backend,
      distributedConfigured: DISTRIBUTED_RATE_LIMIT_ENABLED,
    });
  }

  if (!rateLimitResult.allowed) {
    logContactEvent("warn", "submission_rate_limited", {
      backend: rateLimitResult.backend,
    });
    return {
      success: false,
      error: "Too many submissions from this device. Please wait a few minutes and try again.",
    };
  }

  const submittedAt = getOptionalString(formData, "submittedAt");
  if (submittedAt === null) {
    logContactEvent("warn", "submission_invalid_payload", {
      reason: "submitted_at_not_string",
    });
    return { success: false, error: "Invalid submission payload." };
  }

  const submittedAtMs = Number(submittedAt);
  if (submittedAt !== "" && Number.isFinite(submittedAtMs) && Date.now() - submittedAtMs < MIN_HUMAN_SUBMIT_MS) {
    logContactEvent("warn", "submission_blocked_too_fast", {
      elapsedMs: Date.now() - submittedAtMs,
    });
    return { success: false, error: "Please wait a moment before submitting the form." };
  }

  const fullName = getRequiredString(formData, "fullName");
  const companyName = getRequiredString(formData, "companyName");
  const companyEmail = getRequiredString(formData, "companyEmail");
  const heardFrom = getOptionalString(formData, "heardFrom");
  const projectOverview = getOptionalString(formData, "projectOverview");

  // Validate required fields
  if (fullName === null || companyName === null || companyEmail === null || heardFrom === null || projectOverview === null) {
    logContactEvent("warn", "submission_invalid_payload", {
      reason: "required_field_not_string",
    });
    return { success: false, error: "Please fill in all required fields." };
  }

  if (fullName === "") {
    logContactEvent("warn", "submission_validation_failed", {
      reason: "full_name_required",
    });
    return { success: false, error: "Full name is required." };
  }

  if (companyName === "") {
    logContactEvent("warn", "submission_validation_failed", {
      reason: "company_name_required",
    });
    return { success: false, error: "Company name is required." };
  }

  if (companyEmail === "" || !isValidContactEmail(companyEmail)) {
    logContactEvent("warn", "submission_validation_failed", {
      reason: "invalid_email",
    });
    return { success: false, error: "A valid email address is required." };
  }

  if (fullName.length > CONTACT_FORM_MAX_NAME_LENGTH || companyName.length > CONTACT_FORM_MAX_NAME_LENGTH) {
    logContactEvent("warn", "submission_validation_failed", {
      reason: "name_too_long",
    });
    return { success: false, error: "Name fields are too long." };
  }

  if (companyEmail.length > CONTACT_FORM_MAX_EMAIL_LENGTH) {
    logContactEvent("warn", "submission_validation_failed", {
      reason: "email_too_long",
    });
    return { success: false, error: "Email address is too long." };
  }

  if (!isAllowedContactHeardFrom(heardFrom)) {
    logContactEvent("warn", "submission_validation_failed", {
      reason: "invalid_heard_from",
    });
    return { success: false, error: "Please choose a valid source option." };
  }

  if (projectOverview.length > CONTACT_FORM_MAX_PROJECT_OVERVIEW_LENGTH) {
    logContactEvent("warn", "submission_validation_failed", {
      reason: "project_overview_too_long",
    });
    return { success: false, error: "Project overview is too long." };
  }

  try {
    const dispatchResult = await dispatchContactSubmission({
      fullName,
      companyName,
      companyEmail: companyEmail.toLowerCase(),
      heardFrom,
      projectOverview,
      submittedAt,
    });

    if (!dispatchResult.delivered) {
      if (!dispatchResult.configured) {
        logContactEvent("error", "submission_delivery_unavailable", {
          reason: dispatchResult.errorType,
        });
        return {
          success: false,
          error: `Contact form is temporarily unavailable. Please email ${SALES_EMAIL}.`,
        };
      }

      logContactEvent("error", "submission_delivery_failed", {
        attempts: dispatchResult.attempts,
        errorType: dispatchResult.errorType,
        statusCode: dispatchResult.lastStatusCode,
      });
      return {
        success: false,
        error: `We could not submit your request right now. Please try again or email ${SALES_EMAIL}.`,
      };
    }
  } catch (error) {
    logContactEvent("error", "submission_unexpected_error", {
      message: error instanceof Error ? error.message : "unknown_error",
    });
    return {
      success: false,
      error: `We could not submit your request right now. Please try again or email ${SALES_EMAIL}.`,
    };
  }

  logContactEvent("info", "submission_delivered", {
    rateLimitBackend: rateLimitResult.backend,
  });

  return { success: true, error: null };
}
