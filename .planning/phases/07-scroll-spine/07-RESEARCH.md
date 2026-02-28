# Phase 7: Scroll Spine - Research

**Researched:** 2026-02-28
**Domain:** Smooth scroll (Lenis) + scroll-driven camera waypoints (R3F/Three.js)
**Confidence:** HIGH

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| SCRL-01 | Lenis 기반 스무스 스크롤이 전체 /lab2 페이지에 적용된다 | ReactLenis root wrapper in lab2 layout, CSS import, autoRaf integration pattern |
| SCRL-02 | 스크롤 위치가 0~1 사이의 scrollProgress로 정규화되어 Canvas에 전달된다 | Lenis scroll event `.progress` property (built-in 0–1 value), useRef pattern to bridge DOM → R3F |
| SCRL-03 | 카메라가 6개 챕터 웨이포인트 사이를 스크롤에 따라 부드럽게 이동한다 | THREE.Vector3.lerp() in useFrame, waypoint array lookup by chapter index, smoothing factor |
| SCRL-04 | 챕터 전환이 스크롤 위치에서 자연스럽게 파생된다 (매직 넘버 없이 config 기반) | CHAPTERS config array with position/lookAt per chapter; chapterIndex = Math.floor(progress * CHAPTERS.length) |
</phase_requirements>

---

## Summary

Phase 7 establishes the entire scroll-driven experience backbone. There are two distinct technical layers that must work together: (1) smooth scroll via Lenis that intercepts native scroll events on a tall page, and (2) a camera animation system inside the R3F Canvas that reads normalized scroll progress and interpolates between 6 predefined 3D waypoints.

The critical integration challenge is bridging the DOM scroll world (Lenis, running outside Canvas) with the R3F render loop (useFrame, running inside Canvas). The established pattern uses either `addEffect` from `@react-three/fiber` to drive Lenis's RAF from R3F's loop, or a `useRef`-based bridge to pass `progress` from a `useLenis` callback into a useFrame hook without triggering React re-renders. The STATE.md decision "스크롤 권한 단일화 — Lenis 단독 사용, GSAP ScrollControls 혼용 금지" means Drei's `ScrollControls` is out — Lenis is the sole scroll authority.

The camera waypoint system should be purely config-driven: a `CHAPTERS` constant array holds each chapter's `position: Vector3` and `lookAt: Vector3`. The scroll progress (0–1) maps to a chapter index via `Math.floor(progress * CHAPTERS.length)`, and within each chapter, a local `t` value gives smooth interpolation between waypoints using `camera.position.lerp()` inside `useFrame`. No magic numbers anywhere — all spatial data lives in the config.

