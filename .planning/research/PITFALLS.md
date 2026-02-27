# Pitfalls Research: Media-Art 3D Interactive Portfolio (/lab2)

**Domain:** Scroll-driven 3D interactive experience added to existing Next.js portfolio
**Researched:** 2026-02-28
**Confidence:** HIGH (R3F official docs + verified community patterns + multiple corroborating sources)

This file focuses exclusively on pitfalls when ADDING media-art 3D interactive features to
an existing Next.js 16 App Router portfolio that already has /lab (R3F + scroll-driven camera).
The existing codebase uses `dynamic(..., { ssr: false })`, `useFrame` refs, and a sticky-canvas
scroll pattern — all patterns that must be carried forward and extended carefully.

---

## Critical Pitfalls

### Pitfall 1: WebGL Context Leak on Route Navigation

**What goes wrong:**
Navigating between /lab2 and other routes remounts the `<Canvas>` component. Each mount
creates a new WebGLRenderer and GPU context. Browsers enforce hard context limits —
Chrome allows ~16 contexts on desktop, 8 on Android, Firefox mobile caps at 2 per
principal. Once the cap is hit the oldest context is silently killed. The Three.js scene
goes black; no error is thrown to the user.

**Why it happens:**
Developers treat the R3F `<Canvas>` like a normal React component and let Next.js App
Router unmount it on route change. The WebGLRenderer is not explicitly disposed, so its
GPU context lives on the GPU heap even after React unmounts the component.

**How to avoid:**
- Keep one `<Canvas>` instance alive for the entire /lab2 route subtree. Do NOT
  conditionally render the Canvas itself — toggle visibility of scene contents instead.
- On route exit, call `renderer.dispose()` and `.dispose()` on every Geometry, Material,
  and Texture in the scene via a cleanup `useEffect` return function.
- In R3F: use `<Stage visible={active} />` pattern rather than conditional mounting.
- Use `useLoader` (not raw `THREE.TextureLoader`) — it caches by URL and prevents
  redundant context allocations.

```tsx
// WRONG: Unmounts and remounts Canvas on every section change
{activeSection === 'hero' && <Canvas><HeroScene /></Canvas>}

// RIGHT: Keep Canvas alive, toggle mesh visibility
<Canvas>
  <HeroScene visible={activeSection === 'hero'} />
  <ProjectScene visible={activeSection === 'projects'} />
</Canvas>
```

**Warning signs:**
- Chrome console: "WARNING: Too many active WebGL contexts. Oldest context will be lost."
- Canvas goes black after navigating back to /lab2.
- `renderer.info.programs` count grows unbounded in DevTools.

**Phase to address:** Phase 1 (Foundation / Canvas setup). This architectural decision
must be correct from the first commit — it cannot be refactored cheaply later.

---

### Pitfall 2: setState Inside useFrame Causes Cascading Re-renders

**What goes wrong:**
Calling `setState` inside `useFrame` (or inside scroll event handlers that feed 3D
state) runs at 60fps, triggering 60 React reconciler cycles per second. Each cycle
re-renders every child of the component that holds the state, including DOM overlays,
Framer Motion components, and i18n text. The result is visible jank, dropped frames,
and CPU overload — independent of GPU load.

**Why it happens:**
Developers naturally reach for React state to share scroll position between the scroll
handler and the 3D scene, because that is how React data flow works. The existing /lab
implementation passes `scrollProgress` as a prop to `LabScene`, which is correct at low
update rates, but high-frequency animation state must bypass React entirely.

**How to avoid:**
- Store animation-driving values in refs, not state:
  `const progressRef = useRef(0)`
- Read refs directly in `useFrame`: `useFrame(() => { camera.position.lerp(target, progressRef.current) })`
- For scroll progress that drives both DOM overlays AND 3D: throttle the React state
  update (e.g. only call `setState` when entering a new section threshold), while the
  ref always has the raw value for `useFrame`.
- Use Zustand or Jotai with `useStore.getState()` inside `useFrame` if cross-component
  access is needed — read from store imperatively, not as a hook.

