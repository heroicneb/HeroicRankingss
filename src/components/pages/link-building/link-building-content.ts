/*
 * Normalised content model for /seo/linkbuilding — see page-content.ts for
 * the shared building blocks. Default content is the copy that shipped in
 * code (with the "Why Choose" descriptions taken from the current Figma).
 * The seed script loads this into the "Link Building Page" document.
 */

import {
  br,
  hl,
  img,
  paragraph,
  tx,
  type ContentImage,
  type FaqEntry,
  type HeadingSegment,
  type RichBlock,
} from "../shared/page-content.ts";

export interface LinkBuildingContent {
  hero: {
    title: HeadingSegment[];
    tagline: string;
    label: string;
    heading: HeadingSegment[];
    body: RichBlock[];
    ctaLabel: string;
    ctaUrl: string;
    image: ContentImage | null;
  };
  whyBacklinks: { heading: HeadingSegment[]; paragraphs: string[]; image: ContentImage | null };
  howWeBuild: {
    label: string;
    heading: HeadingSegment[];
    intro: string;
    cards: Array<{ title: string; body: string }>;
    closing: string;
  };
  solutions: {
    label: string;
    heading: HeadingSegment[];
    cards: Array<{
      title: string;
      subtitle: string;
      body: string;
      ctaLabel: string;
      ctaUrl: string;
      icon: ContentImage | null;
    }>;
    banner: {
      heading: HeadingSegment[];
      processSteps: Array<{ label: string; description: string }>;
      ctaLabel: string;
      ctaUrl: string;
    };
  };
  competitorInsights: {
    label: string;
    heading: HeadingSegment[];
    items: Array<{ title: string; paragraphs: string[]; chart: ContentImage | null }>;
  };
  whyChoose: {
    label: string;
    heading: HeadingSegment[];
    items: Array<{ title: string; description: string; icon: ContentImage | null }>;
    ctaTitle: string;
    ctaLabel: string;
    ctaUrl: string;
  };
  faq: { items: FaqEntry[] };
}

const lb = (file: string, w: number, h: number, alt = "") => img(`/link-building/${file}`, w, h, alt);
const whyIcon = (file: string) => img(`/seo-services/${file}`, 20, 20);

