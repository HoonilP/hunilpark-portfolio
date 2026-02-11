# Project Research Summary

**Project:** Frontend Developer Portfolio Website
**Domain:** Portfolio Website (targeting Korean big tech companies)
**Researched:** 2026-02-11
**Confidence:** MEDIUM-HIGH

## Executive Summary

A frontend developer portfolio targeting Korean big tech companies (Samsung, Naver, Kakao) requires a fast, mobile-first, bilingual (Korean/English) showcase of 3-5 polished projects. Recruiters spend approximately 90 seconds evaluating portfolios, prioritizing performance, clear project documentation, and quantifiable technical achievements over flashy animations or generic content.

The recommended approach combines Next.js 15.5 with App Router (Server Components for optimal performance), Tailwind CSS v4 (5-100x faster builds), next-intl for bilingual support, and CSS animations over heavy libraries. The architecture follows a hybrid static generation model with locale-based routing, atomic component design, and TypeScript data files rather than a backend database. This stack is battle-tested, demonstrates 2026 best practices, and achieves the sub-3-second load times that 80% of recruiters expect.

Critical risks include: (1) PM-centric project narratives that fail to showcase frontend technical depth, (2) treating internationalization as an afterthought leading to broken Korean layouts, (3) poor Core Web Vitals performance from misconfigured images or request waterfalls, and (4) generic content that doesn't position the developer as a frontend specialist. Mitigation requires technical-first project rewrites, i18n infrastructure from day one, continuous performance monitoring, and focused positioning around React/Next.js expertise.

## Key Findings

### Recommended Stack

Next.js 15.5 with App Router is the 2026 industry standard for React portfolios, providing Server Components (20-30% bundle size reduction), automatic code splitting, and TypeScript 5.9 support with typed routes. Tailwind CSS v4 offers 5-100x faster builds with modern CSS-based configuration. For Korean/English bilingual support, next-intl is built specifically for App Router (react-i18next is Pages Router legacy). CSS animations are preferred over Framer Motion (saves 50KB) for the clean, fast aesthetic Korean companies expect.

**Core technologies:**
- **Next.js 15.5 + React 19 + TypeScript 5.9**: Production-ready Server Components, typed routes, zero-config deployment to Vercel/Cloudflare Pages
- **Tailwind CSS v4**: 5-100x faster builds, CSS-native config, minimal custom CSS demonstrates mastery
- **next-intl 4.8.2**: App Router-native i18n with JSON translations, locale routing via `[locale]` segment
- **CSS Animations (not Framer Motion)**: Native browser performance, zero bundle cost, demonstrates CSS proficiency
- **Biome (or ESLint)**: 10-25x faster linting/formatting, single tool, recommended by Next.js 15.5
- **pnpm or npm**: Package management (pnpm 3.7x faster, npm maximum compatibility)
- **Vercel or Cloudflare Pages**: Zero-config deployment, free tier sufficient, edge network performance

**Critical versions:**
- Tailwind v4 requires Safari 16.4+, Chrome 111+, Firefox 128+ (acceptable for 2026 portfolio)
- React 19 stable since Dec 2024, required for Next.js 15+
- Next.js 15.5 is latest stable (16.x available but fewer production deployments)

### Expected Features

Recruiters expect fast load times (<3s), mobile-first responsive design, and bilingual Korean/English toggle as table stakes. Missing any of these results in immediate rejection.

**Must have (table stakes):**
- **Fast load time (<3s LCP)** — 80% of recruiters check portfolios; slow = unprofessional
- **Mobile-first responsive design** — 50%+ traffic is mobile; recruiters check on phone
- **3-5 polished projects with live demos** — Quality over quantity; curation shows judgment
- **Korean/English language toggle** — Korean big tech expects bilingual fluency demonstration
- **Project case studies** — Problem → Solution → Results format (800-1500 words); recruiters want problem-solving process
- **Clear tech stack per project** — Keyword visibility (React, TypeScript, etc.) for recruiter searches
- **Contact section with multiple methods** — Email, LinkedIn, GitHub minimum; friction = lost opportunity
- **GitHub profile link** — Validates code quality and contribution consistency
- **About section (brief)** — 2-3 paragraphs: who you are, what you do, what you're looking for
- **Skills overview** — Categorized list (Languages, Frameworks, Tools); avoid rating bars

