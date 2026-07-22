# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ABLux Travel — a Serbian travel agency website (turisticka-agencija). Built with Next.js 16 (App Router), React 19, Convex as the backend/database, Tailwind CSS v4, and GSAP for animations. Bilingual (Serbian Latin / English) with dark/light theme support.

## Commands

- **Dev server:** `npm run dev` (uses `--webpack` flag)
- **Build:** `npm run build`
- **Lint:** `npm run lint` (ESLint 9 flat config with Next.js core-web-vitals + TypeScript rules)
- **Convex dev:** `npx convex dev` (runs Convex backend in dev mode, syncs schema/functions)

No test framework is configured.

## Architecture

### Routing (App Router)

All routes use Serbian names:
- `/` — homepage
- `/aranzmani` — travel packages list; `/aranzmani/[slug]` — package detail
- `/putovanja` — trips/destinations; `/putovanja/[zemlja]` — country page
- `/verski-turizam` — religious tourism
- `/o-nama` — about; `/kontakt` — contact; `/zemlje` — countries
- `/signin`, `/signup`, `/auth` — authentication pages
- `/admin` — admin dashboard with sub-sections: `aranzmani`, `putovanja`, `verski-turizam`, `podesavanja`
- `/ponuda` permanently redirects to `/aranzmani` (configured in next.config.ts)

### Backend (Convex)

`convex/` contains the database schema and server functions. Key tables: `trips`, `accommodations`, `offers`, `slides`, `users`, `settings`, `sources`. Generated types are in `convex/_generated/` (gitignored from lint). The Convex client is initialized in `app/providers.tsx` and wraps the app via `ConvexProvider`.

Server function files: `auth.ts`, `trips.ts`, `accommodations.ts`, `offers.ts`, `slides.ts`, `settings.ts`, `files.ts`.

### Client-side Data Layer

Custom hooks in `lib/` wrap Convex queries/mutations: `use-trips.ts`, `use-accommodations.ts`, `use-offers.ts`, `use-slides.ts`, `use-settings.ts`, `use-session.ts`.

### Internationalization

`lib/i18n.ts` contains a `DICTIONARY` object with full `sr` and `en` translations. The `SitePreferencesProvider` (in `components/site-preferences-provider.tsx`) provides `language`, `theme`, and `dictionary` via React context. Access translations with `useSitePreferences().dictionary`.

Language/theme preferences are stored in localStorage (`ablux_language`, `ablux_theme`). Theme is also applied via a blocking `<script>` in root layout to prevent FOUC.

### Authentication

Local/client-side auth using localStorage (`lib/local-auth.ts`). Session stored under `abluxtravel2022_session`. Admin bootstrap runs on mount via `AdminBootstrap` in providers to ensure an admin user exists in Convex (`convex/auth.ts`).

### Admin System

Admin editors are large client components in `components/`: `aranzmani-editor.tsx`, `trip-editor.tsx`, `accommodation-editor.tsx`, `religious-offers-editor.tsx`. Each admin page at `/admin/*` renders the corresponding editor. `PageAdminEditorDock` component shows inline edit shortcuts on public pages for admin users.

Admin section config is defined in `lib/admin-editors.ts` with `AdminSectionKey` type.

### Styling

Tailwind CSS v4 via PostCSS (`@tailwindcss/postcss`). Global styles in `app/globals.css`. Fonts: Manrope (body) and Sora (headings), loaded via `next/font/google` with CSS variables `--font-manrope` and `--font-sora`. Custom CSS classes use a design-system-like naming: `surface-strong`, `section-holo`, `fx-lift`, `text-muted`, `site-fade`, `stagger-grid`.

### Path Aliases

`@/*` maps to project root (tsconfig paths). Use `@/lib/...`, `@/components/...`, `@/convex/...`, `@/app/...`.

### Animations (GSAP)

- **React Integration:** Always use the `@gsap/react` package and the `useGSAP` hook for animations to ensure proper cleanup in React 19.
- **Scroll-Bound Video:** For video scrubbing animations, strictly map `video.currentTime` directly to a GSAP `ScrollTrigger` timeline. Do NOT mix `.play()` or native playback with scroll-scrubbing, as this causes desynchronization.
- **Transitions:** Handle heavy visual transitions (e.g., masks, overlay sweeps) using optimized DOM elements (WebP/PNG/Lottie) animated via CSS transforms (`y`, `x`) on a shared timeline with the video, rather than rendering them directly into the video file.

### Key Patterns

- Country slugs are generated via `lib/country-route.ts` which handles Serbian character latinization (đ→dj, č→c, š→s, ž→z)
- SEO constants centralized in `lib/seo.ts`
- Image optimization configured for AVIF and WebP formats (`next.config.ts`)
- Components use `"use client"` directive extensively since most pages rely on Convex real-time queries and browser APIs

## Payment & Cart Architecture (Stripe)

- **Cart State:** Managed globally (recommend creating `lib/store/use-cart-store.ts` with Zustand) and synced with `localStorage`.
- **Pricing Enforcement:** All Convex schemas (`trips`, `accommodations`, `offers`) must support a `price` field (number). UI must handle displaying prices dynamically.
- **Navbar Integration:** The cart icon must sit perfectly inline with the Theme and Language switchers inside the Navbar component. On mobile, it must be fixed at the top alongside them.
- **Stripe Setup:** Stripe integration requires Convex Node.js actions (`convex/stripe.ts` for checkout sessions) and Convex HTTP actions (`convex/http.ts` for webhooks).
- **Phase 1 (Standby Mode):** We are in a pre-live phase. `NEXT_PUBLIC_STRIPE_LIVE=false` must be strictly respected. When false, the final checkout does not redirect to Stripe; instead, it triggers an internal Convex action to send an email order to the admin.