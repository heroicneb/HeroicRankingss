import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { buildContentSecurityPolicy, CSP_NONCE_HEADER } from "@/lib/csp";

export function middleware(request: NextRequest) {
  // WHY: trailingSlash: true (next.config.ts) appends a slash to every
  // route INCLUDING /api/* — but App Router API route handlers register
  // at the no-slash form, so /api/chat/ POST 404s. Rewrite API paths
  // back to no-slash before route matching so /api/chat/ resolves to
  // src/app/api/chat/route.ts.
  const { pathname } = request.nextUrl;
  if (
    pathname.startsWith("/api/") &&
    pathname.endsWith("/") &&
    pathname !== "/api/"
  ) {
    const rewritten = request.nextUrl.clone();
    rewritten.pathname = pathname.slice(0, -1);
    return NextResponse.rewrite(rewritten);
  }

  const nonce = crypto.randomUUID();
  const csp = buildContentSecurityPolicy(nonce);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(CSP_NONCE_HEADER, nonce);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set("Content-Security-Policy", csp);
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  );
  // Pre-launch lockdown: hard block all crawlers at the HTTP level. Belt-
  // and-braces with the layout meta tag and robots.ts. Remove on cutover.
  response.headers.set(
    "X-Robots-Tag",
    "noindex, nofollow, noarchive, nosnippet, noimageindex",
  );

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|apple-icon.png|robots.txt|sitemap.xml).*)",
  ],
};
