import { hl, img, tx } from "../shared/page-content.ts";
import { DEFAULT_WHY_CHOOSE, processSteps, type SeoServicePageDefinition } from "../shared/seo-service-content.ts";

const icon = (file: string, w: number, h: number) => img(`/technical-seo/${file}`, w, h);

export const TECHNICAL_SEO_PAGE: SeoServicePageDefinition = {
  key: "technical-seo",
  title: "Technical SEO",
  path: "/seo/technical",
  faqService: "technical-seo",
  seo: {
    title: "Technical SEO Services",
    description: "Strengthen your site infrastructure, improve crawlability, and boost rankings with Heroic Rankings technical SEO services.",
  },
  content: {
    hero: {
      title: [tx("Technical SEO Services")],
      tagline: [tx("Rankings Start Where Most Agencies "), hl("Stop Looking"), tx(".")],
      label: "/ Foundation /",
      heading: [tx("Good Content Won't Rank on a Broken Site")],
      paragraphs: [
        "If Google can't crawl it, index it, or load it fast enough, it doesn't exist. Most sites don't have a content problem — they have a technical one. We audit, diagnose, and systematically resolve the crawlability, speed, and structural issues that prevent Google from ranking your pages.",
      ],
      ctaLabel: "Get a Technical SEO Audit",
      ctaUrl: "/contact",
      image: img("/technical-seo/055420a1-fe99-46f5-9e5b-bbce63f8a07e.webp", 2924, 1258, "Classical building with columns"),
    },
    solutions: {
      label: "/ Solutions /",
      heading: [tx("Comprehensive "), hl("Technical SEO Services")],
      cards: [
        { title: "Website Audit and Analysis", subtitle: "Revitalizing Your Digital Foundation", body: "Our comprehensive website audit delves into every corner of your site’s technical infrastructure. We identify issues like broken links, duplicate content, and crawl errors, paving the way for search engine crawlers and enhancing user experience.", ctaLabel: "Get Your Audit", ctaUrl: "/contact", icon: icon("5b81d169-a376-4fd5-9cae-538bf927a6bf.svg", 33, 30) },
        { title: "XML Sitemap Optimization", subtitle: "Guiding Search Engines through Your Content", body: "XML sitemaps serve as blueprints for search engines. We optimize your sitemaps to ensure efficient content discovery and indexing, enhancing your website’s visibility in search results.", ctaLabel: "Optimize Your Sitemaps", ctaUrl: "/contact", icon: icon("cf22fade-931b-468d-b5b8-d0395c476e56.svg", 32, 32) },
        { title: "Robots.txt Optimization", subtitle: "Navigating the Digital Landscape", body: "Robots.txt files instruct search engine bots on which pages to crawl. Our optimization ensures important pages are accessible while sensitive content is hidden, enhancing your overall SEO strategy.", ctaLabel: "Optimize Robots.txt", ctaUrl: "/contact", icon: icon("2fa5e242-fddd-4d0b-9691-af0dbf26d757.svg", 34, 34) },
        { title: "Website Speed Optimization", subtitle: "Accelerating Your Digital Journey", body: "Website speed impacts user experience and search rankings. Our speed optimization techniques include compressing images, minimizing code, and optimizing server configurations to ensure a fast-loading site.", ctaLabel: "Improve Your Speed", ctaUrl: "/contact", icon: icon("0d391828-3204-4d72-969d-1b9f5fda5081.svg", 31, 24) },
        { title: "Mobile-Friendly Optimization", subtitle: "Seamless Experiences on All Devices", body: "Ensuring a responsive, user-friendly mobile experience is crucial. Our strategies adapt your website to various screen sizes and devices, improving mobile search rankings and user engagement.", ctaLabel: "Optimize for Mobile", ctaUrl: "/contact", icon: icon("854cbd92-5c37-4cc0-b15e-e80360bddc00.svg", 18, 32) },
        { title: "Schema Markup Implementation", subtitle: "Adding Depth to Your Content", body: "Schema markup provides additional context to search engines, enhancing your chances of appearing in rich snippets and answer boxes in search results, boosting your visibility and click-through rates.", ctaLabel: "Implement Schema Markup", ctaUrl: "/contact", icon: icon("icon-schema-markup-composite.svg", 36, 36) },
      ],
      hubCards: [],
      banner: {
        heading: [tx("Ready to start optimizing your "), hl("website's technical performance"), tx(" and "), hl("search engine rankings"), tx("? The Fastest and "), hl("Most Effective to Get Started!")],
        steps: processSteps([
          "Contact us to schedule a consultation and learn how our technical SEO services can transform your online presence.",
          "The first call helps us understand your site's current technical health, business goals, and the infrastructure issues blocking growth.",
          "We collect crawl data, indexation signals, page templates, and platform details so every technical recommendation is scoped accurately.",
          "We align effort and budget with your highest-impact technical priorities to deliver measurable wins as quickly as possible.",
          "You receive a clear technical SEO roadmap with actionable fixes, implementation order, and expected ranking and performance outcomes.",
        ]),
        ctaLabel: "Book a Discovery Call",
        ctaUrl: "/contact",
      },
    },
    whyChoose: DEFAULT_WHY_CHOOSE,
    faq: {
      items: [
        { question: "What is technical SEO?", answer: "Technical SEO focuses on optimizing your website's infrastructure to help search engines crawl, index, and render your site more effectively. This includes improving site speed, mobile responsiveness, URL structure, XML sitemaps, robots.txt configuration, and fixing crawl errors to build a strong technical foundation for higher rankings." },
        { question: "How does a website audit contribute to technical SEO?", answer: "A website audit identifies technical issues like broken links, crawl errors, duplicate content, and slow page speeds that can hurt your rankings. By addressing these issues systematically, we improve your site's crawlability and indexation." },
        { question: "What is the purpose of XML sitemaps in technical SEO?", answer: "XML sitemaps help search engines discover and understand the structure of your website. They list all important pages, their update frequency, and priority, ensuring that search engine crawlers can efficiently index your content." },
        { question: "Why is robots.txt optimization important?", answer: "A properly configured robots.txt file guides search engine crawlers on which pages to index and which to skip. This prevents wasting your crawl budget on low-value pages and ensures your most important content gets indexed first." },
        { question: "How does website speed optimization impact SEO?", answer: "Page speed is a confirmed ranking factor for both desktop and mobile search. Faster sites provide better user experiences, leading to lower bounce rates, longer session durations, and higher conversion rates." },
      ],
    },
  },
};
