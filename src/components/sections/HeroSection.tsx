import { getTranslations } from 'next-intl/server';
import { Mail, Github, ExternalLink } from 'lucide-react';

export default async function HeroSection() {
  const t = await getTranslations('Hero');

  return (
    <section
      id="hero"
      className="py-20 flex items-center justify-center min-h-[80vh]"
    >
      <div className="max-w-3xl mx-auto px-6 text-center md:text-left">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 text-neutral-900 dark:text-neutral-100">
          {t('name')}
        </h1>
        <p className="text-xl md:text-2xl text-neutral-600 dark:text-neutral-400 mb-4">
          {t('title')}
        </p>
        <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8">
          {t('intro')}
        </p>

        <div className="flex gap-4 justify-center md:justify-start">
          <a
            href="mailto:phoonil0927@gmail.com"
            className="p-3 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors"
            aria-label="Email"
          >
            <Mail className="w-6 h-6" />
          </a>
          <a
            href="https://github.com/HoonilP"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors"
            aria-label="GitHub"
          >
            <Github className="w-6 h-6" />
          </a>
          <a
            href="https://velog.io/@hoonilpark"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors"
            aria-label="Velog"
          >
            <ExternalLink className="w-6 h-6" />
          </a>
        </div>
      </div>
    </section>
  );
}
