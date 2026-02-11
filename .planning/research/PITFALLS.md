# Domain Pitfalls: Frontend Developer Portfolio

**Domain:** Frontend Developer Portfolio (targeting Korean big tech)
**Researched:** 2026-02-11
**Confidence:** MEDIUM (WebSearch findings verified across multiple sources)

## Critical Pitfalls

Mistakes that cause rewrites, major issues, or immediate rejection in hiring processes.

### Pitfall 1: PM-Centric Project Narratives
**What goes wrong:** Describing projects from product management perspective ("managed team," "coordinated features") instead of frontend technical implementation, resulting in portfolios that don't showcase actual coding skills or technical decision-making.

**Why it happens:** Developer has 5 years across multiple domains but projects were originally written from PM perspective. Korean big tech (Samsung, Naver, Kakao) specifically look for technical depth and hands-on frontend expertise.

**Consequences:**
- Recruiters can't assess technical capabilities
- Portfolio reads like PM/coordinator role, not developer role
- Fails to demonstrate frontend-specific problem-solving
- Korean tech companies value technical prowess highly - this is a deal-breaker

**Prevention:**
- Reframe ALL projects with technical focus: "Built X using Y to solve Z problem"
- Highlight frontend-specific challenges: performance optimization, state management, responsive design, accessibility
- Include technical decision rationale: "Chose React Query over Redux because..."
- Show code quality through architecture decisions and implementation details

**Detection:** If project descriptions focus on "coordinated," "managed," "planned" rather than "built," "implemented," "optimized" - red flag.

**Phase mapping:** Phase 1 (Content Strategy) must address this immediately. All project rewrites should emphasize technical implementation over management activities.

---

### Pitfall 2: Poor Core Web Vitals Performance
**What goes wrong:** Portfolio site loads slowly or has poor interaction metrics, failing to meet Core Web Vitals standards. 64% of websites fail all three metrics, and Korean tech companies with advanced infrastructure (224 Mbps mobile speeds) expect fast, optimized experiences.

**Why it happens:**
- Next.js Image component misconfigured (missing sizing, incorrect fill usage)
- Heavy animations without optimization
- Request waterfalls (sequential await calls)
- Unoptimized third-party scripts
- Over-preloading images

**Consequences:**
- Poor Google rankings (SEO disaster for portfolio discoverability)
- 7% conversion rate drop per 100ms delay
- Demonstrates lack of performance optimization skills
- Korean companies with fast infrastructure expect technical excellence

**Prevention:**
```typescript
// WRONG: Sequential waterfalls
const user = await fetchUser();
const posts = await fetchPosts(user.id);
const comments = await fetchComments(posts);

// RIGHT: Parallel requests
const [user, posts] = await Promise.all([
  fetchUser(),
  fetchPosts()
]);

// WRONG: next/image without sizing
<Image src="/hero.jpg" fill />

// RIGHT: Proper sizing to prevent CLS
<div className="relative w-full aspect-video">
  <Image
    src="/hero.jpg"
    fill
    sizes="100vw"
    priority // Only for LCP hero
  />
</div>
```

**Detection:**
- Run Lighthouse audit - target LCP < 2.5s, CLS < 0.1, INP low
- Check Coverage tab in Chrome DevTools for unused JavaScript
- Test on mobile with throttling

**Phase mapping:**
- Phase 2 (Technical Setup): Configure next/image correctly from start
- Phase 3 (Core Features): Monitor performance during development
- Phase 5 (Polish): Performance audit before deployment

---

### Pitfall 3: Missing or Broken Bilingual Support
**What goes wrong:** Korean/English language switching is afterthought, resulting in broken layouts, missing translations, inconsistent content depth, or machine-translated text that sounds unnatural in Korean.

**Why it happens:**
- Treating i18n as post-launch feature
- Not designing layouts to accommodate Korean text (longer than English)
- Using Google Translate instead of human translation
- Different content between languages (Korean shorter/incomplete)

