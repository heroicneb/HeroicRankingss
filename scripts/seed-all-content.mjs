#!/usr/bin/env node
/**
 * Comprehensive Sanity seed script — seeds ALL hardcoded content.
 *
 * Usage:
 *   node scripts/seed-all-content.mjs            # seed everything
 *   node scripts/seed-all-content.mjs --dry-run   # preview without writing
 *
 * Token priority:
 *   1. SANITY_API_WRITE_TOKEN env var
 *   2. Sanity CLI auth token (~/.config/sanity/config.json)
 *
 * The SANITY_API_READ_TOKEN in .env.local is NOT sufficient for mutations.
 */

import { createClient } from "@sanity/client";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// ── Config ──────────────────────────────────────────────────────────────
const PROJECT_ID = "5cr26y9m";
const DATASET = "production";
const API_VERSION = "2026-02-19";
const DRY_RUN = process.argv.includes("--dry-run");

// ── Token resolution ────────────────────────────────────────────────────
function resolveWriteToken() {
  // 1. Explicit write token env var
  if (process.env.SANITY_API_WRITE_TOKEN) {
    return process.env.SANITY_API_WRITE_TOKEN;
  }

  // 2. Try to read from .env.local (in case user added SANITY_API_WRITE_TOKEN there)
  try {
    const envLocal = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
    const match = envLocal.match(/SANITY_API_WRITE_TOKEN="?([^"\n]+)"?/);
    if (match) return match[1];
  } catch {
    // .env.local not found, continue
  }

  // 3. Sanity CLI auth token (works for project members)
  try {
    const configPath = resolve(process.env.HOME, ".config/sanity/config.json");
    const config = JSON.parse(readFileSync(configPath, "utf8"));
    if (config.authToken) return config.authToken;
  } catch {
    // No CLI config found
  }

  return null;
}

const token = resolveWriteToken();

if (!token && !DRY_RUN) {
  console.error(`
╔══════════════════════════════════════════════════════════════════╗
║  No write token found!                                         ║
║                                                                ║
║  The SANITY_API_READ_TOKEN in .env.local cannot create/update  ║
║  documents. You need a token with write permissions.           ║
║                                                                ║
║  How to get one:                                               ║
║  1. Go to https://www.sanity.io/manage/project/${PROJECT_ID}     ║
║  2. Navigate to API → Tokens                                   ║
║  3. Create a new token with "Editor" permissions               ║
║  4. Set it as an environment variable:                         ║
║                                                                ║
║     SANITY_API_WRITE_TOKEN="sk..." node scripts/seed-all-content.mjs ║
║                                                                ║
║  Or add SANITY_API_WRITE_TOKEN to your .env.local file.        ║
║                                                                ║
║  Alternatively, run: npx sanity login                          ║
║  (the CLI auth token has write access for project members)     ║
╚══════════════════════════════════════════════════════════════════╝
`);
  process.exit(1);
}

// ── Sanity client ───────────────────────────────────────────────────────
const client = DRY_RUN
  ? null
  : createClient({
      projectId: PROJECT_ID,
      dataset: DATASET,
      apiVersion: API_VERSION,
      token,
      useCdn: false,
    });

