# Architecture

## Rendering Strategy

The app is server-first.

- Route files in `src/app/**/page.tsx` are intentionally thin wrappers.
- Page implementation lives in `src/components/pages/**`.
- Shared layout and section modules are reused across routes.
- Client boundaries are constrained to interaction-only islands.

## App Shell

`src/app/layout.tsx` owns global composition and cross-route behavior:

- root metadata (Open Graph, Twitter, robots, canonical base)
- global navigation and footer
- theme provider
- skip link + semantic landmarks (`header`, `main`, `footer`)

## Client Component Inventory

These are the only `"use client"` files and why they require the client runtime:

- `src/app/error.tsx` — Next.js error boundary reset handler (`reset`) is interactive.
- `src/app/(pages)/insights/[slug]/error.tsx` — segment-level error boundary retry (`reset`) is interactive.
- `src/components/layout/footer-cta-variant.tsx` — route-aware CTA copy and navigation actions via pathname/router hooks.
- `src/components/layout/navbar-active-links.tsx` — dropdown open state, route-active highlighting, outside-click and Escape handling.
- `src/components/layout/mobile-menu.tsx` — menu state, focus trap, keyboard handling, and body scroll locking.
- `src/components/pages/contact/contact-form.tsx` — client form state and field-level validation feedback.
- `src/components/pages/insights/blog-post-detail-content.tsx` — tab state, hash synchronization, keyboard tablist navigation.
- `src/components/pages/insights/insights-catalog.tsx` — interactive category filtering and mobile dropdown control state.
- `src/components/sections/about-us-team-popup-controller.tsx` — hash-driven popup open/close and previous/next member transitions.
- `src/components/sections/process-step-switcher.tsx` — touch + button-driven step switching state.
- `src/components/sections/quote-rotator.tsx` — interval-driven quote rotation and reduced-motion checks.
- `src/components/sections/services.tsx` — hover/flip state and custom wheel-to-horizontal rail interaction.
- `src/components/sections/team-member-popup.tsx` — dialog lifecycle and keyboard/backdrop interactions.
- `src/components/sections/trust-authority-rail.tsx` — intersection observer and reduced-motion state for animation control.
- `src/components/theme-toggle.tsx` — theme state updates and transition class orchestration.
- `src/components/ui/scroll-progress-bar.tsx` — pointer drag + keyboard + resize/scroll synchronization.
- `src/components/ui/desktop-scroll-progress.tsx` — media-query gate that defers ScrollProgressBar to client-only rendering.
- `src/components/sections/testimonials.tsx` — mobile scroll-rail indicator state and initial scroll position.
- `src/components/pages/seo-services/seo-services-mobile-services-rail.tsx` — horizontal card rail indicator state.
- `src/components/pages/seo-services/seo-services-desktop-services-grid.tsx` — hover flip state for desktop service cards.
- `src/components/pages/content-creation/content-creation-mobile-solutions-rail.tsx` — mobile scroll-rail indicator state.
- `src/components/pages/keyword-strategy/keyword-strategy-mobile-solutions-rail.tsx` — mobile scroll-rail indicator state.

All remaining components are server components.

## Design Tokens and Theming

`src/app/globals.css` defines the semantic design token layer.

- `:root` and `.dark` define the same token keys.
- Tokens cover color, spacing, typography, radii, shadows, and motion values.
- Components consume semantic token-backed classes and CSS variables.

## Responsive Strategy

The app follows consistent breakpoints and mobile-first composition:

- mobile default (`<768px`)
- `md` tablet (`>=768px`)
- `lg` desktop (`>=1024px`)
- `xl` large desktop (`>=1280px`)

Touch targets and spacing are normalized for mobile navigation and interactive controls.

## Component Hierarchy

- `src/components/ui/*` — reusable primitives
- `src/components/layout/*` — app-level structural components
- `src/components/sections/*` — cross-page reusable content sections
- `src/components/pages/*` — route-specific page composition

This keeps composition predictable and avoids page-specific logic leaking into shared primitives.
