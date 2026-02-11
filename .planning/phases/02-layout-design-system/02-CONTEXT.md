# Phase 2: Layout & Design System - Context

**Gathered:** 2026-02-11
**Status:** Ready for planning

<domain>
## Phase Boundary

Create reusable UI components (Button, Card, Badge) and site-wide layout structure (header, footer, navigation). Language toggle moves to header. All pages get consistent layout wrapper. This phase does NOT include main page content sections (Phase 3) or project detail pages (Phase 4).

</domain>

<decisions>
## Implementation Decisions

### UI Component Style
- Cards: border only, no shadows — flat, clean feel
- Badges: used exclusively for tech stack tags (React, TypeScript, Next.js etc.)
- Animations: subtle transitions on hover/click — not static, but restrained
- Buttons: Claude's discretion, matching overall visual direction

### Visual Direction
- Light/dark mode: both supported with toggle
- Typography: Pretendard font throughout (Korean + Latin)
- Designer-like visual sense — not a typical developer portfolio; should feel crafted
- Typography animations: text that moves or transforms (inspired by loiclaudet CodePen style)
- Timeline UI: experience/career section should use timeline layout (inspired by webcraftsman CodePen style)

### Claude's Discretion
- Color palette selection (appropriate for portfolio)
- Layout density and spacing rhythm
- Button variants and styling
- Header layout and navigation pattern
- Footer content structure and link grouping
- Mobile menu behavior and scroll effects
- Loading skeleton design
- Exact animation timing and easing

</decisions>

<specifics>
## Specific Ideas

- Reference: https://codepen.io/loiclaudet/pen/VYvBRZv — typography animation, overall visual sense
- Reference: https://codepen.io/webcraftsman/pen/ByjZxgd — timeline UI for experience section
- "디자이너적인 감각을 넣고 싶다" — the portfolio should demonstrate design taste, not just technical skill
- Pretendard font for unified Korean/English typography

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-layout-design-system*
*Context gathered: 2026-02-11*
