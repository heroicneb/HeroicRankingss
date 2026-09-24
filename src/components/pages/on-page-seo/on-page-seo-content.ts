import { hl, img, tx } from "../shared/page-content.ts";
import { DEFAULT_WHY_CHOOSE, processSteps, type SeoServicePageDefinition } from "../shared/seo-service-content.ts";

const icon = (file: string, w: number, h: number) => img(`/on-page-seo/${file}`, w, h);

export const ON_PAGE_SEO_PAGE: SeoServicePageDefinition = {
  key: "on-page-seo",
  title: "On-Page SEO",
  path: "/seo/on-page",
  faqService: "on-page-seo",
  seo: {
    title: "On-Page SEO Services",
    description: "Create a solid on-site SEO structure and start driving traffic with Heroic Rankings on-page SEO services.",
  },
  content: {
    hero: {
      title: [tx("On-Page SEO Services")],
      tagline: [tx("The Details Search Engines Rewards. The Results "), hl("You Keep"), tx(".")],
      label: "/ Structure /",
      heading: [tx("On-Page SEO That Works the Way Google Actually Evaluates Pages")],
      paragraphs: [
        "The result is organic traffic that brings in real leads and revenue, consistently. That's what we optimize for — and it's the standard we hold every engagement to.",
      ],
      ctaLabel: "Free On-Page SEO Audit",
      ctaUrl: "/contact",
      image: img("/on-page-seo/488700afdba6954368280173b13ac2c7d8324b06.webp", 2048, 1168, "Warrior statue"),
    },
    solutions: {
      label: "/ Solutions /",
      heading: [hl("White Hat"), tx(" On-Page SEO Services")],
      cards: [
        { title: "Keyword Research & Analysis", subtitle: "Unearthing the Gems of Relevance", body: "On-page optimization ensures that your web pages are relevant to specific keywords and phrases that users are searching for. This alignment enhances your website's chances of appearing prominently in search results, leading to increased organic traffic.", ctaLabel: "Research Keywords", ctaUrl: "/contact", icon: icon("936a6012b2c4d3fe21561675113b56450c6910dd.svg", 31, 32) },
        { title: "Meta Optimization", subtitle: "Crafting First Impressions that Matter", body: "Meta tags are the first glimpse users and search engines have of your content. We craft compelling meta titles and descriptions that entice and encapsulate the essence of your content. This leads to improved click-through rates and a better understanding of your content's context.", ctaLabel: "Optimize Meta Tags", ctaUrl: "/contact", icon: icon("130460852d3cf88e59b77497d8a49b9edd4e1f4b.svg", 34, 31) },
        { title: "Content Linking", subtitle: "Turning Content into a Powerhouse", body: "Content is king, and optimizing it is paramount. Our content optimization services involve refining your existing content and creating new content that's informative, engaging, and aligned with your target keywords. We strike the perfect balance between SEO-friendly content and value-driven information that resonates with your audience.", ctaLabel: "Boost Content", ctaUrl: "/contact", icon: icon("0ce2daad7f53b85d350b78bc0c0c211e025a3dfe.svg", 31, 31) },
        { title: "URL Structure Optimization", subtitle: "Building the Pathway to Visibility", body: "A well-structured URL is more than just a web address; it's a navigational guide for users and search engines. Our experts optimize your URL structure to enhance readability and relevance, ensuring that search engines can easily decipher the hierarchy of your content and users can navigate intuitively.", ctaLabel: "Refine URLs", ctaUrl: "/contact", icon: icon("c4a5ae60af291e1f21fa0b6ab0cd195a70b6c0bd.svg", 31, 31) },
        { title: "Header Tag Optimization", subtitle: "Guiding the Reader's Journey", body: "Header tags (H1, H2, H3, etc.) provide a visual hierarchy that guides readers through your content. We optimize header tags to highlight the most critical points, making your content more scannable and user-friendly. This optimization enhances the user experience and helps search engines understand the structure of your content.", ctaLabel: "Structure Headers", ctaUrl: "/contact", icon: icon("dc2bdaf84977ecc9348ba43211ddf3916dd9c947.svg", 27, 25) },
        { title: "Internal Linking Optimization", subtitle: "Connecting the Dots for Enhanced Visibility", body: "Internal linking is the secret sauce to keep users engaged and search engines crawling. We strategically optimize internal links to guide users seamlessly between relevant pages on your website. This enhances user experience, encourages exploration, and distributes the SEO value across your site.", ctaLabel: "Map Internal Links", ctaUrl: "/contact", icon: icon("3556d976fa9cb93c2863cfff8dda160f3048d2a9.svg", 31, 31) },
      ],
      hubCards: [],
      banner: {
        heading: [tx("Ready to start "), hl("optimizing your website"), tx(" for better search engine rankings and "), hl("user engagement"), tx("? The Fastest and "), hl("Most Effective to Get Started!")],
        steps: processSteps([
          "Contact us to schedule a consultation and learn how our on-page SEO services can transform your online presence.",
          "We start with a focused interview to understand your current rankings, conversion goals, and the blockers impacting on-page performance.",
          "Our team collects and reviews all critical page-level inputs including URLs, templates, keyword clusters, and current metadata signals.",
          "We define scope and budget based on implementation depth, website size, and priority pages to ensure maximum impact from day one.",
          "You receive a practical on-page action roadmap with clear priorities, expected outcomes, and next-step recommendations.",
        ]),
        ctaLabel: "Book a Discovery Call",
        ctaUrl: "/contact",
      },
    },
    whyChoose: DEFAULT_WHY_CHOOSE,
    faq: {
      items: [
        { question: "What is on-page SEO?", answer: "On-page SEO involves refining various elements within your website to improve its visibility and ranking on search engine results pages (SERPs)." },
        { question: "Why is on-page optimization important for SEO?", answer: "On-page optimization is critical because it directly signals to search engines what your pages are about and how relevant they are to specific queries. Without proper on-page SEO, even high-authority websites struggle to rank for target keywords, resulting in lost organic traffic and missed revenue opportunities." },
        { question: "How does keyword research play a role in on-page optimization?", answer: "Keyword research identifies the exact terms and phrases your target audience uses when searching for products or services like yours. By mapping these keywords to specific pages and incorporating them into titles, headings, and body content, you ensure each page is aligned with real search demand and has the best chance of ranking." },
        { question: "What benefits can I expect from meta tags optimization?", answer: "Optimized meta titles and descriptions improve your click-through rates from search results by making your listings more compelling and relevant. Well-crafted meta tags also help search engines understand page context, which contributes to higher rankings and more qualified organic traffic." },
        { question: "How does content optimization enhance my website?", answer: "Content optimization improves your website by ensuring every page delivers value to both users and search engines. This includes refining readability, incorporating target keywords naturally, and structuring content with clear headings and internal links, all of which lead to longer time on page, lower bounce rates, and stronger rankings." },
        { question: "What role does internal linking play in on-page optimization?", answer: "Internal linking distributes authority across your website, helps search engines discover and prioritize key pages, and guides users to related content that supports their intent. A strong internal linking structure improves crawlability, boosts rankings for target pages, and increases engagement by keeping visitors on your site longer." },
      ],
    },
  },
};