```tsx
// WRONG: 60fps setState
useFrame(() => {
  setRotation(mesh.current.rotation.y + 0.01); // triggers React reconcile every frame
});

// RIGHT: mutate ref directly
useFrame((_, delta) => {
  meshRef.current.rotation.y += delta; // zero React overhead
});
```

**Warning signs:**
- React DevTools Profiler shows dozens of renders per second from a single component.
- Chrome Performance tab shows long "Scripting" blocks in the main thread flame chart.
- CPU usage climbs while GPU usage stays low.

**Phase to address:** Phase 1 (Foundation). Establish the ref-mutation pattern as the
project standard before any scene content is added.

---

### Pitfall 3: Shader Compilation Stall on First Paint

**What goes wrong:**
Every unique GLSL shader (material + light configuration combination) must be compiled
by the GPU driver on first render. With multiple custom ShaderMaterials, post-processing
effects (bloom, depth-of-field), and environment maps, the first frame can freeze for
2–10 seconds on mid-range hardware. The page appears hung.

**Why it happens:**
Three.js compiles shaders lazily — only when an object is first rendered into the
viewport. Media-art scenes typically introduce many unique material/light combos at
once (e.g. a bloom pass + custom particle shader + environment), triggering a burst
of synchronous GPU compilation.

**How to avoid:**
- Pre-warm shaders off-screen: render the full scene once at `{ visible: false }` or
  off-viewport during the loading phase, before showing the canvas to users.
- Use `renderer.compile(scene, camera)` after all objects are added to force compilation
  during the loading screen, not on first user-visible frame.
- Minimize unique shader programs: reuse materials via `useMemo`, share a single
  ShaderMaterial instance across instanced meshes.
- Avoid synchronous WebGL calls (`gl.getError()`, `gl.getParameter()`) which serialize
  the GPU pipeline.
- Keep custom shaders simple — add complexity incrementally, testing frame time at
  each step.

```tsx
// In R3F onCreated callback — compile before revealing scene
const handleCreated = useCallback(({ gl, scene, camera }) => {
  gl.compile(scene, camera); // force shader compilation during loading screen
  setTimeout(() => setReady(true), 100); // reveal after compile
}, []);
```

**Warning signs:**
- First meaningful paint takes 3+ seconds after loading screen disappears.
- Chrome GPU process shows a spike in shader compilation time.
- Frame time measured in `useFrame` is 500ms+ on the first render call.

**Phase to address:** Phase 1 (Foundation) — set up the compile-before-reveal pattern.
Phase 3 (Effects) — retest after each new post-process effect is added.

---

### Pitfall 4: Scroll Jank from Main Thread Contention

**What goes wrong:**
WebGL rendering and scroll event processing both run on the browser's main thread.
When the render loop is doing expensive work (large particle updates, excessive draw
calls, un-batched geometries), it starves scroll events, causing the page to feel
unresponsive even at 60fps average framerate. Users experience "sticky" or "laggy"
scroll that does not track finger/wheel movement accurately.

**Why it happens:**
The sticky-canvas scroll pattern (used in the existing /lab) is correct — it avoids
the `overflow: hidden` trap that locks the browser compositor. However, if `useFrame`
work is expensive (>8ms at 120Hz, >16ms at 60Hz), the main thread cannot service
scroll events between frames.

**How to avoid:**
- Always use `{ passive: true }` on scroll event listeners (already done in /lab).
- Keep `useFrame` callbacks under 8ms: profile with Chrome DevTools "Frame Rendering
  Stats" overlay.
- Use `frameloop="demand"` on the Canvas when the scene is static (no animation),
  invalidating manually on scroll input only. This frees the main thread completely
  during static periods.
- Offload CPU-heavy particle simulations to GPU via GPGPU / compute textures rather
  than JavaScript array updates.
- Batch geometry: use `InstancedMesh` for repeated objects (stars, particles, floating
  geometry) — one draw call instead of N.

```tsx
// Demand rendering — only render when scroll changes
<Canvas frameloop="demand">
  <ScrollDrivenScene scrollRef={scrollRef} />
</Canvas>

// In scroll handler
const handleScroll = () => {
  invalidate(); // trigger exactly one frame
  progressRef.current = el.scrollTop / max;
};
```

