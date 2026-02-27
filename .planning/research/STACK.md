# Stack Research

**Domain:** Media-art style 3D interactive portfolio (/lab2 milestone)
**Researched:** 2026-02-28
**Confidence:** HIGH (versions npm-verified; integration patterns confirmed via official sources)

---

## Scope

This document covers only the **new additions** needed for v3.0 `/lab2`. The following are already
installed and validated — do not re-research or reinstall:

| Already Installed | Version |
|---|---|
| `three` | ^0.182.0 |
| `@react-three/fiber` (R3F) | ^9.5.0 |
| `@react-three/drei` | ^10.7.7 |
| `gsap` | ^3.14.2 |
| `@gsap/react` | ^2.1.2 |
| `@types/three` | ^0.182.0 |

---

## Recommended Stack — New Additions

### Core: Scroll & Motion Layer

| Technology | Version (verified) | Purpose | Why Recommended |
|---|---|---|---|
| `motion` (formerly framer-motion) | ^12.34.3 | DOM micro-interactions, scroll-linked UI animations, page entrance sequences | The package was rebranded to `motion` at v12; imports from `motion/react`. Fully React 19 compatible at this version. Provides `useScroll`, `useTransform`, `useMotionValue` for scroll-driven DOM animations — the right tool for 2D overlay UI, project card reveals, and text animations layered on top of the 3D canvas. |
| `lenis` | ^1.3.17 | Smooth scroll normalization | Replaces browser native scroll with eased, physics-based scroll that feeds consistently into both GSAP ScrollTrigger and R3F scroll progress. The `@studio-freight/lenis` package is deprecated — the canonical package is now just `lenis`. Use `lenis/react` sub-path for the `ReactLenis` wrapper. |

**Why GSAP ScrollTrigger (already installed) over CSS Scroll-Driven Animations API:** GSAP ScrollTrigger
has broad browser support and integrates directly with both the R3F render loop and Lenis. The native
CSS Scroll-Driven Animations API lacks sufficient browser coverage as of early 2026 and cannot drive
Three.js scene state. Continue using GSAP 3 (already installed) — no version change needed.

**Why `motion` for DOM and GSAP for 3D/scroll pin:** They solve different problems and compose well.
`motion` handles 2D DOM elements (text reveals, card fades, overlay transitions) with a declarative
React API. GSAP ScrollTrigger handles scroll-pinning, scene sequencing, and Three.js uniform
animation with timeline control. Mixing them is the de-facto pattern in 3D portfolio sites (confirmed
by multiple community examples and official Motion docs).

---

### Core: R3F Post-Processing & Visual Effects

| Technology | Version (verified) | Purpose | Why Recommended |
|---|---|---|---|
| `@react-three/postprocessing` | ^3.0.4 | WebGL post-processing effects (bloom, depth-of-field, chromatic aberration, noise, vignette) | The canonical R3F post-processing wrapper around pmndrs/postprocessing. Version 3.x has peer deps `@react-three/fiber ^9.0.0` and `three >= 0.156.0` — both satisfied by the existing stack. Single `<EffectComposer>` wraps all effects; automatically merges passes for performance. Essential for the media-art aesthetic (bloom on particle glows, DoF for depth, vignette for cinematic framing). |

**Effects available in `@react-three/postprocessing` 3.x (use as needed):**
- `<Bloom>` — glow on emissive materials and particles (core media-art effect)
- `<DepthOfField>` — bokeh blur to focus/defocus scene elements
- `<ChromaticAberration>` — RGB split for glitch/analog aesthetic
- `<Vignette>` — dark edges for cinematic framing
- `<Noise>` — film grain overlay for texture
- `<SMAA>` — anti-aliasing (preferred over MSAA with post-processing)

---

### Supporting: Math & Shader Utilities

| Library | Version (verified) | Purpose | When to Use |
|---|---|---|---|
| `maath` | ^0.10.8 | R3F math helpers: easing functions, random distributions, geometry helpers | Use for `easing.dampE()` (smooth exponential dampening in the `useFrame` loop), `random.inSphere()` (particle distribution), `geometry.mergeVertices()`. Part of the pmndrs ecosystem, designed for R3F idioms. |

**Shader noise:** Do NOT add a noise library package. Write noise GLSL inline using the canonical
Simplex noise GLSL snippet (public domain, ~30 lines). `@react-three/drei`'s `shaderMaterial` helper
handles shader compilation. Adding `glsl-noise` (abandoned, 12 years old) or `gl-noise` introduces
unnecessary dependency risk for functionality that ships as trivial inline GLSL.

**Custom GLSL imports:** Use Webpack raw-loader or inline template literals for GLSL. Drei's
`shaderMaterial` accepts template literal shader strings natively — no build plugin needed.

