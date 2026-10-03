"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

import type { ClientLogo } from "./trusted-by-data";

/**
 * The floating logo field. Each pill is a body in a tiny spring simulation:
 * it drifts around a home spot, bumps softly into its neighbours, parts around
 * the pointer and can be flicked by dragging. Below lg and for reduced motion
 * the same markup lays out as a static wrapped grid (see .logo-field in
 * globals.css) and this component never starts the loop.
 */
export interface LogoFieldProps {
  logos: ClientLogo[];
  /** "wide" is the homepage's 480px panel; "square" fills a 1:1 panel (partnership page). */
  aspect?: "wide" | "square";
}

/** The simulation only runs where it was approved: desktop pointers, motion allowed. */
const ACTIVE_MEDIA = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";

const PILL_GAP = 28;
const ROW_GAP = 46;
/** Rows wrap well before the panel edge so the cloud has air to drift in. */
const ROW_FILL = 0.8;
const SPRING = 0.0055;
const WANDER = 0.045;
const DAMPING = 0.935;
const REPEL_RADIUS = 180;
const REPEL_FORCE = 2.4;
const MAX_SPEED = 22;
const COLLISION_PAD = 6;

interface Body {
  el: HTMLElement;
  w: number;
  h: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  homeX: number;
  homeY: number;
  wander: number;
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/** Packs pills into centred rows (like the static grid) and returns the home spot of each, nudged a little so the resting state looks organic. */
function layoutHomes(bodies: Body[], width: number, height: number) {
  const rows: Body[][] = [[]];
  let rowWidth = 0;
  for (const body of bodies) {
    const row = rows[rows.length - 1] ?? [];
    const next = rowWidth + (rowWidth ? PILL_GAP : 0) + body.w;
    if (next > width * ROW_FILL && row.length) {
      rows.push([body]);
      rowWidth = body.w;
    } else {
      row.push(body);
      rowWidth = next;
    }
  }
  const rowHeight = Math.max(...bodies.map((b) => b.h));
  const blockHeight = rows.length * rowHeight + (rows.length - 1) * ROW_GAP;
  let y = (height - blockHeight) / 2;
  rows.forEach((row, rowIndex) => {
    const total = row.reduce((sum, b) => sum + b.w, 0) + (row.length - 1) * PILL_GAP;
    let x = (width - total) / 2;
    row.forEach((body, i) => {
      // WHY: a deterministic wobble keeps the layout stable across resizes while breaking the grid feel.
      const seed = Math.sin((rowIndex + 1) * 12.9898 + (i + 1) * 78.233) * 43758.5453;
      const jitter = seed - Math.floor(seed);
      body.homeX = x + (jitter - 0.5) * 36;
      body.homeY = y + (rowHeight - body.h) / 2 + (((jitter * 7) % 1) - 0.5) * 36;
      x += body.w + PILL_GAP;
    });
    y += rowHeight + ROW_GAP;
  });
}

export function LogoField({ logos, aspect = "wide" }: LogoFieldProps) {
  const fieldRef = useRef<HTMLUListElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const field = fieldRef.current;
    const glow = glowRef.current;
    if (!field || !glow) return;
    const media = window.matchMedia(ACTIVE_MEDIA);

    // WHY: the simulation starts and stops with the media query so a window
    // resized across the lg breakpoint (or a motion-preference change) behaves.
    const activate = () => {
      const bodies: Body[] = Array.from(field.querySelectorAll<HTMLElement>(".logo-field-pill")).map((el) => ({
        el,
        w: el.offsetWidth,
        h: el.offsetHeight,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        homeX: 0,
        homeY: 0,
        wander: Math.random() * Math.PI * 2,
      }));
      if (!bodies.length) return () => {};

      let width = field.clientWidth;
      let height = field.clientHeight;
      let pointer: { x: number; y: number } | null = null;
      let grabbed: { body: Body; dx: number; dy: number; lastX: number; lastY: number; vx: number; vy: number } | null = null;
      let running = false;
      let visible = false;
      let frame = 0;
      let last = 0;

      const place = () => {
        width = field.clientWidth;
        height = field.clientHeight;
        layoutHomes(bodies, width, height);
        for (const body of bodies) {
          body.x = clamp(body.homeX, 0, width - body.w);
          body.y = clamp(body.homeY, 0, height - body.h);
          body.el.style.transform = `translate3d(${body.x}px, ${body.y}px, 0)`;
        }
      };
      place();
      // WHY: the pills were invisible until they had a position; now they can fade in.
      field.setAttribute("data-in", "");

      const step = (now: number) => {
        const dt = last ? Math.min(now - last, 40) : 16.67;
        last = now;
        const k = dt / 16.67;

        for (const body of bodies) {
          if (grabbed?.body === body) continue;
          body.vx += (body.homeX - body.x) * SPRING * k;
          body.vy += (body.homeY - body.y) * SPRING * k;
          body.wander += (Math.random() - 0.5) * 0.35 * k;
          body.vx += Math.cos(body.wander) * WANDER * k;
          body.vy += Math.sin(body.wander) * WANDER * k;
          if (pointer) {
            const cx = body.x + body.w / 2;
            const cy = body.y + body.h / 2;
            const dx = cx - pointer.x;
            const dy = cy - pointer.y;
            const distance = Math.hypot(dx, dy) || 1;
            if (distance < REPEL_RADIUS) {
              const strength = (1 - distance / REPEL_RADIUS) ** 2 * REPEL_FORCE * k;
              body.vx += (dx / distance) * strength;
              body.vy += (dy / distance) * strength;
            }
          }
        }

        // Soft AABB separation: overlapping pills push each other apart along the shallower axis.
        for (let i = 0; i < bodies.length; i += 1) {
          const a = bodies[i]!;
          for (let j = i + 1; j < bodies.length; j += 1) {
            const b = bodies[j]!;
            const dx = b.x + b.w / 2 - (a.x + a.w / 2);
            const dy = b.y + b.h / 2 - (a.y + a.h / 2);
            const overlapX = (a.w + b.w) / 2 + COLLISION_PAD - Math.abs(dx);
            const overlapY = (a.h + b.h) / 2 + COLLISION_PAD - Math.abs(dy);
            if (overlapX <= 0 || overlapY <= 0) continue;
            const aHeld = grabbed?.body === a;
            const bHeld = grabbed?.body === b;
            const shareA = aHeld ? 0 : bHeld ? 1 : 0.5;
            const shareB = 1 - shareA;
            if (overlapX < overlapY) {
              const sign = dx < 0 ? -1 : 1;
              const push = overlapX * 0.45;
              a.x -= sign * push * shareA;
              b.x += sign * push * shareB;
              a.vx -= sign * push * 0.08 * shareA;
              b.vx += sign * push * 0.08 * shareB;
            } else {
              const sign = dy < 0 ? -1 : 1;
              const push = overlapY * 0.45;
              a.y -= sign * push * shareA;
              b.y += sign * push * shareB;
              a.vy -= sign * push * 0.08 * shareA;
              b.vy += sign * push * 0.08 * shareB;
            }
          }
        }

        for (const body of bodies) {
          if (grabbed?.body !== body) {
            const damping = DAMPING ** k;
            body.vx *= damping;
            body.vy *= damping;
            const speed = Math.hypot(body.vx, body.vy);
            if (speed > MAX_SPEED) {
              body.vx = (body.vx / speed) * MAX_SPEED;
              body.vy = (body.vy / speed) * MAX_SPEED;
            }
            body.x += body.vx * k;
            body.y += body.vy * k;
          }
          if (body.x < 0) {
            body.x = 0;
            body.vx = Math.abs(body.vx) * 0.45;
          } else if (body.x > width - body.w) {
            body.x = width - body.w;
            body.vx = -Math.abs(body.vx) * 0.45;
          }
          if (body.y < 0) {
            body.y = 0;
            body.vy = Math.abs(body.vy) * 0.45;
          } else if (body.y > height - body.h) {
            body.y = height - body.h;
            body.vy = -Math.abs(body.vy) * 0.45;
          }
          body.el.style.transform = `translate3d(${body.x}px, ${body.y}px, 0)`;
        }

        frame = requestAnimationFrame(step);
      };

      const start = () => {
        if (running) return;
        running = true;
        last = 0;
        frame = requestAnimationFrame(step);
      };
      const stop = () => {
        running = false;
        cancelAnimationFrame(frame);
      };
      const sync = () => {
        if (visible && document.visibilityState === "visible") start();
        else stop();
      };

      const observer = new IntersectionObserver(
        ([entry]) => {
          visible = entry?.isIntersecting ?? false;
          sync();
        },
        { rootMargin: "80px" },
      );
      observer.observe(field);
      document.addEventListener("visibilitychange", sync);

      const resize = new ResizeObserver(() => {
        if (field.clientWidth === width && field.clientHeight === height) return;
        for (const body of bodies) {
          body.w = body.el.offsetWidth;
          body.h = body.el.offsetHeight;
        }
        // WHY: a resize is rare, so snapping every pill to its new home beats a long drift across the panel.
        place();
      });
      resize.observe(field);

      const localPoint = (event: PointerEvent) => {
        const rect = field.getBoundingClientRect();
        return { x: event.clientX - rect.left, y: event.clientY - rect.top };
      };
      const onPointerMove = (event: PointerEvent) => {
        const point = localPoint(event);
        pointer = point;
        glow.style.transform = `translate3d(${point.x}px, ${point.y}px, 0) translate(-50%, -50%)`;
        glow.style.opacity = "1";
        if (grabbed) {
          const { body } = grabbed;
          body.x = clamp(point.x - grabbed.dx, 0, width - body.w);
          body.y = clamp(point.y - grabbed.dy, 0, height - body.h);
          // WHY: a lightly smoothed pointer velocity becomes the flick when the pill is released.
          grabbed.vx = grabbed.vx * 0.6 + (point.x - grabbed.lastX) * 0.4;
          grabbed.vy = grabbed.vy * 0.6 + (point.y - grabbed.lastY) * 0.4;
          grabbed.lastX = point.x;
          grabbed.lastY = point.y;
        }
      };
      const onPointerLeave = () => {
        pointer = null;
        glow.style.opacity = "0";
      };
      const onPointerDown = (event: PointerEvent) => {
        if (event.button !== 0 || event.pointerType === "touch") return;
        const pill = (event.target as HTMLElement).closest<HTMLElement>(".logo-field-pill");
        if (!pill) return;
        const body = bodies.find((b) => b.el === pill);
        if (!body) return;
        const point = localPoint(event);
        grabbed = { body, dx: point.x - body.x, dy: point.y - body.y, lastX: point.x, lastY: point.y, vx: 0, vy: 0 };
        body.vx = 0;
        body.vy = 0;
        field.setAttribute("data-grabbing", "");
        try {
          field.setPointerCapture(event.pointerId);
        } catch {
          // WHY: synthetic events carry pointer ids the browser does not know; the drag still works without capture.
        }
        event.preventDefault();
      };
      const release = () => {
        if (!grabbed) return;
        const { body } = grabbed;
        body.vx = clamp(grabbed.vx * 0.9, -MAX_SPEED, MAX_SPEED);
        body.vy = clamp(grabbed.vy * 0.9, -MAX_SPEED, MAX_SPEED);
        grabbed = null;
        field.removeAttribute("data-grabbing");
      };

      field.addEventListener("pointermove", onPointerMove);
      field.addEventListener("pointerleave", onPointerLeave);
      field.addEventListener("pointerdown", onPointerDown);
      field.addEventListener("pointerup", release);
      field.addEventListener("pointercancel", release);

      return () => {
        stop();
        release();
        observer.disconnect();
        resize.disconnect();
        document.removeEventListener("visibilitychange", sync);
        field.removeEventListener("pointermove", onPointerMove);
        field.removeEventListener("pointerleave", onPointerLeave);
        field.removeEventListener("pointerdown", onPointerDown);
        field.removeEventListener("pointerup", release);
        field.removeEventListener("pointercancel", release);
        glow.style.opacity = "0";
      };
    };

    let deactivate: (() => void) | null = null;
    const apply = () => {
      if (media.matches && !deactivate) deactivate = activate();
      else if (!media.matches && deactivate) {
        deactivate();
        deactivate = null;
      }
    };
    apply();
    media.addEventListener("change", apply);
    return () => {
      media.removeEventListener("change", apply);
      deactivate?.();
    };
  }, [logos]);

  return (
    <div className="surface-chart relative overflow-hidden rounded-[30px] border border-[var(--color-border-inverse-10)] lg:rounded-[var(--radius-card)]">
      <div aria-hidden className="logo-field-glow" ref={glowRef} />
      <ul aria-label="Brands we have worked with" className={aspect === "square" ? "logo-field logo-field-square" : "logo-field"} ref={fieldRef}>
        {logos.map((item, index) => (
          <li className="logo-field-pill" key={item.src} style={{ "--i": index } as React.CSSProperties}>
            <span className="logo-field-pill-inner">
              <Image
                alt={item.name}
                className={["logo-field-logo", item.invert ? "logo-field-logo-invert" : "", item.blend ? "logo-field-logo-screen" : ""].join(" ").trim()}
                draggable={false}
                height={Math.round(item.height)}
                loading="lazy"
                sizes="200px"
                src={item.src}
                style={{ height: item.logoHeight }}
                width={Math.round(item.width)}
              />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