**Warning signs:**
- Chrome Performance tab shows "Long Tasks" (orange bars >50ms) during scroll.
- `useFrame` callback time > 16ms reported by `performance.now()` instrumentation.
- GPU utilization < 30% but scroll still jank — indicates CPU bottleneck, not GPU.

**Phase to address:** Phase 2 (Scroll Mechanics). Establish `frameloop="demand"` or
continuous render with profiling gate before building scene content on top.

---

### Pitfall 5: R3F + GSAP ScrollTrigger Double-Scroll Conflict

**What goes wrong:**
GSAP ScrollTrigger and Drei's `<ScrollControls>` both try to own the scroll container.
`<ScrollControls>` creates its own internal overflow div and intercepts wheel events.
ScrollTrigger expects to observe `window.scrollY` or a specific element. When both
are active, scroll position doubles, triggers fire at wrong offsets, and pinning
breaks visually (content jumps up and down instead of staying pinned).

**Why it happens:**
Both systems solve the same problem (mapping scroll position to animation progress)
but with incompatible DOM assumptions. Developers add GSAP for timeline control on
top of an R3F scene that already uses ScrollControls, not realizing the two intercept
events at different layers.

**How to avoid:**
- Choose ONE scroll driver. The existing /lab uses a custom scroll div (correct choice
  for this project). Stick with that pattern in /lab2.
- If GSAP timeline features are needed (staggered sequences, ease curves), use GSAP
  to animate THREE.js object properties directly via refs inside `useFrame`, not via
  ScrollTrigger's DOM observation.
- For /lab2: use GSAP `gsap.to(ref.current.position, {...})` driven by the scroll
  progress value, not ScrollTrigger's automatic DOM scroll observation.
- Alternatively: replace GSAP entirely with `react-spring` or lerp functions inside
  `useFrame` — fewer dependencies, no conflict.

```tsx
// WRONG: GSAP ScrollTrigger + drei ScrollControls simultaneously
<ScrollControls pages={5}>
  <ScrollTrigger>...</ScrollTrigger> // conflict!
</ScrollControls>

// RIGHT: One system drives scroll, GSAP animates properties
useFrame(() => {
  const t = progressRef.current;
  gsap.set(meshRef.current.position, { y: t * -10 }); // GSAP as property setter only
  // or simply: meshRef.current.position.y = lerp(0, -10, t);
});
```

**Warning signs:**
- Scroll position appears to move 2x faster than expected.
- ScrollTrigger animations fire at wrong scroll offsets.
- Pinned sections jump or oscillate.

**Phase to address:** Phase 2 (Scroll Mechanics). Decide the single scroll authority
before wiring any animations.

---

### Pitfall 6: framer-motion-3d Is Discontinued and Incompatible with React 19

**What goes wrong:**
`framer-motion-3d` (the package for animating R3F meshes with Framer Motion) was
deprecated in Motion v12.1.0 and does not support React 19. The portfolio uses
React 19 (Next.js 16). Installing `framer-motion-3d` will cause peer dependency
conflicts and runtime errors when animating Three.js objects.

**Why it happens:**
Documentation and tutorials for R3F + Framer Motion animation are written for React
17/18 and reference `framer-motion-3d` or `MotionCanvas`. This package is no longer
maintained. The replacement is `motion/react-three-fiber` from the Motion library,
but its React 19 compatibility is not confirmed in current docs.

**How to avoid:**
- Use Framer Motion (`motion` package) ONLY for DOM/HTML overlay animations (section
  titles, content panels, UI transitions). This is fully compatible with React 19.
- For 3D mesh animations (position, rotation, scale), use `useFrame` + lerp, or
  `react-spring` (which has confirmed React 19 support).
- Do NOT install `framer-motion-3d` or `@react-three/fiber`-specific Framer packages.
- Verify `motion` version compatibility before install: as of 2026-02, Motion v12+ is
  required for React 19.

```tsx
// WRONG: framer-motion-3d on React 19 — peer dep error + runtime crash
import { motion } from 'framer-motion-3d';
<motion.mesh animate={{ y: 1 }} /> // breaks

// RIGHT: Framer Motion for DOM overlays only
import { motion } from 'motion/react';
<motion.div animate={{ opacity: 1 }}>Section Title</motion.div>

// RIGHT: useFrame + lerp for 3D mesh animation
useFrame((_, delta) => {
  meshRef.current.position.y = THREE.MathUtils.lerp(
    meshRef.current.position.y, targetY, delta * 4
  );
});
```

