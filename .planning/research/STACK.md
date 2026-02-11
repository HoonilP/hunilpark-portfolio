# Technology Stack

**Project:** Frontend Developer Portfolio Website
**Researched:** 2026-02-11
**Target:** Korean big tech companies (clean, precise, skill-showcase focus)

## Recommended Stack

### Core Framework
| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Next.js | 15.5+ (stable) | React framework with App Router | Industry standard for production apps in 2026. App Router is the default, provides Server Components for zero-bundle-size benefits (20%+ bundle reduction), automatic code splitting, and best-in-class TypeScript support. Next.js 16 is available but 15.5 is latest stable with Turbopack in beta. | HIGH |
| React | 19.2.4 | UI library | React 19 stable since Dec 2024, required for Next.js 15+. Server Components are production-ready and dramatically reduce client-side JavaScript. | HIGH |
| TypeScript | 5.9.3 | Type safety | Latest stable version. Next.js 15.5 brings major TS improvements including typed routes (stable), route export validation, and automatic PageProps/LayoutProps generation. Essential for enterprise-quality code. | HIGH |

**Rationale:** Next.js 15 with App Router is the 2026 standard for production React apps. Server Components reduce bundle size by 20-30%, automatic code splitting improves performance, and the framework is battle-tested (powers vercel.com, v0.app, nextjs.org with 1.2B+ requests). For a portfolio targeting Korean big tech, this demonstrates knowledge of current best practices.

**Version note:** Next.js 15.5 is recommended over 16.x (released Oct 2025) as 15.5 is the latest stable with production-proven Turbopack support. Version 16 is available but may have fewer battle-tested production deployments.

### Styling
| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Tailwind CSS | 4.1.18 | Utility-first CSS framework | v4.0 released early 2025 with 5x faster full builds, 100x faster incremental builds. Config moved from JS to CSS (modern approach). Requires Safari 16.4+, Chrome 111+, Firefox 128+ (acceptable for 2026). | HIGH |
| clsx | 2.x | Conditional class utility | Tiny (239B), faster than classnames. Standard utility for conditional styling. | HIGH |
| tailwind-merge | 2.x | Tailwind class conflict resolver | Automatically handles overlapping Tailwind classes. Essential for component libraries. Combine with clsx in `cn()` utility. | HIGH |

**PostCSS setup:** Tailwind v4 requires `@tailwindcss/postcss` package (PostCSS plugin moved to separate package). Configure via `postcss.config.mjs`.

**Why NOT Tailwind v3:** Version 4 provides 5-100x faster builds and modern CSS-based configuration. Performance gains are significant for development velocity.

