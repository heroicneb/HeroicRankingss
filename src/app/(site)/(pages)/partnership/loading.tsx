export default function Loading() {
  return (
    <div className="animate-pulse">
      {/* Hero */}
      <div className="mx-auto max-w-[1440px] px-5 md:px-10 xl:px-[80px] py-20">
        <div className="mx-auto max-w-[760px] flex flex-col items-center gap-5">
          <div className="h-4 w-28 rounded-full bg-[var(--color-hr-off-white)] dark:bg-[var(--color-surface-inverse-10)]" />
          <div className="h-12 w-full rounded-lg bg-[var(--color-hr-off-white)] dark:bg-[var(--color-surface-inverse-10)]" />
          <div className="h-12 w-3/4 rounded-lg bg-[var(--color-hr-off-white)] dark:bg-[var(--color-surface-inverse-10)]" />
          <div className="h-5 w-full rounded bg-[var(--color-hr-off-white)] dark:bg-[var(--color-surface-inverse-10)]" />
          <div className="h-5 w-5/6 rounded bg-[var(--color-hr-off-white)] dark:bg-[var(--color-surface-inverse-10)]" />
          <div className="mt-2 h-12 w-40 rounded-[var(--radius-card)] bg-[var(--color-hr-off-white)] dark:bg-[var(--color-surface-inverse-10)]" />
        </div>
      </div>
      {/* Logo grid */}
      <div className="mx-auto max-w-[1440px] px-5 md:px-10 xl:px-[80px] pb-20">
        <div className="mb-8 h-7 w-48 rounded-lg bg-[var(--color-hr-off-white)] dark:bg-[var(--color-surface-inverse-10)]" />
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="h-16 w-full rounded-[var(--radius-card)] bg-[var(--color-hr-off-white)] dark:bg-[var(--color-surface-inverse-10)]"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
