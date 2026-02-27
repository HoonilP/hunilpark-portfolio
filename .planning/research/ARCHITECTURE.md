# Architecture Research: /lab2 Scroll-Driven 3D Interactive Portfolio

**Domain:** Media-art style 3D interactive portfolio integrated into Next.js App Router
**Researched:** 2026-02-28
**Confidence:** HIGH (existing /lab codebase verified; R3F, GSAP, Three.js official docs cross-referenced)

---

## Context: What Already Exists

The project already ships a working `/lab` route with a proven scroll-driven 3D pattern. `/lab2` must extend and improve on this — not reinvent it. Understanding what `/lab` does is essential before designing `/lab2`.

**Current /lab architecture (verified in codebase):**
- `app/[locale]/lab/page.tsx` — `'use client'` page, owns a `scrollRef` div and tracks scroll progress via `onScroll`
- `app/[locale]/lab/layout.tsx` — thin layout that calls `setRequestLocale()` and passes `children` through; suppresses the locale layout's Header/Footer because the page uses `fixed inset-0 z-[60]` to overlay everything
- `components/lab/LabScene.tsx` — `dynamic()` imported with `ssr: false`; wraps R3F `<Canvas>`
- `components/lab/CameraRig.tsx` — lives inside Canvas, reads `scrollProgress` prop, lerps camera between 5 waypoints each `useFrame`
- `components/lab/Room.tsx` — loads `room.glb` via `useGLTF`, renders as `<primitive>`
- `components/lab/ContentPanel.tsx` — fixed DOM overlay panel driven by `activeSection` derived from `scrollProgress`

**Key pattern already proven:** scroll container → progress float [0,1] → prop into Canvas → `useFrame` lerp. This is the correct architecture. `/lab2` uses the same spine with new scenes.

---

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│  NEXT.JS APP ROUTER  src/app/[locale]/lab2/                         │
│                                                                     │
│  layout.tsx  ←── setRequestLocale() only, no Header/Footer          │
│  page.tsx    ←── 'use client', owns scroll container + state        │
└────────────────────────────┬────────────────────────────────────────┘
                             │  scrollProgress: number [0..1]
                             │  activeScene: SceneKey
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│  SCROLL MANAGEMENT LAYER                                            │
│                                                                     │
│  <div ref={scrollRef} style="overflow-y:scroll; height:100vh">      │
│    <div style="height: Nvh" />   ← scroll spacer, N = scene count   │
│  </div>                                                             │
│                                                                     │
│  Derives: scrollProgress, activeScene, sceneLocalProgress           │
└────────────────────────────┬────────────────────────────────────────┘
                             │ props
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│  R3F CANVAS LAYER  (dynamic import, ssr:false)                      │
│                                                                     │
│  <Canvas sticky top-0 h-screen>                                     │
│    <Suspense>                                                        │
│      <SceneRouter scrollProgress sceneKey />   ← switches scenes    │
│      <PostProcessing />                         ← bloom, vignette   │
│    </Suspense>                                                       │
│    <CameraRig scrollProgress />                 ← outside Suspense  │
│  </Canvas>                                                          │
└────────────────────────────┬────────────────────────────────────────┘
                             │ activeScene, localProgress
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│  DOM OVERLAY LAYER  (fixed, z-[80], pointer-events-none container)  │
│                                                                     │
│  <HUD />                ← back link, scroll hint, section dots      │
│  <ContentPanel          ← glassmorphism card, animates with FM       │
│    activeScene          ← from scroll progress derivation            │
│    localProgress />     ← for within-scene animations               │
└─────────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| `lab2/layout.tsx` | `setRequestLocale()` + passthrough | Server component, identical to existing `lab/layout.tsx` |
| `lab2/page.tsx` | Scroll container, progress derivation, scene routing | `'use client'`, owns `scrollRef`, derives `scrollProgress` + `activeScene` |
| `Lab2Scene` | R3F Canvas wrapper, scene composition | `dynamic(() => import(...), {ssr:false})`, wraps Canvas + all R3F children |
| `SceneRouter` | Mounts/unmounts per-scene geometry | Renders scene component matching `sceneKey`, transitions via opacity/shader |
| `CameraRig` | Camera position animation on scroll | `useFrame` lerp between waypoints, lives inside Canvas |
| `scenes/IntroScene` | Opening particle/shader scene | R3F group, self-contained geometry + shaders |
| `scenes/ProjectsScene` | Project showcase 3D elements | Instanced meshes or floating cards in 3D |
| `scenes/SkillsScene` | Skills visualization | Particle system or data-driven geometry |
| `scenes/ContactScene` | Closing scene | Minimal, atmospheric |
| `ContentPanel` | DOM content overlay | Framer Motion `AnimatePresence` + `motion.div` |
| `HUD` | Navigation dots, back link, hints | Fixed positioned, z-[80] |
| `PostProcessing` | Bloom, vignette, chromatic aberration | `@react-three/postprocessing` |
| `shaders/` | GLSL vertex/fragment files | `.glsl` files, imported as strings via raw-loader |

