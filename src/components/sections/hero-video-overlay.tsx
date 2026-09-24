"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

import { cn } from "@/lib/cn";

interface HeroVideoOverlayProps {
  /** Silent MP4 rendered on top of the hero image (desktop size). */
  src: string;
  /** Lighter encode used on small screens. */
  mobileSrc?: string;
  /** Extra classes for the <video> element (positioning/cropping should match the image). */
  videoClassName?: string;
}

const FADE_MS = 700;
const SMALL_SCREEN = "(max-width: 1023px)";

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function canHover() {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches && !prefersReducedMotion();
}

function subscribeSmallScreen(onChange: () => void) {
  const query = window.matchMedia(SMALL_SCREEN);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/**
 * Video layer for the homepage hero.
 *
 * WHY: the clip is a one-shot "awakening" (cracks light up, eyes glow), not a
 * seamless loop, so it plays once and holds its final frame instead of looping.
 * The static poster stays as the LCP asset and the reduced-motion fallback.
 * Pointer devices trigger it on hover and rewind on leave; touch devices play
 * it once when the hero scrolls into view.
 */
export function HeroVideoOverlay({ src, mobileSrc, videoClassName }: HeroVideoOverlayProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const pauseTimer = useRef<number | null>(null);
  const [active, setActive] = useState(false);
  const isSmallScreen = useSyncExternalStore(
    subscribeSmallScreen,
    () => window.matchMedia(SMALL_SCREEN).matches,
    () => false,
  );

  const play = () => {
    const video = videoRef.current;
    if (!video) return;
    if (pauseTimer.current !== null) {
      window.clearTimeout(pauseTimer.current);
      pauseTimer.current = null;
    }
    setActive(true);
    // WHY: every trigger restarts the clip from its first frame rather than resuming.
    video.currentTime = 0;
    // WHY: play() rejects if the browser blocks it; the poster simply stays visible.
    void video.play().catch(() => setActive(false));
  };

  // Touch devices: play once when the hero is mostly on screen.
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper || canHover() || prefersReducedMotion()) return;
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (connection?.saveData) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        play();
      },
      { threshold: 0.5 },
    );
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    return () => {
      if (pauseTimer.current !== null) window.clearTimeout(pauseTimer.current);
    };
  }, []);

  const handleEnter = () => {
    if (!canHover()) return;
    play();
  };

  const handleLeave = () => {
    if (!canHover()) return;
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
      className="absolute inset-0"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      ref={wrapperRef}
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
        src={isSmallScreen && mobileSrc ? mobileSrc : src}
        style={{ transitionDuration: `${FADE_MS}ms` }}
        tabIndex={-1}
      />
    </div>
  );
}
