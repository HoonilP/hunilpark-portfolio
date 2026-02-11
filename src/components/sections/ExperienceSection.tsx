import { getTranslations } from 'next-intl/server';
import Timeline from '@/components/ui/Timeline';
import type { TimelineItem } from '@/components/ui/Timeline';

export default async function ExperienceSection() {
  const t = await getTranslations('Experience');

  const experiences: TimelineItem[] = [
    {
      date: t('dyCms.date'),
      title: t('dyCms.title'),
      description: t('dyCms.description'),
    },
    {
      date: t('paymentInApp.date'),
      title: t('paymentInApp.title'),
      description: t('paymentInApp.description'),
    },
    {
      date: t('dyAccounting.date'),
      title: t('dyAccounting.title'),
      description: t('dyAccounting.description'),
    },
  ];

  return (
    <section id="experience" className="py-20">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold md:text-4xl mb-8 text-neutral-900 dark:text-neutral-100">
          {t('sectionTitle')}
        </h2>
        <Timeline items={experiences} />
      </div>
    </section>
  );
}
