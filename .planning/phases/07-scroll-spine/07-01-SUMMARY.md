---
phase: 07-scroll-spine
plan: 01
subsystem: ui
tags: [lenis, three.js, r3f, scroll, animation, camera]

# Dependency graph
requires:
  - phase: 06-foundation
    provides: /lab2 page with dynamic Lab2Scene import and viewport gate
provides:
  - Lenis smooth scroll infrastructure for /lab2 (LenisProvider, useScrollProgress, CHAPTERS config)
  - 6-chapter camera waypoint config with derived math helpers
  - 600vh scroll height for Lenis traversal
affects:
  - 07-02 (camera rig consumes useScrollProgress and CHAPTERS)
  - 07-03 (scene content organized by chapter positions)
  - Phase 08 (chapter positions tuned to real scene content)

# Tech tracking
tech-stack:
  added:
    - lenis (smooth scroll with lenis/react subpath export)
  patterns:
    - R3F addEffect drives Lenis RAF (single-loop, no dual-RAF jank)
    - Animation values via useRef not useState (no re-render on scroll)
    - CHAPTERS.length as single source of truth (no magic numbers)
    - autoRaf:false mandatory when R3F drives Lenis

key-files:
  created:
    - src/components/lab2/config/chapters.ts
    - src/components/lab2/hooks/useScrollProgress.ts
    - src/components/lab2/ui/LenisProvider.tsx
  modified:
    - src/app/[locale]/lab2/page.tsx
    - package.json
    - package-lock.json

key-decisions:
  - "autoRaf:false in LenisProvider — R3F addEffect drives Lenis RAF to prevent dual-loop 40fps drops"
  - "useRef for scroll progress — animation values never trigger React re-renders (STATE.md principle)"
  - "CHAPTERS.length as sole source of truth — CHAPTER_COUNT/STEP/helpers all derived, no magic numbers"
  - "Scroll spacer in document flow + fixed Canvas overlay pattern — Lenis needs DOM height to traverse"

patterns-established:
  - "R3F-Lenis integration: addEffect(() => lenisRef.current?.lenis?.raf(t)) with autoRaf:false"
  - "Scroll-to-R3F bridge: useLenis callback writing to useRef, consumed in useFrame"
  - "Config-driven constants: all chapter math derives from CHAPTERS array length"

requirements-completed: [SCRL-01, SCRL-02, SCRL-04]

# Metrics
duration: 8min
completed: 2026-02-28
---

# Phase 07 Plan 01: Scroll Spine — Lenis Infrastructure Summary

**Lenis smooth scroll installed and wired to R3F via addEffect with 6-chapter camera waypoint config and 600vh scroll spacer on /lab2**

## Performance

- **Duration:** ~8 min
- **Started:** 2026-02-28T00:00:00Z
- **Completed:** 2026-02-28
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments

- Installed lenis package; `lenis/react` subpath export available with no additional install
- Created CHAPTERS config with 6 placeholder camera waypoints — all math (CHAPTER_COUNT, CHAPTER_STEP, getChapterIndex, getChapterProgress) derived from CHAPTERS.length with zero magic numbers
- LenisProvider drives Lenis via R3F `addEffect` with `autoRaf: false` (single RAF loop, prevents dual-loop desync)
- useScrollProgress hook bridges Lenis animated progress (0-1) to a useRef readable in useFrame — no React re-renders on scroll
- /lab2 page wraps content with LenisProvider and adds 600vh scroll spacer in document flow; fixed Canvas overlay unchanged
- Production build passes cleanly (TypeScript + Next.js)

## Task Commits

Each task was committed atomically:

1. **Task 1: Install Lenis and create scroll infrastructure files** - `5176628` (feat)
2. **Task 2: Integrate LenisProvider and scroll spacer into /lab2 page** - `93ca514` (feat)

**Plan metadata:** (docs commit — created next)

## Files Created/Modified

- `src/components/lab2/config/chapters.ts` — 6-entry CHAPTERS array with placeholder Vector3 positions/lookAt targets and derived constants/helpers
- `src/components/lab2/hooks/useScrollProgress.ts` — useLenis callback writing to progressRef; DOM-to-R3F scroll bridge
- `src/components/lab2/ui/LenisProvider.tsx` — ReactLenis root with autoRaf:false, R3F addEffect drives raf(t)
- `src/app/[locale]/lab2/page.tsx` — LenisProvider wrapper + scroll spacer div (CHAPTER_COUNT * 100vh) added
- `package.json` / `package-lock.json` — lenis dependency added

## Decisions Made

- **autoRaf: false** — Lenis must not run its own requestAnimationFrame when R3F drives it via addEffect. Dual RAF causes ~40fps drops and scroll/render desync (documented in 07-RESEARCH.md pitfall 1).
- **useRef not useState** — Scroll progress is an animation value consumed every frame in useFrame. useState would trigger unnecessary React re-renders on every scroll event. This follows the STATE.md architectural decision.
- **CHAPTERS.length as single source of truth** — No hardcoded "6" in any logic path. CHAPTER_COUNT, CHAPTER_STEP, getChapterIndex, getChapterProgress all derive from the array. Adding/removing a chapter only requires editing the CHAPTERS array.
- **Scroll spacer in document flow** — Lenis intercepts native scroll on the root element. The page needs actual DOM height for Lenis to have scroll range. The Canvas stays fixed (not scrollable) as an overlay.

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- Scroll infrastructure is complete and the camera rig (Plan 02) can immediately consume `useScrollProgress` and `CHAPTERS`
- LenisProvider wraps /lab2 — smooth scroll is active on the route
- All 6 chapter waypoints are placeholder values; Phase 8 will tune positions to real scene content

---
*Phase: 07-scroll-spine*
*Completed: 2026-02-28*
