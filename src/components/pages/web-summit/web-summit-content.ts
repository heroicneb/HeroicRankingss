/*
 * "/web-summit-2026": the attendee perk page. Code-defined content (one-off
 * event page, not in the CMS). The page is noindex: see the route's metadata
 * and the X-Robots-Tag rule in next.config.ts.
 */
import type { HeadingSegment } from "@/components/pages/home/home-content";

export const WEB_SUMMIT_PATH = "/web-summit-2026/";
export const WEB_SUMMIT_DELIVERY = "within 7 days";
export const WEB_SUMMIT_BOOTH = "0202-21";

export const WEB_SUMMIT_SEO = {
  title: "Web Summit 2026: Claim Your Heroic Five | Heroic Rankings",
  description: "Exclusive for Web Summit 2026 attendees: a free, personalised mini-audit with the 5 highest-impact fixes for your site, in Google and in AI answers.",
};

export const WEB_SUMMIT_CONTENT = {
  hero: {
    label: "/  Web Summit 2026 · Exclusive for attendees  /",
    heading: [
      { text: "Find out the 5 things holding your website back, in " },
      { text: "Google", highlight: true },
      { text: " and in " },
      { text: "AI.", highlight: true },
    ] satisfies HeadingSegment[],
    intro:
      "Talk to the Heroic Rankings team at Web Summit and claim a free, personalised mini-audit: the 5 highest-impact fixes on your site, each one specific to you and ready to action. Not a template. Not a generic checklist. Your site, your five.",
    ctaLabel: "Claim your Heroic Five",
    note: `Free for Web Summit attendees who stop by booth ${WEB_SUMMIT_BOOTH}. Delivered ${WEB_SUMMIT_DELIVERY}.`,
    image: { src: "/web-summit/hero-statue.webp", alt: "Classical marble statue holding a Web Summit medallion", width: 1596, height: 839 },
  },
  whatYouGet: {
    label: "/  What You Get  /",
    heading: [{ text: "Five fixes. " }, { text: "Your site, not a template.", highlight: true }] satisfies HeadingSegment[],
    intro:
      "Most “free SEO audits” are an automated PDF that scores you red-amber-green and tells you nothing you can use. This isn’t that.",
    body: "A real analyst looks at your site and hands you the 5 most important things to fix right now: the ones that will move the needle on how you rank in search and how often you show up when people ask AI tools about your category. For each one you get:",
    items: [
      { title: "What’s wrong", body: "In plain language, specific to your site." },
      { title: "Why it matters", body: "The visibility or revenue you’re leaving on the table." },
      { title: "How to fix it", body: "A clear, actionable step your team can start on this week." },
    ],
    closing:
      "It’s the difference between “your Core Web Vitals need work” and “here’s the exact thing slowing your homepage, and here’s what to change.”",
  },
  whyBoth: {
    label: "/  Search and AI  /",
    heading: [{ text: "Why SEO " }, { text: "isn’t enough", highlight: true }, { text: " anymore" }] satisfies HeadingSegment[],
    intro:
      "Your customers aren’t only Googling you. They’re asking ChatGPT, Perplexity, Gemini and Google’s AI Overviews, and those tools decide what to recommend based on signals most websites get completely wrong. The Heroic Five looks at both:",
    columns: [
      { title: "Classic search visibility", body: "Can Google find, crawl, understand and rank you?" },
      {
        title: "AI visibility",
        body: "When someone asks an AI assistant about what you do, do you show up, get cited, and get recommended? Or does your competitor?",
      },
    ],
    closing: "This is what we do every day. At Web Summit, you get a free taste of it.",
  },
  howToClaim: {
    label: "/  How to Claim It  /",
    heading: [{ text: "Three steps, " }, { text: "thirty seconds", highlight: true }] satisfies HeadingSegment[],
    steps: [
      { title: "Come talk to us.", body: `Find the Heroic Rankings team at booth ${WEB_SUMMIT_BOOTH}, next to Stage 8, or scan the QR code on our badge. Tell us what you’re working on.` },
      { title: "Drop your details below.", body: "We need your website and an email to send the audit to. Takes 30 seconds." },
      { title: "Get your Heroic Five.", body: `Within 7 days we’ll send your five personalised, prioritised fixes, ready to action.` },
    ],
  },
  form: {
    heading: "Claim your Heroic Five",
    body: "Drop your details and we’ll take it from there. A real person reviews your site and sends your five fixes within 7 days.",
    ctaLabel: "Send me my Heroic Five",
    successMessage: "Got it! Your Heroic Five is on its way. Expect it within 7 days, and check your inbox for a confirmation.",
    checkboxLabel: "I spoke with the Heroic Rankings team at Web Summit",
  },
  about: {
    label: "/  About Heroic Rankings  /",
    heading: [{ text: "Found in search. " }, { text: "Cited by AI.", highlight: true }] satisfies HeadingSegment[],
    body: "We’re an SEO and AI visibility agency that gets businesses found, in search engines and in the AI tools your customers increasingly ask first.",
    proof:
      "Over 200 successful campaigns, a 100% client retention rate over the past 12 months, and results for brands like Affinda, Cirrus Insight and SyncSpider.",
    ctaLabel: "See the case studies",
    ctaUrl: "/case-study/",
  },
  faq: [
    { question: "Is this really free?", answer: "Yes. It’s our gift to people we meet at Web Summit. No card, no catch." },
    {
      question: "Is this the full audit you normally charge for?",
      answer:
        "No, and we’re upfront about that. A full Heroic Rankings audit is a deep, days-long analysis across dozens of factors, and it’s a paid engagement. The Heroic Five is a genuine, hand-picked sample of that work: the top five issues we’d tackle first. Plenty to act on, and a clear picture of what the full version uncovers.",
    },
    { question: "How is it personalised if it’s free?", answer: "A real person reviews your actual site. The five fixes are specific to you, not pulled from a list." },
    { question: "When will I get it?", answer: "Within 7 days of claiming, during and just after Web Summit week." },
    { question: "What if I want the full audit?", answer: `Tell us at booth ${WEB_SUMMIT_BOOTH}, or reply to your Heroic Five email. We’ll sort you out.` },
  ],
} as const;
