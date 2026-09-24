import { hl, img, tx } from "../shared/page-content.ts";
import { DEFAULT_WHY_CHOOSE, processSteps, type SeoServicePageDefinition } from "../shared/seo-service-content.ts";

const icon = (file: string, w: number, h: number) => img(`/content-creation/${file}`, w, h);

export const CONTENT_CREATION_PAGE: SeoServicePageDefinition = {
  key: "content-creation",
  title: "Content Creation",
  path: "/seo/content-creation",
  faqService: "content-creation",
  seo: {
    title: "Content Creation Services",
    description: "Craft strategy-led content that attracts qualified traffic, strengthens authority, and turns engagement into conversions.",
  },
  content: {
    hero: {
      title: [tx("Content Creation Services")],
      tagline: [tx("Turn Every Story Into Visibility, Trust, and Revenue "), hl("Across Search and AI Platforms")],
      label: "/ Tell Your Story /",
      heading: [tx("Content That Moves Readers From Curious to Certain")],
      paragraphs: [
        "Content should do more than attract traffic. Content builds trust and guides readers to close the gap between interest and action.",
        "When your brand is surfaced by AI-driven and LLM-powered systems: you're entering high-intent decision flows where users actively seek solutions and visibility within these environments, position your business to be present at the exact moment decisions are formed.",
      ],
      ctaLabel: "Book a Content Strategy Consultation",
      ctaUrl: "/contact",
      image: img("/content-creation/7aa368c28cc6d75dc25d0d2b0e7091d491102bce.webp", 2414, 4096, "Classical statue writing with a feather"),
    },
    solutions: {
      label: "/ Solutions /",
      heading: [hl("Content Creation"), tx(" & Strategy Services")],
      cards: [
        { title: "Content Planning and Creation", subtitle: "Weaving Stories with Purpose", body: "Every asset is researched, structured, and written to strengthen authority, capture demand, and influence outcomes across both search and AI-driven discovery environments.", ctaLabel: "Plan and Create Content", ctaUrl: "/contact", icon: icon("icon-content-planning.svg", 30, 30) },
        { title: "Blogging and Article Writing", subtitle: "Sharing Insights that Resonate", body: "We specialize in crafting compelling blog posts and articles that address industry trends, answer common questions, and position your brand as a trusted authority.", ctaLabel: "Start Blogging", ctaUrl: "/contact", icon: icon("icon-blogging.svg", 34, 30) },
        { title: "Infographics and Visual Content", subtitle: "Conveying Complexity with Clarity", body: "Our infographics and visual content services transform complex ideas into easily digestible visuals, engaging users and enhancing the overall user experience.", ctaLabel: "Create Visual Content", ctaUrl: "/contact", icon: icon("icon-infographics.svg", 33, 26) },
        { title: "Content Calendar Development", subtitle: "Guiding Your Content Journey", body: "We build content calendars as growth engines — mapping topics, formats, and distribution to search intent, audience behavior, and business goals.", ctaLabel: "Develop Your Calendar", ctaUrl: "/contact", icon: icon("icon-calendar.svg", 32, 32) },
        { title: "Linkable Asset Creation", subtitle: "Attracting organic backlinks", body: "High-value resources — original research, data studies, and interactive tools — that journalists, bloggers, and industry sites naturally want to reference and link to.", ctaLabel: "Get Referenced", ctaUrl: "/contact", icon: icon("icon-linkable.svg", 30, 31) },
        { title: "Listicles Post Creation", subtitle: "Improve AI signals and LLM citations", body: "We craft structured, expert-backed listicles that rank well in search, get referenced by AI assistants, and give readers the clear, scannable answers they’re actually looking for.", ctaLabel: "Stay Visible to AI Bots", ctaUrl: "/contact", icon: icon("icon-listicles.svg", 33, 30) },
      ],
      hubCards: [],
      banner: {
        heading: [tx("Is your content speaking to the "), hl("right audience"), tx("? The Fastest and "), hl("Most Effective to Get Started!")],
        steps: processSteps(
          [
            "Contact us to discover how our content creation services can take your online presence to the next level.",
            "Our team builds a focused content roadmap and starts producing high-impact articles that match your audience intent.",
            "We align every stakeholder on priorities, publishing cadence, and measurable goals before full execution begins.",
            "We coordinate contributors, review flows, and distribution channels so your content engine runs consistently at scale.",
            "Specialists across SEO, editorial, and optimization continuously refine performance so content keeps compounding results.",
          ],
          ["Strategy", "Content Writing", "Strategy Introduction", "Connecting Agents", "Experts"],
        ),
        ctaLabel: "Book a Discovery Call",
        ctaUrl: "/contact",
      },
    },
    whyChoose: DEFAULT_WHY_CHOOSE,
    faq: {
      items: [
        { question: "Do you optimise for seasonal and trending keywords?", answer: "Yes, we monitor seasonal trends and emerging topics in your industry to ensure your content stays relevant and capitalizes on timely search demand, driving targeted traffic when interest peaks." },
        { question: "Why is content planning and creation important?", answer: "Content planning ensures every piece you publish serves a strategic purpose — whether that is attracting new visitors, nurturing leads, or establishing thought leadership. Without a plan, content efforts become scattered and less effective." },
        { question: "How does blogging and article writing benefit my brand?", answer: "Regular, high-quality blog content establishes your brand as an authority, improves search engine rankings for relevant keywords, and creates shareable assets that drive organic traffic over time." },
        { question: "What is the significance of infographics and visual content?", answer: "Visual content like infographics simplifies complex information and is highly shareable across social platforms. They attract backlinks naturally, increase engagement, and help communicate your expertise in an accessible format." },
        { question: "Can content strategy services improve my website's SEO?", answer: "Absolutely. A well-executed content strategy targets the keywords your audience searches for, builds topical authority, and creates internal linking structures that help search engines understand and rank your site more effectively." },
      ],
    },
  },
};
