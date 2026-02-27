# Project Research Summary

**Project:** Portfolio /lab2 — Media-Art 3D Interactive Experience
**Domain:** Scroll-driven 3D WebGL portfolio route (media-art installation style)
**Researched:** 2026-02-28
**Confidence:** HIGH

## Executive Summary

The `/lab2` milestone is a single-route, desktop-only media-art experience that proves frontend engineering depth through the experience itself. Research confirms this is a well-understood domain with multiple high-quality Codrops 2025 case studies (Stas Bondar, Roman Jean-Elie, Stefan Vitasović) establishing clear patterns. The winning approach is a scroll-driven architecture where one continuous timeline advances the camera through 6 chapters (intro + 5 projects), with DOM overlay panels for readable content. All project content and images already exist in the codebase — this is purely an interactive visualization layer built on top of established data.

The recommended stack requires only 4 new packages on top of what is already installed (`lenis`, `motion`, `@react-three/postprocessing`, `maath`). The existing `/lab` codebase provides a proven scaffold — sticky canvas pattern, `dynamic()` SSR guard, scroll progress → prop → `useFrame` architecture — that `/lab2` extends rather than reinvents. The core differentiator is scroll-velocity as a consistent visual language: scroll speed drives text distortion, camera feel, and transition intensity throughout, unifying all visual effects under one conceptual direction (the pattern used across all three 2025 SOTD-winning reference portfolios).

The primary risk is performance on mid-range hardware (integrated GPU laptops common in Korean office environments). Research from Awwwards SOTD analysis and Three.js best practices converges on one rule: post-processing effects must be wrapped in `PerformanceMonitor` with adaptive quality from the first effect added, never retrofitted. A secondary risk is Phase 1 architecture decisions — WebGL context management, animation state via refs vs. state, and scroll authority — that are expensive to reverse if gotten wrong. These must be decided and enforced before any scene content is built.

## Key Findings

### Recommended Stack

The existing stack (Three.js 0.182, R3F 9.5, Drei 10.7.7, GSAP 3.14, `@gsap/react`) already covers the core 3D and animation requirements. Four additions are needed. `lenis` (v1.3.17) provides smooth scroll normalization that feeds consistently into both GSAP ScrollTrigger and R3F — use the canonical package name (not the deprecated `@studio-freight/lenis`). `motion` (v12.34.3, the rebranded Framer Motion) handles DOM overlay animations declaratively; it is React 19 compatible and scoped strictly to the DOM layer, imported from `motion/react`. `@react-three/postprocessing` (v3.0.4) wraps the pmndrs post-processing pipeline for bloom, vignette, chromatic aberration, and film grain; peer deps satisfied by the existing stack. `maath` (v0.10.8) provides R3F-idiomatic math helpers for smooth `easing.dampE()` in `useFrame` loops and `random.inSphere()` for particle distribution. Inline GLSL template literals via Drei's `shaderMaterial` cover all shader needs without additional packages.

**Core technologies:**
- `lenis` v1.3.17: Smooth scroll normalization — syncs with GSAP ScrollTrigger via `ScrollTrigger.update()` on each Lenis tick; use `lenis/react` sub-path for `ReactLenis` wrapper
- `motion` v12.34.3: DOM overlay animations (section titles, content panels, UI transitions) — React 19 compatible; import from `motion/react`, not `framer-motion`
- `@react-three/postprocessing` v3.0.4: Bloom, vignette, chromatic aberration, film grain — peer deps satisfied by existing R3F 9.5 + Three.js 0.182
- `maath` v0.10.8: `easing.dampE()` for smooth `useFrame` lerps, `random.inSphere()` for particle distribution — pmndrs ecosystem, no conflicts
- **Do not add:** `framer-motion-3d` (discontinued, React 19 incompatible), physics engines (Cannon/Rapier — overkill for visual project), noise npm packages (use 30-line inline GLSL), `locomotive-scroll` (use `lenis`), `@studio-freight/lenis` (deprecated)