**Consequences:**
- Korean recruiters get inferior experience or broken layouts
- Demonstrates poor internationalization skills
- Korean companies expect professional Korean language support
- Shows lack of attention to detail and cultural awareness

**Prevention:**
- Next.js app router with built-in i18n support from Day 1
- Design layouts with 30% flex for Korean text expansion
- Write content in both languages simultaneously (not translate later)
- Use Korean formal honorifics (존댓말) in professional contexts
- Test BOTH language versions equally throughout development
- For Korean big tech: Korean version equally polished, not secondary

```typescript
// Set up i18n routing in next.config.js from start
const nextConfig = {
  i18n: {
    locales: ['en', 'ko'],
    defaultLocale: 'ko', // Korean companies likely visit Korean version first
    localeDetection: true
  }
}
```

**Detection:**
- Layout breaks when switching languages
- Korean text sounds awkward or machine-generated
- Content depth differs between languages
- Missing translations showing English fallback in Korean version

**Phase mapping:**
- Phase 2 (Technical Setup): i18n architecture must be in place
- Phase 3 (Content): Write bilingual content simultaneously
- Phase 5 (Polish): Native Korean speaker review required

---

### Pitfall 4: Skill Bars and Percentage Charts
**What goes wrong:** Displaying skills as "JavaScript 80%" or percentage bar charts that provide zero meaningful information to recruiters. This is consistently listed as a top portfolio mistake.

**Why it happens:** Common portfolio template pattern that "looks good" but is substance-free. What does "80% JavaScript" even mean?

**Consequences:**
- Signals junior developer or cargo-culting
- Wastes valuable above-fold space
- Provides no actual assessment of capability
- Korean tech companies value demonstrated expertise over self-ratings

**Prevention:**
- Show skills through projects with tangible outcomes
- Technology tags on project cards (context-based)
- Code quality indicators: TypeScript strict mode, testing coverage, performance metrics
- For Korean companies: Emphasize clean code, performance optimization, team collaboration

**Instead of:**
```
JavaScript ████████░░ 80%
React ██████████ 90%
```

**Do this:**
```
Built real-time dashboard handling 10K concurrent users
- Next.js App Router with React Server Components
- Optimized LCP from 4.2s to 1.8s
- Reduced bundle size by 40% with code splitting
```

**Detection:** If portfolio has skill bars or percentage charts - remove immediately.

**Phase mapping:** Phase 1 (Content Strategy) - explicitly document "NO skill percentages" rule.

---

## Moderate Pitfalls

Mistakes that cause delays, technical debt, or reduced hiring appeal.

### Pitfall 5: Tutorial Projects Without Customization
**What goes wrong:** Including projects that clearly came from tutorials or courses without significant customization or extension.

**Why it happens:** Padding portfolio quantity, using tutorials as learning but not evolving them.

**Consequences:**
- Experienced recruiters recognize popular tutorial projects
- Suggests inability to build original solutions
- Wastes portfolio space that could showcase unique work
- Korean big tech with competitive hiring expects original thinking

**Prevention:**
- If including tutorial-based project, customize extensively (80%+ different)
- Add significant features beyond tutorial scope
- Better: Link GitHub repo with note "based on X tutorial" instead of portfolio feature
- Best: Only include original projects or heavily modified work
- For 5-year developer: Tutorial projects inappropriate - should have real projects

**Detection:** Projects matching popular tutorial patterns (todo app, weather app with default UI).

**Phase mapping:** Phase 1 (Content Strategy) - audit existing projects, exclude or note tutorial origins.

---

### Pitfall 6: Overly Complex Design and Animations
**What goes wrong:** Portfolio has elaborate 3D effects, heavy animations, parallax scrolling, and cutting-edge visual features that:
- Slow down page performance dramatically
- Distract from actual project content
- Break on mobile devices
- Cause high bounce rates

**Why it happens:** Temptation to showcase technical skills through visual complexity. Desire to stand out visually.

**Consequences:**
- Mobile performance disaster (mobile-first indexing hurts SEO)
- Content buried under visual effects
- Longer load times negate technical credibility
- Accessibility issues from motion-heavy interfaces
- Korean companies with fast infrastructure notice poor optimization

