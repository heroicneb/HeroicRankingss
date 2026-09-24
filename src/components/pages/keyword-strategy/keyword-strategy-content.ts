import { hl, img, tx } from "../shared/page-content.ts";
import { DEFAULT_WHY_CHOOSE, processSteps, type SeoServicePageDefinition } from "../shared/seo-service-content.ts";

const icon = (file: string, w: number, h: number) => img(`/keyword-strategy/${file}`, w, h);

export const KEYWORD_STRATEGY_PAGE: SeoServicePageDefinition = {
  key: "keyword-strategy",
  title: "Keyword Strategy",
  path: "/seo/keyword-research",
  faqService: "keyword-strategy",
  seo: {
    title: "Keyword Strategy Services",
    description: "Reveal keyword opportunities you are missing and turn search demand into qualified traffic and revenue.",
  },
  content: {
    hero: {
      title: [tx("Keyword Strategy Services")],
      tagline: [tx("Get the most out of your content. "), hl("Target the Right Search."), tx(" Find the Words That Bring Customers to You Across Search and AI Driven Discovery.")],
      label: "/ Blueprint /",
      heading: [tx("Reveal the Search Opportunities You've Been Missing")],
      paragraphs: [
        "Your business deserves to be found by the right audience — every time. We map the exact terms your ideal customers use: positioning your brand where real buying decisions begin.",
      ],
      ctaLabel: "Book a Keyword Strategy Consultation",
      ctaUrl: "/contact",
      image: img("/keyword-strategy/012b3586db53585c2f2ea20a4f280ca6c2da8e1c.webp", 4096, 2866, "Classical statue holding a magnifying glass"),
    },
    solutions: {
      label: "/ Solutions /",
      heading: [tx("Keyword "), hl("Research"), tx(" Services")],
      cards: [
        { title: "Understand What Your Audience Is Searching For", subtitle: "Uncovering Real Search Behaviour", body: "We start by mapping exactly what your target audience types into Google — the words, phrases, and questions they use at every stage of their journey. This gives you a clear picture of demand before a single page is written or optimised.", ctaLabel: "Explore Search Behaviour", ctaUrl: "/contact", icon: icon("e04b1944e94a99ed95972b85d3c5af5275015368.svg", 26, 28) },
        { title: "Identify the Market Opportunity", subtitle: "Finding the Gaps Your Competitors Miss", body: "We analyse the competitive landscape to surface untapped opportunities — keywords your competitors rank for, angles they’re missing, and gaps your content can move into. This is where strategy begins to take shape.", ctaLabel: "Analyse Your Market", ctaUrl: "/contact", icon: icon("1afabcf51a9c3c51eedaf504043a1210988afe69.svg", 31, 28) },
        { title: "Measure Demand Across Every Search Intent", subtitle: "Outperforming Your Competitors", body: "Not all searches are equal. We break down keyword demand by intent so you understand exactly where your audience is in the buying journey and how large each segment of the market really is.", ctaLabel: "Map Search Intent", ctaUrl: "/contact", icon: icon("00b6125bd084bca4a5c73f420b68127d8d429540.svg", 34, 34) },
        { title: "Build the Right Keyword Mix", subtitle: "Balancing Short-Term Wins With Long-Term Growth", body: "We identify the full spectrum of keyword types — head terms, long-tail, branded, and question-based — and structure a mix that balances quick ranking opportunities with sustainable authority-building over time.", ctaLabel: "Build Your Keyword Strategy", ctaUrl: "/contact", icon: icon("a5e352855597b793da42fff51d66f8bb9f23c336.svg", 30, 31) },
        { title: "Project Your Organic Traffic", subtitle: "Knowing What Top Rankings Are Actually Worth Before", body: "Before you invest in content or optimisation, you should know what the return looks like. We model realistic traffic projections for top-ranking positions across your target keywords — so you go in with clear expectations and a strategy built around actual business impact.", ctaLabel: "See Your Traffic Potential", ctaUrl: "/contact", icon: icon("a281b8a790541e5f6c01e72b8894ea4860b0027f.svg", 33, 30) },
      ],
      hubCards: [],
      banner: {
        heading: [tx("Curious about what "), hl("keywords"), tx(" could unlock "), hl("more revenue"), tx(" for your business? The Fastest and "), hl("Most Effective to Get Started!")],
        steps: processSteps([
          "Contact us to schedule a consultation and learn how our keyword strategy services can transform your online presence.",
          "The first call helps us understand your current rankings, conversion goals, and the keyword gaps blocking qualified traffic.",
          "We collect site structure, current content, competitor landscape, and search demand signals to map high-impact opportunities.",
          "We align the keyword roadmap with your budget and prioritize quick-win clusters alongside long-term growth opportunities.",
          "You get a clear action plan for keyword targeting, page mapping, and execution order so your team can scale predictable SEO growth.",
        ]),
        ctaLabel: "Book a Discovery Call",
        ctaUrl: "/contact",
      },
    },
    whyChoose: DEFAULT_WHY_CHOOSE,
    faq: {
      items: [
        { question: "What is the role of keyword strategy in SEO?", answer: "Keyword strategy is the foundation of SEO. It involves selecting and optimizing specific search terms to improve your website’s visibility in search engine results." },
        { question: "How do you choose the right keywords for my business?", answer: "We analyze search volume, competition difficulty, commercial intent, and relevance to your products or services. By combining industry research with competitor gap analysis and audience behavior data, we identify keywords that balance traffic potential with realistic ranking opportunity to maximize your ROI." },
        { question: "Why is long-tail keyword targeting important?", answer: "Long-tail keywords are highly specific phrases with lower competition and stronger buyer intent. Users searching these terms are typically closer to making a decision, which means they convert at significantly higher rates. Targeting long-tail keywords allows you to capture qualified traffic that broader terms often miss." },
        { question: "What is competitive keyword analysis, and why is it essential?", answer: "Competitive keyword analysis examines which keywords your competitors rank for, where they get their traffic, and where gaps exist in their strategy. This insight reveals untapped opportunities you can capitalize on and helps you prioritize keywords where you can realistically outperform the competition." },
        { question: "How does keyword mapping benefit my website's content and pages?", answer: "Keyword mapping assigns specific target keywords to individual pages on your website, preventing keyword cannibalization and ensuring every page has a clear ranking purpose. This structured approach improves site architecture, guides content creation, and helps search engines understand which page to rank for each query." },
        { question: "Do you optimize for seasonal and trending keywords?", answer: "Yes, we incorporate seasonal trends and emerging search patterns into your keyword strategy. By identifying peak search periods for your industry and monitoring trending topics, we ensure your content captures surges in demand when they happen, keeping your traffic and revenue consistent throughout the year." },
      ],
    },
  },
};
