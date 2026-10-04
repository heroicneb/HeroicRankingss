export const CSP_NONCE_HEADER = "x-nonce";

export function buildContentSecurityPolicy(nonce: string) {
  return [
    "default-src 'self'",
    // WHY: GA4 and Clarity load through nonce'd loaders; the hosts are listed for browsers without strict-dynamic.
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://va.vercel-scripts.com https://www.googletagmanager.com https://www.clarity.ms https://*.clarity.ms`,
    `style-src 'self' 'unsafe-inline'`,
    "img-src 'self' data: https: blob:",
    "font-src 'self'",
    "connect-src 'self' https://va.vercel-scripts.com https://vitals.vercel-insights.com https://*.sanity.io https://*.api.sanity.io https://www.google-analytics.com https://*.google-analytics.com https://analytics.google.com https://*.analytics.google.com https://www.googletagmanager.com https://www.clarity.ms https://*.clarity.ms",
    "object-src 'none'",
    // WHY: blog posts embed videos; only these players are allowed (see toEmbedUrl in portable-text-components).
    "frame-src https://www.youtube.com https://www.youtube-nocookie.com https://player.vimeo.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ");
}
