# Phase 8: 3D Scenes - Research

**Researched:** 2026-03-01
**Domain:** React Three Fiber (R3F) scene architecture — 3D text, texture planes, particle fields, scene switching, VRAM disposal
**Confidence:** HIGH

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| SCENE-01 | IntroScene이 사용자 이름/타이틀과 함께 3D 공간에서 렌더링된다 | drei `<Text>` component (troika-three-text, already bundled with drei 10.7.7); Korean characters supported via unicode-font-resolver fallback; Pretendard TTF via CDN for font prop |
| SCENE-02 | 5개 프로젝트 각각에 고유한 3D 씬이 존재한다 | Visibility-toggle pattern (all scene groups mounted, `visible` prop driven by chapter index); avoids expensive remount/recompile per R3F pitfall docs |
| SCENE-03 | 파티클 필드가 배경에서 공간감을 제공한다 (3k 이하) | Raw `<points>` + `<bufferGeometry>` + `<bufferAttribute>` with Float32Array; `useMemo` to generate positions once; `depthWrite={false}` on material; 2000–3000 count is safely within performance budget |
| SCENE-04 | 기존 WebP 이미지들이 3D 텍스처 플레인으로 씬 안에 표시된다 | `useTexture(url)` from drei; `<mesh>` + `<planeGeometry>` + `<meshBasicMaterial map={texture} transparent />` — WebP fully supported by browser texture loader |
| SCENE-05 | 씬 전환 시 지오메트리/머티리얼이 적절히 dispose되어 VRAM 누수가 없다 | R3F auto-disposes on unmount; BUT recommended pattern is visibility toggle (never unmount) — no VRAM growth when geometry stays in GPU; `useTexture` caches by URL path so no re-upload |
</phase_requirements>

---

## Summary

Phase 8 populates the existing 6-chapter scroll-driven camera path (from Phase 7) with actual 3D content. The scroll infrastructure and camera rig are already in place — this phase adds the scene geometry, text, images, and particles that the camera reveals as the user scrolls.

The architecture decision that dominates all of Phase 8 is the **visibility-toggle pattern**: because R3F (following Three.js best practices) warns that conditional mounting/unmounting causes expensive recompilation of materials and shaders, all 6 scene groups should be mounted inside the Canvas at startup and shown/hidden using the `visible` prop. This means no VRAM growth between chapter transitions because GPU buffers are uploaded once at load time. The `useTexture` hook from drei caches loaded textures by URL, reinforcing this: textures are uploaded to VRAM once and reused.

The drei `<Text>` component (backed by troika-three-text, which is a peer dependency of drei and already installed) handles 3D text rendering. It uses Signed Distance Field (SDF) rendering for crisp text at any size, processes fonts in a web worker, and automatically falls back to unicode-font-resolver for characters not in the primary font — covering Korean Hangul. For the IntroScene, name/title text can be rendered directly in 3D space with `<Text>` using a `font` prop pointing to a TTF URL.

Particles are best implemented with raw Three.js `<points>` + `<bufferGeometry>` + Float32Array positions generated once in `useMemo`. A single `<bufferAttribute attach="attributes-position">` wires the typed array to GPU. Alternatively, drei's `<Stars>` component provides a ready-made particle starfield with configurable count, radius, and depth — useful if a quick ambient field is acceptable. For a bespoke animated particle field, custom shader material with `uTime` uniform is the GPU-efficient approach.

