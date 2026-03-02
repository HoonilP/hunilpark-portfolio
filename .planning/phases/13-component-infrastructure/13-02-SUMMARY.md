---
phase: 13-component-infrastructure
plan: 02
subsystem: ui
tags: [next-intl, i18n, react, server-component, challenges]

# Dependency graph
requires:
  - phase: 13-01
    provides: CodeBlock server component (available for Phase 14 optional wiring)
provides:
  - ChallengeSection.tsx server component rendering five-part engineering challenge narrative
  - ProjectContent.tsx rewritten to use challenges schema with CHALLENGE_KEYS loop
  - ko.json and en.json migrated from implementation+troubleshooting to challenges schema for all 6 projects
affects: [14-content-authoring, future-project-detail-pages]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - CHALLENGE_KEYS constant array with t.has() guard for flexible 1-3 challenge rendering
    - ChallengeSection receives t function as prop (passed from parent server component)
    - Five-part narrative flow: context -> alternatives -> decision -> implementation -> outcome
    - Stub content pattern in i18n JSON with Phase 14 replacement markers

key-files:
  created:
    - src/components/projects/ChallengeSection.tsx
  modified:
    - src/components/projects/ProjectContent.tsx
    - messages/ko.json
    - messages/en.json

key-decisions:
  - "ChallengeSection receives t as prop (not calling getTranslations internally) — parent owns translation context"
  - "No sub-field labels rendered as headings — five-part flow is implicit from content structure (Phase 14 content will use natural narrative transitions)"
  - "CodeBlock not wired in this phase — ChallengeSection is text-only; Phase 14 may add optional code snippet rendering"
  - "CHALLENGE_KEYS limited to challenge1~3 — Phase 14 can expand if needed"

patterns-established:
  - "Challenge component pattern: translationKey + challengeKey + t prop — no internal async calls"
  - "t.has() guard pattern before rendering optional sections — zero empty sections in any locale"

requirements-completed: [STRC-01, STRC-02, STRC-03, STRC-06]

# Metrics
duration: 2min
completed: 2026-03-02
---

# Phase 13 Plan 02: i18n Schema Migration and ChallengeSection Component Summary

**Migrated all 6 project translations from implementation+troubleshooting to five-part Engineering Challenges schema, with ChallengeSection server component and rewritten ProjectContent rendering challenge narratives**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-02T04:55:31Z
- **Completed:** 2026-03-02T04:56:40Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- Migrated ko.json and en.json for all 6 projects (joshua, dyCms, retailAnalysis, scholarlyChain, dinoGo, artWar) — removed implementation and troubleshooting keys, added challenges with challenge1 stub
- Created ChallengeSection.tsx — renders one challenge with five-part narrative (context, alternatives, decision, implementation, outcome) using border-left visual styling
- Rewrote ProjectContent.tsx — replaced Implementation + Troubleshooting sections with Engineering Challenges section using CHALLENGE_KEYS loop and t.has() guards
- next build passes with all 6 project routes generating static HTML in both /ko and /en locales

## Task Commits

Each task was committed atomically:

1. **Task 1: Migrate i18n JSON schemas** - `3f702a9` (feat)
2. **Task 2: Create ChallengeSection and rewrite ProjectContent** - `b0ef4b7` (feat)

## Files Created/Modified

- `src/components/projects/ChallengeSection.tsx` - Server component rendering one engineering challenge with 5-part narrative
- `src/components/projects/ProjectContent.tsx` - Rewritten to use challenges schema with CHALLENGE_KEYS loop, removed implementation+troubleshooting JSX
- `messages/ko.json` - All 6 projects migrated to challenges schema (Korean)
- `messages/en.json` - All 6 projects migrated to challenges schema (English)

## Decisions Made

- ChallengeSection receives `t` as a prop from its parent rather than calling `getTranslations` internally — parent server component owns the translation context and passes it down, avoiding redundant async calls.
- Sub-field labels (context/alternatives/etc.) are not rendered as visual headings — the five-part narrative flow is implicit from content. Phase 14 will author content using natural transitions.
- CodeBlock import intentionally omitted from ChallengeSection this phase — text-only rendering is sufficient for stub content. Phase 14 may add optional code snippet support.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- i18n schema is ready for Phase 14 content authoring — all 6 projects have challenges.challenge1 stub that Phase 14 will replace with real engineering narratives
- ChallengeSection accepts up to 3 challenges per project via CHALLENGE_KEYS; Phase 14 can add challenge2, challenge3 to JSON as needed
- CodeBlock component from Phase 13-01 is available for Phase 14 to wire into ChallengeSection for code-heavy challenge content

---
*Phase: 13-component-infrastructure*
*Completed: 2026-03-02*
