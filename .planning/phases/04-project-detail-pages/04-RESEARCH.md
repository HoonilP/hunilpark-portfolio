# Phase 4: Project Detail Pages - Research

**Researched:** 2026-02-12
**Domain:** Next.js App Router dynamic routes, next-intl internationalization, Korean frontend portfolio standards
**Confidence:** MEDIUM-HIGH

## Summary

Phase 4 requires creating dedicated project detail pages for three projects (Joshua AI Agent, DY CMS, Retail Analysis) with bilingual support, using Next.js 16 App Router dynamic routes combined with next-intl's locale routing. The pages must follow Korean big tech frontend portfolio standards, which emphasize detailed technical implementation descriptions, troubleshooting narratives, and clear problem-solving processes.

The standard approach is to use ID-based dynamic routes (`/[locale]/projects/[id]/page.tsx`) with `generateStaticParams` for both locale and project ID, combined with `setRequestLocale` for static rendering. For layout, Korean frontend portfolios favor hero-style headers with metadata sidebars (desktop) and detailed technical narratives including troubleshooting sections following a "Problem → Attempted Solutions → Comparison → Learnings" structure.

Page transitions should use CSS-based approaches (View Transitions API or Tailwind CSS utilities) rather than JavaScript animation libraries to minimize bundle size and complexity in the App Router environment.

**Primary recommendation:** Use Next.js App Router dynamic routes with next-intl locale segments, implement breadcrumb navigation using `usePathname`, create responsive sidebar layouts with metadata, and structure project content following Korean tech portfolio standards with 3-4 projects featuring detailed troubleshooting sections.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 16.1.6 | App Router with dynamic routes | Official React framework, App Router is current standard for new projects |
| next-intl | 4.8.2 | Internationalization with locale routing | De facto standard for i18n in Next.js App Router, supports static rendering |
| TypeScript | 5.x | Type safety for route params | Provides `PageProps<'/route'>` helper for typed params |
| Tailwind CSS | 4.1.18 | Styling and animations | Already in use, provides utility classes for transitions |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| lucide-react | 0.563.0 | Icons for navigation/UI | Already in use for breadcrumbs, prev/next buttons |
| clsx | 2.1.1 | Conditional CSS classes | Already in use for dynamic styling |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| View Transitions API | Framer Motion | Framer Motion has known issues with App Router (requires fragile workarounds), adds significant bundle size. View Transitions API is native browser feature with CSS-only implementation |
| ID-based routes | Slug-based routes | ID-based (`/projects/1`) simpler for small fixed set of projects, slug-based better for large dynamic content but requires more validation |
| next-intl | next-translate | next-intl has better App Router integration, static rendering support with `setRequestLocale`, and more active maintenance |

**Installation:**
```bash
# All dependencies already installed in project
npm install next-intl next lucide-react tailwindcss typescript
```

## Architecture Patterns

### Recommended Project Structure
```
src/app/
├── [locale]/
│   ├── layout.tsx                    # Root layout with locale validation
│   ├── page.tsx                      # Home page
│   └── projects/
│       ├── [id]/
│       │   ├── page.tsx              # Project detail page
│       │   └── layout.tsx            # Optional: project-specific layout
│       └── page.tsx                  # Optional: projects index page
src/components/
├── projects/
│   ├── ProjectHero.tsx               # Hero section component
│   ├── ProjectSidebar.tsx            # Metadata sidebar
│   ├── ProjectContent.tsx            # Main content area
│   ├── ProjectNavigation.tsx         # Prev/next buttons
│   └── Breadcrumbs.tsx               # Breadcrumb navigation
src/data/
└── projects.ts                       # Project data with i18n keys
messages/
├── ko.json                           # Korean translations
└── en.json                           # English translations
```

### Pattern 1: Dynamic Route with Locale
**What:** Combine `[locale]` segment with `[id]` segment for internationalized dynamic routes
**When to use:** All project detail pages requiring bilingual support
**Example:**
```typescript
// Source: Official Next.js docs + next-intl docs
// app/[locale]/projects/[id]/page.tsx
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

// Define valid project IDs
const VALID_PROJECT_IDS = ['1', '2', '3'] as const;
type ProjectId = typeof VALID_PROJECT_IDS[number];

function isValidProjectId(id: string): id is ProjectId {
  return VALID_PROJECT_IDS.includes(id as ProjectId);
}

export async function generateStaticParams() {
  // Generate all locale + project ID combinations
  return [
    { locale: 'ko', id: '1' },
    { locale: 'ko', id: '2' },
    { locale: 'ko', id: '3' },
    { locale: 'en', id: '1' },
    { locale: 'en', id: '2' },
    { locale: 'en', id: '3' },
  ];
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  // Validate project ID
  if (!isValidProjectId(id)) {
    notFound();
  }

  const t = await getTranslations('Projects');

  return (
    <div>
      <h1>{t(`project${id}.title`)}</h1>
      {/* Content */}
    </div>
  );
}
```

