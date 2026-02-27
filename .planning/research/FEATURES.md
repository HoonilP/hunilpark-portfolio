# Feature Research

**Domain:** Media-art style interactive portfolio (/lab2 route) — v3.0 milestone
**Researched:** 2026-02-28
**Confidence:** HIGH (verified against Codrops 2025 case studies, Awwwards SOTD analysis, official library docs)

---

> **NOTE:** This file was updated for the v3.0 milestone. The original research (v1/v2 main portfolio features) is preserved at the bottom as a reference. The /lab2 media-art research is the primary content.

---

## Context for /lab2

The `/lab2` route is a **single-route interactive experience** — desktop-only, no separate project detail pages. The experience must:

1. Prove frontend engineering depth through the experience itself (the portfolio IS the demo)
2. Showcase 5 projects inline without separate pages
3. Feel like a media-art installation, not a scrollable webpage
4. Target Korean big-tech hiring managers who will recognize technical sophistication

**Existing assets to use:**
- 13 optimized WebP images (hero, architecture, thumbnail per project) — already in `/public/images/`
- ~20,000 words bilingual project content — already authored, available via next-intl translations
- Existing `/lab` patterns (scroll-driven canvas, sticky 3D scene, dot nav) — extend, don't reinvent

---

## Feature Landscape

### Table Stakes (Users Expect These)

Features that award-winning interactive portfolios must have. Missing any of these makes the experience feel unfinished or broken.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Scroll-driven progression** | Core mechanic of media-art portfolios — scroll controls the narrative timeline | MEDIUM | Map scroll 0–1 to scene chapters. Pattern already wired in `/lab`. GSAP ScrollSmoother or Lenis + `useScroll` from R3F. |
| **Smooth scroll / scroll lerp** | Native browser scroll feels mechanical; premium feel requires interpolation | LOW | Lenis (2.3kB gzip) or GSAP ScrollSmoother. Single setup call, massive perceived quality gain. |
| **Loading screen with asset progress** | 3D assets and textures take time; blank canvas = broken perception | MEDIUM | R3F/drei `useProgress` hook + GSAP-animated overlay. Fade-out at 100%. Minimal, calm design — two lines of text, a progress line. |
| **Cinematic scene transitions** | Camera moving between chapters must feel deliberate, not snapping | MEDIUM | GSAP timeline per chapter, scrubbed by scroll. `customEase` curves (e.g. "cinematicSilk": 0.45,0.05,0.55,0.95). |
| **Text animations (character-level)** | Static text in a motion-heavy experience reads as incomplete and cheapens everything | MEDIUM | GSAP SplitText or manual char splitting (SplitText is now free in GSAP 3.x). Stagger 0.02–0.05s per character. |
| **Chapter navigation / orientation** | User must know where they are in the experience — disorientation kills engagement | LOW | Dot nav (already in `/lab`), or "2 / 5" chapter counter. Chapter name shown on active section. |
| **Back-to-main link** | User must be able to exit the experience cleanly | LOW | Fixed position, subtle. Already implemented in `/lab` — port directly. |
| **Project information readability** | Hiring managers must actually be able to read project details | MEDIUM | HTML overlay panels positioned over canvas (not 3D text). High contrast, clean typography. |
| **60fps baseline** | Below 60fps, the experience reads as broken rather than artistic | HIGH | R3F `PerformanceMonitor` + adaptive pixel ratio. Disable expensive post-processing below 30fps. |
| **Graceful mobile message** | Desktop-only is in scope; mobile users need a clear explanation | LOW | Detect viewport < 1024px, show a simple "best viewed on desktop" message. No attempt to make 3D work on mobile. |

### Differentiators (Competitive Advantage)