// ── Helpers ─────────────────────────────────────────────────────────────
function slugify(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Create or replace a single document, with logging. */
async function seed(doc) {
  const label = `${doc._type} → ${doc._id}`;
  if (DRY_RUN) {
    console.log(`  [DRY RUN] Would create: ${label}`);
    return;
  }
  try {
    await client.createOrReplace(doc);
    console.log(`  ✓ ${label}`);
  } catch (err) {
    console.error(`  ✗ ${label}: ${err.message}`);
    throw err;
  }
}

// ── 1. Site Settings ────────────────────────────────────────────────────
const siteSettings = {
  _id: "siteSettings",
  _type: "siteSettings",
  companyName: "Heroic Rankings",
  phone: "+1 307 336 7191",
  email: "info@heroicrankings.com",
  copyrightText: "\u00a92026 Heroic Rankings",
  socialLinks: [
    {
      _key: "ln",
      _type: "socialLink",
      platform: "linkedin",
      url: "https://linkedin.com/company/heroicrankings",
    },
    {
      _key: "ig",
      _type: "socialLink",
      platform: "instagram",
      url: "https://instagram.com/heroicrankings",
    },
    {
      _key: "tw",
      _type: "socialLink",
      platform: "twitter",
      url: "https://x.com/heroicrankings",
    },
  ],
  navItems: [
    { _key: "home", _type: "navItem", label: "Home", href: "/" },
    { _key: "about", _type: "navItem", label: "About Us", href: "/about-us" },
    {
      _key: "seo",
      _type: "navItem",
      label: "SEO",
      href: "/seo-services",
      children: [
        { _key: "onpage", _type: "navLink", label: "On-Page SEO Services", href: "/on-page-seo" },
        { _key: "tech", _type: "navLink", label: "Technical SEO Services", href: "/technical-seo" },
        { _key: "local", _type: "navLink", label: "Local SEO Services", href: "/local-seo" },
        { _key: "ecom", _type: "navLink", label: "E-commerce Services", href: "/ecommerce-seo" },
        { _key: "content", _type: "navLink", label: "Content Creation Services", href: "/content-creation" },
        { _key: "keyword", _type: "navLink", label: "Keyword Strategy Services", href: "/keyword-strategy" },
      ],
    },
    { _key: "lb", _type: "navItem", label: "Link Building", href: "/link-building" },
    { _key: "partner", _type: "navItem", label: "Partnership", href: "/partnership" },
    { _key: "insights", _type: "navItem", label: "Insights", href: "/insights" },
    { _key: "cases", _type: "navItem", label: "Case Studies", href: "/case-studies" },
  ],
  footerNavItems: [
    { _key: "f1", _type: "footerNavLink", label: "Home", href: "/" },
    { _key: "f2", _type: "footerNavLink", label: "About Us", href: "/about-us" },
    { _key: "f3", _type: "footerNavLink", label: "Services", href: "/seo-services" },
    { _key: "f4", _type: "footerNavLink", label: "Partnership", href: "/partnership" },
    { _key: "f5", _type: "footerNavLink", label: "Privacy policy", href: "/privacy-policy" },
  ],
  footerCtaHeading: "Ready to grow together",
  footerCtaBody:
    "We grow by helping our clients grow. We partner with you to build long-term SEO growth.",
  footerCtaLabel: "Start Growing",
  footerCtaUrl: "/contact",
  headerCtaLabel: "Get Started",
  headerCtaUrl: "/contact",
};

// ── 2. Team Members ─────────────────────────────────────────────────────
const TEAM_MEMBERS = [
  {
    name: "Nebojša Janković",
    role: "/ Founder & CEO /",
    department: "leadership",
    order: 1,
    bioParagraphs: [
      "My journey into the world of SEO has been one of perseverance and self-discovery. I started from humble beginnings, juggling warehouse shifts and studying engineering, but I always had a hunger for more.",
      "Throughout my life, I've seen myself as a problem solver. To me, every problem is a puzzle first and a challenge second. This perspective has driven me to develop a keen eye for detail and a meticulous approach, which has earned me the reputation of being the go-to person for resolving SEO issues.",
      "Paired with my leadership skills and results-driven mindset, I view any task, no matter how monumental, as just another puzzle waiting to be solved. Through hard work and adaptability, I've built a career and a company I'm proud of, turning challenges into opportunities for success.",
      "I'm a resilient, dedicated, and ambitious individual who strives to grow both personally and professionally. In my spare time, I enjoy traveling the world, spending quality time with my wife and son, and keeping up with the latest marketing trends to stay inspired and informed.",
    ],
    contact: { email: "info@heroicrankings.com", phone: null },
    socialLinks: [
      { _key: "ig", _type: "socialLink", platform: "instagram", url: "https://instagram.com/heroicrankings" },
      { _key: "ln", _type: "socialLink", platform: "linkedin", url: "https://linkedin.com/company/heroicrankings" },
      { _key: "tw", _type: "socialLink", platform: "twitter", url: "https://x.com/heroicrankings" },
    ],
    showOnAboutPage: true,
  },
  { name: "Anastasija Janković", role: "/ Co-Founder & CHRO /", department: "leadership", order: 2 },
  { name: "Stefan Cvetković", role: "Organic Growth Manager", department: "seo-strategy", order: 3 },
  { name: "Una Stanojević", role: "Head of Operations", department: "operations", order: 4 },
  { name: "Srđan Gombar", role: "/ Content Manager /", department: "content", order: 5 },
  { name: "Slobodan Kačavenda", role: "Head of Link Building", department: "link-building", order: 6 },
  { name: "Anđela Knežević", role: "/ Link Building Specialist /", department: "link-building", order: 7 },
];

function buildTeamMemberDoc(m) {
  const _id = `teamMember-${slugify(m.name)}`;
  const doc = {
    _id,
    _type: "teamMember",
    name: m.name,
    slug: { _type: "slug", current: slugify(m.name) },
    role: m.role,
    department: m.department,
    order: m.order,
    showOnAboutPage: m.showOnAboutPage ?? true,
  };

  // bioParagraphs: array of {type:"text"} — Sanity stores these as plain strings in the array.
  // The createOrReplace API auto-assigns _key to array items that lack one.
  if (m.bioParagraphs) {
    doc.bioParagraphs = m.bioParagraphs;
  }

  if (m.contact) {
    doc.contact = {};
    if (m.contact.email) doc.contact.email = m.contact.email;
    if (m.contact.phone) doc.contact.phone = m.contact.phone;
  }

  if (m.socialLinks) {
    doc.socialLinks = m.socialLinks;
  }

  return doc;
}

// ── 3. Testimonials ─────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    authorName: "Gianluca Ferruggia",
    authorTitle: "/ General Manager /",
    company: "DesignRush",
    quote:
      "Amazing results! HR is an amazing team made of honest people and amazing experts. They deliver the results they promise!",
    featured: true,
    order: 1,
  },
  {
    authorName: "Momcilo Popov",
    authorTitle: "/ Co-Founder /",
    company: "bcms",
    quote:
      "HeroicRanking is our secret weapon! Their technical SEO know-how and link-building skills boosted rankings and brought more traffic to every project we collaborated on. They know their stuff and are great to work with. Highly recommend!",
    featured: true,
    order: 2,
  },
  {
    authorName: "Nik Vujic",
    authorTitle: "/ Founder /",
    company: "GSD",
    quote:
      "Best in the game regarding off-page SEO and the team that is enjoyable to work with over and over again! Looking forward to more of our successes!",
    featured: true,
    order: 3,
  },
];

function buildTestimonialDoc(t) {
  return {
    _id: `testimonial-${slugify(t.authorName)}`,
    _type: "testimonial",
    quote: t.quote,
    authorName: t.authorName,
    authorTitle: t.authorTitle,
    company: t.company,
    featured: t.featured ?? false,
    order: t.order,
  };
}

// ── 4. Case Studies ─────────────────────────────────────────────────────
const CASE_STUDIES = [
  {
    title: "Affinda",
    client: "Affinda",
    panelLabel: "Affinda",
    excerpt:
      "Affinda is a leading provider of AI-powered document parsing and data extraction solutions.",
    publishedAt: "2024-12-01",
    quoteText:
      "Affinda saw a 156% increase in organic traffic within 12 months.",
    featured: true,
  },
  {
    title: "My Baskets",
    client: "My Baskets",
    panelLabel: "My Baskets",
    excerpt:
      "My Baskets is a leading Canadian online retailer specializing in luxury gift baskets for various occasions.",
    publishedAt: "2024-12-01",
    quoteText:
      "My Basket's e-commerce store doubled its sales through our targeted SEO strategy",
    featured: true,
  },
  {
    title: "Nagish",
    client: "Nagish",
    panelLabel: "Nagish",
    excerpt:
      "Nagish is a pioneering company dedicated to making communication more accessible for individuals with hearing impairments.",
    publishedAt: "2024-12-24",
    featured: true,
  },
  {
    title: "Art by Maudsch",
    client: "Art by Maudsch",
    panelLabel: "Art by Maudsch",
    excerpt:
      "Art by Maudsch is an online platform dedicated to selling unique, handmade artworks by contemporary artists.",
    publishedAt: "2024-12-24",
  },
  {
    title: "DesignRush",
    client: "DesignRush",
    panelLabel: "DesignRush",
    excerpt:
      "DesignRush is a B2B platform connecting businesses with top agencies in web design, marketing, branding, and technology.",
    publishedAt: "2024-12-01",
  },
  {
    title: "Number Artist",
    client: "Number Artist",
    panelLabel: "Number Artist",
    excerpt:
      "Number Artist provides intricate and customized paint-by-number kits designed for art lovers of all skill levels.",
    publishedAt: "2024-12-24",
    quoteText:
      "Number Artist became top seller on the market in nine months",
    featured: true,
  },
];