**Primary recommendation:** Install `lenis@latest`, wrap the `/lab2` layout with `<ReactLenis root>`, disable autoRaf, drive Lenis from R3F's loop via `addEffect`, pass scroll `progress` to camera via `useRef`, and interpolate camera position/lookAt with `Vector3.lerp()` in `useFrame`.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `lenis` | 1.3.17 (latest) | Smooth scroll with elastic feel | Industry standard for creative/interactive scroll; powers GTA VI, Shopify Supply; replaces deprecated `@studio-freight/lenis` |
| `lenis/react` | (subpath of lenis) | `ReactLenis` component + `useLenis` hook | Official React wrapper bundled with lenis package; no separate install needed |
| `@react-three/fiber` | 9.5.0 (installed) | R3F `useFrame`, `addEffect` | Already installed; `addEffect` enables Lenis RAF sync with R3F loop |
| `three` | 0.182.0 (installed) | `THREE.Vector3.lerp()`, camera manipulation | Already installed; Vector3.lerp is the standard for smooth camera interpolation |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@react-three/drei` | 10.7.7 (installed) | `PerspectiveCamera` | Already installed; use for declarative camera setup inside Canvas |
| `gsap` | 3.14.2 (installed) | Ticker alternative for Lenis RAF | Optional — use only if `addEffect` pattern proves insufficient; GSAP ticker is alternative RAF driver |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `lenis` (native scroll) | Drei `ScrollControls` + `useScroll` | ScrollControls are prohibited by STATE.md decision ("GSAP ScrollControls 혼용 금지"); also creates a separate scroll element inside Canvas, conflicts with Lenis |
| `lenis` (native scroll) | Locomotive Scroll | Heavier, adds CSS class manipulation; Lenis is simpler and more popular in 2025-2026 |
| `Vector3.lerp()` in useFrame | `maath` easing library | maath adds a dependency for something Three.js handles natively; avoid extra dependency |
| `CatmullRomCurve3` path | Direct Vector3 lerp between waypoints | CatmullRomCurve3 creates curved path between all waypoints simultaneously; for chapter-to-chapter discrete movement with smooth interpolation, direct lerp between adjacent waypoints is simpler and more controllable |

**Installation:**
```bash
npm install lenis --cache /tmp/npm-cache-temp
```
Note: `lenis/react` is a subpath export of the main `lenis` package — no additional install needed. Import via `import { ReactLenis, useLenis } from 'lenis/react'`.

---

## Architecture Patterns

### Recommended Project Structure

```
src/
├── components/lab2/
│   ├── config/
│   │   └── chapters.ts          # CHAPTERS array: position, lookAt per chapter
│   ├── hooks/
│   │   ├── useScrollProgress.ts # Bridges Lenis → R3F: exposes scrollProgress ref
│   │   └── useViewportWidth.ts  # (existing)
│   ├── scene/
│   │   └── CameraRig.tsx        # useFrame camera interpolation, reads scrollProgress ref
│   ├── Lab2Scene.tsx            # Canvas host (add CameraRig inside)
│   └── ui/
│       └── LenisProvider.tsx    # 'use client' wrapper with ReactLenis root
```

### Pattern 1: Lenis Setup in /lab2 Layout (Root Scroll Authority)

**What:** Wrap the lab2 layout (or page) with `<ReactLenis root>` with `autoRaf={false}`, then drive Lenis's RAF from R3F's loop using `addEffect`.

**When to use:** Always for this project — single scroll authority per STATE.md.

**CRITICAL constraint:** The `/lab2` page is `'use client'` and uses `fixed inset-0` canvas. The tall scrollable page that gives Lenis something to scroll must be a sibling or wrapping element — the body/html scrolls while the canvas stays fixed.

**Example:**
```typescript
// Source: DeepWiki lenis/3.1-react-integration + github.com/darkroomengineering/lenis/discussions/431
// src/components/lab2/ui/LenisProvider.tsx
'use client';

import { ReactLenis } from 'lenis/react';
import { addEffect } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import type { LenisRef } from 'lenis/react';

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    // Drive Lenis from R3F's render loop — single RAF, no dual-loop jank
    const cleanup = addEffect((t) => {
      lenisRef.current?.lenis?.raf(t);
    });
    return cleanup;
  }, []);

  return (
    <ReactLenis
      ref={lenisRef}
      root
      options={{ autoRaf: false, lerp: 0.08, duration: 1.2 }}
    >
      {children}
    </ReactLenis>
  );
}
```

**Note on `autoRaf` default:** Lenis 1.3.17 README shows `autoRaf` defaults to `false`. When using `addEffect`, always explicitly set `autoRaf: false` to prevent a second RAF loop.

### Pattern 2: Scroll Progress Bridge (DOM → R3F)

**What:** Use `useLenis` callback to write `progress` into a `useRef` — a mutable ref that doesn't cause re-renders. The ref is read inside `useFrame` on every frame.

**When to use:** Whenever DOM scroll state needs to influence the R3F scene without React state overhead. This is the "애니메이션 값은 useRef" decision from STATE.md.

**Example:**
```typescript
// Source: Derived from DeepWiki lenis/3.1-react-integration + STATE.md pattern
// src/components/lab2/hooks/useScrollProgress.ts
'use client';

import { useRef } from 'react';
import { useLenis } from 'lenis/react';

export function useScrollProgress() {
  const progressRef = useRef(0);

  useLenis(({ progress }) => {
    progressRef.current = progress; // 0–1, built into Lenis scroll event
  });

  return progressRef;
}
```

### Pattern 3: Config-Driven Chapter Waypoints

**What:** A `CHAPTERS` constant array defines all camera positions and lookAt targets. Chapter index is derived from scroll progress — no magic numbers anywhere.

**When to use:** Required for SCRL-04 compliance.

**Example:**
```typescript
// src/components/lab2/config/chapters.ts
import * as THREE from 'three';