**Prevention:**
- Animation budget: Pick 2-3 purposeful animations maximum
- Use hardware-accelerated CSS properties only (transform, opacity)
- Avoid animating layout properties (width, height, top, left, margin, padding)
- Test on mid-range mobile devices, not just MacBook Pro
- Respect `prefers-reduced-motion` media query
- For Korean market: Clean, fast, professional over flashy

```css
/* WRONG: Expensive animations */
@keyframes slide {
  from { left: 0; width: 100px; }
  to { left: 100px; width: 200px; }
}

/* RIGHT: Hardware accelerated */
@keyframes slide {
  from { transform: translateX(0) scale(1); }
  to { transform: translateX(100px) scale(2); }
}
```

**Detection:**
- Lighthouse performance score < 90
- Mobile scroll feels janky
- Layout shift during animations
- JS bundle > 200KB for simple portfolio

**Phase mapping:**
- Phase 3 (Core Features): Establish animation budget upfront
- Phase 4 (Projects): Prioritize content visibility over visual effects
- Phase 5 (Polish): Remove animations that don't serve clear purpose

---

### Pitfall 7: Poor Project Documentation and Context
**What goes wrong:** Projects displayed as screenshots with no explanation, or technical details without business context. Non-technical recruiters (HR) can't understand value; technical reviewers can't assess decision-making.

**Why it happens:**
- Assuming screenshots are self-explanatory
- Writing for technical audience only
- Not explaining why technical choices matter

**Consequences:**
- HR screens out portfolio before technical interview
- Can't demonstrate problem-solving process
- Projects look like coding exercises rather than solutions
- Korean companies value both technical skill AND communication

**Prevention:**
For EACH project, include:

**Must-have:**
- One-sentence summary (what it does)
- Problem statement (why it needed to exist)
- Your role (solo, team size, your specific contributions)
- Tech stack with rationale (why these choices)
- Key technical challenges solved
- Measurable outcomes (performance metrics, user impact)
- Live link + GitHub link (if possible)

**Project case study structure:**
```markdown
## Real-time Analytics Dashboard

Led frontend development for internal analytics platform serving 50+ data analysts.

**Problem:** Legacy dashboard took 15+ seconds to load, blocking daily workflows

**Solution:**
- Migrated from CRA to Next.js 14 with App Router
- Implemented React Server Components for initial data fetch
- Added optimistic updates with React Query for perceived performance
- Virtualized large data tables with react-window

**Impact:**
- LCP reduced from 15.2s to 1.8s (88% improvement)
- User satisfaction score increased from 3.2 to 4.7/5
- Reduced API calls by 60% through intelligent caching

**Tech:** Next.js 14, TypeScript, React Query, Tailwind CSS, D3.js

**Role:** Solo frontend developer (2-month timeline)
```

**Detection:**
- Can a non-developer understand what the project does? If no - add context
- Can a senior developer assess your decision-making? If no - add technical rationale

**Phase mapping:**
- Phase 1 (Content Strategy): Define project documentation template
- Phase 4 (Projects): Apply template to ALL projects
- Phase 5 (Polish): Have both technical and non-technical reviewers test clarity

---

### Pitfall 8: Inaccessible Design (WCAG Non-Compliance)
**What goes wrong:** Portfolio fails basic accessibility standards - poor color contrast, keyboard navigation broken, no alt text, missing ARIA labels, causing 30% of WCAG issues to slip through automated tools.

**Why it happens:**
- Treating accessibility as post-launch compliance checkbox
- Relying on automated tools only (catches 30% of issues)
- Not testing with actual keyboard navigation or screen readers

**Consequences:**
- Legal compliance risk (WCAG 2.1 AA is 2026 standard)
- Demonstrates lack of professional frontend standards
- Portfolio inaccessible to users with disabilities
- Korean companies increasingly emphasize inclusive design
- Shows poor attention to web standards