export const DEFAULT_LINK_BUILDING_CONTENT: LinkBuildingContent = {
  hero: {
    title: [tx("Link Building Services")],
    tagline: "From Authority to Visibility. From Rankings to Revenue - One Link at a Time.",
    label: "/ Network /",
    heading: [tx("Strengthen Your Off-Page SEO for Long-Term Growth")],
    body: [
      paragraph(
        "Link building is key to ",
        { text: "improving your website's keyword rankings and AI visibility", bold: true },
        " faster than any other SEO tactic. By securing high-quality backlinks, you'll drive more organic traffic and increase domain authority in the blink of an eye.",
      ),
    ],
    ctaLabel: "Book Link Building Consultation",
    ctaUrl: "/contact",
    image: lb("imgRectangle5.webp", 1858, 2304, "Classical statue"),
  },

  whyBacklinks: {
    heading: [tx("Why Backlinks Still Rule "), hl("Both Search and AI")],
    paragraphs: [
      "Backlinks have topped Google's ranking factors for over a decade — and that hasn't changed. Every quality link is a signal of trust that lifts your rankings faster than any other tactic.",
      "Today those same signals shape AI visibility too: ChatGPT, Perplexity, and AI Overviews cite the sources they trust most, and trust is built on links.",
      "The takeaway is simple: strong backlinks lift your rankings and help your brand get cited in the AI answers your customers now read first. That's exactly what our link building services are built to deliver. Get the backlinks right, and you win in search and in AI answers.",
    ],
    image: lb("backlinks-clipboard.webp", 1735, 1081, "Marble-carved search bar and results list"),
  },

  howWeBuild: {
    label: "/ Link Building /",
    heading: [tx("How We Build Links:"), br, hl("One Motion, Two Systems")],
    intro:
      "Modern link building has to serve two audiences at once — Google's rankings and the AI systems your customers now ask first. We focus on the tactics that do both in a single motion.",
    cards: [
      {
        title: "Competitor reverse-engineering.",
        body: "We start by mapping your competitors’ link profiles, pinpointing the high-authority domains driving their growth. Then we go one better, securing placements from even stronger sources so you close the gap and pull ahead faster.",
      },
      {
        title: "Custom, high-authority placements.",
        body: "Every link is hand-built on relevant, domain-approved sites. No shortcuts, no filler, no recycled placements: just contextual links that read naturally because they belong where they sit.",
      },
      {
        title: "Digital PR and original research.",
        body: "We help you publish original research, proprietary data, and industry benchmarks — the kind of content publications cite and AI extracts. One strong data study can earn dozens of high-authority backlinks while supplying the quotable findings LLMs pull into their answers.",
      },
      {
        title: "Linkable asset creation.",
        body: "We build the kind of content people reference by choice — free tools, calculators, templates, original statistics pages, and definitive guides. These assets keep earning links long after launch, turning one investment into a compounding source of authority and AI citations.",
      },
      {
        title: "Third-party listicle placements.",
        body: "Getting your brand featured inside existing high-ranking “best of” lists is one of the most direct ways to win search and AI visibility in a single placement. AI already cites these lists — when your brand sits inside them, it cites you by extension. We pursue earned placements on trusted publications, not self-serving lists that now lose ground in AI recommendations.",
      },
      {
        title: "Brand mentions on trusted sources.",
        body: "A contextual mention on a major publisher, niche-authority site, or trusted directory can earn AI citations even without a hyperlink, because AI models cross-reference mentions to build trust. We secure those mentions — and, where it makes sense, convert them into links.",
      },
      {
        title: "Authentic community presence.",
        body: "Reddit and industry forums are among the most-cited sources in AI answers, because that's where people go for unfiltered, peer-driven insight. We build genuine, helpful visibility in the communities relevant to your brand — credibility that traditional link building simply can't replicate.",
      },
    ],
    closing:
      "Every tactic is chosen to do double duty: build the authority that lifts your Google rankings today, and the presence that makes AI name your brand tomorrow. If you're ready to dominate competitive keywords with smarter SEO investment, we're the link building partner built to get you there.",
  },

  solutions: {
    label: "/ Solutions /",
    heading: [hl("White Hat"), tx(" Link Building Services")],
    cards: [
      {
        title: "Guest Posting",
        subtitle: "Sharing Expertise, Building Authority",
        body: "Your brand's ideas in the right spotlights. Our guest posting services enable you to showcase your expertise, reach new audiences, and secure backlinks to your website. By contributing valuable insights, you establish yourself as a thought leader while reaping the benefits of enhanced SEO.",
        ctaLabel: "Start Building Authority",
        ctaUrl: "/contact",
        icon: lb("imgBusinessUserCurriculum.svg", 28, 33),
      },
      {
        title: "Link Exchanges",
        subtitle: "Fostering Mutually Beneficial Connections",
        body: "Strategic partnerships between complementary, non-competing websites that create genuine value on both sides. We identify and manage link exchange opportunities that broaden your reach, strengthen domain authority, and hold up long-term.",
        ctaLabel: "Grow Your Connections",
        ctaUrl: "/contact",
        icon: lb("imgUserFeedbackHeart-mirrored.svg", 32, 32),
      },
      {
        title: "Niche Edits",
        subtitle: "Strategically Enhancing Existing Content",
        body: "We secure contextual placements within already-indexed, high-performing content — putting your brand exactly where their target audience is already engaged. One of the most efficient ways to build authority without starting from scratch.",
        ctaLabel: "Elevate Your Rankings",
        ctaUrl: "/contact",
        icon: lb("imgGroup176769.svg", 34, 33),
      },
      {
        title: "Directory Submissions",
        subtitle: "Navigating the Online Directory Landscape",
        body: "Directory submissions involve submitting your website to online directories and listings. We ensure that submissions are made to reputable and relevant directories, enhancing your website's online visibility and authority. This tactic contributes to improved search rankings and local SEO efforts.",
        ctaLabel: "Improve Local Visibility",
        ctaUrl: "/contact",
        icon: lb("imgGroup176770.svg", 32, 30),
      },
      {
        title: "Multilingual Backlinks",
        subtitle: "Reach New Audiences Across Languages and Borders",
        body: "Expand your brand reach beyond borders with high-quality backlinks across US, 27+ EU countries, Asian, and other markets. We source niche-relevant placements in the right language, on the right platforms — so your website builds real authority in every market that matters to their growth.",
        ctaLabel: "Expand Internationally",
        ctaUrl: "/contact",
        icon: lb("imgGroup176793.svg", 32, 32),
      },
      {
        title: "Listicle Backlinks",
        subtitle: "Strategically Enhancing Existing Content",
        body: "We secure placements within high-traffic listicles and curated roundups — the kind of content readers actively seek out and share. These links drive referral traffic, build brand recognition, therefore directly impacting your AI performance while strengthening your website's authority in its niche.",
        ctaLabel: "Enhance Your AI presence",
        ctaUrl: "/contact",
        icon: lb("imgGroup176769.svg", 34, 33),
      },
    ],
    banner: {
      heading: [tx("The Fastest and "), hl("Most Effective way to Get Started")],
      processSteps: [
        { label: "Reaching Out", description: "Contact us to schedule a consultation and learn how our Link Building services can transform your online presence." },
        { label: "Initial Call and Interview", description: "During the initial call, we align on your goals, backlink profile status, and the outcomes you want from a focused link acquisition strategy." },
        { label: "Gathering Project Information", description: "We gather your current SEO data, target pages, target geographies, and vertical priorities to build the right campaign structure." },
        { label: "Determining Budgets", description: "Budgets are scoped based on authority targets, campaign velocity, and the volume of placements required to reach your ranking goals." },
        { label: "Advisory", description: "You receive clear strategic guidance, execution priorities, and a measurable roadmap for sustained off-page growth." },
      ],
      ctaLabel: "Book a Discovery Call",
      ctaUrl: "/contact",
    },
  },

  competitorInsights: {
    label: "/ Competitor Insights /",
    heading: [tx("Discover Opportunities "), hl("For Growth")],
    items: [
      {
        title: "Domain Rating Trend Over Time",
        chart: lb("charts/domain-rating.jpg", 600, 441, "Domain rating changes month-over-month chart"),
        paragraphs: [
          "This chart visualizes the Domain Rating (DR) of yours and your competitor's websites over time, providing insight into how a domain's authority evolves based on its backlink profile.",
          "Domain Rating (DR) is a key metric that reflects the strength and quantity of a website's backlinks. A higher DR generally indicates better authority and visibility in search engines.",
          "Tracking these changes month-over-month helps identify trends in a website's SEO performance, such as growth from effective link-building campaigns or declines due to lost backlinks.",
          "Consistent increases in DR can suggest ongoing successful SEO efforts, while fluctuations may point to temporary issues or opportunities for improvement.",
          "Monitoring DR changes over time is crucial for assessing the long-term success of SEO strategies and adjusting link-building efforts to maintain or improve a site's authority.",
        ],
      },
      {
        title: "Link Velocity Changes Month-over-Month",
        chart: lb("charts/link-velocity.jpg", 600, 441, "Link velocity changes month-over-month chart"),
        paragraphs: [
          "This chart illustrates Link Velocity Changes Month-over-Month, tracking the number of referring domains acquired by yours and your competitor's websites over time. Referring domains represent unique websites linking back, and a higher number typically indicates stronger link-building efforts and potential for improved search visibility.",
          "A steady increase in referring domains suggests effective link-building strategies, while plateaus or declines may signal the need for strategy adjustments. Websites with rapid growth in referring domains are likely benefiting from increased authority, while slower growth or fluctuations may highlight areas for improvement.",
          "Monitoring these trends is crucial for evaluating the success of SEO campaigns. By analyzing the link velocity, websites can ensure they are consistently acquiring high-quality backlinks, maintaining competitive authority, and improving their overall performance in search results.",
          "Regular tracking helps adjust link-building tactics for sustained SEO success.",
        ],
      },
      {
        title: "Competitive Organic Traffic Predictions for the Next Three Months",
        chart: lb("charts/competitive-organic-traffic.jpg", 600, 441, "Competitive organic traffic predictions for the next three months chart"),
        paragraphs: [
          "This chart tracks the Organic Traffic changes for your website and your competitors, using predictive models to estimate future monthly traffic based on current SEO performance.",
          "Organic Traffic reflects the number of visitors driven to a website through search engines, correlating directly with the effectiveness of its SEO strategies and overall visibility.",
          "Monitoring predicted traffic trends helps evaluate the potential success of ongoing SEO efforts, with growth indicating effective keyword targeting and content optimization.",
          "Sudden spikes or declines in organic traffic predictions may indicate algorithm changes, content adjustments, or market shifts, highlighting areas for strategic refinement.",
          "Keeping track of traffic predictions is essential for planning SEO strategies and maintaining long-term search performance success.",
        ],
      },
      {
        title: "Your Website's Organic Traffic Predictions for the Next Three Months",
        chart: lb("charts/website-organic-traffic.jpg", 600, 441, "Your website organic traffic predictions for the next three months chart"),
        paragraphs: [
          "This chart predicts future Organic Traffic for your website, showing best-case, worst-case, and trend scenarios using predictive modeling based on SEO performance.",
          "Organic Traffic Trend: A steady projection showing moderate growth in traffic based on current SEO strategies.",
          "Best Case Scenario: Indicates the highest possible growth, assuming optimal SEO performance and success in areas like keyword optimization, backlink acquisition, and content improvements.",
          "Worst Case Scenario: Reflects the potential for traffic stagnation or decline, possibly due to ineffective SEO strategies, competition, or external factors like search engine algorithm updates.",
          "Tracking these traffic predictions is crucial for evaluating the effectiveness of your SEO strategies and adjusting efforts proactively. Regular monitoring allows you to prepare for potential growth or downturns, ensuring your strategy remains aligned with changing market trends and SEO developments.",
        ],
      },
    ],
  },

  whyChoose: {
    label: "/  Guided by Results  /",
    heading: [tx("Why Choose "), hl("Heroic Rankings?")],
    items: [
      { title: "Expertise", description: "A proven track record across industries — trusted by 10-figure companies to deliver.", icon: whyIcon("why-icon-expertise.svg") },
      { title: "Customized Strategies", description: "Tailored to your link building goals and industry.", icon: whyIcon("why-icon-strategy.svg") },
      { title: "Comprehensive Services", description: "From high-quality backlinks to advanced link-building strategies that scale your organic and AI visibility.", icon: whyIcon("why-icon-services.svg") },
      { title: "Transparent Reporting", description: "Regular updates and detailed reports on your link building performance.", icon: whyIcon("why-icon-reporting.svg") },
      { title: "Dedicated Support", description: "A team of link building experts always ready to assist you.", icon: whyIcon("why-icon-support.svg") },
    ],
    ctaTitle: "Take Your SEO To The Next Level",
    ctaLabel: "Take the First Step Today",
    ctaUrl: "/contact",
  },

  faq: {
    items: [
      { question: "What is off-page SEO?", answer: "Off-page SEO involves strategies taken outside your website to improve authority, trust, and visibility in search engines. It includes tactics like link building, digital PR, brand mentions, and partnerships that signal credibility to search engines." },
      { question: "How does off-page SEO contribute to search engine rankings?", answer: "Off-page SEO builds your website's authority and trustworthiness through external signals like backlinks, brand mentions, and social engagement. Search engines interpret these signals as endorsements of your content quality, which directly influences how high your pages rank for competitive keywords." },
      { question: "What is the importance of link building in off-page SEO?", answer: "Link building is the cornerstone of off-page SEO because backlinks remain one of the strongest ranking factors in search algorithms. High-quality links from authoritative, relevant websites pass trust and authority to your domain, helping your pages outrank competitors and sustain long-term organic visibility." },
      { question: "How does guest posting benefit my website?", answer: "Guest posting places your content on established industry publications, exposing your brand to new audiences while earning authoritative backlinks. This dual benefit drives referral traffic directly from the host site and strengthens your domain authority, which improves rankings across your entire website." },
      { question: "Are all types of backlinks beneficial for SEO?", answer: "Not all backlinks are created equal. Links from low-quality, spammy, or irrelevant websites can actually harm your rankings and may trigger search engine penalties. Effective link building focuses on earning contextual, editorially placed links from trusted domains within your industry or niche." },
      { question: "How do niche edits contribute to off-page SEO?", answer: "Niche edits involve placing your link within existing, already-indexed content on relevant websites, which means the link benefits from the page's established authority immediately. This approach provides a natural, contextual backlink that search engines value highly, often delivering faster ranking improvements than newly published content." },
    ],
  },
};

export const LINK_BUILDING_DEFAULT_SEO = {
  title: "Link Building Services",
  description:
    "Strengthen your off-page SEO with white-hat link building services that improve rankings, authority, and long-term organic growth.",
};
