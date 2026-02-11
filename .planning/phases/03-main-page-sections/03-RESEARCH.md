# Phase 3: Main Page Sections - Research

**Researched:** 2026-02-11
**Domain:** Next.js 16 content sections with bilingual support (next-intl)
**Confidence:** HIGH

## Summary

Phase 3 involves building all main page content sections (Hero, About, Skills, Projects, Experience, Education, Contact) with full Korean/English bilingual support. The project already has a solid foundation with next-intl configured, Tailwind v4 design system, and base UI components (Card, Timeline, Badge).

The standard approach for this phase is to create async server components that use `getTranslations` from next-intl for bilingual content, organize sections in a feature-based structure, apply Tailwind's mobile-first responsive patterns, and leverage the existing UI component library. Since Phase 2 established the layout and design system with data-theme attributes, flex-col layout, and border-only card styling, Phase 3 can focus purely on content presentation.

Key technical decisions already locked in from STATE.md include: async components with `getTranslations` (not hooks), Tailwind v4 CSS-first configuration with @theme blocks, next-themes for dark mode via data-theme attributes, and CSS animations over Framer Motion for simple transitions.

**Primary recommendation:** Build each section as an async server component with bilingual message keys, organize content data in JSON translation files, use mobile-first Tailwind classes with the existing design tokens, and compose sections using the established Card/Timeline/Badge components. Add lucide-react for icons (GitHub, email, etc.) to maintain consistent design with Tailwind v4 aesthetics.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| next-intl | ^4.8.2 | i18n for Next.js App Router | Official next-intl docs show it as the industry standard for Next.js i18n with full App Router support; already installed |
| lucide-react | latest | Icon library | Modern, tree-shakable, 1500+ icons, matches Tailwind aesthetic, recommended for Next.js 2026 |
| Next.js | ^16.1.6 | Framework | Already installed; async components are the standard pattern |
| Tailwind CSS | ^4.1.18 | Styling | Already installed; mobile-first responsive design |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| clsx | ^2.1.1 | Conditional classes | Already installed; use for dynamic className composition |
| next-themes | ^0.4.6 | Dark mode | Already installed; supports data-theme attribute pattern |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| lucide-react | react-icons | react-icons offers 50k+ icons but larger bundle; Lucide is lighter and more curated |
| lucide-react | heroicons | heroicons has only 316 icons; Lucide offers 1500+ with similar Tailwind aesthetic |
| next-intl | react-i18next | react-i18next requires more boilerplate; next-intl is Next.js-native with better App Router integration |

**Installation:**
```bash
npm install lucide-react
```

