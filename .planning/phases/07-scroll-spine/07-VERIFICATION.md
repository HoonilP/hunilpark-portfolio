---
phase: 07-scroll-spine
verified: 2026-02-28T12:00:00Z
status: human_needed
score: 7/8 must-haves verified
re_verification: false
human_verification:
  - test: "Scroll through /ko/lab2 from top to bottom"
    expected: "Lenis characteristic elastic/inertial scroll feel — not native browser scroll. Camera moves through 3D space; grid helper and lighting show clearly different perspectives at each chapter stop. No snap or jump at chapter boundaries."
    why_human: "Smooth scroll feel and camera motion are perceptual — grep cannot verify scroll inertia, camera continuity, or absence of visual snapping."
  - test: "Chrome DevTools Performance tab — record scroll through full 600vh"
    expected: "No Long Tasks (red bars) during scroll. Frame rate stays ~60fps throughout."
    why_human: "Runtime performance cannot be verified statically. Long Tasks are only visible in a live profiling session."
  - test: "Scroll back to top from bottom"
    expected: "Camera returns to intro position (looking at grid from approximately [0, 2, 5]). Reverse traversal feels identical to forward."
    why_human: "Bidirectional camera traversal requires visual inspection of 3D scene."
---

# Phase 7: Scroll Spine Verification Report

**Phase Goal:** 스크롤이 6개 챕터 웨이포인트 사이를 부드럽게 이동하는 카메라 경로 스토리텔링의 척추(spine)가 완성된다 — 이것이 전체 경험의 핵심이며 나머지는 그 위의 장식이다
**Verified:** 2026-02-28
**Status:** human_needed
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths (from Phase 7 Success Criteria)

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | 페이지 전체에서 스크롤이 Lenis 특유의 부드럽고 탄성 있는 느낌으로 동작한다 | ? HUMAN | LenisProvider confirmed wired with `lerp: 0.08, duration: 1.2` and `autoRaf: false` — inertial feel requires browser verification |
| 2 | 스크롤 위치에 따라 카메라가 6개 웨이포인트를 부드럽게 이동하며 챕터가 전환된다 | ? HUMAN | CameraRig useFrame logic confirmed correct — visual smoothness and waypoint transitions require browser verification |
| 3 | Chrome Performance 탭에서 스크롤 중 Long Task가 없다 (60fps 유지) | ? HUMAN | Single-RAF architecture verified (addEffect + autoRaf: false) — runtime 60fps requires live profiling |
| 4 | 챕터 경계가 config 상수에서 파생되며 코드 어느 곳에도 매직 넘버 없이 동작한다 | ✓ VERIFIED | `CHAPTER_COUNT = CHAPTERS.length`; page uses `CHAPTER_COUNT * 100vh`; CameraRig uses `CHAPTER_COUNT` throughout; only numeric literals in chapters.ts are Vector3 coordinates — no hardcoded `6` in logic paths |

**Score:** 4/4 truths verified or awaiting human check (1 fully verified, 3 need human)

---

## Required Artifacts

### Plan 07-01 Artifacts

| Artifact | Provides | Exists | Substantive | Wired | Status |
|----------|----------|--------|-------------|-------|--------|
| `src/components/lab2/ui/LenisProvider.tsx` | ReactLenis root wrapper with addEffect RAF sync | Yes | Yes (43 lines, real impl) | Yes (imported + used in page.tsx) | ✓ VERIFIED |
| `src/components/lab2/hooks/useScrollProgress.ts` | DOM-to-R3F scroll progress bridge via useRef | Yes | Yes (23 lines, real impl) | Yes (imported + used in CameraRig.tsx) | ✓ VERIFIED |
| `src/components/lab2/config/chapters.ts` | 6 chapter waypoints with position/lookAt + derived constants | Yes | Yes (81 lines, 6 entries, all exports present) | Yes (imported in page.tsx and CameraRig.tsx) | ✓ VERIFIED |
| `src/app/[locale]/lab2/page.tsx` | Updated page with LenisProvider and scroll spacer div | Yes | Yes (48 lines, LenisProvider + spacer + Lab2Scene) | Yes (is the route entrypoint) | ✓ VERIFIED |

### Plan 07-02 Artifacts

