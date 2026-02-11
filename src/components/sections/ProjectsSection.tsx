import { getTranslations } from 'next-intl/server';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

interface Project {
  id: string;
  translationKey: string;
  techStack: string[];
}

export default async function ProjectsSection() {
  const t = await getTranslations('Projects');

  const projects: Project[] = [
    {
      id: 'joshua',
      translationKey: 'joshua',
      techStack: ['Electron', 'Angular', 'FastAPI', 'PostgreSQL', 'KoGPT-2', 'Stripe'],
    },
    {
      id: 'dyCms',
      translationKey: 'dyCms',
      techStack: ['Next.js', 'NestJS', 'PostgreSQL', 'TypeScript'],
    },
    {
      id: 'retailAnalysis',
      translationKey: 'retailAnalysis',
      techStack: ['Pytorch', 'YOLO', 'VanillaJS'],
    },
  ];

  return (
    <section id="projects" className="py-20">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-neutral-900 dark:text-neutral-100">
          {t('sectionTitle')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} hover>
              <h3 className="text-xl font-semibold mb-2 text-neutral-900 dark:text-neutral-100">
                {t(`${project.translationKey}.title`)}
              </h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-3">
                {t(`${project.translationKey}.period`)}
              </p>
              <p className="text-neutral-700 dark:text-neutral-300 mb-4 text-sm leading-relaxed">
                {t(`${project.translationKey}.description`)}
              </p>
              <div className="flex flex-wrap gap-2 mt-auto">
                {project.techStack.map((tech) => (
                  <Badge key={tech}>{tech}</Badge>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
