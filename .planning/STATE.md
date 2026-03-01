---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: Interactive Portfolio
status: unknown
last_updated: "2026-03-01T04:17:20.998Z"
progress:
  total_phases: 8
  completed_phases: 8
  total_plans: 17
  completed_plans: 17
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-28)

**Core value:** 프론트엔드 개발 역량을 깔끔하고 정교한 디자인으로 보여주는 포트폴리오 사이트 — 채용 담당자가 빠르게 핵심 역량과 프로젝트를 파악할 수 있어야 한다.
**Current focus:** v3.0 Interactive Portfolio — Phase 8: 3D Scenes

## Current Position

Phase: 8 of 11 (3D Scenes)
Plan: 1 of 2 complete
Status: In Progress
Last activity: 2026-03-01 — Phase 8 Plan 01 complete: SceneManager visibility-toggle architecture, ParticleField ambient particles, TexturePlane reusable component, chapters.ts extended with projectId/translationKey

Progress: [█░░░░░░░░░] ~5% (v3.0)

## Performance Metrics

**Velocity:**
- Total plans completed: 11 (v1.0: 9, v2.0: 2)
- v2.0 average duration: 6 min/plan
- v2.0 total execution time: 12 min

**By Milestone:**

| Milestone | Phases | Plans | Status |
|-----------|--------|-------|--------|
| v1.0 Portfolio MVP | 1-4 | 9 | Shipped 2026-02-12 |
| v2.0 Content Expansion | 5 | 2 | Shipped 2026-02-13 |
| v3.0 Interactive Portfolio | 6-11 | TBD | In progress |

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- [v3.0 init]: /lab2 별도 라우트 — 기존 메인 사이트 보존하면서 새 인터랙티브 경험 추가
- [v3.0 init]: 데스크톱 전용 — 3D 성능 고려, 뷰포트 1024px 미만 게이트
- [v3.0 init]: 단일 Canvas 생존 패턴 — 절대 조건부 렌더링 금지, route exit 시 dispose
- [v3.0 init]: 스크롤 권한 단일화 — Lenis 단독 사용, GSAP ScrollControls 혼용 금지
- [v3.0 init]: 애니메이션 값은 useRef, 이산 이벤트만 useState
- [06-01]: useProgress (drei) for loading screen — avoids fake timer, shows real progress percentage
- [06-01]: useViewportWidth returns null on server — prevents hydration mismatch on viewport gate
- [06-01]: 800ms minimum loading screen display — ensures percentage briefly visible with empty scene
- [06-01]: LoadingScreen shows number only, no label text — minimal aesthetic per plan
- [Phase 06-02]: Box icon chosen for /lab2 nav link — 3D spatial concept, distinct from FlaskConical
- [Phase 06-02]: Three.js confirmed bundle-isolated: 864K chunk not in main page, only on-demand for /lab2
- [07-01]: autoRaf:false in LenisProvider — R3F addEffect drives Lenis RAF to prevent dual-loop 40fps drops
- [07-01]: useRef for scroll progress — animation values never trigger React re-renders (STATE.md principle)
- [07-01]: CHAPTERS.length as sole source of truth — CHAPTER_COUNT/STEP/helpers all derived, no magic numbers
- [07-01]: Scroll spacer in document flow + fixed Canvas overlay pattern — Lenis needs DOM height to traverse
- [07-02]: LERP_FACTOR 0.05 at module level — camera lag stacks on Lenis inertia for cinematic combined effect
- [07-02]: Separate currentLookAt ref for camera.lookAt — prevents snapping when lookAt is un-lerped
- [07-02]: LoadingScreen auto-dismiss when total === 0 — empty scene never triggers useProgress completion
- [08-01]: bufferAttribute in R3F 9.5.0 requires args=[array, itemSize] constructor pattern — plain array/count/itemSize props cause TS2741 error
- [08-01]: SceneManager groups positioned at lookAt focal centers (not camera positions) so scene content is centered in frame
- [08-01]: ParticleField z-range 5 to -35 covers full camera path from chapter 0 (z=5) through chapter 5 (lookAt z=-29)
- [Phase 08-3d-scenes]: Scene component positions use relative offsets from (0,0,0) — parent SceneManager group provides world position from chapters.ts waypoints
- [Phase 08-3d-scenes]: useTexture.preload() called at module level so texture loading begins when JS parses the module, before Suspense activates

### Pending Todos

None.

### Blockers/Concerns

- [Phase 6]: Turbopack GLSL import 호환성 미검증 — inline template literal 사용으로 회피 예정
- [Phase 11]: 한국 오피스 환경 (Intel Iris/AMD Vega 통합 GPU) 성능 미검증 — Phase 11 시작 전 타겟 하드웨어 테스트 필요

## Session Continuity

Last session: 2026-03-01
Stopped at: 08-02-PLAN.md Task 3 checkpoint — awaiting human visual verification of IntroScene + 5 ProjectScene components in browser
Resume file: None