**Primary recommendation:** Mount all 6 scene `<group>` components inside the Canvas at startup. Drive `visible` from `getChapterIndex(scrollProgress)`. Use `useTexture` for WebP planes, drei `<Text>` for 3D text, and raw BufferGeometry for particles. No conditional mounting.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `@react-three/fiber` | 9.5.0 (installed) | `useFrame`, `useThree`, Canvas host | Already installed; provides the render loop and declarative Three.js scene graph |
| `@react-three/drei` | 10.7.7 (installed) | `<Text>`, `<Stars>`, `useTexture`, `<Float>`, `<Billboard>` | Already installed; troika-three-text is a direct dependency of drei 10.7.7 |
| `three` | 0.182.0 (installed) | `BufferGeometry`, `Float32Array`, `Points`, `Vector3` | Already installed; all primitives for particle system and geometry management |
| `troika-three-text` | (bundled with drei) | SDF text rendering, web-worker font processing | Installed as direct dep of drei — importable directly if needed |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `gsap` | 3.14.2 (installed) | Chapter-entry animation (text reveal, plane fade-in) | Use for one-shot animations triggered at chapter entry; not for per-frame loop |
| `@gsap/react` | 2.1.2 (installed) | `useGSAP` hook for GSAP lifecycle in R3F | Use when triggering GSAP from within `useEffect` pattern in scene components |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Raw `<points>` BufferGeometry | drei `<Stars>` component | Stars is simpler (2 lines); raw BufferGeometry gives full control over particle shape, shader, animation — use raw if you need custom look |
| Raw `<points>` BufferGeometry | drei `<Sparkles>` | Sparkles adds sparkle motion but less control over distribution; appropriate for decorative rather than ambient field |
| `visibility` toggle | Conditional rendering per chapter | Conditional rendering causes material recompile per R3F pitfall docs — DO NOT use |
| `useTexture` (drei) | `THREE.TextureLoader` + `useMemo` + `useEffect` cleanup | `useTexture` caches by URL; prefer useTexture unless you need manual dispose lifecycle |
| drei `<Text>` (troika SDF) | drei `<Text3D>` (TextGeometry) | Text3D creates actual 3D extruded geometry — heavier GPU cost; `<Text>` is flat SDF mesh — correct for name/title overlaid in 3D space per REQUIREMENTS.md "3D 텍스처 플레인으로 씬 안에 배치" |

**Installation:**
```bash
# No new installs needed — all packages already in package.json:
# three@0.182.0, @react-three/fiber@9.5.0, @react-three/drei@10.7.7
# troika-three-text is a dep of drei and already importable
```

---

## Architecture Patterns

### Recommended Project Structure

```
src/components/lab2/
├── config/
│   └── chapters.ts              # CHAPTERS array (already exists — add sceneId/projectId fields)
├── hooks/
│   ├── useScrollProgress.ts     # (existing)
│   └── useViewportWidth.ts      # (existing)
├── scene/
│   ├── CameraRig.tsx            # (existing — camera interpolation)
│   ├── SceneManager.tsx         # NEW: mounts all 6 scenes, drives visible prop
│   ├── ParticleField.tsx        # NEW: ambient particle system (shared across all chapters)
│   ├── chapters/
│   │   ├── IntroScene.tsx       # NEW: name + title Text, decorative geometry
│   │   ├── Project1Scene.tsx    # NEW: TexturePlane(s) + unique 3D elements
│   │   ├── Project2Scene.tsx
│   │   ├── Project3Scene.tsx
│   │   ├── Project4Scene.tsx
│   │   └── Project5Scene.tsx
│   └── shared/
│       └── TexturePlane.tsx     # NEW: reusable useTexture + planeGeometry component
├── Lab2Scene.tsx                # (existing — add SceneManager + ParticleField inside Canvas)
└── ui/
    ├── LenisProvider.tsx        # (existing)
    ├── LoadingScreen.tsx        # (existing)
    └── ViewportGate.tsx         # (existing)
```

### Pattern 1: SceneManager — Visibility Toggle Architecture

**What:** A single component that mounts all 6 scene groups unconditionally, reads the current chapter index each frame, and sets `group.visible` each frame.

**When to use:** Always — this is the only approach that avoids VRAM growth on chapter transitions.

**Why NOT conditional rendering:**
From R3F official docs (pitfalls): "In threejs it is very common to not re-mount at all... buffers and materials get re-initialized/compiled, which can be expensive."

