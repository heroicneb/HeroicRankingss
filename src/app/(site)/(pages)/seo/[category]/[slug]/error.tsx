"use client";

import { Button } from "@/components/ui/button";

// WHY: Scope failure handling to the article segment so users can retry without full-page disruption.
export default function PostError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto w-full max-w-[1440px] px-5 pb-[130px] pt-[109px] md:px-10 xl:px-[80px]">
      <div
        aria-live="assertive"
        className="surface-radial mx-auto w-full max-w-[760px] rounded-[var(--radius-card)] border border-[var(--color-hr-light-grey)] px-8 py-12 text-center text-[var(--color-hr-pure-white)] dark:border-[var(--color-border-inverse-10)]"
        role="alert"
      >
        <p className="type-section-label">
          /{"  "}Article Unavailable{"  "}/
        </p>
        <h2 className="type-h2 mt-5 text-[var(--color-hr-pure-white)]">
          We could not load this insight.
        </h2>
        <p className="type-paragraph mx-auto mt-4 max-w-[560px] text-[var(--color-hr-pure-white)]">
          Please try again in a moment.
        </p>
        {error.digest ? (
          <p className="type-footer mt-4 text-[color-mix(in_srgb,var(--color-hr-pure-white)_82%,transparent)]">
            Reference: {error.digest}
          </p>
        ) : null}
        <Button
          className="mt-8 text-[var(--color-hr-pure-white)] hover:bg-[color-mix(in_srgb,var(--color-hr-pure-white)_8%,transparent)] focus-visible:ring-offset-[var(--color-hr-dark)] [&_svg]:text-[var(--color-hr-pure-white)]"
          onClick={() => reset()}
          variant="outline"
        >
          Retry article
        </Button>
      </div>
    </div>
  );
}
