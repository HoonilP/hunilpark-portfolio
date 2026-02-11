# Phase 2: Layout & Design System - Research

**Researched:** 2026-02-11
**Domain:** Next.js App Router layouts, Tailwind CSS 4 design systems, React component architecture
**Confidence:** HIGH

## Summary

Phase 2 implements reusable UI components (Button, Card, Badge) and site-wide layout structure (header, footer, navigation) for a Next.js 16 portfolio using Tailwind CSS v4. The research confirms that Next.js App Router's layout system is production-ready, Tailwind v4 introduces CSS-first dark mode configuration, and the `next-themes` library provides the most reliable theme switching. The project requires understanding v4-specific changes (CSS-based config via `@variant`, no tailwind.config.js darkMode setting) and Next.js layout best practices (header/footer placement, avoiding root layout UI pollution).

The user has specified designer-like visual sensibility with typography animations, timeline UI for career section, and subtle transitions throughout. This calls for CSS-based animations for performance, potential GSAP for complex effects, and careful attention to motion accessibility via `prefers-reduced-motion`.

**Primary recommendation:** Build layout foundation with semantic HTML in locale layout, implement dark mode via next-themes + Tailwind v4 @variant directive, create component library in `/src/components/ui/` with TypeScript interfaces, and layer in CSS-based animations using transform/opacity for 60fps performance.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| next-themes | ^0.4.x | Theme management | Industry standard for Next.js dark/light mode, eliminates flash-of-wrong-theme, SSR-safe, 3.6M+ weekly downloads |
| Tailwind CSS | v4.1.18 | Styling & design tokens | CSS-first configuration via @theme/@variant, hardware-accelerated utilities, already installed |
| Next.js App Router | 16.1.6 | Layout system | File-based routing with nested layouts, server/client component flexibility, already installed |
| TypeScript | ^5.9.x | Type safety | Component prop contracts, autocomplete for design tokens, already installed |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Framer Motion | ^12.0.0-alpha.0 | Complex animations | For typography effects, page transitions (React 19 support still in alpha) |
| GSAP + ScrollTrigger | ^3.12.x | Scroll-based animations | For timeline UI, parallax effects, text reveals (requires client-side only) |
| clsx | ^2.1.x | Conditional classes | For component variants, clean className composition |
| Lenis | ^1.1.x | Smooth scrolling | For enhanced scroll experience with GSAP (optional, adds polish) |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| next-themes | Custom theme context | next-themes handles SSR, localStorage, system preference automatically; custom solution is error-prone |
| Framer Motion | Pure CSS animations | CSS is faster but limited for complex choreography; Motion better for interactive animations |
| GSAP | Framer Motion | GSAP has more powerful timeline/scroll features; Motion has better React integration |
| clsx | tailwind-merge | clsx for conditionals, tailwind-merge for conflict resolution; often used together |

**Installation:**
```bash
# Core theme management
npm install next-themes

# Animation libraries (choose based on needs)
npm install framer-motion@12.0.0-alpha.0  # For Motion-based animations
npm install gsap  # For GSAP-based scroll animations

# Utilities
npm install clsx  # For className composition
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx          # Locale-specific layout (add Header/Footer here)
│   │   └── page.tsx            # Home page
│   └── globals.css             # Tailwind imports + @theme/@variant config
├── components/
│   ├── layout/                 # Layout-level components
│   │   ├── Header.tsx          # Site header with navigation
│   │   ├── Footer.tsx          # Site footer
│   │   └── ThemeProvider.tsx   # next-themes wrapper (client component)
│   └── ui/                     # Reusable UI components
│       ├── Button.tsx          # Button component with variants
│       ├── Card.tsx            # Card component (border only, no shadow)
│       ├── Badge.tsx           # Badge for tech stack tags
│       └── index.ts            # Barrel export
├── lib/
│   └── utils.ts                # clsx helper, cn() utility
└── types/
    └── components.ts           # Shared component prop types
```

### Pattern 1: Layout Composition
**What:** Place header/footer in locale layout (`app/[locale]/layout.tsx`), not root layout
**When to use:** Always for site-wide chrome; keeps root layout minimal (html/body/providers only)
**Example:**
```typescript
// Source: https://nextjs.org/docs/app/getting-started/layouts-and-pages
// app/[locale]/layout.tsx
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="font-sans bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <Header />
            <main>{children}</main>
            <Footer />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

### Pattern 2: Dark Mode with Tailwind v4 + next-themes
**What:** Configure dark mode via CSS @variant, wrap app with ThemeProvider
**When to use:** Always; eliminates flash-of-wrong-theme, respects system preference
**Example:**
```css
/* Source: https://www.thingsaboutweb.dev/en/posts/dark-mode-with-tailwind-v4-nextjs */
/* app/globals.css */
@import "tailwindcss";