---

## Recommended Project Structure

```
src/
├── app/
│   └── [locale]/
│       ├── lab/                     # EXISTING — do not touch
│       └── lab2/
│           ├── layout.tsx           # NEW: setRequestLocale passthrough only
│           └── page.tsx             # NEW: scroll container + orchestration
│
├── components/
│   ├── lab/                         # EXISTING — do not touch
│   └── lab2/
│       ├── Lab2Scene.tsx            # Canvas wrapper (dynamic import target)
│       ├── CameraRig2.tsx           # Camera interpolation for lab2 waypoints
│       ├── SceneRouter.tsx          # Mounts active scene by key
│       ├── scenes/
│       │   ├── IntroScene.tsx       # Scene 0: atmospheric opener
│       │   ├── AboutScene.tsx       # Scene 1: identity/bio visualization
│       │   ├── ProjectsScene.tsx    # Scene 2: project showcase
│       │   ├── SkillsScene.tsx      # Scene 3: tech stack visualization
│       │   └── ContactScene.tsx     # Scene 4: closing
│       ├── materials/
│       │   ├── ParticleMaterial.tsx # Custom shaderMaterial via drei extend
│       │   ├── WaveMaterial.tsx     # Scroll-reactive wave shader
│       │   └── GlowMaterial.tsx     # Post-processing glow material
│       ├── effects/
│       │   ├── Lighting2.tsx        # Scene lighting
│       │   └── PostProcessing.tsx   # @react-three/postprocessing effects
│       ├── ui/
│       │   ├── LoadingScreen2.tsx   # Loading overlay (reuse lab/ style)
│       │   ├── ContentPanel2.tsx    # Framer Motion animated content overlay
│       │   └── HUD.tsx              # Fixed UI: back link, dots, scroll hint
│       └── hooks/
│           ├── useScrollProgress.ts # Scroll → progress derivation
│           └── useSceneState.ts     # activeScene + localProgress derivation
```

### Structure Rationale

- **`lab2/` isolated from `lab/`:** No shared components between them — /lab is stable, /lab2 is the new build. Accidental coupling causes regressions.
- **`hooks/` inside `lab2/`:** Scroll and scene logic are tightly coupled to this route only. Scoping them here prevents leaking into the main site.
- **`materials/` separate from `scenes/`:** Shader materials are reusable across scenes; scenes compose materials, not the reverse.
- **`SceneRouter` not a switch/case in page.tsx:** Keeps page.tsx focused on scroll management. SceneRouter is a boundary for code splitting (each scene can be `React.lazy()`).

---

## Architectural Patterns

### Pattern 1: Sticky Canvas + Scroll Spacer

**What:** The Canvas element is `position:sticky; top:0; height:100vh` inside a parent that overflows. The parent has a `height: N*100vh` spacer that creates scroll travel. The R3F scene reads scroll progress as a plain float, never animates DOM.

**When to use:** Always. This is the proven pattern from `/lab`. The Canvas never scrolls — it stays fixed in the viewport while the scroll container below creates the illusion of "moving through" scenes.

**Trade-offs:** Scroll is captured by a custom container div, not `window`. This means `useScroll` from Framer Motion and Lenis both need to target the ref, not `window`. The existing `/lab` code uses this correctly — replicate that pattern.

