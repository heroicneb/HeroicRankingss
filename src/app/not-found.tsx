import { AppLink } from "@/components/ui/app-link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-[1440px] items-center px-[10px] py-16">
      <div className="mx-auto w-full max-w-[760px] rounded-[var(--radius-card)] border border-[var(--color-hr-light-grey)] dark:border-[var(--color-border-inverse-10)] bg-[var(--color-hr-pure-white)] dark:bg-[var(--color-bg-dark)] px-8 py-12 text-center">
        <p className="type-section-label text-[var(--color-hr-grey)] dark:text-[var(--color-text-inverse-50)]">/ 404 /</p>
        <h1 className="type-h2 mt-5 text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">Page Not Found</h1>
        <p className="type-paragraph mx-auto mt-4 max-w-[560px] text-[var(--color-hr-grey)] dark:text-[var(--color-text-inverse-50)]">
          The page you requested could not be found. Return to the homepage to continue browsing.
        </p>
        <AppLink
          className="type-cta mt-8 inline-flex h-[45px] items-center justify-center rounded-[var(--radius-button)] border border-[var(--color-hr-accent)] px-5 text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] hover:bg-[var(--color-hr-off-white)] dark:hover:bg-[var(--color-surface-inverse-10)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-hr-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-hr-pure-white)] dark:focus-visible:ring-offset-[var(--color-bg-dark)]"
          href="/"
        >
          Go home
        </AppLink>
      </div>
    </div>
  );
}
