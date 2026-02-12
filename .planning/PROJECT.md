# 박훈일 프론트엔드 포트폴리오

## What This Is

한국 대기업 IT 프론트엔드 직무 취업을 위한 개인 포트폴리오 웹사이트. Next.js 16 + Tailwind v4 + next-intl 기반으로 제작된 정적 사이트로, 7개 섹션의 메인 페이지와 5개 프로젝트 상세 페이지를 한국어/영어 양언어로 제공한다. 패럴랙스 스크롤, 모션 그래픽스, 3D 요소, 마이크로 인터랙션 등 인터랙티브 디자인 요소로 프론트엔드 역량을 직접 체감할 수 있는 사이트.

## Core Value

프론트엔드 개발 역량을 깔끔하고 정교한 디자인으로 보여주는 포트폴리오 사이트 — 채용 담당자가 빠르게 핵심 역량과 프로젝트를 파악할 수 있어야 한다.

## Requirements

### Validated

- ✓ Next.js 기반 하이브리드 구성 (메인 원페이지 + 프로젝트 상세 별도 페이지) — v1
- ✓ 한국어/영어 전환 기능 (i18n) — v1
- ✓ 미니멀하고 깔끔한 디자인 (불필요한 애니메이션 없이) — v1
- ✓ Hero 섹션 — 이름, 한줄 소개, 연락처/링크 — v1
- ✓ About 섹션 — 자기소개 (프론트엔드 관점으로 재구성) — v1
- ✓ Skills 섹션 — 기술 스택 표시 — v1
- ✓ Projects 섹션 — 3개 프로젝트 카드 + 각각 상세 페이지 — v1
- ✓ Experience 섹션 — 경력 타임라인 — v1
- ✓ Education 섹션 — 학력 — v1
- ✓ Contact 섹션 — 연락 수단 — v1
- ✓ 반응형 디자인 (데스크톱/모바일) — v1

### Active

- [ ] 2개 프로젝트 추가 (Scholarly Chain, Dino Go) — 프론트엔드 관점 선정
- [ ] 전체 프로젝트 실제 이미지 추가 (Notion 자료 기반, placeholder 교체)
- [ ] 프로젝트 카드 썸네일 추가
- [ ] 패럴랙스 스크롤링 효과
- [ ] 모션 그래픽스 / 스크롤 애니메이션
- [ ] 3D 요소 (Three.js / CSS 3D)
- [ ] 마이크로 인터랙션 (호버, 클릭, 전환 효과)

### Out of Scope

- 블로그 기능 — 포트폴리오 사이트이므로 별도 블로그 불필요, Velog로 충분
- CMS/관리자 페이지 — 정적 콘텐츠로 충분
- 백엔드/DB 연동 — 정적 사이트로 제작
- Contact form (서버) — 이메일 직접 링크로 충분
- 스킬 퍼센트 바 — 의미 없는 주관적 지표, 안티패턴
- ~~3D/복잡한 애니메이션~~ — v2에서 추가 결정 (사용자 요청)

## Context

### Current State (v1 shipped 2026-02-12)

- **Tech Stack**: Next.js 16 (App Router), TypeScript, Tailwind CSS v4, next-intl, next-themes, lucide-react
- **LOC**: ~2,006 lines (TypeScript/TSX/CSS/JSON)
- **Pages**: 2 main + 6 project detail (3 projects × 2 locales) + 2 not-found = 10 static pages
- **Content**: ~15,000 words bilingual content (Korean + English)
- **Known Tech Debt**: Header logo plain `<a>`, project screenshot placeholders, unused Button component

### v2 추가 프로젝트 콘텐츠 소스

**4. Scholarly Chain (캡스톤 디자인)**
- 기간: 2025.03 - 2025.06
- 팀: 4인 (프론트엔드 100% 담당)
- GitHub: https://github.com/Capstone-scholarly-chain
- Hyperledger Fabric 블록체인 기반 학생회비 투명 관리 시스템
- Next.js, React, TypeScript, Tailwind CSS, shadcn/ui, Firebase Cloud Messaging, JWT
- JWT 자동 갱신 미들웨어, FCM 역할별 푸시, 역할 기반 UI (학생/위원/관리자)
- API Route 프록시, 15+ 페이지, 30+ 재사용 컴포넌트
- Vercel 배포
- 이미지: AWS EKS 아키텍처 다이어그램 (자료/노션포트폴리오html)

