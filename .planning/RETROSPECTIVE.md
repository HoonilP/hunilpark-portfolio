# Project Retrospective

*A living document updated after each milestone. Lessons feed forward into future planning.*

## Milestone: v4.0 — Project Detail Enhancement

**Shipped:** 2026-03-02
**Phases:** 3 | **Plans:** 6

### What Was Built
- Lab2 코드, 라우트, 번역키, lenis 패키지 완전 삭제 (클린 빌드 확보)
- Shiki 기반 CodeBlock 서버 컴포넌트 + 다크모드 CSS 변수 자동 전환
- ChallengeSection 5-part narrative RSC (context → alternatives → decision → implementation → outcome)
- i18n 스키마 마이그레이션: implementation+troubleshooting → challenges 구조
- 6개 프로젝트 13개 양언어 엔지니어링 챌린지 (대안 분석 + 정량적 성과 포함)

### What Worked
- 3-phase 분리 (cleanup → infra → content)가 깔끔한 의존성 체인을 만듬
- Verification → gap closure → re-verification 루프가 CodeBlock 고아 컴포넌트를 잡아냄 (13-03 자동 생성)
- t.has() 가드 패턴으로 옵셔널 i18n 필드를 유연하게 처리
- 전체 마일스톤이 하루 만에 완료 (35 commits)

### What Was Inefficient
- Phase 12 UAT가 pending 상태로 남음 — 자동화 검증으로 충분했지만 문서 갭
- Phase 13 초기 검증에서 CodeBlock 미연결 발견 → 13-03 추가 플랜 필요 (사전에 방지 가능했음)
- SUMMARY one_liner 필드가 null — frontmatter 포맷 불일치로 자동 추출 실패

### Patterns Established
- Shiki singleton pattern: module-level Promise cache로 request당 재초기화 방지
- CSS variable dark mode: `[data-theme='dark'] .shiki` 셀렉터로 JS 번들 없이 테마 전환
- t.has() guard pattern: 옵셔널 i18n 필드 존재 여부에 따른 조건부 렌더링
- 5-part engineering challenge narrative: context → alternatives → decision → implementation → outcome

### Key Lessons
1. 컴포넌트 생성 시 반드시 consumer를 같은 플랜에서 연결해야 함 — 별도 CodeBlock 생성 후 미연결 상태 발생
2. i18n 스키마 변경과 컴포넌트 변경을 원자적으로 수행하면 중간 빌드 실패 방지
3. 정량적 수치 requirement는 검증 자동화가 쉬움 — regex로 outcome 필드 검증 성공

### Cost Observations
- Model mix: balanced profile (sonnet agents, opus orchestrator)
- Sessions: 1 session (full milestone in single day)
- Notable: 3 phases + 6 plans + audit + completion in single context window stretch

---

## Cross-Milestone Trends

### Process Evolution

| Milestone | Phases | Plans | Key Change |
|-----------|--------|-------|------------|
| v1.0 | 4 | 9 | Initial GSD setup, bilingual infrastructure |
| v2.0 | 1 | 2 | Content expansion, image optimization |
| v3.0 | 3 (of 6) | 6 | 3D/WebGL experiment, later archived |
| v4.0 | 3 | 6 | Content restructuring, verification-driven gap closure |

### Top Lessons (Verified Across Milestones)

1. Scope pruning is powerful — v3.0 cancelled 3 phases, v4.0 cleaned up the result
2. Verification-driven development catches integration gaps that planning misses
3. i18n key parity validation should be automated from the start