**Warning signs:**
- `npm install` shows peer dependency warnings for `framer-motion-3d`.
- Runtime error: "Cannot read properties of undefined" in Three.js object motion.
- Build fails with React 19 incompatibility warnings.

**Phase to address:** Phase 1 (Foundation). Document the animation library boundary
(Framer Motion = DOM only, useFrame/lerp = 3D) as an explicit architectural constraint.

---

### Pitfall 7: Bundle Size Explosion from Unguarded Three.js Imports

**What goes wrong:**
Three.js is ~600KB minified, R3F adds ~80KB, Drei adds up to ~200KB depending on what
is imported. If Three.js is imported globally (e.g. in `layout.tsx`) instead of behind
`dynamic(..., { ssr: false })`, it enters the main JavaScript bundle. Every page on
the portfolio — including the lightweight main portfolio page — pays the full 3D
library cost, destroying Lighthouse performance scores.

**Why it happens:**
Developers add shared utilities or types that indirectly import Three.js. A single
`import * as THREE from 'three'` in a shared module is enough to include the entire
library in the main bundle via Next.js module graph traversal.

**How to avoid:**
- All Three.js, R3F, Drei, and related imports must live only inside components that
  are wrapped with `dynamic(..., { ssr: false })`. Never import them in Server
  Components, layout files, or shared utility modules.
- Audit with `@next/bundle-analyzer`: run `ANALYZE=true npm run build` and verify
  Three.js appears only in the /lab2 route chunk.
- Use named imports from Drei, not `import * from '@react-three/drei'` — tree-shaking
  drops unused helpers.
- Post-process libraries (`@react-three/postprocessing`) are large; import
  conditionally and only when effects are actually used.

```tsx
// WRONG: Three.js in shared layout — contaminates all routes
// app/layout.tsx
import * as THREE from 'three'; // 600KB enters every page bundle

// RIGHT: Only inside dynamically-imported component
// app/[locale]/lab2/page.tsx
const Lab2Scene = dynamic(() => import('@/components/lab2/Lab2Scene'), {
  ssr: false,
  loading: () => <LoadingScreen />,
});
```

**Warning signs:**
- `npm run build` output shows `/lab2` chunk is smaller than expected — Three.js may
  have leaked into the shared chunk.
- Lighthouse on the main portfolio page shows 600KB+ JS transfer.
- `@next/bundle-analyzer` visualization shows `three` in the main or layout chunk.

**Phase to address:** Phase 1 (Foundation). Set up `@next/bundle-analyzer` before any
Three.js code is written and verify the bundle boundary is clean.

---

### Pitfall 8: GPU Overload from Post-Processing Without Adaptive Quality

**What goes wrong:**
Effects like UnrealBloom, depth-of-field, and chromatic aberration each require one
or more full-resolution render passes. On a scene with bloom + dof + color grading,
the GPU renders the scene 4–6 times per frame. On mid-range GPUs (integrated Intel,
older AMD APUs — the kind used in office/café environments where portfolio reviewers
often work), this pushes frame time above 33ms (30fps). The portfolio demos as
"impressive but broken."

**Why it happens:**
Effects are developed on high-end development machines (e.g. MacBook Pro with M-series
GPU) where 8 render passes at 120fps is trivial. The performance profile on a
recruiter's work laptop is completely different.

**How to avoid:**
- Use R3F's `PerformanceMonitor` from Drei to measure average FPS and dynamically
  disable effects if FPS drops below 45.
- Default to minimum effects; enable premium effects only when `PerformanceMonitor`
  confirms headroom.
- Use `dpr={[1, 1.5]}` (already in /lab) — caps pixel ratio to prevent 4K rendering
  on Retina displays.
- For bloom: set `luminanceThreshold={0.9}` so only bright emissive surfaces bloom,
  not the whole scene. Use `resolution={256}` for lower quality fallback.
- Prioritize: bloom is the most impactful visual effect and least expensive if tuned.
  Skip dof unless scene specifically requires it — it's expensive.