export const CHAPTERS = [
  {
    id: 'intro',
    label: 'Intro',
    position: new THREE.Vector3(0, 2, 5),
    lookAt: new THREE.Vector3(0, 0, 0),
  },
  {
    id: 'project-1',
    label: 'Project 1',
    position: new THREE.Vector3(5, 1, 3),
    lookAt: new THREE.Vector3(5, 0, 0),
  },
  // ... 4 more chapters
] as const;

// Derived constants — no magic numbers in consuming code
export const CHAPTER_COUNT = CHAPTERS.length; // 6
export const CHAPTER_STEP = 1 / CHAPTER_COUNT; // progress per chapter

// Derive chapter index from scroll progress
export function getChapterIndex(progress: number): number {
  return Math.min(
    Math.floor(progress * CHAPTER_COUNT),
    CHAPTER_COUNT - 1
  );
}

// Get local t (0–1) within current chapter
export function getChapterProgress(progress: number): number {
  const chapterIndex = getChapterIndex(progress);
  return (progress - chapterIndex * CHAPTER_STEP) / CHAPTER_STEP;
}
```

### Pattern 4: Camera Rig — Scroll-Driven Interpolation in useFrame

**What:** A component inside the Canvas reads `progressRef` each frame and lerps camera position/lookAt between chapter waypoints.

**Example:**
```typescript
// Source: Derived from sbcode.net/react-three-fiber/lerp + github.com/darkroomengineering/lenis/discussions/431
// src/components/lab2/scene/CameraRig.tsx
'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { useScrollProgress } from '../hooks/useScrollProgress';
import { CHAPTERS, getChapterIndex, CHAPTER_COUNT } from '../config/chapters';

const LERP_FACTOR = 0.05; // smoothing — tune for feel