**Install command:**
```bash
npm install lenis motion @react-three/postprocessing maath --cache /tmp/npm-cache-temp
```

### Expected Features

Research from three Codrops 2025 case studies and Awwwards SOTD analysis establishes two tiers. The table-stakes tier produces a credible experience; the differentiator tier produces an award-worthy one. The critical finding: cohesion beats feature count. One visual language applied consistently (scroll-velocity distortion throughout) beats many isolated effects. Roman Jean-Elie's principle: the best work removes features — every element must earn its presence.

**Must have (table stakes — P1):**
- Scroll-driven camera path storytelling — the entire experience spine; 6 chapters, camera flies between waypoints on scroll
- Loading screen with `useProgress` progress bar — non-negotiable for any 3D site
- Smooth scroll via Lenis — eliminates mechanical scroll feel; single setup call
- Character-level text reveals (GSAP SplitText, now free in GSAP 3.x) — highest ROI differentiator at lowest implementation cost
- HTML overlay content panels for project details — readable DOM text, not 3D geometry
- Existing 13 WebP images mapped onto 3D texture planes — zero new asset creation required; all images in `/public/images/`
- Particle field environment (<3k particles) — creates spatial inhabitation without GPU cost
- `PerformanceMonitor` + adaptive DPR — must not crash integrated GPU in Korean office environments
- Chapter progress indicator ("3 / 5") — hiring managers must know they've seen everything
- Desktop-only gate (viewport < 1024px) — explicit "best on desktop" message; no broken mobile 3D
- Back-to-main navigation — port directly from `/lab`

**Should have (competitive differentiators — P2):**
- Scroll-velocity text stretch shader (`uVelocity` uniform to headline geometry) — single highest-ROI effect once core is stable
- Post-processing: bloom + film grain — transforms "3D viewport" into "cinematic experience"; gated by `PerformanceMonitor`
- Entry intro sequence — 2–3 second GSAP timeline after loading completes, before scroll begins
- Mouse parallax on idle — interpolated camera drift toward cursor; port directly from `/lab`
- Transition wipes between chapters — CSS clip-path animated by GSAP; makes chapter metaphor tangible
- Custom cursor — 40px circle, `mix-blend-mode: difference`
- Per-project color temperature (ambient/directional light shifts per chapter)

**Defer to v2+:**
- Portal / FBO masked reveals — requires fundamentally different render-to-texture pipeline; architecture must accommodate it but do not build it now
- Per-project GLSL shader signatures — requires per-project shader authoring
- Audio opt-in — inappropriate for Korean hiring context
- 3D extruded text for hero moments — only if confirmed GPU headroom

### Architecture Approach

The `/lab2` architecture extends the proven `/lab` scaffold with a clear three-layer system. A Server Component wrapper calls `setRequestLocale()` then renders a Client Component that owns a custom scroll container div. The scroll container derives `scrollProgress: number [0..1]` and `activeScene: SceneKey` from raw scroll position. The R3F Canvas is position-sticky (sticky, top-0, 100vh) and receives `scrollProgress` as a prop; inside Canvas, `CameraRig2` uses `useFrame` to lerp camera toward scroll-progress-derived waypoints with zero React state involvement. DOM overlay (`ContentPanel2`) receives `activeScene` and uses `motion/react` `AnimatePresence` to switch content. Individual scenes are isolated components under a `SceneRouter` for future code splitting.

