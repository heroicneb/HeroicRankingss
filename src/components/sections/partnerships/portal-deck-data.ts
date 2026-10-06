/*
 * The four partner-portal screens shown on the homepage. The pictures are
 * dark-mode captures of the live mocks on the partnership page
 * (src/components/pages/partnership/parts/portal-mocks.tsx), taken at 1400px
 * wide, so the homepage carries four small images instead of the mock markup.
 * Re-capture them whenever those mocks change.
 */

export const PORTAL_DECK_IDS = ["dashboard", "thread", "reports", "deliverables"] as const;
export type PortalDeckId = (typeof PORTAL_DECK_IDS)[number];

export interface PortalDeckScreen {
  id: PortalDeckId;
  title: string;
  caption: string;
}

export const PORTAL_DECK_IMAGES: Record<PortalDeckId, { src: string; alt: string }> = {
  dashboard: { src: "/partnerships/portal-dashboard.webp", alt: "Partner portal dashboard with project counts, recent activity and a grid of client projects" },
  thread: { src: "/partnerships/portal-thread.webp", alt: "A deliverable thread in the partner portal with comments between the agency and the partner" },
  reports: { src: "/partnerships/portal-reports.webp", alt: "Monthly report in the partner portal with ranking, traffic and link charts" },
  deliverables: { src: "/partnerships/portal-deliverables.webp", alt: "Deliverables list in the partner portal with status, files and approvals per item" },
};

export const PORTAL_DECK_IMAGE_WIDTH = 1400;
export const PORTAL_DECK_IMAGE_HEIGHT = 900;
