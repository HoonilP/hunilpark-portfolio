'use client';

import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbsProps {
  projectTitle: string;
}

export default function Breadcrumbs({ projectTitle }: BreadcrumbsProps) {
  const t = useTranslations('Navigation');

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
        <li>
          <Link
            href="/"
            className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
          >
            {t('home')}
          </Link>
        </li>
        <li>
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
        </li>
        <li>
          <Link
            href="/#projects"
            className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
          >
            {t('projects')}
          </Link>
        </li>
        <li>
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
        </li>
        <li
          className="text-neutral-900 dark:text-neutral-100 font-medium"
          aria-current="page"
        >
          {projectTitle}
        </li>
      </ol>
    </nav>
  );
}