### Pattern 2: Breadcrumb Navigation
**What:** Dynamic breadcrumb using `usePathname` to parse current route
**When to use:** All project detail pages for context and navigation
**Example:**
```typescript
// Source: Web research on Next.js breadcrumbs best practices
// components/projects/Breadcrumbs.tsx
'use client';

import { usePathname } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

export function Breadcrumbs() {
  const pathname = usePathname();
  const t = useTranslations('Navigation');

  // Parse pathname to build breadcrumb trail
  // For /ko/projects/1 -> ['홈', '프로젝트', 'Project Name']
  const segments = pathname.split('/').filter(Boolean);

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-2 text-sm">
        <li>
          <Link href="/">{t('home')}</Link>
        </li>
        <li aria-hidden="true">/</li>
        <li>
          <Link href="/#projects">{t('projects')}</Link>
        </li>
        <li aria-hidden="true">/</li>
        <li aria-current="page">
          {/* Project title */}
        </li>
      </ol>
    </nav>
  );
}
```

### Pattern 3: Sidebar Metadata Layout
**What:** Two-column layout with sticky sidebar for metadata, main content area
**When to use:** Desktop layout for project detail pages
**Example:**
```typescript
// Source: Web research on responsive sidebar patterns
// components/projects/ProjectLayout.tsx
export function ProjectLayout({
  sidebar,
  children
}: {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
      {/* Sidebar - sticky on desktop, stacked on mobile */}
      <aside className="lg:sticky lg:top-20 lg:h-fit">
        {sidebar}
      </aside>

      {/* Main content */}
      <main className="min-w-0">
        {children}
      </main>
    </div>
  );
}
```

### Pattern 4: Korean Portfolio Content Structure
**What:** Technical narrative following Problem → Approach → Solution → Learnings format
**When to use:** Main content area of project detail pages
**Example structure:**
```markdown
## 프로젝트 개요
- 배경 및 목표
- 담당 역할 및 기여도
- 주요 성과

## 기술 구현
### [Feature 1]
**문제**: 구체적인 기술 과제
**시도한 방법들**:
1. 첫 번째 접근 방식 (결과)
2. 두 번째 접근 방식 (결과)
**최종 해결**: 채택한 솔루션 및 이유
**배운 점**: 기술적 인사이트

### [Feature 2]
(동일한 구조 반복)

## 트러블슈팅
### [주요 문제 1]
- 문제 상황
- 원인 분석
- 해결 과정
- 개선 결과 (정량적 데이터 포함 가능)

## 회고
- 기술적 성장
- 개선할 점
```

### Pattern 5: Page Transitions with View Transitions API
**What:** CSS-only page transitions using native browser API
**When to use:** Smooth navigation between project pages
**Example:**
```typescript
// Source: Web research on Next.js View Transitions API
// app/[locale]/projects/[id]/page.tsx
export default async function ProjectDetailPage() {
  return (
    <div className="animate-in fade-in duration-300">
      {/* Content */}
    </div>
  );
}
```

```css
/* globals.css */
/* View Transitions API support */
::view-transition-old(root) {
  animation: fade-out 0.3s ease-in-out;
}

::view-transition-new(root) {
  animation: fade-in 0.3s ease-in-out;
}

@keyframes fade-out {
  from { opacity: 1; }
  to { opacity: 0; }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Tailwind alternative for components */
.animate-in {
  animation: fade-in 0.3s ease-in-out;
}
```

