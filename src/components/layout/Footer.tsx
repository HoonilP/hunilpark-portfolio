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
    <footer className="border-t border-neutral-200/50 dark:border-neutral-800/50">
      <div className="max-w-6xl mx-auto px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Name */}
          <p className="text-sm font-semibold tracking-[0.15em] uppercase text-neutral-900 dark:text-neutral-100 md:text-left text-center">
            HUNIL PARK
          </p>

          {/* Links */}
          <div className="flex gap-6 justify-center">
            {contactLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                {...(link.external && {
                  target: '_blank',
                  rel: 'noopener noreferrer',
                })}
                className="text-xs uppercase tracking-[0.08em] text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-xs text-neutral-400 dark:text-neutral-500 md:text-right text-center">
            © 2026 {t('copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
}
