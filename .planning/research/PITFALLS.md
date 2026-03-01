# Pitfalls Research

**Domain:** Portfolio site v4.0 — removing a major feature route (lab2 3D) + restructuring i18n content schema + writing engineering case study content for Korean tech recruiter audience
**Researched:** 2026-03-02
**Confidence:** HIGH (all findings grounded in direct codebase inspection + verified against next-intl official docs + Next.js build behavior)

> **Note:** This file replaces the previous v3.0 pitfalls (3D lab2 development). The v4.0 milestone direction has reversed: lab2 is being deleted, not built. All pitfalls below address the three new workstreams: (1) removing lab2 safely, (2) restructuring i18n without breaking pages, (3) writing content that impresses rather than reads as generic.

---

## Critical Pitfalls

### Pitfall 1: GSAP Is NOT a lab2-Only Dependency — Removing It Breaks the Main Site

**What goes wrong:**
All 3D and animation packages appear to be lab2-specific. Someone runs `npm uninstall three @react-three/fiber @react-three/drei @types/three lenis gsap @gsap/react` in one command. The main portfolio homepage breaks immediately: the Hero/About/Skills horizontal panel scroll stops working, and header nav click-to-section stops responding.

**Why it happens:**
`HorizontalScrollWrapper.tsx` — used by the MAIN `page.tsx` for the horizontal panel layout — directly imports `gsap`, `@gsap/react`, `ScrollTrigger`, and `ScrollToPlugin`. This file lives at `src/components/HorizontalScrollWrapper.tsx`, NOT inside `src/components/lab2/`. It is easy to assume GSAP is lab2-only when scanning the lab2 directory, but the dependency graph extends into the main site.

**Confirmed dependency map (from codebase inspection):**

| Package | lab2 uses it | Main site (HorizontalScrollWrapper) uses it | Safe to remove after lab2 deletion? |
|---------|-------------|---------------------------------------------|--------------------------------------|
| `three` | YES | NO (verify `/lab` route also uses it before removing) | Only after also removing `/lab` route |
| `@react-three/fiber` | YES | NO | Same — verify `/lab` first |
| `@react-three/drei` | YES | NO | Same |
| `@types/three` | YES | NO | Same |
| `lenis` | YES (LenisProvider, useScrollProgress) | NO | YES — safe to remove with lab2 |
| `gsap` | YES | YES — `HorizontalScrollWrapper.tsx` | NO — do NOT remove |
| `@gsap/react` | YES | YES — `HorizontalScrollWrapper.tsx` | NO — do NOT remove |

**Additional nuance:** The `/lab` route (v1 3D room, separate from lab2) also uses `three`, `@react-three/fiber`, and `@react-three/drei`. If `/lab` is kept, those packages must stay. This milestone removes only lab2; `/lab` stays. Therefore `three`, `@react-three/fiber`, and `@react-three/drei` also stay.

**How to avoid:**
Before ANY `npm uninstall`, run this audit: `grep -r "from 'gsap\|from \"gsap\|from 'lenis\|from 'three\|from '@react-three" src --include="*.tsx" --include="*.ts" -l`. Map every result to lab-only vs main-site. Only uninstall packages that have zero non-lab references.

For this milestone (lab2 removal, lab retained): the only packages safe to remove are `lenis` and the lab2-specific exports from packages — NOT the packages themselves.

**Warning signs:**
- Main site horizontal scroll (Hero/About/Skills panels) stops working after `npm uninstall`
- TypeScript build error: `Cannot find module 'gsap'` in `HorizontalScrollWrapper.tsx`
- Header nav links (About, Skills) no longer scroll to sections
- `next build` fails with module resolution error on a non-lab2 file

**Phase to address:**
Phase 1 (lab2 cleanup). Run the dependency audit BEFORE touching `package.json`. Execute any package changes as a last step after source deletion is confirmed clean.

---

### Pitfall 2: Partial lab2 Deletion Leaves Dangling References and Breaks TypeScript Build

**What goes wrong:**
Files are deleted in an incomplete order. Example: `src/components/lab2/` is deleted first, but `src/app/[locale]/lab2/page.tsx` still imports from it — causing an immediate TypeScript module resolution error. Or: the route directory is removed but `Header.tsx` still renders a `<Link href="/lab2">` with `t('lab2')` from the Navigation namespace — producing a dead link and a silent next-intl MISSING_MESSAGE warning.

**Why it happens:**
lab2 has a 4-layer dependency chain. Developers tend to delete what they see first (the obvious lab2 components) without mapping the full dependency graph upward to the consuming code (Header, route page).