```tsx
import { PerformanceMonitor } from '@react-three/drei';

function AdaptiveScene() {
  const [dpr, setDpr] = useState(1.5);
  const [bloomEnabled, setBloomEnabled] = useState(true);

  return (
    <Canvas dpr={dpr}>
      <PerformanceMonitor
        onDecline={() => {
          setDpr(1); // reduce resolution first
          setBloomEnabled(false); // then disable effects
        }}
        onIncline={() => setDpr(1.5)}
      />
      {bloomEnabled && <Bloom luminanceThreshold={0.9} resolution={256} />}
    </Canvas>
  );
}
```

**Warning signs:**
- Smooth on MacBook, choppy on Windows laptop with integrated graphics.
- `gl.info.render.calls` > 50 per frame in browser console.
- Chrome's "Frame Rendering Stats" overlay shows consistent >16ms frame times.

**Phase to address:** Phase 3 (Effects). Add `PerformanceMonitor` from the first
effect added — do not retrofit adaptive quality after all effects are built.

---

### Pitfall 9: Asset Loading Blocking First Interaction

**What goes wrong:**
GLTF models, HDR environment maps, and large textures are loaded asynchronously but
if the scene does not render at all until every asset resolves, users see a black
screen or indefinite loading spinner. If assets total 10–20MB (common for HDR + models),
this can take 3–8 seconds on typical broadband, killing first impressions.

**Why it happens:**
Developers put all asset loading inside a single `<Suspense>` boundary without
fallback content. The scene shows nothing until every `useLoader` call resolves.

**How to avoid:**
- Use nested Suspense boundaries: render a low-detail scene (procedural geometry,
  no textures) immediately, then progressively enhance as assets load.
- For environment maps: start with a simple ambient light fallback, load the HDR
  map in the background. R3F's `<Environment>` already handles this if Suspense is
  structured correctly.
- Limit total asset weight: compress GLTF with Draco (70–90% size reduction),
  use KTX2 for textures, resize HDR to 1K for background use.
- Use `<Preload all />` inside Suspense to begin loading all assets declared in the
  scene graph before they are needed.
- Show a meaningful loading progress indicator — not just a spinner. Use `useProgress`
  from Drei.

```tsx
import { useProgress } from '@react-three/drei';

function LoadingUI() {
  const { progress } = useProgress();
  return <div>{Math.round(progress)}% loaded</div>;
}

// Layered Suspense: shell renders immediately, details load progressively
<Canvas>
  <ProceduralBackground /> {/* no assets, renders instantly */}
  <Suspense fallback={<LoadingUI />}>
    <DetailedScene /> {/* loads assets in background */}
  </Suspense>
</Canvas>
```

**Warning signs:**
- Black canvas for >2 seconds after page navigation.
- Network tab shows 15MB+ of assets loading in series (no parallelism).
- `useProgress().progress` stays at 0 for a long time before jumping to 100.

**Phase to address:** Phase 1 (Foundation) — establish the Suspense boundary
structure. Phase 4 (Content) — audit asset sizes before adding each new asset.

---

### Pitfall 10: next-intl Locale State Causing Hydration Mismatch

**What goes wrong:**
The /lab2 page uses `'use client'` and R3F Canvas. If `useTranslations()` or locale
detection runs on the server but the 3D canvas renders different content based on
locale on the client, React's hydration will throw a mismatch error. More subtly:
`setRequestLocale()` is required in page-level Server Components for static rendering
— missing this call causes the middleware locale detection to fail, serving the wrong
locale or throwing a runtime error.

**Why it happens:**
The /lab2 page must be a Client Component because of WebGL APIs. But next-intl v4
requires `setRequestLocale()` in Server Components for static rendering. The natural
fix is to make the page a Server Component wrapper that passes locale as a prop to
the Client Canvas component — but this pattern requires careful prop threading.

**How to avoid:**
- Use the existing pattern from /lab: a Server Component page.tsx that calls
  `setRequestLocale(locale)` and passes `locale` as a prop, then renders a Client
  Component that is dynamically imported with `ssr: false`.
- The Client Component uses `useTranslations()` normally — this works inside Client
  Components wrapped by `NextIntlClientProvider` in the layout.
