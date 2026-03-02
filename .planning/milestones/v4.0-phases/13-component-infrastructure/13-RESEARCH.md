# Phase 13: Component Infrastructure - Research

**Researched:** 2026-03-02
**Domain:** i18n schema migration + React Server Components + shiki syntax highlighting
**Confidence:** HIGH

## Summary

Phase 13 replaces the existing `implementation` + `troubleshooting` two-section pattern in `ProjectContent.tsx` with a unified "Engineering Challenges" section. This requires three coordinated changes: (1) migrating the `ProjectDetail` namespace in `ko.json` and `en.json` from `{implementation, troubleshooting}` keys to a `challenges` array-like key structure, (2) rewriting `ProjectContent.tsx` to render challenges with a five-part narrative (문제정의 → 시도한 접근법 → 비교/결정 → 구현 → 성과), and (3) building a `CodeBlock` async server component backed by shiki that renders syntax-highlighted code with automatic dark/light theme switching.

The project uses next-intl v4 with `getTranslations()` in server components, and all six project detail pages are statically generated with `generateStaticParams()`. The shiki library (currently v4.0.0 on npm) is a pure server-side dependency that works well in Next.js server components because it never reaches the client bundle. Dark mode in this project is controlled by `data-theme="dark"` via next-themes — shiki's dual-theme CSS output must use `[data-theme='dark']` selectors rather than `.dark` class selectors.

The i18n schema migration is the highest-risk step: next-intl's `t.has()` silently returns `false` for missing keys rather than erroring, so a broken schema will produce invisible empty sections rather than build errors. Atomic migration (JSON + component in a single commit) is the correct approach per the STATE.md decision log.

**Primary recommendation:** Install `shiki@^4`, build a singleton `lib/shiki.ts` helper, write a `CodeBlock` server component that uses `[data-theme='dark']` CSS selector override, migrate JSON schemas atomically, then update `ProjectContent.tsx` with stub challenge data so all six projects render without empty sections before Phase 14 fills in real content.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| STRC-01 | ProjectContent 컴포넌트가 기존 Implementation+Troubleshooting 대신 통합된 "Engineering Challenges" 섹션을 렌더링한다 | ProjectContent.tsx rewrite; remove featureKeys/issueKeys loops, add challengeKeys loop over new schema |
| STRC-02 | 각 챌린지가 문제정의 → 시도한 접근법 → 비교/결정 → 구현 → 성과 흐름으로 구성된다 | New i18n schema fields: `context`, `alternatives`, `decision`, `implementation`, `outcome`; each rendered as labeled subsection |
| STRC-03 | i18n 스키마가 challenges 구조(challenge1~N, 각각 title/context/alternatives/decision/implementation/outcome 필드)로 마이그레이션된다 | JSON migration from `{implementation.feature1~N, troubleshooting.issue1~N}` to `{challenges.challenge1~N}` with new field names |
| STRC-04 | shiki 기반 CodeBlock 서버 컴포넌트가 챌린지 내 코드 스니펫을 구문 강조로 렌더링한다 | `shiki@^4` + singleton highlighter pattern + async RSC CodeBlock; `codeToHtml` with dual themes |
| STRC-05 | 다크모드에서 코드 스니펫 테마가 자동 전환된다 | shiki dual themes with `defaultColor: 'light'` + CSS override for `[data-theme='dark'] .shiki, [data-theme='dark'] .shiki span` |
| STRC-06 | 6개 프로젝트 모두 새 구조로 양 로케일(ko/en)에서 정상 렌더링된다 | Atomic JSON + component migration; stub placeholder challenges so no project renders empty sections |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| shiki | ^4.0.0 | Server-side syntax highlighting | Zero client bundle, inline style tokens, built-in dual theme support, TextMate grammar quality |
| next-intl | ^4.8.2 (already installed) | i18n translations | Already the project standard; `getTranslations()` in RSC, `t.has()` for optional fields |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| shiki (singleton) | same | Reusable highlighter instance across server renders | Avoid re-creating expensive highlighter per page |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| shiki | highlight.js | highlight.js is client-side-friendly but adds client bundle weight; shiki is server-only and produces better output with TextMate grammars |
| shiki | prism-react-renderer | Prism requires client component; shiki works as pure async server component |
| shiki dual themes | CSS-variables theme (deprecated) | css-variables theme was removed in shiki v3; dual themes is the current standard |
| challenges.challenge1~N (numbered keys) | challenges as JSON array | next-intl message files require flat/nested objects — true arrays are not supported in the message schema; numbered keys like `challenge1`, `challenge2` are the correct pattern |

