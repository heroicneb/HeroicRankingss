// WHY: Provide a route-segment skeleton so dynamic article transitions feel responsive.
export default function PostLoading() {
  return (
    <div className="mx-auto w-full max-w-[1440px] px-5 pb-[130px] pt-[109px] md:px-10 xl:px-[80px]">
      <div className="animate-pulse">
        <div className="h-14 w-full max-w-[900px] rounded-[20px] bg-[var(--color-hr-light-grey)] dark:bg-[var(--color-surface-inverse-20)]" />
        <div className="mt-5 h-6 w-[280px] rounded-[12px] bg-[var(--color-hr-light-grey)] dark:bg-[var(--color-surface-inverse-20)]" />
        <div className="mt-10 h-px w-full bg-[var(--color-hr-light-grey)] dark:bg-[var(--color-surface-inverse-20)]" />
        <div className="mt-10 grid gap-10 xl:grid-cols-[305px_minmax(0,954px)]">
          <div className="h-[240px] rounded-[20px] bg-[var(--color-hr-light-grey)] dark:bg-[var(--color-surface-inverse-20)]" />
          <div className="h-[620px] rounded-[20px] bg-[var(--color-hr-light-grey)] dark:bg-[var(--color-surface-inverse-20)]" />
        </div>
      </div>
    </div>
  );
}
