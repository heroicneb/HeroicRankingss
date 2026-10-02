"use client";

import { useActionState, useEffect, useRef, useState } from "react";

import { submitPartnershipForm, type ContactFormState } from "@/app/actions/contact";
import type { PartnershipContent } from "@/components/pages/partnership/partnership-content";
import { CONTACT_FORM_MAX_EMAIL_LENGTH, CONTACT_FORM_MAX_NAME_LENGTH, isValidContactEmail } from "@/lib/contact-validation";
import { cn } from "@/lib/cn";

/**
 * "Is This You?" — the two-field partnership request under the audience
 * items. A dark brand panel with the pitch on the left and the form card on
 * the right; stacked on phones. Submits through the contact webhook with a
 * partnership marker.
 */
export interface PartnershipRequestFormProps {
  form: PartnershipContent["recognize"]["form"];
}

const LABEL_CLASS = "block text-[16px] font-medium leading-[20px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]";
const FIELD_CLASS =
  "mt-2 h-12 w-full rounded-[12px] border bg-transparent px-[13px] text-[17px] font-normal leading-[24px] text-[var(--color-hr-dark)] placeholder:text-[var(--color-form-placeholder)] focus-visible:outline-none dark:bg-[var(--color-bg-dark)] dark:text-[var(--color-text-inverse)] dark:placeholder:text-[var(--color-text-inverse-30)]";
const FIELD_BORDER_CLASS = "border-[var(--color-form-border-subtle)] focus-visible:border-[var(--color-hr-accent)] dark:border-[var(--color-border-inverse-20)]";

export function PartnershipRequestForm({ form }: PartnershipRequestFormProps) {
  const [state, formAction, isPending] = useActionState<ContactFormState, FormData>(submitPartnershipForm, { success: false, error: null });
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  // WHY: the anti-bot timer needs a client timestamp; rendering it on the server would mismatch, so it is written into the hidden field after mount.
  const submittedAtRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (submittedAtRef.current) submittedAtRef.current.value = String(Date.now());
  }, []);

  const emailInvalid = touched && email.trim() !== "" && !isValidContactEmail(email.trim());

  return (
    <div className="surface-chart relative overflow-hidden rounded-[30px] border border-[var(--color-border-inverse-10)] px-5 py-8 sm:px-8 sm:py-10 lg:rounded-[40px] lg:px-[60px] lg:py-[56px]">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)] lg:items-center lg:gap-[60px]">
        <div className="text-center lg:text-left">
          <h3 className="type-h3 text-[var(--color-text-inverse)] lg:text-[40px] lg:leading-[1.15]">{form.heading}</h3>
          <p className="type-paragraph mx-auto mt-4 max-w-[460px] text-[var(--color-text-inverse-60)] lg:mx-0">{form.body}</p>
        </div>

        <div className="rounded-[24px] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-pure-white)] p-5 sm:p-6 dark:border-[var(--color-border-inverse-15)] dark:bg-[var(--color-bg-dark)]">
          {state.success ? (
            <p className="py-6 text-center text-[18px] font-medium leading-[26px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]" role="status">
              {form.successMessage}
            </p>
          ) : (
            <form action={formAction} className="space-y-5" noValidate>
              {/* Honeypot + timing fields read by the server action. */}
              <input aria-hidden autoComplete="off" className="hidden" name="website" tabIndex={-1} type="text" />
              <input defaultValue="" name="submittedAt" ref={submittedAtRef} type="hidden" />

              <div>
                <label className={LABEL_CLASS} htmlFor="partnership-full-name">
                  Full Name<span aria-hidden>:*</span>
                </label>
                <input
                  autoComplete="name"
                  className={cn(FIELD_CLASS, FIELD_BORDER_CLASS)}
                  id="partnership-full-name"
                  maxLength={CONTACT_FORM_MAX_NAME_LENGTH}
                  name="fullName"
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="ex. John Smith"
                  required
                  type="text"
                  value={fullName}
                />
              </div>

              <div>
                <label className={cn(LABEL_CLASS, emailInvalid && "text-[var(--color-error)]")} htmlFor="partnership-company-email">
                  Company Email<span aria-hidden>:*</span>
                </label>
                <input
                  aria-describedby={emailInvalid ? "partnership-email-error" : undefined}
                  aria-invalid={emailInvalid || undefined}
                  autoComplete="email"
                  className={cn(FIELD_CLASS, emailInvalid ? "border-[var(--color-error)]" : FIELD_BORDER_CLASS)}
                  id="partnership-company-email"
                  inputMode="email"
                  maxLength={CONTACT_FORM_MAX_EMAIL_LENGTH}
                  name="companyEmail"
                  onBlur={() => setTouched(true)}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="ex. johnsmith@workemail.com"
                  required
                  type="email"
                  value={email}
                />
                {emailInvalid ? (
                  <p className="mt-2 text-[14px] text-[var(--color-error)]" id="partnership-email-error">
                    Please enter a valid work email.
                  </p>
                ) : null}
              </div>

              <button
                className="motion-interactive motion-interactive-press inline-flex h-[50px] w-full items-center justify-center rounded-[14px] bg-[var(--color-hr-dark)] px-5 text-[16px] font-medium text-[var(--color-text-inverse)] hover:bg-[var(--color-brand-700)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-hr-accent)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 dark:bg-[var(--color-hr-accent)] dark:text-[var(--color-text-fill-dark)] dark:hover:bg-[var(--color-brand-600)]"
                disabled={isPending || !fullName.trim() || !isValidContactEmail(email.trim())}
                type="submit"
              >
                {isPending ? "Sending…" : form.ctaLabel}
              </button>

              {state.error ? (
                <p className="text-[15px] font-medium text-[var(--color-error)]" role="alert">
                  {state.error}
                </p>
              ) : null}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
