# Stack Research

**Domain:** Engineering-depth project detail pages — syntax highlighting, content visualization, typography
**Researched:** 2026-03-02
**Confidence:** HIGH (versions npm-verified; integration patterns confirmed via official sources)

---

## Scope

This document covers only the **new additions** needed for v4.0 project detail enhancement. The following
are already installed and must NOT be re-researched or re-installed:

| Already Installed | Version | Status |
|---|---|---|
| `next` | ^16.1.6 | Installed |
| `react` / `react-dom` | ^19.2.4 | Installed |
| `typescript` | ^5.9.3 | Installed |
| `tailwindcss` | ^4.1.18 | Installed |
| `next-intl` | ^4.8.2 | Installed |
| `next-themes` | ^0.4.6 | Installed |
| `lucide-react` | ^0.563.0 | Installed |
| `clsx` | ^2.1.1 | Installed |

The v3.0 packages (`three`, `@react-three/fiber`, `@react-three/drei`, `gsap`, `@gsap/react`, `lenis`,
`motion`, `@react-three/postprocessing`, `maath`) are being **deleted** in v4.0's lab2 cleanup task.
Do not depend on them for the new feature set.

---

## Recommended Stack — New Additions

### Core: Syntax Highlighting

| Technology | Version (npm-verified) | Purpose | Why Recommended |
|---|---|---|---|
| `shiki` | ^4.0.0 | Code block syntax highlighting | Zero client JS: runs as a Next.js Server Component, outputs pre-colored HTML with inline CSS variables. VS Code quality highlighting (same TextMate grammars). Dual-theme support maps cleanly to next-themes' `data-theme` attribute. v4.0 is the current stable, dropping only Node 18 support vs v3. |

**Why shiki over alternatives:**

- **vs `react-syntax-highlighter`:** react-syntax-highlighter ships Prism/Highlight.js to the client as
  JavaScript. Since this portfolio's code snippets are entirely static content (hardcoded in translation
  files), there is zero reason to do client-side highlighting. Shiki runs server-side at zero client
  bundle cost.

- **vs Prism.js standalone:** Prism v2 development stalled; TypeScript grammar support is notably weak.
  This portfolio shows TypeScript/Next.js code — Prism is a poor match.

- **vs Highlight.js:** Better for auto-detection use cases. This portfolio knows exactly what language
  each snippet is, making auto-detection overhead pointless. Shiki's VS Code quality output is
  significantly superior for a developer portfolio.

**Integration with next-themes (data-theme pattern):**

The portfolio uses `data-theme="dark"` / `data-theme="light"` on the HTML element via next-themes.
Shiki's dual-theme output uses CSS variables (`--shiki-dark` for dark theme colors). The integration
requires one CSS rule block — no runtime JavaScript:

```css
/* In globals.css — add under existing theme definitions */
[data-theme='dark'] .shiki,
[data-theme='dark'] .shiki span {
  color: var(--shiki-dark) !important;
  background-color: var(--shiki-dark-bg) !important;
  font-style: var(--shiki-dark-font-style) !important;
  font-weight: var(--shiki-dark-font-weight) !important;
  text-decoration: var(--shiki-dark-text-decoration) !important;
}
```

**Recommended theme pair:** `github-light` (light) + `github-dark` (dark) — clean, familiar, matches
the portfolio's minimal aesthetic. Avoid `monokai` or cyberpunk themes that would clash with the
minimalist design.

---

### Patterns: No Additional Library Needed

The following requirements are **best solved with Tailwind CSS utilities alone**, without adding
libraries:

| Feature | Approach | Rationale |
|---|---|---|
| Comparison/tradeoff tables | Native HTML `<table>` + Tailwind classes | Portfolio content is static — tables are authored directly in TSX components. A table library (e.g., tanstack-table) is built for dynamic/sortable data, not static content. |
| Metrics visualization (numbers, percentages) | Tailwind `<div>` bars + CSS width utilities | "90% automation" is a static number, not a live data point. A chart library (Recharts, Victory, Chart.js) brings heavy JavaScript for data that never changes. Plain CSS progress bars are sub-1KB and render server-side. |
| Architecture diagrams | Inline SVG or existing `<Image>` component | Architecture images already exist as WebP files in the project (confirmed in PROJECT.md). New diagrams should be hand-authored SVGs inline in TSX or exported as static images — not generated via Mermaid. |
| Better typography for technical content | Tailwind `prose`-equivalent utilities | The portfolio uses Tailwind v4 CSS-first config. Implement a `.prose-technical` CSS class in `globals.css` for consistent technical content typography (code fonts, quote styling, etc.) — no `@tailwindcss/typography` plugin needed. |