- Never put `setRequestLocale()` in a Client Component.

```tsx
// app/[locale]/lab2/page.tsx — Server Component wrapper
import { setRequestLocale } from 'next-intl/server';

export default function Lab2Page({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  return <Lab2Client />; // dynamically imported with ssr: false
}

// components/lab2/Lab2Client.tsx — Client Component
'use client';
import { useTranslations } from 'next-intl';
// R3F Canvas here
```

**Warning signs:**
- "Text content does not match server-rendered HTML" error in console.
- Static generation fails with locale-related error during `npm run build`.
- Wrong language served on first load before client hydration.

**Phase to address:** Phase 1 (Foundation). Copy the existing /lab Server/Client
wrapper pattern exactly — it already handles this correctly.

---

## Technical Debt Patterns

Shortcuts that seem reasonable but create long-term problems.

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Hardcode scroll thresholds (0.25, 0.5, 0.75) as magic numbers | Fast to implement | Section timing breaks whenever content count changes | Never — extract to a `SECTIONS` config constant from day 1 |
| `new THREE.Vector3()` inside `useFrame` | Readable code | GC pressure at 60fps; causes stutters on long sessions | Never — pre-allocate and reuse via `.set()` |
| Single `<Suspense>` wrapping all scene assets | Simple | Black screen until all assets load | Only for sub-100KB total assets |
| Skip `renderer.dispose()` cleanup | Saves 5 lines | GPU context leak on route exit | Never |
| `antialias: true` without DPR cap | Sharper visuals | 4x rendering cost on Retina at full DPR | Use `dpr={[1, 1.5]}` always |
| Import all of Drei via `import * from '@react-three/drei'` | Convenient | Three.js tree-shaking disabled; +200KB bundle | Never — use named imports |
| Mount multiple `<Canvas>` elements (one per section) | Isolated scenes | Hits browser context limit at 8–16 canvases | Never — one Canvas, multiple scenes |

---

## Integration Gotchas

Common mistakes when connecting systems in this specific stack.

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| R3F + Tailwind CSS | Applying Tailwind classes to R3F mesh objects | Tailwind only works on DOM elements; use Three.js material properties for 3D styling |
| R3F + next-themes dark mode | Checking `data-theme` attribute in `useFrame` which reads DOM | Read theme from a ref set in a `useEffect`, not from DOM in the render loop |
| R3F + Framer Motion | Using `framer-motion-3d` for mesh animation | Framer Motion for DOM overlays only; `useFrame` + lerp for 3D |
| GSAP + R3F | Using ScrollTrigger to observe scroll position | Let custom scroll div own scroll; use GSAP `.set()` as property writer inside `useFrame` |
| next-intl + Canvas | Calling `useTranslations()` inside a component rendered inside `<Canvas>` | Move translated strings to DOM overlays outside Canvas; pass primitive values as props |
| Drei `<Html>` inside Canvas | Attaching complex interactive DOM inside Canvas via `<Html>` | Use for simple labels only; complex overlays (ContentPanel) should be positioned fixed in DOM |
| `useLoader` + HMR | Cached loaders not invalidating during development | Add `loader.manager.onLoad` callback; accept that HMR reload clears cache |

---

## Performance Traps

Patterns that work well during development but fail in production.

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Uninstanced repeated geometry (particles, stars, floating shapes) | Frame time grows linearly with object count | Use `InstancedMesh` for any object count >10 | ~50 objects on mid-range GPU |
| New `THREE.Color` / `THREE.Vector3` allocation per frame | GC stutters after 30–60 seconds of interaction | Pre-allocate; reuse with `.set()` | After ~5 min session |
| Post-processing with full-res render targets | GPU memory exhaustion on integrated graphics | Use `resolution={256}` for bloom; cap at 2–3 effects | 2+ effects on integrated GPU |
| Large particle system updated in JavaScript | CPU bottleneck at 10K+ particles | GPGPU / compute texture for position updates | >10K particles at 60fps |
| Uncompressed GLTF models (MB-range) | Long load times; asset parsing stalls main thread | Draco compression; split large models | >500KB GLTF on typical broadband |
| `addEventListener` without cleanup in R3F components | Memory leak after route change | Always return cleanup function from `useEffect` | After first route navigation |
| `console.log` or `renderer.info` access inside `useFrame` | Extreme slowdown due to GPU sync | Remove all debug output from hot path | Any debug access per frame |

