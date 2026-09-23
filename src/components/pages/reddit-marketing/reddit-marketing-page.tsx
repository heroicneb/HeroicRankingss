import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";

import { ServiceFaq } from "@/components/sections/shared/service-faq";
import { AppLink } from "@/components/ui/app-link";
import { GradientText } from "@/components/ui/gradient-text";
import {
  FaqPlusIcon,
  GradientArrowUpRightIcon,
} from "@/components/ui/icons/decorative";
import { SectionLabel } from "@/components/ui/section-label";
import { PAGE_SHELL_CLASS } from "@/data/service-shared";
import { cn } from "@/lib/cn";
import { createPageMetadata } from "@/lib/metadata";
import type { SanityFaqItem } from "@/lib/sanity-data";

/*
 * Figma source: file c9T57PLFisgSWhzLthkJob, frame 1311:48 "HR - Reddit Service Page".
 * Extraction notes: docs/figma-cache/extractions/2026-09-23-reddit-marketing-section-00-page.md
 */

export const metadata: Metadata = createPageMetadata({
  title: "Reddit Marketing Services",
  description:
    "Show up in the Reddit threads that rank in Google, get cited by AI, and shape buyer decisions — authentic mentions, comments, posts, and reputation management run by specialists.",
  path: "/seo/reddit-marketing",
});

const ASSET_BASE = "/reddit-marketing";
const HERO_STATUE_SRC = `${ASSET_BASE}/hero-statue.webp`;
const GLOW_SRC = `${ASSET_BASE}/glow.svg`;

// ---------------------------------------------------------------------------
// Shared class fragments (tokens only — see src/app/globals.css)
// ---------------------------------------------------------------------------

const TEXT_PRIMARY =
  "text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]";
const CARD_BORDER =
  "border border-[var(--color-hr-light-grey)] dark:border-[var(--color-border-inverse-10)]";
const SECTION_PAD = "px-5 py-[60px] sm:px-8 lg:px-[70px] lg:py-[120px]";
const CTA_BUTTON_CLASS =
  "type-cta motion-interactive motion-interactive-press inline-flex h-[45px] items-center justify-center gap-[10px] rounded-[var(--radius-button)] border border-[var(--color-hr-accent)] bg-transparent px-5 hover:bg-[var(--color-hr-off-white)] dark:hover:bg-[var(--color-surface-inverse-10)]";

// ---------------------------------------------------------------------------
// Content models
// ---------------------------------------------------------------------------

interface IconSpec {
  src: string;
  width: number;
  height: number;
}

interface DifferenceItem {
  title: string;
  lines: readonly [string, string];
  icon: IconSpec;
  /** The Figma asset already includes the 50×50 bordered box. */
  iconIncludesBox?: boolean;
}

interface OpportunityCard {
  title: string;
  body: string;
  icon: IconSpec;
  /** Secondary glyph layered on top of the icon (Figma composite). */
  iconOverlay?: IconSpec & { left: number; top: number };
  titleWidthClass?: string;
}

interface ServiceCard {
  title: string;
  subtitle: string;
  body: string;
  icon: IconSpec;
  titleWidthClass?: string;
}

interface MenuCard {
  title: string;
  items: readonly string[];
}

interface WinCard {
  title: string;
  body: string;
  icon: IconSpec;
  titleWidthClass?: string;
}

interface ProcessStep {
  number: string;
  title: string;
  body: string;
  optional?: boolean;
}

interface MetricCard {
  title: string;
  body: string;
}

interface TrustItem {
  title: string;
  description: string;
}

// ---------------------------------------------------------------------------
// Content (verbatim from Figma frame 1311:48)
// ---------------------------------------------------------------------------

const DIFFERENCE_ITEMS: readonly DifferenceItem[] = [
  {
    title: "Authenticity beats advertising",
    lines: [
      "Reddit hates ads but rewards people who genuinely help.",
      "The playbook is contribution, not promotion.",
    ],
    icon: { src: `${ASSET_BASE}/icon-authenticity.svg`, width: 50, height: 50 },
    iconIncludesBox: true,
  },
  {
    title: "Moderators hold the power",
    lines: [
      "Each community sets and enforces its own rules.",
      "We know how to work with them, not against them.",
    ],
    icon: { src: `${ASSET_BASE}/icon-moderators.svg`, width: 28, height: 33 },
  },
  {
    title: "Culture is subreddit-specific",
    lines: [
      "There's no single “Reddit voice.”",
      "Every community has unwritten rules we learn before we ever post.",
    ],
    icon: { src: `${ASSET_BASE}/icon-culture.svg`, width: 36, height: 36 },
  },
  {
    title: "Corporate accounts face scrutiny",
    lines: [
      "Brand accounts get less rope.",
      "We protect yours with careful, compliant participation.",
    ],
    icon: { src: `${ASSET_BASE}/icon-corporate.svg`, width: 34, height: 35 },
  },
  {
    title: "Threads are evergreen assets",
    lines: [
      "A single well-placed thread keeps ranking",
      "and getting cited by Google and AI for years.",
    ],
    icon: { src: `${ASSET_BASE}/icon-evergreen.svg`, width: 32, height: 32 },
  },
  {
    title: "The right move compounds",
    lines: [
      "Done well, Reddit isn't a campaign that ends.",
      "It's an asset that keeps working long after.",
    ],
    icon: { src: `${ASSET_BASE}/icon-compounds.svg`, width: 24, height: 35 },
  },
];

