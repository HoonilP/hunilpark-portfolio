import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Breadcrumbs from '@/components/projects/Breadcrumbs';
import ProjectHero from '@/components/projects/ProjectHero';
import ProjectSidebar from '@/components/projects/ProjectSidebar';
import ProjectContent from '@/components/projects/ProjectContent';
import ProjectNavigation from '@/components/projects/ProjectNavigation';

const PROJECT_IDS = ['1', '2', '3'] as const;
type ProjectId = typeof PROJECT_IDS[number];

function isValidProjectId(id: string): id is ProjectId {
  return PROJECT_IDS.includes(id as ProjectId);
}

interface ProjectMeta {
  translationKey: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
}

const PROJECT_META: Record<ProjectId, ProjectMeta> = {
  '1': {
    translationKey: 'joshua',
    techStack: ['Electron', 'Angular', 'FastAPI', 'PostgreSQL', 'KoGPT-2', 'Stripe'],
  },
  '2': {
    translationKey: 'dyCms',
    techStack: ['Next.js', 'NestJS', 'PostgreSQL', 'TypeScript'],
  },
  '3': {
    translationKey: 'retailAnalysis',
    techStack: ['Pytorch', 'YOLO', 'VanillaJS'],
  },
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    PROJECT_IDS.map((id) => ({
      locale,
      id,
    }))
  );
}

interface PageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { locale, id } = await params;

  setRequestLocale(locale);

  if (!isValidProjectId(id)) {
    notFound();
  }

  const t = await getTranslations('ProjectDetail');
  const meta = PROJECT_META[id];
  const { translationKey, techStack, githubUrl, liveUrl } = meta;

  return (
    <div className="animate-fade-in">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <Breadcrumbs projectTitle={t(`${translationKey}.title`)} />

        <ProjectHero
          title={t(`${translationKey}.title`)}
          subtitle={t(`${translationKey}.subtitle`)}
          techStack={techStack}
        />

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 mt-12">
          <ProjectSidebar
            meta={{
              translationKey,
              techStack,
              githubUrl,
              liveUrl,
            }}
          />
          <ProjectContent translationKey={translationKey} />
        </div>

        <ProjectNavigation currentId={id} />
      </div>
    </div>
  );
}