**Example:**
```tsx
// lab2/page.tsx
export default function Lab2Page() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollHeight - el.clientHeight;
      setScrollProgress(max > 0 ? el.scrollTop / max : 0);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div ref={scrollRef} className="fixed inset-0 z-[60] overflow-y-auto bg-black">
      {/* Canvas: sticky, always covers viewport */}
      <div className="sticky top-0 h-screen w-full">
        <Lab2Scene scrollProgress={scrollProgress} />
      </div>
      {/* Scroll travel: 5 scenes × 100vh each */}
      <div className="h-[500vh]" />
      {/* Fixed UI elements */}
      <HUD scrollProgress={scrollProgress} />
      <ContentPanel activeScene={activeScene} />
    </div>
  );
}
```

---

### Pattern 2: Ref-Based State Inside useFrame (No React State for Animation)

**What:** Values that change every frame (camera lerp targets, shader uniforms, particle offsets) live in `useRef`, never `useState`. React state triggers re-renders; `useRef` updates happen inside the R3F render loop without React involvement.

**When to use:** Any value that needs to update at 60fps. Only use `useState`/`useReducer` for discrete scene transitions or content panel switching.

**Trade-offs:** Refs are not reactive — components cannot "watch" a ref change. This is correct for animation values; use state only for the high-level scene key derived from scroll thresholds.

**Example:**
```tsx
// CameraRig2.tsx
export function CameraRig2({ scrollProgress }: { scrollProgress: number }) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3());
  const targetLook = useRef(new THREE.Vector3());

  useFrame(() => {
    // Compute target from scrollProgress
    interpolateWaypoints(scrollProgress, WAYPOINTS, targetPos.current, targetLook.current);
    // Smooth damping — never setState here
    camera.position.lerp(targetPos.current, 0.06);
    currentLook.current.lerp(targetLook.current, 0.06);
    camera.lookAt(currentLook.current);
  });

  return null;
}
```

---

### Pattern 3: Scroll Progress → Scene Key Derivation (Outside Canvas)

**What:** Convert raw `scrollProgress` [0..1] into discrete `activeScene: SceneKey` and `localProgress: number` [0..1] in the page component, before passing to either Canvas or ContentPanel. Both layers consume the same derived state.

**When to use:** Every time you need to know "which scene are we in" or "how far through this scene are we."

**Trade-offs:** Derivation happens in React render, not in `useFrame`. This is fine — scene transitions are infrequent (once per scroll quarter). The Canvas receives the raw `scrollProgress` for smooth animation; the DOM overlay receives the derived `activeScene` for discrete content switches.

**Example:**
```tsx
// hooks/useSceneState.ts
const SCENES: SceneKey[] = ['intro', 'about', 'projects', 'skills', 'contact'];

export function useSceneState(scrollProgress: number) {
  const sceneCount = SCENES.length;
  const rawScene = scrollProgress * (sceneCount - 1);
  const sceneIndex = Math.min(Math.floor(rawScene), sceneCount - 2);
  const localProgress = rawScene - sceneIndex;

  return {
    activeScene: SCENES[Math.round(rawScene)] as SceneKey,
    sceneIndex,
    localProgress, // 0..1 within current scene
  };
}
```

---

### Pattern 4: Custom ShaderMaterial via drei `extend`

**What:** Use drei's `shaderMaterial` helper to create typed, JSX-ready shader materials. Declare uniforms, vertex shader, and fragment shader. Call `extend({ MyMaterial })` to register as a JSX element. Update uniforms each frame via `materialRef.current.uTime = clock.elapsedTime`.

**When to use:** Any time you need visual effects beyond standard PBR materials — particle systems, wave deformations, glow, noise-based animation.

**Trade-offs:** GLSL must be managed as separate `.glsl` files or inline template literals. Inline is simpler for prototyping but harder to maintain. External `.glsl` files require a webpack raw-loader or vite plugin. Given the existing setup uses Next.js with Turbopack dev, test `.glsl` import approach early.