const OPPORTUNITY_CARDS: readonly OpportunityCard[] = [
  {
    title: "Claim More of the Search Results Page",
    body: "Ranking your own site once is no longer enough. On buyer queries, Reddit threads routinely occupy the results Google used to reserve for brands and review sites. When your brand is present in those threads, you extend your reach into positions your domain can't rank for on its own — turning a single search into several touchpoints that all point back to you.",
    icon: { src: `${ASSET_BASE}/icon-search-results.svg`, width: 30, height: 31 },
    titleWidthClass: "max-w-[334px]",
  },
  {
    title: "Become a Source AI Engines Quote",
    body: "ChatGPT, Perplexity, Google AI Overviews, and Gemini lean heavily on Reddit when they generate recommendations, because it reads as genuine human experience. Shaping those conversations is how you get named in the answer itself — not buried on page two of a link list. As AI-assisted buying grows, being the brand the model cites becomes a moat competitors can't easily copy.",
    icon: { src: `${ASSET_BASE}/icon-ai-quote.svg`, width: 32, height: 35 },
    titleWidthClass: "max-w-[258px]",
  },
  {
    title: "Win the Trust Brand Content Can't Buy",
    body: "Buyers have learned to discount polished marketing copy. What moves them is a stranger with no incentive vouching for a product in a thread full of skeptics. Reddit is where that peer validation happens, and a credible presence there carries more weight in a purchase decision than anything on your own website ever will.",
    icon: { src: `${ASSET_BASE}/icon-handshake.svg`, width: 36, height: 22 },
    iconOverlay: {
      src: `${ASSET_BASE}/icon-handshake-spark.svg`,
      width: 11,
      height: 14,
      left: 13,
      top: 0,
    },
    titleWidthClass: "max-w-[293px]",
  },
  {
    title: "Reach Buyers at the Moment of Decision",
    body: "Reddit discussions like “best [tool] for [use case]” or “is [product] worth it?” are pure high-intent moments — someone actively comparing options and close to buying. Showing up helpfully in exactly those threads puts your brand in front of demand at the point it's most ready to convert, not at the top of a cold funnel.",
    icon: { src: `${ASSET_BASE}/icon-buyer-decision.svg`, width: 30, height: 30 },
    titleWidthClass: "max-w-[334px]",
  },
  {
    title: "Build Assets That Compound, Not Expire",
    body: "Paid placements vanish the day you stop funding them. A well-placed Reddit thread does the opposite: it keeps ranking, keeps getting read, and keeps getting cited months and years later. Every thread you seed adds to a growing library of evergreen visibility that works while you sleep — an appreciating asset instead of a recurring cost.",
    icon: { src: `${ASSET_BASE}/icon-evergreen.svg`, width: 32, height: 32 },
    titleWidthClass: "max-w-[336px]",
  },
  {
    title: "Move Before the Window Narrows",
    body: "Most of your competitors either fear Reddit or handle it badly enough to get banned. That gap is the opportunity. Establishing authentic authority now — while communities are still open to it and CPMs are still low — locks in credibility and rankings that are far harder to displace once everyone else catches on.",
    icon: { src: `${ASSET_BASE}/icon-window.svg`, width: 31, height: 31 },
    titleWidthClass: "max-w-[293px]",
  },
];

const SERVICE_CARDS: readonly ServiceCard[] = [
  {
    title: "Brand Mentions",
    subtitle: "Authentic mentions in high-traffic subreddits",
    body: "Natural, credible mentions inside the threads your buyers already read — positioned to inform, not to sell.",
    icon: { src: `${ASSET_BASE}/icon-brand-mentions.svg`, width: 35, height: 35 },
  },
  {
    title: "Comment Service",
    subtitle: "Real, human-written comments in relevant threads",
    body: "Native comments by real people who understand each community, added where your product genuinely fits.",
    icon: { src: `${ASSET_BASE}/icon-comment-service.svg`, width: 35, height: 35 },
  },
  {
    title: "Post Creation",
    subtitle: "Native long-form posts that rank and convert",
    body: "Original, discussion-worthy posts that earn upvotes, rank in Google, and feed AI quality signals about your brand.",
    icon: { src: `${ASSET_BASE}/icon-post-creation.svg`, width: 35, height: 35 },
  },
  {
    title: "Engagement Service",
    subtitle: "Organic discussion and genuine community signals",
    body: "Upvotes, replies, and authentic discussion that build momentum and keep your content visible and credible.",
    icon: { src: `${ASSET_BASE}/icon-engagement.svg`, width: 37, height: 31 },
  },
  {
    title: "Managed Accounts",
    subtitle: "Aged, niche-relevant accounts ready to engage",
    body: "Aged, high-karma accounts with real histories that participate naturally — never flagged, never spammy.",
    icon: { src: `${ASSET_BASE}/icon-managed-accounts.svg`, width: 32, height: 35 },
  },
  {
    title: "Reputation Management",
    subtitle: "Suppress negatives and rebuild trust",
    body: "We push down damaging threads, seed accurate information, and rebuild a fair picture of your brand.",
    icon: { src: `${ASSET_BASE}/icon-reputation.svg`, width: 27, height: 35 },
  },
  {
    title: "Reddit SEO",
    subtitle: "Rank your threads in Google for buyer queries",
    body: "We build and optimize threads to rank for the searches your buyers make — a second front-page presence.",
    icon: { src: `${ASSET_BASE}/icon-reddit-seo.svg`, width: 36, height: 30 },
  },
  {
    title: "Reddit GEO & AI Visibility",
    subtitle: "Get cited by ChatGPT, Perplexity & AI Overviews",
    body: "We seed the long-tail details AI tools pull from, so your brand is in the answer when buyers ask.",
    icon: { src: `${ASSET_BASE}/icon-ai-quote.svg`, width: 32, height: 35 },
    titleWidthClass: "max-w-[214px]",
  },
];