**Complete dependency chain that must be resolved:**

```
Header.tsx
  → Link href="/lab2"           (navigation)
  → t('Navigation.lab2')        (translation key)

src/app/[locale]/lab2/page.tsx
  → @/components/lab2/Lab2Scene
  → @/components/lab2/ui/ViewportGate
  → @/components/lab2/ui/LenisProvider
  → @/components/lab2/hooks/useViewportWidth
  → @/components/lab2/config/chapters

messages/ko.json + messages/en.json
  → "Navigation": { "lab2": "Studio" }
  → "Lab2": { "backToHome": ..., "viewportGate": ..., "loading": ... }
```

**How to avoid:**
Delete in this exact top-down order (removes consumers before providers):

1. Remove `Navigation.lab2` key from both `ko.json` and `en.json`
2. Remove the `<Link href="/lab2">` block and the `Box` lucide-react import from `Header.tsx`
3. Delete `src/app/[locale]/lab2/` directory (route and layout)
4. Delete `src/components/lab2/` directory (all components, hooks, config, scenes)
5. Remove `Lab2` namespace from both message files
6. Run `next build` (not dev) to gate: zero TypeScript errors confirms clean deletion

**Warning signs:**
- TypeScript error: `Module not found: Can't resolve '@/components/lab2/...'`
- Console: `MISSING_MESSAGE: Could not resolve 'Navigation.lab2'` in next-intl
- Runtime 404 on `/ko/lab2` visible in browser after partial deletion
- `Box` icon still visible in header (unused import not caught by TypeScript alone)

**Phase to address:**
Phase 1 (lab2 cleanup). Treat deletion as a single atomic operation. Do not pause mid-deletion. Gate the phase completion on `next build` succeeding with zero errors.

---

### Pitfall 3: Forgetting to Update `next.config.ts` After Package/Route Changes

**What goes wrong:**
`next.config.ts` currently contains `transpilePackages: ['three']`. If `three` were removed (which it should NOT be in this milestone since `/lab` keeps it), the config would reference a non-existent package. Conversely, if a future milestone removes `/lab` and removes the `three` package but the config is forgotten, some Next.js versions produce a warning or edge-case build failure trying to transpile an unresolvable module.

**Why it happens:**
Config files are invisible during source code editing. Developers focus on `src/` and `package.json` but forget that `next.config.ts` encodes infrastructure assumptions about installed packages.

**How to avoid:**
After any package removal, check `next.config.ts` `transpilePackages` against the current `package.json` dependencies. For this milestone: `transpilePackages: ['three']` MUST stay because `/lab` still uses Three.js. Do not touch this line.

**Warning signs:**
- Build warning mentioning an unresolvable module in `transpilePackages`
- Unexpected webpack compilation slowness (transpiling a phantom package)

**Phase to address:**
Phase 1 (lab2 cleanup), as the final verification step after source and package changes are settled.

---

### Pitfall 4: i18n Schema Rename Causes `t.has()` to Silently Return False

**What goes wrong:**
`ProjectContent.tsx` uses `t.has(`${translationKey}.implementation.${featureKey}.title`)` to conditionally render each feature block. If the content schema is restructured — for example renaming `implementation` to `challenges`, or `feature1`/`feature2` to `challenge1`/`challenge2`, or adding a new section `tradeoffs` — the component's hardcoded key paths become stale. The result is silent empty sections: no build error, no runtime error, no console warning. The page renders with a missing section heading and the recruiter sees a half-empty page.

**Why it happens:**
`t.has()` in next-intl v4 returns `false` for missing keys instead of throwing. This graceful degradation is intentional for production resilience, but it means a schema rename without updating the consumer produces invisible breakage. The `featureKeys` array (`['feature1', 'feature2', 'feature3', 'feature4', 'feature5']`) is hardcoded in `ProjectContent.tsx` at line 13 — this must be kept in sync with any JSON key renames.

**How to avoid:**
Treat every i18n key rename as a refactor: search for the old key string in BOTH the JSON files AND all TSX/TS files before changing it.

```bash
# Before renaming 'implementation' to 'challenges':
grep -r "implementation" src --include="*.tsx" --include="*.ts"
# Check every result and update simultaneously with the JSON change
```

After any schema change, manually navigate every project detail page in both locales and visually confirm all sections render.

**Warning signs:**
- Project detail page renders with no "Technical Implementation" or "Engineering Challenges" section
- Section heading appears but all feature sub-blocks are empty
- Works in Korean locale but not English (missed updating one JSON file)
- `next build` succeeds — this does NOT catch t.has() false returns

