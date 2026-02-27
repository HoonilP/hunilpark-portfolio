'use client';

import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';

export default function ViewportGate() {
  const t = useTranslations('Lab2');

  return (
    <div className="fixed inset-0 bg-neutral-950 flex flex-col items-center justify-center gap-6 text-center px-6">
      <p className="text-white/60 text-lg">{t('viewportGate')}</p>
      <Link
        href="/"
        className="text-white/40 hover:text-white/80 text-sm transition-colors underline underline-offset-4"
      >
        {t('backToHome')}
      </Link>
    </div>
  );
}
