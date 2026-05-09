import type { ServiceSuccessStory } from "@/components/sections/shared/service-success-stories";

/**
 * Shared success stories used across all service pages.
 * All 8 service pages display the same 3 case studies.
 */
export const SUCCESS_STORIES: readonly ServiceSuccessStory[] = [
  {
    title: "My Baskets",
    description:
      "My Baskets is a leading Canadian online retailer specializing in luxury gift baskets for various occasions.",
    date: "December 1, 2024",
    heroClassName: "bg-[var(--color-case-my-baskets)]",
    href: "/case-study",
  },
  {
    title: "Nagish",
    description:
      "Nagish is a pioneering company dedicated to making communication more accessible for individuals with hearing impairments.",
    date: "December 24, 2024",
    heroClassName: "bg-[var(--color-hr-dark)]",
    href: "/case-study",
  },
  {
    title: "Art by Maudsch",
    description:
      "Art by Maudsch is an online platform dedicated to selling unique, handmade artworks by contemporary artists.",
    date: "December 24, 2024",
    heroClassName: "bg-[var(--color-case-art-maudsch)]",
    href: "/case-study",
  },
] as const;
