# Roadmap: 박훈일 프론트엔드 포트폴리오

## Milestones

- ✅ **v1.0 Portfolio MVP** - Phases 1-4 (shipped 2026-02-12)
- ✅ **v2.0 Content Expansion** - Phase 5 (shipped 2026-02-13)
- 🚧 **v3.0 Interactive Portfolio** - Phases 6-11 (in progress)

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

### 🚧 v3.0 Interactive Portfolio (Phases 6-11)

**Milestone Goal:** /lab2에 미디어아트 스타일 3D 인터랙티브 포트폴리오를 구축하여 프론트엔드 역량을 사이트 자체로 증명한다.

---

- [x] **Phase 6: Foundation** - /lab2 라우트 + WebGL 인프라 + 로딩 화면 + HUD 기반 (completed 2026-02-27)
- [ ] **Phase 7: Scroll Spine** - Lenis 스무스 스크롤 + 6-챕터 카메라 웨이포인트 시스템
- [ ] **Phase 8: 3D Scenes** - IntroScene + 5개 프로젝트 씬 + 파티클 필드 + 텍스처 플레인
- [ ] **Phase 9: Content Overlay** - HTML 오버레이 패널 + 한/영 콘텐츠 + 챕터 HUD
- [ ] **Phase 10: Typography** - GSAP SplitText 글자별 등장 + 스크롤 속도 반응 텍스트 셰이더
- [ ] **Phase 11: Effects Polish** - 블룸/필름 그레인/비네팅 + 엔트리 시퀀스 + 마우스 드리프트 + 커스텀 커서

## Phase Details

### Phase 6: Foundation
**Goal**: 채용담당자가 /lab2에 접속했을 때 두 로케일(ko/en) 모두에서 WebGL 캔버스가 올바르게 로드되고, 뷰포트 게이트와 로딩 화면이 동작하며, /lab2 ↔ 메인 사이트 왕복 시 WebGL 컨텍스트가 누수 없이 안정적으로 동작한다
**Depends on**: Phase 5 (existing codebase)
**Requirements**: FOUND-01, FOUND-02, FOUND-03, FOUND-04, FOUND-05
**Success Criteria** (what must be TRUE):
  1. /ko/lab2 와 /en/lab2 모두 접속 시 빈 씬이라도 캔버스가 정상 렌더링된다
  2. 로딩 화면이 에셋 진행률(%)을 표시하고 완료 후 씬으로 전환된다
  3. 뷰포트 1024px 미만에서 "데스크톱에서 보세요" 메시지가 캔버스 대신 표시된다
  4. /lab2 ↔ / 간 10회 왕복 후에도 캔버스가 검게 되거나 오류가 없다
  5. `ANALYZE=true npm run build` 결과에서 Three.js 번들이 /lab2 청크에만 포함된다
**Plans**: 2 plans
- [ ] 06-01-PLAN.md — /lab2 route infrastructure, WebGL canvas, loading screen, viewport gate
- [ ] 06-02-PLAN.md — Header navigation link, bundle verification, WebGL lifecycle test

### Phase 7: Scroll Spine
**Goal**: 스크롤이 6개 챕터 웨이포인트 사이를 부드럽게 이동하는 카메라 경로 스토리텔링의 척추(spine)가 완성된다 — 이것이 전체 경험의 핵심이며 나머지는 그 위의 장식이다
**Depends on**: Phase 6
**Requirements**: SCRL-01, SCRL-02, SCRL-03, SCRL-04
**Success Criteria** (what must be TRUE):
  1. 페이지 전체에서 스크롤이 Lenis 특유의 부드럽고 탄성 있는 느낌으로 동작한다
  2. 스크롤 위치에 따라 카메라가 6개 웨이포인트를 부드럽게 이동하며 챕터가 전환된다
  3. Chrome Performance 탭에서 스크롤 중 Long Task가 없다 (60fps 유지)
  4. 챕터 경계가 config 상수에서 파생되며 코드 어느 곳에도 매직 넘버 없이 동작한다
**Plans**: 2 plans
- [ ] 07-01-PLAN.md — Lenis smooth scroll + useScrollProgress hook + CHAPTERS config + page scroll height
- [ ] 07-02-PLAN.md — CameraRig waypoint interpolation + Lab2Scene integration + scroll verification