What separates a "Three.js sphere in a dark room" from an Awwwards SOTD. These are where engineering talent becomes visible.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Camera path storytelling** | Camera flies through a continuous 3D space; each project is a new "shot" — creates cinematic progression | HIGH | GSAP timeline scrubbed by scroll progress. `camera.position.set()` + `lookAt()` per chapter. The most critical differentiator — this IS the experience structure. |
| **Scroll-velocity reactive text stretch** | Text geometry that distorts in proportion to scroll speed — immediately "feels alive" to technical viewers | MEDIUM | Track scroll delta between frames. Pass as `uniform float uVelocity` to GLSL vertex shader. Stefan Vitasović and Roman Jean-Elie both use this. Highest ROI effect. |
| **Kinetic character-level typography** | Characters that assemble, disperse, or morph rather than fade — the single biggest perceptual differentiator at low cost | MEDIUM | GSAP SplitText + staggered x-axis motion with masked overflow. Stefan Vitasović's "characters-to-word" assembly. Combine with `clip-path: inset()` for glass-parallax feel. |
| **Project images as 3D texture planes** | Existing WebP images mapped onto planes in 3D space — turns static assets into dynamic scene elements | LOW | `PlaneGeometry` with `TextureLoader`. Can add subtle displacement shader on hover. All 13 images already exist as WebP. |
| **Particle field as environment** | A background particle system creates sense of being somewhere rather than floating in void | MEDIUM | Three.js `Points` + `BufferGeometry`. Keep < 3k particles. Velocity-responsive opacity or drift. Environment, not centerpiece. |
| **Post-processing effects** | Bloom + film grain transform the rendering from "3D viewport" to "cinematic experience" | MEDIUM | `@react-three/postprocessing` EffectComposer. Bloom on emissive meshes. FilmGrain adds analog texture. Must be conditionally disabled via PerformanceMonitor. |
| **Mouse parallax on idle** | Camera or scene reacts subtly to cursor position when user is not actively scrolling — creates "alive" feeling | LOW | Interpolated `camera.rotation.x/y` toward mouse target. Already implemented in `/lab` — port directly. Very low cost, high perceived quality. |
| **Transition wipes between chapters** | Geometric wipe (not a fade) marks major section shifts clearly and intentionally | MEDIUM | CSS clip-path animated via GSAP, or a fullscreen quad mesh in WebGL. Makes the "chapter" metaphor tangible. |
| **Entry intro sequence** | After loading completes, 2–3 second animated intro before scroll-driven content starts — sets tone | MEDIUM | Camera starts zoomed out / abstract. Text assembles. Environment fades in. GSAP timeline, not scroll-driven. |
| **Per-project visual signature** | Each of 5 project chapters has a slightly different color temperature or shader effect — prevents visual monotony | HIGH | Swap `THREE.Color` for ambient/directional lights per chapter. Or pass a per-chapter `uColor` uniform to shared shaders. Can be added incrementally. |
| **Custom cursor** | Replaces browser cursor with a minimal dot that reacts to hover states — standard on Awwwards-quality sites | LOW | 40px circle, `mix-blend-mode: difference`. Enlarges on hover over interactive elements. CSS + GSAP, no Three.js. |

### Anti-Features (Commonly Requested, Often Problematic)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| **Ambient audio / autoplay sound** | Cinematic, media-art feel | Browsers block autoplay; unexpected sound is hostile; hiring managers view in offices or with headphones on calls | If audio is desired: explicit opt-in mute/unmute toggle with clear iconography. Never autoplay. Realistically, skip audio entirely for hiring context. |
| **Full mobile support** | Portfolio should work everywhere | 3D on mobile: thermal throttling, 60fps impossible on mid-range phones, WebGL context loss is common. Attempting mobile degrades the desktop experience too. | Show "best experienced on desktop" message. /lab2 is explicitly desktop-only in the project spec. |
| **Excessive particle counts (> 10k)** | More particles = more "media art" impressiveness | Single `Points` pass > 10k stalls GPU on integrated graphics (MacBook Air is common in Korean offices). Laptop fans spin up during hiring manager demo. | Keep particles < 3k. Use instanced meshes for repeated elements. Scale count with `dpr`. |
| **Simultaneous independent GSAP tweens** | Rich, layered motion | Multiple concurrent tweens on the same element cause style conflicts and jank; common 30fps culprit | Consolidate all animation for a chapter into one GSAP timeline. One master timeline per scroll chapter, scrubbed by progress. |
| **Video backgrounds / autoplay video** | Dramatic and cinematic | Large file size, bandwidth cost, battery drain, codec inconsistencies, conflicts with WebGL canvas | Use static images with shader-based animation: noise displacement, scanline overlay, subtle vertex drift. Equally cinematic, 10x lighter. |
| **Physics simulation (Matter.js / Cannon.js)** | "Alive" feel, memorable interactions | Physics at 60Hz + GSAP + WebGL = triple simultaneous CPU load. Even Stas Bondar, who uses physics for character dropping, limits it to a single isolated moment. | Fake physics with spring-eased GSAP: `elastic.out(1, 0.3)` easing. Same perceived feel, zero runtime cost. |
| **3D text for readable body copy** | Shows technical depth, "look what I can do" | `TextGeometry` is expensive (high poly count); 3D text anti-aliases poorly at small sizes; completely unreadable in dark environments. | 3D text only for hero moments (1–2 large words). All project descriptions in HTML overlay with proper typography. |
| **Infinite scroll / no defined endpoint** | "Premium scrolly" pattern | Hiring managers don't explore endlessly. If they don't know when they've seen everything, they assume they've missed something and give up. | Define clear chapter count (5–7). Show progress. "4 of 5" indicator tells them they're almost done. |
| **Preloading all assets before start** | Prevents missing textures mid-experience | If total assets > 3–5MB, user waits > 3s before seeing anything. Perceived as broken or stuck. | Load entry state assets immediately. Load per-chapter textures just-in-time as chapters approach. Drei `useTexture` with Suspense. |
| **Portal / FBO render pipeline (initially)** | Maximum visual differentiation, Roman Jean-Elie's signature technique | Requires a fundamentally different render pipeline (render-to-texture, mask geometry). Cannot be added later without major refactor. | Build with standard scene first. Plan the architecture to accommodate FBO as a future upgrade if the simpler approach works. |

