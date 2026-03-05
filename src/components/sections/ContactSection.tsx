import { getTranslations } from 'next-intl/server';
import { Github, ExternalLink, Mail } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';

export default async function ContactSection() {
  const t = await getTranslations('Contact');

  return (
    <footer className="mx-auto max-w-7xl px-6 py-12 md:px-12" id="contact">
      <ScrollReveal>
        <div className="border-t border-slate-200 dark:border-slate-800 pt-16 pb-8">
          {/* Thank you */}
          <h2 className="text-5xl font-black tracking-tight text-slate-900 dark:text-white md:text-7xl">
            {t('thanks')}
          </h2>

          {/* Links row */}
          <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <a
              href="mailto:phoonil0927@gmail.com"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 transition-colors hover:text-slate-900 dark:hover:text-white"
            >
              <Mail className="h-4 w-4" />
              phoonil0927@gmail.com
            </a>

            <div className="flex gap-6">
              <a
                href="https://github.com/HoonilP"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 transition-colors hover:text-slate-900 dark:hover:text-white"
              >
                <Github className="h-4 w-4" />
                GitHub
              </a>
              <a
                href="https://velog.io/@hoonilpark"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 transition-colors hover:text-slate-900 dark:hover:text-white"
              >
                <ExternalLink className="h-4 w-4" />
                Velog
              </a>
            </div>
          </div>

          {/* Copyright */}
          <p className="mt-16 text-xs text-slate-400 dark:text-slate-600">
            &copy; 2026 Hunil Park
          </p>
        </div>
      </ScrollReveal>
    </footer>
  );
}
