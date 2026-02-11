import { getTranslations } from 'next-intl/server';

export default async function AboutSection() {
  const t = await getTranslations('About');

  return (
    <section id="about" className="py-20">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-neutral-900 dark:text-neutral-100">
          {t('sectionTitle')}
        </h2>
        <div className="space-y-6">
          <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
            {t('paragraph1')}
          </p>
          <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
            {t('paragraph2')}
          </p>
        </div>
      </div>
    </section>
  );
}
