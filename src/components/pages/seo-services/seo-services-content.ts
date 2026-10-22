import { hl, img, tx } from "../shared/page-content.ts";
import { DEFAULT_WHY_CHOOSE, processSteps, type SeoServicePageDefinition } from "../shared/seo-service-content.ts";

/*
 * SEO services hub (/seo). Copy approved from the 2026-10-23 draft
 * ("SEO Services and AI Search Pages: Draft Copy"). Target terms: SEO
 * services, professional SEO services, SEO services company, SEO agency.
 * The definition, results and audience sections live in
 * seo-services-extras.ts (fixed copy, not in the CMS model).
 */

const card = (file: string, w: number, h: number) => img(`/seo-services/${file}`, w, h);
const why = (index: number, title: string, description: string) => ({ title, description, icon: DEFAULT_WHY_CHOOSE.items[index]?.icon ?? null });

export const SEO_SERVICES_PAGE: SeoServicePageDefinition = {
  key: "seo-services",
  title: "SEO Services (hub)",
  path: "/seo",
  faqService: "seo-services",
  seo: {
    title: "SEO Services for Google and AI Search | Heroic Rankings",
    description:
      "SEO services that grow traffic and revenue: technical SEO, content, link building and AI search visibility. 0 to 63.5K monthly visitors in 24 months for one client.",
  },
  content: {
    hero: {
      title: [tx("SEO Services That Grow Traffic on "), hl("Google and in AI Answers")],
      tagline: [
        tx("We build organic growth engines for SaaS, B2B and eCommerce brands: a technical foundation that gets every page indexed, content that earns links, and pages AI systems cite. Measured in "),
        hl("traffic and revenue"),
        tx(", not rankings alone."),
      ],
      label: "/ SEO, GEO & AEO services /",
      heading: [tx("Rank on Google. "), hl("Get cited in AI answers.")],
      paragraphs: [
        "SEO is a long-term growth engine and we build it with precision, visibility across searches not just rankings.",
        "At Heroic Rankings, we combine data, strategy, and execution to drive measurable rankings, traffic, and revenue.",
        "Our methods ensure brands aren't just ranking, they're being referenced, cited, and surfaced across LLM-driven results.",
      ],
      ctaLabel: "Get Your SEO Audit Now!",
      ctaUrl: "/contact",
      image: img("/seo-services/hero-statue.webp", 3072, 4096, "Classical statue holding a sword"),
    },
    solutions: {
      label: "/ What's included /",
      heading: [tx("All-Inclusive "), hl("SEO Solutions")],
      cards: [],
      hubCards: [
        { title: "On-Page SEO", description: "Turn pages that already exist into pages that rank", descriptionGradient: true, image: card("subtract-6.webp", 1260, 840), backIntro: "Turn pages that already exist into pages that rank. Our on-page SEO services cover:", backPoints: ["Title, heading and intent optimisation", "Internal linking architecture", "Schema markup and rich result eligibility", "Trust signals: authors, sources, update dates"], href: "/seo/on-page" },
        { title: "Local SEO", description: "Win the map pack and \"near me\" searches", descriptionGradient: false, image: card("subtract-7.png", 610, 840), backIntro: "Win the map pack and \"near me\" searches. Our local SEO services include:", backPoints: ["Google Business Profile optimisation", "Review strategy and response", "Citations and NAP consistency", "Location and service-area pages"], href: "/seo/local" },
        { title: "Technical SEO", description: "Make every page crawlable, fast and indexable", descriptionGradient: false, image: card("subtract-5.png", 610, 840), backIntro: "Make every page crawlable, fast and indexable. Our technical SEO services cover:", backPoints: ["Full technical audit with a prioritised fix list", "Core Web Vitals, speed and mobile usability", "Indexing and crawl management", "JavaScript rendering, migrations and redirect maps"], href: "/seo/technical" },
        { title: "Link Building", description: "Earn links that move rankings and stay live", descriptionGradient: true, image: card("subtract-4.webp", 2560, 840), backIntro: "Earn links that move rankings and stay live. Our link building services include:", backPoints: ["Editorial links from relevant, trafficked sites", "Digital PR and linkable assets", "Link monitoring: under 5% link loss, 80% of new links indexed within a month", "Backlink audits and cleanup"], href: "/seo/linkbuilding" },
        { title: "E-Commerce SEO", description: "Get category and product pages in front of buyers", descriptionGradient: false, image: card("subtract-1.png", 610, 840), backIntro: "Get category and product pages in front of buyers. Our e-commerce SEO services include:", backPoints: ["Category page structure and copy", "Product page optimisation and product schema", "Faceted navigation and duplicate URL control", "Out-of-stock and variant handling"], href: "/seo/e-commerce" },
        { title: "Content Services", description: "Publish the pages your buyers search for", descriptionGradient: false, image: card("subtract-2.png", 610, 840), backIntro: "Publish the pages your buyers search for. Our content services include:", backPoints: ["Keyword-mapped content briefs", "Articles, guides and comparison pages written by specialists", "One linkable asset a month: data, tools, original research", "Refreshes of pages that have started to slip"], href: "/seo/content-creation" },
        { title: "Keyword Research and Strategy", description: "Decide what to rank for before writing a word", descriptionGradient: true, image: card("subtract-3.webp", 1260, 840), backIntro: "Decide what to rank for before writing a word. Our keyword services include:", backPoints: ["Keyword map: one target per page, no cannibalisation", "Search intent analysis", "Topic clusters and pillar planning", "Competitor gap analysis"], href: "/seo/keyword-research" },
        // TODO(image pass): subtract-8 is a crop of the keyword strategy statue until the AI search card art exists.
        { title: "AI Search Optimization (GEO & AEO)", description: "Get cited in AI Overviews, AI Mode, ChatGPT and Perplexity", descriptionGradient: true, image: card("subtract-8.jpg", 2560, 840), backIntro: "Get cited in AI Overviews, AI Mode, ChatGPT and Perplexity. Our AI search optimization services include:", backPoints: ["AI citation audit: where you appear and where competitors do", "Answer-first page structure and schema", "Brand mention building across the sources AI systems trust", "Monthly AI visibility tracking"], href: "/seo/ai-search" },
      ],
      banner: {
        heading: [tx("How our "), hl("SEO services"), tx(" work, from the first audit to "), hl("compounding growth")],
        steps: processSteps(
          [
            "Weeks 1 to 2. We crawl the site, read Search Console, map your keywords against competitors and find the gap between what you rank for and what your buyers search for. You get a written report whether or not you continue.",
            "Week 3. One document: the keyword map, the fixes in priority order, the content calendar, the link targets and the numbers we will report against.",
            "Monthly sprints. Technical fixes shipped with your developers or by ours, content published to the calendar, pages restructured for AI citation.",
            "Continuous. Links, digital PR and brand mentions, tracked for indexing and loss, so the authority you pay for stays on the site.",
            "Monthly, with a quarterly review. Traffic, rankings, AI citations, leads and revenue in one report, in plain language, with next month's priorities. Every deliverable lives in your client portal.",
          ],
          ["Audit and Opportunity Map", "Strategy and Roadmap", "Build", "Earn", "Report and Compound"],
        ),
        ctaLabel: "Grow Your SEO",
        ctaUrl: "/contact",
      },
    },
    whyChoose: {
      ...DEFAULT_WHY_CHOOSE,
      items: [
        why(0, "Revenue, Not Vanity Metrics", "Every report connects organic traffic to leads and revenue, and we stake our recommendations on those numbers."),
        why(1, "AI Search Built In", "Every programme includes GEO and AEO work. Clients like Cirrus Insight are cited in AI answers, not only ranked under them."),
        why(2, "Links That Stay Live", "In-house monitoring keeps link loss under 5% and gets 80% of new links indexed within a month."),
        why(3, "Transparent Reporting", "One monthly report, one client portal with every deliverable, every task and every link. Nothing hidden behind a dashboard you cannot read."),
        why(4, "30+ Languages", "International programmes run market by market, with native-language keyword research and local link building."),
      ],
      ctaTitle: "Find Out Where Your Biggest SEO Opportunities Sit",
      ctaLabel: "Get a Free SEO Audit",
      ctaUrl: "/contact",
    },
    faq: {
      items: [
        { question: "What do SEO services include?", answer: "A full programme covers four streams: technical SEO so pages get indexed, on-page and content work so pages match what people search for, link building so Google trusts the site, and reporting that ties it to revenue. In 2026 it also includes AI search optimization, so pages get cited in AI Overviews and chatbots." },
        { question: "How much do SEO services cost?", answer: "Most agencies charge a monthly retainer, and the price depends on scope: how many pages, how competitive the market, how much content and how many links a month. We scope every proposal to deliverables, so you can compare it line by line with any other quote." },
        { question: "How long does SEO take to show results?", answer: "Fixes to an established site can move rankings within weeks. A new site in a competitive market usually needs six to twelve months before organic traffic becomes meaningful. We report early signals, impressions, indexed pages and referring domains, from month one." },
        { question: "Is SEO still worth it now that Google shows AI Overviews?", answer: "Yes. AI Overviews and chatbots build their answers from pages Google already indexes and trusts, so the same work earns both the ranking and the citation. Some searches now end without a click, which is why we track AI citations alongside traffic." },
        { question: "What is the difference between SEO, GEO and AEO?", answer: "SEO earns rankings and clicks in search results. GEO (generative engine optimization) earns citations in AI-generated answers such as AI Overviews and ChatGPT. AEO (answer engine optimization) makes pages give direct answers that search features and assistants can use. The three share the same foundation, which is why we run them as one programme." },
        { question: "Do you guarantee rankings?", answer: "No, and no honest agency can, because nobody controls Google's results. We guarantee the work, the reporting and the transparency, and our case studies show what that work produces." },
        { question: "How do you report on SEO services?", answer: "A monthly report covers traffic, rankings, AI citations, links earned, leads and revenue, with what we did and what comes next. Every deliverable is visible in your client portal at any time." },
        { question: "Do you work with agencies?", answer: "Yes. Our white-label SEO partnership delivers the same programme under your brand, with reporting you can pass to your clients." },
      ],
    },
  },
};
