import { cn } from "@/lib/cn";

/**
 * Build the 5 deep-link AI summary URLs for an article. Each pill encodes
 * `Please summarize this article: {URL}` as the engine's query parameter.
 *
 * URL patterns are best-effort 2026 — verify before launch (smoke-test
 * deferred to PR 5).
 */
export function buildAiSummaryLinks(articleUrl: string): Array<{ label: string; url: string }> {
  const prompt = `Please summarize this article: ${articleUrl}`;
  const encodedPrompt = encodeURIComponent(prompt);
  return [
    { label: "ChatGPT", url: `https://chat.openai.com/?q=${encodedPrompt}` },
    { label: "Perplexity", url: `https://www.perplexity.ai/?q=${encodedPrompt}` },
    { label: "Claude", url: `https://claude.ai/new?q=${encodedPrompt}` },
    { label: "Google AI Mode", url: `https://www.google.com/search?udm=50&q=${encodedPrompt}` },
    { label: "Grok", url: `https://grok.com/?q=${encodedPrompt}` },
  ];
}

interface AISummaryPillsProps {
  articleUrl: string;
  className?: string;
  pillClassName?: string;
}

/**
 * Five outlined pills that deep-link to ChatGPT, Perplexity, Claude,
 * Google AI Mode, and Grok with a "summarize this article" prompt.
 */
export function AISummaryPills({ articleUrl, className, pillClassName }: AISummaryPillsProps) {
  const links = buildAiSummaryLinks(articleUrl);

  return (
    <div className={cn("flex flex-wrap items-center gap-[10px]", className)}>
      {links.map((link) => (
        <a
          aria-label={`Summarize this article with ${link.label}`}
          className={cn(
            "motion-interactive motion-interactive-press inline-flex items-center justify-center rounded-[20px] border border-[var(--color-hr-accent)] px-[14px] py-[6px] text-[14px] font-normal leading-[20px] tracking-[-0.28px] text-[var(--color-hr-dark)] transition-colors hover:bg-[color-mix(in_srgb,var(--color-hr-accent)_8%,transparent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-hr-accent)] focus-visible:ring-offset-2 dark:text-[var(--color-text-inverse)]",
            pillClassName,
          )}
          href={link.url}
          key={link.label}
          rel="noopener noreferrer"
          target="_blank"
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}
