# Feature Research

**Domain:** Project detail page enhancement — engineering-depth case studies for Korean big tech frontend hiring
**Researched:** 2026-03-02
**Confidence:** MEDIUM (Korean-specific recruiter preferences confirmed via community sources; global engineering case study patterns HIGH; specific Naver/Kakao format requirements LOW — no official public guidance found)

---

## Context

The existing project detail page structure ships: Overview → Implementation (problem/solution/result per feature) → Troubleshooting (problem/solution/result per issue) → Retrospective (growth/improvement). The structure is translated to KO + EN.

The v4.0 milestone goal is to restructure the same pages to surface engineering depth: alternatives considered, trade-off rationale, quantitative outcomes. This is NOT a rebuild — it is a content restructuring plus targeted component additions within the existing Next.js + next-intl stack.

**What already exists (do not recreate):**
- 6 project detail pages with bilingual content (~20,000+ words)
- Sidebar with metadata (tech stack, period, links)
- Breadcrumbs, hero image, architecture image, ProjectNavigation
- Translation keys structured as `ProjectDetail.[projectKey].implementation.featureN.{problem,solution,result}`
- Translation keys structured as `ProjectDetail.[projectKey].troubleshooting.issueN.{problem,solution,result}`

---

## Feature Landscape

### Table Stakes (Recruiters Expect These)

Features that Korean big tech recruiters assume exist in a serious engineering portfolio. Missing these = candidate feels junior or unprepared.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Problem → Process → Solution → Result narrative** | Korean recruiter consensus (velog, brunch, sparta blog): this four-beat structure is the baseline for any troubleshooting or implementation section | LOW | Already implemented. Upgrade needed: "process" is currently absent — implementations jump straight to solution without showing deliberation. Add an "alternatives considered" beat. |
| **Technology choice rationale** | All Korean portfolio guides agree: "why you chose each technology" is mandatory. Listing tech without rationale fails the "왜" test. Toss explicitly evaluates reasoning process. | LOW | Currently sidebar shows tech stack without rationale. Add per-technology "why" annotation, or surface it in the engineering challenge narrative. |
| **Quantitative outcomes** | Korean recruiters cite numbers as the gap between "I did X" and "X had Y impact." Examples found: "9.5억 절감", "응답 시간 10초→7.8초", "사용자 체류 시간 20% 증가". Absent metrics = unverifiable claims. | LOW | Existing content has qualitative results. Upgrade: convert "successfully resolved" to "reduced from X to Y" where real data exists. Do not fabricate numbers — only use data from actual project PDF sources. |
| **Contribution scope clarity** | For team projects (Scholarly Chain: 4-person team; Joshua: 2-person), recruiters need to know exactly what *you* built. "Developed frontend" is insufficient. | LOW | Existing overview.contribution field covers this partially. Needs more specificity per engineering challenge. |
| **Architecture diagram with explanation** | The existing architecture image renders with no textual context. Korean portfolio guides recommend visual + written explanation together. | LOW | Image exists. Add a 2–3 sentence caption or section explaining what the diagram shows and key design decisions visible in it. |
| **Visible thought process (사고방식 노출)** | Kakao Pay Securities interview feedback: recruiters want "2-hour discussion of your thought process." The portfolio primes that discussion. A portfolio that shows only outcomes leaves no foothold for deep technical interview questions. | MEDIUM | New requirement. The "why" and "what was tried first" narrative must be visible somewhere in each challenge. This is the core gap between current structure and v4.0 target. |

### Differentiators (Competitive Advantage)

