# Roadmap: 박훈일 프론트엔드 포트폴리오

## Milestones

- ✅ **v1.0 Portfolio MVP** - Phases 1-4 (shipped 2026-02-12)
- ✅ **v2.0 Content Expansion** - Phase 5 (shipped 2026-02-13)
- ✅ **v3.0 Interactive Portfolio** - Phases 6-11 (archived 2026-03-02)
- 🚧 **v4.0 Project Detail Enhancement** - Phases 12-14 (in progress)

## Phases

<details>
<summary>✅ v1.0 Portfolio MVP (Phases 1-4) - SHIPPED 2026-02-12</summary>

### Phase 1: Infrastructure
**Goal**: Next.js + Tailwind v4 + next-intl foundation running
**Plans**: Complete

### Phase 2: Design System
**Goal**: Reusable component library and dark mode working
**Plans**: Complete

### Phase 3: Main Page
**Goal**: All 7 sections live with bilingual content
**Plans**: Complete

### Phase 4: Project Detail Pages
**Goal**: 3 project case study pages live
**Plans**: Complete

</details>

<details>
<summary>✅ v2.0 Content Expansion (Phase 5) - SHIPPED 2026-02-13</summary>

### Phase 5: Content Expansion
**Goal**: 5 projects with real images live
**Plans**: Complete

</details>

<details>
<summary>✅ v3.0 Interactive Portfolio (Phases 6-11) - ARCHIVED 2026-03-02</summary>

### Phase 6: Foundation
**Goal**: /lab2 라우트 + WebGL 인프라 + 로딩 화면 + HUD 기반
**Plans**: Complete

### Phase 7: Scroll Spine
**Goal**: Lenis 스무스 스크롤 + 6-챕터 카메라 웨이포인트 시스템
**Plans**: Complete

### Phase 8: 3D Scenes
**Goal**: IntroScene + 5개 프로젝트 씬 + 파티클 필드 + 텍스처 플레인
**Plans**: Complete

### Phase 9: Content Overlay
**Goal**: HTML 오버레이 패널 + 한/영 콘텐츠 + 챕터 HUD
**Plans**: Cancelled (archived with milestone)

### Phase 10: Typography
**Goal**: GSAP SplitText 글자별 등장 + 스크롤 속도 반응 텍스트 셰이더
**Plans**: Cancelled (archived with milestone)

### Phase 11: Effects Polish
**Goal**: 블룸/필름 그레인/비네팅 + 엔트리 시퀀스 + 마우스 드리프트 + 커스텀 커서
**Plans**: Cancelled (archived with milestone)

</details>

### 🚧 v4.0 Project Detail Enhancement (Phases 12-14)

**Milestone Goal:** 프로젝트 상세 페이지를 "핵심 엔지니어링 챌린지" 중심으로 재구조화하여, 채용 담당자에게 프론트엔드 엔지니어로서의 문제 해결 능력과 기술적 깊이를 증명한다.

---

- [x] **Phase 12: Lab2 Cleanup** - lab2 라우트, 컴포넌트, 번역키, lenis 패키지를 빌드 에러 없이 완전 삭제 (completed 2026-03-02)
- [ ] **Phase 13: Component Infrastructure** - 엔지니어링 챌린지 i18n 스키마 마이그레이션 + 6개 서버 컴포넌트 구축
- [ ] **Phase 14: Content Authoring** - 6개 프로젝트 양언어 엔지니어링 챌린지 콘텐츠 작성

## Phase Details

