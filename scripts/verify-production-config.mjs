#!/usr/bin/env node

const REQUIRED_ENV_KEYS = [
  "NEXT_PUBLIC_SITE_URL",
  "CONTACT_FORM_WEBHOOK_URL",
  "CONTACT_FORM_WEBHOOK_SECRET",
];

const OPTIONAL_PAIR_KEYS = ["UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN"];

function isHttpUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function getEnvValue(key) {
  return process.env[key]?.trim() ?? "";
}

const missing = [];
const invalid = [];

for (const key of REQUIRED_ENV_KEYS) {
  const value = getEnvValue(key);
  if (value === "") {
    missing.push(key);
  }
}

for (const key of ["NEXT_PUBLIC_SITE_URL", "CONTACT_FORM_WEBHOOK_URL"]) {
  const value = getEnvValue(key);
  if (value !== "" && !isHttpUrl(value)) {
    invalid.push(`${key} must be a valid http(s) URL`);
  }
}

const optionalPairValues = OPTIONAL_PAIR_KEYS.map((key) => getEnvValue(key));
const isOptionalPairPartiallySet = optionalPairValues.some((value) => value !== "") && optionalPairValues.some((value) => value === "");

if (isOptionalPairPartiallySet) {
  invalid.push(`${OPTIONAL_PAIR_KEYS.join(" and ")} must be set together`);
}

for (const key of OPTIONAL_PAIR_KEYS) {
  const value = getEnvValue(key);
  if (value !== "" && key.endsWith("_URL") && !isHttpUrl(value)) {
    invalid.push(`${key} must be a valid http(s) URL`);
  }
}

if (missing.length > 0 || invalid.length > 0) {
  console.error("Production config verification failed.");

  if (missing.length > 0) {
    console.error(`Missing required env keys: ${missing.join(", ")}`);
  }

  if (invalid.length > 0) {
    for (const issue of invalid) {
      console.error(`Invalid config: ${issue}`);
    }
  }

  process.exitCode = 1;
} else {
  console.log("Production config verification passed.");
}
