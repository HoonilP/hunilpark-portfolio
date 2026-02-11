import { getTranslations } from 'next-intl/server';
import Timeline from '@/components/ui/Timeline';
import type { TimelineItem } from '@/components/ui/Timeline';

export default async function EducationSection() {
  const t = await getTranslations('Education');

  const education: TimelineItem[] = [
    {
      date: t('sangmyung.date'),
      title: t('sangmyung.title'),
      description: t('sangmyung.description'),
    },
    {
      date: t('yangon.date'),
      title: t('yangon.title'),
      description: t('yangon.description'),
    },
  ];

  return (
    <section id="education" className="py-20">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold md:text-4xl mb-8 text-neutral-900 dark:text-neutral-100">
          {t('sectionTitle')}
        </h2>

        {/* Education Timeline */}
        <Timeline items={education} />

        {/* Certifications & Awards */}
        <div className="mt-12">
          <h3 className="text-xl font-semibold mb-4 text-neutral-900 dark:text-neutral-100">
            {t('certificationsTitle')}
          </h3>
          <ul className="space-y-2 text-neutral-600 dark:text-neutral-400">
            <li>{t('certifications.computerSkills')}</li>
            <li>{t('certifications.accounting')}</li>
            <li>{t('certifications.fsi')}</li>
            <li>{t('certifications.toeic')}</li>
          </ul>
        </div>

        {/* Activities */}
        <div className="mt-12">
          <h3 className="text-xl font-semibold mb-4 text-neutral-900 dark:text-neutral-100">
            {t('activitiesTitle')}
          </h3>
          <ul className="space-y-2 text-neutral-600 dark:text-neutral-400">
            <li>{t('activities.bay')}</li>
            <li>{t('activities.aiCourse')}</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
