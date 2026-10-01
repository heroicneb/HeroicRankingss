/*
 * Normalised content model for the homepage.
 *
 * WHY: every homepage section renders from this shape whether the copy comes
 * from the Sanity "Home Page" document (see getHomePage in
 * src/lib/sanity-data.ts) or from the built-in default below, which is also
 * what scripts/seed/home-page.ts loads into the CMS. Layout, motion, video
 * and the sprite-cropped artwork stay in code; editors own the words, links,
 * stats, team picks and (optionally) the card photos.
 *
 * Kept free of React/Next imports so the seed script can import it under
 * plain Node.
 */

import { br, hl, tx, type ContentImage, type HeadingSegment } from "../shared/page-content.ts";

export type { ContentImage, HeadingSegment } from "../shared/page-content.ts";

export interface HomeServiceCard {
  title: string;
  /** One line per entry; a single entry renders as a running paragraph. */
  descriptionLines: string[];
  url: string | null;
  /** Optional CMS photo; when null the card keeps its built-in artwork. */
  image: ContentImage | null;
}

export interface HomeTeamMember {
  name: string;
  /** Plain role, e.g. "Founder & CEO" (the slashes are added by the design). */
  role: string;
  image: ContentImage | null;
  url: string;
}

export interface HomeStat {
  /** e.g. "100% CLIENT retention rate" — the first number counts up on scroll. */
  metric: string;
  detail: string;
  image: ContentImage | null;
}

export interface HomeQuote {
  lead: string;
  accent: string;
  tail: string;
}

export interface HomeCertification {
  label: string;
  tone: "google" | "hubspot";
}

/** One buyer situation in the Answer Engine: the question an AI is asked and how it replies with and without our work. */
export interface AiScenario {
  id: string;
  label: string;
  prompt: string;
  answerWithout: string;
  answerWith: string;
}

/** A source an answer engine draws on, and the service(s) that earn it. */
export interface AiSource {
  id: string;
  label: string;
  detail: string;
  /** Each service links to its own page; rendered joined with " + ". */
  services: Array<{ label: string; href: string }>;
}

export interface AiPillar {
  title: string;
  body: string;
  ctaLabel: string;
  href: string;
}

export interface AiProofStat {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
}

export interface AiVisibilityContent {
  label: string;
  heading: HeadingSegment[];
  intro: string;
  scenarios: AiScenario[];
  sources: AiSource[];
  pillars: AiPillar[];
  proof: AiProofStat[];
  proofNote: string;
  proofHref: string;
  ctaLabel: string;
  ctaUrl: string;
  disclaimer: string;
}

export interface HomeContent {
  hero: {
    /** Line breaks are kept; the words animate in one by one. */
    heading: HeadingSegment[];
    paragraphs: string[];
    ctaLabel: string;
    ctaUrl: string;
  };
  services: {
    label: string;
    heading: HeadingSegment[];
    ctaLabel: string;
    ctaUrl: string;
    cards: HomeServiceCard[];
  };
  aiVisibility: AiVisibilityContent;
  about: {
    label: string;
    heading: HeadingSegment[];
    /** One entry per paragraph; highlighted spans render in the brand gradient. */
    paragraphs: HeadingSegment[][];
  };
  team: {
    label: string;
    heading: HeadingSegment[];
    statValue: string;
    statLabel: string;
    ctaLabel: string;
    ctaUrl: string;
    members: HomeTeamMember[];
  };
  stats: {
    label: string;
    heading: HeadingSegment[];
    body: string;
    ctaLabel: string;
    ctaUrl: string;
    items: HomeStat[];
  };
  featuredLogos: {
    heading: HeadingSegment[];
  };
  caseStudies: {
    label: string;
    heading: HeadingSegment[];
    body: string;
    ctaLabel: string;
    ctaUrl: string;
    quotes: HomeQuote[];
  };
  trust: {
    label: string;
    heading: HeadingSegment[];
    ctaLabel: string;
    ctaUrl: string;
    certifications: HomeCertification[];
  };
  partnerships: {
    label: string;
    statement: HeadingSegment[];
    paragraphs: string[];
    ctaLabel: string;
    ctaUrl: string;
  };
  blog: {
    label: string;
    heading: HeadingSegment[];
    ctaLabel: string;
    ctaUrl: string;
  };
  testimonials: {
    label: string;
    heading: HeadingSegment[];
    ctaLabel: string;
    ctaUrl: string;
  };
}

