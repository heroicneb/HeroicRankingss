const FALLBACK_SITE_URL = "https://heroicrankings.com";
const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

function normalizeSiteUrl(value: string | undefined) {
  if (!value) {
    return FALLBACK_SITE_URL;
  }

  const candidate = value.startsWith("http://") || value.startsWith("https://")
    ? value
    : `https://${value}`;

  try {
    const parsed = new URL(candidate);

    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return FALLBACK_SITE_URL;
    }

    return parsed.toString();
  } catch {
    return FALLBACK_SITE_URL;
  }
}

const normalizedSiteUrl = normalizeSiteUrl(rawSiteUrl);

export const SITE_URL = normalizedSiteUrl.replace(/\/+$/, "");
export const SITE_NAME = "Heroic Rankings";
export const SITE_DESCRIPTION =
  "Heroic Rankings helps businesses scale organic growth through data-driven SEO strategy, technical excellence, and long-term partnerships.";

/** Company contact constants — single source of truth */
export const SITE_PHONE = "+1 307 336 7191";
export const SITE_PHONE_HREF = "tel:+13073367191";
export const SITE_EMAIL = "info@heroicrankings.com";
export const SITE_EMAIL_HREF = "mailto:info@heroicrankings.com";
export const SALES_EMAIL = "sales@heroicrankings.com";

/** Brand-level social URLs — single source of truth.
 * LinkedIn uses a hyphen (heroic-rankings). Heroic Rankings does not use X;
 * Instagram and YouTube are the other active profiles (Nebojsa, 2026-10-04). */
export const SITE_LINKEDIN_URL = "https://www.linkedin.com/company/heroic-rankings/";
export const SITE_INSTAGRAM_URL = "https://www.instagram.com/heroicrankings/";
export const SITE_YOUTUBE_URL = "https://www.youtube.com/@HeroicRankings";
