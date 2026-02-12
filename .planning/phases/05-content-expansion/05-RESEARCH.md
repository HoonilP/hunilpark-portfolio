# Phase 5: Content Expansion - Research

**Researched:** 2026-02-12
**Domain:** Next.js content management, image optimization, i18n data structures
**Confidence:** HIGH

## Summary

Phase 5 focuses on expanding portfolio content from 3 to 5 projects (Scholarly Chain, Dino Go) and replacing placeholder images with real assets from Notion export materials. This is primarily a content addition phase, not a technical refactoring phase. The core technical challenge is organizing and optimizing images for web delivery while maintaining the existing translation structure pattern established in Phase 4.

Key research findings show that Next.js 16's Image component has important API changes (priority → preload deprecation, qualities configuration requirement), the public folder structure requires creation, and next-intl's nested object pattern scales well for additional project metadata. Image optimization should prioritize quality settings per use case: thumbnails (60), general content (75), hero images (90).

**Primary recommendation:** Create /public/projects/{id}/ structure for organized image storage, add project IDs 4-5 to existing PROJECT_IDS array with metadata following established patterns, optimize images before adding to public folder (WebP format, appropriate dimensions), and extend translation files with new project keys matching Joshua/DY CMS/Retail Analysis structure.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| next/image | 16.1.6 | Image optimization | Built-in Next.js image optimization with automatic WebP/AVIF conversion, lazy loading, responsive sizing |
| next-intl | 4.8.2 | Internationalization | Already integrated, provides nested translation structure for complex project data |
| Next.js App Router | 16.1.6 | Static generation | generateStaticParams for pre-rendering all project pages at build time |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Sharp | (implicit) | Image processing | Automatically used by Next.js Image Optimization API for format conversion and resizing |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| next/image | Manual img tags | Lose automatic optimization, lazy loading, responsive sizing - not recommended |
| Nested JSON | Flat translation keys | Harder to maintain, more repetitive - current nested structure is better |
| /public folder | External CDN | Adds complexity for small portfolio, unnecessary for ~20-30 images |

**Installation:**
No new packages required - all dependencies already installed in package.json.

## Architecture Patterns

### Recommended Project Structure
```
portfolio/
├── public/                   # Create this directory
│   └── projects/            # Image organization by project
│       ├── 1/              # Joshua
│       │   ├── hero.webp
│       │   ├── thumbnail.webp
│       │   ├── architecture.webp
│       │   └── features/
│       ├── 2/              # DY CMS
│       ├── 3/              # Retail Analysis
│       ├── 4/              # Scholarly Chain
│       └── 5/              # Dino Go
├── messages/
│   ├── en.json             # Extend with new projects
│   └── ko.json             # Extend with new projects
└── src/
    ├── app/[locale]/projects/[id]/page.tsx  # Update PROJECT_IDS
    └── components/
        ├── projects/
        │   ├── ProjectHero.tsx        # Replace placeholder with Image
        │   └── ProjectContent.tsx     # Replace placeholder with Image
        └── sections/
            └── ProjectsSection.tsx    # Add projects 4-5, add thumbnails
```

### Pattern 1: Image Organization by Project ID
**What:** Store images in /public/projects/{id}/ subdirectories with standardized naming conventions
**When to use:** Portfolio with multiple projects, each having multiple images
**Example:**
```typescript
// Standardized image paths
const getProjectImagePath = (projectId: string, imageType: string) => {
  return `/projects/${projectId}/${imageType}.webp`;
};

// Usage
<Image
  src={getProjectImagePath('4', 'hero')}
  alt="Scholarly Chain hero image"
  width={1200}
  height={675}
/>
```

