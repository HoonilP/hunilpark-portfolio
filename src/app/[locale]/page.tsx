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
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-bold text-neutral-900">{t('title')}</h1>
      <p className="text-xl text-neutral-600 mt-2">{t('subtitle')}</p>
      <p className="text-primary-500 mt-4">{t('description')}</p>
    </main>
  );
}