---

## Feature Dependencies

```
[Smooth Scroll / Lenis]
    └──required by──> [Scroll Progression System]

[Scroll Progression System]  (core spine — everything depends on this)
    └──required by──> [Camera Path Storytelling]
    └──required by──> [Chapter State Machine]
    └──required by──> [Scroll-velocity reactive effects]
    └──required by──> [Text animation triggers]
    └──required by──> [Transition wipes]

[Camera Path Storytelling]
    └──required by──> [Per-project visual signature]
    └──required by──> [Project panel reveal]

[Chapter State Machine]
    └──required by──> [Project information display]
    └──required by──> [Chapter progress indicator]

[R3F / Three.js Canvas]
    └──required by──> [Particle field]
    └──required by──> [Project images as 3D textures]
    └──required by──> [Post-processing effects]
    └──required by──> [Custom GLSL shaders]

[Post-Processing Effects]
    └──requires──> [PerformanceMonitor] to disable gracefully

[Loading Screen]
    └──precedes──> [Entry intro sequence]
    └──precedes──> [Scroll-driven content]

[Asset preloading strategy]
    └──required by──> [Loading Screen with progress]

[GSAP SplitText]
    └──required by──> [Kinetic character typography]
    └──enhances──> [Text animations]

[Scroll delta tracking]
    └──required by──> [Scroll-velocity text stretch shader]
    └──feeds──> [Custom GLSL uniform uVelocity]

[Custom GLSL shaders]
    └──enhances──> [Particle systems] (velocity-based opacity)
    └──enhances──> [Project image planes] (displacement on hover)

[Mouse position tracking]
    └──required by──> [Mouse parallax]
    └──required by──> [Custom cursor]
```

### Dependency Notes

- **Scroll Progression is the spine.** Everything else is a function of the 0–1 scroll value. Build this first, test it, then layer features on top.
- **Camera Path requires Scroll Progression.** Camera position is computed as a chapter-keyed function of global scroll. This cannot be retrofitted — design the chapter count and camera waypoints before building anything else.
- **Post-Processing requires PerformanceMonitor.** Without adaptive disabling, bloom + grain will tank integrated GPU laptops (MacBook Air, common in Korean office environments). PerformanceMonitor is not optional if post-processing is in scope.
- **Loading Screen precedes everything visible.** Nothing should render in the canvas until critical assets are ready. GSAP overlay with `useProgress` from drei is the standard pattern.
- **FBO / Portal conflicts with standard scene.** The portal mask technique requires render-to-texture pipeline. Decide architecture in Phase 1. Adding it later requires a meaningful refactor.
- **Custom cursor is independent.** Zero Three.js involvement. Can be added at any phase. Low cost, adds significant polish.

---

## MVP Definition

### Launch With (v1 — Credible media-art showcase)

The minimum set that proves this is an intentional, technically sophisticated experience:

- [ ] **Scroll-driven 3D environment** — Camera moves through a continuous space as user scrolls. 6 chapters: intro + one per project. Establishes the core mechanic. No scroll = no experience.
- [ ] **Loading screen with progress bar** — `useProgress` + GSAP fade-out. Non-negotiable for any 3D site.
- [ ] **Smooth scroll (Lenis)** — Eliminates mechanical scroll feel. Single setup call.
- [ ] **Character-level text reveals** — Each chapter has a headline that assembles character by character. The single highest-ROI differentiator.
- [ ] **Project showcase panels (HTML overlay)** — When scrolling to each project chapter, project name, tech stack, and 2–3 sentence summary are readable. HTML positioned over canvas — not 3D text.
- [ ] **Existing project images as 3D texture planes** — Map the 13 existing WebP images onto planes in the scene. All images exist; zero new asset creation needed.
- [ ] **Particle field environment** — Background particle system (< 3k) creates sense of inhabiting a space. Ties chapters together visually.
- [ ] **Performance monitor + adaptive DPR** — R3F `PerformanceMonitor`. Must not crash integrated GPU.
- [ ] **Chapter progress indicator** — "3 / 5" counter or dot nav. User must know they've seen all projects.
- [ ] **Back-to-main navigation** — Fixed link, same as `/lab`. Port directly.
- [ ] **Desktop-only gate** — Viewport < 1024px shows a clean "best experienced on desktop" message. No broken 3D on mobile.

### Add After Core Works (v1.x — Polish layer)

- [ ] **Scroll-velocity text stretch shader** — Pass scroll `delta` as `uVelocity` uniform to headline geometry. Adds immediate "wow" without architecture changes. Trigger: core scroll + 3D working at stable 60fps.
- [ ] **Post-processing: bloom + film grain** — `@react-three/postprocessing` EffectComposer. Trigger: PerformanceMonitor shows render budget headroom on target hardware.
- [ ] **Entry intro sequence** — 2–3 second animated intro after loading completes before scroll-driven content begins. GSAP timeline. Sets tone for entire experience.
- [ ] **Mouse parallax on idle** — Interpolated camera drift toward cursor. Port from `/lab` directly.
- [ ] **Transition wipes between chapters** — CSS clip-path animated by GSAP at chapter boundaries.
- [ ] **Custom cursor** — 40px circle, `mix-blend-mode: difference`, grows on hover. Pure CSS + GSAP.
- [ ] **Per-project color temperature** — Shift ambient/directional light colors per chapter. Prevents visual monotony across 5 projects.

### Future Consideration (v2+ — If time and budget allow)

- [ ] **Portal / FBO masked reveals** — Bounded WebGL plane using render-to-texture mask. Maximum visual impact. Requires architecture decision upfront even if deferred.
- [ ] **Per-project GLSL shader signature** — Unique fragment shader per project chapter (dither effect, scanlines, noise pattern). Requires shader authoring per project.
- [ ] **Audio opt-in** — A single ambient drone with mute toggle. Only after accessibility review. Probably not appropriate for Korean hiring context.
- [ ] **3D extruded text for hero moments** — `troika-three-text` for 1–2 key title moments. Only if performance headroom is confirmed.
- [ ] **Physics-driven elements** — GSAP spring easing as fake physics for most things. Real physics (Rapier) only if a specific interaction justifiably requires it.

---

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Scroll-driven camera path storytelling | HIGH | HIGH | P1 (it is the experience) |
| Loading screen with progress | HIGH | LOW | P1 |
| Smooth scroll (Lenis) | HIGH | LOW | P1 |
| Chapter text reveals (SplitText) | HIGH | LOW | P1 |
| Project panels (HTML overlay) | HIGH | LOW | P1 |
| Existing images as 3D textures | HIGH | LOW | P1 |
| Particle field environment | MEDIUM | LOW | P1 |
| Performance monitor + adaptive DPR | HIGH | LOW | P1 |
| Chapter progress indicator | MEDIUM | LOW | P1 |
| Desktop-only gate | HIGH | LOW | P1 |
| Scroll-velocity text stretch shader | HIGH | MEDIUM | P2 |
| Post-processing bloom + grain | HIGH | MEDIUM | P2 |
| Entry intro sequence | HIGH | MEDIUM | P2 |
| Mouse parallax | MEDIUM | LOW | P2 |
| Transition wipes | MEDIUM | MEDIUM | P2 |
| Custom cursor | MEDIUM | LOW | P2 |
| Per-project color temperature | MEDIUM | LOW | P2 |
| Portal / FBO masked reveals | HIGH | HIGH | P3 |
| Per-project GLSL shader signature | HIGH | HIGH | P3 |
| Audio opt-in | LOW | MEDIUM | P3 |
| 3D extruded text (troika) | MEDIUM | HIGH | P3 |