```tsx
// Source: R3F official pitfalls doc + Three.js scene architecture patterns
// src/components/lab2/scene/SceneManager.tsx
'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useScrollProgress } from '../hooks/useScrollProgress';
import { getChapterIndex } from '../config/chapters';
import IntroScene from './chapters/IntroScene';
import Project1Scene from './chapters/Project1Scene';
// ... other scenes

const SCENES = [IntroScene, Project1Scene, Project2Scene, Project3Scene, Project4Scene, Project5Scene];

export default function SceneManager() {
  const progressRef = useScrollProgress();
  const groupRefs = useRef<(THREE.Group | null)[]>(Array(SCENES.length).fill(null));

  useFrame(() => {
    const chapterIdx = getChapterIndex(progressRef.current);
    groupRefs.current.forEach((group, i) => {
      if (group) group.visible = (i === chapterIdx);
    });
  });

  return (
    <>
      {SCENES.map((SceneComponent, i) => (
        <group
          key={i}
          ref={(el) => { groupRefs.current[i] = el; }}
        >
          <SceneComponent />
        </group>
      ))}
    </>
  );
}
```

**Alternative simpler approach** (if per-frame visible set feels excessive):
Use `useState` for chapterIndex driven by a `useLenis` callback with `Math.round` to snap discrete chapters, then pass as prop. This avoids per-frame group.visible mutation in exchange for a React state update per chapter change — acceptable since chapter transitions are infrequent.

### Pattern 2: Texture Plane (WebP Image in 3D space)

**What:** Load a WebP texture via `useTexture`, apply to a `planeGeometry` mesh at a known 3D position within each chapter's scene group.

**When to use:** For every project hero/architecture image that must appear in the 3D scene (SCENE-04).

```tsx
// Source: R3F official texture loading docs + drei Texture.d.ts inspection
// src/components/lab2/scene/shared/TexturePlane.tsx
'use client';

import { useTexture } from '@react-three/drei';

interface TexturePlaneProps {
  url: string;
  width?: number;
  height?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
}

export default function TexturePlane({
  url,
  width = 2,
  height = 1.5,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: TexturePlaneProps) {
  const texture = useTexture(url);

  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={texture} transparent />
    </mesh>
  );
}

// Preload textures for all chapters at module level
// (runs before component mounts — avoids Suspense flash on chapter entry)
useTexture.preload('/projects/1/hero.webp');
useTexture.preload('/projects/2/hero.webp');
// ... etc
```

**Key details:**
- `useTexture` is Suspense-aware — wrap in `<Suspense>` (already present in Lab2Scene)
- `useTexture.preload(url)` called at module level pre-uploads textures to GPU before the Suspense boundary is hit
- `meshBasicMaterial` is unlit — correct for a portfolio image display plane (no lighting needed)
- Aspect ratio: pass `width` and `height` matching image aspect to avoid distortion

### Pattern 3: IntroScene — 3D Text with drei `<Text>`

**What:** Render user name and title as SDF-antialiased text meshes in 3D space.

**When to use:** For SCENE-01 — name/title in the IntroScene chapter.

```tsx
// Source: drei Text.d.ts inspection (troika-three-text bundled); troika docs
// src/components/lab2/scene/chapters/IntroScene.tsx
'use client';

import { Text } from '@react-three/drei';

export default function IntroScene() {
  return (
    <group position={[0, 0, 0]}>
      {/* Name — large, prominent */}
      <Text
        position={[0, 0.5, 0]}
        fontSize={0.5}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/woff/Pretendard-Bold.woff"
      >
        박훈일
      </Text>

      {/* Title — smaller, below */}
      <Text
        position={[0, -0.2, 0]}
        fontSize={0.18}
        color="#aaaaaa"
        anchorX="center"
        anchorY="middle"
        font="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/woff/Pretendard-Regular.woff"
      >
        Frontend Developer
      </Text>
    </group>
  );
}
```

**Font strategy for Korean:**
- Pretendard is the project's existing font (loaded in `globals.css` from jsDelivr CDN)
- The same CDN serves individual WOFF files — use the CDN URL directly as `font` prop
- troika-three-text parses .woff/.ttf/.otf directly (no JSON conversion needed)
- Korean Hangul glyphs in Pretendard are fully supported (Pretendard covers KS X 1001)
- If Pretendard WOFF doesn't load fast enough, troika's `unicode-font-resolver` will auto-fallback to Noto Sans KR from jsDelivr

**CRITICAL:** `<Text>` component is Suspense-aware and suspends during font download. Ensure it is inside the existing `<Suspense fallback={null}>` in Lab2Scene.

### Pattern 4: Particle Field — BufferGeometry Points

