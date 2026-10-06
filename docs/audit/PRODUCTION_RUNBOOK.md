# Production Runbook

## 1) Required Secrets
Set these in the deployment platform for each environment:

- `NEXT_PUBLIC_SITE_URL`

Form delivery (contact form and partnership request). Mailjet is the primary channel, the same provider the previous heroicrankings.com used (its SPF record includes `spf.mailjet.com` and a `mailjet._domainkey` DKIM record is published):

- `MAILJET_API_KEY` and `MAILJET_SECRET_KEY`: the REST API key pair from Mailjet → Account settings → API Key Management.
- `MAILJET_FROM_EMAIL`: a sender address validated on the Mailjet account (e.g. the one the old site used). `MAILJET_FROM_NAME` is optional.
- `CONTACT_FORM_TO`: comma-separated recipients of contact-form emails (the current contact group).
- `PARTNERSHIP_FORM_TO`: comma-separated recipients of partnership requests; falls back to `CONTACT_FORM_TO`.

Optional secondary feed, a signed JSON webhook (set both or neither): `CONTACT_FORM_WEBHOOK_URL`, `CONTACT_FORM_WEBHOOK_SECRET`. A submission counts as delivered when at least one configured channel accepts it. Emails carry the submitter as Reply-To, so the team answers from their inbox.

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

- `contact_form_event {"event":"contact_config_missing"...}`: no delivery channel configured (neither Mailjet nor webhook).
- `contact_form_event {"event":"mailjet_delivery_failed"...}` / `webhook_delivery_failed`: one channel rejected the submission (warn if the other delivered, error otherwise).
- `contact_form_event {"event":"rate_limit_degraded_to_memory"...}`: distributed limiter unavailable.
- `contact_form_event {"event":"submission_delivery_failed"...}`: webhook delivery failure.
