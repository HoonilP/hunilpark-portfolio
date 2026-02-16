'use client';

import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('Footer');

  return (
    <footer className="bg-neutral-900 dark:bg-neutral-950 border-t border-neutral-800">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm font-semibold tracking-[0.15em] uppercase text-neutral-400">
            HUNIL PARK
          </p>
          <p className="text-xs text-neutral-500">
            © 2026 {t('copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
}