---

### Supporting: Drei Helpers (already installed — specific APIs to use)

`@react-three/drei` ^10.7.7 is already installed. The following APIs are specifically needed for /lab2:

| Drei API | Purpose |
|---|---|
| `<shaderMaterial>` (via `extend`) | Custom GLSL materials for particle systems and distortion effects |
| `<Points>` / `<PointMaterial>` | Efficient particle rendering (use with `useFrame` for animation) |
| `<Float>` | Gentle floating animation for 3D objects (zero-code hover feel) |
| `<Environment>` | IBL environment map for realistic material reflections |
| `<Text>` | 3D SDF text rendering (for typographic 3D elements) |
| `<ScrollControls>` | R3F-native scroll rig — useful if 3D scroll is managed entirely within R3F canvas |
| `<useProgress>` | Loading progress for asset preload screen |
| `<PerspectiveCamera>` | Declarative camera control |

**Note on `<ScrollControls>` vs external Lenis:** Use `<ScrollControls>` (drei) when scroll is
canvas-only. Use Lenis + GSAP when scroll also drives DOM elements outside the canvas (e.g., text
overlays, project cards). For /lab2's hybrid layout (3D canvas + DOM overlay panels), Lenis + GSAP is
the correct choice.

---

## What NOT to Add

| Avoid | Why | Use Instead |
|---|---|---|
| `three-stdlib` | Redundant — drei wraps the useful parts. Adds bundle weight. | Use `@react-three/drei` directly |
| `@studio-freight/lenis` | Deprecated. Package renamed to `lenis`. | `lenis` (bare package name) |
| `framer-motion` (old import) | Rebranded to `motion` at v12. Install as `motion`, import from `motion/react`. | `motion` package |
| `framer-motion-3d` | Redundant — `motion/react-three-fiber` is the current path, included in `motion` package | `motion` (includes 3D support) |
| `react-spring` / `@react-spring/three` | Duplicates what GSAP + motion already provide. Two spring libraries in one project is confusion. | Use GSAP for scroll-driven, `motion` for UI springs |
| `ScrollSmoother` (GSAP Club) | Requires GSAP Club subscription. Lenis is free, better maintained, and more composable. | `lenis` |
| `locomotive-scroll` | Actively declining in maintenance. Lenis is the 2025 successor from the same ecosystem. | `lenis` |
| `cannon-es` / `rapier` physics | Physics engine adds significant complexity and bundle weight. /lab2 is visual, not interactive physics. | Custom spring math with `maath` + `useFrame` |
| `glsl-noise` (npm) | Abandoned 12 years ago. | Inline GLSL snippet (no dependency) |
| `three-noise` | Unnecessary dependency for functionality that is 30 lines of inline GLSL. | Inline GLSL snippet |
| `@react-three/a11y` | Accessibility for 3D is desktop-only context here; adds bundle size. Skip for /lab2. | — |

---

## Installation

```bash
# Smooth scroll (Lenis)
npm install lenis --cache /tmp/npm-cache-temp

# Motion (framer-motion rebranded, React 19 compatible)
npm install motion --cache /tmp/npm-cache-temp

# Post-processing effects
npm install @react-three/postprocessing --cache /tmp/npm-cache-temp

# Math helpers (R3F ecosystem)
npm install maath --cache /tmp/npm-cache-temp
```

**Single install command:**
```bash
npm install lenis motion @react-three/postprocessing maath --cache /tmp/npm-cache-temp
```

---

## Alternatives Considered

| Recommended | Alternative | When Alternative is Better |
|---|---|---|
| `lenis` | Native browser scroll | When no smooth-scroll UX is needed — but for media-art feel, Lenis is non-negotiable |
| `lenis` | `ScrollSmoother` (GSAP Club) | If already paying for GSAP Club membership — feature-equivalent but costs money |
| `motion` | Pure GSAP for DOM animations | If the team only wants one animation system — GSAP can animate DOM; but motion/react declarative API is faster to write for React component trees |
| `@react-three/postprocessing` | Manual Three.js EffectComposer | Direct Three.js control — but the R3F wrapper handles pass merging automatically and is production-tested |
| `maath` | Hand-written math utilities | If only 1-2 functions are needed — then inline the math; but maath is tiny and covers the full R3F math toolkit |

---

## Integration Points with Existing Setup

### Lenis + GSAP ScrollTrigger (the canonical sync pattern)

```typescript
// providers/SmoothScrollProvider.tsx  (new file — 'use client')
import { ReactLenis, useLenis } from 'lenis/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { gsap } from 'gsap';
import { useEffect } from 'react';

gsap.registerPlugin(ScrollTrigger);

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenis = useLenis(({ scroll }) => {
    // Keep ScrollTrigger in sync with Lenis scroll position
    ScrollTrigger.update();
  });

  useEffect(() => {
    // Hook Lenis RAF into GSAP ticker
    gsap.ticker.add((time) => {
      lenis?.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
    return () => gsap.ticker.remove((time) => lenis?.raf(time * 1000));
  }, [lenis]);

  return <ReactLenis root>{children}</ReactLenis>;
}
```

