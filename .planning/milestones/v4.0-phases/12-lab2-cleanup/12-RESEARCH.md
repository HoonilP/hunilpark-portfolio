# Phase 12: Lab2 Cleanup - Research

**Researched:** 2026-03-02
**Domain:** Next.js route deletion, i18n key removal, npm package uninstall
**Confidence:** HIGH

## Summary

Phase 12 is a pure deletion/cleanup phase with no new code to write. The goal is to fully remove the `/lab2` experience from the codebase: its app route, all dedicated components, navigation links, i18n translation keys, and the `lenis` npm package that was exclusively used by lab2.

All affected files have been mapped through direct codebase inspection. The work is mechanical and well-bounded. The only risk area is accidentally removing GSAP or Three.js references that are still used by other parts of the site — this has been verified: `gsap` and `@gsap/react` are used in `HorizontalScrollWrapper.tsx`, and `@react-three/fiber`, `@react-three/drei`, and `three` are used in `/lab` (lab1). `lenis` is exclusively used within `src/components/lab2/` and has no callers outside that directory.

After deletion, `npm uninstall lenis` removes the package cleanly. The `Box` icon import from `lucide-react` in `Header.tsx` must also be cleaned up since it is only used for the lab2 nav link. The final gate is `next build` passing TypeScript-clean.

**Primary recommendation:** Delete files in the order: components → route → i18n keys → nav link → npm uninstall → verify build.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| CLEAN-01 | lab2 라우트 디렉토리(`/[locale]/lab2`)와 모든 lab2 전용 컴포넌트가 삭제된다 | Route: 2 files in `src/app/[locale]/lab2/` (layout.tsx, page.tsx). Components: 18 files under `src/components/lab2/` (full tree mapped below) |
| CLEAN-02 | lab2 관련 번역키(Lab2, Navigation.lab2)가 ko.json과 en.json에서 제거된다 | `messages/ko.json` and `messages/en.json`: top-level `Lab2` namespace + `Navigation.lab2` key |
| CLEAN-03 | 헤더 네비게이션에서 lab2 링크가 제거된다 | `src/components/layout/Header.tsx` lines 72-78: Link href="/lab2", `Box` icon, `t('lab2')` title |
| CLEAN-04 | lenis 패키지가 제거되고, 나머지 의존성(GSAP, Three.js 등)은 유지된다 | `lenis` is exclusively used in lab2 components. GSAP used in `HorizontalScrollWrapper.tsx`. Three.js/R3F used in `/lab`. Safe to `npm uninstall lenis` |
| CLEAN-05 | lab2 삭제 후 `next build`가 TypeScript 오류 없이 성공한다 | After all deletions, no remaining import chains reference lab2. `.next/` build cache should be cleared or rebuilt fresh |
</phase_requirements>

## Standard Stack

### Core
| Tool | Version | Purpose | Why Standard |
|------|---------|---------|--------------|
| Next.js App Router | 16.x | Route deletion is directory deletion | File-system routing — removing the directory removes the route |
| next-intl | 4.x | i18n key removal | JSON key deletion in messages files |
| npm | bundled | Package uninstall | `npm uninstall lenis --cache /tmp/npm-cache-temp` |

### Supporting
| Tool | Version | Purpose | When to Use |
|------|---------|---------|-------------|
| `next build` | 16.x | Verification gate | After all deletions to confirm TypeScript compiles clean |
| TypeScript | 5.9.x | Type checking | Build-time validation that no dangling imports remain |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Deleting files manually | Git `git rm -r` | Either works; manual deletion is simpler for this scope |

**Installation:**
```bash
# No new packages needed — this phase only removes a package
npm uninstall lenis --cache /tmp/npm-cache-temp
```

## Architecture Patterns

### Affected File Inventory (complete)

**Route files (2 files):**
```
src/app/[locale]/lab2/
├── layout.tsx    # setRequestLocale + generateStaticParams
└── page.tsx      # 'use client' — imports from @/components/lab2/*
```

**Component tree (18 files under src/components/lab2/):**
```
src/components/lab2/
├── Lab2Scene.tsx                    # Canvas + R3F root
├── EmptyScene.tsx
├── config/
│   └── chapters.ts                  # CHAPTER_COUNT constant
├── hooks/
│   ├── useScrollProgress.ts         # imports from 'lenis/react'
│   └── useViewportWidth.ts
├── scene/
│   ├── CameraRig.tsx
│   ├── ParticleField.tsx
│   ├── SceneManager.tsx
│   ├── chapters/
│   │   ├── IntroScene.tsx
│   │   ├── Project1Scene.tsx
│   │   ├── Project2Scene.tsx
│   │   ├── Project3Scene.tsx
│   │   ├── Project4Scene.tsx
│   │   └── Project5Scene.tsx
│   └── shared/
│       └── TexturePlane.tsx
└── ui/
    ├── LenisProvider.tsx            # imports from 'lenis/react' + 'lenis/dist/lenis.css'
    ├── LoadingScreen.tsx
    └── ViewportGate.tsx
```

