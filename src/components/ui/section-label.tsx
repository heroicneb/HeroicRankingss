import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export interface SectionLabelProps {
  children: ReactNode;
  className?: string;
}

export function SectionLabel({ children, className }: SectionLabelProps) {
  return <p className={cn("type-section-label text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]", className)}>{children}</p>;
}