const MENU_CARDS: readonly MenuCard[] = [
  {
    title: "Strategy & Foundations",
    items: [
      "Reddit strategy & roadmap",
      "Corporate / brand account management",
      "Managed aged accounts",
    ],
  },
  {
    title: "Community & Presence",
    items: [
      "Subreddit creation & moderation",
      "Subreddit opportunity scouting",
      "Thread creation & engagement",
    ],
  },
  {
    title: "Reputation & Influence",
    items: [
      "Proactive reputation seeding",
      "Crisis management (reactive)",
      "AMA hosting & promotion",
    ],
  },
  {
    title: "Performance & Insights",
    items: [
      "Reddit SEO",
      "Reddit GEO & AI visibility",
      "Insights & reporting",
      "Packaged options",
    ],
  },
];

const WIN_CARDS: readonly WinCard[] = [
  {
    title: "Win Rankings Through Reddit",
    body: "We create authentic Reddit threads — or tap into existing ones — that rank in Google for your buyer keywords.",
    icon: { src: `${ASSET_BASE}/icon-win-rankings.svg`, width: 34, height: 34 },
    titleWidthClass: "max-w-[334px]",
  },
  {
    title: "Win the #1 Comment Spot",
    body: "We position your comment at the top of the target thread, making it the first answer buyers read.",
    icon: { src: `${ASSET_BASE}/icon-top-comment.svg`, width: 35, height: 30 },
    titleWidthClass: "max-w-[258px]",
  },
  {
    title: "Build Consensus With Multiple Voices",
    body: "We seed multiple authentic comments to create genuine consensus, build trust, and move buyers closer to a decision.",
    icon: { src: `${ASSET_BASE}/icon-handshake.svg`, width: 36, height: 22 },
    titleWidthClass: "max-w-[293px]",
  },
  {
    title: "Shape AI Search Results",
    body: "We plant the key details AI tools rely on, so they answer buyer questions in your favor.",
    icon: { src: `${ASSET_BASE}/icon-shape-ai.svg`, width: 30, height: 35 },
    titleWidthClass: "max-w-[334px]",
  },
];

const PROCESS_STEPS: readonly ProcessStep[] = [
  {
    number: "01",
    title: "Onboarding & Goals",
    body: "We set up your customer portal, run a kickoff call to align on strategy and expectations, and dive into your Reddit growth goals so every action ladders up to revenue.",
  },
  {
    number: "02",
    title: "Opportunity Mapping",
    body: "We map the high-intent discussions where your buyers are already looking — prioritizing threads that already rank in Google and get referenced by AI, so your brand lands inside pages worth real SEO value.",
  },
  {
    number: "03",
    title: "Content & Keyword Mapping",
    body: "We research the keywords your buyers search, then map each one to either a new thread worth creating or an existing conversation worth joining.",
  },
  {
    number: "04",
    title: "Value-First Participation",
    body: "Our specialists craft helpful, authentic responses that build trust and naturally guide prospects toward your solution — mastering each subreddit's unwritten rules so your account is never flagged for self-promotion.",
  },
  {
    number: "05",
    title: "Subreddit Management",
    body: "Want a community hub? We build and moderate your branded subreddit — seeding discussions, answering questions, and sharing updates to capture long-tail queries and build compounding authority.",
    optional: true,
  },
  {
    number: "06",
    title: "Engagement & Ranking Optimization",
    body: "We drive early upvotes and follow-up replies to move your comments higher in the thread and keep them visible and credible as your visibility compounds.",
  },
  {
    number: "07",
    title: "Reporting & Insights",
    body: "We track how often AI tools cite your brand, monitor mentions across LLMs with sentiment analysis, and report on the metrics that actually move revenue.",
  },
];

