# Architecture Patterns: Next.js Portfolio Site

**Domain:** Frontend Developer Portfolio Website
**Researched:** 2026-02-11
**Confidence:** HIGH

## Executive Summary

Next.js App Router portfolio sites with i18n follow a hybrid architecture combining:
- **Server-first rendering** for static content with optimal performance
- **Locale-based routing** via `[locale]` dynamic segment
- **Atomic component hierarchy** for maintainable UI organization
- **Static data management** via JSON files in lib folder
- **Tailwind CSS** for utility-first styling

This architecture supports the hybrid single-page + detail pages pattern with minimal complexity.

---

## Recommended Folder Structure

```
portfolio/
├── public/
│   ├── images/
│   │   ├── projects/
│   │   ├── profile/
│   │   └── skills/
│   └── resume.pdf
│
├── messages/
│   ├── ko.json          # Korean translations (default)
│   └── en.json          # English translations
│
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── layout.tsx           # Root layout with i18n provider
│   │   │   ├── page.tsx             # Main single-page portfolio
│   │   │   ├── projects/
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx     # Project detail pages
│   │   │   └── not-found.tsx
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── ui/                      # Atoms: Button, Card, Badge, etc.
│   │   ├── sections/                # Organisms: Hero, About, Skills, etc.
│   │   ├── layout/                  # Header, Footer, LocaleSwitcher
│   │   └── projects/                # ProjectCard, ProjectGallery
│   │
│   ├── lib/
│   │   ├── data/
│   │   │   ├── projects.ts          # Project data & types
│   │   │   ├── skills.ts            # Skills data & types
│   │   │   ├── experience.ts        # Experience data & types
│   │   │   └── education.ts         # Education data & types
│   │   └── utils.ts                 # Shared utilities (cn, etc.)
│   │
│   ├── i18n/
│   │   ├── routing.ts               # Locale configuration
│   │   ├── navigation.ts            # i18n navigation wrappers
│   │   └── request.ts               # Request-scoped config
│   │
│   └── proxy.ts                     # Middleware for locale detection
│
├── tailwind.config.ts
├── next.config.ts
└── tsconfig.json
```

### Folder Organization Rationale

**Route Groups NOT Used:** Since this portfolio has minimal routes (home + project details), route groups like `(marketing)` add unnecessary complexity. The `[locale]` segment provides sufficient organization.

**Private Folders NOT Used:** Components are organized in `src/components/` outside the app directory following the "store project files outside of app" pattern, which Next.js explicitly supports and recommends for cleaner separation.

**src Folder:** Used to separate application code from project configuration files (next.config.ts, tailwind.config.ts, etc.) at the root.

---

## Component Architecture

### Component Hierarchy (Atomic Design)

```
┌─────────────────────────────────────────────────────┐
│ ATOMS (ui/)                                         │
│ - Button, Link, Badge, Card, Typography, Input      │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ MOLECULES (ui/)                                     │
│ - SkillBadge, ExperienceCard, EducationCard         │
│ - SectionTitle, ContactForm                         │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ ORGANISMS (sections/ & projects/)                   │
│ - Hero, About, Skills, Projects, Experience,        │
│   Education, Contact                                │
│ - ProjectCard, ProjectGallery                       │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ LAYOUT (layout/)                                    │
│ - Header (with LocaleSwitcher)                      │
│ - Footer                                            │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ PAGES (app/[locale]/)                               │
│ - page.tsx (composes all sections)                  │
│ - projects/[slug]/page.tsx                          │
└─────────────────────────────────────────────────────┘
```

### Component Boundaries

| Component | Responsibility | Communicates With | Type |
|-----------|---------------|-------------------|------|
| **ui/Button** | Base button with variants | None (pure UI) | Client |
| **ui/Card** | Container with consistent styling | None (pure UI) | Server |
| **ui/Badge** | Skill/tag display | None (pure UI) | Server |
| **layout/Header** | Navigation, branding | LocaleSwitcher | Server |
| **layout/LocaleSwitcher** | Language toggle | i18n navigation | Client |
| **sections/Hero** | Hero section with CTA | Button, data/lib | Server |
| **sections/About** | About section | Card, data/lib | Server |
| **sections/Skills** | Skills grid | Badge, data/lib | Server |
| **sections/Projects** | Projects showcase | ProjectCard, data/lib | Server |
| **sections/Experience** | Work history timeline | ExperienceCard, data/lib | Server |
| **sections/Education** | Education history | EducationCard, data/lib | Server |
| **sections/Contact** | Contact form | Input, Button | Client |
| **projects/ProjectCard** | Single project preview | Card, Badge | Server |
| **projects/ProjectGallery** | Image gallery for detail | Images (interactive) | Client |
| **app/[locale]/page.tsx** | Main page composition | All sections | Server |
| **app/[locale]/projects/[slug]/page.tsx** | Project detail | ProjectGallery, data/lib | Server |

