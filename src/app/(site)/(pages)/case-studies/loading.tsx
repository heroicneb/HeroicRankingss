export default function Loading() {
  return (
    <div className="animate-pulse">
      {/* Title block */}
      <div className="mx-auto max-w-[1440px] px-5 md:px-10 xl:px-[80px] py-20">
        <div className="flex flex-col gap-4">
          <div className="h-4 w-24 rounded-full bg-[var(--color-hr-off-white)] dark:bg-[var(--color-surface-inverse-10)]" />
          <div className="h-10 w-72 rounded-lg bg-[var(--color-hr-off-white)] dark:bg-[var(--color-surface-inverse-10)]" />
          <div className="h-5 w-full max-w-[560px] rounded bg-[var(--color-hr-off-white)] dark:bg-[var(--color-surface-inverse-10)]" />
        </div>
      </div>
      {/* Case study card grid */}
      <div className="mx-auto max-w-[1440px] px-5 md:px-10 xl:px-[80px] pb-20">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col gap-4 rounded-[var(--radius-card)] bg-[var(--color-hr-off-white)] dark:bg-[var(--color-surface-inverse-10)] overflow-hidden"
            >
              {/* Image area */}
              <div className="h-52 w-full bg-[var(--color-hr-off-white)] dark:bg-[var(--color-surface-inverse-10)]" />
              {/* Content area */}
              <div className="flex flex-col gap-3 p-6">
                <div className="h-3 w-20 rounded-full bg-[var(--color-hr-off-white)] dark:bg-[var(--color-surface-inverse-10)]" />
                <div className="h-6 w-4/5 rounded bg-[var(--color-hr-off-white)] dark:bg-[var(--color-surface-inverse-10)]" />
                <div className="h-4 w-full rounded bg-[var(--color-hr-off-white)] dark:bg-[var(--color-surface-inverse-10)]" />
                <div className="h-4 w-3/4 rounded bg-[var(--color-hr-off-white)] dark:bg-[var(--color-surface-inverse-10)]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
