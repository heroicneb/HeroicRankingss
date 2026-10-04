import type { ComponentPropsWithoutRef } from "react";

import Link from "next/link";

import { cn } from "@/lib/cn";
import { withTrailingSlash } from "@/lib/with-trailing-slash";

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
  href,
  ...props
}: AppLinkProps) {
  const resolvedPrefetch = intentPrefetch ? prefetch : false;
  // WHY: the site lives at trailing-slash URLs; a link without one costs a redirect hop.
  const resolvedHref = typeof href === "string" ? withTrailingSlash(href) : href;
  return (
    <Link
      className={cn(
        motionPreset === "subtle" ? "motion-interactive motion-interactive-press" : null,
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-hr-accent)] focus-visible:ring-offset-2",
        className,
      )}
      href={resolvedHref}
      prefetch={resolvedPrefetch}
      {...props}
    />
  );
}