Features that go beyond baseline and signal a senior engineering mindset — meaningful for Korean big tech targets where competition for frontend roles is high.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Alternatives analysis block** | Most Korean portfolio guides say "문제 → 시도했던 방법들 → 비교 → 알게 된 점" is the strongest troubleshooting format. Explicitly documenting what was tried and why it was rejected shows intellectual rigor above average candidates. | MEDIUM | Requires new translation key structure: `alternatives` field per challenge. New UI component to render alternatives in a visually distinct way (e.g., a comparison list or table). |
| **Trade-off comparison table** | Real engineering always involves trade-offs. Showing "Option A: fast but fragile / Option B: slower but maintainable → chose B because..." is a differentiator that invites technical conversation. Toss tech blog articles explicitly use this pattern. | MEDIUM | Requires new UI component (e.g., a small comparison table inline within a challenge section). Works best for 2–3 option decisions: library choices, architecture decisions, state management approaches. |
| **Decision rationale callout** | A highlighted "why we chose this" block — visually distinct from surrounding prose — makes the decision visible to a scanning recruiter. Toss/Kakao engineering blogs structure all articles around such explicit decision points. | LOW | Can be implemented as a styled blockquote or card with a "결정" or "Decision" label. Content already partially exists in translation files; needs extraction and visual treatment. |
| **Per-challenge difficulty/impact tagging** | Signals self-awareness and prioritization ability: "This was High complexity / High impact." Rare in Korean frontend portfolios but valued at senior+ levels where prioritization is evaluated. | LOW | Optional metadata tag per challenge. Label-only, no numerical rating (ratings are anti-features). Could be: 기술적 난이도 (Technical Difficulty), 프로젝트 임팩트 (Project Impact). |
| **Architecture diagram caption** | Adding 2–4 sentences explaining what the diagram depicts, what architectural decision it encodes, and why that structure was chosen — turns a static image into evidence of systems thinking. LINE Engineering blog uses this pattern on every technical post. | LOW | New translation key: `architectureCaption`. New UI: caption below the image. Bilingual. |
| **Retrospective "if I were to rebuild" section** | Documents what you would do differently with current knowledge. Shows growth mindset and honest self-assessment — valued in Korean tech culture where "성장" (growth) is a core hiring signal. | LOW | Existing retrospective.improvement field already exists but is vague. Sharpen to "구체적으로 어떤 기술/패턴으로 교체할 것인가" specificity. No new structure needed, only content upgrade. |
| **Project selection rationale (which to deep-dive)** | Not all 6 projects should receive the same depth. Explicitly choosing 2–3 projects for maximum engineering depth and explaining why those were selected signals priority thinking. | LOW | Not a UI feature but a content strategy decision: pick Joshua, DY CMS, Scholarly Chain as the deep-dive candidates (strongest frontend engineering stories). Others get upgraded baseline. |

### Anti-Features (Commonly Requested, Often Problematic)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| **Skill percentage bars on project page** | "Shows how much I used each technology" | Already identified as anti-feature project-wide. Percentage bars are subjective, meaningless, and actively signal poor judgment. Toss interviewers have noted this in feedback. | Show tech stack with role (primary/supporting) and specific context ("used for server-side rendering, not state management") — informative without fake quantification. |
| **"Impact" metrics fabricated for student projects** | "Looks impressive" | Korean recruiters cross-reference with GitHub commit history, README, and live demos. Fabricated numbers destroy credibility entirely if caught. Kakao hiring posts note authenticity is evaluated. | Use only numbers from actual project data (PDF source). For student/hackathon projects without real metrics, use process metrics ("reduced review cycle from X to Y hours" if documented) or omit numbers. |
| **Timeline/gantt of project phases** | "Shows project management skills" | Hiring managers for frontend roles care about technical decision-making, not Gantt chart literacy. Timeline adds visual noise without answering "how good is your code?" | Instead: mention the constraint (24-hour hackathon for Dino Go, 4-month capstone for Scholarly Chain) as context for trade-off decisions, not as a management artifact. |
| **Full feature list for every project** | "Proves breadth" | Comprehensive feature lists dilute focus. 10 features with shallow description = weaker signal than 2–3 features with deep engineering reasoning. Korean recruiting consensus: depth > breadth. | For each project, pick the 2–3 hardest engineering challenges. Everything else goes in sidebar metadata or is omitted. |
| **Generic "I learned X" retrospective** | "Shows growth" | Every portfolio has this. "I learned React hooks by building this" reads as noise to a recruiter evaluating 100+ portfolios. | Replace with: "If I rebuilt this now, I would use [X] instead of [Y] because [Z technical reason]" — specific, defensible, demonstrates actual depth of reflection. |
| **Separate "Tech Stack" section duplicating sidebar** | "Redundancy is completeness" | Already in sidebar. Repeating it in the main content body creates visual clutter and signals lack of editorial judgment. | Surface technology rationale inline within engineering challenge narratives, not as a standalone repeated section. |
| **"Version history" or changelog on portfolio** | "Shows iterative thinking" | Portfolio is a static credential document, not a product changelog. Version notes confuse the reader about current state. | Document evolution decisions in the retrospective section instead: "started with X approach, realized Y problem, migrated to Z." |

