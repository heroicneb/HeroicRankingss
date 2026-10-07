"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/*
 * "/ The Team /" clip: the office seen from above, zooming out into a network
 * and rewinding to the office. The file already contains the rewind (forward
 * pass + 2x reverse), so the browser plays it once and stops on the opening
 * frame, which is also the poster.
 *
 * Performance: the <video> element exists only on lg+ with motion allowed
 * (phones and reduced-motion users get the poster image), its src is attached
 * when the section comes within LOAD_MARGIN of the viewport, and playback
 * starts when PLAY_THRESHOLD of it is visible. Scrolling away pauses; coming
 * back resumes. One run per page view. Nothing here touches the first paint.
 */

const ACTIVE_MEDIA = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";
const LOAD_MARGIN = "600px 0px";
const PLAY_THRESHOLD = 0.4;

interface TeamVideoProps {
  src: string;
  poster: string;
  posterAlt: string;
  width: number;
  height: number;
  className?: string;
  sizes: string;
}

export function TeamVideo({ src, poster, posterAlt, width, height, className, sizes }: TeamVideoProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [active, setActive] = useState(false);
  const started = useRef(false);
  const ended = useRef(false);
  const inView = useRef(false);

  useEffect(() => {
    const media = window.matchMedia(ACTIVE_MEDIA);
    const sync = () => setEnabled(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const frame = frameRef.current;
    if (!enabled || !frame) return;

    const loader = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setLoaded(true);
          loader.disconnect();
        }
      },
      { rootMargin: LOAD_MARGIN },
    );
    loader.observe(frame);

    const player = new IntersectionObserver(
      (entries) => {
        const video = videoRef.current;
        if (!video || ended.current) return;
        const visible = entries.some((entry) => entry.isIntersecting);
        inView.current = visible;
        if (visible) {
          setLoaded(true);
          started.current = true;
          void video.play().catch(() => {
            /* autoplay refused: the poster stays, nothing else to do */
          });
        } else if (started.current && !video.paused) {
          video.pause();
        }
      },
      { threshold: PLAY_THRESHOLD },
    );
    player.observe(frame);

    // WHY: browsers pause muted video in a background tab; when the visitor
    // comes back with the clip still in view, it should carry on, not sit frozen.
    const onVisibility = () => {
      const video = videoRef.current;
      if (document.visibilityState !== "visible" || !video || !started.current || ended.current || !inView.current) return;
      void video.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      loader.disconnect();
      player.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [enabled]);

  return (
    <div className={className} data-video-active={active} ref={frameRef}>
      <Image alt={posterAlt} className="team-video-poster absolute inset-0 h-full w-full object-cover" height={height} sizes={sizes} src={poster} width={width} />
      {enabled ? (
        <video
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
          muted
          onEnded={() => {
            ended.current = true;
          }}
          onPlaying={() => setActive(true)}
          playsInline
          poster={poster}
          preload={loaded ? "auto" : "none"}
          ref={videoRef}
          src={loaded ? src : undefined}
          tabIndex={-1}
        />
      ) : null}
    </div>
  );
}
