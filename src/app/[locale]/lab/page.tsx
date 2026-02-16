'use client';

import dynamic from 'next/dynamic';
import {useState} from 'react';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {ArrowLeft} from 'lucide-react';
import LoadingScreen from '@/components/lab/ui/LoadingScreen';
import ContentPanel from '@/components/lab/ContentPanel';

const LabScene = dynamic(() => import('@/components/lab/LabScene'), {
  ssr: false,
  loading: () => <LoadingScreen />,
});

export default function LabPage() {
  const t = useTranslations('Lab');
  const [activeSection, setActiveSection] = useState<string | null>(null);

  return (
    <div className="fixed inset-0 z-[60] overflow-hidden bg-neutral-950">
      {/* Back to Home */}
      <Link
        href="/"
        className="fixed top-6 left-6 z-[80] flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white/80 hover:text-white hover:bg-white/20 transition-all text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        {t('backToHome')}
      </Link>

      {/* Instruction hint */}
      {!activeSection && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[80] text-white/40 text-xs tracking-widest uppercase animate-pulse">
          {t('scrollHint')}
        </div>
      )}

      {/* 3D Scene */}
      <LabScene
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        debug={false}
      />

      {/* Content Panel — slides in from right on hotspot click */}
      <ContentPanel
        activeSection={activeSection}
        onClose={() => setActiveSection(null)}
      />
    </div>
  );
}
