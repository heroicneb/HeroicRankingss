/**
 * Pre-launch lockdown switch.
 *
 * Until heroicrankings.com points at this deployment, every response carries
 * noindex (meta robots, X-Robots-Tag header) and robots.txt disallows all.
 * Set NEXT_PUBLIC_SITE_INDEXING=true in the production environment at cutover
 * to lift all three at once — no code change needed.
 */
export const SITE_INDEXING_ENABLED = process.env.NEXT_PUBLIC_SITE_INDEXING === "true";
