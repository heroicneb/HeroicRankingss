import { br, hl, img, tx } from "../shared/page-content.ts";
import { DEFAULT_WHY_CHOOSE, processSteps, type SeoServicePageDefinition } from "../shared/seo-service-content.ts";

const icon = (file: string, w: number, h: number) => img(`/local-seo/${file}`, w, h);

export const LOCAL_SEO_PAGE: SeoServicePageDefinition = {
  key: "local-seo",
  title: "Local SEO",
  path: "/seo/local",
  faqService: "local-seo",
  seo: {
    title: "Local SEO Services",
    description: "Dominate your local market, connect with nearby customers, and increase foot traffic with Heroic Rankings local SEO services.",
  },
  content: {
    hero: {
      title: [tx("Local SEO Services")],
      tagline: [tx("Dominate Your "), hl("Local Market."), br, tx("Connect with Nearby Customers. "), hl("Increase Foot Traffic.")],
      label: "/ Connection /",
      heading: [tx("Connecting Your Business to Local Customers")],
      paragraphs: [
        "Increase your business's online visibility by focusing on target locations with tailored local SEO strategies, driving traffic and attracting customers in the areas that matter most to your growth.",
      ],
      ctaLabel: "Get your Local SEO Audit",
      ctaUrl: "/contact",
      image: img("/local-seo/444c439c82562b3e638551ad9bbf9a63668dc05c.webp", 4096, 2340, "Classical statue holding a megaphone"),
    },
    solutions: {
      label: "/ Solutions /",
      heading: [tx("Heroic "), hl("Local SEO"), tx(" Services")],
      cards: [
        { title: "GBP Setup and Optimization", subtitle: "An Interactive Gateway to Local Audiences", body: "Optimizing your Google Business Profile is fundamental to local SEO success. Our specialists set up and optimize your GBP with accurate business information, high-quality images, and engaging descriptions. This not only enhances your online visibility but also ensures you appear in the coveted local 3-pack, where potential customers can access essential details.", ctaLabel: "Enhance Your GBP", ctaUrl: "/contact", icon: icon("63bf4e83c7644358b0713483beb011b03557c293.svg", 26, 33) },
        { title: "Local Citation Building", subtitle: "Weaving a Web of Local Recognition", body: "Citations are online references to your business's name, address, and phone number (NAP). We create consistent and accurate citations across reputable online directories, enhancing your business's local authority and visibility. Our approach involves manual submissions and careful verification, ensuring that your business information is accurate and up-to-date.", ctaLabel: "Build Local Citations", ctaUrl: "/contact", icon: icon("9b4c2813561b11a37af0ab074c2048d74d8df24a.svg", 30, 30) },
        { title: "Location-Specific Targeting", subtitle: "Reaching the Right Audience at the Right Time", body: "We optimize your content with location-specific keywords that help your business appear in local search results. This targeted approach increases the chances of your business being visible when people search for services in your area.", ctaLabel: "Target Local Keywords", ctaUrl: "/contact", icon: icon("8520459909172d416cf9fd403d2a8a815ccacb43.svg", 33, 33) },
        { title: "Online Reputation Management", subtitle: "Cultivating Trust and Credibility", body: "Online reviews significantly influence local consumer decisions. Our reputation management services involve encouraging satisfied customers to leave positive reviews while addressing negative feedback constructively. By fostering a positive online reputation, you enhance customer trust.", ctaLabel: "Manage Your Online Reputation", ctaUrl: "/contact", icon: icon("c2da8b6b30b6bf2d6e138d764a86c6b8c216bf7e.svg", 33, 33) },
        { title: "NAP Consistency", subtitle: "Building the Pillars of Trust", body: "Name, Address, and Phone Number (NAP) consistency across online platforms is critical for local SEO. We ensure that your NAP information is consistent across your website, Google My Business, citations, and other online profiles. This consistency builds trust with search engines and customers, positively impacting your local rankings.", ctaLabel: "Ensure NAP Consistency", ctaUrl: "/contact", icon: icon("2797e41a72e2fdb5e63d95aad041869ec8d51af4.svg", 30, 30) },
        { title: "Mobile Traffic and Footfall", subtitle: "Driving Mobile Users to Your Business", body: "Many local searches are performed on mobile devices by individuals on the move. Local SEO ensures your business is visible when potential customers are searching for nearby solutions, driving foot traffic and local sales.", ctaLabel: "Increase Mobile Visibility", ctaUrl: "/contact", icon: icon("6b5aa41683abb71c497c888cbc9a20034bd072e9.svg", 33, 32) },
      ],
      hubCards: [],
      banner: {
        heading: [tx("Ready to start optimizing your "), hl("local presence"), tx(" and driving "), hl("more foot traffic"), tx("? The Fastest and "), hl("Most Effective to Get Started!")],
        steps: processSteps([
          "Contact us to schedule a consultation and learn how our local SEO services can make your business dominate the local market.",
          "Our first call uncovers your current local visibility, service areas, and competitive gaps so we can target the right opportunities from day one.",
          "We collect your GBP data, citation footprint, review profile, and location pages to build a complete local SEO roadmap tailored to your market.",
          "We align budget with the highest-impact local priorities, from citations and optimization work to review growth and location-specific content updates.",
          "You get a clear action plan with timelines, ownership, and measurable local SEO milestones designed to increase qualified traffic and footfall.",
        ]),
        ctaLabel: "Book a Discovery Call",
        ctaUrl: "/contact",
      },
    },
    whyChoose: DEFAULT_WHY_CHOOSE,
    faq: {
      items: [
        { question: "What is local SEO?", answer: "Local SEO is a strategy focused on optimizing your online presence to attract customers in a specific geographic area. It involves techniques that target local search engine results and enhance your visibility to nearby potential customers." },
        { question: "How does local SEO differ from traditional SEO?", answer: "While traditional SEO focuses on improving visibility on a national or global scale, local SEO targets customers in a specific geographic area. Local SEO emphasizes Google Business Profile optimization, local citations, map pack rankings, and location-specific keywords to drive foot traffic and calls from nearby searchers." },
        { question: "Why are local citations important?", answer: "Local citations, which are mentions of your business name, address, and phone number across online directories, help search engines verify your business's legitimacy and location. Consistent, accurate citations across reputable platforms strengthen your local authority and improve your chances of appearing in the local 3-pack." },
        { question: "How does location-specific keyword targeting work?", answer: "Location-specific keyword targeting involves optimizing your content for search terms that include geographic modifiers, such as city names, neighborhoods, or \"near me\" phrases. By embedding these keywords into your pages, meta tags, and Google Business Profile, your business becomes more visible to people searching for services in your area." },
        { question: "What role do online reviews play in local SEO?", answer: "Online reviews are a major local ranking factor and directly influence consumer trust. Businesses with a higher volume of positive reviews rank better in local search results and attract more clicks. Actively managing your review profile by encouraging satisfied customers and responding to feedback signals credibility to both search engines and potential clients." },
      ],
    },
  },
};