### Phase 12: Lab2 Cleanup
**Goal**: lab2에 관련된 모든 코드, 라우트, 번역키, 패키지가 제거되고 `next build`가 에러 없이 통과한다
**Depends on**: Phase 11 (existing codebase)
**Requirements**: CLEAN-01, CLEAN-02, CLEAN-03, CLEAN-04, CLEAN-05
**Success Criteria** (what must be TRUE):
  1. /ko/lab2 와 /en/lab2 라우트가 404를 반환하고 접근할 수 없다
  2. 헤더 네비게이션에 lab2 링크가 없다
  3. ko.json과 en.json에서 Lab2 번역 네임스페이스가 사라졌다
  4. package.json에서 lenis 패키지가 제거되었고, gsap/three/@react-three/* 는 그대로다
  5. `next build`가 TypeScript 오류 없이 성공한다
**Plans**: 1 plan
- [ ] 12-01-PLAN.md — Delete lab2 files, navigation, translations, and uninstall lenis

### Phase 13: Component Infrastructure
**Goal**: 새 challenges/outcomes i18n 스키마와 6개 서버 컴포넌트가 구축되어, 6개 프로젝트 상세 페이지가 양 로케일에서 새 구조로 렌더링된다
**Depends on**: Phase 12
**Requirements**: STRC-01, STRC-02, STRC-03, STRC-04, STRC-05, STRC-06
**Success Criteria** (what must be TRUE):
  1. 프로젝트 상세 페이지에서 기존 Implementation/Troubleshooting 섹션 대신 Engineering Challenges 섹션이 렌더링된다
  2. 각 챌린지가 문제정의 → 시도한 접근법 → 비교/결정 → 구현 → 성과 순서로 표시된다
  3. 코드 블록이 구문 강조(shiki)로 렌더링되고 다크모드에서 테마가 자동 전환된다
  4. 6개 프로젝트 모두 /ko와 /en에서 빈 섹션 없이 정상 렌더링된다
  5. `next build`가 에러 없이 통과한다
**Plans**: TBD

### Phase 14: Content Authoring
**Goal**: 6개 프로젝트 각각 2-3개 핵심 엔지니어링 챌린지가 대안 분석, 결정 근거, 정량적 성과와 함께 한국어/영어로 완성된다
**Depends on**: Phase 13
**Requirements**: CONT-01, CONT-02, CONT-03, CONT-04, CONT-05, CONT-06
**Success Criteria** (what must be TRUE):
  1. 6개 프로젝트 각각 2-3개 챌린지가 작성되고, 각 챌린지는 대안 후보 1개 이상을 명시적으로 기각하는 이유와 함께 포함한다
  2. 모든 챌린지의 outcome 필드에 정량적 수치(before/after, 측정값, 비율)가 포함된다
  3. AI 관련 프로젝트(Joshua, Retail Analysis)의 챌린지에 AI 엔지니어링 난제가 포함된다
  4. ko.json과 en.json의 챌린지 키가 1대1로 일치하고 누락된 번역 키가 없다
  5. 모든 콘텐츠가 이력서/포트폴리오 PDF 기반 사실이며 임의 내용이 없다
**Plans**: TBD

## Progress

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Infrastructure | v1.0 | - | Complete | 2026-02-12 |
| 2. Design System | v1.0 | - | Complete | 2026-02-12 |
| 3. Main Page | v1.0 | - | Complete | 2026-02-12 |
| 4. Project Detail Pages | v1.0 | - | Complete | 2026-02-12 |
| 5. Content Expansion | v2.0 | - | Complete | 2026-02-13 |
| 6. Foundation | v3.0 | 2/2 | Complete | 2026-02-27 |
| 7. Scroll Spine | v3.0 | 2/2 | Complete | 2026-02-28 |
| 8. 3D Scenes | v3.0 | 2/2 | Complete | 2026-03-01 |
| 9. Content Overlay | v3.0 | - | Archived | - |
| 10. Typography | v3.0 | - | Archived | - |
| 11. Effects Polish | v3.0 | - | Archived | - |
| 12. Lab2 Cleanup | 1/1 | Complete    | 2026-03-02 | - |
| 13. Component Infrastructure | v4.0 | 0/TBD | Not started | - |
| 14. Content Authoring | v4.0 | 0/TBD | Not started | - |
