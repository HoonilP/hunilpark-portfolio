import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import ScrollReveal from '@/components/ScrollReveal';

export default async function AboutSection() {
  const t = await getTranslations('About');

  return (
    <section id="about" className="bg-slate-50 dark:bg-slate-900/30">
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-12 lg:py-16">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          {/* Left — Profile + Heading + Description */}
          <div className="space-y-8">
            <ScrollReveal>
              <div className="mb-8 h-32 w-32 shrink-0 md:h-40 md:w-40">
                <Image
                  src="/profile.webp"
                  alt="Profile"
                  width={160}
                  height={160}
                  className="h-full w-full rounded-2xl object-cover shadow-xl shadow-blue-500/10 grayscale transition-all duration-500 hover:grayscale-0"
                />
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                {t('heading')}
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                {t('paragraph1')}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                {t('paragraph2')}
              </p>
            </ScrollReveal>
          </div>

          {/* Right — Languages + Certifications */}
          <div className="space-y-8 lg:pt-16">
            <ScrollReveal delay={0.15}>
              <div className="grid grid-cols-2 gap-8">
                {/* Languages */}
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">{t('statLanguages')}</h4>
                  <ul className="mt-2 space-y-1 text-sm text-slate-500">
                    <li>{t('langEnglish')}</li>
                    <li>{t('langFrench')}</li>
                    <li>{t('langMyanmar')}</li>
                  </ul>
                </div>

                {/* Certifications */}
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">{t('statCertifications')}</h4>
                  <ul className="mt-2 space-y-1 text-sm text-slate-500">
                    <li>TOEIC 970</li>
                    <li>OPIc IH</li>
                  </ul>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
