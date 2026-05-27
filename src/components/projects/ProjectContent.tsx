import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import ChallengeSection from './ChallengeSection';

interface ProjectContentProps {
  translationKey: string;
  projectId: string;
}

const CHALLENGE_KEYS = ['challenge1', 'challenge2', 'challenge3'];

const PROJECT_GALLERY: Record<string, string[]> = {
  '1': [
    '/projects/1/screenshot1.png',
    '/projects/1/screenshot2.png',
    '/projects/1/screenshot3.png',
    '/projects/1/screenshot4.png',
    '/projects/1/screenshot5.png',
    '/projects/1/screenshot6.png',
    '/projects/1/screenshot7.png',
    '/projects/1/team.jpg',
  ],
  '2': [
    '/projects/2/screenshot1.png',
    '/projects/2/screenshot2.png',
  ],
  '3': [
    '/projects/3/parkson.png',
    '/projects/3/parkson1.png',
    '/projects/3/parkson2.png',
    '/projects/3/parkson3.png',
    '/projects/3/parkson4.png',
  ],
  '4': [
    '/projects/4/screenshot1.png',
    '/projects/4/screenshot2.png',
  ],
  '5': [
    '/projects/5/icon.png',
  ],
  '6': [],
  '7': [
    '/projects/7/hero.png',
  ],
  '8': [
    '/projects/8/screenshot1.png',
    '/projects/8/team.jpg',
  ],
};

export default async function ProjectContent({ translationKey, projectId }: ProjectContentProps) {
  const t = await getTranslations('ProjectDetail');

  const sectionLabel = (key: string, fallback: string) =>
    t.has(`sectionLabels.${key}`) ? t(`sectionLabels.${key}`) : fallback;

  // Parse highlights array from translation
  const getList = (key: string): string[] => {
    const items: string[] = [];
    let i = 0;
    while (t.has(`${translationKey}.${key}.${i}`)) {
      items.push(t(`${translationKey}.${key}.${i}`));
      i++;
    }
    return items;
  };

  const highlights = getList('overview.highlights');
  const achievements = getList('achievements');

  return (
    <main className="space-y-12">
      {/* Overview Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          {sectionLabel('overview', 'Project Overview')}
        </h2>
        {t.has(`${translationKey}.overview.summary`) && (
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            {t(`${translationKey}.overview.summary`)}
          </p>
        )}
        {highlights.length > 0 && (
          <ul className="space-y-2">
            {highlights.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Hero/Architecture Image */}
      <div className="w-full aspect-video relative overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800">
        <Image
          src={`/projects/${projectId}/hero.webp`}
          alt={`${t(`${translationKey}.title`)} architecture`}
          fill
          sizes="(max-width: 768px) 100vw, 1024px"
          quality={75}
          className="object-contain"
          loading="lazy"
        />
      </div>

      {/* Technical Challenges Section */}
      <section className="space-y-10">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          {sectionLabel('challenges', 'Technical Challenges')}
        </h2>
        {CHALLENGE_KEYS.map((key) => {
          if (!t.has(`${translationKey}.challenges.${key}.title`)) return null;
          return (
            <ChallengeSection
              key={key}
              translationKey={translationKey}
              challengeKey={key}
              t={t}
            />
          );
        })}
      </section>

      {/* Achievements Section */}
      {achievements.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {sectionLabel('achievements', 'Key Achievements')}
          </h2>
          <ul className="space-y-2">
            {achievements.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Image Gallery Section */}
      {(PROJECT_GALLERY[projectId]?.length ?? 0) > 0 && (
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {sectionLabel('gallery', 'Project Images')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PROJECT_GALLERY[projectId].map((src, i) => (
              <div
                key={i}
                className="relative aspect-video overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800"
              >
                <Image
                  src={src}
                  alt={`${t(`${translationKey}.title`)} screenshot ${i + 1}`}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  quality={75}
                  className="object-contain bg-slate-50 dark:bg-slate-900"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </section>
      )}

    </main>
  );
}
