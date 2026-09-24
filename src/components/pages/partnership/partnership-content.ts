/*
 * Normalised content model for /partnership.
 *
 * WHY: the page renders from this shape whether the copy comes from Sanity
 * (see getPartnershipPage in src/lib/sanity-data.ts) or from the built-in
 * default below, which is also what scripts/seed/partnership-page.ts loads
 * into the CMS. This file must stay free of React/Next imports so the seed
 * script can import it under plain Node.
 */

import {
  br,
  hl,
  paragraph,
  type ContentImage,
  type HeadingSegment,
  type RichBlock,
} from "@/components/pages/shared/page-content";

export type { ContentImage, HeadingSegment, RichBlock } from "@/components/pages/shared/page-content";

export interface PartnershipContent {
  hero: { heading: HeadingSegment[]; intro: string; image: ContentImage | null };
  recognize: {
    label: string;
    heading: HeadingSegment[];
    items: Array<{ title: string; description: string; icon: ContentImage | null }>;
  };
  amplify: {
    label: string;
    heading: HeadingSegment[];
    intro: string;
    cards: Array<{
      title: string;
      subtitle: string;
      paragraphs: string[];
      icon: ContentImage | null;
      ctaLabel: string | null;
      ctaUrl: string | null;
    }>;
  };
  scale: {
    label: string;
    heading: HeadingSegment[];
    paragraphs: RichBlock[];
    logos: Array<{ image: ContentImage; keepColor: boolean }>;
  };
  darkCta: { heading: HeadingSegment[]; body: string; ctaLabel: string; ctaUrl: string };
  differentiators: {
    label: string;
    heading: HeadingSegment[];
    items: Array<{ title: string; description: RichBlock[]; icon: ContentImage | null }>;
  };
  nextSteps: {
    label: string;
    heading: HeadingSegment[];
    paragraphs: string[];
    items: Array<{ title: string; description: string; icon: ContentImage | null }>;
  };
  faq: { items: Array<{ question: string; answer: string }> };
}

const icon = (file: string, width: number, height: number): ContentImage => ({
  src: `/partnership/${file}`,
  alt: "",
  width,
  height,
});

const logo = (file: string, alt: string, width: number, height: number, keepColor = false) => ({
  image: { src: `/partnership/${file}`, alt, width, height },
  keepColor,
});

// ---------------------------------------------------------------------------
// Default content — the copy that shipped in code before the page moved to
// the CMS. Kept as the fallback if the CMS document is ever missing.
// ---------------------------------------------------------------------------

