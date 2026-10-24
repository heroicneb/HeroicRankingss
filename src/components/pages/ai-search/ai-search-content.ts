import { hl, img, tx } from "../shared/page-content.ts";
import { DEFAULT_WHY_CHOOSE, processSteps, type SeoServicePageDefinition } from "../shared/seo-service-content.ts";

/*
 * AI Search Optimization (GEO & AEO) service page. Copy approved from the
 * 2026-10-23 draft ("SEO Services and AI Search Pages: Draft Copy").
 * Target terms: generative engine optimization services, answer engine
 * optimization services, AI SEO services, AEO/GEO agency.
 */

const icon = (file: string, w: number, h: number) => img(`/ai-search/${file}`, w, h);
/** A why-us reason reusing the shared icon at that position. */
const why = (index: number, title: string, description: string) => ({ title, description, icon: DEFAULT_WHY_CHOOSE.items[index]?.icon ?? null });

export const AI_SEARCH_PAGE: SeoServicePageDefinition = {
  key: "ai-search",
  title: "AI Search Optimization (GEO & AEO)",
  path: "/seo/ai-search",
  faqService: "ai-search",
  seo: {
    title: "AI Search Optimization Services: GEO & AEO Agency",
    description:
      "Get cited in AI Overviews, AI Mode, ChatGPT and Perplexity. Our GEO and AEO services audit where AI mentions you, fix why it doesn't, and track it monthly.",
  },
  content: {
    hero: {
      title: [tx("AI Search Optimization Services: "), hl("Get Cited Where Buyers Ask")],
      tagline: [tx("A GEO and AEO agency that puts your brand "), hl("inside the answer"), tx(", not under it.")],
      label: "/ GEO & AEO services /",
      heading: [tx("When a buyer asks AI who to trust, "), hl("be the name it gives")],
      paragraphs: [
        "ChatGPT, Perplexity and Google's AI Mode answer a buyer's question with a handful of brands. Our generative engine optimization (GEO) and answer engine optimization (AEO) services put yours on that list, and keep it there.",
        "58% of US adults saw an AI Overview on at least one Google search in Pew Research Center's 2025 study. Every Heroic Rankings SEO programme has included AI search work since 2024.",
      ],
      ctaLabel: "Get a Free AI Visibility Audit",
      ctaUrl: "/contact",
      image: img("/ai-search/hero.webp", 1361, 642, "AI chat window citing sources, with ChatGPT and Claude logos"),
    },
    solutions: {
      label: "/ What's included /",
      heading: [tx("What Our "), hl("AI Search Optimization Services"), tx(" Include")],
      cards: [
        {
          title: "AI Citation Audit",
          subtitle: "Know where you stand before you spend",
          body: "A fixed set of buyer prompts run across AI Overviews, AI Mode, ChatGPT, Perplexity and Gemini, scored monthly. You see which questions cite you, which cite competitors, and which cite nobody yet.",
          ctaLabel: "Get Your Audit",
          ctaUrl: "/contact",
          icon: icon("icon-audit.svg", 33, 30),
        },
        {
          title: "Answer-First Content",
          subtitle: "Pages built to be quoted",
          body: "Existing pages restructured so each section opens with a direct answer, and new pages built for the questions buyers ask AI. Includes the FAQ and comparison pages AI systems quote most.",
          ctaLabel: "Restructure My Pages",
          ctaUrl: "/contact",
          icon: icon("icon-answer-content.svg", 30, 30),
        },
        {
          title: "Technical Readiness",
          subtitle: "Make your answers readable by machines",
          body: "Schema markup for FAQ, HowTo, Product and Organization, crawl access for AI bots, rendering fixes so your answers exist in the HTML the systems read, and an llms.txt where it helps.",
          ctaLabel: "Check My Site",
          ctaUrl: "/contact",
          icon: icon("icon-technical.svg", 36, 36),
        },
        {
          title: "Brand Mention Building",
          subtitle: "Mentions, not only links",
          body: "Digital PR, expert quotes, listicle placements, Reddit and community presence, and the review and directory profiles AI systems weigh when they decide which brands to trust on a topic.",
          ctaLabel: "Build My Authority",
          ctaUrl: "/contact",
          icon: icon("icon-mentions.svg", 26, 33),
        },
        {
          title: "Original Data and Linkable Assets",
          subtitle: "Become the source others cite",
          body: "Statistics roundups, studies and tools that make your pages the source other sites and AI systems cite. Our own AI Overview statistics page exists for exactly that reason, and is our most-linked page.",
          ctaLabel: "Plan an Asset",
          ctaUrl: "/contact",
          icon: icon("icon-assets.svg", 30, 31),
        },
        {
          title: "AI Visibility Reporting",
          subtitle: "Comparable month to month",
          body: "A monthly report with citation share by prompt, brand mentions, AI referral traffic in GA4, and what changed. The same prompt set every month, so progress is measured, not guessed.",
          ctaLabel: "See a Sample Report",
          ctaUrl: "/contact",
          icon: icon("icon-reporting.svg", 32, 32),
        },
      ],
      hubCards: [],
      banner: {
        heading: [tx("From "), hl("invisible"), tx(" to "), hl("cited"), tx(": how an AI search programme runs")],
        steps: processSteps(
          [
            "Weeks 1 to 2. We define the prompts your buyers actually ask, run them across every major AI system, and map where you, your competitors and third-party sources appear.",
            "Week 3. For each prompt you lose, we find out why: no page, wrong structure, no authority on the topic, or stale facts. Each gap gets an owner and a fix.",
            "Monthly sprints. Pages restructured, schema shipped, new answer pages published, assets created.",
            "Continuous. PR, expert commentary, community and review presence, aimed at the sources AI systems already trust for your topic.",
            "Monthly. Citation share re-run on the same prompt set, so progress is comparable month to month. New prompts added as your product and market move.",
          ],
          ["Audit", "Gap Analysis", "Fix and Build", "Earn Mentions", "Measure and Expand"],
        ),
        ctaLabel: "Start With the Audit",
        ctaUrl: "/contact",
      },
    },
    whyChoose: {
      ...DEFAULT_WHY_CHOOSE,
      heading: [tx("Why Choose Heroic Rankings for "), hl("AI Search?")],
      items: [
        why(0, "SEO Foundation Included", "AI systems cite pages search engines already trust. Our GEO work sits on top of a full SEO programme, so the ranking and the citation are earned together."),
        why(1, "Measured, Not Guessed", "The same buyer prompts run every month across every major AI system. You see citation share move, prompt by prompt."),
        why(2, "We Practise It", "Our AI Overview statistics page is cited by over 100 referring domains and quoted in AI answers. We build the same assets for clients."),
        why(3, "Transparent Reporting", "One monthly report and a client portal with every deliverable, every mention and every link. Nothing hidden behind a dashboard you cannot read."),
        why(4, "30+ Languages", "AI answers differ by market. We run prompt sets and mention building per language, with native speakers on the team."),
      ],
      ctaTitle: "See What AI Says About You Today",
      ctaLabel: "Get a Free AI Visibility Audit",
      ctaUrl: "/contact",
    },
    faq: {
      items: [
        { question: "What is generative engine optimization?", answer: "Generative engine optimization (GEO) is the practice of making a brand's content easy for AI systems to find, understand and cite in generated answers such as Google's AI Overviews, AI Mode, ChatGPT and Perplexity. It builds on SEO, since those systems mostly cite pages search engines already index." },
        { question: "What is the difference between GEO and AEO?", answer: "GEO focuses on being cited in AI-generated answers. AEO (answer engine optimization) focuses on structuring pages so any answer engine, from a featured snippet to a voice assistant, can lift a direct answer from them. In practice one programme covers both." },
        { question: "Do I need GEO if I already do SEO?", answer: "If you rank well, you already have the foundation. GEO adds the passage structure, the brand mentions and the measurement that turn rankings into citations. Most clients run it as part of their SEO programme." },
        { question: "How do you measure AI visibility?", answer: "We run the same set of buyer prompts every month across the major AI systems and record which brands and sources each answer cites. That gives a citation share per prompt that is comparable month to month, alongside AI referral traffic in GA4." },
        { question: "How long does it take to get cited in AI answers?", answer: "Pages that already rank can appear in AI answers within weeks of being restructured. Earning citations on topics where you have no authority yet takes months, because it depends on mentions from sources the systems trust." },
        { question: "Can you guarantee a mention in ChatGPT or AI Overviews?", answer: "No. AI systems change their sources and models constantly, and nobody controls them. We guarantee the audit, the work and the monthly measurement." },
        { question: "Which AI systems do you optimise for?", answer: "Google AI Overviews and AI Mode, ChatGPT, Perplexity, Gemini and Claude, plus Bing Copilot where your market uses it. The same page work serves all of them; the mention work is tuned to the sources each one favours." },
        { question: "How much do AI search optimization services cost?", answer: "They are priced as a monthly retainer scoped to the number of prompts tracked, pages restructured and mentions earned per month. AI search is included in our Growth and Scale SEO programmes and available on its own. Every proposal lists deliverables, timeline and how results are measured." },
      ],
    },
  },
};