**Phase to address:**
Phase 2 (content restructuring). Never update JSON schema without updating `ProjectContent.tsx` in the same commit. They must be changed atomically.

---

### Pitfall 5: English Locale Content Drift — Korean Updated, English Forgotten

**What goes wrong:**
Korean content is written and looks excellent. The English version lags behind with old structure, missing keys, or placeholder text. Because `t.has()` silently returns false for missing English keys, the English project pages render with empty sections. The site is live and visible to international recruiters; they see a broken experience without any error message or log.

**Why it happens:**
Writing Korean content takes full concentration. The bilingual update rule is easy to defer ("I'll do English later"). But "later" often means the English version is forgotten or the structural changes between drafts make the English update confusing. Next-intl has no built-in enforcement that `en.json` and `ko.json` have the same key structure.

**How to avoid:**
Structural parity check after each project's content update:

```bash
python3 -c "
import json
ko = json.load(open('messages/ko.json'))['ProjectDetail']
en = json.load(open('messages/en.json'))['ProjectDetail']
for project in ko:
    if project not in en:
        print('MISSING PROJECT IN EN:', project)
    else:
        ko_keys = set(str(k) for k in ko[project].keys())
        en_keys = set(str(k) for k in en[project].keys())
        if ko_keys != en_keys:
            print(f'{project} KEY MISMATCH — ko has: {ko_keys - en_keys}, en has: {en_keys - ko_keys}')
"
```

Never mark a content phase complete until this script reports zero mismatches for all projects.

**Warning signs:**
- Switching locale to `/en` shows empty feature blocks on any project page
- Section count differs between Korean and English views of the same project
- `next build` succeeds (this does NOT catch missing keys)

**Phase to address:**
Phase 2 (content restructuring) and Phase 3 (content authoring). Apply the bilingual parity check as a gate before each phase completion.

---

### Pitfall 6: Engineering Case Study Content That Reads as Generic Despite Correct Structure

**What goes wrong:**
The project pages have the right structure (problem → solution → result per feature). But the `result` fields contain only qualitative adjectives: "performance improved," "stability was better," "user experience was enhanced." Korean big tech engineering reviewers (Kakao, Naver, Toss, Coupang, Line) evaluate portfolio content technically — they recognize vague language and mark it as a signal that the candidate did not measure outcomes or understand trade-offs deeply.

**Why it happens:**
At the time of the project, specific metrics may not have been formally tracked. Candidates then write what feels truthy ("performance improved") without realizing the reviewer needs a concrete anchor. The existing content in `ko.json` already shows this pattern in some `retrospective.improvement` fields.

**Content anti-patterns to avoid (concrete examples from existing content):**

```
WEAK: "성능이 크게 개선되었습니다" (performance was greatly improved)
STRONG: "IPC 청크 분할 이후 8MB 히스토리 조회 응답이 4.2초에서 340ms로 단축"

WEAK: "사용자 경험이 향상되었습니다" (user experience was enhanced)
STRONG: "스트리밍 렌더링 도입 후 사용자 설문에서 '생성 과정이 보여서 좋다' 비율 72% → 89%"

WEAK: "안정적으로 동작하게 되었습니다" (it now works stably)
STRONG: "Zone.js 수정 후 IPC 이벤트 발생 후 UI 반영 지연: 800ms → 즉시(16ms 이내)"
```

**The specificity test — apply to every `result` field before finishing:**
> "Could a junior developer reproduce this outcome or verify this claim from the code or logs?"

If no, the result field needs one of: (a) a specific measurement (before/after numbers), (b) a named alternative that was rejected with a reason, or (c) a specific constraint that defined the problem boundary (size limit, latency threshold, API rate limit, browser limit).