### Server vs Client Components

**Default: Server Components**
- All components are Server Components by default in App Router
- Renders on server, sends static HTML to client
- Can directly access data files, no API routes needed

**Use Client Components ("use client") for:**
1. **LocaleSwitcher** - Uses hooks (usePathname, useRouter) for navigation
2. **Contact Form** - Uses useState for form handling
3. **ProjectGallery** - Interactive image carousel/lightbox
4. **Any component using:**
   - Event handlers (onClick, onChange, etc.)
   - React hooks (useState, useEffect, useContext)
   - Browser APIs (localStorage, window, etc.)

**Performance principle:** Keep as much as possible in Server Components, only mark interactive portions as Client Components.

---

## Data Management Strategy

### Data Storage Pattern

**Location:** `src/lib/data/`

**Why not database/CMS:**
- Static content that changes infrequently
- No dynamic user-generated content
- Simplifies deployment (no database setup)
- Version controlled with code
- Type-safe with TypeScript

**Why not JSON files:**
While JSON files work, TypeScript files provide:
- Type safety and autocompletion
- No parsing overhead
- Direct imports
- Compile-time validation

### Data Organization

**src/lib/data/projects.ts**
```typescript
export interface Project {
  slug: string;
  title: {
    ko: string;
    en: string;
  };
  description: {
    ko: string;
    en: string;
  };
  tags: string[];
  images: string[];
  github?: string;
  demo?: string;
  featured: boolean;
}

export const projects: Project[] = [
  // ... project data
];

export function getProject(slug: string): Project | undefined {
  return projects.find(p => p.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return projects.filter(p => p.featured);
}
```

**Pattern for other data:**
- `skills.ts` - Skill categories and items
- `experience.ts` - Work history entries
- `education.ts` - Education entries

### Data Access Pattern

**In Server Components (Direct Import):**
```typescript
import { projects, getProject } from '@/lib/data/projects';

export default function ProjectsSection() {
  const featuredProjects = projects.filter(p => p.featured);
  return (
    // render projects
  );
}
```

**No API Routes Needed** - Server Components can directly import data since they run on the server.

### i18n Translation Management

**Location:** `messages/` (root level)

**Structure:**
```json
// messages/ko.json
{
  "nav": {
    "home": "홈",
    "about": "소개",
    "projects": "프로젝트",
    "contact": "연락"
  },
  "hero": {
    "title": "프론트엔드 개발자",
    "subtitle": "사용자 경험을 중시하는"
  },
  "sections": {
    "about": "소개",
    "skills": "기술 스택",
    "projects": "프로젝트",
    "experience": "경력",
    "education": "학력",
    "contact": "연락하기"
  }
}
```

**Usage in components:**
```typescript
import { useTranslations } from 'next-intl';

export default function Hero() {
  const t = useTranslations('hero');
  return <h1>{t('title')}</h1>;
}
```

**Content vs UI Translations:**
- **UI translations** (nav, buttons, labels) → `messages/*.json`
- **Content data** (project titles, descriptions) → embedded in data files with locale keys

---

## i18n Architecture

### Locale-Based Routing Structure

```
URL Pattern              File Location
/                     →  /app/[locale]/page.tsx (Korean default)
/en                   →  /app/[locale]/page.tsx (English)
/projects/my-project  →  /app/[locale]/projects/[slug]/page.tsx (Korean)
/en/projects/my-project → /app/[locale]/projects/[slug]/page.tsx (English)
```

### i18n Configuration Files

**src/i18n/routing.ts**
```typescript
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['ko', 'en'],
  defaultLocale: 'ko'
});
```

**src/i18n/navigation.ts**
```typescript
import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
```

**src/i18n/request.ts**
```typescript
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});
```

**src/proxy.ts (Middleware)**
```typescript
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: ['/', '/(ko|en)/:path*']
};
```

**src/app/[locale]/layout.tsx**
```typescript
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

export function generateStaticParams() {
  return [{ locale: 'ko' }, { locale: 'en' }];
}
```

### i18n Data Flow

