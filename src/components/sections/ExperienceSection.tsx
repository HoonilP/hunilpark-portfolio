import { getTranslations } from 'next-intl/server';
import ScrollReveal from '@/components/ScrollReveal';

interface ExperienceItem {
  translationKey: string;
  type: string;
}

const experiences: ExperienceItem[] = [
  { translationKey: 'dyAccounting', type: 'Full-stack' },
  { translationKey: 'paymentInApp', type: 'Project Management' },
];

export default async function ExperienceSection() {
  const t = await getTranslations('Experience');

  return (
    <section id="experience" className="mx-auto max-w-7xl px-6 py-12 md:px-12 lg:py-16">
      {/* Section Header — stitch style */}
      <div className="mb-16 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <ScrollReveal>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white md:text-4xl">
            {t('sectionTitle')}
          </h2>
        </ScrollReveal>
        <div className="hidden h-px flex-1 bg-slate-200 dark:bg-slate-800 md:mx-12 md:block" />
      </div>

      {/* Divider-based list */}
      <ScrollReveal delay={0.1}>
        <div className="divide-y divide-slate-200 dark:divide-slate-800">
          {experiences.map((exp) => (
            <div
              key={exp.translationKey}
              className="group flex items-center justify-between py-6 transition-colors"
            >
              <div className="space-y-1">
                <p className="text-lg font-bold text-slate-900 dark:text-white">
                  {t(`${exp.translationKey}.title`)}
                </p>
                <p className="text-slate-500">
                  {t(`${exp.translationKey}.company`)} &middot; {t(`${exp.translationKey}.date`)}
                </p>
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-blue-500">
                {exp.type}
              </span>
            </div>
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
}