**Why NOT to add Recharts/Victory/Tremor for metrics:**

Recharts is 3.7.0 (current) and weighs ~700KB minified. Victory and Tremor are similarly heavy. The
"metrics" on engineering challenge pages are 3-5 static numbers ("90% process automation", "9.5억원
절감", "77% passenger satisfaction improvement"). These do not require SVG chart rendering — a styled
`<div>` with a percentage width communicates the same information at zero cost.

**Why NOT to add Mermaid.js for diagrams:**

Mermaid 11.12.3 unpacked size: **69MB**. It is client-side only and requires `dynamic(() => import(),
{ ssr: false })`. The portfolio already has architecture images in WebP format. For the one or two new
architectural diagrams needed, inline SVG authored in TSX is smaller, faster, and fully server-rendered.
Mermaid is appropriate for documentation sites with user-generated diagrams — not for a static portfolio
with 5 pre-defined projects.

---

## Installation

```bash
# Only one new package needed
npm install shiki --cache /tmp/npm-cache-temp
```

That is the complete installation for v4.0. Everything else is Tailwind utilities and native HTML.

---

## What NOT to Add

| Avoid | Why | Use Instead |
|---|---|---|
| `react-syntax-highlighter` | Ships Prism/Highlight.js as client JavaScript — wasted bundle for static content | `shiki` (server component) |
| `prismjs` | v2 development stalled; weak TypeScript grammar; client-side only | `shiki` |
| `rehype-pretty-code` | MDX pipeline dependency — this project stores content in JSON translation files, not Markdown files | `shiki` codeToHtml() called directly |
| `recharts` | ~700KB for static number display | CSS `<div>` with width percentage |
| `victory` | Large bundle, built for interactive charts | CSS `<div>` with width percentage |
| `tremor` | Built on Recharts (same weight); designed for dashboards, not portfolio pages | Tailwind utilities |
| `chart.js` / `react-chartjs-2` | Client-side canvas rendering for static data | CSS bars |
| `mermaid` | 69MB unpacked, client-side only, needs `dynamic` import | Inline SVG or existing WebP images |
| `@tailwindcss/typography` | v4 CSS-first config doesn't use plugins the same way; manual `.prose-technical` class in globals.css is simpler and fully controlled | Tailwind v4 CSS-first custom class |
| `shadcn/ui` | The project deliberately avoids pre-built component libraries (not in any existing milestone). Adding shadcn now creates inconsistency with the existing design system. | Custom Tailwind components |
| `framer-motion` / `motion` | The v4.0 milestone explicitly removes animation libraries (lab2 cleanup). Any new animations should be CSS transitions only. | CSS `transition` utilities |

---

## Implementation Pattern: Code Block Component

The Shiki integration is a single server component — no hook, no context, no client-side code:

```typescript
// components/ui/CodeBlock.tsx  (Server Component — no 'use client')
import { codeToHtml, type BundledLanguage } from 'shiki'

interface CodeBlockProps {
  code: string
  lang: BundledLanguage
  filename?: string  // optional tab label, e.g. "middleware.ts"
}

export async function CodeBlock({ code, lang, filename }: CodeBlockProps) {
  const html = await codeToHtml(code, {
    lang,
    themes: {
      light: 'github-light',
      dark: 'github-dark',
    },
  })

  return (
    <div className="rounded-lg border border-border overflow-hidden font-mono text-sm">
      {filename && (
        <div className="px-4 py-2 border-b border-border text-xs text-muted-foreground bg-muted">
          {filename}
        </div>
      )}
      <div
        className="p-4 overflow-x-auto [&_.shiki]:bg-transparent"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}
```

**Usage in project detail page (also Server Component):**

```typescript
import { CodeBlock } from '@/components/ui/CodeBlock'

// In the engineering challenge section:
<CodeBlock
  code={`// JWT auto-refresh middleware
export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')
  if (!token || isExpired(token)) {
    return refreshToken(request)
  }
}`}
  lang="typescript"
  filename="middleware.ts"
/>
```

---

## Implementation Pattern: Static Metrics Bar

No library — pure Tailwind:

```typescript
// components/ui/MetricBar.tsx  (Server Component)
interface MetricBarProps {
  label: string
  value: string   // e.g. "90%"
  percentage: number  // 0-100 for bar width
  note?: string
}

export function MetricBar({ label, value, percentage, note }: MetricBarProps) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-foreground font-medium">{label}</span>
        <span className="text-primary font-bold">{value}</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {note && <p className="text-xs text-muted-foreground">{note}</p>}
    </div>
  )
}
```