function buildCaseStudyDoc(cs) {
  const doc = {
    _id: `caseStudy-${slugify(cs.title)}`,
    _type: "caseStudy",
    title: cs.title,
    slug: { _type: "slug", current: slugify(cs.title) },
    client: cs.client,
    panelLabel: cs.panelLabel,
    excerpt: cs.excerpt,
    publishedAt: cs.publishedAt,
    featured: cs.featured ?? false,
    body: [
      {
        _type: "block",
        style: "normal",
        children: [{ _type: "span", text: cs.excerpt }],
      },
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "Our team executed a focused strategy combining technical improvements, high-impact content, and authority-building actions aligned with business KPIs.",
          },
        ],
      },
    ],
    seo: {
      _type: "seo",
      metaTitle: `${cs.title} Case Study`,
      metaDescription: cs.excerpt,
    },
  };

  if (cs.quoteText) {
    doc.quoteText = cs.quoteText;
  }

  return doc;
}

// ── 5. FAQ Items ────────────────────────────────────────────────────────
const FAQ_ITEMS = [
  // Link Building
  { question: "What is off-page SEO?", answer: "Off-page SEO involves strategies taken outside your website to improve authority, trust, and visibility in search engines. It includes tactics like link building, digital PR, brand mentions, and partnerships that signal credibility to search engines.", servicePage: "link-building", order: 1 },
  { question: "How does off-page SEO contribute to search engine rankings?", answer: "Off-page SEO builds your website's authority and trustworthiness through external signals like backlinks, brand mentions, and social engagement. Search engines interpret these signals as endorsements of your content quality, which directly influences how high your pages rank for competitive keywords.", servicePage: "link-building", order: 2 },
  { question: "What is the importance of link building in off-page SEO?", answer: "Link building is the cornerstone of off-page SEO because backlinks remain one of the strongest ranking factors in search algorithms. High-quality links from authoritative, relevant websites pass trust and authority to your domain, helping your pages outrank competitors and sustain long-term organic visibility.", servicePage: "link-building", order: 3 },
  { question: "How does guest posting benefit my website?", answer: "Guest posting places your content on established industry publications, exposing your brand to new audiences while earning authoritative backlinks. This dual benefit drives referral traffic directly from the host site and strengthens your domain authority, which improves rankings across your entire website.", servicePage: "link-building", order: 4 },
  { question: "Are all types of backlinks beneficial for SEO?", answer: "Not all backlinks are created equal. Links from low-quality, spammy, or irrelevant websites can actually harm your rankings and may trigger search engine penalties. Effective link building focuses on earning contextual, editorially placed links from trusted domains within your industry or niche.", servicePage: "link-building", order: 5 },
  { question: "How do niche edits contribute to off-page SEO?", answer: "Niche edits involve placing your link within existing, already-indexed content on relevant websites, which means the link benefits from the page's established authority immediately. This approach provides a natural, contextual backlink that search engines value highly, often delivering faster ranking improvements than newly published content.", servicePage: "link-building", order: 6 },

  // On-Page SEO
  { question: "What is on-page SEO?", answer: "On-page SEO is the practice of optimizing individual web pages to rank higher and earn more relevant organic traffic. It encompasses everything from content quality, keyword placement, and meta tags to internal linking structure, image optimization, and URL formatting.", servicePage: "on-page-seo", order: 1 },
  { question: "Why is on-page optimization important for SEO?", answer: "On-page optimization ensures that search engines can clearly understand what each page on your website is about, which directly affects how well it ranks. Without proper on-page fundamentals, even exceptional content and strong backlinks won't reach their full ranking potential.", servicePage: "on-page-seo", order: 2 },
  { question: "How does keyword research play a role in on-page optimization?", answer: "Keyword research identifies the exact terms and phrases your target audience uses when searching online, allowing you to align your content with real user intent. Strategic placement of these keywords in titles, headings, and body content signals relevance to search engines.", servicePage: "on-page-seo", order: 3 },
  { question: "What benefits can I expect from meta tags optimization?", answer: "Optimized meta titles and descriptions improve click-through rates by making your search result listings more compelling and relevant to user queries. They also help search engines understand page content, which supports better ranking for targeted keywords.", servicePage: "on-page-seo", order: 4 },
  { question: "How does content optimization enhance my website?", answer: "Content optimization aligns your existing and new content with search intent, readability standards, and competitive benchmarks. This process improves user engagement metrics, reduces bounce rates, and signals to search engines that your pages deliver genuine value.", servicePage: "on-page-seo", order: 5 },

  // Technical SEO
  { question: "What is technical SEO?", answer: "Technical SEO focuses on optimizing your website's infrastructure so search engines can efficiently crawl, index, and render your pages. It covers site speed, mobile-friendliness, crawlability, structured data, security, and server configuration.", servicePage: "technical-seo", order: 1 },
  { question: "How does a website audit contribute to technical SEO?", answer: "A comprehensive website audit identifies technical issues that may be limiting your site's search performance, such as broken links, duplicate content, slow load times, or crawl errors. Fixing these issues removes barriers that prevent search engines from properly indexing and ranking your content.", servicePage: "technical-seo", order: 2 },
  { question: "What is the purpose of XML sitemaps in technical SEO?", answer: "XML sitemaps provide search engines with a structured map of all the important pages on your website, ensuring nothing gets missed during crawling. They're especially valuable for large sites, new pages, or pages with limited internal links.", servicePage: "technical-seo", order: 3 },
  { question: "Why is robots.txt optimization important?", answer: "A properly configured robots.txt file controls which parts of your site search engine crawlers can and cannot access, preventing them from wasting crawl budget on irrelevant pages. This ensures that your most important content gets discovered and indexed efficiently.", servicePage: "technical-seo", order: 4 },
  { question: "How does website speed optimization impact SEO?", answer: "Website speed is a direct ranking factor in search algorithms, and slow-loading pages lead to higher bounce rates and lower user engagement. Improving load times through image optimization, caching, code minification, and server improvements benefits both search rankings and conversion rates.", servicePage: "technical-seo", order: 5 },

  // Local SEO
  { question: "What is local SEO?", answer: "Local SEO is a strategy focused on optimizing your online presence to attract more business from relevant local searches on Google and other search engines. It involves optimizing your Google Business Profile, building local citations, managing reviews, and targeting location-specific keywords.", servicePage: "local-seo", order: 1 },
  { question: "How does local SEO differ from traditional SEO?", answer: "While traditional SEO focuses on improving visibility on a national or global scale, local SEO targets customers in a specific geographic area. It emphasizes Google Maps rankings, local pack visibility, location-based keywords, and proximity signals that traditional SEO doesn't prioritize.", servicePage: "local-seo", order: 2 },
  { question: "Why are local citations important?", answer: "Local citations \u2014 mentions of your business name, address, and phone number across directories and websites \u2014 help search engines verify your business's legitimacy and location. Consistent, accurate citations across major platforms strengthen your local search rankings and build customer trust.", servicePage: "local-seo", order: 3 },
  { question: "How does location-specific keyword targeting work?", answer: "Location-specific keyword targeting involves incorporating city, neighborhood, or regional terms into your website content, meta tags, and business listings. This signals to search engines that your business serves a particular area, helping you appear in searches made by nearby customers.", servicePage: "local-seo", order: 4 },
  { question: "What role do online reviews play in local SEO?", answer: "Online reviews are one of the most influential local ranking factors, as search engines use review quantity, quality, and recency to determine business credibility. Positive reviews also improve click-through rates from search results and directly influence purchase decisions.", servicePage: "local-seo", order: 5 },

  // E-commerce SEO
  { question: "What is e-commerce SEO?", answer: "E-commerce SEO is the practice of optimizing online stores to rank higher in search engine results for product-related queries. It covers product page optimization, category structure, technical performance, schema markup, and content strategy tailored specifically for shopping intent.", servicePage: "ecommerce-seo", order: 1 },
  { question: "How is e-commerce SEO different from traditional SEO?", answer: "E-commerce SEO deals with unique challenges like large product catalogs, faceted navigation, duplicate content from product variations, and transactional search intent. It requires specialized strategies for product schema, inventory management signals, and conversion-focused page optimization.", servicePage: "ecommerce-seo", order: 2 },
  { question: "How does product page optimization impact e-commerce SEO?", answer: "Optimized product pages with unique descriptions, structured data, quality images, and strategic keywords help individual products rank for specific search queries. This drives highly qualified traffic from users who are ready to buy, directly increasing revenue.", servicePage: "ecommerce-seo", order: 3 },
  { question: "What is category page optimization and its significance?", answer: "Category pages often target broader, higher-volume keywords and serve as landing pages for shoppers exploring product types. Optimizing these pages with relevant content, proper internal linking, and clear structure captures users earlier in the buying journey.", servicePage: "ecommerce-seo", order: 4 },
  { question: "Can e-commerce SEO work with specific platforms like Shopify or WooCommerce?", answer: "Yes, e-commerce SEO strategies can be tailored to any major platform including Shopify, WooCommerce, Magento, and BigCommerce. Each platform has unique technical considerations, but the core principles of product optimization, site structure, and content strategy apply across all of them.", servicePage: "ecommerce-seo", order: 5 },

  // Keyword Strategy
  { question: "What is the role of keyword strategy in SEO?", answer: "Keyword strategy is the foundation of effective SEO because it determines which search terms you target across your entire website. A well-researched strategy aligns your content with actual user searches, ensuring every page serves a clear purpose in your organic growth plan.", servicePage: "keyword-strategy", order: 1 },
  { question: "How do you choose the right keywords for my business?", answer: "We analyze your industry, competitors, target audience, and business goals to identify keywords that balance search volume, competition level, and commercial intent. This data-driven approach ensures we target terms that drive qualified traffic likely to convert.", servicePage: "keyword-strategy", order: 2 },
  { question: "Why is long-tail keyword targeting important?", answer: "Long-tail keywords are more specific phrases with lower competition but higher conversion potential because they match precise user intent. Targeting these terms allows you to rank faster and attract visitors who are further along in the decision-making process.", servicePage: "keyword-strategy", order: 3 },
  { question: "What is competitive keyword analysis, and why is it essential?", answer: "Competitive keyword analysis reveals which terms your competitors rank for, where their content gaps exist, and what link-building strategies they use. This intelligence helps you prioritize opportunities they're missing and develop strategies to outrank them.", servicePage: "keyword-strategy", order: 4 },
  { question: "How does keyword mapping benefit my website's content and pages?", answer: "Keyword mapping assigns specific target keywords to individual pages on your website, preventing cannibalization and ensuring each page has a distinct ranking purpose. This structured approach maximizes coverage across your keyword landscape and improves overall site authority.", servicePage: "keyword-strategy", order: 5 },
  { question: "Do you optimize for seasonal and trending keywords?", answer: "Yes, we monitor search trend data to identify seasonal spikes and emerging topics relevant to your industry. Incorporating these timely keywords into your content calendar helps capture surge traffic during peak periods and positions you ahead of competitors.", servicePage: "keyword-strategy", order: 6 },

  // Content Creation
  { question: "Why is content planning and creation important?", answer: "Strategic content planning ensures every piece of content serves a specific SEO and business objective, preventing wasted effort on topics that won't drive results. A structured content calendar aligns your publishing schedule with keyword opportunities, seasonal trends, and audience needs.", servicePage: "content-creation", order: 1 },
  { question: "How does blogging and article writing benefit my brand?", answer: "Regular, high-quality blog content targets informational keywords that attract potential customers early in their research journey. It builds topical authority in your niche, supports internal linking structures, and provides shareable content that can earn natural backlinks.", servicePage: "content-creation", order: 2 },
  { question: "What is the significance of infographics and visual content?", answer: "Infographics and visual content make complex information easily digestible and highly shareable, which naturally attracts backlinks and social engagement. Visual assets also improve time-on-page and user experience metrics that search engines consider as quality signals.", servicePage: "content-creation", order: 3 },
  { question: "Can content strategy services improve my website's SEO?", answer: "Absolutely. A comprehensive content strategy directly improves SEO by systematically building topical authority, targeting valuable keywords, and creating linkable assets. When aligned with technical and off-page SEO efforts, content strategy multiplies the effectiveness of your entire organic search program.", servicePage: "content-creation", order: 4 },
];