### Phase 8: 3D Scenes
**Goal**: 6개 챕터(인트로 + 5개 프로젝트)에 고유한 3D 씬이 채워지고, 기존 WebP 이미지들이 텍스처 플레인으로 공간 안에 배치되며, 파티클 필드가 공간감을 제공한다
**Depends on**: Phase 7
**Requirements**: SCENE-01, SCENE-02, SCENE-03, SCENE-04, SCENE-05
**Success Criteria** (what must be TRUE):
  1. IntroScene에서 사용자 이름/타이틀이 3D 공간에 렌더링된다
  2. 5개 프로젝트 챕터 각각에 시각적으로 구별되는 고유한 3D 씬이 존재한다
  3. 기존 WebP 이미지(프로젝트 hero/architecture)가 씬 안에 텍스처 플레인으로 표시된다
  4. 파티클 필드가 배경에서 공간감을 제공하며 3,000개 이하의 파티클을 사용한다
  5. 챕터 전환 시 이전 씬의 지오메트리/머티리얼이 dispose되어 VRAM이 증가하지 않는다
**Plans**: TBD

### Phase 9: Content Overlay
**Goal**: 채용담당자가 각 프로젝트 챕터에서 HTML 오버레이 패널로 프로젝트 상세 정보를 한국어/영어로 읽을 수 있고, 챕터 진행 현황과 네비게이션을 통해 전체 포트폴리오를 탐색할 수 있다
**Depends on**: Phase 8
**Requirements**: CONT-01, CONT-02, CONT-03, CONT-04, CONT-05, CONT-06
**Success Criteria** (what must be TRUE):
  1. 각 챕터에서 해당 프로젝트의 이름, 요약, 기술 스택이 HTML 패널에 한/영으로 표시된다
  2. 챕터 전환 시 패널이 부드럽게 페이드인/아웃되며 이전 내용이 자연스럽게 사라진다
  3. 화면 어딘가에 "3 / 6" 형식의 현재 챕터 위치 표시기가 항상 보인다
  4. 네비게이션 도트를 클릭하면 해당 챕터로 스크롤이 이동한다
  5. 메인 사이트 복귀 링크가 항상 표시되고 클릭 시 메인 포트폴리오로 이동한다
**Plans**: TBD

### Phase 10: Typography
**Goal**: 챕터 제목이 글자 단위로 등장하는 인터랙션과 스크롤 속도에 반응하는 텍스트 왜곡 효과가 경험 전체의 고급스러운 모션 언어를 완성한다
**Depends on**: Phase 9
**Requirements**: TYPO-01, TYPO-02
**Success Criteria** (what must be TRUE):
  1. 챕터 진입 시 제목이 글자 하나씩 순차적으로 등장하는 애니메이션이 동작한다
  2. 빠르게 스크롤할 때 헤드라인 텍스트가 스크롤 방향으로 늘어나는 시각적 왜곡이 보인다
  3. 스크롤을 멈추면 텍스트가 정상 형태로 부드럽게 복원된다
**Plans**: TBD

### Phase 11: Effects Polish
**Goal**: 블룸, 필름 그레인, 엔트리 시퀀스, 마우스 드리프트, 커스텀 커서, 프로젝트별 색온도가 경험을 미디어아트 수준으로 완성한다 — 모든 효과는 PerformanceMonitor로 게이팅된다
**Depends on**: Phase 10
**Requirements**: FX-01, FX-02, FX-03, FX-04, FX-05, FX-06
**Success Criteria** (what must be TRUE):
  1. 발광 요소에 블룸 효과가 적용되며, 저사양 GPU에서는 효과가 자동으로 비활성화된다
  2. 필름 그레인과 비네팅이 화면에 시네마틱 분위기를 더한다
  3. 로딩 완료 후 2-3초 엔트리 인트로 시퀀스가 재생된 후 스크롤이 활성화된다
  4. 스크롤 없이 idle 상태일 때 마우스 움직임에 따라 카메라가 미세하게 드리프트한다
  5. 커스텀 원형 커서가 mix-blend-mode: difference로 표시되어 콘텐츠 위에서 반전된다
  6. 챕터 전환 시 조명 색온도가 각 프로젝트의 고유한 색상으로 변한다
**Plans**: TBD

## Progress

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Infrastructure | v1.0 | - | Complete | 2026-02-12 |
| 2. Design System | v1.0 | - | Complete | 2026-02-12 |
| 3. Main Page | v1.0 | - | Complete | 2026-02-12 |
| 4. Project Detail Pages | v1.0 | - | Complete | 2026-02-12 |
| 5. Content Expansion | v2.0 | - | Complete | 2026-02-13 |
| 6. Foundation | 2/2 | Complete   | 2026-02-27 | - |
| 7. Scroll Spine | v3.0 | 1/2 | In Progress | - |
| 8. 3D Scenes | v3.0 | 0/TBD | Not started | - |
| 9. Content Overlay | v3.0 | 0/TBD | Not started | - |
| 10. Typography | v3.0 | 0/TBD | Not started | - |
| 11. Effects Polish | v3.0 | 0/TBD | Not started | - |
