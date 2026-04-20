"use client";

import { useActionState, useRef, useState } from "react";
import Image from "next/image";

import { cn } from "@/lib/cn";
import { submitContactForm, type ContactFormState } from "@/app/actions/contact";
import {
  CONTACT_FORM_HEARD_FROM_EMPTY_VALUE,
  CONTACT_FORM_HEARD_FROM_OPTIONS,
  CONTACT_FORM_MAX_EMAIL_LENGTH,
  CONTACT_FORM_MAX_NAME_LENGTH,
  CONTACT_FORM_MAX_PROJECT_OVERVIEW_LENGTH,
  isValidContactEmail,
} from "@/lib/contact-validation";

const DEFAULT_FIELD_BORDER_CLASS =
  "border-[var(--color-form-border-subtle)] dark:border-[var(--color-border-inverse-20)] dark:opacity-100 focus-visible:border-[var(--color-hr-accent)]";
const FIELD_CLASS =
  "h-12 w-full rounded-[12px] border bg-transparent dark:bg-[var(--color-bg-dark)] px-[13px] text-[18px] font-normal leading-[24px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] placeholder:text-[var(--color-form-placeholder)] dark:placeholder:text-[var(--color-text-inverse-30)] focus-visible:outline-none";

interface ContactFormValues {
  companyEmail: string;
  companyName: string;
  fullName: string;
  heardFrom: string;
  projectOverview: string;
}

interface FormStateWithReset extends ContactFormState {
  resetCount: number;
}

async function wrappedSubmit(prev: FormStateWithReset, formData: FormData): Promise<FormStateWithReset> {
  const result = await submitContactForm(prev, formData);
  return {
    ...result,
    resetCount: result.success ? prev.resetCount + 1 : prev.resetCount,
  };
}

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(wrappedSubmit, {
    success: false,
    error: null,
    resetCount: 0,
  });

  return (
    <div className="w-full xl:w-[630px]">
      <ContactFormFields key={state.resetCount} formAction={formAction} isPending={isPending} state={state} />
    </div>
  );
}