const METRIC_CARDS: readonly MetricCard[] = [
  {
    title: "Thread Ranking Positions",
    body: "Real-time ranking data for your posts across target subreddits.",
  },
  {
    title: "Keyword Visibility on Google",
    body: "How your Reddit threads rank in Google for your target keywords.",
  },
  {
    title: "LLM Visibility",
    body: "How often your brand appears in AI responses for category-relevant questions.",
  },
  {
    title: "Sentiment Score Shifts",
    body: "Community sentiment tracked over time, so you can see perception move.",
  },
  {
    title: "Subreddit Share of Voice",
    body: "How much of the conversation your brand owns within relevant communities.",
  },
  {
    title: "Engagement-to-Downvote Ratio",
    body: "The health of your content — positive engagement vs. negative signals.",
  },
  {
    title: "Mod Removals Prevented",
    body: "Proof your content stays compliant and respects community guidelines.",
  },
  {
    title: "Traffic + Attribution",
    body: "Full-funnel tracking from Reddit threads to conversions, with multi-touch attribution.",
  },
];

const TRUST_ITEMS: readonly TrustItem[] = [
  {
    title: "Native Community Expertise",
    description:
      "Our team lives inside Reddit. We know the culture, the mods, and the unwritten rules that keep your brand welcome instead of banned.",
  },
  {
    title: "Built for Search & AI",
    description:
      "Everything we do is engineered to rank in Google and get cited by AI — turning Reddit activity into durable, compounding visibility.",
  },
  {
    title: "Account Safety First",
    description:
      "We take deliberate precautions so your corporate account is never flagged or banned for self-promotion. Your reputation is the point.",
  },
  {
    title: "Metrics That Matter",
    description:
      "We report on rankings, AI citations, sentiment, and attribution — not vanity numbers — so you can tie Reddit to revenue.",
  },
  {
    title: "A Real Partnership",
    description:
      "Our success is measured in your results. We don't just run campaigns; we build partnerships where your growth is the only metric that matters.",
  },
];

const FAQ_ITEMS = [
  {
    question: "Is Reddit marketing safe for my brand?",
    answer:
      "Yes — when it's done right. The risk on Reddit comes from spammy, promotional behavior that ignores community rules. We participate the way trusted members do: adding genuine value, respecting each subreddit's culture, and taking deliberate steps to keep your accounts compliant and in good standing.",
    defaultOpen: true,
  },
  {
    question: "How is this different from Reddit ads?",
    answer:
      "Reddit ads are paid placements that disappear when your budget does. We build organic presence — authentic threads and comments that keep ranking in Google and getting cited by AI long after they're posted. Most brands get the best results using both together.",
    defaultOpen: false,
  },
  {
    question: "How long until I see results?",
    answer:
      "Some wins are fast — tapping into an already-ranking thread can put your brand in front of buyers within weeks. Building your own ranking threads and AI visibility compounds over a few months, and unlike ads, that visibility keeps working after the work is done.",
    defaultOpen: false,
  },
  {
    question: "Do you use real accounts or bots?",
    answer:
      "Real, human-written contributions on aged accounts with genuine posting histories. Bots and mass-spam get detected, downvoted, and banned — the opposite of what your brand needs. Everything we post is written by people who understand the community.",
    defaultOpen: false,
  },
  {
    question: "Will Reddit really help my SEO and AI visibility?",
    answer:
      "Reddit threads increasingly rank on Google's first page for buyer queries, and AI tools like ChatGPT and Perplexity treat Reddit as a trusted source. Showing up in the right conversations means owning more search real estate and influencing what AI recommends to your buyers.",
    defaultOpen: false,
  },
  {
    question: "Can you manage a branded subreddit for us?",
    answer:
      "Absolutely. If you want a community hub, we'll build and moderate your subreddit — seeding discussions, answering questions, and sharing updates to capture long-tail queries and build authority that compounds across search and AI.",
    defaultOpen: false,
  },
] as const;

// ---------------------------------------------------------------------------
// Small building blocks
// ---------------------------------------------------------------------------

/** 50×50 bordered icon tile used across the page (Figma "Group 1363:xxxx"). */
function IconTile({
  icon,
  overlay,
  className,
}: {
  icon: IconSpec;
  overlay?: OpportunityCard["iconOverlay"];
  className?: string;
}) {
  return (
    <span
      className={cn(
        "relative inline-flex size-[50px] shrink-0 items-center justify-center rounded-[12px] bg-[var(--color-hr-pure-white)] dark:bg-[var(--color-bg-dark)]",
        CARD_BORDER,
        className,
      )}
    >
      {overlay ? (
        <span
          className="relative block"
          // WHY: Figma stacks the spark (top) above the handshake (bottom) inside the tile.
          style={{ width: icon.width, height: icon.height + overlay.height }}
        >
          <Image
            alt=""
            aria-hidden
            className="absolute block dark:brightness-0 dark:invert"
            height={overlay.height}
            src={overlay.src}
            style={{ left: overlay.left, top: overlay.top, width: overlay.width, height: overlay.height }}
            width={overlay.width}
          />
          <Image
            alt=""
            aria-hidden
            className="absolute bottom-0 left-0 block dark:brightness-0 dark:invert"
            height={icon.height}
            src={icon.src}
            style={{ width: icon.width, height: icon.height }}
            width={icon.width}
          />
        </span>
      ) : (
        <Image
          alt=""
          aria-hidden
          className="block dark:brightness-0 dark:invert"
          height={icon.height}
          src={icon.src}
          style={{ width: icon.width, height: icon.height }}
          width={icon.width}
        />
      )}
    </span>
  );
}