function buildFaqDoc(f) {
  return {
    _id: `faq-${f.servicePage}-${String(f.order).padStart(2, "0")}`,
    _type: "faqItem",
    question: f.question,
    answer: f.answer,
    category: "services",
    servicePage: f.servicePage,
    order: f.order,
  };
}

// ── 6. Service Pages ─────────────────────────────────────────────────────
const SERVICE_PAGES = [
  {
    serviceType: "seo-services",
    slug: "seo-services",
    heroTitle: "SEO Services Built for Measurable Organic Growth",
    heroDescription:
      "We combine technical SEO, content, authority building, and analytics to turn search into a dependable growth channel.",
    solutionSectionLabel: "/ Service Solutions /",
    solutionSectionHeading: "Complete SEO Programs",
    serviceCards: [
      {
        _key: "audit",
        title: "SEO Audits",
        subtitle: "Find what limits growth",
        body: "We identify technical, content, and authority gaps that block rankings and revenue.",
        iconSrc: "/icons/service-default.svg",
      },
      {
        _key: "roadmap",
        title: "Execution Roadmaps",
        subtitle: "Prioritize what moves KPIs",
        body: "Every sprint is aligned to business goals, not vanity metrics.",
        iconSrc: "/icons/service-default.svg",
      },
      {
        _key: "reporting",
        title: "Revenue Reporting",
        subtitle: "Track impact clearly",
        body: "We connect rankings and traffic to qualified leads and pipeline outcomes.",
        iconSrc: "/icons/service-default.svg",
      },
    ],
    processSteps: [
      { _key: "discovery", title: "Discovery", description: "Audit current performance and market position." },
      { _key: "strategy", title: "Strategy", description: "Build a prioritized roadmap with clear milestones." },
      { _key: "execution", title: "Execution", description: "Ship technical, content, and link-building work." },
    ],
    whyChooseItems: [
      {
        _key: "focus",
        title: "Business-Focused",
        description: "SEO strategy mapped to revenue and real business outcomes.",
        iconSrc: "/icons/service-default.svg",
      },
      {
        _key: "ownership",
        title: "Execution Ownership",
        description: "We do the work, not just recommendations.",
        iconSrc: "/icons/service-default.svg",
      },
      {
        _key: "clarity",
        title: "Clear Communication",
        description: "Transparent reporting and next-step prioritization every cycle.",
        iconSrc: "/icons/service-default.svg",
      },
    ],
    relatedCaseStudySlugs: ["affinda", "designrush"],
  },
  {
    serviceType: "on-page-seo",
    slug: "on-page-seo",
    heroTitle: "On-Page SEO Services for Higher Rankings and Better Conversions",
    heroDescription:
      "Improve relevance, clarity, and performance of every page users and search engines evaluate.",
    solutionSectionLabel: "/ Service Solutions /",
    solutionSectionHeading: "On-Page Improvements",
    serviceCards: [
      {
        _key: "mapping",
        title: "Keyword Mapping",
        subtitle: "Intent-aligned page targets",
        body: "Map terms to the right pages and remove cannibalization.",
        iconSrc: "/icons/service-default.svg",
      },
      {
        _key: "content",
        title: "Content Optimization",
        subtitle: "Improve clarity and depth",
        body: "Refine copy, headings, and internal links to match search intent.",
        iconSrc: "/icons/service-default.svg",
      },
      {
        _key: "snippet",
        title: "SERP Snippet Optimization",
        subtitle: "Increase click-through rate",
        body: "Write metadata that earns clicks while preserving relevance signals.",
        iconSrc: "/icons/service-default.svg",
      },
    ],
    processSteps: [
      { _key: "audit", title: "Audit", description: "Evaluate page templates and content clusters." },
      { _key: "optimize", title: "Optimize", description: "Deploy metadata, heading, and structure upgrades." },
      { _key: "measure", title: "Measure", description: "Validate impact through ranking and conversion movement." },
    ],
    whyChooseItems: [
      {
        _key: "intent",
        title: "Intent-First",
        description: "We optimize for search intent, not keyword stuffing.",
        iconSrc: "/icons/service-default.svg",
      },
      {
        _key: "ux",
        title: "UX + SEO Balance",
        description: "Ranking improvements without compromising readability and UX.",
        iconSrc: "/icons/service-default.svg",
      },
      {
        _key: "sustainable",
        title: "Sustainable Gains",
        description: "Compounding improvements through structured on-page iteration.",
        iconSrc: "/icons/service-default.svg",
      },
    ],
    relatedCaseStudySlugs: ["nagish", "my-baskets"],
  },
  {
    serviceType: "technical-seo",
    slug: "technical-seo",
    heroTitle: "Technical SEO Services That Remove Growth Bottlenecks",
    heroDescription:
      "Fix crawl, indexation, rendering, and performance issues that limit your visibility and conversions.",
    solutionSectionLabel: "/ Service Solutions /",
    solutionSectionHeading: "Technical Foundations",
    serviceCards: [
      {
        _key: "crawl",
        title: "Crawlability",
        subtitle: "Get key pages discovered",
        body: "Improve crawl paths, internal linking, and directive handling.",
        iconSrc: "/icons/service-default.svg",
      },
      {
        _key: "index",
        title: "Indexation",
        subtitle: "Index only what matters",
        body: "Resolve duplication and low-value indexation issues.",
        iconSrc: "/icons/service-default.svg",
      },
      {
        _key: "speed",
        title: "Performance",
        subtitle: "Faster pages, better outcomes",
        body: "Improve loading behavior and technical stability across templates.",
        iconSrc: "/icons/service-default.svg",
      },
    ],
    processSteps: [
      { _key: "collect", title: "Collect Data", description: "Use logs and crawlers to map technical debt." },
      { _key: "prioritize", title: "Prioritize Fixes", description: "Sequence by impact and implementation effort." },
      { _key: "deploy", title: "Deploy + Validate", description: "Ship changes and verify improved health signals." },
    ],
    whyChooseItems: [
      {
        _key: "engineering",
        title: "Engineering-Minded",
        description: "We translate SEO findings into practical implementation tasks.",
        iconSrc: "/icons/service-default.svg",
      },
      {
        _key: "qa",
        title: "QA Discipline",
        description: "Changes are validated before and after release.",
        iconSrc: "/icons/service-default.svg",
      },
      {
        _key: "scalable",
        title: "Scalable Framework",
        description: "Processes designed for growth-stage and enterprise sites.",
        iconSrc: "/icons/service-default.svg",
      },
    ],
    relatedCaseStudySlugs: ["affinda", "designrush"],
  },
  {
    serviceType: "local-seo",
    slug: "local-seo",
    heroTitle: "Local SEO Services to Win More Nearby Customers",
    heroDescription:
      "Improve map visibility, location intent coverage, and local conversion performance.",
    solutionSectionLabel: "/ Service Solutions /",
    solutionSectionHeading: "Local Growth Initiatives",
    serviceCards: [
      {
        _key: "gbp",
        title: "Google Business Profile",
        subtitle: "Strengthen local presence",
        body: "Optimize profile structure, categories, and recurring updates.",
        iconSrc: "/icons/service-default.svg",
      },
      {
        _key: "citations",
        title: "Citation Consistency",
        subtitle: "Improve trust signals",
        body: "Unify NAP data and clean conflicting listings.",
        iconSrc: "/icons/service-default.svg",
      },
      {
        _key: "location-pages",
        title: "Location Page SEO",
        subtitle: "Capture local intent",
        body: "Build and optimize location pages for visibility and conversion.",
        iconSrc: "/icons/service-default.svg",
      },
    ],
    processSteps: [
      { _key: "market", title: "Market Assessment", description: "Evaluate local competition and opportunity." },
      { _key: "optimize", title: "Optimize Listings", description: "Improve core profile and citation accuracy." },
      { _key: "expand", title: "Expand Coverage", description: "Scale content and authority for local intent." },
    ],
    whyChooseItems: [
      {
        _key: "maps",
        title: "Map Pack Focus",
        description: "Optimize actions that improve visibility in local packs.",
        iconSrc: "/icons/service-default.svg",
      },
      {
        _key: "reputation",
        title: "Reputation Signals",
        description: "Improve trust indicators that support local rankings.",
        iconSrc: "/icons/service-default.svg",
      },
      {
        _key: "leads",
        title: "Lead-Oriented",
        description: "Local SEO strategy tied to phone calls and qualified inquiries.",
        iconSrc: "/icons/service-default.svg",
      },
    ],
    relatedCaseStudySlugs: ["my-baskets", "number-artist"],
  },
  {
    serviceType: "keyword-strategy",
    slug: "keyword-strategy",
    heroTitle: "Keyword Strategy Services That Build Durable Demand Capture",
    heroDescription:
      "Prioritize terms that align with your funnel and create a scalable content roadmap.",
    solutionSectionLabel: "/ Service Solutions /",
    solutionSectionHeading: "Keyword Planning",
    serviceCards: [
      {
        _key: "research",
        title: "Opportunity Research",
        subtitle: "Find high-impact terms",
        body: "Identify opportunities across awareness, consideration, and decision stages.",
        iconSrc: "/icons/service-default.svg",
      },
      {
        _key: "clustering",
        title: "Topic Clustering",
        subtitle: "Build topical authority",
        body: "Group keywords into strategic clusters for scale and relevance.",
        iconSrc: "/icons/service-default.svg",
      },
      {
        _key: "mapping",
        title: "Page Mapping",
        subtitle: "Assign intent to pages",
        body: "Align terms with existing and net-new pages to avoid overlap.",
        iconSrc: "/icons/service-default.svg",
      },
    ],
    processSteps: [
      { _key: "discover", title: "Discover", description: "Research market, demand, and competitor coverage." },
      { _key: "structure", title: "Structure", description: "Cluster topics and prioritize by business value." },
      { _key: "activate", title: "Activate", description: "Publish and optimize against mapped opportunities." },
    ],
    whyChooseItems: [
      {
        _key: "commercial",
        title: "Commercial Intent",
        description: "We prioritize opportunities that can produce pipeline impact.",
        iconSrc: "/icons/service-default.svg",
      },
      {
        _key: "clarity",
        title: "Clear Prioritization",
        description: "You get a roadmap teams can execute immediately.",
        iconSrc: "/icons/service-default.svg",
      },
      {
        _key: "momentum",
        title: "Compounding Momentum",
        description: "Cluster strategy increases visibility across full topic sets.",
        iconSrc: "/icons/service-default.svg",
      },
    ],
    relatedCaseStudySlugs: ["number-artist", "designrush"],
  },
  {
    serviceType: "content-creation",
    slug: "content-creation",
    heroTitle: "Content Creation Services That Support Rankings and Revenue",
    heroDescription:
      "Publish expert-led content that maps to intent, earns trust, and converts qualified traffic.",
    solutionSectionLabel: "/ Service Solutions /",
    solutionSectionHeading: "Content Program Delivery",
    serviceCards: [
      {
        _key: "briefing",
        title: "Strategic Briefing",
        subtitle: "Plan before publishing",
        body: "Every piece starts with intent, competition, and conversion goals.",
        iconSrc: "/icons/service-default.svg",
      },
      {
        _key: "production",
        title: "Production Workflow",
        subtitle: "Reliable publishing cadence",
        body: "Writers and editors produce content that meets technical and editorial standards.",
        iconSrc: "/icons/service-default.svg",
      },
      {
        _key: "refresh",
        title: "Content Refreshes",
        subtitle: "Protect existing rankings",
        body: "Update and expand top pages to sustain performance over time.",
        iconSrc: "/icons/service-default.svg",
      },
    ],
    processSteps: [
      { _key: "plan", title: "Plan", description: "Build quarterly plans around opportunity and intent." },
      { _key: "publish", title: "Publish", description: "Ship optimized content with consistent standards." },
      { _key: "improve", title: "Improve", description: "Iterate from performance data and SERP movement." },
    ],
    whyChooseItems: [
      {
        _key: "quality",
        title: "Quality at Scale",
        description: "We balance production speed with editorial quality.",
        iconSrc: "/icons/service-default.svg",
      },
      {
        _key: "seo-aligned",
        title: "SEO-Aligned Workflow",
        description: "Content strategy and optimization are integrated, not siloed.",
        iconSrc: "/icons/service-default.svg",
      },
      {
        _key: "conversion",
        title: "Conversion-Aware",
        description: "Copy supports both ranking growth and action-oriented outcomes.",
        iconSrc: "/icons/service-default.svg",
      },
    ],
    relatedCaseStudySlugs: ["art-by-maudsch", "number-artist"],
  },
  {
    serviceType: "ecommerce-seo",
    slug: "ecommerce-seo",
    heroTitle: "E-commerce SEO Services for Sustainable Store Growth",
    heroDescription:
      "Improve category and product visibility while strengthening technical and content foundations.",
    solutionSectionLabel: "/ Service Solutions /",
    solutionSectionHeading: "Store SEO Growth Plan",
    serviceCards: [
      {
        _key: "category",
        title: "Category Optimization",
        subtitle: "Capture high-intent demand",
        body: "Strengthen category architecture, content, and internal links.",
        iconSrc: "/icons/service-default.svg",
      },
      {
        _key: "product",
        title: "Product Page SEO",
        subtitle: "Improve product discoverability",
        body: "Optimize templates for crawlability, relevance, and conversion support.",
        iconSrc: "/icons/service-default.svg",
      },
      {
        _key: "technical",
        title: "Technical Store Health",
        subtitle: "Resolve structural bottlenecks",
        body: "Address indexation, faceted navigation, and duplicate-page risks.",
        iconSrc: "/icons/service-default.svg",
      },
    ],
    processSteps: [
      { _key: "catalog", title: "Catalog Audit", description: "Evaluate structure, templates, and indexation." },
      { _key: "prioritize", title: "Priority Mapping", description: "Sequence high-impact category and product work." },
      { _key: "scale", title: "Scale", description: "Expand optimized coverage while protecting quality." },
    ],
    whyChooseItems: [
      {
        _key: "platform",
        title: "Platform-Aware",
        description: "Execution adapted for Shopify, WooCommerce, and custom stacks.",
        iconSrc: "/icons/service-default.svg",
      },
      {
        _key: "margin",
        title: "Margin-Aware Prioritization",
        description: "Focus on products and categories with strongest commercial return.",
        iconSrc: "/icons/service-default.svg",
      },
      {
        _key: "longterm",
        title: "Long-Term Stability",
        description: "Build organic channels that reduce paid dependency over time.",
        iconSrc: "/icons/service-default.svg",
      },
    ],
    relatedCaseStudySlugs: ["my-baskets", "number-artist"],
  },
  {
    serviceType: "link-building",
    slug: "link-building",
    heroTitle: "Link Building Services That Strengthen Authority Safely",
    heroDescription:
      "Acquire relevant, high-quality links through outreach strategies built for long-term ranking growth.",
    solutionSectionLabel: "/ Service Solutions /",
    solutionSectionHeading: "Authority Building",
    serviceCards: [
      {
        _key: "prospecting",
        title: "Prospecting",
        subtitle: "Find relevant opportunities",
        body: "Identify domains that align with topical authority and trust goals.",
        iconSrc: "/icons/service-default.svg",
      },
      {
        _key: "outreach",
        title: "Editorial Outreach",
        subtitle: "Earn contextual placements",
        body: "Secure links through high-quality, relationship-driven outreach.",
        iconSrc: "/icons/service-default.svg",
      },
      {
        _key: "quality-control",
        title: "Quality Control",
        subtitle: "Protect your profile",
        body: "Each placement is reviewed for relevance, quality, and risk.",
        iconSrc: "/icons/service-default.svg",
      },
    ],
    processSteps: [
      { _key: "targets", title: "Targeting", description: "Define authority and relevance targets." },
      { _key: "placements", title: "Placement", description: "Execute outreach and secure contextual mentions." },
      { _key: "monitor", title: "Monitor", description: "Track profile health and authority impact." },
    ],
    whyChooseItems: [
      {
        _key: "quality",
        title: "Quality-First Policy",
        description: "No spam tactics, no risky shortcuts.",
        iconSrc: "/icons/service-default.svg",
      },
      {
        _key: "relevance",
        title: "Topical Relevance",
        description: "Placements aligned to your category and business context.",
        iconSrc: "/icons/service-default.svg",
      },
      {
        _key: "measurable",
        title: "Measurable Impact",
        description: "Link acquisition tied to rankings and business metrics.",
        iconSrc: "/icons/service-default.svg",
      },
    ],
    relatedCaseStudySlugs: ["affinda", "designrush"],
  },
];

