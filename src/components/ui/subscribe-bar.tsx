import { GradientArrowUpRightIcon } from "@/components/ui/icons/decorative";

export function SubscribeBar() {
  return (
    <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-5">
      <label className="flex h-[48px] w-full items-center rounded-[16px] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-pure-white)] px-5 dark:border-[var(--color-border-inverse-10)] dark:bg-[var(--color-bg-dark)] sm:w-[305px]">
        <span className="sr-only">Email address</span>
        <input
          className="w-full bg-transparent text-[18px] font-normal leading-[24px] text-[var(--color-hr-dark)] placeholder:text-[var(--color-hr-light-grey)] focus:outline-none dark:text-[var(--color-text-inverse)] dark:placeholder:text-[var(--color-text-inverse-50)]"
          placeholder="Email"
          type="email"
        />
      </label>
      <button
        className="motion-interactive motion-interactive-press inline-flex h-[48px] items-center justify-center gap-[10px] rounded-[16px] border border-[var(--color-hr-accent)] bg-transparent px-5 text-[18px] font-normal leading-[24px] text-[var(--color-hr-dark)] hover:bg-[var(--color-hr-off-white)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-hr-accent)] focus-visible:ring-offset-2 dark:text-[var(--color-text-inverse)] dark:hover:bg-[var(--color-surface-inverse-10)]"
        type="submit"
      >
        Subscribe
        <GradientArrowUpRightIcon className="size-[10px]" />
      </button>
    </div>
  );
}