/** Sections unique to this page (not in the shared CMS model). */
export const AI_SEARCH_EXTRAS = {
  definition: {
    label: "/ What it is /",
    heading: [tx("What Are "), hl("GEO and AEO"), tx(" Services?")],
    paragraphs: [
      "Generative engine optimization (GEO) services make a brand's pages easy for AI systems to find, understand and cite in their answers: Google's AI Overviews and AI Mode, ChatGPT, Perplexity, Gemini and Claude. Answer engine optimization (AEO) is the same work seen from the page side: structuring content so a system can lift a direct, accurate answer from it. Both build on classic SEO, because AI systems mostly cite pages that search engines already index and trust.",
      "The difference from SEO is the unit of competition. Search ranks whole pages; AI answers quote passages. A page can rank third on Google and still be the only source an AI answer cites, or rank first and be ignored because its answer is buried in paragraph nine.",
    ],
  },
  howAiChooses: {
    label: "/ How it works /",
    heading: [tx("How AI Systems "), hl("Choose What to Cite")],
    items: [
      { title: "Index first", description: "AI Overviews, AI Mode and most chatbots with web search pull from pages already in Google's or Bing's index. Pages that do not rank for anything rarely get cited." },
      { title: "Passage, not page", description: "Systems quote short, self-contained passages that answer one question directly, with the facts near the top." },
      { title: "Entity trust", description: "They learn which brands are credible on a topic from how often reputable sources mention them, with or without a link: industry publications, Reddit, YouTube, review sites." },
      { title: "Freshness", description: "For fast-moving topics, systems prefer recent sources, so visible update dates and current figures win." },
    ],
  },
  compare: {
    label: "/ SEO vs AI search /",
    heading: [tx("GEO and AEO "), hl("Compared With SEO")],
    columns: ["", "Classic SEO", "AI search optimization"],
    rows: [
      ["Goal", "Rank a page and win the click", "Be cited in the answer"],
      ["Unit", "The page", "The passage, table or direct answer"],
      ["Authority signal", "Backlinks and site reputation", "Backlinks plus brand mentions across the web"],
      ["Content style", "Comprehensive, matched to intent", "Direct answers, self-contained sections, clear structure"],
      ["Main metric", "Rankings, clicks, conversions", "Citations, brand mentions, AI referral traffic"],
    ],
    note: "Everything in the right column builds on the left, which is why we run AI search as part of our SEO services rather than instead of them.",
    linkLabel: "See our SEO services",
    linkHref: "/seo/",
  },
  audience: {
    label: "/ Who it's for /",
    heading: [tx("Built for Brands "), hl("Buyers Ask AI About")],
    items: [
      { title: "SaaS and B2B", description: "Buyers research vendors in ChatGPT and Perplexity before they ever reach a sales call.", href: "/case-study/cirrus-insight/", linkLabel: "Cirrus Insight case study" },
      { title: "Publishers and comparison sites", description: "Losing clicks to AI Overviews and needing the citation instead.", href: "/seo/google-ai-overview-statistics/", linkLabel: "AI Overview statistics" },
      { title: "eCommerce brands", description: "Products get recommended, or not, inside AI shopping answers.", href: "/seo/e-commerce/", linkLabel: "E-commerce SEO services" },
      { title: "Agencies", description: "Add GEO to your offer under your own brand through our partnership.", href: "/white-label-seo-partnership/", linkLabel: "White-label partnership" },
    ],
  },
};
