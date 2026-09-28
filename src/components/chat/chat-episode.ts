/**
 * What an "Ask AI" trigger passes to the chat drawer so it opens scoped to
 * one episode. Serialisable (travels in a CustomEvent detail).
 */
export interface ChatEpisodeContext {
  /** Episode number; the chat route resolves it to that transcript. */
  episodeId: string;
  episodeTitle: string;
  guestName?: string;
  /** Suggested questions for that guest; built from the episode's topic pills. */
  suggestions: string[];
}

/** Guest-specific starter questions: topic pills first, then two generic prompts. */
export function episodeSuggestions(guestName: string | null | undefined, topics: string[]): string[] {
  const who = guestName?.trim() || "the guest";
  const first = who.split(" ")[0] ?? who;
  const fromTopics = topics
    .filter((t) => t?.trim())
    .slice(0, 3)
    // WHY: keep the pill's own casing — lowercasing turns "SEO" and "RankBrain" into nonsense.
    .map((topic) => `What does ${first} say about ${topic.trim()}?`);
  return [...fromTopics, `Summarize ${first}'s key takeaways`, `Quote ${first}'s most actionable advice`].slice(0, 5);
}
