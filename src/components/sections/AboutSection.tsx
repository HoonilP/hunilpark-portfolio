import { getTranslations } from 'next-intl/server';
import SectionWrapper from '@/components/ui/SectionWrapper';

export default async function AboutSection() {
  const t = await getTranslations('About');

  return (
    <SectionWrapper id="about" label="About" heading={t('sectionTitle')}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
        <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-base">
          {t('paragraph1')}
        </p>
        <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-base">
          {t('paragraph2')}
        </p>
      </div>
    </SectionWrapper>
  );
}