| Artifact | Provides | Exists | Substantive | Wired | Status |
|----------|----------|--------|-------------|-------|--------|
| `src/components/lab2/scene/CameraRig.tsx` | useFrame-based camera interpolation reading scrollProgress ref | Yes | Yes (55 lines, full lerp impl) | Yes (imported + mounted in Lab2Scene.tsx) | ✓ VERIFIED |
| `src/components/lab2/Lab2Scene.tsx` | Canvas with CameraRig mounted inside | Yes | Yes (28 lines, CameraRig inside Suspense) | Yes (is the scene entrypoint) | ✓ VERIFIED |

---

## Key Link Verification

### Plan 07-01 Key Links

| From | To | Via | Pattern | Status |
|------|----|-----|---------|--------|
| `LenisProvider.tsx` | `@react-three/fiber addEffect` | useEffect calling addEffect to drive Lenis RAF from R3F loop | `addEffect.*lenisRef.*lenis.*raf` | ✓ WIRED — `addEffect((t) => { lenisRef.current?.lenis?.raf(t); })` confirmed at line 28-30 |
| `useScrollProgress.ts` | `lenis/react useLenis` | useLenis callback writing progress to useRef | `useLenis.*progressRef` | ✓ WIRED — `useLenis(({progress}) => { progressRef.current = progress; })` confirmed at line 18-20 |
| `page.tsx` | `LenisProvider.tsx` | LenisProvider wrapping page content | `LenisProvider` | ✓ WIRED — `<LenisProvider>` wraps full page JSX at lines 29 and 46 |

### Plan 07-02 Key Links

| From | To | Via | Pattern | Status |
|------|----|-----|---------|--------|
| `CameraRig.tsx` | `useScrollProgress.ts` | useScrollProgress() returning progressRef read in useFrame | `useScrollProgress.*useFrame` | ✓ WIRED — `const progressRef = useScrollProgress()` at line 27; read in `useFrame` at line 36 |
| `CameraRig.tsx` | `config/chapters.ts` | importing CHAPTERS array and getChapterIndex for waypoint lookup | `CHAPTERS.*getChapterIndex` | ✓ WIRED — imports `CHAPTERS, getChapterIndex, CHAPTER_COUNT` at line 7; all three used in useFrame |
| `Lab2Scene.tsx` | `CameraRig.tsx` | CameraRig mounted inside Canvas as sibling to EmptyScene | `<CameraRig` | ✓ WIRED — `<CameraRig />` mounted inside Suspense at line 21 |

---

## Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| SCRL-01 | 07-01 | Lenis 기반 스무스 스크롤이 전체 /lab2 페이지에 적용된다 | ✓ SATISFIED | LenisProvider wraps entire page; ReactLenis with `root` prop applied to `<html>`; lenis@^1.3.17 in package.json |
| SCRL-02 | 07-01, 07-02 | 스크롤 위치가 0~1 사이의 scrollProgress로 정규화되어 Canvas에 전달된다 | ✓ SATISFIED | useScrollProgress hook writes Lenis `progress` (0-1) to progressRef; CameraRig reads ref in useFrame — bridge complete |
| SCRL-03 | 07-02 | 카메라가 6개 챕터 웨이포인트 사이를 스크롤에 따라 부드럽게 이동한다 | ? HUMAN NEEDED | CameraRig implementation is complete and correct (lerpVectors + camera.lerp); visual smoothness requires browser verification |
| SCRL-04 | 07-01, 07-02 | 챕터 전환이 스크롤 위치에서 자연스럽게 파생된다 (매직 넘버 없이 config 기반) | ✓ SATISFIED | All chapter math derives from `CHAPTERS.length`; no literal `6` in any logic path; page uses `CHAPTER_COUNT * 100vh`; `getChapterIndex`, `CHAPTER_STEP`, `CHAPTER_COUNT` all derived |

**Orphaned requirements check:** REQUIREMENTS.md maps SCRL-01, SCRL-02, SCRL-03, SCRL-04 to Phase 7. All four are claimed in plans (07-01 and 07-02). No orphaned requirements.

**Note:** REQUIREMENTS.md Traceability table shows SCRL-03 as "Pending" — this reflects that human browser verification was required per plan 07-02 Task 2 (checkpoint:human-verify gate). The automated code implementation is complete and correct.

