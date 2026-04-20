#!/usr/bin/env node

const target = process.argv[2]?.trim() ?? process.env.BASE_URL?.trim() ?? "";

if (target === "") {
  console.error("Missing target URL. Usage: node scripts/verify-production-runtime.mjs https://example.com");
  process.exit(1);
}

let baseUrl;
try {
  baseUrl = new URL(target);
  if (!["http:", "https:"].includes(baseUrl.protocol)) {
    throw new Error("URL must be http(s)");
  }
} catch (error) {
  console.error(`Invalid target URL: ${error instanceof Error ? error.message : "unknown_error"}`);
  process.exit(1);
}

const checks = [];

async function request(pathname) {
  const url = new URL(pathname, baseUrl).toString();
  const response = await fetch(url, { redirect: "follow" });
  return { url, response };
}

function addCheck(name, passed, detail) {
  checks.push({ detail, name, passed });
}

function getHeader(response, name) {
  return response.headers.get(name) ?? "";
}

async function run() {
  const homepage = await request("/");
  addCheck("Homepage responds with 200", homepage.response.status === 200, `status=${homepage.response.status}`);

  const csp = getHeader(homepage.response, "content-security-policy");
  addCheck("CSP header present", csp !== "", csp === "" ? "missing" : "present");
  addCheck("CSP removes unsafe-inline", !csp.includes("'unsafe-inline'"), csp);
  addCheck("CSP includes nonce-based script-src", /script-src[^;]*'nonce-[^']+'/.test(csp), csp);
  addCheck("CSP includes nonce-based style-src", /style-src[^;]*'nonce-[^']+'/.test(csp), csp);

  const poweredBy = getHeader(homepage.response, "x-powered-by");
  addCheck("x-powered-by header removed", poweredBy === "", poweredBy === "" ? "absent" : poweredBy);

  const xcto = getHeader(homepage.response, "x-content-type-options");
  addCheck("X-Content-Type-Options set", xcto.toLowerCase() === "nosniff", xcto);

  const xfo = getHeader(homepage.response, "x-frame-options");
  addCheck("X-Frame-Options set", xfo.toUpperCase() === "DENY", xfo);

  const robots = await request("/robots.txt");
  addCheck("robots.txt responds with 200", robots.response.status === 200, `status=${robots.response.status}`);

  const sitemap = await request("/sitemap.xml");
  addCheck("sitemap.xml responds with 200", sitemap.response.status === 200, `status=${sitemap.response.status}`);

  let failures = 0;
  for (const check of checks) {
    const prefix = check.passed ? "PASS" : "FAIL";
    console.log(`[${prefix}] ${check.name} (${check.detail})`);
    if (!check.passed) {
      failures += 1;
    }
  }

  if (failures > 0) {
    console.error(`Runtime verification failed: ${failures} check(s) failed.`);
    process.exit(1);
  }

  console.log("Runtime verification passed.");
}

run().catch((error) => {
  console.error(`Runtime verification crashed: ${error instanceof Error ? error.message : "unknown_error"}`);
  process.exit(1);
});
