import { hl, img, tx } from "../shared/page-content.ts";
import { DEFAULT_WHY_CHOOSE, PROCESS_LABELS, processSteps, type SeoServicePageDefinition } from "../shared/seo-service-content.ts";

const icon = (file: string, w: number, h: number) => img(`/ecommerce-seo/${file}`, w, h);

export const ECOMMERCE_SEO_PAGE: SeoServicePageDefinition = {
  key: "ecommerce-seo",
  title: "E-commerce SEO",
  path: "/seo/e-commerce",
  faqService: "ecommerce-seo",
  seo: {
    title: "E-commerce SEO Services",
    description: "Grow sales, not just traffic, with e-commerce SEO services built to turn search visibility into sustainable revenue.",
  },
  content: {
    hero: {
      title: [tx("E-commerce SEO Services")],
      tagline: [tx("Using In-House Reporting & Forecasting, our Strategies Deliver Results That "), hl("Turn Search Traffic Into Revenue.")],
      label: "/ Grow Organically /",
      heading: [tx("Grow Sales, Not Just Traffic with eComm SEO")],
      paragraphs: [
        "Our ecommerce SEO services aren't just about rankings — they're about revenue at scale. As a dedicated ecommerce SEO agency, we deploy data-driven strategies and AI-powered insights to help Shopify, WooCommerce, and Magento stores convert search visibility into measurable organic sales growth. By leveraging data-driven strategies and AI insights, we help stores turn search visibility into millions in organic sales.",
      ],
      ctaLabel: "Get your E-commerce SEO Audit",
      ctaUrl: "/contact",
      image: img("/ecommerce-seo/c5e64417-ac91-46b2-b7b8-cfe282821cbf.webp", 3072, 4096, "Basket with apples"),
    },
    solutions: {
      label: "/ Solutions /",
      heading: [hl("E-commerce "), tx("SEO Services")],
      cards: [
        { title: "Product & Category Page Optimization", subtitle: "Turning Browsers into Buyers", body: "We optimize product descriptions, meta tags, images, and structured content to ensure every listing ranks and converts. Category pages get a full treatment too — streamlined navigation, keyword-aligned headings, and filtering logic that helps both search engines and shoppers discover your full catalog faster.", ctaLabel: "Optimize Your Pages", ctaUrl: "/contact", icon: icon("509b7335-0c6c-4424-801d-39aac76eddf1.svg", 29, 31) },
        { title: "Google Merchant Center Optimization", subtitle: "Maximizing Your Shopping Feed Reach", body: "We audit and optimize your Google Merchant Center feed — fixing disapprovals, enriching product attributes, and aligning titles and descriptions with high-intent ecommerce search queries. The result: more products eligible for Shopping ads and free listings, at a lower cost per click.", ctaLabel: "Optimize Your Feed", ctaUrl: "/contact", icon: icon("afafac96-ae0c-4a06-ba17-5ab923fd9d57.svg", 34, 27) },
        { title: "Structured Data for Products", subtitle: "Enhancing Search Results Visibility", body: "We implement schema markup that puts your pricing, availability, ratings, and reviews directly into Google’s rich snippets — giving your products more real estate in search results and a measurable edge over competitors who rely on plain blue links.", ctaLabel: "Implement Structured Data", ctaUrl: "/contact", icon: icon("8a93e259-bbe3-4498-a510-9af44505dfb8.svg", 31, 31) },
        { title: "E-commerce Platform SEO", subtitle: "Navigating the Platform Landscape", body: "Whether you’re on Shopify, WooCommerce, Magento, or a custom stack, we optimize your platform’s architecture — URL structure, crawlability, site speed, and navigation — so technical limitations never cap your organic growth potential.", ctaLabel: "Optimize Your Platform", ctaUrl: "/contact", icon: icon("a5be1733-0bb9-4517-8cb6-fce31596ad24.svg", 32, 32) },
        { title: "Reddit Marketing", subtitle: "Improve AI Signals & LLM Citations", body: "Reddit threads consistently rank in Google and get cited by AI tools like ChatGPT and Gemini. We build authentic presence in niche subreddits relevant to your products — driving direct referral traffic, strengthening brand signals, and making your store the answer when AI assistants recommend where to buy.", ctaLabel: "Start Reddit Marketing", ctaUrl: "/seo/reddit-marketing", icon: icon("a5be1733-0bb9-4517-8cb6-fce31596ad24.svg", 32, 32) },
        { title: "Ecommerce Link Building", subtitle: "Growing keyword positions and AI visibility", body: "We build high-quality backlinks from relevant industry publications, review sites, and niche blogs through digital PR, listicle articles campaigns, and editorial outreach. Every link strengthens your domain authority and protects your rankings for the long term.", ctaLabel: "Order Your Backlinks", ctaUrl: "/contact", icon: icon("509b7335-0c6c-4424-801d-39aac76eddf1.svg", 29, 31) },
      ],
      hubCards: [],
      banner: {
        heading: [tx("Is your "), hl("e-commerce store"), tx(" maximizing its organic growth potential? The Fastest and "), hl("Most Effective Way to Get Started!")],
        steps: processSteps(
          [
            "Connect with our team to discuss your store goals and see how ecommerce SEO can drive qualified organic sales.",
            "We review your current category structure, product pages, and conversion priorities to align SEO with revenue targets.",
            "Our team collects platform details, product feed data, technical constraints, and search demand signals to scope strategy precisely.",
            "We define investment and implementation scope based on catalog size, priority categories, and expected impact timelines.",
            "You receive a practical ecommerce SEO roadmap covering product pages, category pages, structured data, and growth milestones.",
          ],
          [PROCESS_LABELS[0]!, "Discovery Call", PROCESS_LABELS[2]!, PROCESS_LABELS[3]!, PROCESS_LABELS[4]!],
        ),
        ctaLabel: "Book a Discovery Call",
        ctaUrl: "/contact",
      },
    },
    whyChoose: DEFAULT_WHY_CHOOSE,
    faq: {
      items: [
        { question: "What is e-commerce SEO?", answer: "E-commerce SEO refers to specialized strategies aimed at improving the visibility and search engine performance of online stores. It involves techniques to enhance product page rankings, increase organic traffic, and boost sales." },
        { question: "How is e-commerce SEO different from traditional SEO?", answer: "E-commerce SEO focuses on optimizing product and category pages at scale, implementing structured data for rich snippets, and addressing platform-specific technical challenges like faceted navigation and duplicate content. Unlike traditional SEO, the primary goal is driving purchases rather than just traffic, requiring strategies tailored to buyer intent and conversion optimization." },
        { question: "How does product page optimization impact e-commerce SEO?", answer: "Optimized product pages rank higher for specific product searches and convert more visitors into buyers. This includes writing unique product descriptions, optimizing images with alt text, implementing schema markup for prices and availability, and crafting compelling meta tags that increase click-through rates from search results." },
        { question: "What is category page optimization and its significance?", answer: "Category page optimization ensures your main product groupings rank for high-volume commercial keywords. By improving navigation, adding keyword-rich descriptions, and streamlining filtering options, category pages become powerful landing pages that guide shoppers through your catalog and significantly increase organic revenue." },
        { question: "Can e-commerce SEO work with specific platforms like Shopify or WooCommerce?", answer: "Absolutely. Our e-commerce SEO strategies are platform-agnostic and work with Shopify, WooCommerce, Magento, BigCommerce, and other major platforms. We optimize within each platform's technical framework, addressing platform-specific URL structures, site speed, and indexation challenges to maximize your store's search performance." },
      ],
    },
  },
};
