---
phase: 01-foundation
plan: 02
subsystem: ui
tags: [react, tailwind, i18n, responsive, language-toggle]

requires:
  - phase: 01-foundation-01
    provides: Next.js scaffold, Tailwind v4 tokens, next-intl infrastructure
provides:
  - LanguageToggle client component for locale switching
  - Responsive bilingual home page with mobile-first layout
  - Phase 1 foundation fully verified by user
affects:
  - Phase 2 layout components will wrap this page structure
  - LanguageToggle will move to header in Phase 2

tech-stack:
  added: []
  patterns:
    - Client component for interactive locale switching (useRouter.replace with locale option)
    - Server component with getTranslations for async content rendering
    - Mobile-first responsive design (unprefixed → sm: → lg: breakpoints)

key-files:
  created:
    - src/components/LanguageToggle.tsx
  modified:
    - src/app/[locale]/page.tsx
    - src/app/[locale]/layout.tsx
    - messages/ko.json
    - messages/en.json
    - src/proxy.ts (moved from project root to src/)

key-decisions:
  - "proxy.ts must be in src/ when using src directory layout"
  - "LanguageToggle is a client component using useRouter/usePathname from i18n/navigation"
  - "Server component pages use getTranslations (not useTranslations hook)"

metrics:
  duration: 8min
  completed: 2026-02-11
---

# Phase 1 Plan 2: Responsive Bilingual Home Page Summary

**LanguageToggle component with locale-switching router.replace, responsive landing page using Tailwind mobile-first breakpoints, human-verified**

## Performance

- **Duration:** 8 min
- **Started:** 2026-02-11T09:00:00Z
- **Completed:** 2026-02-11T09:08:00Z
- **Tasks:** 1 auto + 1 checkpoint (human-verify)
- **Files modified:** 6

## Accomplishments
- LanguageToggle client component switches between /ko and /en via useRouter.replace
- Responsive home page with mobile-first layout (text-3xl → sm:4xl → lg:5xl)
- Bilingual content rendering verified by user in both locales
- Pretendard font, neutral/primary color tokens visually applied
- Root URL (/) correctly redirects to /ko via proxy middleware

## Task Commits

1. **Task 1: Create language toggle and responsive home page** - `2d9c80a` (feat)
2. **Fix: Move proxy.ts to src/ for middleware routing** - `14c23f4` (fix)

## Files Created/Modified
- `src/components/LanguageToggle.tsx` - Client component for locale switching with useRouter
- `src/app/[locale]/page.tsx` - Responsive landing page with centered content, language toggle, footer
- `src/app/[locale]/layout.tsx` - Added bg-white, antialiased body styles
- `messages/ko.json` - Added comingSoon translation key
- `messages/en.json` - Added comingSoon translation key
- `src/proxy.ts` - Moved from root to src/, fixed import path

## Decisions Made
- **proxy.ts location**: Must be in src/ directory when project uses src/ layout (discovered during verification — root location caused 404)
- **LanguageToggle as client component**: Uses next-intl hooks (useLocale, useTranslations) and navigation (useRouter, usePathname) which require client-side rendering

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] proxy.ts in wrong location causing 404 on root URL**
- **Found during:** Checkpoint verification (user reported 404)
- **Issue:** proxy.ts was at project root but Next.js 16 with src/ directory expects it at src/proxy.ts
- **Fix:** Moved proxy.ts to src/proxy.ts, updated import path from './src/i18n/routing' to './i18n/routing'
- **Files modified:** src/proxy.ts (renamed from proxy.ts)
- **Verification:** Root URL returns 307 redirect to /ko, build succeeds
- **Committed in:** 14c23f4

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Essential fix for middleware routing. No scope creep.

## Issues Encountered
- Root URL returned 404 instead of redirecting to /ko — resolved by moving proxy.ts to src/ directory

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Phase 1 foundation complete and human-verified
- All success criteria met: bilingual routing, responsive layout, design system, language toggle
- Ready for Phase 2: Layout & Design System (header, footer, UI components)

### Notes for Future Plans
1. LanguageToggle will move into header component in Phase 2
2. Page structure (min-h-screen flex col) provides base for section-based layout
3. Translation files ready for additional content keys
4. proxy.ts is in src/ — all middleware config goes there

---
*Phase: 01-foundation*
*Completed: 2026-02-11*