**Example:**
```tsx
// materials/ParticleMaterial.tsx
import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';

const ParticleMaterial = shaderMaterial(
  { uTime: 0, uScrollProgress: 0, uColor: new THREE.Color('#ffffff') },
  // vertex shader
  `
    uniform float uTime;
    uniform float uScrollProgress;
    void main() {
      vec3 pos = position;
      pos.y += sin(pos.x * 3.0 + uTime) * 0.1 * uScrollProgress;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      gl_PointSize = 2.0;
    }
  `,
  // fragment shader
  `
    uniform vec3 uColor;
    void main() {
      gl_FragColor = vec4(uColor, 0.8);
    }
  `
);

extend({ ParticleMaterial });

// Usage in scene:
// <points>
//   <particleMaterial ref={matRef} uTime={0} uScrollProgress={0} />
// </points>
```

---

### Pattern 5: Framer Motion AnimatePresence for Content Panel Transitions

**What:** Wrap content sections in `<AnimatePresence mode="wait">` with `<motion.div>` children keyed by `activeScene`. When scene changes, the exiting element animates out before the entering one animates in.

**When to use:** ContentPanel2 switching between About/Projects/Skills/Contact content. This is the DOM layer — no R3F needed here.

**Trade-offs:** Framer Motion adds ~50kb to the bundle. For /lab2 (already a heavy 3D route), this cost is acceptable since the route already loads Three.js (~500kb). Framer Motion is NOT acceptable on the main portfolio route.

**Example:**
```tsx
// ui/ContentPanel2.tsx
import { AnimatePresence, motion } from 'framer-motion';

export function ContentPanel2({ activeScene }: { activeScene: SceneKey }) {
  if (!activeScene || activeScene === 'intro') return null;

  return (
    <div className="fixed inset-y-0 right-0 z-[80] w-full max-w-md pointer-events-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeScene}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="pointer-events-auto ..."
        >
          {activeScene === 'about' && <AboutContent />}
          {activeScene === 'projects' && <ProjectsContent />}
          {activeScene === 'skills' && <SkillsContent />}
          {activeScene === 'contact' && <ContactContent />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
```

---

### Pattern 6: Progressive Asset Loading with Suspense Boundaries

**What:** Wrap expensive scene components in nested `<Suspense>` inside the Canvas. Use `useGLTF.preload()` at module level for critical assets. Less critical scenes load on demand.

**When to use:** Any scene that loads `.glb` models or large textures. The intro scene should load first; project scenes can be lazy-loaded.

**Trade-offs:** Multiple Suspense boundaries mean multiple loading states. Use a single top-level loading screen that waits for the intro scene, then let subsequent scenes load silently behind the camera.

**Example:**
```tsx
// Lab2Scene.tsx
export function Lab2Scene({ scrollProgress }: { scrollProgress: number }) {
  return (
    <Canvas dpr={[1, 1.5]} camera={{ fov: 50 }}>
      <color attach="background" args={['#050508']} />
      <Suspense fallback={null}>
        {/* Intro always loaded */}
        <IntroScene scrollProgress={scrollProgress} />

        {/* Subsequent scenes: lazy-load as user scrolls */}
        <Suspense fallback={null}>
          <AboutScene scrollProgress={scrollProgress} />
        </Suspense>
        <Suspense fallback={null}>
          <ProjectsScene scrollProgress={scrollProgress} />
        </Suspense>

        <Preload all />
        <PostProcessing />
      </Suspense>
      <CameraRig2 scrollProgress={scrollProgress} />
    </Canvas>
  );
}
```

---

## Data Flow

### Scroll → 3D State Flow

```
User scrolls div#lab2-scroll-container
          │
          ▼
onScroll handler (passive listener on scrollRef)
          │
          ▼ setScrollProgress(el.scrollTop / max)
          │
┌─────────┴──────────────────────────┐
│         React re-render             │
│  scrollProgress: 0.0 → 1.0         │
│  activeScene = deriveScene(sp)      │
│  localProgress = deriveLocal(sp)    │
└─────────┬──────────────────────────┘
          │
    ┌─────┴──────────────────────────┐
    │                                │
    ▼                                ▼
Lab2Scene (Canvas)            ContentPanel2 + HUD (DOM)
    │                                │
    ▼                                ▼
scrollProgress prop           activeScene prop
passed to CameraRig2          AnimatePresence key
and each Scene component      triggers content switch
    │
    ▼
useFrame() loop (60fps)
  - camera.position.lerp(...)
  - materialRef.current.uScrollProgress = scrollProgress
  - No React re-renders
```

