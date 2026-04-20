export default function Loading() {
  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-[1440px] items-center px-[10px] py-16">
      <div className="mx-auto w-full max-w-[760px] rounded-[var(--radius-card)] border border-[var(--color-hr-light-grey)] dark:border-[var(--color-border-inverse-10)] bg-[var(--color-hr-pure-white)] dark:bg-[var(--color-bg-dark)] px-8 py-12 text-center">
        <p className="type-section-label text-[var(--color-hr-grey)] dark:text-[var(--color-text-inverse-50)]">
          /{"  "}Loading{"  "}/
        </p>
        <div
          aria-label="Loading content"
          className="mx-auto mt-6 h-10 w-10 animate-spin rounded-full border-2 border-[var(--color-hr-light-grey)] dark:border-[var(--color-border-inverse-10)] border-t-[var(--color-hr-accent)]"
          role="status"
        />
        <span className="sr-only" role="status">
          Loading content
        </span>
        <p className="type-paragraph mt-6 text-[var(--color-hr-grey)] dark:text-[var(--color-text-inverse-50)]">
          Preparing your content...
        </p>
      </div>
    </div>
  );
}
