const CONTACT_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const CONTACT_FORM_MAX_EMAIL_LENGTH = 320;
export const CONTACT_FORM_MAX_NAME_LENGTH = 120;
export const CONTACT_FORM_MAX_PROJECT_OVERVIEW_LENGTH = 4000;
export const CONTACT_FORM_HEARD_FROM_EMPTY_VALUE = "";

export const CONTACT_FORM_HEARD_FROM_OPTIONS = [
  "Search Engine (e.g., Google)",
  "Word of mouth",
  "LinkedIn",
  "Social Media",
  "Podcast",
  "Industry Association/Publication",
  "Conference",
  "Other",
] as const;

const CONTACT_FORM_ALLOWED_HEARD_FROM_VALUES = new Set<string>([
  CONTACT_FORM_HEARD_FROM_EMPTY_VALUE,
  ...CONTACT_FORM_HEARD_FROM_OPTIONS,
]);

export function isValidContactEmail(email: string) {
  return CONTACT_EMAIL_REGEX.test(email);
}

export function isAllowedContactHeardFrom(value: string) {
  return CONTACT_FORM_ALLOWED_HEARD_FROM_VALUES.has(value);
}