### Pattern 2: Translation Structure for New Projects
**What:** Follow established nested object pattern from existing projects
**When to use:** Adding new project metadata to i18n files
**Example:**
```json
{
  "Projects": {
    "scholarlyChain": {
      "title": "Scholarly Chain",
      "description": "Blockchain-based student fee transparency system",
      "period": "Mar 2025 - Jun 2025"
    }
  },
  "ProjectDetail": {
    "scholarlyChain": {
      "title": "Scholarly Chain",
      "subtitle": "Hyperledger Fabric Blockchain-based Student Fee Management",
      "role": "Frontend Development (100%)",
      "teamSize": "4 members",
      "duration": "Mar 2025 - Jun 2025",
      "overview": {
        "title": "Project Overview",
        "background": "...",
        "contribution": "..."
      }
    }
  }
}
```

### Pattern 3: Image Component with Next.js 16 API
**What:** Use preload instead of deprecated priority prop, specify quality from allowed list
**When to use:** All image rendering in components
**Example:**
```tsx
import Image from 'next/image';

// Hero image (above fold, high quality)
<Image
  src="/projects/4/hero.webp"
  alt="Scholarly Chain architecture"
  width={1200}
  height={675}
  quality={90}
  preload={true}
  sizes="(max-width: 768px) 100vw, 1200px"
/>

// Thumbnail (lower quality acceptable)
<Image
  src="/projects/4/thumbnail.webp"
  alt="Scholarly Chain"
  width={300}
  height={200}
  quality={60}
  loading="lazy"
  sizes="(max-width: 768px) 100vw, 300px"
/>
```

### Anti-Patterns to Avoid
- **Mixing static imports and string paths:** Stick to string paths for dynamic project content - easier to map from translation keys
- **Hardcoded image dimensions in JSX:** Calculate aspect ratios from actual image dimensions, use responsive sizing
- **Placing images outside /public:** Next.js Image Optimization API only works with /public or remote URLs
- **Using deprecated priority prop:** Next.js 16 deprecated this in favor of preload for clarity

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Image optimization | Custom resize/convert scripts | next/image + Sharp (built-in) | Automatic format negotiation (WebP/AVIF), responsive srcset generation, lazy loading |
| Responsive images | Manual srcset/sizes | next/image sizes prop | Handles device pixel ratio, breakpoints, browser compatibility automatically |
| Translation key validation | Runtime checks | TypeScript + next-intl type safety | Compile-time detection of missing keys, autocomplete in IDE |
| Image lazy loading | Intersection Observer | next/image loading="lazy" | Browser-native lazy loading with automatic fallback |

**Key insight:** Next.js Image component solves 90% of image optimization complexity. The remaining work is content organization (folder structure, naming conventions) and configuration (quality settings, sizes). Don't build custom image processing pipelines.

## Common Pitfalls

### Pitfall 1: Missing /public Directory
**What goes wrong:** Next.js project scaffolded without /public folder, images return 404
**Why it happens:** Next.js doesn't create /public by default in some configurations
**How to avoid:** Create /public directory manually if it doesn't exist, verify with `ls public` before adding images
**Warning signs:** 404 errors for image paths like /projects/4/hero.webp in browser DevTools Network tab

### Pitfall 2: Oversized Source Images
**What goes wrong:** Adding 4000x3000px source images from Notion export directly to /public, causing slow builds and large cache
**Why it happens:** Notion exports full-resolution images; developers don't resize before committing
**How to avoid:** Pre-process images to appropriate dimensions (hero: 1920x1080 max, thumbnails: 600x400 max) before adding to /public
**Warning signs:** .next/cache/images directory growing beyond 100MB, slow build times

### Pitfall 3: Incorrect Aspect Ratios
**What goes wrong:** Specifying width={1200} height={800} for an image that's actually 1920x1080, causing distortion
**Why it happens:** Copy-pasting dimensions without checking actual image files
**How to avoid:** Run `file path/to/image.webp` or inspect with image viewer, match width/height to intrinsic dimensions or use fill prop with object-fit
**Warning signs:** Stretched or squashed images, layout shift warnings in Lighthouse

### Pitfall 4: Missing sizes Attribute with fill
**What goes wrong:** Using fill prop without sizes, browser downloads unnecessarily large images
**Why it happens:** Documentation examples sometimes omit sizes for brevity
**How to avoid:** Always specify sizes when using fill, e.g., `sizes="(max-width: 768px) 100vw, 1200px"`
**Warning signs:** Large image downloads visible in Network tab despite small viewport

