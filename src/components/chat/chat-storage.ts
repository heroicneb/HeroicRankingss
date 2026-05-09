import type { Message } from "@ai-sdk/react";

const KEY_PREFIX = "hr-chat:";

function key(routeKey: string): string {
  return `${KEY_PREFIX}${routeKey}`;
}

export function load(routeKey: string): Message[] | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = window.sessionStorage.getItem(key(routeKey));
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as Message[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : undefined;
  } catch {
    return undefined;
  }
}

export function save(routeKey: string, messages: Message[]): void {
  if (typeof window === "undefined") return;
  try {
    if (messages.length === 0) {
      window.sessionStorage.removeItem(key(routeKey));
      return;
    }
    window.sessionStorage.setItem(key(routeKey), JSON.stringify(messages));
  } catch {
    // sessionStorage quota exceeded or disabled — silent no-op
  }
}

export function clear(routeKey: string): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(key(routeKey));
  } catch {
    // disabled — silent
  }
}
