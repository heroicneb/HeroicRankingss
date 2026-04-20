export interface PodcastEpisode {
  slug: string;
  title: string;
  contentH2: string;
  guest: string;
  guestTitle: string;
  company: string;
  description: string;
  episodeNumber: number;
  duration: string;
  topics: string[];
  keyTakeaways: string[];
  transcript: string;
  publishedAt: string;
}

export const PODCAST_EPISODES: readonly PodcastEpisode[] = [
  {
    slug: "marketing-that-actually-works",
    title: "Marketing That Actually Works",
    contentH2: "25 Years of Marketing Lessons, Compressed Into One Conversation",
    guest: "Trevor Longino",
    guestTitle: "Founder",
    company: "CrowdTamers",
    episodeNumber: 9,
    duration: "1h 44min",
    description:
      "Trevor Longino has spent 25 years running marketing for companies ranging from early-stage startups to publicly traded firms. In this episode, he breaks down why most B2B marketing fails, how to build a growth engine from scratch, and the counterintuitive frameworks that consistently outperform conventional wisdom.",
    topics: [
      "Ask Podcast AI",
      "Minimum Viable Sprints",
      "Test-Based Marketing",
      "B2B Positioning",
      "Go-To-Market Strategy",
      "Demand Generation",
      "Content-Led Growth",
    ],
    keyTakeaways: [
      "Start with the smallest possible experiment before committing budget to any channel.",
      "Most B2B companies confuse brand awareness with demand generation — they require entirely different strategies.",
      "Positioning is not a tagline. It is a decision framework that informs every piece of content you create.",
      "The best marketing teams are structured around hypotheses, not campaigns.",
      "Distribution matters more than production quality when you are starting out.",
    ],
    transcript:
      "Trevor Longino: The single biggest mistake I see early-stage companies make is building the marketing team before they have figured out what story they are telling. You end up with a team of people producing content that does not connect to a clear thesis about why the company exists and who it is for.\n\nHost: Can you break down what a minimum viable sprint looks like in practice?\n\nTrevor Longino: Sure. A sprint is a two-week window with a single hypothesis at its center. You define what success looks like before you start — a specific number, not a vague goal. You run the experiment, measure the result, and make a go or no-go decision. No extensions, no partial credit. That discipline is what separates teams that learn quickly from teams that spin their wheels.\n\nHost: What about companies that feel like they have tried everything and nothing is working?\n\nTrevor Longino: In my experience, that usually means they have tried many tactics without ever committing long enough to understand what the data is telling them. Marketing is a system, not a collection of individual bets. When you treat each channel as isolated, you lose the compounding effect that makes the whole engine work.",
    publishedAt: "2025-10-14",
  },
  {
    slug: "organic-growth",
    title: "Organic Growth",
    contentH2: "Building Sustainable Traffic Without Paid Acquisition",
    guest: "Jason Rivera",
    guestTitle: "Head of Growth",
    company: "Vantage Labs",
    episodeNumber: 14,
    duration: "50min",
    description:
      "Jason Rivera has led organic growth programs for SaaS companies at every stage. In this conversation, he explains how to build content systems that compound over time, when to invest in organic versus paid, and the metrics that actually matter for long-term growth.",
    topics: [
      "Organic Traffic",
      "Content Strategy",
      "Compounding Growth",
      "SaaS Marketing",
      "SEO Fundamentals",
      "Audience Building",
    ],
    keyTakeaways: [
      "Organic growth takes 6 to 12 months to show results — companies that quit before then never see the payoff.",
      "The best organic content answers questions your buyers are already asking in sales calls.",
      "A small number of high-intent keywords will drive more pipeline than a large volume of informational keywords.",
      "Internal linking is the most underused lever in most content programs.",
      "Track qualified traffic, not total traffic. Vanity metrics slow down good decisions.",
    ],
    transcript:
      "Jason Rivera: People underestimate how long organic takes because they compare it to paid channels where feedback is near-instant. Organic is a different category entirely. You are making a bet that compounds over years, not weeks.\n\nHost: How do you convince leadership to stay patient?\n\nJason Rivera: You shift the conversation from traffic to pipeline contribution. When you can show that a piece of content published six months ago is influencing deals in the CRM, the patience question answers itself. The problem is most teams are not instrumenting content that way.\n\nHost: What is the first thing you fix when you inherit a struggling content program?\n\nJason Rivera: Internal linking, almost always. I have never walked into a program where the internal link structure was well thought out. It is the fastest way to improve crawlability and distribute authority to the pages that matter most.",
    publishedAt: "2025-11-04",
  },
  {
    slug: "seo-aeo-and-ai-growth",
    title: "SEO, AEO & AI Growth",
    contentH2: "How Search Is Changing and What You Need to Do Right Now",
    guest: "Sara Miller",
    guestTitle: "VP of Search",
    company: "Meridian Digital",
    episodeNumber: 14,
    duration: "59min",
    description:
      "Sara Miller has been tracking shifts in search behavior for over a decade. This episode covers the rise of answer engine optimization, how AI-generated search results are reshaping organic traffic, and the practical steps marketers can take to stay visible in an increasingly fragmented search landscape.",
    topics: [
      "Answer Engine Optimization",
      "AI Search",
      "SGE",
      "Featured Snippets",
      "Zero-Click Search",
      "Search Intent",
      "Entity SEO",
    ],
    keyTakeaways: [
      "AEO is not a replacement for SEO — it is an extension of the same core principles applied to a new surface.",
      "Structured data is more important now than it has ever been because AI models use it to build their knowledge graphs.",
      "Zero-click searches do not mean zero value — brand recognition from appearing in AI answers drives direct traffic.",
      "The sites winning in AI-generated results tend to have stronger topical authority, not just individual high-ranking pages.",
      "Monitor your brand mentions in AI tools regularly — errors propagate faster than corrections.",
    ],
    transcript:
      "Sara Miller: The framing I keep coming back to is that Google and these AI tools are all trying to do the same thing — answer the question behind the query. The tactics differ but the underlying objective has not changed.\n\nHost: Are you seeing traffic drops for sites that relied heavily on informational content?\n\nSara Miller: Yes, particularly in the how-to and definition categories. That traffic is being absorbed by AI-generated answers. What is not being absorbed is high-specificity, original research, and content that requires trust — things like detailed case studies, proprietary data, and expert opinion.\n\nHost: How should a mid-size company prioritize between traditional SEO and AEO right now?\n\nSara Miller: Do not choose. The technical foundations are the same. Good markup, fast pages, strong topical coverage — all of that benefits both. Where you add AEO-specific work is in FAQ schema, concise answer blocks, and citation-worthy data that AI systems want to reference.",
    publishedAt: "2025-11-18",
  },
  {
    slug: "seo-wind",
    title: "SEO Wind",
    contentH2: "Riding the Next Wave of Search Before It Peaks",
    guest: "Tom Winter",
    guestTitle: "Co-Founder",
    company: "SEOWind",
    episodeNumber: 14,
    duration: "57min",
    description:
      "Tom Winter built SEOWind to automate one of the most time-consuming parts of content marketing: research. In this episode, he shares how AI is changing the content production workflow, where humans still have to lead, and how teams can scale output without sacrificing quality or search performance.",
    topics: [
      "AI Content",
      "Content Automation",
      "Research Workflows",
      "Scale",
      "Quality Control",
      "Topical Maps",
      "Editorial Strategy",
    ],
    keyTakeaways: [
      "AI can handle the scaffolding — structure, outlines, first drafts — but the unique insight still has to come from humans.",
      "Teams that use AI for research save 60 to 70 percent of their time without sacrificing analytical depth.",
      "Topical maps built before production begin prevent keyword cannibalization and coverage gaps.",
      "Quality control workflows matter more as output volume increases — fast and wrong is worse than slow and right.",
      "The best content programs pair AI efficiency with a strong editorial voice that readers recognize and return to.",
    ],
    transcript:
      "Tom Winter: When we built SEOWind, the hypothesis was simple: research is the bottleneck, not writing. Writers are blocked waiting for briefs, and briefs are blocked waiting for keyword and SERP analysis. If you solve the research layer, you free up the rest of the workflow.\n\nHost: Where does AI fall short in content production?\n\nTom Winter: Novelty and credibility. AI synthesizes what already exists. If you want to produce something genuinely new — a study, a contrarian take, a primary source insight — that requires a human with domain expertise. The AI is a great research assistant but not an independent thinker.\n\nHost: How do you think about quality control at scale?\n\nTom Winter: We have an editorial layer that reviews for accuracy, brand voice, and fact-checking before anything goes live. The AI handles speed. Humans handle trust. That division of labor has to be explicit or the quality degrades over time without anyone noticing.",
    publishedAt: "2025-11-25",
  },
];

export function getEpisodeBySlug(slug: string): PodcastEpisode | undefined {
  return PODCAST_EPISODES.find((episode) => episode.slug === slug);
}

export function getEpisodeSlugs(): string[] {
  return PODCAST_EPISODES.map((episode) => episode.slug);
}

export function getRelatedEpisodes(currentSlug: string, count = 3): PodcastEpisode[] {
  return PODCAST_EPISODES.filter((episode) => episode.slug !== currentSlug).slice(0, count);
}
