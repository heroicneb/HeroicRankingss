/*
 * Normalised content model for /seo/reddit-marketing — see page-content.ts
 * for the shared building blocks. Default content is the copy from Figma
 * frame 1311:48; the seed script loads it into the "Reddit Marketing Page"
 * document.
 */

import {
  hl,
  img,
  tx,
  type ContentImage,
  type FaqEntry,
  type HeadingSegment,
} from "../shared/page-content.ts";

export interface IconItem {
  title: string;
  description: string;
  icon: ContentImage | null;
}

export interface RedditMarketingContent {
  hero: {
    heading: HeadingSegment[];
    subtitle: string;
    tagline: string;
    ctaLabel: string;
    ctaUrl: string;
    image: ContentImage | null;
  };
  whyDifferent: { label: string; heading: HeadingSegment[]; intro: string; items: IconItem[] };
  opportunity: { label: string; heading: HeadingSegment[]; intro: string; cards: IconItem[] };
  whatWeDo: {
    label: string;
    heading: HeadingSegment[];
    intro: string;
    cards: Array<IconItem & { subtitle: string }>;
  };
  serviceMenu: { label: string; heading: HeadingSegment[]; cards: Array<{ title: string; items: string[] }> };
  whatYouWin: { label: string; heading: HeadingSegment[]; intro: string; cards: IconItem[] };
  process: {
    label: string;
    heading: HeadingSegment[];
    intro: string;
    steps: Array<{ number: string; title: string; description: string; optional: boolean }>;
  };
  reporting: { label: string; heading: HeadingSegment[]; intro: string; cards: Array<{ title: string; body: string }> };
  whyTrust: {
    label: string;
    heading: HeadingSegment[];
    items: Array<{ title: string; description: string }>;
    ctaTitle: string;
    ctaLabel: string;
    ctaUrl: string;
  };
  faq: { items: FaqEntry[] };
}

const rm = (file: string, w: number, h: number, alt = "") => img(`/reddit-marketing/${file}`, w, h, alt);

