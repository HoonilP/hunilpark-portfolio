# Roadmap: 박훈일 프론트엔드 포트폴리오

## Overview

This portfolio website showcases frontend development skills through a clean, performant Next.js application. The journey progresses from foundation (Next.js + i18n + Tailwind setup) through design system and layout components, to main page sections (hero, about, skills, project cards, experience, education, contact), and finally detailed project case study pages. Each phase delivers observable user-facing capabilities while demonstrating technical proficiency for Korean big tech hiring.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3, 4): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Foundation** - Next.js setup, i18n infrastructure, Tailwind, responsive base
- [x] **Phase 2: Layout & Design System** - Header/Footer, UI components, data layer
- [x] **Phase 3: Main Page Sections** - Hero, About, Skills, Projects cards, Experience, Education, Contact
- [ ] **Phase 4: Project Detail Pages** - Individual project case studies with technical depth

## Phase Details

### Phase 1: Foundation
**Goal**: Establish technical foundation with Next.js, internationalization, and responsive layout infrastructure
**Depends on**: Nothing (first phase)
**Requirements**: FOUND-01, FOUND-02, FOUND-03, FOUND-04
**Success Criteria** (what must be TRUE):
  1. User can view the site in both Korean and English (language toggle present)
  2. Site displays correctly on mobile and desktop viewports
  3. Tailwind CSS design system (colors, typography, spacing) is configured
  4. next-intl locale routing works (/ko and /en routes accessible)
**Plans**: 2 plans

Plans:
- [x] 01-01-PLAN.md — Scaffold Next.js, Tailwind v4 design tokens, next-intl i18n infrastructure
- [x] 01-02-PLAN.md — Responsive bilingual home page with language toggle

### Phase 2: Layout & Design System
**Goal**: Create reusable UI components and site-wide layout structure (header, footer, navigation)
**Depends on**: Phase 1
**Requirements**: FOUND-05
**Success Criteria** (what must be TRUE):
  1. User sees consistent header with navigation on all pages
  2. User can switch language via header toggle button
  3. User sees footer with contact links on all pages
  4. Reusable UI components (Button, Card, Badge) exist and are styled consistently
**Plans**: 2 plans

Plans:
- [x] 02-01-PLAN.md — Dark mode infrastructure, design tokens, UI components (Button, Card, Badge, Timeline)
- [x] 02-02-PLAN.md — Header, Footer, layout integration with ThemeProvider

### Phase 3: Main Page Sections
**Goal**: Build all main page content sections with bilingual support
**Depends on**: Phase 2
**Requirements**: HERO-01, HERO-02, HERO-03, ABOUT-01, ABOUT-02, ABOUT-03, SKILL-01, SKILL-02, SKILL-03, PROJ-01, PROJ-02, EXP-01, EXP-02, EXP-03, EXP-04, EDU-01, EDU-02, EDU-03, EDU-04, EDU-05, CONT-01, CONT-02, CONT-03
**Success Criteria** (what must be TRUE):
  1. User sees hero section with name, title, one-line intro, and contact links
  2. User sees about section with frontend-focused self-introduction
  3. User sees skills section with categorized tech stack (Frontend, Backend, DevOps, DB)
  4. User sees 3 project cards with title, description, tech badges, and thumbnails
  5. User sees experience timeline with DY Microfinance and Payment In-App roles
  6. User sees education section with university info, certifications, and achievements
  7. User sees contact section with email, phone, GitHub, and Velog links
  8. All sections display correct content when switching between Korean and English
**Plans**: 3 plans

Plans:
- [x] 03-01-PLAN.md — Hero, About, Contact sections + lucide-react icons + bilingual content
- [x] 03-02-PLAN.md — Skills and Projects sections with Card/Badge composition
- [x] 03-03-PLAN.md — Experience and Education timelines + main page composition

### Phase 4: Project Detail Pages
**Goal**: Create detailed project case study pages with technical implementation focus
**Depends on**: Phase 3
**Requirements**: PROJ-03, PROJ-04, PROJ-05, PROJ-06, PROJ-07
**Success Criteria** (what must be TRUE):
  1. User can click project card and navigate to dedicated detail page
  2. Project detail page shows frontend-focused technical implementation description
  3. Project detail page displays tech stack, team size, duration, and role information
  4. Project detail page includes GitHub/external links where applicable
  5. Project detail pages display correct content when switching between Korean and English
**Plans**: TBD

Plans:
- [ ] TBD after planning

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 2/2 | Complete ✓ | 2026-02-11 |
| 2. Layout & Design System | 2/2 | Complete ✓ | 2026-02-11 |
| 3. Main Page Sections | 3/3 | Complete ✓ | 2026-02-12 |
| 4. Project Detail Pages | 0/TBD | Not started | - |

---
*Roadmap created: 2026-02-11*
