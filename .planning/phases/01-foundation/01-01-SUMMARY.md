---
phase: 01-foundation
plan: 01
subsystem: infrastructure
tags: [nextjs, tailwind-v4, i18n, next-intl, typescript]
requires: []
provides:
  - Next.js 16 project scaffold with TypeScript
  - Tailwind CSS v4 design system with Korean-optimized typography
  - next-intl i18n infrastructure with /ko and /en routing
  - Static generation setup for bilingual pages
affects:
  - All future phases depend on this foundation
  - Design tokens established for consistent styling
  - Translation infrastructure ready for content
tech-stack:
  added:
    - next@16.1.6
    - react@19.2.4
    - tailwindcss@4.1.18
    - @tailwindcss/postcss@4.1.18
    - next-intl@4.8.2
    - typescript@5.9.3
  patterns:
    - Next.js App Router with dynamic [locale] segments
    - Tailwind v4 CSS-first configuration via @theme blocks
    - next-intl middleware-based locale routing
    - Static site generation with generateStaticParams
key-files:
  created:
    - package.json
    - next.config.ts
    - tsconfig.json
    - postcss.config.mjs
    - proxy.ts
    - src/app/globals.css
    - src/app/[locale]/layout.tsx
    - src/app/[locale]/page.tsx
    - src/i18n/routing.ts
    - src/i18n/request.ts
    - src/i18n/navigation.ts
    - messages/ko.json
    - messages/en.json
  modified: []
decisions:
  - decision: Use Tailwind v4 CSS-first configuration
    rationale: v4 replaces JS config with @theme blocks in CSS for better performance and simpler setup
    impact: All styling uses CSS custom properties defined in globals.css
  - decision: Use @tailwindcss/postcss plugin
    rationale: Required for Tailwind v4 PostCSS integration in Next.js builds
    impact: Added as dependency, configured in postcss.config.mjs
  - decision: Use getTranslations for async server components
    rationale: Next.js 16 async components cannot use hooks like useTranslations
    impact: All server components must use getTranslations from next-intl/server
  - decision: Pretendard Variable font via CDN
    rationale: Optimal Korean typography without self-hosting font files
    impact: Font loaded from jsDelivr, defined in --font-sans token
metrics:
  duration: 6 minutes
  completed: 2026-02-11
---

# Phase 1 Plan 1: Foundation Infrastructure Summary

**One-liner:** Next.js 16 scaffold with Tailwind v4 CSS design tokens and next-intl bilingual routing (/ko, /en) using Pretendard typography

## What Was Built

### Core Infrastructure
- **Next.js 16 Project**: TypeScript-first setup with App Router, Turbopack dev server, ESLint
- **Tailwind CSS v4 Design System**: CSS-first configuration with @theme blocks defining neutral color palette (50-950), primary accent (oklch blue), and Pretendard Variable font stack
- **i18n Infrastructure**: next-intl middleware routing with /ko (default) and /en locales, translation files, and navigation utilities
- **Static Generation**: generateStaticParams for pre-rendering both locale routes at build time

### Design Tokens Established
```css
--font-sans: "Pretendard Variable", "Pretendard", system fonts...
--color-neutral-50 through --color-neutral-950 (gray scale)
--color-primary-500: oklch(0.55 0.15 250) (subtle blue accent)
--color-primary-600: oklch(0.48 0.16 250)
```

### Translation Structure
- **Korean (default)**: 박훈일 | 프론트엔드 개발자 | 깔끔하고 정교한 웹 경험
- **English**: Hunil Park | Frontend Developer | Crafting clean and refined web experiences
- Navigation keys: home, about, skills, projects, experience, education, contact

## Tasks Completed

