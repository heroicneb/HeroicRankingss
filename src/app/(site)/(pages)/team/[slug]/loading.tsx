// WHY: Provide a route-segment skeleton so navigation to a team profile feels
// responsive while the Sanity fetch and image hydration settle.
export default function TeamMemberLoading() {
  return (
    <div className="mx-auto w-full max-w-[1440px] px-5 pb-[130px] pt-[120px] md:px-10 xl:px-[80px]">
      <div className="animate-pulse">
        <div className="h-6 w-[180px] rounded-[12px] bg-[var(--color-hr-light-grey)] dark:bg-[var(--color-surface-inverse-20)]" />
        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-[60px]">
          <div>
            <div className="h-6 w-[160px] rounded-[12px] bg-[var(--color-hr-light-grey)] dark:bg-[var(--color-surface-inverse-20)]" />
            <div className="mt-6 h-14 w-full max-w-[600px] rounded-[20px] bg-[var(--color-hr-light-grey)] dark:bg-[var(--color-surface-inverse-20)]" />
            <div className="mt-10 h-px w-full bg-[var(--color-hr-light-grey)] dark:bg-[var(--color-surface-inverse-20)]" />
            <div className="mt-10 h-[300px] w-full rounded-[20px] bg-[var(--color-hr-light-grey)] dark:bg-[var(--color-surface-inverse-20)]" />
          </div>
          <div className="h-[480px] w-full max-w-[360px] rounded-[var(--radius-card)] bg-[var(--color-hr-light-grey)] dark:bg-[var(--color-surface-inverse-20)] lg:h-[642px]" />
        </div>
      </div>
    </div>
  );
}