### Pitfall 5: Translation Key Mismatches
**What goes wrong:** Adding "scholarlyChain" key in en.json but "scholarly_chain" in component code
**Why it happens:** Inconsistent naming conventions between translation files and component imports
**How to avoid:** Use camelCase consistently, establish naming convention: project folder name → translation key → component usage
**Warning signs:** Translation missing errors in browser console, [ProjectDetail.scholarlyChain.title] displayed instead of actual text

### Pitfall 6: Forgetting qualities Configuration (Next.js 16)
**What goes wrong:** Using quality={85} in Image component but not adding 85 to qualities array in next.config.js, returns 400 Bad Request
**Why it happens:** Next.js 16 requires explicit quality allowlist for security
**How to avoid:** Configure next.config.js images.qualities before using custom quality values: `qualities: [60, 75, 90, 100]`
**Warning signs:** 400 errors for /_next/image URLs with quality parameter

## Code Examples

Verified patterns from official sources:

### Basic Image from Public Folder
```typescript
// Source: https://nextjs.org/docs/app/api-reference/components/image
import Image from 'next/image';

export default function ProjectHero() {
  return (
    <Image
      src="/projects/4/hero.webp"
      alt="Scholarly Chain architecture diagram"
      width={1200}
      height={675}
      quality={90}
      preload={true}
      sizes="(max-width: 768px) 100vw, 1200px"
      className="rounded-lg"
    />
  );
}
```

### Project Card with Thumbnail
```typescript
// Pattern for ProjectsSection.tsx thumbnails
import Image from 'next/image';

interface ProjectCardProps {
  id: string;
  thumbnailPath: string;
  alt: string;
}

export default function ProjectCard({ id, thumbnailPath, alt }: ProjectCardProps) {
  return (
    <div className="relative aspect-video overflow-hidden rounded-lg">
      <Image
        src={thumbnailPath}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        quality={60}
        loading="lazy"
        className="object-cover"
      />
    </div>
  );
}
```

### Extending Translation Files
```json
// messages/en.json - Add new projects following established pattern
{
  "Projects": {
    "scholarlyChain": {
      "title": "Scholarly Chain",
      "description": "Hyperledger Fabric blockchain-based student fee transparency management system",
      "period": "Mar 2025 - Jun 2025"
    },
    "dinoGo": {
      "title": "Dino Go",
      "description": "Sui blockchain location-based NFT collection game",
      "period": "Sep 19-21, 2025"
    }
  }
}
```

### Updating PROJECT_IDS Array
```typescript
// src/app/[locale]/projects/[id]/page.tsx
const PROJECT_IDS = ['1', '2', '3', '4', '5'] as const;

const PROJECT_META: Record<ProjectId, ProjectMeta> = {
  '4': {
    translationKey: 'scholarlyChain',
    techStack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'shadcn/ui', 'Firebase'],
    githubUrl: 'https://github.com/Capstone-scholarly-chain',
  },
  '5': {
    translationKey: 'dinoGo',
    techStack: ['Next.js', 'TypeScript', 'Three.js', 'Tailwind CSS', 'Move', 'Sui SDK'],
    githubUrl: 'https://github.com/Dino-Go',
    liveUrl: 'https://dinogo.vercel.app/',
  },
};
```

