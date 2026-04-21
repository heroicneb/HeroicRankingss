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
  // WHY: No heavy server-only dependencies were detected in this repo.
  serverExternalPackages: [],
  // WHY: Improve image transfer efficiency and cacheability for Core Web Vitals.
  images: {
    formats: ["image/webp"],
    qualities: [75, 95],
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
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
        ],
      },
      {
        // WHY: Keep long-lived immutable caching for static assets served from public paths.
        source: "/(.*)\\.(js|css|woff2|woff|ttf|ico|svg|png|jpg|jpeg|webp|avif)$",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
