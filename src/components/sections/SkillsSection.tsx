import { getTranslations } from 'next-intl/server';
import Badge from '@/components/ui/Badge';

interface SkillCategory {
  id: string;
  name: string;
  skills: string[];
  projects: string[];
}

export default async function SkillsSection() {
  const t = await getTranslations('Skills');

  const categories: SkillCategory[] = [
    {
      id: 'frontend',
      name: t('frontend'),
      skills: ['TypeScript', 'React', 'Next.js', 'Angular', 'VanillaJS'],
      projects: ['DY CMS', 'Joshua', 'Retail Analysis'],
    },
    {
      id: 'backend',
      name: t('backend'),
      skills: ['NestJS', 'FastAPI', 'Python'],
      projects: ['DY CMS', 'Joshua'],
    },
    {
      id: 'devops',
      name: t('devops'),
      skills: ['AWS', 'Docker', 'Kubernetes'],
      projects: ['DY CMS'],
    },
    {
      id: 'database',
      name: t('database'),
      skills: ['MySQL', 'PostgreSQL'],
      projects: ['DY CMS', 'Joshua'],
    },
  ];

  return (
    <section id="skills" className="py-20">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-neutral-900 dark:text-neutral-100">
          {t('sectionTitle')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((category) => (
            <div key={category.id}>
              <h3 className="text-lg font-semibold mb-1 text-neutral-800 dark:text-neutral-200">
                {category.name}
              </h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-3">
                {category.projects.join(', ')}
              </p>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <Badge key={skill}>{skill}</Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