**Should have (competitive differentiators):**
- **Quantifiable metrics in projects** — "Reduced load time from 3.2s to 1.1s" proves business impact
- **Performance documentation** — Lighthouse reports, bundle analysis, optimization decision log
- **Architecture diagrams** — Component diagrams show system thinking beyond coding
- **"What I'd Do Next" sections** — 2-3 bullet points per project shows growth mindset
- **Demo videos or GIFs** — 10-20s videos/optimized GIFs (<500KB) for interactive features
- **Accessibility compliance details** — WCAG 2.1 AA compliance notes, screen reader testing
- **Real-world problem solving** — Portfolio projects address actual needs (not just tutorials)

**Defer (v2+):**
- Open source contribution section — High complexity; requires meaningful contributions first
- AI tool integration mentions — Low value until standard practice
- Advanced accessibility documentation — Compliance first, documentation later
- Architecture diagrams for simple projects — Add when applying to senior roles

**Explicitly avoid (anti-features):**
- **Overly complex animations** — Distracts from content, hurts performance; recruiters value clarity over flashiness
- **Splash/loading screens** — Adds friction; users close tabs
- **Too many projects (>6)** — Dilutes quality; appears unfocused
- **Skill rating bars** — Subjective, meaningless ("80% React"?); wastes space
- **Auto-playing music/videos** — Annoying, accessibility fail
- **Generic content** — "I'm a passionate developer" = everyone says this
- **Tutorial clones without customization** — Experienced recruiters recognize them

### Architecture Approach

Next.js App Router portfolios with internationalization follow a server-first hybrid architecture: locale-based routing via `[locale]` dynamic segment, atomic component hierarchy (ui atoms → molecules → section organisms → page composition), static TypeScript data files in `lib/data/` (no database needed), and next-intl middleware for automatic locale detection. Server Components are default; only interactive leaves (ContactForm, LocaleSwitcher, ProjectGallery) use "use client".

**Major components:**
1. **[locale] routing layer** — Middleware detects locale, routes to `/ko` or `/en/`, NextIntlClientProvider wraps layout
2. **Atomic UI foundation** — Button, Card, Badge primitives in `components/ui/` used by all sections
3. **Section organisms** — Hero, About, Skills, Projects, Experience, Education, Contact in `components/sections/`
4. **Data layer** — TypeScript files in `lib/data/` (projects.ts, skills.ts, experience.ts) with locale keys for bilingual content
5. **Layout components** — Header with LocaleSwitcher, Footer; consistent across all pages
6. **Page composition** — `app/[locale]/page.tsx` composes sections in order; `app/[locale]/projects/[slug]/page.tsx` for detail pages
7. **Static generation** — `generateStaticParams` for all locales and project slugs; full static export to HTML/CSS/JS

**Key patterns:**
- **Server Component default** — Only add "use client" when hitting limitation (hooks, events, browser APIs)
- **Direct data import** — Server Components import data files directly; no API routes needed
- **Composition over configuration** — Build pages by composing small, focused components
- **Locale-aware content** — Data objects have locale keys (`title: { ko: '...', en: '...' }`) for type-safe access
- **Static generation with dynamic routes** — Use generateStaticParams to pre-render all locale/slug combinations

**Build order:**
1. **Foundation** — Next.js setup, i18n config, Tailwind, base layout with [locale] routing
2. **Design system** — UI atoms (Button, Card, Badge), utility functions (cn helper)
3. **Data layer** — TypeScript interfaces and data files (projects, skills, experience)
4. **Layout** — Header, Footer, LocaleSwitcher (depends on ui atoms + i18n)
5. **Sections** — Hero → About → Skills → Projects → Experience → Education → Contact (depends on ui + data + layout)
6. **Main page** — Compose all sections (depends on sections)
7. **Project details** — ProjectGallery component, project/[slug]/page.tsx (can parallel with Phase 5-6)
8. **Polish** — Metadata, loading states, error boundaries, 404 page

