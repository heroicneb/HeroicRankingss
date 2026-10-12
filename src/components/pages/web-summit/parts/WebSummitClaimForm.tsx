"use client";

import { useActionState, useEffect, useRef, useState } from "react";

import { submitWebSummitForm, type ContactFormState } from "@/app/actions/contact";
import { WEB_SUMMIT_CONTENT } from "@/components/pages/web-summit/web-summit-content";
import { CONTACT_FORM_MAX_EMAIL_LENGTH, CONTACT_FORM_MAX_NAME_LENGTH, isValidContactEmail } from "@/lib/contact-validation";
import { cn } from "@/lib/cn";

/*
 * The Heroic Five claim form: name, work email, company, the site to audit,
 * an optional worry, and the "I spoke with the team" checkbox. Same panel
 * style as the partnership request form; submits through the Resend-backed
 * contact action with the "websummit" marker.
 */

const LABEL_CLASS = "block text-[16px] font-medium leading-[20px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]";
const FIELD_CLASS =
  "mt-2 w-full rounded-[12px] border bg-transparent px-[13px] text-[17px] font-normal leading-[24px] text-[var(--color-hr-dark)] placeholder:text-[var(--color-form-placeholder)] focus-visible:outline-none dark:bg-[var(--color-bg-dark)] dark:text-[var(--color-text-inverse)] dark:placeholder:text-[var(--color-text-inverse-30)]";
const FIELD_BORDER_CLASS = "border-[var(--color-form-border-subtle)] focus-visible:border-[var(--color-hr-accent)] dark:border-[var(--color-border-inverse-20)]";
const MAX_WORRY_LENGTH = 1000;

function looksLikeUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return false;
  try {
    const url = new URL(/^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`);
    return url.hostname.includes(".");
  } catch {
    return false;
  }
}

export function WebSummitClaimForm() {
  const form = WEB_SUMMIT_CONTENT.form;
  const [state, formAction, isPending] = useActionState<ContactFormState, FormData>(submitWebSummitForm, { success: false, error: null });
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [website, setWebsite] = useState("");
  const [touched, setTouched] = useState<{ email?: boolean; website?: boolean }>({});
  // WHY: the anti-bot timer needs a client timestamp; rendering it on the server would mismatch, so it is written into the hidden field after mount.
  const submittedAtRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (submittedAtRef.current) submittedAtRef.current.value = String(Date.now());
  }, []);

  const emailInvalid = Boolean(touched.email) && email.trim() !== "" && !isValidContactEmail(email.trim());
  const websiteInvalid = Boolean(touched.website) && website.trim() !== "" && !looksLikeUrl(website);
  const canSubmit = !isPending && fullName.trim() !== "" && company.trim() !== "" && isValidContactEmail(email.trim()) && looksLikeUrl(website);

  return (
    <div className="rounded-[24px] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-pure-white)] p-5 sm:p-6 dark:border-[var(--color-border-inverse-15)] dark:bg-[var(--color-bg-dark)]">
      {state.success ? (
        <p className="py-6 text-center text-[18px] font-medium leading-[26px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]" role="status">
          {form.successMessage}
        </p>
      ) : (
        <form action={formAction} className="space-y-5" noValidate>
          {/* Honeypot + timing fields read by the server action. The honeypot keeps the shared "website" name; the real site field is "siteUrl". */}
          <input aria-hidden autoComplete="off" className="hidden" name="website" tabIndex={-1} type="text" />
          <input defaultValue="" name="submittedAt" ref={submittedAtRef} type="hidden" />

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={LABEL_CLASS} htmlFor="ws-full-name">
                Name<span aria-hidden>:*</span>
              </label>
              <input autoComplete="name" className={cn(FIELD_CLASS, FIELD_BORDER_CLASS, "h-12")} id="ws-full-name" maxLength={CONTACT_FORM_MAX_NAME_LENGTH} name="fullName" onChange={(e) => setFullName(e.target.value)} placeholder="ex. John Smith" required type="text" value={fullName} />
            </div>
            <div>
              <label className={LABEL_CLASS} htmlFor="ws-company">
                Company<span aria-hidden>:*</span>
              </label>
              <input autoComplete="organization" className={cn(FIELD_CLASS, FIELD_BORDER_CLASS, "h-12")} id="ws-company" maxLength={CONTACT_FORM_MAX_NAME_LENGTH} name="companyName" onChange={(e) => setCompany(e.target.value)} placeholder="Company name" required type="text" value={company} />
            </div>
          </div>

          <div>
            <label className={cn(LABEL_CLASS, emailInvalid && "text-[var(--color-error)]")} htmlFor="ws-email">
              Work email<span aria-hidden>:*</span>
            </label>
            <input
              aria-describedby={emailInvalid ? "ws-email-error" : undefined}
              aria-invalid={emailInvalid || undefined}
              autoComplete="email"
              className={cn(FIELD_CLASS, "h-12", emailInvalid ? "border-[var(--color-error)]" : FIELD_BORDER_CLASS)}
              id="ws-email"
              inputMode="email"
              maxLength={CONTACT_FORM_MAX_EMAIL_LENGTH}
              name="companyEmail"
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ex. johnsmith@workemail.com"
              required
              type="email"
              value={email}
            />
            {emailInvalid ? (
              <p className="mt-2 text-[14px] text-[var(--color-error)]" id="ws-email-error">
                Please enter a valid work email.
              </p>
            ) : null}
          </div>

          <div>
            <label className={cn(LABEL_CLASS, websiteInvalid && "text-[var(--color-error)]")} htmlFor="ws-site-url">
              Website URL<span aria-hidden>:*</span> <span className="font-normal text-[var(--color-hr-grey)] dark:text-[var(--color-text-inverse-60)]">(the site we’ll audit)</span>
            </label>
            <input
              aria-describedby={websiteInvalid ? "ws-site-error" : undefined}
              aria-invalid={websiteInvalid || undefined}
              autoComplete="url"
              className={cn(FIELD_CLASS, "h-12", websiteInvalid ? "border-[var(--color-error)]" : FIELD_BORDER_CLASS)}
              id="ws-site-url"
              inputMode="url"
              maxLength={255}
              name="siteUrl"
              onBlur={() => setTouched((t) => ({ ...t, website: true }))}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="ex. yourcompany.com"
              required
              type="text"
              value={website}
            />
            {websiteInvalid ? (
              <p className="mt-2 text-[14px] text-[var(--color-error)]" id="ws-site-error">
                Please enter your website address, e.g. yourcompany.com
              </p>
            ) : null}
          </div>

          <div>
            <label className={LABEL_CLASS} htmlFor="ws-worry">
              What’s your single biggest visibility worry right now? <span className="font-normal text-[var(--color-hr-grey)] dark:text-[var(--color-text-inverse-60)]">(optional)</span>
            </label>
            <textarea className={cn(FIELD_CLASS, FIELD_BORDER_CLASS, "min-h-[96px] resize-y py-[10px]")} id="ws-worry" maxLength={MAX_WORRY_LENGTH} name="worry" placeholder="ex. We rank for our brand but never show up in ChatGPT answers" rows={3} />
          </div>

          <label className="flex cursor-pointer items-start gap-3 text-[16px] leading-[22px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]" htmlFor="ws-spoke">
            <input className="mt-[3px] size-[18px] shrink-0 accent-[var(--color-hr-accent)]" id="ws-spoke" name="spokeAtBooth" type="checkbox" value="yes" />
            <span>{form.checkboxLabel}</span>
          </label>

          <button
            className="motion-interactive motion-interactive-press inline-flex h-[50px] w-full items-center justify-center gap-2 rounded-[14px] bg-[var(--color-hr-dark)] px-5 text-[16px] font-medium text-[var(--color-text-inverse)] hover:bg-[var(--color-brand-700)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-hr-accent)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 dark:bg-[var(--color-hr-accent)] dark:text-[var(--color-text-fill-dark)] dark:hover:bg-[var(--color-brand-600)]"
            disabled={!canSubmit}
            type="submit"
          >
            {isPending ? "Sending…" : `${form.ctaLabel} →`}
          </button>

          {state.error ? (
            <p className="text-[15px] font-medium text-[var(--color-error)]" role="alert">
              {state.error}
            </p>
          ) : null}
        </form>
      )}
    </div>
  );
}