**Priority key:**
- P1: Must have for launch
- P2: Should have, add when possible
- P3: Nice to have, future consideration

---

## Competitor Feature Analysis

Reference portfolios analyzed for this research (all Codrops case studies or Awwwards SOTD, 2025):

| Feature | Stas Bondar '25 | Roman Jean-Elie '25 | Stefan Vitasović '25 | /lab2 Approach |
|---------|-----------------|---------------------|----------------------|----------------|
| Scroll mechanism | GSAP ScrollTrigger + scrub | Custom scroll engine + Virtual Scroll | Custom scroll + Lethargy | Lenis + GSAP ScrollTrigger (proven combo for Next.js) |
| Text animation | SplitText stagger + scramble | Kinetic character assembly on x-axis | x-axis char movement, masked overflow | GSAP SplitText — character-level stagger, clip-path mask |
| 3D engine | Three.js | Three.js | Three.js | R3F (React wrapper, easier Next.js integration) |
| Project showcase | WebGL grid + hover | Portal mask + DOM sync | WebGL textures on planes | HTML overlay panels synchronized with scroll chapter state |
| Scroll-velocity effect | Not specified | Velocity-stretch on project titles | Displacement on project thumbnails | Velocity stretch on chapter headlines via `uVelocity` uniform |
| Loading experience | Not detailed | AnimatePresence fade between pages | CDN-hosted media | drei `useProgress` + GSAP overlay — single preload, clean fade |
| Post-processing | Ordered dithering on all images | Not described | LED overlay + noise grain on video | Bloom on emissive elements + FilmGrain for analog texture |
| Cursor | Custom (not detailed) | Not detailed | Not detailed | 40px circle, mix-blend-mode difference |
| Audio | None | None | None | None (anti-feature for hiring context) |
| Mobile | Desktop-focused | Desktop-focused | Desktop-focused | Explicit "desktop only" message |
| Unique signature | Dithering as consistent visual language | Portal morphing across all sections | Swiss-style grid + fluid digital | Scroll-velocity as consistent motion language |

---

## What Makes Awwwards-Quality Interactive Portfolio

Based on analysis of SOTD winners and 2025 Codrops case studies, the difference between "Three.js demo" and "award-winning" is:

**1. Cohesion over feature count.** Every visual element serves one conceptual direction. Stas Bondar's dithering appears on every image — not one. Roman Jean-Elie's portal morphs in every section transition. Pick one visual language and apply it consistently. More effects with less consistency = worse result.

**2. Motion that carries meaning.** Scroll-velocity text stretch MEANS "you're moving fast through this." Camera pulling back MEANS "zooming out to see the larger picture." Effects must have narrative logic — not just look cool. If you can't explain why an effect exists, cut it.

**3. 60fps is the baseline, not a goal.** All SOTD winners use adaptive performance systems. `PerformanceMonitor` that backs off DPR and disables post-processing below 30fps is table stakes, not optional.

**4. Typography is the highest-ROI investment.** In every case study, character-level text animation creates the strongest "this was made carefully" signal. GSAP SplitText correctly eased (not just fading) is what separates mediocre from memorable.

**5. Loading screen is part of the product.** A minimal, beautiful preloader signals intent. A blank screen with a browser spinner signals "this wasn't thought through."

**6. Restraint at the end.** Roman Jean-Elie: "what I initially thought would be the centerpiece almost became optional." Stas Bondar removed effects that detracted from the physics typography. The best work REMOVES features. Every element in /lab2 should earn its presence.

---

## Content Dependencies (from Existing Portfolio)

No new content creation required. All narrative content comes from existing bilingual portfolio data.

| Feature in /lab2 | Depends On | Status |
|-----------------|-----------|--------|
| Project panels (name, summary, tech) | 5 project descriptions (KO + EN) | EXISTS in main site translations |
| Project images as 3D textures | 13 WebP images in `/public/images/` | EXISTS |
| Tech stack display per project | Tech stack per project (PROJECT.md) | EXISTS |
| Bilingual text animations | next-intl translation files | EXISTS — must wire locale to lab2 |
| Back-to-main navigation | Main route `/{locale}` | EXISTS |
| Existing scroll + 3D patterns | `/lab` codebase | EXISTS — reference and extend |

---

