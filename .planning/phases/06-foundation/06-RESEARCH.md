# Phase 6: Foundation - Research

**Researched:** 2026-02-28
**Domain:** Next.js App Router + Three.js/R3F WebGL infrastructure, i18n route setup, viewport gating, WebGL context lifecycle
**Confidence:** HIGH (verified against official docs and existing codebase)

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **로딩 화면**: 미니말 퍼센트 숫자만 크게 표시 — 다른 텍스트(이름, 서브텍스트) 없음. 로딩 완료 후 페이드 아웃으로 씬 전환. 로딩 중 배경 분위기는 Claude 재량.
- **뷰포트 게이트**: 1024px 미만에서 게이트 표시, 1024px 이상 모두 허용(태블릿 가로 포함). 게이트에 메인 포트폴리오로 돌아가는 링크 제공. 실시간 반응 (resize 즉시 반응).
- **/lab vs /lab2**: 둘 다 유지 — 별도 경험으로 공존. 메인 사이트 네비게이션에 /lab2 진입 링크 추가. /lab2 내에서 고정 링크(화면 코너)로 메인 사이트 복귀.

### Claude's Discretion
- 로딩 화면 배경색/분위기 (전체 경험 톤에 맞춤)
- 뷰포트 게이트 디자인 스타일
- 네비게이션 레이블 네이밍 (/lab2의 표시 이름)
- 초기 빈 씬의 배경색/그라디언트
- 빈 씬에 플레이스홀더 요소 포함 여부
- 캔버스 비율 (풀스크린 vs 영역 제한)
- 다크/라이트 모드 지원 전략

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| FOUND-01 | /lab2 라우트가 Next.js App Router에서 한국어/영어 양 로케일로 접근 가능하다 | next-intl v4 routing pattern — mirror `/lab` directory structure under `[locale]/lab2/` |
| FOUND-02 | Three.js/R3F 컴포넌트가 SSR 없이 클라이언트에서만 렌더링된다 (dynamic import) | `next/dynamic` with `ssr: false` — established pattern confirmed in existing `/lab` |
| FOUND-03 | 로딩 화면이 에셋 로드 진행률을 표시하고, 셰이더 사전 컴파일 후 씬을 보여준다 | `useProgress` from `@react-three/drei` wraps THREE.DefaultLoadingManager — real progress tracking inside Suspense fallback |
| FOUND-04 | 뷰포트 1024px 미만에서 "데스크톱에서 보세요" 메시지를 표시한다 | Custom `useWindowSize` hook using `window.innerWidth` with resize event listener; render gate before Canvas is mounted |
| FOUND-05 | /lab2 ↔ 메인 사이트 간 반복 이동 시 WebGL 컨텍스트 누수가 없다 | R3F Canvas internally calls `gl.forceContextLoss()` + `gl.dispose()` on unmount — standard pattern confirmed; avoid conditional Canvas mounting for extra safety |
</phase_requirements>

---

## Summary

Phase 6 establishes the /lab2 route as a new, independent 3D experience alongside the existing /lab. The tech stack (Three.js r182, @react-three/fiber v9, @react-three/drei v10) is already installed and verified working in `/lab`. The primary task is creating a parallel route structure under `[locale]/lab2/` using identical i18n patterns as `/lab`.

The most important architectural decision for this phase is **WebGL context lifecycle management**. R3F v9 handles `forceContextLoss` + `dispose` automatically on Canvas unmount, but the browser has a hard limit (typically 8–16 contexts). For 10-cycle navigation testing (FOUND-05), the safe pattern is to ensure the Canvas component fully unmounts and remounts cleanly with each page visit — which R3F's own lifecycle handles. No extra cleanup code is needed beyond proper component structure.

The loading screen must use `useProgress` from drei (not the existing fake-progress timer in `/lab`) to show real asset load percentage. The viewport gate must be implemented as a pure React check outside the Canvas, ensuring the Canvas is never even mounted on small viewports — preventing wasted WebGL context allocation.

**Primary recommendation:** Mirror the existing `/lab` directory structure for `/lab2`, replace the fake-progress loading screen with `useProgress`, add a `useViewportGate` hook for the 1024px check, and verify bundle isolation via `npx next experimental-analyze` (preferred for Turbopack dev setup) or `ANALYZE=true npm run build` (with `@next/bundle-analyzer`).

---

## Standard Stack

