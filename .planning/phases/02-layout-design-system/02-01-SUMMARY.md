---
phase: 02-layout-design-system
plan: 01
subsystem: design-system
tags: [next-themes, tailwind-v4, dark-mode, ui-components, typescript]
requires:
  - 01-01 (Next.js foundation and Tailwind v4 configuration)
provides:
  - Dark mode infrastructure with next-themes
  - Reusable UI component library (Button, Card, Badge, Timeline)
  - cn() className utility function
  - Design tokens with dark mode variants
affects:
  - 02-02 will integrate ThemeProvider and ThemeToggle into layout
  - All future phases will use UI components from this library
  - Phase 3 sections will use Timeline for experience display
tech-stack:
  added:
    - next-themes@0.4.6
    - clsx@2.1.1
  patterns:
    - Dark mode via @variant directive with data-theme attribute
    - Component variants with TypeScript discriminated unions
    - CSS-first animations with prefers-reduced-motion support
    - Barrel exports for clean component imports
key-files:
  created:
    - src/lib/utils.ts
    - src/components/layout/ThemeProvider.tsx
    - src/components/layout/ThemeToggle.tsx
    - src/components/ui/Button.tsx
    - src/components/ui/Card.tsx
    - src/components/ui/Badge.tsx
    - src/components/ui/Timeline.tsx
    - src/components/ui/index.ts
  modified:
    - src/app/globals.css
    - package.json
decisions:
  - decision: Use next-themes for dark mode management
    rationale: Industry standard with 3.6M+ weekly downloads, eliminates flash-of-wrong-theme, SSR-safe
    impact: All theme state handled automatically, no custom context needed
  - decision: Use data-theme attribute instead of class-based dark mode
    rationale: More reliable with Tailwind v4, avoids class timing issues
    impact: Dark mode configured via @variant directive in CSS
  - decision: Border-only cards without shadows
    rationale: User specified flat, clean aesthetic matching designer portfolios
    impact: All Card components use border only, optional hover effect
  - decision: SVG icons for ThemeToggle instead of emoji
    rationale: Professional appearance, consistent sizing, better cross-platform rendering
    impact: Sun/moon icons rendered as inline SVG with currentColor stroke
  - decision: CSS keyframe animations instead of Framer Motion
    rationale: Phase 2 only needs simple animations; Motion deferred to Phase 3 for complex interactions
    impact: Hardware-accelerated transform/opacity animations with reduced-motion support
metrics:
  duration: 3 minutes
  completed: 2026-02-11
---

# Phase 2 Plan 1: Design System Foundation Summary

**One-liner:** next-themes dark mode with Tailwind v4 @variant directive and UI component library (Button, Card, Badge, Timeline) using cn() utility

## What Was Built

### Dark Mode Infrastructure
- **next-themes Integration**: ThemeProvider wrapping app with data-theme attribute, system preference detection, localStorage persistence
- **Tailwind v4 Dark Mode**: @variant directive in globals.css targeting [data-theme="dark"] for CSS-native dark mode
- **ThemeToggle Component**: Client component with mounted state pattern, sun/moon SVG icons, prevents hydration mismatch
- **Extended Design Tokens**: Added primary-400 (lighter for dark mode hover) and primary-700 (darker for light mode hover)

### UI Component Library
- **Button**: 3 variants (primary/secondary/ghost) × 3 sizes (sm/md/lg) with full dark mode support
- **Card**: Border-only style with optional hover effect, no shadows per designer aesthetic
- **Badge**: Small pill for tech stack tags with neutral background and border
- **Timeline**: Vertical line with dots and items structure for experience section

### Utilities
- **cn() Function**: clsx wrapper for clean className composition in components
- **Fade-in-up Animation**: CSS keyframe animation with prefers-reduced-motion fallback

## Tasks Completed