**How to avoid:**
For each `feature` and `issue` block, run the specificity test explicitly. When actual metrics were not recorded during the project, use quantities derivable from the code itself:
- Number of files, components, or API endpoints touched
- Number of webpack/build passes
- Specific browser limits (Chrome's 16 WebGL context limit is a fact, not a fabrication)
- Named alternatives considered (must be real, from the actual decision at the time)

Do not fabricate measurements. "We did not track this metric, but the architecture change reduced the number of round-trips from N to 1" is specific and honest.

**Warning signs:**
- Every `result` field contains only adjectives (no numbers, no comparisons)
- `solution` field omits alternatives considered
- `problem` field lacks a specific trigger condition (what measurement, what error, what user complaint)
- The word "최적화" (optimization) appears without any baseline

**Phase to address:**
Phase 3 (content authoring). Apply the specificity test as a hard content quality gate — each feature block must pass before moving to the next project.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Delete lab2 source but leave packages in `package.json` | Faster cleanup, less package research | Bundle stays ~600KB larger (Three.js alone); creates false impression of cleanup | Never — complete the cleanup or don't start it |
| Update only `ko.json` for engineering content, add English later | Write in flow without switching context | English portfolio broken for international recruiters; easy to forget in a large content push | Never for a live recruiter-facing site |
| Add new i18n schema section without updating `ProjectContent.tsx` component | Schema evolves independently | Silent empty sections; debugging requires tracing t.has() chains through nested keys | Never — schema and consumer must change atomically |
| Leave `Navigation.lab2` key in message files after removing the route | No immediate crash | next-intl emits MISSING_MESSAGE in production logs; dead translation key pollutes message files | Never — translation cleanup is part of route deletion |
| Batch-update all 5 project `result` fields with qualitative language, then "improve later" | Fast first pass | "Later" never comes; site goes live with weak content; first impression with recruiter is poor | Never — specificity must be built in on the first write |

---

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| `next-intl` `t.has()` + content schema rename | Assume build will catch missing keys — it does not | After any key rename, manually QA all project pages in both locales (scroll full page) |
| `Header.tsx` + Navigation i18n + route existence | Remove route directory but forget header link — link stays, goes to 404 | Delete header link BEFORE or in the same commit as route directory removal |
| `package.json` `gsap`/`@gsap/react` + lab2 removal | Assume all animation packages are lab2-only | Run import-grep audit before any uninstall; `HorizontalScrollWrapper.tsx` is a non-lab consumer |
| `next.config.ts` `transpilePackages` + package state | Remove package, forget config — or remove config while `/lab` still needs it | Verify `grep -r "from 'three'" src` result before editing `transpilePackages` |
| `generateStaticParams` + project ID list + translation schema | Add a new project key to `PROJECT_IDS` without adding translation — `t(translationKey.title)` throws at build time | Any change to `PROJECT_IDS` or `PROJECT_META` in `projects/[id]/page.tsx` must have matching JSON keys in both locales |
| `t.has()` conditional rendering + section restructuring | Trust that "I'll check visually" is enough — easy to miss sections on long pages | Always run the bilingual parity script after any schema change; visual QA both locales end-to-end |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Three.js/R3F packages still in bundle after lab2 deletion if source-only was deleted | `next build` chunk analysis shows unchanged lab2 bundle size; no change in page load performance | Remove packages from `package.json` AND run `npm install` to regenerate lock file — but confirm `/lab` doesn't need them first | After lab2 source deletion, before package removal |
| Long JSON messages file causes slow cold start on first getTranslations call | `next build` takes noticeably longer; first request to each static page slower in dev | Not a current concern — at ~20K words across 14 pages, the impact is negligible at this scale | Would only matter at >500K words or >1000 static pages |

---

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Restructured project sections appear in wrong narrative order | Recruiter reads "Retrospective" before "Engineering Challenges" — narrative loses impact | Define a canonical section order in `ProjectContent.tsx` and never deviate: Overview → Image → Challenges → Troubleshooting → Retrospective |
| Removing lab2 header link breaks expected navigation if recruiter bookmarked it | 404 on a live link damages portfolio credibility | Removing lab2 is correct; no redirect needed since it was not production-featured. Removing the header link prevents users from finding the dead route |
| Generic section headings repeated across all 5 projects ("기술 구현", "트러블슈팅") make pages feel copy-pasted | Recruiter skims and perceives all projects as structurally identical | Keep consistent structure for scannability, but use the project-specific feature titles to differentiate (these already differ per project in the existing schema) |
| Result sections that are too long (wall-of-text) | Recruiter stops reading mid-section | Each `result` field should be 2-4 sentences max. Use the specificity test to force concision: one specific claim takes fewer words than vague elaboration |

---

## "Looks Done But Isn't" Checklist

- [ ] **lab2 deletion:** `next build` completes with zero TypeScript errors — dev mode with Turbopack cache can hide missing module errors
- [ ] **lab2 deletion:** `Navigation.lab2` key removed from BOTH `ko.json` AND `en.json` — check both files explicitly, not just one
- [ ] **lab2 deletion:** `Lab2` namespace removed from BOTH locale message files
- [ ] **lab2 deletion:** Header no longer shows the Box/Studio icon link — confirm by loading the site in browser, not just by reading source
- [ ] **Package audit:** `grep -r "from 'gsap\|from '@gsap/react'" src --include="*.tsx" --include="*.ts"` returns `HorizontalScrollWrapper.tsx` — confirm GSAP was NOT removed
- [ ] **Package audit:** `lenis` import grep returns zero results after lab2 deletion — confirm it is safe to uninstall
- [ ] **i18n restructure:** Switch to `/en` locale and scroll all 5 project detail pages end-to-end — zero empty sections
- [ ] **i18n restructure:** Switch to `/ko` locale and do the same
- [ ] **i18n parity:** Run bilingual parity script — zero mismatches between `ko.json` and `en.json` ProjectDetail keys
- [ ] **Content quality:** Every `result` field in every `feature` block contains at least one specific measurement, count, or before/after comparison
- [ ] **Content quality:** Every `problem` field names a specific trigger: an error, a threshold, a browser limit, or a user complaint
- [ ] **Build gate:** `next build` succeeds with zero errors after all phases complete before any commit to main

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Accidentally uninstalled `gsap`/`@gsap/react` — main site horizontal scroll broken | LOW | `npm install gsap @gsap/react --cache /tmp/npm-cache-temp` — packages restore, no code changes needed |
| Deleted lab2 mid-stream leaving TypeScript errors blocking build | LOW | `git restore src/components/lab2/` and `src/app/[locale]/lab2/` if using git; restart deletion in prescribed order |
| English locale has empty sections after ko.json content expansion | MEDIUM | Open both JSON files side-by-side, run bilingual parity script to identify exactly which keys are missing, fill them — mechanical but time-consuming for 5 projects |
| Schema renamed in JSON but `ProjectContent.tsx` still has old key paths | LOW | Run `grep -r "old_key_name" src --include="*.tsx"` to find all consumer locations; update component in one pass; rebuild |
| Generic `result` fields published to live site — recruiter already saw weak content | MEDIUM | Rewrite result fields with specificity test; deploy — content edits deploy in seconds on Vercel since they are just JSON updates baked into static generation; rebuild and redeploy |

---

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| GSAP accidentally removed with lab2 packages | Phase 1 (lab2 cleanup) — import-grep audit before any `npm uninstall` | `grep -r "from 'gsap'" src` returns `HorizontalScrollWrapper.tsx`; horizontal scroll confirmed working after cleanup |
| Partial lab2 deletion with dangling references | Phase 1 (lab2 cleanup) — delete in prescribed top-down order, gate on `next build` | `next build` completes with zero TypeScript errors |
| `transpilePackages` config out of sync | Phase 1 (lab2 cleanup) — config check as final verification step | Build passes; no "Cannot resolve module" warnings in build output |
| Schema rename silently breaks `t.has()` | Phase 2 (content restructuring) — co-locate JSON and component changes atomically | Visual QA: all sections render on all 5 project pages in both locales |
| English locale content drift | Phase 2 + Phase 3 — bilingual parity script as phase gate | Parity script returns zero mismatches; visual QA of `/en` locale |
| Generic result fields failing specificity test | Phase 3 (content authoring) — specificity test per feature block before moving to next project | Every `result` field contains at least one specific measurement or named alternative |

---

## Sources

- Direct codebase inspection (HIGH confidence):
  - `src/components/HorizontalScrollWrapper.tsx` — confirms GSAP is a main-site dependency
  - `src/app/[locale]/lab2/page.tsx` — maps full import chain from route to components
  - `src/components/layout/Header.tsx` — confirms `Navigation.lab2` key and `/lab2` link location
  - `package.json` — full dependency list cross-referenced against grep results
  - `messages/ko.json` + `messages/en.json` — confirms `Lab2` namespace and `Navigation.lab2` key locations
  - `src/components/projects/ProjectContent.tsx` — confirms `t.has()` usage and hardcoded `featureKeys` array
- next-intl official docs: https://next-intl.dev/docs/usage/translations — `t.has()` returns false, does not throw (HIGH confidence)
- next-intl official docs: https://next-intl.dev/docs/usage/configuration — `onError`/`getMessageFallback` needed for explicit missing-key handling in production (HIGH confidence)
- Next.js `generateStaticParams` docs: https://nextjs.org/docs/app/api-reference/functions/generate-static-params (HIGH confidence)
- Korean tech hiring context: `PROJECT.md` "Korean big tech IT 프론트엔드 직무 취업" target, "문제→해결→결과 구조" as the established pattern for this portfolio (HIGH confidence — first-party project context)

---

*Pitfalls research for: Portfolio v4.0 — lab2 removal + i18n content restructuring + engineering case study quality*
*Researched: 2026-03-02*
