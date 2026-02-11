# 박훈일 프론트엔드 포트폴리오

## What This Is

한국 대기업 IT 프론트엔드 직무 취업을 위한 개인 포트폴리오 웹사이트. Next.js 기반으로 제작하며, 이력서·포트폴리오 PDF에 있는 기존 데이터만을 활용하여 프론트엔드 개발자 관점에서 경력과 프로젝트를 소개하는 사이트.

## Core Value

프론트엔드 개발 역량을 깔끔하고 정교한 디자인으로 보여주는 포트폴리오 사이트 — 채용 담당자가 빠르게 핵심 역량과 프로젝트를 파악할 수 있어야 한다.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Next.js 기반 하이브리드 구성 (메인 원페이지 + 프로젝트 상세 별도 페이지)
- [ ] 한국어/영어 전환 기능 (i18n)
- [ ] 미니멀하고 깔끔한 디자인 (불필요한 애니메이션 없이)
- [ ] 다른 프론트엔드 포트폴리오 사이트 참고한 정교한 UI
- [ ] Hero 섹션 — 이름, 한줄 소개, 연락처/링크
- [ ] About 섹션 — 자기소개 (프론트엔드 관점으로 재구성)
- [ ] Skills 섹션 — 기술 스택 표시
- [ ] Projects 섹션 — 5개 프로젝트 카드 + 각각 상세 페이지
- [ ] Experience 섹션 — 경력 타임라인
- [ ] Education 섹션 — 학력
- [ ] Contact 섹션 — 연락 수단
- [ ] 반응형 디자인 (데스크톱/모바일)

### Out of Scope

- 블로그 기능 — 포트폴리오 사이트이므로 별도 블로그 불필요
- CMS/관리자 페이지 — 정적 콘텐츠로 충분
- 다크모드 — v1에서는 단일 테마로 진행
- 백엔드/DB 연동 — 정적 사이트로 제작

## Context

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

프론트엔드 개발자 포트폴리오 사이트 레퍼런스를 참고하여 깔끔하고 정교하게 제작. 미니멀하지만 디테일이 살아있는 디자인.

## Constraints

- **Tech Stack**: Next.js (App Router), TypeScript, Tailwind CSS
- **Content**: 이력서/포트폴리오 PDF 데이터만 사용, 임의 내용 생성 금지
- **Design**: 미니멀, 불필요한 애니메이션 배제
- **Language**: 한국어 기본 + 영어 전환 지원

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Next.js App Router 사용 | 사용자 요청 프레임워크 | — Pending |
| 하이브리드 구성 (원페이지 + 프로젝트 상세) | 메인은 한눈에, 프로젝트는 깊게 | — Pending |
| 프리랜서 경력을 DY Microfinance로 통합 | 사용자 요청 | — Pending |
| 프론트엔드 관점으로 프로젝트 재구성 | 프론트엔드 직무 타겟 | — Pending |

---
*Last updated: 2026-02-11 after initialization*
