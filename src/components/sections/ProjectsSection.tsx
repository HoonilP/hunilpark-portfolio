import { getTranslations } from 'next-intl/server';
import ScrollReveal from '@/components/ScrollReveal';
import ProjectsClient from './ProjectsClient';

interface Project {
  id: string;
  translationKey: string;
  techStack: string[];
  featured: boolean;
}

const projects: Project[] = [
  {
    id: '6',
    translationKey: 'artWar',
    techStack: ['Next.js', 'NestJS', 'Solidity', 'OpenClaw', 'Monad', 'Supabase'],
    featured: false,
  },
  {
    id: '2',
    translationKey: 'dyCms',
    techStack: ['Next.js', 'NestJS', 'PostgreSQL', 'TypeScript'],
    featured: true,
  },
  {
    id: '1',
    translationKey: 'joshua',
    techStack: ['Electron', 'Angular', 'FastAPI', 'PostgreSQL', 'KoGPT-2', 'Stripe'],
    featured: true,
  },
  {
    id: '5',
    translationKey: 'dinoGo',
    techStack: ['Next.js', 'TypeScript', 'Three.js', 'Tailwind CSS', 'Move', 'Sui SDK'],
    featured: true,
  },
  {
    id: '4',
    translationKey: 'scholarlyChain',
    techStack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'shadcn/ui', 'Firebase'],
    featured: true,
  },
  {
    id: '3',
    translationKey: 'retailAnalysis',
    techStack: ['Pytorch', 'YOLO', 'VanillaJS'],
    featured: false,
  },
  {
    id: '7',
    translationKey: 'manufacturing',
    techStack: ['Python', 'YOLOv7', 'OAK-D', 'OpenCV', 'Firebase', 'Anomalib'],
    featured: false,
  },
  {
    id: '8',
    translationKey: 'fsiAi',
    techStack: ['Python', 'GPT-4', 'Twilio', 'aiohttp', 'WebSocket', 'asyncio'],
    featured: false,
  },
];

export default async function ProjectsSection() {
  const t = await getTranslations('Projects');

  const toCarouselProject = (p: Project) => ({
    id: p.id,
    title: t(`${p.translationKey}.title`),
    description: t(`${p.translationKey}.description`),
    period: t(`${p.translationKey}.period`),
    techStack: p.techStack,
    image: `/projects/${p.id}/hero.webp`,
  });

  const featured = projects.filter((p) => p.featured).map(toCarouselProject);
  const others = [...projects]
    .sort((a, b) => (a.featured === b.featured ? 0 : a.featured ? -1 : 1))
    .map(toCarouselProject);

  return (
    <section id="projects" className="mx-auto max-w-7xl px-6 py-12 md:px-12 lg:py-16">
      {/* Section Header — stitch style */}
      <div className="mb-16 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <ScrollReveal>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white md:text-4xl">
              {t('sectionTitle')}
            </h2>
            <p className="text-slate-500 dark:text-slate-400">{t('sectionSubtitle')}</p>
          </div>
        </ScrollReveal>
        <div className="hidden h-px flex-1 bg-slate-200 dark:bg-slate-800 md:mx-12 md:block" />
        <ScrollReveal delay={0.1}>
          <span className="text-sm font-medium uppercase tracking-widest text-slate-400 dark:text-slate-500">
            2022 — 2026
          </span>
        </ScrollReveal>
      </div>

      {/* Client-side Interactive Content */}
      <ProjectsClient
        featured={featured}
        others={others}
        viewDetailsLabel={t('viewDetails')}
        moreProjectsLabel={t('moreProjects')}
      />
    </section>
  );
}