function buildServicePageDoc(servicePage) {
  const faqRefs = FAQ_ITEMS.filter(
    (faq) => faq.servicePage === servicePage.slug,
  )
    .slice(0, 6)
    .map((faq) => ({
      _type: "reference",
      _ref: `faq-${servicePage.slug}-${String(faq.order).padStart(2, "0")}`,
      _weak: true,
    }));

  const relatedCaseStudies = (servicePage.relatedCaseStudySlugs ?? []).map((slug) => ({
    _type: "reference",
    _ref: `caseStudy-${slug}`,
    _weak: true,
  }));

  return {
    _id: `servicePage-${servicePage.slug}`,
    _type: "servicePage",
    serviceType: servicePage.serviceType,
    slug: { _type: "slug", current: servicePage.slug },
    heroTitle: servicePage.heroTitle,
    heroDescription: servicePage.heroDescription,
    heroCtaLabel: "Get Started Today",
    heroCtaUrl: "/contact",
    solutionSectionLabel: servicePage.solutionSectionLabel,
    solutionSectionHeading: servicePage.solutionSectionHeading,
    serviceCards: servicePage.serviceCards,
    processSteps: servicePage.processSteps,
    whyChooseItems: servicePage.whyChooseItems,
    faqItems: faqRefs,
    relatedCaseStudies,
    seo: {
      _type: "seo",
      metaTitle: servicePage.heroTitle,
      metaDescription: servicePage.heroDescription,
    },
  };
}

