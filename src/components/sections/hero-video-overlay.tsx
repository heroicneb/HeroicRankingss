"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/cn";

interface HeroVideoOverlayProps {
  /** Silent MP4 rendered on top of the hero image. */
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
 * Hover-activated video layer for the homepage hero — desktop only.
 *
 * WHY: the clip is a one-shot "awakening" (cracks light up, eyes glow), not a
 * seamless loop, so it plays once and holds its final frame instead of looping.
 * The static poster stays as the LCP asset and is all that phones, tablets and
 * reduced-motion visitors get (Nebojsa's call: no video motion on phones).
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
    // WHY: every hover restarts the clip from its first frame rather than resuming.
    video.currentTime = 0;
    // WHY: play() rejects if the browser blocks it; the poster simply stays visible.
    void video.play().catch(() => setActive(false));
  };

  const handleLeave = () => {
    const video = videoRef.current;
    setActive(false);
    if (!video) return;
    // WHY: keep the frames moving through the fade-out, then pause and rewind so
    // the hidden video sits on the same frame as the poster underneath.
    pauseTimer.current = window.setTimeout(() => {
      video.pause();
      video.currentTime = 0;
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
