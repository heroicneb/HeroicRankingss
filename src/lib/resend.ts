/*
 * Resend transport for the website forms. Each submission produces two
 * emails: the team notification (must be accepted for the submission to
 * count as delivered) and a short confirmation to the visitor (best effort).
 *
 * The sending domain is notifications.heroicrankings.com, a Resend-verified
 * subdomain kept separate from the company mailboxes and the portal so the
 * forms' reputation never touches them. Configuration (server-side env):
 *   RESEND_API_KEY            Resend API key
 *   RESEND_FROM_EMAIL         sender, e.g. "Heroic Rankings <hello@notifications.heroicrankings.com>"
 *   CONTACT_FORM_TO           comma-separated recipients of contact submissions
 *   PARTNERSHIP_FORM_TO       comma-separated recipients of partnership requests (falls back to CONTACT_FORM_TO)
 *   FORM_REPLY_TO             Reply-To on the visitor confirmation (defaults to the sales address)
 *   FORM_CONFIRMATION_ENABLED "false" turns the visitor confirmation off
 */

import { SALES_EMAIL, SITE_NAME, SITE_URL } from "@/lib/site";

export const RESEND_SEND_URL = "https://api.resend.com/emails";
const DEFAULT_FROM = `${SITE_NAME} <hello@notifications.heroicrankings.com>`;

export interface ResendConfig {
  apiKey: string;
  from: string;
  contactRecipients: string[];
  partnershipRecipients: string[];
  replyTo: string;
  confirmationEnabled: boolean;
}

export type FormEmailType = "contact" | "partnership";

export interface FormEmailInput {
  formType: FormEmailType;
  fullName: string;
  companyEmail: string;
  companyName?: string;
  heardFrom?: string;
  projectOverview?: string;
  /** Page path the form lives on, e.g. "/contact/". */
  source?: string;
  /** Client timestamp (ms since epoch) or "" when unknown. */
  submittedAt: string;
}

export interface ResendMessage {
  from: string;
  to: string[];
  reply_to: string;
  subject: string;
  text: string;
  html: string;
  tags: Array<{ name: string; value: string }>;
}

/** "a@x.com, b@x.com;c@x.com" → ["a@x.com", "b@x.com", "c@x.com"], de-duplicated, lower-cased. */
export function parseRecipients(value: string | undefined | null): string[] {
  if (!value) return [];
  const seen = new Set<string>();
  for (const part of value.split(/[,;\s]+/)) {
    const email = part.trim().toLowerCase();
    if (email && email.includes("@")) seen.add(email);
  }
  return [...seen];
}