// ── 7. Partnership, Contact, Legal Pages ─────────────────────────────────
const PARTNERSHIP_PAGE = {
  _id: "partnershipPage",
  _type: "partnershipPage",
  title: "Partnership Program",
  intro:
    "We partner with agencies, consultants, and in-house teams to deliver measurable SEO outcomes at scale.",
  heroCtaLabel: "Become a Partner",
  heroCtaUrl: "/contact",
  body: [
    {
      _type: "block",
      style: "normal",
      children: [
        {
          _type: "span",
          text: "Our partnership model is designed for long-term collaboration, transparent communication, and execution reliability.",
        },
      ],
    },
    {
      _type: "block",
      style: "normal",
      children: [
        {
          _type: "span",
          text: "If you need a dependable SEO delivery partner for your clients or internal growth roadmap, we can align on goals and implementation workflows quickly.",
        },
      ],
    },
  ],
  seo: {
    _type: "seo",
    metaTitle: "Partnership Program | Heroic Rankings",
    metaDescription:
      "Partner with Heroic Rankings to deliver technical SEO, content, and authority growth with transparent execution.",
  },
};

const CONTACT_PAGE = {
  _id: "contactPage",
  _type: "contactPage",
  title: "Connect with the Heroes of SEO",
  intro:
    "Whether you have questions about your strategy, a project that feels too big, or need a clear starting point, our team is ready to help.",
  email: "sales@heroicrankings.com",
  seo: {
    _type: "seo",
    metaTitle: "Contact Heroic Rankings",
    metaDescription:
      "Talk to Heroic Rankings about SEO strategy, technical optimization, and sustainable organic growth.",
  },
};

