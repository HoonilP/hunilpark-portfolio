# Project Research Summary

**Project:** Portfolio v4.0 — Engineering-Depth Project Detail Pages
**Domain:** Next.js App Router content restructuring + engineering case study presentation for Korean big tech frontend hiring
**Researched:** 2026-03-02
**Confidence:** HIGH (architecture from live codebase; stack npm-verified; pitfalls codebase-confirmed)

## Executive Summary

This milestone is a content restructuring and targeted component addition — not a rebuild. The existing 6 project detail pages (built on Next.js 16, next-intl v4, Tailwind v4) have structurally sound pages but surface engineering outcomes without the decision-making narrative that Korean big tech recruiters (Toss, Kakao, Naver, LINE) explicitly evaluate. Research confirms that the gap is not technology — it is the absence of "alternatives considered," "why we chose this," and quantitative before/after measurements in the current content schema. The recommended approach restructures the i18n translation schema to unify `implementation` and `troubleshooting` into a single `challenges` block with explicit `alternatives`, `decision`, and `outcome` fields, adds an `outcomes` section for metric cards, and introduces 6 new server components to render them — all at zero client bundle cost.

The only new package needed is `shiki` v4 for server-side syntax highlighting. Every other enhancement — metric visualization, comparison tables, architecture captions, retrospective sharpening — is achievable with Tailwind CSS utilities and native HTML server components. Research strongly recommends against adding chart libraries (Recharts: 700KB), diagram libraries (Mermaid: 69MB unpacked), or component libraries (shadcn/ui) that would introduce bundle weight, inconsistency with the existing design system, or client-side JavaScript where none is needed.

The two most significant risks are operational, not architectural. First, the lab2 cleanup phase must not accidentally remove GSAP, which is consumed by the main site's `HorizontalScrollWrapper.tsx` — this dependency is invisible to someone scanning only the lab2 directory. Second, i18n schema renames cause silent empty sections because `t.has()` returns false without throwing — content and component changes must be made atomically and verified with a bilingual parity script in both locales. Both risks are entirely preventable with the audit procedures documented in PITFALLS.md.

---

## Key Findings

### Recommended Stack

The stack addition is minimal by design. One new package (`shiki ^4.0.0`) handles server-side syntax highlighting via Next.js Server Components, outputting pre-colored HTML with CSS variable dual-theme support that integrates directly with the existing `data-theme` attribute from next-themes. No runtime JavaScript is shipped for code blocks. Everything else — metric bars, comparison tables, architecture captions — is pure Tailwind CSS on server components.

Packages explicitly rejected by research: `react-syntax-highlighter` (ships Prism to the client), `recharts`/`tremor`/`victory` (700KB+ for static numbers), `mermaid` (69MB unpacked, client-only), `@tailwindcss/typography` (v4 CSS-first config makes a manual `.prose-technical` class simpler), and `framer-motion`/`motion` (the v4.0 milestone removes animation libraries from lab2 cleanup — new animations must be CSS transitions). The v3.0 packages (`three`, R3F, GSAP, lenis) stay in `package.json` because the `/lab` route and `HorizontalScrollWrapper.tsx` still need them.

**Core technologies:**
- `shiki ^4.0.0`: Server-side syntax highlighting — zero client JS, VS Code grammar quality, dual-theme via CSS variables, integrates with existing `data-theme` attribute
- Tailwind CSS v4 (existing): Metric bars, comparison tables, typography classes — no library needed for static content
- next-intl v4 (existing): Extended i18n schema with `challenges`, `outcomes`, `alternatives` fields using existing `t.has()` pattern
- Native HTML + inline SVG (existing): Tradeoff tables and architecture diagrams — no Mermaid

### Expected Features

Research found clear consensus across Korean recruiting guides, Toss/LINE/Kakao tech blogs, and frontendcs.com case studies on what elevates a portfolio from "junior who built things" to "engineer who decides things."

**Must have (table stakes — P1 for v4.0):**
- Engineering Challenge Section replacing the current Implementation section — explicit Problem, Alternatives, Decision, Outcome per challenge
- Alternatives block per challenge — at least one alternative named and rejected with a reason; transforms "what I built" into "how I decided what to build"
- Quantitative outcomes — every result that can be numbered must be numbered; vague adjectives are an active negative signal to Korean big tech reviewers
- Architecture caption — 2-3 sentences under the architecture image explaining design decisions visible in the diagram
- Retrospective sharpening — replace generic "I learned X" with "If I rebuilt this, I'd use Y instead of Z because W"
- Bilingual content parity — all KO and EN keys updated simultaneously; missing English keys silently produce empty sections