**Installation:**
```bash
npm install shiki --cache /tmp/npm-cache-temp
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── lib/
│   └── shiki.ts              # Singleton highlighter factory
├── components/
│   └── projects/
│       ├── ProjectContent.tsx     # Rewritten: challenges loop replaces impl/troubleshooting
│       ├── CodeBlock.tsx          # NEW: async RSC, shiki-powered
│       └── ChallengeSection.tsx   # NEW: renders one challenge's 5 sub-fields
messages/
├── ko.json                    # Migrated: challenges.challenge1~N per project
└── en.json                    # Migrated: same schema
```

### Pattern 1: Singleton Shiki Highlighter

**What:** Module-level promise caches the highlighter so it is created once per server process, not per request.
**When to use:** Always — creating a new highlighter per request is expensive (loads TextMate grammars and theme JSON).

```typescript
// src/lib/shiki.ts
// Source: https://shiki.style/guide/best-performance
import { createHighlighter } from 'shiki';
import type { Highlighter } from 'shiki';

let highlighterPromise: Promise<Highlighter> | null = null;

export function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ['github-light', 'github-dark'],
      langs: ['typescript', 'javascript', 'tsx', 'jsx', 'bash', 'python', 'json', 'css', 'sql'],
    });
  }
  return highlighterPromise;
}
```

### Pattern 2: CodeBlock Async Server Component

**What:** An async RSC that accepts `code` + `lang`, calls the singleton highlighter, and returns HTML via `dangerouslySetInnerHTML`.
**When to use:** Anywhere a code snippet needs syntax highlighting in a project challenge.

```typescript
// src/components/projects/CodeBlock.tsx
// Source: https://shiki.style/packages/next
import { getHighlighter } from '@/lib/shiki';

interface CodeBlockProps {
  code: string;
  lang?: string;
}

export default async function CodeBlock({ code, lang = 'typescript' }: CodeBlockProps) {
  const highlighter = await getHighlighter();
  const html = highlighter.codeToHtml(code, {
    lang,
    themes: {
      light: 'github-light',
      dark: 'github-dark',
    },
    defaultColor: 'light',
  });

  return (
    <div
      className="code-block my-4 overflow-x-auto rounded-lg text-sm"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
```

### Pattern 3: Shiki Dark Mode CSS Override

**What:** CSS rules that switch shiki token colors when `data-theme="dark"` is set on the `<html>` element by next-themes.
**When to use:** Add to `globals.css` — this is the only CSS needed for dark mode switching.

```css
/* src/app/globals.css — add after existing theme definitions */
/* Source: https://shiki.style/guide/dual-themes */

/* shiki dark mode: override when data-theme="dark" is set */
[data-theme='dark'] .shiki,
[data-theme='dark'] .shiki span {
  color: var(--shiki-dark) !important;
  background-color: var(--shiki-dark-bg) !important;
}
```

**Critical:** This project uses `data-theme="dark"` (not `.dark` class), set by `ThemeProvider` via `<NextThemesProvider attribute="data-theme">`. The CSS selector must use `[data-theme='dark']`, not `html.dark`.

### Pattern 4: i18n Schema Migration

**What:** Replace `implementation` and `troubleshooting` nested keys with `challenges` containing numbered challenge sub-keys.
**When to use:** One-time atomic migration — change JSON and component in a single operation.

**Old schema (to be removed):**
```json
"joshua": {
  "implementation": {
    "title": "기술 구현",
    "feature1": { "title": "...", "problem": "...", "solution": "...", "result": "..." }
  },
  "troubleshooting": {
    "title": "트러블슈팅",
    "issue1": { "title": "...", "problem": "...", "solution": "...", "result": "..." }
  }
}
```

**New schema (to be added):**
```json
"joshua": {
  "challenges": {
    "title": "엔지니어링 챌린지",
    "challenge1": {
      "title": "...",
      "context": "문제 정의 — 왜 이 챌린지가 중요했는가",
      "alternatives": "시도한 접근법 — 어떤 방법들을 시도/고려했는가",
      "decision": "비교/결정 — 왜 이 방법을 선택했는가",
      "implementation": "구현 — 어떻게 구현했는가",
      "outcome": "성과 — 정량적 결과"
    }
  }
}
```

