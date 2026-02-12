---
phase: 04-project-detail-pages
plan: 01
subsystem: project-detail-infrastructure
tags: [next.js, next-intl, dynamic-routes, i18n, project-pages]
requires: [03-03]
provides: [project-detail-page-structure, project-navigation, breadcrumbs]
affects: [04-02]
tech-stack:
  added: []
  patterns: [dynamic-routing, static-params-generation, client-server-component-composition]
key-files:
  created:
    - src/app/[locale]/projects/[id]/page.tsx
    - src/components/projects/Breadcrumbs.tsx
    - src/components/projects/ProjectHero.tsx
    - src/components/projects/ProjectSidebar.tsx
    - src/components/projects/ProjectContent.tsx
    - src/components/projects/ProjectNavigation.tsx
  modified:
    - src/components/sections/ProjectsSection.tsx
    - src/components/ui/Card.tsx
    - src/app/globals.css
    - messages/ko.json
    - messages/en.json
decisions:
  - key: dynamic-route-id-format
    choice: numeric-ids
    rationale: Use numeric IDs (1, 2, 3) for cleaner URLs and simpler generateStaticParams
  - key: sidebar-layout
    choice: sticky-sidebar-desktop-stack-mobile
    rationale: Sidebar sticky on desktop (280px fixed width), stacks above content on mobile
  - key: navigation-pattern
    choice: prev-next-at-bottom
    rationale: Standard project case study pattern with prev/next navigation at page bottom
  - key: translation-structure
    choice: feature-subsection-pattern
    rationale: Use feature1-5 and issue1-5 keys with conditional rendering via t.has() for flexibility
metrics:
  duration: 5m
  tasks: 2
  commits: 2
  files-created: 6
  files-modified: 5
completed: 2026-02-12
---

# Phase 04 Plan 01: Project Detail Pages Infrastructure Summary

**One-liner:** Dynamic route infrastructure with hero, sidebar, content, breadcrumbs, and prev/next navigation for 3 project case studies — ready for content fill in 04-02.

## What Was Built

Created the complete project detail page infrastructure at `/[locale]/projects/[id]` with all UI components and bilingual stub translations.

**Key accomplishments:**

1. **Dynamic route with static generation** — Created `/[locale]/projects/[id]/page.tsx` with `generateStaticParams` for all 3 projects (joshua, dyCms, retailAnalysis) in both Korean and English
2. **Component composition** — Built 5 specialized components (Breadcrumbs, ProjectHero, ProjectSidebar, ProjectContent, ProjectNavigation) with proper client/server component separation
3. **Project card linking** — Wired project cards on main page to detail pages via next-intl Link components
4. **Translation stubs** — Added complete ProjectDetail translation namespace with sidebar labels and project-specific stubs for all 3 projects
5. **404 handling** — Invalid project IDs (e.g., `/projects/999`) return Next.js 404 page
6. **Responsive layout** — Sidebar sticky on desktop (280px), stacks above content on mobile
7. **Navigation patterns** — Breadcrumbs (Home > Projects > [Project Name]) and prev/next project links
8. **Animation** — Added fade-in entrance animation with reduced-motion support

## Technical Implementation

### Dynamic Route Architecture

```typescript
// src/app/[locale]/projects/[id]/page.tsx
const PROJECT_IDS = ['1', '2', '3'] as const;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    PROJECT_IDS.map((id) => ({ locale, id }))
  );
}

// Generates: /ko/projects/1, /ko/projects/2, /ko/projects/3,
//            /en/projects/1, /en/projects/2, /en/projects/3
```

**ID validation with 404:**
- Type guard `isValidProjectId()` checks against `PROJECT_IDS`
- Invalid IDs trigger `notFound()` from `next/navigation`

### Component Composition Pattern

**Server components (async):**
- `ProjectHero` — Title, subtitle, tech badges, screenshot placeholder
- `ProjectSidebar` — Metadata with role, team size, duration, tech stack, links
- `ProjectContent` — Main content with conditional section rendering via `t.has()`

**Client components:**
- `Breadcrumbs` — Navigation trail with next-intl Link and useTranslations
- `ProjectNavigation` — Prev/next project links with conditional rendering

