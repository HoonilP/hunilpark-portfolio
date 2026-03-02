# Requirements: 박훈일 프론트엔드 포트폴리오

**Defined:** 2026-03-02
**Core Value:** 프론트엔드 개발 역량을 깔끔하고 정교한 디자인으로 보여주는 포트폴리오 사이트 — 채용 담당자가 빠르게 핵심 역량과 프로젝트를 파악할 수 있어야 한다.

## v4.0 Requirements

Requirements for project detail page enhancement. Each maps to roadmap phases.

### Cleanup

- [x] **CLEAN-01**: lab2 라우트 디렉토리(/[locale]/lab2)와 모든 lab2 전용 컴포넌트가 삭제된다
- [x] **CLEAN-02**: lab2 관련 번역키(Lab2, Navigation.lab2)가 ko.json과 en.json에서 제거된다
- [x] **CLEAN-03**: 헤더 네비게이션에서 lab2 링크가 제거된다
- [x] **CLEAN-04**: lenis 패키지가 제거되고, 나머지 의존성(GSAP, Three.js 등)은 유지된다
- [x] **CLEAN-05**: lab2 삭제 후 `next build`가 에러 없이 성공한다

### Structure

- [x] **STRC-01**: ProjectContent 컴포넌트가 기존 Implementation+Troubleshooting 대신 통합된 "Engineering Challenges" 섹션을 렌더링한다
- [x] **STRC-02**: 각 챌린지가 문제정의 → 시도한 접근법 → 비교/결정 → 구현 → 성과 흐름으로 구성된다
- [x] **STRC-03**: i18n 스키마가 challenges 구조(challenge1~N, 각각 title/context/alternatives/decision/implementation/outcome 필드)로 마이그레이션된다
- [x] **STRC-04**: shiki 기반 CodeBlock 서버 컴포넌트가 챌린지 내 코드 스니펫을 구문 강조로 렌더링한다
- [x] **STRC-05**: 다크모드에서 코드 스니펫 테마가 자동 전환된다
- [x] **STRC-06**: 6개 프로젝트 모두 새 구조로 양 로케일(ko/en)에서 정상 렌더링된다

### Content

- [x] **CONT-01**: 6개 프로젝트 각각 2-3개의 핵심 엔지니어링 챌린지가 깊이 있게 작성된다
- [x] **CONT-02**: 모든 챌린지의 outcome 필드에 정량적 수치(before/after, 측정값, 비율 등)가 포함된다
- [x] **CONT-03**: 각 프로젝트의 기술 스택 선택에 대한 이유(왜 이 기술을 선택했는가)가 포함된다
- [x] **CONT-04**: AI 관련 프로젝트(Joshua, Retail Analysis, Art War)에서 AI 엔지니어링 챌린지가 포함된다
- [x] **CONT-05**: 한국어와 영어 콘텐츠가 동시에 업데이트되고, 양언어 키 일치가 검증된다
- [x] **CONT-06**: 콘텐츠가 이력서/포트폴리오 PDF 데이터 기반이며 임의 내용이 생성되지 않는다

## Future Requirements

### Visual Enhancements (v5+)

- **VIS-01**: 대안 비교 테이블 UI 컴포넌트 (AlternativesTable)
- **VIS-02**: 성과 지표 시각화 (메트릭 바/카드 컴포넌트)
- **VIS-03**: 인터랙티브 아키텍처 다이어그램

### Cleanup (v5+)

- **CLEAN-06**: lab1(/lab) 라우트 삭제 및 Three.js/R3F/drei 패키지 제거

## Out of Scope

| Feature | Reason |
|---------|--------|
| lab1(/lab) 삭제 | 이번 마일스톤은 lab2만 삭제, lab1은 유지 |
| 대안 비교 테이블 별도 컴포넌트 | 텍스트 내러티브로 충분, 별도 UI 컴포넌트는 v5+로 |
| 성과 지표 시각화 | 텍스트 수치로 충분, 메트릭 바/카드는 v5+로 |
| GSAP 패키지 제거 | 메인 사이트 HorizontalScrollWrapper에서 사용 중 |
| Three.js/R3F 패키지 제거 | lab1에서 사용 중 |
| 프로젝트 추가/삭제 | 기존 6개 프로젝트 유지 |
| 메인 페이지 프로젝트 카드 수정 | 상세 페이지만 고도화 |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| CLEAN-01 | Phase 12 | Complete |
| CLEAN-02 | Phase 12 | Complete |
| CLEAN-03 | Phase 12 | Complete |
| CLEAN-04 | Phase 12 | Complete |
| CLEAN-05 | Phase 12 | Complete |
| STRC-01 | Phase 13 | Complete |
| STRC-02 | Phase 13 | Complete |
| STRC-03 | Phase 13 | Complete |
| STRC-04 | Phase 13 | Complete |
| STRC-05 | Phase 13 | Complete |
| STRC-06 | Phase 13 | Complete |
| CONT-01 | Phase 14 | Complete |
| CONT-02 | Phase 14 | Complete |
| CONT-03 | Phase 14 | Complete |
| CONT-04 | Phase 14 | Complete |
| CONT-05 | Phase 14 | Complete |
| CONT-06 | Phase 14 | Complete |

**Coverage:**
- v4.0 requirements: 17 total
- Mapped to phases: 17
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-02*
*Last updated: 2026-03-02 after roadmap v4.0 creation*