**5. Dino Go (위치 기반 NFT 게임)**
- 기간: 2025.09.19 - 2025.09.21 (해커톤)
- 웹사이트: https://dinogo.vercel.app/
- GitHub: https://github.com/Dino-Go
- Sui 블록체인 위치 기반 NFT 수집 게임
- Next.js, TypeScript, Three.js, Tailwind CSS, Move (Smart Contract)
- Google Maps + Three.js 3D 맵, NFT Studio, Marketplace UI
- Walrus 분산 스토리지, Seal 임계값 암호화, Kiosk SDK
- 10+ 페이지, 4 Move 모듈, 3 커스텀 Web3 클라이언트 라이브러리
- 이미지: 픽셀아트 마스코트 아이콘 (자료/노션포트폴리오html)

### 프로젝트별 이미지 매핑

| 프로젝트 | 이미지 | 용도 |
|---------|--------|------|
| Joshua | 앱 홈 스크린샷, Stripe 결제, 로고 배너, 4-tone 모델 다이어그램, 서비스 설계도, GPU 서버 | hero, architecture, features |
| DY CMS | 아키텍처 다이어그램 (Vercel/NestJS/Docker), 로고 | architecture, thumbnail |
| Retail Analysis | Parkson 외관, In/Out 카운터, 히트맵 2종, 고객 트래킹, 동선 분석 | hero, 5 feature screenshots |
| Scholarly Chain | AWS EKS 아키텍처 다이어그램 | architecture |
| Dino Go | 픽셀아트 마스코트 | thumbnail (UI는 placeholder) |

### 콘텐츠 소스 (PDF 기반, 임의 내용 생성 금지)

**인적사항:**
- 이름: 박훈일 (Park Hunil)
- 전화: 010-5557-6835
- 이메일: phoonil0927@gmail.com
- GitHub: https://github.com/HoonilP
- Velog: https://velog.io/@hoonilpark

**경력 (프리랜서 제거, DY Microfinance로 통합):**

1. DY Microfinance (미얀마 소재)
   - 2017.01 - 2018.12: 회계·재무 운영 및 회계 프로세스 자동화 실무 담당자
     - BS·PL 자동 생성 스프레드시트 구축
     - 기술: 스프레드시트
   - 2024.07 - 2025.06: 고객 관리 시스템 개발
     - Next.js, NestJS, PostgreSQL
     - 프론트엔드(대시보드) + 백엔드(API) 분리형 아키텍처
     - 관리자용 대시보드 구현
     - 회계 프로세스 약 90% 자동화

2. 주식회사 페이먼트인앱 (2022.05 - 2024.03)
   - 카피라이팅 에이전트 Joshua (2022.06 - 2023.03)
     - Electron + Angular 크로스플랫폼 데스크톱 앱
     - KoGPT-2 Fine-tuning, Stripe 결제 연동
     - 기술: Electron, Angular, FastAPI, PostgreSQL
   - 제조 공정 영상 기반 불량 인식 자동화 (2022.11 - 2023.03)
     - YOLO 기반 객체 인식, 실시간 처리 파이프라인
     - 기술: Pytorch
   - 시각지능 기반 리테일 매장 고객 행동 분석 (말레이시아) (2022.11 - 2023.04)
     - YOLO 기반 고객 동선 트래킹, 대시보드 시각화
     - 기술: Pytorch, VanillaJS
   - EMV Open-loop Transit Seoul 타당성 조사 (2023.06 - 2023.12)
     - 운영비 9.5억원 절감, 승객 만족도 77% 향상 도출
     - 서울시 교통 결제 정책 결정 근거 자료로 채택

**학력:**
- 양곤외국어대학교 미얀마어과 (2017.01 - 2018.12, 중퇴)
- 상명대학교 빅데이터융합학과 (2024.03 - 2026.02, 졸업 예정, GPA 4.33/4.5)
- 연세대학교 블록체인 학회 BAY 17기
- 영우글로벌러닝 AI S/W 전문가 양성과정 (2022.04)