**Prevention:**
Target WCAG 2.1 Level AA minimum (WCAG 2.2 AA preferred):

**Critical checks:**
- Color contrast ratios: 4.5:1 for normal text, 3:1 for large text
- Full keyboard navigation (Tab, Enter, Escape, Arrow keys)
- Focus indicators visible and clear
- Alt text for ALL images
- Semantic HTML (proper heading hierarchy, landmarks)
- Form labels and error messages
- Skip to main content link

```tsx
// WRONG: Non-semantic div soup
<div onClick={handleClick}>Click me</div>

// RIGHT: Semantic, accessible
<button
  onClick={handleClick}
  aria-label="Open project details"
>
  Click me
</button>

// WRONG: Image without alt
<Image src="/project.jpg" />

// RIGHT: Descriptive alt text
<Image
  src="/project.jpg"
  alt="Analytics dashboard showing real-time user metrics with line charts and KPI cards"
/>
```

**Detection:**
- Run axe DevTools extension (free)
- Manual keyboard navigation test (Tab through entire site)
- Test with screen reader (VoiceOver on Mac, NVDA on Windows)
- Color contrast checker in DevTools

**Phase mapping:**
- Phase 2 (Technical Setup): Configure ESLint with jsx-a11y plugin
- Phase 3 (Core Features): Build accessible from start, not retrofit
- Phase 5 (Polish): Manual accessibility audit required before launch

---

### Pitfall 9: Hidden or Inconvenient Contact Information
**What goes wrong:** Contact details buried in footer, no clear CTA, multiple clicks to reach contact form, or empty social media links that go nowhere.

**Why it happens:** Portfolio design prioritizes visual storytelling over conversion. Social media links added as decoration.

**Consequences:**
- Interested recruiters can't easily reach you
- Friction in hiring pipeline at worst possible moment
- Empty social media profiles suggest inactive developer
- Korean recruiters may prefer specific contact methods (email, LinkedIn)

**Prevention:**
- Contact CTA visible on every page (header/footer)
- Dedicated /contact page with multiple options
- Email address directly visible (not just form)
- Working contact form with clear success state
- LinkedIn link (standard for Korean tech hiring)
- GitHub link (essential for developer portfolios)
- Only include social media you actively use for professional content
- For Korean market: Consider adding note about preferred contact language

**Contact page must-haves:**
```typescript
// Minimum contact options
- Email: visible email address (your.name@example.com)
- LinkedIn: Professional profile link
- GitHub: Active profile with pinned projects
- Contact form: With validation and clear success message
- Response time: Set expectations ("I typically respond within 24 hours")

// Optional but valuable
- Calendly: "Schedule a call" for busy recruiters
- Location/Timezone: Useful for Korean companies assessing relocation/remote options
```

**Detection:**
- Can recruiter contact you from homepage in < 2 clicks?
- Are ALL contact links working and current?
- Do social media profiles have recent activity?

**Phase mapping:**
- Phase 3 (Core Features): Contact form implemented early
- Phase 5 (Polish): Test all contact methods, verify links

---

### Pitfall 10: Treating Accessibility as One-Time Fix
**What goes wrong:** Running accessibility audit once at launch, fixing issues, then never checking again as site evolves. New features introduce new violations.

**Why it happens:** Viewing WCAG compliance as project milestone rather than ongoing standard.

**Consequences:**
- Accessibility regressions with each new feature
- False sense of compliance
- Demonstrates lack of professional maintenance practices
- Korean companies increasingly value systematic quality processes

**Prevention:**
- Integrate accessibility testing into development workflow
- CI/CD pipeline includes automated a11y checks
- Regular manual audits (quarterly minimum)
- Keep accessibility checklist in issue templates
- Document accessibility testing procedures

```json
// package.json - integrate a11y into workflow
{
  "scripts": {
    "test": "jest",
    "test:a11y": "jest-axe",
    "lint": "next lint",
    "build": "next build && npm run test:a11y"
  }
}
```

**Detection:** Last accessibility audit was months ago, new features added since then.