```
Request
  ↓
Middleware (proxy.ts)
  ↓ (detects/validates locale)
[locale]/layout.tsx
  ↓ (loads messages)
NextIntlClientProvider
  ↓ (provides translations)
Components (useTranslations hook)
  ↓
Rendered UI
```

---

## Styling Architecture

### Tailwind CSS Organization

**Global Styles: src/app/globals.css**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    /* ... color tokens */
  }
  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    /* ... dark mode tokens */
  }
}

@layer components {
  /* Custom component classes if needed */
  .section-container {
    @apply max-w-6xl mx-auto px-4 py-16;
  }
}
```

**tailwind.config.ts**
```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Custom color system
      },
      fontFamily: {
        // Custom fonts
      },
    },
  },
  plugins: [],
};
```

### Component Styling Pattern

**Utility-First Approach:**
```typescript
// components/ui/Button.tsx
export function Button({ variant = 'primary', children }) {
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
  };

  return (
    <button className={`px-4 py-2 rounded-lg font-medium ${variants[variant]}`}>
      {children}
    </button>
  );
}
```

**Dynamic Class Management:**
Use `clsx` or `tailwind-merge` for conditional classes:
```typescript
import { cn } from '@/lib/utils';

export function Card({ className, children }) {
  return (
    <div className={cn('rounded-lg border bg-card p-6', className)}>
      {children}
    </div>
  );
}
```

**src/lib/utils.ts**
```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

## Build Order and Dependencies

### Phase 1: Foundation Setup
**No dependencies - can build in parallel**

1. **Project scaffolding**
   - Initialize Next.js with App Router
   - Install dependencies (next-intl, Tailwind, TypeScript)
   - Configure tailwind.config.ts and next.config.ts

2. **i18n configuration**
   - Create i18n/ folder with routing, navigation, request files
   - Set up proxy.ts middleware
   - Create messages/ko.json and messages/en.json

3. **Base layout structure**
   - Create [locale]/layout.tsx with NextIntlClientProvider
   - Add globals.css with Tailwind imports
   - Set up generateStaticParams for locales

**Rationale:** These are independent setup tasks with no interdependencies.

---

### Phase 2: Design System Foundation
**Depends on: Phase 1 (Tailwind config)**

4. **Utility function**
   - Create lib/utils.ts with cn() function

5. **Atomic components (ui/)**
   - Button (variants: primary, secondary, outline)
   - Card (container with consistent styling)
   - Badge (for skill tags)
   - Typography components (if needed)

**Rationale:** These primitives are used by all higher-level components. Must be built before molecules/organisms.

---

### Phase 3: Data Layer
**Depends on: None (can run parallel to Phase 2)**

6. **Data structure**
   - Define TypeScript interfaces for Project, Skill, Experience, Education
   - Create lib/data/projects.ts with sample data
   - Create lib/data/skills.ts
   - Create lib/data/experience.ts
   - Create lib/data/education.ts

7. **Translation content**
   - Populate messages/ko.json with UI translations
   - Populate messages/en.json with UI translations

**Rationale:** Data layer is independent of UI components. Can be developed/populated in parallel.

---

### Phase 4: Layout Components
**Depends on: Phase 2 (ui components), Phase 3 (i18n messages)**

8. **Header component**
   - Uses i18n navigation Links
   - Uses Button for mobile menu

9. **LocaleSwitcher component**
   - Client Component ("use client")
   - Uses usePathname, useRouter from i18n navigation
   - Uses Button for locale toggle

10. **Footer component**
    - Uses i18n Links

**Rationale:** Layout components use both UI primitives and i18n, so they depend on both Phase 2 and Phase 3.

---

### Phase 5: Section Components (Main Page)
**Depends on: Phase 2 (ui), Phase 3 (data), Phase 4 (layout)**

11. **Hero section**
    - Server Component
    - Uses Button, useTranslations
    - Minimal interactivity

12. **About section**
    - Server Component
    - Uses Card, useTranslations

13. **Skills section**
    - Server Component
    - Uses Badge
    - Imports skills data from lib/data

14. **Projects section**
    - Server Component
    - Renders ProjectCard components
    - Imports projects data

15. **Experience section**
    - Server Component
    - Uses ExperienceCard
    - Imports experience data

16. **Education section**
    - Server Component
    - Uses EducationCard
    - Imports education data

17. **Contact section**
    - Client Component ("use client")
    - Uses Input, Button
    - Form state management

**Build order within Phase 5:** Hero → About → Skills → Projects → Experience → Education → Contact