function SectionHeading({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <>
      <SectionLabel>{label}</SectionLabel>
      <h2 className={cn("type-h2 mt-5 tracking-[-1.04px]", TEXT_PRIMARY, className)}>
        {children}
      </h2>
    </>
  );
}

/** Soft purple glow used behind the two dark sections (Figma vector 278c1). */
function DarkGlow() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-[-172px] top-[-111px] flex h-[834px] w-[1701px] items-center justify-center"
    >
      <div className="relative h-[439px] w-[1643px] flex-none rotate-[14.4deg]">
        <Image
          alt=""
          className="absolute block max-w-none"
          height={664}
          src={GLOW_SRC}
          style={{
            width: 1868,
            height: 664,
            left: "-6.85%",
            top: "-25.62%",
          }}
          width={1868}
        />
      </div>
    </div>
  );
}

function DarkCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <article className="flex flex-col gap-[30px] rounded-[40px] border border-[var(--color-hr-dark-line)] bg-[var(--color-hr-black-box)] p-[30px]">
      <h3 className="type-h3 max-w-[244px] pb-[0.15em] gradient-text-brand-light">
        {title}
      </h3>
      {children}
    </article>
  );
}

function CtaLink({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <AppLink
      className={cn(CTA_BUTTON_CLASS, TEXT_PRIMARY, className)}
      href="/contact"
      motionPreset="none"
    >
      {children}
      <GradientArrowUpRightIcon className="size-[10px]" />
    </AppLink>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

interface RedditMarketingPageProps {
  cmsFaqItems?: SanityFaqItem[];
}

export default function RedditMarketingPage({
  cmsFaqItems,
}: RedditMarketingPageProps) {
  const faqItems = cmsFaqItems?.length
    ? cmsFaqItems.map((f, i) => ({
        question: f.question,
        answer: f.answer,
        defaultOpen: i === 0,
      }))
    : FAQ_ITEMS;

  return (
    <>
      {/* Hero — Figma 1311:88 / 1311:89 / 1311:843 / 1311:838 + rectangles 1311:90-92 */}
      <section className="pt-[60px] lg:pt-[120px]" id="reddit-marketing-home">
        <div className={PAGE_SHELL_CLASS}>
          <h1 className="type-h1 mx-auto max-w-[857px] text-center">
            <GradientText className="gradient-text-brand-services">
              Reddit Marketing Services
            </GradientText>
          </h1>

          <p
            className={cn(
              "mx-auto mt-5 max-w-[598px] text-center text-[20px] leading-[28px] tracking-[-0.4px] lg:text-[24px] lg:leading-[30px]",
              TEXT_PRIMARY,
            )}
          >
            Show up in the threads that rank, convert, and shape buyer
            decisions.
          </p>

          <p
            className={cn(
              "type-paragraph mx-auto mt-5 max-w-[846px] text-center",
              TEXT_PRIMARY,
            )}
          >
            From authentic mentions to rankings to revenue — one thread at a
            time.
          </p>

          <div className="mt-[40px] flex justify-center">
            <CtaLink>Book a Reddit Strategy Call</CtaLink>
          </div>

          {/* Gradient block (1311:90) with the statue (1311:92) overflowing above it */}
          <div className="relative mt-[120px] lg:mt-[222px]">
            <div className="h-[300px] rounded-[30px] bg-[linear-gradient(42.3576deg,var(--color-hr-dark)_35.359%,var(--color-case-art-maudsch)_142.03%)] sm:h-[380px] lg:h-[480px] lg:rounded-[40px]" />
            <Image
              alt="Classical marble statue holding a disc engraved with the Reddit mascot"
              className="pointer-events-none absolute bottom-0 left-1/2 h-[400px] w-auto max-w-none -translate-x-1/2 sm:h-[500px] lg:h-[635px]"
              fetchPriority="high"
              height={2048}
              priority
              sizes="(min-width: 1024px) 635px, 500px"
              src={HERO_STATUE_SRC}
              width={2048}
            />
          </div>
        </div>
      </section>

      {/* Section 1 — Why Reddit Is Different (1313:176) */}
      <section className="pt-[10px]" id="reddit-marketing-why-different">
        <div className={PAGE_SHELL_CLASS}>
          <div
            className={cn(
              "rounded-[40px] border border-[var(--color-hr-off-white)] bg-[var(--color-hr-pure-white)] dark:border-[var(--color-border-inverse-10)] dark:bg-[var(--color-bg-dark)]",
              SECTION_PAD,
            )}
          >
            <SectionLabel>/&nbsp; Why Reddit Is Different /</SectionLabel>
            <div className="mt-[14px] flex flex-col gap-[60px] lg:flex-row lg:items-start lg:justify-between">
              <div className="lg:w-[490px] lg:shrink-0">
                <h2 className={cn("type-h2 tracking-[-1.04px]", TEXT_PRIMARY)}>
                  A channel that{" "}
                  <GradientText className="gradient-text-brand-about-heading">
                    punishes ads and rewards contribution
                  </GradientText>
                </h2>
                <p
                  className={cn(
                    "type-paragraph mt-[31px] max-w-[458px]",
                    TEXT_PRIMARY,
                  )}
                >
                  Reddit doesn&apos;t work like anywhere else. It punishes
                  anything that smells like an ad and rewards genuine, useful
                  contribution. Get it wrong and you&apos;re banned. Get it
                  right and you earn permanent, compounding visibility — in the
                  community, in Google, and in the AI tools your buyers now ask
                  for recommendations.
                </p>
              </div>

              <ul className="flex w-full flex-col lg:w-[630px] lg:shrink-0">
                {DIFFERENCE_ITEMS.map((item, index) => (
                  <li
                    className={cn(
                      "flex flex-col gap-4 py-[19px] first:pt-0 last:pb-0",
                      index !== 0
                        ? "border-t border-[var(--color-hr-light-grey)] dark:border-[var(--color-border-inverse-10)]"
                        : null,
                    )}
                    key={item.title}
                  >
                    <div className="flex items-center gap-4">
                      {item.iconIncludesBox ? (
                        <Image
                          alt=""
                          aria-hidden
                          // WHY: this asset ships with its own white tile, so only invert (no brightness-0) in dark mode.
                          className="block size-[50px] shrink-0 rounded-[12px] dark:invert"
                          height={item.icon.height}
                          src={item.icon.src}
                          width={item.icon.width}
                        />
                      ) : (
                        <IconTile icon={item.icon} />
                      )}
                      <h3 className={cn("type-h3", TEXT_PRIMARY)}>
                        {item.title}
                      </h3>
                    </div>
                    <p className={cn("type-paragraph", TEXT_PRIMARY)}>
                      {item.lines[0]}
                      <br className="hidden lg:block" aria-hidden />{" "}
                      {item.lines[1]}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 — The Opportunity (1313:197) */}
      <section className="pt-[10px]" id="reddit-marketing-opportunity">
        <div className={PAGE_SHELL_CLASS}>
          <div
            className={cn(
              "rounded-[40px] border border-[var(--color-hr-off-white)] bg-[var(--color-hr-pure-white)] dark:border-[var(--color-border-inverse-10)] dark:bg-[var(--color-bg-dark)]",
              SECTION_PAD,
            )}
          >
            <SectionHeading
              className="max-w-[571px]"
              label="/  The Opportunity  /"
            >
              Reddit is where{" "}
              <GradientText className="gradient-text-brand-about-heading">
                search, trust, and AI now overlap
              </GradientText>
            </SectionHeading>
            <p className={cn("type-paragraph mt-5", TEXT_PRIMARY)}>
              Search behavior has quietly shifted. Instead of trusting brand
              pages, buyers append &ldquo;Reddit&rdquo; to their searches to
              find real, unfiltered opinions — and Google and AI engines have
              followed them there. Reddit is one of the most-cited domains in
              AI answers and a fixture at the top of Google for commercial
              queries. That makes it the rare channel where organic search,
              buyer trust, and AI visibility all compound in the same place.
              The brands claiming that ground now are building a lead that
              gets more expensive to close every month.
            </p>

            <div className="mt-[60px] grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 lg:mt-[120px]">
              {OPPORTUNITY_CARDS.map((card) => (
                <article
                  className={cn(
                    "flex flex-col gap-5 rounded-[40px] bg-[var(--color-hr-off-white)] p-[30px] dark:bg-[var(--color-surface-inverse-10)]",
                    CARD_BORDER,
                  )}
                  key={card.title}
                >
                  <IconTile icon={card.icon} overlay={card.iconOverlay} />
                  <h3
                    className={cn(
                      "type-h3",
                      TEXT_PRIMARY,
                      card.titleWidthClass,
                    )}
                  >
                    {card.title}
                  </h3>
                  <p className={cn("type-paragraph", TEXT_PRIMARY)}>
                    {card.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 — What We Do (1313:629) */}
      <section className="pt-[10px]" id="reddit-marketing-services">
        <div className={PAGE_SHELL_CLASS}>
          <div
            className={cn(
              "rounded-[40px] bg-[var(--color-hr-off-white)] dark:bg-[var(--color-bg-dark)]",
              SECTION_PAD,
            )}
          >
            <SectionLabel>/&nbsp; What We Do /</SectionLabel>
            <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-start lg:gap-[128px]">
              <h2
                className={cn(
                  "type-h2 tracking-[-1.04px] lg:w-[630px] lg:shrink-0",
                  TEXT_PRIMARY,
                )}
              >
                A complete Reddit program,{" "}
                <GradientText className="gradient-text-brand-services">
                  run by specialists
                </GradientText>
              </h2>
              <p className={cn("type-paragraph lg:max-w-[522px]", TEXT_PRIMARY)}>
                Run by people who live inside these communities.
                <br className="hidden lg:block" aria-hidden />{" "}
                Pick the pieces you need or let us run the whole engine.
              </p>
            </div>

            <div className="mt-[60px] grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 lg:mt-[120px]">
              {SERVICE_CARDS.map((card) => (
                <article
                  className={cn(
                    "flex flex-col gap-5 rounded-[40px] bg-[var(--color-hr-pure-white)] p-[30px] dark:bg-[var(--color-bg-dark)]",
                    CARD_BORDER,
                  )}
                  key={card.title}
                >
                  <IconTile icon={card.icon} />
                  <h3
                    className={cn(
                      "type-h3",
                      TEXT_PRIMARY,
                      card.titleWidthClass,
                    )}
                  >
                    {card.title}
                  </h3>
                  <p className="type-paragraph gradient-text-brand gradient-text-brand-services">
                    {card.subtitle}
                  </p>
                  <p className={cn("type-paragraph", TEXT_PRIMARY)}>
                    {card.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 4 — Full Service Menu (1314:630) */}
      <section className="pt-[10px]" id="reddit-marketing-menu">
        <div className={PAGE_SHELL_CLASS}>
          <div
            className={cn(
              "relative overflow-hidden rounded-[40px] bg-[var(--color-hr-dark)] text-[var(--color-hr-pure-white)]",
              SECTION_PAD,
            )}
          >
            <DarkGlow />
            <div className="relative z-10">
              <SectionLabel className="text-[var(--color-hr-pure-white)]">
                /&nbsp; Full Service Menu&nbsp; /
              </SectionLabel>
              <h2 className="type-h2 mt-5 tracking-[-1.04px] text-[var(--color-hr-pure-white)]">
                Everything we can{" "}
                <GradientText className="gradient-text-brand-featured">
                  run for you
                </GradientText>
              </h2>

              <div className="mt-[60px] grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                {MENU_CARDS.map((card) => (
                  <DarkCard key={card.title} title={card.title}>
                    <ul className="type-paragraph list-disc pl-[27px] text-[var(--color-hr-pure-white)]">
                      {card.items.map((item) => (
                        <li className="mb-[3px] last:mb-0" key={item}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </DarkCard>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5 — What You Win (1360:1133) */}
      <section className="pt-[10px]" id="reddit-marketing-what-you-win">
        <div className={PAGE_SHELL_CLASS}>
          <div
            className={cn(
              "rounded-[40px] bg-[var(--color-hr-pure-white)] dark:bg-[var(--color-bg-dark)]",
              SECTION_PAD,
            )}
          >
            <SectionLabel>/&nbsp; What You Win /</SectionLabel>
            <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-start lg:gap-[128px]">
              <h2
                className={cn(
                  "type-h2 tracking-[-1.04px] lg:w-[630px] lg:shrink-0",
                  TEXT_PRIMARY,
                )}
              >
                Authentic Reddit presence{" "}
                <GradientText className="gradient-text-brand-services">
                  that moves buyers
                </GradientText>
              </h2>
              <p className={cn("type-paragraph lg:max-w-[522px]", TEXT_PRIMARY)}>
                We help your brand show up in the threads that rank, convert,
                and shape buyer decisions.
              </p>
            </div>

            <div className="mt-[60px] grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 lg:mt-[120px]">
              {WIN_CARDS.map((card) => (
                <article
                  className={cn(
                    "flex flex-col gap-5 rounded-[40px] bg-[var(--color-hr-off-white)] p-[30px] dark:bg-[var(--color-surface-inverse-10)]",
                    CARD_BORDER,
                  )}
                  key={card.title}
                >
                  <IconTile icon={card.icon} />
                  <h3
                    className={cn(
                      "type-h3",
                      TEXT_PRIMARY,
                      card.titleWidthClass,
                    )}
                  >
                    {card.title}
                  </h3>
                  <p className={cn("type-paragraph", TEXT_PRIMARY)}>
                    {card.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 6 — Our Process (1320:1197) */}
      <section className="pt-[10px]" id="reddit-marketing-process">
        <div className={PAGE_SHELL_CLASS}>
          <div
            className={cn(
              "rounded-[40px] bg-[var(--color-hr-off-white)] dark:bg-[var(--color-bg-dark)]",
              SECTION_PAD,
            )}
          >
            <SectionLabel>/&nbsp; Our Process&nbsp; /</SectionLabel>
            <div className="mt-5 flex flex-col gap-[60px] lg:flex-row lg:items-start lg:gap-[99px]">
              <div className="lg:w-[551px] lg:shrink-0">
                <h2
                  className={cn(
                    "type-h2 max-w-[456px] tracking-[-1.04px]",
                    TEXT_PRIMARY,
                  )}
                >
                  A careful process{" "}
                  <GradientText className="gradient-text-brand-about-body">
                    that grows visibility without risk
                  </GradientText>
                </h2>
                <p
                  className={cn(
                    "type-paragraph mt-5 max-w-[522px]",
                    TEXT_PRIMARY,
                  )}
                >
                  A proven, deliberate process built to grow visibility without
                  ever putting your accounts at risk.
                </p>
              </div>

              <ol className="flex w-full flex-col lg:w-[630px] lg:shrink-0">
                {PROCESS_STEPS.map((step, index) => (
                  <li
                    className={cn(
                      "flex flex-col gap-4 py-[18px] first:pt-0 last:pb-0",
                      index !== 0
                        ? "border-t border-[var(--color-hr-light-grey)] dark:border-[var(--color-border-inverse-10)]"
                        : null,
                    )}
                    key={step.number}
                  >
                    <div className="flex flex-wrap items-center gap-[14px]">
                      <span
                        className={cn(
                          "inline-flex size-[50px] shrink-0 items-center justify-center rounded-[12px] bg-[var(--color-hr-pure-white)] dark:bg-[var(--color-bg-dark)]",
                          CARD_BORDER,
                        )}
                      >
                        <span className="type-h3 gradient-text-brand gradient-text-brand-about-body pb-0">
                          {step.number}
                        </span>
                      </span>
                      <h3 className={cn("type-h3", TEXT_PRIMARY)}>
                        {step.title}
                      </h3>
                      {step.optional ? (
                        <span
                          className={cn(
                            "inline-flex items-center rounded-[20px] border border-[var(--color-hr-accent)] px-[14px] py-[6px] text-[14px] leading-none",
                            TEXT_PRIMARY,
                          )}
                        >
                          Optional
                        </span>
                      ) : null}
                    </div>
                    <p className={cn("type-paragraph", TEXT_PRIMARY)}>
                      {step.body}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Section 7 — Reporting (1360:1278) */}
      <section className="pt-[10px]" id="reddit-marketing-reporting">
        <div className={PAGE_SHELL_CLASS}>
          <div
            className={cn(
              "relative overflow-hidden rounded-[40px] bg-[var(--color-hr-dark)] text-[var(--color-hr-pure-white)]",
              SECTION_PAD,
            )}
          >
            <DarkGlow />
            <div className="relative z-10">
              <SectionLabel className="text-[var(--color-hr-pure-white)]">
                /&nbsp; Reporting&nbsp; /
              </SectionLabel>
              <h2 className="type-h2 mt-5 tracking-[-1.04px] text-[var(--color-hr-pure-white)]">
                Reddit metrics{" "}
                <GradientText className="gradient-text-brand-featured">
                  we actually track
                </GradientText>
              </h2>
              <p className="type-paragraph mt-5 text-[var(--color-hr-pure-white)]">
                Most agencies hand you upvotes and comment counts and call it a
                report. We track the metrics that reflect brand growth, SEO
                performance, and AI visibility. This is where Heroic Rankings
                wins.
              </p>

              <div className="mt-[60px] grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                {METRIC_CARDS.map((card) => (
                  <DarkCard key={card.title} title={card.title}>
                    <p className="type-paragraph text-[var(--color-hr-pure-white)]">
                      {card.body}
                    </p>
                  </DarkCard>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 8 — Why Heroic Rankings (loose nodes 1320:1339 … 1320:1368) */}
      <section
        className="pt-[60px] lg:pt-[140px]"
        id="reddit-marketing-why-heroic"
      >
        <div className={PAGE_SHELL_CLASS}>
          <div className="px-5 sm:px-8 lg:px-[70px]">
            <SectionHeading
              className="max-w-[406px]"
              label="/  Why Heroic Rankings  /"
            >
              Why brands trust us{" "}
              <GradientText className="gradient-text-brand-trust">
                with Reddit?
              </GradientText>
            </SectionHeading>

            <div className="mt-[80px] grid grid-cols-1 gap-y-[56px] md:grid-cols-2 lg:grid-cols-3">
              {TRUST_ITEMS.map((item) => (
                <article
                  className="border-l border-[var(--color-hr-light-grey)] pl-[30px] dark:border-[var(--color-border-inverse-10)]"
                  key={item.title}
                >
                  <h3
                    className={cn("type-h3 max-w-[290px]", TEXT_PRIMARY)}
                  >
                    {item.title}
                  </h3>
                  <p
                    className={cn(
                      "type-paragraph mt-5 max-w-[315px]",
                      TEXT_PRIMARY,
                    )}
                  >
                    {item.description}
                  </p>
                </article>
              ))}

              <article className="border-l border-[var(--color-hr-light-grey)] pl-[30px] dark:border-[var(--color-border-inverse-10)]">
                <h3 className={cn("type-h3 max-w-[186px]", TEXT_PRIMARY)}>
                  Ready to Own Reddit?
                </h3>
                <CtaLink className="mt-[44px] w-full max-w-[251px] whitespace-nowrap lg:w-auto lg:min-w-[212px]">
                  Book a Strategy Call
                </CtaLink>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* Section 9 — FAQ (1320:1457) */}
      <ServiceFaq
        items={faqItems}
        renderIcon={
          <span className="inline-flex size-[18px] items-center justify-center">
            <FaqPlusIcon className="size-[18px] transition-transform duration-200 group-open:-rotate-45 dark:text-[var(--color-text-inverse)]" />
          </span>
        }
        sectionId="reddit-marketing-faq"
      />
    </>
  );
}