---

## Feature Dependencies

```
[Engineering Challenge Section (new)]
    └──requires──> [Existing Implementation Section] (replaces/extends it)
    └──requires──> [Translation key additions] (alternatives, rationale, decision fields)
    └──requires──> [ProjectContent.tsx refactor]

[Alternatives Analysis Block (new UI)]
    └──requires──> [Engineering Challenge Section]
    └──requires──> [New translation keys per project]

[Trade-off Comparison Table (new UI)]
    └──requires──> [Engineering Challenge Section]
    └──requires──> [New translation keys per project]
    └──optional──> [Alternatives Analysis Block] (both display decision data, can coexist)

[Decision Rationale Callout (new UI)]
    └──requires──> [Engineering Challenge Section]
    └──requires──> [New translation keys: rationale or decision field]

[Architecture Caption (new)]
    └──requires──> [Existing architecture image]
    └──requires──> [New translation key: architectureCaption]

[Quantitative Outcome Upgrade]
    └──requires──> [Content audit per project] (identify what can be quantified from PDF source data)
    └──feeds into──> [Engineering Challenge Section result fields]

[Retrospective Sharpening]
    └──requires──> [Existing retrospective.improvement keys]
    └──no new structure needed──> content rewrite only

[Per-challenge Difficulty/Impact Tags]
    └──requires──> [Engineering Challenge Section]
    └──enhances──> [Visual scannability] for recruiters
    └──optional──> [Alternatives Analysis Block] can exist without it

[Bilingual content update (KO + EN)]
    └──required by──> all new translation keys
    └──requires──> updating both /messages/ko.json and /messages/en.json simultaneously
```

### Dependency Notes

- **Engineering Challenge Section is the core restructure.** Everything else (alternatives, trade-offs, decision callout) is a sub-component within it. Build the section wrapper and translation schema first, then add visual components.
- **Translation keys must be bilingual from the start.** next-intl will throw if a key exists in one locale file but not the other. Add KO and EN simultaneously.
- **Trade-off Table requires careful content.** Only implement where a real 2–3 option decision exists with documented reasoning (not invented). Do not add a trade-off table if the content is "I tried one thing and it worked."
- **Quantitative upgrades require PDF source validation.** The PROJECT.md constraint is explicit: no fabricated content. Each numeric claim must trace to a real source. Audit before writing.
- **Retrospective sharpening is content-only** — no new component or translation key needed. Highest ROI for lowest effort.

---

## MVP Definition

This is a restructuring milestone on existing pages, not a new product. "Launch" means: all 6 project pages reflect the new structure.

### Launch With (v4.0 core)

Minimum set that makes the restructuring visibly different and meaningfully better for recruiters:

- [ ] **Engineering Challenge Section replacing current Implementation Section** — Reframes 2–3 features per project as "핵심 엔지니어링 챌린지" with context, problem, alternatives tried, decision rationale, solution, and quantitative result. Core content restructure.
- [ ] **Alternatives block per challenge** — At least one alternative explicitly named and rejected with reason. Even one sentence: "We considered [X] but rejected it because [Y]." Transforms narrative from "what I built" to "how I decided what to build."
- [ ] **Quantitative outcomes where available** — Every result that can be stated numerically should be. Where no real numbers exist, remove vague claims rather than inventing numbers.
- [ ] **Architecture caption** — 2–3 sentences under the architecture image for every project that has one.
- [ ] **Retrospective sharpening** — Replace generic "I learned X" with "If I rebuilt this, I'd use Y instead of Z because W."
- [ ] **Bilingual content parity** — All changes applied to both `ko.json` and `en.json`.

### Add After Core Works (v4.x — polish)

- [ ] **Trade-off comparison table** — Visual table for the 1–2 most significant decisions per project. Trigger: core restructure complete and content is confirmed accurate.
- [ ] **Decision rationale callout UI** — Styled block highlighting the key decision. Trigger: content written, needs visual emphasis.
- [ ] **Per-challenge difficulty/impact tags** — Label-only metadata. Trigger: design validation that it improves scannability without adding clutter.

