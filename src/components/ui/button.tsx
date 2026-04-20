import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export type ButtonVariant = "gradient" | "outline" | "pill";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "h-10 px-4",
  md: "h-[45px] px-5",
  lg: "h-12 px-6",
};

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  gradient:
    "border border-[var(--color-hr-accent)] bg-[linear-gradient(110deg,var(--color-hr-gradient-start),var(--color-hr-gradient-end))] text-[var(--color-hr-pure-white)] hover:opacity-95",
  outline:
    "border border-[var(--color-hr-accent)] bg-transparent text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] hover:bg-[var(--color-hr-off-white)] dark:hover:bg-[var(--color-surface-inverse-10)]",
  pill: "bg-[var(--color-hr-off-white)] dark:bg-[var(--color-bg-dark)] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] hover:bg-[var(--color-hr-light-grey)]",
};

export function Button({
  className,
  variant = "outline",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "type-cta motion-interactive motion-interactive-press inline-flex items-center justify-center gap-2 rounded-[var(--radius-button)] whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-hr-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-hr-pure-white)] dark:focus-visible:ring-offset-[var(--color-bg-dark)]",
        SIZE_CLASSES[size],
        VARIANT_CLASSES[variant],
        className,
      )}
      type={type}
      {...props}
    />
  );
}