### Critical Pitfalls

Based on research into portfolio mistakes and Next.js performance issues, the following pitfalls cause rewrites, major issues, or immediate hiring rejection.

1. **PM-centric project narratives** — Describing projects as "managed team," "coordinated features" instead of "built X using Y to solve Z." Korean tech companies want frontend technical depth, not PM activities. **Prevention:** Reframe ALL projects with technical focus: frontend challenges, performance optimization, state management decisions, architecture rationale. Include quantifiable metrics.

2. **Poor Core Web Vitals performance** — 64% of websites fail all three metrics. Misconfigured next/image (missing sizing), request waterfalls (sequential await), heavy animations, or unoptimized scripts cause slow loads. Korean companies with 224 Mbps infrastructure expect technical excellence. **Prevention:** Configure next/image with proper sizing from start, use Promise.all for parallel requests, monitor Lighthouse during development, target LCP <2.5s.

3. **Missing or broken bilingual support** — Treating i18n as afterthought results in broken Korean layouts (text longer than English), machine-translated content, or missing translations. Korean recruiters get inferior experience. **Prevention:** Set up next-intl i18n routing from Day 1, design layouts with 30% flex for Korean text, write content in both languages simultaneously (not translate later), use formal honorifics (존댓말) in Korean, test both versions equally.

4. **Skill bars and percentage charts** — "JavaScript 80%" provides zero meaningful information. Signals junior developer or cargo-culting. **Prevention:** Show skills through projects with tangible outcomes, technology tags with context, code quality indicators (TypeScript strict mode, testing coverage, performance metrics). Ban skill percentages explicitly.

5. **Overly complex animations** — Elaborate 3D effects, heavy parallax, cutting-edge visuals slow performance, distract from content, break on mobile. **Prevention:** Animation budget of 2-3 purposeful animations maximum, use hardware-accelerated CSS properties only (transform, opacity), avoid animating layout properties, test on mid-range mobile devices, respect prefers-reduced-motion.

## Implications for Roadmap

Based on combined research, the portfolio requires a linear build progression due to dependencies (i18n must precede content, UI atoms must precede sections), with early focus on technical setup and content strategy to avoid rework.

### Phase 1: Foundation & Content Strategy
**Rationale:** i18n infrastructure, performance monitoring, and project narrative rewrites must happen before building features. Starting with PM-centric content or English-only setup requires expensive rework later.

**Delivers:**
- Next.js 15.5 + TypeScript + Tailwind v4 scaffolding
- next-intl routing configuration ([locale] segment, middleware)
- Lighthouse CI and Core Web Vitals tracking setup
- Project content audited and rewritten with technical focus
- Bilingual content framework (messages/ko.json, messages/en.json)

**Addresses:**
- Pitfall #1 (PM narratives) via content rewrite before implementation
- Pitfall #2 (performance) via monitoring from start
- Pitfall #3 (i18n) via architecture from Day 1

**Avoids:** Building features before i18n (rework), writing PM-centric content (rejection), missing performance budget (technical debt)

### Phase 2: Design System & Data Layer
**Rationale:** UI atoms and data structures are dependencies for all sections. Building these first enables parallel section development and ensures consistency.

**Delivers:**
- Atomic UI components (Button, Card, Badge) with Tailwind variants
- Utility functions (cn helper for class merging)
- TypeScript data interfaces (Project, Skill, Experience, Education)
- Data files in lib/data/ with bilingual locale keys
- Translation content populated in messages/ files

**Uses:**
- Tailwind CSS v4 for utility-first styling
- clsx + tailwind-merge for dynamic classes
- TypeScript for type-safe data structures

**Implements:** Atomic component hierarchy (atoms layer), data management strategy (TypeScript files, not database)

### Phase 3: Layout & Core Components
**Rationale:** Header, Footer, and LocaleSwitcher are needed by all pages. Building layout first provides the frame for content sections.

**Delivers:**
- Header component with navigation links (i18n-aware)
- LocaleSwitcher component (Client Component for route switching)
- Footer component with contact links
- Base layout.tsx with NextIntlClientProvider