### Anti-Patterns to Avoid
- **Don't use Framer Motion AnimatePresence in App Router**: Known issues with component lifecycle, requires fragile workarounds using internal Next.js APIs that can break
- **Don't skip `setRequestLocale` in dynamic routes**: Without it, next-intl forces dynamic rendering, preventing static generation
- **Don't create separate routes for each locale**: Use `[locale]` segment with `generateStaticParams` instead of `/ko/projects` and `/en/projects`
- **Don't use generic project descriptions**: Korean recruiters expect detailed technical implementation, troubleshooting, and problem-solving narratives
- **Don't make sidebar non-collapsible on mobile**: Metadata sidebar should stack above content on mobile, not overlay or remain side-by-side

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Locale routing | Custom locale detection and routing | next-intl's `[locale]` segment + middleware | Handles edge cases (missing locale, invalid locale, SEO hreflang), supports static rendering |
| Route transitions | Custom React context for animation state | View Transitions API or Tailwind CSS utilities | Native browser feature, no JavaScript needed, simpler implementation |
| Breadcrumb generation | Manual hardcoded breadcrumbs | Dynamic parsing from `usePathname` | Automatically updates with route changes, DRY principle |
| Link localization | Custom Link wrapper with locale injection | next-intl's `Link` component from `@/i18n/navigation` | Automatically prefixes locale, type-safe with `pathnames` config |
| Static params generation | Manual list of all route combinations | Function that maps locales × project IDs | Single source of truth, less error-prone |

**Key insight:** Next.js App Router with next-intl provides comprehensive i18n routing with static rendering support. Custom solutions for locale handling, route transitions, or navigation will likely miss edge cases and add complexity. The View Transitions API eliminates need for animation libraries in most cases.

## Common Pitfalls

### Pitfall 1: Params as Promise Not Awaited
**What goes wrong:** Accessing `params.id` directly instead of `await params` causes TypeScript errors or runtime issues in Next.js 15+
**Why it happens:** Next.js 15+ changed params to be a Promise for better streaming support
**How to avoid:** Always `await params` before accessing dynamic segments: `const { id } = await params`
**Warning signs:** TypeScript error "Property 'id' does not exist on type 'Promise<...>'"

### Pitfall 2: Missing `setRequestLocale` Prevents Static Rendering
**What goes wrong:** Pages render dynamically at runtime instead of statically at build time, slower performance
**Why it happens:** Without `setRequestLocale`, next-intl reads locale from headers (runtime-only API)
**How to avoid:** Call `setRequestLocale(locale)` at the top of every page/layout before using `useTranslations` or `getTranslations`
**Warning signs:** Build output shows page as dynamic (λ) instead of static (○), or build warnings about dynamic APIs

### Pitfall 3: Invalid Project ID Not Handled
**What goes wrong:** Accessing `/projects/999` or `/projects/invalid` shows error or empty page
**Why it happens:** No validation of dynamic route parameters
**How to avoid:** Create type-safe validation with `isValidProjectId` helper, call `notFound()` for invalid IDs
**Warning signs:** 500 errors when accessing non-existent projects, or error logs in console

### Pitfall 4: Sidebar Content Too Dense on Mobile
**What goes wrong:** Metadata sidebar makes page scroll long and difficult to read on mobile
**Why it happens:** Desktop sidebar layout applied to mobile without responsive changes
**How to avoid:** Use `lg:sticky lg:top-20` to only make sidebar sticky on large screens, let it stack naturally on mobile
**Warning signs:** Mobile users have to scroll far to reach content, high mobile bounce rates

### Pitfall 5: Translation Keys Not Structured for Multiple Projects
**What goes wrong:** Difficult to maintain separate content for 3 projects in Korean and English
**Why it happens:** Flat translation structure like `Projects.title` instead of namespaced keys
**How to avoid:** Use nested structure: `Projects.project1.title`, `Projects.project1.description`, etc.
**Warning signs:** Large unmaintainable translation files, difficulty finding correct key

### Pitfall 6: Breadcrumbs Show Raw Slugs/IDs Instead of Titles
**What goes wrong:** Breadcrumb shows "홈 > 프로젝트 > 1" instead of "홈 > 프로젝트 > Joshua AI Agent"
**Why it happens:** Breadcrumb component only parses URL segments, doesn't fetch project titles
**How to avoid:** Create project ID → title mapping, look up title in breadcrumb component
**Warning signs:** User confusion about current page, poor UX

### Pitfall 7: Korean Portfolio Content Too Brief
**What goes wrong:** Portfolio doesn't get callbacks/interviews from Korean big tech
**Why it happens:** Following Western portfolio standards (brief, bullet points) instead of Korean expectations (detailed narratives)
**How to avoid:** Include 3-4 detailed projects with troubleshooting sections, explain problem-solving process, show technical depth
**Warning signs:** Recruiters feedback asking for more detail, low interview rate

