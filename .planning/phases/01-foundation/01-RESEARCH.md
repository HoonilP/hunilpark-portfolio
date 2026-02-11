# Phase 1: Foundation - Research

**Researched:** 2026-02-11
**Domain:** Next.js App Router + TypeScript + Tailwind CSS v4 + next-intl i18n
**Confidence:** HIGH

## Summary

Phase 1 establishes the technical foundation for a Korean/English bilingual portfolio site using Next.js 16, Tailwind CSS v4, and next-intl. The research reveals that all four core technologies are mature and well-documented, with Next.js 16 (released October 2025) now using Turbopack by default, Tailwind CSS v4 (released January 2025) introducing a CSS-first configuration paradigm, and next-intl providing the standard solution for App Router internationalization after Next.js dropped built-in i18n support.

Key findings show that Next.js 16 enforces fully async request APIs (breaking change from v15), requires proxy.ts instead of middleware.ts, and defaults to Turbopack for both dev and production. Tailwind v4 eliminates JavaScript configuration in favor of CSS `@theme` blocks and provides automatic content detection. The next-intl library requires four foundational files (routing config, proxy, navigation utilities, and request config) plus `setRequestLocale()` calls to enable static rendering with locale routing.

The recommended approach is to use create-next-app with default settings (TypeScript, Tailwind, ESLint, App Router, Turbopack), adopt Tailwind's mobile-first responsive design patterns, organize code with feature-based colocation inside the app directory, and follow next-intl's static rendering setup for optimal performance.

**Primary recommendation:** Use create-next-app@latest with defaults, install Tailwind v4 and next-intl, structure routes with [locale] dynamic segment, and configure design tokens in CSS using @theme blocks.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 16.1.6+ | React framework with App Router | Official Vercel framework, Turbopack default, React 19.2 Canary |
| React | 19.2 (Canary) | UI library | Required by Next.js 16 App Router, includes View Transitions |
| TypeScript | 5.1.0+ | Type safety | First-class Next.js support, IDE plugin, built-in type generation |
| Tailwind CSS | 4.1+ | Utility-first CSS | Industry standard, 5x faster builds, CSS-first config in v4 |
| next-intl | 3.x+ | Internationalization | Standard i18n solution for App Router after Next.js dropped built-in support |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @tailwindcss/postcss | 4.1+ | PostCSS integration | If not using Vite plugin (Next.js uses PostCSS) |
| ESLint | 9+ | Linting | Code quality checks, included in create-next-app defaults |
| @next/eslint-plugin-next | Latest | Next.js-specific rules | Automatically included with create-next-app ESLint setup |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| next-intl | react-i18next | next-intl is App Router native, react-i18next requires more client-side code |
| Tailwind CSS v4 | Tailwind CSS v3 | v3 is stable but slower, v4 requires Node 20+ and modern browsers (Safari 16.4+) |
| TypeScript | JavaScript | TypeScript provides type safety and better DX, minimal overhead |

**Installation:**
```bash
# Create Next.js project with defaults
npx create-next-app@latest my-app --yes
cd my-app

# Install Tailwind v4 (if not already included)
npm install tailwindcss@next @tailwindcss/postcss@next

# Install next-intl
npm install next-intl
```

## Architecture Patterns

### Recommended Project Structure
```
portfolio/
├── src/
│   ├── app/
│   │   ├── [locale]/           # Dynamic locale segment (ko, en)
│   │   │   ├── layout.tsx      # Root layout with lang attribute
│   │   │   ├── page.tsx        # Home page
│   │   │   └── ...             # Other routes
│   │   └── globals.css         # Tailwind imports + @theme config
│   ├── i18n/
│   │   ├── routing.ts          # Locale configuration
│   │   ├── request.ts          # Request-scoped i18n config
│   │   └── navigation.ts       # Wrapped navigation utilities
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   └── ...                 # Feature components
│   ├── lib/                    # Utilities, helpers
│   └── types/                  # TypeScript type definitions
├── public/                     # Static assets (images, fonts)
├── messages/
│   ├── ko.json                 # Korean translations
│   └── en.json                 # English translations
├── proxy.ts                    # next-intl middleware (NOT middleware.ts)
├── next.config.ts              # Next.js configuration
├── tailwind.config.ts          # Optional JS config (minimal in v4)
├── postcss.config.mjs          # PostCSS with Tailwind plugin
└── tsconfig.json               # TypeScript configuration
```

