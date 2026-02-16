import { getTranslations } from 'next-intl/server';
import Timeline from '@/components/ui/Timeline';
import SectionWrapper from '@/components/ui/SectionWrapper';
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

  const certifications = [
    t('certifications.computerSkills'),
    t('certifications.accounting'),
    t('certifications.fsi'),
    t('certifications.toeic'),
  ];

  const activities = [
    t('activities.bay'),
    t('activities.aiCourse'),
  ];

  return (
    <SectionWrapper id="education" label="Education" heading={t('sectionTitle')}>
      {/* Education Timeline */}
      <Timeline items={education} />

      {/* Certifications & Awards */}
      <div className="mt-16">
        <h3 className="text-xl font-semibold mb-6 text-neutral-900 dark:text-neutral-100">
          {t('certificationsTitle')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {certifications.map((cert, index) => (
            <div
              key={index}
              className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 transition-all hover:shadow-sm hover:-translate-y-0.5"
            >
              <p className="text-neutral-700 dark:text-neutral-300 text-sm">
                {cert}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Activities */}
      <div className="mt-16">
        <h3 className="text-xl font-semibold mb-6 text-neutral-900 dark:text-neutral-100">
          {t('activitiesTitle')}
        </h3>
        <div className="space-y-3">
          {activities.map((activity, index) => (
            <div
              key={index}
              className="border-l-2 border-primary-500 pl-5 py-2"
            >
              <p className="text-neutral-700 dark:text-neutral-300 text-sm">
                {activity}
              </p>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