---

## UX Pitfalls

Common user experience mistakes specific to 3D interactive portfolios.

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| No scroll affordance (no "scroll to explore" hint) | Users do not discover scroll interaction; bounce immediately | Show animated scroll hint that disappears after first scroll |
| Scroll progress resets on browser back | Users lose their place; jarring experience | Preserve scroll position with `sessionStorage` |
| 3D animation blocks reading text | Content unreadable while animation plays | Complete major camera moves before fading in text overlays |
| No fallback for WebGL unavailable | Blank page on Safari with hardware acceleration disabled | Detect WebGL support; redirect to main portfolio `/` with a notice |
| Content accessible only via 3D interaction | Screen reader users get nothing | All project content in semantic DOM (can be `sr-only` / visually hidden) |
| Scroll speed too fast | Content flashes past; no time to read | Add easing / lerp to camera moves; test with actual content text |
| No visual feedback for section transitions | Users cannot tell when section changed | Fade in section labels / dot navigation with CSS transitions |

---

## "Looks Done But Isn't" Checklist

Things that appear complete during development but are missing critical pieces.

- [ ] **WebGL cleanup:** Does navigating away from /lab2 and back not cause canvas blackout? Verify `renderer.dispose()` fires and contexts do not accumulate.
- [ ] **Shader warm-up:** Is the first frame after loading screen instant (<100ms) or does it freeze for 1–3 seconds? Run `renderer.compile()` before revealing scene.
- [ ] **Bundle isolation:** Does `ANALYZE=true npm run build` show Three.js only in the /lab2 chunk, not in the shared layout chunk?
- [ ] **Scroll passive listeners:** Does `addEventListener('scroll', handler, { passive: true })` appear on all scroll listeners? Non-passive blocks compositor.
- [ ] **prefers-reduced-motion:** Does the experience degrade gracefully when `window.matchMedia('(prefers-reduced-motion: reduce)').matches` is true? Stop auto-playing animations; keep scene static.
- [ ] **WebGL unavailable:** What happens on a machine with WebGL disabled? Is there a meaningful fallback redirect, not a blank page?
- [ ] **Mid-range GPU test:** Does the scene maintain >45fps on a laptop with Intel Iris / AMD Vega integrated graphics?
- [ ] **useFrame profiling:** Is every `useFrame` callback completing in <8ms? Instrument with `performance.now()` during development.
- [ ] **framer-motion version:** Is the installed `motion` version React 19-compatible? Run `npm ls motion react` and verify no peer dep warnings.
- [ ] **Asset sizes:** Are all GLTF files Draco-compressed? Is the HDR environment map ≤1K resolution? Total asset budget for /lab2 should be <5MB.
- [ ] **`setRequestLocale` in page.tsx:** Is the Server Component wrapper calling `setRequestLocale(locale)` before rendering the Client Canvas? Verify static generation works for both `ko` and `en`.

---

## Recovery Strategies

When pitfalls occur despite prevention, how to recover.

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| WebGL context leak discovered after sections are built | HIGH | Audit all Canvas mount points; consolidate to single Canvas; add `useEffect` cleanup to every scene component |
| setState-in-useFrame causing jank | MEDIUM | Profile with React DevTools Profiler; replace state with refs + Zustand; no component rewrites needed if refs are threading |
| Shader stall on first paint | LOW | Add `renderer.compile(scene, camera)` in `onCreated`; move assets behind Suspense so compile runs during existing loading screen |
| Bundle bloat from Three.js in main chunk | MEDIUM | Trace import graph with bundle analyzer; move offending imports behind `dynamic()` boundary; no logic change required |
| GSAP + ScrollControls conflict discovered mid-development | HIGH | Rip out one system; if GSAP ScrollTrigger is entangled in many components, switching to custom scroll div is the cheaper fix |
| framer-motion-3d peer dep failure | LOW | Uninstall package; replace mesh animations with `useFrame` + `THREE.MathUtils.lerp`; DOM animations unaffected |
| Post-processing GPU overload on mid-range hardware | MEDIUM | Add `PerformanceMonitor`; wrap each effect in a conditional; disable bloom first as highest GPU cost recovery |

