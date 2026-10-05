/**
 * Sets a shorter SEO title (seo.metaTitle, ≤60 chars) on the posts whose
 * rendered <title> exceeded Google's display width. The H1 is untouched.
 * Dry run by default; pass --apply to write.
 *
 *   node --env-file=.env.local --experimental-strip-types scripts/seo/shorten-post-titles.ts [--apply]
 */
import { createSeedClient } from "../seed/lib.ts";

const TITLES: Record<string, string> = {
  "authenticity-in-marketing": "Authenticity in Marketing: Why Being Real Wins in 2026",
  "google-eeat-and-seo-in-2026": "Google E-E-A-T in 2026: How Trust Signals Drive SEO",
  "accuranker-vs-ahrefs-comparison": "AccuRanker vs Ahrefs: Rank Tracking & SEO Tools Compared",
  "saas-seo-strategies": "SaaS SEO in 2026: Challenges and Strategies That Work",
  "how-to-do-market-research-guide": "How to Do Market Research: A Practical 2026 Guide",
  "outsourcing-link-building": "Outsourcing Link Building: The 2026 Quality Checklist",
  "how-to-find-an-email-by-social-account": "How to Find an Email by Social Account (B2B Guide)",
  "marketing-information-management": "Marketing Information Management: What It Is & How to Use It",
  "backlinks-management": "Backlinks Management: A Complete Guide for SEO Success",
  "how-to-do-an-internal-link-audit": "Internal Link Audit: How to Find and Fix Linking Issues",
  "google-io-2026-biggest-update": "Google AI Mode as Default Search: What It Means for SEO",
  "ai-in-sales-statistics-2026": "AI in Sales Statistics & Trends to Know in 2026",
  "best-competitor-analysis-tools": "Best Competitor Analysis Tools in 2026: 15 Compared",
  "brand-authority-in-the-ai-search-era": "Brand Authority in AI Search: How to Get Cited in 2026",
  "what-is-a-website-title": "What Is a Website Title? SEO Impact and Examples",
  "content-quality-vs-content-velocity": "Content Velocity vs Quality: The Balance That Ranks",
  "what-is-parasite-seo": "Parasite SEO in 2026: What Still Works After the Crackdown",
  "link-building-statistics-2026": "Link Building Statistics 2026: How the Industry Is Changing",
  "the-psychology-of-email-fatigue": "Why You Can't Unsubscribe: The Psychology of Email Fatigue",
  "topical-authority-pillar-pages-content-clusters": "Topical Authority: What It Is and How to Build It",
  "what-is-a-content-audit": "Content Audit Explained: Why It Matters and How to Do It",
  "weird-designs-in-branding": "Weird Designs, Big Results: Anti-Design Branding Strategy",
  "marketing-fundamentals": "Marketing Fundamentals: A Practical Guide to the Basics",
  "what-is-a-content-pillar": "What Is a Content Pillar? Meaning, Strategy & SEO Benefits",
};

async function main() {
  const apply = process.argv.includes("--apply");
  const client = createSeedClient();
  for (const [slug, title] of Object.entries(TITLES)) {
    if (title.length > 60) throw new Error(`${slug}: title is ${title.length} chars`);
    const doc = await client.fetch<{ _id: string; current: string | null } | null>(`*[_type == "post" && slug.current == $slug][0]{ _id, "current": coalesce(seo.metaTitle, title) }`, { slug });
    if (!doc) {
      console.log(`${slug}: not found`);
      continue;
    }
    console.log(`${slug}\n   ${doc.current}\n → ${title} (${title.length})`);
    if (apply) await client.patch(doc._id).set({ "seo.metaTitle": title }).commit();
  }
  console.log(apply ? "applied" : "dry run (pass --apply to write)");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