**기술 스택:**
- TypeScript, Python, React, FastAPI, NestJS, Next.js, AWS, Docker, Kubernetes, MySQL, PostgreSQL

**자격증/수상:**
- 컴퓨터활용능력 1급 (2020.11)
- 전산회계 1급 (2021.03)
- FSI AIxData Challenge 2024 우수상
- TOEIC 930 (2025.11.16)

**언어:**
- 영어: 고급 비즈니스 레벨
- 프랑스어: 비즈니스 레벨

### 프로젝트 설명 방향

프로젝트 서술을 프론트엔드 관점으로 재구성하되, PDF에 있는 사실만 사용. 새로운 기술 경험이나 성과를 임의로 추가하지 않음.

### 디자인 방향

v1: 미니멀, 깔끔한 디자인.
v2: 인터랙티브 디자인으로 전환. 패럴랙스 스크롤링, 모션 그래픽스, 3D 요소, 마이크로 인터랙션을 적극 활용하여 프론트엔드 역량을 사이트 자체로 증명. 성능과 접근성은 유지하되 시각적 임팩트를 대폭 강화.

## Constraints

- **Tech Stack**: Next.js 16 (App Router), TypeScript, Tailwind CSS v4
- **Content**: 이력서/포트폴리오 PDF 데이터만 사용, 임의 내용 생성 금지
- **Design**: 인터랙티브 디자인 (패럴랙스, 모션, 3D, 마이크로 인터랙션) — 성능 유지 필수
- **Language**: 한국어 기본 + 영어 전환 지원

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Next.js 16 App Router 사용 | 사용자 요청 프레임워크 | ✓ Good — SSG + i18n 잘 동작 |
| 하이브리드 구성 (원페이지 + 프로젝트 상세) | 메인은 한눈에, 프로젝트는 깊게 | ✓ Good — 채용담당자 흐름에 적합 |
| 프리랜서 경력을 DY Microfinance로 통합 | 사용자 요청 | ✓ Good |
| 프론트엔드 관점으로 프로젝트 재구성 | 프론트엔드 직무 타겟 | ✓ Good — ~15,000 words 기술 콘텐츠 |
| Tailwind v4 CSS-first 설정 | v4 아키텍처에 맞는 @theme 블록 | ✓ Good — JS config 불필요 |
| next-intl 한/영 i18n | 자동 locale 라우팅 | ✓ Good — 모든 페이지 양언어 |
| next-themes 다크모드 | flash-of-wrong-theme 방지 | ✓ Good — data-theme 속성 |
| Border-only 카드 (그림자 없음) | 미니멀 디자인 | ✓ Good — 깔끔한 미관 |
| Korean big tech 포트폴리오 포맷 | 문제→해결→결과 구조 | ✓ Good — 기술 면접 대비 |
| 3개 프로젝트 우선 선정 | Joshua, DY CMS, Retail Analysis | ✓ Good — 다양한 프론트엔드 스펙트럼 |
| v2 프로젝트로 Scholarly Chain, Dino Go 선정 | 프론트엔드 역량 중심 선정 (Next.js, Three.js, shadcn/ui) | — Pending |
| v2 디자인 방향 전환 | 미니멀 → 인터랙티브 (패럴랙스, 모션, 3D, 마이크로 인터랙션) | — Pending |
| 제조 불량 인식/EMV/금융AI 제외 | 프론트엔드 작업 없음, CV/AI/컨설팅 프로젝트 | — Pending |

## Current Milestone: v2.0 Design Overhaul + Content Expansion

**Goal:** 인터랙티브 디자인 요소와 2개 신규 프로젝트를 추가하여 프론트엔드 역량을 사이트 자체로 증명하는 포트폴리오로 업그레이드

**Target features:**
- 2개 프로젝트 추가 (Scholarly Chain, Dino Go) + 전체 프로젝트 실제 이미지
- 패럴랙스 스크롤링, 모션 그래픽스/스크롤 애니메이션
- 3D 요소 (Three.js / CSS 3D transforms)
- 마이크로 인터랙션 (호버, 클릭, 전환 효과)
- 프로젝트 카드 썸네일

---
*Last updated: 2026-02-12 after v2.0 milestone start*
