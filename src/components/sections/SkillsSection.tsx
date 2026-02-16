import { getTranslations } from 'next-intl/server';
import Badge from '@/components/ui/Badge';
import SectionWrapper from '@/components/ui/SectionWrapper';

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
    <SectionWrapper id="skills" label="Skills" heading={t('sectionTitle')}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
        {categories.map((category, index) => (
          <div
            key={category.id}
            className="border-t-2 border-neutral-200 dark:border-neutral-800 pt-6 transition-colors hover:border-primary-500 dark:hover:border-primary-400"
          >
            <span className="label-museum text-neutral-400 dark:text-neutral-500">
              {String(index + 1).padStart(2, '0')}
            </span>
            <h3 className="text-xl font-semibold mt-2 mb-1 text-neutral-900 dark:text-neutral-100">
              {category.name}
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
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
    </SectionWrapper>
  );
}
