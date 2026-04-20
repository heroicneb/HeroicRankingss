export default function Loading() {
  return (
    <div className="animate-pulse">
      {/* Title */}
      <div className="mx-auto max-w-[1440px] px-5 md:px-10 xl:px-[80px] py-20">
        <div className="flex flex-col gap-4">
          <div className="h-10 w-64 rounded-lg bg-[var(--color-hr-off-white)] dark:bg-[var(--color-surface-inverse-10)]" />
          <div className="h-4 w-40 rounded bg-[var(--color-hr-off-white)] dark:bg-[var(--color-surface-inverse-10)]" />
        </div>
      </div>
      {/* Text body placeholder */}
      <div className="mx-auto max-w-[1440px] px-5 md:px-10 xl:px-[80px] pb-24">
        <div className="mx-auto max-w-[800px] flex flex-col gap-10">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-3">
              <div className="h-6 w-56 rounded-lg bg-[var(--color-hr-off-white)] dark:bg-[var(--color-surface-inverse-10)]" />
              <div className="h-4 w-full rounded bg-[var(--color-hr-off-white)] dark:bg-[var(--color-surface-inverse-10)]" />
              <div className="h-4 w-full rounded bg-[var(--color-hr-off-white)] dark:bg-[var(--color-surface-inverse-10)]" />
              <div className="h-4 w-11/12 rounded bg-[var(--color-hr-off-white)] dark:bg-[var(--color-surface-inverse-10)]" />
              <div className="h-4 w-4/5 rounded bg-[var(--color-hr-off-white)] dark:bg-[var(--color-surface-inverse-10)]" />
              <div className="h-4 w-full rounded bg-[var(--color-hr-off-white)] dark:bg-[var(--color-surface-inverse-10)]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
