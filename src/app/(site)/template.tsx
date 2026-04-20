import type { ReactNode } from "react";

interface TemplateProps {
  children: ReactNode;
}

export default function Template({ children }: TemplateProps) {
  return <div className="route-motion-frame">{children}</div>;
}
