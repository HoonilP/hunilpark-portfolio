import {getTranslations, setRequestLocale} from 'next-intl/server';

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
    <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
        {t('title')}
      </h1>
      <p className="mt-2 text-lg sm:text-xl lg:text-2xl text-neutral-500 dark:text-neutral-400 font-light">
        {t('subtitle')}
      </p>
      <p className="mt-4 text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-md text-center">
        {t('description')}
      </p>
      <div className="mt-6 w-12 h-px bg-neutral-300 dark:bg-neutral-700"></div>
      <p className="mt-6 text-sm text-neutral-400 dark:text-neutral-500">{t('comingSoon')}</p>
    </div>
  );
}
