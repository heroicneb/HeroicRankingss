"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/cn";

interface HeroVideoOverlayProps {
  /** Silent MP4 rendered on top of the hero image (used when `sources` is not given). */
  src?: string;
  /**
   * Alternative encodes in preference order, e.g. AV1 first and H.264 last;
   * the browser picks the first type it can play.
   */
  sources?: Array<{ src: string; type: string }>;
  /** Extra classes for the <video> element (positioning/cropping should match the image). */
  videoClassName?: string;
  /**
   * Play the clip once as soon as the hero is on screen (desktop, motion allowed)
   * and hold its last frame; hovering replays it. Without this the clip only
   * plays while hovered.
   */
  autoPlayOnce?: boolean;
}

const FADE_MS = 700;

function canHover() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Desktop viewport with motion allowed: the only place a clip may start by itself. */
const AUTOPLAY_MEDIA = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";

export function HeroVideoOverlay({ src, sources, videoClassName, autoPlayOnce = false }: HeroVideoOverlayProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const pauseTimer = useRef<number | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    return () => {
      if (pauseTimer.current !== null) window.clearTimeout(pauseTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!autoPlayOnce) return;
    const video = videoRef.current;
    if (!video) return;
    const media = window.matchMedia(AUTOPLAY_MEDIA);
    let observer: IntersectionObserver | null = null;
    let played = false;
    // WHY: the clip starts the first time the hero is actually on screen on a desktop
    // viewport, not on page load in the background; the media listener covers a window
    // that only grows past the lg breakpoint after mount.
    const arm = () => {
      if (played || observer || !media.matches) return;
      observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting) return;
          played = true;
          observer?.disconnect();
          observer = null;
          setActive(true);
          void video.play().catch(() => setActive(false));
        },
        { threshold: 0.4 },
      );
      observer.observe(video);
    };
    arm();
    media.addEventListener("change", arm);
    return () => {
      media.removeEventListener("change", arm);
      observer?.disconnect();
    };
  }, [autoPlayOnce]);

  const handleEnter = () => {
    if (!canHover()) return;
    const video = videoRef.current;
    if (!video) return;
    if (pauseTimer.current !== null) {
      window.clearTimeout(pauseTimer.current);
      pauseTimer.current = null;
    }
    setActive(true);
    // WHY: Chrome can abort the very first play() of a clip that has not rendered a frame yet ("video-only background
    //      media was paused to save power"); one retry a moment later succeeds. Any other rejection leaves the poster.
    let retried = false;
    const start = () => {
      void video.play().catch(() => {
        if (!retried) {
          retried = true;
          window.setTimeout(start, 300);
        } else {
          setActive(false);
        }
      });
    };
    // WHY: every hover restarts the clip from its first frame. Seeking and playing in the same tick made Chrome
    //      abort the play ("video-only background media was paused to save power"), so the play waits for the seek
    //      to land; the common case (clip already rewound by handleLeave) needs no seek at all.
    if (video.currentTime > 0.05) {
      video.addEventListener("seeked", start, { once: true });
      video.currentTime = 0;
    } else {
      start();
    }
  };

  const handleLeave = () => {
    // WHY: in autoplay mode the clip holds its last frame; leaving should not snap it back to the poster.
    if (autoPlayOnce) return;
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
      // WHY: lets a blended poster underneath fade out while the clip shows (see .hero-blend-frame).
      data-video-active={active ? "true" : "false"}
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
        src={sources ? undefined : src}
        style={{ transitionDuration: `${FADE_MS}ms` }}
        tabIndex={-1}
      >
        {sources?.map((source) => <source key={source.src} src={source.src} type={source.type} />)}
      </video>
    </div>
  );
}