## Sources

- [Stas Bondar '25: Code and Techniques Behind a Next-Level Portfolio](https://tympanus.net/codrops/2025/03/25/stas-bondar-25-the-code-techniques-behind-a-next-level-portfolio/) — HIGH confidence (Codrops case study, March 2025)
- [Letting the Creative Process Shape a WebGL Portfolio (Roman Jean-Elie)](https://tympanus.net/codrops/2025/11/27/letting-the-creative-process-shape-a-webgl-portfolio/) — HIGH confidence (Codrops case study, November 2025)
- [Case Study: Stefan Vitasovic Portfolio 2025](https://tympanus.net/codrops/2025/03/05/case-study-stefan-vitasovic-portfolio-2025/) — HIGH confidence (Codrops case study, March 2025)
- [How to Build Cinematic 3D Scroll Experiences with GSAP](https://tympanus.net/codrops/2025/11/19/how-to-build-cinematic-3d-scroll-experiences-with-gsap/) — HIGH confidence (Codrops tutorial, November 2025)
- [Building Efficient Three.js Scenes: Optimize Performance While Maintaining Quality](https://tympanus.net/codrops/2025/02/11/building-efficient-three-js-scenes-optimize-performance-while-maintaining-quality/) — HIGH confidence (Codrops tutorial, February 2025)
- [Building a Scroll-Revealed WebGL Gallery with GSAP, Three.js](https://tympanus.net/codrops/2026/02/02/building-a-scroll-revealed-webgl-gallery-with-gsap-three-js-astro-and-barba-js/) — HIGH confidence (Codrops tutorial, February 2026)
- [Cyd Stumpel Portfolio 2025 — Awwwards SOTD](https://www.awwwards.com/sites/cyd-stumpel-portfolio-2025) — HIGH confidence (Awwwards, 2025)
- [Portfolio 25 — Awwwards SOTD (Roman Jean-Elie)](https://www.awwwards.com/sites/portfolio-25-1) — HIGH confidence (Awwwards, 2025)
- [Three.js Journey: Performance Tips](https://threejs-journey.com/lessons/performance-tips) — HIGH confidence (official Three.js Journey, Bruno Simon)
- [GSAP ScrollTrigger Docs](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) — HIGH confidence (official GSAP docs)
- [WebGL Refraction hover effect — Awwwards inspiration](https://www.awwwards.com/inspiration/webgl-refraction-hover-effect-dorian-lods-portfolio-2025) — MEDIUM confidence (Awwwards, 2025)

---

*Feature research for: media-art style interactive portfolio (/lab2 route), v3.0 milestone*
*Researched: 2026-02-28*

---

## Archived: v1/v2 Main Portfolio Feature Research

> The research below covers the main portfolio site (v1/v2 — already shipped). Retained for reference.

**Domain:** Frontend Developer Portfolio Website
**Target Audience:** Korean Big Tech Recruiters (Samsung, Naver, Kakao)
**Researched:** 2026-02-11
**Confidence:** MEDIUM (Korean-specific context is LOW)

### Table Stakes (Main Portfolio — SHIPPED)

| Feature | Why Expected | Complexity | Status |
|---------|--------------|------------|--------|
| Fast Load Time (<3s) | Recruiters leave slow sites | Medium | DONE — WebP images, static export |
| Mobile-First Design | 50%+ traffic is mobile | Medium | DONE |
| 3-5 Polished Projects | Quality over quantity | High | DONE — 5 projects |
| Project Case Studies | Problem → Solution → Results | High | DONE — ~20,000 words |
| Korean/English Toggle | Korean big tech expects bilingual | Medium | DONE — next-intl |
| Live Demo Links | Proves deployment skills | Low | DONE |
| GitHub Profile Link | Validates code quality | Low | DONE |
| Clear Tech Stack per Project | Keyword matching for JDs | Low | DONE |
| Contact Section | Must be easy to reach | Low | DONE |
| About Section | Humanizes candidate | Low | DONE |
| Skills Overview | Quick capability scan | Low | DONE |

### Anti-Features (Main Portfolio — Applied)

| Anti-Feature | Decision |
|--------------|----------|
| Overly Complex Animations | Avoided in main site — deferred to /lab2 |
| Splash/Loading Screens | Not on main site |
| Skill Rating Bars | Explicitly excluded |
| Auto-Playing Media | Not implemented |
| More than 5 projects | Capped at 5 |
