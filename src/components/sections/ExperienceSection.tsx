import { getTranslations } from 'next-intl/server';
import Timeline from '@/components/ui/Timeline';
import SectionWrapper from '@/components/ui/SectionWrapper';
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
    <SectionWrapper id="experience" label="Experience" heading={t('sectionTitle')}>
      <Timeline items={experiences} />
    </SectionWrapper>
  );
}
