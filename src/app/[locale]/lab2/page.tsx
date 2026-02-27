'use client';

import dynamic from 'next/dynamic';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {ArrowLeft} from 'lucide-react';
import ViewportGate from '@/components/lab2/ui/ViewportGate';
import {useViewportWidth} from '@/components/lab2/hooks/useViewportWidth';

const Lab2Scene = dynamic(() => import('@/components/lab2/Lab2Scene'), {
  ssr: false,
});

export default function Lab2Page() {
  const t = useTranslations('Lab2');
  const width = useViewportWidth();

  // null = server/not yet hydrated — render nothing to avoid hydration mismatch
  if (width === null) return null;

  // Small viewport gate
  if (width < 1024) {
    return <ViewportGate />;
  }

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-neutral-950">
        <Lab2Scene />
      </div>
      <Link
        href="/"
        className="fixed top-6 left-6 z-[80] flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white/80 hover:text-white hover:bg-white/20 transition-all text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        {t('backToHome')}
      </Link>
    </>
  );
}
