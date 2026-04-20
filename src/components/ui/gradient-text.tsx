import type { ElementType, ReactNode } from "react";

import { cn } from "@/lib/cn";

export interface GradientTextProps<T extends ElementType = "span"> {
  as?: T;
  children: ReactNode;
  className?: string;
}

export function GradientText<T extends ElementType = "span">({
  as,
  children,
  className,
}: GradientTextProps<T>) {
  const Component = as ?? "span";

  return <Component className={cn("gradient-text-brand", className)}>{children}</Component>;
}
