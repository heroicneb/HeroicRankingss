export default function Loading() {
  return (
    <div className="animate-pulse">
      {/* Hero */}
      <div className="mx-auto max-w-[1440px] px-5 md:px-10 xl:px-[80px] py-20">
        <div className="mx-auto max-w-[760px] flex flex-col items-center gap-5">
          <div className="h-4 w-24 rounded-full bg-[var(--color-hr-off-white)] dark:bg-[var(--color-surface-inverse-10)]" />
          <div className="h-12 w-full rounded-lg bg-[var(--color-hr-off-white)] dark:bg-[var(--color-surface-inverse-10)]" />
          <div className="h-12 w-4/5 rounded-lg bg-[var(--color-hr-off-white)] dark:bg-[var(--color-surface-inverse-10)]" />
          <div className="h-5 w-full rounded bg-[var(--color-hr-off-white)] dark:bg-[var(--color-surface-inverse-10)]" />
          <div className="h-5 w-11/12 rounded bg-[var(--color-hr-off-white)] dark:bg-[var(--color-surface-inverse-10)]" />
        </div>
      </div>
      {/* Team grid */}
      <div className="mx-auto max-w-[1440px] px-5 md:px-10 xl:px-[80px] pb-20">
        <div className="mb-10 h-8 w-48 rounded-lg bg-[var(--color-hr-off-white)] dark:bg-[var(--color-surface-inverse-10)]" />
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-3 rounded-[var(--radius-card)] bg-[var(--color-hr-off-white)] dark:bg-[var(--color-surface-inverse-10)] p-6"
            >
              <div className="h-20 w-20 rounded-full bg-[var(--color-hr-off-white)] dark:bg-[var(--color-surface-inverse-10)]" />
              <div className="h-4 w-3/4 rounded bg-[var(--color-hr-off-white)] dark:bg-[var(--color-surface-inverse-10)]" />
              <div className="h-3 w-1/2 rounded bg-[var(--color-hr-off-white)] dark:bg-[var(--color-surface-inverse-10)]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