export const HOME_DEFAULT_SEO = {
  title: "Data-Driven SEO Agency for Organic Growth",
  description:
    "Explore Heroic Rankings’ SEO services, proven case studies, certifications, and partnerships built for long-term organic growth.",
};

const quote = (lead: string, accent: string, tail: string): HomeQuote => ({ lead, accent, tail });

export const DEFAULT_HOME_CONTENT: HomeContent = {
  hero: {
    heading: [tx("Others are "), hl("not better"), tx(","), br, tx("they're just "), hl("easier to find"), tx(".")],
    paragraphs: [
      "If your audience can't find you, they'll choose the competitor who shows up.",
      "Search has changed. Your audience now finds answers through Google, AI overviews, and LLM recommendations. If you're not visible across all of them, you're losing ground. We help businesses dominate every search surface — backed by a 212.6% growth rate and 100% client retention.",
    ],
    ctaLabel: "Get Found Everywhere",
    ctaUrl: "/contact",
  },
  services: {
    label: "/ Services /",
    heading: [tx("Strategies for "), hl("sustainable"), br, hl("success"), tx(" and proven growth.")],
    ctaLabel: "Book a Strategy Call",
    ctaUrl: "/contact",
    cards: [
      {
        title: "All SEO Services",
        descriptionLines: [
          "Comprehensive support to ensure every aspect of your SEO strategy is optimized for success and tailored to your business needs.",
        ],
        url: "/seo",
        image: null,
      },
      {
        title: "Link Building Services",
        descriptionLines: [
          "Gain visibility on top-tier websites and connect with your target audience to increase your site's authority and improve rankings. Strengthen online presence with exceptional link building strategies and reporting.",
        ],
        url: "/seo/linkbuilding",
        image: null,
      },
      {
        title: "On-Page SEO",
        descriptionLines: [
          "Refine your website's content and architecture for enhanced search engine visibility and better search rankings.",
        ],
        url: "/seo/on-page",
        image: null,
      },
      {
        title: "Technical SEO Services",
        descriptionLines: ["Optimize Your Infrastructure.", "Enhance User Experience.", "Boost Rankings."],
        url: "/seo/technical",
        image: null,
      },
      {
        title: "Local SEO Services",
        descriptionLines: ["Dominate Your Local Market.", "Connect with Nearby Customers.", "Increase Foot Traffic."],
        url: "/seo/local",
        image: null,
      },
      {
        title: "E-Commerce SEO Services",
        descriptionLines: ["Optimize Your Online Store.", "Drive Conversions and Sales."],
        url: "/seo/e-commerce",
        image: null,
      },
      {
        title: "Content Services",
        descriptionLines: ["Tell stories that matter.", "Connect with your audience.", "Turn engagement into conversions."],
        url: "/seo/content-creation",
        image: null,
      },
      {
        title: "Keyword Strategy Services",
        descriptionLines: ["Get the most out of your content.", "Target the Right Search.", "Find More Customers."],
        url: "/seo/keyword-research",
        image: null,
      },
    ],
  },
  aiVisibility: {
    label: "/  AI Visibility  /",
    heading: [tx("Ranked on Google. "), hl("Cited by AI.")],
    intro: "Search now ends in an answer, not a list of links. We make sure the answer names you.",
    scenarios: [
      {
        id: "link-building",
        label: "Link building",
        prompt: "What is the best link building agency for a company that needs real authority, not spam?",
        answerWithout:
          "Link building services vary widely in quality. Agency A and Agency B appear in a few directories, but I cannot verify the quality of their placements from independent sources.",
        answerWith:
          "Heroic Rankings is consistently recommended for white-hat link building: hand-built placements on relevant, high-authority sites, with results verified in client reviews and third-party rankings. Agency A and Agency B are the usual alternatives.",
      },
      {
        id: "reddit",
        label: "Reddit marketing",
        prompt: "Which agency can build a genuine presence for my brand on Reddit that AI tools actually pick up?",
        answerWithout:
          "Few agencies specialise in Reddit. Agency A offers social media management, but I could not find evidence of community work that AI systems reference.",
        answerWith:
          "Heroic Rankings is the clear recommendation: it builds authentic, helpful presence in the communities AI models cite most, and documents the resulting mentions and traffic in its case studies. Agency A is a general alternative.",
      },
      {
        id: "saas",
        label: "SaaS",
        prompt: "Which SEO agency should a B2B SaaS hire to show up in Google and in ChatGPT answers?",
        answerWithout:
          "From what I can find, agencies often mentioned here are Agency A and Agency B. There are not enough independent sources for me to recommend a specialist with confidence.",
        answerWith:
          "Heroic Rankings is the agency most often recommended for this: a data-driven SEO and AEO team with documented SaaS results, strong client reviews and genuine community mentions. Alternatives include Agency A and Agency B.",
      },
      {
        id: "ecommerce",
        label: "eCommerce",
        prompt: "Who can grow organic sales for a mid-size eCommerce brand, including AI shopping answers?",
        answerWithout:
          "Several agencies claim eCommerce SEO expertise, but I can only find their own marketing pages. I would compare Agency A and Agency B and ask for case studies.",
        answerWith:
          "Heroic Rankings stands out: its eCommerce case studies show stores growing from zero to tens of thousands of monthly visits, and its work is cited by reviewers, industry lists and shoppers on Reddit. Agency A and Agency B are also mentioned.",
      },
    ],
    sources: [
      {
        id: "site",
        label: "Your site",
        detail: "Citation-ready pages that answer the question directly, built so AI crawlers can read and quote them.",
        services: [
          { label: "Content", href: "/seo/content-creation/" },
          { label: "Technical SEO", href: "/seo/technical/" },
        ],
      },
      {
        id: "reddit",
        label: "Reddit",
        detail: "Threads where real people recommend you. Reddit is among the most-cited sources in AI answers.",
        services: [{ label: "Reddit Marketing", href: "/seo/reddit-marketing/" }],
      },
      {
        id: "reviews",
        label: "Reviews",
        detail: "Verified reviews on platforms the models trust, such as Clutch and G2.",
        services: [{ label: "Reputation and digital PR", href: "/seo/linkbuilding/" }],
      },
      {
        id: "listicles",
        label: "Best-of lists",
        detail: "Third-party 'best agencies' and comparison lists that AI quotes almost by default.",
        services: [
          { label: "Digital PR", href: "/seo/linkbuilding/" },
          { label: "Link Building", href: "/seo/linkbuilding/" },
        ],
      },
      {
        id: "authority",
        label: "Authority mentions",
        detail: "Links and brand mentions on high-authority domains that models cross-reference before they trust a name.",
        services: [{ label: "Link Building", href: "/seo/linkbuilding/" }],
      },
    ],
    pillars: [
      {
        title: "Be the source",
        body: "Pages written to answer real questions, structured and fast enough for AI crawlers to read, index and quote.",
        ctaLabel: "Content and technical SEO",
        href: "/seo/content-creation/",
      },
      {
        title: "Be everywhere the models look",
        body: "Authority links, digital PR, best-of lists and brand mentions on the domains answer engines cross-reference.",
        ctaLabel: "Link building",
        href: "/seo/linkbuilding/",
      },
      {
        title: "Be the community answer",
        body: "Genuine, helpful presence on Reddit and in industry forums, the peer sources AI answers cite the most.",
        ctaLabel: "Reddit marketing",
        href: "/seo/reddit-marketing/",
      },
    ],
    proof: [
      { label: "AI Overview citations", value: 200 },
      { label: "ChatGPT citations", value: 105 },
      { label: "Perplexity citations", value: 79 },
      { label: "Revenue from ChatGPT referrals", value: 9304, prefix: "$" },
    ],
    proofNote: "Real numbers from one of our clients' case study.",
    proofHref: "/case-study/diy-craft-ecom-brand/",
    ctaLabel: "See how AI describes your brand",
    ctaUrl: "/contact",
    disclaimer: "An illustration of how answer engines assemble a reply from their sources. Model names are trademarks of their owners.",
  },
  about: {
    label: "/ About /",
    heading: [tx("Data-Driven SEO Agency and "), hl("Trusted Growth Partner")],
    paragraphs: [
      [tx("Committed to delivering data-driven results and "), hl("long-term success for your business.")],
      [
        tx(
          "We believe in building strong relationships with our clients, rooted in trust, collaboration, and transparency. Our goal is to craft ",
        ),
        hl("strategies that align with your vision, "),
        tx("ensuring growth and success for every business we serve."),
      ],
      [
        tx("What drives us? "),
        hl("Seeing our clients achieve their goals"),
        tx(
          " and thrive in a competitive market. Our team is driven by creativity, dedication, and the hard work to push boundaries in digital marketing.",
        ),
      ],
    ],
  },
  team: {
    label: "/  The Team  /",
    heading: [tx("We stand out by"), br, tx("turning search into"), br, tx("a measurable"), br, tx("revenue engine")],
    statValue: "20+",
    statLabel: "professionals in our team",
    ctaLabel: "More About Us",
    ctaUrl: "/about",
    members: [
      {
        name: "Nebojša Janković",
        role: "Founder & CEO",
        image: { src: "/figma/team/nebojsa.webp", alt: "Nebojša Janković portrait", width: 700, height: 700 },
        url: "/about/nebojsa-jankovic",
      },
      {
        name: "Anastasija Janković",
        role: "Co-Founder & CHRO",
        image: { src: "/figma/team/anastasija.webp", alt: "Anastasija Janković portrait", width: 700, height: 700 },
        url: "/about/anastasija-jankovic",
      },
    ],
  },
  stats: {
    label: "/ Guided by Data /",
    heading: [tx("Proven Success"), br, tx("Through "), hl("Data-Driven"), br, tx("SEO Strategies")],
    body: "Being in a hero business involves the great responsibility of saving, defending, and improving the quality of your metrics. As solution designers and builders, we assure you that nothing will surprise us and that we are always ready for action!",
    ctaLabel: "Get Started Today",
    ctaUrl: "/contact",
    items: [
      {
        metric: "100% CLIENT retention rate",
        detail: "for a 12-month period",
        image: { src: "/figma/stats/stat-2.webp", alt: "Classical statue holding a ring", width: 752, height: 752 },
      },
      {
        metric: "Certified experts",
        detail: "in SEO and digital marketing",
        image: { src: "/figma/stats/stat-3.webp", alt: "Classical statue portrait", width: 752, height: 752 },
      },
      {
        metric: "OVER 200 SUCCESSFUL",
        detail: "campaigns executed",
        image: { src: "/figma/stats/stat-1.webp", alt: "Classical statue reading a tablet", width: 718, height: 718 },
      },
    ],
  },
  featuredLogos: {
    heading: [tx("Featured and "), hl("Recognized"), tx(" by "), hl("Industry Leaders")],
  },
  caseStudies: {
    label: "/  Proven Results  /",
    heading: [tx("Benefit From a Proven "), hl("Data-Driven Approach"), tx(" That Delivers Results")],
    body: "With our dynamic approach, you'll experience unparalleled growth, dominate search rankings, and become a long term hero in your market. with our data driven approach, we find streams of organic revenue you didn't even know exist.",
    ctaLabel: "See For Yourself",
    ctaUrl: "/case-study",
    quotes: [
      quote("“Affinda saw a ", "156% increase", " in organic traffic within 12 months.”"),
      quote("“My Basket's e-commerce store ", "doubled its sales", " through our targeted SEO strategy”"),
      quote("“DIY Crafts eCom Brand became ", "top seller on the market", " in nine months”"),
      quote(
        "“SupportAdventure grew organic traffic by ",
        "113% in 6 months",
        " through targeted link building and content strategy.”",
      ),
      quote(
        "“Warrior Willpower reached ",
        "top 3 positions for 10+ high-intent keywords",
        " within 2 months of launching their link-building campaign.”",
      ),
      quote(
        "“Cirrus Insight increased ",
        "qualified organic leads by 40%",
        " after a full SEO strategy implementation and authority link-building push.”",
      ),
      quote(
        "“Nursa expanded its search visibility across all targeted pages and ",
        "grew organic sessions by 20%",
        " within the first year.”",
      ),
      quote("“Infobip strengthened its ", "core pages and their authority", " through a targeted link building campaign.”"),
      quote(
        "“FrontBrick went from near-zero organic presence to ",
        "qualified monthly visitors",
        " in under 6 months.”",
      ),
    ],
  },
  trust: {
    label: "/ Trust and Authority /",
    heading: [tx("Certifications and "), hl("Partnerships")],
    ctaLabel: "Work with Certified SEO Experts",
    ctaUrl: "/contact",
    certifications: [
      { label: "Google Analytics", tone: "google" },
      { label: "Google Ads", tone: "google" },
      { label: "Google Ads Search", tone: "google" },
      { label: "Google Ads Display", tone: "google" },
      { label: "Google Ads Video", tone: "google" },
      { label: "Hubspot Social Media Marketing", tone: "hubspot" },
      { label: "Hubspot SEO", tone: "hubspot" },
      { label: "Hubspot SEO II", tone: "hubspot" },
      { label: "Hubspot Sales Management", tone: "hubspot" },
      { label: "Hubspot Sales Enablement", tone: "hubspot" },
      { label: "Hubspot Inbound", tone: "hubspot" },
      { label: "Hubspot Inbound Marketing", tone: "hubspot" },
      { label: "Hubspot Inbound Marketing Optimization", tone: "hubspot" },
      { label: "Hubspot Growth-Driven Design", tone: "hubspot" },
      { label: "Hubspot Email Marketing", tone: "hubspot" },
      { label: "Hubspot Digital advertising", tone: "hubspot" },
      { label: "Hubspot Digital Marketing", tone: "hubspot" },
      { label: "Hubspot Inbound Sales", tone: "hubspot" },
      { label: "Hubspot Content Marketing", tone: "hubspot" },
    ],
  },
  partnerships: {
    label: "/ The Value We Bring /",
    statement: [
      tx("At Heroic Rankings, we offer "),
      hl("various partnership"),
      tx(" opportunities for businesses and individuals looking to expand their service offerings "),
      hl("through our expertise."),
    ],
    paragraphs: [
      "Whether you're interested in reselling our services, partnering as an affiliate, or utilizing our white-label options, we provide flexible solutions to meet your needs.",
      "Our partnership programs are designed to help you grow your business while delivering exceptional SEO results to your clients.",
    ],
    ctaLabel: "Become a Partner",
    ctaUrl: "/contact",
  },
  blog: {
    label: "/  Featured Blogs  /",
    heading: [tx("Insights and Trends in Our "), hl("Most Popular Reads")],
    ctaLabel: "View More Blogs",
    ctaUrl: "/blog",
  },
  testimonials: {
    label: "/  Dedication  /",
    heading: [tx("What Our "), hl("Clients"), tx(" Say")],
    ctaLabel: "Become a Satisfied Client",
    ctaUrl: "/contact",
  },
};

