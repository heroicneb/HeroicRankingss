import { getSitemapEntries } from "@/lib/sanity-data";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

/**
 * llms.txt (llmstxt.org): a plain-Markdown map of the site for AI agents and
 * answer engines. Search engines ignore it, so it is a courtesy index, not a
 * ranking lever; it is cheap because it reuses the sitemap data.
 */
const SERVICES = [
  ["SEO, GEO & AEO services", "/seo/"],
  ["On-page SEO", "/seo/on-page/"],
  ["Technical SEO", "/seo/technical/"],
  ["Local SEO", "/seo/local/"],
  ["Keyword research & strategy", "/seo/keyword-research/"],
  ["SEO content creation", "/seo/content-creation/"],
  ["E-commerce SEO", "/seo/e-commerce/"],
  ["Link building", "/seo/linkbuilding/"],
  ["Reddit marketing", "/seo/reddit-marketing/"],
  ["White-label SEO partnership for agencies", "/white-label-seo-partnership/"],
] as const;

const line = (label: string, path: string, note?: string | null) => `- [${label}](${SITE_URL}${path})${note ? `: ${note}` : ""}`;

export async function GET() {
  const entries = await getSitemapEntries().catch(() => null);
  const posts = (entries?.posts ?? []).filter((p) => p.title);
  const sections = [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_DESCRIPTION}`,
    "",
    `${SITE_NAME} is an SEO, link building and AI-search visibility agency. Contact: ${SITE_URL}/contact/`,
    "",
    "## Services",
    ...SERVICES.map(([label, path]) => line(label, path)),
    "",
    "## Case studies",
    ...(entries?.caseStudies ?? []).map((c) => line(c.title ?? c.client ?? c.slug, `/case-study/${c.slug}/`, c.client ? `results for ${c.client}` : null)),
    "",
    "## Ranking Heroes SEO Podcast",
    line("All episodes", "/podcast/"),
    ...(entries?.episodes ?? []).map((e) => line(`Episode ${e.episodeNumber ?? ""}: ${e.title ?? e.slug}`.replace("Episode : ", ""), `/podcast/${e.slug}/`, e.guest ? `with ${e.guest}` : null)),
    "",
    "## Team",
    ...(entries?.team ?? []).map((t) => line(t.name ?? t.slug, `/about/${t.slug}/`, t.role ?? null)),
    "",
    `## Insights (${posts.length} articles, newest first)`,
    ...posts.map((p) => line(p.title ?? p.slug, `/seo/${p.urlCategory}/${p.slug}/`, p.publishedAt ? p.publishedAt.slice(0, 10) : null)),
    "",
    "## Optional",
    line("Sitemap", "/sitemap.xml"),
    line("Privacy policy", "/privacy-policy/"),
    "",
  ];
  return new Response(sections.join("\n"), {
    headers: { "Content-Type": "text/markdown; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