### Future Consideration (v5+)

- [ ] **Project selection page ("start here" recommendation)** — Guide recruiters to the 2–3 deepest projects. Depends on whether the main projects list page supports featured/recommended sorting.
- [ ] **Inline code snippet per challenge** — For specific algorithmic or architecture decisions, showing actual code is maximum credibility. Requires syntax highlighting component and content authoring per project.

---

## Feature Prioritization Matrix

| Feature | Recruiter Value | Implementation Cost | Priority |
|---------|-----------------|---------------------|----------|
| Engineering Challenge Section (content restructure) | HIGH | MEDIUM (content rewrite + component refactor) | P1 |
| Alternatives block (at least 1 per challenge) | HIGH | LOW (new translation fields + minimal UI) | P1 |
| Quantitative outcomes upgrade | HIGH | LOW (content audit + rewrite) | P1 |
| Architecture caption | MEDIUM | LOW (new key + 2 sentences per project) | P1 |
| Retrospective sharpening | HIGH | LOW (content rewrite, no new structure) | P1 |
| Bilingual content parity | HIGH | MEDIUM (all keys × 2 locales) | P1 |
| Trade-off comparison table | MEDIUM | MEDIUM (new component + content) | P2 |
| Decision rationale callout (styled UI) | MEDIUM | LOW (styled blockquote variant) | P2 |
| Per-challenge difficulty/impact tags | LOW | LOW | P3 |

**Priority key:**
- P1: Required for v4.0 milestone to be complete
- P2: Adds clear value, implement when P1 is stable
- P3: Nice-to-have, defer

---

## Competitor Feature Analysis

Reference points studied: Toss Tech Blog, Kakao Tech Blog, LINE Engineering Blog, frontendcs.com case study index, Korean portfolio community guidance (velog, brunch, nbcamp sparta).

| Feature | Toss Tech Blog articles | LINE Engineering Blog | Top Korean portfolio guides | Current portfolio | v4.0 Target |
|---------|------------------------|----------------------|-----------------------------|-------------------|-------------|
| Problem framing | Opens with concrete pain point, not abstract challenge | Real service context (71M MAU) establishes stakes | "문제가 무엇이었는지 명확히" | Present (overview.background) | Sharpen to concrete constraint, not abstract |
| Alternatives considered | Explicit: RAG vs Plugin, low-level vs high-level API | Explicit: external library vs custom SVG component | "시도했던 방법들" recommended | Absent | Add as `alternatives` field |
| Trade-off statement | Always present, framed as cost vs benefit | Acknowledged ("maintenance cost" vs "80% of use cases") | Implicit in troubleshooting | Absent | Add decision rationale per challenge |
| Quantitative result | High specificity: "20배 노출", "5-6x CTR" | Performance metrics per device | "구체적인 숫자로" repeatedly emphasized | Partial (qualitative) | Upgrade all results to numbers where possible |
| Visual aid | Diagrams inline with explanation | Architecture diagrams with captions | Screenshots recommended | Image exists, no caption | Add architecture caption |
| Tech choice rationale | "왜 이 기술을 선택했는지" explicit in all articles | Pragmatic rationale for each tool | "채택 이유" mandatory | Sidebar lists tech, no rationale | Surface rationale in challenge narrative |
| Growth/retrospective | Rare in product blogs; implied in org learning | Team retrospectives mentioned | "성장한 부분" expected | Present but vague | Sharpen to "what I'd do differently and why" |

---

## Project-Specific Engineering Challenge Selection

Based on PROJECT.md content, the strongest candidates for deep-dive treatment (2–3 challenges per project with full alternatives + trade-off analysis):