/** Reads the Resend config from env; null when the key or the contact recipients are missing. */
export function readResendConfig(env: Record<string, string | undefined> = process.env): ResendConfig | null {
  const apiKey = env.RESEND_API_KEY?.trim() ?? "";
  const contactRecipients = parseRecipients(env.CONTACT_FORM_TO);
  const partnershipRecipients = parseRecipients(env.PARTNERSHIP_FORM_TO);
  if (!apiKey || contactRecipients.length === 0) return null;
  return {
    apiKey,
    from: env.RESEND_FROM_EMAIL?.trim() || DEFAULT_FROM,
    contactRecipients,
    partnershipRecipients: partnershipRecipients.length ? partnershipRecipients : contactRecipients,
    replyTo: env.FORM_REPLY_TO?.trim() || SALES_EMAIL,
    confirmationEnabled: (env.FORM_CONFIRMATION_ENABLED?.trim().toLowerCase() ?? "true") !== "false",
  };
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function formatSubmittedAt(submittedAt: string): string {
  const ms = Number(submittedAt);
  const date = submittedAt !== "" && Number.isFinite(ms) ? new Date(ms) : new Date();
  return date.toISOString().replace("T", " ").replace(/\.\d{3}Z$/, " UTC");
}

const FONT = "-apple-system,Segoe UI,Helvetica,Arial,sans-serif";

function paragraphs(lines: string[]): string {
  return lines.map((line) => `<p style="margin:0 0 14px;font:15px/1.5 ${FONT};color:#1a1a1a">${line}</p>`).join("");
}

/** The email to the team: every field, the submitter as Reply-To. Pure, so it is unit-tested without the network. */
export function buildTeamEmail(input: FormEmailInput, config: ResendConfig): ResendMessage {
  const isPartnership = input.formType === "partnership";
  const rows: Array<[string, string]> = [["Full name", input.fullName]];
  if (input.companyName) rows.push(["Company", input.companyName]);
  rows.push(["Email", input.companyEmail]);
  if (input.heardFrom) rows.push(["Heard about us via", input.heardFrom]);
  if (input.projectOverview) rows.push(["Project overview", input.projectOverview]);
  rows.push(["Form", isPartnership ? "Partnership request" : "Contact form"]);
  if (input.source) rows.push(["Page", input.source]);
  rows.push(["Submitted", formatSubmittedAt(input.submittedAt)]);

  const subject = isPartnership
    ? `New partnership request: ${input.fullName}`
    : `New contact request: ${input.fullName}${input.companyName ? ` · ${input.companyName}` : ""}`;
  const lead = `${isPartnership ? "Partnership request" : "Contact form submission"} from heroicrankings.com`;

  const text = [lead, "", ...rows.map(([label, value]) => `${label}: ${value}`), "", `Reply to this email to answer ${input.fullName} directly.`].join("\n");
  const html = [
    `<p style="margin:0 0 16px;font:16px/1.4 ${FONT}">${escapeHtml(lead)}</p>`,
    `<table cellpadding="0" cellspacing="0" style="border-collapse:collapse;font:14px/1.5 ${FONT}">`,
    ...rows.map(
      ([label, value]) =>
        `<tr><td style="padding:6px 16px 6px 0;color:#666;vertical-align:top;white-space:nowrap">${escapeHtml(label)}</td><td style="padding:6px 0;vertical-align:top;white-space:pre-wrap">${escapeHtml(value)}</td></tr>`,
    ),
    `</table>`,
    `<p style="margin:16px 0 0;font:13px/1.4 ${FONT};color:#666">Reply to this email to answer ${escapeHtml(input.fullName)} directly.</p>`,
  ].join("");

  return {
    from: config.from,
    to: isPartnership ? config.partnershipRecipients : config.contactRecipients,
    reply_to: input.companyEmail,
    subject,
    text,
    html,
    tags: [
      { name: "form", value: isPartnership ? "partnership" : "contact" },
      { name: "kind", value: "team" },
    ],
  };
}

/**
 * The short confirmation to the visitor. WHY: it never echoes what the visitor
 * typed, so a forged submission cannot turn it into a message to a stranger.
 */
export function buildConfirmationEmail(input: FormEmailInput, config: ResendConfig): ResendMessage {
  const isPartnership = input.formType === "partnership";
  const firstName = input.fullName.trim().split(/\s+/)[0] || "there";
  const subject = isPartnership ? `We received your partnership request, ${firstName}` : `We received your message, ${firstName}`;
  const body = isPartnership
    ? [
        `Hi ${firstName},`,
        `Thanks for your interest in partnering with ${SITE_NAME}. Your request has reached our partnerships team, and one of us will get back to you shortly to talk about how we could work together.`,
        `If anything is urgent in the meantime, just reply to this email.`,
        `The ${SITE_NAME} team`,
      ]
    : [
        `Hi ${firstName},`,
        `Thanks for reaching out to ${SITE_NAME}. We have received your message and someone from our team will get back to you shortly.`,
        `If anything is urgent in the meantime, just reply to this email.`,
        `The ${SITE_NAME} team`,
      ];

  const text = [...body, "", SITE_URL].join("\n\n");
  const html = `${paragraphs(body.map(escapeHtml))}<p style="margin:20px 0 0;font:13px/1.4 ${FONT};color:#666"><a href="${SITE_URL}" style="color:#666">${SITE_URL.replace(/^https?:\/\//, "")}</a></p>`;

  return {
    from: config.from,
    to: [input.companyEmail],
    reply_to: config.replyTo,
    subject,
    text,
    html,
    tags: [
      { name: "form", value: isPartnership ? "partnership" : "contact" },
      { name: "kind", value: "confirmation" },
    ],
  };
}

/**
 * The HTTP request for one message. The idempotency key makes a retried
 * attempt after a timeout a no-op on Resend's side instead of a duplicate.
 */
export function buildResendRequest(message: ResendMessage, config: ResendConfig, idempotencyKey: string): { url: string; headers: Record<string, string>; body: string } {
  return {
    url: RESEND_SEND_URL,
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify(message),
  };
}
