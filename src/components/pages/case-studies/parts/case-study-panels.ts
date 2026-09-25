/**
 * Brand-color panel artwork per case-study slug. The Figma source-of-truth
 * for the case-studies index card top half is a flat branded SVG panel
 * (e.g. Nagish black, Art-by-Maudsch purple) with the brand name centered
 * — NOT a photo of the hero image. Both the index card and the detail
 * page hero render from this map so the two surfaces stay visually aligned.
 */
export interface CaseStudyPanelArt {
  panelImageSrc: string;
  /** Tailwind absolute-positioning class for the brand label inside the panel. */
  panelLabelClassName: string;
  /** Tailwind color class for the brand label text (varies per brand bg). */
  panelLabelColorClassName: string;
}

export const CASE_STUDY_PANEL_BY_SLUG: Record<string, CaseStudyPanelArt> = {
  affinda: {
    panelImageSrc: "/case-studies/imgGroup44.svg",
    panelLabelClassName: "left-1/2 -translate-x-1/2",
    panelLabelColorClassName: "text-[var(--color-hr-pure-white)]",
  },
  "my-baskets": {
    panelImageSrc: "/case-studies/my-baskets-cs-f.png",
    panelLabelClassName: "left-1/2 -translate-x-1/2",
    panelLabelColorClassName:
      "text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]",
  },
  nagish: {
    panelImageSrc: "/case-studies/imgGroup34.svg",
    panelLabelClassName: "left-1/2 -translate-x-1/2",
    panelLabelColorClassName: "text-[var(--color-hr-pure-white)]",
  },
  "art-by-maudsch": {
    panelImageSrc: "/case-studies/imgGroup31.svg",
    panelLabelClassName: "left-1/2 -translate-x-1/2",
    panelLabelColorClassName: "text-[var(--color-hr-pure-white)]",
  },
  designrush: {
    panelImageSrc: "/case-studies/imgGroup53.svg",
    panelLabelClassName: "left-1/2 -translate-x-1/2",
    panelLabelColorClassName: "text-[var(--color-hr-pure-white)]",
  },
  "diy-craft-ecom-brand": {
    panelImageSrc: "/case-studies/imgGroup52.svg",
    panelLabelClassName: "left-1/2 -translate-x-1/2",
    panelLabelColorClassName: "text-[var(--color-hr-pure-white)]",
  },
};

/**
 * Generic fallback when a slug doesn't map (new case studies before their
 * panel SVG ships). Affinda's black panel is a safe default — same flat
 * style as the rest, brand-neutral.
 */
export const CASE_STUDY_PANEL_FALLBACK: CaseStudyPanelArt = {
  panelImageSrc: "/case-studies/imgGroup44.svg",
  panelLabelClassName: "left-1/2 -translate-x-1/2",
  panelLabelColorClassName: "text-[var(--color-hr-pure-white)]",
};
