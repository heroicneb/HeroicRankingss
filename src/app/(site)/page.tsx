export { metadata } from "@/components/pages/home/home-page";
export { default } from "@/components/pages/home/home-page";

// WHY: Sanity content (partner logos, posts, testimonials) changes during the
// migration soak window. force-dynamic ensures every request hits Sanity for
// fresh content; without this, defineLive's fetch cache persists across
// deploys and serves stale data (audit confirmed 2026-04-29).
export const dynamic = "force-dynamic";