## Code Examples

Verified patterns from official sources:

### Generating Static Params for Locale + Project ID
```typescript
// Source: Next.js official docs + next-intl docs
// app/[locale]/projects/[id]/page.tsx
import { routing } from '@/i18n/routing';

const PROJECT_IDS = ['1', '2', '3'] as const;

export async function generateStaticParams() {
  // Generate all combinations of locale × project ID
  return routing.locales.flatMap((locale) =>
    PROJECT_IDS.map((id) => ({
      locale,
      id,
    }))
  );
}
```

### Type-Safe Project ID Validation
```typescript
// Source: Next.js TypeScript docs
const VALID_PROJECT_IDS = ['1', '2', '3'] as const;
type ProjectId = typeof VALID_PROJECT_IDS[number];

function isValidProjectId(id: string): id is ProjectId {
  return VALID_PROJECT_IDS.includes(id as ProjectId);
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = await params;

  if (!isValidProjectId(id)) {
    notFound();
  }

  // TypeScript now knows id is '1' | '2' | '3'
  const project = getProject(id);
}
```

### Prev/Next Project Navigation
```typescript
// Source: Web research on portfolio navigation patterns
// components/projects/ProjectNavigation.tsx
'use client';

import { Link } from '@/i18n/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PROJECT_ORDER = ['1', '2', '3'] as const;

export function ProjectNavigation({ currentId }: { currentId: string }) {
  const currentIndex = PROJECT_ORDER.indexOf(currentId as any);
  const prevId = currentIndex > 0 ? PROJECT_ORDER[currentIndex - 1] : null;
  const nextId = currentIndex < PROJECT_ORDER.length - 1 ? PROJECT_ORDER[currentIndex + 1] : null;

  return (
    <nav className="flex justify-between items-center py-8 border-t">
      {prevId ? (
        <Link
          href={`/projects/${prevId}`}
          className="flex items-center gap-2 hover:underline"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous Project
        </Link>
      ) : <div />}

      {nextId ? (
        <Link
          href={`/projects/${nextId}`}
          className="flex items-center gap-2 hover:underline"
        >
          Next Project
          <ChevronRight className="w-4 h-4" />
        </Link>
      ) : <div />}
    </nav>
  );
}
```

### Responsive Sidebar with Metadata
```typescript
// Source: Web research on responsive sidebar patterns
// components/projects/ProjectSidebar.tsx
import { Badge } from '@/components/ui/Badge';
import { ExternalLink, Github } from 'lucide-react';

interface ProjectMeta {
  techStack: string[];
  role: string;
  teamSize: string;
  duration: string;
  githubUrl?: string;
  liveUrl?: string;
}

export function ProjectSidebar({ meta }: { meta: ProjectMeta }) {
  return (
    <aside className="space-y-6 p-6 border rounded-lg">
      {/* Tech Stack */}
      <div>
        <h3 className="font-semibold mb-2">기술 스택</h3>
        <div className="flex flex-wrap gap-2">
          {meta.techStack.map((tech) => (
            <Badge key={tech}>{tech}</Badge>
          ))}
        </div>
      </div>

      {/* Role */}
      <div>
        <h3 className="font-semibold mb-1">역할</h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {meta.role}
        </p>
      </div>

      {/* Team Size */}
      <div>
        <h3 className="font-semibold mb-1">팀 규모</h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {meta.teamSize}
        </p>
      </div>

      {/* Duration */}
      <div>
        <h3 className="font-semibold mb-1">기간</h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {meta.duration}
        </p>
      </div>

      {/* Links */}
      <div className="flex flex-col gap-2">
        {meta.githubUrl && (
          <a
            href={meta.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm hover:underline"
          >
            <Github className="w-4 h-4" />
            GitHub
          </a>
        )}
        {meta.liveUrl && (
          <a
            href={meta.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm hover:underline"
          >
            <ExternalLink className="w-4 h-4" />
            Live Demo
          </a>
        )}
      </div>
    </aside>
  );
}
```