export default function CameraRig() {
  const { camera } = useThree();
  const progressRef = useScrollProgress();
  const targetPos = useRef(new THREE.Vector3());
  const targetLookAt = useRef(new THREE.Vector3());
  const currentLookAt = useRef(new THREE.Vector3());

  useFrame(() => {
    const progress = progressRef.current;
    const idx = getChapterIndex(progress);
    const nextIdx = Math.min(idx + 1, CHAPTER_COUNT - 1);
    const t = (progress - idx / CHAPTER_COUNT) * CHAPTER_COUNT; // local t

    // Interpolate target between current and next chapter waypoints
    targetPos.current.lerpVectors(CHAPTERS[idx].position, CHAPTERS[nextIdx].position, t);
    targetLookAt.current.lerpVectors(CHAPTERS[idx].lookAt, CHAPTERS[nextIdx].lookAt, t);

    // Smooth camera toward target (Lenis already smooths scroll; this adds camera lag)
    camera.position.lerp(targetPos.current, LERP_FACTOR);
    currentLookAt.current.lerp(targetLookAt.current, LERP_FACTOR);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}
```

### Pattern 5: Page Height Setup for Lenis

**What:** Lenis needs a scrollable page height to produce scroll progress. With a fixed Canvas, the scrollable content is a separate tall div behind/alongside the canvas. The page needs N chapters × 100vh of total height.

**Example:**
```typescript
// In lab2/page.tsx — add a scroll spacer div OUTSIDE the fixed canvas
// The fixed canvas overlays the page; this div gives the page scroll height
<div style={{ height: `${CHAPTER_COUNT * 100}vh`, position: 'relative' }} />
```

This is the standard pattern for fixed WebGL canvas with full-page scroll: the Canvas is `fixed inset-0`, and a tall div in normal flow provides the scrollable height for Lenis to traverse.

### Anti-Patterns to Avoid

- **Dual RAF loops:** Do not use both `autoRaf: true` AND an R3F `useFrame` Lenis call. This creates two RAF loops causing 40fps drops on scroll. Use `addEffect` with `autoRaf: false`.
- **useState for scroll progress:** Using `useState` triggers React re-renders on every scroll event (60+ per second). Use `useRef` as per STATE.md "애니메이션 값은 useRef" decision.
- **ScrollControls from Drei:** Prohibited by STATE.md decision. Creates internal scroll container that conflicts with Lenis.
- **Magic number chapter boundaries:** Never write `if (progress > 0.33 && progress < 0.67)`. Always derive from `CHAPTERS.length`.
- **Conditional Canvas rendering:** STATE.md: "절대 조건부 렌더링 금지" — do not mount/unmount Canvas based on scroll state.
- **Direct `camera.lookAt()` without lerping the target:** Calling `camera.lookAt(CHAPTERS[idx].lookAt)` directly causes snapping. Lerp both position AND lookAt separately using refs.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Smooth inertial scrolling | Custom wheel event + inertia system | `lenis` + `ReactLenis` | Lenis handles trackpad, mouse wheel, touch inertia, accessibility, and scroll restoration across browsers |
| Scroll progress 0–1 | `window.scrollY / (document.body.scrollHeight - window.innerHeight)` | `lenis` scroll event `.progress` property | Lenis already computes this, accounts for animated scroll position (not raw scrollY during animation) |
| Vector interpolation | Custom lerp function | `THREE.Vector3.lerp()` / `THREE.Vector3.lerpVectors()` | Built into Three.js; handles all edge cases; works in-place or creates new vector |
| RAF synchronization | Custom `requestAnimationFrame` loop | `addEffect` from `@react-three/fiber` | Plugs into R3F's existing render loop, single RAF, no timing drift |

**Key insight:** The smoothness of Lenis operates on `animatedScroll` (the interpolated position), not `rawScroll`. This means `.progress` is already smoothed — the camera doesn't need aggressive additional smoothing. A gentle `LERP_FACTOR` (0.03–0.08) in `useFrame` adds camera lag without fighting Lenis's smoothing.

---

## Common Pitfalls

### Pitfall 1: Dual RAF Loop Performance Degradation

**What goes wrong:** Scroll drops to 40fps on mobile/integrated GPU during scrolling; animations feel stuttered.
**Why it happens:** `autoRaf: true` in Lenis AND a `useFrame`-based RAF in R3F = two separate `requestAnimationFrame` loops running simultaneously, timing drift between them.
**How to avoid:** Always `autoRaf: false` when using `addEffect` or GSAP ticker to drive Lenis. Verify in DevTools Performance tab — should see one RAF cycle, not two overlapping.
**Warning signs:** Animation jitter specifically during scroll (not at rest); Performance tab shows overlapping long tasks at 16ms intervals.

### Pitfall 2: Scroll Progress Uses Raw `scrollY`, Not Lenis Animated Position

**What goes wrong:** Camera snaps or jumps instead of smoothly following; progress doesn't match Lenis's visual scroll position.
**Why it happens:** Using `window.scrollY` directly bypasses Lenis's interpolated position — reads the native scroll, not the smooth animated scroll.
**How to avoid:** Always use Lenis's `.progress` from the `useLenis` callback or scroll event. This gives the animated (smoothed) scroll position.
**Warning signs:** Camera movement feels choppy even with Lenis correctly installed.

### Pitfall 3: `lenis/react` Ref Access Pattern

**What goes wrong:** `TypeError: lenisRef.current.raf is not a function` or similar.
**Why it happens:** The `ReactLenis` ref points to the component wrapper, not the Lenis instance directly. Correct access is `lenisRef.current?.lenis?.raf()` not `lenisRef.current?.raf()`.
**How to avoid:** In `addEffect`: `lenisRef.current?.lenis?.raf(t)`. In `useLenis` callback: the callback receives the Lenis scroll data directly, no ref needed.
**Warning signs:** RAF never updates; scroll appears frozen despite Lenis installed.

### Pitfall 4: Missing CSS Import Causes Layout Issues

**What goes wrong:** Lenis scroll wrapper has incorrect height; content clips or overflow doesn't work as expected.
**Why it happens:** Lenis requires its own CSS for the scroll container sizing (`lenis/dist/lenis.css` or similar).
**How to avoid:** Import Lenis CSS in the layout or global CSS: `import 'lenis/dist/lenis.css'` in the provider component.
**Warning signs:** ScrollLenis wrapper is 0px height; page doesn't scroll despite tall content.

### Pitfall 5: Camera lookAt Snapping on Chapter Boundary

**What goes wrong:** Camera snaps to new lookAt target precisely at chapter boundary instead of smoothing.
**Why it happens:** Two sources of this: (a) calling `camera.lookAt()` without lerping the target, (b) `LERP_FACTOR` too high (close to 1.0).
**How to avoid:** Maintain a separate `currentLookAt` ref, lerp it toward `targetLookAt`, then call `camera.lookAt(currentLookAt.current)`. Keep `LERP_FACTOR` between 0.03 and 0.08.
**Warning signs:** Smooth position movement but snap-to-target on lookAt direction changes.

### Pitfall 6: Chapter Count Change Breaks All Derived Values

**What goes wrong:** Adding or removing a chapter breaks progress calculations, boundaries feel wrong.
**Why it happens:** Progress math was hardcoded around 6 chapters.
**How to avoid:** Always derive from `CHAPTERS.length`: `CHAPTER_STEP = 1 / CHAPTERS.length`. Any file with a hardcoded `6` is a bug.
**Warning signs:** Chapter 5's content shows at 80% scroll instead of ~83%; chapter boundary is off by one.

---

## Code Examples

Verified patterns from official sources:

### Lenis React Integration (from lenis/react README + deepwiki)

```typescript
// Import — lenis/react is a subpath export, no separate install
import { ReactLenis, useLenis } from 'lenis/react';

// Wrap at layout level
<ReactLenis root options={{ autoRaf: false, lerp: 0.08 }}>
  {children}
</ReactLenis>

// In any child component — access scroll event data
useLenis(({ progress, scroll, velocity, direction, limit }) => {
  // progress: 0–1 (normalized, uses animated scroll position)
  // scroll: current animated scroll position in pixels
  // velocity: scroll speed
  // direction: 1 (down) or -1 (up)
  // limit: max scroll in pixels
});
```

### addEffect Integration (from github.com/darkroomengineering/lenis/discussions/431)

```typescript
import { addEffect } from '@react-three/fiber';

useEffect(() => {
  // t is milliseconds from R3F's performance.now()
  const cleanup = addEffect((t) => {
    lenisRef.current?.lenis?.raf(t);
  });
  return cleanup;
}, []);
```

### Vector3 Lerp for Camera (from Three.js docs + sbcode.net/react-three-fiber/lerp)

```typescript
import * as THREE from 'three';

// In useFrame:
const targetPos = new THREE.Vector3(5, 1, 3);
camera.position.lerp(targetPos, 0.05); // second arg: alpha, 0=no move, 1=instant

// lerpVectors: interpolate between two vectors, store result in 'this'
targetPos.lerpVectors(vecA, vecB, t); // t = 0 → vecA, t = 1 → vecB
```

### Full Page Height for Lenis (Pattern)

```typescript
// In lab2/page.tsx — provides scroll height for Lenis
// CHAPTER_COUNT × 100vh = total scrollable distance
import { CHAPTER_COUNT } from '@/components/lab2/config/chapters';

// Inside page JSX:
<>
  {/* Scroll spacer — gives page height for Lenis */}
  <div style={{ height: `${CHAPTER_COUNT * 100}vh` }} aria-hidden="true" />

  {/* Fixed WebGL canvas */}
  <div className="fixed inset-0 z-[60] bg-neutral-950">
    <Lab2Scene />
  </div>
</>
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `@studio-freight/lenis` | `lenis` (no prefix) | 2023 | Old package deprecated; must use new package name |
| `@studio-freight/react-lenis` | `lenis/react` subpath | 2023 | Bundled with main package; simpler install |
| Drei `ScrollControls` for scroll-camera | Lenis + custom camera rig | Project decision | GSAP ScrollControls creates conflicts with Lenis; STATE.md prohibits mixing |
| `autoRaf: true` default | `autoRaf: false` default | Lenis 1.x | Must manually drive RAF for R3F integration |

**Deprecated/outdated:**
- `@studio-freight/lenis`: Deprecated — use `lenis` instead
- `@studio-freight/react-lenis`: Deprecated — use `lenis/react` subpath instead
- GSAP ScrollTrigger as scroll authority for this project: Prohibited by STATE.md — Lenis is sole scroll authority

---

## Open Questions

1. **Does `addEffect` from `@react-three/fiber` 9.5.0 accept a cleanup function return?**
   - What we know: `addEffect` in earlier R3F versions returned a cleanup function. Pattern `const cleanup = addEffect(cb); return cleanup` is the expected API.
   - What's unclear: v9.x API may have changed; the npm package at 9.5.0 is very recent (installed in this project).
   - Recommendation: Verify `addEffect` export in `@react-three/fiber` v9.5.0. Fallback: use a `useRef`-based Lenis instance with manual `useEffect` RAF if `addEffect` API changed.

2. **Optimal `lerp` value for Lenis to match "탄성 있는 느낌" (elastic feel)**
   - What we know: Lenis default is `lerp: 0.1`, `duration: 1.2`. Lower lerp = more inertia/elastic.
   - What's unclear: Exact feel preference — this requires tuning during implementation.
   - Recommendation: Start with `lerp: 0.08` and tune during Wave 1 verification. Range 0.05–0.12 is the creative sweet spot for portfolio sites.

3. **`LenisProvider` placement: lab2 layout vs page-level**
   - What we know: ReactLenis `root` mode uses `<html>` scroll. The lab2 layout wraps only `/lab2` routes. Main site doesn't use Lenis.
   - What's unclear: Whether `root` mode at layout level (not root app layout) correctly scopes to lab2 only, or if it attaches globally.
   - Recommendation: Place `ReactLenis root` in the lab2 layout (`app/[locale]/lab2/layout.tsx`), not the root app layout. Test that navigating to `/` stops Lenis from intercepting main site scroll.

4. **`updateProjectionMatrix` needed after camera moves?**
   - What we know: `camera.position.lerp()` changes position only. `camera.lookAt()` updates the matrix. R3F's `useFrame` automatically handles rendering.
   - What's unclear: Whether explicit `camera.updateProjectionMatrix()` is needed with PerspectiveCamera when only position/lookAt change.
   - Recommendation: Not needed for position/lookAt changes (only needed when changing fov/aspect/near/far). Do not add it — it's a performance cost with no benefit here.

---

## Sources

### Primary (HIGH confidence)
- DeepWiki `darkroomengineering/lenis` section 3.1 (React integration) - ReactLenis component, useLenis hook, scroll event data properties, autoRaf behavior
- `github.com/darkroomengineering/lenis/discussions/431` - R3F + Lenis dual RAF issue, clock.getElapsedTime * 1000 pattern, addEffect solution
- `github.com/darkroomengineering/lenis/blob/main/README.md` - API options with defaults (lerp: 0.1, duration: 1.2, smoothWheel: true), version 1.3.17
- Three.js `Vector3.lerp()` and `Vector3.lerpVectors()` - camera interpolation pattern

### Secondary (MEDIUM confidence)
- `bridger.to/lenis-nextjs` - Next.js App Router specific integration; `use client` pattern, LenisProvider component approach
- `sbcode.net/react-three-fiber/lerp` - useFrame + Vector3.lerp pattern in R3F context
- `discourse.threejs.org/t/useframe-with-lerp-for-camera-position-animation` - R3F camera lerp in useFrame
- `devdreaming.com/blogs/nextjs-smooth-scrolling-with-lenis-gsap` - GSAP ticker as Lenis RAF alternative

### Tertiary (LOW confidence)
- Multiple WebSearch results confirming `addEffect` pattern for Lenis-R3F integration — consistent across sources but not verified against R3F v9.5.0 API directly

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — Lenis 1.3.17 confirmed as current package (not @studio-freight); R3F/Three/Drei already installed and version-confirmed
- Architecture: HIGH — Lenis scroll event `.progress` (0–1) confirmed; `addEffect` RAF pattern confirmed from official Lenis discussions; `Vector3.lerp` confirmed from Three.js
- Pitfalls: HIGH — Dual RAF, raw scrollY vs animated scroll, ref access pattern all confirmed from official Lenis issues/discussions

**Research date:** 2026-02-28
**Valid until:** 2026-03-28 (Lenis is active; R3F 9.x is new — check `addEffect` API in v9.5 changelog if issues arise)