**Styling philosophy for portfolio:**
- Use Tailwind for utility classes and responsive design
- Leverage CSS variables for theme customization (Tailwind v4's native approach)
- Minimal custom CSS (demonstrates Tailwind mastery)
- Focus on typography, spacing, layout precision (not flashy animations)

### Animation (Minimal)
| Technology | Version | Purpose | When to Use | Confidence |
|------------|---------|---------|-------------|------------|
| CSS Animations | Native | Simple transitions, hover effects, fades | Default choice. Faster load, smaller bundle, smoother performance. Use for 90% of effects. | HIGH |
| Framer Motion | 11.x (if needed) | Complex gesture-based or physics animations | ONLY if you need spring physics, gesture handlers, or complex state-driven motion. For portfolio: likely unnecessary. | MEDIUM |

**Rationale:** For a portfolio emphasizing "clean, precise" design over "flashy animations," CSS animations are superior:
- Zero bundle size (Framer Motion adds ~50kb)
- Better performance (native browser APIs)
- Simpler to maintain
- Demonstrates CSS mastery

**When to add Framer Motion:** Only if you need layout animations, drag interactions, or complex spring physics. For simple entrance animations, fades, and hover effects, pure CSS is faster and lighter.

### Internationalization (i18n)
| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| next-intl | 4.8.2 | i18n for Next.js App Router | Built specifically for App Router (react-i18next is Pages Router legacy). Industry standard for Next.js i18n in 2026. Simple setup, automatic route discovery, Server Component support. Used by Node.js official website. | HIGH |

**Why NOT react-i18next:** next-i18next (the Next.js wrapper) is not compatible with App Router. Maintainers officially recommend react-i18next for App Router, but next-intl is simpler and more integrated.

**Setup:**
- Plugin integrates with Next.js build/runtime
- JSON-based translations (simple, no complex namespace configuration)
- Top-level `[locale]` dynamic segment for routing
- Works seamlessly with Server Components (no hydration issues)

**For Korean/English:**
```
├── messages/
│   ├── ko.json
│   └── en.json
├── [locale]/
│   ├── layout.tsx
│   └── page.tsx
```

### Deployment
| Technology | Cost | Purpose | Why | Confidence |
|------------|------|---------|-----|------------|
| Vercel | Free tier sufficient | Next.js deployment platform | Zero-config deployment, built by Next.js creators, automatic preview URLs, edge functions. Free tier: unlimited projects, 100GB bandwidth/month. For portfolio (low traffic), free tier is enough. | HIGH |
| Cloudflare Pages | Free (unlimited) | Alternative deployment | Unlimited bandwidth/requests on free tier, edge network performance, no commercial-use restriction. Better free tier than Vercel. | HIGH |
| Netlify | Free tier available | Alternative deployment | Strong Vercel alternative, more generous free tier, good DX. | MEDIUM |

**Recommendation:** Start with **Vercel** (easiest, zero config) or **Cloudflare Pages** (better free tier). Both provide:
- Automatic deployments from Git
- Preview URLs for PRs
- Edge network (fast global delivery)
- Custom domains
- SSL certificates

**Why NOT self-hosted:** For a portfolio, managed platforms provide better DX and performance. Self-hosting adds complexity without benefit unless demonstrating DevOps skills.

### Dev Tools
| Tool | Version | Purpose | Why | Confidence |
|------|---------|---------|-----|------------|
| Biome | 2.x (stable) | Linting & formatting | 10-25x faster than ESLint+Prettier, single tool (zero config), 97% Prettier-compatible. Rust-based, ships as single binary. Next.js 15.5 offers Biome in `create-next-app`. | HIGH |
| ESLint | 9.x (fallback) | Linting | If you need specific plugins Biome doesn't support. More ecosystem maturity. | MEDIUM |
| Husky | 9.x | Git hooks | Industry standard for pre-commit hooks. Automate linting, formatting, tests before commit. | HIGH |
| lint-staged | 15.x | Run linters on staged files | Performance optimization (only lint changed files). Pairs with Husky. | HIGH |

**Biome vs ESLint+Prettier in 2026:**
- Biome is the modern choice (faster, simpler, all-in-one)
- ESLint still has larger plugin ecosystem
- For new projects: Biome is recommended unless you need specific ESLint plugins

**Next.js 15.5 deprecation note:** `next lint` command is deprecated, removed in Next.js 16. Explicit linting config required (ESLint or Biome).

**Git hooks setup:**
```json
{
  "scripts": {
    "lint": "biome check",
    "format": "biome format --write",
    "prepare": "husky"
  }
}
```

Pre-commit hook runs Biome on staged files only (fast feedback loop).

### Package Manager
| Tool | Performance | Purpose | When to Use | Confidence |
|------|-------------|---------|-------------|------------|
| pnpm | 3.7x faster than npm | Disk-efficient package manager | Recommended for new projects. Saves disk space (global store), faster installs, better monorepo support. | HIGH |
| Bun | 22x faster than npm | All-in-one runtime + package manager | Bleeding edge. Stable for production as of 2026, but ecosystem maturity still growing. Use if you want maximum performance. | MEDIUM |
| npm | Baseline | Default package manager | Perfectly fine for small projects. Maximum compatibility. | HIGH |

**Recommendation for portfolio:** Use **pnpm** or **npm**
- **pnpm:** Better performance, modern best practice, shows awareness of tooling
- **npm:** Simpler, zero learning curve, perfectly adequate for portfolio size
- **Bun:** Skip unless you want to showcase bleeding-edge tech (may raise questions in interviews)

### Build & Bundling
| Technology | Purpose | Status | Why | Confidence |
|------------|---------|--------|-----|------------|
| Turbopack | Next.js bundler | Beta (production-ready) | Built into Next.js 15.5. Use `next build --turbopack` for 2-5x faster builds. Powers vercel.com, v0.app, nextjs.org (1.2B+ requests). | MEDIUM |
| Webpack | Next.js bundler (default) | Stable | Default in Next.js 15. More battle-tested, better bundle optimization in some cases. | HIGH |

**Recommendation:** Use **Webpack** (default) for now. Turbopack is beta but production-ready. Switch to Turbopack if build times become an issue or to demonstrate awareness of cutting-edge tools.

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Framework | Next.js 15 | Remix, Astro | Next.js is industry standard, has largest ecosystem, best for React-heavy apps. Remix is great but smaller adoption. Astro is for content sites. |
| Styling | Tailwind v4 | CSS Modules, styled-components | Tailwind is 2026 standard. CSS Modules are fine but verbose. styled-components has performance overhead with Server Components. |
| i18n | next-intl | react-i18next | next-intl built for App Router. react-i18next requires more config and is better for Pages Router. |
| Linting | Biome | ESLint + Prettier | Biome is 10-25x faster, simpler config, single tool. ESLint+Prettier still valid for plugin ecosystem. |
| Deployment | Vercel | Netlify, Cloudflare Pages, Railway | Vercel is zero-config for Next.js. Cloudflare Pages has better free tier. Railway is overkill for static portfolio. |
| Animation | CSS Animations | Framer Motion, GSAP | CSS is lighter, faster, simpler. Framer Motion adds 50kb for features you likely won't use. GSAP is overkill. |

## Installation

### Initial Setup
```bash
# Create Next.js project with Biome
npx create-next-app@latest

# During setup, choose:
# - TypeScript: Yes
# - ESLint or Biome: Biome (recommended)
# - Tailwind CSS: Yes
# - App Router: Yes
# - Turbopack: No (use default for now)
```

### Core Dependencies
```bash
# Package manager (choose one)
npm install next@latest react@latest react-dom@latest

# Or with pnpm
pnpm add next@latest react@latest react-dom@latest

# Tailwind utilities
npm install clsx tailwind-merge

# i18n
npm install next-intl
```

### Dev Dependencies
```bash
npm install -D @tailwindcss/postcss postcss

# Git hooks (optional but recommended)
npm install -D husky lint-staged

# Initialize Husky
npx husky init
```

### Tailwind CSS v4 Setup
```bash
# Install Tailwind v4 and PostCSS plugin
npm install tailwindcss@next @tailwindcss/postcss
```

**postcss.config.mjs:**
```js
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
```

**app/globals.css:**
```css
@import "tailwindcss";
```

### next-intl Setup
```bash
# Install next-intl
npm install next-intl

# Create plugin wrapper in next.config.ts
```

## Configuration Files

### next.config.ts
```typescript
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
  // Enable typed routes (stable in 15.5)
  typedRoutes: true,
};

export default withNextIntl(nextConfig);
```

### biome.json (if using Biome)
```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "organizeImports": {
    "enabled": true
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2
  }
}
```

### package.json scripts
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "biome check",
    "lint:fix": "biome check --write",
    "format": "biome format --write .",
    "type-check": "tsc --noEmit"
  }
}
```

### .husky/pre-commit (Git hooks)
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

### lint-staged.config.js
```js
module.exports = {
  '*.{js,jsx,ts,tsx}': ['biome check --write'],
};
```

## Anti-Patterns to Avoid

### Don't Use Outdated Patterns
- **Pages Router:** App Router is the standard in 2026
- **next-i18next:** Not compatible with App Router
- **CSS-in-JS (emotion, styled-components):** Poor Server Component compatibility, runtime overhead
- **Framer Motion for simple effects:** Adds 50kb for animations CSS handles natively

### Don't Over-Engineer
- **Global state (Redux, Zustand) for static content:** Portfolio likely doesn't need client state management
- **Complex animation libraries:** CSS handles 90% of portfolio animations
- **Backend frameworks:** Portfolio is static/SSG, doesn't need Express/Fastify
- **Docker/K8s:** Deployment platforms handle this; self-hosting adds complexity

### Don't Use Legacy Tools
- **Prettier (alone):** Biome combines linting + formatting, 10x faster
- **Webpack config tweaking:** Next.js abstracts this; custom config is rarely needed
- **npm (if performance matters):** pnpm is 3.7x faster with same compatibility

## Browser Support

**Tailwind CSS v4 requirements:**
- Safari 16.4+
- Chrome 111+
- Firefox 128+

**Implication:** Drops IE11, older Safari. Acceptable for 2026 portfolio targeting modern companies.

**If you need older browser support:** Use Tailwind v3.4 instead.

## Performance Budget

Target metrics for portfolio site:

| Metric | Target | How to Achieve |
|--------|--------|----------------|
| First Contentful Paint (FCP) | < 1.5s | Server Components, minimal client JS, Vercel edge deployment |
| Largest Contentful Paint (LCP) | < 2.5s | Image optimization (next/image), SSG, CDN delivery |
| Time to Interactive (TTI) | < 3.5s | Minimize JavaScript bundle, code splitting, Server Components |
| Total Bundle Size | < 150kb | CSS animations instead of Framer Motion, Server Components reduce client JS by 20-30% |

**Next.js optimizations out of the box:**
- Automatic code splitting
- Image optimization (WebP/AVIF conversion)
- Font optimization (next/font)
- Server Components (zero bundle size for server-only code)

## Summary

**Core Stack:**
- Next.js 15.5 + React 19 + TypeScript 5.9
- Tailwind CSS v4 for styling
- next-intl for Korean/English i18n
- CSS animations (no Framer Motion unless needed)
- Biome for linting/formatting
- pnpm or npm for package management
- Vercel or Cloudflare Pages for deployment

**Philosophy:**
- Modern, battle-tested technologies (not bleeding edge)
- Performance-first (Server Components, minimal client JS)
- Clean, maintainable code (TypeScript, Biome, git hooks)
- Demonstrate 2026 best practices (App Router, typed routes, Tailwind v4)

**For Korean big tech interviews:**
This stack shows awareness of current industry standards, modern React patterns (Server Components), performance optimization, and clean code practices. It's production-ready, not experimental.

## Sources

**Next.js & React:**
- [Next.js 15.5 Release](https://nextjs.org/blog/next-15-5)
- [Next.js Releases](https://github.com/vercel/next.js/releases)
- [React 19.2 Release](https://react.dev/blog/2025/10/01/react-19-2)
- [Next.js 15 & 16 Migration Guide 2026](https://jishulabs.com/blog/nextjs-15-16-features-migration-guide-2026)

**Tailwind CSS:**
- [Tailwind CSS v4.0 Release](https://tailwindcss.com/blog/tailwindcss-v4)
- [Tailwind CSS Releases](https://github.com/tailwindlabs/tailwindcss/releases)
- [A dev's guide to Tailwind CSS in 2026](https://blog.logrocket.com/tailwind-css-guide/)

**Internationalization:**
- [next-intl Documentation](https://next-intl.dev/)
- [Best i18n Libraries for Next.js App Router 2025](https://medium.com/better-dev-nextjs-react/the-best-i18n-libraries-for-next-js-app-router-in-2025-21cb5ab2219a)
- [Why I Chose next-intl](https://medium.com/@isurusasanga1999/why-i-chose-next-intl-for-internationalization-in-my-next-js-66c9e49dd486)
- [Next.js i18n Guide](https://poeditor.com/blog/next-js-i18n/)

**Development Tools:**
- [Biome vs ESLint 2025](https://medium.com/better-dev-nextjs-react/biome-vs-eslint-prettier-the-2025-linting-revolution-you-need-to-know-about-ec01c5d5b6c8)
- [Package Managers Comparison 2026](https://pockit.tools/blog/pnpm-npm-yarn-bun-comparison-2026/)
- [Husky and lint-staged Guide](https://betterstack.com/community/guides/scaling-nodejs/husky-and-lint-staged/)

**Deployment:**
- [Top Vercel Alternatives 2026](https://www.digitalocean.com/resources/articles/vercel-alternatives)
- [Best Next.js Hosting Providers 2026](https://makerkit.dev/blog/tutorials/best-hosting-nextjs)

**Performance & Optimization:**
- [React Server Components 2026 Guide](https://www.grapestechsolutions.com/blog/react-server-components-explained/)
- [Zero-Bundle-Size React Server Components](https://www.syncfusion.com/blogs/post/zero-bundle-size-react-server-components)
- [Framer Motion vs CSS Animations 2025](https://medium.com/@theekshanachamodhya/why-framer-motion-still-beats-css-animations-in-2025-16b3d74eccbd)
- [Do You Still Need Framer Motion?](https://motion.dev/blog/do-you-still-need-framer-motion)

**TypeScript:**
- [TypeScript 5.7 Release](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-7.html)
- [TypeScript Releases](https://github.com/microsoft/typescript/releases)