### Hero Section for Project Detail
```typescript
// Source: Web research on hero section best practices
// components/projects/ProjectHero.tsx
import { Badge } from '@/components/ui/Badge';

interface ProjectHeroProps {
  title: string;
  subtitle: string;
  techStack: string[];
  imagePlaceholder?: boolean;
}

export function ProjectHero({
  title,
  subtitle,
  techStack,
  imagePlaceholder = true
}: ProjectHeroProps) {
  return (
    <div className="space-y-6">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-4xl md:text-5xl font-bold mb-3">
          {title}
        </h1>
        <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400">
          {subtitle}
        </p>
      </div>

      {/* Tech Stack Badges */}
      <div className="flex flex-wrap gap-2">
        {techStack.map((tech) => (
          <Badge key={tech} variant="secondary">
            {tech}
          </Badge>
        ))}
      </div>

      {/* Hero Image Placeholder */}
      {imagePlaceholder && (
        <div className="w-full h-[400px] bg-neutral-200 dark:bg-neutral-800 rounded-lg flex items-center justify-center">
          <span className="text-neutral-500 dark:text-neutral-400">
            Project Image Placeholder
          </span>
        </div>
      )}
    </div>
  );
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Pages Router with custom i18n | App Router with next-intl | Next.js 13+ (2023) | Better performance, native layouts, simpler data fetching |
| Synchronous params | Async params (Promise) | Next.js 15 (2024) | Better streaming support, requires await |
| Framer Motion for transitions | View Transitions API | 2025-2026 | Native browser feature, less bundle size, simpler code |
| react-i18next | next-intl | App Router era | Better App Router integration, static rendering support |
| Slug-based all projects | Mix of ID/slug based on scale | Ongoing | ID simpler for small fixed sets, slug better for large scale |

**Deprecated/outdated:**
- **Framer Motion AnimatePresence in App Router**: Requires fragile workarounds, View Transitions API is preferred
- **`next-i18next`**: Designed for Pages Router, next-intl is standard for App Router
- **Synchronous params access**: Next.js 15+ requires `await params`
- **Brief Western-style portfolios for Korean market**: Korean big tech expects detailed technical narratives with troubleshooting sections

## Korean Frontend Portfolio Standards

### Content Structure (Research Findings)

**MEDIUM Confidence** - Based on multiple Korean tech blog sources

Korean big tech companies (Naver, Kakao, Line, Coupang, Baemin) and mid-tier companies expect:

1. **Project Quantity**: 3-4 carefully selected projects showing depth over breadth
2. **Detail Level**: Detailed and specific descriptions, not brief bullet points
3. **Troubleshooting Section**: Essential for high success rates
   - Structure: Problem → Attempted Solutions → Comparison → Learnings
   - Shows problem-solving process and technical thinking
4. **Technical Depth**:
   - Specific implementation details
   - Role and contribution percentage
   - Tech stack with framework/library details
   - Code examples/snippets linked via blog posts
5. **Consistent Format**: All projects should follow same structure for readability
6. **Visual Evidence**: Screenshots showing "before/after" or process flow

### Recommended Content Length

**LOW-MEDIUM Confidence** - Inferred from sources, no explicit metrics

- **Not found**: Specific word count or character limits
- **Guideline**: "As detailed and specific as possible"
- **Balance**: Detailed enough to show technical depth, but structured for readability
- **Interview prep**: Content should support 30-60 minute deep technical discussion per project

### Sources Referenced

- [신입 개발자의 포트폴리오 작성법](https://velog.io/@yoosion030/%EC%8B%A0%EC%9E%85%EA%B0%9C%EB%B0%9C%EC%9E%90%ED%8F%AC%ED%8A%B8%ED%8F%B4%EB%A6%AC%EC%98%A4%EC%9E%91%EC%84%B1%EB%B2%95)
- [프론트엔드 개발자 포트폴리오 예시 - 코드스테이츠](https://www.codestates.com/blog/content/%ED%94%84%EB%A1%A0%ED%8A%B8%EC%97%94%EB%93%9C-%EA%B0%9C%EB%B0%9C%EC%9E%90-%EC%B7%A8%EC%97%85)

## Open Questions

Things that couldn't be fully resolved:

1. **Exact Content Length Guidelines for Korean Portfolios**
   - What we know: Should be "detailed and specific", include troubleshooting
   - What's unclear: Specific word count, section length recommendations
   - Recommendation: Start with 3-5 subsections per project, each 2-4 paragraphs, adjust based on content quality over quantity

2. **Code Snippet Inclusion Strategy**
   - What we know: Code examples/snippets are valued, often linked via blog posts
   - What's unclear: Inline code blocks vs external links, how much code to show
   - Recommendation: Include 1-2 key code snippets per troubleshooting section (10-20 lines max), link to blog for full implementations

3. **View Transitions API Browser Support Impact**
   - What we know: Currently Chrome/Safari only, not Firefox
   - What's unclear: Whether to implement with fallback or use Tailwind CSS utilities as primary
   - Recommendation: Use Tailwind CSS `animate-in fade-in` utilities as primary (works everywhere), View Transitions API as progressive enhancement

4. **Mobile Sidebar Behavior Preference**
   - What we know: Sidebar should adapt to mobile, common patterns exist (stack, collapse, drawer)
   - What's unclear: Korean user preference for metadata placement on mobile
   - Recommendation: Stack above content on mobile (simplest, most accessible), avoid overlays/drawers

5. **Project Order and Navigation Logic**
   - What we know: Prev/next navigation is common in portfolios
   - What's unclear: Should order be chronological (newest first) or priority-based (best first)
   - Recommendation: Priority-based with most impressive project first (ID 1 = Joshua AI Agent), since only 3 projects

## Sources

### Primary (HIGH confidence)
- [Next.js Dynamic Routes Docs](https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes) - App Router dynamic segments, params as Promise, generateStaticParams
- [next-intl Navigation Docs](https://next-intl.dev/docs/routing/navigation) - Link component with dynamic routes, locale + params combination
- [next-intl Getting Started (App Router)](https://next-intl.dev/docs/getting-started/app-router/with-i18n-routing) - setRequestLocale, generateStaticParams with locales
- Project package.json - Confirmed versions: Next.js 16.1.6, next-intl 4.8.2, Tailwind CSS 4.1.18

### Secondary (MEDIUM confidence)
- [Building Dynamic Breadcrumbs in Next.js App Router](https://jeremykreutzbender.com/blog/app-router-dynamic-breadcrumbs) - usePathname for breadcrumb generation
- [Solving Framer Motion Page Transitions in Next.js App Router](https://www.imcorfitz.com/posts/adding-framer-motion-page-transitions-to-next-js-app-router) - App Router + Framer Motion issues, fragile workarounds
- [Page Transitions in Next.js 13 with View Transitions API](https://plainenglish.io/blog/page-transitions-in-next-js-13) - CSS-only transitions without libraries
- [The Sidebar: Every Layout](https://every-layout.dev/layouts/sidebar/) - Responsive sidebar patterns
- [Hero Section Design Best Practices 2026](https://www.perfectafternoon.com/2025/hero-section-design/) - Hero section structure and content
- [신입 개발자의 포트폴리오 작성법](https://velog.io/@yoosion030/%EC%8B%A0%EC%9E%85%EA%B0%9C%EB%B0%9C%EC%9E%90%ED%8F%AC%ED%8A%B8%ED%8F%B4%EB%A6%AC%EC%98%A4%EC%9E%91%EC%84%B1%EB%B2%95) - Korean portfolio standards, troubleshooting structure
- [프론트엔드 개발자 포트폴리오 예시 - 코드스테이츠](https://www.codestates.com/blog/content/%ED%94%84%EB%A1%A0%ED%8A%B8%EC%97%94%EB%93%9C-%EA%B0%9C%EB%B0%9C%EC%9E%90-%EC%B7%A8%EC%97%85) - Project quantity, content requirements

### Tertiary (LOW confidence)
- Various web search results on developer portfolio navigation patterns - General patterns, not Next.js specific
- Korean portfolio websites examples - Visual reference but no explicit standards documentation

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Official docs and package.json confirm versions and capabilities
- Architecture: MEDIUM-HIGH - Official docs for Next.js/next-intl patterns, web research for UI patterns
- Korean portfolio standards: MEDIUM - Multiple sources agree on key points (troubleshooting, detail, 3-4 projects) but no official company guidelines
- Pitfalls: HIGH - Documented in official Next.js/next-intl docs (params Promise, setRequestLocale)
- Page transitions: MEDIUM - View Transitions API well documented but Framer Motion issues based on community reports

**Research date:** 2026-02-12
**Valid until:** ~2026-03-12 (30 days) - Next.js and next-intl are stable, portfolio standards are slow-moving

**Special notes:**
- Korean portfolio research limited by lack of official company guidelines; relied on successful applicant experiences
- Framer Motion App Router issues confirmed across multiple recent sources, View Transitions API recommended
- Project already has next-intl configured with ko/en locales, simplifies implementation