export const DEFAULT_REDDIT_MARKETING_CONTENT: RedditMarketingContent = {
  hero: {
    heading: [hl("Reddit Marketing Services")],
    subtitle: "Show up in the threads that rank, convert, and shape buyer decisions.",
    tagline: "From authentic mentions to rankings to revenue — one thread at a time.",
    ctaLabel: "Book a Reddit Strategy Call",
    ctaUrl: "/contact",
    image: rm("hero-statue.webp", 2048, 2048, "Classical marble statue holding a disc engraved with the Reddit mascot"),
  },

  whyDifferent: {
    label: "/  Why Reddit Is Different /",
    heading: [tx("A channel that "), hl("punishes ads and rewards contribution")],
    intro:
      "Reddit doesn't work like anywhere else. It punishes anything that smells like an ad and rewards genuine, useful contribution. Get it wrong and you're banned. Get it right and you earn permanent, compounding visibility — in the community, in Google, and in the AI tools your buyers now ask for recommendations.",
    items: [
      { title: "Authenticity beats advertising", description: "Reddit hates ads but rewards people who genuinely help.\nThe playbook is contribution, not promotion.", icon: rm("icon-authenticity.svg", 50, 50) },
      { title: "Moderators hold the power", description: "Each community sets and enforces its own rules.\nWe know how to work with them, not against them.", icon: rm("icon-moderators.svg", 28, 33) },
      { title: "Culture is subreddit-specific", description: "There's no single “Reddit voice.”\nEvery community has unwritten rules we learn before we ever post.", icon: rm("icon-culture.svg", 36, 36) },
      { title: "Corporate accounts face scrutiny", description: "Brand accounts get less rope.\nWe protect yours with careful, compliant participation.", icon: rm("icon-corporate.svg", 34, 35) },
      { title: "Threads are evergreen assets", description: "A single well-placed thread keeps ranking\nand getting cited by Google and AI for years.", icon: rm("icon-evergreen.svg", 32, 32) },
      { title: "The right move compounds", description: "Done well, Reddit isn't a campaign that ends.\nIt's an asset that keeps working long after.", icon: rm("icon-compounds.svg", 24, 35) },
    ],
  },

  opportunity: {
    label: "/  The Opportunity  /",
    heading: [tx("Reddit is where "), hl("search, trust, and AI now overlap")],
    intro:
      "Search behavior has quietly shifted. Instead of trusting brand pages, buyers append “Reddit” to their searches to find real, unfiltered opinions — and Google and AI engines have followed them there. Reddit is one of the most-cited domains in AI answers and a fixture at the top of Google for commercial queries. That makes it the rare channel where organic search, buyer trust, and AI visibility all compound in the same place. The brands claiming that ground now are building a lead that gets more expensive to close every month.",
    cards: [
      { title: "Claim More of the Search Results Page", description: "Ranking your own site once is no longer enough. On buyer queries, Reddit threads routinely occupy the results Google used to reserve for brands and review sites. When your brand is present in those threads, you extend your reach into positions your domain can't rank for on its own — turning a single search into several touchpoints that all point back to you.", icon: rm("icon-search-results.svg", 30, 31) },
      { title: "Become a Source AI Engines Quote", description: "ChatGPT, Perplexity, Google AI Overviews, and Gemini lean heavily on Reddit when they generate recommendations, because it reads as genuine human experience. Shaping those conversations is how you get named in the answer itself — not buried on page two of a link list. As AI-assisted buying grows, being the brand the model cites becomes a moat competitors can't easily copy.", icon: rm("icon-ai-quote.svg", 32, 35) },
      { title: "Win the Trust Brand Content Can't Buy", description: "Buyers have learned to discount polished marketing copy. What moves them is a stranger with no incentive vouching for a product in a thread full of skeptics. Reddit is where that peer validation happens, and a credible presence there carries more weight in a purchase decision than anything on your own website ever will.", icon: rm("icon-trust-composite.svg", 36, 36) },
      { title: "Reach Buyers at the Moment of Decision", description: "Reddit discussions like “best [tool] for [use case]” or “is [product] worth it?” are pure high-intent moments — someone actively comparing options and close to buying. Showing up helpfully in exactly those threads puts your brand in front of demand at the point it's most ready to convert, not at the top of a cold funnel.", icon: rm("icon-buyer-decision.svg", 30, 30) },
      { title: "Build Assets That Compound, Not Expire", description: "Paid placements vanish the day you stop funding them. A well-placed Reddit thread does the opposite: it keeps ranking, keeps getting read, and keeps getting cited months and years later. Every thread you seed adds to a growing library of evergreen visibility that works while you sleep — an appreciating asset instead of a recurring cost.", icon: rm("icon-evergreen.svg", 32, 32) },
      { title: "Move Before the Window Narrows", description: "Most of your competitors either fear Reddit or handle it badly enough to get banned. That gap is the opportunity. Establishing authentic authority now — while communities are still open to it and CPMs are still low — locks in credibility and rankings that are far harder to displace once everyone else catches on.", icon: rm("icon-window.svg", 31, 31) },
    ],
  },

  whatWeDo: {
    label: "/  What We Do /",
    heading: [tx("A complete Reddit program, "), hl("run by specialists")],
    intro: "Run by people who live inside these communities.\nPick the pieces you need or let us run the whole engine.",
    cards: [
      { title: "Brand Mentions", subtitle: "Authentic mentions in high-traffic subreddits", description: "Natural, credible mentions inside the threads your buyers already read — positioned to inform, not to sell.", icon: rm("icon-brand-mentions.svg", 35, 35) },
      { title: "Comment Service", subtitle: "Real, human-written comments in relevant threads", description: "Native comments by real people who understand each community, added where your product genuinely fits.", icon: rm("icon-comment-service.svg", 35, 35) },
      { title: "Post Creation", subtitle: "Native long-form posts that rank and convert", description: "Original, discussion-worthy posts that earn upvotes, rank in Google, and feed AI quality signals about your brand.", icon: rm("icon-post-creation.svg", 35, 35) },
      { title: "Engagement Service", subtitle: "Organic discussion and genuine community signals", description: "Upvotes, replies, and authentic discussion that build momentum and keep your content visible and credible.", icon: rm("icon-engagement.svg", 37, 31) },
      { title: "Managed Accounts", subtitle: "Aged, niche-relevant accounts ready to engage", description: "Aged, high-karma accounts with real histories that participate naturally — never flagged, never spammy.", icon: rm("icon-managed-accounts.svg", 32, 35) },
      { title: "Reputation Management", subtitle: "Suppress negatives and rebuild trust", description: "We push down damaging threads, seed accurate information, and rebuild a fair picture of your brand.", icon: rm("icon-reputation.svg", 27, 35) },
      { title: "Reddit SEO", subtitle: "Rank your threads in Google for buyer queries", description: "We build and optimize threads to rank for the searches your buyers make — a second front-page presence.", icon: rm("icon-reddit-seo.svg", 36, 30) },
      { title: "Reddit GEO & AI Visibility", subtitle: "Get cited by ChatGPT, Perplexity & AI Overviews", description: "We seed the long-tail details AI tools pull from, so your brand is in the answer when buyers ask.", icon: rm("icon-ai-quote.svg", 32, 35) },
    ],
  },

  serviceMenu: {
    label: "/  Full Service Menu  /",
    heading: [tx("Everything we can "), hl("run for you")],
    cards: [
      { title: "Strategy & Foundations", items: ["Reddit strategy & roadmap", "Corporate / brand account management", "Managed aged accounts"] },
      { title: "Community & Presence", items: ["Subreddit creation & moderation", "Subreddit opportunity scouting", "Thread creation & engagement"] },
      { title: "Reputation & Influence", items: ["Proactive reputation seeding", "Crisis management (reactive)", "AMA hosting & promotion"] },
      { title: "Performance & Insights", items: ["Reddit SEO", "Reddit GEO & AI visibility", "Insights & reporting", "Packaged options"] },
    ],
  },

  whatYouWin: {
    label: "/  What You Win /",
    heading: [tx("Authentic Reddit presence "), hl("that moves buyers")],
    intro: "We help your brand show up in the threads that rank, convert, and shape buyer decisions.",
    cards: [
      { title: "Win Rankings Through Reddit", description: "We create authentic Reddit threads — or tap into existing ones — that rank in Google for your buyer keywords.", icon: rm("icon-win-rankings.svg", 34, 34) },
      { title: "Win the #1 Comment Spot", description: "We position your comment at the top of the target thread, making it the first answer buyers read.", icon: rm("icon-top-comment.svg", 35, 30) },
      { title: "Build Consensus With Multiple Voices", description: "We seed multiple authentic comments to create genuine consensus, build trust, and move buyers closer to a decision.", icon: rm("icon-handshake.svg", 36, 22) },
      { title: "Shape AI Search Results", description: "We plant the key details AI tools rely on, so they answer buyer questions in your favor.", icon: rm("icon-shape-ai.svg", 30, 35) },
    ],
  },

  process: {
    label: "/  Our Process  /",
    heading: [tx("A careful process "), hl("that grows visibility without risk")],
    intro: "A proven, deliberate process built to grow visibility without ever putting your accounts at risk.",
    steps: [
      { number: "01", title: "Onboarding & Goals", description: "We set up your customer portal, run a kickoff call to align on strategy and expectations, and dive into your Reddit growth goals so every action ladders up to revenue.", optional: false },
      { number: "02", title: "Opportunity Mapping", description: "We map the high-intent discussions where your buyers are already looking — prioritizing threads that already rank in Google and get referenced by AI, so your brand lands inside pages worth real SEO value.", optional: false },
      { number: "03", title: "Content & Keyword Mapping", description: "We research the keywords your buyers search, then map each one to either a new thread worth creating or an existing conversation worth joining.", optional: false },
      { number: "04", title: "Value-First Participation", description: "Our specialists craft helpful, authentic responses that build trust and naturally guide prospects toward your solution — mastering each subreddit's unwritten rules so your account is never flagged for self-promotion.", optional: false },
      { number: "05", title: "Subreddit Management", description: "Want a community hub? We build and moderate your branded subreddit — seeding discussions, answering questions, and sharing updates to capture long-tail queries and build compounding authority.", optional: true },
      { number: "06", title: "Engagement & Ranking Optimization", description: "We drive early upvotes and follow-up replies to move your comments higher in the thread and keep them visible and credible as your visibility compounds.", optional: false },
      { number: "07", title: "Reporting & Insights", description: "We track how often AI tools cite your brand, monitor mentions across LLMs with sentiment analysis, and report on the metrics that actually move revenue.", optional: false },
    ],
  },

  reporting: {
    label: "/  Reporting  /",
    heading: [tx("Reddit metrics "), hl("we actually track")],
    intro:
      "Most agencies hand you upvotes and comment counts and call it a report. We track the metrics that reflect brand growth, SEO performance, and AI visibility. This is where Heroic Rankings wins.",
    cards: [
      { title: "Thread Ranking Positions", body: "Real-time ranking data for your posts across target subreddits." },
      { title: "Keyword Visibility on Google", body: "How your Reddit threads rank in Google for your target keywords." },
      { title: "LLM Visibility", body: "How often your brand appears in AI responses for category-relevant questions." },
      { title: "Sentiment Score Shifts", body: "Community sentiment tracked over time, so you can see perception move." },
      { title: "Subreddit Share of Voice", body: "How much of the conversation your brand owns within relevant communities." },
      { title: "Engagement-to-Downvote Ratio", body: "The health of your content — positive engagement vs. negative signals." },
      { title: "Mod Removals Prevented", body: "Proof your content stays compliant and respects community guidelines." },
      { title: "Traffic + Attribution", body: "Full-funnel tracking from Reddit threads to conversions, with multi-touch attribution." },
    ],
  },

  whyTrust: {
    label: "/  Why Heroic Rankings  /",
    heading: [tx("Why brands trust us "), hl("with Reddit?")],
    items: [
      { title: "Native Community Expertise", description: "Our team lives inside Reddit. We know the culture, the mods, and the unwritten rules that keep your brand welcome instead of banned." },
      { title: "Built for Search & AI", description: "Everything we do is engineered to rank in Google and get cited by AI — turning Reddit activity into durable, compounding visibility." },
      { title: "Account Safety First", description: "We take deliberate precautions so your corporate account is never flagged or banned for self-promotion. Your reputation is the point." },
      { title: "Metrics That Matter", description: "We report on rankings, AI citations, sentiment, and attribution — not vanity numbers — so you can tie Reddit to revenue." },
      { title: "A Real Partnership", description: "Our success is measured in your results. We don't just run campaigns; we build partnerships where your growth is the only metric that matters." },
    ],
    ctaTitle: "Ready to Own Reddit?",
    ctaLabel: "Book a Strategy Call",
    ctaUrl: "/contact",
  },

  faq: {
    items: [
      { question: "Is Reddit marketing safe for my brand?", answer: "Yes — when it's done right. The risk on Reddit comes from spammy, promotional behavior that ignores community rules. We participate the way trusted members do: adding genuine value, respecting each subreddit's culture, and taking deliberate steps to keep your accounts compliant and in good standing." },
      { question: "How is this different from Reddit ads?", answer: "Reddit ads are paid placements that disappear when your budget does. We build organic presence — authentic threads and comments that keep ranking in Google and getting cited by AI long after they're posted. Most brands get the best results using both together." },
      { question: "How long until I see results?", answer: "Some wins are fast — tapping into an already-ranking thread can put your brand in front of buyers within weeks. Building your own ranking threads and AI visibility compounds over a few months, and unlike ads, that visibility keeps working after the work is done." },
      { question: "Do you use real accounts or bots?", answer: "Real, human-written contributions on aged accounts with genuine posting histories. Bots and mass-spam get detected, downvoted, and banned — the opposite of what your brand needs. Everything we post is written by people who understand the community." },
      { question: "Will Reddit really help my SEO and AI visibility?", answer: "Reddit threads increasingly rank on Google's first page for buyer queries, and AI tools like ChatGPT and Perplexity treat Reddit as a trusted source. Showing up in the right conversations means owning more search real estate and influencing what AI recommends to your buyers." },
      { question: "Can you manage a branded subreddit for us?", answer: "Absolutely. If you want a community hub, we'll build and moderate your subreddit — seeding discussions, answering questions, and sharing updates to capture long-tail queries and build authority that compounds across search and AI." },
    ],
  },
};

export const REDDIT_MARKETING_DEFAULT_SEO = {
  title: "Reddit Marketing Services",
  description:
    "Show up in the Reddit threads that rank in Google, get cited by AI, and shape buyer decisions — authentic mentions, comments, posts, and reputation management run by specialists.",
};