const PRIVACY_POLICY_PAGE = {
  _id: "legalPage-privacy-policy",
  _type: "legalPage",
  title: "Privacy Policy",
  slug: { _type: "slug", current: "privacy-policy" },
  intro:
    "We respect your privacy and are committed to protecting your personal data. This page explains what we collect and how it is used.",
  body: [
    {
      _type: "block",
      style: "h2",
      children: [{ _type: "span", text: "Information We Collect" }],
    },
    {
      _type: "block",
      style: "normal",
      children: [
        {
          _type: "span",
          text: "We collect contact details you provide through forms or direct communication, plus website usage data used to improve site performance and service quality.",
        },
      ],
    },
    {
      _type: "block",
      style: "h2",
      children: [{ _type: "span", text: "How We Use Information" }],
    },
    {
      _type: "block",
      style: "normal",
      children: [
        {
          _type: "span",
          text: "Data is used to respond to inquiries, deliver requested services, and maintain secure and reliable operations. We do not sell personal information.",
        },
      ],
    },
    {
      _type: "block",
      style: "h2",
      children: [{ _type: "span", text: "Your Rights and Choices" }],
    },
    {
      _type: "block",
      style: "normal",
      children: [
        {
          _type: "span",
          text: "You can request updates, corrections, or deletion of your personal data by contacting us at info@heroicrankings.com.",
        },
      ],
    },
  ],
  contactEmail: "info@heroicrankings.com",
  seo: {
    _type: "seo",
    metaTitle: "Privacy Policy | Heroic Rankings",
    metaDescription:
      "Learn how Heroic Rankings collects, uses, and protects personal information.",
  },
};

