import type { ProcessStep } from "@/components/sections/process-step-switcher";

/**
 * Shared process step labels used by most service pages.
 * Step 2 varies: "Initial Call and Interview" (default) or "Discovery Call" (about-us, ecommerce).
 */
export const PROCESS_STEP_LABELS = [
  "Reaching Out",
  "Initial Call and Interview",
  "Gathering Project Information",
  "Determining Budgets",
  "Advisory",
] as const;

/** Alternate step 2 label used by about-us and ecommerce-seo. */
export const DISCOVERY_CALL_LABEL = "Discovery Call" as const;

/**
 * Build a ProcessStep array by merging shared labels with page-specific descriptions.
 * Pass `overrideLabels` to customise individual step labels (e.g. step 2).
 */
export function buildProcessSteps(
  descriptions: readonly string[],
  overrideLabels?: Partial<Record<number, string>>,
): ProcessStep[] {
  return PROCESS_STEP_LABELS.map((label, i) => ({
    label: overrideLabels?.[i] ?? label,
    description: descriptions[i] ?? "",
  }));
}
