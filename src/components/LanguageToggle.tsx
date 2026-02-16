'use client';

import {useRouter, usePathname} from '@/i18n/navigation';
import {useLocale, useTranslations} from 'next-intl';

export default function LanguageToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('Common');

  const targetLocale = locale === 'ko' ? 'en' : 'ko';
  const displayText = locale === 'ko' ? 'EN' : 'KO';

  const handleToggle = () => {
    router.replace(pathname, {locale: targetLocale});
  };

  return (
    <button
      onClick={handleToggle}
      aria-label={t('languageLabel')}
      className="text-xs font-medium tracking-[0.08em] uppercase text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors px-2 py-1.5"
    >
      {displayText}
    </button>
  );
}
