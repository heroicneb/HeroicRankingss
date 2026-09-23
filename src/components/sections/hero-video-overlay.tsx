"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/cn";

interface HeroVideoOverlayProps {
  /** Looping, silent MP4 rendered on top of the hero image. */
  src: string;
  /** Extra classes for the <video> element (positioning/cropping should match the image). */
  videoClassName?: string;
}

const FADE_MS = 700;

function canHover() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Hover-activated video layer for the homepage hero.
 *
 * WHY: The static image stays as the LCP asset and the fallback for touch,
 * reduced-motion and no-JS users. On hover-capable devices the video fades in
 * over it and loops, so the image appears to come alive; on leave it fades out
 * and pauses so nothing decodes in the background.
 */
export function HeroVideoOverlay({ src, videoClassName }: HeroVideoOverlayProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const pauseTimer = useRef<number | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    return () => {
      if (pauseTimer.current !== null) window.clearTimeout(pauseTimer.current);
    };
  }, []);

  const handleEnter = () => {
    if (!canHover()) return;
    const video = videoRef.current;
    if (!video) return;
    if (pauseTimer.current !== null) {
      window.clearTimeout(pauseTimer.current);
      pauseTimer.current = null;
    }
    setActive(true);
    // WHY: play() returns a promise that rejects if the browser blocks it; the
    // image simply stays visible in that case.
    void video.play().catch(() => setActive(false));
  };

  const handleLeave = () => {
    const video = videoRef.current;
    setActive(false);
    if (!video) return;
    // WHY: keep the frames moving through the fade-out, then pause to stop decoding.
    pauseTimer.current = window.setTimeout(() => {
      video.pause();
      pauseTimer.current = null;
    }, FADE_MS);
  };

  return (
    <div
      aria-hidden
      className="absolute inset-0 hidden lg:block"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <video
        className={cn(
          "pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity ease-out",
          active ? "opacity-100" : "opacity-0",
          videoClassName,
        )}
        loop
        muted
        playsInline
        preload="metadata"
        ref={videoRef}
        src={src}
        style={{ transitionDuration: `${FADE_MS}ms` }}
        tabIndex={-1}
      />
    </div>
  );
}
