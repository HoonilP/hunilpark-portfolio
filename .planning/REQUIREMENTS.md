# Requirements: 박훈일 프론트엔드 포트폴리오

**Defined:** 2026-02-11
**Core Value:** 프론트엔드 개발 역량을 깔끔하고 정교한 디자인으로 보여주는 포트폴리오 사이트

## v1 Requirements

### Foundation

- [x] **FOUND-01**: Next.js App Router + TypeScript 프로젝트 초기 설정
- [x] **FOUND-02**: Tailwind CSS v4 설정 및 디자인 시스템 기초 (색상, 타이포그래피, 간격)
- [x] **FOUND-03**: next-intl 기반 한국어/영어 전환 기능 (locale 라우팅, 미들웨어)
- [x] **FOUND-04**: 반응형 레이아웃 (모바일 퍼스트, 데스크톱 대응)
- [x] **FOUND-05**: Header (네비게이션 + 언어 전환 버튼) 및 Footer 레이아웃

### Hero

- [ ] **HERO-01**: 이름(박훈일), 직무 타이틀(프론트엔드 개발자), 한줄 소개 표시
- [ ] **HERO-02**: 연락처 링크 표시 (이메일, GitHub, Velog)
- [ ] **HERO-03**: 한/영 전환 시 콘텐츠 변경

### About

- [ ] **ABOUT-01**: 프론트엔드 관점으로 재구성한 자기소개 표시
- [ ] **ABOUT-02**: 해외 경험(프랑스, 미얀마, 말레이시아) 및 다국어 역량 언급
- [ ] **ABOUT-03**: 한/영 전환 시 콘텐츠 변경

### Skills

- [ ] **SKILL-01**: 기술 스택을 카테고리별로 표시 (Frontend, Backend, DevOps, DB 등)
- [ ] **SKILL-02**: 각 스킬이 어떤 프로젝트에서 사용되었는지 연결 표시
- [ ] **SKILL-03**: 기술 스택: TypeScript, Python, React, Next.js, Angular, NestJS, FastAPI, Electron, AWS, Docker, Kubernetes, MySQL, PostgreSQL, VanillaJS

### Projects

- [ ] **PROJ-01**: 메인 페이지에 3개 프로젝트 카드 표시 (Joshua AI Agent, DY Microfinance CMS, 리테일 매장 분석)
- [ ] **PROJ-02**: 각 프로젝트 카드에 제목, 한줄 설명, 기술 스택 배지, 썸네일 표시
- [ ] **PROJ-03**: 프로젝트 카드 클릭 시 상세 페이지(/projects/[slug])로 이동
- [ ] **PROJ-04**: 프로젝트 상세 페이지 — 프론트엔드 관점 기술 구현 설명 (PDF 사실 기반)
- [ ] **PROJ-05**: 프로젝트 상세 페이지 — 기술 스택, 참여 인원, 기간, 역할 표시
- [ ] **PROJ-06**: 프로젝트 상세 페이지 — GitHub/외부 링크 연결 (있는 경우)
- [ ] **PROJ-07**: 한/영 전환 시 프로젝트 콘텐츠 변경

### Experience

- [ ] **EXP-01**: 경력 타임라인 형태로 표시
- [ ] **EXP-02**: DY Microfinance — 회계·재무 운영 (2017-2018) + 고객 관리 시스템 개발 (2024-2025) 통합 표시
- [ ] **EXP-03**: 주식회사 페이먼트인앱 — 사업기획 총괄 (2022-2024) 표시, 주요 프로젝트 나열
- [ ] **EXP-04**: 한/영 전환 시 콘텐츠 변경

### Education

