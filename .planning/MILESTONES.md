# Project Milestones: 박훈일 프론트엔드 포트폴리오

## v3.0 Interactive Portfolio (Archived: 2026-03-02)

**Delivered:** /lab2 라우트에 Three.js/R3F 기반 3D 인터랙티브 포트폴리오의 기반 인프라, 스크롤 카메라 시스템, 6개 챕터 3D 씬을 구축. Phases 9-11 (Content Overlay, Typography, Effects Polish)은 미완료 상태로 아카이브.

**Phases completed:** 6-8 of 6-11 (17 plans total)

**Key accomplishments:**
- /lab2 라우트 WebGL 인프라 — Canvas, 로딩 화면, 뷰포트 게이트, 번들 격리
- Lenis 스무스 스크롤 + 6-챕터 카메라 웨이포인트 시스템
- IntroScene + 5개 프로젝트 3D 씬 + ParticleField + TexturePlane
- SceneManager visibility-toggle 아키텍처
- 단일 Canvas 생존 패턴, 스크롤 권한 단일화, useRef 애니메이션 값 패턴 확립

**Stats:**
- Phases 6-8, 17 plans
- 2026-02-27 → 2026-03-01

**Archived reason:** 프로젝트 상세 페이지 콘텐츠 고도화 우선으로 방향 전환. lab2 코드는 v4.0에서 완전 삭제.

---

## v2.0 Content Expansion (Shipped: 2026-02-13)

**Delivered:** 2개 신규 프로젝트(Scholarly Chain, Dino Go) 추가 및 전체 프로젝트 실제 이미지 적용으로 포트폴리오를 3→5개 프로젝트로 확장.

**Phases completed:** 5 (2 plans total)

**Key accomplishments:**
- Scholarly Chain (Hyperledger Fabric 블록체인) 프로젝트 추가 — shadcn/ui, JWT, FCM 기반 풀 케이스 스터디
- Dino Go (Sui 블록체인 NFT 게임) 프로젝트 추가 — Three.js, Google Maps, Web3 기반 풀 케이스 스터디
- 13개 소스 이미지를 최적화된 WebP로 변환 (hero q90, architecture q75, thumbnail q60)
- 전체 프로젝트 placeholder를 실제 이미지로 교체 (next/image 컴포넌트)
- 5개 프로젝트 카드에 썸네일 이미지 추가

**Stats:**
- 23 files created/modified
- ~9,274 lines of code (TypeScript, TSX, CSS, JSON)
- 1 phase, 2 plans, 4 tasks
- 1 day (2026-02-12 → 2026-02-13)

**Git range:** `025b9d7` → `a3f759a`

**What's next:** 사용자가 추후 애니메이션/3D/마이크로 인터랙션 작업 요청 시 새 마일스톤 생성

---

## v1 Portfolio MVP (Shipped: 2026-02-12)

**Delivered:** Complete bilingual portfolio website with 7-section main page and 3 project detail case studies targeting Korean big tech frontend roles.

**Phases completed:** 1-4 (9 plans total)

**Key accomplishments:**
- Next.js 16 + Tailwind v4 + next-intl bilingual infrastructure with automatic locale routing
- Dark mode design system with reusable UI component library (Button, Card, Badge, Timeline)
- 7-section responsive main page: Hero, About, Skills, Projects, Experience, Education, Contact
- 3 project detail pages with ~15,000 words of bilingual technical content following Korean portfolio standards
- Full Korean/English language switching across all pages with locale-preserved navigation
- Responsive layout with sticky header, mobile hamburger menu, and consistent design system

**Stats:**
- 77 files created/modified
- ~2,006 lines of code (TypeScript, TSX, CSS, JSON)
- 4 phases, 9 plans
- 2 days from start to ship

**Git range:** `9e4cb55` → `c19f1dd`

**What's next:** v2 enhancements — SEO optimization, project screenshots, dark mode polish, accessibility improvements, additional projects

---
