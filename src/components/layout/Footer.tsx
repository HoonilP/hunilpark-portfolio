'use client';

import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('Footer');

  const contactLinks = [
    {
      label: t('email'),
      href: 'mailto:phoonil0927@gmail.com',
      external: false,
    },
    {
      label: t('github'),
      href: 'https://github.com/HoonilP',
      external: true,
    },
    {
      label: t('velog'),
      href: 'https://velog.io/@hoonilpark',
      external: true,
    },
  ];

  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Contact links */}
        <div className="flex flex-wrap gap-4 sm:gap-6 justify-center">
          {contactLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              {...(link.external && {
                target: '_blank',
                rel: 'noopener noreferrer',
              })}
              className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Copyright */}
        <p className="mt-6 text-center text-xs text-neutral-400 dark:text-neutral-500">
          © 2026 {t('copyright')}
        </p>
      </div>
    </footer>
  );
}