**Should have (competitive differentiators — P2):**
- Trade-off comparison table — visual table for the 1-2 most significant decisions per project
- Decision rationale callout — styled highlighted block making the key decision visible to a scanning recruiter
- Per-challenge difficulty/impact tags — low cost, signals self-awareness and prioritization ability

**Defer (v5+):**
- Project selection "start here" page guiding recruiters to the 2-3 deepest projects
- Inline code snippet per challenge (CodeBlock component can be built in Phase 2; content authoring is the constraint)

**Anti-features to avoid:**
- Skill percentage bars — subjective, meaningless, Toss interviewers have flagged these negatively
- Fabricated metrics for student projects — Korean recruiters cross-reference GitHub and live demos
- Full feature lists for all 6 projects — depth over breadth is the Korean big tech consensus
- Timeline/Gantt charts — visual noise without answering "how good is your code?"

### Architecture Approach

The restructure uses `ProjectContent.tsx` as a thin orchestrator — its external signature (`translationKey`, `projectId` props) stays identical, keeping `page.tsx` and the route entirely unchanged. The core new atom is `ChallengeSection.tsx`, a server component rendering the Problem → Context → Alternatives → Decision → Outcome card structure, reused across all 6 projects via a numbered-key iteration pattern (`challenge1`, `challenge2`, ...) consistent with the existing `feature1`/`issue1` convention. Optional fields use `t.has()` guards, which is already the established pattern in `ProjectContent.tsx`. All 6 new components are server components — no `'use client'` directive anywhere in the new content code.

The i18n schema migration is the highest-risk step: `implementation` and `troubleshooting` collapse into a unified `challenges` block, and a new `outcomes` section is added for metric cards. This migration must be done atomically — JSON changes and component consumer updates in the same commit — validated by `next build` and visual QA of all 12 project pages (6 projects x 2 locales).

**Major components:**
1. `ChallengesGrid.tsx` — iterates `challenge1..N`, renders `ChallengeSection` per challenge; replaces current Implementation and Troubleshooting sections
2. `ChallengeSection.tsx` — core atom: Problem, optional Context, optional AlternativesTable, Decision, optional Outcome; ~70 lines, server component
3. `AlternativesTable.tsx` — options-considered vs chosen table, conditionally rendered within ChallengeSection; separated to keep ChallengeSection lean
4. `OutcomesSection.tsx` — dedicated metric card section for quantitative results; makes impact scannable for recruiters
5. `OverviewSection.tsx` + `RetrospectiveSection.tsx` — clean extracted components, replacing inline rendering in ProjectContent body
6. `CodeBlock.tsx` — shiki server component for per-challenge code snippets (build in Phase 2, use in Phase 3 content)

### Critical Pitfalls

1. **GSAP accidentally removed with lab2 packages** — `HorizontalScrollWrapper.tsx` in the MAIN site imports GSAP directly; removing GSAP breaks horizontal panel scroll on the homepage. Run `grep -r "from 'gsap'" src --include="*.tsx"` before any `npm uninstall`. Only `lenis` is safe to remove with lab2.

2. **Partial lab2 deletion leaves dangling references** — lab2 has a 4-layer dependency chain (Header → i18n keys → route → components). Delete in prescribed top-down order: Navigation.lab2 keys first, then Header link, then route directory, then components directory. Gate phase completion on `next build` with zero TypeScript errors.

3. **i18n schema rename silently breaks t.has() rendering** — `t.has()` returns false for missing keys without throwing; build passes cleanly even when entire sections are empty. Schema renames must update JSON files and TSX consumer files atomically. Validate with the bilingual parity script and full visual QA of both locales.

4. **English locale content drift** — Korean content written first, English deferred and forgotten. English project pages silently render empty sections with no error. Run the Python bilingual parity script as a hard gate after each project's content update.

5. **Generic result fields failing the specificity test** — Qualitative language ("performance improved," "stability was better") is an active negative signal to Korean big tech reviewers. Every `result`/`outcome` field must contain at least one specific measurement, named alternative, or before/after comparison. Apply the specificity test per feature block before moving to the next project.

---

## Implications for Roadmap

