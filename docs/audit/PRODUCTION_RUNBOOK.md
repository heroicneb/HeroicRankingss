# Production Runbook

## 1) Required Secrets
Set these in the deployment platform for each environment:

- `NEXT_PUBLIC_SITE_URL`
- `CONTACT_FORM_WEBHOOK_URL`
- `CONTACT_FORM_WEBHOOK_SECRET`

Optional distributed limiter (set both or neither):

- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

## 2) Pre-Deploy Validation
Run locally or in CI with production-equivalent env values:

```bash
npm run verify:prod-config
npm run lint
npm run test
npm run typecheck
npm run build
```

## 3) Post-Deploy Smoke Checks
Replace `$BASE_URL` with production hostname.

Automated runtime checks:

```bash
npm run verify:prod-runtime -- "$BASE_URL"
```

Release gate: treat any `FAIL` line (or non-zero exit code) from `verify:prod-runtime` as a deployment blocker.

1. CSP header and nonce policy:
```bash
curl -sI "$BASE_URL" | grep -i "content-security-policy"
```
Expected:
- `Content-Security-Policy` header is present.
- Policy contains nonce-based `script-src` and `style-src`.
- Policy does not include `'unsafe-inline'`.

2. Contact happy path:
- Submit the contact form once from UI.
- Expect success message.
- Confirm receiver gets signed payload (`X-Heroic-Signature*` headers).

3. Contact rate limiting:
- Submit the form repeatedly from same client in a short window.
- Expect throttle error after limit.
- Check logs for `contact_form_event` entries and backend (`upstash` if configured).

## 4) Runtime Log Signals
Monitor for:

- `contact_form_event {"event":"contact_config_missing"...}`: missing webhook env.
- `contact_form_event {"event":"rate_limit_degraded_to_memory"...}`: distributed limiter unavailable.
- `contact_form_event {"event":"submission_delivery_failed"...}`: webhook delivery failure.
