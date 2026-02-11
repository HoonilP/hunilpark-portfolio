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
      className="border border-neutral-300 rounded-md px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100 transition-colors"
    >
      {displayText}
    </button>
  );
}