Based on the dependency analysis in ARCHITECTURE.md and risk severity in PITFALLS.md, three phases are recommended.

### Phase 1: Lab2 Cleanup
**Rationale:** Lab2 deletion is a prerequisite for accurate dependency analysis. Packages cannot be safely assessed for removal while lab2 source files exist. This phase is independent of content work and has clear completion criteria. Doing this first prevents the highest-severity pitfall (accidental GSAP removal) from occurring mid-content-development.
**Delivers:** Clean codebase with lab2 route, components, and navigation entries fully removed; package.json reflecting only retained dependencies (`gsap`, `@react-three/fiber`, `three` remain because `/lab` and `HorizontalScrollWrapper.tsx` need them; `lenis` removed)
**Addresses:** PITFALLS 1, 2, 3 (GSAP dependency audit, dangling reference order, transpilePackages sync)
**Avoids:** Installing shiki before the codebase is clean — mixing new additions with cleanup verification is a recipe for unclear build failures

### Phase 2: Component Infrastructure and Schema Migration
**Rationale:** The i18n schema migration is the critical path blocker — all new components depend on the new translation key structure. Content authors need stable key names before writing begins. Building both schema and components in this phase before content authoring prevents expensive content rewrites caused by schema churn. This phase also installs shiki and builds the CodeBlock component so it is available for Phase 3 content work.
**Delivers:** New `challenges`/`outcomes` i18n schema live in both `ko.json` and `en.json`; 6 new server components built and wired into `ProjectContent.tsx`; all 12 project pages rendering correctly with migrated content; `shiki` installed and `CodeBlock.tsx` available
**Uses:** `shiki ^4.0.0` (sole new install); Tailwind v4 CSS-first custom `.prose-technical` class; numbered-key iteration and `t.has()` patterns (existing conventions)
**Implements:** ChallengesGrid, ChallengeSection, AlternativesTable, OutcomesSection, OverviewSection, RetrospectiveSection
**Avoids:** PITFALL 4 (schema/consumer atomicity enforced by making both changes in the same phase); anti-pattern of per-project dedicated components

### Phase 3: Content Authoring — Engineering Depth
**Rationale:** Content authoring is the highest-ROI, highest-effort phase. It requires the new schema and components to be stable before writing begins, or content will be rewritten as structure evolves. The depth priority order from FEATURES.md is: Joshua, DY CMS, Scholarly Chain first (strongest engineering stories, clearest metrics), then Dino Go, then Retail Analysis, then Art War last (insufficient source data). Retrospective sharpening has the highest ROI per word written and should be done per project immediately after challenges.
**Delivers:** All 6 projects with bilingual engineering-depth content — alternatives documented, decisions rationale stated, outcomes quantified, retrospectives specific; all content passing the specificity test
**Addresses:** PITFALL 5 (EN parity — Python script gates each project), PITFALL 6 (specificity test gates each feature block)
**Feature coverage:** Engineering Challenge Section, Alternatives block, Quantitative outcomes, Architecture captions, Retrospective sharpening (all P1 features from FEATURES.md)

### Phase Ordering Rationale

- **Lab2 first** because it removes risk before adding complexity. Pitfall 1 (GSAP removal) is a 30-minute recovery if it happens mid-Phase-2; it is a 5-minute prevention if audited in Phase 1.
- **Infrastructure before content** because the i18n schema is the critical path blocker. Content writers need stable key names. Components need validated schema. Building both in Phase 2 prevents expensive content rewrites caused by schema churn.
- **Content last** because it is the highest-effort phase and benefits from a stable, validated technical foundation. The per-project quality gate (specificity test + bilingual parity script) works best when completed one project at a time.

### Research Flags

Phases with standard patterns (skip research-phase — well-documented, fully resolved by this research):
- **Phase 1 (Lab2 Cleanup):** Deletion order and dependency audit fully documented in PITFALLS.md. No additional research needed.
- **Phase 2 (Infrastructure):** Component architecture fully specified in ARCHITECTURE.md. Shiki integration pattern fully specified in STACK.md with working code examples. No additional research needed.