**What:** An ambient particle cloud (3,000 or fewer points) that provides depth/space throughout the entire experience. Shared across all chapters — always visible.

**When to use:** For SCENE-03 — mounted once, lives outside SceneManager visibility toggle.

```tsx
// Source: Maxime Heckel particle blog (verified) + R3F bufferGeometry patterns
// src/components/lab2/scene/ParticleField.tsx
'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const PARTICLE_COUNT = 2000; // Well within 3k budget; adjust for perf

export default function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null!);

  // Generate positions once — useMemo avoids recreation on re-render
  const positions = useMemo(() => {
    const arr = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Distribute across a large volume matching camera path extents
      arr[i * 3]     = (Math.random() - 0.5) * 30;   // x: -15 to 15
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10;   // y: -5 to 5
      arr[i * 3 + 2] = (Math.random() - 0.5) * 40;   // z: -20 to 20
    }
    return arr;
  }, []);

  // Gentle drift animation via shader uniform (optional — can also be static)
  // For Phase 8: static is acceptable; animated via uTime in Phase 11 (FX)
  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.005;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#aaaaff"
        sizeAttenuation
        transparent
        opacity={0.6}
        depthWrite={false}
      />
    </points>
  );
}
```

**Key details:**
- `depthWrite={false}` prevents particles from occluding each other or geometry behind them
- `sizeAttenuation` makes particles smaller with distance (correct 3D feel)
- Volume extents (-15 to 15 x, -20 to 20 z) should cover the camera path defined in `chapters.ts`
- Start static in Phase 8; Phase 11 (FX) can add shader-based drift

### Pattern 5: VRAM Management — What Actually Happens

**What R3F does automatically on unmount:**
- Calls `geometry.dispose()`, `material.dispose()`, `texture.dispose()` on all Three.js objects whose React component unmounts
- This frees GPU memory for those objects

**Why visibility toggle is STILL preferred over unmount:**
- Unmounting + remounting causes material shader recompilation (expensive stutter)
- With visibility toggle, GPU buffers are uploaded once at load time and persist
- No VRAM growth when geometry stays in GPU — VRAM is stable (uploaded once per asset, regardless of chapter switches)

**useTexture caching behavior:**
- `useTexture` caches by URL string in Three.js's `TextureLoader` cache
- Second call to `useTexture('/projects/1/hero.webp')` returns the same GPU texture — no re-upload
- `useTexture.clear(url)` removes from cache but DOES NOT call `texture.dispose()` — must dispose manually if needed
- For this phase: preload all textures at module level with `useTexture.preload(url)`, use visibility toggle — VRAM stays constant

### Anti-Patterns to Avoid

