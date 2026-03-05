import { getTranslations } from 'next-intl/server';
import HeroClient from './HeroClient';

export default async function HeroSection() {
  const t = await getTranslations('Hero');

  return (
    <HeroClient
      titleLine1={t('titleLine1')}
      titleAccent={t('titleAccent')}
      subtitle={t('subtitle')}
      scrollText={t('scroll')}
    />
  );
}