**Major components:**
1. `lab2/page.tsx` (Server Component wrapper) — calls `setRequestLocale(locale)`, renders `Lab2Client` via `dynamic()` with `ssr: false`
2. `Lab2Client` / `lab2/page-client.tsx` — owns scroll container ref, derives `scrollProgress` + `activeScene`; `'use client'`
3. `Lab2Scene` (Canvas wrapper) — sticky Canvas with `dpr={[1, 1.5]}`, `Suspense` boundaries, scene composition
4. `CameraRig2` — `useFrame` lerp between 6 camera waypoints; all values in `useRef`, zero `setState`
5. `SceneRouter` — mounts scenes by `sceneKey`; each scene independently deployable; enables `React.lazy()` code splitting
6. `ContentPanel2` — fixed DOM overlay with `AnimatePresence` keyed by `activeScene`; `motion/react` for transitions
7. `PostProcessing` — `EffectComposer` with conditional bloom/vignette gated by `PerformanceMonitor`
8. `HUD` — fixed navigation dots, back link, scroll hint

**Key patterns:**
- Scroll container → `scrollProgress` float → prop into Canvas → `useFrame` lerp (same spine as `/lab`)
- All 60fps animation values in `useRef`; only discrete scene transitions use `useState`
- Single `<Canvas>` alive for entire /lab2 subtree — never conditionally render the Canvas
- `dynamic(..., {ssr: false})` guard on all Three.js/R3F/Drei imports

### Critical Pitfalls

Research from R3F official docs, verified GitHub issues, and GSAP community forums identified 10 pitfalls. The following 5 are the highest-risk architectural decisions that cannot be cheaply reversed:

1. **WebGL context leak on route navigation** — Keep one `<Canvas>` alive for the entire /lab2 subtree; never conditionally render the Canvas itself; call `renderer.dispose()` + geometry/material disposal on route exit. Chrome allows ~16 WebGL contexts; exceeding the limit silently kills the oldest context. Must be correct from the first commit.

2. **setState inside useFrame causes cascading re-renders** — Animation-driving values (camera lerp targets, shader uniforms) must live in `useRef`, updated imperatively in `useFrame`. Only use `useState` for discrete events (scene changed, loading complete). 60fps `setState` causes 60 React reconciler cycles/second independent of GPU load.

3. **Shader compilation stall on first paint** — Call `renderer.compile(scene, camera)` inside the R3F `onCreated` callback to force GPU shader compilation during the loading screen, before revealing the scene. Without this, first frame freezes 2–10 seconds on mid-range hardware.

4. **Bundle size explosion from unguarded Three.js imports** — All Three.js/R3F/Drei imports must live exclusively inside components behind `dynamic(..., { ssr: false })`. A single indirect import in a shared module adds 600KB to every page. Verify with `@next/bundle-analyzer` before writing scene code.

5. **GSAP ScrollTrigger + Drei ScrollControls double-scroll conflict** — Choose ONE scroll authority (custom scroll div, same as `/lab`). Never add Drei `<ScrollControls>` on top of an existing GSAP ScrollTrigger setup. GSAP should animate Three.js object properties via refs inside `useFrame`, not observe the scroll container via ScrollTrigger's DOM observation.

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Foundation
**Rationale:** Architecture decisions here are the most expensive to reverse. WebGL context management, animation state boundaries, bundle isolation, and Next.js/next-intl integration must be verified before any scene content exists. The pitfalls research maps 7 of 10 critical pitfalls directly to this phase.
**Delivers:** A working `/lab2` route with sticky Canvas, scroll progress wiring, empty scene, loading screen, and HUD — no visual content yet, but full infrastructure validated.
**Addresses:** Loading screen (P1), back navigation (P1), desktop-only gate (P1), Server/Client wrapper pattern for next-intl
**Avoids:** WebGL context leak, setState-in-useFrame, bundle bloat, framer-motion-3d incompatibility, next-intl hydration mismatch, shader compilation stall
**Verification gates:** Navigate /lab2 ↔ / 10× (no canvas blackout); `ANALYZE=true npm run build` (Three.js in /lab2 chunk only); `npm run build` succeeds for both `ko` and `en`

