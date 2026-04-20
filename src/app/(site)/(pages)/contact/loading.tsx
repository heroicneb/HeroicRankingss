export default function Loading() {
  return (
    <div className="animate-pulse">
      {/* Title block */}
      <div className="mx-auto max-w-[1440px] px-5 md:px-10 xl:px-[80px] py-20">
        <div className="mx-auto max-w-[760px] flex flex-col items-center gap-5">
          <div className="h-4 w-24 rounded-full bg-[var(--color-hr-off-white)] dark:bg-[var(--color-surface-inverse-10)]" />
          <div className="h-10 w-80 rounded-lg bg-[var(--color-hr-off-white)] dark:bg-[var(--color-surface-inverse-10)]" />
          <div className="h-5 w-full max-w-[500px] rounded bg-[var(--color-hr-off-white)] dark:bg-[var(--color-surface-inverse-10)]" />
        </div>
      </div>
      {/* Form placeholder */}
      <div className="mx-auto max-w-[1440px] px-5 md:px-10 xl:px-[80px] pb-24">
        <div className="mx-auto max-w-[640px] flex flex-col gap-5 rounded-[var(--radius-card)] bg-[var(--color-hr-off-white)] dark:bg-[var(--color-surface-inverse-10)] p-8">
          {/* Two-column row: first name + last name */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <div className="h-3 w-20 rounded bg-[var(--color-hr-off-white)] dark:bg-[var(--color-surface-inverse-10)]" />
              <div className="h-11 w-full rounded-lg bg-[var(--color-hr-off-white)] dark:bg-[var(--color-surface-inverse-10)]" />
            </div>
            <div className="flex flex-col gap-2">
              <div className="h-3 w-20 rounded bg-[var(--color-hr-off-white)] dark:bg-[var(--color-surface-inverse-10)]" />
              <div className="h-11 w-full rounded-lg bg-[var(--color-hr-off-white)] dark:bg-[var(--color-surface-inverse-10)]" />
            </div>
          </div>
          {/* Email */}
          <div className="flex flex-col gap-2">
            <div className="h-3 w-16 rounded bg-[var(--color-hr-off-white)] dark:bg-[var(--color-surface-inverse-10)]" />
            <div className="h-11 w-full rounded-lg bg-[var(--color-hr-off-white)] dark:bg-[var(--color-surface-inverse-10)]" />
          </div>
          {/* Message textarea */}
          <div className="flex flex-col gap-2">
            <div className="h-3 w-20 rounded bg-[var(--color-hr-off-white)] dark:bg-[var(--color-surface-inverse-10)]" />
            <div className="h-32 w-full rounded-lg bg-[var(--color-hr-off-white)] dark:bg-[var(--color-surface-inverse-10)]" />
          </div>
          {/* Submit button */}
          <div className="h-12 w-36 rounded-[var(--radius-card)] bg-[var(--color-hr-off-white)] dark:bg-[var(--color-surface-inverse-10)]" />
        </div>
      </div>
    </div>
  );
}
