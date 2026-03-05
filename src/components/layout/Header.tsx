'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import LanguageToggle from '@/components/LanguageToggle';
import ThemeToggle from '@/components/layout/ThemeToggle';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = useTranslations('Navigation');

  const navLinks = [
    { href: '#projects', label: t('projects') },
    { href: '#about', label: t('about') },
    { href: '#contact', label: t('contact') },
  ];

  return (
    <header className="fixed top-0 z-50 w-full border-b border-slate-200 dark:border-slate-200/10 bg-white/80 dark:bg-[#0f1923]/80 backdrop-blur-md transition-colors">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-12">
        {/* Logo */}
        <a href="/" className="flex items-center gap-3">
          <span className="text-2xl leading-none" role="img" aria-label="developer">👨‍💻</span>
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">Hunil Park</span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-10 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
            >
              {link.label}
            </a>
          ))}
          <LanguageToggle />
          <ThemeToggle />
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-slate-900 dark:text-white p-2"
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <nav className="md:hidden bg-white/95 dark:bg-[#0f1923]/95 backdrop-blur-md px-6 py-6 border-t border-slate-200 dark:border-slate-200/10">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="block py-3 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors border-b border-slate-100 dark:border-slate-800/50 last:border-0"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-4 flex items-center gap-4">
              <LanguageToggle />
              <ThemeToggle />
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