### Pattern 1: Next.js 16 Async Request APIs
**What:** All request-related APIs (cookies, headers, params, searchParams) are now fully async
**When to use:** Required in Next.js 16+ for all Server Components accessing request data
**Example:**
```typescript
// Source: https://nextjs.org/docs/app/guides/upgrading/version-16
// app/[locale]/blog/[slug]/page.tsx
export default async function Page(props: PageProps) {
  const { locale, slug } = await props.params;
  const searchParams = await props.searchParams;

  return <h1>Blog Post: {slug}</h1>;
}
```

### Pattern 2: Tailwind v4 CSS-First Configuration
**What:** Design system defined in CSS using @theme instead of JavaScript config
**When to use:** Always for Tailwind v4 design token customization
**Example:**
```css
/* Source: https://tailwindcss.com/blog/tailwindcss-v4 */
/* src/app/globals.css */
@import "tailwindcss";

@theme {
  /* Typography */
  --font-sans: "Pretendard", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", monospace;

  /* Colors */
  --color-primary-500: oklch(0.84 0.18 117.33);
  --color-primary-600: oklch(0.53 0.12 118.34);

  /* Spacing (optional, for custom values) */
  --spacing-18: 4.5rem;

  /* Breakpoints (optional, defaults are good) */
  --breakpoint-3xl: 1920px;
}
```

### Pattern 3: next-intl Static Rendering Setup
**What:** Enable static builds with locale routing using setRequestLocale
**When to use:** Always for portfolio sites that should be statically generated
**Example:**
```typescript
// Source: https://next-intl.dev/docs/getting-started/app-router/with-i18n-routing
// i18n/routing.ts
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['ko', 'en'],
  defaultLocale: 'ko'
});

// app/[locale]/layout.tsx
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale); // Enable static rendering

  return (
    <html lang={locale}>
      <body>{children}</body>
    </html>
  );
}
```

### Pattern 4: Mobile-First Responsive Design with Tailwind
**What:** Unprefixed utilities target mobile, prefixed utilities (sm:, md:, lg:) target larger screens
**When to use:** Always for responsive layouts
**Example:**
```tsx
// Source: https://tailwindcss.com/docs/responsive-design
// Mobile-first approach
<div className="
  flex flex-col gap-4        {/* Mobile: stacked with gap */}
  md:flex-row md:gap-8       {/* Tablet+: horizontal with larger gap */}
  lg:max-w-6xl lg:mx-auto    {/* Desktop: constrained width, centered */}
">
  <aside className="w-full md:w-64">{/* Sidebar */}</aside>
  <main className="flex-1">{/* Main content */}</main>
</div>
```

### Anti-Patterns to Avoid
- **Using Route Handlers in Server Components:** Call data fetching functions directly in Server Components instead of creating unnecessary Route Handlers that add network hops
- **Synchronous Request API Access:** Next.js 16 removed synchronous access to cookies(), headers(), params - always await these
- **middleware.ts filename:** Use proxy.ts instead (middleware.ts is deprecated in Next.js 16)
- **Tailwind @tailwind directives in v4:** Use @import "tailwindcss" instead of @tailwind base/components/utilities
- **Missing setRequestLocale():** next-intl routes will be dynamic without this, preventing static generation

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Locale routing | Custom middleware with pathname parsing | next-intl middleware with defineRouting | Handles locale detection (cookie, accept-language), redirects, alternate links, edge cases |
| Locale switching | Custom Link wrapper checking current route | next-intl's Link from i18n/navigation.ts | Automatically preserves route structure when switching locales |
| Responsive breakpoints | Custom CSS media queries | Tailwind's responsive prefixes (sm:, md:, lg:) | Mobile-first, consistent, well-tested breakpoint system |
| Design tokens | CSS custom properties manually defined | Tailwind v4 @theme blocks | Auto-generates utilities, enables arbitrary values, type-safe |
| TypeScript types for params | Manual interface definitions | next typegen command | Generates PageProps, LayoutProps, RouteContext helpers automatically |

**Key insight:** next-intl's middleware handles complex i18n edge cases (cookie persistence, accept-language negotiation, SEO alternate links, domain-based routing) that would take weeks to implement correctly. Tailwind v4's @theme system generates hundreds of utility classes from design tokens automatically.

## Common Pitfalls

### Pitfall 1: Forgetting Async/Await on Request APIs
**What goes wrong:** Code fails at runtime with "params/searchParams/cookies/headers must be awaited"
**Why it happens:** Next.js 16 made these fully async (breaking change from v15)
**How to avoid:** Always await props.params, props.searchParams, cookies(), headers(), draftMode()
**Warning signs:** TypeScript errors showing Promise<T> type where you expect T