### Phase 2: Scroll Spine + Camera
**Rationale:** Camera path storytelling is the experience itself — everything else is decoration on top. This phase establishes the `scrollProgress → waypoints → camera lerp` system with 6 real chapter boundaries. Nothing else can be built until this is correct and smooth.
**Delivers:** Full scroll travel through 6 chapters with camera moving between defined 3D waypoints; cinematic feel; chapter state derivation working.
**Uses:** Lenis + GSAP ScrollTrigger sync pattern; `CameraRig2` with `useFrame` + `maath.easing.dampE`; `useScrollProgress` + `useSceneState` hooks
**Avoids:** GSAP + ScrollControls double-scroll conflict; scroll jank from main thread contention; magic-number scroll thresholds (extract to `SCENES` config constant from day 1)
**Verification gate:** Scroll position maps 1:1 to camera position; Chrome Performance tab shows no Long Tasks during scroll

### Phase 3: 3D Scene Content
**Rationale:** With camera and scroll proven, each scene can be built incrementally and verified independently. IntroScene first to validate the full pipeline end-to-end; project scenes carry the content payload.
**Delivers:** 6 populated 3D scenes with particle field environment and project images mapped as texture planes.
**Addresses:** Scroll-driven 3D environment (P1), existing images as 3D textures (P1), particle field (P1)
**Implements:** `SceneRouter`, per-scene components, `ParticleMaterial` + `WaveMaterial` shaderMaterials via Drei `extend`
**Avoids:** One giant scene component (anti-pattern); new `THREE.Vector3()` inside `useFrame` (GC pressure); single Suspense boundary wrapping all assets
**Build order:** IntroScene → verify pipeline → AboutScene → ProjectsScene → SkillsScene → ContactScene

### Phase 4: Content Overlay + HUD
**Rationale:** Project content readability is a hiring requirement. `ContentPanel2` with `AnimatePresence` keyed by `activeScene` gives hiring managers clear, readable project details synchronized with scene state. Chapter nav confirms they've seen all 5 projects.
**Delivers:** `ContentPanel2` with per-scene project content (name, summary, tech stack, localized KO/EN); chapter progress indicator "3 / 5"; new `Lab2` translation namespace.
**Addresses:** Project panels (P1), chapter progress indicator (P1), bilingual content integration
**Note:** No new content authoring — all project text already exists in main site translations; this phase wires existing content to the overlay

### Phase 5: Typography Interactions
**Rationale:** Character-level text animation is the single highest-ROI differentiator from the feature analysis. Research from all three 2025 case studies confirms this. GSAP SplitText is now free in GSAP 3.x. This adds the motion language that makes the experience feel "made carefully" to technical viewers.
**Delivers:** Chapter headlines assembled character-by-character on scroll; GSAP SplitText with clip-path mask; scroll-velocity reactive text stretch shader on headlines.
**Addresses:** Character-level text reveals (P1), scroll-velocity text stretch (P2)
**Implements:** GSAP SplitText + stagger 0.02–0.05s/char; `uVelocity` uniform in headline vertex shader; scroll delta tracking between frames
**Avoids:** Simultaneous independent GSAP tweens on same elements; 3D text for body copy (DOM only)

### Phase 6: Post-Processing + Effects Polish
**Rationale:** Post-processing is conditionally gated — it must not be added without `PerformanceMonitor`. With the core experience working at solid 60fps, this phase adds the cinematic layer that transforms visual quality, gated by measured GPU headroom.
**Delivers:** Bloom on emissive elements, film grain, vignette, mouse parallax on idle, transition wipes, custom cursor, entry intro sequence, per-project color temperature shifts.
**Addresses:** Post-processing bloom + grain (P2), entry intro sequence (P2), mouse parallax (P2), transition wipes (P2), custom cursor (P2), per-project color temperature (P2)
**Uses:** `@react-three/postprocessing` `EffectComposer`; `PerformanceMonitor` from Drei gates all effects
**Avoids:** GPU overload without adaptive quality; excessive particle counts (>3k); post-processing without quality fallback
**Trigger:** Only start this phase when `PerformanceMonitor` confirms render budget headroom on target hardware

### Phase Ordering Rationale