**Rationale:** Sections are independent of each other but depend on ui components (Phase 2), data (Phase 3), and layout (Phase 4). Order follows top-to-bottom page flow for logical development.

---

### Phase 6: Main Page Assembly
**Depends on: Phase 4 (layout), Phase 5 (sections)**

18. **app/[locale]/page.tsx**
    - Compose all sections in order
    - Server Component
    - Single-page scroll layout

**Rationale:** Main page is pure composition - needs all sections complete.

---

### Phase 7: Project Detail Components
**Depends on: Phase 2 (ui), Phase 3 (data)**

19. **ProjectGallery component**
    - Client Component (interactive image carousel)
    - Uses state for current image

20. **app/[locale]/projects/[slug]/page.tsx**
    - Server Component
    - Imports getProject from lib/data
    - Uses ProjectGallery
    - Uses Badge for tags
    - generateStaticParams for all project slugs

**Rationale:** Project detail page is independent of main page sections. Can be built after main page OR in parallel during Phase 5/6.

---

### Phase 8: Polish and Optimization
**Depends on: All previous phases**

21. **Metadata**
    - Add generateMetadata to pages for SEO
    - Open Graph images

22. **Loading states**
    - Add loading.tsx for sections if needed

23. **Error boundaries**
    - Add error.tsx for graceful failures

24. **404 page**
    - Add not-found.tsx with i18n

**Rationale:** Polish comes after core functionality is working.

---

### Dependency Graph (Text)

```
Phase 1 (Foundation)
  ├─→ Phase 2 (UI Atoms) ──────┐
  │                             ├─→ Phase 4 (Layout) ──┐
  └─→ Phase 3 (Data + i18n) ───┘                       │
                                                        ├─→ Phase 5 (Sections) ──┐
                                                        │                         │
                                                        └─────────────────────────┼─→ Phase 6 (Main Page)
                                                                                  │
Phase 3 (Data) ──→ Phase 7 (Project Details) ────────────────────────────────────┤
Phase 2 (UI) ────┘                                                                │
                                                                                  │
                                                                                  └─→ Phase 8 (Polish)
```

---

## Patterns to Follow

### Pattern 1: Server Component Default
**What:** Make all components Server Components unless they need interactivity.

**When:** Always start with Server Component, only add "use client" when you hit a limitation.

**Why:** Better performance (less JavaScript shipped), direct data access, improved SEO.

**Example:**
```typescript
// sections/Projects.tsx - Server Component
import { projects } from '@/lib/data/projects';
import { ProjectCard } from '@/components/projects/ProjectCard';

export function Projects() {
  const featured = projects.filter(p => p.featured);

  return (
    <section>
      {featured.map(project => (
        <ProjectCard key={project.slug} project={project} />
      ))}
    </section>
  );
}
```

---

### Pattern 2: Direct Data Import in Server Components
**What:** Import data files directly in Server Components, no API routes needed.

**When:** Accessing static data that doesn't require authentication or database queries.

**Why:** Simpler architecture, no unnecessary API layer, type-safe imports.

**Example:**
```typescript
// app/[locale]/projects/[slug]/page.tsx
import { getProject } from '@/lib/data/projects';

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = getProject(params.slug);
  if (!project) notFound();

  return <div>{project.title.ko}</div>;
}
```

---

### Pattern 3: Composition Over Configuration
**What:** Build pages by composing small, focused components.

**When:** Creating pages and complex UI sections.

**Why:** Easier to test, reuse, and maintain.

**Example:**
```typescript
// app/[locale]/page.tsx
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Skills } from '@/components/sections/Skills';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <About />
      <Skills />
      {/* ... more sections */}
    </main>
  );
}
```

---

### Pattern 4: i18n Navigation Wrappers
**What:** Use next-intl's navigation wrappers instead of Next.js primitives.

**When:** Any navigation (Link, useRouter, redirect).

**Why:** Automatically handles locale prefixes and maintains locale context.

**Example:**
```typescript
// ❌ Don't use Next.js Link directly
import Link from 'next/link';

// ✅ Use next-intl's Link wrapper
import { Link } from '@/i18n/navigation';

export function Header() {
  return (
    <nav>
      <Link href="/projects">Projects</Link>
    </nav>
  );
}
```

---

### Pattern 5: Locale-Aware Content
**What:** Structure content data with locale keys for direct access.

**When:** Content that differs by language (not just UI labels).

**Why:** Type-safe, no translation lookup needed for content, easier to manage.