export const DEFAULT_PARTNERSHIP_CONTENT: PartnershipContent = {
  hero: {
    heading: [hl("White Label SEO Partnership"), { text: " Strategies That Grow Your MRR" }],
    intro:
      "Protect your client relationships and grow your agency's recurring revenue with white-label SEO and link building built for scale. We handle the execution, reporting, and strategy - you stay the hero, your clients see real results, and everyone grows together",
    image: { src: "/partnership/hero-statue.webp", alt: "Classical statue", width: 3072, height: 4096 },
  },

  recognize: {
    label: "/ Partner With Us /",
    heading: [{ text: "If You Recognize Yourself Here, " }, hl("We Might Be the Perfect Match")],
    items: [
      {
        title: "SEO Agencies & Consultants",
        description:
          "Struggling with in-house link-building expertise and seeking high-quality, reliable backlink support to overcome growth barriers.",
        icon: icon("icon-group176776.svg", 32, 32),
      },
      {
        title: "Web Design & Dev Agencies",
        description: "Looking to upsell SEO services to increase client retention & MRR.",
        icon: icon("icon-group176777.svg", 32, 32),
      },
      {
        title: "PPC Agencies",
        description:
          "Needing expert assistance with SEO implementation and link-building to provide top tier service to your clients.",
        icon: icon("icon-group176778.svg", 32, 28),
      },
    ],
  },

  amplify: {
    label: "/ Amplify Authority /",
    heading: [{ text: "Turn " }, hl("Organic Traffic"), br, { text: "Into " }, hl("Predictable Revenue")],
    intro:
      "This isn't just about outsourcing SEO. It's a long-term partnership designed to strengthen your offer and turn organic traffic into a scalable revenue channel. Visibility that converts.",
    cards: [
      {
        title: "Complete SEO Management",
        subtitle: "Outsource everything",
        paragraphs: [
          "We take full command of your clients’ SEO campaigns from start to finish, staying ahead of trends and seizing opportunities as they arise. We always identify when strategies need to evolve, ensuring you’re always at the cutting edge. With clear, actionable monthly reports, we map out the following steps, fine-tune campaigns, and deliver results that empower your clients - and your agency - to thrive.",
        ],
        icon: icon("icon-group176773.svg", 30, 30),
        ctaLabel: null,
        ctaUrl: null,
      },
      {
        title: "White Label SEO and Link Building Solutions For Digital Agencies",
        subtitle: "Grow Your Agency",
        paragraphs: [
          "Grow your agency with white-label SEO and link building built for scale. To keep everything running smoothly, you get access to our custom white-label platform - a centralized hub where you can track finances, monitor deliverables and work progress, and order from a full service library, all in one place.",
        ],
        icon: icon("icon-group176774.svg", 31, 32),
        ctaLabel: "Let's Grow Together",
        ctaUrl: "/contact",
      },
      {
        title: "What makes us the best white label SEO agency?",
        subtitle: "What Makes Us Unique",
        paragraphs: [
          "We focus on what actually protects and grows your offer: quality, transparency, and long-term success. Our white-label SEO is built around sustainable performance and strategies that hold up - not vanity metrics that look good on a dashboard and fall apart six months later.",
          "We operate as a true extension of your team, bringing the experience, process, and infrastructure of an established SEO operation directly into your agency. Every engagement is designed to protect your client relationships, scale with your growth, and give you reporting you can stand behind with confidence.",
        ],
        icon: icon("icon-group176775.svg", 21, 32),
        ctaLabel: null,
        ctaUrl: null,
      },
    ],
  },

  scale: {
    label: "/ Amplify Authority /",
    heading: [hl("Partnerships"), br, hl("Designed to Scale")],
    paragraphs: [
      paragraph("Our partnerships scale alongside your business goals and create lasting value for everyone involved."),
      paragraph({ text: "We don't grow if you don't - built for mutual growth.", bold: true }),
      paragraph(
        "That's not a tagline. It's the foundation of how we operate. Our success is directly tied to yours, which means every link we build, every report we deliver, and every strategy we recommend is made with your agency's long-term growth in mind. When your clients win, we all win",
      ),
      paragraph({ text: "Trusted by agencies across the US & EU.", italic: true }),
    ],
    logos: [
      logo("logo-becomes.svg", "Becomes logo", 142, 48),
      logo("logo-atropos-digital.svg", "Atropos Digital logo", 114, 16),
      logo("logo-group176790.svg", "Partner logo", 49, 44),
      logo("logo-digital-spice.png", "Digital Spice logo", 114, 18),
      logo("logo-group176792.svg", "Partner logo", 110, 15),
      logo("logo-conversion-pipeline.svg", "Conversion Pipeline logo", 109, 34),
      logo("logo-ice-web.png", "Ice Web logo", 106, 38),
      logo("logo-white-label-agency.png", "White Label Agency logo", 108, 22),
      logo("logo-get-scaled-digital.jpg", "Get Scaled Digital logo", 46, 44, true),
      logo("logo-rectangle1099.png", "Partner logo", 87, 43),
    ],
  },

  darkCta: {
    heading: [{ text: "Your agency's growth, managed from one place — " }, hl("inside your partner portal")],
    body:
      "Get instant access to everything you need to deliver marketing at scale. Track live work progress, manage orders, monitor finances, and pull client-ready reports — all from a centralized portal built specifically for agency partners. No back-and-forth, no chasing updates. Just clarity and control, from day one.",
    ctaLabel: "Create Your Partner Account",
    ctaUrl: "/contact",
  },

  differentiators: {
    label: "/ Distinct Advantage /",
    heading: [{ text: "What Makes Our " }, hl("White Label SEO"), { text: " Services Different?" }],
    items: [
      {
        title: "Unmatched SEO Partnership",
        description: [
          paragraph(
            "We operate as a true extension of your team - working behind the scenes so ",
            { text: "you stay the hero with your clients.", bold: true },
            " We integrate into your agency's delivery while enhancing your clients relationships.",
          ),
        ],
        icon: icon("icon-praying-hand.svg", 32, 32),
      },
      {
        title: "Guaranteed Heroic Results",
        description: [
          paragraph(
            "We are protecting your agency's credibility while ",
            { text: "driving growth your clients", bold: true },
            " can actually feel. Our clients experience growth that scales as their business evolves - because real heroes don't settle for average.",
          ),
        ],
        icon: icon("icon-graph-bar-increase.svg", 32, 32),
      },
      {
        title: "Transparent, Actionable Reporting",
        description: [
          paragraph(
            "Your clients need to feel the value, and you need to be able to stand behind it. Our client-ready reports make performance easy to understand, easy to communicate - so ",
            { text: "every conversation you have builds trust", bold: true },
            ", not doubt.",
          ),
        ],
        icon: icon("icon-group176781.svg", 32, 32),
      },
      {
        title: "One Platform. Total Control",
        description: [
          paragraph(
            "With Partner Portal managing delivery across multiple clients becomes easier at scale. Our white-label partner portal centralizes everything in real time - track finances, monitor work progress, manage deliverables, and order from our full service library - all in one place, ",
            { text: "built to scale with your agency.", bold: true },
          ),
        ],
        icon: icon("icon-group176782.svg", 32, 32),
      },
    ],
  },

  nextSteps: {
    label: "/ White Label SEO Process /",
    heading: [{ text: "Oh, You're Ready To Partner With Us? " }, hl("What's Next...")],
    paragraphs: [
      "From strategy to execution, we've got every aspect of your SEO covered - so you can focus on what you do best, while we handle the rest.",
      "Whether you need us to handle a specific SEO component or take charge of your entire SEO strategy, we're adaptable and here to deliver comprehensive support tailored to your exact needs.",
    ],
    items: [
      {
        title: "SEO audits",
        description:
          "Reveal the issues with your client's current organic search performance and demonstrate why increasing their investment with you is the smart move.",
        icon: icon("icon-group176783.svg", 29, 32),
      },
      {
        title: "Keyword research",
        description:
          "A detailed map of what your client’s target market is actually searching for - competition levels, monthly volumes, and strategic opportunities delivered as a client or investor-ready asset.",
        icon: icon("icon-group176784.svg", 32, 32),
      },
      {
        title: "Long-term planning (Strategy development)",
        description:
          "Structured SEO strategies built around real business goals, not guesswork. Stress-free strategies to walk into every client conversation fully prepared and ready to show them revenue growth projections.",
        icon: icon("icon-group1.svg", 30, 32),
      },
      {
        title: "On-site optimization",
        description:
          "Ensure every SEO initiative drives results by setting up your client's website for success and uncovering new growth opportunities.",
        icon: icon("icon-group176786.svg", 32, 32),
      },
      {
        title: "Link Building accross four continents",
        description:
          "High-quality, multilingual placements across the US, 27+ EU countries, and Asia - so your clients can build authority and improve rankings internationally. Order campaigns directly from the service library.",
        icon: icon("icon-group176787.svg", 32, 32),
      },
      {
        title: "Reporting",
        description:
          "Showcase the value of their investment by demonstrating the remarkable benefits and tangible results they're reaping. Our reporting capabilities help you make data-driven decisions to outpace competitors and strategically scale your business.",
        icon: icon("icon-group176788.svg", 30, 32),
      },
    ],
  },

  faq: {
    items: [
      {
        question: "What is white label SEO?",
        answer:
          "White-label SEO is a service that allows agencies to offer SEO services to their clients under their own brand, without needing to perform the work in-house. By partnering with a white-label SEO company, agencies can deliver professional SEO strategies, link building, and technical SEO support while an external provider does the actual SEO work. This enables agencies to focus on client management and growth without needing to expand internal SEO teams.",
      },
      {
        question: "What are the white label SEO services?",
        answer:
          "White label SEO services include full-spectrum search optimization delivered under your agency's brand. This covers technical SEO audits, on-page optimization, keyword research, content creation, link building, and monthly performance reporting, all presented with your branding so clients see you as the sole provider.",
      },
      {
        question: "How does white label link building work?",
        answer:
          "We source, vet, and secure high-quality backlink placements on behalf of your clients while your agency remains the face of the service. You provide the target pages and goals; we handle outreach, content creation, and placement, then deliver client-ready reports branded to your agency.",
      },
      {
        question: "How can agencies benefit from white-label SEO services?",
        answer:
          "Agencies gain the ability to offer comprehensive SEO services without hiring an in-house team, increasing monthly recurring revenue and client retention. White-label SEO lets you scale your service offerings, strengthen client relationships, and focus on business development while we handle execution.",
      },
      {
        question: "How does our white-label SEO program work?",
        answer:
          "After an onboarding call to understand your clients' needs, we build a custom SEO strategy and begin execution. You receive regular progress updates and branded reports to share directly with your clients. Communication stays seamless through a dedicated account manager who coordinates everything behind the scenes.",
      },
      {
        question: "What is a white-label SEO reseller program?",
        answer:
          "A white-label SEO reseller program allows your agency to resell professional SEO services at your own pricing under your own brand. You set the margins, manage the client relationship, and we deliver the work, giving you a scalable revenue stream with minimal operational overhead.",
      },
      {
        question: "How do we handle client communications in our white-label SEO partnership?",
        answer:
          "All communications are managed through your agency. We provide detailed internal reports and strategic recommendations that you can relay to your clients in your own voice. If needed, we can also join calls as a member of your team to provide technical expertise while maintaining your brand's front-facing role.",
      },
      {
        question: "What are the partnership options for white-label SEO services?",
        answer:
          "We offer flexible partnership tiers ranging from project-based link building campaigns to full SEO management retainers. Whether you need support for a single client or want to scale across your entire portfolio, we tailor the scope, pricing, and reporting cadence to match your agency's growth stage.",
      },
    ],
  },
};

export const PARTNERSHIP_DEFAULT_SEO = {
  title: "White Label SEO Partnership",
  description:
    "Build scalable agency growth with Heroic Rankings' white label SEO partnership model, from execution and reporting to long-term client retention.",
};