**Addresses:**
- Feature requirement: bilingual toggle
- Architecture pattern: i18n navigation wrappers

### Phase 4: Main Page Sections
**Rationale:** Build sections in top-to-bottom order (Hero → About → Skills → Projects → Experience → Education → Contact) for logical development flow. Each section demonstrates different technical skills.

**Delivers:**
- Hero section with CTA (Server Component)
- About section (2-3 paragraphs, bilingual)
- Skills section (categorized list, NO rating bars per Pitfall #4)
- Projects section (3-5 featured projects with tech stack badges)
- Experience section (work history timeline)
- Education section (educational background)
- Contact section (Client Component with form validation)

**Addresses:**
- Table stakes features: About, Skills, Contact, Projects overview
- Pitfall #4 (skill bars) via explicit ban, showing skills through projects instead
- Pitfall #7 (poor documentation) via project card template with context

### Phase 5: Project Detail Pages
**Rationale:** Detail pages can be built after main page sections are complete, or in parallel during Phase 4. Each project page is independent.

**Delivers:**
- Project detail page template (app/[locale]/projects/[slug]/page.tsx)
- Project case studies (Problem → Solution → Results format, 800-1500 words)
- ProjectGallery component (Client Component for image carousel)
- Quantifiable metrics per project (Lighthouse scores, performance improvements)
- "What I'd Do Next" sections (growth mindset demonstration)
- Live demo links + GitHub links

**Addresses:**
- Table stakes features: project case studies, live demos, technical context
- Differentiators: quantifiable metrics, performance documentation
- Pitfall #5 (tutorial projects) via audit and exclusion
- Pitfall #7 (poor context) via case study template

### Phase 6: Polish & Optimization
**Rationale:** Polish comes after core functionality is working. Performance audit, accessibility testing, and SEO optimization are final validation steps.

**Delivers:**
- SEO metadata (generateMetadata for all pages, Open Graph tags)
- Accessibility audit (WCAG 2.1 AA compliance, keyboard navigation, screen reader testing)
- Performance optimization (image optimization, lazy loading, code splitting verification)
- Error handling (error.tsx, not-found.tsx with i18n)
- Demo video/GIF creation for interactive features
- Link verification (all contact links, live demos, GitHub links working)

**Addresses:**
- Differentiators: accessibility compliance, performance documentation
- Pitfall #2 (Core Web Vitals) via final audit
- Pitfall #8 (inaccessible design) via WCAG testing
- Pitfall #11 (poor SEO) via metadata completion

### Phase Ordering Rationale

- **Linear dependencies:** i18n routing (Phase 1) → UI atoms (Phase 2) → Layout (Phase 3) → Sections (Phase 4) → Pages (Phase 5) → Polish (Phase 6)
- **Critical path:** Foundation must happen first to avoid rework; design system must precede sections; polish comes last
- **Risk mitigation:** Early content strategy (Phase 1) addresses PM narrative pitfall before writing project descriptions
- **Performance focus:** Monitoring setup in Phase 1, continuous validation in Phases 2-5, final audit in Phase 6
- **Bilingual from start:** i18n in Phase 1 prevents broken layouts and translation debt

### Research Flags

**Phases likely needing deeper research during planning:**
- **Phase 1:** Next.js 15.5 i18n setup with next-intl — Specific configuration for App Router locale routing (research-phase for middleware, routing.ts, request.ts files)
- **Phase 4 (Contact section):** Contact form implementation — Form validation libraries (React Hook Form + Zod), API route for form submission, email service integration (research-phase for form handling patterns)
- **Phase 5:** Project case study writing — How to frame technical narratives for Korean big tech audience (may need Korean developer review or hiring manager input)

**Phases with standard patterns (skip research-phase):**
- **Phase 2 (Design system):** Tailwind CSS setup, atomic components — Well-documented, established patterns
- **Phase 3 (Layout):** Header/Footer components — Straightforward implementation
- **Phase 4 (Hero, About, Skills):** Simple content sections — Standard Next.js components
- **Phase 6 (SEO, Accessibility):** Metadata and WCAG compliance — Next.js docs cover SEO, WCAG checklist available

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Next.js 15.5, React 19, Tailwind v4, next-intl all verified with official docs and 2026 sources. Version numbers confirmed from release notes. |
| Features | MEDIUM | General portfolio best practices verified across 10+ sources. Korean big tech specifics have LOWER confidence (limited Korean-specific sources). Table stakes features have HIGH confidence (recruiter expectation articles), Korean cultural preferences need validation. |
| Architecture | HIGH | Next.js App Router patterns verified with official docs. next-intl setup confirmed from library docs. Component hierarchy and data management patterns standard for 2026. |
| Pitfalls | MEDIUM-HIGH | Performance pitfalls verified with Next.js production checklist and Core Web Vitals research. Portfolio mistakes verified across multiple developer articles. Korean market specifics have LOWER confidence (extrapolated from general Korean hiring practices). |

**Overall confidence:** MEDIUM-HIGH

General portfolio and Next.js technical patterns are HIGH confidence (official sources, multiple verification). Korean market-specific preferences are MEDIUM-LOW confidence (limited Korean sources, need validation with actual Korean recruiters or developers at target companies).

### Gaps to Address

Research identified these gaps requiring attention during planning or validation:

- **Korean big tech hiring norms:** What do Naver/Kakao/Samsung recruiters actually prioritize? (Need informational interviews with Korean developers at these companies or recruiters)
- **Portfolio vs PDF resume balance:** Korean hiring may expect both web portfolio and PDF resume; clarify workflow and whether to provide downloadable resume
- **Design aesthetic preferences:** Korean web design trends may differ from Western minimal style; validate clean/fast approach vs Korean design conventions
- **Certification importance:** Unclear if Korean companies value AWS/GCP certifications on portfolio or GitHub profile activity
- **Professional photo expectation:** Korean job applications often expect professional photo; validate if portfolio should include photo
- **Korean language quality:** Formal honorifics (존댓말) usage confirmed, but translation quality should be reviewed by native Korean speaker before launch
- **Contact method preferences:** Validate if Korean recruiters prefer specific contact methods (email vs LinkedIn vs direct message)

**How to handle during planning:**
- Phase 1 (Content Strategy): Reach out to Korean developers or recruiters for validation interview (optional but recommended)
- Phase 3 (Content Writing): Have native Korean speaker review all Korean translations before Phase 4 implementation
- Phase 5 (Polish): Test portfolio with Korean developers for cultural fit and design aesthetic feedback

## Sources

### Primary Sources (HIGH confidence)

**Next.js & React:**
- [Next.js 15.5 Release](https://nextjs.org/blog/next-15-5) — Latest stable version, Turbopack production-ready
- [Next.js Project Structure](https://nextjs.org/docs/app/getting-started/project-structure) — Official folder conventions
- [Next.js Static Exports](https://nextjs.org/docs/app/guides/static-exports) — Static generation guide
- [React 19.2 Release](https://react.dev/blog/2025/10/01/react-19-2) — Stable version with Server Components

**Internationalization:**
- [next-intl App Router Setup](https://next-intl.dev/docs/getting-started/app-router) — Official i18n configuration
- [next-intl Locale-Based Routing](https://next-intl.dev/docs/routing/setup) — Locale routing patterns

**Styling:**
- [Tailwind CSS v4.0 Release](https://tailwindcss.com/blog/tailwindcss-v4) — New CSS-based config, performance improvements
- [Tailwind CSS with Next.js](https://tailwindcss.com/docs/guides/nextjs) — Official integration guide

**Performance:**
- [Next.js Production Checklist](https://nextjs.org/docs/app/guides/production-checklist) — Official performance guide
- [Next.js Data Fetching](https://nextjs.org/docs/app/getting-started/fetching-data) — Server Components data access

### Secondary Sources (MEDIUM confidence)

**Portfolio Best Practices:**
- [What Recruiters Look for in Developer Portfolios](https://pesto.tech/resources/what-recruiters-look-for-in-developer-portfolios) — 90-second rule, project expectations
- [Top 10 Full Stack Portfolio Projects for 2026](https://www.nucamp.co/blog/top-10-full-stack-portfolio-projects-for-2026-that-actually-get-you-hired) — Project quality over quantity
- [25 Web Developer Portfolio Examples](https://www.hostinger.com/tutorials/web-developer-portfolio) — Feature expectations
- [Building an Effective Frontend Developer Portfolio](https://www.frontendmentor.io/articles/building-an-effective-frontend-developer-portfolio--7cE8BfMG_) — Frontend-specific guidance

**Portfolio Mistakes:**
- [5 Mistakes Developers Make in Their Portfolio Websites](https://www.devportfoliotemplates.com/blog/5-mistakes-developers-make-in-their-portfolio-websites) — Skill bars, complexity, mobile testing
- [7 Deadly Sins of Developer Portfolios](https://pesto.tech/resources/7-deadly-sins-of-developer-portfolios-and-how-to-avoid-them) — Anti-patterns
- [Five Common Mistakes Found on Frontend Portfolio Sites](https://medium.com/illumination/five-common-mistakes-found-on-frontend-portfolio-sites-687b74063f9d) — Frontend-specific issues

**Next.js Performance:**
- [7 Common Performance Mistakes in Next.js](https://medium.com/full-stack-forge/7-common-performance-mistakes-in-next-js-and-how-to-fix-them-edd355e2f9a9) — Image optimization, request waterfalls
- [Next.js Image Component: Performance and CWV](https://pagepro.co/blog/nextjs-image-component-performance-cwv/) — Core Web Vitals optimization
- [React & Next.js Best Practices in 2026](https://fabwebstudio.com/blog/react-nextjs-best-practices-2026-performance-scale) — Current patterns

**Accessibility:**
- [WCAG 2.1 & 2.2 Compliance Checklist 2026](https://mivibzzz.com/resources/accessibility/wcag-checklist) — Standards compliance
- [A Detailed Guide to WCAG Compliance in 2026](https://www.accessibilitychecker.org/guides/wcag/) — Testing approach

**Architecture:**
- [Next.js App Router Project Structure Guide](https://makerkit.dev/blog/tutorials/nextjs-app-router-project-structure) — 2026 folder organization
- [Next.js Architecture 2026](https://www.yogijs.tech/blog/nextjs-project-architecture-app-router) — Server-first patterns
- [Atomic Design + Next.js 2026](https://medium.com/@buwanekasumanasekara/atomic-design-meets-feature-based-architecture-in-next-js-a-practical-guide-c06ea56cf5cc) — Component hierarchy

### Tertiary Sources (LOW-MEDIUM confidence)

**Korean Market Context:**
- [Top 10 Tips for Building a Stand-Out Tech Portfolio in South Korea](https://www.nucamp.co/blog/coding-bootcamp-south-korea-kor-top-10-tips-for-building-a-standout-tech-portfolio-in-south-korea) — Korean hiring preferences
- [Gwak Tae-wook Portfolio](https://gwak2837.vercel.app/ko) — Real 2026 Korean developer portfolio example
- [GitHub: Awesome Korean Resume](https://github.com/9j/awesome-korean-resume) — Korean resume best practices
- [Digital 2026: South Korea](https://datareportal.com/reports/digital-2026-south-korea) — Infrastructure context (224 Mbps mobile speeds)

**Development Tools:**
- [Biome vs ESLint 2025](https://medium.com/better-dev-nextjs-react/biome-vs-eslint-prettier-the-2025-linting-revolution-you-need-to-know-about-ec01c5d5b6c8) — Modern linting options
- [Package Managers Comparison 2026](https://pockit.tools/blog/pnpm-npm-yarn-bun-comparison-2026/) — pnpm vs npm performance

---

**Research completed:** 2026-02-11
**Ready for roadmap:** Yes

**Next steps:** Use this summary to create initial roadmap with 6 phases. Phase 1 and Phase 4 (Contact section) likely need research-phase for deep dives. Korean cultural validation recommended during Phase 1 content strategy.