**Phase mapping:**
- Phase 2 (Technical Setup): Configure automated a11y testing
- Phase 3-5: Continuous testing mindset, not one-time audit

---

## Minor Pitfalls

Mistakes that cause annoyance but are relatively easy to fix.

### Pitfall 11: Poor SEO Implementation
**What goes wrong:** Portfolio not discoverable in search, missing meta tags, no sitemap, poor structured data, weak page titles/descriptions.

**Why it happens:** Viewing portfolio as "link to send" rather than discoverable web property.

**Consequences:**
- Lost organic discovery opportunities
- Google can't properly index or rank site
- Social media shares display poorly (no OG tags)
- Demonstrates incomplete web development knowledge

**Prevention:**
Next.js makes SEO straightforward:

```typescript
// app/layout.tsx or page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Your Name - Frontend Developer',
    template: '%s | Your Name'
  },
  description: '5 years experience building performant web applications with Next.js, React, and TypeScript',
  keywords: ['Frontend Developer', 'React Developer', 'Next.js', 'Korean', 'Seoul'],
  authors: [{ name: 'Your Name' }],
  openGraph: {
    title: 'Your Name - Frontend Developer Portfolio',
    description: 'Frontend developer specializing in React and Next.js',
    url: 'https://yourportfolio.com',
    siteName: 'Your Name Portfolio',
    images: [{
      url: 'https://yourportfolio.com/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'Your Name - Frontend Developer'
    }],
    locale: 'ko_KR',
    alternateLocale: ['en_US'],
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Your Name - Frontend Developer',
    description: 'Frontend developer portfolio',
    images: ['https://yourportfolio.com/og-image.jpg']
  },
  robots: {
    index: true,
    follow: true
  }
};
```

**Also implement:**
- XML sitemap (next-sitemap package)
- robots.txt with proper rules
- Schema.org structured data for Person/ProfilePage
- Semantic HTML with proper heading hierarchy
- Alt text for images (also accessibility requirement)

**Detection:**
- Google "site:yourportfolio.com" shows no results
- Social media link previews are broken/generic
- Lighthouse SEO score < 90

**Phase mapping:**
- Phase 2 (Technical Setup): Configure base SEO metadata
- Phase 4 (Projects): Add page-specific metadata
- Phase 5 (Polish): Verify all meta tags, generate sitemap

---

### Pitfall 12: Generic Portfolio with No Focus
**What goes wrong:** Portfolio tries to appeal to everyone - full-stack, mobile, backend, design - ultimately appealing to no one. Dilutes expertise message.

**Why it happens:** Fear of limiting opportunities, showcasing breadth over depth.

**Consequences:**
- Unclear positioning in job market
- Can't compete with focused specialists
- Korean big tech wants frontend experts, not generalists
- Weak portfolio impact compared to targeted competitors

**Prevention:**
- Lead with core expertise: "Frontend Developer specializing in React/Next.js"
- Projects demonstrate depth in frontend domain
- Can mention complementary skills ("familiar with Node.js APIs") but don't dilute main message
- For targeting Samsung/Naver/Kakao: Emphasize frontend technical depth
- With 5 years experience: Depth beats breadth at this career stage

**Detection:** Portfolio headline says "Full Stack Developer" but role target is frontend.

**Phase mapping:** Phase 1 (Content Strategy) - define clear positioning statement.

---

### Pitfall 13: Outdated Portfolio Content
**What goes wrong:** Projects from 2-3 years ago, technologies that are now legacy, outdated frameworks, no recent work visible.

**Why it happens:** Portfolio neglect during busy work periods.

**Consequences:**
- Appears inactive or out-of-touch with current tech
- Doesn't reflect current skill level
- Korean tech companies want to see current capabilities
- Shows lack of ongoing learning

**Prevention:**
- Quarterly portfolio review (calendar reminder)
- Add at least 1 project per year
- Update technologies to current versions
- Archive old projects that no longer represent your skills
- Show learning journey (blog posts about new techniques)
- For Korean market: Recent work especially important in fast-moving tech culture

