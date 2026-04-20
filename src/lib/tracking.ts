export type TrackingProperties = Record<string, string | number | boolean>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export async function trackEvent(name: string, properties?: TrackingProperties) {
  if (typeof window === "undefined") {
    return;
  }

  const { track } = await import("@vercel/analytics");
  track(name, properties);

  if (typeof window.gtag === "function") {
    window.gtag("event", name, properties ?? {});
  }
}