### Core (already installed — no new installs needed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `three` | ^0.182.0 | WebGL renderer, scene graph | Already in package.json |
| `@react-three/fiber` | ^9.5.0 | React renderer for Three.js | v9 = React 19 compatible |
| `@react-three/drei` | ^10.7.7 | Helpers: `useProgress`, `Preload`, `Html`, `Environment` | Already in package.json |
| `next-intl` | ^4.8.2 | i18n routing for `[locale]/lab2` | Already configured |

### Supporting (may need install)
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@next/bundle-analyzer` | latest | Verify Three.js chunk isolation (FOUND-05 success criterion 5) | Only for build analysis script, not runtime |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `useProgress` (drei) | Custom fake timer (existing /lab pattern) | `useProgress` tracks real assets; fake timer always used in /lab — FOUND-03 requires real progress |
| CSS resize listener | `ResizeObserver` on container | Both work; `window.innerWidth` with resize event is simpler for a viewport-level gate |
| `npx next experimental-analyze` | `ANALYZE=true npm run build` with `@next/bundle-analyzer` | Turbopack-native analyzer is built into Next.js 16.1+; webpack analyzer still works but requires install |

**Installation (if bundle analyzer needed):**
```bash
npm install @next/bundle-analyzer --cache /tmp/npm-cache-temp
```

---

## Architecture Patterns

### Recommended Project Structure for /lab2
```
src/
├── app/[locale]/lab2/           # NEW: mirrors [locale]/lab/ structure
│   ├── layout.tsx               # setRequestLocale + generateStaticParams (copy from /lab)
│   └── page.tsx                 # 'use client' page with viewport gate + dynamic Canvas import
├── components/lab2/             # NEW: separate from /lab components
│   ├── Lab2Scene.tsx            # Canvas root — 'use client'
│   ├── EmptyScene.tsx           # Placeholder scene content for Phase 6
│   └── ui/
│       ├── LoadingScreen.tsx    # NEW: uses useProgress (real asset %)
│       └── ViewportGate.tsx     # NEW: 1024px gate with back link
```

### Pattern 1: i18n Route Layout (mirrors /lab exactly)

**What:** The `/[locale]/lab2/layout.tsx` uses `setRequestLocale` + `generateStaticParams` identical to `/lab/layout.tsx`.
**When to use:** Every new route under `[locale]/` needs this for static rendering.

```typescript
// src/app/[locale]/lab2/layout.tsx
// Source: mirrors existing src/app/[locale]/lab/layout.tsx
import {setRequestLocale} from 'next-intl/server';
import {routing} from '@/i18n/routing';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function Lab2Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  return <>{children}</>;
}
```

### Pattern 2: Client-Only Canvas via dynamic import (mirrors /lab)

**What:** Page is `'use client'`, Canvas is dynamically imported with `ssr: false`.
**When to use:** Any route that mounts Three.js Canvas.

```typescript
// src/app/[locale]/lab2/page.tsx
'use client';

import dynamic from 'next/dynamic';
import {useTranslations} from 'next-intl';
import ViewportGate from '@/components/lab2/ui/ViewportGate';
import useViewportWidth from '@/components/lab2/hooks/useViewportWidth';

const Lab2Scene = dynamic(() => import('@/components/lab2/Lab2Scene'), {
  ssr: false,
  loading: () => <LoadingFallback />,
});

export default function Lab2Page() {
  const t = useTranslations('Lab2');
  const width = useViewportWidth();

  // Viewport gate: never mount Canvas on small viewports
  if (width !== null && width < 1024) {
    return <ViewportGate />;
  }

  return (
    <div className="fixed inset-0 z-[60] bg-neutral-950">
      <Lab2Scene />
      {/* Fixed corner link back to main site */}
    </div>
  );
}
```

### Pattern 3: Real Progress Loading Screen with useProgress

**What:** `useProgress` from drei wraps `THREE.DefaultLoadingManager` and returns `progress` (0–100). Use inside the Canvas's Suspense fallback OR as an overlay that reads progress state.
**When to use:** FOUND-03 — must show real asset load %.

```typescript
// src/components/lab2/ui/LoadingScreen.tsx
// Source: https://drei.docs.pmnd.rs/loaders/progress-use-progress
'use client';

import {useProgress} from '@react-three/drei';
import {useEffect, useState} from 'react';