// ── Main ────────────────────────────────────────────────────────────────
async function main() {
  const counts = {
    siteSettings: 1,
    teamMembers: TEAM_MEMBERS.length,
    testimonials: TESTIMONIALS.length,
    caseStudies: CASE_STUDIES.length,
    faqItems: FAQ_ITEMS.length,
    servicePages: SERVICE_PAGES.length,
    partnershipPages: 1,
    contactPages: 1,
    legalPages: 1,
  };

  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  console.log(`\n${"=".repeat(60)}`);
  console.log(`  Heroic Rankings — Sanity Content Seed`);
  console.log(`  Project: ${PROJECT_ID} / Dataset: ${DATASET}`);
  if (DRY_RUN) console.log(`  MODE: DRY RUN (no documents will be created)`);
  console.log(`${"=".repeat(60)}\n`);
  console.log(`  Documents to seed: ${total}`);
  console.log(`    Site Settings:   ${counts.siteSettings}`);
  console.log(`    Team Members:    ${counts.teamMembers}`);
  console.log(`    Testimonials:    ${counts.testimonials}`);
  console.log(`    Case Studies:    ${counts.caseStudies}`);
  console.log(`    FAQ Items:       ${counts.faqItems}`);
  console.log(`    Service Pages:   ${counts.servicePages}`);
  console.log(`    Partnership:     ${counts.partnershipPages}`);
  console.log(`    Contact Pages:   ${counts.contactPages}`);
  console.log(`    Legal Pages:     ${counts.legalPages}`);
  console.log();

  let seeded = 0;
  let failed = 0;

  // --- Site Settings ---
  console.log("[1/8] Site Settings");
  try {
    await seed(siteSettings);
    seeded++;
  } catch {
    failed++;
  }
  console.log();

  // --- Team Members ---
  console.log("[2/8] Team Members");
  for (const m of TEAM_MEMBERS) {
    try {
      await seed(buildTeamMemberDoc(m));
      seeded++;
    } catch {
      failed++;
    }
  }
  console.log();

  // --- Testimonials ---
  console.log("[3/8] Testimonials");
  for (const t of TESTIMONIALS) {
    try {
      await seed(buildTestimonialDoc(t));
      seeded++;
    } catch {
      failed++;
    }
  }
  console.log();

  // --- Case Studies ---
  console.log("[4/8] Case Studies");
  for (const cs of CASE_STUDIES) {
    try {
      await seed(buildCaseStudyDoc(cs));
      seeded++;
    } catch {
      failed++;
    }
  }
  console.log();

  // --- FAQ Items ---
  console.log("[5/8] FAQ Items");
  for (const f of FAQ_ITEMS) {
    try {
      await seed(buildFaqDoc(f));
      seeded++;
    } catch {
      failed++;
    }
  }
  console.log();

  // --- Service Pages ---
  console.log("[6/8] Service Pages");
  for (const page of SERVICE_PAGES) {
    try {
      await seed(buildServicePageDoc(page));
      seeded++;
    } catch {
      failed++;
    }
  }
  console.log();

  // --- Partnership Page ---
  console.log("[7/8] Partnership Page");
  try {
    await seed(PARTNERSHIP_PAGE);
    seeded++;
  } catch {
    failed++;
  }
  console.log();

  // --- Contact + Legal Pages ---
  console.log("[8/8] Contact + Legal Pages");
  try {
    await seed(CONTACT_PAGE);
    seeded++;
  } catch {
    failed++;
  }
  try {
    await seed(PRIVACY_POLICY_PAGE);
    seeded++;
  } catch {
    failed++;
  }
  console.log();

  // --- Summary ---
  console.log(`${"=".repeat(60)}`);
  if (DRY_RUN) {
    console.log(`  DRY RUN complete. ${total} documents would be created.`);
  } else if (failed === 0) {
    console.log(`  Done! ${seeded}/${total} documents seeded successfully.`);
  } else {
    console.log(`  Finished with errors: ${seeded} succeeded, ${failed} failed.`);
  }
  console.log(`${"=".repeat(60)}\n`);

  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
