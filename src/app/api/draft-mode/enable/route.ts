import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { client } from "@/sanity/lib/client";

/* ------------------------------------------------------------------ */
/*  In-memory rate limiter: max 5 draft-mode enables per IP per hour  */
/* ------------------------------------------------------------------ */

const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS = 5;

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now >= entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  entry.count += 1;
  return entry.count > MAX_REQUESTS;
}

/* ------------------------------------------------------------------ */
/*  Delegate to next-sanity but wrap with rate-limit guard             */
/* ------------------------------------------------------------------ */

const { GET: sanityDraftGet } = defineEnableDraftMode({
  client: client.withConfig({
    token: process.env.SANITY_API_READ_TOKEN,
  }),
});

export async function GET(request: Request) {
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headersList.get("x-real-ip") ||
    "unknown";

  if (isRateLimited(ip)) {
    return new NextResponse("Too many draft mode requests. Try again later.", {
      status: 429,
    });
  }

  return sanityDraftGet(request);
}