### motion/react with scroll progress from Lenis

```typescript
// In any 'use client' component
import { useScroll, useTransform, motion } from 'motion/react';

// useScroll tracks DOM scroll — compatible with Lenis since Lenis drives window scroll
const { scrollYProgress } = useScroll();
const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

return <motion.div style={{ opacity }}>Content</motion.div>;
```

### R3F Canvas + Post-Processing

```typescript
// LabScene2.tsx (new component, SSR-disabled via next/dynamic)
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

// Inside <Canvas>:
<EffectComposer>
  <Bloom luminanceThreshold={0.9} intensity={1.5} mipmapBlur />
  <Vignette eskil={false} offset={0.1} darkness={0.5} />
  <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={[0.002, 0.002]} />
</EffectComposer>
```

### Next.js SSR Guard (same pattern as /lab)

```typescript
// app/[locale]/lab2/page.tsx
import dynamic from 'next/dynamic';

const Lab2Scene = dynamic(() => import('@/components/lab2/Lab2Scene'), {
  ssr: false,           // THREE.js requires window — must disable SSR
  loading: () => <LoadingScreen />,
});
```

---

## Version Compatibility

| Package | Version | Compatible With | Notes |
|---|---|---|---|
| `@react-three/postprocessing` | ^3.0.4 | `@react-three/fiber ^9.0.0`, `three >= 0.156.0` | Peer deps confirmed via npm. Existing three@0.182 and R3F@9.5 satisfy requirements. |
| `motion` | ^12.34.3 | React 19 | React 19 support added at v12. Import from `motion/react`, not `framer-motion`. |
| `lenis` | ^1.3.17 | Next.js App Router, React 19 | Use `'use client'` directive. React sub-path: `lenis/react`. |
| `maath` | ^0.10.8 | `@react-three/fiber`, `three` | pmndrs package, same ecosystem as drei/R3F — no conflicts. |

---

## Stack Patterns by Variant

**If the scroll experience is purely inside the R3F canvas (no DOM text overlays):**
- Use `<ScrollControls>` from `@react-three/drei` instead of Lenis
- Simpler setup, no Lenis sync needed
- Access scroll with `useScroll()` from drei (not motion)

**If the scroll experience drives both the 3D canvas and DOM content panels (recommended for /lab2):**
- Use Lenis for smooth scroll normalization
- Feed scroll progress to R3F via a shared ref or Zustand atom
- Use `motion/react`'s `useScroll` / `useTransform` for DOM elements
- Use GSAP ScrollTrigger for timeline-based 3D scene transitions

**If a particle system is needed (e.g., floating particles as background):**
- Use `<Points>` + custom `shaderMaterial` from drei
- Animate in `useFrame` using `maath`'s `easing.dampE` for smooth lerp
- Add `<Bloom>` from `@react-three/postprocessing` to make emissive particles glow

---

## Sources

- npm registry (direct `npm show [package] version` calls) — version verification for all packages
- [pmndrs/react-postprocessing GitHub](https://github.com/pmndrs/react-postprocessing) — v3.0.4 release date (Feb 2025), peer deps
- [darkroomengineering/lenis GitHub](https://github.com/darkroomengineering/lenis) — v1.3.17, `lenis/react` sub-path confirmed
- [motion.dev — Motion for React Three Fiber](https://motion.dev/docs/react-three-fiber) — 3D motion integration docs
- [GSAP Community — Lenis + ScrollTrigger sync pattern](https://gsap.com/community/forums/topic/40426-patterns-for-synchronizing-scrolltrigger-and-lenis-in-reactnext/) — canonical integration pattern
- [Wawa Sensei — 3D Portfolio with R3F + Framer Motion Scroll](https://wawasensei.dev/tuto/build-a-3D-portfolio-with-react-three-fiber-framer-motion-scroll-animations) — real-world integration pattern
- [Maxime Heckel — Particles with R3F and Shaders](https://blog.maximeheckel.com/posts/the-magical-world-of-particles-with-react-three-fiber-and-shaders/) — particle system patterns with R3F
- [Codrops — GPGPU Particle Effect with Three.js (Dec 2024)](https://tympanus.net/codrops/2024/12/19/crafting-a-dreamy-particle-effect-with-three-js-and-gpgpu/) — advanced particle techniques

---

*Stack research for: Media-art 3D interactive portfolio (/lab2)*
*Researched: 2026-02-28*