**Detection:** Most recent project is > 1 year old, or using React 16/17 in 2026.

**Phase mapping:** Post-launch maintenance - set quarterly review schedule.

---

### Pitfall 14: Missing or Broken Live Demos
**What goes wrong:** GitHub links only (no live demo), or live demos that are broken, expired (free Heroku dyno), or unusably slow.

**Why it happens:** Deployment neglected or free hosting expires.

**Consequences:**
- Recruiters must imagine what project looks like
- Can't interact with actual implementation
- Broken demos worse than no demos (signals poor maintenance)
- Korean recruiters want to see working products

**Prevention:**
- Deploy ALL major projects to free-tier hosting (Vercel, Netlify)
- Monitor uptime (free UptimeRobot)
- Choose hosting that doesn't expire (not Heroku free tier)
- For projects you can't deploy: Use high-quality demo video
- Test ALL demo links quarterly

**Hosting recommendations for Next.js:**
- Vercel (best Next.js support, free tier)
- Netlify (good alternative)
- Cloudflare Pages (fast, free)

**Detection:** Clicking project links leads to 404 or error pages.

**Phase mapping:**
- Phase 4 (Projects): Deploy each project as built
- Phase 5 (Polish): Verify all links working
- Post-launch: Quarterly link check

---

### Pitfall 15: Form Validation and Error Handling Issues
**What goes wrong:** Contact forms without validation, poor error messages, no loading states, unclear success feedback, or forms that silently fail.

**Why it happens:** Contact form treated as simple feature, not critical conversion point.

**Consequences:**
- Frustrated recruiters can't reach you
- Lost opportunities from form abandonment
- Unprofessional user experience
- Shows poor attention to UX details

**Prevention:**
Proper form implementation:

```typescript
// React Hook Form + Zod validation
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  message: z.string().min(10, 'Message must be at least 10 characters')
});

function ContactForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = async (data) => {
    try {
      await fetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      // Show success message
    } catch (error) {
      // Show error message with retry option
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <span className="text-red-500">{errors.email.message}</span>}

      <button disabled={isSubmitting}>
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}
```

**Must-have states:**
- Default state (empty form)
- Validation errors (inline, clear messages)
- Loading state (button disabled, spinner)
- Success state (clear confirmation, what happens next)
- Error state (network error, with retry option)

**Detection:**
- Submit empty form - are there helpful error messages?
- Submit valid form - is there clear success feedback?
- Slow network - is there loading indicator?

**Phase mapping:** Phase 3 (Core Features) - implement contact form with full validation.

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Content Strategy | PM-centric narratives | Rewrite all projects with technical focus; emphasize frontend implementation |
| Technical Setup | Missing i18n from start | Configure Next.js i18n routing and layout flexibility before building features |
| Technical Setup | No performance monitoring | Set up Lighthouse CI and Core Web Vitals tracking from Day 1 |
| Core Features | Animation overload | Establish animation budget (2-3 purposeful animations max) early |
| Projects Section | Tutorial projects | Audit and exclude or heavily customize; 5-year developer shouldn't need tutorial projects |
| Projects Section | Missing context | Create project documentation template before writing any project descriptions |
| Projects Section | Skill percentage bars | Explicitly ban from design system; show skills through project outcomes |
| Polish Phase | One-time accessibility audit | Integrate automated a11y testing into CI/CD, plan quarterly manual audits |
| Polish Phase | Broken demo links | Test all external links and live demos before launch; set up monitoring |
| Deployment | Missing SEO metadata | Complete metadata checklist per page, generate sitemap, verify OG tags |

## Korean Big Tech Specific Considerations

### Cultural and Technical Expectations

**Technical Excellence Emphasis:**
- Samsung, Naver, Kakao are highly competitive employers with rigorous technical standards
- Clean code, performance optimization, and architectural thinking highly valued
- They have experience with KAIST alumni and top engineering talent - portfolio must demonstrate senior-level capability

