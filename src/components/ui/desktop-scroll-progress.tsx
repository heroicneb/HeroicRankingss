"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ScrollProgressBar = dynamic(
  () => import("@/components/ui/scroll-progress-bar").then((module) => module.ScrollProgressBar),
  { ssr: false },
);

interface DesktopScrollProgressProps {
  className?: string;
  scrollTargetId: string;
}

export function DesktopScrollProgress({ className, scrollTargetId }: DesktopScrollProgressProps) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const updateMatches = () => {
      setIsDesktop(mediaQuery.matches);
    };

    updateMatches();
    mediaQuery.addEventListener("change", updateMatches);

    return () => {
      mediaQuery.removeEventListener("change", updateMatches);
    };
  }, []);

  if (!isDesktop) {
    return null;
  }

  return <ScrollProgressBar className={className} scrollTargetId={scrollTargetId} />;
}