### next.config.js Image Configuration
```javascript
// next.config.js - Add if using custom quality values
module.exports = {
  images: {
    formats: ['image/webp'], // Default, can add 'image/avif' for better compression
    qualities: [60, 75, 90], // Allowlist for security (Next.js 16 requirement)
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840], // Default breakpoints
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // For smaller images with sizes prop
  },
};
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| priority prop | preload prop | Next.js 16.0 | Clearer API semantics, explicit preload behavior |
| Unrestricted quality | qualities allowlist | Next.js 16.0 | Security hardening against malicious image optimization requests |
| contentDispositionType: inline | contentDispositionType: attachment | Next.js 15.0 | Security improvement for SVG handling |
| Manual WebP conversion | Automatic format negotiation | Next.js 10.0 | Browsers automatically receive best supported format |

**Deprecated/outdated:**
- `priority` prop: Use `preload` instead (Next.js 16+)
- `onLoadingComplete` callback: Use `onLoad` instead (Next.js 14+)
- `domains` config: Use `remotePatterns` instead (Next.js 14+)

## Image Source Inventory

Based on project context and available materials in 자료/노션포트폴리오html/포트폴리오/프로젝트들:

### Joshua (Project 1)
**Available images:**
- `카피라이팅 에이전트 Joshua 개발/스크린샷_2026-01-05_오후_6.43.12.png` → hero candidate (app home screen)
- `카피라이팅 에이전트 Joshua 개발/스크린샷_2026-01-05_오후_6.56.51.png` → Stripe payment screen
- `카피라이팅 에이전트 Joshua 개발/image.png` → logo/banner
- `카피라이팅 에이전트 Joshua 개발/image 1.png`, `image 2.png`, `image 3.png` → architecture/diagrams
- `카피라이팅 에이전트 Joshua 개발/KakaoTalk_20230409_194137836.jpg` → service design diagram
**Recommended usage:** hero (app screenshot), architecture (diagram), thumbnail (logo cropped)

### DY CMS (Project 2)
**Available images:**
- `프로젝트들 (1)/DY Microfinance 고객 관리 시스템/스크린샷_2026-01-03_오후_4.07.09.png` → architecture diagram (Vercel/NestJS/Docker)
- `프로젝트들 (1)/DY Microfinance 고객 관리 시스템/image.png` → logo
**Recommended usage:** architecture (diagram), thumbnail (logo)

### Retail Analysis (Project 3)
**Available images:**
- `시각지능 기반 리테일 매장 고객 행동 분석 시스템/parkson.png` → Parkson store exterior
- `시각지능 기반 리테일 매장 고객 행동 분석 시스템/parkson1.png` → In/Out counter
- `시각지능 기반 리테일 매장 고객 행동 분석 시스템/parkson2.png`, `parkson3.png`, `parkson4.png` → heatmaps, tracking visualizations
**Recommended usage:** hero (parkson.png), features (parkson1-4 for 5 feature screenshots), thumbnail (store exterior cropped)

### Scholarly Chain (Project 4) - NEW
**Available images:**
- `프로젝트들 (2)/캡스톤 디자인 - Scholarly chain/image.png` → AWS EKS architecture diagram
- `프로젝트들 (2)/캡스톤 디자인 - Scholarly chain/image 1.png` → additional diagram
**Recommended usage:** architecture (AWS diagram), thumbnail (diagram cropped to icon size)
**Missing:** UI screenshots (use placeholder for now)

### Dino Go (Project 5) - NEW
**Available images:**
- `프로젝트들 (2)/Dino Go - 위치 기반 NFT 게임 on Sui Blockchain/icon.png` → pixel art mascot
**Recommended usage:** thumbnail (pixel art icon), hero (placeholder until live site screenshot available)
**Missing:** UI screenshots (can screenshot from https://dinogo.vercel.app/)

## Image Processing Guidelines

### Recommended Dimensions
Based on responsive design best practices research:

| Use Case | Dimensions | Aspect Ratio | Format | Quality |
|----------|-----------|--------------|--------|---------|
| Hero images (ProjectHero) | 1920x1080 | 16:9 | WebP | 90 |
| Architecture diagrams | 1200x675 | 16:9 | WebP | 75 |
| Feature screenshots | 800x600 | 4:3 | WebP | 75 |
| Thumbnails (ProjectCard) | 600x400 | 3:2 | WebP | 60 |

### Pre-processing Workflow
Before adding images to /public:

1. **Resize:** Use ImageMagick, Squoosh, or similar tool
   ```bash
   # Example: Resize to hero dimensions
   magick source.png -resize 1920x1080 -quality 90 hero.webp

   # Example: Resize to thumbnail
   magick source.png -resize 600x400 -quality 60 thumbnail.webp
   ```

2. **Convert to WebP:** Modern browsers support WebP, 20-30% smaller than JPEG
   ```bash
   # If source is JPG/PNG
   cwebp -q 90 source.jpg -o hero.webp
   ```

3. **Verify dimensions:**
   ```bash
   file hero.webp
   # Should output: hero.webp: RIFF (little-endian) data, Web/P image, 1920 x 1080
   ```

4. **Optimize file size:** Target <200KB for hero images, <50KB for thumbnails
   ```bash
   ls -lh hero.webp
   # If too large, reduce quality or dimensions further
   ```

## Open Questions

Things that couldn't be fully resolved:

1. **Dino Go UI Screenshots**
   - What we know: Live site exists at https://dinogo.vercel.app/, pixel art icon available
   - What's unclear: Whether to screenshot live site or use placeholders for Phase 5
   - Recommendation: Use pixel art icon for thumbnail in Phase 5, screenshot live site for hero image if time permits, otherwise use placeholder (interactive demo can be Phase 6-7 enhancement)

2. **Scholarly Chain UI Screenshots**
   - What we know: AWS architecture diagram available, project was deployed to Vercel
   - What's unclear: Whether UI screenshots exist in other sources (resume PDF might contain them)
   - Recommendation: Use architecture diagram prominently, check resume PDF for additional screenshots, use placeholders if none available (focus is on architecture for this project)

3. **Image Optimization Trade-offs**
   - What we know: WebP provides good compression, Next.js can auto-convert
   - What's unclear: Whether to enable AVIF format (20% smaller but 50% slower to encode on first request)
   - Recommendation: Stick with WebP for Phase 5 (simpler, faster builds), consider AVIF in future optimization phase if performance metrics warrant it

4. **Translation Content Source**
   - What we know: Constraint says "only use resume/portfolio PDF data, no arbitrary content"
   - What's unclear: Whether existing Notion HTML export can be source for translation text
   - Recommendation: Extract project descriptions from resume PDF first, supplement with Notion HTML export if allowed (both are user-provided sources, not arbitrary content)

## Sources

### Primary (HIGH confidence)
- [Next.js Image Component API - v16.1.6](https://nextjs.org/docs/app/api-reference/components/image) - Complete Image component documentation
- [Next.js Public Folder Convention](https://nextjs.org/docs/pages/api-reference/file-conventions/public-folder) - Static asset serving rules
- [next-intl Translation Rendering](https://next-intl.dev/docs/usage/translations) - Nested object patterns for i18n

### Secondary (MEDIUM confidence)
- [Next.js Image Optimization Guide 2026](https://strapi.io/blog/nextjs-image-optimization-developers-guide) - Quality settings, thumbnail generation patterns
- [Website Image Size Guidelines 2026 - Shopify](https://www.shopify.com/blog/image-sizes) - Hero image dimensions (1280x720 standard)
- [Hero Section Design Best Practices 2026](https://www.perfectafternoon.com/2025/hero-section-design/) - Responsive image sizing, mobile considerations

### Tertiary (LOW confidence)
- WebSearch results for portfolio optimization patterns - General guidance, not project-specific

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All tools already integrated and documented
- Architecture: HIGH - Clear public folder structure, established translation pattern
- Image optimization: HIGH - Official Next.js docs, well-documented Image API
- Content sources: MEDIUM - Available images inventoried, some gaps for new projects

**Research date:** 2026-02-12
**Valid until:** ~30 days (Next.js/next-intl are stable, image optimization patterns mature)

**Key constraints recognized:**
- Content-only phase: No new interactive features, no design system changes
- Data source restriction: Only use resume/portfolio PDF + Notion export, no arbitrary content
- v2.0 scope deferral: Interactive elements (Phase 6-7), not Phase 5
- Image count: ~20-30 images total across 5 projects (manageable without CDN)