| Project | Best Engineering Challenges | Quantitative Data Available | Depth Priority |
|---------|----------------------------|----------------------------|----------------|
| **Joshua** (Electron + Angular + KoGPT-2) | Electron IPC architecture for KoGPT-2 inference; Stripe payment integration for desktop app; cross-platform packaging | "90% accounting process automation" (DY CMS — note: this metric belongs to DY CMS not Joshua) | HIGH — unique stack, interesting trade-offs |
| **DY CMS** (Next.js + NestJS + PostgreSQL) | Frontend/backend separation architecture decision; dashboard data update strategy (polling vs websocket vs SSR); account process automation approach | "90% accounting process automation", full-stack solo ownership | HIGH — clearest before/after metrics |
| **Scholarly Chain** (Next.js + shadcn/ui + FCM + JWT) | JWT auto-refresh middleware design; FCM role-based push notification segmentation; role-based UI rendering strategy | "4인 팀, 프론트엔드 100% 담당", 30+ reusable components, 15+ pages | HIGH — team project with clear ownership scoping |
| **Dino Go** (Three.js + Sui blockchain + Walrus) | Google Maps + Three.js 3D map integration (two 3D contexts); Web3 wallet connection UX pattern; custom Web3 client library design (3 clients built) | "24-hour hackathon", 4 Move modules, 3 custom libraries | MEDIUM — hackathon constraints are themselves a trade-off story |
| **Retail Analysis** (YOLO + VanillaJS dashboard) | Dashboard data visualization architecture for real-time camera feed; VanillaJS choice over React for ML-embedded context | Heatmap, tracking data — qualitative; "말레이시아 현장 배포" | MEDIUM — frontend work is narrower |
| **Art War** (Next.js + NestJS + Solidity + Monad) | Solidity smart contract interaction from frontend; Monad blockchain integration UX | Newest project, less source data in PROJECT.md | LOW — insufficient source data for deep content |

---

## Sources

- [신입 개발자의 포트폴리오 작성법 — velog.io/@yoosion030](https://velog.io/@yoosion030/%EC%8B%A0%EC%9E%85%EA%B0%9C%EB%B0%9C%EC%9E%90%ED%8F%AC%ED%8A%B8%ED%8F%B4%EB%A6%AC%EC%98%A4%EC%9E%91%EC%84%B1%EB%B2%95) — MEDIUM confidence (community, 2024, verified by multiple corroborating sources)
- [2024 프론트엔드 포트폴리오 모음 — spartaclub.kr](https://spartaclub.kr/blog/2024-frontend-portfolio) — MEDIUM confidence (Korean bootcamp aggregate, 2024)
- [신입 개발자에게 기대하는 것 — brunch.co.kr/@skykamja24/640](https://brunch.co.kr/@skykamja24/640) — MEDIUM confidence (Korean recruiter perspective, community)
- [이직 할거야? (카카오페이증권 합격 후기) — velog.io/@haryan248](https://velog.io/@haryan248/%EC%9D%B4%EC%A7%81-%ED%95%A0%EA%B1%B0%EC%95%BC-feat.-%EC%B9%B4%EC%B9%B4%EC%98%A4%ED%8E%98%EC%9D%B4%EC%A6%9D%EA%B6%8C-%ED%95%A9%EA%B2%A9-%ED%9B%84%EA%B8%B0) — LOW confidence (single anecdote, Kakao affiliate company)
- [Toss Tech Blog — toss.tech](https://toss.tech/) — HIGH confidence (official Toss engineering blog, current)
- [LINE Engineering Blog — Introducing Web Frontend Team](https://engineering.linecorp.com/en/blog/team-and-project-introducing-the-team-developing-web-frontend-for-line-user-services/) — HIGH confidence (official LINE engineering blog)
- [Frontend Case Studies index — frontendcs.com](https://frontendcs.com/) — HIGH confidence (curated, 1,076 case studies from 177 companies, 2010–2026)
- [GitHub: andrew--r/frontend-case-studies](https://github.com/andrew--r/frontend-case-studies) — HIGH confidence (curated list, frequently updated)
- [합격한 포트폴리오 제작기(3탄) — brunch.co.kr/@new-una/24](https://brunch.co.kr/@new-una/24) — MEDIUM confidence (Korean UX/product portfolio guide, structural patterns applicable)
- [Building an Effective Frontend Developer Portfolio — frontendmentor.io](https://www.frontendmentor.io/articles/building-an-effective-frontend-developer-portfolio--7cE8BfMG_) — MEDIUM confidence (global best practices, 2024–2025)

---

*Feature research for: project detail page restructuring, v4.0 milestone — Korean big tech frontend hiring target*
*Researched: 2026-03-02*