**Both `implementation` and `troubleshooting` keys are removed.** `retrospective` and `overview` keys remain unchanged.

### Pattern 5: ChallengeSection Rendering

**What:** The updated `ProjectContent.tsx` loops over challenge keys using `t.has()` checks, rendering each challenge's five sub-fields as labeled subsections.

```typescript
// src/components/projects/ProjectContent.tsx (updated)
const challengeKeys = ['challenge1', 'challenge2', 'challenge3'];

// Inside JSX:
{t.has(`${translationKey}.challenges.title`) && (
  <section className="space-y-10">
    <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
      {t(`${translationKey}.challenges.title`)}
    </h2>

    {challengeKeys.map((key) => {
      if (!t.has(`${translationKey}.challenges.${key}.title`)) return null;
      return (
        <div key={key} className="space-y-4 border-l-2 border-neutral-200 dark:border-neutral-700 pl-6">
          <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            {t(`${translationKey}.challenges.${key}.title`)}
          </h3>
          {/* context, alternatives, decision, implementation, outcome fields */}
        </div>
      );
    })}
  </section>
)}
```

### Anti-Patterns to Avoid

- **Creating shiki highlighter per-request:** `await codeToHtml(...)` top-level shorthand re-initializes the highlighter each call. Use the singleton `getHighlighter()` pattern instead.
- **Using `.dark` CSS class for shiki:** This project uses `data-theme="dark"` attribute, not a `.dark` class. Using `html.dark .shiki` will not work.
- **Using deprecated `css-variables` theme:** Removed in shiki v3. Use `themes: { light, dark }` with `defaultColor`.
- **Using JSON arrays in next-intl messages:** next-intl requires object keys. Use `challenge1`, `challenge2`, etc. rather than a JavaScript array `challenges: [{...}]`.
- **Partial JSON migration without updating component:** If JSON is migrated but `ProjectContent.tsx` still looks for `implementation` keys, `t.has()` returns `false` silently — both old and new sections are empty. Always migrate atomically.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Syntax highlighting | Custom CSS/tokenizer | shiki | TextMate grammars handle 200+ edge cases; custom solutions produce inconsistent results |
| Dark mode CSS switching | Manual theme prop drilling | shiki `themes: {light, dark}` + CSS `[data-theme='dark']` | Built-in CSS variable output handles token-level color switching |
| Highlighter caching | Custom cache layer | Module-level promise singleton | Next.js server module scope persists across requests within a server instance |

**Key insight:** shiki's dual-theme output emits CSS variables as inline styles on every `<span>` — zero runtime JS is needed to switch themes, the CSS `[data-theme='dark']` override handles everything.

## Common Pitfalls

### Pitfall 1: Silent Empty Sections from Partial Migration
**What goes wrong:** After updating `ProjectContent.tsx` to check for `challenges.challenge1.title`, any project whose JSON was not yet migrated renders an empty challenges section with no error.
**Why it happens:** `t.has()` returns `false` for missing keys without throwing. Next.js build succeeds.
**How to avoid:** Migrate all 6 projects' JSON (both `ko.json` and `en.json`) AND update the component in the same commit. Add stub challenge content for all 6 projects so `t.has()` passes for at least `challenge1`.
**Warning signs:** A project detail page renders with no Engineering Challenges section and no console error.

### Pitfall 2: Wrong Dark Mode CSS Selector
**What goes wrong:** Shiki code blocks display light theme in both light and dark mode.
**Why it happens:** Official docs show `html.dark .shiki` but this project uses `data-theme="dark"` attribute via next-themes, not a `.dark` class.
**How to avoid:** Use `[data-theme='dark'] .shiki, [data-theme='dark'] .shiki span` in `globals.css`.
**Warning signs:** Toggle dark mode — code block background stays white.

### Pitfall 3: Shiki Edge Runtime Error
**What goes wrong:** Build or runtime error if shiki is imported in an Edge runtime route.
**Why it happens:** Shiki uses WASM/Node.js APIs not available in Edge runtime.
**How to avoid:** Project detail pages use Next.js Serverless runtime (default). No Edge runtime is configured. Do not add `export const runtime = 'edge'` to project pages.
**Warning signs:** Build error mentioning `oniguruma` or WASM in Edge context.