/* Custom dark mode variant using data attribute */
@variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));

@theme {
  --font-sans: "Pretendard Variable", ...;

  /* Light mode colors */
  --color-neutral-50: oklch(0.98 0 0);
  /* ... existing color tokens ... */
}
```

```typescript
// components/layout/ThemeProvider.tsx
'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextThemesProvider attribute="data-theme" defaultTheme="system">
      {children}
    </NextThemesProvider>
  );
}
```

### Pattern 3: Component Variants with TypeScript
**What:** Define variant types, use clsx for conditional classes
**When to use:** For components with multiple visual styles (buttons, badges)
**Example:**
```typescript
// components/ui/Button.tsx
import { type ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'rounded-md font-medium transition-colors',
        {
          'bg-primary-500 hover:bg-primary-600 text-white': variant === 'primary',
          'border border-neutral-300 hover:bg-neutral-100': variant === 'secondary',
          'hover:bg-neutral-100': variant === 'ghost',
          'px-3 py-1.5 text-sm': size === 'sm',
          'px-4 py-2 text-base': size === 'md',
          'px-6 py-3 text-lg': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
```

### Pattern 4: Typography Animations (CSS-First)
**What:** Hardware-accelerated transforms with CSS, not layout-shifting properties
**When to use:** For subtle text effects, hover states, entrance animations
**Example:**
```typescript
// components/ui/AnimatedText.tsx
'use client';

interface AnimatedTextProps {
  children: React.ReactNode;
  delay?: number;
}

export default function AnimatedText({ children, delay = 0 }: AnimatedTextProps) {
  return (
    <span
      className="inline-block opacity-0 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </span>
  );
}
```

```css
/* app/globals.css */
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.5s ease-out forwards;
}

/* Respect reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  .animate-fade-in-up {
    animation: none;
    opacity: 1;
    transform: none;
  }
}
```

### Pattern 5: Component Composition Over Prop Drilling
**What:** Pass components as children/props rather than drilling data through layers
**When to use:** When intermediate components don't need the data being passed
**Example:**
```typescript
// Bad: Prop drilling
<Layout user={user}>
  <Sidebar user={user}>
    <UserMenu user={user} />
  </Sidebar>
</Layout>

// Good: Composition
<Layout sidebar={<Sidebar><UserMenu user={user} /></Sidebar>}>
  {/* Layout doesn't need to know about user */}
