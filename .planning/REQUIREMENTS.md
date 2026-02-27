# Requirements: 박훈일 프론트엔드 포트폴리오

**Defined:** 2026-02-28
**Core Value:** 프론트엔드 개발 역량을 깔끔하고 정교한 디자인으로 보여주는 포트폴리오 사이트 — 채용 담당자가 빠르게 핵심 역량과 프로젝트를 파악할 수 있어야 한다.

## v3.0 Requirements

Requirements for /lab2 media-art 3D interactive portfolio. Each maps to roadmap phases.

### Foundation

- [x] **FOUND-01**: /lab2 라우트가 Next.js App Router에서 한국어/영어 양 로케일로 접근 가능하다
- [x] **FOUND-02**: Three.js/R3F 컴포넌트가 SSR 없이 클라이언트에서만 렌더링된다 (dynamic import)
- [x] **FOUND-03**: 로딩 화면이 에셋 로드 진행률을 표시하고, 셰이더 사전 컴파일 후 씬을 보여준다
- [x] **FOUND-04**: 뷰포트 1024px 미만에서 "데스크톱에서 보세요" 메시지를 표시한다
- [x] **FOUND-05**: /lab2 ↔ 메인 사이트 간 반복 이동 시 WebGL 컨텍스트 누수가 없다

### Scroll & Camera

- [ ] **SCRL-01**: Lenis 기반 스무스 스크롤이 전체 /lab2 페이지에 적용된다
- [ ] **SCRL-02**: 스크롤 위치가 0~1 사이의 scrollProgress로 정규화되어 Canvas에 전달된다
- [ ] **SCRL-03**: 카메라가 6개 챕터 웨이포인트 사이를 스크롤에 따라 부드럽게 이동한다
- [ ] **SCRL-04**: 챕터 전환이 스크롤 위치에서 자연스럽게 파생된다 (매직 넘버 없이 config 기반)

### 3D Scenes

- [ ] **SCENE-01**: IntroScene이 사용자 이름/타이틀과 함께 3D 공간에서 렌더링된다
- [ ] **SCENE-02**: 5개 프로젝트 각각에 고유한 3D 씬이 존재한다
- [ ] **SCENE-03**: 파티클 필드가 배경에서 공간감을 제공한다 (3k 이하)
- [ ] **SCENE-04**: 기존 WebP 이미지들이 3D 텍스처 플레인으로 씬 안에 표시된다
- [ ] **SCENE-05**: 씬 전환 시 지오메트리/머티리얼이 적절히 dispose되어 VRAM 누수가 없다

### Content & UI

- [ ] **CONT-01**: HTML 오버레이 패널이 각 프로젝트의 상세 정보를 한/영으로 표시한다
- [ ] **CONT-02**: 패널 전환이 AnimatePresence로 부드럽게 이루어진다
- [ ] **CONT-03**: 챕터 진행 표시기가 현재 위치를 보여준다 ("3 / 5")
- [ ] **CONT-04**: 네비게이션 도트가 각 챕터로 이동할 수 있게 한다
- [ ] **CONT-05**: 메인 사이트로 돌아가는 링크가 항상 표시된다
- [ ] **CONT-06**: 첫 화면에 스크롤 힌트가 표시된다

### Typography

- [ ] **TYPO-01**: 챕터 제목이 GSAP SplitText로 글자별로 등장하는 애니메이션을 가진다
- [ ] **TYPO-02**: 스크롤 속도에 반응하여 헤드라인 텍스트가 늘어나는 셰이더 효과가 적용된다

### Effects & Polish

- [ ] **FX-01**: 블룸 효과가 발광 요소에 적용되며, PerformanceMonitor로 게이팅된다
- [ ] **FX-02**: 필름 그레인 + 비네팅이 시네마틱 느낌을 더한다
- [ ] **FX-03**: 2-3초 엔트리 인트로 시퀀스가 로딩 완료 후 재생된다
- [ ] **FX-04**: 마우스 위치에 따라 카메라가 미세하게 드리프트한다 (idle 시)
- [ ] **FX-05**: 커스텀 원형 커서가 mix-blend-mode: difference로 표시된다
- [ ] **FX-06**: 각 프로젝트 챕터마다 고유한 색온도(조명)가 적용된다

## Future Requirements

### Portal / FBO Effects (v4+)

- **FBO-01**: 포탈/FBO 마스킹 리빌 효과로 씬 전환
- **FBO-02**: 프로젝트별 고유 GLSL 셰이더 시그니처

## Out of Scope

| Feature | Reason |
|---------|--------|
| 모바일 대응 | 데스크톱 전용 — 3D 성능 고려 |
| 오디오/사운드 | 한국 대기업 환경에서 부적절 — 오토플레이 차단 |
| 3D 텍스트 지오메트리 (본문) | GPU 비용 높고 가독성 낮음 — HTML 오버레이 사용 |
| 물리 엔진 (Cannon/Rapier) | 비주얼 포트폴리오에 과도 |
| FBO 포탈 효과 | 렌더 파이프라인 근본적 변경 필요 — v4+로 |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| FOUND-01 | Phase 6 | Complete |
| FOUND-02 | Phase 6 | Complete |
| FOUND-03 | Phase 6 | Complete |
| FOUND-04 | Phase 6 | Complete |
| FOUND-05 | Phase 6 | Complete |
| SCRL-01 | Phase 7 | Pending |
| SCRL-02 | Phase 7 | Pending |
| SCRL-03 | Phase 7 | Pending |
| SCRL-04 | Phase 7 | Pending |
| SCENE-01 | Phase 8 | Pending |
| SCENE-02 | Phase 8 | Pending |
| SCENE-03 | Phase 8 | Pending |
| SCENE-04 | Phase 8 | Pending |
| SCENE-05 | Phase 8 | Pending |
| CONT-01 | Phase 9 | Pending |
| CONT-02 | Phase 9 | Pending |
| CONT-03 | Phase 9 | Pending |
| CONT-04 | Phase 9 | Pending |
| CONT-05 | Phase 9 | Pending |
| CONT-06 | Phase 9 | Pending |
| TYPO-01 | Phase 10 | Pending |
| TYPO-02 | Phase 10 | Pending |
| FX-01 | Phase 11 | Pending |
| FX-02 | Phase 11 | Pending |
| FX-03 | Phase 11 | Pending |
| FX-04 | Phase 11 | Pending |
| FX-05 | Phase 11 | Pending |
| FX-06 | Phase 11 | Pending |

**Coverage:**
- v3.0 requirements: 28 total
- Mapped to phases: 28
- Unmapped: 0 ✓

---
*Requirements defined: 2026-02-28*
*Last updated: 2026-02-28 — traceability confirmed after ROADMAP.md creation*