Phases that may warrant targeted validation during execution:
- **Phase 3 (Content Authoring):** Specific quantitative claims per project require cross-referencing against PDF source documents. Research identifies which projects have documented metrics (DY CMS: "90% accounting automation"; Joshua: IPC performance data) and which do not (Art War: insufficient source data). This is a content-quality validation need, not a technology research need. No additional research phase required — the specificity test and bilingual parity script are sufficient gates.

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | `shiki` version npm-verified; integration pattern from official shiki.style docs; "no additional packages" recommendation supported by bundle size analysis (Recharts 700KB, Mermaid 69MB) |
| Features | MEDIUM | Korean big tech recruiter preferences confirmed via multiple community sources (velog, brunch, nbcamp); Toss/LINE official tech blogs HIGH confidence; specific Naver/Kakao format requirements LOW — no official public guidance found |
| Architecture | HIGH | All findings from direct live codebase inspection at commit `46c64df`; component boundaries verified against actual file structure; no external sources required for internal architecture decisions |
| Pitfalls | HIGH | All 6 pitfalls grounded in direct codebase inspection; `t.has()` behavior confirmed against next-intl official docs; GSAP dependency confirmed by grep of `HorizontalScrollWrapper.tsx` |

**Overall confidence:** HIGH

### Gaps to Address

- **Specific metrics for Art War project:** Art War was flagged as having insufficient source data in PROJECT.md for deep engineering challenge content. During Phase 3, assess whether Art War should receive baseline-only treatment (overview + migration of existing content) rather than full engineering-depth treatment. Do not fabricate metrics.

- **Korean recruiter specificity for Naver vs Kakao vs Toss:** Community sources agree on "alternatives considered" and "quantitative outcomes" patterns, but no official Naver or Kakao portfolio format guidance was found. The research recommendation (follow Toss Tech Blog / LINE Engineering Blog patterns) is the best available proxy. Validate against any direct recruiter feedback received during the job search.

- **v4.x code snippet content decisions:** The `CodeBlock.tsx` component is straightforward to build in Phase 2. Which challenges actually warrant a code snippet (as opposed to prose description) is a Phase 3 content judgment call. The research identifies Scholarly Chain JWT middleware and Joshua IPC architecture as the strongest candidates — both have real, interesting code that reinforces the decision narrative.

---

## Sources

### Primary (HIGH confidence)
- Live codebase inspection at commit `46c64df` — `ProjectContent.tsx`, `HorizontalScrollWrapper.tsx`, `Header.tsx`, `projects/[id]/page.tsx`, `messages/ko.json`, `messages/en.json`, `package.json`, `next.config.ts`
- [shiki.style/packages/next](https://shiki.style/packages/next) — official Next.js integration, dual-theme CSS variable approach
- [shiki.style/guide/migrate](https://shiki.style/guide/migrate) — v4 breaking changes confirmed (Node 18 drop only, no API changes from v3)
- [next-intl.dev/docs/usage/translations](https://next-intl.dev/docs/usage/translations) — `t.has()` returns false, does not throw
- npm registry — `npm view shiki version`, `npm view mermaid dist.unpackedSize`, bundle size verification for all rejected packages
- [Toss Tech Blog — toss.tech](https://toss.tech/) — alternatives analysis and trade-off patterns in engineering articles
- [LINE Engineering Blog](https://engineering.linecorp.com/) — architecture diagram with caption pattern, pragmatic rationale documentation
- [frontendcs.com](https://frontendcs.com/) — 1,076 curated frontend case studies confirming structural patterns

### Secondary (MEDIUM confidence)
- Korean portfolio community guides (velog, brunch, nbcamp sparta) — recruiter expectation patterns for Korean big tech
- [신입 개발자의 포트폴리오 작성법 — velog.io/@yoosion030](https://velog.io/@yoosion030) — structural baseline expectations
- [합격한 포트폴리오 제작기(3탄) — brunch.co.kr/@new-una/24](https://brunch.co.kr/@new-una/24) — Korean portfolio structural patterns
- [chsm.dev — Comparing web code highlighters (Jan 2025)](https://chsm.dev/blog/2025/01/08/comparing-web-code-highlighters) — competitive analysis confirming shiki recommendation
- [Building an Effective Frontend Developer Portfolio — frontendmentor.io](https://www.frontendmentor.io/articles/building-an-effective-frontend-developer-portfolio--7cE8BfMG_) — global best practices 2024-2025

### Tertiary (LOW confidence)
- [이직 할거야? (카카오페이증권 합격 후기) — velog.io/@haryan248](https://velog.io/@haryan248) — single anecdote from a Kakao affiliate company; "thought process discussion" preference noted but not representative of all Kakao companies

---

*Research completed: 2026-03-02*
*Ready for roadmap: yes*