- **Conditional mounting per chapter:** `{chapterIndex === 0 && <IntroScene />}` — causes recompile on every chapter transition. Use visibility toggle instead.
- **New Float32Array inside useFrame:** Generates garbage every 60fps. Generate once in `useMemo`.
- **New THREE.Vector3 inside useFrame:** Same issue — allocate with `useRef` once, mutate in place.
- **`camera.updateProjectionMatrix()` after position/lookAt:** Not needed unless fov/near/far change (they don't in this phase).
- **`useTexture` inside conditional hooks:** `useTexture` is a hook — cannot be called conditionally. Call at component level, preload at module level.
- **Overlapping `<Text>` components for both locales:** Render one `<Text>` per language and toggle `visible` — same disposal pattern as scenes.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| SDF text rendering in 3D | Custom shader text | drei `<Text>` (troika-three-text) | SDF generation, web-worker parsing, Unicode fallback — weeks of work |
| Texture loading with caching | Custom TextureLoader cache | `useTexture` from drei | Already handles Suspense integration, URL-based cache, preload API |
| Particle starfield | Custom shader particle system | drei `<Stars>` if ambient field is sufficient | `<Stars>` with `count={2000}` is production-ready; use raw BufferGeometry only for custom distribution |
| Korean font fallback | Download + bundle Noto Korean | troika unicode-font-resolver auto-fallback | Auto-resolves from jsDelivr; 300MB font files not worth self-hosting |

**Key insight:** Three.js resource disposal is already handled by R3F's reconciler on unmount. The real challenge is knowing WHEN to unmount (answer: rarely) versus toggle visibility (answer: almost always).

---

## Common Pitfalls

### Pitfall 1: Conditional Rendering Causes Recompilation Stutter

**What goes wrong:** Switching chapters with `{chapter === 0 && <IntroScene />}` causes materials to recompile every time the chapter changes, producing a frame hitch.
**Why it happens:** Three.js compiles shader programs on first render of a material. Unmounting destroys compiled shader; remounting recompiles.
**How to avoid:** Use `<group visible={chapter === 0}><IntroScene /></group>` — keep geometry on GPU, just hide it.
**Warning signs:** Visible stutter/freeze of 16-50ms at chapter transition boundaries in Chrome Performance tab.

### Pitfall 2: useTexture Suspense Blocks Loading

**What goes wrong:** `useTexture` inside a project scene causes the entire Suspense boundary to suspend until that chapter's textures load — user sees blank scene.
**Why it happens:** useTexture is Suspense-aware; without preloading, each chapter's textures fetch lazily on first show.
**How to avoid:** Call `useTexture.preload('/projects/N/hero.webp')` at module level (outside component) so texture starts loading immediately when JS bundle evaluates.
**Warning signs:** LoadingScreen disappears, then blank scene for 0.5-2s when scrolling to first project chapter.

### Pitfall 3: Float32Array Created on Every Render

**What goes wrong:** Particle positions are regenerated on every React re-render, causing GC pressure and visible position scrambling.
**Why it happens:** `new Float32Array(count * 3)` inside a render function without `useMemo`.
**How to avoid:** Always wrap particle position generation in `useMemo(fn, [])` with empty deps — generate once.
**Warning signs:** Particles jitter/teleport; React DevTools Profiler shows repeated re-renders.

### Pitfall 4: WOFF Font URL Mismatch for Korean

**What goes wrong:** Pretendard WOFF from jsDelivr renders Latin characters but Korean glyphs appear as tofu (rectangles) or trigger a CDN fallback font download.
**Why it happens:** Some WOFF subsets of Pretendard only include Latin + essential Korean; troika parses the font directly and needs the full glyph set.
**How to avoid:** Use the full variable font URL (`pretendardvariable.min.css` only loads CSS, not the woff directly). Point `font` prop to a direct `.woff` or `.woff2` file. Test with actual Korean characters in the component.
**Warning signs:** Korean text renders with different typeface than the rest of the page, or console shows font fallback messages from troika.

### Pitfall 5: Particle Depth Sorting Artifacts

**What goes wrong:** Particles appear in front of opaque geometry they should be behind, or flicker with ordering changes.
**Why it happens:** Transparent materials require depth sorting; `depthWrite={true}` (default) causes transparent particles to write to depth buffer incorrectly.
**How to avoid:** Always set `depthWrite={false}` on particle `<pointsMaterial>`. Render opaque geometry before particles (natural Three.js render order).
**Warning signs:** Particles "cut through" opaque scene objects; flickering when camera moves.

### Pitfall 6: Camera Waypoints Don't Match Scene Content

**What goes wrong:** Chapter 2's project scene is positioned at `position(5, 1.5, 3)` but the texture planes and objects in Project1Scene are placed at `position([0, 0, 0])` — camera looks at nothing.
**Why it happens:** Phase 7 used placeholder waypoints; Phase 8 must co-design waypoints and scene object positions together.
**How to avoid:** Design each scene's 3D object positions FIRST, then update `chapters.ts` camera `position` and `lookAt` to frame those objects. Iterate in dev with `<axesHelper>` visible.
**Warning signs:** Camera scrolls but scene content is always off-screen or at wrong depth.

---

## Code Examples

Verified patterns from installed packages (inspected from node_modules):

### useTexture Single Image (verified from drei Texture.d.ts)

```tsx
// Source: Inspected node_modules/@react-three/drei/core/Texture.d.ts
import { useTexture } from '@react-three/drei';

function HeroPlane() {
  const texture = useTexture('/projects/1/hero.webp');
  return (
    <mesh>
      <planeGeometry args={[3.2, 2]} /> {/* 16:10 aspect */}
      <meshBasicMaterial map={texture} transparent />
    </mesh>
  );
}
// Preload at module level:
useTexture.preload('/projects/1/hero.webp');
```

### drei Stars (verified from Stars.d.ts + Stars.js)

```tsx
// Source: Inspected node_modules/@react-three/drei/core/Stars.d.ts + Stars.js
import { Stars } from '@react-three/drei';

// Stars props: radius, depth, count, factor, saturation, fade, speed
// Default count=5000 — set to 2000-3000 for SCENE-03 budget
<Stars
  radius={80}
  depth={50}
  count={2000}
  factor={2}
  saturation={0.2}
  fade
  speed={0.3}
/>
```

### drei Text (verified from Text.d.ts, troika-three-text installed)

```tsx
// Source: Inspected node_modules/@react-three/drei/core/Text.d.ts
import { Text } from '@react-three/drei';

<Text
  fontSize={0.4}
  color="#ffffff"
  anchorX="center"
  anchorY="middle"
  font="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/woff/Pretendard-Bold.woff"
  maxWidth={4}
>
  박훈일
</Text>
```

### BufferGeometry Particles (verified pattern from R3F docs + inspection)

```tsx
// Source: R3F official BufferGeometry patterns + Maxime Heckel particle article
const positions = useMemo(() => {
  const arr = new Float32Array(2000 * 3);
  for (let i = 0; i < 2000; i++) {
    arr[i * 3] = (Math.random() - 0.5) * 30;
    arr[i * 3 + 1] = (Math.random() - 0.5) * 10;
    arr[i * 3 + 2] = (Math.random() - 0.5) * 40;
  }
  return arr;
}, []);

<points>
  <bufferGeometry>
    <bufferAttribute
      attach="attributes-position"
      count={2000}
      array={positions}
      itemSize={3}
    />
  </bufferGeometry>
  <pointsMaterial
    size={0.03}
    color="#8888ff"
    sizeAttenuation
    transparent
    opacity={0.5}
    depthWrite={false}
  />
</points>
```

### Visibility Toggle per Chapter (prevents VRAM growth)

```tsx
// Source: R3F pitfall docs pattern + direct verification
// Using useRef array + useFrame mutation — no React state overhead
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getChapterIndex } from '../config/chapters';
import { useScrollProgress } from '../hooks/useScrollProgress';

const groupRefs = useRef<(THREE.Group | null)[]>([]);
const progressRef = useScrollProgress();

useFrame(() => {
  const idx = getChapterIndex(progressRef.current);
  groupRefs.current.forEach((g, i) => {
    if (g) g.visible = (i === idx);
  });
});
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `TextGeometry` + FontLoader for text | drei `<Text>` (troika SDF) | drei v6+ | No font JSON conversion needed; direct TTF/WOFF; SDF quality vs geometry |
| Separate particle shader npm package | Raw `<points>` + `<bufferGeometry>` in R3F | R3F v7+ | First-class JSX support for BufferGeometry in R3F; no separate library needed |
| `useLoader(TextureLoader, url)` | `useTexture(url)` from drei | drei v8+ | Cleaner API with preload, multiple texture syntaxes, Suspense integration |
| Three.js `PlaneBufferGeometry` | `<planeGeometry>` | Three.js r125 | PlaneBufferGeometry merged into PlaneGeometry; use `<planeGeometry>` in JSX |

**Deprecated/outdated:**
- `PlaneBufferGeometry`: Use `<planeGeometry>` — merged in Three.js r125
- `BufferAttribute` constructor with `new THREE.BufferAttribute(arr, 3)` in JSX: Use `<bufferAttribute attach="attributes-position" array={arr} itemSize={3} count={n} />` in R3F
- `drei v9 encodings_fragment` vs `colorspace_fragment`: Stars.js in drei 10.7.7 handles both automatically via version check

---

## Open Questions

1. **Pretendard WOFF vs unicode-font-resolver for Korean**
   - What we know: Pretendard is the project font (loaded in globals.css); troika auto-falls back to Noto if glyph missing; jsDelivr CDN serves Pretendard woff files
   - What's unclear: Whether the specific jsDelivr Pretendard WOFF file includes full Hangul coverage or is Latin-subset-only
   - Recommendation: In IntroScene implementation, test with Korean characters. If tofu appears, add `font="https://fonts.gstatic.com/s/notosanskr/..."` as explicit fallback via troika `unicodeFontResolver` option, OR use English-only text for the 3D layer and Korean in HTML overlay (Phase 9)

2. **Camera waypoint refinement — Phase 8's co-dependency with chapters.ts**
   - What we know: Phase 7 placed placeholder waypoints in `chapters.ts`; Phase 8 comment says "Positions and lookAt targets are placeholder values to be tuned in Phase 8"
   - What's unclear: The actual 3D positions and rotations for each project scene's objects — these determine what the camera waypoints should be
   - Recommendation: Each plan within Phase 8 should design the scene's 3D object layout first, then specify updated `chapters.ts` waypoints to match. Expect 2 rounds of iteration.

3. **Chapter-entry animation triggering**
   - What we know: Phase 8 success criteria doesn't require entry animations (that's Phase 10 Typography). But some visual reveal on chapter enter would make the scenes feel more complete.
   - What's unclear: Whether GSAP animation triggered on chapter change belongs in Phase 8 or is deferred to Phase 10.
   - Recommendation: Phase 8 makes scenes visible; Phase 10 adds animated reveals. Keep Phase 8 simple — visibility only.

4. **5 project IDs mapping to 5 scenes**
   - What we know: Public folder has projects 1-6 (including 6 which appears to be a 6th project). CHAPTERS config has intro + 5 projects. chapters.ts has `project-1` through `project-5`.
   - What's unclear: Which of the 6 public project folders (1-6) map to the 5 chapter project slots.
   - Recommendation: During plan creation, align `chapters.ts` chapter IDs with public project folder numbers. Project 6 may be omitted from lab2 if only 5 project chapters are configured.

---

## Sources

### Primary (HIGH confidence)

- `node_modules/@react-three/drei/core/Text.d.ts` — Text component API, font prop, troika-three-text backing
- `node_modules/@react-three/drei/core/Texture.d.ts` — useTexture API, preload method
- `node_modules/@react-three/drei/core/Stars.d.ts` + `Stars.js` — Stars props, particle implementation pattern
- `node_modules/@react-three/drei/core/Points.d.ts` — PointsBuffer API
- `node_modules/@react-three/drei/core/PerformanceMonitor.d.ts` — PerformanceMonitor API
- `node_modules/@react-three/drei/package.json` — drei 10.7.7, troika-three-text as direct dependency
- `node_modules/three/package.json` — three 0.182.0
- `node_modules/three/src/core/BufferGeometry.js` — dispose() method confirmed
- `node_modules/three/src/materials/Material.js` — dispose() method confirmed
- R3F Performance Pitfalls doc (https://r3f.docs.pmnd.rs/advanced/pitfalls) — conditional rendering anti-pattern, automatic disposal, useMemo for geometry
- troika-three-text npm README (https://www.npmjs.com/package/troika-three-text) — Korean/unicode support, web worker processing, unicode-font-resolver

### Secondary (MEDIUM confidence)

- [Texture Disposal in R3F — Three.js forum](https://discourse.threejs.org/t/texture-disposal-in-r3f/57471) — useTexture.clear() doesn't dispose, must call texture.dispose() separately
- [The Magical World of Particles with R3F — Maxime Heckel](https://blog.maximeheckel.com/posts/the-magical-world-of-particles-with-react-three-fiber-and-shaders/) — Float32Array + useMemo pattern, GPU shader approach for large particle counts

### Tertiary (LOW confidence)

- [R3F Loading Textures docs](https://r3f.docs.pmnd.rs/tutorials/loading-textures) — useTexture patterns; verified against node_modules inspection

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all packages installed and inspected from node_modules; no new installs needed
- Architecture: HIGH — visibility toggle pattern sourced directly from R3F official pitfall docs; code patterns derived from installed package type signatures
- Pitfalls: HIGH for disposal/rendering patterns (sourced from official docs); MEDIUM for Korean font (needs empirical test in implementation)
- Open questions: clearly flagged, not blocking research conclusions

**Research date:** 2026-03-01
**Valid until:** 2026-04-01 (stable ecosystem — drei/R3F/Three.js are mature; patterns unlikely to change within 30 days)
