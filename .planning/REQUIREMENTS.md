# Requirements: v2.0 Design Overhaul + Content Expansion

## v2.0 Requirements

### 콘텐츠 확장
- [x] **CONT-01**: Scholarly Chain 프로젝트 상세 페이지 및 카드 추가 (캡스톤 디자인, Next.js/React/TypeScript/Tailwind/shadcn/ui)
- [x] **CONT-02**: Dino Go 프로젝트 상세 페이지 및 카드 추가 (해커톤, Next.js/Three.js/TypeScript/Web3)
- [x] **CONT-03**: 전체 프로젝트 placeholder를 실제 이미지로 교체 (Notion 자료/노션포트폴리오html 기반)
- [x] **CONT-04**: 프로젝트 카드에 썸네일 이미지 추가

### 애니메이션 기반
- [ ] **ANIM-01**: Lenis 스무스 스크롤 적용
- [ ] **ANIM-02**: prefers-reduced-motion 접근성 지원 (CSS media query + useReducedMotion hook)
- [ ] **ANIM-03**: 모든 인터랙티브 요소에 향상된 호버 상태 적용 (200ms 이하 전환)
- [ ] **ANIM-04**: 모바일 최적화 애니메이션 (모바일에서 강도 감소, 44x44px 터치 타겟)

### 스크롤 애니메이션
- [ ] **SCROLL-01**: GSAP + ScrollTrigger 스크롤 트리거 페이드인 애니메이션
- [ ] **SCROLL-02**: Skills, Projects 그리드 스태거 애니메이션 (0.1-0.15s 간격)
- [ ] **SCROLL-03**: Hero 섹션 패럴랙스 스크롤링 (최대 1.2x 속도 차이, 모바일 비활성화)
- [ ] **SCROLL-04**: 스크롤 진행률 인디케이터 (상단 진행 바, IntersectionObserver 기반)

### 3D 요소
- [ ] **3D-01**: React Three Fiber 기반 Hero 섹션 3D 요소 (60fps, <100 draw calls, reduced-motion 시 정적 fallback)

### 마이크로 인터랙션
- [ ] **MICRO-01**: 프로젝트 카드 호버 시 스크린샷 미리보기 (lazy load, 300ms debounce)
- [ ] **MICRO-02**: 마그네틱 커서 효과 (데스크톱 전용, 터치 디바이스 비활성화, 50-100px pull radius)
- [ ] **MICRO-03**: 스킬 항목 호버 시 라이브 데모 (CSS 그라디언트, 애니메이션 효과 등)
- [ ] **MICRO-04**: 스크롤 기반 네비게이션 활성 섹션 하이라이팅 (IntersectionObserver, 50% viewport 교차)
- [ ] **MICRO-05**: 다크/라이트 모드 부드러운 전환 애니메이션 (300ms 이하)

## Future Requirements (v3+)

- Page transitions (View Transitions API — 브라우저 지원 성숙 후)
- Horizontal scroll reveals
- Complex timeline animations
- 오픈소스 기여 섹션

## Out of Scope

- 스플래시/로딩 스크린 — 콘텐츠 지연, Core Web Vitals 저하
- 커서 트레일/레인보우 효과 — 기믹, 전문성 의심
- 스크롤 하이재킹 — UX 파괴, 브라우저 컨트롤 방해
- 자동 재생 비디오 배경 — 파일 크기 과다, 모바일 데이터 낭비
- 모든 스크롤에 애니메이션 — 3-5개 핵심 포인트에만 집중
- 커스텀 스크롤바 — 크로스 브라우저 이슈

## Traceability

| REQ-ID | Phase | Status |
|--------|-------|--------|
| CONT-01 | Phase 5 | Complete |
| CONT-02 | Phase 5 | Complete |
| CONT-03 | Phase 5 | Complete |
| CONT-04 | Phase 5 | Complete |
| ANIM-01 | Phase 6 | Pending |
| ANIM-02 | Phase 6 | Pending |
| ANIM-03 | Phase 6 | Pending |
| ANIM-04 | Phase 6 | Pending |
| SCROLL-01 | Phase 6 | Pending |
| SCROLL-02 | Phase 6 | Pending |
| SCROLL-03 | Phase 6 | Pending |
| SCROLL-04 | Phase 6 | Pending |
| 3D-01 | Phase 7 | Pending |
| MICRO-01 | Phase 7 | Pending |
| MICRO-02 | Phase 7 | Pending |
| MICRO-03 | Phase 7 | Pending |
| MICRO-04 | Phase 7 | Pending |
| MICRO-05 | Phase 7 | Pending |

---
*18 requirements across 5 categories*