function ContactFormFields({
  formAction,
  isPending,
  state,
}: {
  formAction: (payload: FormData) => void;
  isPending: boolean;
  state: FormStateWithReset;
}) {
  const [submittedAt] = useState(() => Date.now().toString());
  const [formValues, setFormValues] = useState<ContactFormValues>({
    fullName: "",
    companyName: "",
    companyEmail: "",
    heardFrom: "",
    projectOverview: "",
  });
  const [requiredTouched, setRequiredTouched] = useState({
    companyName: false,
    fullName: false,
  });
  const [emailTouched, setEmailTouched] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const emailValue = formValues.companyEmail.trim();
  const emailHasError = emailValue === "" || !isValidContactEmail(emailValue);
  const fullNameHasError = requiredTouched.fullName && formValues.fullName.trim() === "";
  const companyNameHasError = requiredTouched.companyName && formValues.companyName.trim() === "";
  const showEmailError = emailTouched && emailHasError;

  function updateField<K extends keyof ContactFormValues>(key: K, value: ContactFormValues[K]) {
    setFormValues((previous) => ({
      ...previous,
      [key]: value,
    }));
  }

  return (
    <form
      ref={formRef}
      action={formAction}
      onSubmit={(event) => {
        setRequiredTouched({ companyName: true, fullName: true });
        setEmailTouched(true);

        const nameEmpty = formValues.fullName.trim() === "";
        const companyEmpty = formValues.companyName.trim() === "";
        const emailInvalid = formValues.companyEmail.trim() === "" || !isValidContactEmail(formValues.companyEmail.trim());

        if (nameEmpty || companyEmpty || emailInvalid) {
          event.preventDefault();
        }
      }}
    >
      <input
        aria-hidden
        autoComplete="off"
        className="hidden"
        name="website"
        tabIndex={-1}
        type="text"
      />
      <input
        aria-hidden
        name="submittedAt"
        tabIndex={-1}
        type="hidden"
        value={submittedAt}
      />
      <div className="grid grid-cols-1 gap-x-5 gap-y-[30px] md:grid-cols-[305px_305px]">
        <div>
          <label
            className={cn(
              "block text-[18px] font-normal leading-[24px]",
              fullNameHasError ? "text-[var(--color-error)]" : "text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]",
            )}
            htmlFor="full-name"
          >
            *Full Name
          </label>
          <input
            autoComplete="name"
            className={cn(
              FIELD_CLASS,
              "mt-2",
              fullNameHasError
                ? "border-[var(--color-error)] focus-visible:border-[var(--color-error)]"
                : "border-[var(--color-hr-accent)] focus-visible:border-[var(--color-hr-accent)]",
            )}
            id="full-name"
            name="fullName"
            onBlur={() =>
              setRequiredTouched((previous) => ({
                ...previous,
                fullName: true,
              }))
            }
            onChange={(event) => updateField("fullName", event.target.value)}
            placeholder="Full Name"
            required
            type="text"
            value={formValues.fullName}
            maxLength={CONTACT_FORM_MAX_NAME_LENGTH}
          />
        </div>

        <div>
          <label
            className={cn(
              "block text-[18px] font-normal leading-[24px]",
              companyNameHasError ? "text-[var(--color-error)]" : "text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]",
            )}
            htmlFor="company-name"
          >
            *Company Name
          </label>
          <input
            autoComplete="organization"
            className={cn(
              FIELD_CLASS,
              "mt-2",
              companyNameHasError
                ? "border-[var(--color-error)] focus-visible:border-[var(--color-error)]"
                : DEFAULT_FIELD_BORDER_CLASS,
            )}
            id="company-name"
            name="companyName"
            onBlur={() =>
              setRequiredTouched((previous) => ({
                ...previous,
                companyName: true,
              }))
            }
            onChange={(event) => updateField("companyName", event.target.value)}
            placeholder="*Company Name"
            required
            type="text"
            value={formValues.companyName}
            maxLength={CONTACT_FORM_MAX_NAME_LENGTH}
          />
        </div>

        <div>
          <label
            className={cn(
              "block text-[18px] font-normal leading-[24px]",
              showEmailError ? "text-[var(--color-error)]" : "text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]",
            )}
            htmlFor="company-email"
          >
            *Company Email
          </label>
          <input
            autoComplete="email"
            className={cn(
              FIELD_CLASS,
              "mt-2",
              showEmailError ? "border-[var(--color-error)]" : DEFAULT_FIELD_BORDER_CLASS,
            )}
            id="company-email"
            name="companyEmail"
            onBlur={() => setEmailTouched(true)}
            onChange={(event) => updateField("companyEmail", event.target.value)}
            placeholder="@"
            required
            type="email"
            value={formValues.companyEmail}
            maxLength={CONTACT_FORM_MAX_EMAIL_LENGTH}
          />
        </div>

        <div>
          <label className="block text-[18px] font-normal leading-[24px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]" htmlFor="heard-from">
            How did you hear about us?
          </label>
          <div className="relative mt-2">
            <select
              className={cn(
                FIELD_CLASS,
                "appearance-none pr-[42px]",
                DEFAULT_FIELD_BORDER_CLASS,
                formValues.heardFrom === CONTACT_FORM_HEARD_FROM_EMPTY_VALUE
                  ? "text-[var(--color-form-placeholder)]"
                  : "text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]",
              )}
              id="heard-from"
              name="heardFrom"
              onChange={(event) => updateField("heardFrom", event.target.value)}
              value={formValues.heardFrom}
            >
              <option value={CONTACT_FORM_HEARD_FROM_EMPTY_VALUE}>Please choose one</option>
              {CONTACT_FORM_HEARD_FROM_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <Image
              alt=""
              aria-hidden
              className="pointer-events-none absolute right-[13px] top-1/2 size-3 -translate-y-1/2 dark:brightness-0 dark:invert"
              height={12}
              src="/contact/imgVector1.svg"
              width={12}
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <label
            className="block text-[18px] font-normal leading-[24px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]"
            htmlFor="project-overview"
          >
            Please provide a brief overview of your project:
          </label>
          <textarea
            className={cn(
              "mt-2 h-[200px] w-full resize-none rounded-[12px] border bg-transparent dark:bg-[var(--color-bg-dark)] px-[13px] py-[13px] text-[18px] font-normal leading-[24px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] placeholder:text-[var(--color-form-placeholder)] dark:placeholder:text-[var(--color-text-inverse-30)] focus-visible:border-[var(--color-hr-accent)] focus-visible:outline-none md:w-[630px]",
              DEFAULT_FIELD_BORDER_CLASS,
            )}
            id="project-overview"
            name="projectOverview"
            onChange={(event) => updateField("projectOverview", event.target.value)}
            placeholder="Write your message here"
            value={formValues.projectOverview}
            maxLength={CONTACT_FORM_MAX_PROJECT_OVERVIEW_LENGTH}
          />
        </div>

        <div className="md:col-span-2">
          <button
            className="motion-interactive motion-interactive-press inline-flex h-[46px] w-fit items-center justify-center gap-[10px] rounded-[16px] border border-[var(--color-hr-accent)] px-5 py-3 text-[16px] font-medium leading-[16px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] hover:bg-[var(--color-hr-off-white)] dark:hover:bg-[var(--color-surface-inverse-10)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-hr-accent)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60"
            disabled={isPending}
            type="submit"
          >
            {isPending ? "Sending..." : "Begin Your Path to Digital Success"}
            {!isPending && (
              <Image alt="" aria-hidden className="size-[10px]" height={10} src="/contact/imgGroup2.svg" width={10} />
            )}
          </button>

          {state.success && (
            <p className="mt-4 text-[16px] font-medium text-[var(--color-hr-accent)]" role="status">
              Thank you for reaching out! We&apos;ll get back to you shortly.
            </p>
          )}

          {state.error && (
            <p className="mt-4 text-[16px] font-medium text-[var(--color-error)]" role="alert">
              {state.error}
            </p>
          )}
        </div>
      </div>
    </form>
  );
}