### State Ownership

| State | Owner | Type | Why |
|-------|-------|------|-----|
| `scrollProgress` | `page.tsx` | `useState<number>` | Needs to trigger re-render to pass to Canvas |
| `activeScene` | `page.tsx` (derived) | `SceneKey` | Derived from scrollProgress each render |
| `localProgress` | `page.tsx` (derived) | `number` | Scene-internal progress for fine animations |
| Camera lerp target | `CameraRig2.tsx` | `useRef<Vector3>` | Animation value, must not trigger re-render |
| Shader uniforms | Each Scene component | `useRef` | Animation values, updated in useFrame |
| Content panel visibility | Derived from `activeScene` | None (pure derivation) | No separate state needed |

---

## Integration Points with Existing Architecture

### New Files (create these)

| File | Status | Notes |
|------|--------|-------|
| `src/app/[locale]/lab2/layout.tsx` | NEW | Copy from `lab/layout.tsx` exactly — same `setRequestLocale` pattern |
| `src/app/[locale]/lab2/page.tsx` | NEW | `'use client'`, owns scroll container |
| `src/components/lab2/**` | NEW | All lab2 components |

### Modified Files (none expected)

The `/lab2` route should not modify any existing files. The locale layout at `[locale]/layout.tsx` renders `Header` and `Footer`, but `lab2/page.tsx` will use `fixed inset-0 z-[60]` to overlay them — the same technique used by `/lab`.

### Shared Infrastructure (reuse as-is)

| Existing | How /lab2 Uses It |
|----------|-------------------|
| `app/[locale]/layout.tsx` | Provides `NextIntlClientProvider` and `ThemeProvider` — used unchanged |
| `i18n/navigation.ts` | `Link` for the "back to home" button in HUD |
| `useTranslations()` | Content in `ContentPanel2` uses existing translation keys |
| `messages/ko.json` + `en.json` | Lab2 content added under new `Lab2` namespace |
| `public/projects/*/thumbnail.webp` | Project thumbnails reused in ProjectsScene DOM overlay |

### Next.js-Specific Integration Notes

1. **`dynamic()` with `ssr: false` is mandatory** — Three.js + R3F use browser globals (`window`, `WebGLRenderingContext`). Without `ssr: false`, the build fails. This is proven in `/lab`. Do the same for `/lab2`.

2. **`setRequestLocale()` in layout.tsx** — Required for static rendering with next-intl v4. Without it, the page falls back to dynamic rendering. Copy `lab/layout.tsx` verbatim.

3. **`generateStaticParams()` in layout.tsx** — Must export both `ko` and `en` params. Already shown in `lab/layout.tsx`.

4. **No `output: 'export'` conflict** — The project does not use static export mode (it uses Vercel). R3F with `dynamic` import works normally under standard Next.js build.

5. **Turbopack dev mode** — The project uses `next dev --turbopack`. GLSL file imports as raw strings may require Turbopack config. Prefer inline template literals for shader strings to avoid this complexity.

---

## Performance Optimization Patterns

### DPR Capping

```tsx
<Canvas dpr={[1, 1.5]}>
```

Caps at 1.5x pixel ratio. On 3x Retina displays, this halves GPU work with minimal visual quality loss. The existing `/lab` uses this correctly.

### On-Demand Rendering for Static Scenes

```tsx
<Canvas frameloop="demand">
```

Only renders when `invalidate()` is called. Use for scenes with no continuous animation. For scroll-driven scenes with constant `useFrame` activity, keep `frameloop="always"` (default). Evaluate per-scene: particle scenes always need frames; a static "contact" scene could use demand.

### PerformanceMonitor for Adaptive Quality

```tsx
import { PerformanceMonitor } from '@react-three/drei';

function Scene() {
  const [dpr, setDpr] = useState(1.5);
  return (
    <Canvas dpr={dpr}>
      <PerformanceMonitor
        onDecline={() => setDpr(1)}
        onIncline={() => setDpr(1.5)}
      />
      {/* ... */}
    </Canvas>
  );
}
```

Automatically reduces pixel ratio when FPS drops below threshold. Recommended for 3D-heavy scenes.

### Geometry and Material Disposal

