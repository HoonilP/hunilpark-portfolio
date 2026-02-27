---
phase: 06-foundation
plan: 01
subsystem: ui
tags: [three.js, react-three-fiber, drei, next-intl, webgl, i18n]

# Dependency graph
requires: []
provides:
  - /lab2 i18n route with layout.tsx (server) and page.tsx (client)
  - Lab2Scene.tsx R3F Canvas root with Suspense and Preload
  - EmptyScene.tsx placeholder 3D content with ambient lighting and grid
  - LoadingScreen.tsx with useProgress-based real progress display and fade-out
  - ViewportGate.tsx desktop-only gate with back link for viewports < 1024px
  - useViewportWidth.ts SSR-safe hook returning null on server
  - Lab2 i18n namespace in ko.json and en.json
  - transpilePackages: ['three'] in next.config.ts
affects: [07-environment, 08-objects, 09-interactions, 10-scroll, 11-polish]

# Tech tracking
tech-stack:
  added: [transpilePackages three config]
  patterns: [dynamic SSR-false Canvas import, SSR-safe viewport hook, useProgress loading screen, viewport gate pattern]

key-files:
  created:
    - src/app/[locale]/lab2/layout.tsx
    - src/app/[locale]/lab2/page.tsx
    - src/components/lab2/Lab2Scene.tsx
    - src/components/lab2/EmptyScene.tsx
    - src/components/lab2/ui/LoadingScreen.tsx
    - src/components/lab2/ui/ViewportGate.tsx
    - src/components/lab2/hooks/useViewportWidth.ts
  modified:
    - next.config.ts
    - messages/ko.json
    - messages/en.json

key-decisions:
  - "useProgress (drei) for loading — avoids fake timer pattern from /lab"
  - "null return on server for viewport hook — prevents hydration mismatch"
  - "Minimum 800ms loading screen display — ensures percentage is briefly visible even with empty scene"
  - "Dynamic import with ssr:false for Lab2Scene — Three.js not in server bundle"

patterns-established:
  - "Lab2 components use 'use client' directive at top"
  - "Viewport gate pattern: useViewportWidth returns null (SSR) → nothing rendered until hydrated"
  - "Canvas background #080808 (near-black, slightly warm)"
  - "Loading screen shows percentage number only — no text, no progress bar"

requirements-completed: [FOUND-01, FOUND-02, FOUND-03, FOUND-04]

# Metrics
duration: 3min
completed: 2026-02-28
---

# Phase 6 Plan 01: Foundation Summary

**/lab2 route with R3F WebGL canvas, useProgress loading screen, and 1024px viewport gate using drei and next-intl**

## Performance

- **Duration:** ~3 min
- **Started:** 2026-02-27T18:14:13Z
- **Completed:** 2026-02-27T18:17:36Z
- **Tasks:** 3
- **Files modified:** 10

## Accomplishments
- Created /ko/lab2 and /en/lab2 routes (HTTP 200) with full i18n support via next-intl
- Built R3F Canvas pipeline with real useProgress loading screen (not fake timer)
- Implemented SSR-safe viewport gate that instantly toggles below/above 1024px
- Added transpilePackages: ['three'] to next.config.ts for webpack ESM compatibility
- Production build passes cleanly with both routes statically generated

## Task Commits

Each task was committed atomically:

1. **Task 1: Create /lab2 route structure with i18n and config** - `4e63e1f` (feat)
2. **Task 2: Create Lab2 components — Scene, LoadingScreen, ViewportGate, hook** - `e2b46d4` (feat)
3. **Task 3: Verify dev server renders /lab2 correctly** - verification only, no new files

**Plan metadata:** (docs commit below)

## Files Created/Modified
- `src/app/[locale]/lab2/layout.tsx` - Server component with setRequestLocale + generateStaticParams
- `src/app/[locale]/lab2/page.tsx` - Client component with dynamic Lab2Scene and viewport gate
- `src/components/lab2/Lab2Scene.tsx` - R3F Canvas root with Suspense, Preload, EmptyScene
- `src/components/lab2/EmptyScene.tsx` - Placeholder scene with ambient light and grid helper
- `src/components/lab2/ui/LoadingScreen.tsx` - useProgress loading with 800ms min display + fade-out
- `src/components/lab2/ui/ViewportGate.tsx` - Full-screen gate for viewports < 1024px
- `src/components/lab2/hooks/useViewportWidth.ts` - SSR-safe window width hook
- `next.config.ts` - Added transpilePackages: ['three']
- `messages/ko.json` - Added Lab2 namespace and lab2 Navigation key
- `messages/en.json` - Added Lab2 namespace and lab2 Navigation key

## Decisions Made
- Used `useProgress` from drei instead of fake timer (existing /lab uses fake timer) — ensures real loading feedback
- `useViewportWidth` returns `null` on server to prevent hydration mismatch, page renders nothing until hydrated
- Added 800ms minimum display time for loading screen so percentage number is briefly visible even with empty scene
- LoadingScreen shows only the percentage number `{Math.round(progress)}` — no label text, no progress bar

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- /lab2 route infrastructure complete and build-verified
- EmptyScene ready to be replaced with real 3D environment in Phase 7/8
- All component interfaces established for downstream phases (Lab2Scene, ViewportGate, LoadingScreen)
- Blocker remains: Turbopack GLSL compatibility not tested (mitigation: inline template literals in future phases)

## Self-Check: PASSED

All created files verified to exist:
- FOUND: src/app/[locale]/lab2/layout.tsx
- FOUND: src/app/[locale]/lab2/page.tsx
- FOUND: src/components/lab2/Lab2Scene.tsx
- FOUND: src/components/lab2/EmptyScene.tsx
- FOUND: src/components/lab2/ui/LoadingScreen.tsx
- FOUND: src/components/lab2/ui/ViewportGate.tsx
- FOUND: src/components/lab2/hooks/useViewportWidth.ts

All commits verified:
- FOUND: 4e63e1f feat(06-01): create /lab2 route structure with i18n and config
- FOUND: e2b46d4 feat(06-01): create Lab2 components

---
*Phase: 06-foundation*
*Completed: 2026-02-28*
