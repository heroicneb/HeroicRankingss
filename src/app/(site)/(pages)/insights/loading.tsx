export default function Loading() {
  return (
    <div className="animate-pulse">
      {/* Title block */}
      <div className="mx-auto max-w-[1440px] px-5 md:px-10 xl:px-[80px] py-20">
        <div className="flex flex-col gap-4">
          <div className="h-4 w-24 rounded-full bg-[var(--color-hr-off-white)] dark:bg-[var(--color-surface-inverse-10)]" />
          <div className="h-10 w-56 rounded-lg bg-[var(--color-hr-off-white)] dark:bg-[var(--color-surface-inverse-10)]" />
          <div className="h-5 w-full max-w-[520px] rounded bg-[var(--color-hr-off-white)] dark:bg-[var(--color-surface-inverse-10)]" />
        </div>
      </div>
      {/* Article card grid */}
      <div className="mx-auto max-w-[1440px] px-5 md:px-10 xl:px-[80px] pb-20">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col gap-3 rounded-[var(--radius-card)] bg-[var(--color-hr-off-white)] dark:bg-[var(--color-surface-inverse-10)] overflow-hidden"
            >
              {/* Thumbnail */}
              <div className="h-44 w-full bg-[var(--color-hr-off-white)] dark:bg-[var(--color-surface-inverse-10)]" />
              {/* Meta + title + excerpt */}
              <div className="flex flex-col gap-3 p-5">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-16 rounded-full bg-[var(--color-hr-off-white)] dark:bg-[var(--color-surface-inverse-10)]" />
                  <div className="h-3 w-20 rounded-full bg-[var(--color-hr-off-white)] dark:bg-[var(--color-surface-inverse-10)]" />
                </div>
                <div className="h-5 w-full rounded bg-[var(--color-hr-off-white)] dark:bg-[var(--color-surface-inverse-10)]" />
                <div className="h-5 w-4/5 rounded bg-[var(--color-hr-off-white)] dark:bg-[var(--color-surface-inverse-10)]" />
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
