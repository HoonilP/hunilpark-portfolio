'use client';

import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PROJECT_ORDER = ['1', '2', '3'] as const;

const PROJECT_KEYS: Record<string, string> = {
  '1': 'joshua',
  '2': 'dyCms',
  '3': 'retailAnalysis',
};

interface ProjectNavigationProps {
  currentId: string;
}

export default function ProjectNavigation({ currentId }: ProjectNavigationProps) {
  const t = useTranslations('ProjectDetail');

  const currentIndex = PROJECT_ORDER.indexOf(currentId as typeof PROJECT_ORDER[number]);
  const prevId = currentIndex > 0 ? PROJECT_ORDER[currentIndex - 1] : null;
  const nextId = currentIndex < PROJECT_ORDER.length - 1 ? PROJECT_ORDER[currentIndex + 1] : null;

  return (
    <nav
      className="flex justify-between items-center py-8 mt-12 border-t border-neutral-200 dark:border-neutral-800"
      aria-label="Project navigation"
    >
      {prevId ? (
        <Link
          href={`/projects/${prevId}`}
          className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors group"
        >
          <ChevronLeft className="w-4 h-4" />
          <div className="text-left">
            <div className="text-xs text-neutral-500 dark:text-neutral-500">Previous</div>
            <div className="text-sm font-medium">{t(`${PROJECT_KEYS[prevId]}.title`)}</div>
          </div>
        </Link>
      ) : (
        <div />
      )}

      {nextId ? (
        <Link
          href={`/projects/${nextId}`}
          className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors group"
        >
          <div className="text-right">
            <div className="text-xs text-neutral-500 dark:text-neutral-500">Next</div>
            <div className="text-sm font-medium">{t(`${PROJECT_KEYS[nextId]}.title`)}</div>
          </div>
          <ChevronRight className="w-4 h-4" />
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}