- [ ] **EDU-01**: 학력 타임라인 형태로 표시
- [ ] **EDU-02**: 상명대학교 빅데이터융합학과 (졸업 예정, GPA 4.33/4.5) 표시
- [ ] **EDU-03**: 양곤외국어대학교 미얀마어과 표시
- [ ] **EDU-04**: 자격증/수상 표시 (컴퓨터활용능력1급, 전산회계1급, FSI AIxData Challenge 우수상, TOEIC 930)
- [ ] **EDU-05**: 한/영 전환 시 콘텐츠 변경

### Contact

- [ ] **CONT-01**: 이메일(phoonil0927@gmail.com), GitHub, Velog 링크 표시
- [ ] **CONT-02**: 전화번호(010-5557-6835) 표시
- [ ] **CONT-03**: 한/영 전환 시 콘텐츠 변경

## v2 Requirements

### 차별화 요소

- **DIFF-01**: 프로젝트별 성과 지표 시각화 (Lighthouse 점수, 자동화율 등)
- **DIFF-02**: 프로젝트 데모 GIF/영상 추가
- **DIFF-03**: SEO 최적화 (메타데이터, OG 태그, sitemap)
- **DIFF-04**: WCAG 2.1 AA 접근성 강화
- **DIFF-05**: 나머지 2개 프로젝트 추가 (제조 불량 인식, EMV 타당성 조사)
- **DIFF-06**: 다크모드 지원

## Out of Scope

| Feature | Reason |
|---------|--------|
| 블로그 기능 | 포트폴리오 사이트 목적에 불필요, Velog로 충분 |
| CMS/관리자 페이지 | 정적 콘텐츠로 충분, 복잡도 증가 대비 가치 없음 |
| 백엔드/DB 연동 | 정적 사이트로 제작, 불필요한 인프라 |
| Contact form (서버) | 이메일 직접 링크로 충분, 서버 비용 불필요 |
| 스킬 퍼센트 바 | 의미 없는 주관적 지표, 안티패턴 |
| 3D/복잡한 애니메이션 | 미니멀 디자인 방향, 성능 저하 우려 |
| 스플래시/로딩 화면 | 콘텐츠 접근 지연, UX 안티패턴 |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| FOUND-01 | Phase 1 | Complete |
| FOUND-02 | Phase 1 | Complete |
| FOUND-03 | Phase 1 | Complete |
| FOUND-04 | Phase 1 | Complete |
| FOUND-05 | Phase 2 | Complete |
| HERO-01 | Phase 3 | Pending |
| HERO-02 | Phase 3 | Pending |
| HERO-03 | Phase 3 | Pending |
| ABOUT-01 | Phase 3 | Pending |
| ABOUT-02 | Phase 3 | Pending |
| ABOUT-03 | Phase 3 | Pending |
| SKILL-01 | Phase 3 | Pending |
| SKILL-02 | Phase 3 | Pending |
| SKILL-03 | Phase 3 | Pending |
| PROJ-01 | Phase 3 | Pending |
| PROJ-02 | Phase 3 | Pending |
| PROJ-03 | Phase 4 | Pending |
| PROJ-04 | Phase 4 | Pending |
| PROJ-05 | Phase 4 | Pending |
| PROJ-06 | Phase 4 | Pending |
| PROJ-07 | Phase 4 | Pending |
| EXP-01 | Phase 3 | Pending |
| EXP-02 | Phase 3 | Pending |
| EXP-03 | Phase 3 | Pending |
| EXP-04 | Phase 3 | Pending |
| EDU-01 | Phase 3 | Pending |
| EDU-02 | Phase 3 | Pending |
| EDU-03 | Phase 3 | Pending |
| EDU-04 | Phase 3 | Pending |
| EDU-05 | Phase 3 | Pending |
| CONT-01 | Phase 3 | Pending |
| CONT-02 | Phase 3 | Pending |
| CONT-03 | Phase 3 | Pending |

**Coverage:**
- v1 requirements: 33 total
- Mapped to phases: 33
- Unmapped: 0 ✓

---
*Requirements defined: 2026-02-11*
*Last updated: 2026-02-11 after roadmap creation*