---

## Implementation Pattern: Tradeoff Comparison Table

No library — semantic HTML with Tailwind:

```typescript
// components/ui/TradeoffTable.tsx  (Server Component)
interface Row {
  option: string
  pros: string[]
  cons: string[]
  chosen?: boolean
}

export function TradeoffTable({ rows }: { rows: Row[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-2 pr-4 font-medium text-muted-foreground">Option</th>
            <th className="text-left py-2 pr-4 font-medium text-muted-foreground">Pros</th>
            <th className="text-left py-2 font-medium text-muted-foreground">Cons</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.option} className={`border-b border-border/50 ${row.chosen ? 'bg-primary/5' : ''}`}>
              <td className="py-3 pr-4 font-medium align-top">
                {row.option}
                {row.chosen && <span className="ml-2 text-xs text-primary">(chosen)</span>}
              </td>
              <td className="py-3 pr-4 align-top text-muted-foreground">{row.pros.join(', ')}</td>
              <td className="py-3 align-top text-muted-foreground">{row.cons.join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

---

## Version Compatibility

| Package | Version | Compatible With | Notes |
|---|---|---|---|
| `shiki` | ^4.0.0 | Node.js 20+, Next.js 16 App Router, React 19 | v4 drops Node 18 only. Serverless runtime recommended (not Edge Runtime). ESM-only — no CJS build. |
| `shiki` + `next-themes` | — | `data-theme` attribute approach | next-themes writes `data-theme` to HTML element; shiki dual-theme CSS uses `[data-theme='dark']` selector. Works without any JavaScript. |

**Edge Runtime warning:** Do NOT use `shiki` in Next.js Edge Runtime (Middleware). Use it only in
Server Components and Server Actions, which run in Node.js (Serverless) runtime.

---

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|---|---|---|
| `shiki` | `react-syntax-highlighter` | When content is dynamically user-generated and must highlight client-side |
| `shiki` | `prismjs` | Never for this project — TypeScript support is inferior |
| CSS bars | `recharts` | When data is fetched at runtime and changes (never the case for a static portfolio) |
| Inline SVG | `mermaid` | When end users author their own diagrams (documentation sites, wikis) |
| Tailwind `prose-technical` class | `@tailwindcss/typography` | When rendering arbitrary Markdown from a CMS — not applicable here |

---

## Stack Patterns by Variant

**If a code snippet is in a Server Component page (most cases):**

- Use `<CodeBlock>` directly — it's async and renders server-side
- No need for Suspense or loading state
- Output is static HTML — zero client JavaScript

**If a code snippet needs to be inside a Client Component for some reason:**

- Wrap in a Server Component parent that passes `html` as a prop
- Pre-render with shiki server-side, pass the HTML string, render with `dangerouslySetInnerHTML`
- Do NOT use `react-syntax-highlighter` as a workaround — restructure to keep highlighting server-side

**If the project detail page needs an architecture diagram that doesn't exist as a WebP image:**

- Author inline SVG in TSX (hand-craft for simple diagrams, 5-20 elements)
- Or export from Excalidraw/Figma as SVG and inline it as a React component
- Do NOT add Mermaid for one diagram

---

## Sources

- npm registry (`npm view shiki version`, `npm view mermaid dist.unpackedSize`) — version and size verification
- [shiki.style/packages/next](https://shiki.style/packages/next) — official Next.js integration docs, v3.23.0 → v4.0.0 API
- [shiki.style/guide/dual-themes](https://shiki.style/guide/dual-themes) — dual theme CSS variable approach confirmed
- [shiki.style/guide/migrate](https://shiki.style/guide/migrate) — v4 breaking changes: Node 18 drop only, no API changes from v3
- [Lucky Media — Shiki + React Server Components + Next.js](https://www.luckymedia.dev/blog/syntax-highlighting-with-shiki-react-server-components-and-next-js) — server component integration pattern (MEDIUM confidence, community source)
- [chsm.dev — Comparing web code highlighters (Jan 2025)](https://chsm.dev/blog/2025/01/08/comparing-web-code-highlighters) — competitive analysis confirming Shiki recommendation (MEDIUM confidence)
- [npm-compare.com — prismjs vs highlight.js vs shiki vs react-syntax-highlighter](https://npm-compare.com/highlight.js,prismjs,react-syntax-highlighter,shiki) — download/popularity data

---

*Stack research for: v4.0 Project Detail Enhancement — engineering-depth content*
*Researched: 2026-03-02*
