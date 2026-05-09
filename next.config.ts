import type { NextConfig } from "next";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const hasReactCompilerPlugin = (() => {
  try {
    require.resolve("babel-plugin-react-compiler");
    return true;
  } catch {
    return false;
  }
})();

const nextConfig: NextConfig = {
  // WHY: Remove framework signature bytes and surface area in responses.
  poweredByHeader: false,
  // WHY: Keep HTTP payload compression enabled for self-hosted/non-CDN paths.
  compress: true,
  // WHY: Preserve cache validation support for efficient conditional requests.
  generateEtags: true,
  // WHY: Enable React Compiler when the plugin is installed, without breaking minimal-install build environments.
  reactCompiler: hasReactCompilerPlugin,
  // cacheComponents disabled: incompatible with dynamic CMS routes using sanityFetch (uncached live data).
  reactStrictMode: true,
  // WHY: Per Nebojsa request 2026-05-09 — match legacy heroicrankings.com
  // URL paths exactly. Legacy URLs all use a trailing slash (e.g.
  // `/case-study/affinda/`). Setting `trailingSlash: true` makes the new
  // site's canonical form match — every internal Link gets a trailing
  // slash, and bare `/path` requests 308-redirect to `/path/`. Combined
  // with the route-folder renames in this commit family, the new site
  // serves the same paths the legacy site did, removing the need for
  // most legacy → new 308 redirects.
  trailingSlash: true,
  // WHY: No heavy server-only dependencies were detected in this repo.
  serverExternalPackages: [],
  // WHY: Improve image transfer efficiency and cacheability for Core Web Vitals.
  images: {
    formats: ["image/webp"],
    qualities: [75, 80, 95],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  experimental: {
    // WHY: Apply package-level import optimization for a barrel-export dependency in use.
    optimizePackageImports: ["next-themes"],
    // WHY: Prefer stricter CSS chunk splitting to reduce unused CSS on each route.
    cssChunking: "strict",
    // WHY: Inline route-critical CSS to improve first render/LCP.
    inlineCss: true,
    // WHY: Enable cache directives support in App Router.
    useCache: true,
    // WHY: Persist Turbopack filesystem cache across production builds for faster CI/local rebuilds.
    turbopackFileSystemCacheForBuild: true,
    // WHY: Reuse fetched RSC data in dev HMR cycles for faster local iteration.
    serverComponentsHmrCache: true,
    // WHY: Smooth page transitions using the View Transitions API.
    viewTransition: true,
    // WHY: Cache client-side Router Cache entries to avoid re-fetching RSC payloads on every navigation.
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },
  async redirects() {
    return [
      // WHY: Internal alias kept from prior naming. Phase 2.2 renamed
      // /case-studies → /case-study to match legacy heroicrankings.com.
      {
        source: "/case-study/number-artist",
        destination: "/case-study/diy-craft-ecom-brand",
        permanent: true,
      },

      // ---- Legacy heroicrankings.com → new IA (per docs/migration/redirect-map.md) ----
      // Order matters: specific paths first, parameterized catch-alls last.
      // All composed one-hop (Codex's "no chains" rule).

      // Service category pages now serve directly under /seo/* — no redirects needed.
      // (Phase 1 nested service routes under /seo/ to match legacy heroicrankings.com paths.)
      { source: "/seo/managed/", destination: "/blog", permanent: true },

      // 11 historical BCMS-internal redirects (composed one-hop into final URLs)
      {
        source: "/backlinks-management/",
        destination: "/blog/backlinks-management",
        permanent: true,
      },
      {
        source: "/how-to-create-a-link-building-strategy/",
        destination: "/blog/how-to-create-a-link-building-strategy",
        permanent: true,
      },
      {
        source: "/benefits-of-link-building/",
        destination: "/blog/benefits-of-link-building",
        permanent: true,
      },
      {
        source: "/lets-discuss-google-search-updates/",
        destination: "/blog/lets-discuss-google-search-updates",
        permanent: true,
      },
      {
        source: "/marketing/first-step-in-marketing-research-process/",
        destination: "/blog/first-step-in-marketing-research-process",
        permanent: true,
      },
      {
        source: "/marketing/ppc/seo-vs-google-ads/",
        destination: "/blog/seo-vs-google-ads",
        permanent: true,
      },
      { source: "/marketing/", destination: "/seo", permanent: true },
      { source: "/web-design-development/", destination: "/", permanent: true },
      {
        source: "/process-that-affects-visibility-of-website/",
        destination: "/blog/process-that-affects-visibility-of-website",
        permanent: true,
      },
      {
        source: "/seo/how-to-grow-your-business-online/",
        destination: "/blog/how-to-grow-your-business-online",
        permanent: true,
      },
      {
        source: "/seo/ranking-factors-seo/",
        destination: "/blog/ranking-factors-seo",
        permanent: true,
      },

      // Blog post catch-alls (parameterized — must come AFTER specific service-category rules above)
      {
        source: "/seo/:category/:slug/",
        destination: "/blog/:slug",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
        ],
      },
      {
        // WHY: Keep long-lived immutable caching for static assets served from public paths.
        source:
          "/(.*)\\.(js|css|woff2|woff|ttf|ico|svg|png|jpg|jpeg|webp|avif)$",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