**Bilingual Communication:**
- Korean version must be equally polished (not machine-translated afterthought)
- Use formal honorifics (존댓말) in professional contexts
- Portfolio in Korean shows cultural fit and attention to detail
- Consider Korean version as primary (companies may review Korean first)

**Infrastructure Context:**
- Korean internet infrastructure is world-class (224 Mbps mobile, 233 Mbps fixed)
- Poor performance is especially noticeable in Korean market
- Companies expect technical optimization to match infrastructure quality

**Content Preferences:**
- Emphasis on team collaboration and harmony (inhwa) alongside technical skills
- Education and certifications carry weight (mention prestigious affiliations if any)
- Recent work more important than older projects (fast-moving tech culture)
- GitHub activity and open source contributions valued

**Professional Presentation:**
- Clean, minimalist design preferred over flashy/complex
- Substance over style - focus on actual technical achievements
- Professional photo often expected (unlike Western markets)
- Detailed technical documentation shows thoroughness

## Sources

### Portfolio Mistakes (General)
- [Five Common Mistakes Found on Frontend Portfolio Sites - Medium](https://medium.com/illumination/five-common-mistakes-found-on-frontend-portfolio-sites-687b74063f9d)
- [5 Mistakes Developers Make in Their Portfolio Websites - DevPortfolioTemplates](https://www.devportfoliotemplates.com/blog/5-mistakes-developers-make-in-their-portfolio-websites)
- [Developer portfolio do's & don'ts - Kieran Roberts](https://blog.kieranroberts.dev/developer-portfolio-dos-and-donts)
- [5 Most Common Developer Portfolio Mistakes - David Walsh](https://davidwalsh.name/5-most-common-developer-portfolio-mistakes)

### Design and UX Pitfalls
- [Website Design Trends Most Brands Are Still Getting Wrong in 2026 - Line and Dot Studio](https://lineanddotstudio.com/blog/website-design-trends-2026/)
- [Common Portfolio Mistakes and How to Avoid Them - Wix](https://www.wix.com/blog/common-portfolio-mistakes)
- [10 Website Design Mistakes You Need to Stop Making in 2026 - Grayscale360](https://grayscale360.my/blog/10-website-design-mistakes-you-need-to-stop-making-in-2026/)

### Performance and Technical SEO
- [SEO Mistakes and Common Errors to Avoid in 2026 - Content Whale](https://content-whale.com/blog/seo-mistakes-and-common-errors-to-avoid-in-2026/)
- [Technical SEO Mistakes to Avoid in 2026 - Whitehat SEO](https://whitehat-seo.co.uk/blog/technical-seo-mistakes-to-avoid)
- [30 SEO Mistakes to Avoid in 2026 - WP Rocket](https://wp-rocket.me/blog/seo-mistakes/)
- [7 SEO Mistakes That Kill Website Rankings in 2026 - Medium](https://webdesignerindia.medium.com/seo-mistakes-that-kill-rankings-2026-6f4fd03b2a6f)
- [5 Common Web Design Mistakes That Quietly Kill Your SEO Performance - OCNJ Daily](https://ocnjdaily.com/news/2026/jan/13/5-common-web-design-mistakes-that-quietly-kill-your-seo-performance/)

### Next.js Performance Optimization
- [7 Common Performance Mistakes in Next.js and How to Fix Them - Medium](https://medium.com/full-stack-forge/7-common-performance-mistakes-in-next-js-and-how-to-fix-them-edd355e2f9a9)
- [React & Next.js Best Practices in 2026 - FAB Web Studio](https://fabwebstudio.com/blog/react-nextjs-best-practices-2026-performance-scale)
- [Next.js Performance Optimisation in 9 Steps - Pagepro](https://pagepro.co/blog/nextjs-performance-optimization-in-9-steps/)
- [5 Lessons For Next.js Performance Optimization - Pagepro](https://pagepro.co/blog/5-lessons-for-next-js-performance-optimization-in-large-projects/)
- [10 Performance Mistakes in Next.js 16 - Medium](https://medium.com/@sureshdotariya/10-performance-mistakes-in-next-js-16-that-are-killing-your-app-and-how-to-fix-them-2facfab26bea)
- [Next.js Image Component: Performance and CWV - Pagepro](https://pagepro.co/blog/nextjs-image-component-performance-cwv/)
- [Next.js Production Checklist - Official Docs](https://nextjs.org/docs/app/guides/production-checklist)

### Korean Tech Market Hiring
- [Top 10 Tips for Building a Stand-Out Tech Portfolio in South Korea - Nucamp](https://www.nucamp.co/blog/coding-bootcamp-south-korea-kor-top-10-tips-for-building-a-standout-tech-portfolio-in-south-korea)
- [Preparing for Korea's 2026 Recruitment Season - Kowork](https://kowork.kr/en/blog/2026-Korea-recruitment-season-prep-en)
- [Korean Resume Guideline & Samples - Chapter Korean](https://chapterkorean.com/en/korean-resume-guideline-7-things/)
- [How to Write a Professional CV for South Korea Jobs - ResumeFlex](https://resumeflex.com/how-to-write-a-professional-cv-for-south-korea-job-market/)
- [Digital 2026: South Korea - DataReportal](https://datareportal.com/reports/digital-2026-south-korea)

### Accessibility (WCAG)
- [WCAG 2.1 & 2.2 Compliance Checklist 2026 - Mivi](https://mivibzzz.com/resources/accessibility/wcag-checklist)
- [A Detailed Guide to WCAG Compliance in 2026 - AccessibilityChecker](https://www.accessibilitychecker.org/guides/wcag/)
- [Avoiding Accessibility Mistakes in 2026 - The Drum](https://www.thedrum.com/industry-insight/avoiding-accessibility-mistakes-three-actions-that-will-help-you-win-in-2026)
- [WCAG 2.2 Accessibility Checklist 2026 - The Clay Media](https://theclaymedia.com/wcag-2-2-accessibility-checklist-2026/)

### Animation and Visual Design
- [Website Animations in 2026: Pros, Cons & Best Practices - Shadow Digital](https://www.shadowdigital.cc/resources/do-you-need-website-animations)
- [Mastering Web Animations: Common Mistakes and Best Practices - OpenReplay](https://blog.openreplay.com/mastering-web-animations/)
- [Web Interface Animation Mistakes to Avoid - Pixel Free Studio](https://blog.pixelfreestudio.com/web-interface-animation-mistakes-to-avoid/)
- [The Web Animation Performance Tier List - Motion Magazine](https://motion.dev/blog/web-animation-performance-tier-list)
- [Common Website Animations Mistakes - Strikingly](https://www.strikingly.com/blog/posts/common-website-animations-mistakes)

### Content and Project Documentation
- [Web Developer Portfolio Examples - Middlehost](https://middlehost.com/blog/web-developer-portfolio-examples/)
- [What to Include in Your 2026 Junior Dev Portfolio - Codeworks](https://codeworks.me/blog/junior-dev-portfolio-projects-coding-5-skills/)
- [28 Things to Put on Your Web Developer Portfolio - Learn to Code With Me](https://learntocodewith.me/posts/portfolio-tips/)

### Contact Forms and CTAs
- [Why Your Contact Page is the Most Important Part of Your Portfolio - Shopify](https://www.shopify.com/partners/blog/why-your-contact-page-is-the-most-important-part-of-your-portfolio-website)
- [15 Best Contact Form Design Examples of 2026 - Venture Harbour](https://ventureharbour.com/15-contact-form-examples-help-design-ultimate-contact-page/)
- [Using Call-to-Action Buttons to Guide People - FGWeb](https://www.foregroundweb.com/call-to-action-buttons/)

**Confidence Level:** MEDIUM - Findings based on multiple WebSearch sources from 2026, cross-referenced across 40+ articles and resources. Korean market specifics have LOWER confidence (fewer specific sources), general portfolio and technical pitfalls have HIGHER confidence (widespread agreement across sources).