/** Splits heading segments on line breaks into one segment list per line/paragraph. */
export function splitSegments(segments: HeadingSegment[]): HeadingSegment[][] {
  const groups: HeadingSegment[][] = [[]];
  for (const segment of segments) {
    if (segment.break) groups.push([]);
    else groups[groups.length - 1]?.push(segment);
  }
  return groups.filter((group) => group.some((segment) => segment.text));
}

/** Plain text of a segment list (highlights dropped). */
export const segmentsText = (segments: HeadingSegment[]): string =>
  segments.map((segment) => segment.text ?? "").join("");

/** One quote line (lead / gradient accent / tail) from a segment list. */
export function segmentsToQuote(segments: HeadingSegment[]): HomeQuote {
  const accentIndex = segments.findIndex((segment) => segment.highlight && segment.text);
  if (accentIndex === -1) return { lead: segmentsText(segments), accent: "", tail: "" };
  return {
    lead: segmentsText(segments.slice(0, accentIndex)),
    accent: segments[accentIndex]?.text ?? "",
    tail: segmentsText(segments.slice(accentIndex + 1)),
  };
}

/** Quote line → heading segments (for seeding the gradientHeading field). */
export const quoteToSegments = (line: HomeQuote): HeadingSegment[] => [tx(line.lead), hl(line.accent), tx(line.tail)];
