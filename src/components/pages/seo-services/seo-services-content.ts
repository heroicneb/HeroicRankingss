import { br, hl, img, tx } from "../shared/page-content.ts";
import { DEFAULT_WHY_CHOOSE, type SeoServicePageDefinition } from "../shared/seo-service-content.ts";

const card = (file: string, w: number, h: number) => img(`/seo-services/${file}`, w, h);

export const SEO_SERVICES_PAGE: SeoServicePageDefinition = {
  key: "seo-services",
  title: "SEO Services (hub)",
  path: "/seo",
  faqService: "seo-services",
  seo: {
    title: "SEO Services",
    description: "Boost visibility, drive engagement, and grow revenue with Heroic Rankings AEO and SEO services.",
  },
  content: {
    hero: {
      title: [hl("AEO & SEO"), tx(" Services")],
      tagline: [tx("Boost Your Visibility. Drive Engagement."), br, tx("Achieve Conversions. "), hl("Generate Revenue"), tx(".")],
      label: "/ Growth Engine /",
      heading: [tx("SEO that works while you sleep")],
      paragraphs: [
        "SEO is a long-term growth engine and we build it with precision, visibility across searches not just rankings.",
        "At Heroic Rankings, we combine data, strategy, and execution to drive measurable rankings, traffic, and revenue. Our systems are designed to scale, deliver consistent growth, and keep your brand visible 24/7.",
        "Our methods ensure brands aren't just ranking, they're being referenced, cited, and surfaced across LLM-driven results.",
      ],
      ctaLabel: "Get Your SEO Audit Now!",
      ctaUrl: "/contact",
      image: img("/seo-services/hero-statue.webp", 3072, 4096, "Classical statue holding a sword"),
    },
    solutions: {
      label: "/ Growth Engine Parts /",
      heading: [tx("All-Inclusive "), hl("SEO Solutions")],
      cards: [],
      hubCards: [
        { title: "On-Page SEO Services", description: "Show up across searches not just rankings", descriptionGradient: true, image: card("subtract-6.webp", 1260, 840), backIntro: "Make your website more visible in search engines and LLMs with our on-page optimization services, designed to boost your rankings, enhance user experience, and drive conversions. We focus on:", backPoints: ["Content Optimization", "Meta Tags Optimization", "URL Structure", "Header Tag Optimization", "Internal Linking Optimization"], href: "/seo/on-page" },
        { title: "Local SEO Services", description: "Connect Locally", descriptionGradient: false, image: card("subtract-7.png", 610, 840), backIntro: "Increase visibility in local searches and maps with targeted strategies. Our local SEO services include:", backPoints: ["Google My Business", "Local Listings Management", "Local Content Creation"], href: "/seo/local" },
        { title: "Technical SEO Services", description: "Optimize Your Website’s Foundation", descriptionGradient: false, image: card("subtract-5.png", 610, 840), backIntro: "Ensure peak performance, mobile-friendliness, and superior speed. Our technical SEO services cover:", backPoints: ["Site Audits", "Mobile Optimization", "Speed Optimization", "Structured Data Markup"], href: "/seo/technical" },
        { title: "Link Building Services", description: "Expand your reach in both SERP and AI results", descriptionGradient: true, image: card("subtract-4.webp", 2560, 840), backIntro: "Leverage quality backlinks and build online authority to improve visibility and trustworthiness. Our off-page strategies include:", backPoints: ["White Hat Link Building", "Niche edits", "Guest posting", "Listicle posting (boosts LLM performance)"], href: "/seo/linkbuilding" },
        { title: "E-Commerce SEO Services", description: "Increase Organic Revenue", descriptionGradient: false, image: card("subtract-1.png", 610, 840), backIntro: "Optimize product listings and site structure to maximize visibility and conversions. Our e-commerce SEO services include:", backPoints: ["Product Page Optimization", "Category Optimization", "Technical SEO for E-Commerce", "Revenue forecasting"], href: "/seo/e-commerce" },
        { title: "Content Services", description: "Craft Compelling Narratives", descriptionGradient: false, image: card("subtract-2.png", 610, 840), backIntro: "Align your brand's voice with audience needs for organic growth. Our content services include:", backPoints: ["Content Strategy", "Content Creation", "Content Optimization", "Content calendar"], href: "/seo/content-creation" },
        { title: "Keyword Research and Strategy", description: "Discover Your Potential", descriptionGradient: true, image: card("subtract-3.webp", 1260, 840), backIntro: "Identify and target the keywords that matter to your audience. Our keyword services include:", backPoints: ["Comprehensive Keyword Research", "Competitive Analysis", "Keyword Mapping", "Keyword Clustering"], href: "/seo/keyword-research" },
      ],
      banner: null,
    },
    whyChoose: DEFAULT_WHY_CHOOSE,
    faq: {
      items: [
        { question: "What are SEO services and why do I need them?", answer: "SEO services enhance your website's visibility in search results, driving organic traffic and business growth. They include a variety of techniques and strategies aimed at improving your site's performance and user experience." },
        { question: "How do I know which SEO services are right for my business?", answer: "The best SEO services depend on your specific goals, industry, and current online presence. We start with a comprehensive audit to identify areas for improvement, then recommend a tailored strategy that aligns with your budget and objectives." },
        { question: "What are the benefits of On-Page Optimization services?", answer: "On-page optimization improves your website's content, structure, and HTML elements to make it more relevant and accessible to search engines. Benefits include higher rankings, better user experience, increased click-through rates, and more qualified organic traffic." },
      ],
    },
  },
};
