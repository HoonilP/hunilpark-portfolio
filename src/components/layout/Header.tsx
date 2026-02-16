'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { FlaskConical } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import LanguageToggle from '@/components/LanguageToggle';
import ThemeToggle from '@/components/layout/ThemeToggle';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = useTranslations('Navigation');

  const navLinks = [
    { href: '#about', label: t('about') },
    { href: '#skills', label: t('skills') },
    { href: '#projects', label: t('projects') },
    { href: '#experience', label: t('experience') },
    { href: '#education', label: t('education') },
    { href: '#contact', label: t('contact') },
  ];

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/60 dark:bg-neutral-950/60 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <a
          href="/"
          className="text-sm font-semibold tracking-[0.15em] uppercase text-neutral-900 dark:text-neutral-100 hover:text-neutral-500 dark:hover:text-neutral-400 transition-colors"
        >
          HUNIL PARK
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative text-xs uppercase tracking-[0.08em] text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-px after:bg-current after:transition-all hover:after:w-full"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/lab"
            className="rounded-lg p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
            title={t('lab')}
          >
            <FlaskConical className="w-4 h-4" />
          </Link>
          <LanguageToggle />

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden rounded-lg p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <nav className="md:hidden bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md px-6 py-6">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={handleLinkClick}
                className="block py-3 text-xs uppercase tracking-[0.08em] text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors border-b border-neutral-100 dark:border-neutral-800/50 last:border-0"
              >
                {link.label}
              </a>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