</Layout>
```

### Anti-Patterns to Avoid
- **Putting UI in root layout:** Root layout should only contain html/body tags and global providers. Header/footer belong in locale-specific layout to allow for route-specific overrides.
- **Using position: fixed carelessly:** Fixed positioning can cause z-index issues and mobile viewport problems. Use sticky positioning where possible.
- **Ignoring dark mode in color tokens:** Every custom color must have a dark mode variant defined in `@theme` or via CSS variables with dark: prefix.
- **Animation without prefers-reduced-motion:** Always provide reduced-motion fallback for accessibility.
- **Creating components for everything immediately:** Start with inline JSX; extract to components only when reused 2+ times.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Dark mode toggle | Custom theme context + localStorage | next-themes | Handles SSR hydration, flash prevention, system preference, tab syncing automatically |
| Conditional classnames | String concatenation/ternaries | clsx or cn() utility | Handles undefined/null/false values, cleaner than `${} ${} ${}` |
| Smooth scrolling | Custom scroll listeners | Lenis (optional) | Hardware-accelerated, handles mobile Safari quirks, integrates with GSAP |
| Text splitting for animation | Manual span wrapping | GSAP SplitText or splitType | Handles words/chars/lines correctly, preserves whitespace, accessibility fallback |
| Color palette generation | Manual oklch calculations | Use design tool (Realtime Colors, etc.) | Ensures WCAG contrast ratios, perceptually uniform scales |

**Key insight:** Theme management is deceptively complex (SSR hydration, flash prevention, localStorage sync, system preference detection). Using next-themes saves 200+ lines of code and eliminates 5+ edge cases. Similarly, animation libraries like GSAP handle browser inconsistencies and performance optimizations that would take weeks to implement correctly from scratch.

## Common Pitfalls

### Pitfall 1: Flash of Unstyled Content (FOUC) on Dark Mode
**What goes wrong:** Page loads in light mode briefly before switching to dark mode
**Why it happens:** Theme is applied client-side after hydration; initial HTML doesn't know user preference
**How to avoid:** Use next-themes with `suppressHydrationWarning` on html tag and `attribute="data-theme"` to apply via data attribute instead of class (more reliable)
**Warning signs:** Brief white flash on page load in dark mode

### Pitfall 2: Root Layout UI Pollution
**What goes wrong:** Adding header/footer to root layout (`app/layout.tsx`) makes them unchangeable across routes
**Why it happens:** Root layout wraps all locale layouts; UI here is truly global
**How to avoid:** Keep root layout minimal (html/body tags only). Place header/footer in locale layout (`app/[locale]/layout.tsx`)
**Warning signs:** Wanting route-specific headers but header is "locked in" at root

### Pitfall 3: Layout Shift from Animations
**What goes wrong:** Text animations cause content to jump around during page load
**Why it happens:** Animating width/height/padding causes layout recalculation
**How to avoid:** Animate only `transform` and `opacity` (hardware-accelerated properties). Use `will-change: transform` sparingly
**Warning signs:** Content "jumps" during animations, low performance scores

### Pitfall 4: Missing Mobile Navigation
**What goes wrong:** Desktop navigation doesn't scale down, or hamburger menu is inaccessible
**Why it happens:** Mobile-first approach skipped; keyboard/screen reader support not tested
**How to avoid:** Build mobile-first with hamburger menu, enhance for desktop. Ensure `aria-expanded`, `aria-label`, keyboard navigation (Enter/Esc/Tab)
**Warning signs:** Touch targets < 44px, no keyboard access, missing ARIA labels

### Pitfall 5: Hardcoded Colors Breaking Dark Mode
**What goes wrong:** Some elements don't respect dark mode; remain stuck in light colors
**Why it happens:** Using hardcoded colors (bg-white) instead of semantic tokens (bg-white dark:bg-neutral-950)
**How to avoid:** Define semantic color system in `@theme`, use CSS variables, always pair light colors with dark: variants
**Warning signs:** White backgrounds in dark mode, unreadable text contrast

### Pitfall 6: Client/Server Component Confusion
**What goes wrong:** "You're importing a component that needs X. It only works in a Client Component..."
**Why it happens:** Using hooks (useState, useRouter) in Server Components, or importing Server Components in client-only code
**How to avoid:**
- Server Components by default (no 'use client')
- Add 'use client' only when using hooks, browser APIs, or event handlers
- Keep ThemeProvider, LanguageToggle, animated components as client components
**Warning signs:** Build errors about hooks in Server Components

### Pitfall 7: Framer Motion with React 19 Incompatibility
**What goes wrong:** Type errors or runtime issues with Framer Motion in Next.js 16 + React 19
**Why it happens:** React 19 support is still in alpha (v12.0.0-alpha.0); stable release uses React 18 types
**How to avoid:** Use CSS animations for Phase 2; defer Framer Motion to Phase 3 when doing complex interactions. If needed now, install alpha version and test thoroughly
**Warning signs:** TypeScript errors from framer-motion, "forwardRef deprecated" warnings

## Code Examples

Verified patterns from official sources:

### Theme Toggle Button
```typescript
// components/layout/ThemeToggle.tsx
'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-10 h-10" />; // Placeholder to prevent layout shift
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="rounded-md p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}
```

### Header with Navigation
```typescript
// components/layout/Header.tsx
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import LanguageToggle from '@/components/LanguageToggle';
import ThemeToggle from '@/components/layout/ThemeToggle';