**Navigation (1 file, partial edit):**
```
src/components/layout/Header.tsx     # Remove lines 72-78 (lab2 Link), clean Box import
```

**i18n messages (2 files, partial edit):**
```
messages/ko.json     # Remove top-level "Lab2" key + "Navigation.lab2" key
messages/en.json     # Remove top-level "Lab2" key + "Navigation.lab2" key
```

### Pattern 1: Next.js Route Deletion
**What:** Removing `src/app/[locale]/lab2/` directory eliminates `/ko/lab2` and `/en/lab2` routes automatically.
**When to use:** File-system routing — no router config changes needed.
**No redirects needed** — these routes simply return 404 after deletion, which is the desired behavior per success criterion 1.

### Pattern 2: Partial JSON Key Removal (i18n)
**What:** Remove specific keys from messages JSON without touching the rest.

**ko.json changes required:**
```json
// Remove top-level "Lab2" namespace:
"Lab2": {
  "backToHome": "홈으로",
  "viewportGate": "이 경험은 데스크톱 환경에 최적화되어 있습니다",
  "loading": "로딩 중"
}
// Remove from "Navigation":
"lab2": "Studio"
```

**en.json changes required:**
```json
// Remove top-level "Lab2" namespace:
"Lab2": {
  "backToHome": "Home",
  "viewportGate": "This experience is optimized for desktop",
  "loading": "Loading"
}
// Remove from "Navigation":
"lab2": "Studio"
```

### Pattern 3: Header Partial Edit
**What:** Remove lab2 Link block from `Header.tsx`. The `Box` icon import must also be removed since it is exclusively used for the lab2 link.

Current lines 5 and 72-78 in `src/components/layout/Header.tsx`:
```tsx
// Line 5 - import to clean:
import { FlaskConical, Box } from 'lucide-react';
// Becomes:
import { FlaskConical } from 'lucide-react';

// Lines 72-78 - block to delete entirely:
<Link
  href="/lab2"
  className="rounded-lg p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
  title={t('lab2')}
>
  <Box className="w-4 h-4" />
</Link>
```

### Anti-Patterns to Avoid
- **Deleting `gsap`, `@gsap/react` packages:** These are actively used in `src/components/HorizontalScrollWrapper.tsx` for the main page horizontal scroll animation. Do NOT touch them.
- **Deleting `@react-three/fiber`, `@react-three/drei`, `three`:** These are used in `/lab` (lab1) which must remain intact per requirements.
- **Forgetting the `Box` icon import cleanup:** After removing the lab2 Link, `Box` becomes an unused import. TypeScript strict mode + ESLint will flag this on build. Must remove from the import line.
- **Leaving Navigation.lab2 in JSON:** next-intl will not error on unused keys, but the success criterion explicitly requires their removal. Check both `Lab2` namespace AND `Navigation.lab2` subkey.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Route removal | Custom 404 redirect config | Just delete the directory | App Router is file-system based |
| Package removal | Manual `node_modules` deletion | `npm uninstall lenis` | Cleans package.json + lock file atomically |

**Key insight:** This is purely a deletion phase. The correct approach is to remove files and let Next.js + TypeScript build verification confirm correctness.

## Common Pitfalls

### Pitfall 1: Incomplete lenis removal
**What goes wrong:** `npm uninstall lenis` succeeds but TypeScript still has type errors because the component files importing from `'lenis/react'` still exist.
**Why it happens:** npm uninstall only removes the package; it doesn't delete source files.
**How to avoid:** Delete all component files FIRST, then uninstall the package. The uninstall is the final cleanup after source deletion.
**Warning signs:** `next build` reporting "Cannot find module 'lenis/react'"

### Pitfall 2: GSAP packages accidentally removed
**What goes wrong:** Developer assumes "remove lab2 = remove all animation packages" and also removes `gsap` / `@gsap/react`.
**Why it happens:** Lab2 was animation-heavy, easy to over-associate.
**How to avoid:** Before running any uninstall, confirm `grep -rn "from 'gsap'" src/` returns `src/components/HorizontalScrollWrapper.tsx`. Only uninstall `lenis`.
**Warning signs:** Main page horizontal scroll stops working after cleanup.

