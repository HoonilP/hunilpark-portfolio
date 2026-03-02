---
phase: 13-component-infrastructure
plan: 01
subsystem: ui
tags: [shiki, syntax-highlighting, server-components, dark-mode, css]

# Dependency graph
requires:
  - phase: 12-lab2-cleanup
    provides: Clean codebase without lab2, lenis removed, working build baseline
provides:
  - Shiki singleton highlighter factory at src/lib/shiki.ts
  - CodeBlock async RSC at src/components/projects/CodeBlock.tsx
  - Dark mode shiki CSS override in globals.css
affects:
  - 13-02 (i18n schema migration — CodeBlock will be used by project detail pages)
  - 14-content (engineering challenge code snippets will use CodeBlock)

# Tech tracking
tech-stack:
  added: [shiki@2.x]
  patterns:
    - Singleton highlighter using module-level Promise cache (prevents re-initialization per request)
    - Async RSC pattern for server-side syntax highlighting (no client JS needed)
    - Shiki dual-theme via `themes: { light, dark }` + `defaultColor: 'light'` with CSS variable override

key-files:
  created:
    - src/lib/shiki.ts
    - src/components/projects/CodeBlock.tsx
  modified:
    - src/app/globals.css
    - package.json

key-decisions:
  - "Use singleton Promise pattern for shiki highlighter — createHighlighter is expensive, must run once per server process"
  - "defaultColor: 'light' with CSS variable override for dark mode — avoids duplicating HTML, single DOM output"
  - "[data-theme='dark'] selector (not .dark class) — matches project's ThemeProvider attribute='data-theme' convention"
  - "No edge runtime — shiki requires Node.js, explicitly excluded edge runtime markers"

patterns-established:
  - "Singleton factory pattern: module-level Promise<T> | null variable with lazy initialization"
  - "Async RSC for compute-heavy server work: no 'use client', async function component"

requirements-completed: [STRC-04, STRC-05]

# Metrics
duration: 2min
completed: 2026-03-02
---

# Phase 13 Plan 01: Component Infrastructure Summary

**Shiki syntax highlighting infrastructure with singleton RSC highlighter, async CodeBlock component, and [data-theme='dark'] CSS override for dark mode toggling**

## Performance

- **Duration:** ~2 min
- **Started:** 2026-03-02T04:52:23Z
- **Completed:** 2026-03-02T04:53:29Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments
- Installed shiki package (45 packages added) with Node.js singleton factory
- Created CodeBlock async RSC supporting 9 languages with automatic dark mode via CSS variables
- Added `[data-theme='dark'] .shiki` CSS override aligned with project's existing ThemeProvider convention
- next build passes clean with shiki integrated

## Task Commits

Each task was committed atomically:

1. **Task 1: Install shiki and create singleton highlighter + CodeBlock component** - `aaf3e0c` (feat)
2. **Task 2: Add shiki dark mode CSS override to globals.css** - `c0d8a56` (feat)

## Files Created/Modified
- `src/lib/shiki.ts` - Singleton highlighter factory with cached Promise pattern, supports github-light/dark themes and 9 languages
- `src/components/projects/CodeBlock.tsx` - Async RSC that renders syntax-highlighted code as HTML via dangerouslySetInnerHTML
- `src/app/globals.css` - Added .shiki base styles and [data-theme='dark'] dark mode CSS variable override
- `package.json` / `package-lock.json` - shiki added to dependencies

## Decisions Made
- Singleton Promise pattern: `let highlighterPromise: Promise<Highlighter> | null = null` prevents expensive re-initialization on each request
- Used `defaultColor: 'light'` so shiki renders single HTML with CSS variable hooks (`--shiki-dark`, `--shiki-dark-bg`), override applied via `[data-theme='dark']` selector
- Explicitly not adding `export const runtime = 'edge'` — shiki bundles grammar files requiring Node.js filesystem access

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- CodeBlock component is ready for Phase 14 engineering challenge content
- Dark mode CSS is aligned with existing ThemeProvider convention
- No blockers — shiki singleton pattern prevents server-side performance issues

---
*Phase: 13-component-infrastructure*
*Completed: 2026-03-02*