- Phase 1 before everything: 7 of 10 critical pitfalls must be prevented at the architectural level before any scene content exists. Retrofitting costs 2–5× more than getting them right first.
- Phase 2 before Phase 3: Camera waypoints define where scenes live in 3D space. Building scenes without knowing the camera path produces work that must be repositioned.
- Phase 4 after Phase 3: Content panel content references scene names that exist after Phase 3. Structural shell can be built in parallel but content wiring requires scenes to exist.
- Phase 5 after Phase 4: Typography interactions enhance content that Phase 4 delivers. SplitText applies to DOM text nodes that must already be rendering.
- Phase 6 last: Post-processing is additive polish, never foundational. The `PerformanceMonitor` gate enforces this — effects only if headroom exists on target hardware.

### Research Flags

Phases with standard, well-documented patterns (low research risk):
- **Phase 1 (Foundation):** Proven `/lab` scaffold to copy directly; all patterns have working implementations in the codebase.
- **Phase 2 (Scroll Spine):** Lenis + GSAP ScrollTrigger sync is canonical with official documentation and verified community examples.
- **Phase 4 (Content Overlay):** `AnimatePresence` with `motion/react` is documented; next-intl `useTranslations()` already used throughout codebase.

Phases likely needing prototyping or careful iteration:
- **Phase 3 (3D Scene Content):** Scene composition and spatial layout are artistic decisions, not engineering ones — scene-by-scene iteration required. Prototype IntroScene first to validate full pipeline before committing to scene structure.
- **Phase 5 (Typography):** Scroll-velocity text stretch shader requires GLSL authoring; `uVelocity` uniform integration needs prototyping to tune feel. This is the highest artistic risk in the roadmap.
- **Phase 6 (Effects):** Post-processing tuning is hardware-dependent. Bloom `luminanceThreshold` and `intensity` must be tested on integrated GPU, not just M-series MacBook. Dedicated performance test on target hardware profile before launch.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All 4 new packages npm-verified at specific versions; peer deps confirmed against existing stack; integration patterns documented in official Motion, Lenis, and pmndrs sources |
| Features | HIGH | Three Codrops 2025 case studies + Awwwards SOTD analysis from the exact same domain; prioritization matrix backed by real-world examples; dependency graph verified against reference implementations |
| Architecture | HIGH | Existing `/lab` codebase directly inspected and verified; R3F official scaling docs + Codrops Feb 2026 tutorial corroborate patterns; 10-step build order derived from actual dependency graph |
| Pitfalls | HIGH | R3F official pitfalls docs + verified GitHub issues (not theoretical warnings); GSAP conflict documented in official GSAP forum; framer-motion-3d deprecation verified on npm |

**Overall confidence:** HIGH

### Gaps to Address

- **GLSL shader aesthetics:** Research confirms the technical pattern (shaderMaterial + uniforms + useFrame) but does not prescribe the specific GLSL code for the scroll-velocity stretch effect. The vertex shader for `uVelocity`-driven distortion must be authored during Phase 5. Prototype early — this is the highest artistic risk.
- **Scene 3D layout and camera waypoints:** Camera waypoints and 3D scene positioning are aesthetic decisions. There is no "correct" answer from research — requires design iteration. Define the 6 waypoints in a config constant before building any scene geometry.
- **Turbopack GLSL import compatibility:** ARCHITECTURE.md flags that GLSL file imports as raw strings may need Turbopack config with the current `next dev --turbopack` setup. Recommendation is to use inline template literals to avoid this. Validate this assumption in Phase 1 before committing to an approach.
- **Mid-range GPU baseline:** All performance thresholds (particle count <3k, bloom `resolution={256}`, DPR max 1.5×) are calibrated from research analysis, but have not been tested on the specific hardware profile that Korean hiring managers use. A dedicated performance audit on an Intel Iris or AMD Vega integrated GPU laptop should happen during Phase 6 before launch.

## Sources