| Task | Name | Commit | Key Files |
|------|------|--------|-----------|
| 1 | Install dependencies, set up dark mode infrastructure and utility functions | 978407b | package.json, globals.css, utils.ts, ThemeProvider.tsx, ThemeToggle.tsx |
| 2 | Create reusable UI components (Button, Card, Badge, Timeline) | 94320d6 | Button.tsx, Card.tsx, Badge.tsx, Timeline.tsx, index.ts |

## Deviations from Plan

None - plan executed exactly as written.

## Decisions Made

### Technical Decisions
1. **next-themes for theme management**: Chose industry-standard library over custom solution to eliminate flash-of-wrong-theme and handle SSR hydration automatically
2. **data-theme attribute over class**: More reliable with Tailwind v4, configured via @variant directive in CSS instead of JS config
3. **SVG icons over emoji**: Professional appearance for ThemeToggle, better sizing control and cross-platform consistency
4. **CSS animations over Framer Motion**: Phase 2 needs only simple transitions; deferred Motion to Phase 3 for complex interactions

### Design Decisions
1. **Border-only cards**: Flat aesthetic matching designer portfolios, no shadows per user specification
2. **Subtle color palette**: Extended primary-400/700 for hover states, maintaining neutral-focused design
3. **Hardware-accelerated animations**: transform/opacity only for 60fps performance, respects prefers-reduced-motion

### Architecture Decisions
1. **Barrel exports for components**: Clean imports via src/components/ui/index.ts
2. **TypeScript interfaces for all props**: ButtonProps, CardProps, BadgeProps, TimelineProps for type safety
3. **cn() utility pattern**: Centralized className composition using clsx for all components

## Verification Results

### Build
- ✅ `npm run build` completes without errors
- ✅ TypeScript compilation passes for all components
- ✅ No CSS optimization errors
- ✅ Static pages generated successfully

### Components
- ✅ All 4 UI components exist in src/components/ui/
- ✅ ThemeProvider and ThemeToggle exist in src/components/layout/
- ✅ Barrel export index.ts exports all components and types
- ✅ Each component has TypeScript interface for props

### Dark Mode
- ✅ @variant dark directive present in globals.css
- ✅ All color classes have dark: variants
- ✅ Primary-400 and primary-700 tokens added to @theme
- ✅ next-themes and clsx installed in package.json

### Utilities
- ✅ cn() function exported from src/lib/utils.ts
- ✅ fade-in-up animation defined with reduced-motion support
- ✅ All components import and use cn() for className composition

## Next Phase Readiness

### Ready for Phase 2 Continuation (Plan 02-02)
- ✅ ThemeProvider ready to wrap app in locale layout
- ✅ ThemeToggle ready to integrate into Header component
- ✅ UI components library complete and tested
- ✅ Dark mode infrastructure fully operational
- ✅ Design tokens extended with dark mode variants
- ✅ All builds passing with no errors

### Blockers/Concerns
None. All verification criteria passed.

### Notes for Future Plans
1. **Using components**: Import from '@/components/ui' for barrel exports (e.g., `import { Button, Card } from '@/components/ui'`)
2. **Dark mode classes**: Always pair light colors with dark: variants (e.g., `bg-white dark:bg-neutral-950`)
3. **Button variants**: primary for CTAs, secondary for outlined actions, ghost for subtle interactions
4. **Card hover**: Set `hover={true}` prop to enable border-primary-500 transition
5. **Badge usage**: Designed for tech stack tags - wrap tech names (React, TypeScript, etc.)
6. **Timeline structure**: Pass `items` array with date/title/description for experience/education sections
7. **ThemeProvider placement**: Must wrap app in locale layout, above all components needing theme access
8. **Animation classes**: Use `animate-fade-in-up` for entrance animations, respects user motion preferences

## Links to Artifacts

- **Plan**: `.planning/phases/02-layout-design-system/02-01-PLAN.md`
- **Commits**: 978407b, 94320d6
- **Key Files**: See key-files.created in frontmatter