**Example:**
```typescript
// lib/data/projects.ts
export const projects = [
  {
    slug: 'my-project',
    title: {
      ko: '내 프로젝트',
      en: 'My Project'
    },
    description: {
      ko: '프로젝트 설명',
      en: 'Project description'
    }
  }
];

// Usage in component
export function ProjectCard({ project, locale }) {
  return <h2>{project.title[locale]}</h2>;
}
```

---

### Pattern 6: Static Generation with Dynamic Routes
**What:** Use generateStaticParams to pre-render dynamic routes at build time.

**When:** Dynamic routes that can be known at build time (projects, locales).

**Why:** Static HTML generation for better performance, no runtime rendering.

**Example:**
```typescript
// app/[locale]/projects/[slug]/page.tsx
import { projects } from '@/lib/data/projects';

export function generateStaticParams() {
  const locales = ['ko', 'en'];
  const params = [];

  for (const locale of locales) {
    for (const project of projects) {
      params.push({ locale, slug: project.slug });
    }
  }

  return params;
}
```

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: Over-Using Client Components
**What:** Marking entire sections or pages as Client Components unnecessarily.

**Why bad:** Ships more JavaScript to browser, loses Server Component benefits, slower page loads.

**Instead:** Keep Server Components at top level, only mark interactive leaf components as Client Components.

**Example:**
```typescript
// ❌ Bad - entire section is Client Component
'use client';
export function Contact() {
  const [email, setEmail] = useState('');
  return (
    <section>
      <h2>Contact</h2>
      <form>
        <input value={email} onChange={e => setEmail(e.target.value)} />
      </form>
    </section>
  );
}

// ✅ Good - only form is Client Component
export function Contact() {
  return (
    <section>
      <h2>Contact</h2>
      <ContactForm />
    </section>
  );
}

'use client';
function ContactForm() {
  const [email, setEmail] = useState('');
  return (
    <form>
      <input value={email} onChange={e => setEmail(e.target.value)} />
    </form>
  );
}
```

---

### Anti-Pattern 2: Creating Unnecessary API Routes
**What:** Creating API routes just to read static data.

**Why bad:** Adds unnecessary complexity, slower (extra network request), no type safety across boundary.

**Instead:** Import data directly in Server Components.

**Example:**
```typescript
// ❌ Bad
// app/api/projects/route.ts
export async function GET() {
  return Response.json(projects);
}

// page.tsx
const res = await fetch('/api/projects');
const projects = await res.json();

// ✅ Good
// page.tsx
import { projects } from '@/lib/data/projects';
// Use directly
```

---

### Anti-Pattern 3: Locale Detection from Client
**What:** Using browser APIs (navigator.language) to detect locale on client side.

**Why bad:** Causes hydration mismatches, flash of wrong language, inconsistent with server rendering.

**Instead:** Let middleware handle locale detection and routing.

---

### Anti-Pattern 4: Mixing Translation Approaches
**What:** Using both next-intl and manual translation objects inconsistently.

**Why bad:** Confusing, hard to maintain, translations scattered across codebase.

