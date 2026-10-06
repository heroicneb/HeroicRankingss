/*
 * Mailjet transport for the website forms. The live heroicrankings.com site
 * sends its contact and partnership emails through Mailjet (the domain's SPF
 * record includes spf.mailjet.com and a Mailjet DKIM key is published), so
 * the new site does the same: one Send API v3.1 call per submission, to the
 * same recipient groups, with the submitter as Reply-To.
 *
 * Configuration (all server-side env):
 *   MAILJET_API_KEY, MAILJET_SECRET_KEY  Mailjet REST API key pair
 *   MAILJET_FROM_EMAIL                   verified sender on the Mailjet account
 *   MAILJET_FROM_NAME                    optional, defaults to "Heroic Rankings Website"
 *   CONTACT_FORM_TO                      comma-separated recipients of contact submissions
 *   PARTNERSHIP_FORM_TO                  comma-separated recipients of partnership requests
 *                                        (falls back to CONTACT_FORM_TO)
 */

export const MAILJET_SEND_URL = "https://api.mailjet.com/v3.1/send";
const DEFAULT_FROM_NAME = "Heroic Rankings Website";

export interface MailjetConfig {
  apiKey: string;
  secretKey: string;
  fromEmail: string;
  fromName: string;
  contactRecipients: string[];
  partnershipRecipients: string[];
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

export interface MailjetMessage {
  From: { Email: string; Name: string };
  To: Array<{ Email: string }>;
  ReplyTo: { Email: string; Name: string };
  Subject: string;
  TextPart: string;
  HTMLPart: string;
  CustomID: string;
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

/** Reads the Mailjet config from env; null when any required piece is missing. */
export function readMailjetConfig(env: Record<string, string | undefined> = process.env): MailjetConfig | null {
  const apiKey = env.MAILJET_API_KEY?.trim() ?? "";
  const secretKey = env.MAILJET_SECRET_KEY?.trim() ?? "";
  const fromEmail = env.MAILJET_FROM_EMAIL?.trim() ?? "";
  const contactRecipients = parseRecipients(env.CONTACT_FORM_TO);
  const partnershipRecipients = parseRecipients(env.PARTNERSHIP_FORM_TO);
  if (!apiKey || !secretKey || !fromEmail || contactRecipients.length === 0) return null;
  return {
    apiKey,
    secretKey,
    fromEmail,
    fromName: env.MAILJET_FROM_NAME?.trim() || DEFAULT_FROM_NAME,
    contactRecipients,
    partnershipRecipients: partnershipRecipients.length ? partnershipRecipients : contactRecipients,
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

/** Builds the email for one submission. Pure, so it is unit-tested without the network. */
export function buildFormEmail(input: FormEmailInput, config: MailjetConfig): MailjetMessage {
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

  const text = [`${isPartnership ? "Partnership request" : "Contact form submission"} from heroicrankings.com`, "", ...rows.map(([label, value]) => `${label}: ${value}`), "", `Reply to this email to answer ${input.fullName} directly.`].join("\n");

  const html = [
    `<p style="margin:0 0 16px;font:16px/1.4 -apple-system,Segoe UI,Helvetica,Arial,sans-serif">${escapeHtml(isPartnership ? "Partnership request" : "Contact form submission")} from heroicrankings.com</p>`,
    `<table cellpadding="0" cellspacing="0" style="border-collapse:collapse;font:14px/1.5 -apple-system,Segoe UI,Helvetica,Arial,sans-serif">`,
    ...rows.map(
      ([label, value]) =>
        `<tr><td style="padding:6px 16px 6px 0;color:#666;vertical-align:top;white-space:nowrap">${escapeHtml(label)}</td><td style="padding:6px 0;vertical-align:top;white-space:pre-wrap">${escapeHtml(value)}</td></tr>`,
    ),
    `</table>`,
    `<p style="margin:16px 0 0;font:13px/1.4 -apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#666">Reply to this email to answer ${escapeHtml(input.fullName)} directly.</p>`,
  ].join("");

  return {
    From: { Email: config.fromEmail, Name: config.fromName },
    To: (isPartnership ? config.partnershipRecipients : config.contactRecipients).map((Email) => ({ Email })),
    ReplyTo: { Email: input.companyEmail, Name: input.fullName },
    Subject: subject,
    TextPart: text,
    HTMLPart: html,
    CustomID: isPartnership ? "website-partnership" : "website-contact",
  };
}

/** The HTTP request for one message: URL, Basic-auth headers and the JSON body. */
export function buildMailjetRequest(message: MailjetMessage, config: MailjetConfig): { url: string; headers: Record<string, string>; body: string } {
  const credentials = Buffer.from(`${config.apiKey}:${config.secretKey}`).toString("base64");
  return {
    url: MAILJET_SEND_URL,
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ Messages: [message] }),
  };
}

/**
 * Mailjet answers 200 even when a message was rejected, with Status "error"
 * on that message. Treat only an explicit per-message success (or a body we
 * cannot parse) as delivered.
 */
export function isMailjetSuccessBody(body: unknown): boolean {
  if (!body || typeof body !== "object") return true;
  const messages = (body as { Messages?: Array<{ Status?: string }> }).Messages;
  if (!Array.isArray(messages) || messages.length === 0) return true;
  return messages.every((message) => message?.Status === "success");
}
