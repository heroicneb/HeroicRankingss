import type { ElementType, ReactNode } from "react";

import { cn } from "@/lib/cn";

export interface ContainerProps<T extends ElementType = "div"> {
  as?: T;
  className?: string;
  children: ReactNode;
}

export function Container<T extends ElementType = "div">({ as, className, children }: ContainerProps<T>) {
  const Component = as ?? "div";

  return (
    <Component
      className={cn(
        "mx-auto w-full max-w-[var(--size-page-max)] px-4 sm:px-6 lg:px-[var(--space-page-x)]",
        className,
      )}
    >
      {children}
    </Component>
  );
}
