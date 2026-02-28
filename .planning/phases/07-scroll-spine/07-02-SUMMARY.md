---
phase: 07-scroll-spine
plan: 02
subsystem: ui
tags: [three.js, r3f, gsap, scroll, camera, animation, useFrame]

# Dependency graph
requires:
  - phase: 07-01
    provides: useScrollProgress hook (progressRef), CHAPTERS config (6 waypoints with position/lookAt), LenisProvider (smooth scroll infrastructure)
provides:
  - CameraRig component: useFrame-based camera interpolation reading scrollProgress ref
  - Camera lerps position AND lookAt between 6 chapter waypoints — no snapping at boundaries
  - Scroll spine complete: Lenis smooth scroll + cinematic camera movement through 3D space
affects: [08-room-setup, 09-chapter-content, 10-lighting, 11-polish]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "CameraRig renders null — pure logic component, no JSX, mounted inside Canvas"
    - "LERP_FACTOR = 0.05 at module level — avoids recreation on every render"
    - "Separate currentLookAt ref — lerped independently to prevent lookAt snapping"
    - "useRef for interpolation targets (targetPos, targetLookAt) — reused every frame, zero allocation"
    - "lerpVectors between waypoints then camera.position.lerp toward target — two-stage smoothing"

key-files:
  created:
    - src/components/lab2/scene/CameraRig.tsx
  modified:
    - src/components/lab2/Lab2Scene.tsx
    - src/components/lab2/ui/LoadingScreen.tsx

key-decisions:
  - "LERP_FACTOR 0.05 for gentle camera lag — Lenis inertia + camera lag = cinematic combined effect"
  - "Separate currentLookAt ref initialized to (0,0,0) — prevents initial snap from camera start position"
  - "CameraRig placed first inside Suspense — conventional ordering for control/logic components"
  - "LoadingScreen auto-dismiss when no assets (Rule 1 bug fix) — avoids stuck loading screen on empty scene"

patterns-established:
  - "Two-stage camera smoothing: waypoint lerp (chapter-local t) + camera.lerp (LERP_FACTOR) stacked"
  - "lookAt handled via separate currentLookAt ref — never call camera.lookAt with un-lerped target"
  - "Pure logic R3F component pattern: 'use client', returns null, all logic in useFrame"

requirements-completed: [SCRL-02, SCRL-03, SCRL-04]

# Metrics
duration: ~20min
completed: 2026-02-28
---

# Phase 7 Plan 02: Scroll Spine CameraRig Summary

**CameraRig component with two-stage Vector3 lerp reads Lenis scroll progress and interpolates camera position and lookAt across 6 chapter waypoints at 60fps via useFrame**

## Performance

- **Duration:** ~20 min
- **Started:** 2026-02-28
- **Completed:** 2026-02-28
- **Tasks:** 2 (1 auto + 1 human-verify)
- **Files modified:** 3

## Accomplishments

- CameraRig.tsx created: null-rendering R3F component using useFrame to read scrollProgress ref and drive camera through 6 waypoints
- Camera position AND lookAt independently lerped — eliminates snapping at chapter boundaries (research pitfall 5)
- Two-stage smoothing: chapter-local t for waypoint interpolation + LERP_FACTOR 0.05 for camera lag on top of Lenis inertia
- Bug fix: LoadingScreen auto-dismisses when no assets to load — avoids stuck spinner on empty scene
- Human verification approved: smooth scroll confirmed in browser, camera traverses all 6 positions, no jank

## Task Commits

Each task was committed atomically:

1. **Task 1: Create CameraRig and mount in Lab2Scene** - `adf69b3` (feat)
2. **Auto-fix: LoadingScreen dismiss when no assets** - `ef59a7b` (fix)
3. **Task 2: Verify scroll-driven camera movement in browser** - human-verified (approved, no commit)

**Plan metadata:** (docs commit — see below)

## Files Created/Modified

- `src/components/lab2/scene/CameraRig.tsx` - useFrame-based camera rig reading scrollProgress ref, lerps position and lookAt between CHAPTERS waypoints with LERP_FACTOR 0.05
- `src/components/lab2/Lab2Scene.tsx` - Added CameraRig import and mount inside Canvas/Suspense
- `src/components/lab2/ui/LoadingScreen.tsx` - Auto-dismiss when no assets to load (bug fix)

## Decisions Made

- LERP_FACTOR 0.05 chosen as sweet spot (range 0.03-0.08) — adds gentle camera lag that stacks on Lenis inertia for cinematic combined effect
- `currentLookAt` ref initialized to (0,0,0) matching first chapter's lookAt — prevents initial snap when camera starts at non-zero lookAt
- `LERP_FACTOR` defined at module level (not inside component) — avoids object recreation on every render cycle
- `targetPos` and `targetLookAt` as useRef — reused every frame with no allocation

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed LoadingScreen stuck when scene has no assets**
- **Found during:** Task 1 verification (build + browser check)
- **Issue:** LoadingScreen relied on `useProgress` reaching 100% to dismiss, but empty scene with no assets never triggered progress completion — screen stayed visible indefinitely
- **Fix:** Added early dismiss condition: if `total === 0` after minimum display time, treat as loaded and dismiss
- **Files modified:** `src/components/lab2/ui/LoadingScreen.tsx`
- **Verification:** /lab2 now shows scene immediately without stuck loading screen
- **Committed in:** `ef59a7b` (separate fix commit)

---

**Total deviations:** 1 auto-fixed (1 bug fix)
**Impact on plan:** Bug fix necessary for basic functionality — loading screen would block all verification without it. No scope creep.

## Issues Encountered

None beyond the auto-fixed LoadingScreen bug. CameraRig implementation followed plan spec exactly — useFrame interpolation, LERP_FACTOR 0.05, separate currentLookAt ref, lerpVectors between waypoints.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Scroll spine complete: Lenis smooth scroll + CameraRig waypoint traversal both operational
- Camera moves through all 6 chapter positions as scroll progresses 0-100%
- Both /ko/lab2 and /en/lab2 verified working
- Ready for Phase 8: Room/environment setup with visible 3D content at each chapter waypoint

## Self-Check: PASSED

- FOUND: `src/components/lab2/scene/CameraRig.tsx`
- FOUND: `src/components/lab2/Lab2Scene.tsx`
- FOUND: `src/components/lab2/ui/LoadingScreen.tsx`
- FOUND: `.planning/phases/07-scroll-spine/07-02-SUMMARY.md`
- FOUND commit: `adf69b3` (feat(07-02): create CameraRig and mount in Lab2Scene)
- FOUND commit: `ef59a7b` (fix(lab2): dismiss loading screen when no assets to load)

---
*Phase: 07-scroll-spine*
*Completed: 2026-02-28*
