import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Mail, Github, ExternalLink } from 'lucide-react';

export default async function HeroSection() {
  const t = await getTranslations('Hero');

  return (
    <section
      id="hero"
      className="min-h-[90vh] flex flex-col lg:flex-row"
    >
      {/* Left: Profile Photo */}
      <div className="relative w-full lg:w-1/2 min-h-[50vh] lg:min-h-[90vh] bg-[#c0c0c0] dark:bg-neutral-800 flex items-end justify-center overflow-hidden">
        <Image
          src="/profile.webp"
          alt={t('name')}
          width={896}
          height={1152}
          priority
          className="w-auto h-[75%] lg:h-[85%] object-contain object-bottom"
        />
      </div>

      {/* Right: Text Content */}
      <div className="w-full lg:w-1/2 flex items-center px-8 lg:px-16 xl:px-20 py-16 lg:py-0">
        <div className="max-w-lg">
          <p className="label-museum text-neutral-500 dark:text-neutral-400 mb-6">
            Frontend Developer
          </p>

          <h1 className="heading-display text-neutral-900 dark:text-neutral-100 mb-6">
            {t('name')}
          </h1>

          <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed mb-10">
            {t('intro')}
          </p>

          <div className="flex gap-5">
            <a
              href="mailto:phoonil0927@gmail.com"
              className="p-3 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors"
              aria-label="Email"
            >
              <Mail className="w-5 h-5" />
            </a>
            <a
              href="https://github.com/HoonilP"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://velog.io/@hoonilpark"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors"
              aria-label="Velog"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