**Instead:**
- **UI labels/messages** → next-intl (messages/*.json)
- **Content data** → Locale keys in data objects

---

### Anti-Pattern 5: Deep Component Nesting
**What:** Nesting components many levels deep without clear boundaries.

**Why bad:** Hard to understand data flow, difficult to refactor, props drilling hell.

**Instead:** Follow atomic design hierarchy, compose at page level, use clear component boundaries.

---

### Anti-Pattern 6: Inline Tailwind Classes Everywhere
**What:** Writing long className strings inline without abstraction.

**Why bad:** Hard to maintain, duplicated styles, difficult to ensure consistency.

**Instead:** Extract to variant objects for complex components, use cn() utility for dynamic classes.

**Example:**
```typescript
// ❌ Bad - repeated inline classes
<button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
<button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">

// ✅ Good - extracted to component with variants
<Button variant="primary">
<Button variant="primary">
```

---

## Performance Considerations

### Static Site Generation (SSG)

This portfolio is ideal for full static export:

**next.config.ts**
```typescript
const nextConfig = {
  output: 'export', // Enable static export
};
```

**Benefits:**
- Zero server cost (deploy to GitHub Pages, Vercel, Netlify, etc.)
- Maximum performance (pure static files)
- Better reliability (no server to go down)

**Trade-offs:**
- No dynamic features (but portfolio doesn't need them)
- No Image Optimization API (use next-export-image or manual optimization)

### Image Optimization

Since portfolio uses static export, handle images carefully:

**Option 1: Manual optimization**
- Optimize images before adding to public/
- Use WebP/AVIF formats
- Provide multiple sizes for responsive images

**Option 2: next-export-image**
- Library that provides Image component for static export
- Generates optimized images at build time

### Code Splitting

App Router automatically code-splits by route:
- Main page bundle
- Each project/[slug] page bundle
- Shared component chunks

**No action needed** - Next.js handles this automatically.

### Font Optimization

Use next/font for optimized font loading:

```typescript
// app/[locale]/layout.tsx
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <html className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
```

---

## Testing Strategy

### Component Testing

**Unit tests for:**
- Utility functions (lib/utils.ts)
- Data access functions (getProject, getFeaturedProjects)

**Component tests for:**
- UI atoms (Button, Card, Badge) - render correctly with variants
- Sections - render with correct data
- i18n - translations load correctly

**Tools:**
- Jest + React Testing Library
- next-intl testing utilities

### E2E Testing

**Test scenarios:**
- Main page loads and scrolls correctly
- Project detail pages render
- Locale switching works
- Navigation between pages
- Contact form submission (if implemented)

**Tools:**
- Playwright or Cypress

---

## Deployment Considerations

### Static Export Requirements

1. **All routes must be static** - No dynamic rendering
2. **Use generateStaticParams** for dynamic routes
3. **No runtime Server Components features** (cookies, headers in components)
4. **Image optimization** must be handled manually or with compatible library

### Build Command

```bash
npm run build
```

Output: `out/` directory with static HTML/CSS/JS

### Deployment Targets

**GitHub Pages:**
- Free hosting
- Custom domain support
- Requires basePath in next.config.ts if not at root

**Vercel:**
- Automatic deployments from Git
- Zero configuration
- Free tier sufficient for portfolio

**Netlify:**
- Similar to Vercel
- Drag-and-drop deployment option

---

## Scalability Path

### If Portfolio Grows Beyond Static

**Move to dynamic rendering when:**
- Adding blog with frequent updates
- Adding CMS for content management
- Adding real-time features (view counts, comments)
- Adding authentication

**Migration path:**
1. Remove `output: 'export'` from next.config.ts
2. Deploy to platform supporting Node.js (Vercel, Railway, etc.)
3. Data can stay in lib/ or migrate to CMS/database
4. Components remain mostly unchanged

**Cost:** Portfolio remains simple enough that this shouldn't be needed for years.

---

## Sources

### Official Documentation (HIGH Confidence)
- [Next.js Project Structure](https://nextjs.org/docs/app/getting-started/project-structure) - Official Next.js folder conventions
- [next-intl App Router Setup](https://next-intl.dev/docs/getting-started/app-router) - Official i18n setup guide
- [next-intl Locale-Based Routing](https://next-intl.dev/docs/routing/setup) - Locale routing configuration
- [Next.js Static Exports](https://nextjs.org/docs/app/guides/static-exports) - Static site generation guide
- [Tailwind CSS with Next.js](https://tailwindcss.com/docs/guides/nextjs) - Official Tailwind integration

### Best Practices Articles (MEDIUM Confidence)
- [Next.js App Router Project Structure Guide](https://makerkit.dev/blog/tutorials/nextjs-app-router-project-structure) - 2026 folder organization
- [Next.js Architecture 2026](https://www.yogijs.tech/blog/nextjs-project-architecture-app-router) - Server-first patterns
- [Atomic Design + Next.js 2026](https://medium.com/@buwanekasumanasekara/atomic-design-meets-feature-based-architecture-in-next-js-a-practical-guide-c06ea56cf5cc) - Component architecture
- [Next.js App Router Best Practices](https://thiraphat-ps-dev.medium.com/mastering-next-js-app-router-best-practices-for-structuring-your-application-3f8cf0c76580) - Structure patterns
- [Next.js Data Fetching](https://nextjs.org/docs/app/getting-started/fetching-data) - Server Components data access

### Community Resources (LOW-MEDIUM Confidence)
- [Next.js Portfolio Templates](https://github.com/topics/nextjs-portfolio) - Real-world examples
- [Static JSON Data in Next.js](https://www.slingacademy.com/article/next-js-read-and-display-data-from-a-local-json-file/) - Data management patterns
- [Tailwind + Next.js 2025 Guide](https://codeparrot.ai/blogs/nextjs-and-tailwind-css-2025-guide-setup-tips-and-best-practices) - Styling organization
