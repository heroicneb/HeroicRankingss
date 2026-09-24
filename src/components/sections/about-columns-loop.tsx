"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

import { cn } from "@/lib/cn";

interface AboutColumnsLoopProps {
  /** Ambient loop rendered over the light-theme page background. */
  lightSrc: string;
  /** Ambient loop rendered over the dark-theme page background. */
  darkSrc: string;
}

const FADE_MS = 900;
const PARALLAX_PX = 22;

function subscribeTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}

function isDarkTheme() {
  return document.documentElement.classList.contains("dark");
}

function motionAllowed() {
  return (
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Ambient video of the About columns, desktop only.
 *
 * WHY: the still image is transparent and sits on the page colour, and video
 * cannot be transparent, so one clip was generated per theme with that colour
 * baked in; the theme class on <html> picks which one loads. The clip fades in
 * over the still once it scrolls into view, loops (palindrome encode, so there
 * is no seam) and pauses off screen. A gentle parallax follows the scroll.
 * Phones, tablets and reduced-motion visitors keep the static image.
 */
export function AboutColumnsLoop({ lightSrc, darkSrc }: AboutColumnsLoopProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(false);
  const dark = useSyncExternalStore(subscribeTheme, isDarkTheme, () => false);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const video = videoRef.current;
    if (!wrapper || !video || !motionAllowed()) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((entry) => entry.isIntersecting);
        if (visible) {
          void video.play().then(() => setActive(true)).catch(() => setActive(false));
        } else {
          video.pause();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(wrapper);

    // WHY: parallax is driven by the wrapper's position relative to the viewport
    // centre, so it is zero when centred and never exceeds PARALLAX_PX.
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = wrapper.getBoundingClientRect();
      const centre = rect.top + rect.height / 2 - window.innerHeight / 2;
      const ratio = Math.max(-1, Math.min(1, centre / window.innerHeight));
      wrapper.style.setProperty("--parallax", `${(-ratio * PARALLAX_PX).toFixed(1)}px`);
    };
    const onScroll = () => {
      if (frame === 0) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="absolute inset-0 hidden lg:block [transform:translate3d(0,var(--parallax,0px),0)_scale(1.06)]"
      ref={wrapperRef}
    >
      <video
        className={cn(
          "pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity ease-out",
          active ? "opacity-100" : "opacity-0",
        )}
        loop
        muted
        playsInline
        preload="metadata"
        ref={videoRef}
        src={dark ? darkSrc : lightSrc}
        style={{ transitionDuration: `${FADE_MS}ms` }}
        tabIndex={-1}
      />
    </div>
  );
}