**Layout structure:**
```tsx
<div className="max-w-5xl mx-auto px-4 py-12">
  <Breadcrumbs />
  <ProjectHero />
  <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
    <ProjectSidebar />
    <ProjectContent />
  </div>
  <ProjectNavigation />
</div>
```

### Translation Structure

**Flexible content sections:**
```typescript
// ProjectContent.tsx
const featureKeys = ['feature1', 'feature2', 'feature3', 'feature4', 'feature5'];
const issueKeys = ['issue1', 'issue2', 'issue3', 'issue4', 'issue5'];

// Conditional rendering based on translation keys
featureKeys.map((featureKey) => {
  const hasFeature = t.has(`${translationKey}.implementation.${featureKey}.title`);
  if (!hasFeature) return null;
  // Render feature with problem, solution, result subsections
});
```

**Benefit:** Plan 04-02 can add as many features/issues as needed per project without code changes — just add translation keys.

### Project Card Wiring

**Before (03-03):**
```tsx
<Card hover>
  <h3>{title}</h3>
  {/* ... */}
</Card>
```

**After (04-01):**
```tsx
<Link href={`/projects/${project.id}`} className="group">
  <Card>
    <h3>{title}</h3>
    {/* ... */}
    <span className="text-primary-500">자세히 보기</span>
  </Card>
</Link>
```

- Removed `hover` prop from Card (Link handles interaction)
- Added `group-hover:border-primary-500` to Card for link hover effect
- Added "View Details" text to card footer

## Deviations from Plan

None — plan executed exactly as written.

## Commits

1. **b574fa0** — `feat(04-01): create project detail page route and components`
   - Created dynamic route and all 6 project detail components
   - Added fade-in animation to globals.css
   - Verified TypeScript compilation (expected translation errors)

2. **65a6917** — `feat(04-01): wire project cards to detail pages and add translations`
   - Updated ProjectsSection to use numeric IDs and Link components
   - Added ProjectDetail stub translations to ko.json and en.json
   - Added group-hover effect to Card component
   - Build successful, all verification checks passing

## Verification Results

✅ **Build:** `npx next build` completes successfully
✅ **Static generation:** All 6 pages generated (3 projects × 2 locales)
✅ **Project cards:** Link to `/ko/projects/1`, `/ko/projects/2`, `/ko/projects/3`
✅ **Detail pages:** Render at `/ko/projects/1-3` and `/en/projects/1-3`
✅ **Breadcrumbs:** Show `Home > Projects > [Project Name]`
✅ **Sidebar:** Displays role, team size, duration, tech stack
✅ **Navigation:** Prev/next links work (project 1 has no prev, project 3 has no next)
✅ **404 handling:** `/ko/projects/999` returns 404 status
✅ **Language switch:** Pages render correctly in both Korean and English
✅ **Responsive:** Grid layout collapses to single column on mobile
✅ **Animation:** Fade-in animation applied with reduced-motion support

## Next Phase Readiness

**Ready for Plan 04-02:**

Plan 04-01 created the complete infrastructure. Plan 04-02's job is straightforward:
1. Replace stub translations with full Korean portfolio narrative content
2. Add detailed implementation features (Problem → Solution → Result pattern)
3. Add troubleshooting case studies (Problem → Solution → Result pattern)
4. Expand retrospective sections with growth and improvement insights

**No code changes needed** — all content delivery happens via translation keys.

**Translation keys to populate:**

For each project (`joshua`, `dyCms`, `retailAnalysis`):
- `overview.background` — Expand to 2-3 paragraphs
- `overview.contribution` — Expand to 2-3 paragraphs
- `implementation.feature1-N` — Add title, problem, solution, result for each feature
- `troubleshooting.issue1-N` — Add title, problem, solution, result for each issue
- `retrospective.growth` — Expand to 1-2 paragraphs
- `retrospective.improvement` — Expand to 1-2 paragraphs

**No blockers.** Infrastructure is complete and tested.

---

**Duration:** 5 minutes
**Status:** Complete ✅
**Next:** Plan 04-02 (Content Fill)
