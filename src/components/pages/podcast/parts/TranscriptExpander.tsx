"use client";

import { useId, useState, type ReactNode } from "react";
import Image from "next/image";

/**
 * "Read Full Transcript" row from the frame (Figma 2223:159): 18px plus
 * glyph + 18/24 light-grey label. Reveals the rest of the transcript in place.
 */
export function TranscriptExpander({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <>
      {open ? <div id={panelId}>{children}</div> : null}
      <button
        aria-controls={panelId}
        aria-expanded={open}
        className="motion-interactive inline-flex items-center gap-[10px] self-start text-[18px] leading-[24px] text-[var(--color-hr-light-grey)] hover:text-[var(--color-hr-pure-white)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-hr-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-hr-dark)]"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        <Image
          alt=""
          aria-hidden
          className={open ? "size-[18px] rotate-45 transition-transform" : "size-[18px] transition-transform"}
          height={18}
          src="/podcast/transcript-expand.svg"
          width={18}
        />
        {open ? "Hide Full Transcript" : "Read Full Transcript"}
      </button>
    </>
  );
}
