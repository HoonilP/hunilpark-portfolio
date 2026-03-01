# Architecture Research

**Domain:** Next.js 16 App Router — Project detail page restructure for engineering-challenge-focused layout
**Researched:** 2026-03-02
**Confidence:** HIGH (based on direct codebase analysis — all findings verified against live source)

## Standard Architecture

### Current System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                 /[locale]/projects/[id]/page.tsx                 │
│                   (Server Component — async)                     │
├─────────────────────────────────────────────────────────────────┤
│  PROJECT_META (static map)                                       │
│  id → { translationKey, techStack, githubUrl, liveUrl }          │
│  setRequestLocale() + getTranslations('ProjectDetail')           │
├──────────────┬───────────────┬─────────────────┬────────────────┤
│ Breadcrumbs  │ ProjectHero   │ ProjectSidebar  │ ProjectContent │
│ (client)     │ (client)      │ (server async)  │ (server async) │
│              │               │                 │                │
│ i18n nav     │ title+subtitle│ role/team/dur   │ overview       │
│ links        │ tech badges   │ tech stack      │ implementation │
│              │ hero.webp img │ github/live     │ troubleshooting│
│              │               │ links           │ retrospective  │
└──────────────┴───────────────┴─────────────────┴────────────────┘
                                      │
                       ProjectNavigation (client)
                       prev/next by PROJECT_ORDER
```

### Current Component Responsibilities

| Component | Type | Responsibility | Data Source |
|-----------|------|---------------|-------------|
| `page.tsx` | Server async | Route entry, PROJECT_META lookup, static param generation | PROJECT_META constant |
| `ProjectHero` | Client | Title, subtitle, tech badge list, hero.webp image | Props from page.tsx |
| `ProjectSidebar` | Server async | Role, team size, duration, tech stack, external links | next-intl `t()` + props |
| `ProjectContent` | Server async | All body sections via `t.has()` feature detection | next-intl `t()` |
| `ProjectNavigation` | Client | Prev/next links in PROJECT_ORDER | `useTranslations()` |
| `Breadcrumbs` | Client | Home → Projects → [Project] nav trail | `useTranslations()` |

### Current i18n Content Schema

Every project under `ProjectDetail.[translationKey]` has:

```
[translationKey]
├── title
├── subtitle
├── role
├── teamSize
├── duration
├── overview
│   ├── title
│   ├── background
│   └── contribution
├── implementation
│   ├── title
│   ├── feature1 { title, problem, solution, result }
│   ├── feature2 { title, problem, solution, result }
│   └── feature3 { title, problem, solution, result }  (2-3 features per project)
├── troubleshooting
│   ├── title
│   ├── issue1 { title, problem, solution, result }
│   └── issue2 { title, problem, solution, result }   (1-2 issues per project)
└── retrospective
    ├── title
    ├── growth
    └── improvement
