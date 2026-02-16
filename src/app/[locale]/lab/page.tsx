'use client';

import dynamic from 'next/dynamic';
import {useRef, useState, useEffect, useCallback} from 'react';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {ArrowLeft} from 'lucide-react';
import LoadingScreen from '@/components/lab/ui/LoadingScreen';
import ContentPanel from '@/components/lab/ContentPanel';

const LabScene = dynamic(() => import('@/components/lab/LabScene'), {
  ssr: false,
  loading: () => <LoadingScreen />,
});

const SECTIONS = [null, 'about', 'projects', 'skills', 'contact'] as const;
const SECTION_LABELS = ['', 'About', 'Projects', 'Skills', 'Contact'];

function getActiveSection(p: number): string | null {
  if (p < 0.12) return null;
  if (p < 0.37) return 'about';
  if (p < 0.62) return 'projects';
  if (p < 0.87) return 'skills';
  return 'contact';
}

export default function LabPage() {
  const t = useTranslations('Lab');
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => {
      const max = el.scrollHeight - el.clientHeight;
      if (max > 0) setScrollProgress(el.scrollTop / max);
    };
    el.addEventListener('scroll', handleScroll, {passive: true});
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  const activeSection = getActiveSection(scrollProgress);

  const scrollToSection = useCallback((index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    // index 0=about(0.25), 1=projects(0.5), 2=skills(0.75), 3=contact(1.0)
    const target = ((index + 1) / (SECTIONS.length - 1)) * max;
    el.scrollTo({top: target, behavior: 'smooth'});
  }, []);

  return (
    <div
      ref={scrollRef}
      className="fixed inset-0 z-[60] overflow-y-auto overflow-x-hidden bg-neutral-950"
    >
      {/* 3D Canvas — sticks to viewport */}
      <div className="sticky top-0 h-screen w-full">
        <LabScene scrollProgress={scrollProgress} debug={false} />
      </div>

      {/* Scroll spacer */}
      <div className="h-[400vh]" />

      {/* ── Fixed UI ── */}
      <Link
        href="/"
        className="fixed top-6 left-6 z-[80] flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white/80 hover:text-white hover:bg-white/20 transition-all text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        {t('backToHome')}
      </Link>

      {/* Scroll hint */}
      {scrollProgress < 0.02 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[80] text-white/40 text-xs tracking-widest uppercase animate-pulse">
          {t('scrollHint')}
        </div>
      )}

      {/* Content Panel */}
      <ContentPanel activeSection={activeSection} />

      {/* Section navigation dots */}
      <nav className="fixed right-5 top-1/2 -translate-y-1/2 z-[80] flex flex-col gap-4">
        {SECTION_LABELS.slice(1).map((label, i) => (
          <button
            key={label}
            onClick={() => scrollToSection(i)}
            className="group flex items-center gap-2 justify-end"
          >
            <span
              className={`text-[10px] uppercase tracking-wider transition-opacity duration-300 ${
                activeSection === SECTIONS[i + 1]
                  ? 'opacity-100 text-white'
                  : 'opacity-0 group-hover:opacity-100 text-white/50'
              }`}
            >
              {label}
            </span>
            <div
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                activeSection === SECTIONS[i + 1]
                  ? 'bg-white scale-150'
                  : 'bg-white/30 group-hover:bg-white/60'
              }`}
            />
          </button>
        ))}
      </nav>
    </div>
  );
}