### Pitfall 2: Middleware Not Running (next-intl)
**What goes wrong:** Content not localized, routes return 404, locale detection fails
**Why it happens:** Matcher pattern excludes route paths, or proxy.ts in wrong location
**How to avoid:** Use matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)', verify proxy.ts is at project root (not in src/)
**Warning signs:** next-intl functions throw "no locale found" errors

### Pitfall 3: Tailwind v4 Migration Breaking Styles
**What goes wrong:** Shadows, rounded corners, ring widths different after v4 upgrade
**Why it happens:** v4 renamed utilities (shadow-sm → shadow-xs, ring default 3px → 1px)
**How to avoid:** Run npx @tailwindcss/upgrade tool, review diff carefully, test in browser
**Warning signs:** Visual regressions in buttons, cards, form inputs after Tailwind install

### Pitfall 4: next-intl Routes Not Static
**What goes wrong:** Build shows routes as dynamic (λ) instead of static (○), slower performance
**Why it happens:** Missing setRequestLocale() calls in layouts/pages, or missing generateStaticParams
**How to avoid:** Call setRequestLocale(locale) at top of each layout/page, add generateStaticParams to return all locales
**Warning signs:** Next.js build output shows dynamic routes, headers() usage warning

### Pitfall 5: Turbopack vs Webpack Confusion
**What goes wrong:** Build fails with "webpack config found" error
**Why it happens:** Next.js 16 uses Turbopack by default, but custom webpack config exists
**How to avoid:** Remove custom webpack config, or use --webpack flag to opt out explicitly
**Warning signs:** Build error mentioning webpack configuration, slower build times

### Pitfall 6: Missing next-intl default.js for Parallel Routes
**What goes wrong:** Build fails when using parallel routes (@slot syntax)
**Why it happens:** Next.js 16 requires explicit default.js for all parallel route slots
**How to avoid:** Create default.js returning notFound() or null in each @slot directory
**Warning signs:** Build error "default.js is required for parallel routes"

## Code Examples

Verified patterns from official sources:

### Next.js 16 Project Initialization
```bash
# Source: https://nextjs.org/docs/app/getting-started/installation
npx create-next-app@latest my-portfolio --yes
# --yes uses defaults: TypeScript, ESLint, Tailwind, App Router, Turbopack, src/ dir, @/* alias
```

### Tailwind v4 Setup with PostCSS
```javascript
// Source: https://tailwindcss.com/blog/tailwindcss-v4
// postcss.config.mjs
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

```css
/* src/app/globals.css */
@import "tailwindcss";

@theme {
  --font-sans: "Pretendard", system-ui, sans-serif;
  --color-primary: oklch(0.5 0.2 250);
}
```

### next-intl Complete Setup
```typescript
// Source: https://next-intl.dev/docs/getting-started/app-router/with-i18n-routing
// i18n/routing.ts
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['ko', 'en'],
  defaultLocale: 'ko'
});

// proxy.ts (at project root, NOT in src/)
import createMiddleware from 'next-intl/middleware';
import { routing } from './src/i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except API routes, internal Next.js, static files
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};

// i18n/request.ts
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

// i18n/navigation.ts
import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
```

### Mobile-First Responsive Layout
```tsx
// Source: https://tailwindcss.com/docs/responsive-design
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="
      min-h-screen
      px-4 py-6               {/* Mobile padding */}
      sm:px-6 sm:py-8         {/* Small screens */}
      lg:px-8 lg:py-12        {/* Large screens */}
    ">
      <header className="
        flex flex-col gap-4   {/* Mobile: stacked */}
        sm:flex-row           {/* Small+: horizontal */}
        sm:items-center
        sm:justify-between
      ">
        <nav>{/* Navigation */}</nav>
      </header>

      <main className="
        mt-8
        max-w-7xl mx-auto     {/* Constrain max width, center */}
      ">
        {children}
      </main>
    </div>
  );
}
```

### Async Params with Type Safety
```typescript
// Source: https://nextjs.org/docs/app/guides/upgrading/version-16
// Generate types: npx next typegen
import { PageProps } from '@/.next/types/app/[locale]/page';

export default async function Page(props: PageProps) {
  const { locale } = await props.params;
  const searchParams = await props.searchParams;

  return (
    <div>
      <h1>Locale: {locale}</h1>
      <pre>{JSON.stringify(searchParams, null, 2)}</pre>
    </div>
  );
}

