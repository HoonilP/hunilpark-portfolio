---
phase: 08-3d-scenes
plan: 01
subsystem: ui
tags: [three.js, react-three-fiber, drei, particles, visibility-toggle, texture-plane]

# Dependency graph
requires:
  - phase: 07-scroll-spine
    provides: CameraRig scroll-driven camera path, useScrollProgress hook, chapters.ts config
provides:
  - SceneManager: visibility-toggle architecture mounting 6 chapter groups unconditionally
  - ParticleField: ambient 2000-particle system across full camera path volume
  - TexturePlane: reusable useTexture-based plane for displaying project WebP images
  - chapters.ts extended with projectId/translationKey metadata and spaced Z-axis waypoints
affects: [08-02-scenes, phase-09-typography, phase-10-animation]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Visibility-toggle: all scene groups mounted unconditionally, visible driven by group.visible in useFrame"
    - "Particle positions via useMemo Float32Array — generated once, never recreated per render"
    - "bufferAttribute uses args=[array, itemSize] constructor pattern (required by R3F 9.5.0)"
    - "useTexture from drei for Suspense-aware texture loading with URL-based caching"

key-files:
  created:
    - src/components/lab2/scene/SceneManager.tsx
    - src/components/lab2/scene/ParticleField.tsx
    - src/components/lab2/scene/shared/TexturePlane.tsx
  modified:
    - src/components/lab2/config/chapters.ts

key-decisions:
  - "bufferAttribute requires args=[array, itemSize] in R3F 9.5.0 — plain array/count/itemSize props cause TS2741 error"
  - "ParticleField z-range (5 to -35) sized to cover entire camera path from chapter 0 to chapter 5"
  - "SceneManager groups positioned at lookAt focal centers (not camera positions) so scene content is centered in frame"

patterns-established:
  - "Pattern: R3F bufferAttribute uses args=[Float32Array, itemSize] constructor signature"
  - "Pattern: SceneManager placeholder colored meshes identify chapters during development"

requirements-completed: [SCENE-03, SCENE-05]

# Metrics
duration: 2min
completed: 2026-03-01
---

# Phase 08 Plan 01: Scene Infrastructure Summary

**Visibility-toggle SceneManager with 6 chapter groups, 2000-particle ParticleField, and reusable TexturePlane — full scene infrastructure for Phase 8 project scenes**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-01T04:09:50Z
- **Completed:** 2026-03-01T04:11:29Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments
- Extended `chapters.ts` with `projectId` and `translationKey` fields mapping 5 project chapters to public folder IDs and i18n keys; updated camera waypoints spaced 6 units apart on Z axis (-2 to -26 camera positions, lookAt targets at -5 to -29)
- Created `SceneManager.tsx` using visibility-toggle architecture: all 6 groups permanently mounted, `group.visible` driven by `getChapterIndex(progressRef.current)` each frame — no conditional mounting, no shader recompilation stutter
- Created `ParticleField.tsx` with 2000 ambient particles in `useMemo` Float32Array covering z=5 to z=-35 volume; 0.003 rad/s y-rotation; `depthWrite={false}` prevents transparency artifacts
- Created `TexturePlane.tsx` wrapping `useTexture` from drei for Suspense-aware WebP loading with 3.2:2 default aspect ratio

## Task Commits

Each task was committed atomically:

1. **Task 1: Extend chapters.ts with project metadata and waypoints** - `a3bbd4e` (feat)
2. **Task 2: Create SceneManager, ParticleField, TexturePlane** - `8e94f6f` (feat)

## Files Created/Modified
- `src/components/lab2/config/chapters.ts` - Added projectId/translationKey to Chapter interface; updated all 6 waypoints for spaced Z layout
- `src/components/lab2/scene/SceneManager.tsx` - Visibility-toggle scene manager with 6 chapter groups and placeholder colored meshes
- `src/components/lab2/scene/ParticleField.tsx` - 2000-point ambient particle system across full camera path
- `src/components/lab2/scene/shared/TexturePlane.tsx` - Reusable useTexture plane component for project WebP display

## Decisions Made
- `bufferAttribute` in R3F 9.5.0 requires `args=[array, itemSize]` constructor pattern (not standalone `array`/`count`/`itemSize` props) — discovered via TS2741 error during verification; auto-fixed inline
- SceneManager group positions match the lookAt focal centers from `chapters.ts` (not camera positions) so scene content is centered in frame when camera looks at each chapter
- ParticleField z-range 5 to -35 covers full camera path (chapter 0 at z=5 through chapter 5 looking at z=-29)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed bufferAttribute missing args prop**
- **Found during:** Task 2 (ParticleField TypeScript verification)
- **Issue:** R3F 9.5.0 requires `args=[array, itemSize]` for `bufferAttribute` constructor; using `count`/`array`/`itemSize` as separate props caused TS2741 "Property 'args' is missing" error
- **Fix:** Changed `<bufferAttribute attach="attributes-position" count={PARTICLE_COUNT} array={positions} itemSize={3} />` to `<bufferAttribute attach="attributes-position" args={[positions, 3]} />`
- **Files modified:** src/components/lab2/scene/ParticleField.tsx
- **Verification:** `npx tsc --noEmit` passes with no errors
- **Committed in:** 8e94f6f (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 - Bug: incorrect bufferAttribute prop pattern)
**Impact on plan:** Required fix for TypeScript correctness. No scope creep.

## Issues Encountered
- `bufferAttribute` constructor API in R3F 9.5.0 differs from code examples in research doc (which used separate props). The TypeScript error was clear and the fix was straightforward.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Scene infrastructure complete: SceneManager, ParticleField, TexturePlane all ready for Plan 02 to import
- Plan 02 will replace placeholder meshes in SceneManager with IntroScene + 5 ProjectScene components
- TexturePlane ready for use in project scenes — call `useTexture.preload(url)` at module level per scene file to pre-upload textures
- chapters.ts projectId/translationKey available for project scenes to derive asset paths (`/projects/{projectId}/hero.webp`)

---
*Phase: 08-3d-scenes*
*Completed: 2026-03-01*
