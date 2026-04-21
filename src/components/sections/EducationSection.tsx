import { getTranslations } from 'next-intl/server';
import ScrollReveal from '@/components/ScrollReveal';

export default async function EducationSection() {
  const t = await getTranslations('Education');

  const education = [
    { key: 'sangmyung' },
    { key: 'yangon' },
    { key: 'yangjeong' },
    { key: 'stjohn' },
  ];

  const certifications = [
    t('certifications.computerSkills'),
    t('certifications.accounting'),
    t('certifications.fsi'),
    t('certifications.toeic'),
    t('certifications.opic'),
  ];

  const activities = [
    t('activities.bay'),
    t('activities.aiCourse'),
  ];

  return (
    <section id="education" className="mx-auto max-w-7xl px-6 py-12 md:px-12 lg:py-16">
      {/* Section Header */}
      <div className="mb-16 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <ScrollReveal>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white md:text-4xl">
            {t('sectionTitle')}
          </h2>
        </ScrollReveal>
        <div className="hidden h-px flex-1 bg-slate-200 dark:bg-slate-800 md:mx-12 md:block" />
      </div>

      <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
        {/* Left — Education + Activities */}
        <div className="space-y-10">
          <ScrollReveal delay={0.1}>
            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {education.map((edu) => (
                <div key={edu.key} className="py-5 first:pt-0">
                  <p className="text-xs font-medium uppercase tracking-widest text-slate-500">
                    {t(`${edu.key}.date`)}
                  </p>
                  <h3 className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                    {t(`${edu.key}.title`)}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                    {t(`${edu.key}.description`)}
                  </p>
                </div>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-slate-500">
              {t('activitiesTitle')}
            </h3>
            <div className="space-y-3">
              {activities.map((activity, i) => (
                <div
                  key={i}
                  className="border-l-2 border-blue-500 py-1.5 pl-4"
                >
                  <p className="text-sm text-slate-700 dark:text-slate-300">{activity}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>

        {/* Right — Certifications */}
        <ScrollReveal delay={0.15}>
          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-slate-500">
              {t('certificationsTitle')}
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {certifications.map((cert, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-4 transition-all hover:-translate-y-0.5 hover:border-slate-300 dark:hover:border-slate-700"
                >
                  <p className="text-sm text-slate-700 dark:text-slate-300">{cert}</p>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
