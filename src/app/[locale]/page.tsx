import {getTranslations, setRequestLocale} from 'next-intl/server';
import LanguageToggle from '@/components/LanguageToggle';

export default async function Home({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;

  // Enable static rendering
  setRequestLocale(locale);

  const t = await getTranslations('Home');

  return (
    <main className="min-h-screen flex flex-col">
      {/* Language toggle - top right */}
      <div className="flex justify-end p-4 sm:p-6 lg:p-8">
        <LanguageToggle />
      </div>

      {/* Center content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 tracking-tight">
          {t('title')}
        </h1>
        <p className="mt-2 text-lg sm:text-xl lg:text-2xl text-neutral-500 font-light">
          {t('subtitle')}
        </p>
        <p className="mt-4 text-base sm:text-lg text-neutral-600 max-w-md text-center">
          {t('description')}
        </p>
        <div className="mt-6 w-12 h-px bg-neutral-300"></div>
        <p className="mt-6 text-sm text-neutral-400">{t('comingSoon')}</p>
      </div>

      {/* Footer */}
      <footer className="p-4 sm:p-6 lg:p-8 text-center text-sm text-neutral-400">
        © 2026 {t('title')}
      </footer>
    </main>
  );
}
