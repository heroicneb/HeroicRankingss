"use client";

import type { KeyboardEvent, PointerEvent } from "react";
import { useCallback, useEffect, useRef } from "react";

interface ScrollProgressBarProps {
  scrollTargetId: string;
  className?: string;
}

export function ScrollProgressBar({
  scrollTargetId,
  className,
}: ScrollProgressBarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const scrollElRef = useRef<HTMLElement | null>(null);
  const thumbWidthRef = useRef(0);
  const rafRef = useRef(0);
  const resizeRafRef = useRef(0);
  const isDraggingRef = useRef(false);

  /** Direct DOM update — fills the thumb from 0 to trackWidth as scroll progresses */
  const syncThumb = useCallback(() => {
    const scrollEl = scrollElRef.current;
    const track = trackRef.current;
    const thumb = thumbRef.current;
    const container = containerRef.current;
    const label = labelRef.current;
    if (!scrollEl || !track || !thumb) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollEl;
    const trackWidth = track.clientWidth;

    if (scrollWidth <= clientWidth) {
      thumbWidthRef.current = trackWidth;
      thumb.style.width = `${trackWidth}px`;
      thumb.style.transition = "none";
      thumb.style.transform = "translateX(0px)";
      container?.setAttribute("aria-valuenow", "0");
      if (label) label.textContent = "0%";
      return;
    }

    const pct = Math.max(
      0,
      Math.min(1, scrollLeft / (scrollWidth - clientWidth)),
    );
    const pctRounded = Math.round(pct * 100);
    const filledWidth = pct * trackWidth;

    thumbWidthRef.current = filledWidth;
    thumb.style.width = `${filledWidth}px`;
    thumb.style.transition = "none";
    thumb.style.transform = "translateX(0px)";
    container?.setAttribute("aria-valuenow", String(pctRounded));
    if (label) label.textContent = `${pctRounded}%`;
  }, []);

  /** Cache scroll element, attach rAF-gated scroll + resize listeners */
  useEffect(() => {
    const scrollEl = document.getElementById(scrollTargetId);
    scrollElRef.current = scrollEl;
    if (!scrollEl) return;

    function onScroll() {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(syncThumb);
    }

    function onResize() {
      cancelAnimationFrame(resizeRafRef.current);
      resizeRafRef.current = requestAnimationFrame(syncThumb);
    }

    syncThumb();
    scrollEl.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      cancelAnimationFrame(rafRef.current);
      cancelAnimationFrame(resizeRafRef.current);
      scrollEl.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [scrollTargetId, syncThumb]);

  /** Scroll the rail so the fill reaches clientX */
  const scrollToClientX = useCallback((clientX: number) => {
    const track = trackRef.current;
    const scrollEl = scrollElRef.current;
    if (!track || !scrollEl) return;

    const rect = track.getBoundingClientRect();
    if (rect.width <= 0 || scrollEl.scrollWidth <= scrollEl.clientWidth) {
      return;
    }

    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    scrollEl.scrollLeft = pct * (scrollEl.scrollWidth - scrollEl.clientWidth);
  }, []);

  /* ── pointer handlers (capture-based — unified mouse + touch) ── */

  function handlePointerDown(e: PointerEvent<HTMLDivElement>) {
    const thumb = thumbRef.current;
    const scrollEl = scrollElRef.current;
    if (!thumb || !scrollEl || scrollEl.scrollWidth <= scrollEl.clientWidth)
      return;

    e.currentTarget.setPointerCapture(e.pointerId);
    isDraggingRef.current = true;
    containerRef.current?.classList.add("is-dragging");
    thumb.style.transition = "none";

    scrollToClientX(e.clientX);
  }

  function handlePointerMove(e: PointerEvent) {
    if (!isDraggingRef.current) return;
    e.preventDefault();
    scrollToClientX(e.clientX);
  }

  function handleDragEnd() {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    containerRef.current?.classList.remove("is-dragging");
  }

  /* ── keyboard (arrows / home / end) ── */

  function handleKeyDown(e: KeyboardEvent) {
    const scrollEl = scrollElRef.current;
    if (!scrollEl) return;

    const step = scrollEl.clientWidth * 0.25;
    let handled = true;

    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        scrollEl.scrollBy({ left: step, behavior: "smooth" });
        break;
      case "ArrowLeft":
      case "ArrowUp":
        scrollEl.scrollBy({ left: -step, behavior: "smooth" });
        break;
      case "Home":
        scrollEl.scrollTo({ left: 0, behavior: "smooth" });
        break;
      case "End":
        scrollEl.scrollTo({ left: scrollEl.scrollWidth, behavior: "smooth" });
        break;
      default:
        handled = false;
    }

    if (handled) e.preventDefault();
  }

  return (
    <div
      ref={containerRef}
      className={`flex flex-col gap-[10px] ${className ?? ""}`}
      aria-controls={scrollTargetId}
      aria-orientation="horizontal"
      aria-valuenow={0}
      aria-valuemin={0}
      aria-valuemax={100}
      role="scrollbar"
    >
      <div
        className="relative flex h-6 cursor-grab items-center touch-pan-y [&.is-dragging]:cursor-grabbing"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handleDragEnd}
        onPointerCancel={handleDragEnd}
        onLostPointerCapture={handleDragEnd}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <div
          ref={trackRef}
          className="relative h-[3px] w-full overflow-hidden rounded-full bg-[var(--color-hr-light-grey)] dark:bg-[var(--color-surface-inverse-20)]"
        >
          <span
            ref={thumbRef}
            className="absolute left-0 top-0 h-[3px] rounded-full will-change-transform"
            style={{
              width: "315px",
              transform: "translateX(0px)",
              backgroundImage:
                "linear-gradient(90deg, #4C4AB5 0%, #998AFF 50%, #E1BDFF 100%)",
            }}
          />
        </div>
      </div>
      <span
        ref={labelRef}
        className="text-[18px] leading-[normal] tracking-[-0.36px] text-[var(--color-hr-grey)] dark:text-[var(--color-text-inverse-60)]"
      >
        0%
      </span>
    </div>
  );
}