| Task | Name | Commit | Key Files |
|------|------|--------|-----------|
| 1 | Scaffold Next.js project and configure Tailwind v4 | 280d29d | package.json, next.config.ts, tsconfig.json, postcss.config.mjs, globals.css |
| 2 | Set up next-intl i18n infrastructure with locale routing | ae5fff9 | proxy.ts, i18n/*.ts, messages/*.json, [locale]/layout.tsx, [locale]/page.tsx |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Added @tailwindcss/postcss dependency**
- **Found during:** Task 2 verification
- **Issue:** Build failed with error "The PostCSS plugin has moved to a separate package". Tailwind v4 requires @tailwindcss/postcss instead of tailwindcss as PostCSS plugin.
- **Fix:** Installed @tailwindcss/postcss@4.1.18 and updated postcss.config.mjs to use '@tailwindcss/postcss' plugin
- **Files modified:** package.json, postcss.config.mjs
- **Commit:** ae5fff9

**2. [Rule 1 - Bug] Fixed CSS @import order**
- **Found during:** Task 2 dev server testing
- **Issue:** Dev server compilation failed with "Parsing CSS source code failed: @import rules must precede all rules". Pretendard font @import appeared after Tailwind @import and @theme block.
- **Fix:** Moved Pretendard font @import to the very top of globals.css, before Tailwind @import
- **Files modified:** src/app/globals.css
- **Commit:** ae5fff9

**3. [Rule 1 - Bug] Changed useTranslations to getTranslations in async component**
- **Found during:** Task 2 build verification
- **Issue:** Build failed with "useTranslations is not callable within an async component". Next.js 16 server components that are async cannot use hooks.
- **Fix:** Changed useTranslations to getTranslations and imported from 'next-intl/server' instead of 'next-intl'
- **Files modified:** src/app/[locale]/page.tsx
- **Commit:** ae5fff9

## Decisions Made

### Technical Decisions
1. **Tailwind v4 CSS-first configuration**: Replaced traditional JS config with @theme blocks in globals.css for better performance and alignment with v4 architecture
2. **Pretendard Variable via CDN**: Used jsDelivr CDN for Korean typography to avoid build-time font management
3. **getTranslations for async components**: Adopted server-side translation API for Next.js 16 async component compatibility

### Architecture Decisions
1. **[locale] dynamic segment pattern**: All routes nested under [locale] for automatic locale handling
2. **Static generation with generateStaticParams**: Pre-render both locales at build time for optimal performance
3. **Middleware-based routing**: Use next-intl's proxy.ts middleware for automatic locale detection and routing

## Verification Results

### Dev Server
- ✅ `npm run dev` starts without errors
- ✅ Server runs on localhost:3000 (or next available port)
- ✅ No compilation errors
- ✅ Hot reload works

### Build
- ✅ `npm run build` completes successfully
- ✅ Static pages generated for /[locale] (/ko, /en)
- ✅ TypeScript compilation passes
- ✅ No CSS optimization errors (previous warning resolved)

### Routing
- ✅ `/` redirects to `/ko` (default locale)
- ✅ `/ko` serves Korean content
- ✅ `/en` serves English content
- ✅ Locale-specific translations load correctly

### Design System
- ✅ Tailwind design tokens defined and accessible
- ✅ Pretendard font loads from CDN
- ✅ Color palette (neutral + primary) working
- ✅ No tailwind.config.js/ts exists (v4 CSS-only config confirmed)

## Next Phase Readiness

### Ready for Phase 1 Continuation
- ✅ Development environment fully operational
- ✅ Build pipeline verified (dev, build, start)
- ✅ i18n infrastructure ready for content
- ✅ Design system ready for component styling
- ✅ TypeScript configuration with path aliases (@/*)
- ✅ ESLint configured for Next.js

### Blockers/Concerns
None. All verification criteria passed.

### Notes for Future Plans
1. **Design tokens usage**: Use `text-neutral-900`, `text-primary-500`, `font-sans` classes throughout
2. **Translation pattern**: Add new keys to both messages/ko.json and messages/en.json
3. **Page creation**: All pages must be under src/app/[locale]/ and call setRequestLocale(locale)
4. **Async components**: Always use getTranslations from 'next-intl/server', not useTranslations hook
5. **Params handling**: All params are Promises in Next.js 16 - always `await params` before access

## Links to Artifacts

- **Plan**: `.planning/phases/01-foundation/01-01-PLAN.md`
- **Commits**: 280d29d, ae5fff9
- **Key Files**: See key-files.created in frontmatter