### Pitfall 3: Leaving orphaned `Box` import in Header.tsx
**What goes wrong:** `next build` fails with "unused variable" or ESLint error for `Box` from lucide-react.
**Why it happens:** Removing the lab2 Link block leaves the `Box` icon in the import statement.
**How to avoid:** Edit the import line on the same edit pass as the lab2 link block removal.
**Warning signs:** TypeScript/ESLint errors referencing Header.tsx.

### Pitfall 4: Stale `.next/` build cache
**What goes wrong:** `next build` appears to succeed but the old lab2 route artifacts are still present in `.next/`.
**Why it happens:** Turbopack/Next.js caching can retain artifacts from deleted routes.
**How to avoid:** The test for success is whether `/ko/lab2` returns 404 after build+start, not just whether build passes. Run `next build` from a clean state (the CI-like `next build` command handles this).
**Warning signs:** `.next/server/app/[locale]/lab2/` directory still exists after build.

## Code Examples

### npm uninstall with project cache setting
```bash
# Source: project memory — npm cache has permission issues, use temp cache
npm uninstall lenis --cache /tmp/npm-cache-temp
```

### JSON key removal pattern (ko.json)
```json
// BEFORE (Navigation section):
"Navigation": {
  "home": "홈",
  "about": "소개",
  "skills": "기술",
  "projects": "프로젝트",
  "experience": "경험",
  "education": "학력",
  "contact": "연락처",
  "lab": "Lab",
  "lab2": "Studio"   // <-- REMOVE THIS LINE
}

// AFTER:
"Navigation": {
  "home": "홈",
  "about": "소개",
  "skills": "기술",
  "projects": "프로젝트",
  "experience": "경험",
  "education": "학력",
  "contact": "연락처",
  "lab": "Lab"
}
// Also remove entire top-level "Lab2" object
```

### Verify GSAP safety before uninstall
```bash
# Run this BEFORE any package uninstall to confirm GSAP stays
grep -rn "from 'gsap'\|from '@gsap/react'" src/
# Expected output: src/components/HorizontalScrollWrapper.tsx (two lines)
# If output shows ONLY lab2 files, then gsap could also be removed — but that is NOT the case here
```

### Build verification sequence
```bash
next build
# Expected: no TypeScript errors, no missing module errors
# After build + start, curl or browser check:
# GET /ko/lab2 → 404
# GET /en/lab2 → 404
```

## State of the Art

| Old Approach | Current Approach | Notes |
|--------------|------------------|-------|
| Manual redirect rules for deleted routes | Directory deletion = automatic 404 | App Router file-system routing |
| Next.js Pages Router: needed `getStaticPaths` removal | App Router: just delete the folder | Simpler |

## Open Questions

1. **Build cache invalidation**
   - What we know: `.next/` contains compiled artifacts for lab2 route
   - What's unclear: Does `next build` always regenerate from scratch or use incremental cache?
   - Recommendation: Run `next build` (it rebuilds fully), then verify `.next/server/app/[locale]/lab2/` is gone. If not, `rm -rf .next` and rebuild.

2. **`next-intl` behavior with missing keys**
   - What we know: If any remaining code referenced `t('Lab2.backToHome')`, it would throw a missing key error
   - What's unclear: Are there any non-lab2 files that reference Lab2 namespace?
   - Recommendation: The grep scan confirmed only `src/app/[locale]/lab2/page.tsx` uses `useTranslations('Lab2')`. Once that file is deleted, no orphaned references remain.

## Validation Architecture

> `workflow.nyquist_validation` is not present in config.json — skipping this section.

## Sources

### Primary (HIGH confidence)
- Direct codebase inspection — all files listed were read or grepped from the live repo
- `package.json` — confirms `lenis: "^1.3.17"` present, `gsap`, `@gsap/react`, `three`, `@react-three/*` all present
- `src/components/layout/Header.tsx` — confirmed lab2 Link at lines 72-78, `Box` import at line 5
- `messages/ko.json`, `messages/en.json` — confirmed `Lab2` top-level namespace and `Navigation.lab2` key in both
- `grep -rn "lenis" src/` — confirmed lenis ONLY appears in `src/components/lab2/` files, nowhere else
- `grep -rn "from 'gsap'" src/` — confirmed GSAP used in `HorizontalScrollWrapper.tsx` (not lab2)

### Secondary (MEDIUM confidence)
- Project MEMORY.md: "npm cache has permission issues — use `--cache /tmp/npm-cache-temp`" — apply to uninstall command

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all tools are the project's existing stack, no new libraries
- Architecture: HIGH — every file was directly inspected; inventory is complete
- Pitfalls: HIGH — GSAP/lenis distinction verified via grep; Box icon issue confirmed via Header.tsx read

**Research date:** 2026-03-02
**Valid until:** 2026-04-01 (stable — deletion scope won't change unless new lab2 code is added)