R3F does not auto-dispose Three.js objects when components unmount. Scenes that unmount must dispose their geometries and materials:

```tsx
useEffect(() => {
  return () => {
    geometry.dispose();
    material.dispose();
  };
}, []);
```

Failure to dispose causes VRAM leaks when scenes transition. This is the most common memory bug in multi-scene R3F apps.

### `useLoader` Caching

```tsx
const { scene } = useGLTF('/models/scene.glb');
useGLTF.preload('/models/scene.glb'); // Module-level preload
```

`useGLTF` (via `useLoader` internally) caches by URL. The same model loaded in two components returns the same cached object. Call `.preload()` at module level to begin loading before the component mounts.

---

## Anti-Patterns

### Anti-Pattern 1: Passing Animation State Through React State

**What people do:** Use `useState` for values that change every frame (camera rotation, shader uniforms, particle positions).

**Why it's wrong:** Each `setState` triggers a React re-render. At 60fps, this means 60 re-renders per second, causing severe jank and React scheduler pressure.

**Do this instead:** Use `useRef` for all animation values. Only use `useState` for discrete events (scene changed, loading complete, content panel visible/hidden).

---

### Anti-Pattern 2: R3F Components Outside Canvas

**What people do:** Attempt to render `<mesh>`, `<pointLight>`, or other R3F components outside the `<Canvas>` context.

**Why it's wrong:** R3F components require the Three.js renderer context provided by `<Canvas>`. Outside it, they throw "R3F: Hooks can only be used within the Canvas component!" errors.

**Do this instead:** All Three.js objects live inside `<Canvas>`. DOM elements live outside. Use `useThree()` inside Canvas, never outside.

---

### Anti-Pattern 3: Creating New THREE Objects in useFrame

**What people do:** `useFrame(() => { const v = new THREE.Vector3(...); camera.lookAt(v); })`

**Why it's wrong:** Allocates a new object on every frame (60 times/second). This triggers garbage collection, causing frame drops and memory pressure.

**Do this instead:** Create objects outside `useFrame` with `useRef`, mutate them in-place each frame:
```tsx
const lookTarget = useRef(new THREE.Vector3());
useFrame(() => {
  lookTarget.current.set(x, y, z);
  camera.lookAt(lookTarget.current);
});
```

---

### Anti-Pattern 4: Disabling SSR Without dynamic()

**What people do:** Import Three.js or R3F directly at the top of a server-rendered component without `dynamic()`.

**Why it's wrong:** Three.js accesses `window` and `WebGLRenderingContext` during import. Server rendering has no browser globals — the build crashes with "window is not defined."

**Do this instead:**
```tsx
// page.tsx or a server-compatible wrapper
const Lab2Scene = dynamic(() => import('./Lab2Scene'), { ssr: false });
```

---

### Anti-Pattern 5: One Giant Scene Component

**What people do:** Put all scene geometry, lighting, shaders, and animations in a single `LabScene.tsx` file.

**Why it's wrong:** Monolithic scenes become unmaintainable at 300+ lines. Adding new scenes requires touching the same file. No code splitting possible.

**Do this instead:** `SceneRouter` pattern — each scene is its own component. `SceneRouter` mounts/unmounts based on `activeScene`. Each scene can be `React.lazy()`-loaded.

---

### Anti-Pattern 6: Framer Motion on the Main Portfolio Route

**What people do:** Install Framer Motion globally and use it across all pages.

**Why it's wrong:** Framer Motion adds ~50kb to the JavaScript bundle. The main portfolio route targets performance (Lighthouse >90). This cost is unacceptable on routes that don't need complex animations.

**Do this instead:** Import Framer Motion only inside `components/lab2/` components. Never import it in `components/sections/`, `components/layout/`, or any main-route component.

---

## Build Order (Dependency-Aware)

Dependencies flow strictly downward. Each step can start only when its inputs are complete.