---

## Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `chapters.ts` | 14 | "placeholder values to be tuned in Phase 8" (in JSDoc comment) | ℹ️ Info | Expected — Phase 7 waypoints are explicitly designed as placeholders. Phase 8 will tune them to real scene content. Not a stub. |
| `CameraRig.tsx` | 54 | `return null` | ℹ️ Info | Intentional — CameraRig is a pure logic component. Rendering null is the correct pattern for R3F components that only drive camera/state. |

No blocker or warning anti-patterns found.

---

## Implementation Quality Notes

**Single-RAF architecture confirmed:** `autoRaf: false` in LenisProvider options; `addEffect` drives `lenis.raf(t)` from R3F loop. This is the correct implementation preventing dual-RAF 40fps drops.

**No magic numbers:** `CHAPTER_COUNT = CHAPTERS.length` (line 57 of chapters.ts). Page scroll height uses `CHAPTER_COUNT * 100vh`. CameraRig waypoint indexing uses `CHAPTER_COUNT` throughout. No hardcoded `6` in any logic path.

**Animation value pattern correct:** `progressRef = useRef(0)` in useScrollProgress. Not useState — follows STATE.md "애니메이션 값은 useRef" principle. No unnecessary React re-renders on scroll.

**Two-stage camera smoothing confirmed:**
1. `lerpVectors(CHAPTERS[idx].position, CHAPTERS[nextIdx].position, t)` — interpolates between adjacent waypoints based on chapter-local progress
2. `camera.position.lerp(targetPos, LERP_FACTOR)` — adds 0.05 lag on top of Lenis inertia
Both position AND lookAt independently lerped via separate `currentLookAt` ref — prevents chapter boundary snapping.

**LoadingScreen bug fix verified:** `total === 0` condition in LoadingScreen.tsx prevents stuck spinner on empty scene.

**Build status:** Production build passes cleanly. Both `/ko/lab2` and `/en/lab2` routes compile without TypeScript or Next.js errors.

**Commit verification:** All four task commits confirmed in git history:
- `5176628` — feat(07-01): install Lenis and create scroll infrastructure
- `93ca514` — feat(07-01): integrate LenisProvider and scroll spacer into /lab2 page
- `adf69b3` — feat(07-02): create CameraRig and mount in Lab2Scene
- `ef59a7b` — fix(lab2): dismiss loading screen when no assets to load

---

## Human Verification Required

### 1. Lenis Smooth Scroll Feel

**Test:** Navigate to `http://localhost:3000/ko/lab2`. Scroll with mouse wheel or trackpad.
**Expected:** Scroll feels smooth and elastic with characteristic Lenis inertia — noticeably different from native browser scroll. Momentum continues slightly after stopping scroll input.
**Why human:** Scroll feel is perceptual. Cannot be verified by static analysis.

### 2. Camera Waypoint Traversal

**Test:** From top of /ko/lab2, scroll slowly to the bottom. Observe 3D viewport throughout.
**Expected:** Camera moves through 3D space continuously — the empty scene / grid helper / background should visibly shift perspective as camera passes through 6 positions. At top = intro position (near origin). At bottom = project-5 position (far negative Z). No snap or jump at any chapter boundary.
**Why human:** Camera motion and absence of visual snapping require visual inspection of a live 3D scene.

### 3. 60fps Performance Under Scroll

**Test:** Open Chrome DevTools > Performance tab > click Record > scroll through full 600vh page > stop recording.
**Expected:** No Long Tasks (red bars) visible in the timeline during scrolling. Frame rate indicators show ~60fps maintained throughout.
**Why human:** Runtime performance metrics are only available in a live browser profiling session.

---

## Gaps Summary

No code gaps found. All artifacts exist, are substantive, and are correctly wired. The three human verification items (SCRL-03 smooth traversal, 60fps, scroll feel) are runtime/perceptual checks that cannot be verified statically — the underlying code implementation is correct and complete.

REQUIREMENTS.md marks SCRL-03 as "Pending" — this is consistent with plan 07-02 requiring a `checkpoint:human-verify` gate. Human approval of the browser behavior will close SCRL-03.

---

_Verified: 2026-02-28_
_Verifier: Claude (gsd-verifier)_
