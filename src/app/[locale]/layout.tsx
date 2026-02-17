import {NextIntlClientProvider} from 'next-intl';
import {getMessages, setRequestLocale} from 'next-intl/server';
import {routing} from '@/i18n/routing';
import type {Metadata} from 'next';
import ThemeProvider from '@/components/layout/ThemeProvider';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { HorizontalScrollProvider } from '@/components/HorizontalScrollContext';
import '../globals.css';

export const metadata: Metadata = {
  title: '박훈일 | Frontend Developer',
  description: '깔끔하고 정교한 웹 경험을 만드는 프론트엔드 개발자',
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;

  // Enable static rendering
  setRequestLocale(locale);

  // Get messages for this locale
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="font-sans bg-surface-light dark:bg-surface-dark text-neutral-900 dark:text-neutral-100 antialiased min-h-screen flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <HorizontalScrollProvider>
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </HorizontalScrollProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