---

## Pitfall-to-Phase Mapping

How roadmap phases should address these pitfalls.

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| WebGL context leak | Phase 1: Foundation | Navigate /lab2 ↔ / 10 times; no canvas blackout; check `renderer.info` |
| setState in useFrame | Phase 1: Foundation | React Profiler shows <2 renders/sec during animation |
| Shader compilation stall | Phase 1: Foundation | First frame after loading screen < 100ms |
| Scroll jank / main thread contention | Phase 2: Scroll Mechanics | Chrome Performance tab: no Long Tasks during scroll |
| GSAP + ScrollTrigger conflict | Phase 2: Scroll Mechanics | Scroll position maps 1:1 to animation progress; no doubling |
| framer-motion-3d incompatibility | Phase 1: Foundation | `npm ls motion` shows no peer dep warnings; 3D animations use useFrame |
| Bundle size explosion | Phase 1: Foundation | `ANALYZE=true npm run build` confirms Three.js in /lab2 chunk only |
| GPU overload from post-processing | Phase 3: Effects | `PerformanceMonitor` callback never fires; consistent >45fps on test laptop |
| Asset loading blocking interaction | Phase 1: Foundation, Phase 4: Content | Loading progress visible; first scene element renders within 1s |
| next-intl hydration mismatch | Phase 1: Foundation | `npm run build` succeeds for both ko and en; no console hydration errors |

---

## Sources

- [React Three Fiber: Performance Pitfalls (official docs)](https://r3f.docs.pmnd.rs/advanced/pitfalls) — HIGH confidence
- [React Three Fiber: Scaling Performance (official docs)](https://r3f.docs.pmnd.rs/advanced/scaling-performance) — HIGH confidence
- [Three.js Discourse: Dispose things correctly](https://discourse.threejs.org/t/dispose-things-correctly-in-three-js/6534) — HIGH confidence
- [R3F GitHub issue #514: Leaking WebGLRenderer on unmount](https://github.com/pmndrs/react-three-fiber/issues/514) — HIGH confidence
- [R3F GitHub Discussion #2457: Too many WebGL contexts on Safari](https://github.com/pmndrs/react-three-fiber/discussions/2457) — HIGH confidence
- [GSAP Forum: ScrollTrigger pin and drei ScrollControls conflict](https://gsap.com/community/forums/topic/40114-scrolltrigger-pin-and-dreis-scrollcontrols-dont-play-well-together/) — HIGH confidence
- [Motion docs: React Three Fiber integration](https://motion.dev/docs/react-three-fiber) — HIGH confidence
- [npm: framer-motion-3d — discontinued, no React 19 support](https://www.npmjs.com/package/framer-motion-3d) — HIGH confidence
- [Three.js Discourse: Reducing shader compile time](https://discourse.threejs.org/t/reducing-shader-compile-time-on-scene-initialization/56572) — MEDIUM confidence
- [Three.js Discourse: Custom shader slow to initialize first frame](https://discourse.threejs.org/t/custom-shader-slow-to-initialize-first-frame/5910) — MEDIUM confidence
- [14islands/r3f-scroll-rig GitHub Discussion: ScrollControls vs r3f-scroll-rig](https://github.com/14islands/r3f-scroll-rig/discussions/29) — MEDIUM confidence
- [WebGL Best Practices — MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices) — HIGH confidence
- [100 Three.js Tips That Actually Improve Performance (2026)](https://www.utsubo.com/blog/threejs-best-practices-100-tips) — MEDIUM confidence
- [WCAG 2.3.3: Animation from Interactions — W3C](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html) — HIGH confidence
- [Next.js Lazy Loading docs](https://nextjs.org/docs/app/guides/lazy-loading) — HIGH confidence
- [Motion & Framer Motion upgrade guide (React 19 notes)](https://motion.dev/docs/react-upgrade-guide) — HIGH confidence

---

*Pitfalls research for: media-art 3D interactive portfolio (/lab2) added to Next.js 16 portfolio*
*Researched: 2026-02-28*
