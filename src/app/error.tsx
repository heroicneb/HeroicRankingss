"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      aria-live="assertive"
      className="mx-auto flex min-h-[60vh] w-full max-w-[1440px] items-center px-[10px] py-16"
      role="alert"
    >
      <div className="surface-radial mx-auto w-full max-w-[760px] rounded-[var(--radius-card)] border border-[var(--color-hr-light-grey)] dark:border-[var(--color-border-inverse-10)] px-8 py-12 text-center text-[var(--color-hr-pure-white)]">
        <p className="type-section-label">
          /{"  "}Something Went Wrong{"  "}/
        </p>
        <h2 className="type-h2 mt-5 text-[var(--color-hr-pure-white)]">
          We hit an unexpected error.
        </h2>
        <p className="type-paragraph mx-auto mt-4 max-w-[560px] text-[var(--color-hr-pure-white)]">
          Please retry the request. If this continues, refresh the page and try
          again.
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
          Try again
        </Button>
      </div>
    </div>
  );
}