```
Step 1: Route scaffold (no deps)
  └─ app/[locale]/lab2/layout.tsx   ← copy from lab/layout.tsx
  └─ app/[locale]/lab2/page.tsx     ← shell, no scene yet

Step 2: Canvas wrapper (depends on: Step 1)
  └─ components/lab2/Lab2Scene.tsx  ← Canvas + Suspense + placeholder
  └─ components/lab2/ui/LoadingScreen2.tsx

Step 3: Camera + scroll logic (depends on: Step 2)
  └─ components/lab2/hooks/useScrollProgress.ts
  └─ components/lab2/hooks/useSceneState.ts
  └─ components/lab2/CameraRig2.tsx
  └─ Wire scrollProgress from page.tsx → Lab2Scene → CameraRig2

Step 4: HUD + Content Panel shell (depends on: Step 3)
  └─ components/lab2/ui/HUD.tsx           ← back link, scroll hint
  └─ components/lab2/ui/ContentPanel2.tsx ← AnimatePresence shell (Framer Motion install here)

Step 5: Shader materials (depends on: Step 2)
  └─ components/lab2/materials/ParticleMaterial.tsx
  └─ components/lab2/materials/WaveMaterial.tsx

Step 6: Individual scenes (depends on: Steps 3 + 5)
  Build in scroll order. Each scene is independently deployable.
  └─ scenes/IntroScene.tsx    ← verify scroll→camera works
  └─ scenes/AboutScene.tsx    ← verify scene transition
  └─ scenes/ProjectsScene.tsx
  └─ scenes/SkillsScene.tsx
  └─ scenes/ContactScene.tsx

Step 7: SceneRouter (depends on: Step 6)
  └─ components/lab2/SceneRouter.tsx  ← mount/unmount scenes by key

Step 8: Post-processing (depends on: Step 6)
  └─ components/lab2/effects/PostProcessing.tsx
  └─ Install @react-three/postprocessing

Step 9: Content panel content (depends on: Steps 4 + 6)
  └─ Add actual About/Projects/Skills/Contact content to ContentPanel2
  └─ Add Lab2 namespace to messages/ko.json + messages/en.json

Step 10: Polish + performance audit
  └─ PerformanceMonitor integration
  └─ Geometry disposal on scene unmount
  └─ Lighthouse check (main route must not regress)
```

**Critical path:** Steps 1 → 2 → 3 are linear (each depends on previous). Steps 5, 4 can run in parallel with Step 3. Steps 6a (IntroScene) verifies the whole pipeline before building remaining scenes.

---

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 5 scenes (current plan) | Current architecture sufficient. Single Canvas, no instancing needed. |
| 10+ scenes | Add `React.lazy()` to SceneRouter for each scene. Load only active ± 1 scenes. |
| Complex GLB models per scene | Add `useGLTF.preload()` at the top of each scene file. Use `Detailed` (LOD) for objects > 10k triangles. |
| Mobile support (out of scope) | Would require PerformanceMonitor + drastic quality reduction + fallback 2D layout. Desktop-only is the correct call. |

---

## Sources

- **Existing /lab codebase** (verified): `src/app/[locale]/lab/`, `src/components/lab/` — HIGH confidence, directly inspected
- **R3F Performance Docs** (official): [r3f.docs.pmnd.rs/advanced/scaling-performance](https://r3f.docs.pmnd.rs/advanced/scaling-performance) — HIGH confidence
- **drei shaderMaterial** (official): [drei.docs.pmnd.rs/shaders/shader-material](https://drei.docs.pmnd.rs/shaders/shader-material) — HIGH confidence
- **r3f-scroll-rig architecture** (GitHub): [github.com/14islands/r3f-scroll-rig](https://github.com/14islands/r3f-scroll-rig) — MEDIUM confidence (validates sticky canvas pattern but library itself not needed here)
- **Codrops scroll-driven R3F tutorial** (Feb 2026): [tympanus.net/codrops/2026/02/17/reactive-depth](https://tympanus.net/codrops/2026/02/17/reactive-depth-building-a-scroll-driven-3d-image-tube-with-react-three-fiber/) — HIGH confidence (validates ref-based state pattern, unified motion system)
- **three.js forum — state management with R3F**: [discourse.threejs.org](https://discourse.threejs.org/t/how-to-use-state-management-with-react-three-fiber-without-performance-issues/61223) — MEDIUM confidence (validates useRef over useState for animation)

---

*Architecture research for: /lab2 scroll-driven 3D interactive portfolio*
*Researched: 2026-02-28*