**Source:** [Best React Icon Libraries for 2026](https://mighil.com/best-react-icon-libraries), [Lucide React Official](https://lucide.dev/guide/packages/lucide-react), [9+ Best Next.js Icon Library for 2026](https://lineicons.com/blog/best-next-js-icon-library)

## Architecture Patterns

### Recommended Project Structure
```
src/
├── app/
│   └── [locale]/
│       └── page.tsx              # Main page - composes all sections
├── components/
│   ├── sections/                 # Feature: Main page sections
│   │   ├── HeroSection.tsx       # Hero with name, title, intro, links
│   │   ├── AboutSection.tsx      # Self-introduction content
│   │   ├── SkillsSection.tsx     # Tech stack categorized
│   │   ├── ProjectsSection.tsx   # 3 project cards
│   │   ├── ExperienceSection.tsx # Career timeline
│   │   ├── EducationSection.tsx  # Education timeline
│   │   └── ContactSection.tsx    # Contact info and links
│   ├── ui/                       # Already exists
│   │   ├── Card.tsx              # Reuse for project cards
│   │   ├── Timeline.tsx          # Reuse for experience/education
│   │   ├── Badge.tsx             # Reuse for tech stack
│   │   └── Button.tsx            # Already exists
│   └── layout/                   # Already exists
│       ├── Header.tsx
│       └── Footer.tsx
└── lib/
    └── utils.ts                  # cn() utility already exists
```

**Source:** [Next.js 16 App Router Project Structure: The Definitive Guide](https://makerkit.dev/blog/tutorials/nextjs-app-router-project-structure), [Next js Folder Structure Best Practices (2026 Guide)](https://www.codebydeep.com/blog/next-js-folder-structure-best-practices-for-scalable-applications-2026-guide)

### Pattern 1: Async Server Components with getTranslations
**What:** Section components as async functions using `getTranslations` for bilingual content
**When to use:** All section components (Hero, About, Skills, Projects, Experience, Education, Contact)
**Example:**
```typescript
// Source: https://next-intl.dev/docs/environments/server-client-components
import { getTranslations } from 'next-intl/server';

export default async function HeroSection() {
  const t = await getTranslations('Hero');

  return (
    <section className="py-20">
      <h1 className="text-4xl font-bold md:text-6xl">
        {t('name')}
      </h1>
      <p className="text-xl text-neutral-600 dark:text-neutral-400 md:text-2xl">
        {t('title')}
      </p>
      <p className="text-neutral-600 dark:text-neutral-400">
        {t('intro')}
      </p>
    </section>
  );
}
```

### Pattern 2: Mobile-First Responsive Layout
**What:** Start with mobile styles, progressively enhance with breakpoint prefixes
**When to use:** All sections need responsive layouts
**Example:**
```typescript
// Source: https://tailwindcss.com/docs/responsive-design
<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
  {/* Mobile: 1 column, Tablet: 2 columns, Desktop: 3 columns */}
  <ProjectCard />
  <ProjectCard />
  <ProjectCard />
</div>
```

**Tailwind Breakpoints (mobile-first):**
- Base (unprefixed): All screen sizes (mobile)
- `sm:` - 640px and up (small tablet)
- `md:` - 768px and up (tablet)
- `lg:` - 1024px and up (desktop)
- `xl:` - 1280px and up (large desktop)

**Source:** [Tailwind CSS Responsive Design](https://tailwindcss.com/docs/responsive-design), [Tailwind CSS Best Practices 2026](https://www.frontendtools.tech/blog/tailwind-css-best-practices-design-system-patterns)

### Pattern 3: Bilingual Content Structure
**What:** Organize translation messages by section with nested keys
**When to use:** All translatable content
**Example:**
```json
// messages/ko.json
{
  "Hero": {
    "name": "박훈일",
    "title": "프론트엔드 개발자",
    "intro": "깔끔하고 정교한 웹 경험을 만듭니다"
  },
  "Skills": {
    "title": "기술 스택",
    "frontend": "프론트엔드",
    "backend": "백엔드",
    "categories": {
      "frontend": ["TypeScript", "React", "Next.js"],
      "backend": ["NestJS", "FastAPI", "PostgreSQL"]
    }
  }
}

// messages/en.json
{
  "Hero": {
    "name": "Hunil Park",
    "title": "Frontend Developer",
    "intro": "Crafting clean and refined web experiences"
  },
  "Skills": {
    "title": "Tech Stack",
    "frontend": "Frontend",
    "backend": "Backend",
    "categories": {
      "frontend": ["TypeScript", "React", "Next.js"],
      "backend": ["NestJS", "FastAPI", "PostgreSQL"]
    }
  }
}
```

**Source:** [Internationalization of Server & Client Components](https://next-intl.dev/docs/environments/server-client-components), [Next.js App Router internationalization](https://next-intl.dev/docs/getting-started/app-router)

### Pattern 4: Component Composition with Existing UI Library
**What:** Compose sections using Card, Timeline, Badge components from Phase 2
**When to use:** Projects (Card), Experience/Education (Timeline), Tech stack (Badge)
**Example:**
```typescript
// Source: Existing components from Phase 2
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

export default async function ProjectsSection() {
  const t = await getTranslations('Projects');

  return (
    <section className="py-20">
      <h2 className="text-3xl font-bold mb-8">{t('title')}</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card hover>
          <h3 className="text-xl font-bold mb-2">{t('project1.title')}</h3>
          <p className="text-neutral-600 dark:text-neutral-400 mb-4">
            {t('project1.description')}
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge>TypeScript</Badge>
            <Badge>React</Badge>
            <Badge>Next.js</Badge>
          </div>
        </Card>
      </div>
    </section>
  );
}
```

### Pattern 5: Icon Integration with lucide-react
**What:** Use Lucide icons for contact links, social media, external links
**When to use:** Hero section (GitHub, email, Velog), Contact section
**Example:**
```typescript
// Source: https://lucide.dev/guide/packages/lucide-react
import { Github, Mail, ExternalLink } from 'lucide-react';

<div className="flex gap-4">
  <a href="https://github.com/HoonilP" className="flex items-center gap-2">
    <Github className="w-5 h-5" />
    <span>GitHub</span>
  </a>
  <a href="mailto:phoonil0927@gmail.com" className="flex items-center gap-2">
    <Mail className="w-5 h-5" />
    <span>Email</span>
  </a>
</div>
```

**Source:** [Using Lucide React Icons in Next.js](https://tutorend.com/tutorials/using-lucide-icons-in-nextjs-react-js), [Lucide React](https://lucide.dev/guide/packages/lucide-react)

### Anti-Patterns to Avoid

- **Large monolithic components:** Don't put all sections in one file; create separate section components for maintainability
  - **Source:** [Essential React Design Patterns: Guide for 2026](https://trio.dev/essential-react-design-patterns/)

- **Using sm: for mobile styles:** Tailwind is mobile-first; use unprefixed classes for mobile, sm: for 640px+
  - **Source:** [Tailwind CSS Responsive Design](https://tailwindcss.com/docs/responsive-design)

- **Hardcoded strings:** Never hardcode Korean/English text; always use translation keys via getTranslations
  - **Source:** [Lessons From Linguistics: i18n Best Practices](https://shopify.engineering/internationalization-i18n-best-practices-front-end-developers)

- **Array index as key:** When mapping timeline items or project cards, use stable IDs, not array indexes
  - **Source:** [6 Common React Anti-Patterns](https://itnext.io/6-common-react-anti-patterns-that-are-hurting-your-code-quality-904b9c32e933)

- **Client components for static content:** Keep sections as server components; only make interactive parts client components
  - **Source:** [How to Handle React Server Components in Next.js](https://oneuptime.com/blog/post/2026-01-24-nextjs-react-server-components/view)

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Timeline UI | Custom timeline with lines and dots | Use existing Timeline.tsx from Phase 2 | Already built in Phase 2, handles dark mode, vertical line styling |
| Card layouts | Custom divs with borders | Use existing Card.tsx from Phase 2 | Already has hover states, border-only design, consistent with design system |
| Tech badges | Span elements with custom styles | Use existing Badge.tsx from Phase 2 | Already has dark mode support, consistent spacing, design system colors |
| Icons | SVG files or custom icon components | lucide-react library | Tree-shakable, 1500+ icons, TypeScript support, optimized SVGs |
| Conditional classes | Template strings with ternaries | clsx (already installed) | Already in utils.ts as cn(), handles null/undefined gracefully |

**Key insight:** Phase 2 already built the UI component library. Phase 3 should compose these components, not rebuild them. The design system decisions (border-only cards, data-theme, no shadows) are locked in.

## Common Pitfalls

### Pitfall 1: Breaking Mobile-First Responsive Design
**What goes wrong:** Using `sm:text-center` to center text on mobile, causing left-aligned text on mobile instead
**Why it happens:** Misunderstanding Tailwind's mobile-first approach; `sm:` means "at 640px and above", not "on small screens"
**How to avoid:** Always start with mobile styles (unprefixed), then add breakpoint prefixes for larger screens
**Warning signs:** Styles not applying on mobile; styles only appearing on larger screens
**Example:**
```typescript
// Wrong
<h1 className="sm:text-center">Title</h1>  // Left-aligned on mobile, centered on 640px+

// Correct
<h1 className="text-center sm:text-left">Title</h1>  // Centered on mobile, left-aligned on 640px+
```
**Source:** [Tailwind CSS Responsive Design](https://tailwindcss.com/docs/responsive-design), [Best Practices for Mobile Responsiveness](https://medium.com/@rameshkannanyt0078/best-practices-for-mobile-responsiveness-with-tailwind-css-5b37e910b91c)

### Pitfall 2: Translation Interpolation Errors
**What goes wrong:** English grammar patterns embedded in translation strings fail in Korean (e.g., "worked at {company}" vs "회사에서 일함")
**Why it happens:** Baking English grammar assumptions into code; Korean has different word order and particles
**How to avoid:** Keep entire sentences/phrases as single translation keys; avoid splitting sentences for interpolation
**Warning signs:** Grammatically incorrect Korean translations; awkward sentence structures
**Example:**
```typescript
// Wrong - assumes English word order
<p>{t('workedAt')} {company}</p>  // "worked at Samsung" works, but not Korean

// Correct - complete sentence with placeholder
<p>{t('experience', { company })}</p>  // Both "worked at Samsung" and "삼성에서 근무" work
```
**Source:** [Lessons From Linguistics: i18n Best Practices](https://shopify.engineering/internationalization-i18n-best-practices-front-end-developers), [Building a Multilingual Static Website](https://medium.com/@nohanabil/building-a-multilingual-static-website-a-step-by-step-guide-7af238cc8505)

### Pitfall 3: Using useTranslations Hook in Async Components
**What goes wrong:** Runtime error "Cannot use hooks in async components"
**Why it happens:** Async components are server-only; hooks require client components
**How to avoid:** Use `getTranslations` from 'next-intl/server' for async components; only use `useTranslations` in client components
**Warning signs:** "You're importing a component that needs X. It only works in a Client Component" error
**Example:**
```typescript
// Wrong - hook in async component
import { useTranslations } from 'next-intl';
export default async function HeroSection() {
  const t = useTranslations('Hero');  // Error!
  return <h1>{t('title')}</h1>;
}

// Correct - getTranslations in async component
import { getTranslations } from 'next-intl/server';
export default async function HeroSection() {
  const t = await getTranslations('Hero');
  return <h1>{t('title')}</h1>;
}
```
**Source:** [Internationalization of Server & Client Components](https://next-intl.dev/docs/environments/server-client-components), [Best practice to use translations in Client Components](https://github.com/amannn/next-intl/discussions/298)

### Pitfall 4: Over-Nesting Section Components
**What goes wrong:** Creating complex nested component hierarchies that make sections hard to maintain
**Why it happens:** Over-engineering; trying to make everything "reusable" when sections are unique
**How to avoid:** Keep section components relatively flat; only extract when truly reusable (like project cards)
**Warning signs:** Components passing many props through multiple levels; difficulty tracking data flow
**Example:**
```typescript
// Wrong - over-nested
<HeroSection>
  <HeroContent>
    <HeroTitle>
      <HeroName>...</HeroName>
    </HeroTitle>
  </HeroContent>
</HeroSection>

// Correct - flat section component
export default async function HeroSection() {
  const t = await getTranslations('Hero');
  return (
    <section>
      <h1>{t('name')}</h1>
      <p>{t('title')}</p>
    </section>
  );
}
```
**Source:** [Essential React Design Patterns: Guide for 2026](https://trio.dev/essential-react-design-patterns/), [6 Common React Anti-Patterns](https://itnext.io/6-common-react-anti-patterns-that-are-hurting-your-code-quality-904b9c32e933)

### Pitfall 5: Inconsistent Section Spacing
**What goes wrong:** Sections have varying amounts of vertical padding, creating uneven rhythm
**Why it happens:** Not establishing a consistent spacing scale; adding padding ad-hoc
**How to avoid:** Use consistent py-* classes for section padding (e.g., py-20 for all sections)
**Warning signs:** Visual inconsistency; sections feel disconnected; scrolling feels uneven
**Example:**
```typescript
// Wrong - inconsistent spacing
<section className="py-10">Hero</section>
<section className="py-16">About</section>
<section className="py-24">Skills</section>

// Correct - consistent spacing
<section className="py-20">Hero</section>
<section className="py-20">About</section>
<section className="py-20">Skills</section>
```
**Source:** [Tailwind CSS Best Practices 2026](https://www.frontendtools.tech/blog/tailwind-css-best-practices-design-system-patterns), Portfolio design best practices

## Code Examples

Verified patterns from official sources:

### Async Server Component with getTranslations
```typescript
// Source: https://next-intl.dev/docs/environments/server-client-components
import { getTranslations } from 'next-intl/server';
import { Mail, Github, Globe } from 'lucide-react';

export default async function ContactSection() {
  const t = await getTranslations('Contact');

  return (
    <section className="py-20" id="contact">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 md:text-4xl">
          {t('title')}
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <a
            href="mailto:phoonil0927@gmail.com"
            className="flex items-center gap-3 p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:border-primary-500 transition-colors"
          >
            <Mail className="w-5 h-5" />
            <div>
              <div className="font-medium">{t('email')}</div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                phoonil0927@gmail.com
              </div>
            </div>
          </a>

          <a
            href="https://github.com/HoonilP"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:border-primary-500 transition-colors"
          >
            <Github className="w-5 h-5" />
            <div>
              <div className="font-medium">{t('github')}</div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                @HoonilP
              </div>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
```

### Mobile-First Responsive Grid
```typescript
// Source: https://tailwindcss.com/docs/responsive-design
import { getTranslations } from 'next-intl/server';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

export default async function ProjectsSection() {
  const t = await getTranslations('Projects');

  return (
    <section className="py-20" id="projects">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 md:text-4xl">
          {t('title')}
        </h2>

        {/* Mobile: 1 column, Tablet: 2 columns, Desktop: 3 columns */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card hover>
            <h3 className="text-xl font-bold mb-2">{t('project1.title')}</h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              {t('project1.description')}
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge>TypeScript</Badge>
              <Badge>React</Badge>
              <Badge>Next.js</Badge>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
```

### Timeline Component Usage
```typescript
// Source: Existing Timeline component from Phase 2
import { getTranslations } from 'next-intl/server';
import Timeline, { type TimelineItem } from '@/components/ui/Timeline';

export default async function ExperienceSection() {
  const t = await getTranslations('Experience');

  const experiences: TimelineItem[] = [
    {
      date: t('dy2024.date'),
      title: t('dy2024.title'),
      description: t('dy2024.description'),
    },
    {
      date: t('payment.date'),
      title: t('payment.title'),
      description: t('payment.description'),
    },
    {
      date: t('dy2017.date'),
      title: t('dy2017.title'),
      description: t('dy2017.description'),
    },
  ];

  return (
    <section className="py-20" id="experience">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 md:text-4xl">
          {t('title')}
        </h2>
        <Timeline items={experiences} />
      </div>
    </section>
  );
}
```

### Skills Section with Categorization
```typescript
// Source: https://next-intl.dev/docs/environments/server-client-components
import { getTranslations } from 'next-intl/server';
import Badge from '@/components/ui/Badge';

export default async function SkillsSection() {
  const t = await getTranslations('Skills');

  const categories = [
    {
      name: t('categories.frontend.name'),
      skills: ['TypeScript', 'React', 'Next.js', 'Angular'],
    },
    {
      name: t('categories.backend.name'),
      skills: ['NestJS', 'FastAPI', 'Python'],
    },
    {
      name: t('categories.devops.name'),
      skills: ['AWS', 'Docker', 'Kubernetes'],
    },
    {
      name: t('categories.database.name'),
      skills: ['MySQL', 'PostgreSQL'],
    },
  ];

  return (
    <section className="py-20" id="skills">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 md:text-4xl">
          {t('title')}
        </h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {categories.map((category, idx) => (
            <div key={idx}>
              <h3 className="text-lg font-semibold mb-4">
                {category.name}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <Badge key={skill}>{skill}</Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Client components with useTranslations | Async server components with getTranslations | Next.js 13+ (2023) | Better performance, no client-side i18n bundle |
| Class-based responsive design | Mobile-first utility classes | Tailwind v2+ (2020) | Cleaner markup, easier to reason about |
| Custom JSON for i18n | next-intl with App Router | next-intl 3.0+ (2023) | Type-safe translations, better DX |
| Font Awesome / react-icons | lucide-react | 2024-2025 | Smaller bundles, tree-shakable, modern design |
| JavaScript config for Tailwind | CSS-first @theme blocks | Tailwind v4 (2024) | Faster builds, better IDE support |
| Class-based dark mode | data-theme attributes | Tailwind v4 (2024) | More reliable, prevents FOUC |

**Deprecated/outdated:**
- **getStaticProps/getServerSideProps:** Replaced by async server components in App Router
- **pages/ directory:** Replaced by app/ directory in Next.js 13+
- **tailwind.config.js:** Replaced by @theme in CSS for Tailwind v4
- **useTranslations in server components:** Use getTranslations instead

**Source:** [Next.js Architecture in 2026](https://www.yogijs.tech/blog/nextjs-project-architecture-app-router), [Tailwind CSS v4 tips](https://www.nikolailehbr.ink/blog/tailwindcss-v4-tips/)

## Open Questions

Things that couldn't be fully resolved:

1. **Project thumbnail images**
   - What we know: Phase 3 requires project thumbnails per PROJ-02
   - What's unclear: No image assets provided in PDF or PROJECT.md
   - Recommendation: Use placeholder images initially (e.g., colored divs with project initials), defer real images to Phase 4 or create task to source images

2. **Skills-to-projects connection display**
   - What we know: SKILL-02 requires showing which projects used each skill
   - What's unclear: UI pattern not specified (tooltip, link, badge, etc.)
   - Recommendation: Simplest approach is project cards showing tech badges; defer interactive skill-project linking to Phase 4 if needed

3. **Education certifications formatting**
   - What we know: EDU-04 requires showing 자격증/수상 (certifications/awards)
   - What's unclear: Should these be in timeline, separate list, or badges?
   - Recommendation: Use a simple list or badge layout within EducationSection; timeline feels too formal for certifications

## Sources

### Primary (HIGH confidence)
- next-intl official docs - [Internationalization of Server & Client Components](https://next-intl.dev/docs/environments/server-client-components)
- Tailwind CSS v4 official docs - [Responsive Design](https://tailwindcss.com/docs/responsive-design)
- Lucide React official docs - [lucide-react package](https://lucide.dev/guide/packages/lucide-react)
- Next.js 16 official docs - [Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)

### Secondary (MEDIUM confidence)
- [Next.js Architecture in 2026 — Server-First, Client-Islands](https://www.yogijs.tech/blog/nextjs-project-architecture-app-router) - Architecture patterns
- [Tailwind CSS Best Practices 2026](https://www.frontendtools.tech/blog/tailwind-css-best-practices-design-system-patterns) - Design system patterns
- [Next.js 16 App Router Project Structure](https://makerkit.dev/blog/tutorials/nextjs-app-router-project-structure) - File organization
- [Best React Icon Libraries for 2026](https://mighil.com/best-react-icon-libraries) - Icon library comparison
- [Lessons From Linguistics: i18n Best Practices](https://shopify.engineering/internationalization-i18n-best-practices-front-end-developers) - i18n pitfalls

### Tertiary (LOW confidence)
- Portfolio design galleries (Muzli, 99designs) - Visual inspiration only; not technical guidance
- Generic React anti-patterns articles - Useful for awareness but not domain-specific

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries already installed or well-documented (next-intl, Tailwind v4, lucide-react)
- Architecture: HIGH - Official next-intl and Next.js 16 docs provide clear patterns for async components
- Pitfalls: HIGH - Official docs + verified articles on mobile-first, i18n, and server components
- Code examples: HIGH - All examples based on official documentation or existing project components

**Research date:** 2026-02-11
**Valid until:** 2026-03-13 (30 days - stable ecosystem)

**Technologies researched:**
- Next.js 16 App Router: Async server components, streaming, performance
- next-intl 4.8: getTranslations, bilingual content structure
- Tailwind CSS v4: Mobile-first responsive design, @theme configuration
- lucide-react: Icon library integration, tree-shaking
- React 19: Component composition, TypeScript patterns

**Key constraints from STATE.md honored:**
- ✅ Use getTranslations (not useTranslations) for async components
- ✅ Tailwind v4 CSS-first configuration with @theme blocks
- ✅ data-theme attribute for dark mode (next-themes)
- ✅ Border-only cards without shadows (design decision)
- ✅ CSS animations over Framer Motion (Phase 2 decision)
- ✅ Compose existing Card/Timeline/Badge components from Phase 2