### Primary (HIGH confidence)
- [Stas Bondar '25 — Code and Techniques (Codrops March 2025)](https://tympanus.net/codrops/2025/03/25/stas-bondar-25-the-code-techniques-behind-a-next-level-portfolio/) — scroll-velocity patterns, SplitText, PerformanceMonitor
- [Letting the Creative Process Shape a WebGL Portfolio (Codrops Nov 2025)](https://tympanus.net/codrops/2025/11/27/letting-the-creative-process-shape-a-webgl-portfolio/) — camera path storytelling, restraint principle
- [Case Study: Stefan Vitasovic Portfolio 2025 (Codrops March 2025)](https://tympanus.net/codrops/2025/03/05/case-study-stefan-vitasovic-portfolio-2025/) — kinetic typography, scroll-velocity text stretch
- [Building Efficient Three.js Scenes (Codrops Feb 2025)](https://tympanus.net/codrops/2025/02/11/building-efficient-three-js-scenes-optimize-performance-while-maintaining-quality/) — InstancedMesh, draw call batching
- [React Three Fiber: Performance Pitfalls (official docs)](https://r3f.docs.pmnd.rs/advanced/pitfalls) — setState/useFrame anti-patterns, context leak
- [React Three Fiber: Scaling Performance (official docs)](https://r3f.docs.pmnd.rs/advanced/scaling-performance) — DPR capping, PerformanceMonitor
- [Lenis GitHub: darkroomengineering/lenis](https://github.com/darkroomengineering/lenis) — v1.3.17, `lenis/react` sub-path confirmed
- [Motion docs: React Three Fiber integration](https://motion.dev/docs/react-three-fiber) — React 19 compatibility
- [npm registry](https://www.npmjs.com) — version verification for all 4 new packages
- [R3F GitHub issue #514: Leaking WebGLRenderer on unmount](https://github.com/pmndrs/react-three-fiber/issues/514) — WebGL context leak pattern
- [GSAP Forum: ScrollTrigger + ScrollControls conflict](https://gsap.com/community/forums/topic/40114-scrolltrigger-pin-and-dreis-scrollcontrols-dont-play-well-together/) — scroll authority conflict
- [pmndrs/react-postprocessing GitHub](https://github.com/pmndrs/react-postprocessing) — v3.0.4 peer deps confirmed
- [WCAG 2.3.3: Animation from Interactions — W3C](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html) — prefers-reduced-motion handling

### Secondary (MEDIUM confidence)
- [Building a Scroll-Revealed WebGL Gallery (Codrops Feb 2026)](https://tympanus.net/codrops/2026/02/02/building-a-scroll-revealed-webgl-gallery-with-gsap-three-js-astro-and-barba-js/) — ref-based state pattern, unified motion system
- [Wawa Sensei — 3D Portfolio R3F + Framer Motion Scroll](https://wawasensei.dev/tuto/build-a-3D-portfolio-with-react-three-fiber-framer-motion-scroll-animations) — real-world Next.js integration pattern
- [Maxime Heckel — Particles with R3F and Shaders](https://blog.maximeheckel.com/posts/the-magical-world-of-particles-with-react-three-fiber-and-shaders/) — particle system patterns
- [Three.js Discourse: Dispose things correctly](https://discourse.threejs.org/t/dispose-things-correctly-in-three-js/6534) — GPU context cleanup
- [Three.js Discourse: Reducing shader compile time](https://discourse.threejs.org/t/reducing-shader-compile-time-on-scene-initialization/56572) — compile-before-reveal pattern
- [14islands/r3f-scroll-rig GitHub](https://github.com/14islands/r3f-scroll-rig) — validates sticky canvas pattern

### Tertiary (LOW confidence)
- [100 Three.js Tips That Actually Improve Performance (2026)](https://www.utsubo.com/blog/threejs-best-practices-100-tips) — performance tips (validate against official sources before applying)

---
*Research completed: 2026-02-28*
*Ready for roadmap: yes*
