"use client";

interface SuggestedChipsProps {
  suggestions: string[];
  onPick: (question: string) => void;
}

export function SuggestedChips({ suggestions, onPick }: SuggestedChipsProps) {
  if (suggestions.length === 0) return null;

  return (
    <div className="flex flex-col gap-[8px]">
      {suggestions.map((q) => (
        <button
          key={q}
          className="motion-interactive motion-interactive-press group flex items-start gap-[10px] rounded-[14px] border border-white/8 bg-white/[0.04] px-[14px] py-[8px] text-left text-[14px] leading-[20px] text-[var(--color-hr-pure-white)]/90 backdrop-blur-sm transition-colors hover:border-[var(--color-hr-accent)]/40 hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-hr-accent)]"
          onClick={() => onPick(q)}
          type="button"
        >
          <svg
            aria-hidden="true"
            className="mt-[3px] shrink-0 text-[var(--color-hr-accent)] opacity-70 transition-opacity group-hover:opacity-100"
            fill="none"
            height="12"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 12 12"
            width="12"
          >
            <path d="M6 1l1.2 3.6L11 5.5 7.2 6.4 6 11l-1.2-4.6L1 5.5l3.8-.9L6 1z" />
          </svg>
          <span className="flex-1">{q}</span>
        </button>
      ))}
    </div>
  );
}