### Pitfall 4: Shiki v4 Node.js Requirement
**What goes wrong:** Install fails or runtime error on Node.js < 20.
**Why it happens:** Shiki v4 requires Node.js ≥ 20.
**How to avoid:** Verify Node.js version before installing. The project currently uses Next.js 16 which also requires modern Node. This should not be an issue in practice.
**Warning signs:** `npm install shiki` produces deprecation or engine mismatch warning.

### Pitfall 5: next-intl `t.has()` and Fallback Locale Behavior
**What goes wrong:** `t.has()` returns `true` for a key in `ko` locale but the `en` locale is missing the key, leading to broken English pages.
**Why it happens:** `t.has()` only checks the current locale's messages, not fallback. If `en.json` is missing a challenge key that `ko.json` has, English pages render that challenge empty.
**How to avoid:** Always update both `ko.json` and `en.json` simultaneously with identical key structures. Use a validation script or manual checklist.
**Warning signs:** `/en/projects/1` renders different number of challenges than `/ko/projects/1`.

## Code Examples

Verified patterns from official sources:

### Singleton Highlighter Factory
```typescript
// src/lib/shiki.ts
// Source: https://shiki.style/guide/best-performance
import { createHighlighter } from 'shiki';
import type { Highlighter } from 'shiki';

let highlighterPromise: Promise<Highlighter> | null = null;

export function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ['github-light', 'github-dark'],
      langs: ['typescript', 'javascript', 'tsx', 'jsx', 'bash', 'python', 'json'],
    });
  }
  return highlighterPromise;
}
```

### CodeBlock Server Component with Dual Themes
```typescript
// src/components/projects/CodeBlock.tsx
// Source: https://shiki.style/packages/next , https://shiki.style/guide/dual-themes
import { getHighlighter } from '@/lib/shiki';

interface CodeBlockProps {
  code: string;
  lang?: string;
}

export default async function CodeBlock({ code, lang = 'typescript' }: CodeBlockProps) {
  const highlighter = await getHighlighter();
  const html = highlighter.codeToHtml(code, {
    lang,
    themes: {
      light: 'github-light',
      dark: 'github-dark',
    },
    defaultColor: 'light',
  });

  return (
    <div
      className="code-block my-4 overflow-x-auto rounded-lg text-sm"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
```

### Required globals.css Addition
```css
/* Source: https://shiki.style/guide/dual-themes */
/* data-theme="dark" is set by next-themes ThemeProvider (attribute="data-theme") */
[data-theme='dark'] .shiki,
[data-theme='dark'] .shiki span {
  color: var(--shiki-dark) !important;
  background-color: var(--shiki-dark-bg) !important;
}
```

### i18n Schema (new structure per project in both ko.json and en.json)
```json
"joshua": {
  "title": "Joshua AI Agent",
  "subtitle": "KoGPT-2 기반 AI 카피라이팅 에이전트",
  "role": "프론트엔드 개발",
  "teamSize": "4명",
  "duration": "2022.06 - 2023.03",
  "overview": { ... },
  "challenges": {
    "title": "엔지니어링 챌린지",
    "challenge1": {
      "title": "챌린지 제목",
      "context": "문제 정의",
      "alternatives": "시도한 접근법",
      "decision": "비교/결정",
      "implementation": "구현",
      "outcome": "성과 (정량적 수치 포함)"
    },
    "challenge2": { ... }
  },
  "retrospective": { ... }
}
```
Note: `implementation` and `troubleshooting` top-level keys are fully removed from the project objects. `retrospective` and `overview` keys remain.

