# Production Runbook

## 1) Required Secrets
Set these in the deployment platform for each environment:

- `NEXT_PUBLIC_SITE_URL`

Form delivery (contact form and partnership request) goes through Resend, from the verified subdomain `notifications.heroicrankings.com`. That subdomain is deliberately separate from the company mailboxes (Google Workspace on the root domain) and from `portal.heroicrankings.com`, so the forms cannot affect their reputation. The previous site used Mailjet; it keeps serving heroicrankings.com until the DNS switch and is not needed afterwards.

- `RESEND_API_KEY`: a Resend API key with sending permission for the domain.
- `RESEND_FROM_EMAIL`: optional; defaults to `Heroic Rankings <hello@notifications.heroicrankings.com>`. Must be an address on a Resend-verified domain.
- `CONTACT_FORM_TO`: comma-separated recipients of contact-form emails (the current contact group).
- `PARTNERSHIP_FORM_TO`: comma-separated recipients of partnership requests; falls back to `CONTACT_FORM_TO`.
- `FORM_REPLY_TO`: optional Reply-To on the visitor confirmation; defaults to sales@heroicrankings.com.
- `FORM_CONFIRMATION_ENABLED`: optional; `false` turns off the visitor confirmation email.

Each submission sends two emails: the team notification (the submitter is its Reply-To; it must be accepted for the submission to count as delivered) and a short confirmation to the visitor (best effort, never echoes the visitor's text). Requests carry an `Idempotency-Key`, so a retry after a timeout cannot double-send.

Optional secondary feed, a signed JSON webhook (set both or neither): `CONTACT_FORM_WEBHOOK_URL`, `CONTACT_FORM_WEBHOOK_SECRET`. A submission counts as delivered when at least one configured channel accepts it.

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

- `contact_form_event {"event":"contact_config_missing"...}`: no delivery channel configured (neither Resend nor webhook).
- `contact_form_event {"event":"resend_delivery_failed"...}` / `webhook_delivery_failed`: one channel rejected the submission (warn if the other delivered, error otherwise).
- `contact_form_event {"event":"confirmation_failed"...}`: the visitor confirmation was not accepted; the submission itself was delivered.
- `contact_form_event {"event":"rate_limit_degraded_to_memory"...}`: distributed limiter unavailable.
- `contact_form_event {"event":"submission_delivery_failed"...}`: webhook delivery failure.
