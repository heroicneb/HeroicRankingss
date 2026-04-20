# Heroic Rankings

Heroic Rankings is a production-ready multi-page SEO agency website built with Next.js App Router, server-first rendering, design tokens, and dark-mode/mobile parity.

## Tech Stack

- Next.js 16 (App Router, Server Components)
- React 19
- TypeScript (`strict: true`)
- Tailwind CSS v4
- CSS Custom Properties (design tokens)
- `next-themes` (dark mode)

## Getting Started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # Production build
npm run start    # Production server
npm run lint     # ESLint check
```

## Project Structure

```text
src/
  app/                          # Routes and app shell
    layout.tsx                  # Root layout, metadata, global providers
    globals.css                 # Design tokens (light + dark)
    (pages)/*/page.tsx          # Thin route wrappers
    privacy-policy/page.tsx     # Privacy policy route

  components/
    ui/                         # Reusable UI primitives
    layout/                     # Navbar, footer, layout-level interactive parts
    sections/                   # Shared sections used across multiple pages
    pages/                      # Page-specific composition and content

  lib/                          # Metadata, site config, tracking, helpers
  types/                        # Shared TypeScript types

public/                         # Static assets
```

## Design System

Colors, spacing, typography, radii, shadows, and motion tokens are defined in `src/app/globals.css` using CSS custom properties.

- `:root` defines light-mode defaults
- `.dark` defines dark-mode values for the same semantic token set
- Components consume semantic tokens instead of hardcoded colors

## Dark Mode

Dark mode is controlled with the `class` strategy on `<html>`.

- `next-themes` manages theme state
- `src/components/theme-toggle.tsx` handles user toggling
- All UI colors resolve through semantic token variables

## Adding a New Page

1. Create a route at `src/app/(pages)/<route>/page.tsx`.
2. Export page metadata via `createPageMetadata` from `src/lib/metadata.ts`.
3. Create page content in `src/components/pages/<route>/<route>-page.tsx`.
4. Compose from shared components in `src/components/ui/` and `src/components/sections/`.
5. Add the route to `src/app/sitemap.ts`.

## Adding a New Shared Component

1. Create the component in `src/components/ui/<name>.tsx`.
2. Type props with a dedicated interface.
3. Accept `className` overrides for composition.
4. Use design tokens (no hardcoded runtime colors).
5. Keep it server-compatible unless hooks/browser APIs are required.

## Key Conventions

- Server Components by default; add `"use client"` only for hooks/browser APIs
- Keep route files thin; put page logic in `src/components/pages/*`
- Use `@/` path alias for internal imports
- Use semantic token variables for all runtime color styling
- Preserve visual parity across desktop/mobile and light/dark modes
