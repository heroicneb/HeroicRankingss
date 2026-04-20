import type { ComponentPropsWithoutRef } from "react";

import Link from "next/link";

import { cn } from "@/lib/cn";

type NextLinkProps = ComponentPropsWithoutRef<typeof Link>;
type MotionPreset = "none" | "subtle";

export interface AppLinkProps extends NextLinkProps {
  intentPrefetch?: boolean;
  motionPreset?: MotionPreset;
}

export function AppLink({
  className,
  intentPrefetch = true,
  motionPreset = "subtle",
  prefetch,
  ...props
}: AppLinkProps) {
  const resolvedPrefetch = intentPrefetch ? prefetch : false;
  return (
    <Link
      className={cn(
        motionPreset === "subtle" ? "motion-interactive motion-interactive-press" : null,
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-hr-accent)] focus-visible:ring-offset-2",
        className,
      )}
      prefetch={resolvedPrefetch}
      {...props}
    />
  );
}