```

## Recommended Project Structure (after restructure)

```
src/
├── app/[locale]/projects/[id]/
│   └── page.tsx                    # NO CHANGE — entry point stays identical
│
├── components/projects/
│   ├── Breadcrumbs.tsx             # NO CHANGE
│   ├── ProjectHero.tsx             # MINOR MODIFY: remove inline hero.webp image
│   ├── ProjectSidebar.tsx          # MINOR MODIFY: add outcome summary card at top
│   ├── ProjectNavigation.tsx       # NO CHANGE
│   ├── ProjectContent.tsx          # REPLACE BODY: new section list, same signature
│   │
│   ├── OverviewSection.tsx         # NEW: project context + contribution
│   ├── ChallengesGrid.tsx          # NEW: iterates challenge1..N, renders ChallengeSection
│   ├── ChallengeSection.tsx        # NEW: one engineering challenge card (core atom)
│   ├── AlternativesTable.tsx       # NEW: options-considered vs chosen trade-off table
│   ├── OutcomesSection.tsx         # NEW: quantitative results cards
│   └── RetrospectiveSection.tsx    # NEW: extracted from ProjectContent
```

### Structure Rationale

- **`ProjectContent.tsx` as thin orchestrator:** Keeps the `page.tsx` call site entirely unchanged. New section components are wired inside `ProjectContent`, so the page route requires zero modifications for the layout redesign. This is the critical seam.
- **`ChallengeSection.tsx` as the core atom:** The engineering-challenge format requires a consistent "Problem → Context → Alternatives → Decision → Outcome" card structure reused across all 6 projects. It is the single most important new component.
- **`AlternativesTable.tsx` separated:** Trade-off comparison tables have distinct rendering logic (bordered table, option columns, verdict cells). Separating them prevents `ChallengeSection` from growing too large and makes the table independently optional.
- **Sidebar outcome card:** A brief "What was achieved" summary at the top of the sidebar lets recruiters scan key results without reading all body content.

## Architectural Patterns

### Pattern 1: Feature-Detection via `t.has()` — Preserve for Optional Fields

**What:** `ProjectContent` already uses `t.has(\`${key}.field\`)` to conditionally render sections. Preserve this pattern for all new optional fields — not every challenge will have an alternatives table, not every project will have three challenges.

**When to use:** Any field not guaranteed for all 6 projects: `context`, `alternatives`, `metrics`, code examples.

**Trade-offs:** Flexible for variable-depth content. Silent omission risk if a key is misspelled — acceptable on a 6-project static site with build-time validation from next-intl.

**Example:**
```typescript
// In ChallengeSection.tsx
{t.has(`${translationKey}.challenges.${challengeKey}.context`) && (
  <div>
    <h4 className="font-semibold text-sm uppercase tracking-wide text-neutral-500 mb-2">
      Context
    </h4>
    <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
      {t(`${translationKey}.challenges.${challengeKey}.context`)}
    </p>
  </div>
)}

{t.has(`${translationKey}.challenges.${challengeKey}.alternatives`) && (
  <AlternativesTable translationKey={translationKey} challengeKey={challengeKey} />
)}
```

### Pattern 2: Numbered Key Iteration (Continue Existing Convention)

**What:** Use numbered keys (`challenge1`, `challenge2`, `challenge3`) matching the existing `feature1`/`issue1` pattern. The renderer iterates a fixed max count and breaks on the first missing key.

**When to use:** Any repeating per-project content: challenges, alternative options, outcome metrics.

**Trade-offs:** Simple. Keys are visible and searchable in translation files. Implicit upper limit (iterate to 5, stop at first miss). No runtime JSON array parsing needed.

**Example:**
```typescript
// ChallengesGrid.tsx
const CHALLENGE_KEYS = ['challenge1', 'challenge2', 'challenge3', 'challenge4', 'challenge5'];

export default async function ChallengesGrid({ translationKey }: { translationKey: string }) {
  const t = await getTranslations('ProjectDetail');
  return (
    <section className="space-y-12">
      <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
        {t(`${translationKey}.challenges.title`)}
      </h2>
      {CHALLENGE_KEYS.map((key) => {
        if (!t.has(`${translationKey}.challenges.${key}.title`)) return null;
        return (
          <ChallengeSection
            key={key}
            translationKey={translationKey}
            challengeKey={key}
          />
        );
      })}
    </section>
  );
}
```

### Pattern 3: All New Sections Are Server Components (No `'use client'`)

**What:** `ChallengeSection`, `AlternativesTable`, `OutcomesSection`, `RetrospectiveSection`, and `OverviewSection` are all server components using `getTranslations()`. They receive only string props (`translationKey`, `challengeKey`). No interactivity, no `'use client'` directive.

**When to use:** All static content rendering in this milestone. Add `'use client'` only if a section needs accordion/toggle state later.

**Trade-offs:** Slightly more verbose (async functions, `await getTranslations()`). The benefit is zero JS bundle cost for pure display components — correct for a static portfolio.

**Example:**
```typescript
// ChallengeSection.tsx — server component, no 'use client'
import { getTranslations } from 'next-intl/server';
import AlternativesTable from './AlternativesTable';

interface Props {
  translationKey: string;
  challengeKey: string; // 'challenge1' | 'challenge2' | 'challenge3'
}

export default async function ChallengeSection({ translationKey, challengeKey }: Props) {
  const t = await getTranslations('ProjectDetail');
  const base = `${translationKey}.challenges.${challengeKey}`;

  return (
    <article className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-8 space-y-6">
      <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
        {t(`${base}.title`)}
      </h3>

      {/* Problem — always required */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-2">
          Problem
        </h4>
        <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
          {t(`${base}.problem`)}
        </p>
      </div>

      {/* Context — optional */}
      {t.has(`${base}.context`) && (
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-2">
            Context
          </h4>
          <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
            {t(`${base}.context`)}
          </p>
        </div>
      )}

      {/* Alternatives — optional, renders table */}
      {t.has(`${base}.alternatives`) && (
        <AlternativesTable translationKey={translationKey} challengeKey={challengeKey} />
      )}

      {/* Decision — always required */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-2">
          Decision
        </h4>
        <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
          {t(`${base}.decision`)}
        </p>
      </div>

      {/* Outcome — optional but strongly recommended */}
      {t.has(`${base}.outcome`) && (
        <p className="text-sm font-medium text-primary-700 dark:text-primary-300 border-l-2 border-primary-500 pl-4">
          {t(`${base}.outcome`)}
        </p>
      )}
    </article>
  );
}
```

## Data Flow

### Request Flow (SSG — unchanged by restructure)

```
Next.js SSG build
    ↓
generateStaticParams() → 12 routes (6 projects × 2 locales)
    ↓
page.tsx (server, async)
    ↓ await params
PROJECT_META[id] → { translationKey, techStack, githubUrl, liveUrl }
    ↓ await getTranslations('ProjectDetail')
    ↓
Component tree:
  Breadcrumbs       (client — receives projectTitle string prop)
  ProjectHero       (client — receives title, subtitle, techStack, projectId props)
  [grid layout]
    ProjectSidebar  (server — fetches own translations by translationKey)
    ProjectContent  (server — fetches own translations by translationKey)
      OverviewSection       (server — translationKey prop)
      ChallengesGrid        (server — translationKey prop)
        ChallengeSection×N  (server — translationKey + challengeKey props)
          AlternativesTable (server — optional, same props)
      OutcomesSection       (server — translationKey prop)
      RetrospectiveSection  (server — translationKey prop)
  ProjectNavigation (client — currentId prop)
```

### Target i18n Schema

`implementation` and `troubleshooting` collapse into a unified `challenges` structure. `retrospective` gains an optional `lessons` array. A new `outcomes` section captures quantitative results.

```
[translationKey]
├── title
├── subtitle
├── role          (unchanged)
├── teamSize      (unchanged)
├── duration      (unchanged)
├── overview                              (unchanged)
│   ├── title
│   ├── background
│   └── contribution
│
├── challenges                            (REPLACES: implementation + troubleshooting)
│   ├── title                             (section heading, e.g. "Engineering Challenges")
│   ├── challenge1
│   │   ├── title                         (challenge name)
│   │   ├── problem                       (what was the obstacle — required)
│   │   ├── context                       (optional: why this mattered / constraints)
│   │   ├── decision                      (what was chosen and why — required)
│   │   ├── outcome                       (direct result of this decision — optional)
│   │   └── alternatives                  (optional object)
│   │       ├── option1 { name, reason }  (option considered)
│   │       ├── option2 { name, reason }  (option considered)
│   │       └── chosen                    ('option1' | 'option2' — which was picked)
│   ├── challenge2  (same structure)
│   └── challenge3  (same structure — most projects have 2-3 challenges)
│
├── outcomes                              (NEW: consolidates scattered result statements)
│   ├── title
│   ├── metric1 { label, value, context } (e.g. "회계 자동화", "90%", "기존 수작업 대비")
│   ├── metric2 { label, value, context }
│   └── metric3 { label, value, context }
│
└── retrospective                         (unchanged structure, optional lessons added)
    ├── title
    ├── growth
    ├── improvement
    └── lessons                           (NEW — optional)
        ├── lesson1                       (brief takeaway statement)
        └── lesson2
```

### Migration Mapping: Old → New Schema

| Old Key | New Location | Notes |
|---------|-------------|-------|
| `implementation.feature1` | `challenges.challenge1` | Re-frame problem/solution as problem/decision |
| `implementation.feature2` | `challenges.challenge2` | Same |
| `implementation.feature3` | `challenges.challenge3` | Same |
| `troubleshooting.issue1` | Merge into existing challenge OR new `challenge4` | If it reveals a distinct engineering decision, promote to a challenge |
| `troubleshooting.issue2` | Same as above | |
| `implementation.featureN.result` | `challenges.challengeN.outcome` + `outcomes.metricN` | Results split: direct outcome stays in challenge, quantitative moves to outcomes |
| `retrospective.*` | Unchanged | Optionally add `lessons` array |

## Integration Points

### What Changes in Each Existing Component

| Component | Change Type | Exactly What Changes | What Stays Identical |
|-----------|-------------|---------------------|---------------------|
| `page.tsx` | NO CHANGE | — | All props passed to children, PROJECT_META, generateStaticParams, layout structure |
| `ProjectHero.tsx` | MINOR MODIFY | Remove `<Image src={hero.webp}>` block (12 lines) | title, subtitle, techStack badges, all props, component signature |
| `ProjectSidebar.tsx` | MINOR MODIFY | Add outcome summary card above existing content using `outcomes.metric1` | role, teamSize, duration, techStack, links — all unchanged |
| `ProjectContent.tsx` | REPLACE BODY | Section list: [overview, challenges, outcomes, retro] instead of current | Props signature `{ translationKey, projectId }` unchanged |
| `ProjectNavigation.tsx` | NO CHANGE | — | Everything |
| `Breadcrumbs.tsx` | NO CHANGE | — | Everything |

### New Components to Build

| Component | Lines (est.) | Dependencies | Optional? |
|-----------|-------------|-------------|-----------|
| `OverviewSection.tsx` | ~30 | next-intl only | No — always rendered |
| `RetrospectiveSection.tsx` | ~30 | next-intl only | No — always rendered |
| `OutcomesSection.tsx` | ~40 | next-intl only | Yes — renders if `outcomes.metric1` exists |
| `AlternativesTable.tsx` | ~40 | next-intl only | Yes — rendered by ChallengeSection conditionally |
| `ChallengeSection.tsx` | ~70 | AlternativesTable + next-intl | No — core atom |
| `ChallengesGrid.tsx` | ~30 | ChallengeSection | No — always rendered |

### Internal Component Boundaries

| Boundary | Communication Method | Notes |
|----------|---------------------|-------|
| `page.tsx` → `ProjectContent` | Props: `translationKey: string`, `projectId: string` | Critical: page.tsx must require zero modification |
| `ProjectContent` → new sections | Props: `translationKey: string` only | Each section independently calls `getTranslations()` |
| `ChallengesGrid` → `ChallengeSection` | Props: `translationKey`, `challengeKey` (`'challenge1'` etc.) | Grid derives challengeKey from iteration |
| `ChallengeSection` → `AlternativesTable` | Props: `translationKey`, `challengeKey` | AlternativesTable reconstructs its own translation path |

## Build Order (Dependency-Aware)

Dependencies flow strictly downward. Earlier steps must complete before later steps that depend on them.

```
Step 1: i18n schema migration (no component deps)
  ├── Rewrite messages/ko.json — ProjectDetail section
  └── Rewrite messages/en.json — ProjectDetail section
      Map old implementation/troubleshooting → new challenges/outcomes
      Verify: build passes (next-intl validates keys at build time)

Step 2: Leaf section components (depend on: Step 1 i18n)
  ├── OverviewSection.tsx       (no component deps)
  ├── RetrospectiveSection.tsx  (no component deps)
  └── OutcomesSection.tsx       (no component deps)
      All three can be built in parallel

Step 3: AlternativesTable (depend on: Step 1)
  └── AlternativesTable.tsx     (no component deps beyond next-intl)

Step 4: ChallengeSection (depends on: Steps 2 + 3)
  └── ChallengeSection.tsx      (imports AlternativesTable)

Step 5: ChallengesGrid (depends on: Step 4)
  └── ChallengesGrid.tsx        (imports ChallengeSection)

Step 6: Wire into ProjectContent (depends on: Steps 2 + 5)
  └── Replace ProjectContent.tsx body to use new sections
      Verify: all 6 project pages render correctly

Step 7: Minor adjustments (depends on: Step 6)
  ├── ProjectHero.tsx — remove hero.webp image block
  └── ProjectSidebar.tsx — add outcome summary card
      Verify: sidebar shows correct metric, hero shows title+badges only

Step 8: Content review (depends on: Steps 1 + 6)
  └── Review each of 6 projects × 2 locales = 12 pages
      Ensure challenges read as engineering depth, not feature lists
```

**Critical path:** Step 1 (i18n) → Step 6 (wire) is the primary dependency chain. The content migration (Step 1) is the highest-risk step: it requires rewriting all project content in both languages to fit the new challenge/decision framing. All component work (Steps 2-5) can proceed in parallel once the schema is defined, even before content is complete, by using placeholder translation keys.

## Anti-Patterns

### Anti-Pattern 1: Per-Project Dedicated Components

**What people do:** Create `JoshuaContent.tsx`, `DinoGoContent.tsx`, etc. — one component per project with hardcoded section names matching that project's challenges.

**Why it's wrong:** 6 components to maintain instead of 1. Adding content requires code changes. Adding a 7th project requires a new component file. The whole point of the numbered-key pattern is that all 6 projects share identical components — only the translation file differs.

**Do this instead:** Use `ChallengesGrid` + `ChallengeSection` with numbered key iteration. `t.has()` handles variable challenge counts. Zero new components needed per project.

### Anti-Pattern 2: Client Components for Static Sections

**What people do:** Add `'use client'` to `ChallengeSection` or `AlternativesTable` "in case we need interactivity later."

**Why it's wrong:** Ships unnecessary JavaScript. Next.js App Router defaults to server components — this is correct for read-only content. Adding `'use client'` unnecessarily increases bundle size with zero benefit.

**Do this instead:** Keep all new content sections as server components. If a section needs accordion behavior later, wrap only the toggle trigger in a small client component, not the entire section tree.

### Anti-Pattern 3: Moving Project Metadata into i18n Files

**What people do:** Move `techStack`, `githubUrl`, `liveUrl` out of `PROJECT_META` in `page.tsx` and into translation keys so they can be "customized per locale."

**Why it's wrong:** Tech stack names (TypeScript, NestJS) and GitHub URLs are not locale-sensitive. Duplicating them across `ko.json` and `en.json` creates sync errors. The existing `ProjectSidebar` already correctly reads `techStack` from props (not from translation keys).

**Do this instead:** Keep structured metadata (tech, URLs, image paths) in `PROJECT_META` in `page.tsx`. Only human-readable prose goes in translation files.

### Anti-Pattern 4: Replacing `t.has()` with Empty String Fallbacks

**What people do:** Remove optional field checks and use `t(\`...\`) || ''` or `t(\`...\`, { defaultValue: '' })` to simplify conditional rendering.

**Why it's wrong:** next-intl throws at build time if a required key is missing when `t()` is called without `t.has()` guard. The `t.has()` pattern is the documented next-intl way to handle optional content — it prevents both runtime errors and accidental empty-section rendering.

**Do this instead:** Keep `t.has()` guards for every field that is not guaranteed across all 6 projects.

### Anti-Pattern 5: Merging Outcomes into Challenge Text

**What people do:** Put quantitative results ("90% automation") inline in `challenge.outcome` text without a dedicated `OutcomesSection`.

**Why it's wrong:** Recruiters scan for impact metrics. Burying "90% automation" at the bottom of challenge 2's outcome paragraph makes it invisible at a glance. Dedicated `OutcomesSection` with metric cards makes impact scannable in 3 seconds.

**Do this instead:** Keep brief qualitative outcomes inside `ChallengeSection.outcome`. Put quantitative metrics (numbers, percentages, time saved) in `outcomes.metric1/2/3` which renders as a distinct visual section.

## Sources

- Direct codebase analysis: `/Users/hipark/dev/portfolio/src/app/[locale]/projects/[id]/page.tsx`
- Direct codebase analysis: `/Users/hipark/dev/portfolio/src/components/projects/` (all 5 files verified)
- Direct codebase analysis: `/Users/hipark/dev/portfolio/messages/ko.json` (full ProjectDetail schema inspection)
- **Confidence: HIGH** — all findings from live codebase at commit `46c64df`. No external sources required for internal architecture decisions on an existing project.

---
*Architecture research for: Project detail page restructure — engineering challenge layout*
*Researched: 2026-03-02*