export default function LoadingScreen() {
  const {progress, active} = useProgress();
  const [visible, setVisible] = useState(true);

  // Fade out after loading completes
  useEffect(() => {
    if (!active && progress >= 100) {
      const timer = setTimeout(() => setVisible(false), 500);
      return () => clearTimeout(timer);
    }
  }, [active, progress]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] bg-neutral-950 flex items-center justify-center
        transition-opacity duration-500 ${!active && progress >= 100 ? 'opacity-0' : 'opacity-100'}`}
    >
      {/* Minimal: large percentage number only */}
      <span className="text-white/60 text-6xl font-light tabular-nums">
        {Math.round(progress)}
      </span>
    </div>
  );
}
```

**Critical:** `useProgress` must be used inside or alongside a `<Suspense>` boundary that wraps asset-loading components. Assets loaded via `useLoader` or `useGLTF` automatically register with `THREE.DefaultLoadingManager`.

For Phase 6 (empty scene / no heavy assets), progress will jump quickly to 100%. This is acceptable — the hook reports real progress when real assets exist in later phases.

### Pattern 4: Viewport Gate Hook (SSR-safe)

**What:** A hook that returns window width, initialized to `null` on server to avoid hydration mismatch.
**When to use:** FOUND-04 — gate must be real-time responsive.

```typescript
// src/components/lab2/hooks/useViewportWidth.ts
'use client';

import {useState, useEffect} from 'react';

export default function useViewportWidth(): number | null {
  const [width, setWidth] = useState<number | null>(null);

  useEffect(() => {
    const update = () => setWidth(window.innerWidth);
    update(); // set on mount
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return width;
}
```

**SSR safety:** `null` on server, actual value after hydration. The gate component renders nothing (or a loading state) while `null`, avoiding hydration mismatch. Once the client hydrates, real width is known immediately.

### Pattern 5: WebGL Context Lifecycle (FOUND-05)

**What:** R3F Canvas automatically calls `gl.forceContextLoss()` and `gl.dispose()` when the Canvas component unmounts. This is built into R3F — no custom cleanup code needed.
**When to use:** Always — don't fight this.

The key risk is **mounting Canvas on every page visit** without it properly unmounting first. The safe pattern for Next.js App Router:
- Canvas lives inside the `page.tsx` component
- When navigating away (to `/`), the page unmounts → Canvas unmounts → R3F cleans up
- When navigating back (to `/lab2`), a fresh Canvas mounts with a fresh context

This pattern works for 10-cycle testing (FOUND-05). The browser context limit is typically 8–16; R3F's automatic cleanup ensures each navigation frees the previous context.

**Anti-pattern to avoid:** Conditionally rendering `<Canvas>` inside a component that stays mounted (e.g., inside a global layout). This prevents cleanup. Keep Canvas inside the page component that unmounts on route change.

### Pattern 6: Bundle Isolation Verification

**What:** Confirm Three.js only loads on /lab2 routes.
**When to use:** Success criterion 5 — `ANALYZE=true npm run build`.

Two options based on Next.js 16:

**Option A — Turbopack-native (preferred for dev):**
```bash
npx next experimental-analyze
```
No install needed. Interactive UI. Filter by /lab2 route to see Three.js chunk.

**Option B — Webpack analyzer (for CI/build verification):**
```bash
npm install @next/bundle-analyzer --cache /tmp/npm-cache-temp
```
```typescript
// next.config.ts — add bundle analyzer
import withBundleAnalyzer from '@next/bundle-analyzer';
const config = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})({
  transpilePackages: ['three'],
  images: { formats: ['image/webp'] },
});
export default config;
```
```bash
ANALYZE=true npm run build
```

### Anti-Patterns to Avoid
- **Fake progress timer** (existing `/lab` LoadingScreen pattern): Reports fabricated percentage, fails FOUND-03. Replace with `useProgress`.
- **Mounting Canvas on small viewports**: Wastes a WebGL context slot. Gate must prevent Canvas from rendering at all when `width < 1024`.
- **`'use client'` on layout.tsx**: Lab2Layout should remain async server component (same as `/lab/layout.tsx`) — only the page.tsx and components get `'use client'`.
- **`useProgress` outside Suspense**: The hook reads from `THREE.DefaultLoadingManager`. If no Suspense wraps asset loading, progress may not update. Phase 6 has empty scene, so confirm this pattern works before Phase 8 adds real assets.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Asset load progress | Custom fetch progress tracking | `useProgress` from `@react-three/drei` | Hooks into `THREE.DefaultLoadingManager` automatically — tracks all useLoader/useGLTF calls |
| WebGL cleanup on unmount | Custom `useEffect(() => { gl.dispose(); }, [])` | Nothing — R3F Canvas handles it automatically | R3F already calls `forceContextLoss()` + `dispose()` on Canvas unmount |
| i18n route setup | Custom locale detection | `setRequestLocale` + `generateStaticParams` from next-intl | Existing pattern in `/lab/layout.tsx` — copy verbatim |
| Viewport width hook | Complex ResizeObserver setup | Simple `window.addEventListener('resize', ...)` in `useEffect` | Sufficient for this use case; no library needed |
| Bundle analysis | Custom webpack stats parsing | `npx next experimental-analyze` or `@next/bundle-analyzer` | Both are official tools that parse module graphs |

**Key insight:** The existing `/lab` codebase already demonstrates the correct patterns. Most of Phase 6 is creating parallel files that follow the exact same structure.

---

## Common Pitfalls

### Pitfall 1: Fake Progress vs Real Progress
**What goes wrong:** The existing `/lab/ui/LoadingScreen.tsx` uses a fake random interval timer (not real asset progress). Copying it to /lab2 fails FOUND-03.
**Why it happens:** Fake timer was added as a placeholder — looks fine but doesn't track actual asset loads.
**How to avoid:** Use `useProgress` from drei. The component must be inside or alongside a `<Suspense>` boundary wrapping asset-loading R3F children.
**Warning signs:** Progress always reaches 100% in the same time regardless of asset count.

### Pitfall 2: Hydration Mismatch from Window Check
**What goes wrong:** `window.innerWidth` accessed during SSR throws or causes hydration mismatch.
**Why it happens:** `window` is not available on server — accessing it directly outside `useEffect` throws.
**How to avoid:** Initialize `useViewportWidth` state as `null`, only set actual value in `useEffect`. While `null`, render nothing or a neutral placeholder (not the gate, not the canvas).
**Warning signs:** `ReferenceError: window is not defined` in server logs; React hydration warnings.

### Pitfall 3: Canvas Stays Mounted During Route Change
**What goes wrong:** WebGL contexts accumulate on repeated /lab2 ↔ / navigation, eventually showing "Context Lost" or blank canvas.
**Why it happens:** If Canvas is rendered outside the page component (e.g., in a persistent layout), it doesn't unmount on route change.
**How to avoid:** Keep `<Lab2Scene>` (Canvas wrapper) rendered only inside `lab2/page.tsx`, not in `lab2/layout.tsx` or a shared global layout.
**Warning signs:** "Too many active WebGL contexts" in browser console; canvas goes black after 8+ navigations.

### Pitfall 4: transpilePackages Missing
**What goes wrong:** Build fails with ESM import errors from `three` or `@react-three/fiber`.
**Why it happens:** Three.js ecosystem uses ESM that Next.js doesn't transpile by default.
**How to avoid:** Ensure `transpilePackages: ['three']` is in `next.config.ts`. (Current `next.config.ts` does NOT have this — must add it.)
**Warning signs:** Build errors like "SyntaxError: Cannot use import statement in a module" or "Unexpected token 'export'".

### Pitfall 5: Turbopack Dev vs Webpack Build
**What goes wrong:** `/lab2` works in `npm run dev` (Turbopack) but fails in `npm run build` (Webpack) due to different bundling behavior.
**Why it happens:** Turbopack and Webpack handle ESM packages differently. Also, GLSL shader strings embedded via template literals work in both — but if `.glsl` file imports were used, Turbopack needs loader config.
**How to avoid:** Phase 6 avoids `.glsl` file imports (per STATE.md blocker note — Turbopack GLSL compatibility unverified). Use inline template literals for any future shaders.
**Warning signs:** Build succeeds but dynamic import chunks are malformed; Three.js included in main bundle.

### Pitfall 6: useProgress Always Returning 0
**What goes wrong:** `useProgress` reports 0% even when assets are loading.
**Why it happens:** Known issue when assets are cached (browser cache), loaded as blobs, or when no actual Three.js loaders are used (empty scene). Also requires `<Preload all />` or explicit `useLoader` calls to trigger `DefaultLoadingManager`.
**How to avoid:** For Phase 6 (empty scene), this is acceptable — add `<Preload all />` inside Suspense boundary. Real progress tracking matters in Phase 8 when assets load.
**Warning signs:** Progress jumps from 0 to 100 instantly (expected for empty scene); stays at 0 forever (problem — check Suspense boundary placement).

---

## Code Examples

### /lab2 Page Entry (complete pattern)
```typescript
// src/app/[locale]/lab2/page.tsx
// Pattern verified against existing /lab/page.tsx
'use client';

import dynamic from 'next/dynamic';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import useViewportWidth from '@/components/lab2/hooks/useViewportWidth';
import ViewportGate from '@/components/lab2/ui/ViewportGate';

const Lab2Scene = dynamic(() => import('@/components/lab2/Lab2Scene'), {
  ssr: false,
});

export default function Lab2Page() {
  const t = useTranslations('Lab2');
  const width = useViewportWidth();

  // null = SSR / not yet hydrated — render nothing until we know width
  if (width === null) return null;

  // Viewport gate for screens < 1024px
  if (width < 1024) {
    return <ViewportGate />;
  }

  return (
    <div className="fixed inset-0 z-[60] bg-neutral-950">
      <Lab2Scene />
      {/* Fixed back link — always visible */}
      <Link
        href="/"
        className="fixed top-6 left-6 z-[80] flex items-center gap-2 px-4 py-2
          rounded-full bg-white/10 backdrop-blur-md text-white/80
          hover:text-white hover:bg-white/20 transition-all text-sm"
      >
        {t('backToHome')}
      </Link>
    </div>
  );
}
```

### Lab2Scene (Canvas root)
```typescript
// src/components/lab2/Lab2Scene.tsx
'use client';

import {Canvas} from '@react-three/fiber';
import {Suspense} from '@react-three/fiber';  // or React.Suspense
import {Preload} from '@react-three/drei';
import LoadingScreen from './ui/LoadingScreen';
import EmptyScene from './EmptyScene';

export default function Lab2Scene() {
  return (
    <>
      <LoadingScreen />
      <Canvas
        camera={{fov: 50, position: [0, 2, 5], near: 0.01, far: 100}}
        gl={{antialias: true, alpha: false}}
        dpr={[1, 1.5]}
      >
        <color attach="background" args={['#080808']} />
        <Suspense fallback={null}>
          <EmptyScene />
          <Preload all />
        </Suspense>
      </Canvas>
    </>
  );
}
```

### useProgress-based LoadingScreen
```typescript
// src/components/lab2/ui/LoadingScreen.tsx
// Source: https://drei.docs.pmnd.rs/loaders/progress-use-progress
'use client';

import {useProgress} from '@react-three/drei';
import {useState, useEffect} from 'react';

export default function LoadingScreen() {
  const {progress, active} = useProgress();
  const [visible, setVisible] = useState(true);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    if (!active && progress >= 99) {
      // Begin fade out
      setOpacity(0);
      const timer = setTimeout(() => setVisible(false), 600);
      return () => clearTimeout(timer);
    }
  }, [active, progress]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-neutral-950 flex items-center justify-center"
      style={{opacity, transition: 'opacity 0.6s ease'}}
    >
      <span className="text-white/60 font-light tabular-nums"
            style={{fontSize: 'clamp(4rem, 10vw, 8rem)'}}>
        {Math.round(progress)}
      </span>
    </div>
  );
}
```

### ViewportGate Component
```typescript
// src/components/lab2/ui/ViewportGate.tsx
'use client';

import {Link} from '@/i18n/navigation';
import {useTranslations} from 'next-intl';

export default function ViewportGate() {
  const t = useTranslations('Lab2');
  return (
    <div className="fixed inset-0 bg-neutral-950 flex flex-col items-center justify-center gap-6 text-center px-6">
      <p className="text-white/60 text-lg">
        {t('viewportGate')}
      </p>
      <Link
        href="/"
        className="text-white/40 hover:text-white/80 text-sm transition-colors underline underline-offset-4"
      >
        {t('backToHome')}
      </Link>
    </div>
  );
}
```

### next.config.ts — Add transpilePackages
```typescript
// next.config.ts — MUST add transpilePackages: ['three']
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

export default withNextIntl({
  transpilePackages: ['three'],  // ADD THIS
  images: {
    formats: ['image/webp'],
  },
});
```

### Header — Add lab2 navigation link
```typescript
// In Header.tsx — add alongside existing /lab link
// Claude's discretion for label name — suggest "Studio" or "Lab 2" to distinguish
<Link
  href="/lab2"
  className="rounded-lg p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800
    transition-colors text-neutral-600 dark:text-neutral-400
    hover:text-neutral-900 dark:hover:text-neutral-100"
  title={t('lab2')}
>
  {/* Icon or label — at Claude's discretion */}
</Link>
```

### i18n messages — Required new keys
```json
// messages/ko.json — add Lab2 namespace
"Lab2": {
  "backToHome": "홈으로",
  "viewportGate": "이 경험은 데스크톱에서 보세요",
  "loading": "로딩 중"
},
"Navigation": {
  // ... existing keys ...
  "lab2": "Studio"  // label at Claude's discretion
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `next-transpile-modules` package | `transpilePackages` in `next.config.js` | Next.js 13.1 | No extra package needed |
| `experimental.turbo` config key | `turbopack` config key | Next.js 15.3.0 | Existing `next.config.ts` may not need this |
| R3F v8 (React 18) | R3F v9 (React 19) | 2024 | Project already has v9 — no change |
| `@next/bundle-analyzer` only | `npx next experimental-analyze` (Turbopack-native) | Next.js 16.1 | Turbopack analyzer available without install |
| Custom WebGL cleanup in useEffect | R3F handles forceContextLoss automatically | R3F ~v7+ | Don't add manual gl cleanup — it's redundant |

**Deprecated/outdated:**
- `fakeProgress` loading timer pattern (existing `/lab`): Only acceptable as placeholder; FOUND-03 requires real `useProgress`.
- `experimental.turbo` in next.config: Renamed to `turbopack` in Next.js 15.3.

---

## Open Questions

1. **transpilePackages currently missing**
   - What we know: Current `next.config.ts` does NOT include `transpilePackages: ['three']`, yet `/lab` works in dev.
   - What's unclear: Does Turbopack (`npm run dev`) handle Three.js ESM without transpilePackages? Does `npm run build` (webpack) fail without it?
   - Recommendation: Add `transpilePackages: ['three']` proactively — it's low-risk and prevents a potential build-time failure. Verify with `npm run build` as part of this phase.

2. **useProgress behavior with empty scene**
   - What we know: `useProgress` wraps `THREE.DefaultLoadingManager`; with no assets to load, progress may jump 0→100 immediately.
   - What's unclear: Will the fade-out transition still be visible (even if brief) for UX purposes?
   - Recommendation: Add a minimum display time (`min(progress_time, 800ms)`) for the loading screen to ensure the percentage display is briefly visible even when no real assets are loading.

3. **Lab2 navigation label in Header**
   - What we know: User left label name to Claude's discretion; must be distinct from existing "Lab" link.
   - What's unclear: Whether to use an icon (like existing FlaskConical) or text label.
   - Recommendation: Use text label "Studio" with a different icon (e.g., `Box` or `Layers` from lucide-react). This clearly differentiates the two experiences.

---

## Validation Architecture

> `workflow.nyquist_validation` is not set in `.planning/config.json` — skipping this section.

---

## Sources

### Primary (HIGH confidence)
- Existing codebase `/src/app/[locale]/lab/` — verified working pattern for i18n + R3F + dynamic import
- `https://drei.docs.pmnd.rs/loaders/progress-use-progress` — official useProgress docs (fetched)
- `https://r3f.docs.pmnd.rs/api/hooks` — official useThree/useFrame hooks (fetched)
- `https://nextjs.org/docs/app/guides/package-bundling` — official Next.js 16.1.6 bundle analyzer docs (fetched, dated 2026-02-24)
- `https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack` — official Turbopack config docs (fetched, dated 2026-02-24)
- `package.json` — verified installed versions

### Secondary (MEDIUM confidence)
- WebSearch: R3F `forceContextLoss` + `dispose` on Canvas unmount — multiple GitHub discussions confirm R3F handles this automatically
- WebSearch: `transpilePackages: ['three']` requirement — confirmed by R3F official install docs + community threads
- WebSearch: `useProgress` with Suspense pattern — confirmed by drei docs + multiple code examples

### Tertiary (LOW confidence)
- WebSearch: Turbopack GLSL import limitations — limited specific 2025 data; STATE.md blocker note recommends avoiding `.glsl` file imports; inline template literals are the safe path

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all packages already installed and verified in `/lab`
- Architecture: HIGH — mirrors verified `/lab` patterns with documented modifications
- Pitfalls: HIGH — WebGL context issues extensively documented in R3F GitHub; viewport gate is straightforward React; fake progress is observable in existing code

**Research date:** 2026-02-28
**Valid until:** 2026-04-30 (stable libraries, low churn risk for these APIs)