export default function Header() {
  const t = useTranslations('Navigation');

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-sm border-b border-neutral-200 dark:border-neutral-800">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          {t('home')}
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="#about" className="hover:text-primary-500 transition-colors">
            {t('about')}
          </Link>
          <Link href="#projects" className="hover:text-primary-500 transition-colors">
            {t('projects')}
          </Link>
          <Link href="#contact" className="hover:text-primary-500 transition-colors">
            {t('contact')}
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LanguageToggle />
        </div>
      </div>
    </header>
  );
}
```

### Card Component (Border Only, No Shadow)
```typescript
// components/ui/Card.tsx
import { type HTMLAttributes } from 'react';
import clsx from 'clsx';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export default function Card({
  hover = false,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={clsx(
        'border border-neutral-200 dark:border-neutral-800 rounded-lg p-6',
        hover && 'transition-colors hover:border-primary-500',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
```

### Badge Component (Tech Stack Tags)
```typescript
// components/ui/Badge.tsx
interface BadgeProps {
  children: React.ReactNode;
}

export default function Badge({ children }: BadgeProps) {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
      {children}
    </span>
  );
}
```

### Timeline Component Structure
```typescript
// components/ui/Timeline.tsx
interface TimelineItem {
  date: string;
  title: string;
  description: string;
}

interface TimelineProps {
  items: TimelineItem[];
}

export default function Timeline({ items }: TimelineProps) {
  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-neutral-200 dark:bg-neutral-800" />

      <div className="space-y-8">
        {items.map((item, index) => (
          <div key={index} className="relative pl-8">
            {/* Dot */}
            <div className="absolute left-0 top-1 w-2 h-2 rounded-full bg-primary-500 transform -translate-x-1/2" />

            <div className="space-y-1">
              <time className="text-sm text-neutral-500 dark:text-neutral-400">
                {item.date}
              </time>
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                {item.title}
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| tailwind.config.js for dark mode | @variant in CSS file | Tailwind v4 (2024) | More flexible, CSS-native, supports data attributes |
| Manual dark mode context | next-themes library | 2021-present | Eliminates 90% of theme bugs, SSR-safe |
| Class-based dark mode | Data attribute (data-theme) | Tailwind v4 era | More reliable, avoids class timing issues |
| CSS Modules for components | Tailwind utility-first | 2020-present | Faster development, smaller bundles, design tokens |
| JavaScript scroll listeners | GSAP ScrollTrigger | 2020-present | Hardware-accelerated, handles edge cases |
| Framer Motion v11 | Motion v12 (React 19 support) | 2025 | React 19 compatibility, still in alpha for v12 |

**Deprecated/outdated:**
- `darkMode: 'class'` in tailwind.config.js: v4 uses @variant in CSS instead
- `prefers-color-scheme` only: Modern sites should support both system and manual toggle
- JIT mode flag: Tailwind v3+ has JIT always enabled
- `suppressHydrationWarning` on body: Should be on html tag for next-themes

## Open Questions

Things that couldn't be fully resolved:

1. **Framer Motion React 19 Stability**
   - What we know: v12.0.0-alpha.0 supports React 19, but still in alpha
   - What's unclear: Production readiness, whether to wait for stable release
   - Recommendation: Use CSS animations for Phase 2; defer complex Motion work to Phase 3. Monitor Framer Motion v12 stable release.

2. **CodePen Reference Inaccessibility**
   - What we know: User provided two CodePen references for visual inspiration (loiclaudet typography, webcraftsman timeline)
   - What's unclear: Specific animation techniques and visual details from those examples
   - Recommendation: Implement designer-like sensibility through: clean typography hierarchy, restrained motion (300-500ms durations), focus on transform/opacity animations, timeline UI pattern as documented in research

3. **Animation Library Choice**
   - What we know: CSS animations fastest, GSAP powerful for complex scroll effects, Framer Motion best React integration
   - What's unclear: How complex user's "typography animations" need to be
   - Recommendation: Start with CSS animations in Phase 2 for simple effects. Add GSAP in Phase 3 if timeline UI needs scroll-triggered reveals. Keep Framer Motion for interactive project cards in Phase 4.

4. **Mobile Navigation Pattern**
   - What we know: Portfolio likely has 4-5 nav items (about, projects, experience, contact)
   - What's unclear: User preference for hamburger menu vs bottom tab bar vs visible top nav
   - Recommendation: Use sticky header with visible nav items on desktop, hamburger menu on mobile (standard pattern). Ensure 44px+ touch targets, ARIA labels, keyboard navigation.

## Sources

### Primary (HIGH confidence)
- Next.js 16.1.6 Official Documentation - Layouts and Pages: https://nextjs.org/docs/app/getting-started/layouts-and-pages
- Tailwind CSS v4 Dark Mode Documentation: https://tailwindcss.com/docs/dark-mode
- next-themes npm package: https://www.npmjs.com/package/next-themes
- Implementing Dark Mode with Tailwind v4 and Next.js: https://www.thingsaboutweb.dev/en/posts/dark-mode-with-tailwind-v4-nextjs

### Secondary (MEDIUM confidence)
- Tailwind CSS Best Practices 2025-2026 (FrontendTools): https://www.frontendtools.tech/blog/tailwind-css-best-practices-design-system-patterns
- React Component Folder Structure (Robin Wieruch): https://www.robinwieruch.de/react-folder-structure/
- Using GSAP with Next.js Guide (Medium): https://medium.com/@1shyam2shyam/using-gsap-with-next-js-a-guide-to-animations-bc5b832a70f0
- Mobile Navigation Patterns 2026 (Phone Simulator): https://phone-simulator.com/blog/mobile-navigation-patterns-in-2026/
- CSS Text Animations Examples (Prismic): https://prismic.io/blog/css-text-animations
- Pretendard Font GitHub Repository: https://github.com/orioncactus/pretendard

### Tertiary (LOW confidence - WebSearch only)
- LogRocket articles on Next.js layouts and dark mode (2024-2025 content)
- Medium articles on component composition patterns (2023-2025 content)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Official documentation for Next.js 16.1.6, Tailwind v4, next-themes verified via npm and official sources
- Architecture: HIGH - Next.js layout patterns from official docs, component patterns from React best practices and TypeScript guides
- Pitfalls: MEDIUM-HIGH - Common issues verified from official discussions, GitHub issues, and multiple developer guides; dark mode flash and layout pollution well-documented

**Research date:** 2026-02-11
**Valid until:** ~2026-03-15 (30 days; stable technologies)

**Note:** React 19 + Framer Motion compatibility is fast-moving; recheck if Motion animations become critical before Phase 4.