// Enable static generation
export function generateStaticParams() {
  return [{ locale: 'ko' }, { locale: 'en' }];
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Pages Router | App Router | Next.js 13 (2022), stable in 14 | Server Components default, nested layouts, streaming |
| Synchronous request APIs | Async request APIs | Next.js 15 (opt-in), 16 (required) | All params/searchParams/cookies/headers must be awaited |
| middleware.ts | proxy.ts | Next.js 16 (Oct 2025) | Middleware filename deprecated, edge runtime not supported in proxy |
| Tailwind config.js | CSS @theme blocks | Tailwind v4 (Jan 2025) | Faster builds, CSS variables, no JS config file needed |
| Built-in Next.js i18n | next-intl library | Next.js 13+ App Router | No built-in i18n for App Router, next-intl is community standard |
| Webpack | Turbopack | Next.js 16 (default) | 5x faster full builds, 100x faster incremental |
| @tailwind directives | @import "tailwindcss" | Tailwind v4 | Single import replaces base/components/utilities |
| Ring 3px default | Ring 1px default | Tailwind v4 | ring class now 1px, use ring-3 for old default |

**Deprecated/outdated:**
- middleware.ts: Renamed to proxy.ts in Next.js 16, edge runtime no longer supported
- next lint command: Removed in Next.js 16, use ESLint CLI directly
- Tailwind @tailwind directives: Use @import "tailwindcss" in v4
- shadow-sm, rounded-sm: Renamed to shadow-xs, rounded-xs in Tailwind v4 for consistency
- Synchronous params access: Fully removed in Next.js 16, breaking change

## Open Questions

Things that couldn't be fully resolved:

1. **Tailwind v4 Typography Plugin Integration**
   - What we know: @tailwindcss/typography plugin exists but CSS config integration unclear
   - What's unclear: Whether typography styles need old JS config or have CSS equivalent
   - Recommendation: Test typography plugin installation, may need hybrid config approach

2. **next-intl Performance with Large Translation Files**
   - What we know: Translation files imported per locale in request.ts
   - What's unclear: Whether large JSON files impact bundle size or are tree-shaken
   - Recommendation: Start with simple translations, monitor bundle size, consider splitting if needed

3. **Turbopack Custom Webpack Loader Compatibility**
   - What we know: Turbopack supports some webpack loaders via turbopack.resolveAlias
   - What's unclear: Which specific loaders work, edge cases
   - Recommendation: Avoid custom loaders initially, use Turbopack defaults for Phase 1

## Sources

### Primary (HIGH confidence)
- Next.js 16 Upgrade Guide: https://nextjs.org/docs/app/guides/upgrading/version-16
- Next.js Installation: https://nextjs.org/docs/app/getting-started/installation
- Next.js Project Structure: https://nextjs.org/docs/app/getting-started/project-structure
- Tailwind CSS v4.0 Release: https://tailwindcss.com/blog/tailwindcss-v4
- Tailwind CSS v4 Upgrade Guide: https://tailwindcss.com/docs/upgrade-guide
- Tailwind CSS Responsive Design: https://tailwindcss.com/docs/responsive-design
- next-intl App Router Setup: https://next-intl.dev/docs/getting-started/app-router/with-i18n-routing
- next-intl Middleware: https://next-intl.dev/docs/routing/middleware

### Secondary (MEDIUM confidence)
- Vercel Blog - Common Next.js App Router Mistakes: https://vercel.com/blog/common-mistakes-with-the-next-js-app-router-and-how-to-fix-them
- Next.js 16 Blog Post: https://nextjs.org/blog/next-16

### Tertiary (LOW confidence - WebSearch only)
- GitHub Tailwind v4 Migration Discussions: Multiple developer experience reports
- Next.js Community Project Structure Examples: Medium articles, dev blogs

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries verified via official documentation and Context7
- Architecture: HIGH - Patterns from official Next.js, Tailwind, next-intl docs
- Pitfalls: HIGH - Verified from official upgrade guides, breaking changes, and GitHub discussions

**Research date:** 2026-02-11
**Valid until:** 2026-03-11 (30 days - stable ecosystem)

**Notes:**
- Next.js 16.1.6 is current stable (as of 2026-01-23)
- Tailwind CSS v4.1 is current stable (as of 2025-04)
- React 19.2 Canary used by Next.js 16 App Router
- All core libraries have active maintenance and frequent updates