### ProjectContent.tsx Challenge Loop
```typescript
// src/components/projects/ProjectContent.tsx (updated)
// Source: existing file + next-intl t.has() pattern
import { getTranslations } from 'next-intl/server';

const CHALLENGE_KEYS = ['challenge1', 'challenge2', 'challenge3'];

export default async function ProjectContent({ translationKey, projectId }: ProjectContentProps) {
  const t = await getTranslations('ProjectDetail');

  return (
    <main className="space-y-12">
      {/* Overview Section — unchanged */}
      {t.has(`${translationKey}.overview.title`) && ( ... )}

      {/* Architecture Image — unchanged */}
      <div className="w-full aspect-video ..."> ... </div>

      {/* Engineering Challenges — replaces Implementation + Troubleshooting */}
      {t.has(`${translationKey}.challenges.title`) && (
        <section className="space-y-10">
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
                t={t}
              />
            );
          })}
        </section>
      )}

      {/* Retrospective Section — unchanged */}
      {t.has(`${translationKey}.retrospective.title`) && ( ... )}
    </main>
  );
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `css-variables` theme in shiki | `themes: { light, dark }` dual themes | shiki v3.0 | css-variables theme removed; must use dual theme API |
| `createHighlighter` from `shiki/core` | `createHighlighter` from `shiki` | shiki v1+ | Top-level export is now the standard; `shiki/core` is for fine-grained bundles |
| `setCDN`, `loadLanguage` top-level | Not needed | shiki v3.0 | Bundled approach handles loading; these APIs were removed |
| `.dark` class CSS selector for dark mode | `[data-theme='dark']` selector | this project | next-themes uses `attribute="data-theme"` not class |

**Deprecated/outdated:**
- `css-variables` Shiki theme: removed in v3, replaced by dual-themes approach
- CJS/IIFE shiki builds: dropped in v3
- `BUNDLED_LANGUAGES` / `BUNDLED_THEMES` named exports: moved to `@shikijs/langs` / `@shikijs/themes` in v3

## Open Questions

1. **Should `ChallengeSection` be a separate component file or inline in `ProjectContent.tsx`?**
   - What we know: The challenge rendering logic (5 labeled subsections + optional CodeBlock) is moderately complex.
   - What's unclear: Whether Phase 14 content will include code snippets for all challenges, or only some.
   - Recommendation: Extract `ChallengeSection.tsx` as a separate server component for testability and clarity. Pass `t` (translation function) or pre-resolved strings as props.

2. **Will Phase 14 require code snippets in all 6 projects?**
   - What we know: STRC-04 requires CodeBlock to work; CONT-01 says 2-3 challenges per project.
   - What's unclear: Whether challenge content will actually include code blocks (content is authored in Phase 14).
   - Recommendation: Build `CodeBlock.tsx` in Phase 13 but make it optional in `ChallengeSection`. If `implementation` field (of a challenge) contains no code, `CodeBlock` is not rendered. This gives Phase 14 flexibility.

3. **Stub challenge content format for Phase 13**
   - What we know: STRC-06 requires all 6 projects to render without empty sections. Phase 14 authors real content.
   - What's unclear: Whether stub content should be minimal placeholders or actual draft content.
   - Recommendation: Write minimal but structurally complete stub challenges (e.g., 1 challenge per project, with all 5 fields filled with a brief placeholder sentence). This validates the schema and component work correctly before real content is added.

## Validation Architecture

> Skipped: `workflow.nyquist_validation` is not set to `true` in `.planning/config.json` (config has no `nyquist_validation` key).

## Sources

### Primary (HIGH confidence)
- https://shiki.style/packages/next — Official shiki Next.js integration guidance
- https://shiki.style/guide/dual-themes — Official dual themes CSS approach
- https://shiki.style/guide/best-performance — Singleton highlighter pattern
- https://shiki.style/blog/v4 — v4 breaking changes (Node.js ≥ 20, deprecated API cleanup)
- https://next-intl.dev/docs/usage/translations — `t.has()` behavior for missing keys
- `npm show shiki version` — confirmed 4.0.0 is current npm latest

### Secondary (MEDIUM confidence)
- https://www.luckymedia.dev/blog/syntax-highlighting-with-shiki-react-server-components-and-next-js — `makeSingletonHighlighter` pattern, RSC integration
- https://www.nikolailehbr.ink/blog/syntax-highlighting-shiki-next-js/ — Next.js 14 App Router shiki implementation

### Tertiary (LOW confidence)
- None — all critical claims verified with official documentation.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — shiki v4 official docs + `npm show shiki version` confirmed current version
- Architecture: HIGH — patterns sourced from official shiki docs and verified against project's existing code
- Pitfalls: HIGH — dark mode CSS selector verified against existing `ThemeProvider.tsx` (`attribute="data-theme"`); i18n pitfall verified against existing `ProjectContent.tsx` pattern with `t.has()`

**Research date:** 2026-03-02
**Valid until:** 2026-04-02 (shiki v4 is stable; next-intl v4 API is stable)
